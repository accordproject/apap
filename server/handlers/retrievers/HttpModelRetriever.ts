import { IModelRetriever } from './IModelRetriever';
import { assertAllowedUrl } from './allowlist';

export const MAX_FILE_SIZE = 1024 * 1024; // 1MB limit for CTO models

export class HttpModelRetriever implements IModelRetriever {
    public getURISchemes(): string[] {
        return ['https'];
    }

    async fetchModel(uri: string): Promise<string> {
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
            throw new Error('SSRF Prevention: Domain not in allowlist.');
        }

        const finalUrl = `${baseUrl}${pathname}${search}`;

        // Explicit prefix check untaints destination URL for CodeQL static analysis
        // and prevents token leakage to non-accordproject repositories on GitHub
        if (
            !finalUrl.startsWith('https://templates.accordproject.org/') &&
            !finalUrl.startsWith('https://models.accordproject.org/') &&
            !finalUrl.startsWith('https://raw.githubusercontent.com/accordproject/')
        ) {
            throw new Error('SSRF Prevention: URL does not match allowed origin prefix.');
        }

        const headers: Record<string, string> = {};
        // Only attach auth token to raw.githubusercontent.com under official accordproject org
        if (host === 'raw.githubusercontent.com' && process.env.EXTERNAL_TEMPLATE_TOKEN) {
            headers['Authorization'] = `Bearer ${process.env.EXTERNAL_TEMPLATE_TOKEN}`;
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        try {
            // SSRF guard: assertAllowedUrl validates scheme (https-only), port (443-only),
            // host (explicit allowlist), and userinfo (rejected) before this fetch.
            // codeql[js/request-forgery]
            const response = await fetch(finalUrl, {
                headers,
                signal: controller.signal,
                redirect: 'error',
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch model from ${finalUrl}: ${response.statusText} (${response.status})`);
            }

            const contentLength = response.headers?.get ? response.headers.get('content-length') : null;
            if (contentLength && parseInt(contentLength, 10) > MAX_FILE_SIZE) {
                throw new Error('Model file exceeds the 1MB size limit.');
            }

            if (!response.body) {
                throw new Error('Response body is empty.');
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder('utf-8');
            let text = '';
            let byteCount = 0;

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                if (value) {
                    byteCount += value.length;
                    if (byteCount > MAX_FILE_SIZE) {
                        await reader.cancel();
                        throw new Error('Model file exceeds the 1MB size limit during download.');
                    }
                    text += decoder.decode(value, { stream: true });
                }
            }
            text += decoder.decode();

            return text;
        } catch (error: any) {
            if (
                error?.message?.startsWith('SSRF Prevention:') ||
                error?.message?.includes('exceeds the 1MB size limit') ||
                error?.name === 'AbortError' ||
                error?.message?.startsWith('Failed to fetch model from')
            ) {
                throw error;
            }
            console.error('[HttpModelRetriever Error]:', error);
            throw new Error(`Failed to securely fetch the external model: ${error?.message || 'Unknown error'}`);
        } finally {
            clearTimeout(timeoutId);
        }
    }
}
