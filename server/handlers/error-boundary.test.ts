import express from 'express';
import request from 'supertest';
import { DrizzleQueryError } from 'drizzle-orm';
import { Client } from '@modelcontextprotocol/client';
import { InMemoryTransport } from '@modelcontextprotocol/server';
import { AgreementConversionError, InvalidPayloadError, ServiceError } from '../services/errors';
import { createLegacyPolicyContext, createPolicyContext } from '../services/policy';
import { AuthenticatedPrincipal } from '../auth/types';
import { globalErrorHandler } from '../middleware/errorHandler';
import agreementRouter from './agreements';
import { getServer } from './mcp';

const marker = 'sensitive_test_marker';
const failures = [
    new DrizzleQueryError(`SELECT ${marker}`, [marker], new Error(marker)),
    new Error(marker),
    Object.assign(new Error(marker), { cause: new Error(marker) }),
    new AgreementConversionError(1, 'html', marker),
    new Error(),
];

function database(error: unknown) {
    const db: any = {
        select: () => db, from: () => db, where: () => db,
        limit: () => ({ then: (resolve: any, reject: any) => Promise.reject(error).then(resolve, reject), offset: () => Promise.reject(error) }),
        orderBy: () => db,
    };
    return db;
}

describe('internal error boundaries', () => {
    let log: jest.SpyInstance;
    const previousEnv = process.env.NODE_ENV;
    beforeEach(() => { process.env.NODE_ENV = 'production'; log = jest.spyOn(console, 'error').mockImplementation(() => {}); });
    afterEach(() => { log.mockRestore(); if (previousEnv === undefined) delete process.env.NODE_ENV; else process.env.NODE_ENV = previousEnv; });

    it.each(failures)('sanitizes REST failures: %s', async (error) => {
        const app = express();
        app.use((req, res, next) => { res.locals.db = database(error); next(); });
        app.use('/agreements', agreementRouter);
        app.use(globalErrorHandler);
        const res = await request(app).get('/agreements/1');
        expect(res.status).toBe(500);
        expect(JSON.stringify(res.body)).not.toContain(marker);
        expect(JSON.stringify(log.mock.calls)).not.toContain(marker);
    });

    it.each(failures)('sanitizes MCP tool and resource failures: %s', async (error) => {
        const transports = InMemoryTransport.createLinkedPair();
        const server = getServer(createLegacyPolicyContext(database(error)));
        const client = new Client({ name: 'test', version: '1' }, { capabilities: {} });
        await server.connect(transports[1]);
        await client.connect(transports[0]);
        try {
            const result = await client.callTool({ name: 'getAgreement', arguments: { agreementId: '1' } });
            expect(result.isError).toBe(true);
            expect(JSON.stringify(result)).not.toContain(marker);
            await expect(client.readResource({ uri: 'apap://agreements/1' })).rejects.not.toThrow(marker);
            await expect(client.readResource({ uri: 'apap://agreements' })).rejects.not.toThrow(marker);
        } finally { await client.close(); await server.close(); }
    });

    it('retains explicitly safe errors and strips untrusted details', async () => {
        const app = express();
        app.get('/', (_req, _res, next) => next(new InvalidPayloadError('Invalid request', { reason: marker })));
        app.use(globalErrorHandler);
        const res = await request(app).get('/');
        expect(res.status).toBe(400);
        expect(res.body.error).toEqual({ code: 'INVALID_PAYLOAD', message: 'Invalid request' });
        expect(JSON.stringify(res.body)).not.toContain(marker);
    });

    it('preserves scope denial without reading the database', async () => {
        const db = database(new Error(marker));
        const principal = new AuthenticatedPrincipal('test', undefined, [], [], {});
        const transports = InMemoryTransport.createLinkedPair();
        const server = getServer(createPolicyContext(db, principal));
        const client = new Client({ name: 'test', version: '1' }, { capabilities: {} });
        await server.connect(transports[1]); await client.connect(transports[0]);
        try {
            const result = await client.callTool({ name: 'getAgreement', arguments: { agreementId: '1' } });
            expect(result.isError).toBe(true);
            expect(JSON.stringify(result)).toContain('INSUFFICIENT_SCOPE');
            expect(JSON.stringify(result)).not.toContain(marker);
        } finally { await client.close(); await server.close(); }
    });

    it('does not trust an unknown typed error', async () => {
        const app = express();
        app.get('/', (_req, _res, next) => next(new ServiceError('UNREVIEWED', 422, marker, { secret: marker })));
        app.use(globalErrorHandler);
        const res = await request(app).get('/');
        expect(res.status).toBe(422);
        expect(JSON.stringify(res.body)).not.toContain(marker);
    });
});
