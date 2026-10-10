import express from 'express';
import {
    McpServer,
    ResourceTemplate,
    ProtocolError,
    INTERNAL_ERROR,
    INVALID_PARAMS,
    InMemoryServerEventBus,
    createMcpHandler,
    type CallToolResult,
    type ReadResourceResult,
} from '@modelcontextprotocol/server';
import { toNodeHandler } from '@modelcontextprotocol/node';
import { z } from 'zod';
import { Agreement, MODEL, Template } from '../db/schema';
import { setNotifier } from '../services/notify';
import {
    ServiceError,
    TemplateNotFoundError,
    AgreementNotFoundError,
    AgreementConversionError,
    AgreementTriggerError,
    UpstreamApiError,
} from '../services/errors';
import { listTemplates, getTemplateById } from '../services/templateService';
import {
    listAgreements,
    getAgreementById,
    convertAgreement,
    triggerAgreement as triggerAgreementService,
} from '../services/agreementService';
import { InvalidPayloadError } from '../services/errors';
import type { Database } from '../db/client';

const HOST = process.env.HOST || 'localhost';
const PORT = parseInt(process.env.PORT || '9000', 10);
const API_BASE_URL = process.env.API_BASE_URL || `http://${HOST}:${PORT}`

// Get API authorization header from environment variable (optional)
const API_AUTH_HEADER = process.env.APAP_API_AUTH_HEADER;

// Forward-looking cache hints for MCP `ReadResourceResult.contents[]`, mirroring
// the shape proposed in SEP-2549 ("CacheableResult") in the MCP 2026-07-28 RC:
//   https://blog.modelcontextprotocol.io/posts/2026-07-28-release-candidate
// Defaults are chosen by mutability of each resource: lists are volatile and
// per-client (private), single templates are hash-immutable (public, 5min),
// single agreements are short-lived because the row can be triggered/updated,
// and the bundled Concerto schema is immutable per deploy (public, 24h).
// Both fields are emitted alongside `uri`/`mimeType`/`text` so the SEP wire
// shape lands as-is once the SDK accepts them at the top level; the current
// SDK's request/response path is pass-through (no schema strip), so caching
// proxies see them today as forward-compatible hints. The SDK types are
// augmented in ../types/mcp-augmentation.d.ts so the spread typechecks
// without per-callsite casts.
type CacheScope = 'public' | 'private';
interface CacheHint { ttlMs: number; cacheScope: CacheScope }
export const CACHE_HINTS = {
    templateList:   { ttlMs:     60_000, cacheScope: 'private' } as CacheHint,
    templateItem:   { ttlMs:    300_000, cacheScope: 'public'  } as CacheHint,
    agreementList:  { ttlMs:     30_000, cacheScope: 'private' } as CacheHint,
    agreementItem:  { ttlMs:     30_000, cacheScope: 'private' } as CacheHint,
    schema:         { ttlMs: 86_400_000, cacheScope: 'public'  } as CacheHint,
} as const;

// Concerto typed-context hint, exposed via MCP `InitializeResult.instructions`
// and as a readable schema resource. Tells the client (and any LLM behind it)
// that response payloads are Concerto-serialized so `$class` discriminators
// can be interpreted directly against the protocol model.
//
// See accordproject/apap#185 for the discussion that motivated this. The
// empirical A/B that produced this came out at Sonnet 4.6 +0.200 / gpt-4o
// +0.383 mean score on a fixed query set.
export const SERVER_INSTRUCTIONS = [
    'Responses from this server are Concerto-serialized objects from the Accord',
    'Project Agreement Protocol (APAP). Each resource carries a `$class`',
    'discriminator (e.g. `org.accordproject.protocol@1.0.0.Template`) identifying',
    'its type and inheritance. The canonical Concerto model is available at',
    '`apap://schema/protocol.cto` and can be read for type definitions.',
].join(' ');

