# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> Parent workspace context (cross-repo relationships, when changes flow to `apap-mcp-poc/`, etc.) lives in `../CLAUDE.md`. This file covers only what is specific to the `apap/` repo itself.

## What this repo is

The upstream **Accord Project Agreement Protocol (APAP)** — protocol-of-record plus the Reference Implementation (RI). Two npm projects live here:

- **root (`./`)** — owns the protocol. `model/protocol.cto` (Concerto, the *single source of truth*) → `openapi.json` → `client/typescript/apap.ts` → docs site. There is no runtime here, only generation.
- **`server/`** — the RI. Express + Drizzle + Postgres, with experimental MCP support exposed on the same Express app.

The two are independent npm packages with separate `package.json`, `node_modules`, and tooling choices. Always `cd` into the right one.

## Generation pipeline (root)

```bash
npm run gen          # protocol.cto → openapi (concerto compile)
npm run merge        # merge openapi-extra-paths.json into openapi.json
npm run build        # gen → merge → widdershins docs → openapi-typescript client → reslate site
npm run lint         # IBM OpenAPI validator (non-blocking — `|| exit 0`)
npm run serve        # serve the reslate docs site
```

`prebuild` runs `gen`, so `npm run build` regenerates everything from `protocol.cto`. The flow is **one-way**: edit `model/protocol.cto`, rerun `build`, commit the regenerated artifacts (`openapi.json`, `client/typescript/apap.ts`, `index.md`, `_site/`).

`openapi-extra-paths.json` exists because Concerto can express the data shapes but not the full set of REST paths/verbs (e.g. `/agreements/:id/trigger`, `/agreements/:id/convert/:format`). Add new non-CRUD endpoints there and re-run `npm run merge` (or just `build`).

## Reference Implementation (`server/`)

Node ≥20, TypeScript (CommonJS, `target: es2021`). Tooling that's *non-obvious* and easy to assume wrong:

- **Tests are Jest, not vitest.** Run with `node --experimental-vm-modules` (the flag is required, baked into `npm test`). Single file: `npx jest handlers/agreements.test.ts`; single name: `npx jest -t 'pattern name'`.
- **Lint is tslint** (deprecated upstream — `npm run lint` still runs against `tsconfig.json`).
- **DB driver is `postgres` (postgres-js), not `pg`.** Drizzle is configured with `casing: 'snake_case'` so TypeScript camelCase fields map to snake_case columns automatically — never hand-quote column names.
- **`postinstall` runs `npm run build`** (i.e. `tsc -p .`). A fresh `npm install` populates `dist/`. `npm start` runs `node dist/index.js`; `npm run dev` runs `tsc -w` + `nodemon` concurrently.

### Running the RI

```bash
docker compose up                  # canonical — Postgres + RI together, port 9000
npx drizzle-kit push               # bootstrap a fresh DB schema (host-side)
npm run dev                        # local watch mode (needs a Postgres reachable via env vars)
npm run db:studio                  # drizzle-studio on https://local.drizzle.studio
```

DB env vars: either `POSTGRES_URL` (single connection string) **or** all of `POSTGRES_{USER,PASSWORD,HOST,PORT,DATABASE}`. The check fails at startup, not first query (see `server/index.ts`).

### When the Concerto model changes

The Drizzle schema (`server/db/schema.ts`) is **generated** from `model/protocol.cto` via `scripts/drizzle-gen.ts`. Header says `// GENERATED CODE, DO NOT MODIFY`. After editing the model:

```bash
# from server/
npm run drizzle-gen     # regen db/schema.ts from ../model/protocol.cto
npx drizzle-kit push    # apply to the running Postgres
```

For migrations rather than push: `npm run db:generate` then `npm run db:migrate`. Production uses `db:migrateprod` which compiles `scripts/drizzle-gen.ts` first.

## Architecture invariants the RI relies on

These are easy to break by accident, and breakage is silent:

