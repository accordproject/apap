import { z } from 'zod';
import { getTemplateById, listTemplates } from './templateService';
import { getAgreementById, listAgreements, triggerAgreement } from './agreementService';
import { InvalidPayloadError } from './errors';
import type { PolicyContext } from './policy';

export const A2A_SKILLS = [
    {
        id: 'list-templates',
        name: 'List templates',
        description: 'List APAP templates with bounded pagination.',
        scope: 'apap:templates:read',
        tags: ['apap', 'templates'],
        example: { skillId: 'list-templates', input: { limit: 20, offset: 0 } },
    },
    {
        id: 'get-template',
        name: 'Get template',
        description: 'Get one APAP template by numeric identifier.',
        scope: 'apap:templates:read',
        tags: ['apap', 'templates'],
        example: { skillId: 'get-template', input: { id: 1 } },
    },
    {
        id: 'list-agreements',
        name: 'List agreements',
        description: 'List APAP agreements with bounded pagination.',
        scope: 'apap:agreements:read',
        tags: ['apap', 'agreements'],
        example: { skillId: 'list-agreements', input: { limit: 20, offset: 0 } },
    },
    {
        id: 'get-agreement',
        name: 'Get agreement',
        description: 'Get one APAP agreement by numeric identifier.',
        scope: 'apap:agreements:read',
        tags: ['apap', 'agreements'],
        example: { skillId: 'get-agreement', input: { id: 1 } },
    },
    {
        id: 'trigger-agreement',
        name: 'Trigger agreement',
        description: 'Execute an agreement request and persist its resulting state.',
        scope: 'apap:trigger:invoke',
        tags: ['apap', 'agreements', 'execution'],
        example: {
            skillId: 'trigger-agreement',
            input: { id: 1, request: { $class: 'org.example.Request' } },
        },
    },
] as const;

export type A2ASkillId = typeof A2A_SKILLS[number]['id'];

export interface SkillInvocation {
    skillId: string;
    input?: unknown;
}

export interface SkillResult {
    skillId: A2ASkillId;
    result: unknown;
}

const pageSchema = z.object({
    limit: z.coerce.number().int().min(1).max(100).optional(),
    offset: z.coerce.number().int().min(0).optional(),
}).strict();

const idSchema = z.object({
    id: z.coerce.number().int().positive(),
}).strict();

const triggerSchema = z.object({
    id: z.coerce.number().int().positive(),
    request: z.record(z.string(), z.unknown()),
}).strict();

type Operations = {
    listTemplates: typeof listTemplates;
    getTemplateById: typeof getTemplateById;
    listAgreements: typeof listAgreements;
    getAgreementById: typeof getAgreementById;
    triggerAgreement: typeof triggerAgreement;
};

const defaultOperations: Operations = {
    listTemplates,
    getTemplateById,
    listAgreements,
    getAgreementById,
    triggerAgreement,
};

function parseInput<T>(schema: z.ZodType<T>, input: unknown, skillId: string): T {
    const parsed = schema.safeParse(input ?? {});
    if (!parsed.success) {
        throw new InvalidPayloadError(`Invalid input for A2A skill ${skillId}.`, {
            issues: parsed.error.issues,
        });
    }
    return parsed.data;
}

/**
 * Transport-neutral A2A service facade. The principal is deliberately passed
 * across this boundary so richer org/RLS policies can replace the RI policy
 * without re-plumbing the executor.
 */
export class ApapA2AService {
    private readonly operations: Operations;

    constructor(operations: Partial<Operations> = {}) {
        this.operations = { ...defaultOperations, ...operations };
    }

    public async execute(context: PolicyContext, invocation: SkillInvocation): Promise<SkillResult> {
        const skill = A2A_SKILLS.find((candidate) => candidate.id === invocation.skillId);
        if (!skill) {
            throw new InvalidPayloadError(`Unknown A2A skill: ${invocation.skillId}`, {
                supportedSkills: A2A_SKILLS.map((candidate) => candidate.id),
            });
        }

        switch (skill.id) {
            case 'list-templates': {
                const input = parseInput(pageSchema, invocation.input, skill.id);
                return { skillId: skill.id, result: await this.operations.listTemplates(context, input) };
            }
            case 'get-template': {
                const input = parseInput(idSchema, invocation.input, skill.id);
                return { skillId: skill.id, result: await this.operations.getTemplateById(context, input.id) };
            }
            case 'list-agreements': {
                const input = parseInput(pageSchema, invocation.input, skill.id);
                return { skillId: skill.id, result: await this.operations.listAgreements(context, input) };
            }
            case 'get-agreement': {
                const input = parseInput(idSchema, invocation.input, skill.id);
                return { skillId: skill.id, result: await this.operations.getAgreementById(context, input.id) };
            }
            case 'trigger-agreement': {
                const input = parseInput(triggerSchema, invocation.input, skill.id);
                return {
                    skillId: skill.id,
                    result: await this.operations.triggerAgreement(context, input.id, input.request),
                };
            }
        }
    }
}
