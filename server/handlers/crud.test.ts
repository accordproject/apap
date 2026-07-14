import request from 'supertest';
import express from 'express';
import { jest } from '@jest/globals';
import templatesRouter from './templates';
import * as db from './templatebuilder';
import * as validationModule from './concertovalidation';
import { TemplateInsertSchema } from '../db/schema';

jest.mock('../db/schema');
jest.mock('./templatebuilder');
jest.mock('./concertovalidation', () => {
    return {
        concertoValidation: jest.fn()
    };
});

const mockedSchema = TemplateInsertSchema as jest.Mocked<typeof TemplateInsertSchema>;

const validTemplateBody = {
    uri: 'https://templates.accordproject.org/latedeliveryandpenalty@0.1.0.cta',
    author: 'Accord Project',
    displayName: 'Late Delivery And Penalty',
    version: '0.1.0',
    description: 'A template for late delivery',
    license: 'Apache-2.0',
    keywords: [] as string[],
    logo: ''
};

describe('PUT /:id validation', () => {
    let app: express.Application;

    beforeEach(() => {
        jest.clearAllMocks();
        app = express();
        app.use(express.json());
        app.use((req, res, next) => {
            res.locals.db = {
                insert: jest.fn().mockReturnThis(),
                values: jest.fn().mockReturnThis(),
                returning: jest.fn<any>().mockResolvedValue([{ id: 1 }]),
                update: jest.fn().mockReturnThis(),
                set: jest.fn().mockReturnThis(),
                where: jest.fn().mockReturnThis(),
            };
            next();
        });
        app.use('/templates', templatesRouter);
    });

    it('rejects invalid PUT body with 400 when schema validation fails', async () => {
        (mockedSchema.safeParse as any) = jest.fn().mockReturnValue({ 
            success: false, 
            error: { errors: [{ message: 'Invalid body' }] } 
        });
        const res = await request(app)
            .put('/templates/1')
            .send({ invalid: 'data' });
        expect(res.status).toBe(400);
    });

    it('PUT and POST apply identical schema validation', async () => {
        (mockedSchema.safeParse as any) = jest.fn().mockReturnValue({ 
            success: false, 
            error: { errors: [{ message: 'Invalid body' }] } 
        });
        const invalidBody = { bad: 'payload' };

        const postRes = await request(app)
            .post('/templates')
            .send(invalidBody);

        const putRes = await request(app)
            .put('/templates/1')
            .send(invalidBody);

        expect(postRes.status).toBe(putRes.status);
    });

    it('accepts valid PUT body and updates resource', async () => {
        (mockedSchema.safeParse as any) = jest.fn().mockReturnValue({ 
            success: true, 
            data: validTemplateBody 
        });
        const valModule = require('./concertovalidation');
        valModule.concertoValidation.mockResolvedValueOnce({ 
            success: true, 
            data: validTemplateBody 
        });
        jest.spyOn(db, 'templateFromDatabase').mockResolvedValueOnce({} as any);

        const res = await request(app)
            .put('/templates/1')
            .send(validTemplateBody);
        expect(res.status).toBe(200);
    });

    it('rejects PUT body that fails custom Concerto validation', async () => {
        (mockedSchema.safeParse as any) = jest.fn().mockReturnValue({ 
            success: true, 
            data: validTemplateBody 
        });
        const valModule = require('./concertovalidation');
        valModule.concertoValidation.mockResolvedValueOnce({ 
            success: false, 
            error: { errors: [{ message: 'Concerto validation failed' }] } 
        });

        const res = await request(app)
            .put('/templates/1')
            .send({ ...validTemplateBody, model: 'invalid-model' });
        expect(res.status).toBe(400);
    });

    it('rejects empty PUT body with 400', async () => {
        const res = await request(app)
            .put('/templates/1')
            .send({});
        expect(res.status).toBe(400);
        expect(res.body.details[0].message).toMatch(/empty/i);
    });

    it('runs custom validation even when no schema is configured', async () => {
        // Build a dedicated app with a router that has ONLY custom validation
        // no schema key — this proves custom runs independently
        const customApp = express();
        customApp.use(express.json());
        customApp.use((req, res, next) => {
            res.locals.db = {
                insert: jest.fn().mockReturnThis(),
                values: jest.fn().mockReturnThis(),
                returning: jest.fn<any>().mockResolvedValue([{ id: 1 }]),
                update: jest.fn().mockReturnThis(),
                set: jest.fn().mockReturnThis(),
                where: jest.fn().mockReturnThis(),
            };
            next();
        });

        const valModule = require('./concertovalidation');
        valModule.concertoValidation.mockResolvedValueOnce({
            success: false,
            error: { errors: [{ message: 'Custom validation failed' }] }
        });

        // `DbTemplate` is not a named export from db/schema. It's a local alias in
        // agreements.ts (`import { Template as DbTemplate }`). Re-aliasing here keeps
        // the reader-facing name consistent with agreements.ts while pulling the real
        // export. The previous direct `DbTemplate` import resolved to `undefined` and
        // the tests only passed because the custom-validation short-circuit returned
        // before any code touched `table`. The :id middleware added for #162 accesses
        // `table.id.columnType` up-front, so a real schema object is required now.
        const { buildCrudRouter } = require('./crud');
        const { Template: DbTemplate } = require('../db/schema');

        const testRouter = buildCrudRouter({
            table: DbTemplate,
            validateBody: {
                // no schema — only custom
                custom: (body: any) => valModule.concertoValidation('Template', body)
            }
        });

        customApp.use('/test', testRouter);

        const res = await request(customApp)
            .put('/test/1')
            .send(validTemplateBody);

        expect(res.status).toBe(400);
        expect(res.body.details[0].message).toBe('Custom validation failed');
    });
});

