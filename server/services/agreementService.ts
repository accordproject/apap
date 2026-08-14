import { eq, asc, SQL, SQLWrapper, count } from 'drizzle-orm';
import { Agreement, AgreementStatusType, Template } from '../db/schema';
import type { Database } from '../db/client';
import {
    AgreementCreationError,
    AgreementDuplicateError,
    AgreementNotFoundError,
    AgreementConversionError,
    AgreementTriggerError,
    InvalidPayloadError,
    ValidationError,
} from './errors';
import { ServiceError } from './errors';
import { TemplateArchiveProcessor } from '@accordproject/template-engine';
import { extractTemplateForDatabase, templateFromDatabase } from '../handlers/templatebuilder';
import { concertoValidation } from '../handlers/concertovalidation';
import { Template as CiceroTemplate } from '@accordproject/cicero-core';
import { HttpTemplateRetriever } from '../handlers/retrievers/HttpTemplateRetriever';
import type { ITemplateRetriever } from '../handlers/retrievers/ITemplateRetriever';
import { z } from 'zod';

// Slice 2 ported the CRUD lookup half. Slice 2b + 2c add the runtime half —
// convertAgreement + triggerAgreement — which wrap the real
// @accordproject/template-engine `TemplateArchiveProcessor`. The REST route
// used to inline this logic; now both REST and MCP call the same functions.
//
// templatebuilder + concertovalidation are technically under `handlers/` in
// the current tree but they are transport-agnostic utilities (no Express or
// MCP SDK imports), so importing them from a service does not violate the
// "services stay transport-agnostic" invariant. Moving them under a proper
// utility directory is a follow-up refactor.

export type AgreementRow = typeof Agreement.$inferSelect;

export const PROTOCOL_NAMESPACE = 'org.accordproject.protocol@1.0.0';
export const AGREEMENT_TEMPLATE_RESOURCE_PREFIX = `resource:${PROTOCOL_NAMESPACE}.Template#`;

const objectValue = z.record(z.string(), z.unknown());

type JsonObjectParseResult =
    | { kind: 'object'; value: Record<string, unknown> }
    | { kind: 'non-object' }
    | { kind: 'invalid' };

function parseJsonObject(value: string): JsonObjectParseResult {
    let parsed: unknown;
    try {
        parsed = JSON.parse(value);
    } catch {
        return { kind: 'invalid' };
    }
    if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
        return { kind: 'non-object' };
    }
    // Match z.record's direct-object branch, which clones the record and drops
    // the special __proto__ key rather than preserving it as data.
    return {
        kind: 'object',
        value: Object.fromEntries(Object.entries(parsed).filter(([key]) => key !== '__proto__')),
    };
}

/** `JSON` is `scalar JSON extends String` in model/protocol.cto, so the
 * generated OpenAPI schema publishes `data` as a string. Accept both the
 * published form and the object form the runtime readers consume, normalizing
 * strings before validation and persistence. Non-object JSON stays invalid
 * because the agreement processors consume `data` as an object. */
const agreementData = z.union(
    [objectValue, z.string()],
    { error: 'data must be an object or a JSON string encoding an object' },
)
    .describe('Concerto agreement data as an object or a JSON string encoding that object')
    .transform((value, ctx) => {
        if (typeof value !== 'string') return value;
        const parsed = parseJsonObject(value);
        if (parsed.kind === 'invalid') {
            ctx.addIssue({ code: 'custom', message: 'data string must be valid JSON' });
            return z.NEVER;
        }
        if (parsed.kind === 'non-object') {
            ctx.addIssue({ code: 'custom', message: 'data string must encode a JSON object' });
            return z.NEVER;
        }
        return parsed.value;
    });

/** Preserve state's historically permissive input surface, but normalize the
 * spec-shaped case that readers require: a string encoding a JSON object.
 * Non-object and invalid strings deliberately continue through unchanged. That
 * preserves compatibility, including silent acceptance of malformed strings,
 * while fixing the spec-shaped object string that readers actually consume. */
const agreementState = z.unknown()
    .describe('Agreement state; object-encoding JSON strings are normalized to objects')
    .transform(value => {
        if (typeof value !== 'string') return value;
        const parsed = parseJsonObject(value);
        return parsed.kind === 'object' ? parsed.value : value;
    });

