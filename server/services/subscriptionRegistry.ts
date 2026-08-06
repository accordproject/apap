/**
 * Subscription registry for MCP resource-change notifications.
 *
 * Holds `sessionId -> Map<resourceUri, Subscriber>` and the inverse
 * `resourceUri -> Set<Subscriber>` so both `notify(uri)` and
 * `clearSession(sessionId)` are O(subscribers), not O(total).
 *
 * The registry is transport-agnostic. It holds `send` callbacks, not
 * transports. The MCP handler wires the SDK's session notification API
 * into the callback at subscribe time, so switching transport (SSE vs
 * Streamable HTTP) or wire format (2025-11-25 vs 2026-07-28 RC) does not
 * require touching the registry.
 *
 * Fire-and-forget semantics: notify(uri) never throws to the caller. A
 * slow or broken subscriber is caught and swallowed, not surfaced to the
 * DB write path that triggered the notification. Handlers can wire their
 * own logging into the send callback if they need to observe failures.
 *
 * Ported from the apap-mcp-poc SEP-2575 preview implementation; the
 * 2026-07-28 RC formalises `subscriptions/listen` as a single long-lived
 * POST-response stream with opt-in types tagged by
 * `io.modelcontextprotocol/subscriptionId`. When the SDK grows a native
 * primitive for that method, the handler can swap to it without changing
 * this registry.
 */

/**
 * Payload the registry hands to a subscriber's send callback.
 * Shape matches MCP `notifications/resources/updated` per SEP-2575, with
 * the subscriptionId tagged under the `io.modelcontextprotocol` namespace
 * so clients can correlate the notification back to their subscribe
 * request.
 */
export interface NotificationPayload {
    method: 'notifications/resources/updated';
    params: {
        uri: string;
        /**
         * MCP 2026-07-28 RC tags subscription notifications with this key.
         * Field name uses the JS-friendly snake form; the wire serializer
         * maps it to `io.modelcontextprotocol/subscriptionId` on transmit.
         */
        io_modelcontextprotocol_subscriptionId: string;
    };
}

export type NotificationSender = (payload: NotificationPayload) => void;

type SessionId = string;
type ResourceUri = string;

interface Subscriber {
    sessionId: SessionId;
    subscriptionId: string;
    send: NotificationSender;
}

import { SubscriptionLimitError } from './errors';

/**
 * URI schemes the registry accepts for subscription. Anything else
 * surfaces as `SubscriptionInvalidUriError` at the handler boundary.
 * The URI check stays inline here; the cap-limit check imports
 * `SubscriptionLimitError` because errors.ts has no imports of its own,
 * so no cycle is possible.
 */
const VALID_URI_PREFIXES = ['apap://templates/', 'apap://agreements/'];

/**
 * Hard cap on distinct subscriptions per session. Bounds the `bySession`
 * and `byUri` indices so a single misbehaving client cannot exhaust
 * memory. 100 is generous for legitimate MCP client patterns (a UI
 * usually watches a handful of live resources at once) while keeping the
 * worst-case per-session footprint bounded.
 *
 * If a workload legitimately needs more, raise this constant rather than
 * per-caller overrides; the cap is intentionally global so the failure
 * mode is uniform across sessions.
 */
export const MAX_SUBSCRIPTIONS_PER_SESSION = 100;

export function isValidResourceUri(uri: string): boolean {
    return VALID_URI_PREFIXES.some((prefix) => uri.startsWith(prefix));
}

export class SubscriptionRegistry {
    private bySession: Map<SessionId, Map<ResourceUri, Subscriber>> = new Map();
    private byUri: Map<ResourceUri, Set<Subscriber>> = new Map();

