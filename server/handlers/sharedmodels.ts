import express from 'express'
import { SharedModel, SharedModelInsertSchema } from '../db/schema';
import { buildCrudRouter } from './crud';
import { ModelValidator } from './modelvalidator';

const router = express.Router();

const crudRouter = buildCrudRouter({
    table: SharedModel,
    typeName: 'SharedModel',
    validateBody: { schema: SharedModelInsertSchema, custom: (body) => ModelValidator('SharedModel', body) }
});

router.use('/', crudRouter);
export default router;