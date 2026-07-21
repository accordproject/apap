import express from 'express';
import { Agreement, AgreementInsertSchema, Template as DbTemplate } from '../db/schema';
import { buildCrudRouter } from './crud';
import { concertoValidation } from './concertovalidation';
import { extractTemplateForDatabase } from './templatebuilder';
import { eq } from 'drizzle-orm';
import { HttpTemplateRetriever } from './retrievers/HttpTemplateRetriever';
import { Template as CiceroTemplate } from '@accordproject/cicero-core';
import {
    AgreementNotFoundError,
    AgreementTriggerError,
    InvalidPayloadError,
    ValidationError,
} from '../services/errors';
import { convertAgreement, triggerAgreement } from '../services/agreementService';
import { asyncHandler } from '../middleware/errorHandler';

const router = express.Router();

/**
 * @param req The Express request containing the agreement payload to create.
 * @param res The Express response used to return the created agreement or an error.
 * @return Resolves after the agreement creation response has been written.
 * @details Validates the incoming agreement body with Zod and Concerto, optionally
 * resolves and caches a remote template archive when the template URI matches a supported
 * retriever, and finally inserts the agreement into the database.
 */
router.post('/', asyncHandler(async (req, res) => {
        const db = res.locals.db;
        
        const zodValidation = AgreementInsertSchema.safeParse(req.body);
        if (!zodValidation.success) {
            return res.status(400).json({ error: 'Schema validation failed', details: zodValidation.error.errors });
        }

        const { success, error } = await concertoValidation('Agreement', req.body);
        if (!success) {
            return res.status(400).json({ error: 'Invalid request body', details: error.errors });
        }

        let templateUri = req.body.template;
        if (templateUri && templateUri.startsWith('resource:')) {
            templateUri = templateUri.split('#').slice(1).join('#');
        }

        let currentHash = null;

        const availableRetrievers = [
            new HttpTemplateRetriever()
        ];

        if (templateUri) {
            const matchingRetriever = availableRetrievers.find(r => 
                r.getURISchemes().some(scheme => templateUri.startsWith(`${scheme}:`))
            );

            if (matchingRetriever) {
                const buffer = await matchingRetriever.fetch(templateUri);
                
                const apTemplate = await CiceroTemplate.fromArchive(buffer);
                currentHash = apTemplate.getHash();

                const existing = await db.select().from(DbTemplate).where(eq(DbTemplate.hash, currentHash)).limit(1);
                
                if (existing.length === 0) {
                    const newDbTemplateRow = extractTemplateForDatabase(apTemplate, templateUri, currentHash);
                    await db.insert(DbTemplate)
                        .values(newDbTemplateRow)
                        .onConflictDoNothing({ target: DbTemplate.hash });
                }
            }
        }

        const insertData = {
            ...req.body,
            templateHash: currentHash,
            organization: res.locals.orgId !== undefined ? res.locals.orgId : req.body.organization
        };

        const inserted = await db.insert(Agreement).values(insertData).returning();
        res.json(inserted[0]);
}));

const crudRouter = buildCrudRouter({
    table: Agreement,
    typeName: 'Agreement',
    validateBody: { schema: AgreementInsertSchema, custom: (body) => concertoValidation('Agreement', body) }
});

/**
 * @param req The Express request containing the agreement id and output format.
 * @param res The Express response used to return the converted agreement draft.
 * @return Resolves after the converted agreement text or an error response has been written.
 * @details Resolves the agreement and its template, creates a `TemplateArchiveProcessor`,
 * and delegates the conversion to the template engine's draft support for the requested format.
 */
crudRouter.get('/:id/convert/:format', asyncHandler(async function (req, res) {
    const id = /^\d+$/.test(req.params.id) ? Number(req.params.id) : NaN;
    if (!Number.isFinite(id)) {
        throw new AgreementNotFoundError(req.params.id);
    }
    const draftResult = await convertAgreement(res.locals.db, id, req.params.format);
    res.setHeader("Content-Type", `text/${req.params.format}`);
    res.send(draftResult);
}));

/**
 * @param req The Express request containing the agreement id and trigger payload.
 * @param res The Express response used to return the trigger result or validation errors.
 * @return Resolves after the trigger response has been written.
 * @details Validates the incoming trigger request against the template request types,
 * initializes agreement state when needed, executes the agreement logic through the
 * template archive processor, and persists the updated agreement state back to the database.
 */
crudRouter.post('/:id/trigger', asyncHandler(async function (req, res) {
    const id = /^\d+$/.test(req.params.id) ? Number(req.params.id) : NaN;
    if (!Number.isFinite(id)) {
        throw new AgreementNotFoundError(req.params.id);
    }
    try {
        const triggerResult = await triggerAgreement(res.locals.db, id, req.body);
        res.json(triggerResult);
    } catch (err: any) {
        // Preserve the legacy `{ isError: true }` at HTTP 200 for the error
        // families that used to be caught inline: payload validation (both
        // `$class` mismatch and Concerto errors) and execution failures. Not-
        // found + template-resolution errors bubble to globalErrorHandler.
        //
        // The specific `errorMessage`/`errorDetails` shape here matches what
        // the inline REST handler produced pre-slice-2c so existing clients
        // do not observe a wire change:
        // - InvalidPayloadError -> full message on both fields (was raw Error.message)
        // - ValidationError -> hardcoded top-line + first concerto error detail
        // - AgreementTriggerError -> upstream reason (unwrap the typed prefix)
        if (err instanceof InvalidPayloadError) {
            res.json({ isError: true, errorMessage: err.message, errorDetails: err.message });
            return;
        }
        if (err instanceof ValidationError) {
            const firstError = (err.details as any)?.errors?.[0]?.message ?? err.message;
            res.json({
                isError: true,
                errorMessage: 'Trigger request validation failed',
                errorDetails: firstError,
            });
            return;
        }
        if (err instanceof AgreementTriggerError) {
            console.error({
                type: 'operation_failed',
                operation: 'triggerAgreement',
                agreementId: req.params.id,
            });
            const upstream = (err as any).upstreamMessage ?? err.message;
            res.json({ isError: true, errorMessage: upstream, errorDetails: upstream });
            return;
        }
        throw err;
    }
}));

router.use('/', crudRouter);
export default router;
