/**
 * Typed error hierarchy for the service and handler layers.
 *
 * Handlers in this repo currently throw bare `Error` strings everywhere
 * (e.g. `throw new Error('Failed to load template')`). That gives callers
 * no way to distinguish a 404 from a 500, and gives clients nothing
 * actionable in the response body.
 *
 * Each error here carries a machine-readable code, an HTTP status, a
 * human message, and optional structured details. Route catch blocks
 * map `ServiceError` into the right HTTP response shape; anything that
 * is NOT a `ServiceError` is a genuine bug and gets treated as a 500.
 */

export class ServiceError extends Error {
    public readonly code: string;
    public readonly statusCode: number;
    public readonly details?: Record<string, unknown>;

    constructor(
        code: string,
        statusCode: number,
        message: string,
        details?: Record<string, unknown>,
    ) {
        super(message);
        this.name = 'ServiceError';
        this.code = code;
        this.statusCode = statusCode;
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
        super('TEMPLATE_NOT_FOUND', 404, `Template not found: ${identifier}`, {
            identifier,
        });
        this.name = 'TemplateNotFoundError';
    }
}

export class TemplateDuplicateError extends ServiceError {
    constructor(uri: string) {
        super('TEMPLATE_DUPLICATE', 409, `Template with URI already exists: ${uri}`, {
            uri,
        });
        this.name = 'TemplateDuplicateError';
    }
}

// -- Agreement errors --

export class AgreementNotFoundError extends ServiceError {
    constructor(identifier: string | number) {
        super('AGREEMENT_NOT_FOUND', 404, `Agreement not found: ${identifier}`, {
            identifier,
        });
        this.name = 'AgreementNotFoundError';
    }
}

export class AgreementConversionError extends ServiceError {
    constructor(agreementId: string | number, format: string, reason?: string) {
        super(
            'AGREEMENT_CONVERSION_FAILED',
            500,
            `Failed to convert agreement ${agreementId} to ${format}${reason ? ': ' + reason : ''}`,
            { agreementId, format, reason },
        );
        this.name = 'AgreementConversionError';
    }
}

// -- Generic input + validation errors --

export class InvalidPayloadError extends ServiceError {
    constructor(message: string, details?: Record<string, unknown>) {
        super('INVALID_PAYLOAD', 400, message, details);
        this.name = 'InvalidPayloadError';
    }
}

export class ValidationError extends ServiceError {
    constructor(message: string, details?: Record<string, unknown>) {
        super('VALIDATION_ERROR', 422, message, details);
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
            `Failed to trigger agreement ${agreementId}: ${upstreamMessage}`,
            { agreementId, upstreamMessage },
        );
        this.name = 'AgreementTriggerError';
        this.agreementId = agreementId;
        this.upstreamMessage = upstreamMessage;
    }
}