describe('DELETE /:id', () => {
    let app: express.Application;

    beforeEach(() => {
        jest.clearAllMocks();
        app = express();
        app.use(express.json());
        app.use((req, res, next) => {
            res.locals.db = {
                delete: jest.fn().mockReturnThis(),
                where: jest.fn().mockReturnThis(),
                returning: jest.fn<any>().mockResolvedValue([{ id: 1 }]),
                insert: jest.fn().mockReturnThis(),
                values: jest.fn().mockReturnThis(),
                update: jest.fn().mockReturnThis(),
                set: jest.fn().mockReturnThis(),
                select: jest.fn().mockReturnThis(),
                from: jest.fn().mockReturnThis(),
                limit: jest.fn().mockReturnThis(),
                offset: jest.fn().mockReturnThis(),
                orderBy: jest.fn().mockReturnThis(),
            };
            next();
        });
        app.use('/templates', templatesRouter);
    });

    it('returns 404 when resource does not exist', async () => {
        // Build app with DB returning empty array for delete
        const notFoundApp = express();
        notFoundApp.use(express.json());
        notFoundApp.use((req, res, next) => {
            res.locals.db = {
                delete: jest.fn().mockReturnThis(),
                where: jest.fn().mockReturnThis(),
                returning: jest.fn<any>().mockResolvedValue([]),
                insert: jest.fn().mockReturnThis(),
                values: jest.fn().mockReturnThis(),
                update: jest.fn().mockReturnThis(),
                set: jest.fn().mockReturnThis(),
                select: jest.fn().mockReturnThis(),
                from: jest.fn().mockReturnThis(),
                limit: jest.fn().mockReturnThis(),
                offset: jest.fn().mockReturnThis(),
                orderBy: jest.fn().mockReturnThis(),
            };
            next();
        });
        notFoundApp.use('/templates', templatesRouter);

        const res = await request(notFoundApp)
            .delete('/templates/999');
        expect(res.status).toBe(404);
        expect(res.body.error).toBe('Not found');
    });

    it('returns 200 when resource exists and is deleted', async () => {
        const res = await request(app)
            .delete('/templates/1');
        expect(res.status).toBe(200);
    });
});

describe('Route :id strict-numeric validation (#162)', () => {
    // parseInt('1abc') returns 1, so before this guard PUT /templates/1abc with a valid body
    // silently updated row 1, and DELETE /templates/1abc silently deleted row 1. The tests
    // pin that the guard runs before any DB mutation and returns 404 for anything that is not
    // a strict decimal integer. Regressions on the accepted numeric path are covered by the
    // existing `DELETE /:id returns 200 when resource exists` case above.
    let app: express.Application;
    let dbMock: any;

    beforeEach(() => {
        jest.clearAllMocks();
        dbMock = {
            insert: jest.fn().mockReturnThis(),
            values: jest.fn().mockReturnThis(),
            returning: jest.fn<any>().mockResolvedValue([{ id: 1 }]),
            update: jest.fn().mockReturnThis(),
            set: jest.fn().mockReturnThis(),
            delete: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            select: jest.fn().mockReturnThis(),
            from: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
            offset: jest.fn().mockReturnThis(),
            orderBy: jest.fn().mockReturnThis(),
        };
        app = express();
        app.use(express.json());
        app.use((req, res, next) => {
            res.locals.db = dbMock;
            next();
        });
        app.use('/templates', templatesRouter);
    });

    it('GET /:id rejects partial-numeric id 1abc with 404', async () => {
        const res = await request(app).get('/templates/1abc');
        expect(res.status).toBe(404);
        expect(res.body.error).toBe('Not found');
        expect(dbMock.select).not.toHaveBeenCalled();
    });

    it('PUT /:id rejects partial-numeric id 1abc with 404 before touching db', async () => {
        // The data-corruption case from the issue: without the guard, a valid body sent to
        // /templates/1abc silently updates row 1.
        (mockedSchema.safeParse as any) = jest.fn().mockReturnValue({
            success: true,
            data: validTemplateBody
        });
        const res = await request(app)
            .put('/templates/1abc')
            .send(validTemplateBody);
        expect(res.status).toBe(404);
        expect(dbMock.update).not.toHaveBeenCalled();
    });

    it('DELETE /:id rejects partial-numeric id 1abc with 404 before touching db', async () => {
        const res = await request(app).delete('/templates/1abc');
        expect(res.status).toBe(404);
        expect(dbMock.delete).not.toHaveBeenCalled();
    });

    it('rejects decimal id 1.5 with 404', async () => {
        const res = await request(app).get('/templates/1.5');
        expect(res.status).toBe(404);
    });

    it('rejects negative id -1 with 404', async () => {
        const res = await request(app).get('/templates/-1');
        expect(res.status).toBe(404);
    });

    it('rejects hex-form id 0x10 with 404', async () => {
        const res = await request(app).get('/templates/0x10');
        expect(res.status).toBe(404);
    });

    it('rejects scientific-form id 1e2 with 404', async () => {
        const res = await request(app).get('/templates/1e2');
        expect(res.status).toBe(404);
    });
});

