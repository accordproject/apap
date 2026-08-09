import { eq, or } from 'drizzle-orm';
import { Agreement, Template } from '../db/schema';
import type { Database } from '../db/client';
import { TemplateDuplicateError, TemplateImmutableError, TemplateInUseError, TemplateNotFoundError } from './errors';

// Each function takes `db` as the first arg so both the MCP handler and the REST
// routes can call the same code path without an internal HTTP loop. This is the
// slice-1 port of the shared-service pattern proven in apap-mcp-poc; slice 2
// will bring across the agreement service and slice 3 will rewire the REST
// routes to call these functions directly.

type TemplateRow = typeof Template.$inferSelect;
type TemplateInsert = typeof Template.$inferInsert;

/**
 * Replaces: makeApiRequest(`${API_BASE_URL}/templates`)
 *
 * Bounded on the primitive so callers cannot regress into unbounded reads.
 * Defaults match the ≤100 cap the existing REST `parseQueryParams` already
 * applies, so the MCP resource path stays token-budget-safe under the
 * `ttlMs` / `cacheScope` hints from #201. Slice 3 REST unification will
 * pass `limit` / `offset` through from `parseQueryParams`.
 */
export async function listTemplates(
    db: Database,
    opts: { limit?: number; offset?: number } = {},
): Promise<TemplateRow[]> {
    const limit = Math.min(100, Math.max(1, opts.limit ?? 100));
    const offset = Math.max(0, opts.offset ?? 0);
    return db.select().from(Template).limit(limit).offset(offset);
}

/** Replaces: makeApiRequest(`${API_BASE_URL}/templates/${id}`) */
export async function getTemplateById(db: Database, id: number): Promise<TemplateRow> {
    const rows = await db.select().from(Template).where(eq(Template.id, id)).limit(1);
    if (rows.length === 0) throw new TemplateNotFoundError(String(id));
    return rows[0];
}

// Lookup by URI. The RI uses URIs as external identifiers while MCP tools pass
// numeric ids. Supporting both avoids a class of "which id format?" bugs once
// slice 3 unifies the REST routes.
export async function getTemplateByUri(db: Database, uri: string): Promise<TemplateRow> {
    const rows = await db.select().from(Template).where(eq(Template.uri, uri)).limit(1);
    if (rows.length === 0) throw new TemplateNotFoundError(uri);
    return rows[0];
}

// Insert a new template. Catches PG unique constraint violations (23505) and
// surfaces them as TemplateDuplicateError so the caller can map to a clean 409.
export async function createTemplate(
    db: Database,
    data: TemplateInsert,
): Promise<TemplateRow> {
    try {
        const rows = await db.insert(Template).values(data).returning();
        return rows[0];
    } catch (err: unknown) {
        if (isUniqueViolation(err)) throw new TemplateDuplicateError(data.uri);
        throw err;
    }
}

export async function updateTemplate(
    db: Database,
    uri: string,
    data: Partial<TemplateInsert>,
): Promise<TemplateRow> {
    const rows = await db.update(Template).set(data).where(eq(Template.uri, uri)).returning();
    if (rows.length === 0) throw new TemplateNotFoundError(uri);
    return rows[0];
}

export async function deleteTemplate(db: Database, uri: string): Promise<void> {
    const rows = await db.delete(Template).where(eq(Template.uri, uri)).returning();
    if (rows.length === 0) throw new TemplateNotFoundError(uri);
}

function isUniqueViolation(err: unknown): boolean {
    return typeof err === 'object' && err !== null && 'code' in err
        && (err as { code: string }).code === '23505';
}

/**
 * Deep-equality check used only to tell "no-op resend of the same value"
 * apart from an actual attempted change, independent of key order. Mirrors
 * agreementService.ts's deepEqual — duplicated rather than shared, since
 * it's a small generic utility and importing it would couple the two
 * services over something that isn't agreement- or template-specific.
 */
function deepEqual(a: unknown, b: unknown): boolean {
    if (a === b) return true;
    if (typeof a !== 'object' || typeof b !== 'object' || a === null || b === null) {
        return false;
    }
    if (Array.isArray(a) || Array.isArray(b)) {
        if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) return false;
        return a.every((item, i) => deepEqual(item, b[i]));
    }
    const aKeys = Object.keys(a as Record<string, unknown>);
    const bKeys = Object.keys(b as Record<string, unknown>);
    if (aKeys.length !== bKeys.length) return false;
    return aKeys.every((key) =>
        Object.prototype.hasOwnProperty.call(b, key) &&
        deepEqual((a as Record<string, unknown>)[key], (b as Record<string, unknown>)[key]),
    );
}

/**
 * Guard for the generic CRUD PUT route (see crud.ts's `guardUpdate` hook).
 * Templates have no first-class versioning: `version` is a free-text field
 * with no relational meaning, and there is no endpoint to list or resolve
 * versions of "the same" template (see the LCP atrHash PR discussion). The
 * hash-cache pattern in agreements.ts's template-fetch flow already assumes
 * a template's content is fixed once created — content-addressed by `hash`
 * for auto-fetched templates, cited by `uri` for directly-posted ones — so
 * rather than track which fields are "safe" to edit, a template's content is
 * unconditionally frozen: a new version is a new template (a new row), never
 * an edit in place. A resend of the current, unchanged value is still a
 * no-op, not a violation — same courtesy assertAgreementRecordMutable gives.
 */
export function assertTemplateContentImmutable(existing: TemplateRow, updates: Record<string, unknown>): void {
    for (const key of Object.keys(updates)) {
        if (deepEqual((existing as Record<string, unknown>)[key], updates[key])) continue;
        throw new TemplateImmutableError(existing.id);
    }
}

/**
 * Guard for the generic CRUD DELETE route (see crud.ts's `guardDelete`
 * hook). Deleting a template an agreement still resolves against would
 * orphan that agreement's template lookup (resolveAgreementRuntime in
 * agreementService.ts throws a bare Error, not a typed one, if it can't find
 * the row). Checked two ways because an agreement's `templateHash` isn't
 * always populated — POST /agreements only sets it when the template URI
 * matched a registered retriever and got auto-fetched-and-cached; otherwise
 * the agreement resolves by `template` (uri) directly:
 *
 *   Agreement.templateHash = Template.hash   (only when Template.hash is set)
 *   OR Agreement.template = Template.uri
 *
 * Known gap, not closed here: POST /agreements strips a `resource:` prefix
 * from the submitted template URI before *fetching*, but stores the
 * caller's raw, unstripped string in `Agreement.template`. A template
 * referenced that way won't uri-match here even though it's the same
 * template logically — a pre-existing inconsistency in the URI handling,
 * not introduced by this guard.
 */
export async function assertTemplateNotInUse(existing: TemplateRow, db: Database): Promise<void> {
    const uriCondition = eq(Agreement.template, existing.uri);
    const whereClause = existing.hash
        ? or(uriCondition, eq(Agreement.templateHash, existing.hash))
        : uriCondition;

    const referencing = await db
        .select({ id: Agreement.id })
        .from(Agreement)
        .where(whereClause)
        .limit(1);

    if (referencing.length > 0) {
        throw new TemplateInUseError(existing.id);
    }
}
