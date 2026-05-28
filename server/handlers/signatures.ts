import { createHash } from 'crypto';
import * as vcSigner from './vcSigner';

// canonicalize@3 is ESM-only with a default export. Same dynamic-import trick
// as vcSigner.ts to avoid tsc downleveling to require().
let canonicalizeFn: ((value: unknown) => string) | null = null;
async function loadCanonicalize(): Promise<(value: unknown) => string> {
    if (canonicalizeFn) return canonicalizeFn;
    const mod = await (Function('return import("canonicalize")')() as Promise<{ default: (v: unknown) => string }>);
    canonicalizeFn = mod.default;
    return canonicalizeFn;
}

export type AgreementPartyLite = {
    partyId?: string;
    name?: string;
    signatory?: boolean;
    [k: string]: unknown;
};

export type CredentialSubject = {
    id?: string;
    type?: string;
    agreementUri?: string;
    agreementDataHash?: string;
    templateHash?: string | null;
    signatory?: { did?: string; partyId?: string; name?: string };
    signedAt?: string;
    evidence?: unknown;
};

export type VerifiableCredential = {
    '@context'?: unknown;
    type?: string[] | string;
    issuer?: string | { id: string };
    credentialSubject?: CredentialSubject;
    proof?: unknown;
};

export type SignatureRecord = {
    signatory: AgreementPartyLite;
    signedAt?: string;
    metadata?: unknown;
    signatureImage?: unknown;
    verifiableCredential?: VerifiableCredential;
};

export type AgreementLite = {
    uri: string;
    data: unknown;
    templateHash?: string | null;
    agreementParties?: AgreementPartyLite[];
    signatures?: SignatureRecord[];
};

/**
 * SHA-256 hex of the JCS-canonicalized agreement data. This is the value clients
 * must put into credentialSubject.agreementDataHash so the server can re-derive
 * and compare without trusting client-supplied bytes.
 */
export async function hashAgreementData(data: unknown): Promise<string> {
    const canonicalize = await loadCanonicalize();
    const json = canonicalize(data);
    if (typeof json !== 'string') {
        throw new Error('Failed to canonicalize agreement data');
    }
    return createHash('sha256').update(json).digest('hex');
}

function issuerDid(vc: VerifiableCredential): string | undefined {
    if (!vc.issuer) return undefined;
    return typeof vc.issuer === 'string' ? vc.issuer : vc.issuer.id;
}

function partyMatches(party: AgreementPartyLite, partyId: string): boolean {
    return party.partyId === partyId || (party as any).id === partyId;
}

export type ValidationFailure = { code: string; message: string };

/**
 * Validates that a posted VC is a well-formed AgreementSignatureCredential for
 * the given agreement. Returns a failure descriptor on the first problem, or
 * null on success. Cryptographic verification is performed first; everything
 * after that is structural / business-rule checks.
 */
export async function validateSignatureCredential(
    vc: VerifiableCredential,
    agreement: AgreementLite,
): Promise<ValidationFailure | null> {
    if (!vc || typeof vc !== 'object') {
        return { code: 'INVALID_BODY', message: 'Request body must be a VerifiableCredential object' };
    }

    try {
        await vcSigner.verifyCredential(vc);
    } catch (err: any) {
        return { code: 'INVALID_PROOF', message: `Proof verification failed: ${err?.message ?? String(err)}` };
    }

    const subject = vc.credentialSubject;
    if (!subject) {
        return { code: 'MISSING_SUBJECT', message: 'credentialSubject is required' };
    }
    if (subject.agreementUri !== agreement.uri) {
        return { code: 'AGREEMENT_URI_MISMATCH', message: `credentialSubject.agreementUri ${subject.agreementUri} does not match agreement.uri ${agreement.uri}` };
    }

    const expectedHash = await hashAgreementData(agreement.data);
    if (subject.agreementDataHash !== expectedHash) {
        return { code: 'DATA_HASH_MISMATCH', message: 'credentialSubject.agreementDataHash does not match the current agreement data' };
    }

    if ((agreement.templateHash ?? null) !== (subject.templateHash ?? null)) {
        return { code: 'TEMPLATE_HASH_MISMATCH', message: 'credentialSubject.templateHash does not match the agreement template' };
    }

    const sigSubject = subject.signatory;
    if (!sigSubject?.partyId || !sigSubject?.did) {
        return { code: 'INVALID_SIGNATORY', message: 'credentialSubject.signatory.{partyId,did} are required' };
    }

    const issuer = issuerDid(vc);
    if (!issuer || issuer !== sigSubject.did) {
        return { code: 'ISSUER_SIGNATORY_MISMATCH', message: 'VC issuer DID must equal credentialSubject.signatory.did' };
    }

    const party = (agreement.agreementParties ?? []).find(p => partyMatches(p, sigSubject.partyId!));
    if (!party) {
        return { code: 'UNKNOWN_PARTY', message: `No AgreementParty with partyId ${sigSubject.partyId}` };
    }
    if (party.signatory !== true) {
        return { code: 'NON_SIGNATORY_PARTY', message: `Party ${sigSubject.partyId} is not marked as a signatory` };
    }

    const alreadySigned = (agreement.signatures ?? []).some(s =>
        s.verifiableCredential && s.signatory && partyMatches(s.signatory, sigSubject.partyId!)
    );
    if (alreadySigned) {
        return { code: 'DUPLICATE_SIGNATURE', message: `Party ${sigSubject.partyId} has already signed` };
    }

    return null;
}

/**
 * Re-verifies every cryptographic signature on an agreement against the agreement's
 * current state. Used by /verify-signatures to detect post-signing tampering.
 */
export async function verifyAllSignatures(agreement: AgreementLite): Promise<{
    results: Array<{ partyId: string | undefined; valid: boolean; reason?: string }>;
    allValid: boolean;
}> {
    const sigs = (agreement.signatures ?? []).filter(s => s.verifiableCredential);
    const results = await Promise.all(sigs.map(async s => {
        const vc = s.verifiableCredential!;
        const partyId = vc.credentialSubject?.signatory?.partyId ?? s.signatory?.partyId;
        const failure = await validateSignatureCredentialForVerify(vc, agreement);
        return failure
            ? { partyId, valid: false, reason: `${failure.code}: ${failure.message}` }
            : { partyId, valid: true };
    }));
    return { results, allValid: results.every(r => r.valid) };
}

/**
 * Like validateSignatureCredential but skips the "already signed" check (we
 * expect every signature to appear in agreement.signatures during verify).
 */
async function validateSignatureCredentialForVerify(
    vc: VerifiableCredential,
    agreement: AgreementLite,
): Promise<ValidationFailure | null> {
    const withoutSelf: AgreementLite = {
        ...agreement,
        signatures: (agreement.signatures ?? []).filter(s => s.verifiableCredential !== vc),
    };
    return validateSignatureCredential(vc, withoutSelf);
}

/**
 * Computes the next AgreementStatusType after adding/removing signatures.
 */
export function nextAgreementStatus(agreement: AgreementLite): 'DRAFT' | 'SIGNING' | 'COMPLETED' {
    const requiredCount = (agreement.agreementParties ?? []).filter(p => p.signatory === true).length;
    const signedCount = (agreement.signatures ?? []).filter(s => s.verifiableCredential).length;
    if (signedCount === 0) return 'DRAFT';
    if (signedCount >= requiredCount && requiredCount > 0) return 'COMPLETED';
    return 'SIGNING';
}
