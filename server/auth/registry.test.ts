import { loadA2AConfig } from '../config';
import { createAuthAdapter, registerAdapter, registeredAdapterNames } from './registry';
import { NoneAdapter } from './noneAdapter';
import type { AdapterEnv, AuthAdapter } from './types';

describe('auth adapter registry', () => {
    test('contains the built-in adapters', () => {
        expect(registeredAdapterNames()).toEqual(expect.arrayContaining(['hs256', 'none']));
    });

    test('allows a custom adapter without changing the factory', () => {
        registerAdapter('test-custom', () => new NoneAdapter());
        const adapter = createAuthAdapter(loadA2AConfig({ AUTH_ADAPTER: 'test-custom' }));
        expect(adapter).toBeInstanceOf(NoneAdapter);
    });

    test('refuses the none adapter in production', () => {
        expect(() => createAuthAdapter({
            authAdapter: 'none',
            publicBaseUrl: 'https://apap.example.com',
            rateLimit: { windowMs: 60_000, max: 120 },
            trustProxy: false,
            isProduction: true,
        })).toThrow(/never available in production/);
    });

    test('names all registered options for an unknown adapter', () => {
        expect(() => createAuthAdapter(loadA2AConfig({ AUTH_ADAPTER: 'missing' })))
            .toThrow(/Registered options:.*hs256.*none/);
    });

    test('third-party factories do not receive sibling adapter secrets', () => {
        let receivedConfig: unknown;
        let receivedEnv: AdapterEnv | undefined;
        registerAdapter('test-isolated', (adapterConfig, env): AuthAdapter => {
            receivedConfig = adapterConfig;
            receivedEnv = env;
            return new NoneAdapter();
        });

        createAuthAdapter(loadA2AConfig({
            AUTH_ADAPTER: 'test-isolated',
            A2A_JWT_SECRET: 'this-should-never-be-visible-to-sibling-adapters-xyz',
            A2A_JWT_ISSUER: 'issuer.example',
            A2A_JWT_AUDIENCE: 'audience.example',
            PUBLIC_BASE_URL: 'https://apap.example.com',
        }));

        expect(receivedConfig).toBeUndefined();
        expect(receivedEnv).toEqual({
            isProduction: false,
            publicBaseUrl: 'https://apap.example.com',
        });
    });

});
