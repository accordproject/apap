import { MODEL } from '../db/schema';
import { ValidationResult } from './crud';
import { Factory, ModelManager, Serializer } from '@accordproject/concerto-core';

let MODEL_MANAGER:ModelManager = undefined; 

export async function concertoValidation(typeName: string, body: any): Promise<ValidationResult> {
    if(!MODEL_MANAGER) {
        MODEL_MANAGER = new ModelManager({ strict: true, addMetamodel: true });
        MODEL_MANAGER.addCTOModel(Buffer.from(MODEL, 'base64').toString(), 'protocol.cto', true);
        await MODEL_MANAGER.updateExternalModels();
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
        const factory = new Factory(MODEL_MANAGER);
        const serializer = new Serializer(factory, MODEL_MANAGER);
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
                        message: err.message
                    }
                ]
            }

        }
    }
}