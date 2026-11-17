import { randomBytes } from 'crypto';
import { readFileSync } from 'fs';
import path from 'path';
import { jest } from '@jest/globals';
import AdmZip from 'adm-zip';
import { eq, inArray, like } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';
import express from 'express';
import postgres from 'postgres';
import request from 'supertest';
import * as schema from '../db/schema';
import type { Database, DatabaseTransaction } from '../db/client';
import { globalErrorHandler } from '../middleware/errorHandler';
import { createLegacyPolicyContext } from '../services/policy';
import { deleteTemplate } from '../services/templateService';
import { HttpTemplateRetriever } from './retrievers/HttpTemplateRetriever';
import agreementsRouter from './agreements';
import templatesRouter from './templates';

const { Agreement, Template } = schema;
const relationship = 'resource:org.accordproject.protocol@1.0.0.Template#';
const postgresUrl = process.env.APAP_TEST_POSTGRES_URL;

function connect() {
    const client = postgres(postgresUrl, {
        max: 1,
        connect_timeout: 5,
        connection: { statement_timeout: 8000, idle_in_transaction_session_timeout: 10000 },
    });
    const db = drizzle(client, { schema, casing: 'snake_case' });
    const app = express();
    app.use(express.json());
    app.use((_req, res, next) => {
        res.locals.db = db;
        next();
    });
    app.use('/agreements', agreementsRouter);
    app.use('/templates', templatesRouter);
    app.use(globalErrorHandler);
    return { client, db, http: request.agent(app).timeout({ deadline: 12000 }) };
}

function stubArchive(name: string) {
    const fixture = path.join(__dirname, '../test/archives/latedeliveryandpenalty-typescript');
    const zip = new AdmZip();
    const manifest = JSON.parse(readFileSync(path.join(fixture, 'package.json'), 'utf8'));
    manifest.name = name;
    zip.addFile('package.json', Buffer.from(JSON.stringify(manifest)));
    zip.addLocalFolder(path.join(fixture, 'model'), 'model');
    zip.addLocalFile(path.join(fixture, 'text/grammar.tem.md'), 'text');
    zip.addLocalFile(path.join(fixture, 'logic/logic.ts'), 'logic');
    jest.spyOn(HttpTemplateRetriever.prototype, 'fetch').mockResolvedValue(zip.toBuffer());
}

// Pause at the real transaction's commit boundary, after the application has
// acquired its locks and finished its writes.
function pauseBeforeCommit(db: Database, rollback = false) {
    let ready: () => void;
    let release: () => void;
    const paused = new Promise<void>(resolve => { ready = resolve; });
    const resumed = new Promise<void>(resolve => { release = resolve; });
    const transaction = db.transaction.bind(db);
    const spy = jest.spyOn(db, 'transaction').mockImplementationOnce((callback, config) =>
        transaction(async (tx: DatabaseTransaction) => {
            const result = await callback(tx);
            ready();
            await resumed;
            if (rollback) throw new Error('Test rollback');
            return result;
        }, config),
    );
    return { paused, release, restore: () => spy.mockRestore() };
}

