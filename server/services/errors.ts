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

/**
 * Raised by PUT /templates/:id. A template's `hash` (for auto-cached
 * templates) or its role as a fixed, citable artifact (for directly-posted
 * ones) both depend on its content never changing after creation — there is
 * no first-class notion of "template versioning" elsewhere in this codebase
 * (see assertTemplateContentImmutable), so a new version must be a new row,
 * never an edit in place.
 */
export class TemplateImmutableError extends ServiceError {
    constructor(identifier: string | number) {
        super(
            'TEMPLATE_IMMUTABLE',
            409,
            `Template ${identifier} is immutable: content cannot be changed after creation. Create a new template for a new version.`,
            { identifier },
        );
        this.name = 'TemplateImmutableError';
    }
}

/**
 * Raised by DELETE /templates/:id when at least one Agreement still resolves
 * against this template (by cached `templateHash` or by `uri`). Deleting it
 * would orphan those agreements' template lookups.
 */
export class TemplateInUseError extends ServiceError {
    constructor(identifier: string | number) {
        super(
            'TEMPLATE_IN_USE',
            409,
            `Template ${identifier} cannot be deleted: still referenced by at least one agreement`,
            { identifier },
        );
        this.name = 'TemplateInUseError';
    }
}

/**
 * Raised when an uploaded `.cta` archive declares a Cicero compatibility
 * range (`package.json.accordproject.cicero`) that the server's own pinned
 * `@accordproject/cicero-core` version does not satisfy, or declares none
 * at all. The archive parsed fine — it's just not safe to execute against
 * this server's runtime.
 */
