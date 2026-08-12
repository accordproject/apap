import express, { Request, Response } from 'express';
import {
    McpServer,
    ResourceTemplate,
    isInitializeRequest,
    ProtocolError,
    INTERNAL_ERROR,
    INVALID_PARAMS,
    type CallToolResult,
    type ReadResourceResult,
} from '@modelcontextprotocol/server';
import { NodeStreamableHTTPServerTransport } from '@modelcontextprotocol/node';
import { z } from 'zod';
import * as crypto from "crypto";
import { InMemoryEventStore } from './inmemoryeventstore';
import { Agreement, MODEL, Template } from '../db/schema';
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
async function getTemplates(db: Database, uri: URL, opts: { limit?: number; offset?: number } = {}) {
    console.log({ type: 'get_templates_requested', uri: uri.toString(), ...opts });
    const templates = await listTemplates(db, opts);
    console.log({ type: 'fetched_templates_success', count: templates.length });
    return {
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
    console.log({ type: 'fetched_agreements_success', count: agreements.length });
    return {
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
    }, { capabilities: { logging: {} }, instructions: SERVER_INSTRUCTIONS });

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

    // Create an Agreement through the same REST boundary used by non-MCP
    // clients. Keeping creation generic lets output adapters (including the
    // OpenAgreements DOCX adapter) consume the resulting Concerto data without
    // coupling APAP to a particular document vendor or renderer.
    server.registerTool(
        "create-agreement",
        {
            description: `Creates an APAP Agreement from a template URI and Concerto agreement data.
The agreement argument must be a JSON string containing the protocol Agreement fields, including uri, template, data, and agreementStatus.
Use the returned agreement data with a format converter or a configured output adapter such as OpenAgreements DOCX.`,
            inputSchema: { agreement: z.string() } as any,
            annotations: {
                readOnlyHint: false,
                destructiveHint: false,
                idempotentHint: false,
                openWorldHint: true,
            },
        },
        async ({ agreement }: { agreement: string }): Promise<CallToolResult> => {
            let parsed: Record<string, unknown>;
            try {
                parsed = JSON.parse(agreement);
            } catch {
                return serviceErrorToCallToolResult(
                    new InvalidPayloadError('Agreement must be valid JSON'),
                );
            }
            if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
                return serviceErrorToCallToolResult(
                    new InvalidPayloadError('Agreement must be a JSON object'),
                );
            }
            if (typeof parsed.template !== 'string' || !parsed.template) {
                return serviceErrorToCallToolResult(
                    new InvalidPayloadError('Agreement must include a template URI'),
                );
            }
            if (!parsed.data || typeof parsed.data !== 'object' || Array.isArray(parsed.data)) {
                return serviceErrorToCallToolResult(
                    new InvalidPayloadError('Agreement must include Concerto data'),
                );
            }

            const result = await makeApiRequest(`${API_BASE_URL}/agreements`, {
                method: 'POST',
                body: JSON.stringify(parsed),
            });
            if (!result.ok) {
                return serviceErrorToCallToolResult(new UpstreamApiError(
                    `${API_BASE_URL}/agreements`,
                    result.status,
                    await result.text().catch(() => 'No error details available'),
                ));
            }
            const created = await result.json();
            return { content: [{ type: 'text', text: JSON.stringify(created) }] };
        },
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


// Exported for testing purposes.
// SDK 2.0 dropped `SSEServerTransport`; the map now only holds Streamable HTTP
// transports (single-type record, no union).
export const transports: Record<string, NodeStreamableHTTPServerTransport> = {};

export const sessionLastActivity: Record<string, number> = {};

const parseEnvMs = (val: string | undefined, defaultValue: number): number => {
    if (val === undefined || val === '') return defaultValue;
    const parsed = parseInt(val, 10);
    return isNaN(parsed) ? defaultValue : parsed;
};

const SESSION_TIMEOUT_MS = parseEnvMs(process.env.SESSION_TIMEOUT_MS, 30 * 60 * 1000); // 30 minutes
const CLEANUP_INTERVAL_MS = parseEnvMs(process.env.CLEANUP_INTERVAL_MS, 5 * 60 * 1000); // 5 minutes

export let sessionCleanupInterval: NodeJS.Timeout | undefined;

/**
 * Starts the periodic cleanup of idle sessions.
 * Prevents unbounded memory growth when clients
 * disconnect uncleanly without triggering onclose.
 */
export function startSessionCleanup(): void {
    if (sessionCleanupInterval) {
        clearInterval(sessionCleanupInterval);
    }
    sessionCleanupInterval = setInterval(() => {
        const now = Date.now();
        for (const sessionId of Object.keys(transports)) {
            const lastActivity = sessionLastActivity[sessionId];
            if (lastActivity &&
                now - lastActivity > SESSION_TIMEOUT_MS) {
                console.log({
                    type: 'session_cleanup',
                    sessionId,
                    idleMs: now - lastActivity,
                    reason: 'idle_timeout'
                });
                const transport = transports[sessionId];
                if (transport) {
                    try {
                        transport.close?.();
                    } catch (err) {
                        console.error({ type: 'transport_close_error', sessionId, error: err instanceof Error ? err.message : String(err) });
                    }
                }
                delete transports[sessionId];
                delete sessionLastActivity[sessionId];
            }
        }
    }, CLEANUP_INTERVAL_MS);

    // Prevent interval from blocking process exit
    sessionCleanupInterval.unref();
}

//=============================================================================
// STREAMABLE HTTP TRANSPORT (PROTOCOL VERSION 2025-03-26)
//
// SSE transport (`GET /sse` + `POST /messages`) was removed alongside the
// SDK 1.x -> 2.x migration: `@modelcontextprotocol/server@2.0.0` no longer
// exports `SSEServerTransport`. Only Streamable HTTP remains.
//=============================================================================

const router = express.Router();

/**
 * @param req The incoming Express request for the Streamable HTTP MCP endpoint.
 * @param res The Express response used to return JSON-RPC output.
 * @return Resolves after the request has been processed or an error response has been written.
 * @details Handles all `/mcp` traffic for the Streamable HTTP transport. The handler
 * reuses an existing session transport when a valid `mcp-session-id` is supplied, creates
 * a new transport during MCP initialization requests, and rejects invalid session usage.
 */
router.all('/mcp', async (req: Request, res: Response) => {
    // Structured log without PII
    console.log({ type: 'mcp_request', method: req.method, path: '/mcp' });

    try {
        // Check for existing session ID
        const sessionId = req.headers['mcp-session-id'] as string | undefined;
        let transport: NodeStreamableHTTPServerTransport;

        if (sessionId && transports[sessionId]) {
            // Reuse existing transport (map is now single-type: only Streamable HTTP).
            transport = transports[sessionId];
            // Update last activity on every request
            sessionLastActivity[sessionId] = Date.now();
        } else if (!sessionId && req.method === 'POST' && isInitializeRequest(req.body)) {
            const eventStore = new InMemoryEventStore();
            transport = new NodeStreamableHTTPServerTransport({
                sessionIdGenerator: () => (crypto as any).randomUUID(),
                eventStore, // Enable resumability
                onsessioninitialized: (sessionId) => {
                    // Store the transport by session ID when session is initialized
                    console.log({ type: 'streamable_http_session_initialized', sessionId });
                    transports[sessionId] = transport;
                    sessionLastActivity[sessionId] = Date.now();
                    res.setHeader('mcp-session-id', sessionId);
                }
            });

            // Set up onclose handler to clean up transport when closed
            transport.onclose = () => {
                const sid = transport.sessionId;
                if (sid) {
                    delete transports[sid];
                    delete sessionLastActivity[sid];
                    console.log({
                        type: 'session_closed',
                        sessionId: sid,
                        reason: 'transport_onclose'
                    });
                }
            };

            // Connect the transport to the MCP server
            const server = getServer(res.locals.db);
            await server.connect(transport);
            console.log({ type: 'connected_server_to_transport' });
        } else {
            console.log({ type: 'invalid_mcp_request' });
            // Invalid request - no session ID or not initialization request
            res.status(400).json({
                jsonrpc: '2.0',
                error: {
                    code: -32000,
                    message: 'Bad Request: No valid session ID provided',
                },
                id: null,
            });
            return;
        }

        // Handle the request with the transport
        await transport.handleRequest(req, res, req.body);
        console.log({ type: 'transport_handled_request' });
    } catch (error) {
        console.error({ type: 'mcp_request_failed', error: error instanceof Error ? error.message : String(error) });
        if (!res.headersSent) {
            res.status(500).json({
                jsonrpc: '2.0',
                error: {
                    code: -32603,
                    message: 'Internal server error',
                },
                id: null,
            });
        }
    }
});

export default router;