    /**
     * Register a subscription. The caller (the MCP handler) picks the
     * `subscriptionId` and echoes it back to the client so the client can
     * correlate notifications.
     *
     * Idempotent: subscribing the same `(sessionId, uri)` twice replaces
     * the previous entry rather than creating duplicates.
     */
    subscribe(
        sessionId: SessionId,
        uri: ResourceUri,
        send: NotificationSender,
        subscriptionId: string,
    ): void {
        // Enforce the per-session cap BEFORE the unsubscribe-and-replace
        // step. Re-subscribing to an existing URI is a no-op for the cap
        // (net-zero change), so only new URIs count against the limit.
        const existing = this.bySession.get(sessionId);
        const currentCount = existing?.size ?? 0;
        const isNewUri = !existing?.has(uri);
        if (isNewUri && currentCount >= MAX_SUBSCRIPTIONS_PER_SESSION) {
            throw new SubscriptionLimitError(
                sessionId,
                currentCount,
                MAX_SUBSCRIPTIONS_PER_SESSION,
            );
        }

        // Remove any prior subscription on (sessionId, uri) to keep both
        // indices in sync.
        this.unsubscribe(sessionId, uri);

        const subscriber: Subscriber = { sessionId, subscriptionId, send };

        let sessionMap = this.bySession.get(sessionId);
        if (!sessionMap) {
            sessionMap = new Map();
            this.bySession.set(sessionId, sessionMap);
        }
        sessionMap.set(uri, subscriber);

        let uriSet = this.byUri.get(uri);
        if (!uriSet) {
            uriSet = new Set();
            this.byUri.set(uri, uriSet);
        }
        uriSet.add(subscriber);
    }

    /**
     * Remove a single `(sessionId, uri)` subscription. Safe to call when
     * the subscription does not exist.
     */
    unsubscribe(sessionId: SessionId, uri: ResourceUri): void {
        const sessionMap = this.bySession.get(sessionId);
        if (!sessionMap) return;
        const subscriber = sessionMap.get(uri);
        if (!subscriber) return;

        sessionMap.delete(uri);
        if (sessionMap.size === 0) this.bySession.delete(sessionId);

        const uriSet = this.byUri.get(uri);
        if (uriSet) {
            uriSet.delete(subscriber);
            if (uriSet.size === 0) this.byUri.delete(uri);
        }
    }

    /**
     * Remove every subscription for a given session. Called from the
     * transport's onclose hook so a disconnecting client cannot leak
     * entries.
     */
    clearSession(sessionId: SessionId): void {
        const sessionMap = this.bySession.get(sessionId);
        if (!sessionMap) return;

        for (const [uri, subscriber] of sessionMap.entries()) {
            const uriSet = this.byUri.get(uri);
            if (uriSet) {
                uriSet.delete(subscriber);
                if (uriSet.size === 0) this.byUri.delete(uri);
            }
        }
        this.bySession.delete(sessionId);
    }

    /**
     * Fire a resource-update notification to every subscriber of `uri`.
     * Fire-and-forget: send-callback errors are caught and swallowed so a
     * slow or crashed subscriber never fails the caller (typically a DB
     * write path).
     */
    notify(uri: ResourceUri): void {
        const uriSet = this.byUri.get(uri);
        if (!uriSet || uriSet.size === 0) return;

        for (const subscriber of uriSet) {
            const payload: NotificationPayload = {
                method: 'notifications/resources/updated',
                params: {
                    uri,
                    io_modelcontextprotocol_subscriptionId: subscriber.subscriptionId,
                },
            };
            try {
                subscriber.send(payload);
            } catch (err) {
                // Swallowed on purpose. A broken subscriber cannot cascade
                // back to the service layer that triggered notify(). The
                // handler can register its own error logging on the send
                // callback if needed.
            }
        }
    }

    /**
     * Test/debug accessor. Returns the count of active subscriptions for
     * a URI. Not intended for production hot paths.
     */
    subscriberCount(uri: ResourceUri): number {
        return this.byUri.get(uri)?.size ?? 0;
    }

    /**
     * Test/debug accessor. Returns the URIs a session is subscribed to.
     */
    sessionSubscriptions(sessionId: SessionId): ResourceUri[] {
        const sessionMap = this.bySession.get(sessionId);
        return sessionMap ? Array.from(sessionMap.keys()) : [];
    }
}

/**
 * Singleton the service layer notifies through and the handler subscribes
 * against. Kept as a module-level export so callers do not need to plumb
 * it through constructor arguments. If a future refactor prefers DI,
 * switching to it is a mechanical change (pass registry into each service
 * function like `db` already is).
 */
export const subscriptionRegistry = new SubscriptionRegistry();
