import express from 'express'
import { Agreement, AgreementInsertSchema } from '../db/schema';
import { buildCrudRouter } from './crud';

const router = express.Router();

const crudRouter = buildCrudRouter({
    table: Agreement,
    typeName: 'Agreement',
    validateBody: {schema: AgreementInsertSchema}
});

router.use('/', crudRouter);
export default router;