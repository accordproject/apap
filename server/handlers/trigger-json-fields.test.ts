import fs from 'fs';
import path from 'path';
import AdmZip from 'adm-zip';
import { ModelManager } from '@accordproject/concerto-core';
import { Template } from '@accordproject/cicero-core';
import { concertoValidation } from './concertovalidation';
import * as validation from './concertovalidation';
import express from 'express';
import request from 'supertest';
import { AgreementInsertSchema } from '../db/schema';
import agreementRouter from './agreements';
import { globalErrorHandler } from '../middleware/errorHandler';
import { SignJWT } from 'jose';
import { JwtAdapter } from '../auth/jwtAdapter';
import { createA2AComponents } from './a2a';
import * as templateBuilder from './templatebuilder';
import { triggerAgreement } from '../services/agreementService';
import { createLegacyPolicyContext } from '../services/policy';

jest.setTimeout(60000);

const model = `namespace org.test@1.0.0
import org.accordproject.contract@0.2.0.Clause from https://models.accordproject.org/accordproject/contract@0.2.0.cto
import org.accordproject.runtime@0.2.0.{Request,Response} from https://models.accordproject.org/accordproject/runtime@0.2.0.cto
@template
asset TemplateModel extends Clause { o String name }
transaction MyRequest extends Request { o String data o String state }
transaction MyResponse extends Response { o String observedData o String observedState }`;
const logic = `class EchoLogic extends TemplateLogic<any, any> { async trigger(data: any, request: any, state: any): Promise<any> { return { result: { $class: 'org.test@1.0.0.MyResponse', observedData: request.data, observedState: request.state }, state: {}, events: [] }; } } export default EchoLogic;`;

