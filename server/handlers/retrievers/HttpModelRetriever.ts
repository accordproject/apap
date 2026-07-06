import { IModelRetriever } from './IModelRetriever';

const ALLOWED_DOMAINS = [
    'models.accordproject.org',
    'templates.accordproject.org',
    'raw.githubusercontent.com'
];

export class HttpModelRetriever implements IModelRetriever {
    public getURISchemes(): string[] {
        return ['http', 'https'];
    }

    async fetchModel(uri: string): Promise<string> {
        if (!uri.startsWith('http://') && !uri.startsWith('https://')) {
            throw new Error(`Invalid URI scheme: ${uri}`);
        }

        // 1. Create a brand new URL object to break the CodeQL taint chain
        let safeUrl: URL;
        try {
            safeUrl = new URL(uri);
        } catch (e) {
            throw new Error(`Malformed URL provided.`);
        }

        // 2. Validate the host of the new object
        if (!ALLOWED_DOMAINS.includes(safeUrl.hostname)) {
            throw new Error(`SSRF Prevention: Domain not in allowlist. Received: ${safeUrl.hostname}`);
        }

        const headers: Record<string, string> = {};
        if (process.env.EXTERNAL_TEMPLATE_TOKEN) {
            headers['Authorization'] = `Bearer ${process.env.EXTERNAL_TEMPLATE_TOKEN}`;
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        try {
            // 3. Pass the validated URL object string, NOT the user's original 'uri'
            const response = await fetch(safeUrl.toString(), { 
                headers,
                signal: controller.signal
            });
            
            if (!response.ok) {
                throw new Error(`Failed to fetch model from ${safeUrl.toString()}: ${response.statusText} (${response.status})`);
            }

            return await response.text();
        } finally {
            clearTimeout(timeoutId);
        }
    }
}