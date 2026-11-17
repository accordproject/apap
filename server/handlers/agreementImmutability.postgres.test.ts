import { randomBytes } from 'crypto';
import express from 'express';
import request from 'supertest';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { eq } from 'drizzle-orm';
import * as schema from '../db/schema';
import agreementsRouter from './agreements';
import { globalErrorHandler } from '../middleware/errorHandler';

const testUrl = process.env.APAP_TEST_POSTGRES_URL;
const ciUrl = 'postgres://postgres:1baddeed@localhost:5432/apap_310_ci';

function isDisposableCiDatabase(url: string | undefined, githubActions: string | undefined, marker: string | undefined): boolean {
    return url === ciUrl && githubActions === 'true' && marker === '1';
}

describe('PostgreSQL test target safety', () => {
    it('accepts only the explicitly marked GitHub Actions database', () => {
        expect(isDisposableCiDatabase(ciUrl, 'true', '1')).toBe(true);
        expect(isDisposableCiDatabase(ciUrl, undefined, '1')).toBe(false);
        expect(isDisposableCiDatabase(ciUrl, 'true', undefined)).toBe(false);
        expect(isDisposableCiDatabase('postgres://postgres:1baddeed@localhost:5432/postgres', 'true', '1')).toBe(false);
        expect(isDisposableCiDatabase('postgres://postgres:1baddeed@remote:5432/apap_310_ci', 'true', '1')).toBe(false);
    });
});

