import { Role, TaskState, type Message } from '@a2a-js/sdk';
import { RequestContext, ServerCallContext } from '@a2a-js/sdk/server';
import { AuthenticatedPrincipal } from '../auth/types';
import type { Database } from '../db/client';
import { AgreementTriggerError, ValidationError } from '../services/errors';
import { ApapA2AService } from '../services/a2aService';
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

function context(message: Message, scopes: string[] = ['apap:templates:read']) {
    const principal = new AuthenticatedPrincipal('agent-1', undefined, [], scopes, {});
    return new RequestContext(
        { tenant: '', message, configuration: undefined, metadata: undefined },
        'task-1',
        'context-1',
        new ServerCallContext({ user: principal, requestedVersion: '1.0' }),
    );
}

function executorWith(operations: Record<string, unknown>) {
    return new ApapAgentExecutor({} as Database, new ApapA2AService(operations as any));
}

const kinds = (publish: jest.Mock) => publish.mock.calls.map(([event]) => event.kind);
const lastEvent = (publish: jest.Mock) => publish.mock.calls[publish.mock.calls.length - 1][0];
const errorOf = (event: any) => event.data.status.message.parts[0].content.value.error;

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
        const listTemplates = jest.fn().mockResolvedValue([{ id: 1 }]);
        const publish = jest.fn();

        await executorWith({ listTemplates })
            .execute(context(userMessage({ skillId: 'list-templates', input: {} })), { publish } as any);

        expect(kinds(publish)).toEqual(['task', 'statusUpdate', 'artifactUpdate', 'statusUpdate']);
        expect(publish.mock.calls[1][0].data.status.state).toBe(TaskState.TASK_STATE_WORKING);
        expect(publish.mock.calls[2][0].data.artifact.parts[0].content.value).toEqual([{ id: 1 }]);
        expect(publish.mock.calls[3][0].data.status.state).toBe(TaskState.TASK_STATE_COMPLETED);
    });

    test('refuses malformed input before reporting the task as working', async () => {
        const listTemplates = jest.fn();
        const publish = jest.fn();

        await executorWith({ listTemplates })
            .execute(context(userMessage({ skillId: 'list-templates', input: { limit: 'lots' } })), { publish } as any);

        expect(kinds(publish)).toEqual(['task', 'statusUpdate']);
        expect(lastEvent(publish).data.status.state).toBe(TaskState.TASK_STATE_REJECTED);
        expect(errorOf(lastEvent(publish))).toMatchObject({
            code: 'INVALID_PAYLOAD',
            details: { issues: [expect.objectContaining({ path: 'limit' })] },
        });
        expect(listTemplates).not.toHaveBeenCalled();
    });

    test('refuses an unknown skill before reporting the task as working', async () => {
        const publish = jest.fn();

        await executorWith({})
            .execute(context(userMessage({ skillId: 'drop-tables', input: {} })), { publish } as any);

        expect(kinds(publish)).toEqual(['task', 'statusUpdate']);
        expect(lastEvent(publish).data.status.state).toBe(TaskState.TASK_STATE_REJECTED);
        expect(errorOf(lastEvent(publish)).code).toBe('INVALID_PAYLOAD');
    });

    test('refuses an unauthorized skill before reporting the task as working', async () => {
        const listTemplates = jest.fn();
        const publish = jest.fn();

        await executorWith({ listTemplates })
            .execute(context(userMessage({ skillId: 'list-templates', input: {} }), []), { publish } as any);

        expect(kinds(publish)).toEqual(['task', 'statusUpdate']);
        expect(lastEvent(publish).data.status.state).toBe(TaskState.TASK_STATE_REJECTED);
        expect(errorOf(lastEvent(publish))).toEqual({
            code: 'INSUFFICIENT_SCOPE',
            message: 'The authenticated principal is not authorized for this operation.',
            details: { action: 'templates:list', requiredScope: 'apap:templates:read' },
        });
        expect(listTemplates).not.toHaveBeenCalled();
    });

    test('reduces validation violations to paths and types', async () => {
        const instance = 'org.example.Request#9d2a{"partyName":"Acme","penalty":250}';
        const triggerAgreement = jest.fn().mockRejectedValue(new ValidationError(
            'Trigger request validation failed',
            {
                agreementId: 3,
                errors: [{
                    message: `Instance ${instance} invalid. Expected value at path \`$.forceMajeure\` to be of type \`Boolean\``,
                }],
            },
        ));
        const publish = jest.fn();
        const message = userMessage({
            skillId: 'trigger-agreement',
            input: { id: 3, request: { $class: 'org.example.Request' } },
        });

        await executorWith({ triggerAgreement })
            .execute(context(message, ['apap:trigger:invoke']), { publish } as any);

        const failure = lastEvent(publish);
        expect(failure.data.status.state).toBe(TaskState.TASK_STATE_REJECTED);
        expect(errorOf(failure)).toEqual({
            code: 'VALIDATION_ERROR',
            message: 'Trigger request validation failed',
            details: { violations: [{ path: '$.forceMajeure', expectedType: 'Boolean' }] },
        });
        expect(JSON.stringify(failure)).not.toContain('Acme');
        expect(JSON.stringify(failure)).not.toContain(instance);
    });

    test('never forwards a wrapped template-runtime message', async () => {
        const runtimeText = 'state.balance=8200 for party Acme Ltd is below the penalty cap';
        const triggerAgreement = jest.fn().mockRejectedValue(new AgreementTriggerError('7', runtimeText));
        const publish = jest.fn();
        const message = userMessage({
            skillId: 'trigger-agreement',
            input: { id: 7, request: { $class: 'org.example.Request' } },
        });

        await executorWith({ triggerAgreement })
            .execute(context(message, ['apap:trigger:invoke']), { publish } as any);

        const failure = lastEvent(publish);
        expect(failure.data.status.state).toBe(TaskState.TASK_STATE_FAILED);
        expect(errorOf(failure)).toEqual({
            code: 'AGREEMENT_TRIGGER_FAILED',
            message: 'Agreement execution failed.',
        });
        expect(JSON.stringify(failure)).not.toContain('Acme');
        expect(JSON.stringify(failure)).not.toContain(runtimeText);
    });

    test('keeps unexpected failures generic', async () => {
        const internal = 'connect ECONNREFUSED postgres://user:secret@db:5432';
        const listTemplates = jest.fn().mockRejectedValue(new Error(internal));
        const publish = jest.fn();

        await executorWith({ listTemplates })
            .execute(context(userMessage({ skillId: 'list-templates', input: {} })), { publish } as any);

        const failure = lastEvent(publish);
        expect(failure.data.status.state).toBe(TaskState.TASK_STATE_FAILED);
        expect(JSON.stringify(failure)).not.toContain(internal);
        expect(errorOf(failure)).toEqual({
            code: 'INTERNAL_ERROR',
            message: 'The A2A operation failed unexpectedly.',
        });
    });
});