describe('trigger request fields and Agreement JSON normalization', () => {
    let template: Template;
    let savedFetch: any;
    beforeAll(async () => {
        savedFetch = (global as any).fetch;
        const modelDir = path.join(__dirname, '../test/archives/latedeliveryandpenalty-typescript/model');
        const models: Record<string, string> = {
            'https://models.accordproject.org/accordproject/contract@0.2.0.cto': '@models.accordproject.org.accordproject.contract@0.2.0.cto',
            'https://models.accordproject.org/accordproject/runtime@0.2.0.cto': '@models.accordproject.org.accordproject.runtime@0.2.0.cto',
        };
        (global as any).fetch = (async (url: any) => {
            const name = models[String(url)];
            if (!name) throw new Error(`Unexpected model URL: ${String(url)}`);
            return new Response(fs.readFileSync(path.join(modelDir, name), 'utf8'), { status: 200 });
        }) as any;
        const archive = new AdmZip();
        archive.addFile('package.json', Buffer.from(JSON.stringify({ name: 'test-echo', version: '1.0.0', description: 'local test', accordproject: { runtime: 'typescript', template: 'clause', cicero: '^2.0.0' } })));
        archive.addFile('text/grammar.tem.md', Buffer.from('Hello {{name}}.'));
        archive.addFile('model/model.cto', Buffer.from(model));
        for (const filename of fs.readdirSync(modelDir).filter((name) => name.startsWith('@models'))) archive.addFile(`model/${filename}`, fs.readFileSync(path.join(modelDir, filename)));
        archive.addFile('logic/logic.ts', Buffer.from(logic));
        template = await Template.fromArchive(archive.toBuffer());
        // Avoid remote APAP protocol imports: the tests supply their own local model managers.
        jest.spyOn(ModelManager.prototype, 'updateExternalModels').mockResolvedValue(undefined as any);
    });
    afterAll(() => { (global as any).fetch = savedFetch; jest.restoreAllMocks(); });

    it('passes String data and state unchanged through the real trigger service and processor', async () => {
        const input = { $class: 'org.test@1.0.0.MyRequest', data: 'hello', state: 'ready' };
        const agreement = { id: 1, template: 'local://test', data: { $class: 'org.test@1.0.0.TemplateModel', clauseId: 'c1', name: 'A' }, state: {} };
        let reads = 0;
        const db: any = { select: jest.fn().mockReturnThis(), from: jest.fn().mockReturnThis(), where: jest.fn().mockReturnThis(), limit: jest.fn(async () => reads++ === 0 ? [agreement] : [{}]), update: jest.fn().mockReturnThis(), set: jest.fn().mockReturnThis() };
        const builder = jest.spyOn(templateBuilder, 'templateFromDatabase').mockResolvedValueOnce(template);
        try {
            const result = await triggerAgreement(createLegacyPolicyContext(db), 1, input);
            expect(input).toEqual({ $class: 'org.test@1.0.0.MyRequest', data: 'hello', state: 'ready' });
            expect(result.result).toMatchObject({ observedData: 'hello', observedState: 'ready' });
            expect(db.set).toHaveBeenCalledWith({ state: result.state });
        } finally { builder.mockRestore(); }
    });

    it('returns unchanged request Strings through authenticated A2A HTTP', async () => {
        const agreement = { id: 1, template: 'local://test', data: { $class: 'org.test@1.0.0.TemplateModel', clauseId: 'c1', name: 'A' }, state: {} };
        let reads = 0;
        const db: any = { select: jest.fn().mockReturnThis(), from: jest.fn().mockReturnThis(), where: jest.fn().mockReturnThis(), limit: jest.fn(async () => reads++ === 0 ? [agreement] : [{}]), update: jest.fn().mockReturnThis(), set: jest.fn().mockReturnThis() };
        const builder = jest.spyOn(templateBuilder, 'templateFromDatabase').mockResolvedValueOnce(template);
        const auth = { secret: 'local-test-secret-at-least-32-characters', issuer: 'https://issuer.example.com', audience: 'apap-test' };
        const config: any = { authAdapter: 'hs256', publicBaseUrl: 'https://example.com', hs256: auth, rateLimit: { windowMs: 60000, max: 100 }, trustProxy: false, isProduction: false };
        const token = await new SignJWT({ scope: 'apap:trigger:invoke' }).setProtectedHeader({ alg: 'HS256' }).setSubject('test-agent').setIssuer(auth.issuer).setAudience(auth.audience).setExpirationTime('5m').sign(new TextEncoder().encode(auth.secret));
        const app = express(); app.use('/a2a', createA2AComponents(db, config, new JwtAdapter(auth)).router);
        try {
            const response = await request(app).post('/a2a').set('Authorization', `Bearer ${token}`).set('A2A-Version', '1.0').send({ jsonrpc: '2.0', id: 'trigger-test', method: 'SendMessage', params: { message: { messageId: 'trigger-test', role: 'ROLE_USER', parts: [{ data: { skillId: 'trigger-agreement', input: { id: 1, request: { $class: 'org.test@1.0.0.MyRequest', data: 'hello', state: 'ready' } } }, mediaType: 'application/json' }] } } });
            expect(response.status).toBe(200);
            expect(response.body.result.task.status.state).toBe('TASK_STATE_COMPLETED');
            expect(response.body.result.task.artifacts[0].parts[0].data.result).toMatchObject({ observedData: 'hello', observedState: 'ready' });
            expect(db.set).toHaveBeenCalled();
        } finally { builder.mockRestore(); }
    });

    it('keeps Agreement JSON data and state normalization', async () => {
        const manager = new ModelManager({ addMetamodel: true });
        manager.addCTOModel('namespace org.accordproject.protocol@1.0.0\nscalar JSON extends String\nconcept Agreement { o JSON data o JSON state optional }', 'agreement.cto');
        const body: any = { data: { x: 1 }, state: { step: 2 } };
        const result = await concertoValidation('Agreement', body, manager);
        expect(result.success).toBe(true);
        expect(body.data).toBe('{"x":1}');
        expect(body.state).toBe('{"step":2}');
        expect(result.data).toMatchObject({ data: '{"x":1}', state: '{"step":2}' });
    });
    it.each(['create', 'update'])('persists normalized Agreement JSON fields on %s', async (operation) => {
        const manager = new ModelManager({ addMetamodel: true });
        manager.addCTOModel('namespace org.accordproject.protocol@1.0.0\nscalar JSON extends String\nconcept Agreement { o JSON data o JSON state optional o String template optional o String uri optional o String organization optional }', 'agreement.cto');
        const originalValidation = validation.concertoValidation;
        const validationSpy = jest.spyOn(validation, 'concertoValidation').mockImplementation((type, body) => originalValidation(type, body, manager));
        const schema = jest.spyOn(AgreementInsertSchema as any, 'safeParse').mockImplementation((body: any) => ({ success: true, data: body }));
        const db: any = { insert: jest.fn().mockReturnThis(), values: jest.fn().mockReturnThis(), returning: jest.fn().mockImplementation(async () => [{ id: 1 }]), select: jest.fn().mockReturnThis(), from: jest.fn().mockReturnThis(), where: jest.fn().mockReturnThis(), for: jest.fn().mockReturnThis(), limit: jest.fn().mockImplementation(async () => [{ id: 1, agreementStatus: 'DRAFT' }]), update: jest.fn().mockReturnThis(), set: jest.fn().mockReturnThis() };
        db.transaction = jest.fn((callback: any) => callback(db));
        const app = express(); app.use(express.json());
        app.use((_req, res, next) => { res.locals.db = db; next(); });
        app.use('/agreements', agreementRouter); app.use(globalErrorHandler);
        const body = { uri: 'test://agreement', template: 'local://template', data: { x: 1 }, state: { step: 2 } };
        try {
            const response = operation === 'create' ? await request(app).post('/agreements').send(body) : await request(app).put('/agreements/1').send(body);
            expect(response.status).toBe(200);
            const write = operation === 'create' ? db.values : db.set;
            expect(write).toHaveBeenCalledWith(expect.objectContaining({ data: '{"x":1}', state: '{"step":2}' }));
        } finally { validationSpy.mockRestore(); schema.mockRestore(); }
    });

    it('leaves empty String request fields unchanged', async () => {
        const body = { $class: 'org.test@1.0.0.MyRequest', data: '', state: '' };
        const result = await concertoValidation(body.$class, body, template.getModelManager());
        expect(result.success).toBe(true);
        expect(body).toMatchObject({ data: '', state: '' });
    });

    it.each([undefined, null, '', 0, false])('keeps missing, null and falsy request state %p unchanged', async (value) => {
        const body: any = { $class: 'org.test@1.0.0.MyRequest', data: 'hello' };
        if (value !== undefined) body.state = value;
        const before = { ...body };
        const result = await concertoValidation(body.$class, body, template.getModelManager());
        expect(body).toEqual(before);
        expect(result.success).toBe(value === '');
    });

    it.each([undefined, null, '', 0, false])('preserves existing falsy Agreement normalization behavior for %p', async (value) => {
        const manager = new ModelManager({ addMetamodel: true });
        manager.addCTOModel('namespace org.accordproject.protocol@1.0.0\nscalar JSON extends String\nconcept Agreement { o JSON data optional o JSON state optional }', 'agreement.cto');
        const body: any = value === undefined ? {} : { data: value, state: value };
        const before = { ...body };
        await concertoValidation('Agreement', body, manager);
        expect(body).toEqual(before);
    });

});
