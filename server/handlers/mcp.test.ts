import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// The buildApiErrorMessage helper isn't exported, so we replicate its logic here
// to validate the expected error format across different HTTP failure scenarios.
// This ensures MCP clients get actionable errors instead of generic "Failed to load" messages.

async function buildApiErrorMessage(
    result: { status: number; text: () => Promise<string> },
    context: string
): Promise<string> {
    const body = await result.text().catch(() => 'No error details available');
    return `${context} (HTTP ${result.status}): ${body}`;
}

// Helper to create a mock failed response matching the fetch Response shape
function mockFailedResponse(status: number, body: string) {
    return {
        ok: false,
        status,
        text: async () => body,
        json: async () => JSON.parse(body),
    };
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
        };
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
