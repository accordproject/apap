import request from 'supertest';
import express from 'express';
import { jest } from '@jest/globals';

// --- 1. DEFINE MOCKS BEFORE IMPORTS ---

// Create the mock template object
const mockTemplateInstance = {
    getRequestTypes: () => ['org.accordproject.helloworld.MyRequest'],
    getModelManager: () => ({})
};

// Create the mock function for loading archives
const mockFromArchive = jest.fn().mockImplementation(() => Promise.resolve(mockTemplateInstance));

// Mock the heavy @accordproject/template-engine library
jest.mock('@accordproject/template-engine', () => {
    return {
        __esModule: true,
        default: { 
            fromArchive: mockFromArchive,
            Template: { fromArchive: mockFromArchive }
        },
        Template: { fromArchive: mockFromArchive },
        TemplateArchiveProcessor: class {
            async init() { return { state: {} }; }
            async trigger() { return { state: {}, result: { success: true } }; }
            async draft() { return "draft result"; }
        }
    };
});

// Mock database schema
jest.mock('../db/schema', () => ({
    Agreement: { id: 'id', uri: 'uri' },
    Template: { uri: 'uri' },
    AgreementInsertSchema: {},
}));

// Mock CRUD router to avoid complex setup
jest.mock('./crud', () => ({
    buildCrudRouter: () => express.Router()
}));

// Mock validation
jest.mock('./concertovalidation', () => ({
    concertoValidation: () => Promise.resolve({ success: true })
}));

// Mock template builder
jest.mock('./templatebuilder', () => ({
    templateFromDatabase: jest.fn().mockImplementation(() => Promise.resolve(mockTemplateInstance))
}));

// --- 2. IMPORT THE ROUTER ---
import agreementsRouter from './agreements';

// --- 3. THE TEST SUITE ---
describe('External Template Agreements (Sidecar)', () => {
    let app: express.Application;
    let mockDb: any;

    beforeEach(() => {
        jest.clearAllMocks();
        
        // Mock Global Fetch with explicit any cast to avoid type errors
        (global as any).fetch = jest.fn();

        // Setup Mock Database
        mockDb = {
            select: jest.fn().mockReturnThis(),
            from: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
            update: jest.fn().mockReturnThis(),
            set: jest.fn().mockReturnThis(),
        };

        app = express();
        app.use(express.json());
        app.use((req, res, next) => {
            res.locals.db = mockDb;
            next();
        });
        app.use('/agreements', agreementsRouter);
    });

    it('should fetch external template from URL and bypass database', async () => {
        const externalUrl = 'http://example.com/template.cta';
        
        // 1. Database returns an agreement pointing to a URL
        mockDb.limit.mockImplementation(() => Promise.resolve([{
            id: 1,
            template: externalUrl,
            data: {},
            state: {}
        }]));

        // 2. Fetch returns a fake buffer
        ((global as any).fetch as jest.Mock).mockImplementation(() => Promise.resolve({
            ok: true,
            status: 200,
            arrayBuffer: async () => Buffer.from('fake-zip-data')
        }));

        // 3. Trigger the endpoint
        await request(app)
            .post('/agreements/1/trigger')
            .send({ $class: 'org.accordproject.helloworld.MyRequest' })
            .expect(200);

        // 4. Verify
        expect((global as any).fetch).toHaveBeenCalledWith(externalUrl);
        expect(mockFromArchive).toHaveBeenCalled();
    });
});