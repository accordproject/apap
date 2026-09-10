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
import { ApapA2AService, type SkillInvocation } from '../services/a2aService';
import { InvalidPayloadError, ServiceError } from '../services/errors';

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
                candidate = { skillId: value, input: {} };
            }
        }
    }

    if (!isRecord(candidate)) {
        throw new InvalidPayloadError('A2A message must contain a JSON skill invocation.');
    }

    const skillId = candidate.skillId ?? candidate.skill;
    if (typeof skillId !== 'string' || skillId.length === 0) {
        throw new InvalidPayloadError('A2A invocation must include a non-empty skillId.');
    }

    return {
        skillId,
        input: candidate.input ?? candidate.arguments ?? {},
    };
}

function safeError(error: unknown): { code: string; message: string; details?: Record<string, unknown> } {
    if (error instanceof ServiceError) {
        return { code: error.code, message: error.message, ...(error.details && { details: error.details }) };
    }
    return { code: 'INTERNAL_ERROR', message: 'The A2A operation failed unexpectedly.' };
}

export class ApapAgentExecutor implements AgentExecutor {
    constructor(private readonly service: ApapA2AService) {}

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
            if (!principal || !('sub' in principal)) {
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

            const result = await this.service.execute(principal, invocation);
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
            eventBus.publish(AgentEvent.statusUpdate({
                taskId,
                contextId,
                status: {
                    state: TaskState.TASK_STATE_FAILED,
                    timestamp: new Date().toISOString(),
                    message: agentMessage(taskId, contextId, [dataPart({ error: serialized })]),
                },
                metadata: { errorCode: serialized.code },
            }));
            console.warn({ event: 'a2a_task_failed', taskId, code: serialized.code });
        }
    }
}