- **CRUD is generated, not hand-written.** `handlers/crud.ts` exposes `buildCrudRouter({ table, typeName, validateBody })` that the per-resource routers (`templates.ts`, `agreements.ts`, `sharedmodels.ts`) compose. Custom routes go on the returned `crudRouter` *before* `router.use('/', crudRouter)` mounts it. Query string filtering supports operators inline (`?price=>=10`) parsed in `crud.ts:defaultWhereClause`.
- **Validation is two-stage.** First Zod (`*InsertSchema` from drizzle-zod), then Concerto (`concertoValidation('TypeName', body)`) which enforces the `$class` discriminators. A handler that bypasses Concerto validation will let malformed `$class` values into the DB and break round-trips.
- **`$class` discriminators round-trip through the DB.** Templates and Agreements carry Concerto class tags (`org.accordproject.protocol@1.0.0.{Template,Agreement,CtoFile,...}`). DB columns are `json`/`jsonb` — preserve the wrapper. `templatebuilder.ts` understands the wrapping when reconstituting `.cta` archives from rows.
- **MCP runs inside the same Express app via an internal HTTP loop.** `handlers/mcp.ts` calls `makeApiRequest(\`${API_BASE_URL}/...\`)` back into its own server (default `http://localhost:9000`). MCP handlers do **not** call services directly. This is the design point that `apap-mcp-poc/` is built to replace upstream — when porting changes from the POC, expect the call site to be an HTTP fetch here. `APAP_API_AUTH_HEADER` lets the inner loop forward an Authorization header.
- **Template-fetching uses a scheme-dispatch retriever pattern.** `handlers/retrievers/ITemplateRetriever.ts` declares `getURISchemes()` + `fetch()`. `agreements.ts:50` (POST `/agreements`) iterates `availableRetrievers` and picks the first one whose scheme matches the agreement's `template` URI. The fetched `.cta` is hashed and cached by `Template.hash` (unique). To add a new scheme (e.g. `s3://`, `ipfs://`), implement `ITemplateRetriever` and push to `availableRetrievers`.
- **`Agreement.uri` (the DB row's resource URI) is not the MCP resource URI.** When emitting MCP `ReadResourceResult.contents[]`, only set `{ uri: 'apap://agreements/{id}', mimeType, text }`. Spreading the row (`...a`) is what caused issue #128 — the row's own `uri` field overwrote the MCP one. Same shape applies to templates.
- **Typed errors live in `services/errors.ts`; the rollout is partial.** The `ServiceError` hierarchy (`TemplateNotFoundError`, `AgreementNotFoundError`, `AgreementConversionError`, `InvalidPayloadError`, `ValidationError`) carries a code, HTTP status, and structured details, and serializes via `toJSON()`. Two handlers are wired so far — `handlers/agreements.ts` maps `ServiceError` to `res.status(err.statusCode).json(err.toJSON())`, and `handlers/mcp.ts` (post-#200) uses `serviceErrorToCallToolResult` for tool responses and `serviceErrorToResourceError` (returning an `McpError` with the typed payload on `data`) for resource reads. Other handlers still throw bare `Error('...')` strings; when you touch one, migrate it to the typed errors rather than adding more bare throws. Anything that is not a `ServiceError` is a real 500.

## Auth

`handlers/auth.ts` only serves `/.well-known/oauth-authorization-server` pointing to `accordproject.us.auth0.com`. Token validation middleware is commented out across handlers (see imports in `crud.ts`). Treat the RI as unauthenticated locally; production deployment is expected to terminate auth at the edge.

## MCP transport surface

Both transports are mounted off `/` in `index.ts`:
- **SSE** at `GET /sse` (legacy MCP transport, used by Claude custom integrations)
- **Streamable HTTP** at `POST /mcp` (newer transport, session-stateful via `InMemoryEventStore`)

`API_BASE_URL` env var (default `http://${HOST}:${PORT}`) is what MCP handlers call back into. If you run the RI behind a reverse proxy, set this so the internal loop hits the right origin.

### Typed-context surface

The MCP server advertises a Concerto typed-context to clients in two places (`handlers/mcp.ts`):

- `InitializeResult.instructions`: `SERVER_INSTRUCTIONS` string tells the client (and any LLM behind it) that responses are Concerto-serialized and `$class` discriminators identify type + inheritance.
- `apap://schema/protocol.cto`: a readable MCP resource that serves the raw Concerto model so clients can resolve `$class` values to definitions without an external lookup.

`PROTOCOL_CTO` (in `handlers/mcp.ts`) is the runtime source for the schema resource. It base64-decodes the `MODEL` constant that `scripts/drizzle-gen.ts` emits into `db/schema.ts` at build time — same origin that `handlers/concertovalidation` already consumes. No filesystem access at runtime and no separate copy step in the Dockerfile: the model rides along inside the compiled JS. When `model/protocol.cto` changes, `npm run drizzle-gen` refreshes both the Drizzle schema and the embedded `MODEL` in one shot.
