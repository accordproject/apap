import { loadA2AConfig } from '../config';
import { createAuthAdapter, registerAdapter, registeredAdapterNames } from './registry';
import { NoneAdapter } from './noneAdapter';

describe('auth adapter registry', () => {
    test('contains the built-in adapters', () => {
        expect(registeredAdapterNames()).toEqual(expect.arrayContaining(['jwt', 'none']));
    });

    test('allows a custom adapter without changing the factory', () => {
        registerAdapter('test-custom', () => new NoneAdapter());
        const adapter = createAuthAdapter(loadA2AConfig({ AUTH_ADAPTER: 'test-custom' }));
        expect(adapter).toBeInstanceOf(NoneAdapter);
    });

    test('names all registered options for an unknown adapter', () => {
        expect(() => createAuthAdapter(loadA2AConfig({ AUTH_ADAPTER: 'missing' })))
            .toThrow(/Registered options:.*jwt.*none/);
    });
});
