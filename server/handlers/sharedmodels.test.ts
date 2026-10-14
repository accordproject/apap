import { describe, it, expect, beforeEach, afterAll, jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import sharedModelsRouter from './sharedmodels';
import { concertoValidation } from './concertovalidation';

jest.mock('./crud', () => ({
    buildCrudRouter: jest.fn(() => {
        const router = express.Router();
        router.post('/', (req, res) => {
            res.status(200).json({ success: true, model: req.body.model });
        });
        return router;
    }),
}));

const app = express();
app.use(express.json());
app.use('/sharedmodels', sharedModelsRouter);

describe('SharedModels SSRF Prevention and Retrieval', () => {
    const originalFetch = (global as any).fetch;
    const createMockResponse = (text: string) => ({
        ok: true,
        text: async () => text,
        headers: { get: (name: string): string | null => name === 'content-length' ? '100' : null },
        body: {
            getReader: () => {
                let readCount = 0;
                return {
                    read: async () => {
                        if (readCount++ === 0) {
                            return { done: false, value: new TextEncoder().encode(text) };
                        }
                        return { done: true };
                    },
                    cancel: async () => {}
                };
            }
        }
    });

    beforeEach(() => {
        jest.clearAllMocks();
        (global as any).fetch = originalFetch;
    });

    afterAll(() => {
        (global as any).fetch = originalFetch;
        jest.restoreAllMocks();
    });

    it('should reject a transitive import from a non-allowlisted domain', async () => {
        (global as any).fetch = jest.fn().mockImplementation(async (url: any, options: any): Promise<any> => {
            if (url === 'https://models.accordproject.org/safe.cto') {
                return createMockResponse(`
                    namespace org.accordproject.safe@1.0.0
                    import org.evil@1.0.0.MaliciousAsset from https://evil-attacker.com/malicious.cto
                `);
            }
            return originalFetch(url, options);
        });

        const response = await request(app)
            .post('/sharedmodels')
            .send({ uri: 'https://models.accordproject.org/safe.cto' });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Failed to fetch or parse external model safely.');
        expect(response.body.details).toContain('SSRF Prevention: Transitive import domain or URL not allowed: https://evil-attacker.com/malicious.cto');
    });

    it('should fetch and insert a valid external model successfully', async () => {
        const mockCtoText = `
            namespace org.accordproject.valid@1.0.0
            concept ValidConcept {
                o String name
            }
        `;

        (global as any).fetch = jest.fn().mockImplementation(async (url: any, options: any): Promise<any> => {
            if (url === 'https://models.accordproject.org/valid.cto') {
                return createMockResponse(mockCtoText);
            }
            return originalFetch(url, options);
        });

        const response = await request(app)
            .post('/sharedmodels')
            .send({ uri: 'https://models.accordproject.org/valid.cto' });

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.model).toBeDefined();
        await concertoValidation('SharedModel', {
            uri: 'https://models.accordproject.org/valid.cto',
            model: response.body.model
        });
    });

    it('should reject URLs containing user credentials', async () => {
        const response = await request(app)
            .post('/sharedmodels')
            .send({ uri: 'https://evil.com@models.accordproject.org/safe.cto' });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Failed to fetch or parse external model safely.');
    });
});
