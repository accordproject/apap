// Thin async wrapper around the ESM-only `vc-signer` package.
// apap compiles with `module: commonjs`, so a plain dynamic `import('vc-signer')`
// would be downleveled to `require()` and fail at runtime. Wrapping it in
// `Function('return import(...)')` keeps the import truly dynamic.

type VerifyResult = { verified: true; issuer: string; verificationMethodId: string; subject: any };

type VcSignerModule = {
    // Throws on any failure; resolves with { verified: true, ... } on success.
    verifyCredential: (vc: unknown, opts?: unknown) => Promise<VerifyResult>;
    signCredential: (opts: any) => Promise<any>;
    loadSigningKey: (opts: any) => Promise<any>;
    deriveDidKey: (publicJwk: any) => { did: string; verificationMethodId: string };
    resolveIssuerKey: (issuerDid: string, verificationMethodId?: string) => Promise<any>;
};

let cached: VcSignerModule | null = null;

async function load(): Promise<VcSignerModule> {
    if (cached) return cached;
    cached = await (Function('return import("vc-signer")')() as Promise<VcSignerModule>);
    return cached;
}

export async function verifyCredential(vc: unknown) {
    return (await load()).verifyCredential(vc);
}

export async function signCredential(opts: any) {
    return (await load()).signCredential(opts);
}

export async function loadSigningKey(opts: any) {
    return (await load()).loadSigningKey(opts);
}

export async function deriveDidKey(publicJwk: any) {
    return (await load()).deriveDidKey(publicJwk);
}
