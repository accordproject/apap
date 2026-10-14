import request from 'supertest';
import express from 'express';
import { jest } from '@jest/globals';
import agreementsRouter from './agreements';
import { globalErrorHandler } from '../middleware/errorHandler';
import { AGREEMENT_FIELDS } from '../services/agreementService';

// HTTP-layer coverage for the `?fields=` selection on GET /agreements/:id
// (#248). Kept in its own file, next to agreements.lcp.test.ts, because these
// cases only need the CRUD read path: no real .cta archive, no Postgres, and
// none of the template-engine setup that agreements.test.ts carries for
// /:id/trigger.
//
// Unlike agreements.lcp.test.ts this file does NOT mock ../db/schema or
// ../services/agreementService: the selection's allow-list is derived from the
// real generated Agreement table at module load, so mocking either would test
// a field list that does not exist in production.
jest.mock('@accordproject/template-engine', () => ({
    TemplateArchiveProcessor: jest.fn(),
}));
jest.mock('./templatebuilder', () => ({
    templateFromDatabase: jest.fn(),
    extractTemplateForDatabase: jest.fn(),
}));

// buildCrudRouter's GET /:id issues a real Drizzle select; stub the fluent
// chain so the route resolves a row without a database.
function crudMockDb(returnRows: any[]) {
    return {
        select: jest.fn().mockReturnThis(),
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        limit: jest.fn<any>().mockResolvedValue(returnRows),
    } as any;
}

function agreementRow(overrides: Record<string, unknown> = {}): any {
    return {
        id: 1,
        uri: 'apap://agreements/1',
        data: { $class: 'test.Contract', price: 10 },
        template: 'https://templates.accordproject.org/late@0.1.0.cta',
        templateHash: 'abc123',
        state: null,
        agreementStatus: 'DRAFT',
        agreementParties: [{ name: 'Acme' }],
        signatures: [],
        historyEntries: [{ seq: 1 }],
        attachments: [],
        references: [],
        metadata: null,
        ...overrides,
    };
}

function buildApp(mockDb: any) {
    const app = express();
    app.use(express.json());
    app.use((req, res, next) => {
        res.locals.db = mockDb;
        next();
    });
    app.use('/agreements', agreementsRouter);
    app.use(globalErrorHandler);
    return app;
}

beforeEach(() => {
    jest.clearAllMocks();
});

describe('GET /agreements/:id?fields=', () => {
    it('returns the full agreement when fields is omitted', async () => {
        // The backward-compatibility guarantee: existing clients send no
        // `fields` and must see exactly what they saw before #248.
        const row = agreementRow();
        const res = await request(buildApp(crudMockDb([row]))).get('/agreements/1');

        expect(res.status).toBe(200);
        expect(res.body).toEqual(row);
        expect(Object.keys(res.body).sort()).toEqual([...AGREEMENT_FIELDS].sort());
    });

    it('returns only the selected fields', async () => {
        const res = await request(buildApp(crudMockDb([agreementRow()])))
            .get('/agreements/1?fields=data,state');

        expect(res.status).toBe(200);
        expect(Object.keys(res.body).sort()).toEqual(['data', 'state']);
        expect(res.body.data).toEqual({ $class: 'test.Contract', price: 10 });
    });

    it('tolerates whitespace around field names', async () => {
        const res = await request(buildApp(crudMockDb([agreementRow()])))
            .get('/agreements/1?fields=%20data%20,%20template%20');

        expect(res.status).toBe(200);
        expect(Object.keys(res.body).sort()).toEqual(['data', 'template']);
    });

    it('accepts a repeated parameter, which Express surfaces as an array', async () => {
        const res = await request(buildApp(crudMockDb([agreementRow()])))
            .get('/agreements/1?fields=data&fields=state');

        expect(res.status).toBe(200);
        expect(Object.keys(res.body).sort()).toEqual(['data', 'state']);
    });

    it('treats an empty fields= as no selection and returns the full row', async () => {
        const res = await request(buildApp(crudMockDb([agreementRow()])))
            .get('/agreements/1?fields=');

        expect(res.status).toBe(200);
        expect(Object.keys(res.body).sort()).toEqual([...AGREEMENT_FIELDS].sort());
    });

    it('keeps a selected field whose stored value is null', async () => {
        const res = await request(buildApp(crudMockDb([agreementRow({ state: null })])))
            .get('/agreements/1?fields=state');

        expect(res.status).toBe(200);
        expect(res.body).toEqual({ state: null });
    });

    it('rejects an unknown field with a 400 naming the valid fields', async () => {
        const res = await request(buildApp(crudMockDb([agreementRow()])))
            .get('/agreements/1?fields=data,stat');

        expect(res.status).toBe(400);
        expect(res.body.error.code).toBe('INVALID_PAYLOAD');
        expect(res.body.error.message).toContain('stat');
        expect(res.body.error.details.unknownFields).toEqual(['stat']);
        expect(res.body.error.details.validFields).toEqual([...AGREEMENT_FIELDS]);
    });

    it('still 404s for an unknown agreement before any projection happens', async () => {
        const res = await request(buildApp(crudMockDb([])))
            .get('/agreements/999?fields=data');

        expect(res.status).toBe(404);
    });

    it('keeps the LCP Link header alongside a projected body', async () => {
        // The Link-header middleware in agreements.ts wraps res.json; projection
        // happens before that call, so the two must not interfere.
        const res = await request(buildApp(crudMockDb([agreementRow()])))
            .get('/agreements/1?fields=data');

        expect(res.status).toBe(200);
        expect(Object.keys(res.body)).toEqual(['data']);
        expect(res.headers['link']).toBe(
            '</agreements/1/legal-context>; rel="legal-context", </agreements/1/terms>; rel="terms-of-service"',
        );
    });

    it('does not let fields leak into the SQL filter on the list route', async () => {
        // crud.ts spreads unrecognized query params into `filters`;
        // defaultWhereClause skips any key that is not a column on the table,
        // so `fields` cannot become a WHERE clause. Pinned because a future
        // column literally named "fields" would silently change this.
        expect(AGREEMENT_FIELDS).not.toContain('fields');
    });
});
