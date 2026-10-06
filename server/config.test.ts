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

    test('defaults the in-process rate limit and accepts overrides', () => {
        expect(loadA2AConfig({ NODE_ENV: 'test', AUTH_ADAPTER: 'none' }).rateLimit)
            .toEqual({ windowMs: 60_000, max: 120 });
        expect(loadA2AConfig({
            NODE_ENV: 'test',
            AUTH_ADAPTER: 'none',
            A2A_RATE_LIMIT_WINDOW_MS: '1000',
            A2A_RATE_LIMIT_MAX: '5',
        }).rateLimit).toEqual({ windowMs: 1000, max: 5 });
    });

    test('rejects a non-positive rate limit', () => {
        for (const A2A_RATE_LIMIT_MAX of ['0', '-1', 'lots', '1.5']) {
            expect(() => loadA2AConfig({ NODE_ENV: 'test', AUTH_ADAPTER: 'none', A2A_RATE_LIMIT_MAX }))
                .toThrow(/A2A_RATE_LIMIT_MAX must be a positive integer/);
        }
    });

    test('parses TRUST_PROXY into an Express trust-proxy setting', () => {
        const load = (TRUST_PROXY?: string) =>
            loadA2AConfig({ NODE_ENV: 'test', AUTH_ADAPTER: 'none', ...(TRUST_PROXY !== undefined && { TRUST_PROXY }) }).trustProxy;

        expect(load()).toBe(false);
        expect(load('false')).toBe(false);
        expect(load('')).toBe(false);
        expect(load('true')).toBe(true);
        expect(load('1')).toBe(1);
        expect(load('loopback')).toBe('loopback');
        expect(load('10.0.0.0/8, 192.168.0.0/16')).toBe('10.0.0.0/8, 192.168.0.0/16');
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
