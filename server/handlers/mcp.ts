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
const API_BASE_URL = process.env.API_BASE_URL || `http://${HOST}:${PORT}`

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

// Builds a meaningful error message from a failed API response so that MCP clients
// can tell apart a 404 (resource missing) from a 400 (bad input) or a 500 (server issue).
// Without this, every failure just says "Failed to load ..." which is impossible to debug.
async function buildApiErrorMessage(result: globalThis.Response, context: string): Promise<string> {
    const body = await result.text().catch(() => 'No error details available');
    return `${context} (HTTP ${result.status}): ${body}`;
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
        // Surface the actual status code and API response so the client knows what went wrong
        const errorMsg = await buildApiErrorMessage(result, `Failed to load agreement '${agreementId}'`);
        console.error(errorMsg);
        throw new Error(errorMsg);
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
        // Previously just threw "Failed to load template" with no status or details
        const errorMsg = await buildApiErrorMessage(result, 'Failed to load templates');
        console.error(errorMsg);
        throw new Error(errorMsg);
    }
}

async function getAgreements(uri: URL) {
    console.log('getAgreements: ' + uri);
    const result = await makeApiRequest(`${API_BASE_URL}/agreements`);
    if (result.ok) {
        const agreements = await result.json();
        console.log(`Successfully fetched agreements: ${JSON.stringify(agreements)}`);
        return {
            // FIX for issue #128: The previous version spread the full agreement object
            // (...a) after setting the uri field. Because the Agreement row from the
            // database carries its own `uri` property (e.g. "resource:org.accordproject..."),
            // the spread overwrote the MCP resource URI ("apap://agreements/{id}") with the
            // agreement's data URI. MCP clients then failed to resolve the resource because
            // they tried to use the wrong URI scheme.
            //
            // The ReadResourceResult `contents` array only needs { uri, mimeType, text },
            // so spreading the entire row object onto it was also polluting the content
            // with unrelated database fields. The agreement payload is already serialized
            // inside the `text` property as JSON, which is where MCP clients read it from.
            contents: agreements.items.map((a: typeof Agreement) => {
                return {
                    mimeType: "application/json",
                    text: JSON.stringify({ ...a.data, $identifier: a.id }, null, 2),
                    uri: `apap://agreements/${a.id}`
                }
            })
        }
    }
    else {
        const errorMsg = await buildApiErrorMessage(result, 'Failed to load agreements');
        console.error(errorMsg);
        throw new Error(errorMsg);
    }
}

async function draftAgreement(agreementId: string, format: string) : Promise<string> {
    console.log('draftAgreement: ' + agreementId);
    const result = await makeApiRequest(`${API_BASE_URL}/agreements/${agreementId}/convert/${format}`);
    if (result.ok) {
        const text = await result.text();
        return text;
    }
    else {
        // Include the agreement ID and target format so the caller knows exactly which conversion failed
        const errorMsg = await buildApiErrorMessage(result, `Failed to convert agreement '${agreementId}' to ${format}`);
        console.error(errorMsg);
        throw new Error(errorMsg);
    }
}

async function triggerAgreement(agreementId: string, body: string) : Promise<string> {
    console.log('triggerAgreement: ' + agreementId);
    console.log('body: ' + body);
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    const result = await makeApiRequest(`${API_BASE_URL}/agreements/${agreementId}/trigger`,
        {
            method: "POST",
            headers,
            body
        });
    if (result.ok) {
        const json = await result.json();
        return JSON.stringify(json);
    }
    else {
        // Trigger failures are especially important to surface clearly since they often
        // come from bad payload shapes that don't match the template's request type
        const errorMsg = await buildApiErrorMessage(result, `Failed to trigger agreement '${agreementId}'`);
        console.error(errorMsg);
        throw new Error(errorMsg);
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

    // register resource template for agreements
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
                                name: `agreement-${a.id}`,
                                ...a,
                                uri: `apap://agreements/${a.id}`
                            }
                        })
                    }
                }
                else {
                    // List operations return empty rather than throwing, but we still log
                    // the actual error for debugging
                    const errorMsg = await buildApiErrorMessage(result, 'Failed to list agreements');
                    console.error(errorMsg);
                    return { resources: [] };
                }
            }
        }),
        async (uri: URL, variables: any) => {
            const agreementId = variables.agreementId;
            return await getAgreement(uri.toString(), { agreementId });
        }
    );

    // register resource template for templates
    server.resource(
        "template",
        new ResourceTemplate("apap://templates/{templateId}", {
            list: async () => {
                const result = await makeApiRequest(`${API_BASE_URL}/templates`);
                if (result.ok) {
                    const templates = await result.json();
                    return {
                        resources: templates.items.map((t: typeof Template) => {
                            return {
                                name: `template-${t.id}`,
                                ...t,
                                uri: `apap://templates/${t.id}`
                            }
                        })
                    }
                }
                else {
                    const errorMsg = await buildApiErrorMessage(result, 'Failed to list templates');
                    console.error(errorMsg);
                    return { resources: [] };
                }
            }
        }),
        async (uri: URL, variables: any) => {
            const templateId = variables.templateId;
            const result = await makeApiRequest(`${API_BASE_URL}/templates/${templateId}`);
            if (result.ok) {
                const template = await result.json();
                return {
                    contents: [{
                        uri: uri.toString(),
                        mimeType: "application/json",
                        text: JSON.stringify(template)
                    }]
                };
            }
            else {
                const errorMsg = await buildApiErrorMessage(result, `Failed to load template '${templateId}'`);
                console.error(errorMsg);
                throw new Error(errorMsg);
            }
        }
    );

    // register the format conversion tool
    server.tool(
        "convert-agreement-to-format",
        "Converts an existing agreement to an output format",
        { agreementId: z.string(), format: z.enum(['html', 'markdown']) },
        async ({ agreementId, format }) => {
            const text = await draftAgreement(agreementId, format);
            return {
                content: [{ type: "text", text }]
            };
        }
    );

    // register the trigger tool
    server.tool(
        "trigger-agreement",
        `Sends JSON data (as a string) to an existing agreement, evaluating the logic of the agreement against the input data.
The schema for the JSON object must be one of the transaction types which extend 'Request' defined in the model for the agreement's template.
Refer to the agreement's template model to determine which fields are required or optional.`,
        { agreementId: z.string(), payload: z.string() },
        async ({ agreementId, payload }) => {
            const result = await triggerAgreement(agreementId, payload);
            return {
                content: [{ type: "text", text: result }]
            };
        }
    );

    // register the getTemplate tool
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
                const errorMsg = await buildApiErrorMessage(result, `Failed to load template '${templateId}'`);
                console.error(errorMsg);
                throw new Error(errorMsg);
            }
        }
    );

    // register the getAgreement tool
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
                const errorMsg = await buildApiErrorMessage(result, `Failed to load agreement '${agreementId}'`);
                console.error(errorMsg);
                throw new Error(errorMsg);
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

const router = express.Router();

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