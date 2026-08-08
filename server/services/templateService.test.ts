import { jest } from '@jest/globals';
import fs from 'fs';
import path from 'path';
import AdmZip from 'adm-zip';
import {
    listTemplates,
    getTemplateById,
    getTemplateByUri,
    createTemplate,
    createTemplateFromArchive,
    updateTemplate,
    deleteTemplate,
} from './templateService';
import {
    TemplateNotFoundError,
    TemplateDuplicateError,
    TemplateCiceroVersionMismatchError,
    InvalidPayloadError,
} from './errors';

// Builds a real `.cta` archive buffer from the late-delivery-and-penalty test
// fixture, optionally overriding the `package.json.accordproject.cicero`
// compatibility range so version-mismatch behavior can be exercised without
// needing a second fixture archive.
function buildArchive(opts: { cicero?: string } = {}): Buffer {
    const templatePath = path.join(__dirname, '../test/archives/latedeliveryandpenalty-typescript');
    const zip = new AdmZip();

    const packageJson = JSON.parse(fs.readFileSync(path.join(templatePath, 'package.json'), 'utf8'));
    if (opts.cicero !== undefined) {
        packageJson.accordproject.cicero = opts.cicero;
    }
    zip.addFile('package.json', Buffer.from(JSON.stringify(packageJson), 'utf8'));

    const grammarText = fs.readFileSync(path.join(templatePath, 'text/grammar.tem.md'), 'utf8');
    zip.addFile('text/grammar.tem.md', Buffer.from(grammarText, 'utf8'));

    fs.readdirSync(path.join(templatePath, 'model')).forEach((file) => {
        const modelContent = fs.readFileSync(path.join(templatePath, 'model', file), 'utf8');
        zip.addFile(`model/${file}`, Buffer.from(modelContent, 'utf8'));
    });

    const logicPath = path.join(templatePath, 'logic');
    if (fs.existsSync(logicPath)) {
        fs.readdirSync(logicPath).filter((f) => f.endsWith('.ts') || f.endsWith('.js')).forEach((file) => {
            const logicContent = fs.readFileSync(path.join(logicPath, file), 'utf8');
            zip.addFile(`logic/${file}`, Buffer.from(logicContent, 'utf8'));
        });
    }

    return zip.toBuffer();
}

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

    describe('createTemplateFromArchive', () => {
        it('parses a valid archive whose declared Cicero range is satisfied and inserts it', async () => {
            db._setReturn([]); // no existing row with this hash
            // `.returning()` normally echoes the DB's inserted row; here it echoes
            // back whatever `createTemplate` passed to `.values(...)` so we can
            // assert on the shape `extractTemplateForDatabase` actually produced.
            let insertedValues: any;
            db.values = jest.fn((v: any) => { insertedValues = v; return db; });
            db.returning = jest.fn(() => Promise.resolve([{ id: 99, ...insertedValues }]));

            const archive = buildArchive();
            const result = await createTemplateFromArchive(db, archive);

            expect(db.insert).toHaveBeenCalled();
            expect(result.hash).toBeTruthy();
            expect(result.uri).toMatch(/^archive:latedeliveryandpenalty-typescript@/);
            expect(result.metadata).toMatchObject({ cicero: '^0.25.0' });
        });

        it('returns the existing row without inserting when the hash already exists', async () => {
            const archive = buildArchive();
            const existingRow = toTemplateRow(lateDeliveryTemplate, 42);
            db._setReturn([existingRow]);

            const result = await createTemplateFromArchive(db, archive);

            expect(result).toEqual(existingRow);
            expect(db.insert).not.toHaveBeenCalled();
        });

        it('throws InvalidPayloadError for bytes that are not a valid .cta archive', async () => {
            await expect(
                createTemplateFromArchive(db, Buffer.from('not a zip file')),
            ).rejects.toThrow(InvalidPayloadError);
        });

        it('throws TemplateCiceroVersionMismatchError when the declared range is not satisfied', async () => {
            const archive = buildArchive({ cicero: '^99.0.0' });

            await expect(
                createTemplateFromArchive(db, archive),
            ).rejects.toThrow(TemplateCiceroVersionMismatchError);
        });

        it('throws TemplateCiceroVersionMismatchError when no Cicero range is declared', async () => {
            const archive = buildArchive({ cicero: '' });

            await expect(
                createTemplateFromArchive(db, archive),
            ).rejects.toThrow(TemplateCiceroVersionMismatchError);
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
