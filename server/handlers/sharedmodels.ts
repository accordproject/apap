import express from 'express';
import { SharedModel, SharedModelInsertSchema } from '../db/schema';
import { buildCrudRouter } from './crud';
import { concertoValidation } from './concertovalidation';
import { ModelManager } from '@accordproject/concerto-core';
import { HttpModelRetriever, assertAllowedUrl } from './retrievers/HttpModelRetriever';

const router = express.Router();

class SecureFileLoader {
    accepts(url: string): boolean {
        try {
            assertAllowedUrl(url);
            return true;
        } catch (e) {
            return false;
        }
    }

    async load(url: string, options: any): Promise<string> {
        const retriever = new HttpModelRetriever();
        return await retriever.fetchModel(url);
    }
}

class SecureDownloader {
    private fileLoader = new SecureFileLoader();
    private modelManager: ModelManager;

    constructor(modelManager: ModelManager) {
        this.modelManager = modelManager;
    }

    async downloadExternalDependencies(modelFiles: any[], options: any): Promise<any[]> {
        const downloadedModels: any[] = [];
        
        for (const modelFile of modelFiles) {
            const ast = modelFile.getAst ? modelFile.getAst() : { imports: [] };
            const imports = ast.imports || [];
            
            for (const imp of imports) {
                const uri = imp.uri;
                if (typeof uri === 'string' && uri.startsWith('http')) {
                    if (!this.fileLoader.accepts(uri)) {
                        throw new Error(`SSRF Prevention: Transitive import domain or URL not allowed: ${uri}`);
                    }
                    const content = await this.fileLoader.load(uri, options);
                    
                    const parsedModel = this.modelManager.addCTOModel(content, 'transitive.cto', true);
                    downloadedModels.push(parsedModel);
                }
            }
        }
        return downloadedModels;
    }
}

router.post('/', async (req, res, next) => {
    const uri: string | undefined = req.body?.uri;
    const retriever = new HttpModelRetriever();

    if (uri && retriever.getURISchemes().some((scheme) => uri.startsWith(`${scheme}://`))) {
        try {
            const ctoText = await retriever.fetchModel(uri);

            const modelManager = new ModelManager({ addMetamodel: true });
            const modelFile = modelManager.addCTOModel(ctoText, 'external.cto', true);
            
            const secureDownloader = new SecureDownloader(modelManager);
            await modelManager.updateExternalModels({}, secureDownloader as any);
            
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
            console.error(`[SharedModels Post Error]:`, error);
            return res.status(400).json({
                error: 'Failed to fetch or parse external model safely.',
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