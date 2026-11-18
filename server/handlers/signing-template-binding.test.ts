import express from 'express';
import request from 'supertest';
import { jest } from '@jest/globals';
import router from './agreements';
import { globalErrorHandler } from '../middleware/errorHandler';
import { Agreement, Template } from '../db/schema';

jest.mock('./templatebuilder', () => ({ templateFromDatabase: async (row: any) => row }));
jest.mock('@accordproject/template-engine', () => ({
    TemplateArchiveProcessor: class {
        constructor(private template: any) {}
        async draft() { return this.template.text; }
    },
}));

const prefix = 'resource:org.accordproject.protocol@1.0.0.Template#';
function setup(status: string, hash: string | null = null) {
    let row: any = { id: 1, uri: 'apap://agreement/1', template: `${prefix}ap://first`, templateHash: hash, agreementStatus: status, data: JSON.stringify({ price: 10 }) };
    const templates: any[] = [{ uri: 'ap://first', hash: 'cached', text: 'First terms' }, { uri: 'ap://second', hash: 'other', text: 'Second terms' }];
    let table: any, values: any;
    const db: any = {
        select() { return this; }, from(t: any) { table = t; return this; }, where() { return this; }, for() { return this; },
        async limit() { return table === Agreement ? [{ ...row }] : table === Template ? templates.filter(t => hash ? t.hash === hash : t.uri === decodeURIComponent(row.template.split('#')[1])) : []; },
        update() { return this; }, set(v: any) { values = v; return this; },
        async returning() { row = { ...row, ...values }; return [{ ...row }]; },
        transaction(fn: any) { return fn(this); },
    };
    const app = express(); app.use(express.json());
    app.use((_req, res, next) => { res.locals.db = db; next(); });
    app.use('/agreements', router); app.use(globalErrorHandler);
    return app;
}
const body = (status: string) => ({ uri: 'apap://agreement/1', template: 'ap://second', agreementStatus: status, data: { price: 10 } });

// The database and renderer are simulated; the HTTP routes and validation are real.
describe('signing local-template binding', () => {
    const oldBase = process.env.APAP_PUBLIC_BASE_URL;
    beforeAll(() => { process.env.APAP_PUBLIC_BASE_URL = 'https://apap.example'; });
    afterAll(() => { if (oldBase === undefined) delete process.env.APAP_PUBLIC_BASE_URL; else process.env.APAP_PUBLIC_BASE_URL = oldBase; });
    test('signing: rejects a changed local binding and retains simulated terms and hash', async () => {
        const app = setup('SIGNING');
        const before = await request(app).get('/agreements/1/legal-context');
        const beforeTerms = await request(app).get('/agreements/1/terms');
        const changed = await request(app).put('/agreements/1').send(body('SIGNING'));
        const after = await request(app).get('/agreements/1/legal-context');
        const afterTerms = await request(app).get('/agreements/1/terms');
        expect([before.status, beforeTerms.status, changed.status, after.status, afterTerms.status]).toEqual([200, 200, 409, 200, 200]);
        expect(changed.body.error).toMatchObject({ code: 'AGREEMENT_RECORD_IMMUTABLE', details: { field: 'template', status: 'SIGNING' } });
        expect(beforeTerms.text).toBe('First terms'); expect(afterTerms.text).toBe('First terms');
        expect(before.body.atrHash).toBe(after.body.atrHash);
    });
    test('cached signing binding rejects change', async () => {
        const res = await request(setup('SIGNING', 'cached')).put('/agreements/1').send(body('SIGNING'));
        expect(res.status).toBe(409);
    });
    test('completed local binding rejects change', async () => {
        const res = await request(setup('COMPLETED')).put('/agreements/1').send(body('COMPLETED'));
        expect(res.status).toBe(409);
    });
    test('draft local binding may change', async () => {
        const res = await request(setup('DRAFT')).put('/agreements/1').send(body('DRAFT'));
        expect(res.status).toBe(200);
    });
    test('signing accepts the equivalent reference and a valid signature update', async () => {
        const res = await request(setup('SIGNING')).put('/agreements/1').send({
            ...body('SIGNING'), template: `${prefix}${encodeURIComponent('ap://first')}`,
            signatures: [{ $class: 'org.accordproject.protocol@1.0.0.Signature',
                signatory: { $class: 'org.accordproject.protocol@1.0.0.AgreementParty', partyId: 'alice', name: 'Alice', signatory: true },
                metadata: { $class: 'org.accordproject.protocol@1.0.0.Metadata', values: [] }, signatureImage: [] }],
        });
        expect({ status: res.status, body: res.body }).toMatchObject({ status: 200, body: { signatures: [expect.anything()] } });
    });
    test('signing rejects changed data independently of the binding', async () => {
        const res = await request(setup('SIGNING')).put('/agreements/1').send({ ...body('SIGNING'), template: 'ap://first', data: { price: 20 } });
        expect(res.status).toBe(409);
        expect(res.body.error.details.field).toBe('data');
    });
});
