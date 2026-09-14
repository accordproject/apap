# A2A transport release notes

## Configuration migration

The A2A transport is an additive HTTP surface, but its startup configuration
is fail-closed and can require changes to an existing deployment:

- `AUTH_ADAPTER` is required in every environment. There is no implicit
  unauthenticated default.
- The built-in symmetric adapter is named `hs256`, not `jwt`. Replace
  `AUTH_ADAPTER=jwt` with `AUTH_ADAPTER=hs256`.
- `AUTH_ADAPTER=none` is accepted only with `NODE_ENV=development` or
  `NODE_ENV=test`. It is rejected when `NODE_ENV` is absent or has any other
  value.
- `AUTH_ADAPTER=hs256` requires `A2A_JWT_SECRET`, `A2A_JWT_ISSUER`, and
  `A2A_JWT_AUDIENCE`. The secret must contain at least 32 characters.
- Production requires an HTTPS `PUBLIC_BASE_URL`.
- The server now requires Node.js 22.12 or newer.

The checked-in `.env_example` and local `compose.yaml` contain an explicit
development configuration. Existing `.env` files are never rewritten by the
A2A development runner, so they must be updated manually.

## Intentional wire behavior

- Missing or invalid credentials return HTTP 401 before JSON-RPC dispatch.
- The discovery card is built from `PUBLIC_BASE_URL`; forwarded-host headers
  are deliberately ignored.
- Rejected input, validation, and authorization decisions use
  `TASK_STATE_REJECTED`. Failures after execution begins use
  `TASK_STATE_FAILED`.
- A2A errors are serialized through an allowlist: APAP-authored messages with
  structural details (failing path and expected type, or action and required
  scope) so callers can correct their requests. Raw validation text, wrapped
  template-runtime messages, and unexpected faults are reported by code only.
- Input validation and authorization run before a task reports
  `TASK_STATE_WORKING`, so refused requests never transition through it.

## Follow-up requirements

The current REST and MCP surfaces preserve their existing unauthenticated
behavior through `DevelopmentPrincipal`. Before enabling shared authentication
in PR 2, the remaining generic REST CRUD get/create/update/delete paths must be
moved behind shared services and the central authorization policy. Enabling an
auth guard alone would leave those direct database paths outside the policy.

The unbounded in-memory task store and the lack of trigger idempotency are
known, accepted limitations of this release, as described in [a2a.md](a2a.md).
