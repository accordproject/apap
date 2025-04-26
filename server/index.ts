import 'source-map-support/register';
import OpenAPIBackend, { Request, Context } from 'openapi-backend';
import Express from 'express';
import morgan from 'morgan';
import path from 'path';
import dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/neon-http';

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '..', '.env') });

import { Request as ExpressReq, Response as ExpressRes } from 'express';

import templatesRouter from './handlers/templates';
import agreementsRouter from './handlers/agreements';
import sharedModelsRouter from './handlers/sharedmodels';

const app = Express();
app.use(Express.json());

// Database middleware
app.use((req, res, next) => {
    if (process.env.DATABASE_URL) {
        const db = drizzle(process.env.DATABASE_URL, {
            casing: 'snake_case',
        });
        res.locals.db = db;
    }
    else {
        res.status(500);
        res.send('DATABASE_URL is not set');
    }
    next();
});

app.use('/templates', templatesRouter);
app.use('/agreements', agreementsRouter);
app.use('/sharedmodels', sharedModelsRouter);

const openApiPath = path.join(__dirname, '..', '..', 'openapi.json');
console.log(openApiPath);

// define api
const api = new OpenAPIBackend({
    quick: true, // disabled validation of OpenAPI on load
    definition: openApiPath,
    handlers: {
        validationFail: async (c: Context, req: ExpressReq, res: ExpressRes) => res.status(400).json({ err: c.validation.errors }),
        notFound: async (c: Context, req: ExpressReq, res: ExpressRes) => res.status(404).json({ err: 'not found' }),
        notImplemented: async (c: Context, req: ExpressReq, res: ExpressRes) => {
            const { status, mock } = c.api.mockResponseForOperation(c.operation.operationId);
            return res.status(status).json(mock);
        },
    },
});

api.init();

// logging
app.use(morgan('combined'));

// use as express middleware
app.use((req: Express.Request, res: Express.Response) => api.handleRequest(req as Request, req, res));

const HOST = process.env.HOST || 'localhost';
const PORT = parseInt(process.env.PORT || '9000', 10);

// start server
app.listen(PORT, HOST, () => {
    console.info(`API listening at http://${HOST}:${PORT}`);
});