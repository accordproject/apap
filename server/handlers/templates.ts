import express from 'express'
import { Template, TemplateInsertSchema, MODEL } from '../db/schema';
import { buildCrudRouter, ValidationResult } from './crud';
import { Factory, ModelManager, Serializer } from '@accordproject/concerto-core';

const router = express.Router();

let MODEL_MANAGER:ModelManager = undefined; 

async function TemplateValidator(body: any): Promise<ValidationResult> {
    if(!MODEL_MANAGER) {
        MODEL_MANAGER = new ModelManager({ strict: true, addMetamodel: true });
        MODEL_MANAGER.addCTOModel(Buffer.from(MODEL, 'base64').toString(), 'protocol.cto', true);
        await MODEL_MANAGER.updateExternalModels();
    }
    try {
        const factory = new Factory(MODEL_MANAGER);
        const serializer = new Serializer(factory, MODEL_MANAGER);
        const instance = serializer.fromJSON({ $class: 'org.accordproject.protocol@1.0.0.Template', ...body }, 
            { acceptResourcesForRelationships: false, validate: true, strictQualifiedDateTimes: true });
        return {
            success: true,
            data: serializer.toJSON(instance)
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
    validateBody: { schema: TemplateInsertSchema, custom: TemplateValidator }
});

router.use('/', crudRouter);
export default router;
