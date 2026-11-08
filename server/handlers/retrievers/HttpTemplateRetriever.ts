import { ITemplateRetriever } from './ITemplateRetriever';
import { assertAllowedUrl } from './allowlist';

export const MAX_TEMPLATE_FILE_SIZE = 10 * 1024 * 1024; // 10MB limit (matches POST /templates/archive)

export class HttpTemplateRetriever implements ITemplateRetriever {
    public getURISchemes(): string[] {
        return ['https'];
    }

    async fetch(uri: string): Promise<Buffer> {
        const { host, pathname, search } = assertAllowedUrl(uri);

        // Map allowed host to trusted static origin literal to untaint destination for static analyzers (CodeQL)
        let baseUrl: string;
        if (host === 'templates.accordproject.org') {
            baseUrl = 'https://templates.accordproject.org';
        } else if (host === 'models.accordproject.org') {
            baseUrl = 'https://models.accordproject.org';
        } else if (host === 'raw.githubusercontent.com') {
            baseUrl = 'https://raw.githubusercontent.com';
        } else {
            // Intentional defense in depth; unreachable in practice after assertAllowedUrl
            throw new Error(`SSRF Prevention: Domain not in allowlist.`);
        }

        const finalUrl = `${baseUrl}${pathname}${search}`;

        // Explicit prefix check untaints destination URL for CodeQL static analysis
        if (
            !finalUrl.startsWith('https://templates.accordproject.org/') &&
            !finalUrl.startsWith('https://models.accordproject.org/') &&
            !finalUrl.startsWith('https://raw.githubusercontent.com/accordproject/')
        ) {
            throw new Error(`SSRF Prevention: URL does not match allowed origin prefix.`);
        }

        console.log(`[HttpTemplateRetriever] Fetching template from: ${finalUrl}`);
        
        const headers: Record<string, string> = {};

        // Only attach auth token to raw.githubusercontent.com under official accordproject org
        if (host === 'raw.githubusercontent.com' && process.env.EXTERNAL_TEMPLATE_TOKEN) {
            console.log(`[HttpTemplateRetriever] Attaching Authorization header for secure fetch.`);
            headers['Authorization'] = `Bearer ${process.env.EXTERNAL_TEMPLATE_TOKEN}`;
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        try {
            // codeql[js/request-forgery] URL destination is strictly validated against an origin prefix allowlist
            // SSRF guard: assertAllowedUrl validates scheme (https-only), port (443-only),
            // host (explicit allowlist), and userinfo (rejected) before this fetch.
            // CodeQL alert dismissed as false positive — do not remove assertAllowedUrl,
            // add redirect following, or expand the allowlist without re-reviewing the security posture.
            const response = await fetch(finalUrl, {
                headers,
                signal: controller.signal,
                redirect: 'error'
            });
            
            if (!response.ok) {
                throw new Error(`Failed to fetch template from ${finalUrl}: ${response.statusText} (${response.status})`);
            }

            const contentLength = response.headers?.get ? response.headers.get('content-length') : null;
            if (contentLength && parseInt(contentLength, 10) > MAX_TEMPLATE_FILE_SIZE) {
                throw new Error('Template file exceeds the 10MB size limit.');
            }

            const arrayBuffer = await response.arrayBuffer();
            if (arrayBuffer.byteLength > MAX_TEMPLATE_FILE_SIZE) {
                throw new Error('Template file exceeds the 10MB size limit.');
            }

            return Buffer.from(arrayBuffer);
        } finally {
            clearTimeout(timeoutId);
        }
    }
}
