import { jest } from '@jest/globals';
import {
    listTemplates,
    getTemplateById,
    getTemplateByUri,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    assertTemplateContentImmutable,
    assertTemplateNotInUse,
} from './templateService';
import { TemplateNotFoundError, TemplateDuplicateError, TemplateImmutableError, TemplateInUseError } from './errors';

// Minimal Template fixtures. The service only touches `uri` and `id`, but
// TemplateInsert requires the not-null json fields (metadata, templateModel,
// text) so include placeholder shapes for those.
type TemplateFixture = {
    uri: string;
    author: string;
    version: string;
    license: string;
    displayName: string;
    description: string;
    keywords: string[];
    metadata: unknown;
    templateModel: unknown;
    text: unknown;
};

const lateDeliveryTemplate: TemplateFixture = {
    uri: 'https://templates.accordproject.org/latedeliveryandpenalty@0.1.0.cta',
    author: 'Accord Project',
    displayName: 'Late Delivery And Penalty',
    version: '0.1.0',
    description: 'A template for late delivery',
    license: 'Apache-2.0',
    keywords: [],
    metadata: {},
    templateModel: {},
    text: {},
};

const helloWorldTemplate: TemplateFixture = {
    uri: 'https://templates.accordproject.org/helloworld@0.1.0.cta',
    author: 'Accord Project',
    displayName: 'Hello World',
    version: '0.1.0',
    description: 'A minimal hello-world template',
    license: 'Apache-2.0',
    keywords: [],
    metadata: {},
    templateModel: {},
    text: {},
};

function toTemplateRow(t: TemplateFixture, id: number): any {
    return { ...t, id, hash: null, logo: null, logic: null, sampleRequest: null };
}

