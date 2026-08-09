import { eq, or } from 'drizzle-orm';
import AdmZip from 'adm-zip';
import { Template as ApTemplate } from '@accordproject/cicero-core';
import { Agreement, Template } from '../db/schema';
import type { Database } from '../db/client';
import { extractTemplateForDatabase } from '../handlers/templatebuilder';
import {
    TemplateNotFoundError,
    TemplateDuplicateError,
    TemplateImmutableError,
    TemplateInUseError,
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

// express.raw's upload limit only caps compressed bytes on the wire; a small
// zip can still declare a huge uncompressed size in its central directory
// and OOM the process when cicero-core inflates it. Reject anything whose
// declared (not yet inflated) total uncompressed size exceeds this ceiling
// before cicero-core ever decompresses a byte.
const MAX_ARCHIVE_UNCOMPRESSED_BYTES = 50 * 1024 * 1024;

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
    let entries;
    try {
        entries = new AdmZip(archive).getEntries();
    } catch (err: any) {
        throw new InvalidPayloadError('Uploaded file is not a valid .cta template archive', {
            reason: err?.message ?? 'Unknown error',
        });
    }

    const totalUncompressed = entries.reduce((sum, entry) => sum + entry.header.size, 0);
    if (totalUncompressed > MAX_ARCHIVE_UNCOMPRESSED_BYTES) {
        throw new InvalidPayloadError('Archive exceeds the maximum allowed uncompressed size', {
            totalUncompressed,
            maxAllowed: MAX_ARCHIVE_UNCOMPRESSED_BYTES,
        });
    }

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
    try {
        return await createTemplate(db, data);
    } catch (err) {
        // Select-then-insert race: a concurrent upload of the same archive
        // may have inserted between our dedupe check above and this insert,
        // tripping the unique constraint. Treat that as the same "already
        // exists, hand back the existing row" outcome instead of letting a
        // 409 leak out for what the caller sees as a successful re-upload.
        if (err instanceof TemplateDuplicateError) {
            const rows = await db.select().from(Template).where(eq(Template.hash, hash)).limit(1);
            if (rows.length > 0) return rows[0];
        }
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
