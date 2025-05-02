import express, { Request, Response } from 'express'
import { Template, TemplateInsertSchema } from '../db/schema';
import { buildCrudRouter, QueryParams } from './crud';
import { and, eq, sql, SQL } from 'drizzle-orm';

const router = express.Router();

const crudRouter = buildCrudRouter({
    table: Template,
    typeName: 'Template',
    validateBody: (req, res) => TemplateInsertSchema
});

router.use('/', crudRouter);
export default router;