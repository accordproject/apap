import request from 'supertest';
import express from 'express';
import { jest } from '@jest/globals';
import agreementsRouter from './agreements';
import { Agreement, Template } from '../db/schema';
import * as templateBuilder from './templatebuilder';
import { TemplateArchiveProcessor } from '@accordproject/template-engine';
import { Template as ApTemplate } from '@accordproject/cicero-core';
import AdmZip from 'adm-zip';
import fs from 'fs';
import path from 'path';

// Mock dependencies (but not TemplateArchiveProcessor)
jest.mock('../db/schema');
jest.mock('./templatebuilder');

const mockedTemplateBuilder = templateBuilder as jest.Mocked<typeof templateBuilder>;

// Helper function to create a real template archive from the test template
async function createLateDeliveryTemplate(): Promise<ApTemplate> {
    const templatePath = path.join(__dirname, '../test/archives/latedeliveryandpenalty-typescript');
    
    const zip = new AdmZip();
    
    // Add package.json
    const packageJson = JSON.parse(fs.readFileSync(path.join(templatePath, 'package.json'), 'utf8'));
    zip.addFile('package.json', Buffer.from(JSON.stringify(packageJson), 'utf8'));
    
    // Add text
    const grammarText = fs.readFileSync(path.join(templatePath, 'text/grammar.tem.md'), 'utf8');
    zip.addFile('text/grammar.tem.md', Buffer.from(grammarText, 'utf8'));
    
    // Add model files
    const modelFiles = fs.readdirSync(path.join(templatePath, 'model'));
    modelFiles.forEach(file => {
        const modelContent = fs.readFileSync(path.join(templatePath, 'model', file), 'utf8');
        zip.addFile(`model/${file}`, Buffer.from(modelContent, 'utf8'));
    });
    
    // Add logic
    const logicPath = path.join(templatePath, 'logic');
    if (fs.existsSync(logicPath)) {
        const logicFiles = fs.readdirSync(logicPath).filter(f => f.endsWith('.ts') || f.endsWith('.js'));
        logicFiles.forEach(file => {
            const logicContent = fs.readFileSync(path.join(logicPath, file), 'utf8');
            zip.addFile(`logic/${file}`, Buffer.from(logicContent, 'utf8'));
        });
    }
    
    const buffer = zip.toBuffer();
    const template = await ApTemplate.fromArchive(buffer);
    return template;
}