export const AgreementCreateSchema = z.object({
    $class: z.string().optional(),
    uri: z.string().min(1),
    data: agreementData,
    template: z.string().min(1),
    state: agreementState.optional(),
    // Derived from the generated pgEnum rather than restated. db/schema.ts is
    // generated from model/protocol.cto, so a status added or renamed in the
    // model reaches this schema by regeneration instead of by someone
    // remembering to edit a second list. (#240 renames SIGNNG -> SIGNING.)
    agreementStatus: z.enum(AgreementStatusType.enumValues),
    agreementParties: z.array(z.unknown()).optional(),
    signatures: z.array(z.unknown()).optional(),
    historyEntries: z.array(z.unknown()).optional(),
    attachments: z.array(z.unknown()).optional(),
    references: z.array(z.string()).optional(),
    metadata: objectValue.optional(),
}).strict();

export type AgreementCreateInput = z.input<typeof AgreementCreateSchema>;

/**
 * Both template forms are accepted:
 *
 *   - a plain absolute http(s) URL, promoted to the canonical relationship form
 *     so it survives Concerto validation (a bare URL is rejected there with
 *     "Invalid URI scheme");
 *   - a value already in canonical `resource:<ns>.Template#<id>` form, passed
 *     through untouched.
 *
 * Anything else is handed to Concerto unchanged rather than pre-rejected here.
 * That is deliberate. The retriever list is extensible — `ITemplateRetriever`
 * matches on URI scheme — so a canonical relationship pointing at a non-http
 * template id stays valid and simply resolves no retriever, exactly as it did
 * before creation moved into this service. Narrowing to http(s) would reject
 * agreements referencing an already-stored template.
 */
function normalizeTemplate(template: string): string {
    if (template.startsWith('resource:')) return template;
    if (/^https?:\/\/[^\s]+$/.test(template)) return `${AGREEMENT_TEMPLATE_RESOURCE_PREFIX}${template}`;
    return template;
}

/** Mirrors the pre-refactor strip in `agreements.ts`: everything after the first
 *  `#`. Equivalent to slicing the known prefix length — Concerto pins the
 *  namespace, so no other prefix reaches here — but it keeps the recovery
 *  independent of the constant it is paired with. */
function templateIdFromRelationship(template: string): string {
    return template.startsWith('resource:') ? template.split('#').slice(1).join('#') : template;
}

export async function createAgreement(
    db: Database,
    input: AgreementCreateInput,
    options: { organization?: unknown; templateRetrievers?: ITemplateRetriever[] } = {},
): Promise<AgreementRow> {
    const parsed = AgreementCreateSchema.safeParse(input);
    if (!parsed.success) {
        throw new InvalidPayloadError('Schema validation failed', { issues: parsed.error.issues });
    }

    const normalized = { ...parsed.data, template: normalizeTemplate(parsed.data.template) };
    let validation;
    try {
        // Validate a throwaway copy. `concertoValidation` mutates the object it is
        // given — it JSON.stringify()s `data` and `state` in place, see the "HACK"
        // block in handlers/concertovalidation.ts — and the inlined REST route used
        // to persist that mutated body, so `Agreement.data` was written as a JSON
        // *string* while every reader treats it as an object (`processor.draft(
        // agreement.data, ...)` in convertAgreement/triggerAgreement below). Passing
        // a copy keeps validation semantics identical and lets the row carry the
        // object form the rest of the service already expects.
        validation = await concertoValidation('Agreement', structuredClone(normalized));
    } catch (err) {
        const reason = err instanceof Error ? err.message : String(err);
        throw new AgreementCreationError(reason, { uri: normalized.uri });
    }
    const { success, error } = validation;
    if (!success) {
        throw new ValidationError('Invalid request body', { errors: error?.errors ?? [] });
    }

    const templateUri = templateIdFromRelationship(normalized.template);
    let currentHash: string | null = null;

    // Template resolution and caching. A unique violation raised in here is a
    // *template* conflict — `onConflictDoNothing` targets `Template.hash`, so it
    // does not suppress the separate `Template.uri` constraint, which trips when a
    // re-published archive keeps its URI but changes its hash. Reporting that as a
    // duplicate agreement URI would name the wrong row entirely, so this block
    // never maps 23505.
    try {
        const retrievers = options.templateRetrievers ?? [new HttpTemplateRetriever()];
        const retriever = retrievers.find(candidate =>
            candidate.getURISchemes().some(scheme => templateUri.startsWith(`${scheme}:`)));
        if (retriever) {
            const archive = await retriever.fetch(templateUri);
            const apTemplate = await CiceroTemplate.fromArchive(archive);
            currentHash = apTemplate.getHash();
            const existing = await db.select().from(Template).where(eq(Template.hash, currentHash)).limit(1);
            if (existing.length === 0) {
                await db.insert(Template)
                    .values(extractTemplateForDatabase(apTemplate, templateUri, currentHash))
                    .onConflictDoNothing({ target: Template.hash });
            }
        }
    } catch (err) {
        if (err instanceof ServiceError) throw err;
        const reason = err instanceof Error ? err.message : String(err);
        throw new AgreementCreationError(reason, { uri: normalized.uri, template: templateUri });
    }

    // Agreement insert. `Agreement.uri` is the only unique constraint reachable
    // here, so 23505 does mean a duplicate agreement URI.
    try {
        const insertData: Record<string, unknown> = { ...normalized, templateHash: currentHash };
        if (options.organization !== undefined) insertData.organization = options.organization;
        const inserted = await db.insert(Agreement).values(insertData as any).returning();
        return inserted[0];
    } catch (err) {
        if (err instanceof ServiceError) throw err;
        if (typeof err === 'object' && err !== null && 'code' in err && (err as any).code === '23505') {
            throw new AgreementDuplicateError(normalized.uri);
        }
        const reason = err instanceof Error ? err.message : String(err);
        throw new AgreementCreationError(reason, { uri: normalized.uri });
    }
}

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
    // Stable pagination: without an explicit order, Postgres is free to return
    // rows in any order between the (limit=50, offset=0) and (limit=50,
    // offset=50) requests the paged `apap://agreements{?limit,offset}` MCP
    // resource issues, which can duplicate or skip rows. Mirrors the
    // asc(Agreement.id) default #225 landed for `listAgreementsPaged` so REST
    // and MCP page over the same stable order.
    return db.select().from(Agreement).orderBy(asc(Agreement.id)).limit(limit).offset(offset);
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

