/**
 * Typed error hierarchy for the service and handler layers.
 *
 * Handlers in this repo currently throw bare `Error` strings everywhere
 * (e.g. `throw new Error('Failed to load template')`). That gives callers
 * no way to distinguish a 404 from a 500, and gives clients nothing
 * actionable in the response body.
 *
 * Each error here carries:
 *   - a machine-readable `code` (e.g. `TEMPLATE_NOT_FOUND`) for both REST
 *     and MCP client consumers
 *   - an HTTP `statusCode` for the REST catch block
 *   - a JSON-RPC `jsonRpcCode` for the MCP catch block, chosen from the
 *     `-32020..-32099` range reserved for implementation-defined MCP
 *     errors (see mcp.ts `serviceErrorToResourceError`)
 *   - a human `message` and optional structured `details`
 *
 * Route catch blocks map `ServiceError` into the right HTTP or JSON-RPC
 * response shape; anything that is NOT a `ServiceError` is a genuine
 * bug and gets treated as a 500 / -32603.
 */

// -- JSON-RPC code range for APAP-defined MCP errors --
//
// The MCP spec reserves `-32020..-32099` for implementation-defined error
// codes (JSON-RPC standard codes -32700..-32603 stay reserved for transport
// and protocol errors, and -32000..-32019 is the legacy pre-policy range).
// Each APAP `ServiceError` subclass picks one code from this range so MCP
// clients can branch on the integer code without parsing message strings.
export const MCP_ERROR_CODES = {
    // Resource lookup failures (align with SEP-2164 semantics but keep the
    // MCP-specific range so clients can distinguish "our not-found" from
    // "generic JSON-RPC invalid params").
    TEMPLATE_NOT_FOUND: -32020,
    AGREEMENT_NOT_FOUND: -32021,
    // Resource conflicts.
    TEMPLATE_DUPLICATE: -32022,
    // Domain-level processing failures.
    AGREEMENT_CONVERSION_FAILED: -32023,
    AGREEMENT_TRIGGER_FAILED: -32024,
    // Input problems.
    INVALID_PAYLOAD: -32025,
    VALIDATION_ERROR: -32026,
    // Upstream / infrastructure failures.
    UPSTREAM_API_ERROR: -32027,
    // Generic fallback for a bare `ServiceError` with no more specific type.
    SERVICE_ERROR: -32028,
} as const;

export type McpErrorCode = typeof MCP_ERROR_CODES[keyof typeof MCP_ERROR_CODES];

export class ServiceError extends Error {
    public readonly code: string;
    public readonly statusCode: number;
    public readonly jsonRpcCode: number;
    public readonly details?: Record<string, unknown>;

    constructor(
        code: string,
        statusCode: number,
        jsonRpcCode: number,
        message: string,
        details?: Record<string, unknown>,
    ) {
        super(message);
        this.name = 'ServiceError';
        this.code = code;
        this.statusCode = statusCode;
        this.jsonRpcCode = jsonRpcCode;
        this.details = details;

        // Preserve prototype chain so `instanceof` works after transpilation.
        Object.setPrototypeOf(this, new.target.prototype);
    }

    /** Serialize for HTTP response bodies. Stack trace stays in server logs. */
    toJSON() {
        return {
            error: {
                code: this.code,
                message: this.message,
                ...(this.details && { details: this.details }),
            },
        };
    }
}

// -- Template errors --

export class TemplateNotFoundError extends ServiceError {
    constructor(identifier: string | number) {
        super(
            'TEMPLATE_NOT_FOUND',
            404,
            MCP_ERROR_CODES.TEMPLATE_NOT_FOUND,
            `Template not found: ${identifier}`,
            { identifier },
        );
        this.name = 'TemplateNotFoundError';
    }
}

export class TemplateDuplicateError extends ServiceError {
    constructor(uri: string) {
        super(
            'TEMPLATE_DUPLICATE',
            409,
            MCP_ERROR_CODES.TEMPLATE_DUPLICATE,
            `Template with URI already exists: ${uri}`,
            { uri },
        );
        this.name = 'TemplateDuplicateError';
    }
}

// -- Agreement errors --

export class AgreementNotFoundError extends ServiceError {
    constructor(identifier: string | number) {
        super(
            'AGREEMENT_NOT_FOUND',
            404,
            MCP_ERROR_CODES.AGREEMENT_NOT_FOUND,
            `Agreement not found: ${identifier}`,
            { identifier },
        );
        this.name = 'AgreementNotFoundError';
    }
}

export class AgreementConversionError extends ServiceError {
    constructor(agreementId: string | number, format: string, reason?: string) {
        super(
            'AGREEMENT_CONVERSION_FAILED',
            500,
            MCP_ERROR_CODES.AGREEMENT_CONVERSION_FAILED,
            `Failed to convert agreement ${agreementId} to ${format}${reason ? ': ' + reason : ''}`,
            { agreementId, format, reason },
        );
        this.name = 'AgreementConversionError';
    }
}

// -- Generic input + validation errors --

export class InvalidPayloadError extends ServiceError {
    constructor(message: string, details?: Record<string, unknown>) {
        super(
            'INVALID_PAYLOAD',
            400,
            MCP_ERROR_CODES.INVALID_PAYLOAD,
            message,
            details,
        );
        this.name = 'InvalidPayloadError';
    }
}

export class ValidationError extends ServiceError {
    constructor(message: string, details?: Record<string, unknown>) {
        super(
            'VALIDATION_ERROR',
            422,
            MCP_ERROR_CODES.VALIDATION_ERROR,
            message,
            details,
        );
        this.name = 'ValidationError';
    }
}

// -- Upstream / inter-service errors --

/**
 * Raised when an MCP handler (or any service) calls into an upstream HTTP
 * dependency that returns a non-2xx response. Carries the URL, status, and
 * raw body so route catch blocks can decide whether to surface this as a
 * 502 to the caller or branch on the upstream status. Discussed in #143.
 */
export class UpstreamApiError extends ServiceError {
    public readonly upstreamUrl: string;
    public readonly httpStatus: number;
    public readonly upstreamBody: string;

    constructor(upstreamUrl: string, httpStatus: number, upstreamBody: string) {
        super(
            'UPSTREAM_API_ERROR',
            502,
            MCP_ERROR_CODES.UPSTREAM_API_ERROR,
            `Upstream API call to ${upstreamUrl} failed with HTTP ${httpStatus}`,
            { upstreamUrl, httpStatus, upstreamBody },
        );
        this.name = 'UpstreamApiError';
        this.upstreamUrl = upstreamUrl;
        this.httpStatus = httpStatus;
        this.upstreamBody = upstreamBody;
    }
}

/**
 * Raised when an agreement trigger fails for any reason other than the
 * agreement not existing (which is already covered by `AgreementNotFoundError`).
 * The upstream error text usually contains the Concerto validation failure
 * or runtime error from the template logic. Discussed in #143.
 */
export class AgreementTriggerError extends ServiceError {
    public readonly agreementId: string;
    public readonly upstreamMessage: string;

    constructor(agreementId: string, upstreamMessage: string) {
        super(
            'AGREEMENT_TRIGGER_FAILED',
            502,
            MCP_ERROR_CODES.AGREEMENT_TRIGGER_FAILED,
            `Failed to trigger agreement ${agreementId}: ${upstreamMessage}`,
            { agreementId, upstreamMessage },
        );
        this.name = 'AgreementTriggerError';
        this.agreementId = agreementId;
        this.upstreamMessage = upstreamMessage;
    }
}
