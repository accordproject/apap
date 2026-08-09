import express from 'express'
import { Template, TemplateInsertSchema, } from '../db/schema';
import { buildCrudRouter, ValidationResult } from './crud';
import { concertoValidation } from './concertovalidation';
import { templateFromDatabase } from './templatebuilder';
import { assertTemplateContentImmutable, assertTemplateNotInUse } from '../services/templateService';

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
    // ponytail: cast TemplateInsertSchema to any due to zod v3 -> v4 upgrade
    // depth-instantiation issue with drizzle-zod. Runtime unaffected.
    validateBody: { schema: TemplateInsertSchema as any, custom: (body) => templateValidation(body) },
    // Templates are content-addressed (by `hash`, for auto-fetched ones) or
    // cited by `uri` (for directly-posted ones) — either way a template's
    // content is not supposed to change after creation. A new version is a
    // new template, not an edit in place. See templateService.ts.
    guardUpdate: (existing, body) => assertTemplateContentImmutable(existing, body),
    guardDelete: (existing, db) => assertTemplateNotInUse(existing, db),
});

router.use('/', crudRouter);
export default router;
