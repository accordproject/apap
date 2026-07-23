# GSoC 2026 - Hardening APAP / MCP

> **Status (Jul 21, 2026):** W8 day 1 / 12. Fifteen PRs merged in the first
> half, headlined by the service-layer port completing upstream this week:
> `templateService` + `agreementService` (with `convertAgreement` +
> `triggerAgreement`) now share the same code path from REST and MCP, and the
> last internal `makeApiRequest` HTTP loops are gone. Chain shipped Jul 21 as
> #211 → #213 → #214 → #216. CI hygiene also landed: #212 stopped `npm test`
> failures from being swallowed, #215 fixed the CI never installing
> `server/node_modules`, #210 dropped a phantom `crypto` npm stub. Prior
> first-half work: typed `ServiceError` hierarchy (#184, #196, #200), Concerto
> typed-context via `InitializeResult.instructions` +
> `apap://schema/protocol.cto` resource (#199, A/B wins of +20pp on Claude
> Sonnet 4.6 and +38pp on GPT-4o), SEP-2549 `ttlMs` + `cacheScope` hints on
> `ReadResourceResult.contents[]` (#201, forward-compatible with the MCP
> 2026-07-28 RC), CRUD strict-numeric `:id` hardening (#208). Midterm dispatch
> published on Medium + LinkedIn (Jul 12); midterm evaluation submitted (Jul
> 13). Weekly Thursday 9 AM PT sync slot with Niall confirmed. W7 code shipped
> on POC as [`apap-mcp-poc#7`](https://github.com/JayDS22/apap-mcp-poc/pull/7):
> `subscriptions/listen` handler + transport-agnostic `SubscriptionRegistry`
> service. Slice 3 (REST list route unification through `buildCrudRouter`) is
> the last piece of the Proposal Core lane. This PR (#198) stays open as the
> rolling roadmap doc through end of GSoC per the Jul 16 sync.

**Project:** Idea #4 - Hardening the APAP / MCP Server
**Contributor:** Jay Guwalani ([@JayDS22](https://github.com/JayDS22))
**Mentors:** Niall Roche ([@niallroche](https://github.com/niallroche)), Dan Selman ([@dselman](https://github.com/dselman))
**Org liaison:** Sanket Shevkar
**Hours:** 175 / 12 weeks
**Proof of concept:** [github.com/JayDS22/apap-mcp-poc](https://github.com/JayDS22/apap-mcp-poc)

This document lives in the repo so anyone (mentors, maintainers, other
contributors) can suggest changes via PR. Updates land weekly after the
Friday sync.

---

## Workstreams

Six parallel lanes, with the proposal scope as the spine and five
adjacent tracks surfaced across the May 20 sync with Niall and Sanket
plus the Jun 18 Headroom eval ask. Workstream 6 (Headroom compression
eval) and the `Comms deliverables` and `Future work` sections below were
added mid-project with mentor input (Niall Jul 14 Discord on the
ACE-Router thread, Steven Jul 16 review on this PR asking that the
scope expansion be memorialized).

| # | Workstream | Owner | Current status |
|---|---|---|---|
| 1 | **Proposal Core** - service layer, tests, multi-client docs | Jay | Service-layer port complete upstream (Jul 21). Chain shipped as #211 (templateService) → #213 (agreementService CRUD) → #214 (convertAgreement) → #216 (triggerAgreement). REST + MCP now call the same functions; the last internal `makeApiRequest` HTTP loops are gone. Earlier first-half work: slice 1 (#184), contract tests (#196), slice 3 (#200 replaces the closed slice-2 draft #197), Concerto typed-context (#199). Slice 3 (REST list route unification through `buildCrudRouter`) is the remaining piece |
| 2 | **MCP RC migration** - adopt 2026-07-28 spec via env-gated stateless rewrite (SEPs 2567/2575/2243/2549) | Jay | On track. SEP-2549 (`ttlMs` + `cacheScope`) landed via #201; W7 slice adds `subscriptions/listen` (POC first); W8 folds JSON-RPC error code mapping (`-32020..-32099`) |
| 3 | **Agentic Payments** - multi-provider OAuth, privacy boundary, agent-calling-agents demo | Jay (with Niall) | Privacy-boundary sketch drafted; W9 lane confirmed joint Niall+Jay on Jun 18 call |
| 4 | **Alternatives Evaluation** - OpenAI fn-calling, LangGraph / CrewAI comparison | Jay | Complete. Both spikes shipped, decision memo merged, Concerto typed-context A/B shipped (#199). Framework-vs-tool-count finding published on Medium Jul 12 |
| 5 | **Skills + Ops** - accordproject/skills refresh, dev branch, comms | Jay (with Sanket) | On track. Bonding asks resolved Jun 9; midterm dispatch published Jul 12 (Medium + LinkedIn); weekly reports resumed; Thursday sync slot with Niall confirmed |
| 6 | **Headroom compression eval** - measure token reduction + fidelity for MCP tool outputs | Jay (Niall ask, Tejas-facing) | Bench methodology sketch complete; three-arm bench (baseline / typed-context / typed + headroom) designed; W10 rerun scheduled |

---

## 12-week schedule

| Wk | Dates | Primary focus | Key activities | Status |
|---|---|---|---|---|
| Bond. | May 8 - Jun 1 | Setup + study | accord-project-mcp study, MCP RC compat matrix, dev branch + Discord (Sanket), apap/ access + API credits confirmation | Done |
| 1 | Jun 2 - Jun 8 | Refactor + alternatives | Land service layer + typed errors upstream; begin alternatives evaluation | Done (slice 1 merged via #184) |
| 2 | Jun 9 - Jun 15 | Refactor + alternatives | Continue service-layer PRs; skills repo refresh starts; alternatives decision memo draft | Done (slice-2 draft #197 opened here, later rewritten as slice 3 in #200; both spikes shipped, memo drafted) |
| 3 | Jun 16 - Jun 22 | Tests + OAuth | Unit tests upstream (Vitest, 90% gate); alternatives memo delivered; multi-provider OAuth design; **+ Concerto typed-context A/B shipped (#199); blog draft circulated** | Done |
| 4 | Jun 23 - Jun 29 | Tests + payments + Headroom + RC W4 slice | Integration tests (Docker Postgres); privacy-boundary design; Headroom proxy methodology; typed-error rollout slice-2 draft (#197 opened, later closed and rewritten as slice 3 in #200) | Done |
| 5 | Jun 30 - Jul 6 | Contract tests + services rollout | Contract tests for `buildApiErrorMessage` helper merged (#196, Jul 1); typed-errors slice 3 replaced the closed slice-2 draft #197 with a clean rewrite (#200 opened) | Done |
| 6 | Jul 7 - Jul 13 | Midterm + Concerto typed-context + SEP-2549 | **Midterm evaluation submitted (form)**; **Concerto typed-context merged (#199, Jul 9)**; **typed-errors slice 3 merged (#200, Jul 3)**; **SEP-2549 `ttlMs` + `cacheScope` cache hints merged (#201, Jul 10)**; **CLAUDE.md refresh merged (#202, Jul 9)**; **#208 CRUD strict-numeric `:id` guard merged (Jul 13)**; midterm dispatch published on Medium + LinkedIn (Jul 12); community peer review posted on #194 (Satvik's session cleanup) | Done |
| 7 | Jul 14 - Jul 20 | `subscriptions/listen` slice + service-layer upstream port | **W7 issue scoped in [`apap-mcp-poc#6`](https://github.com/JayDS22/apap-mcp-poc/issues/6)**; **`subscriptions/listen` handler on POC with new `SubscriptionRegistry` service** (shipped as POC #7); notification dispatch hooks in `templateService` + `agreementService` mutation paths; session-close cleanup; fake-timer test coverage; **service-layer port to upstream: templateService (#211), agreementService CRUD (#213), convertAgreement (#214), triggerAgreement (#216)** — all four merged Jul 21; **CI hygiene: #210 (crypto stub), #212 (test-swallow), #215 (server install) all merged Jul 20-21** | Done |
| 8 | Jul 21 - Jul 27 | Upstream port + JSON-RPC error mapping + observability | Port W7 `subscriptions/listen` to upstream RI (`accordproject/apap`); **`ServiceError → JSON-RPC` mapping into `-32020..-32099` reserved range** (`ServiceError.jsonRpcCode` constant table; `serviceErrorToResourceError` + `serviceErrorToCallToolResult` updated); ChatGPT + Inspector tutorials; **logger refactor to `pino` (replace 17 `console.log` + 11 `console.error` sites in `handlers/mcp.ts`)** | Planned |
| 9 | Jul 28 - Aug 3 | Migration guide + demo | Migration guide; agent-calling-agents demo (APAP as service, not agent) | Planned |
| 10 | Aug 4 - Aug 10 | DX + demo | Pino at 15+ call sites; demo polish; blog draft (alternatives + agents with Accord) | Planned |
| 11 | Aug 11 - Aug 17 | E2E + blog | E2E in GH Actions; multi-version transport tests; blog draft to mentors for review | Planned |
| 12 | Aug 18 - Aug 24 | Release | Final docs review; PRs merged; blog published; handoff prep | Planned |

---

## Milestones

| Date | Milestone | Status |
|---|---|---|
| Jun 1 | Bonding ends | Done |
| Jun 18 | Niall's Agents-Calling-Agents call | Done; W9 lane committed as joint Niall+Jay, Headroom eval added |
| Jul 12 | Midterm dispatch published (Medium + LinkedIn) | Done |
| Jul 13 | Midterm evaluation submitted | Done |
| Jul 28 | MCP 2026-07-28 spec finalizes | Upcoming |
| Aug 25 | Final evaluation (W12) | Upcoming |

---

## Open decisions (as of Jul 13, 2026)

From Section 6 of the May 20 sync. Decisions 2, 3, and 4 resolved; two still open.

| # | Decision | Default proposal | Status |
|---|---|---|---|
| 1 | **Scope** - 5 workstreams or proposal-only | 5 workstreams with midterm checkpoint to scope down | Open (revisit at Thursday sync now that first-half deliverables are known) |
| 2 | **Alternatives evaluation depth** - light / medium / heavy | Medium (memo + working spike) | **Resolved** Jun 9; both spikes shipped, decision memo merged, finding published Jul 12 |
| 3 | **MCP 2026-07-28 transport strategy** - stay / parallel / migrate-first | Parallel from W4 | **Resolved** parallel; SEP-2549 (#201) shipped ahead of the RC as forward-compatible hints |
| 4 | **Comms cadence** - channel + meeting slot | Thursdays 9 AM ET (2 PM UK / 6:30 PM IST) | **Resolved** Jul 10: Thursday morning slot (Jay's timezone) confirmed with Niall on mentor-group Discord |
| 5 | **accord-project-mcp pair walkthrough** with Niall | After study (now complete) | Open |

New decision surfacing from W2 alternatives memo (will be folded into next mentor sync):

| # | Decision | Default proposal | Status |
|---|---|---|---|
| 6 | **MCP Tasks framing for agreement triggers** (per AAIF article) | Evaluate in W9 migration guide; propose as APAP `tasks` extension if compelling | Pending mentor input |
| 7 | **Function-calling adapter codegen target location** | Script in accordproject/apap next to existing OpenAPI build | Pending mentor input |
| 8 | **CrewAI as a third alternative spike before W9** | Trust LangGraph data; do CrewAI only if multi-agent design requires it | Pending mentor input |

---

## Standing logistics asks (resolved Jun 9, 2026)

All three asks from May 20 closed within 24 hours of the Jun 5 sync follow-up email.

| Ask | Resolved by | Outcome |
|---|---|---|
| Write access on `accordproject/apap` | Matt Roberts | Contributor invite + write permission; branch protection still requires approved PR (correct behaviour) |
| AI credits (Anthropic + OpenAI) | Matt Roberts | $20/month each for the duration of GSoC, expense-report flow via Dan Selman |
| Dedicated Discord channel | Sanket Shevkar | Channel link shared and access confirmed |

---

## Contributions to date

| Ref | Type | Summary |
|---|---|---|
| [Issue #152](https://github.com/accordproject/apap/issues/152) | Bug report | MCP error-handling gap across all 8 tools |
| [Issue #143](https://github.com/accordproject/apap/issues/143) | RFC comment | Architectural input on the service-layer RFC |
| [Issue #185](https://github.com/accordproject/apap/issues/185) | Discussion | GraphQL-shape semantics of APAP's typed schemas (Dan tagged Jun 5) |
| [PR #153](https://github.com/accordproject/apap/pull/153) | Fix + tests | `buildApiErrorMessage` helper (closed Jun 13 per the agreed plan; replaced by #196) |
| [PR #154](https://github.com/accordproject/apap/pull/154) | Bug fix | Template validation ordering (merged) |
| [PR #155](https://github.com/accordproject/apap/pull/155) | Bug fix | MCP resource URI overwrite from `Agreement.uri` (merged Jun 13) |
| [PR #184](https://github.com/accordproject/apap/pull/184) | Feature | Typed `ServiceError` hierarchy with agreements handler wired (merged Jun 14) |
| [PR #190](https://github.com/accordproject/apap/pull/190) | Docs | Initial roadmap (merged Jun 13) |
| [PR #196](https://github.com/accordproject/apap/pull/196) | Tests | Contract tests for `buildApiErrorMessage` helper (merged Jul 1) |
| [PR #197](https://github.com/accordproject/apap/pull/197) | Feature (superseded) | Slice 2 typed errors initial draft (closed Jun 25; replaced by #200 with the review feedback folded in) |
| [PR #198](https://github.com/accordproject/apap/pull/198) | Docs | Roadmap refresh through Jul 13 (this PR) |
| [PR #199](https://github.com/accordproject/apap/pull/199) | Feature | Concerto typed-context: `InitializeResult.instructions` + `apap://schema/protocol.cto` resource. A/B: Sonnet 4.6 +20pp, GPT-4o +38pp (merged Jul 9) |
| [PR #200](https://github.com/accordproject/apap/pull/200) | Feature | Typed errors in `mcp.ts` (slice 3): `serviceErrorToCallToolResult` + `serviceErrorToResourceError` map `ServiceError` to typed MCP payloads (merged Jul 3) |
| [PR #201](https://github.com/accordproject/apap/pull/201) | Feature | SEP-2549 `ttlMs` + `cacheScope` cache hints on `ReadResourceResult.contents[]`, forward-compatible with MCP 2026-07-28 RC (merged Jul 10) |
| [PR #202](https://github.com/accordproject/apap/pull/202) | Docs | CLAUDE.md refresh documenting the MCP typed-context surface and Docker context invariant (merged Jul 9) |
| [PR #208](https://github.com/accordproject/apap/pull/208) | Bug fix | Reject non-strict-numeric `:id` in CRUD router up-front (closes #162). Community-approved by @apoorv7g Jul 12; merged by @niallroche Jul 13 |
| [PR #210](https://github.com/accordproject/apap/pull/210) | Chore | Drop placeholder `crypto` npm stub from `server/package.json` (npm registry deprecated the package; Node ships the builtin) (merged Jul 21) |
| [PR #211](https://github.com/accordproject/apap/pull/211) | Feature | Slice 1 of the service-layer port: `templateService` + new `Database` type; rewire 4 mcp.ts template loops from `makeApiRequest` to direct service calls; `{ limit, offset }` pagination on the primitive (merged Jul 21) |
| [PR #212](https://github.com/accordproject/apap/pull/212) | CI | Stop `npm test || echo "No tests configured"` from silently swallowing failures in Build + CI workflows; also fixed the Windows jest-bin shell-wrapper issue that this exposed (merged Jul 21) |
| [PR #213](https://github.com/accordproject/apap/pull/213) | Feature | Slice 2: `agreementService` CRUD half (`listAgreements`, `getAgreementById`, `getAgreementByUri`) + rewire 4 mcp.ts agreement lookup loops; same pagination pattern as #211 (merged Jul 21) |
| [PR #214](https://github.com/accordproject/apap/pull/214) | Feature | Slice 2b: `convertAgreement` in the service wrapping the real `TemplateArchiveProcessor.draft`; REST `/agreements/:id/convert/:format` + MCP `convert-agreement-to-format` tool both call the same function; private `resolveAgreementRuntime` helper (merged Jul 21) |
| [PR #215](https://github.com/accordproject/apap/pull/215) | CI | Two-step install in Build + CI workflows so `server/node_modules` is actually populated on the runner (root `npm ci` doesn't recurse without a workspaces field). Fixed a silent-red matrix cell on macos-24 that had been broken on main for 12+ days (merged Jul 20) |
| [PR #216](https://github.com/accordproject/apap/pull/216) | Feature | Slice 2c: `triggerAgreement` in the service wrapping `TemplateArchiveProcessor.trigger`; REST `/agreements/:id/trigger` + MCP `trigger-agreement` tool both call the same function; targeted `.set({ state })` persist avoids concurrent-column clobber; legacy `{ isError: true }` HTTP 200 shape preserved for existing REST clients (merged Jul 21) |
| [Issue #217](https://github.com/accordproject/apap/issues/217) | Follow-up | Expose paged reads via MCP resource URIs for `apap://templates` and `apap://agreements` — service primitives are ready; MCP callers still can only see the first 100 rows. Slice 3 or slice 4 fold-in |
| Peer review on [#194](https://github.com/accordproject/apap/pull/194) | Review | Comment-style review on Satvik77777's session-cleanup memory-leak fix: flagged module-level `setInterval` side effect, weak test coverage on the cleanup path, and missing `transport.close()` before reference deletion |
| Peer reviews on [#192](https://github.com/accordproject/apap/pull/192) + [#203](https://github.com/accordproject/apap/pull/203) | Review | APPROVE reviews on Satvik77777's error-middleware refactor (with two defer-able follow-ups on unit coverage + Postgres error message preservation) and mcp-session-id header fix; both merged shortly after |

### POC deliverables (in `JayDS22/apap-mcp-poc`)

| Ref | Type | Summary |
|---|---|---|
| [`alternatives/openai-fn-calling` branch](https://github.com/JayDS22/apap-mcp-poc/tree/alternatives/openai-fn-calling) | Spike | OpenAI function-calling against APAP REST. Six tools, six-prompt smoke, 10,436 tokens, memo populated. |
| [`alternatives/langgraph` branch](https://github.com/JayDS22/apap-mcp-poc/tree/alternatives/langgraph) | Spike | LangGraph against APAP REST. Same six prompts, 9,276 tokens (~11% less than fn-calling), memo populated. |
| [`alternatives/decision-memo` branch](https://github.com/JayDS22/apap-mcp-poc/tree/alternatives/decision-memo) | Memo | W3 alternatives decision memo (merged Jun 14 as POC PR #1). |
| [POC PR #2](https://github.com/JayDS22/apap-mcp-poc/pull/2) | Feature | Concerto typed-context: hint + `protocol.cto` resource on the POC MCP server (mirrors upstream #199). |
| [POC PR #3](https://github.com/JayDS22/apap-mcp-poc/pull/3) | Bench | Concerto-context A/B harness + cross-provider first run. Adds latency-comparison harness (POC vs RI) to validate the shared-service-layer architectural claim. |
| [POC issue #6](https://github.com/JayDS22/apap-mcp-poc/issues/6) | Scope | W7 `subscriptions/listen` slice: handler, `SubscriptionRegistry` service, notification dispatch hooks, session-close cleanup. Opened Jul 13 |

### Comms deliverables

| Date | Artifact | Notes |
|---|---|---|
| Jul 12 | [Medium article](https://medium.com/@guwalanijj/six-weeks-into-hardening-a-smart-legal-contract-server-for-ai-1435e8cb80f9) | Midterm dispatch: framework-vs-tool-count finding, full technical arc through W6 |
| Jul 12 | LinkedIn post | Cross-post with the Medium link, technical hook + downstream Accord workstream references |
| Jul 12 | Accord Discord + GSoC group | Technical shares with peer-review invitation and next-slice signal |

---

## Future work (beyond GSoC 2026)

Threads surfaced during GSoC that fell outside the proposal scope but are worth capturing here so they don't get lost during the W12 handoff writeup.

### Tool retrieval layer for APAP MCP

Both the alternatives evaluation (W3-W4) and the midterm dispatch published Jul 12 landed on the same finding: framework choice barely moves the token bill, and the tool-definition floor is where the real cost lives. Selective tool exposure is the actual lever.

A retrieval layer in front of the APAP MCP surface, where the LLM only sees the tool subset relevant to a specific request, would compose naturally with the SEP-2549 cache hints from #201.

- **Peer-reviewed prior art:** [ACE-Router](https://arxiv.org/abs/2601.08276) (ACL 2026, arXiv 2601.08276) — an MCP-native history-aware router trained on MCP-Universe and MCP-Mark benchmarks. Code at [github.com/euyis1019/ACE-Router](https://github.com/euyis1019/ACE-Router).
- **Ecosystem validation:** Anthropic's Tool Search shipped default in Claude Code (51K to 8.5K main-thread tokens in production per [Arcade's analysis](https://blog.arcade.dev/anthropic-tool-search-claude-mcp-runtime)), Red Hat's ToolScope Tool RAG library on GitHub + PyPI, and MCP community issue [#2808](https://github.com/modelcontextprotocol/modelcontextprotocol/issues/2808) proposing tiered schema detail at the spec level.

Surfaced with Niall on Discord (Jul 14) and parked as "a future work element to explore if it is worthwhile." Captured here so the thread is discoverable after handoff.

---

## How to contribute

This roadmap is intentionally open. If you want to:

- **Suggest a scope change**: open a PR against this file.
- **Add a workstream item**: drop a comment in the relevant issue or open a new one and link it from the schedule above.
- **Propose a dependency we should evaluate** (e.g. for the Alternatives lane): open an issue tagged `gsoc-2026`.
- **Volunteer for a sub-task**: comment on the matching week's activities or ping me on Discord.

---

## References

- [Accord Project GSoC ideas list](https://wiki.accordproject.org/) (Idea #4)
- [MCP 2026-07-28 RC blog post (Anthropic)](https://blog.modelcontextprotocol.io/posts/2026-07-28-release-candidate)
- [MCP Is Growing Up (Agentic AI Foundation, May 27 2026)](https://aaif.io/blog/mcp-is-growing-up/) - Angie Jones's read on the 2026-07-28 RC, surfaced from the MCP Dev Summit keynote; the article's "what I'd do next" advice maps directly onto the W3-W9 roadmap lanes
- [accord-project-mcp (Niall's reference repo)](https://github.com/The-Building-Blocks/accord-project-mcp)
- [apap-mcp-poc (GSoC proof of concept)](https://github.com/JayDS22/apap-mcp-poc)
