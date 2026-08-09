import { createHash } from 'crypto';
import { eq } from 'drizzle-orm';
import type { Database } from '../db/client';
import { Agreement } from '../db/schema';
import { AgreementNotFoundError } from './errors';
import { convertAgreement } from './agreementService';

// Legal Context Protocol (legalcontextprotocol.org v1.0) support.
//
// LCP defines exactly one discovery document per origin
// (/.well-known/legal-context.json, RFC 8615) with one REQUIRED field,
// `terms`. APAP hosts many agreements per origin, so the per-agreement
// documents built here (buildAgreementLegalContext) — not the root
// document — are the primary surface. The root document
// (buildServerLegalContext) is opt-in and only meaningful for a
// single-agreement deployment; see handlers/lcp.ts.

const DEFAULT_TERMS_FORMAT = 'markdown';

export interface AgreementTerms {
    body: string;
    atrHash: string;
    contentType: string;
}

export interface LcpDisputeResolution {
    method?: string;
    jurisdiction?: string;
    contact?: string;
    clauseId?: string;
    source?: string;
    catalog?: string;
}

export interface LcpContact {
    legal?: string;
    technical?: string;
}

export interface LegalContextDocument {
    terms: string;
    termsFormat?: string;
    atrHash?: string;
    acceptanceRequired: boolean;
    disputeResolution?: LcpDisputeResolution;
    returns?: string;
    contact?: LcpContact;
    api?: string;
}

/** Returns a "0x"-prefixed lowercase SHA-256 hex digest, per the LCP atrHash format. */
export function sha256AtrHash(value: string): string {
    return `0x${createHash('sha256').update(value, 'utf8').digest('hex')}`;
}

export function assertAtrHash(value: string): string {
    if (!/^0x[0-9a-f]{64}$/.test(value)) {
        throw new Error('LCP atrHash must be a lowercase 0x-prefixed SHA-256 digest');
    }
    return value;
}

export function assertAbsoluteHttpsUrl(value: string, label: string): string {
    let url: URL;
    try {
        url = new URL(value);
    } catch {
        throw new Error(`${label} must be an absolute URL`);
    }
    if (url.protocol !== 'https:') {
        throw new Error(`${label} must use https`);
    }
    return url.toString();
}

let warnedAboutMissingBaseUrl = false;

/**
 * Resolves the absolute origin used to build every URL in an emitted LCP
 * document. LCP requires `terms` (and any URL field) to be an absolute
 * https:// URL, so this always prefers the explicit APAP_PUBLIC_BASE_URL env
 * var, validated as https.
 *
 * Falling back to the inbound request's protocol/host is a dev-only
 * convenience: it produces a document that is not spec-compliant when the
 * request wasn't https, and trusting a client-supplied Host header for a URL
 * that gets hashed and re-fetched is not something to do in anything an
 * agent can actually reach. Callers pass the raw request protocol/host
 * (rather than an Express Request) to keep this module transport-agnostic.
 */
export function resolvePublicBaseUrl(opts: { requestProtocol: string; requestHost: string | undefined }): string {
    const configured = process.env.APAP_PUBLIC_BASE_URL;
    if (configured) {
        return assertAbsoluteHttpsUrl(configured, 'APAP_PUBLIC_BASE_URL');
    }
    if (!warnedAboutMissingBaseUrl) {
        console.warn(
            '[lcp] APAP_PUBLIC_BASE_URL is not set; deriving the base URL for LCP documents from the ' +
            'incoming request. This produces non-compliant (non-https) documents and trusts the Host ' +
            'header for a URL that gets hashed and re-fetched by clients. Set APAP_PUBLIC_BASE_URL in ' +
            'any deployment an agent can reach.',
        );
        warnedAboutMissingBaseUrl = true;
    }
    return `${opts.requestProtocol}://${opts.requestHost ?? 'localhost'}`;
}

/**
 * Fetches the exact bytes served as an agreement's LCP terms artifact, and
 * their SHA-256 digest. The digest is suitable as an HTTP ETag on the
 * /agreements/:id/terms response — an ETag is expected to change when the
 * underlying representation changes, so a live digest is exactly correct
 * there. It is deliberately NOT promoted into the `legal-context` document's
 * `atrHash` field; see buildAgreementLegalContext for why.
 */
export async function getAgreementTerms(
    db: Database,
    agreementId: number,
    format: string = DEFAULT_TERMS_FORMAT,
): Promise<AgreementTerms> {
    const body = await convertAgreement(db, agreementId, format);
    return {
        body,
        atrHash: sha256AtrHash(body),
        contentType: `text/${format}; charset=utf-8`,
    };
}

// Reserved Agreement.metadata key convention for the LCP fields that are
// legitimately advisory (disputeResolution, contact, returns,
// acceptanceRequired). terms/termsFormat/atrHash/api are never sourced from
// metadata: metadata is writable by any party with access to the agreement,
// so treating it as authoritative for the document's integrity fields would
// let a party forge its own atrHash.
const METADATA_KEY_PREFIX = 'lcp.';

function metadataMap(metadata: unknown): Map<string, string> {
    const map = new Map<string, string>();
    const values = (metadata as { values?: { key: string; value: string }[] } | null | undefined)?.values;
    if (!Array.isArray(values)) return map;
    for (const entry of values) {
        if (entry && typeof entry.key === 'string' && typeof entry.value === 'string') {
            map.set(entry.key, entry.value);
        }
    }
    return map;
}

/** Returns `obj` unless every property on it is `undefined`, in which case returns `undefined`. */
function omitIfEmpty<T extends Record<string, unknown>>(obj: T): T | undefined {
    return Object.values(obj).some((value) => value !== undefined) ? obj : undefined;
}

