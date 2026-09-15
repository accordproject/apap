import { loadA2AConfig } from '../config';
import { createAuthAdapter, registerAdapter, registeredAdapterNames } from './registry';
import { NoneAdapter } from './noneAdapter';

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
});
