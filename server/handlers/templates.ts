import express from 'express'
import { Template, TemplateInsertSchema, } from '../db/schema';
import { buildCrudRouter } from './crud';
import { ModelValidator } from './modelvalidator';

const router = express.Router();

const crudRouter = buildCrudRouter({
    table: Template,
    typeName: 'Template',
    validateBody: { schema: TemplateInsertSchema, custom: (body) => ModelValidator('Template', body) }
});

router.use('/', crudRouter);
export default router;
