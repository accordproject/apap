import express from 'express';
import request from 'supertest';
import { DrizzleQueryError } from 'drizzle-orm';
import { Client } from '@modelcontextprotocol/client';
import { InMemoryTransport } from '@modelcontextprotocol/server';
import { AgreementConversionError, InvalidPayloadError, ServiceError, ValidationError } from '../services/errors';
import { createLegacyPolicyContext, createPolicyContext } from '../services/policy';
import { AuthenticatedPrincipal } from '../auth/types';
import { globalErrorHandler } from '../middleware/errorHandler';
import agreementRouter from './agreements';
import * as agreementService from '../services/agreementService';
import { getServer, serviceErrorToCallToolResult, serviceErrorToResourceError } from './mcp';

const marker = 'sensitive_test_marker';
const failures = [
    new DrizzleQueryError(`SELECT ${marker}`, [marker], new Error(marker)),
    new Error(marker),
    Object.assign(new Error(marker), { code: 'XX000' }),
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
        expect(res.body.error).toEqual({ code: 'INVALID_PAYLOAD', message: 'Invalid request payload' });
        expect(JSON.stringify(res.body)).not.toContain(marker);
    });

    it('preserves safe validation context while removing unsafe details', async () => {
        const app = express();
        app.get('/input', (_req, _res, next) => next(new InvalidPayloadError('Invalid request', { agreementId: 1, reason: marker })));
        app.get('/validation', (_req, _res, next) => next(new ValidationError('Validation failed', {
            agreementId: 1, errors: [{ message: 'Expected value at path `$.amount` to be of type `String`' }, { message: marker }],
        })));
        app.use(globalErrorHandler);
        const input = await request(app).get('/input');
        expect(input.status).toBe(400);
        expect(input.body.error.details).toEqual({ agreementId: 1 });
        const validation = await request(app).get('/validation');
        expect(validation.status).toBe(422);
        expect(validation.body.error.details).toEqual({ agreementId: 1 });
        expect(JSON.stringify([input.body, validation.body])).not.toContain(marker);
    });

    it('does not trust an internal-looking diagnostic in typed validation details', async () => {
        const app = express();
        app.get('/', (_req, _res, next) => next(new ValidationError('Validation failed', {
            errors: [{ message: `Expected value at path \`$.${marker}\` to be of type \`String\`` }],
        })));
        app.use(globalErrorHandler);
        const res = await request(app).get('/');
        expect(res.status).toBe(422);
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

    it('does not expose an untrusted ServiceError code through REST or MCP', async () => {
        const error = new ServiceError(marker, 422, marker, { nested: { reason: marker } });
        const app = express(); app.get('/', (_req, _res, next) => next(error)); app.use(globalErrorHandler);
        const response = await request(app).get('/');
        const tool = serviceErrorToCallToolResult(error);
        const resource = serviceErrorToResourceError(error);
        expect(response.status).toBe(422);
        expect(response.body.error.code).toBe('INTERNAL_ERROR');
        expect(JSON.stringify([response.body, tool, { message: resource.message, data: resource.data }])).not.toContain(marker);
        expect(tool.isError).toBe(true);
    });

    it('does not expose arbitrary messages in an allowlisted validation error', async () => {
        const error = new InvalidPayloadError(marker, { reason: marker });
        const app = express(); app.get('/', (_req, _res, next) => next(error)); app.use(globalErrorHandler);
        const response = await request(app).get('/');
        const tool = serviceErrorToCallToolResult(error);
        expect(JSON.stringify([response.body, tool])).not.toContain(marker);
    });

    it('sanitizes an unsafe invalid payload in the legacy trigger envelope', async () => {
        const spy = jest.spyOn(agreementService, 'triggerAgreement').mockRejectedValueOnce(new InvalidPayloadError(marker, { reason: marker }));
        try {
            const app = express(); app.use(express.json());
            app.use((_req, res, next) => { res.locals.db = database(new Error(marker)); next(); });
            app.use('/agreements', agreementRouter); app.use(globalErrorHandler);
            const response = await request(app).post('/agreements/1/trigger').send({});
            expect(response.status).toBe(200);
            expect(response.body).toEqual({ isError: true, errorMessage: 'Invalid request payload', errorDetails: 'Invalid request payload' });
            expect(JSON.stringify(response.body)).not.toContain(marker);
        } finally { spy.mockRestore(); }
    });

    it.each([
        ['TEMPLATE_NOT_FOUND', 'Template not found'], ['AGREEMENT_NOT_FOUND', 'Agreement not found'],
        ['TEMPLATE_DUPLICATE', 'Template already exists'], ['TEMPLATE_IMMUTABLE', 'Template is immutable'],
        ['TEMPLATE_IN_USE', 'Template is in use'], ['AGREEMENT_RECORD_IMMUTABLE', 'Agreement record is immutable'],
        ['AGREEMENT_STATUS_TRANSITION_INVALID', 'Invalid agreement status transition'],
        ['AGREEMENT_TEMPLATE_BINDING_IMMUTABLE', 'Agreement template binding is immutable'],
        ['INVALID_PAYLOAD', 'Invalid request payload'], ['VALIDATION_ERROR', 'Validation failed'],
        ['INSUFFICIENT_SCOPE', 'Insufficient scope'], ['TEMPLATE_CICERO_VERSION_MISMATCH', 'Template Cicero version is not supported'],
    ])('uses fixed public message for %s', async (code, message) => {
        const error = Object.assign(new ServiceError(code, 400, marker, { nested: { secret: marker }, reason: marker }), { clientSafe: true });
        const app = express(); app.get('/', (_req, _res, next) => next(error)); app.use(globalErrorHandler);
        const response = await request(app).get('/');
        const tool = serviceErrorToCallToolResult(error);
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ error: { code, message, ...(code === 'AGREEMENT_TEMPLATE_BINDING_IMMUTABLE' ? { details: { field: 'template' } } : {}) } });
        expect(JSON.stringify([response.body, tool])).not.toContain(marker);
    });

    it('does not trust a forged allowlisted ServiceError', async () => {
        const error = new ServiceError('TEMPLATE_NOT_FOUND', 404, marker, { nested: { reason: marker } });
        const app = express(); app.get('/', (_req, _res, next) => next(error)); app.use(globalErrorHandler);
        const response = await request(app).get('/');
        const tool = serviceErrorToCallToolResult(error);
        expect(response.status).toBe(404);
        expect(JSON.stringify([response.body, tool])).not.toContain(marker);
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
