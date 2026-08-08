import request from 'supertest';
import express from 'express';
import { jest } from '@jest/globals';
import templatesRouter from './templates';
import * as templateService from '../services/templateService';
import { globalErrorHandler } from '../middleware/errorHandler';
import { InvalidPayloadError, TemplateCiceroVersionMismatchError } from '../services/errors';

jest.mock('../services/templateService');

const mockedTemplateService = templateService as jest.Mocked<typeof templateService>;

describe('POST /templates/archive', () => {
    let app: express.Application;

    beforeEach(() => {
        jest.clearAllMocks();
        app = express();
        app.use(express.json());
        app.use((req, res, next) => {
            res.locals.db = {};
            next();
        });
        app.use('/templates', templatesRouter);
        app.use(globalErrorHandler);
    });

    it('creates a template from a valid archive and returns 201', async () => {
        const createdTemplate = { id: 1, uri: 'archive:foo@1.0.0', hash: 'abc' };
        (mockedTemplateService.createTemplateFromArchive as any).mockResolvedValueOnce(createdTemplate);

        const res = await request(app)
            .post('/templates/archive')
            .set('Content-Type', 'application/octet-stream')
            .send(Buffer.from('fake-zip-bytes'));

        expect(res.status).toBe(201);
        expect(res.body).toEqual(createdTemplate);
        expect(mockedTemplateService.createTemplateFromArchive).toHaveBeenCalledWith(
            expect.anything(),
            expect.any(Buffer),
        );
    });

    it('returns 400 when the request body is empty', async () => {
        const res = await request(app)
            .post('/templates/archive')
            .set('Content-Type', 'application/octet-stream')
            .send(Buffer.alloc(0));

        expect(res.status).toBe(400);
        expect(mockedTemplateService.createTemplateFromArchive).not.toHaveBeenCalled();
    });

    it('returns 400 with INVALID_PAYLOAD when the service rejects a malformed archive', async () => {
        (mockedTemplateService.createTemplateFromArchive as any).mockRejectedValueOnce(
            new InvalidPayloadError('Uploaded file is not a valid .cta template archive'),
        );

        const res = await request(app)
            .post('/templates/archive')
            .set('Content-Type', 'application/octet-stream')
            .send(Buffer.from('garbage'));

        expect(res.status).toBe(400);
        expect(res.body.error.code).toBe('INVALID_PAYLOAD');
    });

    it('returns 422 with TEMPLATE_CICERO_VERSION_MISMATCH when the declared Cicero range is unsupported', async () => {
        (mockedTemplateService.createTemplateFromArchive as any).mockRejectedValueOnce(
            new TemplateCiceroVersionMismatchError('^99.0.0', '0.25.2'),
        );

        const res = await request(app)
            .post('/templates/archive')
            .set('Content-Type', 'application/octet-stream')
            .send(Buffer.from('fake-zip-bytes'));

        expect(res.status).toBe(422);
        expect(res.body.error.code).toBe('TEMPLATE_CICERO_VERSION_MISMATCH');
    });
});
