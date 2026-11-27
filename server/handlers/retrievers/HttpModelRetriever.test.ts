import { HttpModelRetriever, MAX_FILE_SIZE } from './HttpModelRetriever';
import { jest } from '@jest/globals';

describe('HttpModelRetriever', () => {
    let retriever: HttpModelRetriever;
    let originalFetch: typeof globalThis.fetch;
    const originalEnv = process.env;

    beforeEach(() => {
        retriever = new HttpModelRetriever();
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

        await expect(retriever.fetchModel('https://evil.com/model.cto'))
            .rejects.toThrow('SSRF Prevention: Domain not in allowlist.');

        expect(fetchMock).not.toHaveBeenCalled();
    });

    it('rejects plaintext http scheme before fetching', async () => {
        const fetchMock = jest.fn();
        globalThis.fetch = fetchMock as any;

        await expect(retriever.fetchModel('http://models.accordproject.org/model.cto'))
            .rejects.toThrow('Invalid URI scheme. Only https is allowed.');

        expect(fetchMock).not.toHaveBeenCalled();
    });

    it('fetches successfully from models.accordproject.org', async () => {
        const modelText = 'namespace org.accordproject.test\nasset Car identified by vin { o String vin }';
        const mockBytes = new TextEncoder().encode(modelText);
        let streamRead = false;

        const mockBody = {
            getReader() {
                return {
                    read: async () => {
                        if (!streamRead) {
                            streamRead = true;
                            return { done: false, value: mockBytes };
                        }
                        return { done: true, value: undefined };
                    },
                    cancel: async () => {},
                };
            },
        };

        (globalThis as any).fetch = jest.fn<any>().mockResolvedValue({
            ok: true,
            status: 200,
            headers: new Headers({ 'content-length': String(mockBytes.length) }),
            body: mockBody,
        });

        const result = await retriever.fetchModel('https://models.accordproject.org/model.cto');
        expect(result).toBe(modelText);
    });

    it('rejects foreign repositories on raw.githubusercontent.com to prevent token leakage and untrusted models', async () => {
        const fetchMock = jest.fn();
        globalThis.fetch = fetchMock as any;

        await expect(retriever.fetchModel('https://raw.githubusercontent.com/attacker/malicious-repo/main/model.cto'))
            .rejects.toThrow('SSRF Prevention: Only official accordproject GitHub repositories are allowed.');

        expect(fetchMock).not.toHaveBeenCalled();
    });

    it('only attaches Authorization header for official accordproject org on raw.githubusercontent.com', async () => {
        process.env.EXTERNAL_TEMPLATE_TOKEN = 'secret-model-token-456';
        const modelContent = 'namespace org.accordproject.official';
        const mockBytes = new TextEncoder().encode(modelContent);

        const createMockBody = () => {
            let readOnce = false;
            return {
                getReader() {
                    return {
                        read: async () => {
                            if (!readOnce) {
                                readOnce = true;
                                return { done: false, value: mockBytes };
                            }
                            return { done: true, value: undefined };
                        },
                        cancel: async () => {},
                    };
                },
            };
        };

        const fetchMock = jest.fn<any>().mockImplementation(async () => ({
            ok: true,
            status: 200,
            headers: new Headers({ 'content-length': String(mockBytes.length) }),
            body: createMockBody(),
        }));
        (globalThis as any).fetch = fetchMock;

        // 1. models.accordproject.org should NOT receive the token
        await retriever.fetchModel('https://models.accordproject.org/official.cto');
        const firstCallHeaders = (fetchMock.mock.calls[0] as any)[1].headers;
        expect(firstCallHeaders['Authorization']).toBeUndefined();

        // 2. raw.githubusercontent.com under accordproject org SHOULD receive the token
        await retriever.fetchModel('https://raw.githubusercontent.com/accordproject/models/main/model.cto');
        const secondCallHeaders = (fetchMock.mock.calls[1] as any)[1].headers;
        expect(secondCallHeaders['Authorization']).toBe('Bearer secret-model-token-456');
    });

    it('rejects models exceeding the 1MB size limit via Content-Length header', async () => {
        (globalThis as any).fetch = jest.fn<any>().mockResolvedValue({
            ok: true,
            status: 200,
            headers: new Headers({ 'content-length': String(MAX_FILE_SIZE + 1) }),
            body: {},
        });

        await expect(retriever.fetchModel('https://models.accordproject.org/huge.cto'))
            .rejects.toThrow('Model file exceeds the 1MB size limit.');
    });

    it('rejects models exceeding the 1MB size limit during streaming download', async () => {
        const largeChunk = new Uint8Array(MAX_FILE_SIZE + 1);
        const cancelMock = jest.fn().mockResolvedValue(undefined as never);

        const mockBody = {
            getReader() {
                return {
                    read: async () => ({ done: false, value: largeChunk }),
                    cancel: cancelMock,
                };
            },
        };

        (globalThis as any).fetch = jest.fn<any>().mockResolvedValue({
            ok: true,
            status: 200,
            headers: new Headers(),
            body: mockBody,
        });

        await expect(retriever.fetchModel('https://models.accordproject.org/huge-stream.cto'))
            .rejects.toThrow('Model file exceeds the 1MB size limit during download.');
        expect(cancelMock).toHaveBeenCalled();
    });

    it('throws when HTTP response is not ok', async () => {
        (globalThis as any).fetch = jest.fn<any>().mockResolvedValue({
            ok: false,
            status: 404,
            statusText: 'Not Found',
        });

        await expect(retriever.fetchModel('https://models.accordproject.org/missing.cto'))
            .rejects.toThrow('Failed to fetch model from https://models.accordproject.org/missing.cto: Not Found (404)');
    });

    it('enforces redirect: error on fetch to prevent redirect-based filter evasion', async () => {
        const mockBytes = new TextEncoder().encode('namespace org.test');
        let readOnce = false;

        const fetchMock = jest.fn<any>().mockResolvedValue({
            ok: true,
            status: 200,
            headers: new Headers(),
            body: {
                getReader() {
                    return {
                        read: async () => {
                            if (!readOnce) {
                                readOnce = true;
                                return { done: false, value: mockBytes };
                            }
                            return { done: true, value: undefined };
                        },
                        cancel: async () => {},
                    };
                },
            },
        });
        (globalThis as any).fetch = fetchMock;

        await retriever.fetchModel('https://models.accordproject.org/test.cto');
        expect(fetchMock).toHaveBeenCalledWith(
            'https://models.accordproject.org/test.cto',
            expect.objectContaining({
                redirect: 'error',
            }),
        );
    });

    it('aborts the fetch request when exceeding the 5-second timeout', async () => {
        jest.useFakeTimers();
        try {
            (globalThis as any).fetch = jest.fn((_url: string, options: any) => {
                return new Promise((_resolve, reject) => {
                    options.signal.addEventListener('abort', () => {
                        const abortError = new Error('The operation was aborted');
                        abortError.name = 'AbortError';
                        reject(abortError);
                    });
                });
            });

            const fetchPromise = retriever.fetchModel('https://models.accordproject.org/slow.cto');
            jest.advanceTimersByTime(5001);

            await expect(fetchPromise).rejects.toThrow('The operation was aborted');
        } finally {
            jest.useRealTimers();
        }
    });
});
