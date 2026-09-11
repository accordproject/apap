import { loadA2AConfig } from './config';

describe('loadA2AConfig', () => {
    test('uses the explicit local unauthenticated development configuration', () => {
        expect(loadA2AConfig({ NODE_ENV: 'development', AUTH_ADAPTER: 'none' })).toMatchObject({
            authAdapter: 'none',
            publicBaseUrl: 'http://localhost:9000',
            isProduction: false,
        });
    });

    test.each([undefined, 'none'])('fails closed in production when AUTH_ADAPTER is %s', (adapter) => {
        expect(() => loadA2AConfig({
            NODE_ENV: 'production',
            PUBLIC_BASE_URL: 'https://apap.example.com',
            ...(adapter && { AUTH_ADAPTER: adapter }),
        })).toThrow(/AUTH_ADAPTER must be explicitly set|allowed only/);
    });

    test('requires an explicit adapter and confines none to development or test', () => {
        expect(() => loadA2AConfig({})).toThrow(/AUTH_ADAPTER must be explicitly set/);
        expect(() => loadA2AConfig({ AUTH_ADAPTER: 'none' })).toThrow(/development or test/);
        expect(loadA2AConfig({ NODE_ENV: 'test', AUTH_ADAPTER: 'none' }).authAdapter).toBe('none');
    });

    test('requires a stable public URL in production', () => {
        expect(() => loadA2AConfig({ NODE_ENV: 'production', AUTH_ADAPTER: 'custom' }))
            .toThrow(/PUBLIC_BASE_URL is required/);
        expect(() => loadA2AConfig({
            NODE_ENV: 'production',
            AUTH_ADAPTER: 'custom',
            PUBLIC_BASE_URL: 'http://apap.example.com',
        })).toThrow(/must use HTTPS/);
    });

    test('validates JWT configuration eagerly', () => {
        expect(() => loadA2AConfig({ AUTH_ADAPTER: 'hs256' })).toThrow(/requires A2A_JWT_SECRET/);
        expect(() => loadA2AConfig({
            AUTH_ADAPTER: 'hs256',
            A2A_JWT_SECRET: 'short',
            A2A_JWT_ISSUER: 'issuer',
            A2A_JWT_AUDIENCE: 'audience',
        })).toThrow(/at least 32 characters/);
    });
});
