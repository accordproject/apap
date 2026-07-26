import {
    ServiceError,
    TemplateNotFoundError,
    TemplateDuplicateError,
    AgreementNotFoundError,
    AgreementConversionError,
    InvalidPayloadError,
    ValidationError,
    UpstreamApiError,
    AgreementTriggerError,
    MCP_ERROR_CODES,
} from './errors';

describe('ServiceError', () => {
    it('exposes code, statusCode, jsonRpcCode, message, and details', () => {
        const err = new ServiceError('CUSTOM_CODE', 418, -32028, 'tea time', { teapot: true });
        expect(err.code).toBe('CUSTOM_CODE');
        expect(err.statusCode).toBe(418);
        expect(err.jsonRpcCode).toBe(-32028);
        expect(err.message).toBe('tea time');
        expect(err.details).toEqual({ teapot: true });
    });

    it('omits details from toJSON when not provided', () => {
        const err = new ServiceError('NO_DETAILS', 500, -32028, 'boom');
        expect(err.details).toBeUndefined();
        expect(err.toJSON()).toEqual({
            error: { code: 'NO_DETAILS', message: 'boom' },
        });
    });

    it('includes details in toJSON when provided', () => {
        const err = new ServiceError('WITH_DETAILS', 400, -32025, 'bad', { field: 'name' });
        expect(err.toJSON()).toEqual({
            error: {
                code: 'WITH_DETAILS',
                message: 'bad',
                details: { field: 'name' },
            },
        });
    });

    it('survives prototype chain for instanceof after transpilation', () => {
        const err = new TemplateNotFoundError('abc');
        expect(err).toBeInstanceOf(TemplateNotFoundError);
        expect(err).toBeInstanceOf(ServiceError);
        expect(err).toBeInstanceOf(Error);
    });
});

describe('MCP_ERROR_CODES range', () => {
    it('all codes sit inside the reserved -32020..-32099 MCP implementation range', () => {
        for (const [name, code] of Object.entries(MCP_ERROR_CODES)) {
            expect(code).toBeGreaterThanOrEqual(-32099);
            expect(code).toBeLessThanOrEqual(-32020);
            // sanity: each code is a unique integer
            expect(Number.isInteger(code)).toBe(true);
        }
    });

    it('each code is unique (no accidental collisions on refactor)', () => {
        const codes = Object.values(MCP_ERROR_CODES);
        expect(new Set(codes).size).toBe(codes.length);
    });
});

describe('Template errors', () => {
    it('TemplateNotFoundError -> 404 TEMPLATE_NOT_FOUND with identifier in details', () => {
        const err = new TemplateNotFoundError(42);
        expect(err.statusCode).toBe(404);
        expect(err.code).toBe('TEMPLATE_NOT_FOUND');
        expect(err.jsonRpcCode).toBe(MCP_ERROR_CODES.TEMPLATE_NOT_FOUND);
        expect(err.details).toEqual({ identifier: 42 });
        expect(err.message).toContain('42');
    });

    it('TemplateDuplicateError -> 409 TEMPLATE_DUPLICATE with uri in details', () => {
        const err = new TemplateDuplicateError('resource:foo#bar');
        expect(err.statusCode).toBe(409);
        expect(err.code).toBe('TEMPLATE_DUPLICATE');
        expect(err.jsonRpcCode).toBe(MCP_ERROR_CODES.TEMPLATE_DUPLICATE);
        expect(err.details).toEqual({ uri: 'resource:foo#bar' });
    });
});

describe('Agreement errors', () => {
    it('AgreementNotFoundError -> 404 AGREEMENT_NOT_FOUND', () => {
        const err = new AgreementNotFoundError('xyz');
        expect(err.statusCode).toBe(404);
        expect(err.code).toBe('AGREEMENT_NOT_FOUND');
        expect(err.jsonRpcCode).toBe(MCP_ERROR_CODES.AGREEMENT_NOT_FOUND);
        expect(err.details).toEqual({ identifier: 'xyz' });
    });

    it('AgreementConversionError -> 500 with format and reason captured', () => {
        const err = new AgreementConversionError(7, 'html', 'engine crashed');
        expect(err.statusCode).toBe(500);
        expect(err.code).toBe('AGREEMENT_CONVERSION_FAILED');
        expect(err.jsonRpcCode).toBe(MCP_ERROR_CODES.AGREEMENT_CONVERSION_FAILED);
        expect(err.details).toEqual({ agreementId: 7, format: 'html', reason: 'engine crashed' });
        expect(err.message).toContain('html');
        expect(err.message).toContain('engine crashed');
    });

    it('AgreementConversionError works without an explicit reason', () => {
        const err = new AgreementConversionError(7, 'html');
        expect(err.statusCode).toBe(500);
        expect(err.message).toContain('Failed to convert agreement 7 to html');
        expect(err.details).toEqual({ agreementId: 7, format: 'html', reason: undefined });
    });
});