(postgresUrl ? describe : describe.skip)('Agreement template references on PostgreSQL', () => {
    jest.setTimeout(30000);
    let writer: ReturnType<typeof connect>;
    let deleter: ReturnType<typeof connect>;
    let observer: ReturnType<typeof connect>;
    let writerPid: number;
    let deleterPid: number;
    const runId = 'template-ref-' + randomBytes(12).toString('hex');
    const templateUris: string[] = [];
    let nextId = 0;

    beforeAll(async () => {
        writer = connect();
        deleter = connect();
        observer = connect();
        const [writerSession] = await writer.client`select pg_backend_pid() as pid`;
        const [deleterSession] = await deleter.client`select pg_backend_pid() as pid`;
        writerPid = writerSession.pid;
        deleterPid = deleterSession.pid;
    });

    afterEach(async () => {
        jest.restoreAllMocks();
        await observer.db.delete(Agreement).where(like(Agreement.uri, `apap://${runId}/%`));
        if (templateUris.length) {
            await observer.db.delete(Template).where(inArray(Template.uri, templateUris.splice(0)));
        }
    });

    afterAll(async () => {
        await Promise.all([writer, deleter, observer].map(connection => connection?.client.end({ timeout: 2 })));
    });

    async function waitForBlock(blocked: number, blocker: number, finished: () => boolean) {
        const deadline = Date.now() + 5000;
        while (Date.now() < deadline) {
            if (finished()) throw new Error('Second operation finished before waiting for the lock');
            const [state] = await observer.client`select ${blocker}::int = any(pg_blocking_pids(${blocked}::int)) as blocked`;
            if (state.blocked) return;
            await new Promise<void>(resolve => setTimeout(resolve, 20));
        }
        throw new Error(`Postgres backend ${blocked} did not wait on ${blocker}`);
    }

    async function interleave<T, U>(
        pause: ReturnType<typeof pauseBeforeCommit>,
        first: PromiseLike<T>,
        startSecond: () => PromiseLike<U>,
        blocked: number,
        blocker: number,
    ): Promise<[T, U]> {
        const firstResult = Promise.resolve(first);
        let secondResult: Promise<U>;
        let secondFinished = false;
        try {
            await Promise.race([
                pause.paused,
                firstResult.then(() => { throw new Error('First operation finished before reaching commit'); }),
            ]);
            secondResult = Promise.resolve(startSecond()).finally(() => { secondFinished = true; });
            // Keep a rejection handled while the observer polls PostgreSQL.
            void secondResult.catch((): void => {});
            await waitForBlock(blocked, blocker, () => secondFinished);
        } finally {
            pause.release();
            pause.restore();
            await Promise.allSettled([firstResult, secondResult]);
        }
        return [await firstResult, await secondResult];
    }

    async function localTemplate(uri = `ap://${runId}@1.0.0#template-${nextId++}`) {
        templateUris.push(uri);
        const [row] = await observer.db.insert(Template).values({
            uri, author: 'APAP', license: 'Apache-2.0', version: '1.0.0',
            metadata: {}, templateModel: {}, text: {},
        }).returning();
        return row;
    }

    function agreement(template: string) {
        return { uri: `apap://${runId}/${nextId++}`, template, agreementStatus: 'DRAFT', data: { amount: 1 } };
    }

    async function expectMissingAgreement(uri: string) {
        expect(await observer.db.select().from(Agreement).where(eq(Agreement.uri, uri))).toEqual([]);
    }

    it('blocks HTTP deletion until a URI-based create commits', async () => {
        const template = await localTemplate();
        const [created, deleted] = await interleave(
            pauseBeforeCommit(writer.db),
            writer.http.post('/agreements').send(agreement(template.uri)),
            () => deleter.http.delete(`/templates/${template.id}`),
            deleterPid, writerPid,
        );
        expect(created.status).toBe(200);
        expect(deleted.status).toBe(409);
        expect(deleted.body.error.code).toBe('TEMPLATE_IN_USE');
    });

    it.each(['ap', 'demo'])('rejects creation after the local %s template is deleted', async scheme => {
        const template = await localTemplate(`${scheme}://${runId}/local`);
        const body = agreement(relationship + template.uri);
        const [, created] = await interleave(
            pauseBeforeCommit(deleter.db),
            deleteTemplate(createLegacyPolicyContext(deleter.db), template.uri),
            () => writer.http.post('/agreements').send(body),
            writerPid, deleterPid,
        );
        expect(created.status).toBe(422);
        expect(created.body.error.code).toBe('TEMPLATE_NOT_FOUND');
        await expectMissingAgreement(body.uri);
    });

    it('blocks the standalone delete when PUT changes the reference to its target', async () => {
        const original = await localTemplate();
        const target = await localTemplate(`ap://${runId}@1.0.0#encoded%20target`);
        const body = agreement(original.uri);
        const created = await writer.http.post('/agreements').send(body);
        expect(created.status).toBe(200);
        const [updated, deleteError] = await interleave(
            pauseBeforeCommit(writer.db),
            writer.http.put(`/agreements/${created.body.id}`).send({ ...body, template: target.uri }),
            () => deleteTemplate(createLegacyPolicyContext(deleter.db), target.uri).catch(error => error),
            deleterPid, writerPid,
        );
        expect(updated.status).toBe(200);
        expect(deleteError).toMatchObject({ statusCode: 409, code: 'TEMPLATE_IN_USE' });
    });

    it('releases a reference lock on rollback and allows the waiting delete', async () => {
        const template = await localTemplate();
        const body = agreement(template.uri);
        const [created, deleted] = await interleave(
            pauseBeforeCommit(writer.db, true),
            writer.http.post('/agreements').send(body),
            () => deleter.http.delete(`/templates/${template.id}`),
            deleterPid, writerPid,
        );
        expect(created.status).toBe(500);
        expect(deleted.status).toBe(200);
        await expectMissingAgreement(body.uri);
    });

    it.each([false, true])('resolves a waiting PUT after deletion ends (rollback=%s)', async rollback => {
        const original = await localTemplate();
        const target = await localTemplate();
        const body = agreement(original.uri);
        const created = await writer.http.post('/agreements').send(body).expect(200);
        const [deleted, updated] = await interleave(
            pauseBeforeCommit(deleter.db, rollback),
            deleter.http.delete(`/templates/${target.id}`),
            () => writer.http.put(`/agreements/${created.body.id}`).send({ ...body, template: target.uri }),
            writerPid, deleterPid,
        );
        expect(deleted.status).toBe(rollback ? 500 : 200);
        expect(updated.status).toBe(rollback ? 200 : 422);
        if (!rollback) expect(updated.body.error.code).toBe('TEMPLATE_NOT_FOUND');
        const [stored] = await observer.db.select().from(Agreement).where(eq(Agreement.uri, body.uri));
        expect(stored.template).toBe(rollback ? relationship + encodeURI(target.uri) : created.body.template);
    });

    it.each(['bare', 'raw relationship', 'encodeURIComponent', 'encodeURI'] as const)(
        'protects a stored %s reference with an unambiguous URI',
        async spelling => {
            const target = await localTemplate(`ap://${runId}@1.0.0#release/[1]?mode=x&tag=café`);
            const references = {
                bare: target.uri,
                'raw relationship': relationship + target.uri,
                encodeURIComponent: relationship + encodeURIComponent(target.uri),
                encodeURI: relationship + encodeURI(target.uri),
            };
            await observer.db.insert(Agreement).values({
                ...agreement(references[spelling]),
                agreementStatus: 'DRAFT',
            });
            await deleter.http.delete(`/templates/${target.id}`).expect(409);
        },
    );

    it('protects the decoded target of a legacy mixed encoding when both candidates exist', async () => {
        const uri = `ap://${runId}/x/(v)?q=a b/c&tag=café`;
        const fragment = `ap://${runId}/%78/(v)?q=a%20b%2fc&tag=caf%c3%A9`;
        const target = await localTemplate(uri);
        const literal = await localTemplate(fragment);
        const legacy = agreement(relationship + fragment);
        // Simulate a row stored by an older POST without rewriting its reference.
        await observer.db.insert(Agreement).values({ ...legacy, agreementStatus: 'DRAFT' });
        await expect(deleteTemplate(createLegacyPolicyContext(deleter.db), uri))
            .rejects.toMatchObject({ code: 'TEMPLATE_IN_USE' });

        const [posted, deleted] = await interleave(
            pauseBeforeCommit(writer.db),
            writer.http.post('/agreements').send(agreement(legacy.template)),
            () => deleter.http.delete(`/templates/${target.id}`),
            deleterPid, writerPid,
        );
        expect(posted.status).toBe(200);
        expect(posted.body.template).toBe(legacy.template);
        expect(deleted.status).toBe(409);
        await deleter.http.delete(`/templates/${literal.id}`).expect(200);

        const escaped = await localTemplate(`ap://${runId}/a%20b%2Fc`);
        const created = await writer.http.post('/agreements').send(agreement(escaped.uri)).expect(200);
        expect(created.body.template).toBe(relationship + encodeURIComponent(escaped.uri));
        await deleter.http.delete(`/templates/${escaped.id}`).expect(409);
    });

    it('rejects missing local references on POST and PUT without changing stored data', async () => {
        const template = await localTemplate();
        const body = agreement(template.uri);
        const missing = agreement(`ap://${runId}@1.0.0#missing`);
        const created = await writer.http.post('/agreements').send(body);
        expect(created.status).toBe(200);
        const rejectedCreate = await writer.http.post('/agreements').send(missing);
        const rejectedUpdate = await writer.http.put(`/agreements/${created.body.id}`)
            .send({ ...body, template: missing.template });
        for (const response of [rejectedCreate, rejectedUpdate]) {
            expect(response.status).toBe(422);
            expect(response.body.error.code).toBe('TEMPLATE_NOT_FOUND');
        }
        await expectMissingAgreement(missing.uri);
        const [stored] = await observer.db.select().from(Agreement).where(eq(Agreement.uri, body.uri));
        expect(stored.template).toBe(created.body.template);
    });

    it('defers an unsupported external relationship and rejects an arbitrary missing identifier', async () => {
        const external = await writer.http.post('/agreements')
            .send(agreement(relationship + 'demo://external/template'));
        const missing = await writer.http.post('/agreements').send(agreement(relationship + 'local-id'));
        expect(external.status).toBe(200);
        expect(external.body.templateHash).toBeNull();
        expect(missing.status).toBe(422);
        expect(missing.body.error.code).toBe('TEMPLATE_NOT_FOUND');
    });

    it('rolls back cache insertion on agreement failure, then protects the cache by hash', async () => {
        const original = await localTemplate();
        const duplicate = agreement(original.uri);
        expect((await writer.http.post('/agreements').send(duplicate)).status).toBe(200);
        const cacheUri = `https://templates.accordproject.org/${runId}.cta`;
        templateUris.push(cacheUri);
        stubArchive(runId);
        const rejected = await writer.http.post('/agreements').send({ ...duplicate, template: cacheUri });
        expect(rejected.status).toBe(409);
        expect(await observer.db.select().from(Template).where(eq(Template.uri, cacheUri))).toEqual([]);

        const created = await writer.http.post('/agreements').send(agreement(cacheUri));
        expect(created.status).toBe(200);
        const [cached] = await observer.db.select().from(Template).where(eq(Template.uri, cacheUri));
        expect(created.body.templateHash).toBeTruthy();
        expect(created.body.templateHash).toBe(cached.hash);
        // The archive is now cached under a different URI from the next
        // agreement, so its deletion guard can only match the new agreement by hash.
        await observer.db.delete(Agreement).where(eq(Agreement.id, created.body.id));
        const otherUri = `https://templates.accordproject.org/${runId}-alias.cta`;
        const [alias, deleted] = await interleave(
            pauseBeforeCommit(writer.db),
            writer.http.post('/agreements').send(agreement(otherUri)),
            () => deleter.http.delete(`/templates/${cached.id}`),
            deleterPid, writerPid,
        );
        expect(alias.status).toBe(200);
        expect(alias.body.templateHash).toBe(cached.hash);
        expect(deleted.status).toBe(409);
        expect(deleted.body.error.code).toBe('TEMPLATE_IN_USE');

        await observer.db.delete(Agreement).where(eq(Agreement.id, alias.body.id));
        const late = agreement(otherUri);
        const [removed, rejectedCreate] = await interleave(
            pauseBeforeCommit(deleter.db),
            deleter.http.delete(`/templates/${cached.id}`),
            () => writer.http.post('/agreements').send(late),
            writerPid, deleterPid,
        );
        expect(removed.status).toBe(200);
        expect(rejectedCreate.status).toBe(422);
        expect(rejectedCreate.body.error.code).toBe('TEMPLATE_NOT_FOUND');
        await expectMissingAgreement(late.uri);
    });

    it('serializes concurrent cache misses and reuses the winning archive hash', async () => {
        const cacheUri = `https://templates.accordproject.org/${runId}-concurrent.cta`;
        templateUris.push(cacheUri);
        stubArchive(runId + '-concurrent');
        const [first, second] = await interleave(
            pauseBeforeCommit(writer.db),
            writer.http.post('/agreements').send(agreement(cacheUri)),
            () => deleter.http.post('/agreements').send(agreement(cacheUri)),
            deleterPid, writerPid,
        );
        expect(first.status).toBe(200);
        expect(second.status).toBe(200);
        const cached = await observer.db.select().from(Template).where(eq(Template.uri, cacheUri));
        expect(cached).toHaveLength(1);
        expect(first.body.templateHash).toBe(cached[0].hash);
        expect(second.body.templateHash).toBe(cached[0].hash);
    });
});
