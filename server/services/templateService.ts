import { eq } from 'drizzle-orm';
import { Template as ApTemplate } from '@accordproject/cicero-core';
import { Template } from '../db/schema';
import type { Database } from '../db/client';
import { extractTemplateForDatabase } from '../handlers/templatebuilder';
import {
    TemplateNotFoundError,
    TemplateDuplicateError,
    TemplateCiceroVersionMismatchError,
    InvalidPayloadError,
} from './errors';

// The exact cicero-core version this server parses/executes `.cta` archives
// with (server/package.json's direct dependency, not a nested copy pulled in
// by @accordproject/template-engine).
const SERVER_CICERO_VERSION: string = require('@accordproject/cicero-core/package.json').version;

// cicero-core's own Template.fromArchive already enforces that an archive's
// declared `accordproject.cicero` semver range is satisfied by the installed
// cicero-core version (and that a range is declared at all) — see
// node_modules/@accordproject/cicero-core's TemplateMetadata constructor.
// It has no typed error for this, only a bare Error whose message always
// mentions "Cicero version" for both failure modes, so that's what we match
// on to route to a typed, machine-readable error instead of a generic 400.
const CICERO_VERSION_ERROR_RX = /cicero version/i;
const CICERO_VERSION_RANGE_RX = /targets Cicero(?: version)? \(?([^\s)]+)\)?/i;

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

/**
 * Creates a Template from raw `.cta` archive bytes (as opposed to the
 * already-exploded JSON shape `createTemplate` expects). Parses the archive
 * with cicero-core, rejects it if its declared Cicero compatibility range
 * doesn't cover this server's pinned cicero-core version, and dedupes on
 * content hash the same way the `POST /agreements` external-template fetch
 * already does.
 */
export async function createTemplateFromArchive(
    db: Database,
    archive: Buffer,
): Promise<TemplateRow> {
    let apTemplate: ApTemplate;
    try {
        apTemplate = await ApTemplate.fromArchive(archive);
    } catch (err: any) {
        const message: string = err?.message ?? 'Unknown error';
        if (CICERO_VERSION_ERROR_RX.test(message)) {
            const declaredRange = message.match(CICERO_VERSION_RANGE_RX)?.[1];
            throw new TemplateCiceroVersionMismatchError(declaredRange, SERVER_CICERO_VERSION, message);
        }
        throw new InvalidPayloadError('Uploaded file is not a valid .cta template archive', {
            reason: message,
        });
    }

    const packageJson: Record<string, any> = apTemplate.getMetadata().getPackageJson();
    const hash = apTemplate.getHash();
    const existing = await db.select().from(Template).where(eq(Template.hash, hash)).limit(1);
    if (existing.length > 0) {
        return existing[0];
    }

    const uri = `archive:${packageJson.name}@${packageJson.version}`;
    const data = extractTemplateForDatabase(apTemplate, uri, hash) as TemplateInsert;
    return createTemplate(db, data);
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
