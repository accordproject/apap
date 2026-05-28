import { MODEL } from '../db/schema';
import { ValidationResult } from './crud';
import { Factory, ModelManager, Serializer } from '@accordproject/concerto-core';

let DEFAULT_MODEL_MANAGER:ModelManager = undefined; 

/**
 * Validates a request body against a specified Concerto model type using the ModelContextProtocol schema.
 * Stringifies 'data' and 'state' properties of the body to JSON strings to ensure they pass validation.
 * 
 * @param typeName - The name of the Concerto type to validate against
 * @param body - The object containing the payload to validate
 * @param modelManager - Optional custom ModelManager to use for validation. Defaults to DEFAULT_MODEL_MANAGER
 * @returns A ValidationResult indicating success or failure with error details
 * @throws Will not throw — errors are caught and returned as ValidationResult
 * 
 * @example
 * const result = await concertoValidation('Agreement', req.body);
 * if (!result.success) return res.status(400).json(result.error);
 */
export async function concertoValidation(typeName: string, body: any, modelManager?: ModelManager): Promise<ValidationResult> {
    if(!DEFAULT_MODEL_MANAGER) {
        DEFAULT_MODEL_MANAGER = new ModelManager({ strict: true, addMetamodel: true });
        DEFAULT_MODEL_MANAGER.addCTOModel(Buffer.from(MODEL, 'base64').toString(), 'protocol.cto', true);
        await DEFAULT_MODEL_MANAGER.updateExternalModels();
    }
    try {
        // HACK - need to do this using the model...
        // any elements in body that are of type JSON in the model
        // need to be stringified into a string so that they pass validation
        // these are currently 'data' and 'state'
        if(body.data) {
            body.data = JSON.stringify(body.data);
        }
        if(body.state) {
            body.state = JSON.stringify(body.state);
        }

        let activeModelManager = modelManager ?? DEFAULT_MODEL_MANAGER
        const factory = new Factory(activeModelManager);
        const serializer = new Serializer(factory, activeModelManager);
        const instance = serializer.fromJSON({ $class: `org.accordproject.protocol@1.0.0.${typeName}`, ...body }, 
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
                        message: err.message,
                    }
                ]
            }

        }
    }
}