# GSoC 2026 - Hardening APAP / MCP

> **Status (Jun 24, 2026):** W4 day 2 of 12. Typed `ServiceError` slice 1
> merged (#184); slice 2 draft (#197) and contract tests (#196) open.
> Concerto typed-context (`InitializeResult.instructions` plus the
> `apap://schema/protocol.cto` resource) shipped as PR #199 with A/B
> wins of +20pp on Claude Sonnet 4.6 and +38pp on GPT-4o against a fixed
> query set. POC bench harnesses landed for both the typed-context A/B
> and a cross-server latency comparison. Blog draft "APAP Enhancements
> for AI Agents" circulated to mentors; Dan's feedback incorporated.
> Headroom compression-proxy evaluation requested by Niall on Jun 18 is
> the W3 carryover for W4; plan drafted, run scheduled. Four open PRs
> (#196 / #197 / #198 / #199) are blocked on the Windows CI fix in
> maintainer PR #195.

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

Five parallel lanes, with the proposal scope as the spine and four
adjacent tracks surfaced from the May 20 sync with Niall and Sanket.

| # | Workstream | Owner | Current status |
|---|---|---|---|
| 1 | **Proposal Core** - service layer, tests, multi-client docs | Jay | Active (W4); slice 1 merged (#184), slice 2 draft (#197), contract tests (#196) and Concerto typed-context (#199) open |
| 2 | **MCP RC migration** - adopt 2026-07-28 spec via parallel transport | Jay | Starting W4 |
| 3 | **Agentic Payments** - multi-provider OAuth, privacy boundary, agent-calling-agents demo | Jay (with Niall) | W9 lane confirmed joint Niall+Jay on Jun 18 call |
| 4 | **Alternatives Evaluation** - OpenAI fn-calling, LangGraph / CrewAI comparison | Jay | Both spikes done, memo merged; Concerto typed-context A/B shipped (#199, +20pp Sonnet 4.6 / +38pp GPT-4o) |
| 5 | **Skills + Ops** - accordproject/skills refresh, dev branch, comms | Jay (with Sanket) | Bonding asks resolved Jun 9; blog draft circulated Jun 18, in revision |
| 6 | **Headroom compression eval** - measure token reduction + fidelity for MCP tool outputs | Jay (Niall ask, Tejas-facing) | W3 carryover; plan drafted Jun 24, run scheduled W4 |

---

## 12-week schedule

| Wk | Dates | Primary focus | Key activities | Status |
|---|---|---|---|---|
| Bond. | May 8 - Jun 1 | Setup + study | accord-project-mcp study, MCP RC compat matrix, dev branch + Discord (Sanket), apap/ access + API credits confirmation | Done |
| 1 | Jun 2 - Jun 8 | Refactor + alternatives | Land service layer + typed errors upstream; begin alternatives evaluation | Done (slice 1 merged via #184) |
| 2 | Jun 9 - Jun 15 | Refactor + alternatives | Continue service-layer PRs; skills repo refresh starts; alternatives decision memo draft | Done (slice 2 draft #197, both spikes shipped, memo drafted) |
| 3 | Jun 16 - Jun 22 | Tests + OAuth | Unit tests upstream (Vitest, 90% gate); alternatives memo delivered; multi-provider OAuth design; **+ Concerto typed-context A/B shipped (#199); blog draft circulated** | Done with carryover (Headroom eval pending) |
| 4 | Jun 23 - Jun 29 | Tests + payments + Headroom | Integration tests (Docker Postgres); begin parallel 2026-07-28 transport; privacy-boundary design; Headroom proxy evaluation + report-back to Niall | Active |
| 5 | Jun 30 - Jul 6 | Contract tests | Contract tests against SEP-2484; continue stateless transport; skills repo updates finalized | Planned |
| 6 | Jul 7 - Jul 13 | Buffer + midterm | Midterm eval; mentor review; refactor on feedback; stateless transport feature-complete | Planned |
| 7 | Jul 14 - Jul 20 | Docs + auto-tooling | Claude tutorial; add ttlMs / cacheScope / W3C traceparent; auto-tooling prototype | Planned |
| 8 | Jul 21 - Jul 27 | Docs + auto-tooling | ChatGPT + Inspector tutorials; auto-tooling integration tests | Planned |
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
| Jul 14 | Midterm evaluation (W6) | Upcoming |
| Jul 28 | MCP 2026-07-28 spec finalizes | Upcoming |
| Aug 25 | Final evaluation (W12) | Upcoming |

---

## Open decisions (as of Jun 24, 2026)

From Section 6 of the May 20 sync. Decisions 2 and 4 (partial) resolved; three still open.

| # | Decision | Default proposal | Status |
|---|---|---|---|
| 1 | **Scope** - 5 workstreams or proposal-only | 5 workstreams with midterm checkpoint to scope down | Open |
| 2 | **Alternatives evaluation depth** - light / medium / heavy | Medium (memo + working spike) | **Resolved** via AI credit grant Jun 9; both spikes shipped, decision memo drafted |
| 3 | **MCP 2026-07-28 transport strategy** - stay / parallel / migrate-first | Parallel from W4 | Open |
| 4 | **Comms cadence** - channel + meeting slot | Thursdays 9 AM ET (2 PM UK / 6:30 PM IST) | Channel **resolved**; meeting slot pending |
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
| [PR #196](https://github.com/accordproject/apap/pull/196) | Tests | Contract tests for `buildApiErrorMessage` helper (open) |
| [PR #197](https://github.com/accordproject/apap/pull/197) | Feature (draft) | Slice 2 typed errors: agreements + templatebuilder wired (draft, opened Jun 15) |
| [PR #198](https://github.com/accordproject/apap/pull/198) | Docs | Roadmap W3-W4 refresh (this PR) |
| [PR #199](https://github.com/accordproject/apap/pull/199) | Feature | Concerto typed-context: `InitializeResult.instructions` + `apap://schema/protocol.cto` resource. A/B: Sonnet 4.6 +20pp, GPT-4o +38pp |

### W1-W4 deliverables (in `JayDS22/apap-mcp-poc`)

| Ref | Type | Summary |
|---|---|---|
| [`alternatives/openai-fn-calling` branch](https://github.com/JayDS22/apap-mcp-poc/tree/alternatives/openai-fn-calling) | Spike | OpenAI function-calling against APAP REST. Six tools, six-prompt smoke, 10,436 tokens, memo populated. |
| [`alternatives/langgraph` branch](https://github.com/JayDS22/apap-mcp-poc/tree/alternatives/langgraph) | Spike | LangGraph against APAP REST. Same six prompts, 9,276 tokens (~11% less than fn-calling), memo populated. |
| [`alternatives/decision-memo` branch](https://github.com/JayDS22/apap-mcp-poc/tree/alternatives/decision-memo) | Memo | W3 alternatives decision memo (merged Jun 14 as POC PR #1). |
| [POC PR #2](https://github.com/JayDS22/apap-mcp-poc/pull/2) | Feature | Concerto typed-context: hint + `protocol.cto` resource on the POC MCP server (mirrors upstream #199). |
| [POC PR #3](https://github.com/JayDS22/apap-mcp-poc/pull/3) | Bench | Concerto-context A/B harness + cross-provider first run. Adds latency-comparison harness (POC vs RI) to validate the shared-service-layer architectural claim. |

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
