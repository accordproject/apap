import express, { Request, Response } from 'express'
import { SharedModel, SharedModelInsertSchema } from '../db/schema';
import { buildCrudRouter } from './crud';

const router = express.Router();

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