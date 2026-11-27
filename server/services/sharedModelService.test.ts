import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { sql, desc } from 'drizzle-orm';
import { SharedModel } from '../db/schema';
import {
    listSharedModels,
    getSharedModelById,
    getSharedModelByUri,
    listSharedModelsPaged,
} from './sharedModelService';
import { SharedModelNotFoundError, ServiceError } from './errors';
import { DevelopmentPrincipal, AuthenticatedPrincipal } from '../auth/types';
import { createPolicyContext } from './policy';

function createMockDb() {
    const mock: any = {
        _returnValue: [] as any[],
        select: jest.fn().mockReturnThis(),
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        insert: jest.fn().mockReturnThis(),
        values: jest.fn().mockReturnThis(),
        returning: jest.fn(function (this: any) {
            return Promise.resolve(this._returnValue);
        }),
        update: jest.fn().mockReturnThis(),
        set: jest.fn().mockReturnThis(),
        delete: jest.fn().mockReturnThis(),
    };
    mock.then = function (onFulfilled: any, onRejected: any) {
        return Promise.resolve(this._returnValue).then(onFulfilled, onRejected);
    };
    mock._setReturn = (val: any[]) => { mock._returnValue = val; };
    return mock;
}

function context(db: ReturnType<typeof createMockDb>) {
    return createPolicyContext(db, new DevelopmentPrincipal());
}

const sampleModelRow = {
    id: 1,
    uri: 'https://models.accordproject.org/patents/patent.cto',
    model: {
        $class: 'org.accordproject.protocol@1.0.0.CtoModel',
        ctoFiles: [{ filename: 'patent.cto', contents: 'namespace org.accordproject.patents' }]
    }
};

describe('sharedModelService', () => {
    let db: ReturnType<typeof createMockDb>;

    beforeEach(() => {
        db = createMockDb();
    });

    describe('listSharedModels', () => {
        it('returns all shared models from the database', async () => {
            const rows = [sampleModelRow];
            db._setReturn(rows);

            const result = await listSharedModels(context(db));
            expect(result).toEqual(rows);
            expect(db.select).toHaveBeenCalled();
            expect(db.from).toHaveBeenCalledWith(SharedModel);
            expect(db.limit).toHaveBeenCalledWith(100);
            expect(db.offset).toHaveBeenCalledWith(0);
        });

        it('clamps limit and offset bounds', async () => {
            db._setReturn([]);

            await listSharedModels(context(db), { limit: 500, offset: -10 });
            expect(db.limit).toHaveBeenCalledWith(100);
            expect(db.offset).toHaveBeenCalledWith(0);

            await listSharedModels(context(db), { limit: 0, offset: 5 });
            expect(db.limit).toHaveBeenCalledWith(1);
            expect(db.offset).toHaveBeenCalledWith(5);
        });
    });

    describe('getSharedModelById', () => {
        it('returns the shared model when found', async () => {
            db._setReturn([sampleModelRow]);

            const result = await getSharedModelById(context(db), 1);
            expect(result).toEqual(sampleModelRow);
            expect(db.select).toHaveBeenCalled();
            expect(db.from).toHaveBeenCalledWith(SharedModel);
            expect(db.where).toHaveBeenCalled();
            expect(db.limit).toHaveBeenCalledWith(1);
        });

        it('throws SharedModelNotFoundError when row not found', async () => {
            db._setReturn([]);

            await expect(getSharedModelById(context(db), 999)).rejects.toThrow(SharedModelNotFoundError);
            try {
                await getSharedModelById(context(db), 999);
            } catch (err: any) {
                expect(err).toBeInstanceOf(SharedModelNotFoundError);
                expect(err.statusCode).toBe(404);
                expect(err.code).toBe('SHARED_MODEL_NOT_FOUND');
                expect(err.details).toEqual({ identifier: '999' });
            }
        });
    });

    describe('getSharedModelByUri', () => {
        it('returns the shared model when found by URI', async () => {
            db._setReturn([sampleModelRow]);

            const result = await getSharedModelByUri(context(db), sampleModelRow.uri);
            expect(result).toEqual(sampleModelRow);
            expect(db.where).toHaveBeenCalled();
            expect(db.limit).toHaveBeenCalledWith(1);
        });

        it('throws SharedModelNotFoundError when URI not found', async () => {
            db._setReturn([]);

            await expect(getSharedModelByUri(context(db), 'https://nonexistent.cto')).rejects.toThrow(SharedModelNotFoundError);
        });
    });

    describe('listSharedModelsPaged', () => {
        beforeEach(() => {
            db._setReturn([{ count: 1 }]);
        });

        it('clamps limit to 100 when caller requests more', async () => {
            await listSharedModelsPaged(context(db), { limit: 500, offset: 0 });
            expect(db.limit).toHaveBeenCalledWith(100);
        });

        it('clamps limit to at least 1 when caller requests less', async () => {
            await listSharedModelsPaged(context(db), { limit: 0, offset: 0 });
            expect(db.limit).toHaveBeenCalledWith(1);
        });

        it('clamps offset to at least 0 when caller passes negative', async () => {
            await listSharedModelsPaged(context(db), { limit: 10, offset: -5 });
            expect(db.offset).toHaveBeenCalledWith(0);
        });

        it('applies default asc(SharedModel.id) order when caller passes null (pagination determinism)', async () => {
            await listSharedModelsPaged(context(db), { limit: 10, offset: 0, orderClause: null });
            expect(db.orderBy).toHaveBeenCalled();
        });

        it('preserves caller orderClause when one is provided', async () => {
            const customOrder = desc(SharedModel.id);
            await listSharedModelsPaged(context(db), { limit: 10, offset: 0, orderClause: customOrder });
            expect(db.orderBy).toHaveBeenCalledWith(customOrder);
        });

        it('passes whereClause to both the count query and row select query', async () => {
            const filterClause = sql`uri = 'test'`;
            await listSharedModelsPaged(context(db), { limit: 10, offset: 0, whereClause: filterClause });
            expect(db.where).toHaveBeenCalledWith(filterClause);
            expect(db.where).toHaveBeenCalledTimes(2);
        });

        it('returns items and total count', async () => {
            db._setReturn([sampleModelRow]);
            const result = await listSharedModelsPaged(context(db), { limit: 10, offset: 0 });
            expect(result).toHaveProperty('items');
            expect(result).toHaveProperty('total');
        });
    });

    describe('Scope Authorization', () => {
        it('rejects unprivileged principal without apap:sharedmodels:read scope', async () => {
            const restrictedPrincipal = new AuthenticatedPrincipal('user-1', undefined, [], ['apap:other:scope'], {});
            const restrictedContext = createPolicyContext(db, restrictedPrincipal);

            await expect(listSharedModels(restrictedContext)).rejects.toThrow(ServiceError);
            try {
                await listSharedModels(restrictedContext);
            } catch (err: any) {
                expect(err.statusCode).toBe(403);
                expect(err.code).toBe('INSUFFICIENT_SCOPE');
            }
        });
    });
});
