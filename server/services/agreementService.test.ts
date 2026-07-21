import { jest } from '@jest/globals';
import {
    listAgreements,
    getAgreementById,
    getAgreementByUri,
    convertAgreement,
} from './agreementService';
import { AgreementNotFoundError } from './errors';

// convertAgreement pulls in the real template engine and templatebuilder
// utility; mock both so the service can be exercised without a real
// Postgres or a real .cta archive.
jest.mock('../handlers/templatebuilder', () => ({
    templateFromDatabase: jest.fn(),
}));
jest.mock('@accordproject/template-engine', () => ({
    TemplateArchiveProcessor: jest.fn(),
}));

// Same Drizzle-mock pattern as templateService.test.ts (see slice 1). The
// service touches only the fluent select/from/where/limit(/offset) chain,
// so a shared mock shape is enough. Both `.limit(N).offset(M)` (paged list)
// and `.limit(1)` (single-row lookup) resolve via the top-level `then`.
function createMockDb() {
    const mock: any = {
        _returnValue: [] as any[],
        select: jest.fn().mockReturnThis(),
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
    };
    mock.then = function (onFulfilled: any, onRejected: any) {
        return Promise.resolve(this._returnValue).then(onFulfilled, onRejected);
    };
    mock._setReturn = (val: any[]) => { mock._returnValue = val; };
    return mock;
}

function agreementRow(id: number, overrides: Record<string, unknown> = {}): any {
    return {
        id,
        uri: `apap://agreements/${id}`,
        data: {},
        template: 'https://templates.accordproject.org/latedeliveryandpenalty@0.1.0.cta',
        state: null,
        agreementStatus: 'DRAFT',
        agreementParties: null,
        signatures: null,
        historyEntries: null,
        attachments: null,
        references: null,
        metadata: null,
        ...overrides,
    };
}

