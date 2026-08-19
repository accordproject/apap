import { jest } from '@jest/globals';
import {
    listAgreements,
    listAgreementsPaged,
    getAgreementById,
    getAgreementByUri,
    convertAgreement,
    createAgreement,
    AGREEMENT_TEMPLATE_RESOURCE_PREFIX,
} from './agreementService';
import { AgreementCreationError, AgreementDuplicateError, AgreementNotFoundError, InvalidPayloadError, ValidationError } from './errors';
import fs from 'fs';
import path from 'path';
import AdmZip from 'adm-zip';

// convertAgreement pulls in the real template engine and templatebuilder
// utility; mock both so the service can be exercised without a real
// Postgres or a real .cta archive.
jest.mock('../handlers/templatebuilder', () => {
    const actual = jest.requireActual('../handlers/templatebuilder') as any;
    return { ...actual, templateFromDatabase: jest.fn() };
});
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
        orderBy: jest.fn().mockReturnThis(),
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

    describe('createAgreement', () => {
        const originalFetch = (globalThis as any).fetch;
        const zip = new AdmZip(fs.readFileSync(path.join(__dirname, '../test/archives/late-delivery.cta')));
        const archivePackage = JSON.parse(zip.readAsText('package.json'));
        archivePackage.accordproject.cicero = '*';
        zip.updateFile('package.json', Buffer.from(JSON.stringify(archivePackage)));
        const archive = zip.toBuffer();
        const templateUrl = 'https://templates.accordproject.org/late-delivery.cta';
        const baseInput = {
            $class: 'org.accordproject.protocol@1.0.0.Agreement',
            uri: 'urn:agreement:late-delivery-1',
            template: templateUrl,
            agreementStatus: 'DRAFT' as const,
            data: { $class: 'io.clause.latedeliveryandpenalty@0.1.0.TemplateModel' },
        };

        function creationDb(options: { selectRows?: any[]; failure?: unknown } = {}) {
            const insertedValues: any[] = [];
            let activeTable: any;
            const created = { id: 9 };
            const mock: any = {
                insertedValues,
                select: jest.fn().mockReturnThis(),
                from: jest.fn().mockReturnThis(),
                where: jest.fn().mockReturnThis(),
                limit: jest.fn<any>().mockResolvedValue(options.selectRows ?? []),
                insert: jest.fn((table: any) => { activeTable = table; return mock; }),
                values: jest.fn((value: any) => { insertedValues.push({ table: activeTable, value }); return mock; }),
                onConflictDoNothing: jest.fn<any>().mockResolvedValue(undefined),
                returning: jest.fn<any>().mockImplementation(async () => {
                    if (options.failure) throw options.failure;
                    return [{ ...created, ...insertedValues[insertedValues.length - 1].value }];
                }),
            };
            return mock;
        }

        const retriever = (fetchImpl: () => Promise<Buffer> = async () => archive) => ({
            getURISchemes: () => ['http', 'https'],
            fetch: jest.fn(fetchImpl),
        });

        beforeAll(() => {
            (globalThis as any).fetch = jest.fn(async (url: any) => {
                const source = String(url).includes('metamodel')
                    ? 'namespace concerto.metamodel@0.4.0 abstract concept Property {} concept ConceptDeclaration {} concept Model {}'
                    : String(url).includes('commonmark')
                        ? 'namespace org.accordproject.commonmark@0.5.0 concept Document {}'
                        : 'namespace org.accordproject.party@0.2.0 participant Party identified by partyId { o String partyId }';
                return { ok: true, text: async () => source } as any;
            });
        });

        afterAll(() => { (globalThis as any).fetch = originalFetch; });

        it.each([
            ['plain URL', templateUrl],
            ['canonical resource', `${AGREEMENT_TEMPLATE_RESOURCE_PREFIX}${templateUrl}`],
        ])('validates and persists a canonical template for a %s', async (_label, template) => {
            const createDb = creationDb();
            const result = await createAgreement(createDb, { ...baseInput, template }, { templateRetrievers: [retriever()] });
            expect(result.template).toBe(`${AGREEMENT_TEMPLATE_RESOURCE_PREFIX}${templateUrl}`);
            const agreementInsert = createDb.insertedValues[createDb.insertedValues.length - 1].value;
            expect(agreementInsert.template).toBe(`${AGREEMENT_TEMPLATE_RESOURCE_PREFIX}${templateUrl}`);
            expect(agreementInsert.templateHash).toEqual(expect.any(String));
        });

        it.each([
            ['ftp://example.com/late-delivery.cta', ValidationError],   // Concerto: invalid URI scheme
            ['', InvalidPayloadError],                                  // Zod: min(1)
            ['https://[invalid-host/template.cta', InvalidPayloadError], // URL parser: malformed host
            ['https:example.com/template.cta', InvalidPayloadError],    // URL parser: not absolute
        ])('rejects invalid template %p', async (template, expected) => {
            await expect(createAgreement(creationDb(), { ...baseInput, template } as any, { templateRetrievers: [retriever()] }))
                .rejects.toBeInstanceOf(expected);
        });

        it('uses the platform URL parser to canonicalize an absolute HTTP template URL', async () => {
            const createDb = creationDb();
            const upperCaseUrl = 'HTTPS://templates.accordproject.org/late-delivery.cta';
            const result = await createAgreement(
                createDb,
                { ...baseInput, template: upperCaseUrl },
                { templateRetrievers: [retriever()] },
            );

            expect(result.template).toBe(`${AGREEMENT_TEMPLATE_RESOURCE_PREFIX}${templateUrl}`);
        });

        // Status quo, asserted so it is a decision rather than an accident. A
        // scheme-less string is a bare Concerto identifier, not a URI, so the
        // validator has no scheme to reject and the value passes. The
        // pre-refactor route behaved this way; nothing in this PR narrows it.
        // No retriever matches, so the row lands with a null templateHash.
        it('accepts a scheme-less template identifier and stores no template hash', async () => {
            const createDb = creationDb();
            const result = await createAgreement(
                createDb, { ...baseInput, template: 'templates/late-delivery.cta' }, { templateRetrievers: [retriever()] },
            );
            expect(result.template).toBe('templates/late-delivery.cta');
            expect(result.templateHash).toBeNull();
        });

        // `concertoValidation` JSON.stringify()s `data` and `state` in place (the
        // "HACK" block in handlers/concertovalidation.ts). The pre-refactor route
        // validated and then persisted the same object, so the row carried `data`
        // as a *string* while every reader — processor.draft(agreement.data, ...)
        // in convertAgreement and triggerAgreement — treats it as an object. The
        // service validates a copy so the stored and returned forms stay objects.
        it('persists and returns data and state as objects, not stringified JSON', async () => {
            const createDb = creationDb();
            const input = { ...baseInput, state: { $class: 'io.clause.latedeliveryandpenalty@0.1.0.TemplateModelState' } };
            const result = await createAgreement(createDb, input as any, { templateRetrievers: [retriever()] });

            expect(typeof result.data).toBe('object');
            expect(result.data).toEqual(baseInput.data);
            expect(typeof result.state).toBe('object');

            const agreementInsert = createDb.insertedValues[createDb.insertedValues.length - 1].value;
            expect(typeof agreementInsert.data).toBe('object');
            expect(typeof agreementInsert.state).toBe('object');
            // The caller's own object must not have been mutated either.
            expect(typeof input.data).toBe('object');
        });

        it('accepts data as an object-encoding JSON string and persists the normalized object', async () => {
            const createDb = creationDb();
            const result = await createAgreement(
                createDb,
                { ...baseInput, data: JSON.stringify(baseInput.data) },
                { templateRetrievers: [retriever()] },
            );

            expect(result.data).toEqual(baseInput.data);
            expect(typeof result.data).toBe('object');
            const agreementInsert = createDb.insertedValues[createDb.insertedValues.length - 1].value;
            expect(agreementInsert.data).toEqual(baseInput.data);
            expect(typeof agreementInsert.data).toBe('object');
        });

        it('normalizes object-encoding state strings without narrowing prior state inputs', async () => {
            const state = { $class: 'io.clause.latedeliveryandpenalty@0.1.0.TemplateModelState' };
            const stringStateDb = creationDb();
            const stringStateResult = await createAgreement(
                stringStateDb,
                { ...baseInput, state: JSON.stringify(state) },
                { templateRetrievers: [retriever()] },
            );
            expect(stringStateResult.state).toEqual(state);
            expect(stringStateDb.insertedValues[stringStateDb.insertedValues.length - 1].value.state).toEqual(state);

            for (const stateInput of ['pending', '{bad-json}', '[]', '42', 'null']) {
                const preserved = await createAgreement(
                    creationDb(),
                    { ...baseInput, state: stateInput },
                    { templateRetrievers: [retriever()] },
                );
                expect(preserved.state).toBe(stateInput);
            }
        });

        it('rejects a data string encoding an array', async () => {
            const error = await createAgreement(creationDb(), { ...baseInput, data: '[]' }).catch(e => e);
            expect(error).toBeInstanceOf(InvalidPayloadError);
            expect(error.details.issues[0].message).toBe('data string must encode a JSON object');
        });

        it('rejects a data string encoding a scalar', async () => {
            await expect(createAgreement(creationDb(), { ...baseInput, data: '42' }))
                .rejects.toBeInstanceOf(InvalidPayloadError);
        });

        it('rejects a data string encoding null', async () => {
            await expect(createAgreement(creationDb(), { ...baseInput, data: 'null' }))
                .rejects.toBeInstanceOf(InvalidPayloadError);
        });

        it('rejects an unparseable data string', async () => {
            const error = await createAgreement(creationDb(), { ...baseInput, data: '{not-json}' }).catch(e => e);
            expect(error).toBeInstanceOf(InvalidPayloadError);
            expect(error.details.issues[0].message).toBe('data string must be valid JSON');
        });

        it('rejects bare non-object data values', async () => {
            const invalidValues: unknown[] = [[], 42, true];
            for (const data of invalidValues) {
                await expect(createAgreement(creationDb(), { ...baseInput, data } as any))
                    .rejects.toBeInstanceOf(InvalidPayloadError);
            }
        });

        it('normalizes special keys consistently across object and string encodings', async () => {
            const data = { ['__proto__']: { polluted: true }, ...baseInput.data };
            for (const encoded of [data, JSON.stringify(data)]) {
                const result = await createAgreement(
                    creationDb(),
                    { ...baseInput, data: encoded },
                    { templateRetrievers: [retriever()] },
                );
                expect(result.data).toEqual(baseInput.data);
                expect(Object.prototype.hasOwnProperty.call(result.data, '__proto__')).toBe(false);
            }
            expect((Object.prototype as any).polluted).toBeUndefined();
        });

        // A unique violation from the *template* cache names a different row than
        // the agreement URI. `onConflictDoNothing` targets Template.hash, so the
        // separate Template.uri constraint still surfaces — a re-published archive
        // that keeps its URI but changes its hash trips it.
        it('does not report a template unique violation as a duplicate agreement URI', async () => {
            const createDb = creationDb();
            createDb.onConflictDoNothing = jest.fn<any>().mockRejectedValue(
                Object.assign(new Error('duplicate key'), { code: '23505', constraint: 'Template_uri_unique' }),
            );
            const error = await createAgreement(createDb, baseInput, { templateRetrievers: [retriever()] })
                .catch((e: unknown) => e);

            expect(error).toBeInstanceOf(AgreementCreationError);
            expect(error).not.toBeInstanceOf(AgreementDuplicateError);
        });

        it.each(['id', 'templateHash'])('rejects caller-supplied persistence field %s', async field => {
            await expect(createAgreement(creationDb(), { ...baseInput, [field]: field === 'id' ? 42 : 'hash' } as any))
                .rejects.toBeInstanceOf(InvalidPayloadError);
        });

        it.each([
            ['missing uri', { uri: undefined }],
            ['missing agreementStatus', { agreementStatus: undefined }],
            ['invalid agreementStatus', { agreementStatus: 'ACTIVE' }],
            ['malformed data', { data: 'not-an-object' }],
        ])('rejects %s', async (_label, override) => {
            await expect(createAgreement(creationDb(), { ...baseInput, ...override } as any))
                .rejects.toBeInstanceOf(InvalidPayloadError);
        });

        // Regression: an earlier cut of normalizeTemplate required the inner id to
        // be an http(s) URL and threw ValidationError otherwise. That rejected
        // agreements referencing an already-stored template under any other
        // scheme — accepted before creation moved into this service. The retriever
        // list is scheme-dispatched and extensible, so the inner id is not ours to
        // constrain; no retriever matches and the row persists with a null hash.
        it('passes a canonical relationship with a non-http template id through untouched', async () => {
            const createDb = creationDb();
            const template = `${AGREEMENT_TEMPLATE_RESOURCE_PREFIX}ap://latedeliveryandpenalty@0.1.0`;
            const result = await createAgreement(createDb, { ...baseInput, template }, { templateRetrievers: [retriever()] });
            expect(result.template).toBe(template);
            const agreementInsert = createDb.insertedValues[createDb.insertedValues.length - 1].value;
            expect(agreementInsert.templateHash).toBeNull();
            // Only the Agreement row — no Template row, because nothing was fetched.
            expect(createDb.insertedValues).toHaveLength(1);
        });

        it('types template retrieval failure and writes no rows', async () => {
            const createDb = creationDb();
            await expect(createAgreement(createDb, baseInput, {
                templateRetrievers: [retriever(async () => { throw new Error('archive unavailable'); })],
            })).rejects.toBeInstanceOf(AgreementCreationError);
            expect(createDb.insert).not.toHaveBeenCalled();
        });

        it('types duplicate URI failures', async () => {
            const createDb = creationDb({ failure: Object.assign(new Error('duplicate'), { code: '23505' }) });
            await expect(createAgreement(createDb, baseInput, { templateRetrievers: [] }))
                .rejects.toBeInstanceOf(AgreementDuplicateError);
        });

        it('types database failures', async () => {
            const createDb = creationDb({ failure: new Error('database offline') });
            await expect(createAgreement(createDb, baseInput, { templateRetrievers: [] }))
                .rejects.toBeInstanceOf(AgreementCreationError);
        });

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

    // Slice-3 (#225) additions symmetric with listTemplatesPaged. Pin the
    // clamping + default-order safeguards for the paged variant that
    // buildCrudRouter delegates to via listService.
    describe('listAgreementsPaged', () => {
        beforeEach(() => {
            db._setReturn([{ count: 0 }]);
        });

        it('clamps limit to 100 when caller requests more', async () => {
            await listAgreementsPaged(db, { limit: 500, offset: 0 });
            expect(db.limit).toHaveBeenCalledWith(100);
        });

        it('clamps limit to at least 1 when caller requests less', async () => {
            await listAgreementsPaged(db, { limit: 0, offset: 0 });
            expect(db.limit).toHaveBeenCalledWith(1);
        });

        it('clamps offset to at least 0 when caller passes negative', async () => {
            await listAgreementsPaged(db, { limit: 10, offset: -5 });
            expect(db.offset).toHaveBeenCalledWith(0);
        });

        it('applies a default orderClause when caller passes null (pagination determinism)', async () => {
            await listAgreementsPaged(db, { limit: 10, offset: 0, orderClause: null });
            expect(db.orderBy).toHaveBeenCalled();
        });

        it('honours a caller-provided orderClause without overriding it', async () => {
            const customClause = { fake: 'orderBy' } as any;
            await listAgreementsPaged(db, { limit: 10, offset: 0, orderClause: customClause });
            expect(db.orderBy).toHaveBeenCalledWith(customClause);
        });

        it('surfaces total from the count-query result destructure', async () => {
            db._setReturn([{ count: 42 }]);
            const result = await listAgreementsPaged(db, { limit: 10, offset: 0 });
            expect(result.total).toBe(42);
        });
    });
});
