import { eq } from 'drizzle-orm';
import { Agreement } from '../db/schema';
import type { Database } from '../db/client';
import { AgreementNotFoundError } from './errors';

// Slice 2 ports only the CRUD lookup half of the POC's agreementService. The
// POC's `convertAgreement` and `triggerAgreement` are stubs; the RI's REST
// route at `server/handlers/agreements.ts` already runs the real
// `TemplateArchiveProcessor` from @accordproject/template-engine for those
// paths. Porting those upstream deserves its own slice (2b) that wraps the
// real engine rather than replacing it with a POC stub.

type AgreementRow = typeof Agreement.$inferSelect;

/**
 * Replaces: makeApiRequest(`${API_BASE_URL}/agreements`)
 *
 * Bounded on the primitive so callers cannot regress into unbounded reads.
 * Defaults match the ≤100 cap the existing REST `parseQueryParams` already
 * applies, so the `apap://agreements` MCP resource path stays token-budget-
 * safe under the `ttlMs` / `cacheScope` hints from #201. Slice 3 REST
 * unification will pass `limit` / `offset` through from `parseQueryParams`.
 */
export async function listAgreements(
    db: Database,
    opts: { limit?: number; offset?: number } = {},
): Promise<AgreementRow[]> {
    const limit = Math.min(100, Math.max(1, opts.limit ?? 100));
    const offset = Math.max(0, opts.offset ?? 0);
    return db.select().from(Agreement).limit(limit).offset(offset);
}

/** Replaces: makeApiRequest(`${API_BASE_URL}/agreements/${id}`) */
export async function getAgreementById(db: Database, id: number): Promise<AgreementRow> {
    const rows = await db.select().from(Agreement).where(eq(Agreement.id, id)).limit(1);
    if (rows.length === 0) throw new AgreementNotFoundError(String(id));
    return rows[0];
}

/**
 * Lookup by URI. Mirrors the getTemplateByUri surface from slice 1 so callers
 * that hold a resource URI (e.g. `apap://agreements/{id}` clients or a future
 * REST resource-URI route) do not have to reconstruct the numeric id first.
 */
export async function getAgreementByUri(db: Database, uri: string): Promise<AgreementRow> {
    const rows = await db.select().from(Agreement).where(eq(Agreement.uri, uri)).limit(1);
    if (rows.length === 0) throw new AgreementNotFoundError(uri);
    return rows[0];
}
