import request from 'supertest';
import express from 'express';
import { jest } from '@jest/globals';
import lcpRouter from './lcp';
import { globalErrorHandler } from '../middleware/errorHandler';

jest.mock('../services/lcpService', () => ({
    buildServerLegalContext: jest.fn(),
    resolvePublicBaseUrl: jest.fn(() => 'https://apap.example'),
}));

import { buildServerLegalContext } from '../services/lcpService';
const mockedBuildServerLegalContext = buildServerLegalContext as jest.MockedFunction<
    typeof buildServerLegalContext
>;

function buildApp() {
    const app = express();
    app.use((req, res, next) => {
        res.locals.db = {};
        next();
    });
    app.use('/', lcpRouter);
    app.use(globalErrorHandler);
    return app;
}

describe('GET /.well-known/legal-context.json', () => {
    it('404s when no server-level document is configured', async () => {
        mockedBuildServerLegalContext.mockResolvedValue(undefined);
        const app = buildApp();

        const res = await request(app).get('/.well-known/legal-context.json');

        expect(res.status).toBe(404);
    });

    it('serves the configured document with CORS enabled', async () => {
        mockedBuildServerLegalContext.mockResolvedValue({
            terms: 'https://terms.example/agreement.md',
            acceptanceRequired: false,
        });
        const app = buildApp();

        const res = await request(app).get('/.well-known/legal-context.json');

        expect(res.status).toBe(200);
        expect(res.body.terms).toBe('https://terms.example/agreement.md');
        expect(res.headers['access-control-allow-origin']).toBe('*');
    });
});
