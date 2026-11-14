import request from 'supertest';
import express from 'express';
import capabilitiesRouter, { SERVER_CAPABILITIES } from './capabilities';

function buildApp() {
    const app = express();
    app.use('/capabilities', capabilitiesRouter);
    return app;
}

/**
 * Valid FeatureType enum values defined in model/protocol.cto
 */
const VALID_FEATURE_TYPES = new Set([
    'TEMPLATE_MANAGE',
    'TEMPLATE_VERIFY_SIGNATURES',
    'TEMPLATE_LOGIC',
    'TEMPLATE_STATEFUL',
    'LOGIC_WASM',
    'LOGIC_ES2015',
    'LOGIC_TYPESCRIPT',
    'AGREEMENT_MANAGE',
    'AGREEMENT_TRIGGER',
    'AGREEMENT_STATE',
    'AGREEMENT_CONVERT_HTML',
    'AGREEMENT_LEGAL_CONTEXT',
    'AGREEMENT_SIGNING',
    'SHARED_MODEL_MANAGE',
]);

describe('GET /capabilities', () => {
    it('returns HTTP 200 with application/json', async () => {
        const app = buildApp();
        const res = await request(app).get('/capabilities');

        expect(res.status).toBe(200);
        expect(res.headers['content-type']).toMatch(/application\/json/);
    });

    it('returns an object adhering to the Concerto Capabilities concept schema', async () => {
        const app = buildApp();
        const res = await request(app).get('/capabilities');

        expect(res.body).toEqual(SERVER_CAPABILITIES);
        expect(res.body.$class).toBe('org.accordproject.protocol@1.0.0.Capabilities');
        expect(Array.isArray(res.body.features)).toBe(true);
        expect(res.body.features).toEqual(
            expect.arrayContaining([
                'TEMPLATE_MANAGE',
                'SHARED_MODEL_MANAGE',
                'AGREEMENT_MANAGE',
                'AGREEMENT_CONVERT_HTML',
                'AGREEMENT_TRIGGER',
                'AGREEMENT_LEGAL_CONTEXT',
            ]),
        );
    });

    it('contains valid known features defined in protocol.cto FeatureType enum and no duplicates', async () => {
        const app = buildApp();
        const res = await request(app).get('/capabilities');

        const features = res.body.features;
        const uniqueFeatures = new Set(features);
        expect(uniqueFeatures.size).toBe(features.length);
        expect(features.length).toBeGreaterThan(0);
        features.forEach((feature: string) => {
            expect(VALID_FEATURE_TYPES.has(feature)).toBe(true);
        });
    });
});
