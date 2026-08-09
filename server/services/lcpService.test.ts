import { jest } from '@jest/globals';
import {
    sha256AtrHash,
    assertAtrHash,
    assertAbsoluteHttpsUrl,
    resolvePublicBaseUrl,
    getAgreementTerms,
    advisoryLegalContextFromMetadata,
    buildAgreementLegalContext,
    buildServerLegalContext,
} from './lcpService';
import { AgreementNotFoundError } from './errors';

jest.mock('./agreementService', () => ({
    ...(jest.requireActual('./agreementService') as object),
    convertAgreement: jest.fn(),
}));

import { convertAgreement } from './agreementService';
const mockedConvertAgreement = convertAgreement as jest.MockedFunction<typeof convertAgreement>;

function createMockDb() {
    const mock: any = {
        _returnValue: [] as any[],
        select: jest.fn().mockReturnThis(),
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
    };
    mock.then = function (onFulfilled: any, onRejected: any) {
        return Promise.resolve(this._returnValue).then(onFulfilled, onRejected);
    };
    mock._setReturn = (val: any[]) => { mock._returnValue = val; };
    return mock;
}

describe('lcpService', () => {
    const ORIGINAL_ENV = process.env;

    beforeEach(() => {
        jest.clearAllMocks();
        process.env = { ...ORIGINAL_ENV };
        delete process.env.APAP_PUBLIC_BASE_URL;
        delete process.env.LCP_TERMS_URL;
        delete process.env.LCP_TERMS_HASH;
        delete process.env.LCP_ROOT_AGREEMENT_ID;
    });

    afterAll(() => {
        process.env = ORIGINAL_ENV;
    });

    describe('sha256AtrHash', () => {
        it('returns a 0x-prefixed lowercase 64-hex digest', () => {
            const hash = sha256AtrHash('hello world');
            expect(hash).toMatch(/^0x[0-9a-f]{64}$/);
        });

        it('is deterministic for the same input', () => {
            expect(sha256AtrHash('same bytes')).toBe(sha256AtrHash('same bytes'));
        });

        it('produces different digests for different input', () => {
            expect(sha256AtrHash('a')).not.toBe(sha256AtrHash('b'));
        });

        it('matches a known SHA-256 vector for the empty string', () => {
            expect(sha256AtrHash('')).toBe(
                '0xe3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
            );
        });
    });

    describe('assertAtrHash', () => {
        it('accepts a well-formed digest', () => {
            const valid = sha256AtrHash('x');
            expect(assertAtrHash(valid)).toBe(valid);
        });

        it('rejects a digest missing the 0x prefix', () => {
            expect(() => assertAtrHash('a'.repeat(64))).toThrow(/0x-prefixed/);
        });

        it('rejects uppercase hex', () => {
            expect(() => assertAtrHash(`0x${'A'.repeat(64)}`)).toThrow();
        });

        it('rejects the wrong digest length', () => {
            expect(() => assertAtrHash(`0x${'a'.repeat(63)}`)).toThrow();
        });
    });

    describe('assertAbsoluteHttpsUrl', () => {
        it('accepts an absolute https URL', () => {
            expect(assertAbsoluteHttpsUrl('https://apap.example/agreements/1', 'label')).toBe(
                'https://apap.example/agreements/1',
            );
        });

        it('rejects http', () => {
            expect(() => assertAbsoluteHttpsUrl('http://apap.example', 'label')).toThrow(/https/);
        });

        it('rejects a relative URL', () => {
            expect(() => assertAbsoluteHttpsUrl('/agreements/1', 'label')).toThrow();
        });

        it('includes the caller-supplied label in the error', () => {
            expect(() => assertAbsoluteHttpsUrl('not a url', 'LCP_TERMS_URL')).toThrow(/LCP_TERMS_URL/);
        });
    });

    describe('resolvePublicBaseUrl', () => {
        it('prefers the configured APAP_PUBLIC_BASE_URL', () => {
            process.env.APAP_PUBLIC_BASE_URL = 'https://apap.example';
            const base = resolvePublicBaseUrl({ requestProtocol: 'http', requestHost: 'localhost:9000' });
            expect(base).toBe('https://apap.example/');
        });

        it('rejects a configured base URL that is not https', () => {
            process.env.APAP_PUBLIC_BASE_URL = 'http://apap.example';
            expect(() =>
                resolvePublicBaseUrl({ requestProtocol: 'http', requestHost: 'localhost:9000' }),
            ).toThrow(/https/);
        });

        it('falls back to the request protocol/host when unconfigured', () => {
            const base = resolvePublicBaseUrl({ requestProtocol: 'http', requestHost: 'localhost:9000' });
            expect(base).toBe('http://localhost:9000');
        });
    });

    describe('getAgreementTerms', () => {
        it('hashes exactly the bytes convertAgreement returns', async () => {
            mockedConvertAgreement.mockResolvedValue('# Terms\n\nSome text.');
            const db = createMockDb();

            const result = await getAgreementTerms(db, 1);

            expect(result.body).toBe('# Terms\n\nSome text.');
            expect(result.atrHash).toBe(sha256AtrHash('# Terms\n\nSome text.'));
            expect(result.contentType).toBe('text/markdown; charset=utf-8');
            expect(mockedConvertAgreement).toHaveBeenCalledWith(db, 1, 'markdown');
        });

        it('defaults the format to markdown', async () => {
            mockedConvertAgreement.mockResolvedValue('body');
            const db = createMockDb();
            await getAgreementTerms(db, 5);
            expect(mockedConvertAgreement).toHaveBeenCalledWith(db, 5, 'markdown');
        });

        it('propagates errors from convertAgreement (e.g. AgreementNotFoundError)', async () => {
            mockedConvertAgreement.mockRejectedValue(new AgreementNotFoundError(999));
            const db = createMockDb();
            await expect(getAgreementTerms(db, 999)).rejects.toThrow(AgreementNotFoundError);
        });
    });

    describe('advisoryLegalContextFromMetadata', () => {
        it('returns acceptanceRequired=false and no optional fields for null metadata', () => {
            const advisory = advisoryLegalContextFromMetadata(null);
            expect(advisory).toEqual({
                acceptanceRequired: false,
                disputeResolution: undefined,
                contact: undefined,
                returns: undefined,
            });
        });

        it('reads acceptanceRequired only from the exact string "true"', () => {
            expect(
                advisoryLegalContextFromMetadata({ values: [{ key: 'lcp.acceptanceRequired', value: 'true' }] })
                    .acceptanceRequired,
            ).toBe(true);
            expect(
                advisoryLegalContextFromMetadata({ values: [{ key: 'lcp.acceptanceRequired', value: 'yes' }] })
                    .acceptanceRequired,
            ).toBe(false);
        });

        it('assembles disputeResolution only from lcp.-prefixed keys, omitting it entirely when absent', () => {
            const advisory = advisoryLegalContextFromMetadata({
                values: [
                    { key: 'lcp.disputeResolution.jurisdiction', value: 'New York, USA' },
                    { key: 'lcp.disputeResolution.method', value: 'Dispute Resolution Service Rules' },
                    { key: 'unrelated.key', value: 'ignored' },
                ],
            });
            expect(advisory.disputeResolution).toEqual({
                method: 'Dispute Resolution Service Rules',
                jurisdiction: 'New York, USA',
                contact: undefined,
                clauseId: undefined,
                source: undefined,
                catalog: undefined,
            });
        });

        it('omits disputeResolution and contact when no relevant keys are present', () => {
            const advisory = advisoryLegalContextFromMetadata({
                values: [{ key: 'lcp.returns', value: 'https://apap.example/returns' }],
            });
            expect(advisory.disputeResolution).toBeUndefined();
            expect(advisory.contact).toBeUndefined();
            expect(advisory.returns).toBe('https://apap.example/returns');
        });

        it('ignores malformed metadata shapes instead of throwing', () => {
            expect(() => advisoryLegalContextFromMetadata({ values: 'not-an-array' })).not.toThrow();
            expect(() => advisoryLegalContextFromMetadata(undefined)).not.toThrow();
            expect(() => advisoryLegalContextFromMetadata({ values: [{ key: 1, value: 2 }] })).not.toThrow();
        });
    });

    describe('buildAgreementLegalContext', () => {
        it('never sources terms/termsFormat/atrHash/api from metadata, even if metadata sets those keys (agreement not yet frozen)', async () => {
            const db = createMockDb();
            db._setReturn([{
                id: 7,
                agreementStatus: 'DRAFT',
                metadata: {
                    values: [
                        { key: 'lcp.terms', value: 'https://attacker.example/fake-terms' },
                        { key: 'lcp.atrHash', value: `0x${'a'.repeat(64)}` },
                        { key: 'lcp.api', value: 'https://attacker.example/api' },
                    ],
                },
            }]);

            const doc = await buildAgreementLegalContext(db, 7, 'https://apap.example');

            expect(doc.terms).toBe('https://apap.example/agreements/7/terms');
            expect(doc.api).toBe('https://apap.example/agreements/7');
            expect(doc.atrHash).toBeUndefined();
        });

        it('never sources atrHash from metadata even once frozen — the real digest wins, not the attacker-supplied one', async () => {
            const db = createMockDb();
            mockedConvertAgreement.mockResolvedValue('the real terms');
            db._setReturn([{
                id: 7,
                agreementStatus: 'COMPLETED',
                metadata: { values: [{ key: 'lcp.atrHash', value: `0x${'a'.repeat(64)}` }] },
            }]);

            const doc = await buildAgreementLegalContext(db, 7, 'https://apap.example');

            expect(doc.atrHash).toBe(sha256AtrHash('the real terms'));
            expect(doc.atrHash).not.toBe(`0x${'a'.repeat(64)}`);
        });

        it('omits atrHash while the agreement is still DRAFT (data is still fully mutable)', async () => {
            const db = createMockDb();
            db._setReturn([{ id: 1, agreementStatus: 'DRAFT', metadata: null }]);
            const doc = await buildAgreementLegalContext(db, 1, 'https://apap.example');
            expect(doc.atrHash).toBeUndefined();
            expect(mockedConvertAgreement).not.toHaveBeenCalled();
        });

        it('includes atrHash from SIGNING onward, hashing exactly the served terms bytes', async () => {
            // agreementService.ts's assertAgreementRecordMutable freezes `data`
            // as soon as SIGNING begins (not just once COMPLETED/SUPERSEDED),
            // so atrHash is safe to claim starting there too.
            const db = createMockDb();
            for (const agreementStatus of ['SIGNING', 'COMPLETED', 'SUPERSEDED']) {
                mockedConvertAgreement.mockResolvedValue('# Frozen terms');
                db._setReturn([{ id: 1, agreementStatus, metadata: null }]);
                const doc = await buildAgreementLegalContext(db, 1, 'https://apap.example');
                expect(doc.atrHash).toBe(sha256AtrHash('# Frozen terms'));
            }
        });

        it('throws AgreementNotFoundError when the agreement does not exist', async () => {
            const db = createMockDb();
            db._setReturn([]);
            await expect(buildAgreementLegalContext(db, 404, 'https://apap.example')).rejects.toThrow(
                AgreementNotFoundError,
            );
        });

        it('builds terms and api as absolute URLs under the given base', async () => {
            const db = createMockDb();
            db._setReturn([{ id: 42, agreementStatus: 'DRAFT', metadata: null }]);
            const doc = await buildAgreementLegalContext(db, 42, 'https://apap.example');
            expect(doc.terms).toBe('https://apap.example/agreements/42/terms');
            expect(doc.termsFormat).toBe('markdown');
            expect(doc.api).toBe('https://apap.example/agreements/42');
        });
    });

    describe('buildServerLegalContext', () => {
        it('returns undefined when neither LCP_TERMS_URL nor LCP_ROOT_AGREEMENT_ID is set', async () => {
            const db = createMockDb();
            const doc = await buildServerLegalContext(db, 'https://apap.example');
            expect(doc).toBeUndefined();
        });

        it('builds an external document from LCP_TERMS_URL, honoring an optional LCP_TERMS_HASH', async () => {
            process.env.LCP_TERMS_URL = 'https://terms.example/agreement.md';
            process.env.LCP_TERMS_HASH = sha256AtrHash('irrelevant');
            const db = createMockDb();

            const doc = await buildServerLegalContext(db, 'https://apap.example');

            expect(doc?.terms).toBe('https://terms.example/agreement.md');
            expect(doc?.atrHash).toBe(process.env.LCP_TERMS_HASH);
        });

        it('never fills atrHash from the local sample when LCP_TERMS_HASH is absent for an external URL', async () => {
            process.env.LCP_TERMS_URL = 'https://terms.example/agreement.md';
            const db = createMockDb();
            const doc = await buildServerLegalContext(db, 'https://apap.example');
            expect(doc?.atrHash).toBeUndefined();
        });

        it('rejects a non-https LCP_TERMS_URL', async () => {
            process.env.LCP_TERMS_URL = 'http://terms.example/agreement.md';
            const db = createMockDb();
            await expect(buildServerLegalContext(db, 'https://apap.example')).rejects.toThrow(/https/);
        });

        it('mirrors an agreement when LCP_ROOT_AGREEMENT_ID is set', async () => {
            process.env.LCP_ROOT_AGREEMENT_ID = '3';
            const db = createMockDb();
            db._setReturn([{ id: 3, agreementStatus: 'DRAFT', metadata: null }]);

            const doc = await buildServerLegalContext(db, 'https://apap.example');

            expect(doc?.terms).toBe('https://apap.example/agreements/3/terms');
        });

        it('mirrors the frozen agreement atrHash through the root document too', async () => {
            process.env.LCP_ROOT_AGREEMENT_ID = '3';
            mockedConvertAgreement.mockResolvedValue('root terms');
            const db = createMockDb();
            db._setReturn([{ id: 3, agreementStatus: 'COMPLETED', metadata: null }]);

            const doc = await buildServerLegalContext(db, 'https://apap.example');

            expect(doc?.atrHash).toBe(sha256AtrHash('root terms'));
        });

        it('rejects a non-numeric LCP_ROOT_AGREEMENT_ID', async () => {
            process.env.LCP_ROOT_AGREEMENT_ID = 'not-a-number';
            const db = createMockDb();
            await expect(buildServerLegalContext(db, 'https://apap.example')).rejects.toThrow(/numeric/);
        });

        it('prefers LCP_TERMS_URL over LCP_ROOT_AGREEMENT_ID when both are set', async () => {
            process.env.LCP_TERMS_URL = 'https://terms.example/agreement.md';
            process.env.LCP_ROOT_AGREEMENT_ID = '3';
            const db = createMockDb();

            const doc = await buildServerLegalContext(db, 'https://apap.example');

            expect(doc?.terms).toBe('https://terms.example/agreement.md');
        });
    });
});