describe('Generic input errors', () => {
    it('InvalidPayloadError -> 400 INVALID_PAYLOAD', () => {
        const err = new InvalidPayloadError('missing field', { field: 'uri' });
        expect(err.statusCode).toBe(400);
        expect(err.code).toBe('INVALID_PAYLOAD');
        expect(err.jsonRpcCode).toBe(MCP_ERROR_CODES.INVALID_PAYLOAD);
        expect(err.details).toEqual({ field: 'uri' });
    });

    it('ValidationError -> 422 VALIDATION_ERROR', () => {
        const err = new ValidationError('schema mismatch');
        expect(err.statusCode).toBe(422);
        expect(err.code).toBe('VALIDATION_ERROR');
        expect(err.jsonRpcCode).toBe(MCP_ERROR_CODES.VALIDATION_ERROR);
        expect(err.details).toBeUndefined();
    });
});

describe('Upstream errors', () => {
    it('UpstreamApiError -> 502 UPSTREAM_API_ERROR carrying url, status, body', () => {
        const err = new UpstreamApiError('http://localhost:9000/templates', 500, 'boom');
        expect(err.statusCode).toBe(502);
        expect(err.code).toBe('UPSTREAM_API_ERROR');
        expect(err.jsonRpcCode).toBe(MCP_ERROR_CODES.UPSTREAM_API_ERROR);
        expect(err.upstreamUrl).toBe('http://localhost:9000/templates');
        expect(err.httpStatus).toBe(500);
        expect(err.upstreamBody).toBe('boom');
        expect(err.details).toEqual({
            upstreamUrl: 'http://localhost:9000/templates',
            httpStatus: 500,
            upstreamBody: 'boom',
        });
        expect(err.message).toContain('http://localhost:9000/templates');
        expect(err.message).toContain('500');
    });

    it('UpstreamApiError survives instanceof checks through the ServiceError chain', () => {
        const err = new UpstreamApiError('http://x/y', 503, '');
        expect(err).toBeInstanceOf(UpstreamApiError);
        expect(err).toBeInstanceOf(ServiceError);
        expect(err).toBeInstanceOf(Error);
    });

    it('UpstreamApiError serializes through toJSON without dropping fields', () => {
        const err = new UpstreamApiError('http://localhost:9000/agreements', 502, 'gateway down');
        expect(err.toJSON()).toEqual({
            error: {
                code: 'UPSTREAM_API_ERROR',
                message: expect.stringContaining('http://localhost:9000/agreements'),
                details: {
                    upstreamUrl: 'http://localhost:9000/agreements',
                    httpStatus: 502,
                    upstreamBody: 'gateway down',
                },
            },
        });
    });

    it('AgreementTriggerError -> 502 AGREEMENT_TRIGGER_FAILED with agreement id and upstream message', () => {
        const err = new AgreementTriggerError('agr-7', 'request did not validate against Request type');
        expect(err.statusCode).toBe(502);
        expect(err.code).toBe('AGREEMENT_TRIGGER_FAILED');
        expect(err.jsonRpcCode).toBe(MCP_ERROR_CODES.AGREEMENT_TRIGGER_FAILED);
        expect(err.agreementId).toBe('agr-7');
        expect(err.upstreamMessage).toBe('request did not validate against Request type');
        expect(err.details).toEqual({
            agreementId: 'agr-7',
            upstreamMessage: 'request did not validate against Request type',
        });
        expect(err.message).toContain('agr-7');
        expect(err.message).toContain('request did not validate');
    });

    it('AgreementTriggerError survives instanceof checks through the ServiceError chain', () => {
        const err = new AgreementTriggerError('agr-1', 'kaboom');
        expect(err).toBeInstanceOf(AgreementTriggerError);
        expect(err).toBeInstanceOf(ServiceError);
        expect(err).toBeInstanceOf(Error);
    });
});
