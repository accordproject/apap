import { DrizzleQueryError } from 'drizzle-orm';

/**
 * Recognize PostgreSQL unique violations directly or on an immediate Drizzle cause.
 * Preserved Drizzle error causes can contain raw SQL and bound parameters.
 * Sanitize them before serialization into external monitoring or logging.
 */
export function isUniqueViolation(error: unknown): boolean {
    const driverError = error instanceof DrizzleQueryError ? error.cause : error;
    return typeof driverError === 'object' && driverError !== null
        && 'code' in driverError && driverError.code === '23505';
}
