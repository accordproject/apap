import { A2A_PROTOCOL_VERSION, type AgentCard, type SecurityScheme } from '@a2a-js/sdk';
import type { A2AConfig } from '../config';
import type { AuthAdapter } from '../auth/types';
import { A2A_SKILLS } from '../services/a2aService';

function bearerFallback(): SecurityScheme {
    return {
        scheme: {
            $case: 'httpAuthSecurityScheme',
            value: {
                description: 'Bearer authentication is required.',
                scheme: 'Bearer',
                bearerFormat: 'JWT',
            },
        },
    };
}

function cardWithScheme(
    config: A2AConfig,
    schemeName: string | undefined,
    scheme: SecurityScheme | undefined,
): AgentCard {
    const securitySchemes = schemeName && scheme ? { [schemeName]: scheme } : {};
    const requirementsFor = (scope: string) => schemeName
        ? [{ schemes: { [schemeName]: { list: [scope] } } }]
        : [];

    return {
        name: 'Accord Project Agreement Protocol',
        description: 'A2A access to APAP templates, agreements, and agreement execution.',
        supportedInterfaces: [{
            url: `${config.publicBaseUrl}/a2a`,
            protocolBinding: 'JSONRPC',
            tenant: '',
            protocolVersion: A2A_PROTOCOL_VERSION,
        }],
        provider: {
            organization: 'Accord Project',
            url: 'https://accordproject.org',
        },
        version: '1.0.0',
        documentationUrl: 'https://github.com/accordproject/apap/blob/main/server/docs/a2a.md',
        capabilities: {
            streaming: false,
            pushNotifications: false,
            extensions: [],
            extendedAgentCard: false,
        },
        securitySchemes,
        securityRequirements: schemeName ? [{ schemes: { [schemeName]: { list: [] } } }] : [],
        defaultInputModes: ['application/json'],
        defaultOutputModes: ['application/json', 'text/plain'],
        skills: A2A_SKILLS.map((skill) => ({
            id: skill.id,
            name: skill.name,
            description: skill.description,
            tags: ['apap', skill.id.split('-').pop() as string],
            examples: [JSON.stringify(skill.example)],
            inputModes: ['application/json'],
            outputModes: ['application/json'],
            securityRequirements: requirementsFor(skill.scope),
        })),
        signatures: [],
    };
}

export function composeAgentCard(config: A2AConfig, adapter: AuthAdapter): AgentCard {
    return cardWithScheme(config, adapter.securitySchemeName, adapter.describeScheme());
}

/** Discovery stays available even if a custom adapter's card hook fails. */
export function composeAgentCardSafely(
    config: A2AConfig,
    adapter: AuthAdapter,
    warn: (entry: unknown) => void = console.warn,
): AgentCard {
    try {
        return composeAgentCard(config, adapter);
    } catch (_error) {
        warn({ event: 'a2a_agent_card_fallback', adapter: adapter.name });
        const fallbackName = config.authAdapter === 'jwt' ? 'Bearer' : undefined;
        return cardWithScheme(config, fallbackName, fallbackName ? bearerFallback() : undefined);
    }
}
