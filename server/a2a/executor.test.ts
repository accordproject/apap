import { Role, TaskState, type Message } from '@a2a-js/sdk';
import { RequestContext, ServerCallContext } from '@a2a-js/sdk/server';
import { AuthenticatedPrincipal } from '../auth/types';
import type { Database } from '../db/client';
import { AgreementTriggerError } from '../services/errors';
import { ApapAgentExecutor, parseSkillInvocation } from './executor';

function userMessage(value: unknown): Message {
    return {
        messageId: 'message-1',
        contextId: '',
        taskId: '',
        role: Role.ROLE_USER,
        parts: [{
            content: { $case: 'data', value },
            metadata: undefined,
            filename: '',
            mediaType: 'application/json',
        }],
        metadata: {},
        extensions: [],
        referenceTaskIds: [],
    };
}

function context(message: Message) {
    const principal = new AuthenticatedPrincipal('agent-1', undefined, [], ['*'], {});
    return new RequestContext(
        { tenant: '', message, configuration: undefined, metadata: undefined },
        'task-1',
        'context-1',
        new ServerCallContext({ user: principal, requestedVersion: '1.0' }),
    );
}

describe('ApapAgentExecutor', () => {
    test('accepts only structured data or JSON text invocations', () => {
        expect(parseSkillInvocation(userMessage({ skillId: 'list-templates', input: { limit: 1 } })))
            .toEqual({ skillId: 'list-templates', input: { limit: 1 } });

        const textMessage = userMessage({});
        textMessage.parts = [{
            content: { $case: 'text', value: '{"skillId":"get-template","input":{"id":1}}' },
            metadata: undefined,
            filename: '',
            mediaType: 'text/plain',
        }];
        expect(parseSkillInvocation(textMessage)).toEqual({ skillId: 'get-template', input: { id: 1 } });

        textMessage.parts[0].content = { $case: 'text', value: 'list-agreements' };
        expect(() => parseSkillInvocation(textMessage)).toThrow(/must contain a JSON skill invocation/);
        expect(() => parseSkillInvocation(userMessage({ skill: 'list-templates', arguments: {} })))
            .toThrow(/skillId/);
    });

    test('publishes task, working, artifact, and completed in order', async () => {
        const service = { execute: jest.fn().mockResolvedValue({ skillId: 'list-templates', result: [{ id: 1 }] }) };
        const executor = new ApapAgentExecutor({} as Database, service as any);
        const publish = jest.fn();

        await executor.execute(context(userMessage({ skillId: 'list-templates', input: {} })), { publish } as any);

        expect(publish.mock.calls.map(([event]) => event.kind)).toEqual([
            'task', 'statusUpdate', 'artifactUpdate', 'statusUpdate',
        ]);
        expect(publish.mock.calls[1][0].data.status.state).toBe(TaskState.TASK_STATE_WORKING);
        expect(publish.mock.calls[2][0].data.artifact.parts[0].content.value).toEqual([{ id: 1 }]);
        expect(publish.mock.calls[3][0].data.status.state).toBe(TaskState.TASK_STATE_COMPLETED);
    });

    test('rejects invalid requests without invoking the service', async () => {
        const service = { execute: jest.fn() };
        const executor = new ApapAgentExecutor({} as Database, service as any);
        const publish = jest.fn();

        await executor.execute(context(userMessage({ skill: 'list-templates' })), { publish } as any);

        const rejected = publish.mock.calls[publish.mock.calls.length - 1][0];
        expect(rejected.data.status.state).toBe(TaskState.TASK_STATE_REJECTED);
        expect(rejected.data.status.message.parts[0].content.value.error).toEqual({
            code: 'INVALID_PAYLOAD',
            message: 'A2A invocation must include a non-empty skillId.',
        });
        expect(service.execute).not.toHaveBeenCalled();
    });

    test('returns service error feedback to the caller', async () => {
        const reason = 'Cannot exercise late delivery before delivery date';
        const service = {
            execute: jest.fn().mockRejectedValue(new AgreementTriggerError('7', reason)),
        };
        const executor = new ApapAgentExecutor({} as Database, service as any);
        const publish = jest.fn();

        await executor.execute(context(userMessage({ skillId: 'trigger-agreement', input: {} })), { publish } as any);

        const failed = publish.mock.calls[publish.mock.calls.length - 1][0];
        expect(failed.kind).toBe('statusUpdate');
        expect(failed.data.status.state).toBe(TaskState.TASK_STATE_FAILED);
        expect(failed.data.status.message.parts[0].content.value.error).toEqual({
            code: 'AGREEMENT_TRIGGER_FAILED',
            message: `Failed to trigger agreement 7: ${reason}`,
            details: { agreementId: '7', upstreamMessage: reason },
        });
    });

    test('keeps unexpected failures generic', async () => {
        const internal = 'connect ECONNREFUSED postgres://user:secret@db:5432';
        const service = { execute: jest.fn().mockRejectedValue(new Error(internal)) };
        const executor = new ApapAgentExecutor({} as Database, service as any);
        const publish = jest.fn();

        await executor.execute(context(userMessage({ skillId: 'list-templates', input: {} })), { publish } as any);

        const failed = publish.mock.calls[publish.mock.calls.length - 1][0];
        expect(failed.data.status.state).toBe(TaskState.TASK_STATE_FAILED);
        expect(JSON.stringify(failed)).not.toContain(internal);
        expect(failed.data.status.message.parts[0].content.value.error).toEqual({
            code: 'INTERNAL_ERROR',
            message: 'The A2A operation failed unexpectedly.',
        });
    });
});