// The Concerto model is embedded in db/schema.ts as a base64 constant at
// drizzle-gen time (same source as `handlers/concertovalidation`), so no
// filesystem access is needed at runtime and no build-time file copy is
// required to serve the `apap://schema/protocol.cto` resource.
export const PROTOCOL_CTO = Buffer.from(MODEL, 'base64').toString('utf-8');

/**
 * @param url The APAP REST endpoint to call.
 * @param options Optional fetch options such as method, headers, and request body.
 * @return The fetch response returned by the local APAP REST API.
 * @details Builds a JSON-based request to the local REST API and attaches the
 * optional static authorization header from `APAP_API_AUTH_HEADER` when it is configured.
 */
async function makeApiRequest(url: string, options: RequestInit = {}) {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string> || {}),
    };

    if (API_AUTH_HEADER) {
        headers['Authorization'] = API_AUTH_HEADER;
    }

    return fetch(url, {
        ...options,
        headers,
    });
}

// Parses `{ limit, offset }` from RFC 6570 form-style template variables into
// safe integers for the paged resource callbacks (#217). Non-numeric, partial,
// or absent values become `undefined` so the service layer applies its own
// default (100 / 0) and clamp ([1, 100]); no double-clamp here.
//
// Strict-integer regex rejects `parseInt`-friendly garbage that would silently
// truncate: '50abc' -> undefined (not 50), '50.5' -> undefined (not 50), '1e2'
// -> undefined (not 100). Trailing whitespace is tolerated via `.trim()`.
export function pageOpts(variables: Record<string, string | string[]> | undefined): { limit?: number; offset?: number } {
    const pick = (v: string | string[] | undefined): number | undefined => {
        const raw = Array.isArray(v) ? v[0] : v;
        if (raw === undefined) return undefined;
        const trimmed = raw.trim();
        if (trimmed === '' || !/^-?\d+$/.test(trimmed)) return undefined;
        const n = Number(trimmed);
        return Number.isSafeInteger(n) ? n : undefined;
    };
    return { limit: pick(variables?.limit), offset: pick(variables?.offset) };
}

// Builds a meaningful error message from a failed API response so that MCP clients
// can tell apart a 404 (resource missing) from a 400 (bad input) or a 500 (server issue).
// Without this, every failure just says "Failed to load ..." which is impossible to debug.
export async function buildApiErrorMessage(result: globalThis.Response, context: string): Promise<string> {
    const body = await result.text().catch(() => 'No error details available');
    return `${context} (HTTP ${result.status}): ${body}`;
}

/**
 * @param error A `ServiceError` to surface back through the MCP tool protocol.
 * @return A `CallToolResult` flagged as an error so MCP clients see the structured
 * `{ code, message, details }` payload instead of a generic SDK error string.
 * @details The MCP SDK has no native typed-error channel for tool callbacks, so we put
 * the JSON payload from `error.toJSON()` into a single text content block. Clients can
 * parse it to branch on the machine-readable `code` (e.g. `TEMPLATE_NOT_FOUND`) the same
 * way the REST clients already do.
 */
export function serviceErrorToCallToolResult(error: ServiceError): CallToolResult {
    return {
        isError: true,
        content: [
            {
                type: 'text',
                text: JSON.stringify(error.toJSON()),
            },
        ],
    };
}

/**
 * @param error A `ServiceError` raised inside an MCP resource handler.
 * @return A `ProtocolError` whose `data` field carries the structured `toJSON()` payload.
 * @details Resource handlers do not have a `CallToolResult { isError }` channel, but the
 * SDK ships `ProtocolError` with a numeric JSON-RPC error code and a structured `data` field.
 * Under SDK 2.0 the old `McpError` / `ErrorCode` monolith was split into a `ProtocolError`
 * class hierarchy plus numeric code constants (`INVALID_PARAMS`, `INTERNAL_ERROR`, ...);
 * `ProtocolError`'s `(code, message, data)` constructor is the direct replacement for the
 * removed `new McpError(code, message, data)` shape. Not-found-style cases still map to
 * `InvalidParams` so the client sees an actionable code without us inventing an SDK string.
 */
