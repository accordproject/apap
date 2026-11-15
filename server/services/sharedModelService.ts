import { eq, asc, SQL, SQLWrapper, count } from 'drizzle-orm';
import { SharedModel } from '../db/schema';
import { SharedModelNotFoundError } from './errors';
import { authorize, type PolicyContext } from './policy';

type SharedModelRow = typeof SharedModel.$inferSelect;
type SharedModelInsert = typeof SharedModel.$inferInsert;

/**
 * Lists shared models bounded by limit and offset.
 * Defaults match the <=100 cap applied across other services for pagination safety.
 */
export async function listSharedModels(
    context: PolicyContext,
    opts: { limit?: number; offset?: number } = {},
): Promise<SharedModelRow[]> {
    await authorize(context, 'sharedmodels:list', { type: 'sharedmodel-collection' });
    const { db } = context;
    const limit = Math.min(100, Math.max(1, opts.limit ?? 100));
    const offset = Math.max(0, opts.offset ?? 0);
    return db.select().from(SharedModel).orderBy(asc(SharedModel.id)).limit(limit).offset(offset);
}

/**
 * Retrieves a single shared model by numeric id.
 * Throws SharedModelNotFoundError if not found.
 */
export async function getSharedModelById(context: PolicyContext, id: number): Promise<SharedModelRow> {
    await authorize(context, 'sharedmodels:read', { type: 'sharedmodel', id });
    const { db } = context;
    const rows = await db.select().from(SharedModel).where(eq(SharedModel.id, id)).limit(1);
    if (rows.length === 0) throw new SharedModelNotFoundError(String(id));
    return rows[0];
}

/**
 * Retrieves a single shared model by URI.
 * Throws SharedModelNotFoundError if not found.
 */
export async function getSharedModelByUri(context: PolicyContext, uri: string): Promise<SharedModelRow> {
    await authorize(context, 'sharedmodels:read', { type: 'sharedmodel', id: uri });
    const { db } = context;
    const rows = await db.select().from(SharedModel).where(eq(SharedModel.uri, uri)).limit(1);
    if (rows.length === 0) throw new SharedModelNotFoundError(uri);
    return rows[0];
}

/**
 * Paginated variant of `listSharedModels` for slice-3 REST unification (#217).
 *
 * REST callers (via `buildCrudRouter` in `handlers/crud.ts`) parse
 * pagination + filter + sort from the query string and pass the built
 * clauses in. Returning `{ items, total }` gives REST the metadata it needs
 * for the PaginatedResponse envelope.
 *
 * Bounds mirror `parseQueryParams`: limit clamped 1..100, offset >= 0.
 * Default order falls back to `asc(SharedModel.id)` for deterministic pagination.
 */
export async function listSharedModelsPaged(
    context: PolicyContext,
    opts: {
        whereClause?: SQL;
        orderClause?: SQLWrapper | null;
        limit: number;
        offset: number;
    },
): Promise<{ items: SharedModelRow[]; total: number }> {
    await authorize(context, 'sharedmodels:list', { type: 'sharedmodel-collection' });
    const { db } = context;
    const limit = Math.min(100, Math.max(1, opts.limit));
    const offset = Math.max(0, opts.offset);

    // Read-skew note: count and row-fetch are two separate queries with no
    // shared snapshot. Under concurrent writes a caller can observe `total`
    // and `items.length` disagreeing by one or two rows between the round-
    // trips. Acceptable for list endpoints where pagination metadata is
    // best-effort.
    const [{ count: totalRow }] = await db
        .select({ count: count() })
        .from(SharedModel)
        .where(opts.whereClause);

    // Pagination determinism: `limit` + `offset` over an unordered result set
    // can repeat or skip rows across pages. Fall back to `asc(SharedModel.id)`
    // when no order was provided so paging is stable by construction.
    const orderClause: SQLWrapper = opts.orderClause ?? asc(SharedModel.id);
    const items = await db
        .select()
        .from(SharedModel)
        .where(opts.whereClause)
        .orderBy(orderClause as SQL<unknown>)
        .limit(limit)
        .offset(offset);

    return { items, total: totalRow };
}