describe('agreementService', () => {
    let db: ReturnType<typeof createMockDb>;

    beforeEach(() => {
        db = createMockDb();
    });

    describe('listAgreements', () => {
        it('returns all agreements from the database', async () => {
            const rows = [agreementRow(1), agreementRow(2)];
            db._setReturn(rows);

            const result = await listAgreements(db);
            expect(result).toEqual(rows);
            expect(result).toHaveLength(2);
        });

        it('clamps limit to 100 when caller requests more', async () => {
            db._setReturn([]);
            await listAgreements(db, { limit: 500 });
            expect(db.limit).toHaveBeenCalledWith(100);
        });

        it('clamps limit to at least 1 when caller requests less', async () => {
            db._setReturn([]);
            await listAgreements(db, { limit: 0 });
            expect(db.limit).toHaveBeenCalledWith(1);
        });

        it('clamps offset to at least 0 when caller passes negative', async () => {
            db._setReturn([]);
            await listAgreements(db, { offset: -5 });
            expect(db.offset).toHaveBeenCalledWith(0);
        });

        it('defaults to limit=100 and offset=0 when no opts provided', async () => {
            db._setReturn([]);
            await listAgreements(db);
            expect(db.limit).toHaveBeenCalledWith(100);
            expect(db.offset).toHaveBeenCalledWith(0);
        });

        it('returns an empty array when no agreements exist', async () => {
            db._setReturn([]);

            const result = await listAgreements(db);
            expect(result).toEqual([]);
        });
    });

    describe('getAgreementById', () => {
        it('returns the agreement when it exists', async () => {
            const row = agreementRow(5, { agreementStatus: 'SIGNNG' });
            db._setReturn([row]);

            const result = await getAgreementById(db, 5);
            expect(result).toEqual(row);
            expect(db.select).toHaveBeenCalled();
        });

        it('throws AgreementNotFoundError when the id does not exist', async () => {
            db._setReturn([]);

            await expect(getAgreementById(db, 999)).rejects.toThrow(AgreementNotFoundError);
            await expect(getAgreementById(db, 999)).rejects.toMatchObject({
                code: 'AGREEMENT_NOT_FOUND',
                statusCode: 404,
            });
        });
    });

    describe('getAgreementByUri', () => {
        it('returns the agreement when the URI matches', async () => {
            const row = agreementRow(2, { uri: 'apap://agreements/2' });
            db._setReturn([row]);

            const result = await getAgreementByUri(db, 'apap://agreements/2');
            expect(result).toEqual(row);
        });

        it('throws AgreementNotFoundError when the URI does not match', async () => {
            db._setReturn([]);

            await expect(
                getAgreementByUri(db, 'apap://agreements/ghost'),
            ).rejects.toThrow(AgreementNotFoundError);
        });
    });

    // convertAgreement goes through resolveAgreementRuntime, which fires two
    // db.select() chains (agreement lookup, then template lookup). The shared
    // mock returns _returnValue on every terminal, so per-test we assemble a
    // narrower mock whose .limit() resolves to a queued list of results.
    describe('convertAgreement', () => {
        function twoCallDb(firstResult: any[], secondResult: any[]): any {
            const limitMock = jest.fn<any>()
                .mockResolvedValueOnce(firstResult)
                .mockResolvedValueOnce(secondResult);
            return {
                select: jest.fn().mockReturnThis(),
                from: jest.fn().mockReturnThis(),
                where: jest.fn().mockReturnThis(),
                limit: limitMock,
            };
        }

        beforeEach(() => {
            jest.clearAllMocks();
        });

        it('returns the drafted text when agreement + template resolve cleanly', async () => {
            const agreementData = { $class: 'foo', bar: 1 };
            const agreement = agreementRow(1, { data: agreementData });
            const template = { uri: 'https://templates.accordproject.org/foo@0.1.0.cta' };
            const convertDb = twoCallDb([agreement], [template]);

            const templateBuilder = require('../handlers/templatebuilder');
            templateBuilder.templateFromDatabase.mockResolvedValue({} as any);

            const { TemplateArchiveProcessor } = require('@accordproject/template-engine');
            const draftMock = jest.fn<any>().mockResolvedValue('<html>drafted</html>');
            (TemplateArchiveProcessor as any).mockImplementation(() => ({ draft: draftMock }));

            const result = await convertAgreement(convertDb, 1, 'html');

            expect(result).toBe('<html>drafted</html>');
            expect(draftMock).toHaveBeenCalledWith(agreementData, 'html', {});
            expect(templateBuilder.templateFromDatabase).toHaveBeenCalledWith(template);
        });

        it('strips the resource:{ns}#{uri} prefix before looking up the template', async () => {
            // Agreements can reference their template via a Concerto resource:
            // URI form, resolveAgreementRuntime slices the fragment off before
            // querying Template.uri. Pin the branch with a dedicated test.
            const agreementData = { bar: 1 };
            const agreement = agreementRow(1, {
                data: agreementData,
                template: 'resource:org.accordproject.protocol.Template#https://templates.accordproject.org/foo@0.1.0.cta',
                templateHash: null,
            });
            const template = { uri: 'https://templates.accordproject.org/foo@0.1.0.cta' };
            const convertDb = twoCallDb([agreement], [template]);

            const templateBuilder = require('../handlers/templatebuilder');
            templateBuilder.templateFromDatabase.mockResolvedValue({} as any);

            const { TemplateArchiveProcessor } = require('@accordproject/template-engine');
            const draftMock = jest.fn<any>().mockResolvedValue('drafted');
            (TemplateArchiveProcessor as any).mockImplementation(() => ({ draft: draftMock }));

            await expect(convertAgreement(convertDb, 1, 'html')).resolves.toBe('drafted');
            // The `where(eq(Template.uri, templateUri))` call sees the trimmed URI.
            expect(templateBuilder.templateFromDatabase).toHaveBeenCalledWith(template);
        });

        it('throws a plain Error when the referenced template is missing', async () => {
            // resolveAgreementRuntime deliberately throws a plain Error (not a
            // typed AgreementConversionError) for this case so globalErrorHandler
            // renders the legacy `{ error: message }` 500 body that existing
            // REST clients already assert against.
            const agreement = agreementRow(1);
            const convertDb = twoCallDb([agreement], []);

            await expect(convertAgreement(convertDb, 1, 'html')).rejects.toThrow(
                /Template with uri .* referenced by agreement 1 does not exist/,
            );
        });

        it('throws AgreementNotFoundError when the agreement itself is missing', async () => {
            const convertDb = twoCallDb([], []);

            await expect(convertAgreement(convertDb, 999, 'html')).rejects.toThrow(
                AgreementNotFoundError,
            );
        });

        it('wraps template-engine draft failures as AgreementConversionError', async () => {
            const agreement = agreementRow(1);
            const template = { uri: 'https://templates.accordproject.org/foo@0.1.0.cta' };
            const convertDb = twoCallDb([agreement], [template]);

            const templateBuilder = require('../handlers/templatebuilder');
            templateBuilder.templateFromDatabase.mockResolvedValue({} as any);

            const { TemplateArchiveProcessor } = require('@accordproject/template-engine');
            const draftMock = jest.fn<any>().mockRejectedValue(new Error('render blew up'));
            (TemplateArchiveProcessor as any).mockImplementation(() => ({ draft: draftMock }));

            const { AgreementConversionError } = require('./errors');
            let caught: unknown;
            try {
                await convertAgreement(convertDb, 1, 'markdown');
            } catch (err) {
                caught = err;
            }
            expect(caught).toBeInstanceOf(AgreementConversionError);
            expect(caught).toMatchObject({ code: 'AGREEMENT_CONVERSION_FAILED' });
        });
    });
});
