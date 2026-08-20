import { IModelRetriever } from './IModelRetriever';

export const MAX_FILE_SIZE = 1024 * 1024; 

export function assertAllowedUrl(uri: string): URL {
    if (!uri.startsWith('https://')) {
        throw new Error(`Invalid URI scheme. Only https is allowed.`);
    }

    let safeUrl: URL;
    try {
        safeUrl = new URL(uri);
    } catch (e) {
        throw new Error(`Malformed URL provided.`);
    }

    if (safeUrl.port !== '' && safeUrl.port !== '443') {
        throw new Error(`SSRF Prevention: Custom ports are not allowed.`);
    }

    const host = safeUrl.hostname;

    if (
        host !== 'models.accordproject.org' &&
        host !== 'templates.accordproject.org' &&
        host !== 'raw.githubusercontent.com'
    ) {
        throw new Error(`SSRF Prevention: Domain not in allowlist.`);
    }

    if (host === 'raw.githubusercontent.com' && !safeUrl.pathname.startsWith('/accordproject/')) {
        throw new Error(`SSRF Prevention: Only official accordproject GitHub repositories are allowed.`);
    }

    return safeUrl;
}

export class HttpModelRetriever implements IModelRetriever {
    public getURISchemes(): string[] {
        return ['https'];
    }

    async fetchModel(uri: string): Promise<string> {
        const safeUrl = assertAllowedUrl(uri);

        const headers: Record<string, string> = {};
        if (process.env.EXTERNAL_TEMPLATE_TOKEN) {
            headers['Authorization'] = `Bearer ${process.env.EXTERNAL_TEMPLATE_TOKEN}`;
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        try {
            const response = await fetch(safeUrl.toString(), { 
                headers,
                signal: controller.signal,
                redirect: 'error'
            });
            
            if (!response.ok) {
                throw new Error(`HTTP request failed with status ${response.status}`);
            }

            const contentLength = response.headers.get('content-length');
            if (contentLength && parseInt(contentLength, 10) > MAX_FILE_SIZE) {
                throw new Error('Model file exceeds the 1MB size limit.');
            }

            const text = await response.text();
            
            if (Buffer.byteLength(text, 'utf8') > MAX_FILE_SIZE) {
                throw new Error('Model file exceeds the 1MB size limit after download.');
            }

            return text;
        } catch (error: any) {
            console.error(`[HttpModelRetriever Error]:`, error);
            throw new Error('Failed to securely fetch the external model. Ensure the URL is valid, public, and within allowed limits.');
        } finally {
            clearTimeout(timeoutId);
        }
    }
}