import {
    ServiceError,
    TemplateNotFoundError,
    TemplateDuplicateError,
    AgreementNotFoundError,
    AgreementConversionError,
    InvalidPayloadError,
    ValidationError,
} from './errors';

describe('ServiceError', () => {
    it('exposes code, statusCode, message, and details', () => {
        const err = new ServiceError('CUSTOM_CODE', 418, 'tea time', { teapot: true });
        expect(err.code).toBe('CUSTOM_CODE');
        expect(err.statusCode).toBe(418);
        expect(err.message).toBe('tea time');
        expect(err.details).toEqual({ teapot: true });
    });

    it('omits details from toJSON when not provided', () => {
        const err = new ServiceError('NO_DETAILS', 500, 'boom');
        expect(err.toJSON()).toEqual({
            error: { code: 'NO_DETAILS', message: 'boom' },
        });
    });

    it('includes details in toJSON when provided', () => {
        const err = new ServiceError('WITH_DETAILS', 400, 'bad', { field: 'name' });
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

describe('Template errors', () => {
    it('TemplateNotFoundError -> 404 TEMPLATE_NOT_FOUND with identifier in details', () => {
        const err = new TemplateNotFoundError(42);
        expect(err.statusCode).toBe(404);
        expect(err.code).toBe('TEMPLATE_NOT_FOUND');
        expect(err.details).toEqual({ identifier: 42 });
        expect(err.message).toContain('42');
    });

    it('TemplateDuplicateError -> 409 TEMPLATE_DUPLICATE with uri in details', () => {
        const err = new TemplateDuplicateError('resource:foo#bar');
        expect(err.statusCode).toBe(409);
        expect(err.code).toBe('TEMPLATE_DUPLICATE');
        expect(err.details).toEqual({ uri: 'resource:foo#bar' });
    });
});

describe('Agreement errors', () => {
    it('AgreementNotFoundError -> 404 AGREEMENT_NOT_FOUND', () => {
        const err = new AgreementNotFoundError('xyz');
        expect(err.statusCode).toBe(404);
        expect(err.code).toBe('AGREEMENT_NOT_FOUND');
        expect(err.details).toEqual({ identifier: 'xyz' });
    });

    it('AgreementConversionError -> 500 with format and reason captured', () => {
        const err = new AgreementConversionError(7, 'html', 'engine crashed');
        expect(err.statusCode).toBe(500);
        expect(err.code).toBe('AGREEMENT_CONVERSION_FAILED');
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
        expect(err.details).toEqual({ field: 'uri' });
    });

    it('ValidationError -> 422 VALIDATION_ERROR', () => {
        const err = new ValidationError('schema mismatch');
        expect(err.statusCode).toBe(422);
        expect(err.code).toBe('VALIDATION_ERROR');
    });
});