(testUrl ? describe : describe.skip)('agreement immutability on PostgreSQL', () => {
    jest.setTimeout(30000);

    it('preserves protected fields on equivalent resends and rejects changed terms', async () => {
        // This test creates and deletes rows in a purpose-created CI database.
        if (!isDisposableCiDatabase(testUrl, process.env.GITHUB_ACTIONS, process.env.APAP_DISPOSABLE_POSTGRES)) {
            throw new Error('This test only runs against the dedicated GitHub Actions PostgreSQL service');
        }
        const client = postgres(testUrl!, { max: 2, connect_timeout: 5 });
        const db = drizzle(client, { schema, casing: 'snake_case' });
        const app = express();
        app.use(express.json());
        app.use((_req, res, next) => { res.locals.db = db; next(); });
        app.use('/agreements', agreementsRouter);
        app.use(globalErrorHandler);
        const http = request(app);
        const id = randomBytes(12).toString('hex');
        const uri = `apap://immutability-test-${id}`;
        const template = `ap://immutability-test-${id}@1.0.0#fixture`;
        const terms = { price: 10, nested: { first: 1, second: 2 } };
        const reordered = { nested: { second: 2, first: 1 }, price: 10 };
        let agreementId: number | undefined;

        async function snapshot() {
            const [row] = await client`select id, uri, agreement_status, data::text as data_storage,
                template, template_hash, signatures::text as signatures_storage,
                history_entries::text as history_storage, a."references"::text as references_storage,
                to_jsonb(a)::text as row_storage, xmin::text as row_version
                from "Agreement" as a where id = ${agreementId!}`;
            expect(row).toBeDefined();
            return row;
        }
        function unchangedProtected(before: any, after: any) {
            for (const field of ['data_storage', 'template_hash', 'signatures_storage', 'history_storage']) {
                expect(after[field]).toBe(before[field]);
            }
        }

        try {
            const columns = await client`select column_name from information_schema.columns
                where table_schema = current_schema() and table_name = 'Agreement'
                and data_type in ('timestamp without time zone', 'timestamp with time zone') order by column_name`;
            const triggers = await client`select tgname from pg_trigger
                where tgrelid = '"Agreement"'::regclass and not tgisinternal order by tgname`;
            console.info({ event: 'agreement_schema_inspection', timestampColumns: columns.map(c => c.column_name), userTriggers: triggers.map(t => t.tgname) });
            // This CI fixture must not silently hide effects from additional audit triggers.
            expect(triggers).toEqual([]);

            await db.insert(schema.Template).values({
                uri: template, author: 'APAP test', version: '1.0.0', license: 'Apache-2.0',
                metadata: {}, templateModel: {}, text: {},
            });
            const original = { uri, template, agreementStatus: 'DRAFT', data: terms };
            const created = await http.post('/agreements').send(original);
            expect(created.status).toBe(200);
            agreementId = created.body.id;
            expect(typeof agreementId).toBe('number');

            const signing = { ...original, agreementStatus: 'SIGNING' };
            const transitioned = await http.put(`/agreements/${agreementId}`).send(signing);
            expect(transitioned.status).toBe(200);
            // Synthetic signature and history sentinels make accidental changes observable.
            await client`update "Agreement" set signatures = ARRAY[${JSON.stringify({ marker: 'signature-sentinel' })}::json],
                history_entries = ARRAY[${JSON.stringify({ marker: 'history-sentinel' })}::json]
                where id = ${agreementId!}`;
            const beforeSigning = await snapshot();
            expect(beforeSigning.agreement_status).toBe('SIGNING');

            const signedResend = await http.put(`/agreements/${agreementId}`).send({ ...signing, data: reordered, references: ['urn:apap:test:reference'] });
            expect(signedResend.status).toBe(200);
            const afterSigning = await snapshot();
            unchangedProtected(beforeSigning, afterSigning);
            expect(afterSigning.references_storage).toContain('urn:apap:test:reference');
            expect(afterSigning.row_version).not.toBe(beforeSigning.row_version);

            const changedSigning = await http.put(`/agreements/${agreementId}`).send({ ...signing, data: { ...terms, price: 11 } });
            expect(changedSigning.status).toBe(409);
            const afterRejectedSigning = await snapshot();
            expect(afterRejectedSigning.row_storage).toBe(afterSigning.row_storage);
            expect(afterRejectedSigning.row_version).toBe(afterSigning.row_version);

            const completed = { ...signing, agreementStatus: 'COMPLETED', references: ['urn:apap:test:reference'] };
            const completeResponse = await http.put(`/agreements/${agreementId}`).send(completed);
            expect(completeResponse.status).toBe(200);
            const beforeCompleted = await snapshot();
            expect(beforeCompleted.agreement_status).toBe('COMPLETED');
            const completedResend = await http.put(`/agreements/${agreementId}`).send({ ...completed, data: reordered });
            expect(completedResend.status).toBe(200);
            const afterCompleted = await snapshot();
            unchangedProtected(beforeCompleted, afterCompleted);
            expect(afterCompleted.template).toBe(beforeCompleted.template);
            expect(afterCompleted.row_storage).toBe(beforeCompleted.row_storage);
            expect(afterCompleted.row_version).not.toBe(beforeCompleted.row_version);
            console.info({ event: 'agreement_immutability_persistence',
                signingTemplateSpellingChanged: beforeSigning.template !== afterSigning.template,
                completedTemplateSpellingChanged: beforeCompleted.template !== afterCompleted.template,
                signingUpdateExecuted: beforeSigning.row_version !== afterSigning.row_version,
                completedUpdateExecuted: beforeCompleted.row_version !== afterCompleted.row_version });

            const changedCompleted = await http.put(`/agreements/${agreementId}`).send({ ...completed, data: { ...terms, price: 11 } });
            expect(changedCompleted.status).toBe(409);
            const afterRejectedCompleted = await snapshot();
            expect(afterRejectedCompleted.row_storage).toBe(afterCompleted.row_storage);
            expect(afterRejectedCompleted.row_version).toBe(afterCompleted.row_version);
        } finally {
            try {
                await db.delete(schema.Agreement).where(eq(schema.Agreement.uri, uri));
                await db.delete(schema.Template).where(eq(schema.Template.uri, template));
            } finally {
                await client.end({ timeout: 2 });
            }
        }
    });
});
