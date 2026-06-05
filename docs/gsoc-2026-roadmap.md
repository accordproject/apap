# GSoC 2026 - Hardening APAP / MCP

> **Status (Jun 5, 2026):** W1 day 3 of 12. Service-layer first slice
> shipped as draft PR #184. Bonding closed.

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
| 1 | **Proposal Core** - service layer, tests, multi-client docs | Jay | Active (W1) |
| 2 | **MCP RC migration** - adopt 2026-07-28 spec via parallel transport | Jay | W4 |
| 3 | **Agentic Payments** - multi-provider OAuth, privacy boundary, agent-calling-agents demo | Jay (with Niall) | W3 |
| 4 | **Alternatives Evaluation** - OpenAI fn-calling, CrewAI / LangGraph comparison | Jay | W1 |
| 5 | **Skills + Ops** - accordproject/skills refresh, dev branch, comms | Jay (with Sanket) | Bonding closure pending |

---

## 12-week schedule

| Wk | Dates | Primary focus | Key activities |
|---|---|---|---|
| Bond. | May 8 - Jun 1 | Setup + study | accord-project-mcp study, MCP RC compat matrix, dev branch + Discord (Sanket), apap/ access + API credits confirmation |
| 1 | Jun 2 - Jun 8 | Refactor + alternatives | Land service layer + typed errors upstream; begin alternatives evaluation |
| 2 | Jun 9 - Jun 15 | Refactor + alternatives | Continue service-layer PRs; skills repo refresh starts; alternatives decision memo draft |
| 3 | Jun 16 - Jun 22 | Tests + OAuth | Unit tests upstream (Vitest, 90% gate); alternatives memo delivered; multi-provider OAuth design |
| 4 | Jun 23 - Jun 29 | Tests + payments | Integration tests (Docker Postgres); begin parallel 2026-07-28 transport; privacy-boundary design |
| 5 | Jun 30 - Jul 6 | Contract tests | Contract tests against SEP-2484; continue stateless transport; skills repo updates finalized |
| 6 | Jul 7 - Jul 13 | Buffer + midterm | Midterm eval; mentor review; refactor on feedback; stateless transport feature-complete |
| 7 | Jul 14 - Jul 20 | Docs + auto-tooling | Claude tutorial; add ttlMs / cacheScope / W3C traceparent; auto-tooling prototype |
| 8 | Jul 21 - Jul 27 | Docs + auto-tooling | ChatGPT + Inspector tutorials; auto-tooling integration tests |
| 9 | Jul 28 - Aug 3 | Migration guide + demo | Migration guide; agent-calling-agents demo (APAP as service, not agent) |
| 10 | Aug 4 - Aug 10 | DX + demo | Pino at 15+ call sites; demo polish; blog draft (alternatives + agents with Accord) |
| 11 | Aug 11 - Aug 17 | E2E + blog | E2E in GH Actions; multi-version transport tests; blog draft to mentors for review |
| 12 | Aug 18 - Aug 24 | Release | Final docs review; PRs merged; blog published; handoff prep |

---

## Milestones

| Date | Milestone |
|---|---|
| Jun 1 | Bonding ends |
| Jul 14 | Midterm evaluation (W6) |
| Jul 28 | MCP 2026-07-28 spec finalizes |
| Aug 25 | Final evaluation (W12) |

---

## Open decisions (as of Jun 5, 2026)

From Section 6 of the May 20 sync. Tracking here for visibility.

| # | Decision | Default proposal | Status |
|---|---|---|---|
| 1 | **Scope** - 5 workstreams or proposal-only | 5 workstreams with midterm checkpoint to scope down | Open |
| 2 | **Alternatives evaluation depth** - light / medium / heavy | Medium (memo + working spike) | Open |
| 3 | **MCP 2026-07-28 transport strategy** - stay / parallel / migrate-first | Parallel from W4 | Open |
| 4 | **Comms cadence** - channel + meeting slot | New Discord channel; Thursdays 9 AM ET (2 PM UK / 6:30 PM IST) | Sent to Sanket |
| 5 | **accord-project-mcp pair walkthrough** with Niall | After study (now complete) | Open |

---

## Standing logistics asks

| Ask | Days open | Owner |
|---|---|---|
| Write access on `accordproject/apap` (currently READ-only) | 16 | Sanket |
| AI credits (Anthropic + OpenAI) for alternatives evaluation | 16 | Sanket |
| Dedicated Discord channel + common project distro | 16 | Sanket |

---

## Contributions to date

| Ref | Type | Summary |
|---|---|---|
| [Issue #152](https://github.com/accordproject/apap/issues/152) | Bug report | MCP error-handling gap across all 8 tools |
| [Issue #143](https://github.com/accordproject/apap/issues/143) | RFC comment | Architectural input on the service-layer RFC |
| [Issue #185](https://github.com/accordproject/apap/issues/185) | Discussion | GraphQL-shape semantics of APAP's typed schemas |
| [PR #153](https://github.com/accordproject/apap/pull/153) | Fix + tests | `buildApiErrorMessage` helper, first automated tests for the MCP layer (closing after #155 merges) |
| [PR #154](https://github.com/accordproject/apap/pull/154) | Bug fix | Template validation ordering (merged) |
| [PR #155](https://github.com/accordproject/apap/pull/155) | Bug fix | MCP resource URI overwrite from `Agreement.uri` |
| [PR #184](https://github.com/accordproject/apap/pull/184) | Feature (draft) | Typed `ServiceError` hierarchy ported from POC, agreements handler wired |

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
- [MCP 2026-07-28 RC blog post](https://blog.modelcontextprotocol.io/posts/2026-07-28-release-candidate)
- [accord-project-mcp (Niall's reference repo)](https://github.com/The-Building-Blocks/accord-project-mcp)
- [apap-mcp-poc (GSoC proof of concept)](https://github.com/JayDS22/apap-mcp-poc)
