import express from 'express';
import request from 'supertest';
import { DrizzleQueryError } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';
import { pgTable, serial, text } from 'drizzle-orm/pg-core';
import { asyncHandler, globalErrorHandler } from './errorHandler';
import { ServiceError, TemplateDuplicateError } from '../services/errors';

describe('globalErrorHandler', () => {
    const query = 'insert into private_table';
    const parameter = 'private-bound-value';
    let log: jest.SpyInstance;
    const originalEnv = process.env.NODE_ENV;

    beforeEach(() => {
        log = jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        log.mockRestore();
        if (originalEnv === undefined) delete process.env.NODE_ENV;
        else process.env.NODE_ENV = originalEnv;
    });

    function appFor(error: unknown) {
        const app = express();
        app.get('/', (_req, _res, next) => next(error));
        app.use(globalErrorHandler);
        return app;
    }

    it.each(['production', 'development'])('maps real Drizzle wrapping to 409 without SQL/params in %s', async (env) => {
        process.env.NODE_ENV = env;
        const driverError = Object.assign(new Error('duplicate private_constraint'), { code: '23505' });
        const unsafe = jest.fn(() => ({ values: () => Promise.reject(driverError) }));
        // Keep Drizzle's execution/wrapping real; substitute only postgres-js I/O.
        const db = drizzle({ options: { parsers: {}, serializers: {} }, unsafe } as any);
        const table = pgTable('private_table', { id: serial().primaryKey(), value: text() });
        let failure: unknown;
        try {
            await db.insert(table).values({ value: parameter }).returning();
        } catch (error) {
            failure = error;
        }
        expect(unsafe).toHaveBeenCalled();
        expect(failure).toBeInstanceOf(DrizzleQueryError);
        expect((failure as DrizzleQueryError).cause).toBe(driverError);

        const response = await request(appFor(failure)).get('/');
        expect(response.status).toBe(409);
        expect(response.body).toEqual({ error: 'Conflict', details: 'A resource with this unique identifier already exists.' });
        const output = JSON.stringify({ body: response.body, logs: log.mock.calls });
        for (const secret of ['private_table', parameter, 'private_constraint']) {
            expect(output).not.toContain(secret);
        }
    });

    it('preserves the bare PostgreSQL conflict body and typeName without logging driver details', async () => {
        const error = Object.assign(new Error('duplicate private_constraint'), { code: '23505', typeName: 'Template' });
        const response = await request(appFor(error)).get('/');
        expect(response.status).toBe(409);
        expect(response.body).toEqual({ error: 'Conflict', details: 'A resource with this unique identifier already exists for Template.' });
        expect(JSON.stringify(log.mock.calls)).not.toContain('private_constraint');
    });

    it('does not expose an untrusted typeName in a unique violation', async () => {
        const marker = 'SYNTHETIC_PRIVATE_TYPENAME_MARKER';
        const error = Object.assign(new Error('duplicate'), { code: '23505', typeName: marker });
        const response = await request(appFor(error)).get('/');
        expect(response.status).toBe(409);
        expect(response.body).toEqual({ error: 'Conflict', details: 'A resource with this unique identifier already exists.' });
        expect(JSON.stringify([response.body, log.mock.calls])).not.toContain(marker);
    });

    it.each(['Agreement', 'Template', 'SharedModel'])('preserves the known %s resource name', async (typeName) => {
        const error = Object.assign(new Error('duplicate'), { code: '23505', typeName });
        const response = await request(appFor(error)).get('/');
        expect(response.status).toBe(409);
        expect(response.body.details).toBe(`A resource with this unique identifier already exists for ${typeName}.`);
    });

    it.each([
        ['wrapped foreign-key violation', new DrizzleQueryError(query, [parameter], Object.assign(new Error('foreign key'), { code: '23503' }))],
        ['arbitrary nested unique code', Object.assign(new Error('unrelated'), { cause: { code: '23505' } })],
        ['unique code beyond the immediate driver cause', new DrizzleQueryError(query, [], Object.assign(new Error('nested'), { cause: { code: '23505' } }))],
        ['spoofed Drizzle error name', Object.assign(new Error('name alone is insufficient'), { name: 'DrizzleQueryError', cause: { code: '23505' } })],
        ['connection failure', Object.assign(new Error('connection lost'), { code: '08006' })],
    ] as const)('does not reinterpret unrelated failures: %s', async (_label, error) => {
        const response = await request(appFor(error)).get('/');
        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: 'An internal error occurred' });
    });

    it.each([
                ['TemplateDuplicateError', new TemplateDuplicateError('urn:template:duplicate')],
    ] as const)('preserves typed error status and payload: %s', async (_label, error) => {
        const response = await request(appFor(error)).get('/');
        expect(response.status).toBe(error.statusCode);
        expect(response.body).toEqual({ error: { code: 'TEMPLATE_DUPLICATE', message: 'Template already exists' } });
    });

    it.each([
        ['nested unique violation', Object.assign(new ServiceError('DOMAIN_ERROR', 422, 'domain rejection'), { cause: { code: '23505' } }), 422],
        ['own unique code', new ServiceError('23505', 418, 'typed code'), 418],
    ])('keeps ServiceError classification with %s', async (_label, error, status) => {
        const response = await request(appFor(error)).get('/');
        expect(response.status).toBe(status);
        expect(response.body).toEqual({ error: { code: 'INTERNAL_ERROR', message: 'An internal error occurred' } });
    });

    it('preserves Express middleware status codes', async () => {
        const error = Object.assign(new Error('malformed JSON'), { status: 400, type: 'entity.parse.failed' });
        const response = await request(appFor(error)).get('/');
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ error: 'Malformed JSON' });
    });

    it.each([null, undefined, false, 0, '', 'route', { message: 'untrusted-rejection' }])('treats rejected non-Error %p as an internal error', async (value) => {
        const app = express();
        app.get('/', asyncHandler(async () => { throw value; }));
        app.use(globalErrorHandler);
        const res = await request(app).get('/').timeout(3000);
        expect(res.status).toBe(500);
        expect(res.body).toEqual({ error: 'An internal error occurred' });
    });

    it('forwards the original failure when headers have already been sent', () => {
        const error = new DrizzleQueryError(query, [parameter], Object.assign(new Error('duplicate'), { code: '23505' }));
        const next = jest.fn();
        globalErrorHandler(error, { method: 'GET', path: '/' } as any, { headersSent: true } as any, next);
        expect(next).toHaveBeenCalledWith(error);
        expect(JSON.stringify(log.mock.calls)).not.toContain(parameter);
    });
});
