import {
    decodeProtectedHeader,
    jwtVerify,
    type JWTPayload,
} from 'jose';
import type { SecurityScheme } from '@a2a-js/sdk';
import type { RequestHeaders } from '@a2a-js/sdk/server';
import type { A2AHs256Config } from '../config';
import {
    A2AAuthError,
    AuthAdapter,
    AuthenticatedPrincipal,
    Principal,
} from './types';

function bearerToken(headers: RequestHeaders): string {
    const authorization = headers.authorization;
    if (!authorization || Array.isArray(authorization)) {
        throw new A2AAuthError('MISSING_TOKEN', 'A Bearer token is required.');
    }
    const match = authorization.match(/^Bearer\s+(\S+)$/i);
    if (!match) {
        throw new A2AAuthError('MALFORMED_AUTHORIZATION', 'Authorization must use the Bearer scheme.');
    }
    const token = match[1];
    if (token.split('.').length !== 3) {
        throw new A2AAuthError('MALFORMED_TOKEN', 'Bearer token is not a compact JWT.');
    }
    return token;
}

function stringList(value: unknown, splitWhitespace = false): string[] {
    if (Array.isArray(value)) {
        return value.filter((item): item is string => typeof item === 'string' && item.length > 0);
    }
    if (typeof value !== 'string' || value.length === 0) return [];
    return splitWhitespace ? value.split(/\s+/).filter(Boolean) : [value];
}

function orgId(payload: JWTPayload): string | undefined {
    const value = payload.orgId ?? payload.org_id ?? payload.org;
    return typeof value === 'string' && value.length > 0 ? value : undefined;
}

function mapJoseError(error: unknown): A2AAuthError {
    const code = typeof error === 'object' && error !== null && 'code' in error
        ? String((error as { code: unknown }).code)
        : '';
    const claim = typeof error === 'object' && error !== null && 'claim' in error
        ? String((error as { claim: unknown }).claim)
        : '';

    if (code === 'ERR_JWT_EXPIRED') return new A2AAuthError('TOKEN_EXPIRED', 'JWT has expired.');
    if (claim === 'aud') return new A2AAuthError('AUDIENCE_MISMATCH', 'JWT audience is not accepted.');
    if (claim === 'iss') return new A2AAuthError('ISSUER_MISMATCH', 'JWT issuer is not accepted.');
    if (claim === 'nbf') return new A2AAuthError('TOKEN_NOT_ACTIVE', 'JWT is not active yet.');
    if (code === 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED') {
        return new A2AAuthError('SIGNATURE_INVALID', 'JWT signature verification failed.');
    }
    return new A2AAuthError('TOKEN_INVALID', 'JWT verification failed.');
}

/**
 * Demo-grade HS256 adapter for the reference implementation. Enterprise
 * deployments should register an asymmetric OIDC/JWKS or wallet/DID adapter.
 */
export class JwtAdapter implements AuthAdapter {
    public readonly name = 'hs256';
    public readonly securitySchemeName = 'Bearer';
    private readonly key: Uint8Array;

    constructor(private readonly config: A2AHs256Config) {
        this.key = new TextEncoder().encode(config.secret);
    }

    public describeScheme(): SecurityScheme {
        return {
            scheme: {
                $case: 'httpAuthSecurityScheme',
                value: {
                    description: 'Demo-grade HS256 Bearer JWT. Replace with an asymmetric adapter in production.',
                    scheme: 'Bearer',
                    bearerFormat: 'JWT',
                },
            },
        };
    }

    public async authenticate(headers: RequestHeaders): Promise<Principal> {
        const token = bearerToken(headers);
        try {
            const protectedHeader = decodeProtectedHeader(token);
            if (protectedHeader.alg !== 'HS256') {
                throw new A2AAuthError('ALG_NOT_ALLOWED', 'Only HS256 JWTs are accepted by this adapter.');
            }

            const { payload } = await jwtVerify(token, this.key, {
                algorithms: ['HS256'],
                issuer: this.config.issuer,
                audience: this.config.audience,
                clockTolerance: 60,
            });

            if (payload.exp === undefined) {
                throw new A2AAuthError('EXPIRATION_REQUIRED', 'JWT expiration is required.');
            }
            if (!payload.sub) {
                throw new A2AAuthError('SUBJECT_REQUIRED', 'JWT subject is required.');
            }

            const raw = Object.freeze({ ...payload }) as Readonly<Record<string, unknown>>;
            return new AuthenticatedPrincipal(
                payload.sub,
                orgId(payload),
                Object.freeze(stringList(payload.roles)),
                Object.freeze(stringList(payload.scope ?? payload.scopes, true)),
                raw,
            );
        } catch (error) {
            if (error instanceof A2AAuthError) throw error;
            throw mapJoseError(error);
        }
    }
}
