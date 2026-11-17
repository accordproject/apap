import express from 'express';
import request from 'supertest';
import { DrizzleQueryError } from 'drizzle-orm';

// Set production mode before loading APAP modules, including its HTTP handlers.
const previousEnv = process.env.NODE_ENV;
process.env.NODE_ENV = 'production';
const templateRouter = require('./templates').default;
const mcpRouter = require('./mcp').default;
const { globalErrorHandler } = require('../middleware/errorHandler');
const { createLegacyPolicyContext } = require('../services/policy');

describe('production HTTP error boundaries', () => {
    const sql = 'SELECT synthetic_http_sql FROM synthetic_http_table WHERE id = $1';
    const parameter = 'synthetic_http_parameter';
    const causeMarker = 'synthetic_http_driver_cause';
    const stackMarker = 'synthetic_http_stack';
    let error: DrizzleQueryError;
    let select: jest.Mock;
    let log: jest.SpyInstance;
    let app: express.Express;

    beforeEach(() => {
        expect(process.env.NODE_ENV).toBe('production');
        const cause = new Error(causeMarker);
        error = new DrizzleQueryError(sql, [parameter], cause);
        error.stack = stackMarker;
        const db: any = {
            select: jest.fn().mockReturnThis(), from: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(), limit: jest.fn().mockRejectedValue(error),
        };
        select = db.select;
        log = jest.spyOn(console, 'error').mockImplementation(() => {});
        app = express();
        app.use(express.json());
        app.use((_req, res, next) => { res.locals.db = db; res.locals.policyContext = createLegacyPolicyContext(db); next(); });
        app.use('/templates', templateRouter);
        app.use('/', mcpRouter);
        app.use(globalErrorHandler);
    });

    afterEach(() => log.mockRestore());
    afterAll(() => { if (previousEnv === undefined) delete process.env.NODE_ENV; else process.env.NODE_ENV = previousEnv; });

    function expectSanitized(body: string) {
        for (const marker of [sql, 'synthetic_http_table', parameter, causeMarker, stackMarker]) {
            expect(body).not.toContain(marker);
        }
        expect(log).toHaveBeenCalledWith(expect.objectContaining({ error }));
        expect(error.stack).toBe(stackMarker);
        expect((error.cause as Error).message).toBe(causeMarker);
        expect(select).toHaveBeenCalled();
    }

    it('sanitizes unexpected template lookup errors over REST HTTP', async () => {
        const response = await request(app).get('/templates/1');
        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: 'An internal error occurred' });
        expectSanitized(response.text);
    });

    it.each(['apap://agreements/1', 'apap://templates/1'])('sanitizes %s resource failures over MCP Streamable HTTP', async (uri) => {
        const accept = 'application/json, text/event-stream';
        const init = await request(app).post('/mcp').set('Accept', accept).send({ jsonrpc: '2.0', id: 1, method: 'initialize', params: { protocolVersion: '2025-03-26', capabilities: {}, clientInfo: { name: 'boundary-test', version: '1' } } });
        const session = init.headers['mcp-session-id'];
        expect(session).toBeTruthy();
        try {
            await request(app).post('/mcp').set('mcp-session-id', session).set('Accept', accept).send({ jsonrpc: '2.0', method: 'notifications/initialized' });
            const response = await request(app).post('/mcp').set('mcp-session-id', session).set('Accept', accept).send({ jsonrpc: '2.0', id: 2, method: 'resources/read', params: { uri } });
            expect(response.status).toBe(200);
            const line = response.text.split(/\r?\n/).find((value) => value.startsWith('data: '));
            expect(line).toBeDefined();
            const payload = JSON.parse(line!.slice(6));
            expect(payload.error).toMatchObject({ code: -32603, message: expect.stringContaining('An internal error occurred') });
            expectSanitized(response.text);
        } finally {
            await request(app).delete('/mcp').set('mcp-session-id', session).set('Accept', accept);
        }
    });
});
