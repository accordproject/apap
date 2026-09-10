# APAP A2A transport

APAP exposes an A2A Protocol v1.0 JSON-RPC transport alongside MCP and REST:

- `POST /a2a` accepts A2A `SendMessage`, `GetTask`, and `ListTasks` JSON-RPC operations.
- `GET /.well-known/agent-card.json` is the public discovery document.

The transport uses `@a2a-js/sdk` 1.0.1 in the existing Express process. The
executor calls APAP's shared TypeScript services with the injected database
handle; it does not call the server's own REST API.

## Configuration

Development defaults to the explicit `none` adapter and
`http://localhost:9000` as the public origin. Set these values to use the demo
JWT adapter:

```dotenv
PUBLIC_BASE_URL=https://apap.example.com
AUTH_ADAPTER=jwt
A2A_JWT_SECRET=replace-with-at-least-32-characters
A2A_JWT_ISSUER=https://issuer.example.com/
A2A_JWT_AUDIENCE=apap-a2a
```

Production fails at startup when `AUTH_ADAPTER` is absent or `none`, or when
`PUBLIC_BASE_URL` is absent. The public URL is never derived from `Host` or
`X-Forwarded-Host`, preventing discovery-card poisoning.

The built-in HS256 adapter is deliberately demo-grade. See [auth.md](auth.md)
before exposing this endpoint outside a development environment.

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
Invalid skill input, insufficient scope, and service errors return a terminal
`TASK_STATE_FAILED` with a structured, non-echoing error message. Missing or
invalid HTTP credentials are rejected with HTTP 401 before JSON-RPC dispatch.

Requests larger than 1MB are rejected with HTTP 413. Streaming, push
notifications, and task cancellation are not advertised or supported in this
version.

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

The SDK's in-memory task store is scoped by authenticated principal. When a
principal has an `orgId`, its task owner key is `<orgId>:<sub>`; otherwise it is
`sub`. The store is process-local, so tasks do not survive restarts and are not
shared across replicas.