// Private helper. Both convertAgreement and triggerAgreement need the same
// (agreement, template, apTemplate) triple. Mirrors the resolveAgreement
// helper that used to live in handlers/agreements.ts.
//
// Template-resolution failures are surfaced as plain Errors (not typed
// ServiceErrors) so globalErrorHandler renders them as a plain 500 body
// `{ error: message }`. Preserves the wire shape existing REST clients
// depend on, inherited from the inline resolveAgreement helper. Applies to
// both convert and trigger REST routes so the two paths stay consistent.
async function resolveAgreementRuntime(db: Database, agreementId: number) {
    const agreementRows = await db
        .select()
        .from(Agreement)
        .where(eq(Agreement.id, agreementId))
        .limit(1);
    if (agreementRows.length === 0) {
        throw new AgreementNotFoundError(String(agreementId));
    }
    const agreement = agreementRows[0];

    // Template-resolution failures are surfaced as plain Errors (not typed
    // ServiceErrors) so globalErrorHandler renders them as a plain 500 body
    // `{ error: message }`. Preserves the wire shape existing clients depend
    // on, which was inherited from the inline `resolveAgreement` helper in
    // handlers/agreements.ts before slice 2b/2c.
    let templateRow;
    if (agreement.templateHash) {
        const cached = await db
            .select()
            .from(Template)
            .where(eq(Template.hash, agreement.templateHash))
            .limit(1);
        if (cached.length === 0) {
            throw new Error(`Cached template missing from database.`);
        }
        templateRow = cached[0];
    } else {
        let templateUri = agreement.template;
        if (templateUri && templateUri.startsWith('resource:')) {
            templateUri = templateUri.split('#').slice(1).join('#');
        }
        const found = await db
            .select()
            .from(Template)
            .where(eq(Template.uri, templateUri))
            .limit(1);
        if (found.length === 0) {
            throw new Error(`Template with uri ${templateUri} referenced by agreement ${agreementId} does not exist`);
        }
        templateRow = found[0];
    }

    const apTemplate = await templateFromDatabase(templateRow);
    return { agreement, template: templateRow, apTemplate };
}

