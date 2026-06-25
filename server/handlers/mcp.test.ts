import { jest } from '@jest/globals';
import { __testables, buildApiErrorMessage } from './mcp';
import {
    AgreementConversionError,
    AgreementNotFoundError,
    ServiceError,
    TemplateNotFoundError,
} from '../services/errors';

const { serviceErrorToCallToolResult, serviceErrorToResourceError } = __testables;

// Helper to create a mock failed Response. Only the fields buildApiErrorMessage
// actually reads (ok, status, text) need to be present; the cast is safe because
// the function never touches the rest of the Response surface.
function mockFailedResponse(status: number, body: string): globalThis.Response {
    return {
        ok: false,
        status,
        text: async () => body,
        json: async () => JSON.parse(body),
    } as unknown as globalThis.Response;
}

describe('MCP Error Handling - buildApiErrorMessage', () => {

    it('should include HTTP 404 status when a resource is not found', async () => {
        const result = mockFailedResponse(404, '{"error": "Template not found"}');
        const msg = await buildApiErrorMessage(result, "Failed to load template 'late-delivery'");

        expect(msg).toContain('HTTP 404');
        expect(msg).toContain("Failed to load template 'late-delivery'");
        expect(msg).toContain('Template not found');
    });

    it('should include HTTP 400 status for validation errors', async () => {
        const result = mockFailedResponse(400, '{"error": "Invalid Concerto model"}');
        const msg = await buildApiErrorMessage(result, 'Failed to trigger agreement');

        expect(msg).toContain('HTTP 400');
        expect(msg).toContain('Invalid Concerto model');
    });

    it('should include HTTP 500 status for server errors', async () => {
        const result = mockFailedResponse(500, 'Internal Server Error');
        const msg = await buildApiErrorMessage(result, 'Failed to load agreements');

        expect(msg).toContain('HTTP 500');
        expect(msg).toContain('Internal Server Error');
    });

    it('should handle response body read failure gracefully', async () => {
        const result = {
            ok: false,
            status: 502,
            // Simulate a body that can't be read (stream already consumed, network error, etc.)
            text: async () => { throw new Error('body stream already read'); },
        } as unknown as globalThis.Response;
        const msg = await buildApiErrorMessage(result, 'Failed to convert agreement');

        expect(msg).toContain('HTTP 502');
        expect(msg).toContain('No error details available');
    });

    it('should preserve resource identifiers in error context', async () => {
        const result = mockFailedResponse(404, 'Not found');
        const msg = await buildApiErrorMessage(result, "Failed to load agreement 'agreement-abc-123'");

        expect(msg).toContain('agreement-abc-123');
        expect(msg).toContain('HTTP 404');
    });

    it('should include format info for conversion failures', async () => {
        const result = mockFailedResponse(422, '{"error": "Unsupported output format"}');
        const msg = await buildApiErrorMessage(result, "Failed to convert agreement 'agr-1' to pdf");

        expect(msg).toContain('agr-1');
        expect(msg).toContain('pdf');
        expect(msg).toContain('HTTP 422');
    });
});

describe('MCP Error Handling - error distinctness', () => {

    // The whole point of this fix: a 404, 400, and 500 should produce
    // different error messages so an MCP client can tell them apart
    it('should produce different messages for 404 vs 400 vs 500', async () => {
        const ctx = 'Failed to load template';

        const msg404 = await buildApiErrorMessage(
            mockFailedResponse(404, 'Not found'), ctx
        );
        const msg400 = await buildApiErrorMessage(
            mockFailedResponse(400, 'Validation failed'), ctx
        );
        const msg500 = await buildApiErrorMessage(
            mockFailedResponse(500, 'Internal error'), ctx
        );

        // All three must be distinct strings
        expect(msg404).not.toEqual(msg400);
        expect(msg400).not.toEqual(msg500);
        expect(msg404).not.toEqual(msg500);

        // Each contains its own status code
        expect(msg404).toContain('404');
        expect(msg400).toContain('400');
        expect(msg500).toContain('500');
    });

    // Make sure we didn't accidentally break the original context message
    it('should always start with the context string', async () => {
        const contexts = [
            "Failed to load template 'my-template'",
            "Failed to load agreement 'my-agreement'",
            "Failed to trigger agreement 'agr-99'",
            "Failed to convert agreement 'agr-1' to html",
            'Failed to load templates',
            'Failed to load agreements',
        ];

        for (const ctx of contexts) {
            const msg = await buildApiErrorMessage(
                mockFailedResponse(500, 'error'), ctx
            );
            expect(msg.startsWith(ctx)).toBe(true);
        }
    });
});

describe('mcp typed error helpers', () => {
    describe('serviceErrorToCallToolResult', () => {
        it('wraps a TemplateNotFoundError in an isError CallToolResult', () => {
            const err = new TemplateNotFoundError('tmpl-42');
            const result = serviceErrorToCallToolResult(err);

            expect(result.isError).toBe(true);
            expect(Array.isArray(result.content)).toBe(true);
            expect(result.content).toHaveLength(1);
            const block = (result.content as any[])[0];
            expect(block.type).toBe('text');

            const parsed = JSON.parse(block.text);
            expect(parsed.error.code).toBe('TEMPLATE_NOT_FOUND');
            expect(parsed.error.message).toContain('tmpl-42');
            expect(parsed.error.details).toEqual({ identifier: 'tmpl-42' });
        });

        it('preserves the AGREEMENT_NOT_FOUND code and identifier', () => {
            const err = new AgreementNotFoundError('999');
            const result = serviceErrorToCallToolResult(err);

            const parsed = JSON.parse((result.content as any[])[0].text);
            expect(parsed.error.code).toBe('AGREEMENT_NOT_FOUND');
            expect(parsed.error.details.identifier).toBe('999');
        });

        it('carries AGREEMENT_CONVERSION_FAILED details through to the wire payload', () => {
            const err = new AgreementConversionError('7', 'pdf', 'no renderer for pdf');
            const result = serviceErrorToCallToolResult(err);

            const parsed = JSON.parse((result.content as any[])[0].text);
            expect(parsed.error.code).toBe('AGREEMENT_CONVERSION_FAILED');
            expect(parsed.error.details).toEqual({
                agreementId: '7',
                format: 'pdf',
                reason: 'no renderer for pdf',
            });
        });
    });

    describe('serviceErrorToResourceError', () => {
        it('returns an Error whose message is the serialized ServiceError payload', () => {
            const err = new TemplateNotFoundError('tmpl-1');
            const wrapped = serviceErrorToResourceError(err);

            expect(wrapped).toBeInstanceOf(Error);
            const parsed = JSON.parse(wrapped.message);
            expect(parsed.error.code).toBe('TEMPLATE_NOT_FOUND');
            expect(parsed.error.message).toContain('tmpl-1');
        });

        it('round-trips arbitrary ServiceError subclasses', () => {
            const err = new ServiceError('CUSTOM', 418, 'I am a teapot', { teapot: true });
            const wrapped = serviceErrorToResourceError(err);

            const parsed = JSON.parse(wrapped.message);
            expect(parsed.error.code).toBe('CUSTOM');
            expect(parsed.error.message).toBe('I am a teapot');
            expect(parsed.error.details).toEqual({ teapot: true });
        });
    });
});
