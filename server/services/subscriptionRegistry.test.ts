import {
    SubscriptionRegistry,
    isValidResourceUri,
    subscriptionRegistry,
    MAX_SUBSCRIPTIONS_PER_SESSION,
    NotificationPayload,
} from './subscriptionRegistry';
import { SubscriptionLimitError } from './errors';

describe('isValidResourceUri', () => {
    it('accepts apap://templates/ URIs', () => {
        expect(isValidResourceUri('apap://templates/42')).toBe(true);
    });

    it('accepts apap://agreements/ URIs', () => {
        expect(isValidResourceUri('apap://agreements/abc-123')).toBe(true);
    });

    it('rejects the collection roots (only per-resource URIs are subscribable)', () => {
        // The list-level URIs have no trailing slash + id and are not registered
        // as subscribable, so subscribing to them would leave notify() dead.
        expect(isValidResourceUri('apap://templates')).toBe(false);
        expect(isValidResourceUri('apap://agreements')).toBe(false);
    });

    it('rejects the schema resource', () => {
        expect(isValidResourceUri('apap://schema/protocol.cto')).toBe(false);
    });

    it('rejects arbitrary schemes', () => {
        expect(isValidResourceUri('http://example.com/foo')).toBe(false);
        expect(isValidResourceUri('file:///etc/passwd')).toBe(false);
        expect(isValidResourceUri('')).toBe(false);
    });
});

describe('SubscriptionRegistry', () => {
    let registry: SubscriptionRegistry;

    beforeEach(() => {
        registry = new SubscriptionRegistry();
    });

    it('starts with no subscribers for any URI or session', () => {
        expect(registry.subscriberCount('apap://templates/1')).toBe(0);
        expect(registry.sessionSubscriptions('sess-1')).toEqual([]);
    });

    it('subscribe records a subscriber and notify fires the callback with the SEP-2575 payload', () => {
        const received: NotificationPayload[] = [];
        registry.subscribe(
            'sess-1',
            'apap://templates/1',
            (p) => received.push(p),
            'sub-1',
        );

        registry.notify('apap://templates/1');

        expect(received).toHaveLength(1);
        expect(received[0]).toEqual({
            method: 'notifications/resources/updated',
            params: {
                uri: 'apap://templates/1',
                io_modelcontextprotocol_subscriptionId: 'sub-1',
            },
        });
    });

    it('notify to a URI with no subscribers is a no-op', () => {
        expect(() => registry.notify('apap://templates/999')).not.toThrow();
    });

    it('multiple sessions subscribed to the same URI all receive the notification', () => {
        const received: Array<{ session: string; payload: NotificationPayload }> = [];
        registry.subscribe('sess-a', 'apap://agreements/7', (p) => received.push({ session: 'a', payload: p }), 'sub-a');
        registry.subscribe('sess-b', 'apap://agreements/7', (p) => received.push({ session: 'b', payload: p }), 'sub-b');

        registry.notify('apap://agreements/7');

        expect(received).toHaveLength(2);
        expect(received.map((r) => r.session).sort()).toEqual(['a', 'b']);
        // Each subscriber gets its own subscriptionId echoed back.
        expect(received.find((r) => r.session === 'a')?.payload.params.io_modelcontextprotocol_subscriptionId).toBe('sub-a');
        expect(received.find((r) => r.session === 'b')?.payload.params.io_modelcontextprotocol_subscriptionId).toBe('sub-b');
    });

    it('resubscribing the same (session, uri) replaces the previous subscription (no duplicates)', () => {
        const received: string[] = [];
        registry.subscribe('sess-1', 'apap://templates/1', () => received.push('first'), 'sub-1');
        registry.subscribe('sess-1', 'apap://templates/1', () => received.push('second'), 'sub-2');

        registry.notify('apap://templates/1');

        expect(received).toEqual(['second']);
        expect(registry.subscriberCount('apap://templates/1')).toBe(1);
    });

    it('unsubscribe removes only the targeted (session, uri) and leaves others intact', () => {
        const received: string[] = [];
        registry.subscribe('sess-1', 'apap://templates/1', () => received.push('t1'), 'sub-1');
        registry.subscribe('sess-1', 'apap://templates/2', () => received.push('t2'), 'sub-2');
        registry.subscribe('sess-2', 'apap://templates/1', () => received.push('t1-other'), 'sub-3');

        registry.unsubscribe('sess-1', 'apap://templates/1');

        registry.notify('apap://templates/1');
        registry.notify('apap://templates/2');

        expect(received.sort()).toEqual(['t1-other', 't2']);
        expect(registry.subscriberCount('apap://templates/1')).toBe(1);
        expect(registry.subscriberCount('apap://templates/2')).toBe(1);
    });

    it('unsubscribe on a non-existent (session, uri) is a safe no-op', () => {
        expect(() => registry.unsubscribe('nobody', 'apap://templates/9999')).not.toThrow();
    });

    it('clearSession drops every subscription for that session across URIs', () => {
        const received: string[] = [];
        registry.subscribe('sess-1', 'apap://templates/1', () => received.push('t1'), 'sub-1');
        registry.subscribe('sess-1', 'apap://agreements/1', () => received.push('a1'), 'sub-2');
        registry.subscribe('sess-2', 'apap://templates/1', () => received.push('t1-other'), 'sub-3');

        registry.clearSession('sess-1');

        registry.notify('apap://templates/1');
        registry.notify('apap://agreements/1');

        expect(received).toEqual(['t1-other']);
        expect(registry.sessionSubscriptions('sess-1')).toEqual([]);
        expect(registry.sessionSubscriptions('sess-2')).toEqual(['apap://templates/1']);
    });

    it('clearSession on an unknown session is a safe no-op', () => {
        expect(() => registry.clearSession('ghost')).not.toThrow();
    });

    it('notify swallows send-callback errors so a broken subscriber cannot cascade to the caller', () => {
        const received: string[] = [];
        registry.subscribe('bad-session', 'apap://templates/1', () => {
            throw new Error('broken transport');
        }, 'sub-1');
        registry.subscribe('good-session', 'apap://templates/1', () => received.push('good'), 'sub-2');

        expect(() => registry.notify('apap://templates/1')).not.toThrow();
        // Good subscriber still gets its notification even though a peer threw.
        expect(received).toEqual(['good']);
    });

    it('sessionSubscriptions returns the URIs subscribed by a given session', () => {
        registry.subscribe('sess-1', 'apap://templates/1', () => {}, 'sub-1');
        registry.subscribe('sess-1', 'apap://agreements/2', () => {}, 'sub-2');

        expect(registry.sessionSubscriptions('sess-1').sort()).toEqual([
            'apap://agreements/2',
            'apap://templates/1',
        ]);
    });
});

