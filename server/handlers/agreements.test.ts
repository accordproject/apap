import request from 'supertest';
import express from 'express';
import { jest } from '@jest/globals';
import agreementsRouter from './agreements';
import { Agreement, Template } from '../db/schema';
import * as templateBuilder from './templatebuilder';
import { Template as ApTemplate } from '@accordproject/cicero-core';
import AdmZip from 'adm-zip';
import fs from 'fs';
import path from 'path';

jest.setTimeout(30000);

// ---- Partial mocks ----
jest.mock('../db/schema', () => {
  const actual = jest.requireActual('../db/schema');
  return {
    ...actual,
    Agreement: actual.Agreement,
    Template: actual.Template,
  };
});

jest.mock('./templatebuilder');

const mockedTemplateBuilder = templateBuilder as jest.Mocked<typeof templateBuilder>;

// ---- Types ----
type MockDb = {
  select: jest.Mock;
  update: jest.Mock;
  from: jest.Mock;
  set: jest.Mock;
  where: jest.Mock;
  limit: jest.Mock;
  insert: jest.Mock;
  values: jest.Mock;
  onConflictDoNothing: jest.Mock;
  returning: jest.Mock;
};

// ---- Helpers ----
async function createTemplate(): Promise<ApTemplate> {
  const templatePath = path.join(__dirname, '../test/archives/latedeliveryandpenalty-typescript');

  const zip = new AdmZip();

  zip.addFile(
    'package.json',
    Buffer.from(fs.readFileSync(path.join(templatePath, 'package.json'), 'utf8'))
  );

  zip.addFile(
    'text/grammar.tem.md',
    Buffer.from(fs.readFileSync(path.join(templatePath, 'text/grammar.tem.md'), 'utf8'))
  );

  fs.readdirSync(path.join(templatePath, 'model')).forEach(file => {
    zip.addFile(
      `model/${file}`,
      Buffer.from(fs.readFileSync(path.join(templatePath, 'model', file), 'utf8'))
    );
  });

  const buffer = zip.toBuffer();
  return ApTemplate.fromArchive(buffer);
}

function setupDbMocks(mockDb: MockDb) {
  mockDb.select.mockReturnValue(mockDb);
  mockDb.from.mockReturnValue(mockDb);
  mockDb.where.mockReturnValue(mockDb);
  mockDb.limit.mockReturnValue(mockDb);
}

// ---- TEST SUITE ----
describe('Agreement API', () => {
  let app: express.Application;
  let mockDb: MockDb;

  beforeEach(() => {
    jest.clearAllMocks();

    app = express();
    app.use(express.json());

    mockDb = {
      select: jest.fn(),
      update: jest.fn(),
      from: jest.fn(),
      set: jest.fn(),
      where: jest.fn(),
      limit: jest.fn(),
      insert: jest.fn(),
      values: jest.fn(),
      onConflictDoNothing: jest.fn(),
      returning: jest.fn(),
    };

    app.use((req, res, next) => {
      res.locals.db = mockDb;
      next();
    });

    app.use('/agreements', agreementsRouter);
  });

  // =====================
  // ✅ SUCCESS CASES
  // =====================
  describe('Trigger API', () => {
    let template: ApTemplate;

    beforeEach(async () => {
      template = await createTemplate();
      setupDbMocks(mockDb);

      mockDb.limit
        .mockResolvedValueOnce([{ id: 1, template: 'test://template', data: {}, state: null }])
        .mockResolvedValueOnce([{ id: 1, uri: 'test://template' }]);

      mockedTemplateBuilder.templateFromDatabase.mockResolvedValue(template);
    });

    it('should trigger agreement successfully', async () => {
      mockDb.update.mockReturnValue(mockDb);
      mockDb.set.mockReturnValue(mockDb);

      const res = await request(app)
        .post('/agreements/1/trigger')
        .send({
          $class: 'io.clause.latedeliveryandpenalty@0.1.0.LateDeliveryAndPenaltyRequest',
          forceMajeure: false,
          agreedDelivery: '2024-01-01T00:00:00Z',
          deliveredAt: '2024-01-15T00:00:00Z',
          goodsValue: 1000,
        })
        .expect(200);

      expect(res.body.result).toBeDefined();
      expect(res.body.state).toBeDefined();
    });

    it('should reject invalid request type', async () => {
      const res = await request(app)
        .post('/agreements/1/trigger')
        .send({ $class: 'invalid.Type' })
        .expect(400);

      expect(res.body.error).toBeDefined();
    });

    it('should persist state across triggers', async () => {
      mockDb.update.mockReturnValue(mockDb);
      mockDb.set.mockReturnValue(mockDb);

      const requestBody = {
        $class: 'io.clause.latedeliveryandpenalty@0.1.0.LateDeliveryAndPenaltyRequest',
        forceMajeure: false,
        agreedDelivery: '2024-01-01T00:00:00Z',
        deliveredAt: '2024-01-15T00:00:00Z',
        goodsValue: 1000,
      };

      const res1 = await request(app).post('/agreements/1/trigger').send(requestBody);

      mockDb.limit
        .mockResolvedValueOnce([{ id: 1, template: 'test://template', data: {}, state: res1.body.state }])
        .mockResolvedValueOnce([{ id: 1, uri: 'test://template' }]);

      const res2 = await request(app).post('/agreements/1/trigger').send(requestBody);

      expect(res2.body.state.count).toBeGreaterThan(res1.body.state.count);
    });
  });

  // =====================
  // ❌ ERROR CASES
  // =====================
  describe('Error Handling', () => {
    it('should return 500 for missing agreement', async () => {
      mockDb.limit.mockResolvedValueOnce([]);

      const res = await request(app)
        .post('/agreements/999/trigger')
        .send({})
        .expect(500);

      expect(res.body.error).toBeDefined();
    });

    it('should return 500 for invalid ID', async () => {
      const res = await request(app)
        .post('/agreements/abc/trigger')
        .send({})
        .expect(500);

      expect(res.body.error).toBeDefined();
    });
  });

  // =====================
  // 🌐 TEMPLATE FETCH
  // =====================
  describe('Agreement Creation (External Template)', () => {
    let templateBuffer: Buffer;
    let originalFetch: any;

    beforeEach(async () => {
      const template = await createTemplate();
      templateBuffer = await template.toArchive();

      originalFetch = global.fetch;

      global.fetch = jest.fn(async () => ({
        ok: true,
        arrayBuffer: async () =>
          templateBuffer.buffer.slice(
            templateBuffer.byteOffset,
            templateBuffer.byteOffset + templateBuffer.byteLength
          ),
      })) as any;
    });

    afterEach(() => {
      global.fetch = originalFetch;
    });

    it('should fetch and store external template', async () => {
      mockDb.insert.mockReturnValue(mockDb);
      mockDb.values.mockReturnValue(mockDb);
      mockDb.onConflictDoNothing.mockResolvedValue([]);
      mockDb.returning.mockResolvedValue([{ id: 1 }]);

      setupDbMocks(mockDb);
      mockDb.limit.mockResolvedValueOnce([]);

      const res = await request(app)
        .post('/agreements')
        .send({
          template: 'https://example.com/template.cta',
          data: { $class: 'test.Model' },
        });

      expect(res.status).toBe(200);
      expect(global.fetch).toHaveBeenCalled();
      expect(mockDb.insert).toHaveBeenCalledWith(Template);
    });
  });
});
