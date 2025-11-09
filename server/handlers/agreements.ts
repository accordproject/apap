import express from 'express'
import { Agreement, AgreementInsertSchema, Template } from '../db/schema';
import { buildCrudRouter } from './crud';
import { concertoValidation } from './concertovalidation';
import { templateFromDatabase } from './templatebuilder';
import { eq } from 'drizzle-orm';
import { TemplateArchiveProcessor } from '@accordproject/template-engine';

async function resolveAgreement(db:any, agreementId:string) {
    console.log('Getting agreement: ' + agreementId);
    const result = await db
        .select()
        .from(Agreement)
        .where(eq(Agreement.id, Number.parseInt(agreementId)))
        .limit(1);

    if (!result.length) {
        throw new Error(`Agreement with id ${agreementId} does not exist`);
    }
    console.log('Got agreement');
    const agreement = result[0];
    const result2 = await db
        .select()
        .from(Template)
        .where(eq(Template.uri, agreement.template))
        .limit(1);

    if (!result2.length) {
        throw new Error(`Template with uri ${agreement.template} referenced by agreement ${agreementId} does not exist`);
    }
    const template = result2[0];
    const apTemplate = await templateFromDatabase(template);

    return {
        agreement,
        template,
        apTemplate
    }
}

const router = express.Router();

const crudRouter = buildCrudRouter({
    table: Agreement,
    typeName: 'Agreement',
    // TODO, validate that body is an instance of the template model for the agreement
    validateBody: { schema: AgreementInsertSchema, custom: (body) => concertoValidation('Agreement', body) }
});

crudRouter.get('/:id/convert/:format', async function (req, res) {
    try {
        const {agreement, apTemplate} = await resolveAgreement(res.locals.db, req.params.id);
        const templateArchiveProcessor = new TemplateArchiveProcessor(apTemplate);
        const options = {};
        const draftResult = await templateArchiveProcessor.draft(agreement.data, req.params.format, options);
        console.log(draftResult);
        res.setHeader("Content-Type", `text/${req.params.format}`)
        res.send(draftResult)
    }
    catch (error) {
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

            const requestSchema = apTemplate.getRequestTypes().find(rt => rt === req.body.$class);
            if (!requestSchema) {
                throw new Error(`Invalid request type: ${req.body.$class}`);
            }
            // TODO validate request body against apTemplate
            const { success, error } = await concertoValidation(req.body.$class, req.body, apTemplate.getModelManager());

            if (!success){
                res.json({
                    isError: true,
                    errorMessage: "Trigger request validation failed",
                    errorDetails: error.errors[0].message
                });
                return;
            }

            // TODO allow state to be passed in as a parameter
            if (agreement.state == null){
                const state = await templateArchiveProcessor.init(agreement.data);
                agreement.state = state.state;
            }
            const triggerResult = await templateArchiveProcessor.trigger(agreement.data, req.body, agreement.state);
            console.log(JSON.stringify(triggerResult));
            
            // TODO persist updated state.

            res.json(triggerResult);
        }
        catch(err) {
            console.error(err);
            res.json({
                isError: true,
                errorMessage: err.message,
                errorDetails: err.toString()
            })
        }
    }
    catch (error) {
        console.log(error);
        const message = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({ error: message });
    }
});

router.use('/', crudRouter);
export default router;