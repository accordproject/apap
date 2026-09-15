import { z } from 'zod';

export interface A2AHs256Config {
    secret: string;
    issuer: string;
    audience: string;
}

/** Express's `trust proxy`: false, true, a hop count, or a list/preset. */
export type TrustProxySetting = boolean | number | string;

export interface A2ARateLimitConfig {
    windowMs: number;
    max: number;
}

export interface A2AConfig {
    authAdapter: string;
    publicBaseUrl: string;
    hs256?: A2AHs256Config;
    rateLimit: A2ARateLimitConfig;
    trustProxy: TrustProxySetting;
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
    A2A_RATE_LIMIT_WINDOW_MS: z.string().optional(),
    A2A_RATE_LIMIT_MAX: z.string().optional(),
    TRUST_PROXY: z.string().optional(),
}).passthrough();

/** In-process backstop only; the edge proxy remains the first line of defence. */
const DEFAULT_RATE_LIMIT: A2ARateLimitConfig = { windowMs: 60_000, max: 120 };

/**
 * How many proxies sit in front of this server. It decides what `req.ip` is,
 * and the A2A rate limiter keys on `req.ip`: left at `false` behind an ingress,
 * every caller shares the proxy's address and therefore one rate-limit bucket.
 * `true` trusts a client-supplied X-Forwarded-For outright, so prefer a hop
 * count (`1`) or an explicit subnet list.
 */
function parseTrustProxy(raw: string | undefined): TrustProxySetting {
    if (raw === undefined) return false;
    const value = raw.trim();
    if (value === '' || value.toLowerCase() === 'false') return false;
    if (value.toLowerCase() === 'true') return true;
    if (/^\d+$/.test(value)) return Number(value);
    return value;
}

function positiveInt(name: string, raw: string | undefined, fallback: number): number {
    if (raw === undefined) return fallback;
    const value = Number(raw);
    if (!Number.isInteger(value) || value <= 0) {
        throw new Error(`A2A configuration error: ${name} must be a positive integer.`);
    }
    return value;
}

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
 * public base URL are required. Every environment must explicitly select an
 * adapter; the deliberately insecure `none` adapter is confined to dev/test.
 */
export function loadA2AConfig(source: NodeJS.ProcessEnv = process.env): A2AConfig {
    const parsed = envSchema.safeParse(source);
    if (!parsed.success) {
        throw new Error(`A2A configuration error: ${parsed.error.issues.map((issue) => issue.message).join('; ')}`);
    }

    const env = parsed.data;
    const isProduction = env.NODE_ENV === 'production';
    const authAdapter = env.AUTH_ADAPTER?.toLowerCase();

    if (!authAdapter) {
        throw new Error(
            'A2A configuration error: AUTH_ADAPTER must be explicitly set. ' +
            'Built-in options: hs256, none. Additional registered adapter names are also accepted.',
        );
    }

    if (authAdapter === 'none' && env.NODE_ENV !== 'development' && env.NODE_ENV !== 'test') {
        throw new Error('A2A configuration error: AUTH_ADAPTER=none is allowed only in development or test.');
    }

    if (isProduction && !env.PUBLIC_BASE_URL) {
        throw new Error('A2A configuration error: PUBLIC_BASE_URL is required in production.');
    }

    const publicBaseUrl = (env.PUBLIC_BASE_URL ?? `http://${env.HOST ?? 'localhost'}:${env.PORT ?? '9000'}`)
        .replace(/\/+$/, '');
    if (isProduction && new URL(publicBaseUrl).protocol !== 'https:') {
        throw new Error('A2A configuration error: PUBLIC_BASE_URL must use HTTPS in production.');
    }

    let hs256: A2AHs256Config | undefined;
    if (authAdapter === 'hs256') {
        const missing = missingJwtVariables(env);
        if (missing.length > 0) {
            throw new Error(`A2A configuration error: AUTH_ADAPTER=hs256 requires ${missing.join(', ')}.`);
        }
        if ((env.A2A_JWT_SECRET as string).length < 32) {
            throw new Error('A2A configuration error: A2A_JWT_SECRET must be at least 32 characters.');
        }
        hs256 = {
            secret: env.A2A_JWT_SECRET as string,
            issuer: env.A2A_JWT_ISSUER as string,
            audience: env.A2A_JWT_AUDIENCE as string,
        };
    }

    const rateLimit: A2ARateLimitConfig = {
        windowMs: positiveInt('A2A_RATE_LIMIT_WINDOW_MS', env.A2A_RATE_LIMIT_WINDOW_MS, DEFAULT_RATE_LIMIT.windowMs),
        max: positiveInt('A2A_RATE_LIMIT_MAX', env.A2A_RATE_LIMIT_MAX, DEFAULT_RATE_LIMIT.max),
    };

    return {
        authAdapter,
        publicBaseUrl,
        hs256,
        rateLimit,
        trustProxy: parseTrustProxy(env.TRUST_PROXY),
        isProduction,
    };
}
