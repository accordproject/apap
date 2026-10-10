import express from 'express';
import { SharedModel, SharedModelInsertSchema } from '../db/schema';
import { buildCrudRouter } from './crud';
import { concertoValidation } from './concertovalidation';
import { ModelManager } from '@accordproject/concerto-core';
import { FileDownloader } from '@accordproject/concerto-util';
import { HttpModelRetriever, assertAllowedUrl } from './retrievers/HttpModelRetriever';

const router = express.Router();

class SecureFileLoader {
    private modelManager: ModelManager;

    constructor(modelManager: ModelManager) {
        this.modelManager = modelManager;
    }

    accepts(url: string): boolean {
        return url.startsWith('http://') || url.startsWith('https://');
    }

    async load(url: string, options: any): Promise<any> {
        try {
            assertAllowedUrl(url);
        } catch (e) {
            throw new Error(`SSRF Prevention: Transitive import domain or URL not allowed: ${url}`);
        }
        
        const retriever = new HttpModelRetriever();
        const ctoText = await retriever.fetchModel(url);
        
        return this.modelManager.addCTOModel(ctoText, url, true);
    }
}

const getExternalImports = (modelFile: any): Record<string, string> => {
    const ast = modelFile.getAst ? modelFile.getAst() : modelFile.ast;
    const imports: Record<string, string> = {};
    if (ast && ast.imports) {
        for (const imp of ast.imports) {
            if (imp.uri && typeof imp.uri === 'string') {
                imports[imp.namespace] = imp.uri;
            }
        }
    }
    return imports;
};

router.post('/', async (req, res, next) => {
    const uri: string | undefined = req.body?.uri;
    const retriever = new HttpModelRetriever();

    if (uri && retriever.getURISchemes().some((scheme) => uri.startsWith(`${scheme}://`))) {
        try {
            const ctoText = await retriever.fetchModel(uri);

            const modelManager = new ModelManager({ addMetamodel: true });
            const modelFile = modelManager.addCTOModel(ctoText, 'external.cto', true);

            const fileDownloader = new FileDownloader(new SecureFileLoader(modelManager) as any, getExternalImports);
            await modelManager.updateExternalModels({}, fileDownloader);

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
    validateBody: { schema: SharedModelInsertSchema as any, custom: (body) => concertoValidation('SharedModel', body) }
});

router.use('/', crudRouter);
export default router;