/** Replaces: makeApiRequest(`${API_BASE_URL}/agreements/${id}/convert/${format}`) */
export async function convertAgreement(
    db: Database,
    agreementId: number,
    format: string,
): Promise<string> {
    const { agreement, apTemplate } = await resolveAgreementRuntime(db, agreementId);
    const processor = new TemplateArchiveProcessor(apTemplate);
    try {
        return await processor.draft(agreement.data, format, {});
    } catch (err) {
        const reason = err instanceof Error ? err.message : String(err);
        throw new AgreementConversionError(agreementId, format, reason);
    }
}

/** Replaces: makeApiRequest(`${API_BASE_URL}/agreements/${id}/trigger`, POST) */
export async function triggerAgreement(
    db: Database,
    agreementId: number,
    requestBody: any,
): Promise<any> {
    const { agreement, apTemplate } = await resolveAgreementRuntime(db, agreementId);
    const processor = new TemplateArchiveProcessor(apTemplate);

    if (!requestBody || typeof requestBody !== 'object' || !requestBody.$class) {
        throw new InvalidPayloadError('Request payload must include a $class discriminator', {
            agreementId,
        });
    }

    const requestTypes = apTemplate.getRequestTypes();
    const matched = requestTypes.find((rt: any) => rt === requestBody.$class);
    if (!matched) {
        throw new InvalidPayloadError(
            `Invalid request type: ${requestBody.$class}. Expected one of: ${requestTypes.join(', ')}`,
            { agreementId, expectedTypes: requestTypes },
        );
    }

    const { success, error } = await concertoValidation(
        requestBody.$class,
        requestBody,
        apTemplate.getModelManager(),
    );
    if (!success) {
        throw new ValidationError('Trigger request validation failed', {
            agreementId,
            errors: error?.errors ?? [],
        });
    }

    // Initialize state if the agreement has never been triggered, then run the
    // trigger. Both operations are wrapped in the same catch so any runtime
    // failure surfaces as AgreementTriggerError, which the REST handler maps
    // back to the legacy `{ isError: true }` shape for backward compatibility.
    //
    // Concurrency note: two triggers arriving on the same never-initialised
    // agreement both see `agreement.state == null`, so both will run
    // `processor.init` and then their own `processor.trigger`, and the
    // targeted `.set({ state })` at the bottom of this function is last-
    // write-wins. Inherited from the inline REST behaviour pre-slice-2c and
    // not made worse here; the correct fix is a row-level lock or optimistic
    // update at the DB layer and belongs in a separate follow-up. Rare in
    // practice because a single client rarely fires concurrent triggers on
    // the same agreement.
    //
    // TODO (existing, not slice 2b): allow state to be passed in as a parameter.
    let triggerResult;
    try {
        let currentState = agreement.state;
        if (currentState == null) {
            const initResult = await processor.init(agreement.data);
            currentState = initResult.state;
        }
        triggerResult = await processor.trigger(agreement.data, requestBody, currentState);
    } catch (err) {
        const reason = err instanceof Error ? err.message : String(err);
        throw new AgreementTriggerError(String(agreementId), reason);
    }

    // Targeted single-column write: only `state` changes on a trigger. Writing
    // the whole spread `{ ...agreement, state: triggerResult.state }` back was
    // (a) unnecessary write surface for every other column and (b) a
    // concurrent-clobber risk — any column that changed between the read and
    // this write would get overwritten with the stale in-memory value. Per
    // @niallroche's review on #216.
    await db
        .update(Agreement)
        .set({ state: triggerResult.state })
        .where(eq(Agreement.id, agreementId));

    return triggerResult;
}

/**
 * Paginated variant of `listAgreements` for slice-3 REST unification.
 * Symmetric with `listTemplatesPaged`; see that function's doc for
 * read-skew and pagination-determinism notes.
 */
export async function listAgreementsPaged(
    db: Database,
    opts: {
        whereClause?: SQL;
        orderClause?: SQLWrapper | null;
        limit: number;
        offset: number;
    },
): Promise<{ items: AgreementRow[]; total: number }> {
    const limit = Math.min(100, Math.max(1, opts.limit));
    const offset = Math.max(0, opts.offset);

    const [{ count: totalRow }] = await db
        .select({ count: count() })
        .from(Agreement)
        .where(opts.whereClause);

    const orderClause: SQLWrapper = opts.orderClause ?? asc(Agreement.id);
    const items = await db
        .select()
        .from(Agreement)
        .where(opts.whereClause)
        .orderBy(orderClause as SQL<unknown>)
        .limit(limit)
        .offset(offset);

    return { items, total: totalRow };
}
