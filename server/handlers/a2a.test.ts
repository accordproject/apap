import express from 'express';
import request from 'supertest';
import { SignJWT } from 'jose';
import type { AuthAdapter } from '../auth/types';
import { JwtAdapter } from '../auth/jwtAdapter';
import type { A2AConfig } from '../config';
import type { Database } from '../db/client';
import { ApapA2AService } from '../services/a2aService';
import { createA2AComponents } from './a2a';

const jwt = {
    secret: 'a-demo-secret-that-is-at-least-32-characters',
    issuer: 'https://issuer.example.com/',
    audience: 'apap-a2a',
};

const config: A2AConfig = {
    authAdapter: 'hs256',
    publicBaseUrl: 'https://apap.example.com',
    hs256: jwt,
    isProduction: false,
};

async function bearer(
    subject = 'agent-1',
    orgId?: string,
    scope = 'apap:templates:read',
): Promise<string> {
    const value = await new SignJWT({ scope, ...(orgId && { orgId }) })
        .setProtectedHeader({ alg: 'HS256' })
        .setSubject(subject)
        .setIssuer(jwt.issuer)
        .setAudience(jwt.audience)
        .setIssuedAt()
        .setExpirationTime('5m')
        .sign(new TextEncoder().encode(jwt.secret));
    return `Bearer ${value}`;
}

function buildApp(adapter: AuthAdapter = new JwtAdapter(jwt), service?: unknown) {
    const components = createA2AComponents({} as Database, config, adapter, {
        service: (service ?? { execute: jest.fn().mockResolvedValue({ skillId: 'list-templates', result: [{ id: 1 }] }) }) as any,
    });
    const app = express();
    app.use('/.well-known/agent-card.json', components.agentCardHandler);
    app.use('/a2a', components.router);
    return app;
}

const sendMessage = {
    jsonrpc: '2.0',
    id: 'request-1',
    method: 'SendMessage',
    params: {
        message: {
            messageId: 'message-1',
            role: 'ROLE_USER',
            parts: [{ data: { skillId: 'list-templates', input: {} }, mediaType: 'application/json' }],
        },
    },
};

