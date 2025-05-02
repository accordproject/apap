import express, { Request, Response } from 'express'
import { SharedModel, SharedModelInsertSchema } from '../db/schema';
import { buildCrudRouter, QueryParams } from './crud';
import { SQL } from 'drizzle-orm';

const router = express.Router();

const crudRouter = buildCrudRouter({
    table: SharedModel,
    typeName: 'SharedModel',
    validateBody: (req, res) => SharedModelInsertSchema
});

router.use('/', crudRouter);
export default router;