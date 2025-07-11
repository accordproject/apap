import express, { Request, Response } from 'express';
import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from 'zod';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { isInitializeRequest, CallToolResult, GetPromptResult, ReadResourceResult } from "@modelcontextprotocol/sdk/types.js";
import * as crypto from "crypto";
import { InMemoryEventStore } from './inmemoryeventstore';
import { Agreement, Template } from '../db/schema';

const HOST = process.env.HOST || 'localhost';
const PORT = parseInt(process.env.PORT || '9000', 10);
const APAP_SERVER = process.env.APAP_SERVER || `http://${HOST}:${PORT}`

const router = express.Router();

async function getTemplates(uri: URL) {
    console.log('getTemplates: ' + uri);
    const result = await fetch(`${APAP_SERVER}/templates`);
    if (result.ok) {
        const templates = await result.json();
        return {
            contents: templates.items.map((t: typeof Template) => {
                return {
                    uri: `apap://templates/${t.id}`,
                    mimeType: "application/json",
                    text: JSON.stringify(t)
                }
            })
        }
    }
    else {
        throw new Error('Failed to load template');
    }
}

async function getAgreements(uri: URL) {
    console.log('getAgreements: ' + uri);
    const result = await fetch(`${APAP_SERVER}/agreements`);
    if (result.ok) {
        const agreements = await result.json();
        return {
            contents: agreements.items.map((a: typeof Agreement) => {
                return {
                    uri: `apap://agreements/${a.id}`,
                    mimeType: "application/json",
                    text: JSON.stringify({ ...a.data, $identifier: a.id }, null, 2),
                    ...a
                }
            })
        }
    }
    else {
        throw new Error('Failed to load agreement');
    }
}

async function draftAgreement(agreementId: string, format: string) : Promise<string> {
    console.log('draftAgreement: ' + agreementId);
    const result = await fetch(`${APAP_SERVER}/agreements/${agreementId}/convert/${format}`);
    if (result.ok) {
        const html = await result.text();
        return html;
    }
    else {
        throw new Error('Failed to convert agreement to html');
    }
}

const getServer = () => {
    const server = new McpServer({
        name: 'apap-mcp-server',
        version: '1.0.0',
    }, { capabilities: { logging: {} } });

    // register the templates
    server.resource('templates', "apap://templates", getTemplates);

    // register the agreements
    server.resource('agreements', "apap://agreements", getAgreements);

    server.tool(
        "convert-agreement-to-format",
        { agreementId: z.string(), format: z.enum(['html', 'markdown']) },
        async ({ agreementId, format }) => {
            const text = await draftAgreement(agreementId, format);
            return {
                content: [{ type: "text", text }]
            };
        }
    );
    return server;
};


// Map to store transports by session ID
// Store transports by session ID
const transports: Record<string, StreamableHTTPServerTransport | SSEServerTransport> = {};

//=============================================================================
// STREAMABLE HTTP TRANSPORT (PROTOCOL VERSION 2025-03-26)
//=============================================================================

// Handle all MCP Streamable HTTP requests (GET, POST, DELETE) on a single endpoint
router.all('/mcp', async (req: Request, res: Response) => {
    console.log(`Received ${req.method} request to /mcp`);
    console.log(JSON.stringify(req.body, null, 2));

    try {
        // Check for existing session ID
        const sessionId = req.headers['mcp-session-id'] as string | undefined;
        let transport: StreamableHTTPServerTransport;

        if (sessionId && transports[sessionId]) {
            // Check if the transport is of the correct type
            const existingTransport = transports[sessionId];
            if (existingTransport instanceof StreamableHTTPServerTransport) {
                // Reuse existing transport
                transport = existingTransport;
            } else {
                // Transport exists but is not a StreamableHTTPServerTransport (could be SSEServerTransport)
                res.status(400).json({
                    jsonrpc: '2.0',
                    error: {
                        code: -32000,
                        message: 'Bad Request: Session exists but uses a different transport protocol',
                    },
                    id: null,
                });
                return;
            }
        } else if (!sessionId && req.method === 'POST' && isInitializeRequest(req.body)) {
            const eventStore = new InMemoryEventStore();
            transport = new StreamableHTTPServerTransport({
                sessionIdGenerator: () => (crypto as any).randomUUID(),
                eventStore, // Enable resumability
                onsessioninitialized: (sessionId) => {
                    // Store the transport by session ID when session is initialized
                    console.log(`StreamableHTTP session initialized with ID: ${sessionId}`);
                    transports[sessionId] = transport;
                }
            });

            // Set up onclose handler to clean up transport when closed
            transport.onclose = () => {
                const sid = transport.sessionId;
                if (sid && transports[sid]) {
                    console.log(`Transport closed for session ${sid}, removing from transports map`);
                    delete transports[sid];
                }
            };

            // Connect the transport to the MCP server
            const server = getServer();
            await server.connect(transport);
            console.log('Connected server to transport');
        } else {
            console.log('Invalid request');
            // Invalid request - no session ID or not initialization request
            res.status(400).json({
                jsonrpc: '2.0',
                error: {
                    code: -32000,
                    message: 'Bad Request: No valid session ID provided',
                },
                id: null,
            });
            return;
        }

        // Handle the request with the transport
        await transport.handleRequest(req, res, req.body);
        console.log('Transport handled request');
    } catch (error) {
        console.error('Error handling MCP request:', error);
        if (!res.headersSent) {
            res.status(500).json({
                jsonrpc: '2.0',
                error: {
                    code: -32603,
                    message: 'Internal server error',
                },
                id: null,
            });
        }
    }
});

//=============================================================================
// DEPRECATED HTTP+SSE TRANSPORT (PROTOCOL VERSION 2024-11-05)
//=============================================================================

router.get('/sse', async (req: Request, res: Response) => {
    console.log('Received GET request to /sse (deprecated SSE transport)');
    const transport = new SSEServerTransport('/messages', res);
    transports[transport.sessionId] = transport;
    res.on("close", () => {
        delete transports[transport.sessionId];
    });
    const server = getServer();
    await server.connect(transport);
});

router.post("/messages", async (req: Request, res: Response) => {
    const sessionId = req.query.sessionId as string;
    let transport: SSEServerTransport;
    const existingTransport = transports[sessionId];
    if (existingTransport instanceof SSEServerTransport) {
        // Reuse existing transport
        transport = existingTransport;
    } else {
        // Transport exists but is not a SSEServerTransport (could be StreamableHTTPServerTransport)
        res.status(400).json({
            jsonrpc: '2.0',
            error: {
                code: -32000,
                message: 'Bad Request: Session exists but uses a different transport protocol',
            },
            id: null,
        });
        return;
    }
    if (transport) {
        await transport.handlePostMessage(req, res, req.body);
    } else {
        res.status(400).send('No transport found for sessionId');
    }
});

export default router;