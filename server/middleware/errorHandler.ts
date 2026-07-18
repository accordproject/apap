import { Request, Response, NextFunction } from 'express';
import { ServiceError } from '../services/errors';

/**
 * Normalizes an unknown caught value into a safe, 
 * non-leaking error message string.
 * Never exposes raw stack traces or internal paths 
 * to the client.
 */
function toSafeMessage(err: unknown): string {
    if (err instanceof Error) return err.message;
    if (typeof err === 'string') return err;
    return 'An unexpected error occurred';
}

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
    // Log structured error internally — never expose 
    // stack traces to client
    console.error({
        type: 'unhandled_error',
        method: req.method,
        path: req.path,
        message: toSafeMessage(err),
        // Only log stack in development
        ...(process.env.NODE_ENV === 'development' && {
            stack: err instanceof Error ? err.stack : undefined
        })
    });

    if (res.headersSent) {
        return next(err);
    }

    // Handle Postgres unique constraint violation
    if (typeof err === 'object' && err !== null && 'code' in err && (err as any).code === '23505') {
        res.status(409).json({
            error: 'Conflict',
            details: `A resource with this unique identifier already exists${(err as any).typeName ? ` for ${(err as any).typeName}` : ''}.`
        });
        return;
    }

    if (err instanceof ServiceError) {
        res.status(err.statusCode).json(err.toJSON());
        return;
    }

    // Handle Express middleware errors (like malformed JSON)
    const statusCode = (typeof err === 'object' && err !== null && 'status' in err && typeof (err as any).status === 'number') 
        ? (err as any).status 
        : 500;

    res.status(statusCode).json({
        error: toSafeMessage(err)
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
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}
