import express, { type RequestHandler, type Router } from 'express';
import {
    DefaultRequestHandler,
    InMemoryTaskStore,
    type ServerCallContext,
} from '@a2a-js/sdk/server';
import { agentCardHandler, jsonRpcHandler } from '@a2a-js/sdk/server/express';
import type { Database } from '../db/client';
import type { A2AConfig } from '../config';
import { authenticatedUserBuilder, createA2AAuthMiddleware } from '../auth/middleware';
import type { AuthAdapter, Principal } from '../auth/types';
import { composeAgentCardSafely } from '../a2a/agentCard';
import { ApapAgentExecutor } from '../a2a/executor';
import { ApapA2AService } from '../services/a2aService';

export interface A2AComponents {
    router: Router;
    agentCardHandler: RequestHandler;
    adapter: AuthAdapter;
    requestHandler: DefaultRequestHandler;
}

export interface A2AComponentOverrides {
    service?: ApapA2AService;
}

/**
 * Task-store bucket key. The SDK uses this string directly as the bucket key,
 * so the (orgId, sub) tuple is encoded unambiguously: a `${orgId}:${sub}`
 * join let {orgId: 'acme', sub: 'agent'} and {sub: 'acme:agent'} land in one
 * bucket and read each other's tasks.
 */
export function resolvePrincipalOwner(context: ServerCallContext): string {
    const principal = context.user as Principal | undefined;
    if (!principal || !('sub' in principal)) return 'unknown';
    return JSON.stringify([principal.orgId ?? null, principal.sub]);
}

export function createA2AComponents(
    db: Database,
    config: A2AConfig,
    adapter: AuthAdapter,
    overrides: A2AComponentOverrides = {},
): A2AComponents {
    if (config.isProduction && adapter.name === 'hs256') {
        console.warn({
            event: 'a2a_demo_auth_in_production',
            message: 'The built-in HS256 adapter is demo-grade; register an asymmetric adapter for production.',
        });
    }

    const initialCard = composeAgentCardSafely(config, adapter);
    const service = overrides.service ?? new ApapA2AService();
    const executor = new ApapAgentExecutor(db, service);
    const taskStore = new InMemoryTaskStore(resolvePrincipalOwner);
    const requestHandler = new DefaultRequestHandler(initialCard, taskStore, executor);

    const router = express.Router();
    router.use(createA2AAuthMiddleware(adapter));
    router.use(express.json({ limit: '1mb' }));
    router.post('/', jsonRpcHandler({ requestHandler, userBuilder: authenticatedUserBuilder }));

    return {
        router,
        adapter,
        requestHandler,
        agentCardHandler: agentCardHandler({
            agentCardProvider: async () => composeAgentCardSafely(config, adapter),
            cache: { maxAge: 300 },
        }),
    };
}
