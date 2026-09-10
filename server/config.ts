import { z } from 'zod';

export interface A2AJwtConfig {
    secret: string;
    issuer: string;
    audience: string;
}

export interface A2AConfig {
    authAdapter: string;
    publicBaseUrl: string;
    jwt?: A2AJwtConfig;
    isProduction: boolean;
}

const envSchema = z.object({
    NODE_ENV: z.string().optional(),
    HOST: z.string().optional(),
    PORT: z.string().optional(),
    PUBLIC_BASE_URL: z.string().url().optional(),
    AUTH_ADAPTER: z.string().trim().min(1).optional(),
    A2A_JWT_SECRET: z.string().optional(),
    A2A_JWT_ISSUER: z.string().trim().min(1).optional(),
    A2A_JWT_AUDIENCE: z.string().trim().min(1).optional(),
}).passthrough();

function missingJwtVariables(env: z.infer<typeof envSchema>): string[] {
    const missing: string[] = [];
    if (!env.A2A_JWT_SECRET) missing.push('A2A_JWT_SECRET');
    if (!env.A2A_JWT_ISSUER) missing.push('A2A_JWT_ISSUER');
    if (!env.A2A_JWT_AUDIENCE) missing.push('A2A_JWT_AUDIENCE');
    return missing;
}

/**
 * Loads the small amount of configuration owned by the A2A transport.
 * Production is fail-closed: both an explicit auth adapter and a stable
 * public base URL are required. Development and tests default to the
 * deliberately insecure `none` adapter and the local server URL.
 */
export function loadA2AConfig(source: NodeJS.ProcessEnv = process.env): A2AConfig {
    const parsed = envSchema.safeParse(source);
    if (!parsed.success) {
        throw new Error(`A2A configuration error: ${parsed.error.issues.map((issue) => issue.message).join('; ')}`);
    }

    const env = parsed.data;
    const isProduction = env.NODE_ENV === 'production';
    const authAdapter = (env.AUTH_ADAPTER ?? 'none').toLowerCase();

    if (isProduction && authAdapter === 'none') {
        throw new Error(
            'A2A configuration error: AUTH_ADAPTER must be explicitly set in production. ' +
            'Built-in options: jwt. Additional registered adapter names are also accepted.',
        );
    }

    if (isProduction && !env.PUBLIC_BASE_URL) {
        throw new Error('A2A configuration error: PUBLIC_BASE_URL is required in production.');
    }

    const publicBaseUrl = (env.PUBLIC_BASE_URL ?? `http://${env.HOST ?? 'localhost'}:${env.PORT ?? '9000'}`)
        .replace(/\/+$/, '');
    if (isProduction && new URL(publicBaseUrl).protocol !== 'https:') {
        throw new Error('A2A configuration error: PUBLIC_BASE_URL must use HTTPS in production.');
    }

    let jwt: A2AJwtConfig | undefined;
    if (authAdapter === 'jwt') {
        const missing = missingJwtVariables(env);
        if (missing.length > 0) {
            throw new Error(`A2A configuration error: AUTH_ADAPTER=jwt requires ${missing.join(', ')}.`);
        }
        if ((env.A2A_JWT_SECRET as string).length < 32) {
            throw new Error('A2A configuration error: A2A_JWT_SECRET must be at least 32 characters.');
        }
        jwt = {
            secret: env.A2A_JWT_SECRET as string,
            issuer: env.A2A_JWT_ISSUER as string,
            audience: env.A2A_JWT_AUDIENCE as string,
        };
    }

    return { authAdapter, publicBaseUrl, jwt, isProduction };
}
