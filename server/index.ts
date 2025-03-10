import 'source-map-support/register';
import OpenAPIBackend, { Request, Context } from 'openapi-backend';
import Express from 'express';
import morgan from 'morgan';
import path from 'path';
import dotenv from 'dotenv';
import { TemplateStore, TemplateNotFoundError, DuplicateTemplateError } from './src/services/TemplateStore';

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '..', '.env') });

import { Request as ExpressReq, Response as ExpressRes } from 'express';

const app = Express();
app.use(Express.json());

const openApiPath = path.join(__dirname, '..', '..', 'openapi.json');
console.log(openApiPath);

// Initialize template store
const templateStore = new TemplateStore();

// define api
const api = new OpenAPIBackend({
    quick: true, // disabled validation of OpenAPI on load
    definition: openApiPath,
    handlers: {
        listTemplates: async (c: Context, req: Express.Request, res: Express.Response) => {
            try {
                const templates = await templateStore.listTemplates();
                res.status(200).json(templates);
            } catch (error) {
                console.error('Error listing templates:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        },
        createTemplate: async (c: Context, req: Express.Request, res: Express.Response) => {
            try {
                const template = await templateStore.createTemplate(req.body);
                res.status(201).json(template);
            } catch (error) {
                if (error instanceof DuplicateTemplateError) {
                    res.status(409).json({ error: error.message });
                } else {
                    console.error('Error creating template:', error);
                    res.status(500).json({ error: 'Internal server error' });
                }
            }
        },
        getTemplate: async (c: Context, req: Express.Request, res: Express.Response) => {
            try {
                const id = Array.isArray(c.request.params.id) ? c.request.params.id[0] : c.request.params.id;
                const template = await templateStore.getTemplate(id);
                res.status(200).json(template);
            } catch (error) {
                if (error instanceof TemplateNotFoundError) {
                    res.status(404).json({ error: error.message });
                } else {
                    console.error('Error getting template:', error);
                    res.status(500).json({ error: 'Internal server error' });
                }
            }
        },
        replaceTemplate: async (c: Context, req: Express.Request, res: Express.Response) => {
            try {
                const id = Array.isArray(c.request.params.id) ? c.request.params.id[0] : c.request.params.id;
                const template = await templateStore.updateTemplate(id, req.body);
                res.status(200).json(template);
            } catch (error) {
                if (error instanceof TemplateNotFoundError) {
                    res.status(404).json({ error: error.message });
                } else if (error instanceof DuplicateTemplateError) {
                    res.status(409).json({ error: error.message });
                } else {
                    console.error('Error updating template:', error);
                    res.status(500).json({ error: 'Internal server error' });
                }
            }
        },
        deleteTemplate: async (c: Context, req: Express.Request, res: Express.Response) => {
            try {
                const id = Array.isArray(c.request.params.id) ? c.request.params.id[0] : c.request.params.id;
                await templateStore.deleteTemplate(id);
                res.status(204).send();
            } catch (error) {
                if (error instanceof TemplateNotFoundError) {
                    res.status(404).json({ error: error.message });
                } else {
                    console.error('Error deleting template:', error);
                    res.status(500).json({ error: 'Internal server error' });
                }
            }
        },
        validationFail: async (c: Context, req: ExpressReq, res: ExpressRes) => 
            res.status(400).json({ error: c.validation.errors }),
        notFound: async (c: Context, req: ExpressReq, res: ExpressRes) => 
            res.status(404).json({ error: 'not found' }),
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