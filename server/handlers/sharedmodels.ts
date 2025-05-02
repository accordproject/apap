import express from 'express'
import { SharedModel, SharedModelInsertSchema } from '../db/schema';
import { buildCrudRouter } from './crud';

const router = express.Router();

const crudRouter = buildCrudRouter({
    table: SharedModel,
    typeName: 'SharedModel',
    validateBody: {schema: SharedModelInsertSchema}
});

router.use('/', crudRouter);
export default router;