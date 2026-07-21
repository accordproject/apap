import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import {
    serviceErrorToCallToolResult,
    serviceErrorToResourceError,
    buildApiErrorMessage,
    PROTOCOL_CTO,
    SERVER_INSTRUCTIONS,
    CACHE_HINTS,
} from './mcp';
import mcpRouter from './mcp';
import { McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';
import {
    AgreementConversionError,
    AgreementNotFoundError,
    ServiceError,
    TemplateNotFoundError,
} from '../services/errors';

// Helper to create a mock failed Response. Only the fields buildApiErrorMessage
// actually reads (ok, status, text) need to be present; the cast is safe because
// the function never touches the rest of the Response surface.
function mockFailedResponse(status: number, body: string): globalThis.Response {
    return {
        ok: false,
        status,
        text: async () => body,
        json: async () => JSON.parse(body),
    } as unknown as globalThis.Response;
}

describe('MCP Error Handling - buildApiErrorMessage', () => {

    it('should include HTTP 404 status when a resource is not found', async () => {
        const result = mockFailedResponse(404, '{"error": "Template not found"}');
        const msg = await buildApiErrorMessage(result, "Failed to load template 'late-delivery'");

        expect(msg).toContain('HTTP 404');
        expect(msg).toContain("Failed to load template 'late-delivery'");
        expect(msg).toContain('Template not found');
    });

    it('should include HTTP 400 status for validation errors', async () => {
        const result = mockFailedResponse(400, '{"error": "Invalid Concerto model"}');
        const msg = await buildApiErrorMessage(result, 'Failed to trigger agreement');

        expect(msg).toContain('HTTP 400');
        expect(msg).toContain('Invalid Concerto model');
    });

    it('should include HTTP 500 status for server errors', async () => {
        const result = mockFailedResponse(500, 'Internal Server Error');
        const msg = await buildApiErrorMessage(result, 'Failed to load agreements');

        expect(msg).toContain('HTTP 500');
        expect(msg).toContain('Internal Server Error');
    });

    it('should handle response body read failure gracefully', async () => {
        const result = {
            ok: false,
            status: 502,
            // Simulate a body that can't be read (stream already consumed, network error, etc.)
            text: async () => { throw new Error('body stream already read'); },
        } as unknown as globalThis.Response;
        const msg = await buildApiErrorMessage(result, 'Failed to convert agreement');

        expect(msg).toContain('HTTP 502');
        expect(msg).toContain('No error details available');
    });

    it('should preserve resource identifiers in error context', async () => {
        const result = mockFailedResponse(404, 'Not found');
        const msg = await buildApiErrorMessage(result, "Failed to load agreement 'agreement-abc-123'");

        expect(msg).toContain('agreement-abc-123');
        expect(msg).toContain('HTTP 404');
    });

    it('should include format info for conversion failures', async () => {
        const result = mockFailedResponse(422, '{"error": "Unsupported output format"}');
        const msg = await buildApiErrorMessage(result, "Failed to convert agreement 'agr-1' to pdf");

        expect(msg).toContain('agr-1');
        expect(msg).toContain('pdf');
        expect(msg).toContain('HTTP 422');
    });
});

describe('MCP Error Handling - error distinctness', () => {

    // The whole point of this fix: a 404, 400, and 500 should produce
    // different error messages so an MCP client can tell them apart
    it('should produce different messages for 404 vs 400 vs 500', async () => {
        const ctx = 'Failed to load template';

        const msg404 = await buildApiErrorMessage(
            mockFailedResponse(404, 'Not found'), ctx
        );
        const msg400 = await buildApiErrorMessage(
            mockFailedResponse(400, 'Validation failed'), ctx
        );
        const msg500 = await buildApiErrorMessage(
            mockFailedResponse(500, 'Internal error'), ctx
        );

        // All three must be distinct strings
        expect(msg404).not.toEqual(msg400);
        expect(msg400).not.toEqual(msg500);
        expect(msg404).not.toEqual(msg500);

        // Each contains its own status code
        expect(msg404).toContain('404');
        expect(msg400).toContain('400');
        expect(msg500).toContain('500');
    });

    // Make sure we didn't accidentally break the original context message
    it('should always start with the context string', async () => {
        const contexts = [
            "Failed to load template 'my-template'",
            "Failed to load agreement 'my-agreement'",
            "Failed to trigger agreement 'agr-99'",
            "Failed to convert agreement 'agr-1' to html",
            'Failed to load templates',
            'Failed to load agreements',
        ];

        for (const ctx of contexts) {
            const msg = await buildApiErrorMessage(
                mockFailedResponse(500, 'error'), ctx
            );
            expect(msg.startsWith(ctx)).toBe(true);
        }
    });
});

describe('mcp typed error helpers', () => {
    describe('serviceErrorToCallToolResult', () => {
        it('wraps a TemplateNotFoundError in an isError CallToolResult', () => {
            const err = new TemplateNotFoundError('tmpl-42');
            const result = serviceErrorToCallToolResult(err);

            expect(result.isError).toBe(true);
            expect(Array.isArray(result.content)).toBe(true);
            expect(result.content).toHaveLength(1);
            const block = (result.content as any[])[0];
            expect(block.type).toBe('text');

            const parsed = JSON.parse(block.text);
            expect(parsed.error.code).toBe('TEMPLATE_NOT_FOUND');
            expect(parsed.error.message).toContain('tmpl-42');
            expect(parsed.error.details).toEqual({ identifier: 'tmpl-42' });
        });

        it('preserves the AGREEMENT_NOT_FOUND code and identifier', () => {
            const err = new AgreementNotFoundError('999');
            const result = serviceErrorToCallToolResult(err);

            const parsed = JSON.parse((result.content as any[])[0].text);
            expect(parsed.error.code).toBe('AGREEMENT_NOT_FOUND');
            expect(parsed.error.details.identifier).toBe('999');
        });

        it('carries AGREEMENT_CONVERSION_FAILED details through to the wire payload', () => {
            const err = new AgreementConversionError('7', 'pdf', 'no renderer for pdf');
            const result = serviceErrorToCallToolResult(err);

            const parsed = JSON.parse((result.content as any[])[0].text);
            expect(parsed.error.code).toBe('AGREEMENT_CONVERSION_FAILED');
            expect(parsed.error.details).toEqual({
                agreementId: '7',
                format: 'pdf',
                reason: 'no renderer for pdf',
            });
        });
    });

    describe('serviceErrorToResourceError', () => {
        it('returns an McpError with InvalidParams code for 404-style ServiceErrors', () => {
            const err = new TemplateNotFoundError('tmpl-1');
            const wrapped = serviceErrorToResourceError(err);

            expect(wrapped).toBeInstanceOf(McpError);
            expect(wrapped.code).toBe(ErrorCode.InvalidParams);
            expect(wrapped.message).toContain('tmpl-1');

            const data = wrapped.data as { error: { code: string; message: string; details?: unknown } };
            expect(data.error.code).toBe('TEMPLATE_NOT_FOUND');
            expect(data.error.message).toContain('tmpl-1');
        });

        it('uses InternalError code for non-404 ServiceErrors', () => {
            const err = new ServiceError('CUSTOM', 500, 'kaboom', { reason: 'overflow' });
            const wrapped = serviceErrorToResourceError(err);

            expect(wrapped).toBeInstanceOf(McpError);
            expect(wrapped.code).toBe(ErrorCode.InternalError);
            // McpError prepends "MCP error <code>:" to the constructor message; check substring.
            expect(wrapped.message).toContain('kaboom');

            const data = wrapped.data as { error: { code: string; details?: unknown } };
            expect(data.error.code).toBe('CUSTOM');
            expect(data.error.details).toEqual({ reason: 'overflow' });
        });

        it('round-trips arbitrary ServiceError subclasses into the McpError data payload', () => {
            const err = new ServiceError('CUSTOM', 418, 'I am a teapot', { teapot: true });
            const wrapped = serviceErrorToResourceError(err);

            const data = wrapped.data as { error: { code: string; message: string; details?: unknown } };
            expect(data.error.code).toBe('CUSTOM');
            expect(data.error.message).toBe('I am a teapot');
            expect(data.error.details).toEqual({ teapot: true });
        });
    });
});

describe('Concerto typed-context (instructions + schema resource)', () => {
    describe('SERVER_INSTRUCTIONS', () => {
        it('mentions Concerto and the schema resource URI', () => {
            expect(SERVER_INSTRUCTIONS).toMatch(/Concerto/);
            expect(SERVER_INSTRUCTIONS).toMatch(/apap:\/\/schema\/protocol\.cto/);
            expect(SERVER_INSTRUCTIONS).toMatch(/\$class/);
        });
    });

    describe('PROTOCOL_CTO', () => {
        it('decodes the embedded MODEL constant to the Concerto source', () => {
            expect(PROTOCOL_CTO).toContain('namespace org.accordproject.protocol');
        });
    });
});

// SEP-2549 ("CacheableResult", MCP 2026-07-28 RC) extends MCP
// ReadResourceResult.contents[] with `ttlMs` (number, milliseconds) and
// `cacheScope` ('public' | 'private') so caching proxies can honor per-resource
// freshness without inferring from URI patterns. See:
//   https://blog.modelcontextprotocol.io/posts/2026-07-28-release-candidate
//
// These tests pin the per-resource defaults that the MCP handler spreads into
// every contents[] entry it returns. Changing a value here is a wire-format
// change visible to every MCP client, so the defaults are codified explicitly
// rather than computed from a config file.
describe('SEP-2549 cache hints exposed by the MCP handler', () => {
    it('exports a CACHE_HINTS table keyed by resource kind', () => {
        // Five resource shapes are registered in mcp.ts: the template list,
        // single templates, the agreement list, single agreements, and the
        // bundled Concerto schema resource (apap://schema/protocol.cto).
        expect(Object.keys(CACHE_HINTS).sort()).toEqual([
            'agreementItem',
            'agreementList',
            'schema',
            'templateItem',
            'templateList',
        ]);
    });

    it('uses short private cache for the template list', () => {
        // Lists turn over whenever a new template is uploaded, and the visible
        // set may vary per-tenant once auth is wired in. 60s + private keeps a
        // single client snappy without leaking other tenants' rows through a
        // shared cache.
        expect(CACHE_HINTS.templateList.ttlMs).toBe(60_000);
        expect(CACHE_HINTS.templateList.cacheScope).toBe('private');
    });

    it('uses medium public cache for a single template', () => {
        // Single-template rows are addressed by id and the underlying .cta is
        // pinned by hash, so a 5min public TTL is safe across tenants until the
        // row itself gets a hash-based URI (the larger refactor tracked
        // separately).
        expect(CACHE_HINTS.templateItem.ttlMs).toBe(300_000);
        expect(CACHE_HINTS.templateItem.cacheScope).toBe('public');
    });

    it('uses short private cache for agreement list and single agreements', () => {
        // Agreements mutate on every trigger call, so freshness matters more
        // than reuse. Private scope avoids cross-tenant leakage once auth lands.
        expect(CACHE_HINTS.agreementList.ttlMs).toBe(30_000);
        expect(CACHE_HINTS.agreementList.cacheScope).toBe('private');
        expect(CACHE_HINTS.agreementItem.ttlMs).toBe(30_000);
        expect(CACHE_HINTS.agreementItem.cacheScope).toBe('private');
    });

    it('uses long public cache for the bundled Concerto schema resource', () => {
        // The Concerto model ships with the build via the base64 MODEL constant
        // in db/schema.ts, so it is identical for every tenant and only turns
        // over on redeploy. 24h public is safe and lets caching proxies serve
        // the schema aggressively.
        expect(CACHE_HINTS.schema.ttlMs).toBe(86_400_000);
        expect(CACHE_HINTS.schema.cacheScope).toBe('public');
    });

    it('uses only the SEP-2549 cacheScope vocabulary', () => {
        // Guard against typos creeping in (e.g. "user", "shared"); the spec
        // currently defines only two values.
        for (const hint of Object.values(CACHE_HINTS)) {
            expect(['public', 'private']).toContain(hint.cacheScope);
            expect(Number.isFinite(hint.ttlMs)).toBe(true);
            expect(hint.ttlMs).toBeGreaterThan(0);
        }
    });
});

describe('MCP HTTP Router', () => {
    let app: express.Application;

    beforeEach(() => {
        app = express();
        app.use(express.json());
        app.use('/', mcpRouter);
    });

    it('returns mcp-session-id header on initialization response', async () => {
        const res = await request(app)
            .post('/mcp')
            .set('Accept', 'application/json, text/event-stream')
            .send({
                jsonrpc: '2.0',
                id: 1,
                method: 'initialize',
                params: {
                    protocolVersion: '2025-03-26',
                    capabilities: {},
                    clientInfo: { name: 'test', version: '1.0' }
                }
            });
        expect(res.status).toBe(200);
        expect(res.headers['mcp-session-id']).toMatch(
            /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/
        );
    });
});
