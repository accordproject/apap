import { jest } from '@jest/globals';
import { listAgreements, getAgreementById, getAgreementByUri } from './agreementService';
import { AgreementNotFoundError } from './errors';

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
});