export function serviceErrorToResourceError(error: ServiceError): ProtocolError {
    const code = error.statusCode === 404 ? INVALID_PARAMS : INTERNAL_ERROR;
    return new ProtocolError(code, error.message, error.toJSON());
}

/**
 * @param uri The MCP resource URI being resolved.
 * @param variables Object containing the agreementId extracted from the resource template variables.
 * @return A MCP resource payload containing the requested agreement as JSON content.
 * @details Resolves a single agreement by calling the local REST API and converts
 * the REST response into the `contents` structure expected by the MCP SDK.
 */
async function getAgreement(db: Database, uri: string, variables: { agreementId: string }) {
    const { agreementId } = variables;
    console.log({ type: 'fetching_agreement', agreementId });
    const url = new URL(uri);
    // Same strict-numeric guard as the REST /agreements/:id route from #208.
    const id = /^\d+$/.test(agreementId) ? Number(agreementId) : NaN;
    if (!Number.isFinite(id)) {
        throw serviceErrorToResourceError(new AgreementNotFoundError(agreementId));
    }
    try {
        const agreement = await getAgreementById(db, id);
        console.log({ type: 'fetched_agreement_success', agreementId });
        return {
            contents: [{
                uri: url.toString(),
                mimeType: "application/json",
                text: JSON.stringify(agreement),
                ...CACHE_HINTS.agreementItem,
            }]
        };
    } catch (err) {
        if (err instanceof ServiceError) {
            throw serviceErrorToResourceError(err);
        }
        throw err;
    }
}

/**
 * @param uri The MCP resource URI for the templates collection.
 * @return A MCP resource payload containing all templates returned by the REST API.
 * @details Loads the template collection from the local REST API and maps each
 * database row into an MCP `contents` entry with an `apap://templates/{id}` URI.
 */
// Direct service call, no HTTP loop. This is the slice-1 payoff: a bug fix in
// `templateService.listTemplates` now propagates to both the MCP resource
// callback and any future REST caller without going through Express.
//
// Optional `opts` carries the paged-URI query variables (`{?limit,offset}`)
// per RFC 6570 form-style expansion. The service clamps to [1, 100] internally
// so we never double-clamp here; `undefined` values fall back to the same
// full-page default the bare `apap://templates` URI uses (limit=100, offset=0).
//
// `_meta.hasMore` closes #244: a client paging `apap://templates{?limit,offset}`
// otherwise has to probe an extra page to discover the collection ends. The
// service clamps `limit` to [1, 100] identically to the effectiveLimit computed
// here, so `rows.length === effectiveLimit` is a sound "page filled" signal.
// ponytail: heuristic. A total that is an exact multiple of the effective
// limit still costs the client one probe (rows.length === limit and hasMore
// reports true; the next page returns 0 rows and hasMore false). Upgrade path:
// fetch `limit + 1` inside the service and drop the peek, at the cost of one
// extra row's bytes per read. Deferred here to match Satvik's "no extra query"
// scoping in #244; upgrade if the boundary case surfaces in real traffic.
async function getTemplates(db: Database, uri: URL, opts: { limit?: number; offset?: number } = {}) {
    console.log({ type: 'get_templates_requested', uri: uri.toString(), ...opts });
    const templates = await listTemplates(db, opts);
    const effectiveLimit = Math.min(100, Math.max(1, opts.limit ?? 100));
    const hasMore = templates.length === effectiveLimit;
    console.log({ type: 'fetched_templates_success', count: templates.length, hasMore });
    return {
        _meta: { hasMore },
        contents: templates.map((t) => ({
            uri: `apap://templates/${t.id}`,
            mimeType: "application/json",
            text: JSON.stringify(t),
            ...CACHE_HINTS.templateList,
        })),
    };
}

