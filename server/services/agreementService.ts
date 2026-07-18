import { eq } from 'drizzle-orm';
import { Agreement } from '../db/schema';
import type { Database } from '../db/client';
import { AgreementNotFoundError } from './errors';

// Slice 2 ports only the CRUD lookup half of the POC's agreementService. The
// POC's `convertAgreement` and `triggerAgreement` are stubs; the RI's REST
// route at `server/handlers/agreements.ts` already runs the real
// `TemplateArchiveProcessor` from @accordproject/template-engine for those
// paths. Porting those upstream deserves its own slice (2b) that wraps the
// real engine rather than replacing it with a POC stub.

type AgreementRow = typeof Agreement.$inferSelect;

/** Replaces: makeApiRequest(`${API_BASE_URL}/agreements`) */
export async function listAgreements(db: Database): Promise<AgreementRow[]> {
    return db.select().from(Agreement);
}

/** Replaces: makeApiRequest(`${API_BASE_URL}/agreements/${id}`) */
export async function getAgreementById(db: Database, id: number): Promise<AgreementRow> {
    const rows = await db.select().from(Agreement).where(eq(Agreement.id, id)).limit(1);
    if (rows.length === 0) throw new AgreementNotFoundError(String(id));
    return rows[0];
}
