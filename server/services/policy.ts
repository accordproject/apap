import type { Database } from '../db/client';
import { DevelopmentPrincipal, type Principal } from '../auth/types';
import { ServiceError } from './errors';

export type PolicyAction =
    | 'templates:list'
    | 'templates:read'
    | 'templates:create'
    | 'templates:update'
    | 'templates:delete'
    | 'agreements:list'
    | 'agreements:read'
    | 'agreements:convert'
    | 'agreements:trigger';

export interface PolicyResource {
    readonly type: 'template' | 'template-collection' | 'agreement' | 'agreement-collection';
    readonly id?: string | number;
}

/** Transport-neutral context passed through every shared service call. */
export interface PolicyContext {
    readonly db: Database;
    readonly principal: Principal;
}

export interface AuthorizationPolicy {
    authorize(context: PolicyContext, action: PolicyAction, resource: PolicyResource): void | Promise<void>;
}

const REQUIRED_SCOPE: Readonly<Record<PolicyAction, string>> = {
    'templates:list': 'apap:templates:read',
    'templates:read': 'apap:templates:read',
    'templates:create': 'apap:templates:write',
    'templates:update': 'apap:templates:write',
    'templates:delete': 'apap:templates:write',
    'agreements:list': 'apap:agreements:read',
    'agreements:read': 'apap:agreements:read',
    'agreements:convert': 'apap:agreements:read',
    'agreements:trigger': 'apap:trigger:invoke',
};

/**
 * RI policy: development/legacy callers retain today's open behavior, while
 * authenticated callers must receive the exact scope for an operation.
 * There are deliberately no token-controlled wildcard scopes.
 */
export class ScopeAuthorizationPolicy implements AuthorizationPolicy {
    public authorize(context: PolicyContext, action: PolicyAction, resource: PolicyResource): void {
        if (context.principal instanceof DevelopmentPrincipal) return;

        const requiredScope = REQUIRED_SCOPE[action];
        if (context.principal.scopes.includes(requiredScope)) return;

        throw new ServiceError(
            'INSUFFICIENT_SCOPE',
            403,
            'The authenticated principal is not authorized for this operation.',
            { action, resource, requiredScope },
        );
    }
}

let activePolicy: AuthorizationPolicy = new ScopeAuthorizationPolicy();

/** Replaces the centralized policy and returns a test/plugin-friendly restore hook. */
export function registerAuthorizationPolicy(policy: AuthorizationPolicy): () => void {
    const previous = activePolicy;
    activePolicy = policy;
    return () => {
        activePolicy = previous;
    };
}

export async function authorize(
    context: PolicyContext,
    action: PolicyAction,
    resource: PolicyResource,
): Promise<void> {
    await activePolicy.authorize(context, action, resource);
}

export function createPolicyContext(db: Database, principal: Principal): PolicyContext {
    return { db, principal };
}

/**
 * Compatibility context for the pre-existing unauthenticated REST and MCP
 * surfaces. PR 2 replaces this principal with the AuthAdapter result.
 */
export function createLegacyPolicyContext(db: Database): PolicyContext {
    return createPolicyContext(db, new DevelopmentPrincipal());
}
