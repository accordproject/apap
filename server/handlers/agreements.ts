import express, { Request, Response } from 'express'
import { Agreement, AgreementInsertSchema, Template, TemplateInsertSchema } from '../db/schema';
import { buildCrudRouter } from './crud';

const router = express.Router();

// Define type-safe where clause builder for bots
function buildWhereClause(req: Request, res: Response) : any {
    return undefined;
}

const crudRouter = buildCrudRouter({
    table: Agreement,
    typeName: 'Agreement',
    buildWhereClause,
    validateBody: (req, res) => AgreementInsertSchema
});

router.use('/', crudRouter);
export default router;