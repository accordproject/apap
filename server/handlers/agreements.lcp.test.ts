import request from 'supertest';
import express from 'express';
import { jest } from '@jest/globals';
import agreementsRouter from './agreements';
import { globalErrorHandler } from '../middleware/errorHandler';
import { AgreementNotFoundError } from '../services/errors';

// This file covers the LCP-related additions to the agreements router
// (/:id/terms, /:id/legal-context, and the Link header on GET /:id) at the
// HTTP layer. Kept separate from the existing agreements.test.ts (which
// exercises /:id/trigger and POST / against real template archives) because
// these routes only need the service layer mocked, not a real DB or a real
// .cta archive — agreementService.convertAgreement and lcpService are
// unit-tested directly in their own *.test.ts files.
jest.mock('../services/agreementService', () => ({
    convertAgreement: jest.fn(),
    triggerAgreement: jest.fn(),
}));
jest.mock('../services/lcpService', () => ({
    getAgreementTerms: jest.fn(),
    buildAgreementLegalContext: jest.fn(),
    resolvePublicBaseUrl: jest.fn(() => 'https://apap.example'),
}));
// buildCrudRouter's GET /:id issues a real Drizzle query; mock the table/db
// query chain so a bare `GET /agreements/:id` can be exercised without Postgres.
jest.mock('../db/schema', () => ({
    Agreement: { id: { columnType: 'PgSerial' } },
    AgreementInsertSchema: { safeParse: jest.fn(() => ({ success: true })) },
    Template: {},
}));

import { getAgreementTerms, buildAgreementLegalContext } from '../services/lcpService';
const mockedGetAgreementTerms = getAgreementTerms as jest.MockedFunction<typeof getAgreementTerms>;
const mockedBuildAgreementLegalContext = buildAgreementLegalContext as jest.MockedFunction<
    typeof buildAgreementLegalContext
>;

beforeEach(() => {
    jest.clearAllMocks();
});

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

describe('GET /agreements/:id/terms', () => {
    it('serves the terms body with a matching ETag and CORS header', async () => {
        mockedGetAgreementTerms.mockResolvedValue({
            body: '# Terms',
            atrHash: `0x${'a'.repeat(64)}`,
            contentType: 'text/markdown; charset=utf-8',
        });
        const app = buildApp({});

        const res = await request(app).get('/agreements/1/terms');

        expect(res.status).toBe(200);
        expect(res.text).toBe('# Terms');
        expect(res.headers['content-type']).toContain('text/markdown');
        expect(res.headers['etag']).toBe(`"0x${'a'.repeat(64)}"`);
        expect(res.headers['access-control-allow-origin']).toBe('*');
    });

    it('404s for a non-numeric id without calling the service', async () => {
        const app = buildApp({});
        const res = await request(app).get('/agreements/not-a-number/terms');
        expect(res.status).toBe(404);
        expect(mockedGetAgreementTerms).not.toHaveBeenCalled();
    });

    it('propagates AgreementNotFoundError as a 404', async () => {
        mockedGetAgreementTerms.mockRejectedValue(new AgreementNotFoundError(999));
        const app = buildApp({});
        const res = await request(app).get('/agreements/999/terms');
        expect(res.status).toBe(404);
        expect(res.body.error.code).toBe('AGREEMENT_NOT_FOUND');
    });
});

describe('GET /agreements/:id/legal-context', () => {
    it('returns the LegalContext document as JSON with CORS enabled', async () => {
        mockedBuildAgreementLegalContext.mockResolvedValue({
            terms: 'https://apap.example/agreements/1/terms',
            termsFormat: 'markdown',
            acceptanceRequired: false,
            api: 'https://apap.example/agreements/1',
        });
        const app = buildApp({});

        const res = await request(app).get('/agreements/1/legal-context');

        expect(res.status).toBe(200);
        expect(res.body.terms).toBe('https://apap.example/agreements/1/terms');
        expect(res.body.atrHash).toBeUndefined();
        expect(res.headers['access-control-allow-origin']).toBe('*');
    });

    it('propagates AgreementNotFoundError as a 404', async () => {
        mockedBuildAgreementLegalContext.mockRejectedValue(new AgreementNotFoundError(404));
        const app = buildApp({});
        const res = await request(app).get('/agreements/404/legal-context');
        expect(res.status).toBe(404);
    });
});

describe('GET /agreements/:id Link headers', () => {
    function crudMockDb(returnRows: any[]) {
        const mock: any = {
            select: jest.fn().mockReturnThis(),
            from: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            limit: jest.fn<any>().mockResolvedValue(returnRows),
        };
        return mock;
    }

    it('advertises legal-context and terms-of-service links on a found agreement', async () => {
        const app = buildApp(crudMockDb([{ id: 1, uri: 'apap://agreements/1' }]));

        const res = await request(app).get('/agreements/1');

        expect(res.status).toBe(200);
        expect(res.headers['link']).toBe(
            '</agreements/1/legal-context>; rel="legal-context", </agreements/1/terms>; rel="terms-of-service"',
        );
    });

    it('does not set a Link header on a 404 (agreement not found)', async () => {
        const app = buildApp(crudMockDb([]));

        const res = await request(app).get('/agreements/999');

        expect(res.status).toBe(404);
        expect(res.headers['link']).toBeUndefined();
    });

    it('does not set a Link header on nested routes like /:id/terms', async () => {
        mockedGetAgreementTerms.mockResolvedValue({
            body: 'x',
            atrHash: `0x${'b'.repeat(64)}`,
            contentType: 'text/markdown; charset=utf-8',
        });
        const app = buildApp(crudMockDb([{ id: 1 }]));

        const res = await request(app).get('/agreements/1/terms');

        expect(res.headers['link']).toBeUndefined();
    });
});
