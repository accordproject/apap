import express from 'express';
import { Agreement, AgreementInsertSchema, Template as DbTemplate } from '../db/schema';
import { buildCrudRouter } from './crud';
import { concertoValidation } from './concertovalidation';
import { templateFromDatabase, extractTemplateForDatabase } from './templatebuilder';
import { eq } from 'drizzle-orm';
import { TemplateArchiveProcessor } from '@accordproject/template-engine';
import { HttpTemplateRetriever } from './retrievers/HttpTemplateRetriever';
import { Template as CiceroTemplate } from '@accordproject/cicero-core';
import pino from 'pino';

const logger = pino();

// ---- Types ----
type DB = any; // Replace with proper Drizzle type

// ---- Utils ----
function parseId(id: string): number {
    const parsed = Number(id);
    if (isNaN(parsed)) {
        throw new Error('Invalid ID');
    }
    return parsed;
}

// ---- Services ----
async function getTemplate(db: DB, templateUri?: string, templateHash?: string) {
    if (templateHash) {
        const cached = await db.select().from(DbTemplate).where(eq(DbTemplate.hash, templateHash)).limit(1);
        if (!cached.length) throw new Error('Cached template missing');
        return cached[0];
    }

    if (!templateUri) throw new Error('Template URI missing');

    if (templateUri.startsWith('resource:')) {
        templateUri = templateUri.split('#').slice(1).join('#');
    }

    const result = await db.select().from(DbTemplate).where(eq(DbTemplate.uri, templateUri)).limit(1);
    if (!result.length) throw new Error(`Template ${templateUri} not found`);
    return result[0];
}

async function resolveAgreement(db: DB, agreementId: string) {
    const id = parseId(agreementId);

    const result = await db.select().from(Agreement).where(eq(Agreement.id, id)).limit(1);
    if (!result.length) throw new Error('Agreement not found');

    const agreement = result[0];
    const templateRow = await getTemplate(db, agreement.template, agreement.templateHash);
    const apTemplate = await templateFromDatabase(templateRow);

    return { agreement, templateRow, apTemplate };
}

// ---- Router ----
const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const db: DB = res.locals.db;

        const parsed = AgreementInsertSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ error: 'Schema validation failed', details: parsed.error.errors });
        }

        const { success, error } = await concertoValidation('Agreement', req.body);
        if (!success) {
            return res.status(400).json({ error: 'Concerto validation failed', details: error.errors });
        }

        let templateUri = req.body.template;
        let currentHash: string | null = null;

        const retriever = new HttpTemplateRetriever();

        if (templateUri) {
            if (templateUri.startsWith('resource:')) {
                templateUri = templateUri.split('#').slice(1).join('#');
            }

            const buffer = await retriever.fetch(templateUri);
            const apTemplate = await CiceroTemplate.fromArchive(buffer);
            currentHash = apTemplate.getHash();

            const existing = await db.select().from(DbTemplate).where(eq(DbTemplate.hash, currentHash)).limit(1);

            if (!existing.length) {
                const newRow = extractTemplateForDatabase(apTemplate, templateUri, currentHash);
                await db.insert(DbTemplate).values(newRow).onConflictDoNothing({ target: DbTemplate.hash });
            }
        }

        const insertData = {
            ...req.body,
            templateHash: currentHash,
            organization: res.locals.orgId ?? req.body.organization
        };

        const inserted = await db.insert(Agreement).values(insertData).returning();
        res.json(inserted[0]);

    } catch (err: any) {
        logger.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// ---- CRUD ----
const crudRouter = buildCrudRouter({
    table: Agreement,
    typeName: 'Agreement',
    validateBody: {
        schema: AgreementInsertSchema,
        custom: (body) => concertoValidation('Agreement', body)
    }
});

// ---- Convert ----
crudRouter.get('/:id/convert/:format', async (req, res) => {
    try {
        const { agreement, apTemplate } = await resolveAgreement(res.locals.db, req.params.id);
        const processor = new TemplateArchiveProcessor(apTemplate);

        const result = await processor.draft(agreement.data, req.params.format, {});
        res.setHeader('Content-Type', `text/${req.params.format}`);
        res.send(result);

    } catch (err: any) {
        logger.error(err);
        res.status(500).json({ error: err.message });
    }
});

// ---- Trigger ----
crudRouter.post('/:id/trigger', async (req, res) => {
    try {
        const db: DB = res.locals.db;
        const { agreement, apTemplate } = await resolveAgreement(db, req.params.id);
        const processor = new TemplateArchiveProcessor(apTemplate);

        const requestType = req.body.$class;
        if (!apTemplate.getRequestTypes().includes(requestType)) {
            return res.status(400).json({ error: 'Invalid request type' });
        }

        const { success, error } = await concertoValidation(requestType, req.body, apTemplate.getModelManager());
        if (!success) {
            return res.status(400).json({ error: 'Validation failed', details: error.errors });
        }

        if (!agreement.state) {
            const init = await processor.init(agreement.data);
            agreement.state = init.state;
        }

        const result = await processor.trigger(agreement.data, req.body, agreement.state);

        await db.update(Agreement)
            .set({ state: result.state })
            .where(eq(Agreement.id, parseId(req.params.id)));

        res.json(result);

    } catch (err: any) {
        logger.error(err);
        res.status(500).json({ error: 'Trigger failed' });
    }
});

router.use('/', crudRouter);
export default router;
