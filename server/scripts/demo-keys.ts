import crypto from 'crypto';

/**
 * Generates an encrypted PKCS#8 Ed25519 PEM that vc-signer's loadSigningKey
 * can consume directly. For demo/test use only — real clients should manage
 * keys with proper rotation and storage.
 */
export function generateEncryptedEd25519Pem(passphrase: string): { pem: string; passphrase: string } {
    const { privateKey } = (crypto as any).generateKeyPairSync('ed25519');
    const pem = (privateKey as any).export({
        type: 'pkcs8',
        format: 'pem',
        cipher: 'aes-256-cbc',
        passphrase,
    }) as string;
    return { pem, passphrase };
}