describe('A2A Express integration', () => {
    test('serves a public card from PUBLIC_BASE_URL without reflecting forwarded host', async () => {
        const response = await request(buildApp())
            .get('/.well-known/agent-card.json')
            .set('X-Forwarded-Host', 'attacker.example');

        expect(response.status).toBe(200);
        expect(response.body.supportedInterfaces[0].url).toBe('https://apap.example.com/a2a');
        expect(JSON.stringify(response.body)).not.toContain('attacker.example');
        expect(response.body.capabilities.streaming).toBe(false);
        expect(response.body.skills.map((skill: any) => skill.id)).not.toContain('create-agreement');
        expect(response.body.skills.find((skill: any) => skill.id === 'get-template').tags)
            .toEqual(['apap', 'templates']);
    });

    test('returns a static card when an adapter card hook fails', async () => {
        const adapter: AuthAdapter = {
            name: 'broken',
            securitySchemeName: 'Broken',
            authenticate: async () => { throw new Error('unused'); },
            describeScheme: () => { throw new Error('broken'); },
        };
        const response = await request(buildApp(adapter)).get('/.well-known/agent-card.json');
        expect(response.status).toBe(200);
        expect(response.body.supportedInterfaces[0].url).toBe('https://apap.example.com/a2a');
    });

    test('rejects unauthenticated requests at the HTTP boundary', async () => {
        const response = await request(buildApp())
            .post('/a2a')
            .set('A2A-Version', '1.0')
            .send(sendMessage);
        expect(response.status).toBe(401);
        expect(response.body).toEqual({
            error: { code: 'MISSING_TOKEN', message: 'A Bearer token is required.' },
        });
        expect(response.headers['www-authenticate']).toContain('invalid_token');
    });

    test('only exposes the documented HTTP methods', async () => {
        const card = await request(buildApp()).post('/.well-known/agent-card.json');
        const rpc = await request(buildApp())
            .get('/a2a')
            .set('Authorization', await bearer());

        expect(card.status).toBe(404);
        expect(rpc.status).toBe(404);
    });

    test('executes a valid authenticated JSON-RPC request to completion', async () => {
        const response = await request(buildApp())
            .post('/a2a')
            .set('Authorization', await bearer())
            .set('A2A-Version', '1.0')
            .send(sendMessage);

        expect(response.status).toBe(200);
        expect(response.body.jsonrpc).toBe('2.0');
        expect(response.body.result.task.status.state).toBe('TASK_STATE_COMPLETED');
        expect(response.body.result.task.artifacts[0].parts[0].data).toEqual([{ id: 1 }]);
    });

    test('rejects a skill when the principal lacks its exact scope', async () => {
        const response = await request(buildApp(new JwtAdapter(jwt), new ApapA2AService()))
            .post('/a2a')
            .set('Authorization', await bearer('agent-1', undefined, 'apap:agreements:read'))
            .set('A2A-Version', '1.0')
            .send(sendMessage);

        expect(response.status).toBe(200);
        expect(response.body.result.task.status.state).toBe('TASK_STATE_REJECTED');
        expect(response.body.result.task.status.message.parts[0].data.error).toEqual({
            code: 'INSUFFICIENT_SCOPE',
            message: 'The authenticated principal is not authorized for this operation.',
            details: {
                action: 'templates:list',
                resource: { type: 'template-collection' },
                requiredScope: 'apap:templates:read',
            },
        });
    });

    test('passes trigger input and authenticated org context to the shared-service facade', async () => {
        const triggerAgreement = jest.fn().mockResolvedValue({ response: 'ok', state: { count: 1 } });
        const service = new ApapA2AService({ triggerAgreement } as any);
        const triggerMessage = structuredClone(sendMessage);
        const triggerInput = { id: 3, request: { $class: 'org.example.Request', amount: 10 } };
        triggerMessage.params.message.parts[0].data = {
            skillId: 'trigger-agreement',
            input: triggerInput,
        };

        const response = await request(buildApp(new JwtAdapter(jwt), service))
            .post('/a2a')
            .set('Authorization', await bearer('agent-7', 'org-4', 'apap:trigger:invoke'))
            .set('A2A-Version', '1.0')
            .send(triggerMessage);

        expect(response.body.result.task.status.state).toBe('TASK_STATE_COMPLETED');
        expect(triggerAgreement).toHaveBeenCalledWith(
            expect.objectContaining({
                principal: expect.objectContaining({ sub: 'agent-7', orgId: 'org-4' }),
            }),
            3,
            triggerInput.request,
        );
    });

    test('isolates stored tasks by principal and organization', async () => {
        const app = buildApp();
        const created = await request(app)
            .post('/a2a')
            .set('Authorization', await bearer('agent-1', 'org-a'))
            .set('A2A-Version', '1.0')
            .send(sendMessage);
        const taskId = created.body.result.task.id;
        const getTaskRequest = {
            jsonrpc: '2.0',
            id: 'get-task-1',
            method: 'GetTask',
            params: { id: taskId },
        };

        const sameOwner = await request(app)
            .post('/a2a')
            .set('Authorization', await bearer('agent-1', 'org-a'))
            .set('A2A-Version', '1.0')
            .send(getTaskRequest);
        expect(sameOwner.body.result.id).toBe(taskId);

        const response = await request(app)
            .post('/a2a')
            .set('Authorization', await bearer('agent-1', 'org-b'))
            .set('A2A-Version', '1.0')
            .send(getTaskRequest);

        expect(response.status).toBe(200);
        expect(response.body.error.code).toBeLessThan(0);
        expect(response.body.result).toBeUndefined();
    });

    test('rejects payloads larger than 1MB', async () => {
        const response = await request(buildApp())
            .post('/a2a')
            .set('Authorization', await bearer())
            .set('Content-Type', 'application/json')
            .send(JSON.stringify({ ...sendMessage, padding: 'x'.repeat(1024 * 1024) }));
        expect(response.status).toBe(413);
    });
});
