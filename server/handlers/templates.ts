import express from 'express'
import { Template, TemplateInsertSchema, } from '../db/schema';
import { buildCrudRouter, ValidationResult } from './crud';
import { concertoValidation } from './concertovalidation';
import { templateFromDatabase } from './templatebuilder';
import { createTemplateFromArchive } from '../services/templateService';
import { InvalidPayloadError } from '../services/errors';
import { asyncHandler } from '../middleware/errorHandler';

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
    validateBody: { schema: TemplateInsertSchema as any, custom: (body) => templateValidation(body) }
});

/**
 * @param req The Express request carrying a raw `.cta` archive as the body.
 * @param res The Express response used to return the created template or an error.
 * @return Resolves after the created template or an error response has been written.
 * @details Parses the uploaded archive with cicero-core, rejects it if the archive's
 * declared Cicero compatibility range doesn't cover the server's pinned cicero-core
 * version, and creates (or, on a matching content hash, returns the existing) Template.
 */
crudRouter.post('/archive',
    express.raw({ type: 'application/octet-stream', limit: '10mb' }),
    asyncHandler(async (req, res) => {
        if (!Buffer.isBuffer(req.body) || req.body.length === 0) {
            throw new InvalidPayloadError('Missing .cta archive body');
        }
        const template = await createTemplateFromArchive(res.locals.db, req.body);
        res.status(201).json(template);
    })
);

router.use('/', crudRouter);
export default router;
