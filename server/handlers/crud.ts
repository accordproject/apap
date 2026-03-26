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

/**
 * @param req The current Express request.
 * @param queryParams Parsed pagination, sorting, and filter parameters.
 * @param table The optional Drizzle table used to validate filter keys.
 * @return A SQL `where` clause built from query filters, or `undefined` when no filters are present.
 * @details Converts query-string filters into a Drizzle SQL fragment. The function
 * supports equality filters by default, handles explicit `null` values, and also
 * accepts inline comparison operators such as `>=`, `<=`, `!=`, `>`, and `<`.
 */
function defaultWhereClause<T extends PgTable<any>>(
	req: Request,
	queryParams: QueryParams,
	table?: T
): SQL | undefined {
	const filters = queryParams.filters;
	if (!filters || Object.keys(filters).length === 0) {
		// no filters -> no "where" clause
		return undefined;
	}

	const conditions: SQL[] = [];

	for (const key of Object.keys(filters)) {
		let value = filters[key];

		if (table && !(key in table)) {
			// if table is given we check if key exists in it
			continue;
		}

		const column = sql.raw(`"${toSnakeCase(key)}"`);

		if (value === null || value === 'null') {
			// NULL handling
			conditions.push(sql`${column} IS NULL`);
			continue;
		}

		// detect operator inside value (no naming convention needed)
		if (typeof value === 'string') {
			const trimmed = value.trim();
			const opMatch = trimmed.match(/^(>=|<=|<>|!=|>|<)\s*(.+)$/);
			if (opMatch) {
				const operator = opMatch[1];
				const operandRaw = opMatch[2];
				const operand = parseValue(operandRaw);
				conditions.push(sql`${column} ${sql.raw(operator)} ${operand}`);
				continue;
			}
		}

		// default equality
		conditions.push(sql`${column} = ${value}`);
	}

	if (conditions.length === 0)
		return undefined;
	if (conditions.length === 1)
		return conditions[0];

	return sql.join(conditions, sql` AND `);
}

/**
 * @param v The raw filter operand read from the query string.
 * @return A normalized primitive value, converted to boolean or number when possible.
 * @details Used by filter parsing to interpret string operands like `true`, `false`,
 * or numeric values before they are inserted into a SQL comparison expression.
 */
function parseValue(v: any) {
  const s = String(v).trim();

  if (s.toLowerCase() === 'true') return true;
  if (s.toLowerCase() === 'false') return false;
  
  const n = Number(s);
  if (!isNaN(n)) return n;

  return v;
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

export type ValidationError = {
    code?: string,
    expected?: string,
    received?: string,
    path?: Array<string>
    message: string
}

export type ValidationResult = {
    success: boolean
    error?: {
        errors: Array<ValidationError>
    }
    data?: any
}

export type InsertValidator = {
    schema?: z.ZodSchema,
    custom?: (body:any) => Promise<ValidationResult>,
}

interface CrudRouterOptions<T extends PgTable<any> & TableWithId> {
    table: T;
    typeName: string;
    buildWhereClause?: (req: Request, queryParams: QueryParams) => SQL | undefined;
    validateBody?: InsertValidator;
    transformResponse?: (item: any) => any;
    transformRequest?: (req: Request) => any;
}

/**
 * @param req The current Express request.
 * @return A normalized `QueryParams` object with parsed paging, sorting, and filter values.
 * @details Reads query-string parameters from the request and applies the current
 * defaults and bounds for `page`, `limit`, and `sortOrder`, leaving all other
 * query-string keys available as filter values.
 */
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

/**
 * @param table The Drizzle table being queried.
 * @param sortBy The optional property name to sort by.
 * @param sortOrder The requested sort direction, defaulting to ascending.
 * @return A Drizzle order-by wrapper when the field exists on the table, otherwise `null`.
 * @details Validates the requested sort field against the table definition and
 * constructs either an ascending or descending order clause for list queries.
 */
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

/**
 * @param user The user record returned from the database.
 * @return The original user or a user object extended with a `roles` array.
 * @details This helper is currently used only for the special `users` type path.
 * The role lookup is stubbed out in the current code and returns an empty roles array.
 */
async function enhanceUserData(user: any) {
    console.log('user', user);
    if (!user?.email) return user;
    const roles:Array<string> = []; //await getUserRoles(user.email);
    return { ...user, roles };
}

/**
 * @param options The CRUD router configuration, including table metadata, validation hooks,
 * and optional request/response transformations.
 * @return An Express router exposing list, get, create, update, and delete routes for the table.
 * @details Builds the shared CRUD router used by multiple APAP resources. The current
 * implementation applies optional request validation, pagination, filtering, sorting,
 * record transformation hooks, and basic database-backed handlers for standard CRUD operations.
 */
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
                    defaultWhereClause(req, queryParams, table);
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
                if (validateBody.schema) {
                    const result = validateBody.schema.safeParse(req.body);
                    if (!result.success) {
                        return res.status(400).json({ 
                            error: 'Invalid request body',
                            details: result.error.errors 
                        });
                    }
                    req.body = result.data;  // Use validated data
                    if(validateBody.custom) {
                        const result = await validateBody.custom(req.body);
                        if (!result.success) {
                            return res.status(400).json({ 
                                error: 'Invalid request body',
                                details: result.error.errors 
                            });
                        }
                        req.body = result.data;  // Use validated data        
                    }
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
            } catch (error: any) {
                // Handle Unique Constraint Violation (Duplicate URI)
                if (error?.code === '23505') {
                    return res.status(409).json({
                        error: 'Conflict',
                        details: `A resource with this unique identifier already exists for ${typeName}.`
                    });
                }

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
            } catch (error: any) {
                // FIXED: Handle Unique Constraint Violation (Duplicate URI during Update)
                if (error?.code === '23505') {
                    return res.status(409).json({
                        error: 'Conflict',
                        details: `A resource with this unique identifier already exists for ${typeName}.`
                    });
                }

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
