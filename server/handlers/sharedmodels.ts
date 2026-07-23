import express from 'express';
import { SharedModel, SharedModelInsertSchema } from '../db/schema';
import { buildCrudRouter } from './crud';
import { concertoValidation } from './concertovalidation';
import { ModelManager } from '@accordproject/concerto-core';
import { HttpModelRetriever } from './retrievers/HttpModelRetriever';

const router = express.Router();

router.post('/', async (req, res, next) => {
    const uri: string | undefined = req.body?.uri;
    const retriever = new HttpModelRetriever();

    if (uri && retriever.getURISchemes().some((scheme) => uri.startsWith(`${scheme}://`))) {
        try {
            const ctoText = await retriever.fetchModel(uri);

            const modelManager = new ModelManager({ strict: true, addMetamodel: true });
            const modelFile = modelManager.addCTOModel(ctoText, 'external.cto', true);
            await modelManager.updateExternalModels();
            
            const namespace = modelFile.getNamespace() || 'external';

            req.body.model = {
                $class: 'org.accordproject.protocol@1.0.0.CtoModel',
                ctoFiles: [
                    {
                        filename: `${namespace}.cto`,
                        contents: ctoText
                    }
                ]
            };
        } catch (error: any) {
            return res.status(400).json({
                error: 'Failed to fetch or parse external model',
                details: error.message
            });
        }
    }

    next();
});

const crudRouter = buildCrudRouter({
    table: SharedModel,
    typeName: 'SharedModel',
    validateBody: { schema: SharedModelInsertSchema, custom: (body) => concertoValidation('SharedModel', body) }
});

router.use('/', crudRouter);
export default router;