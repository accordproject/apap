import express, { Request, Response } from 'express';
import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from 'zod';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { isInitializeRequest, CallToolResult, GetPromptResult, ReadResourceResult } from "@modelcontextprotocol/sdk/types.js";
import * as crypto from "crypto";
import { InMemoryEventStore } from './inmemoryeventstore';
import { Agreement, Template } from '../db/schema';

const router = express.Router();

// Get API base URL from environment variable, default to localhost:9000
const API_BASE_URL = process.env.APAP_API_BASE_URL || 'http://localhost:9000';

// Get API authorization header from environment variable (optional)
const API_AUTH_HEADER = process.env.APAP_API_AUTH_HEADER;

// Helper function to make authenticated API requests
async function makeApiRequest(url: string, options: RequestInit = {}) {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string> || {}),
    };
    
    if (API_AUTH_HEADER) {
        headers['Authorization'] = API_AUTH_HEADER;
    }
    
    return fetch(url, {
        ...options,
        headers,
    });
}

async function getTemplate(uri: URL, { templateId }: { templateId: string }) {
    const result = await fetch(`/templates/${templateId}`);
    if (result.ok) {
        const template = result.json();
        return {
            ...template,
            uri
        }
    }
    else {
        throw new Error('Failed to load template');
    }
}

async function getAgreement(uri: string, { agreementId }: { agreementId: string }) {
    console.log(`Fetching agreement with ID: ${agreementId}`);
    const url = new URL(uri);
    const result = await makeApiRequest(`${API_BASE_URL}/agreements/${agreementId}`);
    if (result.ok) {
        const agreement = await result.json();
        console.log(`Successfully fetched agreement: ${JSON.stringify(agreement)}`);
        return {
            contents: [{
                uri: url.toString(),
                mimeType: "application/json",
                text: JSON.stringify(agreement)
            }]
        };
    }
    else {
        console.error(`Failed to load agreement with ID: ${agreementId}`);
        throw new Error('Failed to load agreement');
    }
}

async function getTemplates(uri: URL) {
    console.log('getTemplates: ' + uri);
    const result = await makeApiRequest(`${API_BASE_URL}/templates`);
    if (result.ok) {
        const templates = await result.json();
        console.log(`Successfully fetched templates: ${JSON.stringify(templates)}`);
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
        console.error('Failed to load templates');
        throw new Error('Failed to load template');
    }
}

async function getAgreements(uri: URL) {
    console.log('getAgreements: ' + uri);
    const result = await makeApiRequest(`${API_BASE_URL}/agreements`);
    if (result.ok) {
        const agreements = await result.json();
        console.log(`Successfully fetched agreements: ${JSON.stringify(agreements)}`);
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
        console.error('Failed to load agreements');
        throw new Error('Failed to load agreement');
    }
}

async function draftAgreement(agreementId: string, format: string) : Promise<string> {
    console.log('draftAgreement: ' + agreementId);
    const result = await makeApiRequest(`${API_BASE_URL}/agreements/${agreementId}/convert/${format}`);
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

    server.resource(
        "agreement",
        new ResourceTemplate("apap://agreements/{agreementId}", {
            list: async () => {
                const result = await makeApiRequest(`${API_BASE_URL}/agreements`);
                if (result.ok) {
                    const agreements = await result.json();
                    return {
                        resources: agreements.items.map((a: typeof Agreement) => {
                            return {
                                ...a,
                                uri: `apap://agreements/${a.id}`
                            }
                        })
                    }
                }
                else {
                    return { resources: [] };
                }
            }
        }),
        async (uri: URL, variables: any) => {
            const agreementId = variables.agreementId;
            return await getAgreement(uri.toString(), { agreementId });
        }
    );

    // register a tool that can convert an agreement to HTML
    // server.tool(
    //     'convert-agreement-to-html',
    //     'Converts an existing agreement to HTML',
    //     {
    //         agreementId: z.string(),
    //         readOnlyHint: true,
    //         destructiveHint: false,
    //         idempotentHint: true,
    //         openWorldHint: false,
    //     },
    //     async ({ agreementId }): Promise<CallToolResult> => draftAgreement(agreementId)
    // );
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

    server.tool(
        'getTemplate',
        'Retrieve a template by ID',
        {
            templateId: z.string(),
        },
        {
            readOnlyHint: true,
            destructiveHint: false,
            idempotentHint: true,
            openWorldHint: false,
        },
        async ({ templateId }): Promise<CallToolResult> => {
            const result = await makeApiRequest(`${API_BASE_URL}/templates/${templateId}`);
            if (result.ok) {
                const template = await result.json();
                return {
                    content: [{ type: "text", text: JSON.stringify(template) }]
                };
            } else {
                throw new Error('Failed to load template');
            }
        }
    );

    server.tool(
        'getAgreement',
        'Retrieve an agreement by ID',
        {
            agreementId: z.string(),
        },
        {
            readOnlyHint: true,
            destructiveHint: false,
            idempotentHint: true,
            openWorldHint: false,
        },
        async ({ agreementId }): Promise<CallToolResult> => {
            const result = await makeApiRequest(`${API_BASE_URL}/agreements/${agreementId}`);
            if (result.ok) {
                const agreement = await result.json();
                return {
                    content: [{ type: "text", text: JSON.stringify(agreement) }]
                };
            } else {
                throw new Error('Failed to load agreement');
            }
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

// New function to register a resource with the MCP server
function registerResource({ name, description, parameters, handler }: { name: string; description: string; parameters: z.ZodObject<any>; handler: (params: any) => Promise<any> }) {
    const server = getServer();
    server.resource(name, `apap://${name}`, async (uri: URL) => {
        const params = parameters.parse(uri.searchParams);
        return await handler(params);
    });
}

// Example usage of registerResource to register an 'agreement' resource
// registerResource({
//   name: 'agreement',
//   description: 'Retrieve a smart legal agreement by ID',
//   parameters: z.object({ id: z.string() }),
//   handler: async ({ id }) => {
//     // Fetch agreement from APAP
//     const result = await fetch(`http://localhost:9000/agreements/${id}`);
//     if (result.ok) {
//       const agreement = await result.json();
//       return {
//         uri: `apap://agreement/${id}`,
//         mimeType: "application/json",
//         text: JSON.stringify(agreement)
//       };
//     } else {
//       throw new Error('Failed to load agreement');
//     }
//   }
// });

export default router;