describe('SubscriptionRegistry per-session cap', () => {
    let registry: SubscriptionRegistry;
    beforeEach(() => {
        registry = new SubscriptionRegistry();
    });

    it('subscribes up to the cap on a single session', () => {
        for (let i = 0; i < MAX_SUBSCRIPTIONS_PER_SESSION; i++) {
            registry.subscribe('sess-1', `apap://templates/${i}`, () => {}, `sub-${i}`);
        }
        expect(registry.sessionSubscriptions('sess-1')).toHaveLength(MAX_SUBSCRIPTIONS_PER_SESSION);
    });

    it('throws SubscriptionLimitError when a new URI would exceed the per-session cap', () => {
        for (let i = 0; i < MAX_SUBSCRIPTIONS_PER_SESSION; i++) {
            registry.subscribe('sess-1', `apap://templates/${i}`, () => {}, `sub-${i}`);
        }
        expect(() => {
            registry.subscribe('sess-1', 'apap://templates/overflow', () => {}, 'sub-overflow');
        }).toThrow(SubscriptionLimitError);

        // Registry state unchanged: still at the cap, overflow URI never registered.
        expect(registry.sessionSubscriptions('sess-1')).toHaveLength(MAX_SUBSCRIPTIONS_PER_SESSION);
        expect(registry.subscriberCount('apap://templates/overflow')).toBe(0);
    });

    it('resubscribing an already-registered URI at the cap is allowed (no net-new URI)', () => {
        for (let i = 0; i < MAX_SUBSCRIPTIONS_PER_SESSION; i++) {
            registry.subscribe('sess-1', `apap://templates/${i}`, () => {}, `sub-${i}`);
        }
        // Re-subscribing to an existing URI is a replace, not a net-new
        // entry, so should not trip the cap.
        expect(() => {
            registry.subscribe('sess-1', 'apap://templates/0', () => {}, 'sub-replaced');
        }).not.toThrow();
    });

    it('caps are per-session: session B hitting the cap does not affect session A', () => {
        for (let i = 0; i < MAX_SUBSCRIPTIONS_PER_SESSION; i++) {
            registry.subscribe('sess-B', `apap://templates/${i}`, () => {}, `sub-${i}`);
        }
        registry.subscribe('sess-A', 'apap://templates/999', () => {}, 'sub-a-999');
        expect(registry.sessionSubscriptions('sess-A')).toEqual(['apap://templates/999']);
    });

    it('SubscriptionLimitError carries sessionId + currentCount + limit for client feedback', () => {
        for (let i = 0; i < MAX_SUBSCRIPTIONS_PER_SESSION; i++) {
            registry.subscribe('sess-1', `apap://templates/${i}`, () => {}, `sub-${i}`);
        }
        try {
            registry.subscribe('sess-1', 'apap://templates/overflow', () => {}, 'sub-overflow');
            throw new Error('expected SubscriptionLimitError');
        } catch (err) {
            expect(err).toBeInstanceOf(SubscriptionLimitError);
            const e = err as SubscriptionLimitError;
            expect(e.sessionId).toBe('sess-1');
            expect(e.currentCount).toBe(MAX_SUBSCRIPTIONS_PER_SESSION);
            expect(e.limit).toBe(MAX_SUBSCRIPTIONS_PER_SESSION);
            expect(e.code).toBe('SUBSCRIPTION_LIMIT_EXCEEDED');
            expect(e.statusCode).toBe(429);
        }
    });
});

describe('subscriptionRegistry singleton', () => {
    // Guard against accidental module-level state leaking across tests in the
    // suite: the singleton is used by the handler at runtime; tests here only
    // touch it to prove the export exists and behaves like the class.
    it('is exported and behaves like a SubscriptionRegistry instance', () => {
        const initialCount = subscriptionRegistry.subscriberCount('apap://templates/singleton-check');
        subscriptionRegistry.subscribe('singleton-sess', 'apap://templates/singleton-check', () => {}, 'sub-singleton');
        expect(subscriptionRegistry.subscriberCount('apap://templates/singleton-check')).toBe(initialCount + 1);
        subscriptionRegistry.clearSession('singleton-sess');
        expect(subscriptionRegistry.subscriberCount('apap://templates/singleton-check')).toBe(initialCount);
    });
});
