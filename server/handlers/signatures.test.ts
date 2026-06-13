import { jest } from '@jest/globals';
import crypto from 'crypto';
import request from 'supertest';
import express from 'express';

import { hashAgreementData, nextAgreementStatus, validateSignatureCredential, verifyAllSignatures } from './signatures';
import * as vcSigner from './vcSigner';
import agreementsRouter from './agreements';
import { Agreement } from '../db/schema';

jest.mock('../db/schema');
jest.setTimeout(30000);

/**
 * Mints an encrypted Ed25519 PEM, loads it via vc-signer, derives a did:key,
 * and returns everything a test needs to issue a signed VC.
 */
async function newSigner(): Promise<{ keyInfo: any; did: string; verificationMethodId: string }> {
    const passphrase = 'test-passphrase';
    // @types/node 10 predates ed25519; cast through any.
    const { privateKey } = (crypto as any).generateKeyPairSync('ed25519');
    const pem = (privateKey as any).export({
        type: 'pkcs8',
        format: 'pem',
        cipher: 'aes-256-cbc',
        passphrase,
    }) as string;

    const keyInfo = await vcSigner.loadSigningKey({ privateKeyPem: { pem, passphrase } });
    const { did, verificationMethodId } = await vcSigner.deriveDidKey(keyInfo.publicJwk);
    return { keyInfo, did, verificationMethodId };
}

const sampleAgreementData = { offer: 'pay $10', deadline: '2026-12-31' };

async function buildSignedVc(opts: {
    keyInfo: any;
    did: string;
    agreementUri: string;
    agreementDataHash: string;
    templateHash: string | null;
    partyId: string;
    partyName?: string;
    overrides?: Record<string, unknown>;
}) {
    const subject = {
        id: opts.agreementUri,
        type: 'AgreementSignature',
        agreementUri: opts.agreementUri,
        agreementDataHash: opts.agreementDataHash,
        templateHash: opts.templateHash,
        signatory: { did: opts.did, partyId: opts.partyId, name: opts.partyName ?? opts.partyId },
        signedAt: new Date().toISOString(),
        ...opts.overrides,
    };
    return vcSigner.signCredential({
        type: ['VerifiableCredential', 'AgreementSignatureCredential'],
        subject,
        signer: { keyInfo: opts.keyInfo },
    });
}

describe('signatures helper', () => {
    it('hashAgreementData is deterministic regardless of key ordering', async () => {
        const a = await hashAgreementData({ b: 2, a: 1, nested: { y: 'y', x: 'x' } });
        const b = await hashAgreementData({ a: 1, nested: { x: 'x', y: 'y' }, b: 2 });
        expect(a).toBe(b);
    });

    it('nextAgreementStatus transitions DRAFT -> SIGNING -> COMPLETED', () => {
        const parties = [
            { partyId: 'alice', signatory: true },
            { partyId: 'bob', signatory: true },
            { partyId: 'observer', signatory: false },
        ];
        const base = { uri: 'u', data: {}, agreementParties: parties };
        expect(nextAgreementStatus({ ...base, signatures: [] })).toBe('DRAFT');
        expect(nextAgreementStatus({ ...base, signatures: [{ signatory: parties[0], verifiableCredential: {} as any }] })).toBe('SIGNING');
        expect(nextAgreementStatus({
            ...base,
            signatures: [
                { signatory: parties[0], verifiableCredential: {} as any },
                { signatory: parties[1], verifiableCredential: {} as any },
            ],
        })).toBe('COMPLETED');
    });
});

