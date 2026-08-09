import request from 'supertest';
import express from 'express';
import sharedModelsRouter from './sharedmodels';

const app = express();
app.use(express.json());
app.use('/sharedmodels', sharedModelsRouter);

describe('SharedModels SSRF Prevention', () => {
    const originalFetch = (global as any).fetch;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterAll(() => {
        (global as any).fetch = originalFetch;
    });

    it('should reject a transitive import from a non-allowlisted domain', async () => {
        (global as any).fetch = jest.fn().mockImplementation(async (url: string) => {
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
        
        expect(response.body.details).toBe('SSRF Prevention: Transitive import domain or URL not allowed: https://evil-attacker.com/malicious.cto');
        
        expect((global as any).fetch).toHaveBeenCalledTimes(1); 
        expect((global as any).fetch).toHaveBeenCalledWith(
            'https://models.accordproject.org/safe.cto', 
            expect.any(Object)
        );
    });
});