/**
 * @param uri The MCP resource URI for the agreements collection.
 * @return A MCP resource payload containing all agreements returned by the REST API.
 * @details Loads the agreement collection from the local REST API and serializes
 * each item into the MCP resource format expected by agreement resources.
 */
async function getAgreements(db: Database, uri: URL, opts: { limit?: number; offset?: number } = {}) {
    console.log({ type: 'get_agreements_requested', uri: uri.toString(), ...opts });
    const agreements = await listAgreements(db, opts);
    // `_meta.hasMore` closes #244; see getTemplates above for the heuristic
    // and its upgrade path.
    const effectiveLimit = Math.min(100, Math.max(1, opts.limit ?? 100));
    const hasMore = agreements.length === effectiveLimit;
    console.log({ type: 'fetched_agreements_success', count: agreements.length, hasMore });
    return {
        _meta: { hasMore },
        // FIX for issue #128: The previous version spread the full agreement object
        // (...a) after setting the uri field. Because the Agreement row from the
        // database carries its own `uri` property (e.g. "resource:org.accordproject..."),
        // the spread overwrote the MCP resource URI ("apap://agreements/{id}") with the
        // agreement's data URI. MCP clients then failed to resolve the resource because
        // they tried to use the wrong URI scheme.
        //
        // The ReadResourceResult `contents` array only needs { uri, mimeType, text },
        // so spreading the entire row object onto it was also polluting the content
        // with unrelated database fields. The agreement payload is already serialized
        // inside the `text` property as JSON, which is where MCP clients read it from.
        contents: agreements.map((a) => ({
            mimeType: "application/json",
            text: JSON.stringify({ ...(a.data as Record<string, unknown> ?? {}), $identifier: a.id }, null, 2),
            uri: `apap://agreements/${a.id}`,
            ...CACHE_HINTS.agreementList,
        })),
    };
}

/**
 * @return A fully configured MCP server instance with the current resources,
 * tools, and transport-facing capabilities registered.
 * @details Creates a new MCP server and registers the template and agreement
 * resources, resource templates, and tool handlers currently exposed by APAP.
 */
