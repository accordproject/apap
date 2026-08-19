import request from 'supertest';
import express from 'express';
import { jest } from '@jest/globals';

// Mock crypto.randomUUID
jest.mock('crypto', () => {
    const actualCrypto = jest.requireActual('crypto') as any;
    return {
        ...actualCrypto,
        randomUUID: jest.fn().mockReturnValue('test-session-123')
    };
});

// Mock the InMemoryEventStore before importing the router
jest.mock('./inmemoryeventstore', () => {
    return {
        InMemoryEventStore: jest.fn().mockImplementation(() => ({
            storeEvent: jest.fn<any>().mockResolvedValue('event-1'),
            replayEventsAfter: jest.fn<any>().mockResolvedValue(undefined),
        })),
    };
});

jest.mock('../services/agreementService', () => {
    const actual = jest.requireActual('../services/agreementService') as any;
    return { ...actual, createAgreement: jest.fn() };
});

import mcpRouter, {
    getServer,
    serviceErrorToCallToolResult,
    serviceErrorToResourceError,
    buildApiErrorMessage,
    pageOpts,
    PROTOCOL_CTO,
    SERVER_INSTRUCTIONS,
    CACHE_HINTS,
} from './mcp';
import { ProtocolError, ProtocolErrorCode, InMemoryTransport } from '@modelcontextprotocol/server';
import {
    AgreementConversionError,
    AgreementNotFoundError,
    ServiceError,
    TemplateNotFoundError,
    ValidationError,
} from '../services/errors';
import { Client } from '@modelcontextprotocol/client';
import * as agreementService from '../services/agreementService';

