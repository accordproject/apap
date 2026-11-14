import { HttpTemplateRetriever, MAX_TEMPLATE_FILE_SIZE } from './HttpTemplateRetriever';
import { jest } from '@jest/globals';

describe('HttpTemplateRetriever', () => {
    let retriever: HttpTemplateRetriever;
    let originalFetch: typeof globalThis.fetch;
    const originalEnv = process.env;

    beforeEach(() => {
        retriever = new HttpTemplateRetriever();
        originalFetch = globalThis.fetch;
        process.env = { ...originalEnv };
    });

    afterEach(() => {
        globalThis.fetch = originalFetch;
        process.env = originalEnv;
        jest.restoreAllMocks();
    });

    it('declares https as its supported URI scheme', () => {
        expect(retriever.getURISchemes()).toEqual(['https']);
    });

    it('rejects disallowed domains via allowlist before fetching', async () => {
        const fetchMock = jest.fn();
        globalThis.fetch = fetchMock as any;

        await expect(retriever.fetch('https://evil.com/template.cta'))
            .rejects.toThrow('SSRF Prevention: Domain not in allowlist.');

        expect(fetchMock).not.toHaveBeenCalled();
    });

    it('rejects plaintext http scheme before fetching', async () => {
        const fetchMock = jest.fn();
        globalThis.fetch = fetchMock as any;

        await expect(retriever.fetch('http://templates.accordproject.org/template.cta'))
            .rejects.toThrow('Invalid URI scheme. Only https is allowed.');

        expect(fetchMock).not.toHaveBeenCalled();
    });

    it('fetches successfully from templates.accordproject.org', async () => {
        const textData = 'mock-cta-bytes';
        const mockArrayBuffer = new TextEncoder().encode(textData).buffer;
        (globalThis as any).fetch = jest.fn<any>().mockResolvedValue({
            ok: true,
            status: 200,
            headers: new Headers({ 'content-length': String(mockArrayBuffer.byteLength) }),
            arrayBuffer: async () => mockArrayBuffer
        });

        const result = await retriever.fetch('https://templates.accordproject.org/sample.cta');
        expect(Buffer.isBuffer(result)).toBe(true);
        expect(result.toString()).toBe('mock-cta-bytes');
    });

    it('only attaches Authorization header for raw.githubusercontent.com', async () => {
        process.env.EXTERNAL_TEMPLATE_TOKEN = 'secret-token-123';
        const fetchMock = jest.fn<any>().mockResolvedValue({
            ok: true,
            status: 200,
            headers: new Headers(),
            arrayBuffer: async () => Buffer.from('data').buffer
        });
        (globalThis as any).fetch = fetchMock;

        // 1. templates.accordproject.org should NOT receive the token
        await retriever.fetch('https://templates.accordproject.org/test.cta');
        const firstCallHeaders = (fetchMock.mock.calls[0] as any)[1].headers;
        expect(firstCallHeaders['Authorization']).toBeUndefined();

        // 2. raw.githubusercontent.com under accordproject org SHOULD receive the token
        await retriever.fetch('https://raw.githubusercontent.com/accordproject/cicero-template-library/main/archives/test.cta');
        const secondCallHeaders = (fetchMock.mock.calls[1] as any)[1].headers;
        expect(secondCallHeaders['Authorization']).toBe('Bearer secret-token-123');
    });

    it('rejects templates exceeding the 10MB size limit via Content-Length header', async () => {
        (globalThis as any).fetch = jest.fn<any>().mockResolvedValue({
            ok: true,
            status: 200,
            headers: new Headers({ 'content-length': String(MAX_TEMPLATE_FILE_SIZE + 1) }),
            arrayBuffer: async () => Buffer.from('too-large').buffer
        });

        await expect(retriever.fetch('https://templates.accordproject.org/huge.cta'))
            .rejects.toThrow('Template file exceeds the 10MB size limit.');
    });

    it('rejects templates exceeding the 10MB size limit via buffer length', async () => {
        const largeBuffer = new Uint8Array(MAX_TEMPLATE_FILE_SIZE + 1);
        (globalThis as any).fetch = jest.fn<any>().mockResolvedValue({
            ok: true,
            status: 200,
            headers: new Headers(),
            arrayBuffer: async () => largeBuffer.buffer
        });

        await expect(retriever.fetch('https://templates.accordproject.org/huge.cta'))
            .rejects.toThrow('Template file exceeds the 10MB size limit.');
    });

    it('throws when HTTP response is not ok', async () => {
        (globalThis as any).fetch = jest.fn<any>().mockResolvedValue({
            ok: false,
            status: 404,
            statusText: 'Not Found'
        });

        await expect(retriever.fetch('https://templates.accordproject.org/missing.cta'))
            .rejects.toThrow('Failed to fetch template from https://templates.accordproject.org/missing.cta: Not Found (404)');
    });

    it('enforces redirect: error on fetch to prevent redirect-based filter evasion', async () => {
        const fetchMock = jest.fn<any>().mockResolvedValue({
            ok: true,
            status: 200,
            headers: new Headers(),
            arrayBuffer: async () => Buffer.from('data').buffer
        });
        (globalThis as any).fetch = fetchMock;

        await retriever.fetch('https://templates.accordproject.org/test.cta');
        expect(fetchMock).toHaveBeenCalledWith(
            'https://templates.accordproject.org/test.cta',
            expect.objectContaining({
                redirect: 'error'
            })
        );
    });

    it('rejects on a 302 redirect response status', async () => {
        (globalThis as any).fetch = jest.fn<any>().mockResolvedValue({
            ok: false,
            status: 302,
            statusText: 'Found'
        });

        await expect(retriever.fetch('https://templates.accordproject.org/redirect.cta'))
            .rejects.toThrow('Failed to fetch template from https://templates.accordproject.org/redirect.cta: Found (302)');
    });

    it('aborts the fetch request when exceeding the 5-second timeout', async () => {
        jest.useFakeTimers();
        try {
            (globalThis as any).fetch = jest.fn((url: string, options: any) => {
                return new Promise((_resolve, reject) => {
                    options.signal.addEventListener('abort', () => {
                        const abortError = new Error('The operation was aborted');
                        abortError.name = 'AbortError';
                        reject(abortError);
                    });
                });
            });

            const fetchPromise = retriever.fetch('https://templates.accordproject.org/slow.cta');
            jest.advanceTimersByTime(5001);

            await expect(fetchPromise).rejects.toThrow('The operation was aborted');
        } finally {
            jest.useRealTimers();
        }
    });
});
