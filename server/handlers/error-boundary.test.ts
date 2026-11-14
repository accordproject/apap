import express from 'express';
import request from 'supertest';
import { DrizzleQueryError } from 'drizzle-orm';
import { Client } from '@modelcontextprotocol/client';
import { InMemoryTransport } from '@modelcontextprotocol/server';
import { AgreementConversionError, AgreementTriggerError, InvalidPayloadError, ServiceError, ValidationError, InsufficientScopeError, NumericAgreementNotFoundError, NumericTemplateNotFoundError, MalformedToolPayloadError, MissingArchiveBodyError, NumericTemplateImmutableError, NumericTemplateInUseError, NumericAgreementTemplateBindingImmutableError } from '../services/errors';
import { createLegacyPolicyContext, createPolicyContext, ScopeAuthorizationPolicy } from '../services/policy';
import { AuthenticatedPrincipal } from '../auth/types';
import { globalErrorHandler } from '../middleware/errorHandler';
import agreementRouter from './agreements';
import templateRouter from './templates';
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
        expect(log).toHaveBeenCalledWith(expect.objectContaining({ error }));
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
            if (!(error instanceof ServiceError)) expect(log).toHaveBeenCalledWith(expect.objectContaining({ error }));
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
            expect(JSON.stringify(result)).toContain('apap:agreements:read');
            expect(JSON.stringify(result)).toContain('agreements:read');
            expect(JSON.stringify(result)).not.toContain(marker);
        } finally { await client.close(); await server.close(); }
    });

    it('returns the trusted scope denial as HTTP 403 with action and scope', async () => {
        const context = createPolicyContext(database(new Error(marker)), new AuthenticatedPrincipal('test', undefined, [], [], {}));
        const app = express();
        app.get('/', (_req, _res, next) => {
            try { new ScopeAuthorizationPolicy().authorize(context, 'agreements:read', { type: 'agreement', id: 1 }); }
            catch (error) { next(error); }
        });
        app.use(globalErrorHandler);
        const response = await request(app).get('/');
        expect(response.status).toBe(403);
        expect(response.body.error).toMatchObject({ code: 'INSUFFICIENT_SCOPE', details: { action: 'agreements:read', requiredScope: 'apap:agreements:read' } });
    });

    it('does not expose arbitrary fields on trusted error instances', () => {
        const errors = [
            new InsufficientScopeError(marker as any),
            new NumericAgreementNotFoundError(marker as any),
            new NumericTemplateNotFoundError(marker as any),
            new MalformedToolPayloadError(),
            new MissingArchiveBodyError(),
        ];
        for (const error of errors) {
            Object.assign(error, { message: marker, details: { action: marker, identifier: marker, nested: { marker } } });
            const tool = serviceErrorToCallToolResult(error);
            const resource = serviceErrorToResourceError(error);
            expect(JSON.stringify([tool, { message: resource.message, data: resource.data }])).not.toContain(marker);
        }
    });

    it.each([
        [new NumericAgreementNotFoundError(1), 'AGREEMENT_NOT_FOUND', 'Agreement not found: 1'],
        [new NumericTemplateNotFoundError(2), 'TEMPLATE_NOT_FOUND', 'Template not found: 2'],
        [new MalformedToolPayloadError(), 'INVALID_PAYLOAD', 'Payload must be valid JSON'],
        [new MissingArchiveBodyError(), 'INVALID_PAYLOAD', 'Missing .cta archive body'],
    ])('preserves trusted diagnostic %s', async (error, code, message) => {
        const app = express(); app.get('/', (_req, _res, next) => next(error)); app.use(globalErrorHandler);
        const response = await request(app).get('/');
        expect(response.status).toBe(error.statusCode);
        expect(response.body.error).toMatchObject({ code, message });
        if (code === 'AGREEMENT_NOT_FOUND' || code === 'TEMPLATE_NOT_FOUND') {
            expect(response.body.error.details.identifier).toBe(code === 'AGREEMENT_NOT_FOUND' ? '1' : '2');
        }
        expect(JSON.stringify(serviceErrorToCallToolResult(error))).toContain(message);
    });

    it('returns the established missing archive diagnostic over HTTP', async () => {
        const app = express(); app.use('/templates', templateRouter); app.use(globalErrorHandler);
        const response = await request(app).post('/templates/archive');
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ error: { code: 'INVALID_PAYLOAD', message: 'Missing .cta archive body' } });
    });

    it.each([
        [new NumericTemplateImmutableError(7), 'TEMPLATE_IMMUTABLE', 'Template 7 is immutable: content cannot be changed after creation. Create a new template for a new version.', { identifier: 7 }],
        [new NumericTemplateInUseError(8), 'TEMPLATE_IN_USE', 'Template 8 cannot be deleted: still referenced by at least one agreement', { identifier: 8 }],
        [new NumericAgreementTemplateBindingImmutableError(9), 'AGREEMENT_TEMPLATE_BINDING_IMMUTABLE', 'Agreement 9 cannot change its template while it is bound to a cached archive', { agreementId: 9, field: 'template' }],
    ])('reconstructs a client-safe conflict: %s', async (error, code, message, details) => {
        Object.assign(error, { message: marker, details: { ...details, field: marker, nested: { marker } }, cause: new Error(marker) });
        const app = express(); app.get('/', (_req, _res, next) => next(error)); app.use(globalErrorHandler);
        const response = await request(app).get('/');
        expect(response.status).toBe(409);
        expect(response.body).toEqual({ error: { code, message, details } });
        const tool = serviceErrorToCallToolResult(error);
        expect(JSON.parse((tool.content[0] as { text: string }).text)).toEqual(response.body);
        expect(JSON.stringify([response.body, tool])).not.toContain(marker);
    });

    it.each([NumericTemplateImmutableError, NumericTemplateInUseError, NumericAgreementTemplateBindingImmutableError])('rejects untrusted conflict identifier for %s', (ErrorType) => {
        const error = new ErrorType(marker as any);
        Object.assign(error, { message: marker, details: { identifier: marker, agreementId: marker, field: marker } });
        expect(JSON.stringify(serviceErrorToCallToolResult(error))).not.toContain(marker);
    });

    it.each([NumericTemplateImmutableError, NumericTemplateInUseError, NumericAgreementTemplateBindingImmutableError])('limits public conflict IDs to the database range for %s', (ErrorType) => {
        for (const id of [-1, 2147483648, 1.5]) {
            const result = JSON.stringify(serviceErrorToCallToolResult(new ErrorType(id)));
            expect(result).not.toContain(String(id));
        }
        expect(JSON.stringify(serviceErrorToCallToolResult(new ErrorType(2147483647)))).toContain('2147483647');
    });

    it('logs the original SQL failure with stack and cause without returning it to REST or MCP clients', async () => {
        const cause = new Error('synthetic-driver-cause');
        const error = new DrizzleQueryError('SELECT synthetic_sql', ['synthetic_parameter'], cause);
        const app = express();
        app.use((_req, res, next) => { res.locals.db = database(error); next(); });
        app.use('/agreements', agreementRouter); app.use(globalErrorHandler);
        const response = await request(app).get('/agreements/1');
        expect(response.status).toBe(500);
        expect(log).toHaveBeenCalledWith(expect.objectContaining({ error }));
        expect(error.stack).toBeTruthy();
        expect(error.cause).toBe(cause);
        const transports = InMemoryTransport.createLinkedPair();
        const server = getServer(createLegacyPolicyContext(database(error)));
        const client = new Client({ name: 'test', version: '1' }, { capabilities: {} });
        await server.connect(transports[1]); await client.connect(transports[0]);
        try {
            const result = await client.callTool({ name: 'getAgreement', arguments: { agreementId: '1' } });
            expect(result.isError).toBe(true);
            expect(log).toHaveBeenCalledWith(expect.objectContaining({ type: 'mcp_operation_failed', error }));
            for (const sentinel of ['synthetic_sql', 'synthetic_parameter', 'synthetic-driver-cause']) {
                expect(JSON.stringify([response.body, result])).not.toContain(sentinel);
            }
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

    it('logs a trigger error and its original cause without exposing it', async () => {
        const cause = new Error(marker);
        const error = new AgreementTriggerError('1', marker, cause);
        const spy = jest.spyOn(agreementService, 'triggerAgreement').mockRejectedValueOnce(error);
        try {
            const app = express(); app.use(express.json());
            app.use((_req, res, next) => { res.locals.db = database(cause); next(); });
            app.use('/agreements', agreementRouter); app.use(globalErrorHandler);
            const response = await request(app).post('/agreements/1/trigger').send({});
            expect(response.status).toBe(200);
            expect(JSON.stringify(response.body)).not.toContain(marker);
            expect(log).toHaveBeenCalledWith(expect.objectContaining({ error }));
            expect((error as Error & { cause?: unknown }).cause).toBe(cause);
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
