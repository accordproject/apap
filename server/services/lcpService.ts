import { createHash } from 'crypto';
import { eq } from 'drizzle-orm';
import type { Database } from '../db/client';
import { Agreement } from '../db/schema';
import { AgreementNotFoundError } from './errors';
import { convertAgreement } from './agreementService';

// Statuses under which `Agreement.data` — what /agreements/:id/terms
// renders from — is guaranteed not to change, per
// agreementService.ts's assertAgreementRecordMutable: `data` freezes from
// SIGNING onward (a signatory's signature must not be invalidated by the
// terms moving under them), and the full record freezes from
// COMPLETED/SUPERSEDED. Deliberately not imported from agreementService.ts:
// that module's internal frozen-status constants are private and have
// already been renamed once independently of this file. AgreementStatusType
// has exactly four values (DRAFT, SIGNING, COMPLETED, SUPERSEDED), so
// "not DRAFT" is an exact, stable restatement of "data is frozen" that
// doesn't depend on agreementService.ts's internal naming — but it does
// depend on that invariant holding, so if assertAgreementRecordMutable's
// data-freeze point ever moves, this must move with it.
const DRAFT_STATUS = 'DRAFT';

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

// The generated OpenAPI schema (derived from model/protocol.cto) marks
// `$class` as a required discriminator on LegalContext and on its nested
// DisputeResolution/Contact concepts, matching every other Concerto-typed
// payload this server emits (see templatebuilder.ts's CtoModel stamping and
// concertovalidation.ts's fromJSON/toJSON round-trip). These documents are
// assembled fresh per request rather than round-tripped from a DB row, so
// nothing stamps `$class` automatically — it's added explicitly here instead.
const LEGAL_CONTEXT_CLASS = 'org.accordproject.protocol@1.0.0.LegalContext';
const DISPUTE_RESOLUTION_CLASS = 'org.accordproject.protocol@1.0.0.DisputeResolution';
const CONTACT_CLASS = 'org.accordproject.protocol@1.0.0.Contact';

/** Stamps `$class` onto a nested concept, or passes `undefined` through unchanged. */
function withClass<T extends object>(
    obj: T | undefined,
    $class: string,
): (T & { $class: string }) | undefined {
    return obj === undefined ? undefined : { $class, ...obj };
}

export interface AgreementTerms {
    body: string;
    atrHash: string;
    contentType: string;
}

export interface DisputeResolution {
    method?: string;
    jurisdiction?: string;
    contact?: string;
    clauseId?: string;
    source?: string;
    catalog?: string;
}

export interface Contact {
    legal?: string;
    technical?: string;
}

