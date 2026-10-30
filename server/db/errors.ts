import { DrizzleQueryError } from 'drizzle-orm';

/** Recognize postgres-js failures directly or through Drizzle's query wrapper. */
export function isUniqueViolation(error: unknown): boolean {
    const driverError = error instanceof DrizzleQueryError ? error.cause : error;
    return typeof driverError === 'object' && driverError !== null
        && 'code' in driverError && driverError.code === '23505';
}
