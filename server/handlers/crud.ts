import { Router, Request, Response } from 'express';
import { SQLWrapper, AnyColumn, desc, asc, eq, and, sql} from 'drizzle-orm';
import { toSnakeCase } from 'drizzle-orm/casing';
// import { eq, and, asc, desc } from 'drizzle-orm/expressions';
import { PgTable } from 'drizzle-orm/pg-core';
// import { authCheckJwt, authRequiredPermissions, getOrgIdFromJwt } from './auth';
import { z } from 'zod';
import { SQL } from 'drizzle-orm';
import { count } from 'drizzle-orm';
import escapeString from '../db/escape';
// import { getUserRoles } from '../auth0/client';

function defaultWhereClause<T extends PgTable<any>>(req: Request, queryParams: QueryParams) : SQL | undefined {
    const conditions = queryParams.filters ? Object.keys(queryParams.filters).map(key => {
        const value = queryParams.filters[key];
        // TODO, only works for string cols as we use "=" to compare LHS and RHS
        return sql.raw(`"${toSnakeCase(key)}"=${escapeString(value.toString())}`);
    }) : [];
    return conditions.length > 0 ? and(...conditions) : undefined;
}

// Types for query parameters
export interface QueryParams {
    page: number;
    limit: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    filters?: Record<string, any>;
}

interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

interface TableWithId {
    id: AnyColumn;
}

interface CrudRouterOptions<T extends PgTable<any> & TableWithId> {
    table: T;
    typeName: string;
    buildWhereClause?: (req: Request, queryParams: QueryParams) => SQL | undefined;
    validateBody?: (req: Request, res: Response) => z.ZodSchema;
    transformResponse?: (item: any) => any;
    transformRequest?: (req: Request) => any;
}

// Parse and validate query parameters
function parseQueryParams(req: Request): QueryParams {
    const {
        page = '1',
        limit = '10000',
        sortBy,
        sortOrder = 'asc',
        ...filters
    } = req.query;

    return {
        page: Math.max(1, parseInt(page as string)),
        limit: Math.min(100, Math.max(1, parseInt(limit as string))),
        sortBy: sortBy as string,
        sortOrder: (sortOrder as string).toLowerCase() === 'desc' ? 'desc' : 'asc',
        filters
    };
}

// Build order by clause
function buildOrderClause<T extends PgTable<any>>(
    table: T,
    sortBy?: string,
    sortOrder: 'asc' | 'desc' = 'asc'
): SQLWrapper | null {
    if (sortBy && sortBy in table) {
        const col = table[sortBy as keyof T] as AnyColumn;
        return sortOrder === 'desc' ? desc(col) : asc(col);
    }
    return null;
}

// In buildCrudRouter, add a helper to enhance user data
async function enhanceUserData(user: any) {
    console.log('user', user);
    if (!user?.email) return user;
    const roles:Array<string> = []; //await getUserRoles(user.email);
    return { ...user, roles };
}