export class TemplateCiceroVersionMismatchError extends ServiceError {
    constructor(declaredRange: string | undefined, serverVersion: string, reason?: string) {
        super(
            'TEMPLATE_CICERO_VERSION_MISMATCH',
            422,
            declaredRange
                ? `Template requires Cicero ${declaredRange}, server supports ${serverVersion}`
                : `Template does not declare a supported Cicero version range; server supports ${serverVersion}`,
            { declaredRange, serverVersion, ...(reason && { reason }) },
        );
        this.name = 'TemplateCiceroVersionMismatchError';
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

/**
 * Raised when a PUT/PATCH attempts to change a field of an agreement that
 * is no longer allowed to change given its `agreementStatus`:
 *
 * - COMPLETED or SUPERSEDED: the whole record (`data`, `signatures`,
 *   `agreementParties`, `attachments`, `historyEntries`, `references`,
 *   `metadata`, `template`, `uri`, ...) is frozen — only `agreementStatus`
 *   itself (e.g. COMPLETED -> SUPERSEDED) and `state` (via the trigger
 *   endpoint) may still change.
 * - SIGNING: only `data` (the deal terms) is frozen, so a signature given
 *   against those terms can't be invalidated by a later edit; every other
 *   field stays mutable while signatures continue to arrive.
 *
 * Mistakes are fixed by voiding and reinstantiating the agreement, not by
 * editing it in place.
 */
export class AgreementRecordImmutableError extends ServiceError {
    constructor(agreementId: string | number, status: string, field: string) {
        super(
            'AGREEMENT_RECORD_IMMUTABLE',
            409,
            `Agreement ${agreementId} is immutable once its status is ${status} (attempted to change "${field}")`,
            { agreementId, status, field },
        );
        this.name = 'AgreementRecordImmutableError';
    }
}

/**
 * Raised when a PUT attempts to move `agreementStatus` to a lower-ranked
 * status than it's currently at (rank: DRAFT < SIGNING < COMPLETED <
 * SUPERSEDED) -- e.g. COMPLETED back to DRAFT, or SUPERSEDED back to
 * COMPLETED. The agreement lifecycle only moves forward; a downgrade would
 * make the freezes AgreementRecordImmutableError enforces reversible in two
 * requests (revert the status, then edit the now-reopened record).
 */
export class AgreementStatusTransitionError extends ServiceError {
    constructor(agreementId: string | number, from: string, to: string) {
        super(
            'AGREEMENT_STATUS_TRANSITION_INVALID',
            409,
            `Agreement ${agreementId} cannot move agreementStatus from ${from} back to ${to}`,
            { agreementId, from, to },
        );
        this.name = 'AgreementStatusTransitionError';
    }
}

export class AgreementTemplateBindingImmutableError extends ServiceError {
    constructor(agreementId: number) {
        super(
            'AGREEMENT_TEMPLATE_BINDING_IMMUTABLE',
            409,
            `Agreement ${agreementId} cannot change its template while it is bound to a cached archive`,
            { agreementId, field: 'template' },
        );
        this.name = 'AgreementTemplateBindingImmutableError';
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

    constructor(agreementId: string, upstreamMessage: string, cause?: unknown) {
        super(
            'AGREEMENT_TRIGGER_FAILED',
            502,
            `Failed to trigger agreement ${agreementId}: ${upstreamMessage}`,
            { agreementId, upstreamMessage },
        );
        this.name = 'AgreementTriggerError';
        this.agreementId = agreementId;
        this.upstreamMessage = upstreamMessage;
        if (cause !== undefined) (this as Error & { cause?: unknown }).cause = cause;
    }
}

/**
 * Marks a `ServiceError` whose `message` and `details` are authored for API
 * clients and carry no upstream, template-runtime, or database text. Only
 * these cross the A2A boundary verbatim; everything else is reduced to a
 * stable code by the executor's allowlisted serializer. Opting in is a
 * deliberate per-error-type decision, never the default.
 */
export interface ClientSafeError {
    readonly clientSafe: true;
}

export function isClientSafeError(error: unknown): error is ServiceError & ClientSafeError {
    return error instanceof ServiceError && (error as Partial<ClientSafeError>).clientSafe === true;
}

/** A scope denial constructed by the server's authorization policy. */
export const REQUIRED_SCOPE = {
    'templates:list': 'apap:templates:read',
    'templates:read': 'apap:templates:read',
    'templates:create': 'apap:templates:write',
    'templates:update': 'apap:templates:write',
    'templates:delete': 'apap:templates:write',
    'agreements:list': 'apap:agreements:read',
    'agreements:read': 'apap:agreements:read',
    'agreements:convert': 'apap:agreements:read',
    'agreements:trigger': 'apap:trigger:invoke',
} as const;

export class InsufficientScopeError extends ServiceError implements ClientSafeError {
    public readonly clientSafe = true as const;
    constructor(action: keyof typeof REQUIRED_SCOPE) {
        const valid = Object.prototype.hasOwnProperty.call(REQUIRED_SCOPE, action);
        super('INSUFFICIENT_SCOPE', 403, 'The authenticated principal is not authorized for this operation.', valid ? { action, requiredScope: REQUIRED_SCOPE[action] } : undefined);
    }
}

/** Not-found errors for validated database identifiers, not arbitrary URI strings. */
export class NumericAgreementNotFoundError extends AgreementNotFoundError implements ClientSafeError {
    public readonly clientSafe = true as const;
    constructor(id: number) { super(typeof id === 'number' && Number.isSafeInteger(id) && id >= 0 && id <= 2147483647 ? String(id) : ''); }
}

export class NumericTemplateNotFoundError extends TemplateNotFoundError implements ClientSafeError {
    public readonly clientSafe = true as const;
    constructor(id: number) { super(typeof id === 'number' && Number.isSafeInteger(id) && id >= 0 && id <= 2147483647 ? String(id) : ''); }
}

/** Server-authored diagnostic for a tool payload that failed JSON parsing. */
export class MalformedToolPayloadError extends InvalidPayloadError implements ClientSafeError {
    public readonly clientSafe = true as const;
    constructor() { super('Payload must be valid JSON'); }
}

/** Server-authored diagnostic for an absent archive upload. */
export class MissingArchiveBodyError extends InvalidPayloadError implements ClientSafeError {
    public readonly clientSafe = true as const;
    constructor() { super('Missing .cta archive body'); }
}

/** The trigger request has no Concerto discriminator. */
export class MissingTriggerClassError extends InvalidPayloadError implements ClientSafeError {
    public readonly clientSafe = true as const;
    constructor(agreementId: number) {
        super('Request payload must include a $class discriminator', isDatabaseId(agreementId) ? { agreementId } : undefined);
    }
}

/** Conversion failure with only the supported request format exposed. */
export class SafeAgreementConversionError extends AgreementConversionError implements ClientSafeError {
    public readonly clientSafe = true as const;
    constructor(agreementId: number, format: string, reason?: string, cause?: unknown) {
        super(agreementId, format, reason);
        if (cause !== undefined) (this as Error & { cause?: unknown }).cause = cause;
    }
}

function isDatabaseId(id: unknown): id is number {
    return typeof id === 'number' && Number.isInteger(id) && id >= 0 && id <= 2147483647;
}

export class NumericTemplateImmutableError extends TemplateImmutableError implements ClientSafeError {
    public readonly clientSafe = true as const;
    constructor(id: number) { super(isDatabaseId(id) ? id : ''); }
}

export class NumericTemplateInUseError extends TemplateInUseError implements ClientSafeError {
    public readonly clientSafe = true as const;
    constructor(id: number) { super(isDatabaseId(id) ? id : ''); }
}

export class NumericAgreementTemplateBindingImmutableError extends AgreementTemplateBindingImmutableError implements ClientSafeError {
    public readonly clientSafe = true as const;
    constructor(id: number) { super(isDatabaseId(id) ? id : NaN); }
}

/** Public messages are fixed: error codes, messages and details may contain untrusted data. */
const PUBLIC_ERROR_MESSAGES: Record<string, string> = {
    TEMPLATE_NOT_FOUND: 'Template not found',
    AGREEMENT_NOT_FOUND: 'Agreement not found',
    TEMPLATE_DUPLICATE: 'Template already exists',
    TEMPLATE_IMMUTABLE: 'Template is immutable',
    TEMPLATE_IN_USE: 'Template is in use',
    AGREEMENT_RECORD_IMMUTABLE: 'Agreement record is immutable',
    AGREEMENT_STATUS_TRANSITION_INVALID: 'Invalid agreement status transition',
    AGREEMENT_TEMPLATE_BINDING_IMMUTABLE: 'Agreement template binding is immutable',
    INVALID_PAYLOAD: 'Invalid request payload',
    VALIDATION_ERROR: 'Validation failed',
    INSUFFICIENT_SCOPE: 'Insufficient scope',
    TEMPLATE_CICERO_VERSION_MISMATCH: 'Template Cicero version is not supported',
};

/** Serialize only fixed public content and narrowly validated structural details. */
export function publicServiceError(error: ServiceError): { error: { code: string; message: string; details?: Record<string, unknown> } } {
    if (isClientSafeError(error) && (error instanceof NumericTemplateImmutableError || error instanceof NumericTemplateInUseError)) {
        const id = error.details?.identifier;
        if (isDatabaseId(id)) {
            if (error instanceof NumericTemplateImmutableError) {
                return { error: { code: 'TEMPLATE_IMMUTABLE', message: `Template ${id} is immutable: content cannot be changed after creation. Create a new template for a new version.`, details: { identifier: id } } };
            }
            return { error: { code: 'TEMPLATE_IN_USE', message: `Template ${id} cannot be deleted: still referenced by at least one agreement`, details: { identifier: id } } };
        }
    }
    if (isClientSafeError(error) && error instanceof NumericAgreementTemplateBindingImmutableError) {
        const id = error.details?.agreementId;
        if (isDatabaseId(id)) return { error: { code: 'AGREEMENT_TEMPLATE_BINDING_IMMUTABLE', message: `Agreement ${id} cannot change its template while it is bound to a cached archive`, details: { agreementId: id, field: 'template' } } };
    }
    if (error instanceof InsufficientScopeError && isClientSafeError(error)) {
        const action = error.details?.action;
        const details = typeof action === 'string' && Object.prototype.hasOwnProperty.call(REQUIRED_SCOPE, action)
            ? { action, requiredScope: REQUIRED_SCOPE[action as keyof typeof REQUIRED_SCOPE] } : undefined;
        return { error: { code: 'INSUFFICIENT_SCOPE', message: 'The authenticated principal is not authorized for this operation.', ...(details && { details }) } };
    }
    if (error instanceof MalformedToolPayloadError && isClientSafeError(error)) {
        return { error: { code: 'INVALID_PAYLOAD', message: 'Payload must be valid JSON' } };
    }
    if (error instanceof MissingArchiveBodyError && isClientSafeError(error)) {
        return { error: { code: 'INVALID_PAYLOAD', message: 'Missing .cta archive body' } };
    }
    if (error instanceof MissingTriggerClassError && isClientSafeError(error)) {
        const id = error.details?.agreementId;
        return { error: { code: 'INVALID_PAYLOAD', message: 'Request payload must include a $class discriminator', ...(isDatabaseId(id) ? { details: { agreementId: id } } : {}) } };
    }
    if (error instanceof SafeAgreementConversionError && isClientSafeError(error)) {
        const id = error.details?.agreementId;
        const format = error.details?.format;
        if (isDatabaseId(id) && (format === 'html' || format === 'markdown')) {
            return { error: { code: 'AGREEMENT_CONVERSION_FAILED', message: 'An internal error occurred', details: { agreementId: id, format } } };
        }
    }
    if ((error instanceof NumericAgreementNotFoundError || error instanceof NumericTemplateNotFoundError) && isClientSafeError(error)) {
        const id = error.details?.identifier;
        if (typeof id === 'string' && /^(0|[1-9]\d*)$/.test(id) && Number(id) <= 2147483647) {
            const resource = error instanceof NumericAgreementNotFoundError ? 'Agreement' : 'Template';
            return { error: { code: resource === 'Agreement' ? 'AGREEMENT_NOT_FOUND' : 'TEMPLATE_NOT_FOUND', message: `${resource} not found: ${id}`, details: { identifier: id } } };
        }
    }
    if (error.statusCode < 500 && Object.prototype.hasOwnProperty.call(PUBLIC_ERROR_MESSAGES, error.code)) {
        const details: Record<string, unknown> = {};
        if (error.code === 'AGREEMENT_TEMPLATE_BINDING_IMMUTABLE') details.field = 'template';
        const agreementId = error.details?.agreementId;
        if (typeof agreementId === 'number' && Number.isSafeInteger(agreementId) && agreementId > 0) {
            details.agreementId = agreementId;
        }
        return { error: { code: error.code, message: PUBLIC_ERROR_MESSAGES[error.code], ...(Object.keys(details).length ? { details } : {}) } };
    }
    const code = error instanceof AgreementConversionError ? 'AGREEMENT_CONVERSION_FAILED'
        : error instanceof AgreementTriggerError ? 'AGREEMENT_TRIGGER_FAILED'
        : error instanceof UpstreamApiError ? 'UPSTREAM_API_ERROR'
        : 'INTERNAL_ERROR';
    return { error: { code, message: 'An internal error occurred' } };
}
