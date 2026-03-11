import { ITemplateRetriever } from './ITemplateRetriever';

export class HttpTemplateRetriever implements ITemplateRetriever {
    async fetch(uri: string): Promise<Buffer> {
        if (!uri.startsWith('http://') && !uri.startsWith('https://')) {
            throw new Error(`Invalid URI scheme. HttpTemplateRetriever only supports http and https. Received: ${uri}`);
        }

        console.log(`[HttpTemplateRetriever] Fetching template from: ${uri}`);
        
        const headers: Record<string, string> = {};

        if (process.env.EXTERNAL_TEMPLATE_TOKEN) {
            console.log(`[HttpTemplateRetriever] Attaching Authorization header for secure fetch.`);
            headers['Authorization'] = `Bearer ${process.env.EXTERNAL_TEMPLATE_TOKEN}`;
        }

        const response = await fetch(uri, { headers });
        
        if (!response.ok) {
            throw new Error(`Failed to fetch template from ${uri}: ${response.statusText} (${response.status})`);
        }

        const arrayBuffer = await response.arrayBuffer();
        return Buffer.from(arrayBuffer);
    }
}