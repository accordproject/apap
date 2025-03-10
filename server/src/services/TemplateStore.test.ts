import { TemplateStore, TemplateNotFoundError, DuplicateTemplateError } from './TemplateStore';

describe('TemplateStore', () => {
    let store: TemplateStore;

    beforeEach(() => {
        store = new TemplateStore();
    });

    describe('createTemplate', () => {
        it('should create a new template', async () => {
            const template = await store.createTemplate({
                name: 'Test Template',
                content: 'Test Content',
                metadata: { version: '1.0' }
            });

            expect(template.id).toBeDefined();
            expect(template.name).toBe('Test Template');
            expect(template.content).toBe('Test Content');
            expect(template.metadata).toEqual({ version: '1.0' });
            expect(template.createdAt).toBeInstanceOf(Date);
            expect(template.updatedAt).toBeInstanceOf(Date);
        });

        it('should throw DuplicateTemplateError for duplicate names', async () => {
            await store.createTemplate({
                name: 'Test Template',
                content: 'Test Content'
            });

            await expect(store.createTemplate({
                name: 'Test Template',
                content: 'Different Content'
            })).rejects.toThrow(DuplicateTemplateError);
        });
    });

    describe('getTemplate', () => {
        it('should retrieve an existing template', async () => {
            const created = await store.createTemplate({
                name: 'Test Template',
                content: 'Test Content'
            });

            const retrieved = await store.getTemplate(created.id);
            expect(retrieved).toEqual(created);
        });

        it('should throw TemplateNotFoundError for non-existent template', async () => {
            await expect(store.getTemplate('non-existent-id'))
                .rejects.toThrow(TemplateNotFoundError);
        });
    });

    describe('updateTemplate', () => {
        it('should update an existing template', async () => {
            const created = await store.createTemplate({
                name: 'Test Template',
                content: 'Test Content'
            });

            // Add a small delay to ensure updatedAt will be different
            await new Promise(resolve => setTimeout(resolve, 1));

            const updated = await store.updateTemplate(created.id, {
                name: 'Updated Template',
                content: 'Updated Content'
            });

            expect(updated.id).toBe(created.id);
            expect(updated.name).toBe('Updated Template');
            expect(updated.content).toBe('Updated Content');
            expect(updated.createdAt).toEqual(created.createdAt);
            expect(updated.updatedAt).toBeInstanceOf(Date);
            expect(updated.updatedAt.getTime()).toBeGreaterThan(created.updatedAt.getTime());
        });

        it('should throw TemplateNotFoundError for non-existent template', async () => {
            await expect(store.updateTemplate('non-existent-id', {
                name: 'Test',
                content: 'Test'
            })).rejects.toThrow(TemplateNotFoundError);
        });

        it('should throw DuplicateTemplateError when updating to existing name', async () => {
            await store.createTemplate({
                name: 'Template 1',
                content: 'Content 1'
            });

            const template2 = await store.createTemplate({
                name: 'Template 2',
                content: 'Content 2'
            });

            await expect(store.updateTemplate(template2.id, {
                name: 'Template 1',
                content: 'Updated Content'
            })).rejects.toThrow(DuplicateTemplateError);
        });
    });

    describe('deleteTemplate', () => {
        it('should delete an existing template', async () => {
            const created = await store.createTemplate({
                name: 'Test Template',
                content: 'Test Content'
            });

            await store.deleteTemplate(created.id);
            await expect(store.getTemplate(created.id))
                .rejects.toThrow(TemplateNotFoundError);
        });

        it('should throw TemplateNotFoundError for non-existent template', async () => {
            await expect(store.deleteTemplate('non-existent-id'))
                .rejects.toThrow(TemplateNotFoundError);
        });
    });

    describe('listTemplates', () => {
        it('should return empty array when no templates exist', async () => {
            const templates = await store.listTemplates();
            expect(templates).toEqual([]);
        });

        it('should return all created templates', async () => {
            const template1 = await store.createTemplate({
                name: 'Template 1',
                content: 'Content 1'
            });

            const template2 = await store.createTemplate({
                name: 'Template 2',
                content: 'Content 2'
            });

            const templates = await store.listTemplates();
            expect(templates).toHaveLength(2);
            expect(templates).toContainEqual(template1);
            expect(templates).toContainEqual(template2);
        });
    });
}); 