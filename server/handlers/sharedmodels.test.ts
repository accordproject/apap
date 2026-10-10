import { describe, it, expect, beforeEach, afterAll, jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import sharedModelsRouter from './sharedmodels';

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

    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterAll(() => {
        (global as any).fetch = originalFetch;
        jest.restoreAllMocks();
    });

    it('should reject a transitive import from a non-allowlisted domain', async () => {
        (global as any).fetch = jest.fn().mockImplementation(async (url: any): Promise<any> => {
            if (url === 'https://models.accordproject.org/safe.cto') {
                return {
                    ok: true,
                    headers: { get: (name: string): string | null => name === 'content-length' ? '100' : null },
                    text: async (): Promise<string> => `
                        namespace org.accordproject.safe@1.0.0
                        import org.evil@1.0.0.MaliciousAsset from https://evil-attacker.com/malicious.cto
                    `
                };
            }
            
            return {
                ok: true,
                headers: { get: (name: string): string | null => null },
                text: async (): Promise<string> => `namespace org.evil@1.0.0`
            };
        });

        const response = await request(app)
            .post('/sharedmodels')
            .send({ uri: 'https://models.accordproject.org/safe.cto' });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Failed to fetch or parse external model safely.');
        expect(response.body.details).toContain('SSRF Prevention: Transitive import domain or URL not allowed: https://evil-attacker.com/malicious.cto');
        
        expect((global as any).fetch).toHaveBeenCalledTimes(1); 
        expect((global as any).fetch).toHaveBeenCalledWith(
            'https://models.accordproject.org/safe.cto', 
            expect.any(Object)
        );
    });

    it('should fetch and insert a valid external model successfully', async () => {
        const mockCtoText = `
            namespace org.accordproject.valid@1.0.0
            concept ValidConcept {
                o String name
            }
        `;

        (global as any).fetch = jest.fn().mockImplementation(async (url: any): Promise<any> => {
            return {
                ok: true,
                headers: { get: (name: string): string | null => name === 'content-length' ? '100' : null },
                text: async (): Promise<string> => mockCtoText
            };
        });

        const response = await request(app)
            .post('/sharedmodels')
            .send({ uri: 'https://models.accordproject.org/valid.cto' });

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.model).toBeDefined();
        expect(response.body.model.$class).toBe('org.accordproject.protocol@1.0.0.CtoModel');
        expect(response.body.model.ctoFiles[0].filename).toBe('org.accordproject.valid@1.0.0.cto');
        expect(response.body.model.ctoFiles[0].contents).toBe(mockCtoText);
    });

    it('should reject URLs containing user credentials', async () => {
        const response = await request(app)
            .post('/sharedmodels')
            .send({ uri: 'https://evil.com@models.accordproject.org/safe.cto' });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Failed to fetch or parse external model safely.');
        expect(response.body.details).toContain('SSRF Prevention: User credentials in URL are not allowed.');
    });
});