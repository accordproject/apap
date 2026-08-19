import { eq } from 'drizzle-orm';
import { Agreement, Template } from '../db/schema';
import type { Database } from '../db/client';
import {
    AgreementNotFoundError,
    AgreementConversionError,
    AgreementRecordImmutableError,
    AgreementStatusTransitionError,
    AgreementTriggerError,
    InvalidPayloadError,
    ValidationError,
} from './errors';
import { TemplateArchiveProcessor } from '@accordproject/template-engine';
import { templateFromDatabase } from '../handlers/templatebuilder';
import { concertoValidation } from '../handlers/concertovalidation';

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

type AgreementRow = typeof Agreement.$inferSelect;

// Once signing has finished (COMPLETED) or the agreement has been
// superseded (SUPERSEDED), the agreement's record is frozen: deal terms
// (`data`), the evidence of who signed (`signatures`, `agreementParties`),
// and everything else that documents the deal (`attachments`,
// `historyEntries`, `references`, `metadata`, `template`, `uri`, ...) must
// stop changing. Mistakes are fixed by voiding and reinstantiating the
// agreement, not by editing it in place.
const FULLY_FROZEN_STATUSES: ReadonlySet<string> = new Set(['COMPLETED', 'SUPERSEDED']);

// The only fields exempt from the freeze above: `agreementStatus` itself
// still needs to move (e.g. COMPLETED -> SUPERSEDED when a later agreement
// supersedes this one), and `state` is the trigger-driven runtime state
// column — triggerAgreement (above) only ever writes that one column, so
// post-completion trigger activity keeps working.
const MUTABLE_FIELDS_ONCE_FULLY_FROZEN: ReadonlySet<string> = new Set(['agreementStatus', 'state']);

// Deal terms lock earlier than the rest of the record: as soon as any
// signatory has started signing (SIGNING), the terms they're signing
// against must not move out from under them, even though the record as a
// whole (more signatures arriving, parties, etc.) is still legitimately
// changing. `data` therefore freezes from SIGNING onward, one status ahead
// of every other field.
const DATA_FROZEN_STATUS: string = 'SIGNING';

// Every freeze above hinges on `agreementStatus` never moving backward --
// otherwise a client unlocks a frozen record in two requests: PUT
// { agreementStatus: 'DRAFT' } on a COMPLETED row (allowed on its own,
// since agreementStatus is the one field the full-record freeze leaves
// mutable), then the record is DRAFT and everything, including `data`, is
// open again. `concertoValidation` only checks shape, not the state
// machine, so this has to be enforced here. Ranks encode the one-way
// lifecycle DRAFT -> SIGNING -> COMPLETED -> SUPERSEDED; a transition may
// jump forward (e.g. DRAFT straight to COMPLETED, for a single-signatory
// agreement) but never move to a lower rank.
const STATUS_RANK: Readonly<Record<string, number>> = {
    DRAFT: 0,
    SIGNING: 1,
    COMPLETED: 2,
    SUPERSEDED: 3,
};

/**
 * Deep-equality check used only to tell "no-op resend of the same value"
 * apart from an actual attempted change, independent of key order.
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
 * Guard for the generic CRUD PUT route (see `crud.ts`'s `guardUpdate` hook).
 *
 * - Any `agreementStatus` change must move to an equal-or-higher rank
 *   (DRAFT < SIGNING < COMPLETED < SUPERSEDED) -- never a downgrade. Checked
 *   first and unconditionally, since this is what stops the freezes below
 *   from being reversible.
 * - Once COMPLETED or SUPERSEDED, rejects a request that would change any
 *   recorded field — only `agreementStatus` and `state` may still be
 *   updated.
 * - While SIGNING, rejects a request that would change `data` alone; every
 *   other field (signatures arriving, parties, etc.) stays mutable, since
 *   that's the whole point of the SIGNING status.
 *
 * A field is only rejected if the request would actually change its value;
 * resending the current value (e.g. the same `data` with different key
 * order) is a no-op, not a violation.
 */
export function assertAgreementRecordMutable(existing: AgreementRow, updates: Record<string, unknown>): void {
    const status = existing.agreementStatus;

    if (
        Object.prototype.hasOwnProperty.call(updates, 'agreementStatus') &&
        updates.agreementStatus !== status
    ) {
        const nextStatus = updates.agreementStatus as string;
        const fromRank = STATUS_RANK[status];
        const toRank = STATUS_RANK[nextStatus];
        if (fromRank === undefined || toRank === undefined || toRank < fromRank) {
            throw new AgreementStatusTransitionError(existing.id, status, nextStatus);
        }
    }

    if (FULLY_FROZEN_STATUSES.has(status)) {
        for (const key of Object.keys(updates)) {
            if (MUTABLE_FIELDS_ONCE_FULLY_FROZEN.has(key)) continue;
            if (deepEqual((existing as Record<string, unknown>)[key], updates[key])) continue;

            throw new AgreementRecordImmutableError(existing.id, status, key);
        }
        return;
    }

    if (
        status === DATA_FROZEN_STATUS &&
        Object.prototype.hasOwnProperty.call(updates, 'data') &&
        !deepEqual(existing.data, updates.data)
    ) {
        throw new AgreementRecordImmutableError(existing.id, status, 'data');
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
