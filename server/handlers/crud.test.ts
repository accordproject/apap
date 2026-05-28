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
});
