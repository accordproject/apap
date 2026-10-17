import { IModelRetriever } from './IModelRetriever';
import { assertAllowedUrl } from './allowlist';

export const MAX_FILE_SIZE = 1024 * 1024;

export class HttpModelRetriever implements IModelRetriever {
    public getURISchemes(): string[] {
        return ['https'];
    }

    async fetchModel(uri: string): Promise<string> {
        const { host, pathname, search } = assertAllowedUrl(uri);
        const finalUrl = `https://${host}${pathname}${search}`;

        const headers: Record<string, string> = {};
        if (host === 'raw.githubusercontent.com' && process.env.EXTERNAL_TEMPLATE_TOKEN) {
            headers['Authorization'] = `Bearer ${process.env.EXTERNAL_TEMPLATE_TOKEN}`;
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        try {
            // SSRF guard: assertAllowedUrl validates scheme (https-only), port (443-only),
            // host (explicit allowlist), and userinfo (rejected) before this fetch.
            // CodeQL alert dismissed as false positive — do not remove assertAllowedUrl,
            // add redirect following, or expand the allowlist without re-reviewing the security posture.
            const response = await fetch(`https://${host}${pathname}${search}`, {
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
            console.error(`[HttpModelRetriever Error]:`, error);
            throw new Error('Failed to securely fetch the external model. Ensure the URL is valid, public, and within allowed limits.');
        } finally {
            clearTimeout(timeoutId);
        }
    }
}
