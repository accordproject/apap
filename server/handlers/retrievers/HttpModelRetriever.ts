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

    private isAllowedUrl(urlString: string): boolean {
        try {
            const parsedUrl = new URL(urlString);
            return ALLOWED_DOMAINS.includes(parsedUrl.hostname);
        } catch (e) {
            return false;
        }
    }

    async fetchModel(uri: string): Promise<string> {
        if (!uri.startsWith('http://') && !uri.startsWith('https://')) {
            throw new Error(`Invalid URI scheme: ${uri}`);
        }

        if (!this.isAllowedUrl(uri)) {
            throw new Error(`SSRF Prevention: Domain not in allowlist. Received: ${uri}`);
        }

        const headers: Record<string, string> = {};

        if (process.env.EXTERNAL_TEMPLATE_TOKEN) {
            headers['Authorization'] = `Bearer ${process.env.EXTERNAL_TEMPLATE_TOKEN}`;
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        try {
            const response = await fetch(uri, { 
                headers,
                signal: controller.signal
            });
            
            if (!response.ok) {
                throw new Error(`Failed to fetch model from ${uri}: ${response.statusText} (${response.status})`);
            }

            return await response.text();
        } finally {
            clearTimeout(timeoutId);
        }
    }
}