import express, { Request, Response } from 'express'
import { Agreement, AgreementInsertSchema } from '../db/schema';
import { buildCrudRouter } from './crud';

const router = express.Router();

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