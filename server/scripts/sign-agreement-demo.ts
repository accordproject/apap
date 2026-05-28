/**
 * Client-side signing demo for an apap agreement.
 *
 *   npx tsx scripts/sign-agreement-demo.ts
 *
 * Env vars:
 *   APAP_BASE_URL    default http://localhost:3000
 *   AGREEMENT_ID     required, numeric DB id
 *   PARTY_ID         required, must match an AgreementParty.partyId with signatory=true
 *   PARTY_NAME       optional, defaults to PARTY_ID
 *   KEY_PEM_PATH     optional path to an encrypted PKCS#8 PEM; otherwise a fresh
 *                    Ed25519 key is generated for the demo
 *   KEY_PASSPHRASE   passphrase for the PEM (or for the generated key)
 */
import fs from 'fs';
import * as vcSigner from '../handlers/vcSigner';
import { hashAgreementData } from '../handlers/signatures';
import { generateEncryptedEd25519Pem } from './demo-keys';

async function main() {
    const baseUrl = process.env.APAP_BASE_URL ?? 'http://localhost:3000';
    const agreementId = required('AGREEMENT_ID');
    const partyId = required('PARTY_ID');
    const partyName = process.env.PARTY_NAME ?? partyId;
    const passphrase = process.env.KEY_PASSPHRASE ?? 'demo-passphrase';

    const pem = process.env.KEY_PEM_PATH
        ? fs.readFileSync(process.env.KEY_PEM_PATH, 'utf8')
        : (() => {
            const generated = generateEncryptedEd25519Pem(passphrase);
            console.error('[demo] No KEY_PEM_PATH provided, generated an ephemeral Ed25519 key.');
            return generated.pem;
        })();

    const keyInfo = await vcSigner.loadSigningKey({ privateKeyPem: { pem, passphrase } });
    const { did, verificationMethodId } = await vcSigner.deriveDidKey(keyInfo.publicJwk);
    console.error(`[demo] DID for ${partyId}: ${did}`);

    const agreementRes = await fetch(`${baseUrl}/agreements/${agreementId}`);
    if (!agreementRes.ok) throw new Error(`GET /agreements/${agreementId} → ${agreementRes.status}`);
    const agreement = await agreementRes.json() as any;

    const agreementDataHash = await hashAgreementData(agreement.data);

    const subject = {
        id: agreement.uri,
        type: 'AgreementSignature',
        agreementUri: agreement.uri,
        agreementDataHash,
        templateHash: agreement.templateHash ?? null,
        signatory: { did, partyId, name: partyName },
        signedAt: new Date().toISOString(),
    };

    const vc = await vcSigner.signCredential({
        type: ['VerifiableCredential', 'AgreementSignatureCredential'],
        subject,
        signer: { keyInfo, verificationMethodId },
    });

    const signRes = await fetch(`${baseUrl}/agreements/${agreementId}/sign`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(vc),
    });
    const body = await signRes.text();
    console.log(`POST /agreements/${agreementId}/sign → ${signRes.status}`);
    console.log(body);
    if (!signRes.ok) process.exit(1);
}

function required(name: string): string {
    const v = process.env[name];
    if (!v) {
        console.error(`Missing required env var ${name}`);
        process.exit(2);
    }
    return v;
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
