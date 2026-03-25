import express from 'express'
import { Template, TemplateInsertSchema, } from '../db/schema';
import { buildCrudRouter, ValidationResult } from './crud';
import { concertoValidation } from './concertovalidation';
import { templateFromDatabase } from './templatebuilder';

const router = express.Router();

async function templateValidation(body:any) : Promise<ValidationResult> {
    try {
        const result = await concertoValidation('Template', body);
        const template = await templateFromDatabase(body);
        if(!result.success) {
            return result;
        }
        return {
            success: true,
            data: result.data
        }
    }
    catch (err) {
        console.log(err);
        return {
            success: false,
            error: {
                errors: [
                    {
                        message: err.message
                    }
                ]
            }

        }
    }
}

const crudRouter = buildCrudRouter({
    table: Template,
    typeName: 'Template',
    validateBody: { schema: TemplateInsertSchema, custom: (body) => templateValidation(body) }
});

router.use('/', crudRouter);
export default router;
