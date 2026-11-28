import { HttpTemplateRetriever, MAX_TEMPLATE_FILE_SIZE } from './HttpTemplateRetriever';
import { jest } from '@jest/globals';
import { InvalidPayloadError } from '../../services/errors';

// Builds a streaming response body from the given chunks and records how many
// chunks the retriever actually pulled, so tests can check it stops early.
function bodyOf(...chunks: Uint8Array[]) {
    let pulled = 0;
    let cancelled = false;
    const stream = new ReadableStream<Uint8Array>({
        pull(controller: ReadableStreamDefaultController<Uint8Array>) {
            if (pulled < chunks.length) {
                controller.enqueue(chunks[pulled++]);
            } else {
                controller.close();
            }
        },
        cancel() {
            cancelled = true;
        }
    });
    return { stream, pulled: () => pulled, cancelled: () => cancelled };
}

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
        const bytes = new TextEncoder().encode(textData);
        (globalThis as any).fetch = jest.fn<any>().mockResolvedValue({
            ok: true,
            status: 200,
            headers: new Headers({ 'content-length': String(bytes.byteLength) }),
            body: bodyOf(bytes).stream
        });

        const result = await retriever.fetch('https://templates.accordproject.org/sample.cta');
        expect(Buffer.isBuffer(result)).toBe(true);
        expect(result.toString()).toBe('mock-cta-bytes');
    });

    it('only attaches Authorization header for raw.githubusercontent.com', async () => {
        process.env.EXTERNAL_TEMPLATE_TOKEN = 'secret-token-123';
        const fetchMock = jest.fn<any>().mockImplementation(async () => ({
            ok: true,
            status: 200,
            headers: new Headers(),
            body: bodyOf(Buffer.from('data')).stream
        }));
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
            body: bodyOf(Buffer.from('too-large')).stream
        });

        await expect(retriever.fetch('https://templates.accordproject.org/huge.cta'))
            .rejects.toThrow('Template file exceeds the 10MB size limit.');
    });

    it('rejects templates exceeding the 10MB size limit via streamed body length', async () => {
        (globalThis as any).fetch = jest.fn<any>().mockResolvedValue({
            ok: true,
            status: 200,
            headers: new Headers(),
            body: bodyOf(new Uint8Array(MAX_TEMPLATE_FILE_SIZE + 1)).stream
        });

        await expect(retriever.fetch('https://templates.accordproject.org/huge.cta'))
            .rejects.toThrow('Template file exceeds the 10MB size limit.');
    });

    it('stops reading a chunked body without Content-Length once it passes the limit', async () => {
        const oneMb = new Uint8Array(1024 * 1024);
        const body = bodyOf(...Array.from({ length: 50 }, () => oneMb)); // 50MB total
        (globalThis as any).fetch = jest.fn<any>().mockResolvedValue({
            ok: true,
            status: 200,
            headers: new Headers(),
            body: body.stream
        });

        const result = retriever.fetch('https://templates.accordproject.org/chunked.cta');
        await expect(result).rejects.toThrow('Template file exceeds the 10MB size limit.');
        await expect(result).rejects.toBeInstanceOf(InvalidPayloadError);

        // 11 x 1MB is the first point past 10MB; the rest of the stream is never read.
        expect(body.pulled()).toBeLessThanOrEqual(12);
        expect(body.cancelled()).toBe(true);
    });

    it('accepts a body that is exactly at the size limit', async () => {
        (globalThis as any).fetch = jest.fn<any>().mockResolvedValue({
            ok: true,
            status: 200,
            headers: new Headers(),
            body: bodyOf(new Uint8Array(MAX_TEMPLATE_FILE_SIZE)).stream
        });

        const result = await retriever.fetch('https://templates.accordproject.org/exact.cta');
        expect(result.byteLength).toBe(MAX_TEMPLATE_FILE_SIZE);
    });

    it('returns an empty buffer when the response has no body', async () => {
        (globalThis as any).fetch = jest.fn<any>().mockResolvedValue({
            ok: true,
            status: 200,
            headers: new Headers(),
            body: null
        });

        const result = await retriever.fetch('https://templates.accordproject.org/empty.cta');
        expect(result.byteLength).toBe(0);
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
            body: bodyOf(Buffer.from('data')).stream
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
