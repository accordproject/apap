import express, { Request, Response } from 'express'
import { Template, TemplateInsertSchema } from '../db/schema';
import { buildCrudRouter } from './crud';

const router = express.Router();

// Define type-safe where clause builder for bots
function buildWhereClause(req: Request, res: Response) : any {
    return undefined;
}

const crudRouter = buildCrudRouter({
    table: Template,
    typeName: 'Template',
    buildWhereClause,
    validateBody: (req, res) => TemplateInsertSchema
});

router.use('/', crudRouter);
export default router;