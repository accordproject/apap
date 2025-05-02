import express, { Request, Response } from 'express'
import { Agreement, AgreementInsertSchema } from '../db/schema';
import { buildCrudRouter, QueryParams } from './crud';
import { SQL } from 'drizzle-orm';

const router = express.Router();

const crudRouter = buildCrudRouter({
    table: Agreement,
    typeName: 'Agreement',
    validateBody: (req, res) => AgreementInsertSchema
});

router.use('/', crudRouter);
export default router;