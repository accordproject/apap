# AGENTS.md

Guidance for coding agents and reviewers working in this repo is in
[CLAUDE.md](CLAUDE.md): what this repo is, the generation pipeline, how to run
the RI, and the architecture invariants. Read it before reviewing or changing
anything here.

When reviewing a pull request here, check in particular that it:

1. **Preserves `$class` round-trip through the DB.** Templates and Agreements
   carry Concerto class tags
   (`org.accordproject.protocol@1.0.0.{Template,Agreement,...}`). DB columns
   are `json`/`jsonb`. A row written without the wrapper, or stripped on
   read, breaks reconstitution. See `handlers/concertovalidation.ts` and
   issue #128 for the precedent that motivated this invariant.

2. **Validates with Concerto, not only Zod.** Handlers that accept a body
   run Zod (`*InsertSchema` from drizzle-zod) first and then
   `concertoValidation('TypeName', body)`. A route that skips the Concerto
   half will let malformed `$class` values into the DB and break clients
   that parse the response.

3. **Routes outbound fetches of user-supplied URLs through
   `assertAllowedUrl`.** The `handlers/retrievers/*Retriever.ts` family is
   the pattern: https-only, explicit host allowlist, port 443 only, no
   userinfo, `redirect: 'error'`, 10MB cap, 5s `AbortController` timeout.
   A new retriever or a new `fetch(userUri)` that doesn't go through the
   allowlist is an SSRF regression. A new URI scheme means a new
   `ITemplateRetriever` implementation and a push to `availableRetrievers`
   in `handlers/agreements.ts`. See PR #275 for the current shape.

4. **Extends the typed-error rollout, doesn't widen the bare-`Error` set.**
   `services/errors.ts` defines `ServiceError` subclasses with a code, HTTP
   status, and `toJSON()`. Rollout is partial: some service functions still
   `throw new Error('...')` strings. When a PR touches one of those sites,
   it should migrate to the typed errors, not add more bare throws.
   Anything not a `ServiceError` surfaces as a real 500.

5. **Separates the MCP resource URI from the row's own URI.** When emitting
   `ReadResourceResult.contents[]`, the entry's `uri` is `apap://...`, not
   the DB row's own `uri` column (which is the agreement's or template's
   identifier, not the MCP resource identifier). Spreading a row with
   `...row` into the content entry is what caused #128.

6. **Regenerates downstream artifacts when `model/protocol.cto` changes.**
   A `.cto` edit without the regenerated `openapi.json`,
   `client/typescript/apap.ts`, `index.md`, `_site/`, and
   `server/db/schema.ts` (via `npm run drizzle-gen`) is incomplete. The
   generator is one-way: edit `.cto`, rerun `npm run build` at root and
   `npm run drizzle-gen` in `server/`, commit the regenerated files in the
   same PR as the source change.

7. **Advertises MCP capabilities that match actual behavior.** The flags
   set on `InitializeResult.capabilities` (`resources`, `tools`, `prompts`,
   `subscriptions`, ...) must match what the server actually serves. A
   tool advertised but not registered, or registered but not advertised,
   is a capability-advertisement bug and breaks clients that filter by
   capability.

8. **Ships with tests.** A change under `server/handlers/` or
   `server/services/` comes with updated or new `*.test.ts` coverage,
   including the edge cases (empty, null, unusual input), not only the
   happy path from the issue. Tests are Jest with the
   `--experimental-vm-modules` flag baked into `npm test`; a PR that
   swaps the runner or disables the flag is an infrastructure change and
   needs maintainer escalation.

9. **Parses integer ids with `parseIntegerId`.** Since #311, malformed ids
   on `/:id` routes raise `InvalidIdentifierError` (400,
   `INVALID_IDENTIFIER`, valid range 1 to 2147483647) before reaching the
   database. A new route or test that expects a 404, or a 500 from the
   database, for a malformed id is out of date. Check new `/:id` routes
   and the invalid-identifier table in the handler tests.

10. **Detects unique violations with `isUniqueViolation`.** Use the helper
    in `server/db/errors.ts`, not a direct `err.code === '23505'` check.
    Drizzle wraps driver failures in `DrizzleQueryError` with the Postgres
    error on `.cause`, so a bare `.code` check misses them and the error
    surfaces as a 500. A test for this path rejects with a
    `DrizzleQueryError`, as `templateService.test.ts` does, not only a
    bare `Error` carrying a code.

11. **Leaves compiler strictness alone.** Keep strict null checks on: the
    typed-error migration relies on them. Do not add `tsconfig.json`
    flags that the pinned TypeScript version rejects (for example
    `ignoreDeprecations: "6.0"` under TypeScript 5.8.3, which fails with
    TS5103). A compiler flag change travels with the TypeScript upgrade
    that needs it, and a PR that bundles the two with `strict: false` is
    a cross-cutting change, not a fix.

## Commits and pull requests

- Commit messages and PR titles use the
  [Accord Project format](https://github.com/accordproject/techdocs/blob/master/DEVELOPERS.md#commit-message-format):
  `type(scope): description`. Types: `feat`, `fix`, `docs`, `style`,
  `refactor`, `perf`, `test`, `chore`.
- Breaking changes to the protocol (`model/protocol.cto`) or the REST
  contract (`openapi.json`) use `!` in the commit type (`feat!:`, `fix!:`)
  and a note in the PR body naming what breaks and how clients should
  adapt. There is no `MIGRATION.md` on apap today; if a change warrants
  one, propose it in the PR.
- Every commit needs a DCO sign-off (`git commit --signoff`) whose name
  and email match the commit author.
- New source files in `server/src/` start with the Apache 2.0 header used
  by the existing files.
- Keep each PR to one change. Regenerated artifacts that follow directly
  from a source change (for example `openapi.json` after a `.cto` edit,
  `server/db/schema.ts` after `npm run drizzle-gen`) belong in the same
  PR as the source change. Unrelated formatting, refactoring, or
  regenerated-only drift does not.
- If a test fixture depends on the exact output format of a library (for
  example the SQL text Drizzle generates), add a comment saying so, so a
  library upgrade points back to the fixture.
- If this is your first contribution, CI workflows wait for a maintainer
  to approve them. That is expected.
- Say in the PR if an AI tool helped, per the Accord Project AI usage
  policy in [techdocs](https://github.com/accordproject/techdocs).

## For reviewing agents specifically

1. Read `CLAUDE.md` before reviewing. The architecture invariants above
   are summaries, not the full story.
2. Check the layer the change lives in (handler, service, generator
   pipeline, retriever) before checking the diff. Many "improvements"
   that look fine in isolation break an invariant one layer up.
3. For any finding, cite the file and line that would change.
4. Don't ask a maintainer to approve a PR until the approach has been
   checked against the numbered items above.