interface AdvisoryFields {
    acceptanceRequired: boolean;
    disputeResolution?: LcpDisputeResolution;
    contact?: LcpContact;
    returns?: string;
}

export function advisoryLegalContextFromMetadata(metadata: unknown): AdvisoryFields {
    const map = metadataMap(metadata);
    const get = (key: string) => map.get(`${METADATA_KEY_PREFIX}${key}`);

    return {
        acceptanceRequired: get('acceptanceRequired') === 'true',
        disputeResolution: omitIfEmpty({
            method: get('disputeResolution.method'),
            jurisdiction: get('disputeResolution.jurisdiction'),
            contact: get('disputeResolution.contact'),
            clauseId: get('disputeResolution.clauseId'),
            source: get('disputeResolution.source'),
            catalog: get('disputeResolution.catalog'),
        }),
        contact: omitIfEmpty({
            legal: get('contact.legal'),
            technical: get('contact.technical'),
        }),
        returns: get('returns'),
    };
}

/**
 * Builds the resource-scoped LCP document for one agreement. This is the
 * primary LCP surface for APAP: `atrHash`, `termsFormat`, `disputeResolution`
 * and `acceptanceRequired` are all meaningful per agreement and meaningless
 * averaged across a multi-tenant host.
 *
 * `atrHash` is intentionally omitted. The LCP schema requires that once
 * present, the terms document "MUST be byte-identical on every serve" —
 * but /agreements/:id/terms drafts from `agreement.data`, which is mutable
 * via the existing CRUD PUT/PATCH routes, so that promise cannot be honoured
 * today. Emitting a digest that can go stale on the next edit would make
 * this an L2 ("provable") claim the server cannot back. Pinning atrHash to
 * an immutable, version-pinned terms rendering is a follow-up; until then
 * this document is honestly L1.
 */
export async function buildAgreementLegalContext(
    db: Database,
    agreementId: number,
    baseUrl: string,
): Promise<LegalContextDocument> {
    const rows = await db.select().from(Agreement).where(eq(Agreement.id, agreementId)).limit(1);
    if (rows.length === 0) {
        throw new AgreementNotFoundError(String(agreementId));
    }
    const advisory = advisoryLegalContextFromMetadata(rows[0].metadata);

    return {
        terms: new URL(`/agreements/${agreementId}/terms`, baseUrl).toString(),
        termsFormat: DEFAULT_TERMS_FORMAT,
        acceptanceRequired: advisory.acceptanceRequired,
        disputeResolution: advisory.disputeResolution,
        returns: advisory.returns,
        contact: advisory.contact,
        api: new URL(`/agreements/${agreementId}`, baseUrl).toString(),
    };
}

/**
 * Builds the server-level (root) LCP document, or `undefined` when the
 * deployer hasn't configured one.
 *
 * APAP is a multi-tenant registry, not a single service transacting under
 * its own terms, so there is no agreement-neutral value that honestly fills
 * the schema's REQUIRED `terms` field. Rather than synthesize one (e.g.
 * pointing `terms` nowhere in particular, or misusing `api` as an index of
 * other parties' agreements — `api` is defined as a companion API to *these*
 * terms, not a directory), the root document only exists when explicitly
 * configured:
 *
 * - LCP_TERMS_URL (+ optional LCP_TERMS_HASH/LCP_TERMS_FORMAT/LCP_API_URL):
 *   an externally hosted terms document, mirroring the reference
 *   accord-x402-contract-server's env vars so a deployment can move between
 *   the two servers.
 * - LCP_ROOT_AGREEMENT_ID: the root document mirrors one locally-hosted
 *   agreement's legal-context document. Useful for single-agreement
 *   deployments; still omits atrHash for the same reason
 *   buildAgreementLegalContext does.
 *
 * When neither is set, callers should respond 404 — see handlers/lcp.ts.
 */
export async function buildServerLegalContext(
    db: Database,
    baseUrl: string,
): Promise<LegalContextDocument | undefined> {
    const termsUrl = process.env.LCP_TERMS_URL;
    if (termsUrl) {
        const termsHash = process.env.LCP_TERMS_HASH;
        const apiUrl = process.env.LCP_API_URL;
        return {
            terms: assertAbsoluteHttpsUrl(termsUrl, 'LCP_TERMS_URL'),
            termsFormat: process.env.LCP_TERMS_FORMAT ?? DEFAULT_TERMS_FORMAT,
            atrHash: termsHash ? assertAtrHash(termsHash) : undefined,
            acceptanceRequired: process.env.LCP_ACCEPTANCE_REQUIRED === 'true',
            disputeResolution: omitIfEmpty({
                method: process.env.LCP_DISPUTE_METHOD,
                jurisdiction: process.env.LCP_DISPUTE_JURISDICTION,
                contact: process.env.LCP_DISPUTE_CONTACT,
            }),
            contact: omitIfEmpty({
                legal: process.env.LCP_CONTACT_LEGAL,
                technical: process.env.LCP_CONTACT_TECHNICAL,
            }),
            api: apiUrl ? assertAbsoluteHttpsUrl(apiUrl, 'LCP_API_URL') : undefined,
        };
    }

    const rootAgreementId = process.env.LCP_ROOT_AGREEMENT_ID;
    if (rootAgreementId) {
        const id = Number(rootAgreementId);
        if (!Number.isFinite(id)) {
            throw new Error('LCP_ROOT_AGREEMENT_ID must be a numeric agreement id');
        }
        return buildAgreementLegalContext(db, id, baseUrl);
    }

    return undefined;
}
