import type { Database } from '../db/client';
import { AuthenticatedPrincipal } from '../auth/types';
import { ApapA2AService } from './a2aService';

const db = {} as Database;

function principal(scopes: string[]) {
    return new AuthenticatedPrincipal('agent-1', 'org-1', ['agent'], scopes, {});
}

describe('ApapA2AService', () => {
    test('maps a read skill to the shared service operation', async () => {
        const listTemplates = jest.fn().mockResolvedValue([{ id: 1 }]);
        const service = new ApapA2AService(db, undefined, { listTemplates } as any);

        await expect(service.execute(
            principal(['apap:templates:read']),
            { skillId: 'list-templates', input: { limit: 10, offset: 2 } },
        )).resolves.toEqual({ skillId: 'list-templates', result: [{ id: 1 }] });
        expect(listTemplates).toHaveBeenCalledWith(db, { limit: 10, offset: 2 });
    });

    test('passes the principal through the service authorization seam', async () => {
        const actor = principal(['custom']);
        const authorization = { assertAuthorized: jest.fn() };
        const getAgreementById = jest.fn().mockResolvedValue({ id: 7 });
        const service = new ApapA2AService(db, authorization, { getAgreementById } as any);

        await service.execute(actor, { skillId: 'get-agreement', input: { id: 7 } });
        expect(authorization.assertAuthorized).toHaveBeenCalledWith(actor, 'apap:agreements:read');
    });

    test('rejects insufficient scope before touching a service operation', async () => {
        const listAgreements = jest.fn();
        const service = new ApapA2AService(db, undefined, { listAgreements } as any);

        await expect(service.execute(
            principal(['apap:templates:read']),
            { skillId: 'list-agreements', input: {} },
        )).rejects.toMatchObject({ code: 'INSUFFICIENT_SCOPE', statusCode: 403 });
        expect(listAgreements).not.toHaveBeenCalled();
    });

    test('supports scoped and global wildcards', async () => {
        const getTemplateById = jest.fn().mockResolvedValue({ id: 2 });
        const service = new ApapA2AService(db, undefined, { getTemplateById } as any);
        await expect(service.execute(
            principal(['apap:templates:*']),
            { skillId: 'get-template', input: { id: 2 } },
        )).resolves.toMatchObject({ skillId: 'get-template' });
    });

    test('validates invocation input and supported skills', async () => {
        const service = new ApapA2AService(db);
        await expect(service.execute(
            principal(['*']),
            { skillId: 'get-template', input: { id: 'not-an-id' } },
        )).rejects.toMatchObject({ code: 'INVALID_PAYLOAD' });
        await expect(service.execute(
            principal(['*']),
            { skillId: 'create-agreement', input: {} },
        )).rejects.toMatchObject({
            code: 'INVALID_PAYLOAD',
            details: { supportedSkills: expect.not.arrayContaining(['create-agreement']) },
        });
    });

    test('maps trigger input without losing the request payload', async () => {
        const triggerAgreement = jest.fn().mockResolvedValue({ response: 'ok' });
        const service = new ApapA2AService(db, undefined, { triggerAgreement } as any);
        const request = { $class: 'org.example.Request', amount: 10 };

        await service.execute(
            principal(['apap:trigger:invoke']),
            { skillId: 'trigger-agreement', input: { id: 3, request } },
        );
        expect(triggerAgreement).toHaveBeenCalledWith(db, 3, request);
    });
});
