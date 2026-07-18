import { jest } from '@jest/globals';
import { listAgreements, getAgreementById } from './agreementService';
import { AgreementNotFoundError } from './errors';

// Same Drizzle-mock pattern as templateService.test.ts (see slice 1). The
// service touches only the fluent select/from/where/limit chain, so a shared
// mock shape is enough.
function createMockDb() {
    const mock: any = {
        _returnValue: [] as any[],
        select: jest.fn().mockReturnThis(),
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        limit: jest.fn(function (this: any) {
            return Promise.resolve(this._returnValue);
        }),
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
            db.select.mockReturnValue({ from: jest.fn<any>().mockResolvedValue(rows) });

            const result = await listAgreements(db);
            expect(result).toEqual(rows);
            expect(result).toHaveLength(2);
        });

        it('returns an empty array when no agreements exist', async () => {
            db.select.mockReturnValue({ from: jest.fn<any>().mockResolvedValue([]) });

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
});
