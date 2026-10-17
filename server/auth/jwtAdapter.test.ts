import { SignJWT } from 'jose';
import { JwtAdapter } from './jwtAdapter';

const config = {
    secret: 'a-demo-secret-that-is-at-least-32-characters',
    issuer: 'https://issuer.example.com/',
    audience: 'apap-a2a',
};

async function token(
    claims: Record<string, unknown> = {},
    secret = config.secret,
): Promise<string> {
    return new SignJWT({
        scope: 'apap:templates:read apap:agreements:read',
        roles: ['agent'],
        orgId: 'org-1',
        ...claims,
    })
        .setProtectedHeader({ alg: 'HS256' })
        .setSubject('did:example:agent')
        .setIssuer(config.issuer)
        .setAudience(config.audience)
        .setIssuedAt()
        .setExpirationTime('5m')
        .sign(new TextEncoder().encode(secret));
}

describe('JwtAdapter', () => {
    const adapter = new JwtAdapter(config);

    test('verifies a JWT into the common principal shape', async () => {
        const principal = await adapter.authenticate({ authorization: `Bearer ${await token()}` });
        expect(principal).toMatchObject({
            sub: 'did:example:agent',
            orgId: 'org-1',
            roles: ['agent'],
            scopes: ['apap:templates:read', 'apap:agreements:read'],
            isAuthenticated: true,
            userName: 'did:example:agent',
        });
    });

    test('rejects missing and malformed tokens', async () => {
        await expect(adapter.authenticate({})).rejects.toMatchObject({ code: 'MISSING_TOKEN' });
        await expect(adapter.authenticate({ authorization: 'Basic abc' }))
            .rejects.toMatchObject({ code: 'MALFORMED_AUTHORIZATION' });
        await expect(adapter.authenticate({ authorization: 'Bearer two.parts' }))
            .rejects.toMatchObject({ code: 'MALFORMED_TOKEN' });
    });

    test('rejects expired, wrong-audience, wrong-issuer, and bad-signature JWTs', async () => {
        const expired = await new SignJWT({})
            .setProtectedHeader({ alg: 'HS256' })
            .setSubject('agent')
            .setIssuer(config.issuer)
            .setAudience(config.audience)
            .setExpirationTime(Math.floor(Date.now() / 1000) - 120)
            .sign(new TextEncoder().encode(config.secret));
        await expect(adapter.authenticate({ authorization: `Bearer ${expired}` }))
            .rejects.toMatchObject({ code: 'TOKEN_EXPIRED' });
        await expect(new JwtAdapter({ ...config, audience: 'wrong' }).authenticate({ authorization: `Bearer ${await token()}` }))
            .rejects.toMatchObject({ code: 'AUDIENCE_MISMATCH' });
        await expect(new JwtAdapter({ ...config, issuer: 'https://wrong.example.com/' }).authenticate({ authorization: `Bearer ${await token()}` }))
            .rejects.toMatchObject({ code: 'ISSUER_MISMATCH' });
        await expect(adapter.authenticate({ authorization: `Bearer ${await token({}, 'another-secret-that-is-long-enough-123')}` }))
            .rejects.toMatchObject({ code: 'SIGNATURE_INVALID' });
    });

    test('rejects alg none before verification', async () => {
        const encode = (value: unknown) => Buffer.from(JSON.stringify(value)).toString('base64url');
        const unsigned = `${encode({ alg: 'none' })}.${encode({ sub: 'agent', exp: 9999999999 })}.`;
        await expect(adapter.authenticate({ authorization: `Bearer ${unsigned}` }))
            .rejects.toMatchObject({ code: 'ALG_NOT_ALLOWED' });
    });

    test('requires exp and rejects a token before nbf', async () => {
        const key = new TextEncoder().encode(config.secret);
        const noExpiration = await new SignJWT({})
            .setProtectedHeader({ alg: 'HS256' })
            .setSubject('agent')
            .setIssuer(config.issuer)
            .setAudience(config.audience)
            .sign(key);
        await expect(adapter.authenticate({ authorization: `Bearer ${noExpiration}` }))
            .rejects.toMatchObject({ code: 'EXPIRATION_REQUIRED' });

        const notActive = await new SignJWT({})
            .setProtectedHeader({ alg: 'HS256' })
            .setSubject('agent')
            .setIssuer(config.issuer)
            .setAudience(config.audience)
            .setNotBefore('5m')
            .setExpirationTime('10m')
            .sign(key);
        await expect(adapter.authenticate({ authorization: `Bearer ${notActive}` }))
            .rejects.toMatchObject({ code: 'TOKEN_NOT_ACTIVE' });
    });

    test('requires exp and sub', async () => {
        const key = new TextEncoder().encode(config.secret);
        const noExp = await new SignJWT({})
            .setProtectedHeader({ alg: 'HS256' })
            .setSubject('agent')
            .setIssuer(config.issuer)
            .setAudience(config.audience)
            .sign(key);
        const noSub = await new SignJWT({})
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuer(config.issuer)
            .setAudience(config.audience)
            .setExpirationTime('5m')
            .sign(key);
        await expect(adapter.authenticate({ authorization: `Bearer ${noExp}` }))
            .rejects.toMatchObject({ code: 'EXPIRATION_REQUIRED' });
        await expect(adapter.authenticate({ authorization: `Bearer ${noSub}` }))
            .rejects.toMatchObject({ code: 'SUBJECT_REQUIRED' });
    });
});