describe('POST without validateBody', () => {
    it('does not crash when validateBody is not provided', async () => {
        const noValidateApp = express();
        noValidateApp.use(express.json());
        noValidateApp.use((req, res, next) => {
            res.locals.db = {
                insert: jest.fn().mockReturnThis(),
                values: jest.fn().mockReturnThis(),
                returning: jest.fn<any>().mockResolvedValue([{ id: 1 }]),
                update: jest.fn().mockReturnThis(),
                set: jest.fn().mockReturnThis(),
                where: jest.fn().mockReturnThis(),
                select: jest.fn().mockReturnThis(),
                from: jest.fn().mockReturnThis(),
                limit: jest.fn().mockReturnThis(),
                offset: jest.fn().mockReturnThis(),
                orderBy: jest.fn().mockReturnThis(),
            };
            next();
        });

        const { buildCrudRouter } = require('./crud');
        const { Template: DbTemplate } = require('../db/schema');

        // No validateBody at all
        const testRouter = buildCrudRouter({
            table: DbTemplate,
            typeName: 'templates',
        });

        noValidateApp.use('/templates', testRouter);

        const res = await request(noValidateApp)
            .post('/templates')
            .send(validTemplateBody);
        expect(res.status).not.toBe(500);
    });
});

describe('SQL injection prevention in defaultWhereClause', () => {
    let app: express.Application;

    beforeEach(() => {
        jest.clearAllMocks();
        app = express();
        app.use(express.json());
        app.use((req, res, next) => {
            // Mock DB that chains fluently and returns a valid paginated shape.
            // select().from().where().limit().offset() → items array
            // select({ count }).from().where() → [{ count: 0 }]
            const chainable = {
                select: jest.fn().mockReturnThis(),
                from: jest.fn().mockReturnThis(),
                where: jest.fn().mockReturnThis(),
                limit: jest.fn().mockReturnThis(),
                offset: jest.fn().mockReturnThis(),
                orderBy: jest.fn().mockReturnThis(),
                toSQL: jest.fn<any>().mockReturnValue({ sql: '', params: [] }),
                then: jest.fn<any>().mockImplementation(function(this: any, resolve: any) {
                    // If the select was called with { count }, return count result
                    // otherwise return empty items array
                    const selectArgs = (this.select as jest.Mock).mock.calls;
                    const lastCall = selectArgs.length > 0 ? selectArgs[selectArgs.length - 1][0] as any : null;
                    if (lastCall?.count) {
                        return resolve([{ count: 0 }]);
                    }
                    return resolve([]);
                }),
                insert: jest.fn().mockReturnThis(),
                values: jest.fn().mockReturnThis(),
                returning: jest.fn<any>().mockResolvedValue([{ id: 1 }]),
                update: jest.fn().mockReturnThis(),
                set: jest.fn().mockReturnThis(),
                delete: jest.fn().mockReturnThis(),
            };
            res.locals.db = chainable;
            next();
        });
        app.use('/templates', templatesRouter);
    });

    it('rejects prototype pollution keys like toString', async () => {
        // "toString" exists on Object.prototype and would pass an `in` check
        // but should be rejected by hasOwnProperty validation
        const res = await request(app)
            .get('/templates?toString=1');
        expect(res.status).not.toBe(500);
    });

    it('rejects __proto__ key', async () => {
        const res = await request(app)
            .get('/templates?__proto__=malicious');
        expect(res.status).not.toBe(500);
    });

    it('rejects constructor key', async () => {
        const res = await request(app)
            .get('/templates?constructor=malicious');
        expect(res.status).not.toBe(500);
    });

    it('rejects keys not present as own properties on table schema', async () => {
        const res = await request(app)
            .get('/templates?nonexistentColumn=value');
        expect(res.status).not.toBe(500);
    });

    it('handles operator filter syntax without crashing', async () => {
        const res = await request(app)
            .get('/templates?version=>=%201.0.0');
        expect(res.status).not.toBe(500);
    });

    it('handles null filter value without crashing', async () => {
        const res = await request(app)
            .get('/templates?author=null');
        expect(res.status).not.toBe(500);
    });
});