function createMockDb() {
    const mock: any = {
        _returnValue: [] as any[],
        select: jest.fn().mockReturnThis(),
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        insert: jest.fn().mockReturnThis(),
        values: jest.fn().mockReturnThis(),
        returning: jest.fn(function (this: any) {
            return Promise.resolve(this._returnValue);
        }),
        update: jest.fn().mockReturnThis(),
        set: jest.fn().mockReturnThis(),
        delete: jest.fn().mockReturnThis(),
    };
    mock.then = function (onFulfilled: any, onRejected: any) {
        return Promise.resolve(this._returnValue).then(onFulfilled, onRejected);
    };
    mock._setReturn = (val: any[]) => { mock._returnValue = val; };
    return mock;
}

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
        it('returns an ProtocolError with InvalidParams code for 404-style ServiceErrors', () => {
            const err = new TemplateNotFoundError('tmpl-1');
            const wrapped = serviceErrorToResourceError(err);

            expect(wrapped).toBeInstanceOf(ProtocolError);
            expect(wrapped.code).toBe(ProtocolErrorCode.InvalidParams);
            expect(wrapped.message).toContain('tmpl-1');

            const data = wrapped.data as { error: { code: string; message: string; details?: unknown } };
            expect(data.error.code).toBe('TEMPLATE_NOT_FOUND');
            expect(data.error.message).toContain('tmpl-1');
        });

        it('uses InternalError code for non-404 ServiceErrors', () => {
            const err = new ServiceError('CUSTOM', 500, 'kaboom', { reason: 'overflow' });
            const wrapped = serviceErrorToResourceError(err);

            expect(wrapped).toBeInstanceOf(ProtocolError);
            expect(wrapped.code).toBe(ProtocolErrorCode.InternalError);
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

// Paged MCP resource URIs (#217): `apap://templates{?limit,offset}` and
// `apap://agreements{?limit,offset}`. `pageOpts` is the pure parser that
// converts RFC 6570 form-style variables into safe integers for the service
// layer. The service-layer clamp ([1, 100]) is already covered by
// services/templateService.test.ts and services/agreementService.test.ts;
// these tests only pin the callback-plumbing shape and the parser boundaries.
describe('pageOpts parser for paged resource URIs', () => {
    it('parses numeric limit and offset strings', () => {
        expect(pageOpts({ limit: '50', offset: '100' })).toEqual({ limit: 50, offset: 100 });
    });

    it('returns undefined for absent variables so the service default applies', () => {
        expect(pageOpts({})).toEqual({ limit: undefined, offset: undefined });
        expect(pageOpts(undefined)).toEqual({ limit: undefined, offset: undefined });
    });

    it('returns undefined for empty-string variables (?limit=&offset=)', () => {
        expect(pageOpts({ limit: '', offset: '' })).toEqual({ limit: undefined, offset: undefined });
    });

    it('returns undefined for non-numeric garbage instead of NaN', () => {
        expect(pageOpts({ limit: 'abc', offset: 'xyz' })).toEqual({ limit: undefined, offset: undefined });
    });

    it('rejects parseInt-friendly garbage that would silently truncate', () => {
        // Strict-integer regex catches values that `parseInt(v, 10)` would
        // silently truncate to a plausible-looking integer. These should hit
        // the service default rather than accept a partial parse.
        expect(pageOpts({ limit: '50abc' })).toEqual({ limit: undefined, offset: undefined });
        expect(pageOpts({ limit: '50.5' })).toEqual({ limit: undefined, offset: undefined });
        expect(pageOpts({ limit: '1e2' })).toEqual({ limit: undefined, offset: undefined });
        expect(pageOpts({ offset: ' 50 ' })).toEqual({ limit: undefined, offset: 50 });
    });

    it('passes through out-of-range values so the service layer clamps them', () => {
        // No double-clamp here. Service-layer test coverage owns the [1, 100] cap.
        expect(pageOpts({ limit: '1000', offset: '-5' })).toEqual({ limit: 1000, offset: -5 });
        expect(pageOpts({ limit: '0' })).toEqual({ limit: 0, offset: undefined });
    });

    it('picks the first element when a variable is exploded into an array', () => {
        // RFC 6570 exploded form (`{?limit*}`) would surface as an array. We
        // aren't registering exploded params, but the callback signature admits
        // string | string[], so cover the branch defensively.
        expect(pageOpts({ limit: ['50', '75'] })).toEqual({ limit: 50, offset: undefined });
    });
});

describe('MCP Handler', () => {
    let app: express.Application;
    let mockDb: ReturnType<typeof createMockDb>;
    beforeEach(() => {
        jest.clearAllMocks();
        mockDb = createMockDb();

        app = express();
        app.use(express.json());
        app.use((req, res, next) => {
            res.locals.db = mockDb;
            next();
        });
        app.use('/', mcpRouter);
    });

    afterEach(() => {
        jest.restoreAllMocks();
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
        expect(res.headers['mcp-session-id']).toBe('test-session-123');
    });

    // =========================================================================
    // HTTP Boundaries — /mcp POST & GET
    // =========================================================================
    describe('HTTP Transport Boundaries', () => {

        it('POST /mcp returns 400 when no session ID and not an initialize request', async () => {
            const response = await request(app)
                .post('/mcp')
                .send({ jsonrpc: '2.0', method: 'tools/list', id: 1 })
                .expect(400);

            expect(response.body).toEqual({
                jsonrpc: '2.0',
                error: {
                    code: -32000,
                    message: 'Bad Request: No valid session ID provided',
                },
                id: null,
            });
        });

        // SSE transport dropped in SDK 2.0. `GET /sse` and `POST /messages`
        // routes no longer exist; former SSE tests removed as part of #221.
    });

    // =========================================================================
    // MCP Server Internal Logic using InMemoryTransport
    // =========================================================================
    describe('MCP Server Internal Logic', () => {
        let client: Client;
        let serverTransport: InMemoryTransport;
        let clientTransport: InMemoryTransport;

        beforeEach(async () => {
            // Setup in-memory transports
            const transports = InMemoryTransport.createLinkedPair();
            clientTransport = transports[0];
            serverTransport = transports[1];

            // Instantiate and connect server
            const mcpServer = getServer(mockDb);
            await mcpServer.connect(serverTransport);

            // Connect client
            client = new Client({ name: 'test-client', version: '1.0.0' }, { capabilities: {} });
            await client.connect(clientTransport);
        });

        afterEach(async () => {
            await client.close();
            jest.restoreAllMocks();
        });

        it('lists all registered tools', async () => {
            const result = await client.listTools();
            const toolNames = result.tools.map(t => t.name);

            expect(toolNames).toContain('convert-agreement-to-format');
            expect(toolNames).toContain('create-agreement');
            expect(toolNames).toContain('trigger-agreement');
            expect(toolNames).toContain('getTemplate');
            expect(toolNames).toContain('getAgreement');

            const createTool = result.tools.find(t => t.name === 'create-agreement');
            expect(createTool?.inputSchema).toEqual(expect.objectContaining({
                type: 'object',
                additionalProperties: false,
            }));
            expect((createTool?.inputSchema as any).properties.data).toBeDefined();
        });

        it('lists all registered resources', async () => {
            mockDb._setReturn([]);
            const result = await client.listResources();
            expect(result.resources).toBeDefined();
            expect(Array.isArray(result.resources)).toBe(true);
        });

        it('executes getTemplate tool correctly', async () => {
            const mockTemplate = { id: 1, uri: 'test://template/1', author: 'Test Author' };
            mockDb._setReturn([mockTemplate]);

            const result = await client.callTool({
                name: 'getTemplate',
                arguments: { templateId: '1' }
            });

            const content = result.content as any[];
            expect(content[0].type).toBe('text');
            const parsed = JSON.parse(content[0].text as string);
            expect(parsed.uri).toBe('test://template/1');
        });

        it('executes create-agreement with structured input and the injected database', async () => {
            const created = {
                id: 7,
                uri: 'urn:agreement:oa-ciiaa-001',
                template: 'https://openagreements.org/templates/openagreements-confidentiality-invention-assignment-agreement/v0.4.0',
                agreementStatus: 'DRAFT',
                data: { $class: 'org.openagreements.custom.CIIAA', contractId: 'oa-ciiaa-001' },
            };
            const createMock = agreementService.createAgreement as jest.MockedFunction<typeof agreementService.createAgreement>;
            createMock.mockResolvedValue(created as any);

            const input = {
                $class: 'org.accordproject.protocol@1.0.0.Agreement',
                uri: created.uri,
                template: created.template,
                agreementStatus: 'DRAFT' as const,
                data: created.data,
            };

            const result = await client.callTool({
                name: 'create-agreement',
                arguments: input,
            });

            expect(createMock).toHaveBeenCalledWith(mockDb, input);
            const content = result.content as any[];
            expect(JSON.parse(content[0].text).id).toBe(7);
        });

        it('rejects unknown create-agreement fields before the service runs', async () => {
            const createMock = agreementService.createAgreement as jest.MockedFunction<typeof agreementService.createAgreement>;

            const result = await client.callTool({
                name: 'create-agreement',
                arguments: {
                    uri: 'urn:agreement:unknown-field',
                    template: 'resource:org.accordproject.protocol@1.0.0.Template#urn:template:stored',
                    agreementStatus: 'DRAFT',
                    data: { $class: 'org.example.TemplateModel' },
                    id: 123,
                },
            });

            expect(result.isError).toBe(true);
            expect(createMock).not.toHaveBeenCalled();
        });

        it('normalizes create-agreement string data before invoking the service', async () => {
            const createMock = agreementService.createAgreement as jest.MockedFunction<typeof agreementService.createAgreement>;
            createMock.mockResolvedValue({ id: 8 } as any);
            const data = { $class: 'org.openagreements.custom.CIIAA', contractId: 'oa-ciiaa-string' };

            await client.callTool({
                name: 'create-agreement',
                arguments: {
                    uri: 'urn:agreement:oa-ciiaa-string',
                    template: 'resource:org.accordproject.protocol@1.0.0.Template#urn:template:stored',
                    agreementStatus: 'DRAFT',
                    data: JSON.stringify(data),
                },
            });

            expect(createMock).toHaveBeenCalledWith(mockDb, expect.objectContaining({ data }));
        });

        it.each([
            ['{not-json}', 'data string must be valid JSON'],
            ['[1,2]', 'data string must encode a JSON object'],
        ])('returns the custom create-agreement message for string data %p', async (data, message) => {
            const result = await client.callTool({
                name: 'create-agreement',
                arguments: {
                    uri: 'urn:agreement:invalid-string-data',
                    template: 'resource:org.accordproject.protocol@1.0.0.Template#urn:template:stored',
                    agreementStatus: 'DRAFT',
                    data,
                },
            });

            expect(result.isError).toBe(true);
            expect((result.content as any[])[0].text).toContain(message);
        });

        // A ServiceError raised by the shared service must come back as the typed
        // `{ code, message, details }` contract the sibling tools honour. Before the
        // service refactor this path threw out of the callback and the SDK handed
        // the client a raw exception string instead.
        it('returns create-agreement service failures as a typed MCP error', async () => {
            const createMock = agreementService.createAgreement as jest.MockedFunction<typeof agreementService.createAgreement>;
            createMock.mockRejectedValue(new ValidationError('Invalid request body', { errors: ['bad template'] }));

            const result = await client.callTool({
                name: 'create-agreement',
                arguments: {
                    uri: 'urn:agreement:bad',
                    template: 'ftp://example.com/t.cta',
                    agreementStatus: 'DRAFT' as const,
                    data: {},
                },
            });

            expect(result.isError).toBe(true);
            const payload = JSON.parse((result.content as any[])[0].text);
            expect(payload.error.code).toBe('VALIDATION_ERROR');
            expect(payload.error.details).toEqual({ errors: ['bad template'] });
        });

        it('executes trigger-agreement tool correctly', async () => {
            const mockTemplate = { id: 1, uri: 'test://template/1', author: 'Test Author' };
            mockDb._setReturn([mockTemplate]);

            (global as any).fetch = jest.fn<any>().mockResolvedValue({
                ok: true,
                json: async () => ({ result: { penalty: 20, buyerMayTerminate: false }, state: { count: 1 } }),
            });

            const payload = JSON.stringify({
                $class: 'io.clause.latedeliveryandpenalty@0.1.0.LateDeliveryAndPenaltyRequest',
                forceMajeure: false,
                agreedDelivery: '2024-01-01T00:00:00Z',
                deliveredAt: '2024-01-15T00:00:00Z',
                goodsValue: 1000
            });

            const result = await client.callTool({
                name: 'trigger-agreement',
                arguments: { agreementId: '1', payload }
            });

            const content = result.content as any[];
            expect(content[0].type).toBe('text');
        });

        // =====================================================================
        // Paged resource URIs — apap://templates{?limit,offset} (#217)
        // =====================================================================
        //
        // These tests pin the SDK dispatch shape: an exact-string static URI
        // hits the bare-URI callback (backwards compat with clients that don't
        // know about the paging surface); a URI with both `?limit=X&offset=Y`
        // hits the ResourceTemplate callback with the values threaded through
        // to the service.
        //
        // Service-layer clamping ([1, 100]) is verified in the service test
        // files; here we only verify what the mockDb chain was asked for, so
        // the assertion is `db.limit` / `db.offset` were called with the right
        // integers.
        describe('paged resource URIs (#217)', () => {
            const templateRow = { id: 1, uri: 'test://template/1', author: 'A' };
            const agreementRow = { id: 2, uri: 'test://agreement/2', data: { foo: 'bar' } };

            it('apap://templates?limit=50&offset=100 threads paging into the service', async () => {
                mockDb._setReturn([templateRow]);
                const result = await client.readResource({ uri: 'apap://templates?limit=50&offset=100' });

                expect(mockDb.limit).toHaveBeenCalledWith(50);
                expect(mockDb.offset).toHaveBeenCalledWith(100);
                expect(result.contents).toHaveLength(1);
                expect((result.contents[0] as any).uri).toBe('apap://templates/1');
            });

            // Regression guard for the stable-ordering fix Niall asked for in
            // his #243 review: if someone deletes `.orderBy(asc(Template.id))`
            // from `listTemplates` (or `.orderBy(asc(Agreement.id))` from
            // `listAgreements`), paged reads silently return unstable rows
            // between pages. This asserts the fluent chain saw `orderBy()` at
            // all; the specific column argument is owned by the service test
            // that pins the SQL construction. Same guard for templates and
            // agreements since both share the drop-risk.
            it('apap://templates paged read invokes .orderBy on the fluent chain (stable-order guard)', async () => {
                mockDb._setReturn([templateRow]);
                await client.readResource({ uri: 'apap://templates?limit=50&offset=100' });
                expect(mockDb.orderBy).toHaveBeenCalled();
            });

            it('apap://agreements paged read invokes .orderBy on the fluent chain (stable-order guard)', async () => {
                mockDb._setReturn([agreementRow]);
                await client.readResource({ uri: 'apap://agreements?limit=50&offset=100' });
                expect(mockDb.orderBy).toHaveBeenCalled();
            });

            // Cache-hint inheritance from #201 is verified by code reading:
            // both paged callbacks route through the shared `getTemplates` /
            // `getAgreements` functions (mcp.ts:325, mcp.ts:333) that spread
            // `...CACHE_HINTS.templateList` / `.agreementList` (mcp.ts:227,
            // mcp.ts:258) into each content entry. Adding a runtime assertion
            // here fails today because the SDK's `ReadResourceResult` schema
            // strips top-level non-standard fields (pre-existing #199/#201
            // shape issue, out of scope for #217).

            it('apap://templates?limit=1000 clamps to 100 via the service', async () => {
                // pageOpts passes 1000 through; the service clamps to 100.
                mockDb._setReturn([]);
                await client.readResource({ uri: 'apap://templates?limit=1000&offset=0' });

                expect(mockDb.limit).toHaveBeenCalledWith(100);
                expect(mockDb.offset).toHaveBeenCalledWith(0);
            });

            it('apap://templates?limit=0 clamps to 1 via the service', async () => {
                mockDb._setReturn([]);
                await client.readResource({ uri: 'apap://templates?limit=0&offset=0' });

                expect(mockDb.limit).toHaveBeenCalledWith(1);
                expect(mockDb.offset).toHaveBeenCalledWith(0);
            });

            it('apap://templates (bare URI) still returns limit=100 offset=0 (backwards compat)', async () => {
                mockDb._setReturn([templateRow]);
                const result = await client.readResource({ uri: 'apap://templates' });

                expect(mockDb.limit).toHaveBeenCalledWith(100);
                expect(mockDb.offset).toHaveBeenCalledWith(0);
                expect(result.contents).toHaveLength(1);
            });

            it('apap://agreements?limit=50&offset=100 threads paging into the service', async () => {
                mockDb._setReturn([agreementRow]);
                const result = await client.readResource({ uri: 'apap://agreements?limit=50&offset=100' });

                expect(mockDb.limit).toHaveBeenCalledWith(50);
                expect(mockDb.offset).toHaveBeenCalledWith(100);
                expect(result.contents).toHaveLength(1);
                expect((result.contents[0] as any).uri).toBe('apap://agreements/2');
            });

            it('apap://agreements (bare URI) still returns limit=100 offset=0 (backwards compat)', async () => {
                mockDb._setReturn([agreementRow]);
                const result = await client.readResource({ uri: 'apap://agreements' });

                expect(mockDb.limit).toHaveBeenCalledWith(100);
                expect(mockDb.offset).toHaveBeenCalledWith(0);
                expect(result.contents).toHaveLength(1);
            });

            // Empty query-string values (`?limit=&offset=`): the SDK's
            // UriTemplate regex requires `=([^&]+)` per param — non-empty is
            // mandatory. So this URI matches NEITHER the static exact-URI
            // resource nor the template, and the SDK raises
            // ResourceNotFoundError. Pin the behavior so we notice if the SDK
            // ever loosens it (in which case pageOpts' empty-string branch
            // would take over and default to full-page).
            it('apap://templates?limit=&offset= surfaces the SDK ResourceNotFoundError', async () => {
                await expect(
                    client.readResource({ uri: 'apap://templates?limit=&offset=' }),
                ).rejects.toThrow(/apap:\/\/templates\?limit=&offset=/);
            });

            // Partial URI (offset param entirely absent, not empty). The SDK's
            // UriTemplate regex for `{?limit,offset}` compiles both params as
            // required and non-empty, so this URI matches NEITHER the static
            // exact-URI resource nor the template — the SDK raises
            // ResourceNotFoundError. Same failure shape as the empty-string
            // case above; pinned separately because "param absent" and "param
            // empty" are different SDK code paths.
            it('apap://templates?limit=50 (partial URI, offset absent) surfaces ResourceNotFoundError', async () => {
                await expect(
                    client.readResource({ uri: 'apap://templates?limit=50' }),
                ).rejects.toThrow(/apap:\/\/templates\?limit=50/);
            });
        });
    });
});
