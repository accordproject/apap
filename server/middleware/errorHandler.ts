import { Request, Response, NextFunction } from 'express';
import { ServiceError, publicServiceError } from '../services/errors';
import { isUniqueViolation } from '../db/errors';

/**
 * Global Express error handling middleware.
 * Replaces the 20+ duplicate try/catch -> res.status(500) 
 * patterns across agreements.ts, crud.ts, and mcp.ts.
 * 
 * Usage: app.use(globalErrorHandler) after all routes.
 * 
 * @param err - The error passed via next(err)
 * @param req - Express Request
 * @param res - Express Response
 * @param next - Express NextFunction (required for Express to 
 *               recognize this as error middleware)
 */
export function globalErrorHandler(
    err: unknown,
    req: Request,
    res: Response,
    next: NextFunction
): void {
    // Domain errors keep their own status/body, even when they carry a DB cause.
    const uniqueViolation = !(err instanceof ServiceError) && isUniqueViolation(err);
    // Log structured error internally — never expose 
    // stack traces to client
    console.error({
        type: 'unhandled_error',
        method: req.method,
        path: req.path,
        message: uniqueViolation ? 'Unique constraint violation' : (err instanceof ServiceError ? err.code : 'Unexpected error'),
    });

    if (res.headersSent) {
        return next(err);
    }

    // Handle Postgres unique constraint violation
    if (uniqueViolation) {
        res.status(409).json({
            error: 'Conflict',
            details: `A resource with this unique identifier already exists${(err as any).typeName ? ` for ${(err as any).typeName}` : ''}.`
        });
        return;
    }

    if (err instanceof ServiceError) {
        res.status(err.statusCode).json(publicServiceError(err));
        return;
    }

    // Handle Express middleware errors (like malformed JSON)
    const statusCode = (typeof err === 'object' && err !== null && 'status' in err && Number.isInteger((err as any).status) && (err as any).status >= 400 && (err as any).status <= 599)
        ? (err as any).status 
        : 500;

    res.status(statusCode).json({
        error: statusCode === 400 && (err as any)?.type === 'entity.parse.failed'
            ? 'Malformed JSON' : 'An internal error occurred'
    });
}

/**
 * Wraps an async Express route handler to automatically 
 * forward any thrown errors to next(err), so they reach
 * globalErrorHandler without needing try/catch in every route.
 * 
 * @param fn - The async route handler to wrap
 * @returns A wrapped handler that calls next(err) on failure
 * 
 * @example
 * router.get('/:id', asyncHandler(async (req, res) => {
 *     const item = await db.find(req.params.id);
 *     res.json(item);
 * }));
 */
export function asyncHandler(
    fn: (req: Request, res: Response, next: NextFunction) 
        => Promise<unknown>
) {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve().then(() => fn(req, res, next)).catch((error) => {
            // Express treats falsy values and special strings as routing control flow.
            // Preserve other values, including database errors represented as objects.
            next(!error || error === 'route' || error === 'router' ? new Error('Unexpected error') : error);
        });
    };
}
