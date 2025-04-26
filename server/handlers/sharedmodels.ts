import express, { Request, Response } from 'express'
import { Agreement, AgreementInsertSchema, SharedModel, SharedModelInsertSchema, Template, TemplateInsertSchema } from '../db/schema';
import { buildCrudRouter } from './crud';

const router = express.Router();

// Define type-safe where clause builder for bots
function buildWhereClause(req: Request, res: Response) : any {
    return undefined;
}

const crudRouter = buildCrudRouter({
    table: SharedModel,
    typeName: 'SharedModel',
    buildWhereClause,
    validateBody: (req, res) => SharedModelInsertSchema
});

router.use('/', crudRouter);
export default router;