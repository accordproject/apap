import express from 'express';
import { Agreement, AgreementInsertSchema, Template as DbTemplate } from '../db/schema';
import { buildCrudRouter } from './crud';
import { concertoValidation } from './concertovalidation';
import { templateFromDatabase, extractTemplateForDatabase } from './templatebuilder';
import { eq } from 'drizzle-orm';
import { TemplateArchiveProcessor } from '@accordproject/template-engine';
import { HttpTemplateRetriever } from './retrievers/HttpTemplateRetriever';
import { Template as CiceroTemplate } from '@accordproject/cicero-core';

async function resolveAgreement(db: any, agreementId: string) {
    console.log('Getting agreement: ' + agreementId);
    const parsedId = Number(agreementId);
    if (Number.isNaN(parsedId)) {
        throw new Error(`Invalid agreement ID format`);
    }
    const result = await db.select().from(Agreement).where(eq(Agreement.id, parsedId)).limit(1);
    if (!result.length) {
        throw new Error(`Agreement with id ${agreementId} does not exist`);
    }
    console.log('Got agreement');
    
    const agreement = result[0];
    let apTemplate;
    let templateRow = null;

    if (agreement.templateHash) {
        const cachedResult = await db.select().from(DbTemplate).where(eq(DbTemplate.hash, agreement.templateHash)).limit(1);
        if (cachedResult.length > 0) {
            templateRow = cachedResult[0];
            apTemplate = await templateFromDatabase(templateRow);
            return { agreement, template: templateRow, apTemplate };
        }
        throw new Error(`Cached template missing from database.`);
    }

    let templateUri = agreement.template;
    if (templateUri && templateUri.startsWith('resource:')) {
        templateUri = templateUri.split('#').slice(1).join('#');
    }

    const result2 = await db.select().from(DbTemplate).where(eq(DbTemplate.uri, templateUri)).limit(1);
    if (!result2.length) {
        throw new Error(`Template with uri ${templateUri} referenced by agreement ${agreementId} does not exist`);
    }
    templateRow = result2[0];
    apTemplate = await templateFromDatabase(templateRow);

    return { agreement, template: templateRow, apTemplate };
}

const router = express.Router();

router.post('/', async (req, res) => {
    try {
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

    } catch (err: any) {
        res.status(500).json({ error: "Agreement Instantiation Failed", details: err.message });
    }
});

const crudRouter = buildCrudRouter({
    table: Agreement,
    typeName: 'Agreement',
    validateBody: { schema: AgreementInsertSchema, custom: (body) => concertoValidation('Agreement', body) }
});

crudRouter.get('/:id/convert/:format', async function (req, res) {
    try {
        const {agreement, apTemplate} = await resolveAgreement(res.locals.db, req.params.id);
        const templateArchiveProcessor = new TemplateArchiveProcessor(apTemplate);
        const draftResult = await templateArchiveProcessor.draft(agreement.data, req.params.format, {});
        console.log(draftResult);
        res.setHeader("Content-Type", `text/${req.params.format}`);
        res.send(draftResult);
    } catch (error) {
        console.log(error);
        const message = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({ error: message });
    }
});

crudRouter.post('/:id/trigger', async function (req, res) {
    try {
        const {agreement, apTemplate} = await resolveAgreement(res.locals.db, req.params.id);
        const templateArchiveProcessor = new TemplateArchiveProcessor(apTemplate);
        try {
            console.log(JSON.stringify(req.body));
            console.log(JSON.stringify(agreement.data));
            console.log(JSON.stringify(agreement.state));

            const requestSchema = apTemplate.getRequestTypes().find((rt: any) => rt === req.body.$class);
            if (!requestSchema) {
                throw new Error(`Invalid request type: ${req.body.$class}. Expected one of: ${apTemplate.getRequestTypes().join(', ')}`);
            }
            
            const { success, error } = await concertoValidation(req.body.$class, req.body, apTemplate.getModelManager());

            if (!success) {
                res.json({ isError: true, errorMessage: "Trigger request validation failed", errorDetails: error.errors[0].message });
                return;
            }

            // TODO allow state to be passed in as a parameter
            if (agreement.state == null) {
                const state = await templateArchiveProcessor.init(agreement.data);
                agreement.state = state.state;
            }
            
            const triggerResult = await templateArchiveProcessor.trigger(agreement.data, req.body, agreement.state);
            agreement.state = triggerResult.state;
            console.log(JSON.stringify(triggerResult));

            // Persist updated state.
            await res.locals.db.update(Agreement).set(agreement).where(eq(Agreement.id, Number.parseInt(agreement.id)));
            res.json(triggerResult);
        } catch (err: any) {
            console.log("\n=== TRIGGER EXECUTION ERROR ===");
            console.log(err.stack);
            console.log("===============================\n");
            
            res.json({ isError: true, errorMessage: err.message, errorDetails: err.toString() });
        }
    } catch (error) {
        console.log(error);
        const message = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({ error: message });
    }
});

router.use('/', crudRouter);
export default router;