import express from 'express'
import { Agreement, AgreementInsertSchema } from '../db/schema';
import { buildCrudRouter } from './crud';
import { ModelValidator } from './modelvalidator';

const router = express.Router();

const crudRouter = buildCrudRouter({
    table: Agreement,
    typeName: 'Agreement',
    validateBody: { schema: AgreementInsertSchema, custom: (body) => ModelValidator('Agreement', body) }
});

router.use('/', crudRouter);
export default router;