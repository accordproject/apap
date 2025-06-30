import express from 'express'
import { SharedModel, SharedModelInsertSchema } from '../db/schema';
import { buildCrudRouter } from './crud';
import { concertoValidation } from './concertovalidation';
import { z } from 'zod';

const router = express.Router();



const ExtendedSharedModelInsertSchema = SharedModelInsertSchema.extend({
    model: z
      .object({
        $class: z.string(),
        ctoFiles: z.array(z.string()),
        filenames: z.array(z.string()).optional(),
      })
      .optional()
      .refine(
        (model): boolean => {
          if (model && model.filenames && model.filenames.length !== model.ctoFiles.length) {
            return false;
          }
          return true;
        },
        {
          message: 'Number of filenames must match number of ctoFiles',
          path: ['model', 'filenames'],
        }
      ),
  });

const crudRouter = buildCrudRouter({
    table: SharedModel,
    typeName: 'SharedModel',
    validateBody: { schema:  ExtendedSharedModelInsertSchema,  custom: (body) => concertoValidation('SharedModel', body) }
});

router.use('/', crudRouter);
export default router;