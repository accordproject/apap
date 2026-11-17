import express from 'express';
import request from 'supertest';
import { Client } from '@modelcontextprotocol/client';
import { InMemoryTransport } from '@modelcontextprotocol/server';
import agreementRouter from './agreements';
import templateRouter from './templates';
import { globalErrorHandler } from '../middleware/errorHandler';
import { getServer } from './mcp';
import { createLegacyPolicyContext } from '../services/policy';

describe('PostgreSQL integer identifier bounds', () => {
    it.each(['/agreements/2147483648', '/templates/2147483648', '/agreements/99999999999', '/templates/99999999999'])('rejects %s before database access', async (url) => {
        const select = jest.fn();
        const app = express();
        app.use((_req, res, next) => { res.locals.db = { select }; next(); });
        app.use('/agreements', agreementRouter);
        app.use('/templates', templateRouter);
        app.use(globalErrorHandler);
        const response = await request(app).get(url);
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ error: 'Not found' });
        expect(select).not.toHaveBeenCalled();
    });

    it.each(['/agreements/2147483647', '/templates/2147483647'])('allows maximum integer through %s', async (url) => {
        const select = jest.fn(() => { throw new Error('database reached'); });
        const app = express();
        app.use((_req, res, next) => { res.locals.db = { select }; next(); });
        app.use('/agreements', agreementRouter);
        app.use('/templates', templateRouter);
        app.use(globalErrorHandler);
        await request(app).get(url);
        expect(select).toHaveBeenCalled();
    });

    it.each(['2147483648', '99999999999'])('rejects oversized MCP IDs %s before database access', async (id) => {
        const select = jest.fn();
        const server = getServer(createLegacyPolicyContext({ select } as any));
        const client = new Client({ name: 'bounds-test', version: '1' }, { capabilities: {} });
        const transports = InMemoryTransport.createLinkedPair();
        await server.connect(transports[1]);
        await client.connect(transports[0]);
        try {
            const result = await client.callTool({ name: 'getAgreement', arguments: { agreementId: id } });
            expect(result.isError).toBe(true);
            expect(JSON.stringify(result)).toContain('AGREEMENT_NOT_FOUND');
            for (const [name, args, code] of [
                ['getTemplate', { templateId: id }, 'TEMPLATE_NOT_FOUND'],
                ['convert-agreement-to-format', { agreementId: id, format: 'html' }, 'AGREEMENT_NOT_FOUND'],
                ['trigger-agreement', { agreementId: id, payload: '{}' }, 'AGREEMENT_NOT_FOUND'],
            ] as const) {
                const rejected = await client.callTool({ name, arguments: args });
                expect(rejected.isError).toBe(true);
                expect(JSON.stringify(rejected)).toContain(code);
            }
            await expect(client.readResource({ uri: `apap://agreements/${id}` })).rejects.toMatchObject({ code: -32602 });
            await expect(client.readResource({ uri: `apap://templates/${id}` })).rejects.toMatchObject({ code: -32602 });
            expect(select).not.toHaveBeenCalled();
        } finally { await client.close(); await server.close(); }
    });

    it('allows maximum MCP agreement tool and resource IDs through to the database', async () => {
        const select = jest.fn(() => { throw new Error('database reached'); });
        const server = getServer(createLegacyPolicyContext({ select } as any));
        const client = new Client({ name: 'bounds-test', version: '1' }, { capabilities: {} });
        const transports = InMemoryTransport.createLinkedPair();
        await server.connect(transports[1]);
        await client.connect(transports[0]);
        try {
            const result = await client.callTool({ name: 'getAgreement', arguments: { agreementId: '2147483647' } });
            expect(result.isError).toBe(true);
            expect(select).toHaveBeenCalledTimes(1);
            await expect(client.readResource({ uri: 'apap://agreements/2147483647' })).rejects.toThrow();
            expect(select).toHaveBeenCalledTimes(2);
            await expect(client.readResource({ uri: 'apap://templates/2147483647' })).rejects.toThrow();
            expect(select).toHaveBeenCalledTimes(3);
        } finally { await client.close(); await server.close(); }
    });
});
