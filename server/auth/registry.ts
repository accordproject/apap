import type { A2AConfig } from '../config';
import { JwtAdapter } from './jwtAdapter';
import { NoneAdapter } from './noneAdapter';
import type { AuthAdapter } from './types';

export type AuthAdapterFactory = (config: A2AConfig) => AuthAdapter;

const factories = new Map<string, AuthAdapterFactory>();

/** Registers an adapter without requiring a patch to APAP core. */
export function registerAdapter(name: string, factory: AuthAdapterFactory): void {
    const normalized = name.trim().toLowerCase();
    if (!normalized) throw new Error('Auth adapter name cannot be empty.');
    if (factories.has(normalized)) throw new Error(`Auth adapter already registered: ${normalized}`);
    factories.set(normalized, factory);
}

export function registeredAdapterNames(): string[] {
    return Array.from(factories.keys()).sort();
}

export function createAuthAdapter(config: A2AConfig): AuthAdapter {
    const factory = factories.get(config.authAdapter);
    if (!factory) {
        throw new Error(
            `A2A configuration error: unknown AUTH_ADAPTER "${config.authAdapter}". ` +
            `Registered options: ${registeredAdapterNames().join(', ')}.`,
        );
    }
    return factory(config);
}

registerAdapter('none', (config) => {
    // Second lock: loadA2AConfig already refuses `none` outside development and
    // test, so reaching here in production means that check was bypassed.
    if (config.isProduction) {
        throw new Error('A2A configuration error: AUTH_ADAPTER=none is never available in production.');
    }
    return new NoneAdapter();
});
registerAdapter('hs256', (config) => {
    if (!config.hs256) throw new Error('A2A configuration error: missing validated HS256 configuration.');
    return new JwtAdapter(config.hs256);
});
