import 'source-map-support/register';
import OpenAPIBackend, { Request } from 'openapi-backend';
import Express from 'express';
import morgan from 'morgan'
import path from 'path';

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
        listTemplates: async (c, req: Express.Request, res: Express.Response) => {
            const { offset = 0, limit = 10, fields } = req.query;
            const templates = []; // Fetch templates from your data source
            const total = templates.length;
            const paginatedTemplates = templates.slice(offset, offset + limit);
            const response = {
                data: paginatedTemplates,
                meta: {
                    total,
                    offset,
                    limit,
                },
                links: {
                    self: `/templates?offset=${offset}&limit=${limit}`,
                    next: offset + limit < total ? `/templates?offset=${offset + limit}&limit=${limit}` : null,
                    prev: offset > 0 ? `/templates?offset=${offset - limit}&limit=${limit}` : null,
                    first: `/templates?offset=0&limit=${limit}`,
                    last: `/templates?offset=${Math.floor(total / limit) * limit}&limit=${limit}`,
                },
            };
            res.status(200).json(response);
        },
        createTemplate: async (c, req: Express.Request, res: Express.Response) =>
            res.status(200).json({}),
        getTemplate: async (c, req: Express.Request, res: Express.Response) =>
            res.status(200).json({}),
        replaceTemplate: async (c, req: Express.Request, res: Express.Response) =>
            res.status(200).json({}),
        deleteTemplate: async (c, req: Express.Request, res: Express.Response) =>
            res.status(200).json({}),
        validationFail: async (c, req: ExpressReq, res: ExpressRes) => res.status(400).json({ err: c.validation.errors }),
        notFound: async (c, req: ExpressReq, res: ExpressRes) => res.status(404).json({ err: 'not found' }),
        notImplemented: async (c, req: ExpressReq, res: ExpressRes) => {
            const { status, mock } = c.api.mockResponseForOperation(c.operation.operationId);
            return res.status(status).json(mock);
        },
    },
});

api.init();

// logging
app.use(morgan('combined'));

// use as express middleware
app.use((req, res) => api.handleRequest(req as Request, req, res));

// start server
app.listen(9000, () => console.info('api listening at http://localhost:9000'));
