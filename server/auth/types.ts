import type { SecurityScheme } from '@a2a-js/sdk';
import type { RequestHeaders, User } from '@a2a-js/sdk/server';

/** Identity shape shared by demo JWT, OIDC, wallet/DID, and future adapters. */
export interface Principal extends User {
    readonly sub: string;
    readonly orgId?: string;
    readonly roles: readonly string[];
    readonly scopes: readonly string[];
    readonly raw: unknown;
}

/** Verification-agnostic authentication seam for the A2A transport. */
export interface AuthAdapter {
    readonly name: string;
    readonly securitySchemeName?: string;
    authenticate(headers: RequestHeaders): Promise<Principal>;
    describeScheme(): SecurityScheme | undefined;
}

export class AuthenticatedPrincipal implements Principal {
    public readonly isAuthenticated = true;

    constructor(
        public readonly sub: string,
        public readonly orgId: string | undefined,
        public readonly roles: readonly string[],
        public readonly scopes: readonly string[],
        public readonly raw: unknown,
    ) {}

    public get userName(): string {
        return this.sub;
    }
}

export class DevelopmentPrincipal implements Principal {
    public readonly sub = 'anonymous';
    public readonly orgId: undefined = undefined;
    public readonly roles: readonly string[] = [];
    public readonly scopes: readonly string[] = ['*'];
    public readonly raw: unknown = {};
    public readonly isAuthenticated = false;

    public get userName(): string {
        return this.sub;
    }
}

export class A2AAuthError extends Error {
    constructor(public readonly code: string, message: string) {
        super(message);
        this.name = 'A2AAuthError';
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
