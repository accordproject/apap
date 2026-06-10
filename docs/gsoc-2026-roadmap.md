# GSoC 2026 - Hardening APAP / MCP

> **Status (Jun 10, 2026):** W2 day 2 of 12. Service-layer first slice
> shipped as draft PR #184. OpenAI function-calling spike complete with
> comparison memo populated. Logistics resolved Jun 9.

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
| 1 | **Proposal Core** - service layer, tests, multi-client docs | Jay | Active (W2); slice 1 shipped via PR #184 |
| 2 | **MCP RC migration** - adopt 2026-07-28 spec via parallel transport | Jay | W4 |
| 3 | **Agentic Payments** - multi-provider OAuth, privacy boundary, agent-calling-agents demo | Jay (with Niall) | W3 |
| 4 | **Alternatives Evaluation** - OpenAI fn-calling, LangGraph / CrewAI comparison | Jay | Active (W2); OpenAI spike complete |
| 5 | **Skills + Ops** - accordproject/skills refresh, dev branch, comms | Jay (with Sanket) | Bonding asks resolved Jun 9; skills refresh next |

---

## 12-week schedule

| Wk | Dates | Primary focus | Key activities | Status |
|---|---|---|---|---|
| Bond. | May 8 - Jun 1 | Setup + study | accord-project-mcp study, MCP RC compat matrix, dev branch + Discord (Sanket), apap/ access + API credits confirmation | Done |
| 1 | Jun 2 - Jun 8 | Refactor + alternatives | Land service layer + typed errors upstream; begin alternatives evaluation | Done (slice 1 shipped, spike scaffolded) |
| 2 | Jun 9 - Jun 15 | Refactor + alternatives | Continue service-layer PRs; skills repo refresh starts; alternatives decision memo draft | Active |
| 3 | Jun 16 - Jun 22 | Tests + OAuth | Unit tests upstream (Vitest, 90% gate); alternatives memo delivered; multi-provider OAuth design | Upcoming |
| 4 | Jun 23 - Jun 29 | Tests + payments | Integration tests (Docker Postgres); begin parallel 2026-07-28 transport; privacy-boundary design | Planned |
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
| Jun 19 (approx.) | Niall's Agents-Calling-Agents call | Scheduled |
| Jul 14 | Midterm evaluation (W6) | Upcoming |
| Jul 28 | MCP 2026-07-28 spec finalizes | Upcoming |
| Aug 25 | Final evaluation (W12) | Upcoming |

---

## Open decisions (as of Jun 10, 2026)

From Section 6 of the May 20 sync. Two implicitly resolved Jun 9 by Matt and Sanket's responses; three still open.

| # | Decision | Default proposal | Status |
|---|---|---|---|
| 1 | **Scope** - 5 workstreams or proposal-only | 5 workstreams with midterm checkpoint to scope down | Open |
| 2 | **Alternatives evaluation depth** - light / medium / heavy | Medium (memo + working spike) | **Resolved (implicit)** via AI credit grant Jun 9 |
| 3 | **MCP 2026-07-28 transport strategy** - stay / parallel / migrate-first | Parallel from W4 | Open |
| 4 | **Comms cadence** - channel + meeting slot | Thursdays 9 AM ET (2 PM UK / 6:30 PM IST) | Channel **resolved**; meeting slot pending |
| 5 | **accord-project-mcp pair walkthrough** with Niall | After study (now complete) | Open |

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
| [PR #153](https://github.com/accordproject/apap/pull/153) | Fix + tests | `buildApiErrorMessage` helper (closing after #155 merges, replaced by clean test-only PR) |
| [PR #154](https://github.com/accordproject/apap/pull/154) | Bug fix | Template validation ordering (merged) |
| [PR #155](https://github.com/accordproject/apap/pull/155) | Bug fix | MCP resource URI overwrite from `Agreement.uri` (maintainer-engaged) |
| [PR #184](https://github.com/accordproject/apap/pull/184) | Feature (draft) | Typed `ServiceError` hierarchy ported from POC, agreements handler wired |
| [PR #190](https://github.com/accordproject/apap/pull/190) | Docs | This roadmap |

### W2-specific deliverables (in `JayDS22/apap-mcp-poc`)

| Ref | Type | Summary |
|---|---|---|
| `alternatives/openai-fn-calling` branch | Spike | OpenAI function-calling against APAP REST. Six tools, six-prompt smoke, 10,436 tokens, memo populated. |

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
