# A2A authentication and authorization

## Current posture

The A2A route authenticates every request through an open `AuthAdapter`
registry. The reference implementation includes:

- `none`: explicitly insecure development/test mode;
- `hs256`: an HS256 Bearer JWT demonstration adapter.

The JWT adapter verifies the signature, restricts `alg` to `HS256`, validates
`iss`, `aud`, `exp`, and `nbf` when present, allows 60 seconds of clock skew,
and requires `sub`. It never logs tokens or request payloads.

HS256 shares one secret between issuer and verifier, so compromise of the APAP
server's verification secret also permits token minting. Use an asymmetric
OIDC/JWKS or wallet/DID adapter for a real deployment. Starting APAP with the
built-in JWT adapter in production emits a warning, while starting production
with no adapter fails closed.

## Principal contract

Every adapter returns the same transport-independent shape:

```typescript
interface Principal {
  sub: string;
  orgId?: string;
  roles: readonly string[];
  scopes: readonly string[];
  raw: unknown;
}
```

The JWT adapter reads space-delimited scopes from `scope` (or an array from
`scopes`), roles from `roles`, and organization identity from `orgId`, `org_id`,
or `org`. The executor creates a `PolicyContext { db, principal }`, and every
shared template/agreement service authorizes an action and resource through the
central policy before accessing the database. Authenticated principals must
hold the exact scope listed in the agent card; token-supplied `*` or
`apap:templates:*` wildcards are not accepted.

Existing unauthenticated REST and MCP callers receive a compatibility-only
`DevelopmentPrincipal`, which preserves their current behavior. Replacing
those compatibility principals with results from this same adapter instance is
the intended follow-up for unified protocol authentication.

The reference database does not currently implement organization row-level
security. Carrying `orgId` through the service boundary is an extension seam,
not a claim of tenant isolation. An enterprise adapter must pair org identity
with an authorization policy and database/RLS context that enforce it.

## Registering an adapter

Adapters accept transport-neutral request headers and return a `Principal`.
Register an adapter before the application resolves `AUTH_ADAPTER`:

```typescript
import { registerAdapter } from './auth/registry';

registerAdapter('oidc', (config) => new OidcAdapter(config));
```

The agent card derives its security declaration from the active adapter. A
custom adapter should therefore implement both verification and
`describeScheme()` from the same configuration source.

The application creates the selected adapter once and passes that instance to
the A2A components. Future REST/MCP guards should reuse it rather than resolve
separate instances with potentially divergent configuration or caches.

## Surface asymmetry

This change only secures the new `/a2a` endpoint. Existing REST and MCP auth
remains unchanged. Wiring the same adapter into those routes is intentionally a
separate, potentially breaking deployment step because current unauthenticated
clients would begin receiving authentication failures.
