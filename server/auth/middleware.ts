import type { NextFunction, Request, RequestHandler, Response } from 'express';
import type { UserBuilder } from '@a2a-js/sdk/server/express';
import type { AuthAdapter, Principal } from './types';
import { A2AAuthError } from './types';

export interface AuthenticatedA2ARequest extends Request {
    a2aPrincipal?: Principal;
}

export interface A2AAuthMiddlewareOptions {
    /**
     * Second lock on the "every authorization is bypassed" path. config.ts
     * already refuses AUTH_ADAPTER=none outside development/test; this rejects
     * an unauthenticated principal at the transport even if some other adapter
     * returns one. REST and MCP keep their own legacy behaviour until PR 2.
     */
    readonly rejectUnauthenticated?: boolean;
}

export function createA2AAuthMiddleware(
    adapter: AuthAdapter,
    options: A2AAuthMiddlewareOptions = {},
): RequestHandler {
    return async (req: AuthenticatedA2ARequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            const principal = await adapter.authenticate(req.headers);
            if (options.rejectUnauthenticated && principal.isAuthenticated !== true) {
                throw new A2AAuthError(
                    'UNAUTHENTICATED_PRINCIPAL',
                    'An unauthenticated principal is not accepted by this deployment.',
                );
            }
            req.a2aPrincipal = principal;
            next();
        } catch (error) {
            const authError = error instanceof A2AAuthError
                ? error
                : new A2AAuthError('AUTHENTICATION_FAILED', 'Authentication failed.');
            console.warn({ event: 'a2a_auth_failed', code: authError.code });
            // Keep this value static: custom adapters control their error code,
            // which must never become an HTTP response-header injection seam.
            res.setHeader('WWW-Authenticate', 'Bearer realm="apap-a2a", error="invalid_token"');
            res.status(401).json({ error: { code: authError.code, message: authError.message } });
        }
    };
}

export const authenticatedUserBuilder: UserBuilder = async (req: Request) => {
    const principal = (req as AuthenticatedA2ARequest).a2aPrincipal;
    if (!principal) {
        throw new A2AAuthError('AUTH_CONTEXT_MISSING', 'Authentication context is missing.');
    }
    return principal;
};
