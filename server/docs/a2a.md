# APAP A2A transport

APAP exposes an A2A Protocol v1.0 JSON-RPC transport alongside MCP and REST:

- `POST /a2a` accepts A2A `SendMessage`, `GetTask`, and `ListTasks` JSON-RPC operations.
- `GET /.well-known/agent-card.json` is the public discovery document.

The transport uses `@a2a-js/sdk` 1.0.1 in the existing Express process. The
executor calls APAP's shared TypeScript services with a `PolicyContext`
containing the authenticated principal and injected database handle; it does
not call the server's own REST API. Shared services authorize each action and
resource before accessing the database.

## Configuration

Every environment must explicitly select an authentication adapter. The
`none` adapter is allowed only when `NODE_ENV` is `development` or `test`.
Set these values to use the demo HS256 adapter:

```dotenv
PUBLIC_BASE_URL=https://apap.example.com
AUTH_ADAPTER=hs256
A2A_JWT_SECRET=replace-with-at-least-32-characters
A2A_JWT_ISSUER=https://issuer.example.com/
A2A_JWT_AUDIENCE=apap-a2a
```

Startup fails when `AUTH_ADAPTER` is absent, and production additionally fails
when it is `none` or `PUBLIC_BASE_URL` is absent/non-HTTPS. The public URL is
never derived from `Host` or `X-Forwarded-Host`, preventing discovery-card
poisoning.

The built-in HS256 adapter is deliberately demo-grade. See [auth.md](auth.md)
before exposing this endpoint outside a development environment. Existing
deployments should also apply the configuration changes in
[a2a-release-notes.md](a2a-release-notes.md).

### One-command local environment

From `server/`, run:

```bash
npm run a2a:dev
```

This starts the local Compose PostgreSQL service, prepares dependencies and the
schema, builds and starts APAP in development mode, then checks the agent card
and sends a `list-templates` A2A request. It does not overwrite an existing
`.env`, connect to a `POSTGRES_URL` from that file, or advertise
`create-agreement`. Press Ctrl-C to stop APAP; the script prints the separate
command for stopping PostgreSQL.

## Invoking a skill

Send a data part containing a `skillId` and an optional `input` object. A JSON
text part with the same shape is also accepted.

```bash
curl --request POST https://apap.example.com/a2a \
  --header 'Authorization: Bearer <jwt>' \
  --header 'A2A-Version: 1.0' \
  --header 'Content-Type: application/json' \
  --data '{
    "jsonrpc": "2.0",
    "id": "request-1",
    "method": "SendMessage",
    "params": {
      "message": {
        "messageId": "message-1",
        "role": "ROLE_USER",
        "parts": [{
          "data": {
            "skillId": "list-templates",
            "input": { "limit": 20, "offset": 0 }
          },
          "mediaType": "application/json"
        }]
      }
    }
  }'
```

Successful operations return a task whose final status is
`TASK_STATE_COMPLETED`; the service result is an `application/json` artifact.
Invalid skill input, validation failures, and insufficient scope return a
terminal `TASK_STATE_REJECTED`. Operational service errors return
`TASK_STATE_FAILED`. Errors are serialized through an allowlist, so a caller
gets actionable feedback without receiving data its scopes do not cover:

- Input and authorization errors carry APAP's own message, with details reduced
  to structure: the failing path and expected type for schema issues, and the
  action plus required scope for authorization ones.
- Concerto validation failures are reduced to the violated path and expected
  type. The raw validation text is not forwarded, because it can quote the
  submitted instance.
- Wrapped template-runtime and upstream messages, such as
  `AGREEMENT_TRIGGER_FAILED`, are reported by code with a fixed message. A
  service error type may opt in to sending its own message by implementing
  `ClientSafeError`, which is a deliberate decision per error type.
- Unexpected internal faults return only a generic `INTERNAL_ERROR`.

Missing or invalid HTTP credentials are rejected with HTTP 401 before JSON-RPC
dispatch. Validation and authorization both run before the task is reported as
`TASK_STATE_WORKING`, so a refused request never appears to have started.

Requests larger than 1MB are rejected with HTTP 413. The route also applies an
in-process rate limit ahead of authentication, so token verification is covered
too; exceeding it returns HTTP 429 with a `RATE_LIMITED` error. It defaults to
120 requests per minute per client address and is tuned with
`A2A_RATE_LIMIT_MAX` and `A2A_RATE_LIMIT_WINDOW_MS`. This is a backstop, not a
replacement for rate limiting at the edge proxy.

Because the limit is keyed on the client address, a deployment behind a proxy
must set `TRUST_PROXY` so Express resolves the real caller: leave it unset and
every caller arrives as the proxy's address and shares a single bucket, where
one noisy client rate-limits everyone. Set it to the number of proxies in front
of the server (`TRUST_PROXY=1`), or to an explicit subnet list. `true` trusts a
client-supplied `X-Forwarded-For` outright and lets a caller forge its own key,
so avoid it. Production logs a warning when it is unset. Streaming, push notifications,
and task cancellation are not advertised or supported in this version.

This deliberately differs from implementations that model authentication
failure as a failed A2A task: APAP rejects credentials at the HTTP boundary so
unauthenticated requests never enter JSON-RPC dispatch. It also requires
`PUBLIC_BASE_URL` rather than trusting forwarded-host headers.

## Skills

| Skill | Input | Required scope |
| --- | --- | --- |
| `list-templates` | `{ limit?: 1..100, offset?: >=0 }` | `apap:templates:read` |
| `get-template` | `{ id: positive integer }` | `apap:templates:read` |
| `list-agreements` | `{ limit?: 1..100, offset?: >=0 }` | `apap:agreements:read` |
| `get-agreement` | `{ id: positive integer }` | `apap:agreements:read` |
| `trigger-agreement` | `{ id: positive integer, request: object }` | `apap:trigger:invoke` |

`create-agreement` is intentionally omitted until agreement creation is
available through a shared service rather than handler-only code.

## Task ownership

The SDK's in-memory task store is scoped by authenticated principal. The owner
key encodes the `(orgId, sub)` tuple unambiguously as `JSON.stringify([orgId ??
null, sub])`, so principals whose fields could concatenate to the same string
(`{orgId: 'acme', sub: 'agent'}` and `{sub: 'acme:agent'}`) never share a
bucket. The store is process-local, so tasks do not survive restarts and are not
shared across replicas. It also has no retention or capacity limit: every task,
including its request history and result artifact, stays in memory until the
process restarts, so memory grows with request volume even on a single
instance. This is a known and accepted limitation of this release, as the spec
defers a custom `TaskStore`. A persistent, bounded task store is required
before long-running or horizontally scaled deployments.

## Trigger delivery semantics

`trigger-agreement` mutates agreement state. The current service does not yet
persist an A2A request id as an idempotency key, so a client retry can execute
the same trigger more than once. Until durable idempotency is added, callers
must avoid blind retries after an ambiguous timeout. This limitation should be
resolved before using the trigger skill for non-idempotent production flows.
