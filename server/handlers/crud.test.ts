import type { Request } from 'express';
import request from 'supertest';
import express from 'express';
import { jest } from '@jest/globals';
import templatesRouter from './templates';
import * as db from './templatebuilder';
import * as validationModule from './concertovalidation';
import { parseQueryParams } from './crud';
import { TemplateInsertSchema } from '../db/schema';
import { globalErrorHandler } from '../middleware/errorHandler';

jest.mock('../db/schema');
jest.mock('./templatebuilder');
jest.mock('./concertovalidation', () => {
    return {
        concertoValidation: jest.fn()
    };
});

// ponytail: cast to any due to zod v3 -> v4 upgrade depth-instantiation
// issue with drizzle-zod. Runtime unaffected.
const mockedSchema = TemplateInsertSchema as any;

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
    // Captures each SQL clause passed to db.where(...). The first call is
    // the count query, the second the row query; both receive the same
    // clause built by defaultWhereClause, so index [0] is enough for tests
    // that assert the built clause shape.
    let capturedWhereClauses: any[] = [];

    beforeEach(() => {
        jest.clearAllMocks();
        capturedWhereClauses = [];
        app = express();
        app.use(express.json());
        app.use((req, res, next) => {
            // Mock DB that chains fluently and returns a valid paginated shape.
            // select().from().where().limit().offset() → items array
            // select({ count }).from().where() → [{ count: 0 }]
            const chainable: any = {
                select: jest.fn().mockReturnThis(),
                from: jest.fn().mockReturnThis(),
                where: jest.fn(function (this: any, clause: any) {
                    capturedWhereClauses.push(clause);
                    return this;
                }),
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

    // Case-insensitive filter via `~` prefix (closes #125). Original bug: a
    // template created by "Purushotham" was not findable by `?author=purushotham`
    // or `?author=Purushotham` because the router built a case-sensitive
    // equality clause. The `~` prefix opts the value into an ILIKE comparison,
    // which Postgres treats as case-insensitive. Backwards compatible: existing
    // queries without the prefix keep the case-sensitive equality behaviour.
    it('does not crash when ~ prefix requests a case-insensitive match', async () => {
        const res = await request(app)
            .get('/templates?author=~Rob');
        expect(res.status).not.toBe(500);
    });

    it('does not crash when ~ prefix is used with an empty operand', async () => {
        // `?author=~` after the tilde is an empty value; the router should
        // still handle it (Postgres ILIKE against an empty string is a valid
        // query, matches empty string columns only). The point is no crash.
        const res = await request(app)
            .get('/templates?author=~');
        expect(res.status).not.toBe(500);
    });

    it('~ prefix escapes % and _ so they match literally, not as ILIKE wildcards', async () => {
        // Prior to the escape fix, `?author=~%admin%` silently became a
        // contains-match (ILIKE '%admin%'). The `~` operator advertises
        // case-insensitive EQUALITY, so `%` and `_` must be escaped and
        // matched as literal characters. This test compiles the SQL clause
        // that defaultWhereClause emits and asserts the operand is escaped
        // AND the SQL carries `ESCAPE '\'`. A test that only asserts
        // non-500 (like the earlier "SQL-like metacharacters" version)
        // would pass against the buggy pre-fix code because unescaped
        // wildcards also do not crash, they just silently over-match.
        const { PgDialect } = require('drizzle-orm/pg-core');
        const dialect = new PgDialect();

        const res = await request(app)
            .get('/templates?author=~%25admin%25');
        expect(res.status).not.toBe(500);

        // Serialize the captured where-clause and assert the escape shape.
        // capturedWhereClauses[0] is the count-query clause, [1] the row
        // query; both are built from the same defaultWhereClause output so
        // either works.
        expect(capturedWhereClauses.length).toBeGreaterThan(0);
        const compiled = dialect.sqlToQuery(capturedWhereClauses[0]);
        expect(compiled.sql).toContain('ILIKE');
        expect(compiled.sql).toContain("ESCAPE '\\'");
        expect(compiled.params).toContain('\\%admin\\%');
    });

    it('~ prefix on non-metacharacter operand still passes the operand as-is under ILIKE', async () => {
        // Baseline: without metacharacters, escape is a no-op and the
        // ILIKE + ESCAPE clause still forms correctly.
        const { PgDialect } = require('drizzle-orm/pg-core');
        const dialect = new PgDialect();

        const res = await request(app)
            .get('/templates?author=~Rob');
        expect(res.status).not.toBe(500);

        expect(capturedWhereClauses.length).toBeGreaterThan(0);
        const compiled = dialect.sqlToQuery(capturedWhereClauses[0]);
        expect(compiled.sql).toContain('ILIKE');
        expect(compiled.sql).toContain("ESCAPE '\\'");
        expect(compiled.params).toContain('Rob');
    });
});

function createRequest(query: Request['query']): Request {
    return {
        query
    } as Request;
}

describe('parseQueryParams', () => {
    it('falls back to safe defaults for non-numeric pagination params', () => {
        const queryParams = parseQueryParams(createRequest({
            page: 'abc',
            limit: 'foo'
        }));

        expect(queryParams.page).toBe(1);
        expect(queryParams.limit).toBe(100);
    });

    it('rejects partially numeric and non-decimal pagination values', () => {
        const queryParams = parseQueryParams(createRequest({
            page: '12abc',
            limit: '0x10'
        }));

        expect(queryParams.page).toBe(1);
        expect(queryParams.limit).toBe(100);
    });

    it('uses the first repeated query param and still clamps values', () => {
        const queryParams = parseQueryParams(createRequest({
            page: ['2', '3'],
            limit: ['250', '10'],
            sortBy: ['createdAt', 'updatedAt'],
            sortOrder: ['DESC', 'asc']
        }));

        expect(queryParams.page).toBe(2);
        expect(queryParams.limit).toBe(100);
        expect(queryParams.sortBy).toBe('createdAt');
        expect(queryParams.sortOrder).toBe('desc');
    });
});

// Coverage additions for the CRUD router happy paths + boundary shapes that
// PR #165 (@Thomas-Sedhom, opened April 2026) originally targeted. That PR
// went stale before landing and the router surface has since been hardened
// with SQL-injection guards (bdc536e), strict numeric-ID parsing (#208),
// 404-on-missing DELETE (#180), pagination guards (#177), and pagination
// query parsing hardening (5e6782d). This section fills gaps not already
// covered by those hardening PRs: GET / list envelope + pagination shape,
// GET /:id happy + 404, and POST / happy path.
describe('GET / list route (envelope + pagination shape)', () => {
    let app: express.Application;
    let dbMock: any;
    // The list route runs two sequential awaits: a count query
    // (db.select({count}).from().where() -> [{count: N}]) then an items
    // query (db.select().from().where().limit().offset() -> [rows...]).
    // Both terminate at different points in the fluent chain, so instead
    // of chasing which method .mockResolvedValueOnce should target,
    // intercept the shared `then` on the mock and pop from a queue.
    let awaitQueue: any[];

    beforeEach(() => {
        jest.clearAllMocks();
        awaitQueue = [];
        dbMock = {
            select: jest.fn().mockReturnThis(),
            from: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
            offset: jest.fn().mockReturnThis(),
            orderBy: jest.fn().mockReturnThis(),
            insert: jest.fn().mockReturnThis(),
            values: jest.fn().mockReturnThis(),
            returning: jest.fn().mockReturnThis(),
            update: jest.fn().mockReturnThis(),
            set: jest.fn().mockReturnThis(),
            delete: jest.fn().mockReturnThis(),
            then(onF: any, onR: any) {
                const value = awaitQueue.shift() ?? [];
                return Promise.resolve(value).then(onF, onR);
            },
        };
        app = express();
        app.use(express.json());
        app.use((req, res, next) => {
            res.locals.db = dbMock;
            next();
        });
        app.use('/templates', templatesRouter);
        app.use(globalErrorHandler);
    });

    it('returns PaginatedResponse envelope with items + total + page + limit + totalPages', async () => {
        // Queue is [count-result, items-result] in order of await.
        const items = [{ id: 1, uri: 'apap://a' }, { id: 2, uri: 'apap://b' }];
        awaitQueue = [[{ count: 42 }], items];

        const res = await request(app).get('/templates');

        expect(res.status).toBe(200);
        expect(res.body).toEqual({
            items,
            total: 42,
            page: 1,
            limit: 100,
            totalPages: 1,
        });
    });

    it('returns an empty items array + total=0 when the table has no rows', async () => {
        awaitQueue = [[{ count: 0 }], []];

        const res = await request(app).get('/templates');

        expect(res.status).toBe(200);
        expect(res.body.items).toEqual([]);
        expect(res.body.total).toBe(0);
        expect(res.body.totalPages).toBe(0);
    });

    it('paginates past total: page beyond last returns empty items but preserves total', async () => {
        // 5 rows total, page=3 at limit=10 asks for rows 21..30 which do
        // not exist. Total metadata must still reflect the true row count so
        // the client can render "showing 0 of 5" instead of an outright 404.
        awaitQueue = [[{ count: 5 }], []];

        const res = await request(app).get('/templates?page=3&limit=10');

        expect(res.status).toBe(200);
        expect(res.body.items).toEqual([]);
        expect(res.body.total).toBe(5);
        expect(res.body.page).toBe(3);
        expect(res.body.limit).toBe(10);
        expect(res.body.totalPages).toBe(1);
    });

    it('computes totalPages as ceil(total / limit)', async () => {
        // 47 rows at limit=20 -> ceil(47/20) = 3 pages.
        awaitQueue = [[{ count: 47 }], []];

        const res = await request(app).get('/templates?limit=20');

        expect(res.body.total).toBe(47);
        expect(res.body.limit).toBe(20);
        expect(res.body.totalPages).toBe(3);
    });
});

describe('GET /:id single-fetch route', () => {
    let app: express.Application;
    let dbMock: any;

    beforeEach(() => {
        jest.clearAllMocks();
        dbMock = {
            select: jest.fn().mockReturnThis(),
            from: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
            offset: jest.fn().mockReturnThis(),
            orderBy: jest.fn().mockReturnThis(),
            insert: jest.fn().mockReturnThis(),
            values: jest.fn().mockReturnThis(),
            returning: jest.fn().mockReturnThis(),
            update: jest.fn().mockReturnThis(),
            set: jest.fn().mockReturnThis(),
            delete: jest.fn().mockReturnThis(),
        };
        app = express();
        app.use(express.json());
        app.use((req, res, next) => {
            res.locals.db = dbMock;
            next();
        });
        app.use('/templates', templatesRouter);
    });

    it('returns 200 with the row when the id exists', async () => {
        const row = { id: 7, uri: 'apap://t/7', author: 'test' };
        // Single-lookup queries terminate at `.limit(1)`.
        dbMock.limit.mockResolvedValueOnce([row]);

        const res = await request(app).get('/templates/7');

        expect(res.status).toBe(200);
        expect(res.body).toMatchObject({ id: 7, uri: 'apap://t/7' });
    });

    it('returns 404 when the id does not exist', async () => {
        dbMock.limit.mockResolvedValueOnce([]);

        const res = await request(app).get('/templates/999');

        expect(res.status).toBe(404);
    });
});

describe('POST / happy path', () => {
    // Existing "POST without validateBody" and "PUT /:id validation" blocks
    // above cover POST rejection paths; this test pins the accept-and-insert
    // wire shape so a regression in the insert-and-return path is caught.
    let app: express.Application;
    let dbMock: any;

    beforeEach(() => {
        jest.clearAllMocks();
        dbMock = {
            insert: jest.fn().mockReturnThis(),
            values: jest.fn().mockReturnThis(),
            returning: jest.fn<any>().mockResolvedValue([{ id: 42, uri: 'apap://new' }]),
            select: jest.fn().mockReturnThis(),
            from: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
            offset: jest.fn().mockReturnThis(),
            orderBy: jest.fn().mockReturnThis(),
            update: jest.fn().mockReturnThis(),
            set: jest.fn().mockReturnThis(),
            delete: jest.fn().mockReturnThis(),
        };
        app = express();
        app.use(express.json());
        app.use((req, res, next) => {
            res.locals.db = dbMock;
            next();
        });
        app.use('/templates', templatesRouter);
    });

    it('inserts a valid body and returns 200 with the created row', async () => {
        (mockedSchema.safeParse as any) = jest.fn().mockReturnValue({
            success: true,
            data: validTemplateBody,
        });
        const valModule = require('./concertovalidation');
        valModule.concertoValidation.mockResolvedValueOnce({
            success: true,
            data: validTemplateBody,
        });
        jest.spyOn(db, 'templateFromDatabase').mockResolvedValueOnce({} as any);

        const res = await request(app)
            .post('/templates')
            .send(validTemplateBody);

        expect(res.status).toBe(200);
        expect(dbMock.insert).toHaveBeenCalled();
        expect(dbMock.values).toHaveBeenCalled();
    });
});
