import request from 'supertest';
import express from 'express';
import { jest } from '@jest/globals';
import templatesRouter from './templates';
import * as db from './templatebuilder';
import * as validationModule from './concertovalidation';

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

describe('templateValidation', () => {
  let app: express.Application;
  
  beforeEach(() => {
    jest.clearAllMocks();
    app = express();
    app.use(express.json());
    // Create mock DB middleware just like agreements.test.ts if needed
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

  it('returns 400 with Concerto error when body is missing required fields', async () => {
    const valModule = require('./concertovalidation');
    valModule.concertoValidation.mockResolvedValueOnce({ success: false, error: { errors: [{ message: 'Missing fields' }] } });

    const res = await request(app)
      .post('/templates')
      .send({}) // empty body
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error'); // structured Concerto error
  });

  it('does NOT return a 500 deserialization error for invalid body', async () => {
    const valModule = require('./concertovalidation');
    valModule.concertoValidation.mockResolvedValueOnce({ success: false, error: { errors: [{ message: 'Invalid data' }] } });

    const res = await request(app)
      .post('/templates')
      .send({ invalid: 'data' });
    expect(res.status).not.toBe(500);
  });

  it('proceeds to templateFromDatabase when body is valid', async () => {
    jest.spyOn(db, 'templateFromDatabase').mockResolvedValueOnce({} as any);
    const valModule = require('./concertovalidation');
    valModule.concertoValidation.mockResolvedValueOnce({ success: true, data: validTemplateBody });

    const res = await request(app)
      .post('/templates')
      .send(validTemplateBody); // use a real valid template body from existing tests
    expect(res.status).toBe(200);
  });

  it('returns templateFromDatabase error when validation passes but DB fails', async () => {
    // mock templateFromDatabase to throw
    jest.spyOn(db, 'templateFromDatabase').mockRejectedValueOnce(new Error('DB error'));
    const valModule = require('./concertovalidation');
    valModule.concertoValidation.mockResolvedValueOnce({ success: true, data: validTemplateBody });

    const res = await request(app)
      .post('/templates')
      .send(validTemplateBody);
    
    // We expect 400 if catch block returns success:false, or 500 if crud catches.
    // The user instruction expects 500, let's see. If it fails, we will adjust the templates.ts to throw.
    expect(res.status).toBe(500);
    expect(res.body.error).toMatch(/DB error/);
  });

});
