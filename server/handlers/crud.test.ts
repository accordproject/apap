import request from 'supertest';
import express from 'express';
import { jest } from '@jest/globals';
import { z } from 'zod';
import { SharedModel } from '../db/schema';
import { buildCrudRouter } from './crud';

type QueryChainOptions = {
    result?: any;
    error?: any;
    toSQLResult?: {
        sql: string;
        params: any[];
    };
};

function createQueryChain({
    result = [],
    error,
    toSQLResult = {
        sql: 'select * from "SharedModel"',
        params: []
    }
}: QueryChainOptions = {}) {
    const resolution = () => error ? Promise.reject(error) : Promise.resolve(result);

    return {
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        values: jest.fn().mockReturnThis(),
        set: jest.fn().mockReturnThis(),
        returning: jest.fn().mockImplementation(() => resolution()),
        toSQL: jest.fn().mockReturnValue(toSQLResult),
        then: (onFulfilled: any, onRejected: any) => resolution().then(onFulfilled, onRejected),
        catch: (onRejected: any) => resolution().catch(onRejected),
        finally: (onFinally: any) => resolution().finally(onFinally)
    };
}

function createMockDb() {
    const selectChains: any[] = [];
    const insertChains: any[] = [];
    const updateChains: any[] = [];
    const deleteChains: any[] = [];

    return {
        selectChains,
        insertChains,
        updateChains,
        deleteChains,
        select: jest.fn().mockImplementation(() => {
            const chain = selectChains.shift();
            if (!chain) {
                throw new Error('No mocked select chain available');
            }
            return chain;
        }),
        insert: jest.fn().mockImplementation(() => {
            const chain = insertChains.shift();
            if (!chain) {
                throw new Error('No mocked insert chain available');
            }
            return chain;
        }),
        update: jest.fn().mockImplementation(() => {
            const chain = updateChains.shift();
            if (!chain) {
                throw new Error('No mocked update chain available');
            }
            return chain;
        }),
        delete: jest.fn().mockImplementation(() => {
            const chain = deleteChains.shift();
            if (!chain) {
                throw new Error('No mocked delete chain available');
            }
            return chain;
        })
    };
}

const defaultValidator = {
    schema: z.object({
        uri: z.string(),
        model: z.any(),
        organization: z.any().optional()
    })
};

function buildTestApp(options: any = {}) {
    const app = express();
    const mockDb = createMockDb();

    app.use(express.json());
    app.use((req, res, next) => {
        res.locals.db = mockDb;
        next();
    });

    const router = buildCrudRouter({
        table: SharedModel,
        typeName: 'SharedModel',
        validateBody: defaultValidator,
        ...options
    });

    app.use('/crud', router);

    return { app, mockDb };
}