export function buildCrudRouter<T extends PgTable<any> & TableWithId>({
    table,
    typeName,
    buildWhereClause,
    validateBody,
    transformResponse,
    transformRequest
}: CrudRouterOptions<T>): Router {
    const router = Router();

    // router.use(authCheckJwt);

    // Secure middleware to check for org_id
    router.use(async (req: Request, res: Response, next) => {
        // if (!req.auth?.payload) {
        //     return res.status(401).json({ error: 'Unauthorized - Missing or invalid JWT' });
        // }

        // const orgId = await getOrgIdFromJwt(req);
        // if (!orgId) {
        //     return res.status(403).json({ 
        //         error: 'Forbidden - Organization ID is required',
        //         details: 'Valid organization membership is required to access this resource'
        //     });
        // }
        
        res.locals.orgId = undefined; //orgId;
        next();
    });

    // GET with pagination, sorting, and filtering
    router.get('/',
        // authRequiredPermissions('read:' + typeName),
        async (req: Request, res: Response) => {
            try {
                const queryParams = parseQueryParams(req);
                const { page, limit, sortBy, sortOrder } = queryParams;
                const whereClause = buildWhereClause ? buildWhereClause(req, queryParams) : 
                    defaultWhereClause(req, queryParams);
                const orderClause = buildOrderClause(table, sortBy, sortOrder);

                // Log the generated SQL
                let logQuery = res.locals.db
                    .select()
                    .from(table)
                    .where(whereClause)
                    .limit(limit)
                    .offset((page - 1) * limit);

                if (orderClause !== null) {
                    logQuery = logQuery.orderBy(orderClause as SQL<unknown>);
                }

                const sql = logQuery.toSQL();
                
                console.log(`[${typeName}] SQL:`, sql.sql);
                console.log(`[${typeName}] Params:`, sql.params);

                // Get total count for pagination
                const [{ count: total }] = await res.locals.db
                    .select({ count: count() })
                    .from(table)
                    .where(whereClause);

                // Get paginated results
                let query = res.locals.db
                    .select()
                    .from(table)
                    .where(whereClause)
                    .limit(limit)
                    .offset((page - 1) * limit);

                if (orderClause !== null) {
                    query = query.orderBy(orderClause as SQL<unknown>);
                }

                const items = await query;

                const response: PaginatedResponse<any> = {
                    items,
                    total: total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit)
                };

                // Modify the GET responses to include roles
                if (typeName === 'users') {
                    response.items = await Promise.all(items.map(enhanceUserData));
                } else {
                    response.items = items;
                }

                if (transformResponse) {
                    response.items = response.items.map(transformResponse);
                }

                res.json(response);
            } catch (error) {
                console.log(error);
                const message = error instanceof Error ? error.message : 'Unknown error';
                res.status(500).json({ error: message });
            }
        });

    // POST new item
    router.post('/',
        // authRequiredPermissions('write:' + typeName),
        async (req: Request, res: Response) => {
            try {
                if (!req.body) {
                    return res.status(400).json({ error: 'Missing request body' });
                }

                // Add organization to the request body
                req.body = {
                    ...req.body,
                    organization: res.locals.orgId
                };

                // Validate body if schema provided
                if (validateBody) {
                    const schema = validateBody(req, res);
                    const result = schema.safeParse(req.body);
                    if (!result.success) {
                        return res.status(400).json({ 
                            error: 'Invalid request body',
                            details: result.error.errors 
                        });
                    }
                    req.body = result.data;  // Use validated data
                }

                if (transformRequest) {
                    req.body = transformRequest(req);
                }

                const inserted = await res.locals.db
                    .insert(table)
                    .values(req.body)
                    .returning();

                if (transformResponse) {
                    inserted[0] = transformResponse(inserted[0]);
                }

                res.json(inserted[0]);
            } catch (error) {
                const message = error instanceof Error ? error.message : 'Unknown error';
                res.status(500).json({ error: message });
            }
        });

    // GET single item
    router.get('/:id',
        // authRequiredPermissions('read:' + typeName),
        async (req: Request, res: Response) => {
            try {
                const queryParams = parseQueryParams(req);
                const whereConditions = [
                    // Check if table has UUID primary key
                    table.id.columnType === 'PgUUID' ? 
                        eq(table.id, req.params.id) :
                        eq(table.id, parseInt(req.params.id))
                ].filter(Boolean);

                const result = await res.locals.db
                    .select()
                    .from(table)
                    .where(and(...whereConditions))
                    .limit(1);

                if (!result.length) {
                    return res.status(404).json({ error: 'Not found' });
                }

                // Enhance single user response with roles
                if (typeName === 'users') {
                    const enhancedUser = await enhanceUserData(result[0]);
                    if (transformResponse) {
                        result[0] = transformResponse(enhancedUser);
                    }
                    return res.json(result[0]);
                }

                if (transformResponse) {
                    result[0] = transformResponse(result[0]);
                }

                res.json(result[0]);
            } catch (error) {
                const message = error instanceof Error ? error.message : 'Unknown error';
                res.status(500).json({ error: message });
            }
        });

    // PUT update item
    router.put('/:id',
        // authRequiredPermissions('write:' + typeName),
        async (req: Request, res: Response) => {
            try {
                // Add organization to the request body
                req.body = {
                    ...req.body,
                    organization: res.locals.orgId
                };

                const queryParams = parseQueryParams(req);
                const whereConditions = [
                    table.id.columnType === 'PgUUID' ? 
                        eq(table.id, req.params.id) :
                        eq(table.id, parseInt(req.params.id))
                ].filter(Boolean);

                const updated = await res.locals.db
                    .update(table)
                    .set(req.body)
                    .where(and(...whereConditions))
                    .returning();

                if (!updated.length) {
                    return res.status(404).json({ error: 'Not found' });
                }

                if (transformResponse) {
                    updated[0] = transformResponse(updated[0]);
                }

                res.json(updated[0]);
            } catch (error) {
                const message = error instanceof Error ? error.message : 'Unknown error';
                res.status(500).json({ error: message });
            }
        });

    // DELETE item
    router.delete('/:id',
        // authRequiredPermissions('write:' + typeName),
        async (req: Request, res: Response) => {
            try {
                const queryParams = parseQueryParams(req);
                const whereConditions = [
                    table.id.columnType === 'PgUUID' ? 
                        eq(table.id, req.params.id) :
                        eq(table.id, parseInt(req.params.id))
                ].filter(Boolean);

                await res.locals.db
                    .delete(table)
                    .where(and(...whereConditions));

                res.json({ status: 'deleted' });
            } catch (error) {
                const message = error instanceof Error ? error.message : 'Unknown error';
                res.status(500).json({ error: message });
            }
        });

    return router;
}