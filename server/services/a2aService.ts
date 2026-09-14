import { z } from 'zod';
import { getTemplateById, listTemplates } from './templateService';
import { getAgreementById, listAgreements, triggerAgreement } from './agreementService';
import { InvalidPayloadError } from './errors';
import { authorize, type PolicyAction, type PolicyContext, type PolicyResource } from './policy';

export const A2A_SKILLS = [
    {
        id: 'list-templates',
        name: 'List templates',
        action: 'templates:list',
        description: 'List APAP templates with bounded pagination.',
        scope: 'apap:templates:read',
        tags: ['apap', 'templates'],
        example: { skillId: 'list-templates', input: { limit: 20, offset: 0 } },
    },
    {
        id: 'get-template',
        name: 'Get template',
        action: 'templates:read',
        description: 'Get one APAP template by numeric identifier.',
        scope: 'apap:templates:read',
        tags: ['apap', 'templates'],
        example: { skillId: 'get-template', input: { id: 1 } },
    },
    {
        id: 'list-agreements',
        name: 'List agreements',
        action: 'agreements:list',
        description: 'List APAP agreements with bounded pagination.',
        scope: 'apap:agreements:read',
        tags: ['apap', 'agreements'],
        example: { skillId: 'list-agreements', input: { limit: 20, offset: 0 } },
    },
    {
        id: 'get-agreement',
        name: 'Get agreement',
        action: 'agreements:read',
        description: 'Get one APAP agreement by numeric identifier.',
        scope: 'apap:agreements:read',
        tags: ['apap', 'agreements'],
        example: { skillId: 'get-agreement', input: { id: 1 } },
    },
    {
        id: 'trigger-agreement',
        name: 'Trigger agreement',
        action: 'agreements:trigger',
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

export interface PreparedSkill {
    readonly skillId: A2ASkillId;
    readonly action: PolicyAction;
    readonly resource: PolicyResource;
    readonly invoke: (operations: Operations, context: PolicyContext) => Promise<unknown>;
}

/** Parses the skill's input and names the resource its policy decision covers. */
function prepareSkill(skill: typeof A2A_SKILLS[number], rawInput: unknown): PreparedSkill {
    switch (skill.id) {
        case 'list-templates': {
            const input = parseInput(pageSchema, rawInput, skill.id);
            return {
                skillId: skill.id,
                action: skill.action,
                resource: { type: 'template-collection' },
                invoke: (operations, context) => operations.listTemplates(context, input),
            };
        }
        case 'get-template': {
            const input = parseInput(idSchema, rawInput, skill.id);
            return {
                skillId: skill.id,
                action: skill.action,
                resource: { type: 'template', id: input.id },
                invoke: (operations, context) => operations.getTemplateById(context, input.id),
            };
        }
        case 'list-agreements': {
            const input = parseInput(pageSchema, rawInput, skill.id);
            return {
                skillId: skill.id,
                action: skill.action,
                resource: { type: 'agreement-collection' },
                invoke: (operations, context) => operations.listAgreements(context, input),
            };
        }
        case 'get-agreement': {
            const input = parseInput(idSchema, rawInput, skill.id);
            return {
                skillId: skill.id,
                action: skill.action,
                resource: { type: 'agreement', id: input.id },
                invoke: (operations, context) => operations.getAgreementById(context, input.id),
            };
        }
        case 'trigger-agreement': {
            const input = parseInput(triggerSchema, rawInput, skill.id);
            return {
                skillId: skill.id,
                action: skill.action,
                resource: { type: 'agreement', id: input.id },
                invoke: (operations, context) => operations.triggerAgreement(context, input.id, input.request),
            };
        }
    }
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

    /**
     * Validates input and authorizes the skill WITHOUT running it, so the
     * transport can refuse an unknown skill, malformed input, or insufficient
     * scope before it reports the task as working. Shared services authorize
     * again at their own boundary; this preflight never replaces that check.
     */
    public async prepare(context: PolicyContext, invocation: SkillInvocation): Promise<PreparedSkill> {
        const skill = A2A_SKILLS.find((candidate) => candidate.id === invocation.skillId);
        if (!skill) {
            throw new InvalidPayloadError(`Unknown A2A skill: ${invocation.skillId}`, {
                supportedSkills: A2A_SKILLS.map((candidate) => candidate.id),
            });
        }

        const prepared = prepareSkill(skill, invocation.input);
        await authorize(context, prepared.action, prepared.resource);
        return prepared;
    }

    public async run(context: PolicyContext, prepared: PreparedSkill): Promise<SkillResult> {
        return { skillId: prepared.skillId, result: await prepared.invoke(this.operations, context) };
    }

    public async execute(context: PolicyContext, invocation: SkillInvocation): Promise<SkillResult> {
        return this.run(context, await this.prepare(context, invocation));
    }
}