describe('CRUD Router', () => {
    let consoleLogSpy: jest.SpiedFunction<typeof console.log>;
    let consoleErrorSpy: jest.SpiedFunction<typeof console.error>;

    beforeEach(() => {
        jest.clearAllMocks();
        consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => undefined);
        consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);
    });

    afterEach(() => {
        consoleLogSpy.mockRestore();
        consoleErrorSpy.mockRestore();
    });

    describe('GET /', () => {
        it('should return paginated items and cap limit to 100', async () => {
            const { app, mockDb } = buildTestApp({
                transformResponse: (item: any) => ({ ...item, transformed: true })
            });

            const logChain = createQueryChain({
                toSQLResult: {
                    sql: 'select * from "SharedModel" order by "uri" desc',
                    params: []
                }
            });
            const countChain = createQueryChain({
                result: [{ count: 2 }]
            });
            const dataChain = createQueryChain({
                result: [
                    { id: 1, uri: 'test://model/1', model: { name: 'one' } },
                    { id: 2, uri: 'test://model/2', model: { name: 'two' } }
                ]
            });

            mockDb.selectChains.push(logChain, countChain, dataChain);

            const response = await request(app)
                .get('/crud?page=2&limit=500&sortBy=uri&sortOrder=desc&unknownFilter=value')
                .expect(200);

            expect(response.body).toEqual({
                items: [
                    { id: 1, uri: 'test://model/1', model: { name: 'one' }, transformed: true },
                    { id: 2, uri: 'test://model/2', model: { name: 'two' }, transformed: true }
                ],
                total: 2,
                page: 2,
                limit: 100,
                totalPages: 1
            });

            expect(logChain.where).toHaveBeenCalledWith(undefined);
            expect(countChain.where).toHaveBeenCalledWith(undefined);
            expect(dataChain.where).toHaveBeenCalledWith(undefined);
            expect(logChain.limit).toHaveBeenCalledWith(100);
            expect(logChain.offset).toHaveBeenCalledWith(100);
            expect(dataChain.limit).toHaveBeenCalledWith(100);
            expect(dataChain.offset).toHaveBeenCalledWith(100);
            expect(logChain.orderBy).toHaveBeenCalledTimes(1);
            expect(dataChain.orderBy).toHaveBeenCalledTimes(1);
        });

        it('should enrich user items with roles when typeName is users', async () => {
            const { app, mockDb } = buildTestApp({
                typeName: 'users'
            });

            mockDb.selectChains.push(
                createQueryChain(),
                createQueryChain({ result: [{ count: 1 }] }),
                createQueryChain({
                    result: [{ id: 10, uri: 'test://user/10', email: 'user@example.com', model: {} }]
                })
            );

            const response = await request(app)
                .get('/crud')
                .expect(200);

            expect(response.body.items).toEqual([
                {
                    id: 10,
                    uri: 'test://user/10',
                    email: 'user@example.com',
                    model: {},
                    roles: []
                }
            ]);
        });
    });

    describe('POST /', () => {
        it('should validate, transform, and insert a new item', async () => {
            const customValidator = jest.fn(async () => ({
                success: true,
                data: {
                    uri: 'test://model/new',
                    model: { valid: true },
                    customValidated: true,
                    organization: undefined
                }
            }));
            const transformRequest = jest.fn((req: express.Request) => ({
                ...req.body,
                requestTransformed: true
            }));
            const transformResponse = jest.fn((item: any) => ({
                ...item,
                responseTransformed: true
            }));

            const { app, mockDb } = buildTestApp({
                validateBody: {
                    schema: defaultValidator.schema,
                    custom: customValidator
                },
                transformRequest,
                transformResponse
            });

            const insertChain = createQueryChain({
                result: [
                    {
                        id: 1,
                        uri: 'test://model/new',
                        model: { valid: true },
                        customValidated: true,
                        requestTransformed: true
                    }
                ]
            });

            mockDb.insertChains.push(insertChain);

            const response = await request(app)
                .post('/crud')
                .send({
                    uri: 'test://model/new',
                    model: { valid: true }
                })
                .expect(200);

            expect(customValidator).toHaveBeenCalledWith({
                uri: 'test://model/new',
                model: { valid: true },
                organization: undefined
            });
            expect(transformRequest).toHaveBeenCalledTimes(1);
            expect(insertChain.values).toHaveBeenCalledWith({
                uri: 'test://model/new',
                model: { valid: true },
                customValidated: true,
                organization: undefined,
                requestTransformed: true
            });
            expect(response.body).toEqual({
                id: 1,
                uri: 'test://model/new',
                model: { valid: true },
                customValidated: true,
                requestTransformed: true,
                responseTransformed: true
            });
        });

        it('should return 400 when schema validation fails', async () => {
            const { app } = buildTestApp();

            const response = await request(app)
                .post('/crud')
                .send({
                    model: { missing: 'uri' }
                })
                .expect(400);

            expect(response.body.error).toBe('Invalid request body');
            expect(response.body.details[0].path).toContain('uri');
        });

        it('should return 400 when custom validation fails', async () => {
            const { app } = buildTestApp({
                validateBody: {
                    schema: defaultValidator.schema,
                    custom: jest.fn(async () => ({
                        success: false,
                        error: {
                            errors: [{ message: 'Custom validation failed' }]
                        }
                    }))
                }
            });

            const response = await request(app)
                .post('/crud')
                .send({
                    uri: 'test://model/bad',
                    model: {}
                })
                .expect(400);

            expect(response.body).toEqual({
                error: 'Invalid request body',
                details: [{ message: 'Custom validation failed' }]
            });
        });

        it('should return 409 for duplicate key errors', async () => {
            const { app, mockDb } = buildTestApp();
            const duplicateError = Object.assign(new Error('duplicate key'), { code: '23505' });

            mockDb.insertChains.push(createQueryChain({ error: duplicateError }));

            const response = await request(app)
                .post('/crud')
                .send({
                    uri: 'test://model/duplicate',
                    model: {}
                })
                .expect(409);

            expect(response.body).toEqual({
                error: 'Conflict',
                details: 'A resource with this unique identifier already exists for SharedModel.'
            });
        });
    });

    describe('GET /:id', () => {
        it('should return a single transformed item', async () => {
            const { app, mockDb } = buildTestApp({
                transformResponse: (item: any) => ({ ...item, transformed: true })
            });

            const selectChain = createQueryChain({
                result: [{ id: 7, uri: 'test://model/7', model: { ok: true } }]
            });
            mockDb.selectChains.push(selectChain);

            const response = await request(app)
                .get('/crud/7')
                .expect(200);

            expect(selectChain.limit).toHaveBeenCalledWith(1);
            expect(response.body).toEqual({
                id: 7,
                uri: 'test://model/7',
                model: { ok: true },
                transformed: true
            });
        });

        it('should return 404 when the item does not exist', async () => {
            const { app, mockDb } = buildTestApp();
            mockDb.selectChains.push(createQueryChain({ result: [] }));

            const response = await request(app)
                .get('/crud/999')
                .expect(404);

            expect(response.body).toEqual({ error: 'Not found' });
        });
    });

    describe('PUT /:id', () => {
        it('should update and return the transformed item', async () => {
            const { app, mockDb } = buildTestApp({
                transformResponse: (item: any) => ({ ...item, transformed: true })
            });

            const updateChain = createQueryChain({
                result: [{ id: 5, uri: 'test://model/updated', model: { updated: true } }]
            });
            mockDb.updateChains.push(updateChain);

            const response = await request(app)
                .put('/crud/5')
                .send({
                    uri: 'test://model/updated',
                    model: { updated: true }
                })
                .expect(200);

            expect(updateChain.set).toHaveBeenCalledWith({
                uri: 'test://model/updated',
                model: { updated: true },
                organization: undefined
            });
            expect(response.body).toEqual({
                id: 5,
                uri: 'test://model/updated',
                model: { updated: true },
                transformed: true
            });
        });

        it('should return 409 when update violates a unique constraint', async () => {
            const { app, mockDb } = buildTestApp();
            const duplicateError = Object.assign(new Error('duplicate key'), { code: '23505' });

            mockDb.updateChains.push(createQueryChain({ error: duplicateError }));

            const response = await request(app)
                .put('/crud/5')
                .send({
                    uri: 'test://model/duplicate',
                    model: {}
                })
                .expect(409);

            expect(response.body).toEqual({
                error: 'Conflict',
                details: 'A resource with this unique identifier already exists for SharedModel.'
            });
        });
    });

    describe('DELETE /:id', () => {
        it('should delete the item and return a success payload', async () => {
            const { app, mockDb } = buildTestApp();
            const deleteChain = createQueryChain({ result: [] });
            mockDb.deleteChains.push(deleteChain);

            const response = await request(app)
                .delete('/crud/3')
                .expect(200);

            expect(mockDb.delete).toHaveBeenCalledWith(SharedModel);
            expect(response.body).toEqual({ status: 'deleted' });
        });
    });
});