describe('validateSignatureCredential', () => {
    const agreementUri = 'test://agreement/42';
    const parties = [
        { partyId: 'alice', name: 'Alice', signatory: true },
        { partyId: 'bob', name: 'Bob', signatory: true },
        { partyId: 'observer', name: 'Observer', signatory: false },
    ];

    async function freshAgreement() {
        return {
            uri: agreementUri,
            data: sampleAgreementData,
            templateHash: 'tpl-hash-1',
            agreementParties: parties,
            signatures: [] as any[],
        };
    }

    it('accepts a well-formed VC', async () => {
        const signer = await newSigner();
        const agreement = await freshAgreement();
        const vc = await buildSignedVc({
            keyInfo: signer.keyInfo,
            did: signer.did,
            agreementUri,
            agreementDataHash: await hashAgreementData(agreement.data),
            templateHash: agreement.templateHash,
            partyId: 'alice',
        });
        expect(await validateSignatureCredential(vc, agreement)).toBeNull();
    });

    it('rejects when agreementDataHash does not match', async () => {
        const signer = await newSigner();
        const agreement = await freshAgreement();
        const vc = await buildSignedVc({
            keyInfo: signer.keyInfo,
            did: signer.did,
            agreementUri,
            agreementDataHash: 'sha256:wrong',
            templateHash: agreement.templateHash,
            partyId: 'alice',
        });
        const failure = await validateSignatureCredential(vc, agreement);
        expect(failure?.code).toBe('DATA_HASH_MISMATCH');
    });

    it('rejects when issuer DID does not match signatory.did', async () => {
        const a = await newSigner();
        const b = await newSigner();
        const agreement = await freshAgreement();
        // Sign with key A but claim party "alice" has DID = B's DID.
        const vc = await buildSignedVc({
            keyInfo: a.keyInfo,
            did: b.did, // mismatch
            agreementUri,
            agreementDataHash: await hashAgreementData(agreement.data),
            templateHash: agreement.templateHash,
            partyId: 'alice',
        });
        const failure = await validateSignatureCredential(vc, agreement);
        expect(failure?.code).toBe('ISSUER_SIGNATORY_MISMATCH');
    });

    it('rejects an unknown party', async () => {
        const signer = await newSigner();
        const agreement = await freshAgreement();
        const vc = await buildSignedVc({
            keyInfo: signer.keyInfo,
            did: signer.did,
            agreementUri,
            agreementDataHash: await hashAgreementData(agreement.data),
            templateHash: agreement.templateHash,
            partyId: 'mallory',
        });
        const failure = await validateSignatureCredential(vc, agreement);
        expect(failure?.code).toBe('UNKNOWN_PARTY');
    });

    it('rejects a non-signatory party', async () => {
        const signer = await newSigner();
        const agreement = await freshAgreement();
        const vc = await buildSignedVc({
            keyInfo: signer.keyInfo,
            did: signer.did,
            agreementUri,
            agreementDataHash: await hashAgreementData(agreement.data),
            templateHash: agreement.templateHash,
            partyId: 'observer',
        });
        const failure = await validateSignatureCredential(vc, agreement);
        expect(failure?.code).toBe('NON_SIGNATORY_PARTY');
    });

    it('rejects a duplicate signature from the same party', async () => {
        const signer = await newSigner();
        const agreement = await freshAgreement();
        const vc = await buildSignedVc({
            keyInfo: signer.keyInfo,
            did: signer.did,
            agreementUri,
            agreementDataHash: await hashAgreementData(agreement.data),
            templateHash: agreement.templateHash,
            partyId: 'alice',
        });
        agreement.signatures = [{ signatory: parties[0], verifiableCredential: vc }];
        const failure = await validateSignatureCredential(vc, agreement);
        expect(failure?.code).toBe('DUPLICATE_SIGNATURE');
    });
});

describe('verifyAllSignatures', () => {
    it('detects post-signing tampering of agreement data', async () => {
        const signer = await newSigner();
        const parties = [{ partyId: 'alice', name: 'Alice', signatory: true }];
        const agreement: any = {
            uri: 'test://agreement/99',
            data: sampleAgreementData,
            templateHash: null,
            agreementParties: parties,
            signatures: [] as any[],
        };
        const vc = await buildSignedVc({
            keyInfo: signer.keyInfo,
            did: signer.did,
            agreementUri: agreement.uri,
            agreementDataHash: await hashAgreementData(agreement.data),
            templateHash: null,
            partyId: 'alice',
        });
        agreement.signatures.push({ signatory: parties[0], verifiableCredential: vc });

        // Pristine: all valid.
        const before = await verifyAllSignatures(agreement);
        expect(before.allValid).toBe(true);

        // Tamper.
        agreement.data = { ...sampleAgreementData, offer: 'pay $1' };
        const after = await verifyAllSignatures(agreement);
        expect(after.allValid).toBe(false);
        expect(after.results[0].reason).toMatch(/DATA_HASH_MISMATCH/);
    });
});

