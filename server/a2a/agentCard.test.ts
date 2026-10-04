import { composeAgentCardSafely } from './agentCard';
import type { A2AConfig } from '../config';
import type { AuthAdapter, Principal } from '../auth/types';
import { AuthenticatedPrincipal } from '../auth/types';

const BASE_CONFIG: A2AConfig = {
    authAdapter: 'custom',
    publicBaseUrl: 'https://apap.example.com',
    rateLimit: { windowMs: 60_000, max: 120 },
    trustProxy: false,
    isProduction: false,
};

function adapterWithThrowingScheme(name: string, error: Error): AuthAdapter {
    return {
        name,
        securitySchemeName: 'Custom',
        authenticate: async (): Promise<Principal> =>
            new AuthenticatedPrincipal('agent', undefined, [], [], {}),
        describeScheme: () => { throw error; },
    };
}

describe('composeAgentCardSafely fallback', () => {
    test('advertises a generic Bearer scheme when the adapter card hook throws', () => {
        const adapter = adapterWithThrowingScheme('oidc', new Error('scheme hook crashed'));
        const warnings: unknown[] = [];
        const card = composeAgentCardSafely({ ...BASE_CONFIG, authAdapter: 'oidc' }, adapter, (e) => {
            warnings.push(e);
        });

        expect(Object.keys(card.securitySchemes ?? {})).toEqual(['Bearer']);
        expect(card.securityRequirements).toEqual([{ schemes: { Bearer: { list: [] } } }]);
        expect(card.skills.every((s) => s.securityRequirements.length > 0)).toBe(true);
    });

    test('logs the actual error so a plugin author can debug a crashing describeScheme', () => {
        const cause = new Error('kid not found');
        const adapter = adapterWithThrowingScheme('oidc', cause);
        const warnings: Array<Record<string, unknown>> = [];
        composeAgentCardSafely({ ...BASE_CONFIG, authAdapter: 'oidc' }, adapter, (e) => {
            warnings.push(e as Record<string, unknown>);
        });

        expect(warnings).toHaveLength(1);
        expect(warnings[0]).toMatchObject({
            event: 'a2a_agent_card_fallback',
            adapter: 'oidc',
            error: { name: 'Error', message: 'kid not found' },
        });
    });
});
