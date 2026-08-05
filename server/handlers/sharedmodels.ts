import express from 'express'
import { SharedModel, SharedModelInsertSchema } from '../db/schema';
import { buildCrudRouter } from './crud';
import { concertoValidation } from './concertovalidation';

const router = express.Router();

const crudRouter = buildCrudRouter({
    table: SharedModel,
    typeName: 'SharedModel',
    // ponytail: cast schema to any due to zod v3 -> v4 upgrade depth-instantiation
    // issue with drizzle-zod. Runtime unaffected.
    validateBody: { schema: SharedModelInsertSchema as any, custom: (body) => concertoValidation('SharedModel', body) }
});

router.use('/', crudRouter);
export default router;