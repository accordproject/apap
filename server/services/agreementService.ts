import { eq } from 'drizzle-orm';
import { Agreement, Template } from '../db/schema';
import type { Database } from '../db/client';
import {
    AgreementNotFoundError,
    AgreementConversionError,
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

    await db
        .update(Agreement)
        .set({ ...agreement, state: triggerResult.state })
        .where(eq(Agreement.id, agreementId));

    return triggerResult;
}
