import { AuthenticatedPrincipal, DevelopmentPrincipal } from '../auth/types';
import type { Database } from '../db/client';
import {
    authorize,
    createPolicyContext,
    registerAuthorizationPolicy,
    ScopeAuthorizationPolicy,
} from './policy';

const db = {} as Database;

function authenticated(scopes: string[]) {
    return createPolicyContext(
        db,
        new AuthenticatedPrincipal('agent-1', 'org-1', ['agent'], scopes, {}),
    );
}

describe('central authorization policy', () => {
    test('requires the exact operation scope', async () => {
        const policy = new ScopeAuthorizationPolicy();

        expect(() => policy.authorize(
            authenticated(['apap:templates:read']),
            'templates:read',
            { type: 'template', id: 1 },
        )).not.toThrow();

        for (const scopes of [['*'], ['apap:templates:*'], []]) {
            try {
                policy.authorize(
                    authenticated(scopes),
                    'templates:read',
                    { type: 'template', id: 1 },
                );
                throw new Error('Expected authorization to fail.');
            } catch (error) {
                expect(error).toMatchObject({
                    code: 'INSUFFICIENT_SCOPE',
                    details: { requiredScope: 'apap:templates:read' },
                });
            }
        }
    });

    test('preserves legacy REST/MCP access only for DevelopmentPrincipal', async () => {
        const policy = new ScopeAuthorizationPolicy();
        const context = createPolicyContext(db, new DevelopmentPrincipal());

        expect(() => policy.authorize(
            context,
            'agreements:trigger',
            { type: 'agreement', id: 7 },
        )).not.toThrow();
    });

    test('passes context, action, and resource through the central seam', async () => {
        const customPolicy = { authorize: jest.fn() };
        const restore = registerAuthorizationPolicy(customPolicy);
        const context = authenticated(['custom']);

        try {
            await authorize(context, 'agreements:read', { type: 'agreement', id: 9 });
            expect(customPolicy.authorize).toHaveBeenCalledWith(
                context,
                'agreements:read',
                { type: 'agreement', id: 9 },
            );
        } finally {
            restore();
        }
    });
});
