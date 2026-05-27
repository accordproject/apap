import request from 'supertest';
import express from 'express';
import { jest } from '@jest/globals';
import templatesRouter from './templates';
import * as db from './templatebuilder';
import * as validationModule from './concertovalidation';
import { TemplateInsertSchema } from '../db/schema';

// Mock dependencies
jest.mock('../db/schema');
jest.mock('./templatebuilder');
jest.mock('./concertovalidation', () => {
    const actualModule = jest.requireActual('./concertovalidation') as any;
    return {
        __esModule: true,
        ...actualModule,
        concertoValidation: jest.fn().mockImplementation(actualModule.concertoValidation),
        default: jest.fn().mockImplementation(actualModule.default || actualModule.concertoValidation)
    };
});

// Get a reference to the mocked schema so we can control safeParse
const mockedSchema = TemplateInsertSchema as jest.Mocked<typeof TemplateInsertSchema>;

describe('templateValidation', () => {
  let app: express.Application;
  
  const validTemplateBody = {
    uri: 'https://templates.accordproject.org/latedeliveryandpenalty@0.1.0.cta',
    author: 'Accord Project',
    version: '0.1.0',
    description: 'A template',
    license: 'Apache-2.0',
    displayName: 'Template',
    keywords: ['test'],
    templateModel: { typeName: 'Test', model: { $class: 'Test', ctoFiles: [] as any[] } },
    text: { templateText: 'test' },
    logic: { codes: [] as any[] },
    hash: 'hash',
    metadata: {},
    logo: ''
  };

  beforeEach(() => {
    jest.clearAllMocks();
    app = express();
    app.use(express.json());
    // Create mock DB middleware just like agreements.test.ts
    app.use((req, res, next) => {
        res.locals.db = {
            insert: jest.fn().mockReturnThis(),
            values: jest.fn().mockReturnThis(),
            returning: jest.fn<any>().mockResolvedValue([{ id: 1 }])
        };
        next();
    });
    app.use('/templates', templatesRouter);
  });

  it('returns 400 with Concerto error when body is missing required fields', async () => {
    // Zod schema passes (lets body through to custom validation)
    (mockedSchema.safeParse as any) = jest.fn().mockReturnValue({ success: true, data: {} });
    // Concerto validation fails for the empty body
    const valModule = require('./concertovalidation');
    valModule.concertoValidation.mockResolvedValueOnce({ success: false, error: { errors: [{ message: 'Missing fields' }] } });

    const res = await request(app)
      .post('/templates')
      .send({}) // empty body
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error'); // structured Concerto error
  });

  it('does NOT return a 500 deserialization error for invalid body', async () => {
    // Zod schema passes (lets body through to custom validation)
    (mockedSchema.safeParse as any) = jest.fn().mockReturnValue({ success: true, data: { invalid: 'data' } });
    // Concerto validation rejects the invalid data
    const valModule = require('./concertovalidation');
    valModule.concertoValidation.mockResolvedValueOnce({ success: false, error: { errors: [{ message: 'Invalid data' }] } });

    const res = await request(app)
      .post('/templates')
      .send({ invalid: 'data' });
    expect(res.status).not.toBe(500);
  });

  it('proceeds to templateFromDatabase when body is valid', async () => {
    // Zod schema passes
    (mockedSchema.safeParse as any) = jest.fn().mockReturnValue({ success: true, data: validTemplateBody });
    // Concerto validation passes
    const valModule = require('./concertovalidation');
    valModule.concertoValidation.mockResolvedValueOnce({ success: true, data: validTemplateBody });
    // templateFromDatabase succeeds
    jest.spyOn(db, 'templateFromDatabase').mockResolvedValueOnce({} as any);

    const res = await request(app)
      .post('/templates')
      .send(validTemplateBody);
    expect(res.status).toBe(200);
  });

  it('returns templateFromDatabase error when validation passes but DB fails', async () => {
    // Zod schema passes
    (mockedSchema.safeParse as any) = jest.fn().mockReturnValue({ success: true, data: validTemplateBody });
    // Concerto validation passes
    const valModule = require('./concertovalidation');
    valModule.concertoValidation.mockResolvedValueOnce({ success: true, data: validTemplateBody });
    // mock templateFromDatabase to throw
    jest.spyOn(db, 'templateFromDatabase').mockRejectedValueOnce(new Error('DB error'));

    const res = await request(app)
      .post('/templates')
      .send(validTemplateBody);
    
    // templateValidation's catch block returns { success: false, error: { errors: [{ message: 'DB error' }] } }
    // The CRUD handler sees success:false and returns 400 with details containing the error
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
    expect(res.body.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ message: 'DB error' })
      ])
    );
  });

});

