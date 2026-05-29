import express from 'express'
import { Template, TemplateInsertSchema, } from '../db/schema';
import { buildCrudRouter, ValidationResult } from './crud';
import { concertoValidation } from './concertovalidation';
import { templateFromDatabase } from './templatebuilder';

const router = express.Router();

/**
 * Validates a template body against the Concerto schema and Cicero template compiler.
 * 
 * @param body - The request body containing template data to validate
 * @returns A ValidationResult indicating success or failure with error details
 * 
 * @example
 * const result = await templateValidation(req.body);
 * if (!result.success) return res.status(400).json(result.error);
 */
async function templateValidation(body:any) : Promise<ValidationResult> {
    try {
        const result = await concertoValidation('Template', body);

        // Return validation errors before attempting deserialization,
        // otherwise templateFromDatabase can throw and mask the real failure.
        if(!result.success) {
            return result;
        }

        const template = await templateFromDatabase(body);

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