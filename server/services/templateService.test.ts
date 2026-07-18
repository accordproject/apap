import { jest } from '@jest/globals';
import {
    listTemplates,
    getTemplateById,
    getTemplateByUri,
    createTemplate,
    updateTemplate,
    deleteTemplate,
} from './templateService';
import { TemplateNotFoundError, TemplateDuplicateError } from './errors';

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
// db.select().from(Template).where(...).limit(1) resolves to the configured
// return value.
function createMockDb() {
    const mock: any = {
        _returnValue: [] as any[],
        select: jest.fn().mockReturnThis(),
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        limit: jest.fn(function (this: any) {
            return Promise.resolve(this._returnValue);
        }),
        insert: jest.fn().mockReturnThis(),
        values: jest.fn().mockReturnThis(),
        returning: jest.fn(function (this: any) {
            return Promise.resolve(this._returnValue);
        }),
        update: jest.fn().mockReturnThis(),
        set: jest.fn().mockReturnThis(),
        delete: jest.fn().mockReturnThis(),
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
            db.select.mockReturnValue({ from: jest.fn<any>().mockResolvedValue(rows) });

            const result = await listTemplates(db);
            expect(result).toEqual(rows);
            expect(result).toHaveLength(2);
        });

        it('returns an empty array when no templates exist', async () => {
            db.select.mockReturnValue({ from: jest.fn<any>().mockResolvedValue([]) });

            const result = await listTemplates(db);
            expect(result).toEqual([]);
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
});
