import request from 'supertest';
import express from 'express';
import { jest } from '@jest/globals';
import templatesRouter from './templates';
import { globalErrorHandler } from '../middleware/errorHandler';
import { TemplateImmutableError, TemplateInUseError } from '../services/errors';

// Covers templates.ts's wiring of guardUpdate/guardDelete to
// templateService.ts's real guard functions, at the HTTP layer. The guard
// functions' own logic (which fields are content, the used-by-agreement
// query) is unit-tested directly in templateService.test.ts; the generic
// crud.ts hook mechanism (guard called/skipped, error mapping) is tested in
// crud.test.ts with synthetic guards. This file only needs to prove
// templates.ts actually passes the real functions through.
jest.mock('../services/templateService', () => ({
    assertTemplateContentImmutable: jest.fn(),
    assertTemplateNotInUse: jest.fn(),
}));
jest.mock('./concertovalidation', () => ({
    // Echoes the submitted body back as `data` so downstream assertions on
    // what the guard was called with reflect the actual request body, not a
    // fixed stand-in value.
    concertoValidation: jest.fn<any>().mockImplementation((_typeName: string, body: unknown) =>
        Promise.resolve({ success: true, data: body }),
    ),
}));
jest.mock('./templatebuilder', () => ({
    templateFromDatabase: jest.fn<any>().mockResolvedValue({}),
}));
jest.mock('../db/schema', () => ({
    Template: { id: { columnType: 'PgSerial' } },
    TemplateInsertSchema: { safeParse: jest.fn((body: unknown) => ({ success: true, data: body })) },
}));

import { assertTemplateContentImmutable, assertTemplateNotInUse } from '../services/templateService';
const mockedAssertImmutable = assertTemplateContentImmutable as jest.MockedFunction<
    typeof assertTemplateContentImmutable
>;
const mockedAssertNotInUse = assertTemplateNotInUse as jest.MockedFunction<typeof assertTemplateNotInUse>;

function mockDbWithRow(row: Record<string, unknown> | null) {
    const db: any = {
        select: jest.fn().mockReturnThis(),
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        for: jest.fn().mockReturnThis(),
        limit: jest.fn<any>().mockResolvedValue(row ? [row] : []),
        update: jest.fn().mockReturnThis(),
        set: jest.fn().mockReturnThis(),
        delete: jest.fn().mockReturnThis(),
        returning: jest.fn<any>().mockResolvedValue(row ? [row] : []),
    };
    // Guarded PUT/DELETE now run inside db.transaction(cb) — hand the
    // callback this same mock so it behaves as its own transaction handle.
    db.transaction = jest.fn((cb: any) => cb(db));
    return db;
}

function buildApp(db: ReturnType<typeof mockDbWithRow>) {
    const app = express();
    app.use(express.json());
    app.use((req, res, next) => {
        res.locals.db = db;
        next();
    });
    app.use('/templates', templatesRouter);
    app.use(globalErrorHandler);
    return app;
}

beforeEach(() => {
    jest.clearAllMocks();
});

describe('PUT /templates/:id', () => {
    it('rejects with 409 when assertTemplateContentImmutable throws', async () => {
        const existing = { id: 1, description: 'old' };
        mockedAssertImmutable.mockImplementation(() => {
            throw new TemplateImmutableError(1);
        });
        const app = buildApp(mockDbWithRow(existing));

        const res = await request(app).put('/templates/1').send({ description: 'new' });

        expect(res.status).toBe(409);
        expect(res.body.error.code).toBe('TEMPLATE_IMMUTABLE');
        expect(mockedAssertImmutable).toHaveBeenCalledWith(existing, expect.objectContaining({ description: 'new' }));
    });

    it('succeeds when assertTemplateContentImmutable does not throw (e.g. a no-op resend)', async () => {
        const existing = { id: 1, description: 'same' };
        mockedAssertImmutable.mockImplementation(() => undefined);
        const app = buildApp(mockDbWithRow(existing));

        const res = await request(app).put('/templates/1').send({ description: 'same' });

        expect(res.status).toBe(200);
        expect(mockedAssertImmutable).toHaveBeenCalled();
    });

    it('does not call the guard when the template does not exist', async () => {
        const app = buildApp(mockDbWithRow(null));

        await request(app).put('/templates/999').send({ description: 'new' });

        expect(mockedAssertImmutable).not.toHaveBeenCalled();
    });
});

describe('DELETE /templates/:id', () => {
    it('rejects with 409 when assertTemplateNotInUse throws (template still referenced)', async () => {
        const existing = { id: 1, uri: 'https://templates.example/a.cta' };
        mockedAssertNotInUse.mockImplementation(async () => {
            throw new TemplateInUseError(1);
        });
        const app = buildApp(mockDbWithRow(existing));

        const res = await request(app).delete('/templates/1');

        expect(res.status).toBe(409);
        expect(res.body.error.code).toBe('TEMPLATE_IN_USE');
        expect(mockedAssertNotInUse).toHaveBeenCalledWith(existing, expect.anything());
    });

    it('succeeds when assertTemplateNotInUse does not throw (template unused)', async () => {
        const existing = { id: 1, uri: 'https://templates.example/a.cta' };
        mockedAssertNotInUse.mockResolvedValue(undefined);
        const app = buildApp(mockDbWithRow(existing));

        const res = await request(app).delete('/templates/1');

        expect(res.status).toBe(200);
        expect(mockedAssertNotInUse).toHaveBeenCalled();
    });

    it('does not call the guard when the template does not exist', async () => {
        const app = buildApp(mockDbWithRow(null));

        const res = await request(app).delete('/templates/999');

        expect(res.status).toBe(404);
        expect(mockedAssertNotInUse).not.toHaveBeenCalled();
    });
});
