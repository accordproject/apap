import { Role, TaskState, type Message } from '@a2a-js/sdk';
import { RequestContext, ServerCallContext } from '@a2a-js/sdk/server';
import { AuthenticatedPrincipal } from '../auth/types';
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
    test('accepts data, JSON text, and skill-name text invocations', () => {
        expect(parseSkillInvocation(userMessage({ skill: 'list-templates', arguments: { limit: 1 } })))
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
        expect(parseSkillInvocation(textMessage)).toEqual({ skillId: 'list-agreements', input: {} });
    });

    test('publishes task, working, artifact, and completed in order', async () => {
        const service = { execute: jest.fn().mockResolvedValue({ skillId: 'list-templates', result: [{ id: 1 }] }) };
        const executor = new ApapAgentExecutor(service as any);
        const publish = jest.fn();

        await executor.execute(context(userMessage({ skillId: 'list-templates', input: {} })), { publish } as any);

        expect(publish.mock.calls.map(([event]) => event.kind)).toEqual([
            'task', 'statusUpdate', 'artifactUpdate', 'statusUpdate',
        ]);
        expect(publish.mock.calls[1][0].data.status.state).toBe(TaskState.TASK_STATE_WORKING);
        expect(publish.mock.calls[2][0].data.artifact.parts[0].content.value).toEqual([{ id: 1 }]);
        expect(publish.mock.calls[3][0].data.status.state).toBe(TaskState.TASK_STATE_COMPLETED);
    });

    test('converts service failures to a terminal task without echoing the request', async () => {
        const secret = 'do-not-echo-this';
        const service = { execute: jest.fn().mockRejectedValue(new Error(secret)) };
        const executor = new ApapAgentExecutor(service as any);
        const publish = jest.fn();

        await executor.execute(context(userMessage({ skillId: 'list-templates', input: { secret } })), { publish } as any);

        const failed = publish.mock.calls[publish.mock.calls.length - 1][0];
        expect(failed.kind).toBe('statusUpdate');
        expect(failed.data.status.state).toBe(TaskState.TASK_STATE_FAILED);
        expect(JSON.stringify(failed)).not.toContain(secret);
        expect(JSON.stringify(failed)).toContain('INTERNAL_ERROR');
    });
});