export interface LegalContextDocument {
    $class: string;
    terms: string;
    termsFormat?: string;
    atrHash?: string;
    acceptanceRequired: boolean;
    disputeResolution?: DisputeResolution & { $class: string };
    returns?: string;
    contact?: Contact & { $class: string };
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

/**
 * Resolves the absolute origin used to build every URL in an emitted LCP
 * document. LCP requires `terms` (and any URL field) to be an absolute
 * https:// URL, so this only ever uses the explicit APAP_PUBLIC_BASE_URL env
 * var, validated as https.
 *
 * There is deliberately no fallback to the inbound request's protocol/host:
 * `Host` is client-controlled, and this server has no `trust proxy`
 * configuration to make `req.protocol` trustworthy either, so deriving the
 * base URL from the request would let any caller point a served LCP
 * document's `terms`/`api` fields at an origin of their choosing — exactly
 * the kind of forged integrity claim this feature exists to prevent. Failing
 * closed (a 500 via the thrown error) when the deployer hasn't configured a
 * trusted base is safer than silently emitting a spoofable document.
 */
export function resolvePublicBaseUrl(): string {
    const configured = process.env.APAP_PUBLIC_BASE_URL;
    if (!configured) {
        throw new Error(
            'APAP_PUBLIC_BASE_URL must be set to serve Legal Context Protocol documents. ' +
            'Deriving the base URL from the incoming request is not safe: the Host header ' +
            'is client-controlled, so it could point a served document at an attacker-chosen origin.',
        );
    }
    return assertAbsoluteHttpsUrl(configured, 'APAP_PUBLIC_BASE_URL');
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
    disputeResolution?: DisputeResolution;
    contact?: Contact;
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
 * `atrHash` is included once — and only once — `agreementStatus` is not
 * `DRAFT` (i.e. SIGNING, COMPLETED, or SUPERSEDED). The LCP schema requires
 * that once `atrHash` is present, the terms document "MUST be byte-identical
 * on every serve": before agreementService.ts's `assertAgreementRecordMutable`
 * guard existed, `/agreements/:id/terms` drafted from `agreement.data`, which
 * was mutable via `PUT` at any time, so the promise couldn't be honoured and
 * this document stayed honestly L1. That guard now freezes `data` as soon as
 * SIGNING begins — a signatory's signature must not be invalidated by the
 * terms moving under them — and freezes the full record from
 * COMPLETED/SUPERSEDED, so a non-DRAFT agreement's terms really are pinned
 * and `atrHash` is safe to claim from SIGNING onward. Only a DRAFT agreement
 * still omits it.
 *
 * The terms rendering also depends on the *Template* referenced by
 * `agreement.template`/`templateHash` — its `text`/`logic` — which templates
 * are now immutable once created (see templateService.ts's
 * `assertTemplateContentImmutable`), so this no longer undermines the claim:
 * neither the agreement's `data` nor the template it renders against can
 * change out from under a byte-pinned terms document.
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
    const agreement = rows[0];
    const advisory = advisoryLegalContextFromMetadata(agreement.metadata);

    const atrHash = agreement.agreementStatus !== DRAFT_STATUS
        ? (await getAgreementTerms(db, agreementId)).atrHash
        : undefined;

    return {
        $class: LEGAL_CONTEXT_CLASS,
        terms: new URL(`/agreements/${agreementId}/terms`, baseUrl).toString(),
        termsFormat: DEFAULT_TERMS_FORMAT,
        atrHash,
        acceptanceRequired: advisory.acceptanceRequired,
        disputeResolution: withClass(advisory.disputeResolution, DISPUTE_RESOLUTION_CLASS),
        returns: advisory.returns,
        contact: withClass(advisory.contact, CONTACT_CLASS),
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
 *   agreement's legal-context document, including `atrHash` under the exact
 *   same SIGNING-onward gating buildAgreementLegalContext applies — it is
 *   not always omitted, only while that agreement is still DRAFT. Useful
 *   for single-agreement deployments.
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
            $class: LEGAL_CONTEXT_CLASS,
            terms: assertAbsoluteHttpsUrl(termsUrl, 'LCP_TERMS_URL'),
            termsFormat: process.env.LCP_TERMS_FORMAT ?? DEFAULT_TERMS_FORMAT,
            atrHash: termsHash ? assertAtrHash(termsHash) : undefined,
            acceptanceRequired: process.env.LCP_ACCEPTANCE_REQUIRED === 'true',
            disputeResolution: withClass(omitIfEmpty({
                method: process.env.LCP_DISPUTE_METHOD,
                jurisdiction: process.env.LCP_DISPUTE_JURISDICTION,
                contact: process.env.LCP_DISPUTE_CONTACT,
            }), DISPUTE_RESOLUTION_CLASS),
            contact: withClass(omitIfEmpty({
                legal: process.env.LCP_CONTACT_LEGAL,
                technical: process.env.LCP_CONTACT_TECHNICAL,
            }), CONTACT_CLASS),
            api: apiUrl ? assertAbsoluteHttpsUrl(apiUrl, 'LCP_API_URL') : undefined,
        };
    }

    const rootAgreementId = process.env.LCP_ROOT_AGREEMENT_ID;
    if (rootAgreementId) {
        // Same positive-integer-string format the agreement routes require
        // (agreements.ts's `/^\d+$/` id check) — Number.isFinite alone would
        // also accept "1.5" or "-1", which would reach the Drizzle query
        // below as a non-serial value instead of failing as a config error.
        if (!/^\d+$/.test(rootAgreementId)) {
            throw new Error('LCP_ROOT_AGREEMENT_ID must be a non-negative integer agreement id');
        }
        return buildAgreementLegalContext(db, Number(rootAgreementId), baseUrl);
    }

    return undefined;
}
