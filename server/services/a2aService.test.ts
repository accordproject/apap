import type { Database } from '../db/client';
import { AuthenticatedPrincipal } from '../auth/types';
import { ApapA2AService } from './a2aService';
import { createPolicyContext } from './policy';

const db = {} as Database;

function principal(scopes: string[]) {
    return new AuthenticatedPrincipal('agent-1', 'org-1', ['agent'], scopes, {});
}

function context(scopes: string[]) {
    return createPolicyContext(db, principal(scopes));
}

describe('ApapA2AService', () => {
    test('maps a read skill to the shared service operation', async () => {
        const listTemplates = jest.fn().mockResolvedValue([{ id: 1 }]);
        const service = new ApapA2AService({ listTemplates } as any);

        await expect(service.execute(
            context(['apap:templates:read']),
            { skillId: 'list-templates', input: { limit: 10, offset: 2 } },
        )).resolves.toEqual({ skillId: 'list-templates', result: [{ id: 1 }] });
        expect(listTemplates).toHaveBeenCalledWith(
            expect.objectContaining({ db, principal: expect.objectContaining({ sub: 'agent-1' }) }),
            { limit: 10, offset: 2 },
        );
    });

    test('passes the principal through the service authorization seam', async () => {
        const actorContext = context(['apap:agreements:read']);
        const getAgreementById = jest.fn().mockResolvedValue({ id: 7 });
        const service = new ApapA2AService({ getAgreementById } as any);

        await service.execute(actorContext, { skillId: 'get-agreement', input: { id: 7 } });
        expect(getAgreementById).toHaveBeenCalledWith(actorContext, 7);
    });

    test('rejects insufficient scope in the shared service before touching the database', async () => {
        const service = new ApapA2AService();

        await expect(service.execute(
            context(['apap:templates:read']),
            { skillId: 'list-agreements', input: {} },
        )).rejects.toMatchObject({ code: 'INSUFFICIENT_SCOPE', statusCode: 403 });
    });

    test('accepts the exact scope required by a shared operation', async () => {
        const getTemplateById = jest.fn().mockResolvedValue({ id: 2 });
        const service = new ApapA2AService({ getTemplateById } as any);
        await expect(service.execute(
            context(['apap:templates:read']),
            { skillId: 'get-template', input: { id: 2 } },
        )).resolves.toMatchObject({ skillId: 'get-template' });
    });

    test('validates invocation input and supported skills', async () => {
        const service = new ApapA2AService();
        await expect(service.execute(
            context(['apap:templates:read']),
            { skillId: 'get-template', input: { id: 'not-an-id' } },
        )).rejects.toMatchObject({ code: 'INVALID_PAYLOAD' });
        await expect(service.execute(
            context(['apap:templates:read']),
            { skillId: 'create-agreement', input: {} },
        )).rejects.toMatchObject({
            code: 'INVALID_PAYLOAD',
            details: { supportedSkills: expect.not.arrayContaining(['create-agreement']) },
        });
    });

    test('maps trigger input without losing the request payload', async () => {
        const triggerAgreement = jest.fn().mockResolvedValue({ response: 'ok' });
        const service = new ApapA2AService({ triggerAgreement } as any);
        const request = { $class: 'org.example.Request', amount: 10 };

        await service.execute(
            context(['apap:trigger:invoke']),
            { skillId: 'trigger-agreement', input: { id: 3, request } },
        );
        expect(triggerAgreement).toHaveBeenCalledWith(
            expect.objectContaining({ db, principal: expect.objectContaining({ sub: 'agent-1' }) }),
            3,
            request,
        );
    });
    describe.each([
        ['get-agreement', 'apap:agreements:read', 'getAgreementById'],
        ['trigger-agreement', 'apap:trigger:invoke', 'triggerAgreement'],
    ])('%s identifier validation', (skillId, scope, operationName) => {
        test.each([true, false, [1], [2], [], null, {}, '', ' ', 'abc', 0, -1, 1.5, '9007199254740993'])('rejects %p before the operation', async (id) => {
            const operation = jest.fn().mockResolvedValue({});
            const service = new ApapA2AService({ [operationName]: operation } as any);
            await expect(service.execute(context([scope]), { skillId, input: { id, ...(skillId === 'trigger-agreement' ? { request: {} } : {}) } }))
                .rejects.toMatchObject({ code: 'INVALID_PAYLOAD' });
            expect(operation).not.toHaveBeenCalled();
        });
        test.each([[1, 1], ['1', 1], ['1.0', 1], ['1e2', 100], [2147483647, 2147483647], ['2147483647', 2147483647], [2147483648, 2147483648], ['9007199254740991', 9007199254740991]])('accepts %p as %p', async (id, expected) => {
            const operation = jest.fn().mockResolvedValue({});
            const service = new ApapA2AService({ [operationName]: operation } as any);
            await service.execute(context([scope]), { skillId, input: { id, ...(skillId === 'trigger-agreement' ? { request: {} } : {}) } });
            expect(operation).toHaveBeenCalledTimes(1);
            expect(operation.mock.calls[0][1]).toBe(expected);
        });
    });

});