// Fluent Drizzle query builder mock. Every chained method returns the mock so
// db.select().from(Template).where(...).limit(1) and
// db.select().from(Template).limit(N).offset(M) both resolve to the configured
// return value. `limit` and `offset` are both terminal in the sense that they
// each return a thenable that resolves to `_returnValue`, so either
// `.limit(N)` alone (single-row lookups) or `.limit(N).offset(M)` (paged list)
// works without extra ceremony in individual tests.
function createMockDb() {
    const mock: any = {
        _returnValue: [] as any[],
        select: jest.fn().mockReturnThis(),
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
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
    // Make the fluent chain thenable at any terminal-ish stopping point so
    // callers can `await db.select()...limit(N)` and `await db.select()...limit(N).offset(M)`.
    mock.then = function (onFulfilled: any, onRejected: any) {
        return Promise.resolve(this._returnValue).then(onFulfilled, onRejected);
    };
    mock._setReturn = (val: any[]) => { mock._returnValue = val; };
    return mock;
}

describe('templateService', () => {
    let db: ReturnType<typeof createMockDb>;

    beforeEach(() => {
        db = createMockDb();
    });

    describe('listTemplates', () => {
        it('returns all templates from the database', async () => {
            const rows = [toTemplateRow(lateDeliveryTemplate, 1), toTemplateRow(helloWorldTemplate, 2)];
            db._setReturn(rows);

            const result = await listTemplates(db);
            expect(result).toEqual(rows);
            expect(result).toHaveLength(2);
        });

        it('returns an empty array when no templates exist', async () => {
            db._setReturn([]);

            const result = await listTemplates(db);
            expect(result).toEqual([]);
        });

        it('clamps limit to 100 when caller requests more', async () => {
            db._setReturn([]);
            await listTemplates(db, { limit: 500 });
            expect(db.limit).toHaveBeenCalledWith(100);
        });

        it('clamps limit to at least 1 when caller requests less', async () => {
            db._setReturn([]);
            await listTemplates(db, { limit: 0 });
            expect(db.limit).toHaveBeenCalledWith(1);
        });

        it('clamps offset to at least 0 when caller passes negative', async () => {
            db._setReturn([]);
            await listTemplates(db, { offset: -5 });
            expect(db.offset).toHaveBeenCalledWith(0);
        });

        it('defaults to limit=100 and offset=0 when no opts provided', async () => {
            db._setReturn([]);
            await listTemplates(db);
            expect(db.limit).toHaveBeenCalledWith(100);
            expect(db.offset).toHaveBeenCalledWith(0);
        });
    });

    describe('getTemplateById', () => {
        it('returns the template when it exists', async () => {
            const row = toTemplateRow(lateDeliveryTemplate, 5);
            db._setReturn([row]);

            const result = await getTemplateById(db, 5);
            expect(result).toEqual(row);
            expect(db.select).toHaveBeenCalled();
        });

        it('throws TemplateNotFoundError when the id does not exist', async () => {
            db._setReturn([]);

            await expect(getTemplateById(db, 999)).rejects.toThrow(TemplateNotFoundError);
            await expect(getTemplateById(db, 999)).rejects.toMatchObject({
                code: 'TEMPLATE_NOT_FOUND',
                statusCode: 404,
            });
        });
    });

    describe('getTemplateByUri', () => {
        it('returns the template when URI matches', async () => {
            const row = toTemplateRow(helloWorldTemplate, 2);
            db._setReturn([row]);

            const result = await getTemplateByUri(db, helloWorldTemplate.uri);
            expect(result.uri).toBe(helloWorldTemplate.uri);
        });

        it('throws TemplateNotFoundError when URI does not match', async () => {
            db._setReturn([]);

            await expect(
                getTemplateByUri(db, 'resource:nonexistent'),
            ).rejects.toThrow(TemplateNotFoundError);
        });
    });

    describe('createTemplate', () => {
        it('inserts and returns the new template', async () => {
            const row = toTemplateRow(lateDeliveryTemplate, 10);
            db._setReturn([row]);

            const result = await createTemplate(db, lateDeliveryTemplate);
            expect(result.id).toBe(10);
            expect(db.insert).toHaveBeenCalled();
        });

        it('throws TemplateDuplicateError on unique constraint violation', async () => {
            db.returning.mockRejectedValue({ code: '23505' });

            await expect(
                createTemplate(db, lateDeliveryTemplate),
            ).rejects.toThrow(TemplateDuplicateError);
        });

        it('re-throws non-unique-violation errors as-is', async () => {
            const genericError = new Error('connection lost');
            db.returning.mockRejectedValue(genericError);

            await expect(
                createTemplate(db, lateDeliveryTemplate),
            ).rejects.toThrow('connection lost');
        });
    });

    describe('updateTemplate', () => {
        it('updates and returns the template', async () => {
            const row = toTemplateRow({ ...lateDeliveryTemplate, description: 'Updated' }, 1);
            db._setReturn([row]);

            const result = await updateTemplate(db, lateDeliveryTemplate.uri, {
                description: 'Updated',
            });
            expect(result.description).toBe('Updated');
        });

        it('throws TemplateNotFoundError when URI does not match', async () => {
            db._setReturn([]);

            await expect(
                updateTemplate(db, 'resource:ghost', { description: 'nope' }),
            ).rejects.toThrow(TemplateNotFoundError);
        });
    });

    describe('deleteTemplate', () => {
        it('resolves when the template exists', async () => {
            const row = toTemplateRow(lateDeliveryTemplate, 1);
            db._setReturn([row]);

            await expect(deleteTemplate(db, lateDeliveryTemplate.uri)).resolves.toBeUndefined();
        });

        it('throws TemplateNotFoundError when URI does not match', async () => {
            db._setReturn([]);

            await expect(deleteTemplate(db, 'resource:ghost')).rejects.toThrow(
                TemplateNotFoundError,
            );
        });
    });

    describe('assertTemplateContentImmutable', () => {
        const row = toTemplateRow(lateDeliveryTemplate, 1);

        it('allows a no-op resend of the current, unchanged values', () => {
            expect(() =>
                assertTemplateContentImmutable(row, { description: lateDeliveryTemplate.description }),
            ).not.toThrow();
        });

        it('allows an empty update body', () => {
            expect(() => assertTemplateContentImmutable(row, {})).not.toThrow();
        });

        it('rejects any attempted change to a content field', () => {
            expect(() =>
                assertTemplateContentImmutable(row, { description: 'a different description' }),
            ).toThrow(TemplateImmutableError);
        });

        it('rejects a change to a nested/object field (templateModel)', () => {
            expect(() =>
                assertTemplateContentImmutable(row, { templateModel: { changed: true } }),
            ).toThrow(TemplateImmutableError);
        });

        it('rejects even a cosmetic-looking field like displayName — there is no allowlist', () => {
            expect(() =>
                assertTemplateContentImmutable(row, { displayName: 'New Name' }),
            ).toThrow(TemplateImmutableError);
        });

        it('the thrown error carries the template id and a 409 status', () => {
            try {
                assertTemplateContentImmutable(row, { description: 'changed' });
                throw new Error('expected assertTemplateContentImmutable to throw');
            } catch (err) {
                expect(err).toBeInstanceOf(TemplateImmutableError);
                expect((err as TemplateImmutableError).statusCode).toBe(409);
                expect((err as TemplateImmutableError).code).toBe('TEMPLATE_IMMUTABLE');
            }
        });
    });

    describe('assertTemplateNotInUse', () => {
        const row = toTemplateRow(lateDeliveryTemplate, 1);
        const rowWithHash = { ...row, hash: 'a'.repeat(64) };

        it('resolves when no agreement references the template', async () => {
            db._setReturn([]);
            await expect(assertTemplateNotInUse(row, db)).resolves.toBeUndefined();
        });

        it('rejects when an agreement references the template by uri', async () => {
            db._setReturn([{ id: 42 }]);
            await expect(assertTemplateNotInUse(row, db)).rejects.toThrow(TemplateInUseError);
        });

        it('rejects when an agreement references the template by cached templateHash', async () => {
            db._setReturn([{ id: 42 }]);
            await expect(assertTemplateNotInUse(rowWithHash, db)).rejects.toThrow(TemplateInUseError);
        });

        it('resolves for a hash-less template with no referencing agreement', async () => {
            db._setReturn([]);
            await expect(assertTemplateNotInUse(row, db)).resolves.toBeUndefined();
        });

        it('the thrown error carries the template id and a 409 status', async () => {
            db._setReturn([{ id: 42 }]);
            try {
                await assertTemplateNotInUse(row, db);
                throw new Error('expected assertTemplateNotInUse to throw');
            } catch (err) {
                expect(err).toBeInstanceOf(TemplateInUseError);
                expect((err as TemplateInUseError).statusCode).toBe(409);
                expect((err as TemplateInUseError).code).toBe('TEMPLATE_IN_USE');
            }
        });
    });
});