describe('POST /agreements/:id/sign', () => {
    let app: express.Application;
    let mockDb: any;
    const agreementUri = 'test://agreement/77';
    const parties = [
        { partyId: 'alice', name: 'Alice', signatory: true },
        { partyId: 'bob', name: 'Bob', signatory: true },
    ];

    const agreementRow = {
        id: 1,
        uri: agreementUri,
        data: sampleAgreementData,
        template: 'test://template/1',
        templateHash: 'tpl-hash-1',
        agreementStatus: 'DRAFT',
        agreementParties: parties,
        signatures: [] as any[],
        historyEntries: [] as any[],
    };
    const templateRow = { id: 1, uri: 'test://template/1', hash: 'tpl-hash-1' };

    beforeEach(() => {
        jest.clearAllMocks();
        app = express();
        app.use(express.json({ limit: '2mb' }));

        mockDb = {
            select: jest.fn().mockReturnThis(),
            from: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            limit: jest.fn(),
            update: jest.fn().mockReturnThis(),
            set: jest.fn().mockReturnThis(),
        };
        app.use((_req, res, next) => { res.locals.db = mockDb; next(); });
        app.use('/agreements', agreementsRouter);
    });

    function mockResolve(agreementOverride: any = {}) {
        const row = { ...agreementRow, ...agreementOverride };
        mockDb.limit.mockImplementationOnce(() => Promise.resolve([row]));
        return row;
    }

    it('accepts a valid signature and advances status to SIGNING', async () => {
        const signer = await newSigner();
        mockResolve();

        const vc = await buildSignedVc({
            keyInfo: signer.keyInfo,
            did: signer.did,
            agreementUri,
            agreementDataHash: await hashAgreementData(sampleAgreementData),
            templateHash: 'tpl-hash-1',
            partyId: 'alice',
        });

        const response = await request(app).post('/agreements/1/sign').send(vc);
        if (response.status !== 200) console.error(response.body);
        expect(response.status).toBe(200);
        expect(response.body.agreementStatus).toBe('SIGNING');
        expect(response.body.signatures).toHaveLength(1);
        expect(response.body.signatures[0].verifiableCredential).toBeDefined();
        expect(mockDb.update).toHaveBeenCalledWith(Agreement);
    });

    it('completes the agreement when all signatories have signed', async () => {
        const aSigner = await newSigner();
        const aVc = await buildSignedVc({
            keyInfo: aSigner.keyInfo,
            did: aSigner.did,
            agreementUri,
            agreementDataHash: await hashAgreementData(sampleAgreementData),
            templateHash: 'tpl-hash-1',
            partyId: 'alice',
        });
        mockResolve({
            signatures: [{ signatory: parties[0], verifiableCredential: aVc }],
            agreementStatus: 'SIGNING',
        });

        const bSigner = await newSigner();
        const bVc = await buildSignedVc({
            keyInfo: bSigner.keyInfo,
            did: bSigner.did,
            agreementUri,
            agreementDataHash: await hashAgreementData(sampleAgreementData),
            templateHash: 'tpl-hash-1',
            partyId: 'bob',
        });

        const response = await request(app).post('/agreements/1/sign').send(bVc);
        expect(response.status).toBe(200);
        expect(response.body.agreementStatus).toBe('COMPLETED');
        expect(response.body.signatures).toHaveLength(2);
    });

    it('rejects a tampered data hash with 400 DATA_HASH_MISMATCH', async () => {
        const signer = await newSigner();
        mockResolve();
        const vc = await buildSignedVc({
            keyInfo: signer.keyInfo,
            did: signer.did,
            agreementUri,
            agreementDataHash: 'wrong-hash',
            templateHash: 'tpl-hash-1',
            partyId: 'alice',
        });

        const response = await request(app).post('/agreements/1/sign').send(vc);
        expect(response.status).toBe(400);
        expect(response.body.error).toBe('DATA_HASH_MISMATCH');
        expect(mockDb.update).not.toHaveBeenCalled();
    });

    it('rejects a flipped proof byte with 400 INVALID_PROOF', async () => {
        const signer = await newSigner();
        mockResolve();
        const vc: any = await buildSignedVc({
            keyInfo: signer.keyInfo,
            did: signer.did,
            agreementUri,
            agreementDataHash: await hashAgreementData(sampleAgreementData),
            templateHash: 'tpl-hash-1',
            partyId: 'alice',
        });
        // Flip the last char of proofValue to invalidate the signature.
        const pv: string = vc.proof.proofValue;
        vc.proof.proofValue = pv.slice(0, -1) + (pv.endsWith('A') ? 'B' : 'A');

        const response = await request(app).post('/agreements/1/sign').send(vc);
        expect(response.status).toBe(400);
        expect(response.body.error).toBe('INVALID_PROOF');
    });
});