export const getServer = (db: Database) => {
    const server = new McpServer({
        name: 'apap-mcp-server',
        version: '1.0.0',
    }, {
        capabilities: {
            logging: {},
            // SEP-2575 subscriptions/listen is routed natively by createMcpHandler
            // against the shared bus. `listChanged` is intentionally omitted:
            // services fire `resourceUpdated(uri)` on single-row writes but no
            // caller currently emits `resourcesChanged()` list-level fan-out,
            // and advertising a capability the handler never serves is the same
            // kind of wire-shape dishonesty that killed #224. Add `listChanged`
            // back the day a service wires `getNotifier().resourcesChanged()`.
            resources: { subscribe: true },
        },
        instructions: SERVER_INSTRUCTIONS,
    });

    // CONTRIBUTOR NOTE: resources registered below are subscribable
    // (`capabilities.resources.subscribe: true`). If a resource is mutable,
    // the owning service MUST call `getNotifier().resourceUpdated(uri)` on
    // every successful write so open `subscriptions/listen` clients are
    // notified. See `services/templateService.ts` and
    // `services/agreementService.ts` for the pattern and the SECURITY
    // contract. The protocol-schema resource below is immutable per deploy
    // and therefore does not emit updates.
    //
    // register the Concerto protocol model as a readable resource so a
    // client (or any LLM behind it) can resolve `$class` discriminators to
    // type definitions without external lookup.
    // SDK 2.0 renamed `.resource()` / `.tool()` to `.registerResource()` /
    // `.registerTool()` and requires a `config` object between the URI and
    // the callback (title/description/mimeType/etc.).
    server.registerResource(
        'protocol-schema',
        "apap://schema/protocol.cto",
        { mimeType: "text/x-concerto" },
        async (uri: URL): Promise<ReadResourceResult> => ({
            contents: [{
                uri: uri.toString(),
                mimeType: "text/x-concerto",
                text: PROTOCOL_CTO,
                ...CACHE_HINTS.schema,
            }],
        }),
    );

    // register the templates. NOTE (#217 dispatch order): the SDK checks these
    // exact-string static resources BEFORE iterating the `{?limit,offset}`
    // templates registered below. Keep them registered; without them, a bare
    // `apap://templates` read would fall through to the paged template's regex
    // (which requires both params non-empty) and surface as
    // ResourceNotFoundError, breaking backwards-compat for clients that page
    // via the default full-page URI.
    server.registerResource(
        'templates',
        "apap://templates",
        { mimeType: "application/json" },
        (uri: URL) => getTemplates(db, uri),
    );

    // register the agreements (see #217 dispatch-order note on templates above).
    server.registerResource(
        'agreements',
        "apap://agreements",
        { mimeType: "application/json" },
        (uri: URL) => getAgreements(db, uri),
    );

    // Paged variants for #217: RFC 6570 form-style query expansion
    // (`{?limit,offset}`). The SDK dispatcher (mcp.mjs `resources/read`) checks
    // exact-string static resources first, then iterates registered templates
    // and calls `UriTemplate.match(uri)`. Bare `apap://templates` still hits the
    // static resource above; `apap://templates?limit=50&offset=100` hits the
    // template below. Callback receives `{ limit, offset }` as string variables;
    // `pageOpts` coerces to safe integers or `undefined`, and the service layer
    // applies its own default (100 / 0) and clamp ([1, 100]). Today the SDK's
    // UriTemplate regex requires both params present + non-empty, so out-of-band
    // URIs (`?limit=&offset=` or `?limit=50` alone) surface as
    // ResourceNotFoundError before the callback ever runs (pinned in tests).
    // `pageOpts` returning `undefined` for empty/absent values is defensive
    // coverage for the day the SDK loosens that regex.
    server.registerResource(
        'templates-page',
        new ResourceTemplate('apap://templates{?limit,offset}', { list: undefined }),
        { title: 'Templates (paged)', mimeType: 'application/json' },
        (uri: URL, variables: Record<string, string | string[]>) =>
            getTemplates(db, uri, pageOpts(variables)),
    );

    server.registerResource(
        'agreements-page',
        new ResourceTemplate('apap://agreements{?limit,offset}', { list: undefined }),
        { title: 'Agreements (paged)', mimeType: 'application/json' },
        (uri: URL, variables: Record<string, string | string[]>) =>
            getAgreements(db, uri, pageOpts(variables)),
    );

    // register resource template for agreements
    server.registerResource(
        "agreement",
        new ResourceTemplate("apap://agreements/{agreementId}", {
            list: async () => {
                const agreements = await listAgreements(db);
                return {
                    resources: agreements.map((a) => ({
                        name: `agreement-${a.id}`,
                        ...a,
                        uri: `apap://agreements/${a.id}`,
                    })),
                };
            }
        }),
        { mimeType: "application/json" },
        async (uri: URL, variables: Record<string, string | string[]>) => {
            const agreementId = String(variables.agreementId);
            return await getAgreement(db, uri.toString(), { agreementId });
        }
    );

    // register resource template for templates
    server.registerResource(
        "template",
        new ResourceTemplate("apap://templates/{templateId}", {
            list: async () => {
                const templates = await listTemplates(db);
                return {
                    resources: templates.map((t) => ({
                        name: `template-${t.id}`,
                        ...t,
                        uri: `apap://templates/${t.id}`,
                    })),
                };
            }
        }),
        { mimeType: "application/json" },
        async (uri: URL, variables: Record<string, string | string[]>) => {
            const templateId = String(variables.templateId);
            // Same strict-numeric guard as the REST /templates/:id route from #208.
            // Anything not a decimal integer resolves to a not-found, not a NaN.
            const id = /^\d+$/.test(templateId) ? Number(templateId) : NaN;
            if (!Number.isFinite(id)) {
                throw serviceErrorToResourceError(new TemplateNotFoundError(templateId));
            }
            try {
                const template = await getTemplateById(db, id);
                return {
                    contents: [{
                        uri: uri.toString(),
                        mimeType: "application/json",
                        text: JSON.stringify(template),
                        ...CACHE_HINTS.templateItem,
                    }]
                };
            } catch (err) {
                if (err instanceof ServiceError) {
                    throw serviceErrorToResourceError(err);
                }
                throw err;
            }
        }
    );

    // register the format conversion tool.
    // SDK 2.0's `.registerTool()` bundles description, inputSchema, and
    // annotations into a single `config` object; the handler's arg shape
    // is inferred from `inputSchema` (a Zod raw shape auto-wrapped by the SDK).
    server.registerTool(
        "convert-agreement-to-format",
        {
            description: "Converts an existing agreement to an output format",
            // ponytail: cast to any because project zod (v3.24) and SDK bundled zod (v4.4)
            // are separate instances; TypeScript sees ZodString-v3 and ZodString-v4 as
            // distinct types. Runtime is fine (SDK accepts any zod raw shape). Upgrade
            // project zod to v4 as a follow-up to remove the cast.
            inputSchema: { agreementId: z.string(), format: z.enum(['html', 'markdown']) } as any,
        },
        async ({ agreementId, format }: { agreementId: string; format: 'html' | 'markdown' }): Promise<CallToolResult> => {
            const id = /^\d+$/.test(agreementId) ? Number(agreementId) : NaN;
            if (!Number.isFinite(id)) {
                return serviceErrorToCallToolResult(new AgreementNotFoundError(agreementId));
            }
            try {
                const text = await convertAgreement(db, id, format);
                return {
                    content: [{ type: "text", text }]
                };
            } catch (error) {
                if (error instanceof ServiceError) {
                    return serviceErrorToCallToolResult(error);
                }
                throw error;
            }
        }
    );

    // register the trigger tool
    server.registerTool(
        "trigger-agreement",
        {
            description: `Sends JSON data (as a string) to an existing agreement, evaluating the logic of the agreement against the input data.
The schema for the JSON object must be one of the transaction types which extend 'Request' defined in the model for the agreement's template.
Refer to the agreement's template model to determine which fields are required or optional.`,
            inputSchema: { agreementId: z.string(), payload: z.string() } as any,
        },
        async ({ agreementId, payload }: { agreementId: string; payload: string }): Promise<CallToolResult> => {
            const id = /^\d+$/.test(agreementId) ? Number(agreementId) : NaN;
            if (!Number.isFinite(id)) {
                return serviceErrorToCallToolResult(new AgreementNotFoundError(agreementId));
            }
            let parsedPayload: unknown;
            try {
                parsedPayload = JSON.parse(payload);
            } catch {
                return serviceErrorToCallToolResult(
                    new InvalidPayloadError('Payload must be valid JSON', { agreementId }),
                );
            }
            try {
                const result = await triggerAgreementService(db, id, parsedPayload);
                return {
                    content: [{ type: "text", text: JSON.stringify(result) }]
                };
            } catch (error) {
                if (error instanceof ServiceError) {
                    return serviceErrorToCallToolResult(error);
                }
                throw error;
            }
        }
    );

    // register the getTemplate tool
    server.registerTool(
        'getTemplate',
        {
            description: 'Retrieve a template by ID',
            inputSchema: { templateId: z.string() } as any,
            annotations: {
                readOnlyHint: true,
                destructiveHint: false,
                idempotentHint: true,
                openWorldHint: false,
            },
        },
        async ({ templateId }: { templateId: string }): Promise<CallToolResult> => {
            const id = /^\d+$/.test(templateId) ? Number(templateId) : NaN;
            if (!Number.isFinite(id)) {
                return serviceErrorToCallToolResult(new TemplateNotFoundError(templateId));
            }
            try {
                const template = await getTemplateById(db, id);
                return {
                    content: [{ type: "text", text: JSON.stringify(template) }]
                };
            } catch (err) {
                if (err instanceof ServiceError) {
                    return serviceErrorToCallToolResult(err);
                }
                throw err;
            }
        }
    );

    // register the getAgreement tool
    server.registerTool(
        'getAgreement',
        {
            description: 'Retrieve an agreement by ID',
            inputSchema: { agreementId: z.string() } as any,
            annotations: {
                readOnlyHint: true,
                destructiveHint: false,
                idempotentHint: true,
                openWorldHint: false,
            },
        },
        async ({ agreementId }: { agreementId: string }): Promise<CallToolResult> => {
            const id = /^\d+$/.test(agreementId) ? Number(agreementId) : NaN;
            if (!Number.isFinite(id)) {
                return serviceErrorToCallToolResult(new AgreementNotFoundError(agreementId));
            }
            try {
                const agreement = await getAgreementById(db, id);
                return {
                    content: [{ type: "text", text: JSON.stringify(agreement) }]
                };
            } catch (err) {
                if (err instanceof ServiceError) {
                    return serviceErrorToCallToolResult(err);
                }
                throw err;
            }
        }
    );

    return server;
};