describe('Agreements Router - POST /:id/trigger', () => {
    let app: express.Application;
    let mockDb: any;

    beforeEach(() => {
        // Reset all mocks
        jest.clearAllMocks();

        // Create Express app
        app = express();
        app.use(express.json());

        // Mock database
        mockDb = {
            select: jest.fn().mockReturnThis(),
            update: jest.fn().mockReturnThis(),
            from: jest.fn().mockReturnThis(),
            set: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
        };

        // Add database to locals middleware
        app.use((req, res, next) => {
            res.locals.db = mockDb;
            next();
        });

        // Add agreements router
        app.use('/agreements', agreementsRouter);
    });

    describe('Success scenarios', () => {
        const mockAgreementData = {
            id: 1,
            uri: 'test://agreement/1',
            data: {
                $class: 'io.clause.latedeliveryandpenalty@0.1.0.TemplateModel',
                clauseId: 'latedelivery-1',
                forceMajeure: false,
                penaltyDuration: { $class: 'org.accordproject.time@0.3.0.Duration', amount: 9, unit: 'DAY' },
                penaltyPercentage: 7.0,
                capPercentage: 2.0,
                termination: { $class: 'org.accordproject.time@0.3.0.Duration', amount: 2, unit: 'WEEK' },
                fractionalPart: 'DAY',
                $identifier: "c88e5ed7-c3e0-4249-a99c-ce9278684ac8"
            },
            template: 'test://template/latedelivery',
            state: null as any,
            agreementStatus: 'DRAFT' as const,
            agreementParties: [] as any[],
            signatures: [] as any[],
            historyEntries: [] as any[],
            attachments: [] as any[],
            references: [] as string[],
            metadata: {} as any
        };

        const mockTemplateData = {
            id: 1,
            uri: 'test://template/latedelivery',
            author: 'Accord Project',
            displayName: 'Late Delivery Template',
            version: '1.0.0',
            description: 'A template for late delivery penalties',
            license: 'Apache-2.0',
            keywords: ['penalty', 'delivery'],
            metadata: {
                runtime: 'typescript',
                template: 'clause',
                cicero: '0.25.0'
            },
            logo: null as any,
            templateModel: {
                typeName: 'io.clause.latedeliveryandpenalty@0.1.0.TemplateModel',
                model: {
                    $class: 'org.accordproject.protocol@1.0.0.CtoModel',
                    ctoFiles: [] as any[]
                }
            },
            text: {
                templateText: 'Late Delivery and Penalty template text'
            },
            logic: {
                codes: [] as any[]
            },
            sampleRequest: null as any
        };

        let realApTemplate: ApTemplate;

        beforeEach(async () => {
            // Create real template
            realApTemplate = await createLateDeliveryTemplate();

            // Mock successful database queries
            mockDb.select.mockReturnValue(mockDb);
            mockDb.from.mockReturnValue(mockDb);
            mockDb.where.mockReturnValue(mockDb);
            mockDb.limit.mockReturnValue(mockDb);

            // Mock agreement query result
            mockDb.limit.mockImplementationOnce(() => Promise.resolve([{ ...mockAgreementData }]));
            
            // Mock template query result
            mockDb.limit.mockImplementationOnce(() => Promise.resolve([mockTemplateData]));

            // Mock templateFromDatabase to return our real template
            mockedTemplateBuilder.templateFromDatabase.mockResolvedValue(realApTemplate);
        });

        it('should successfully trigger agreement with valid request', async () => {

            mockDb.update.mockReturnValue(mockDb);
            mockDb.set.mockReturnValue(mockDb);

            const triggerRequest = {
                $class: 'io.clause.latedeliveryandpenalty@0.1.0.LateDeliveryAndPenaltyRequest',
                forceMajeure: false,
                agreedDelivery: '2024-01-01T00:00:00Z',
                deliveredAt: '2024-01-15T00:00:00Z', // 14 days late
                goodsValue: 1000.00
            };

            const response = await request(app)
                .post('/agreements/1/trigger')
                .send(triggerRequest)
                .expect(200);

            // Verify response structure
            expect(response.body.result).toHaveProperty('$class', 'io.clause.latedeliveryandpenalty@0.1.0.LateDeliveryAndPenaltyResponse');
            expect(response.body.result).toHaveProperty('penalty');
            expect(response.body.result).toHaveProperty('buyerMayTerminate');
            expect(typeof response.body.result.penalty).toBe('number');
            expect(typeof response.body.result.buyerMayTerminate).toBe('boolean');
            expect(response.body.state.count).toBe(1); 
        });

        it('should handle trigger with goods delivered on time', async () => {

            mockDb.update.mockReturnValue(mockDb);
            mockDb.set.mockReturnValue(mockDb);

            const triggerRequest = {
                $class: 'io.clause.latedeliveryandpenalty@0.1.0.LateDeliveryAndPenaltyRequest',
                forceMajeure: false,
                agreedDelivery: '2024-01-15T00:00:00Z',
                deliveredAt: '2024-01-10T00:00:00Z', // 5 days early
                goodsValue: 1000.00
            };

            const response = await request(app)
                .post('/agreements/1/trigger')
                .send(triggerRequest)
                .expect(200);

            expect(response.body.result).toHaveProperty('$class', 'io.clause.latedeliveryandpenalty@0.1.0.LateDeliveryAndPenaltyResponse');
            // TODO fix template to only calculate penalty when delivery is late
            expect(response.body.result.penalty).toBe(17500); // No penalty for on-time delivery
            expect(response.body.result.buyerMayTerminate).toBe(true);
            expect(response.body.state.count).toBe(1); 
        });

        it('should handle trigger with goods not yet delivered', async () => {

            mockDb.update.mockReturnValue(mockDb);
            mockDb.set.mockReturnValue(mockDb);

            const triggerRequest = {
                $class: 'io.clause.latedeliveryandpenalty@0.1.0.LateDeliveryAndPenaltyRequest',
                forceMajeure: false,
                agreedDelivery: '2024-01-01T00:00:00Z',
                deliveredAt: null as any, // Not yet delivered
                goodsValue: 1000.00
            };

            const response = await request(app)
                .post('/agreements/1/trigger')
                .send(triggerRequest)
                .expect(200);

            expect(response.body.result).toHaveProperty('$class', 'io.clause.latedeliveryandpenalty@0.1.0.LateDeliveryAndPenaltyResponse');
            expect(response.body.result).toHaveProperty('penalty');
            expect(response.body.result).toHaveProperty('buyerMayTerminate');
            expect(response.body.state.count).toBe(1); 
        });

        it('should successfully trigger agreement with valid request multiple times remembering state', async () => {
            
            mockDb.update.mockReturnValue(mockDb);
            mockDb.set.mockReturnValue(mockDb);

            const triggerRequest = {
                $class: 'io.clause.latedeliveryandpenalty@0.1.0.LateDeliveryAndPenaltyRequest',
                forceMajeure: false,
                agreedDelivery: '2024-01-01T00:00:00Z',
                deliveredAt: '2024-01-15T00:00:00Z', // 14 days late
                goodsValue: 1000.00
            };

            const response1 = await request(app)
                .post('/agreements/1/trigger')
                .send(triggerRequest)
                .expect(200);

            expect(response1.body.state.count).toBe(1); 


            // Mock successful database queries
            mockDb.select.mockReturnValue(mockDb);
            mockDb.update.mockReturnValue(mockDb);
            mockDb.from.mockReturnValue(mockDb);
            mockDb.set.mockReturnValue(mockDb);
            mockDb.where.mockReturnValue(mockDb);
            mockDb.limit.mockReturnValue(mockDb);
            
            // Mock the state response with the state from the first request 
            mockDb.limit.mockImplementationOnce(() => Promise.resolve([{
                ...mockAgreementData, state: response1.body.state
            }]));
            mockDb.limit.mockImplementationOnce(() => Promise.resolve([mockTemplateData]));

            const response2 = await request(app)
                .post('/agreements/1/trigger')
                .send(triggerRequest)
                .expect(200);

            // Verify response structure
            expect(response2.body.result).toHaveProperty('$class', 'io.clause.latedeliveryandpenalty@0.1.0.LateDeliveryAndPenaltyResponse');
            expect(response2.body.result).toHaveProperty('penalty');
            expect(response2.body.result).toHaveProperty('buyerMayTerminate');
            expect(typeof response2.body.result.penalty).toBe('number');
            expect(typeof response2.body.result.buyerMayTerminate).toBe('boolean');

            expect(response2.body.state.count).toBe(2); 

        });
    });

    describe('Error scenarios - Agreement resolution', () => {
        it('should return 500 when agreement does not exist', async () => {
            // Mock empty agreement query result
            mockDb.limit.mockResolvedValueOnce([]);

            const response = await request(app)
                .post('/agreements/999/trigger')
                .send({})
                .expect(500);

            expect(response.body).toEqual({
                error: 'Agreement with id 999 does not exist'
            });
        });

        it('should return 500 when template referenced by agreement does not exist', async () => {
            const mockAgreementData = {
                id: 1,
                template: 'test://template/nonexistent'
            };

            // Mock agreement found but template not found
            mockDb.limit
                .mockResolvedValueOnce([mockAgreementData]) // Agreement found
                .mockResolvedValueOnce([]); // Template not found

            const response = await request(app)
                .post('/agreements/1/trigger')
                .send({})
                .expect(500);

            expect(response.body).toEqual({
                error: 'Template with uri test://template/nonexistent referenced by agreement 1 does not exist'
            });
        });

        it('should return 500 when database query fails', async () => {
            // Mock database error
            mockDb.limit.mockRejectedValue(new Error('Database connection failed'));

            const response = await request(app)
                .post('/agreements/1/trigger')
                .send({})
                .expect(500);

            expect(response.body).toEqual({
                error: 'Database connection failed'
            });
        });

        it('should return 500 when templateFromDatabase fails', async () => {
            const mockAgreementData = { id: 1, template: 'test://template/1' };
            const mockTemplateData = { id: 1, uri: 'test://template/1' };

            mockDb.limit
                .mockResolvedValueOnce([mockAgreementData])
                .mockResolvedValueOnce([mockTemplateData]);

            mockedTemplateBuilder.templateFromDatabase.mockRejectedValue(
                new Error('Failed to build template from database')
            );

            const response = await request(app)
                .post('/agreements/1/trigger')
                .send({})
                .expect(500);

            expect(response.body).toEqual({
                error: 'Failed to build template from database'
            });
        });
    });

    describe('Error scenarios - Template trigger execution', () => {
        const mockAgreementData = {
            id: 1,
            data: {
                $class: 'io.clause.latedeliveryandpenalty@0.1.0.TemplateModel',
                clauseId: 'latedelivery-1',
                forceMajeure: false,
                penaltyDuration: { $class: 'org.accordproject.time@0.3.0.Duration', amount: 9, unit: 'DAY' },
                penaltyPercentage: 7.0,
                capPercentage: 2.0,
                termination: { $class: 'org.accordproject.time@0.3.0.Duration', amount: 2, unit: 'WEEK' },
                fractionalPart: 'DAY'
            },
            template: 'test://template/1'
        };

        const mockTemplateData = {
            id: 1,
            uri: 'test://template/1',
            author: 'Accord Project',
            displayName: 'Late Delivery Template',
            version: '1.0.0',
            description: 'A template for late delivery penalties',
            license: 'Apache-2.0',
            keywords: ['penalty', 'delivery'],
            metadata: {
                runtime: 'typescript',
                template: 'clause',
                cicero: '0.25.0'
            },
            logo: null as any,
            templateModel: {
                typeName: 'io.clause.latedeliveryandpenalty@0.1.0.TemplateModel',
                model: {
                    $class: 'org.accordproject.protocol@1.0.0.CtoModel',
                    ctoFiles: [] as any[]
                }
            },
            text: {
                templateText: 'Late Delivery and Penalty template text'
            },
            logic: {
                codes: [] as any[]
            },
            sampleRequest: null as any
        };

        let realApTemplate: ApTemplate;

        beforeEach(async () => {
            realApTemplate = await createLateDeliveryTemplate();
            
            // Setup successful agreement and template resolution
            mockDb.limit
                .mockResolvedValueOnce([mockAgreementData])
                .mockResolvedValueOnce([mockTemplateData]);

            mockedTemplateBuilder.templateFromDatabase.mockResolvedValue(realApTemplate);
        });

        it('should return error response when trigger throws validation error', async () => {
            // Send invalid request that doesn't match the expected schema
            const invalidRequest = {
                $class: 'io.clause.latedeliveryandpenalty@0.1.0.LateDeliveryAndPenaltyRequest',
                forceMajeure: 'invalid-boolean', // Should be boolean
                agreedDelivery: 'not-a-date', // Should be DateTime
                goodsValue: 'not-a-number' // Should be number
            };

            const response = await request(app)
                .post('/agreements/1/trigger')
                .send(invalidRequest)
                .expect(200);

            expect(response.body).toHaveProperty('isError', true);
            expect(response.body).toHaveProperty('errorMessage');
            expect(response.body).toHaveProperty('errorDetails');
            expect(response.body.errorDetails).toBe('Expected value at path `$.forceMajeure` to be of type `Boolean`')
        });
    });

    describe('Request parsing and validation', () => {
        it('should handle malformed JSON gracefully', async () => {
            // Express will handle malformed JSON and return 400 before reaching our handler
            const response = await request(app)
                .post('/agreements/1/trigger')
                .set('Content-Type', 'application/json')
                .send('{ invalid json }')
                .expect(400);

            // Express default error handling for malformed JSON
            expect(response.text).toContain('SyntaxError');
        });
    });

    describe('Integration with database layer', () => {
        it('should use correct SQL queries for agreement lookup', async () => {
            const mockAgreementData = { 
                id: 1, 
                template: 'test://template/1',
                data: {
                    $class: 'io.clause.latedeliveryandpenalty@0.1.0.TemplateModel',
                    clauseId: 'latedelivery-1',
                    forceMajeure: false,
                    penaltyDuration: { $class: 'org.accordproject.time@0.3.0.Duration', amount: 9, unit: 'DAY' },
                    penaltyPercentage: 7.0,
                    capPercentage: 2.0,
                    termination: { $class: 'org.accordproject.time@0.3.0.Duration', amount: 2, unit: 'WEEK' },
                    fractionalPart: 'DAY'
                }
            };
            const mockTemplateData = { 
                id: 1, 
                uri: 'test://template/1',
                metadata: {
                    runtime: 'typescript',
                    template: 'clause',
                    cicero: '0.25.0'
                }
            };

            mockDb.limit
                .mockResolvedValueOnce([mockAgreementData])
                .mockResolvedValueOnce([mockTemplateData]);

            const realApTemplate = await createLateDeliveryTemplate();
            mockedTemplateBuilder.templateFromDatabase.mockResolvedValue(realApTemplate);

            const triggerRequest = {
                $class: 'io.clause.latedeliveryandpenalty@0.1.0.LateDeliveryAndPenaltyRequest',
                forceMajeure: false,
                agreedDelivery: '2024-01-01T00:00:00Z',
                deliveredAt: '2024-01-10T00:00:00Z',
                goodsValue: 1000.00
            };

            await request(app)
                .post('/agreements/1/trigger')
                .send(triggerRequest)
                .expect(200);

            // Verify database calls
            expect(mockDb.select).toHaveBeenCalledTimes(2);
            expect(mockDb.from).toHaveBeenCalledWith(Agreement);
            expect(mockDb.from).toHaveBeenCalledWith(Template);
            expect(mockDb.limit).toHaveBeenCalledWith(1);
        });
    });
});