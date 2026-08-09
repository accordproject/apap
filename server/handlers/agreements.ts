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
import { assertAgreementRecordMutable, convertAgreement, triggerAgreement } from '../services/agreementService';
import { buildAgreementLegalContext, getAgreementTerms, resolvePublicBaseUrl } from '../services/lcpService';
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
        
        // ponytail: cast schema to any due to zod v3 -> v4 upgrade depth-instantiation
        // issue with drizzle-zod. Runtime unaffected.
        const zodValidation = (AgreementInsertSchema as any).safeParse(req.body);
        if (!zodValidation.success) {
            return res.status(400).json({ error: 'Schema validation failed', details: zodValidation.error.issues });
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
    // ponytail: cast schema to any due to zod v3 -> v4 upgrade depth-instantiation
    // issue with drizzle-zod. Runtime unaffected.
    validateBody: { schema: AgreementInsertSchema as any, custom: (body) => concertoValidation('Agreement', body) },
    guardUpdate: (existing, body) => assertAgreementRecordMutable(existing, body)
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

/**
 * @param req The Express request containing the agreement id.
 * @param res The Express response used to return the agreement's LCP terms artifact.
 * @return Resolves after the terms document or a not-found error has been written.
 * @details Serves the Legal Context Protocol terms document for an agreement — a
 * deterministic Markdown rendering via the same `convertAgreement` path as
 * `/:id/convert/:format`. The ETag is the SHA-256 digest of exactly the bytes
 * returned, so a client can verify what it fetched without re-hashing separately.
 */
crudRouter.get('/:id/terms', asyncHandler(async function (req, res) {
    const id = /^\d+$/.test(req.params.id) ? Number(req.params.id) : NaN;
    if (!Number.isFinite(id)) {
        throw new AgreementNotFoundError(req.params.id);
    }
    const terms = await getAgreementTerms(res.locals.db, id);
    res.setHeader('Content-Type', terms.contentType);
    res.setHeader('ETag', `"${terms.atrHash}"`);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.send(terms.body);
}));

/**
 * @param req The Express request containing the agreement id.
 * @param res The Express response used to return the agreement's LCP legal-context document.
 * @return Resolves after the `LegalContext` JSON document or a not-found error has been written.
 * @details Serves the resource-scoped Legal Context Protocol (legalcontextprotocol.org
 * v1.0) discovery document for one agreement. This is the primary LCP surface for
 * APAP: a multi-tenant host cannot publish a single spec-compliant
 * `/.well-known/legal-context.json` per agreement (RFC 8615 scopes well-known URIs
 * to the origin), so per-agreement documents live at this ordinary resource path
 * instead, discoverable via the `Link: rel="legal-context"` header set on `GET /:id`.
 */
crudRouter.get('/:id/legal-context', asyncHandler(async function (req, res) {
    const id = /^\d+$/.test(req.params.id) ? Number(req.params.id) : NaN;
    if (!Number.isFinite(id)) {
        throw new AgreementNotFoundError(req.params.id);
    }
    const baseUrl = resolvePublicBaseUrl({ requestProtocol: req.protocol, requestHost: req.get('host') });
    const legalContext = await buildAgreementLegalContext(res.locals.db, id, baseUrl);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.json(legalContext);
}));

// Advertises per-agreement LCP discovery via Link headers on the CRUD GET /:id
// route, which is defined generically inside crud.ts's buildCrudRouter and so
// can't have a header added there without threading LCP concerns into a
// resource-agnostic router. Registered before `router.use('/', crudRouter)` so
// it runs first; it only decorates GET requests for a bare numeric id (never
// /:id/terms, /:id/legal-context, /:id/convert/:format, etc.) and only when
// the crud handler ends up resolving the id (status 200) — the res.json
// override lets it see the status crud.ts already set before deciding whether
// to add the header, so a 404 for an unknown agreement doesn't get a Link
// header pointing at documents that don't exist either.
router.use((req, res, next) => {
    if (req.method === 'GET' && /^\/\d+$/.test(req.path)) {
        const id = req.path.slice(1);
        const originalJson = res.json.bind(res);
        res.json = ((body: unknown) => {
            if (res.statusCode === 200) {
                res.setHeader('Link', [
                    `</agreements/${id}/legal-context>; rel="legal-context"`,
                    `</agreements/${id}/terms>; rel="terms-of-service"`,
                ].join(', '));
            }
            return originalJson(body);
        }) as typeof res.json;
    }
    next();
});

router.use('/', crudRouter);
export default router;
