import { IModelRetriever } from './IModelRetriever';

export class HttpModelRetriever implements IModelRetriever {
    public getURISchemes(): string[] {
        return ['http', 'https'];
    }

    async fetchModel(uri: string): Promise<string> {
        if (!uri.startsWith('http://') && !uri.startsWith('https://')) {
            throw new Error(`Invalid URI scheme: ${uri}`);
        }

        const headers: Record<string, string> = {};

        if (process.env.EXTERNAL_TEMPLATE_TOKEN) {
            headers['Authorization'] = `Bearer ${process.env.EXTERNAL_TEMPLATE_TOKEN}`;
        }

        const response = await fetch(uri, { headers });
        
        if (!response.ok) {
            throw new Error(`Failed to fetch model from ${uri}: ${response.statusText} (${response.status})`);
        }

        return await response.text();
    }
}