//=============================================================================
// SEP-2575 subscriptions/listen wiring (closes #232)
//
// `createMcpHandler` owns the modern (2026-07-28) MCP HTTP surface:
// JSON-RPC dispatch, per-session lifecycle, and native `subscriptions/listen`
// routing against the shared `InMemoryServerEventBus`. Services call
// `getNotifier()` to publish `notifications/resources/updated` events; the
// handler fans them out to each open subscription that opted in.
//
// Per-session subscription cap of 100 (`maxSubscriptions`) returns the SDK's
// `-32603 Subscription limit reached` error in-band before the ack.
// Pre-initialize `subscriptions/listen` is rejected by the SDK with
// `INVALID_REQUEST`, not indexed under literal `"undefined"`.
//
// `legacy: 'stateless'` keeps 2025-era clients working: each legacy request is
// answered by a fresh factory instance over a streamable HTTP transport with
// `sessionIdGenerator: undefined`. GET and DELETE legacy session ops answer
// `405 Method not allowed`. The per-session transport dict + custom
// `InMemoryEventStore` the pre-#232 branch carried are retired in this change.
//=============================================================================

const SUBSCRIPTION_CAP_PER_SESSION = 100;

/**
 * Build the Express router that owns `/mcp`. Called once at startup from
 * `index.ts` with the shared `Database` instance; the handler constructs a
 * fresh `McpServer` per request via the factory, so `getServer(db)` runs on
 * each inbound call rather than at module load.
 *
 * Side effect: installs the handler's publish-side notifier on the services
 * module so write paths can emit `notifications/resources/updated` on the
 * shared bus without importing from `handlers/`. See `services/notify.ts`.
 */
export function createMcpRouter(db: Database): express.Router {
    const bus = new InMemoryServerEventBus((err: Error) => {
        console.error({ type: 'mcp_event_bus_listener_error', error: err.message });
    });

    // `legacy` defaults to `'stateless'`; omitting it keeps 2025-era clients
    // served by a fresh factory per request without re-stating the SDK default.
    const handler = createMcpHandler(
        () => getServer(db),
        {
            bus,
            maxSubscriptions: SUBSCRIPTION_CAP_PER_SESSION,
        },
    );

    setNotifier(handler.notify);

    const router = express.Router();
    // `toNodeHandler` adapts the SDK's Fetch-shaped `McpHttpHandler` to
    // Express `(req, res)`. The third argument forwards the already-parsed
    // body: `index.ts` mounts `express.json()` ahead of this router, so the
    // Node stream is drained by the time we reach here. Omitting
    // `req.body` hangs the request because the SDK re-reads a consumed stream.
    router.all('/mcp', (req, res) => toNodeHandler(handler)(req, res, req.body));
    return router;
}
