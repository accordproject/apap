import { randomBytes } from 'crypto';
import {
    Role,
    TaskState,
    type Message,
    type Part,
    type Task,
} from '@a2a-js/sdk';
import {
    AgentEvent,
    type AgentExecutor,
    type ExecutionEventBus,
    type RequestContext,
} from '@a2a-js/sdk/server';
import { UnsupportedOperationError } from '@a2a-js/sdk/errors';
import type { Principal } from '../auth/types';
import type { Database } from '../db/client';
import { ApapA2AService, type SkillInvocation } from '../services/a2aService';
import { InvalidPayloadError, ServiceError } from '../services/errors';
import { createPolicyContext } from '../services/policy';

function id(): string {
    return randomBytes(16).toString('hex');
}

function dataPart(value: unknown): Part {
    return {
        content: { $case: 'data', value },
        metadata: undefined,
        filename: '',
        mediaType: 'application/json',
    };
}

function textPart(value: string): Part {
    return {
        content: { $case: 'text', value },
        metadata: undefined,
        filename: '',
        mediaType: 'text/plain',
    };
}

function agentMessage(taskId: string, contextId: string, parts: Part[]): Message {
    return {
        messageId: id(),
        role: Role.ROLE_AGENT,
        parts,
        taskId,
        contextId,
        extensions: [],
        metadata: {},
        referenceTaskIds: [],
    };
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function parseSkillInvocation(message: Message): SkillInvocation {
    const data = message.parts.find((part) => part.content?.$case === 'data');
    let candidate: unknown = data?.content?.$case === 'data' ? data.content.value : undefined;

    if (candidate === undefined) {
        const text = message.parts.find((part) => part.content?.$case === 'text');
        const value = text?.content?.$case === 'text' ? text.content.value.trim() : '';
        if (value) {
            try {
                candidate = JSON.parse(value);
            } catch (_error) {
                throw new InvalidPayloadError('A2A text parts must contain a JSON skill invocation.');
            }
        }
    }

    if (!isRecord(candidate)) {
        throw new InvalidPayloadError('A2A message must contain a JSON skill invocation.');
    }

    const skillId = candidate.skillId;
    if (typeof skillId !== 'string' || skillId.trim().length === 0) {
        throw new InvalidPayloadError('A2A invocation must include a non-empty skillId.');
    }

    return {
        skillId: skillId.trim(),
        input: candidate.input ?? {},
    };
}

const PUBLIC_SERVICE_ERRORS: Readonly<Record<string, string>> = {
    INVALID_PAYLOAD: 'The A2A request is invalid.',
    VALIDATION_ERROR: 'The A2A request failed validation.',
    INSUFFICIENT_SCOPE: 'The authenticated principal is not authorized for this operation.',
    TEMPLATE_NOT_FOUND: 'Template not found.',
    AGREEMENT_NOT_FOUND: 'Agreement not found.',
    AGREEMENT_TRIGGER_FAILED: 'Agreement execution failed.',
    AGREEMENT_CONVERSION_FAILED: 'Agreement conversion failed.',
};

function safeError(error: unknown): { code: string; message: string } {
    if (error instanceof ServiceError) {
        const message = PUBLIC_SERVICE_ERRORS[error.code];
        if (message) return { code: error.code, message };
        return { code: 'OPERATION_FAILED', message: 'The A2A operation could not be completed.' };
    }
    return { code: 'INTERNAL_ERROR', message: 'The A2A operation failed unexpectedly.' };
}

function terminalState(error: unknown): TaskState {
    if (error instanceof ServiceError && [
        'INVALID_PAYLOAD',
        'VALIDATION_ERROR',
        'INSUFFICIENT_SCOPE',
    ].includes(error.code)) {
        return TaskState.TASK_STATE_REJECTED;
    }
    return TaskState.TASK_STATE_FAILED;
}

export class ApapAgentExecutor implements AgentExecutor {
    constructor(
        private readonly db: Database,
        private readonly service: ApapA2AService,
    ) {}

    public cancelTask = async (): Promise<void> => {
        throw new UnsupportedOperationError('APAP A2A task cancellation is not supported.');
    };

    public async execute(requestContext: RequestContext, eventBus: ExecutionEventBus): Promise<void> {
        const { taskId, contextId, userMessage } = requestContext;
        const principal = requestContext.context.user as Principal | undefined;

        const task: Task = requestContext.task ?? {
            id: taskId,
            contextId,
            status: {
                state: TaskState.TASK_STATE_SUBMITTED,
                timestamp: new Date().toISOString(),
                message: undefined,
            },
            artifacts: [],
            history: [userMessage],
            metadata: userMessage.metadata,
        };
        eventBus.publish(AgentEvent.task(task));

        try {
            if (!principal || typeof principal !== 'object' || !('sub' in principal)) {
                throw new InvalidPayloadError('Authenticated principal is missing from the A2A context.');
            }

            const invocation = parseSkillInvocation(userMessage);
            eventBus.publish(AgentEvent.statusUpdate({
                taskId,
                contextId,
                status: {
                    state: TaskState.TASK_STATE_WORKING,
                    timestamp: new Date().toISOString(),
                    message: agentMessage(taskId, contextId, [textPart(`Executing ${invocation.skillId}`)]),
                },
                metadata: { skillId: invocation.skillId },
            }));

            const result = await this.service.execute(createPolicyContext(this.db, principal), invocation);
            eventBus.publish(AgentEvent.artifactUpdate({
                taskId,
                contextId,
                artifact: {
                    artifactId: id(),
                    name: result.skillId,
                    description: `Result of APAP A2A skill ${result.skillId}.`,
                    parts: [dataPart(result.result)],
                    metadata: { skillId: result.skillId },
                    extensions: [],
                },
                append: false,
                lastChunk: true,
                metadata: { skillId: result.skillId },
            }));
            eventBus.publish(AgentEvent.statusUpdate({
                taskId,
                contextId,
                status: {
                    state: TaskState.TASK_STATE_COMPLETED,
                    timestamp: new Date().toISOString(),
                    message: undefined,
                },
                metadata: { skillId: result.skillId },
            }));
            console.info({ event: 'a2a_task_completed', taskId, skillId: result.skillId });
        } catch (error) {
            const serialized = safeError(error);
            const state = terminalState(error);
            eventBus.publish(AgentEvent.statusUpdate({
                taskId,
                contextId,
                status: {
                    state,
                    timestamp: new Date().toISOString(),
                    message: agentMessage(taskId, contextId, [dataPart({ error: serialized })]),
                },
                metadata: { errorCode: serialized.code },
            }));
            console.warn({
                event: state === TaskState.TASK_STATE_REJECTED ? 'a2a_task_rejected' : 'a2a_task_failed',
                taskId,
                code: serialized.code,
            });
        }
    }
}
