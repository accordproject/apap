import { Router, Request, Response } from 'express';
import { SQLWrapper, AnyColumn, desc, asc, eq, and, sql} from 'drizzle-orm';
import { toSnakeCase } from 'drizzle-orm/casing';
import { PgTable } from 'drizzle-orm/pg-core';
import { z } from 'zod';
import { SQL } from 'drizzle-orm';
import { count } from 'drizzle-orm';
import escapeString from '../db/escape';

function defaultWhereClause<T extends PgTable<any>>(
	req: Request,
	queryParams: QueryParams,
	table?: T
): SQL | undefined {
	const filters = queryParams.filters;
	if (!filters || Object.keys(filters).length === 0) {
		return undefined;
	}

	const conditions: SQL[] = [];

	for (const key of Object.keys(filters)) {
		let value = filters[key];

		if (table && !(key in table)) {
			continue;
		}

		const column = sql.raw(`"${toSnakeCase(key)}"`);

		if (value === null || value === 'null') {
			conditions.push(sql`${column} IS NULL`);
			continue;
		}

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

		conditions.push(sql`${column} = ${value}`);
	}

	if (conditions.length === 0)
		return undefined;
	if (conditions.length === 1)
		return conditions[0];

	return sql.join(conditions, sql` AND `);
}

function parseValue(v: any) {
  const s = String(v).trim();

  if (s.toLowerCase() === 'true') return true;
  if (s.toLowerCase() === 'false') return false;
  
  const n = Number(s);
  if (!isNaN(n)) return n;

  return v;
}

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
    custom?: (body: any) => Promise<ValidationResult>,
}

interface CrudRouterOptions<T extends PgTable<any> & TableWithId> {
    table: T;
    typeName: string;
    buildWhereClause?: (req: Request, queryParams: QueryParams) => SQL | undefined;
    validateBody?: InsertValidator;
    transformResponse?: (item: any) => any;
    transformRequest?: (req: Request) => any;
}

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

async function enhanceUserData(user: any) {
    console.log('user', user);
    if (!user?.email) return user;
    const roles: Array<string> = [];
    return { ...user, roles };
}

// FIX: extracted validateBody logic into a standalone async function
// so it can safely handle the case where validateBody is undefined (defaults to {})
async function runValidation(
    body: any,
    validateBody: InsertValidator = {}  // default to empty object — safe if not passed
): Promise<{ success: boolean; data?: any; error?: any }> {

    // No validateBody passed at all — skip validation entirely
    if (!validateBody.schema && !validateBody.custom) {
        return { success: true, data: body };
    }

    // Run Zod schema validation if provided
    if (validateBody.schema) {
        const result = validateBody.schema.safeParse(body);
        if (!result.success) {
            return { success: false, error: result.error.errors };
        }
        body = result.data;
    }

    // Run custom validation if provided (only reached if schema passed or not present)
    if (validateBody.custom) {
        const result = await validateBody.custom(body);
        if (!result.success) {
            return { success: false, error: result.error?.errors };
        }
        body = result.data;
    }

    return { success: true, data: body };
}

export function buildCrudRouter<T extends PgTable<any> & TableWithId>({
    table,
    typeName,
    buildWhereClause,
    validateBody,       // still optional in the signature — no runtime assumption
    transformResponse,
    transformRequest
}: CrudRouterOptions<T>): Router {
    const router = Router();

    // Middleware to set orgId
    router.use(async (req: Request, res: Response, next) => {
        res.locals.orgId = undefined;
        next();
    });

    // GET all — paginated, sorted, filtered
    router.get('/', async (req: Request, res: Response) => {
        try {
            const queryParams = parseQueryParams(req);
            const { page, limit, sortBy, sortOrder } = queryParams;
            const whereClause = buildWhereClause
                ? buildWhereClause(req, queryParams)
                : defaultWhereClause(req, queryParams, table);
            const orderClause = buildOrderClause(table, sortBy, sortOrder);

            // Build query and log SQL
            let query = res.locals.db
                .select()
                .from(table)
                .where(whereClause)
                .limit(limit)
                .offset((page - 1) * limit);

            if (orderClause !== null) {
                query = query.orderBy(orderClause as SQL<unknown>);
            }

            const { sql: sqlStr, params } = query.toSQL();
            console.log(`[${typeName}] SQL:`, sqlStr);
            console.log(`[${typeName}] Params:`, params);

            // Get total count
            const [{ count: total }] = await res.locals.db
                .select({ count: count() })
                .from(table)
                .where(whereClause);

            const items = await query;

            const response: PaginatedResponse<any> = {
                items,
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            };

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

    // POST — create new item
    router.post('/', async (req: Request, res: Response) => {
        try {
            if (!req.body) {
                return res.status(400).json({ error: 'Missing request body' });
            }

            req.body = {
                ...req.body,
                organization: res.locals.orgId
            };

            // FIX: use runValidation() which safely handles undefined validateBody
            const validation = await runValidation(req.body, validateBody);
            if (!validation.success) {
                return res.status(400).json({
                    error: 'Invalid request body',
                    details: validation.error
                });
            }
            req.body = validation.data;

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

    // GET single item by ID
    router.get('/:id', async (req: Request, res: Response) => {
        try {
            const whereConditions = [
                table.id.columnType === 'PgUUID'
                    ? eq(table.id, req.params.id)
                    : eq(table.id, parseInt(req.params.id))
            ].filter(Boolean);

            const result = await res.locals.db
                .select()
                .from(table)
                .where(and(...whereConditions))
                .limit(1);

            if (!result.length) {
                return res.status(404).json({ error: 'Not found' });
            }

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

    // PUT — full update by ID
    router.put('/:id', async (req: Request, res: Response) => {
        try {
            req.body = {
                ...req.body,
                organization: res.locals.orgId
            };

            const whereConditions = [
                table.id.columnType === 'PgUUID'
                    ? eq(table.id, req.params.id)
                    : eq(table.id, parseInt(req.params.id))
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

    // DELETE — remove item by ID
    router.delete('/:id', async (req: Request, res: Response) => {
        try {
            const whereConditions = [
                table.id.columnType === 'PgUUID'
                    ? eq(table.id, req.params.id)
                    : eq(table.id, parseInt(req.params.id))
            ].filter(Boolean);

            // BONUS FIX: use .returning() to detect if row actually existed
            const result = await res.locals.db
                .delete(table)
                .where(and(...whereConditions))
                .returning();

            if (!result.length) {
                return res.status(404).json({ error: 'Not found' });
            }

            res.json({ status: 'deleted' });
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            res.status(500).json({ error: message });
        }
    });

    return router;
}
