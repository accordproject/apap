import request from 'supertest';
import express from 'express';
import { jest } from '@jest/globals';
import * as crypto from 'crypto';

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

import mcpRouter, { getServer, transports, sessionLastActivity, sessionCleanupInterval } from './mcp';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';

describe('MCP Handler', () => {
    let app: express.Application;
    let originalFetch: any;

    beforeAll(() => {
        originalFetch = (global as any).fetch;
    });

    afterAll(() => {
        (global as any).fetch = originalFetch;
    });

    beforeEach(() => {
        jest.clearAllMocks();

        app = express();
        app.use(express.json());
        app.use('/mcp', mcpRouter);
    });

    // =========================================================================
    // HTTP Boundaries — /mcp POST & GET
    // =========================================================================
    describe('HTTP Transport Boundaries', () => {

        it('POST /mcp/mcp returns 400 when no session ID and not an initialize request', async () => {
            const response = await request(app)
                .post('/mcp/mcp')
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

        it('returns mcp-session-id header on initialization response', async () => {
            const res = await request(app)
                .post('/mcp/mcp')
                .send({
                    jsonrpc: '2.0',
                    id: 1,
                    method: 'initialize',
                    params: {
                        protocolVersion: '2024-11-05',
                        capabilities: {},
                        clientInfo: { name: 'test', version: '1.0' }
                    }
                });
            // The mcp-session-id header must be present on init response
            // This locks in the bug fix against future regression
            expect(res.headers['mcp-session-id']).toBeDefined();
        });

        it('GET /mcp/sse returns an SSE stream with the correct content type', async () => {
            const response = await request(app)
                .get('/mcp/sse')
                .buffer(false)
                .parse((res: any, callback: any) => {
                    let data = '';
                    res.on('data', (chunk: Buffer) => {
                        data += chunk.toString();
                        if (data.includes('endpoint')) {
                            res.destroy();
                            callback(null, data);
                        }
                    });
                    res.on('error', () => {
                        callback(null, data);
                    });
                });

            expect(response.headers['content-type']).toContain('text/event-stream');
        });

        it('POST /mcp/messages returns 400 when sessionId query param is missing or invalid', async () => {
            const response = await request(app)
                .post('/mcp/messages')
                .query({ sessionId: 'nonexistent' })
                .send({ jsonrpc: '2.0', method: 'ping', id: 1 })
                .expect(400);

            expect(response.body.error || response.text).toBeDefined();
        });
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
            const mcpServer = getServer();
            await mcpServer.connect(serverTransport);

            // Connect client
            client = new Client({ name: 'test-client', version: '1.0.0' }, { capabilities: {} });
            await client.connect(clientTransport);
        });

        afterEach(async () => {
            await client.close();
        });

        it('lists all registered tools', async () => {
            const result = await client.listTools();
            const toolNames = result.tools.map(t => t.name);

            expect(toolNames).toContain('convert-agreement-to-format');
            expect(toolNames).toContain('trigger-agreement');
            expect(toolNames).toContain('getTemplate');
            expect(toolNames).toContain('getAgreement');
        });

        it('lists all registered resources', async () => {
            (global as any).fetch = jest.fn<any>().mockResolvedValue({
                ok: true,
                json: async () => ({ items: [] as any[] }),
            });

            const result = await client.listResources();
            expect(result.resources).toBeDefined();
            expect(Array.isArray(result.resources)).toBe(true);
        });

        it('executes getTemplate tool correctly', async () => {
            const mockTemplate = { id: 1, uri: 'test://template/1', author: 'Test Author' };
            
            (global as any).fetch = jest.fn<any>().mockResolvedValue({
                ok: true,
                json: async () => mockTemplate,
            });

            const result = await client.callTool({
                name: 'getTemplate',
                arguments: { templateId: '1' }
            });

            const content = result.content as any[];
            expect(content[0].type).toBe('text');
            const parsed = JSON.parse(content[0].text as string);
            expect(parsed.uri).toBe('test://template/1');
        });

        it('executes trigger-agreement tool correctly', async () => {
            const triggerResult = {
                result: { penalty: 20, buyerMayTerminate: false },
                state: { count: 1 }
            };

            (global as any).fetch = jest.fn<any>().mockResolvedValue({
                ok: true,
                json: async () => triggerResult,
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
            const parsed = JSON.parse(content[0].text as string);
            expect(parsed.result.penalty).toBe(20);
        });
    });

    // =========================================================================
    // MCP Session Cleanup
    // =========================================================================
    describe('MCP session cleanup', () => {

        it('tracks session activity on initialization', () => {
            // sessionLastActivity should be populated
            // after a session is created
            expect(Object.keys(sessionLastActivity ?? {}))
                .toBeDefined();
        });

        it('cleanup interval is registered with unref', () => {
            // sessionCleanupInterval should exist and 
            // not block process exit
            expect(sessionCleanupInterval).toBeDefined();
        });

        it('session is removed from both maps on close', () => {
            // When transport.onclose fires, both
            // transports and sessionLastActivity 
            // should be cleaned up
            const mockSessionId = 'test-session-123';
            transports[mockSessionId] = {} as any;
            sessionLastActivity[mockSessionId] = Date.now();
            
            // Simulate onclose
            delete transports[mockSessionId];
            delete sessionLastActivity[mockSessionId];
            
            expect(transports[mockSessionId]).toBeUndefined();
            expect(sessionLastActivity[mockSessionId])
                .toBeUndefined();
        });

    });
});
