import { Template } from '../types/Template';
import { v4 as uuidv4 } from 'uuid';

export class TemplateNotFoundError extends Error {
    constructor(id: string) {
        super(`Template with id ${id} not found`);
        this.name = 'TemplateNotFoundError';
    }
}

export class DuplicateTemplateError extends Error {
    constructor(name: string) {
        super(`Template with name ${name} already exists`);
        this.name = 'DuplicateTemplateError';
    }
}

export class TemplateStore {
    private templates: Map<string, Template>;

    constructor() {
        this.templates = new Map<string, Template>();
    }

    async listTemplates(): Promise<Template[]> {
        return Array.from(this.templates.values());
    }

    async createTemplate(template: Omit<Template, 'id' | 'createdAt' | 'updatedAt'>): Promise<Template> {
        // Check for duplicate name
        const existingTemplate = Array.from(this.templates.values()).find(t => t.name === template.name);
        if (existingTemplate) {
            throw new DuplicateTemplateError(template.name);
        }

        const now = new Date();
        const newTemplate: Template = {
            ...template,
            id: uuidv4(),
            createdAt: now,
            updatedAt: now
        };

        this.templates.set(newTemplate.id, newTemplate);
        return newTemplate;
    }

    async getTemplate(id: string): Promise<Template> {
        const template = this.templates.get(id);
        if (!template) {
            throw new TemplateNotFoundError(id);
        }
        return template;
    }

    async updateTemplate(id: string, template: Omit<Template, 'id' | 'createdAt' | 'updatedAt'>): Promise<Template> {
        if (!this.templates.has(id)) {
            throw new TemplateNotFoundError(id);
        }

        const existingTemplate = this.templates.get(id)!;
        
        // Check for duplicate name, but allow same name if it's the same template
        const duplicateTemplate = Array.from(this.templates.values()).find(t => t.name === template.name && t.id !== id);
        if (duplicateTemplate) {
            throw new DuplicateTemplateError(template.name);
        }

        const updatedTemplate: Template = {
            ...template,
            id,
            createdAt: existingTemplate.createdAt,
            updatedAt: new Date()
        };

        this.templates.set(id, updatedTemplate);
        return updatedTemplate;
    }

    async deleteTemplate(id: string): Promise<void> {
        if (!this.templates.has(id)) {
            throw new TemplateNotFoundError(id);
        }
        this.templates.delete(id);
    }
} 