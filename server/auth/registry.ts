import type { A2AConfig } from '../config';
import { JwtAdapter } from './jwtAdapter';
import { NoneAdapter } from './noneAdapter';
import type { AdapterEnv, AuthAdapter } from './types';

/**
 * Factories receive only their own config slice plus cross-cutting runtime
 * flags, never the full A2AConfig. This prevents sibling-adapter secret leaks
 * when third-party adapters register alongside the built-ins.
 */
export type AuthAdapterFactory = (
    adapterConfig: unknown,
    env: AdapterEnv,
) => AuthAdapter;

const factories = new Map<string, AuthAdapterFactory>();

/**
 * Each built-in declares the A2AConfig field that carries its sub-config.
 * Entries not listed here receive `undefined` from the registry and are
 * expected to read their own environment variables.
 */
const BUILT_IN_CONFIG_FIELD: Readonly<Record<string, keyof A2AConfig>> = {
    hs256: 'hs256',
};

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
    const env: AdapterEnv = {
        isProduction: config.isProduction,
        publicBaseUrl: config.publicBaseUrl,
    };
    const field = BUILT_IN_CONFIG_FIELD[config.authAdapter];
    const adapterConfig = field ? config[field] : undefined;
    return factory(adapterConfig, env);
}

registerAdapter('none', (_adapterConfig, env) => {
    // Second lock: loadA2AConfig already refuses `none` outside development and
    // test, so reaching here in production means that check was bypassed.
    if (env.isProduction) {
        throw new Error('A2A configuration error: AUTH_ADAPTER=none is never available in production.');
    }
    return new NoneAdapter();
});
registerAdapter('hs256', (adapterConfig) => {
    const hs256 = adapterConfig as A2AConfig['hs256'];
    if (!hs256) throw new Error('A2A configuration error: missing validated HS256 configuration.');
    return new JwtAdapter(hs256);
});
