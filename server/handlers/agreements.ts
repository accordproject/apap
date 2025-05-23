import express from 'express'
import { Agreement, AgreementInsertSchema, Template } from '../db/schema';
import { buildCrudRouter } from './crud';
import { concertoValidation } from './concertovalidation';
import { templateFromDatabase } from './templatebuilder';
import { eq } from 'drizzle-orm';
import { TemplateArchiveProcessor } from '@accordproject/template-engine';

const router = express.Router();

const crudRouter = buildCrudRouter({
    table: Agreement,
    typeName: 'Agreement',
    // TODO, validate that body is an instance of the template model for the agreement
    validateBody: { schema: AgreementInsertSchema, custom: (body) => concertoValidation('Agreement', body) }
});

crudRouter.get('/:id/convert/:format', async function (req, res) {
    try {
        console.log('Getting agreement: ' + req.params.id);
        const result = await res.locals.db
            .select()
            .from(Agreement)
            .where(eq(Agreement.id, Number.parseInt(req.params.id)))
            .limit(1);

        if (!result.length) {
            throw new Error(`Agreement with id ${req.params.id} does not exist`);
        }
        console.log('Got agreement');
        const agreement = result[0];
        const result2 = await res.locals.db
            .select()
            .from(Template)
            .where(eq(Template.uri, agreement.template))
            .limit(1);

        if (!result2.length) {
            throw new Error(`Template with uri ${agreement.template} referenced by agreement ${req.params.id} does not exist`);
        }
        const template = result2[0];
        const apTemplate = await templateFromDatabase(template);

        const templateArchiveProcessor = new TemplateArchiveProcessor(apTemplate);
        const options = {};
        const draftResult = await templateArchiveProcessor.draft(agreement.data, req.params.format, options);
        console.log(draftResult);
        res.setHeader("Content-Type", `text/${req.params.format}`) // todo
        res.send(draftResult)
    }
    catch (error) {
        console.log(error);
        const message = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({ error: message });
    }
});

router.use('/', crudRouter);
export default router;