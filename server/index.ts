import 'source-map-support/register';
import OpenAPIBackend, { Request, Context } from 'openapi-backend';
import Express from 'express';
import morgan from 'morgan';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '..', '.env') });

import { Request as ExpressReq, Response as ExpressRes } from 'express';

const app = Express();
app.use(Express.json());

const openApiPath = path.join(__dirname, '..', '..', 'openapi.json');
console.log(openApiPath);

// define api
const api = new OpenAPIBackend({
    quick: true, // disabled validation of OpenAPI on load
    definition: openApiPath,
    handlers: {
        listTemplates: async (c: Context, req: Express.Request, res: Express.Response) =>
            res.status(200).json([]),
        createTemplate: async (c: Context, req: Express.Request, res: Express.Response) =>
            res.status(200).json({}),
        getTemplate: async (c: Context, req: Express.Request, res: Express.Response) =>
            res.status(200).json({}),
        replaceTemplate: async (c: Context, req: Express.Request, res: Express.Response) =>
            res.status(200).json({}),
        deleteTemplate: async (c: Context, req: Express.Request, res: Express.Response) =>
            res.status(200).json({}),
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