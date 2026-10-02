# Accord Project × UCP: exploration and demo plan

Status: **exploration / draft for discussion**. Nothing here is committed scope yet.

This document takes the idea behind
[`accord-x402-contract-server`](https://github.com/The-Building-Blocks/accord-x402-contract-server)
(an Accord contract whose obligations drive a commerce protocol, and whose state is
updated by that protocol's settlement events) and reframes it for the
[Universal Commerce Protocol (UCP)](https://ucp.dev/). Before proposing a demo it
looks at three things:

1. **Use case.** Which commerce flows actually need a dynamically drafted contract
   and automation after execution. Most retail checkouts don't.
2. **Extension design.** How Accord Project can extend UCP. In particular:
   - how obligations can be exposed as UCP **Actions**;
   - how UCP **policies** and **links** can reference Accord agreements.
3. **Template design.** What templates look like on the 1.0.0 model family and the
   template-engine logic API, following
   [accordproject/cicero-template-library#528](https://github.com/accordproject/cicero-template-library/pull/528)
   (`src/copyright-license-agreement-poc`).

UCP references are to the draft spec on `main` of
`Universal-Commerce-Protocol/ucp` (commit `b0e81ad`, `ucp_version: "draft"`). The
latest dated release is `2026-08-25`, and the demo should pin to that once it is
checked against these notes.

---

## 1. What the x402 demo does, and what changes with UCP

| Concern | x402 demo | UCP equivalent |
|---|---|---|
| Discovery of terms | `/.well-known/legal-context.json` (LCP) with `atrHash` | `/.well-known/ucp` profile, plus `links[]` / `policies[]` on every checkout response |
| Commercial offer | `PaymentRequired.accepts[]`, plus an experimental `org.accordproject.offer-set` extension | `checkout` session: `line_items`, `totals`, `payment.terms[]` (`dev.ucp.common.payment.terms`), `fulfillment` |
| Obligation → protocol | `PaymentObligation` → x402 `PaymentRequirements`, with the obligation ref in `extensions["org.accordproject.obligation"]` | Obligations → UCP **Actions** (pre-execution gates) and Order fields (post-execution); see §3 |
| Settlement → contract | Facilitator `SettleResponse` → `PaymentSettledRequest` | `complete_checkout` result, Order webhook events (`fulfillment.events[]`, `adjustments[]`) → typed contract requests |
| Acceptance | `acceptanceStatus: DECLARED`, because the EIP-3009 signature does not sign the agreement | AP2 `merchant_authorization` (JWS over the JCS-canonical checkout) and `checkout_mandate` (SD-JWT over the same checkout). If the agreement hash is in the checkout, **both parties sign over it** |
| Extension point | Top-level x402 `extensions` map | A UCP extension capability (`extends: [...]`), negotiated by profile intersection, with JSON Schema `allOf` composition |
| Unit of value | Atomic token units with no scale (the reason for `canonicalAmount`) | Integer minor units plus ISO 4217 `currency`. This maps losslessly to `money@1.0.0.PreciseAmount` (`unscaledValue = amount`, `scale` = currency exponent) |
| Lifecycle span | One request: quote → pay → entitlement | Checkout → Order. The Order has a durable, webhook-driven post-purchase lifecycle |

Three things matter most:

- **UCP has a post-purchase lifecycle.** x402 does not. A UCP Order is a long-lived
  resource with an append-only fulfilment event log and an adjustments ledger
  (refunds, credits, disputes), pushed to the platform as full snapshots over signed
  webhooks. That is the hook for "post-execution automation".
- **UCP plus AP2 can close the gap the x402 demo documents.** The x402 demo records
  acceptance as `DECLARED` because "payment authorization is not legal assent". When
  AP2 is negotiated, both the business signature and the buyer's checkout mandate
  cover the whole JCS-canonical checkout. If the checkout carries the agreement's
  hash, both signatures are signatures over the agreement reference. Whether that
  amounts to legal assent is a legal question (§7). It is at least a cryptographic
  binding, which x402 cannot give.
- **UCP's money is easier.** Integer minor units plus `currency` already *is* a
  `PreciseAmount` once the currency exponent is applied.

---

## 2. Use case: where does a contract actually earn its keep?

### 2.1 Why retail checkout is a weak fit

A retail checkout is a contract in the legal sense, but in practice:

- the terms are **static** standard terms (ToS, return and warranty policy) that do
  not vary with the cart, so there is nothing to draft;
- performance is **simultaneous**: payment at checkout and delivery shortly after.
  Few obligations are left open once the order exists;
- the remedies (returns, refunds) are already modelled operationally by UCP:
  `dev.ucp.shopping.policy.return` and Order `adjustments[]`.

Putting Accord behind a T-shirt checkout would only replace a `terms_of_service`
link with a hashed rendering of the same text. That is real (it gives L2
"provable" terms) but small.

### 2.2 Selection criteria

A good use case has:

1. **Terms that depend on the transaction.** The variables come from the cart:
   quantities, dates, the chosen payment term, delivery window, and buyer identity
   or tier.
2. **Obligations that outlive checkout.** Deferred payment, delivery by a date,
   inspection and acceptance windows, deposits and balances.
3. **Conditional remedies a machine can compute** from events UCP already carries:
   late-delivery credits, late-payment interest, cancellation penalties, attrition.
4. **A UCP surface that already exists**, so the demo extends UCP rather than
   inventing a vertical.

### 2.3 Candidates

| Candidate | Dynamic terms | Post-execution obligations | Computable remedies | Existing UCP surface | Verdict |
|---|---|---|---|---|---|
| Retail checkout | ✗ static ToS | weak | returns (already in UCP) | checkout, order | Too thin |
| **B2B wholesale order on trade terms** | ✓ volume pricing, Net-30/60, delivery-by date, PO number | ✓ seller delivers by date; buyer pays by due date; inspection window | ✓ late-delivery credit, late-payment interest, rejection of non-conforming goods | checkout + **`dev.ucp.common.payment.terms`** (Net-30 is a spec example) + identity linking (its B2B wholesaler example) + order fulfilment events and adjustments | **Recommended** |
| Lodging / group booking | ✓ dates, room block, deposit schedule | ✓ deposit, balance, attrition, cutoff | ✓ cancellation penalty by date, attrition fee | `dev.ucp.lodging.booking`, `dev.ucp.lodging.policy.cancellation`, payment terms (deposit + balance is a spec example) | Strong runner-up |
| Equipment rental / hire | ✓ duration, deposit | ✓ return by date, damage | ✓ late-return fees, deposit release | none (no rental vertical) | Needs a new vertical |
| Subscriptions / SaaS | ✓ plan, term | ✓ renewals | ✓ SLA credits | **explicitly out of scope** in the payment-terms spec ("Schedules settle the current checkout. They do not create future purchases, renewals") | Avoid for now |
| Digital content licence (the x402 case) | ~ plan choice | ~ entitlement metering | ~ | checkout only | Already covered by x402 |

### 2.4 Recommendation: B2B wholesale replenishment on trade terms

**Scenario.** A café's purchasing agent (the UCP *Platform*) reorders coffee from a
roaster's wholesale store (the UCP *Business*). The buyer is identity-linked as a
trade account. The checkout is governed by a **Wholesale Supply Agreement** drafted
from the cart.

**Drafted from the checkout:**

- parties: the business's legal entity, and the buyer from identity linking or `buyer`;
- an order schedule built from `line_items`: product, quantity, unit price, with
  volume tier pricing applied by the business;
- a delivery-by date, from the selected `fulfillment` option's promise;
- a payment term, from `payment.selected_term_id` (pay now / Net-30 / 50% deposit +
  balance on delivery);
- a late-delivery credit rate and cap, and a late-payment interest rate, which
  depend on the buyer's trade tier;
- an inspection window, inside which the buyer can reject non-conforming goods.

**Automated after execution:**

| UCP event (Order webhook) | Contract request | Contract effect | Back into UCP |
|---|---|---|---|
| `complete_checkout` → Order created | `init` | Issues `PerformanceObligation` (seller delivers by D) and `PaymentObligation` (buyer pays per term) | Order carries the agreement reference and obligations (§3.4) |
| `fulfillment.events[]` gets `type: delivered` | `DeliveryRecorded` | Delivery obligation `FULFILLED`. If late, a credit is computed and a `RemediationObligation` is issued on the seller. The payment obligation becomes `DUE` with `dueAt = delivered + 30d`; the inspection window opens | Credit becomes an `adjustments[]` entry (`type: credit`). A payment Action appears on the Order for the buyer |
| Buyer rejects goods inside the window | `GoodsRejected` | Remediation obligation (replace or refund) | `adjustments[]` (`refund`), plus a return fulfilment expectation |
| Buyer pays the invoice | `PaymentReceived` | Payment `FULFILLED`. Composed late-payment clause discharged | Action removed; order message |
| Due date passes unpaid | `PaymentRequest` (scheduled) | Delegates to the composed **late-payment** clause (reminders, interest) | Order `messages[]` warning, updated Action amount |

This reuses the PR #528 pattern directly: an inline payment clause in the main
document, a composed late-payment clause, and a stateless schedule document.

**Lodging alternative.** A hotel group block maps almost one-for-one: room-block
schedule; deposit + balance via payment terms; attrition and cancellation penalty
clauses priced off `dev.ucp.lodging.policy.cancellation`. Keep it as the second
template once the extension is proven on wholesale.

---

## 3. How Accord Project could extend UCP

### 3.1 Naming and hosting

UCP **authority binding** requires a capability's `schema` URL host, with its labels
reversed, to equal the capability name or be a label-aligned prefix of it.

- If schemas are hosted on `accordproject.org`, names can be `org.accordproject.*`.
  This is recommended.
- If they are hosted on `models.accordproject.org`, names must start with
  `org.accordproject.models.*`.

Proposed capabilities (vendor namespace first, as UCP governance recommends; they
could be promoted later through a UCP Enhancement Proposal):

| Capability | Extends | Purpose |
|---|---|---|
| `org.accordproject.agreement` | `dev.ucp.shopping.checkout`, `dev.ucp.shopping.order`, `dev.ucp.lodging.booking` | Carries the agreement reference, drafting status and hashes. Declares the pre-execution Action types. Adds `obligations[]` to Order |
| `org.accordproject.agreement.policy` (could fold into the above) | `dev.ucp.shopping.checkout`, `dev.ucp.shopping.order` | Clause-backed `policies[]` entries and disclosure messages |

Each schema is JSON Schema 2020-12 with `$defs` keyed by parent capability name, built
with `allOf` as UCP requires. It should be **generated from a Concerto model**
(`org.accordproject.protocol.ucp@0.1.0`, the counterpart of the vendored
`x402@0.2.0.cto`) using `concerto compile --target jsonschema`, so the wire schema and
the Concerto types cannot drift. Each entry declares
`requires: { protocol: { min: "2026-08-25" } }`.

Business profile fragment:

```json
"capabilities": {
  "dev.ucp.shopping.checkout": [{ "version": "2026-08-25", "schema": "https://ucp.dev/2026-08-25/schemas/shopping/checkout.json" }],
  "dev.ucp.shopping.order":    [{ "version": "2026-08-25", "schema": "https://ucp.dev/2026-08-25/schemas/shopping/order.json",
                                  "config": {} }],
  "dev.ucp.common.payment.terms": [{ "version": "2026-08-25", "extends": ["dev.ucp.shopping.checkout", "dev.ucp.shopping.order"], "schema": "…" }],
  "org.accordproject.agreement": [{
    "version": "0.1.0",
    "extends": ["dev.ucp.shopping.checkout", "dev.ucp.shopping.order"],
    "spec":   "https://accordproject.org/ucp/agreement/0.1.0/",
    "schema": "https://accordproject.org/ucp/agreement/0.1.0/agreement.json",
    "requires": { "protocol": { "min": "2026-08-25" } },
    "config": {
      "apap": "https://supplier.example.com/apap/",
      "formats": ["text/markdown", "text/html", "application/vnd.accordproject.templatemark+json"],
      "acceptance": ["dev.ucp.common.payment.ap2_mandate", "org.accordproject.agreement.sign"]
    }
  }]
}
```

### 3.2 The agreement object on Checkout (and Booking)

The extension adds one field. Extension data must not go inside the reserved `ucp`
member. To avoid colliding with future core fields, the field key is the
reverse-domain name, the same convention the x402 demo used for
`extensions["org.accordproject.obligation"]`. Whether a bare `agreement` key is
acceptable is open question Q3.

```json
"org.accordproject.agreement": {
  "agreement_id": "agr_7f3c",
  "status": "draft",                       // draft | proposed | accepted | executed | void
  "revision": 4,                           // bumps on every re-draft
  "documents": [
    { "document_id": "supply",   "template": { "template_id": "wholesale-supply-agreement", "version": "0.1.0", "archive_hash": "sha256:…" } },
    { "document_id": "schedule", "template": { "template_id": "order-schedule",             "version": "0.1.0", "archive_hash": "sha256:…" } }
  ],
  "agreement_hash": { "algorithm": "sha256", "canonicalization": "rfc8785-jcs", "value": "…" },
  "renditions": [
    { "media_type": "text/markdown", "url": "https://supplier.example.com/apap/agreements/agr_7f3c/convert/markdown?rev=4", "sha256": "…" },
    { "media_type": "text/html",     "url": "https://supplier.example.com/apap/agreements/agr_7f3c/convert/html?rev=4" }
  ]
}
```

- `documents[].template` is a projection of `template@1.0.0.TemplateReference`. The
  hash shape is a projection of `crypto@1.0.0.ContentHash`, and states its
  canonicalization explicitly, as `agreement@1.0.0` asks profiles to.
- **Drafting is a pure function of the checkout.** On every `create_checkout` and
  `update_checkout`, the business maps checkout → `TemplateData`, drafts, validates
  with Concerto, and re-hashes. Update is a full replacement in UCP, so the draft is
  always regenerated, never patched.
- A missing template variable that only the buyer can supply (a PO number, a
  delivery dock) becomes a UCP `error` message with `severity: requires_buyer_input`
  and a `path` to the field. That fits UCP's existing status machine: the checkout
  stays `incomplete` until it is supplied.
- `status` moves to `accepted` only through an acceptance Action (§3.3) or the AP2
  mandate, and to `executed` when `complete_checkout` returns an Order.

### 3.3 Obligations as Actions

**What UCP Actions are.** An Action is "an outstanding unit of extension-defined work
for a Platform to process", keyed by a reverse-domain *Action type*. Its presence
**gates** an effect. The declaring extension defines `config`, the processing,
trust and fallback rules, and the outcome. A capability supports Actions only if
its spec explicitly adopts them. Today **Cart, Checkout and Catalog** do (and
Lodging Booking's schema has `actions`). **Order does not.**

That gives a clean split.

#### (a) Before execution: conditions precedent are Actions on Checkout

Some obligations must be discharged *before* the checkout can complete: review the
terms, sign, provide a PO, pass a credit check, accept a deposit schedule. These are
exactly what UCP Actions gate. `org.accordproject.agreement` declares these Action
types:

| Action type | Gates | `config` (owned by the extension) | Processing |
|---|---|---|---|
| `org.accordproject.agreement.review` | `complete_checkout` | `{ agreement_hash, renditions[], clause_paths[] }` | The platform fetches a rendition, checks its hash, and shows it to the buyer or evaluates it against buyer policy (the LCP `BuyerPolicy` idea). It then re-submits `update_checkout` with `org.accordproject.agreement.acknowledged_hash` |
| `org.accordproject.agreement.sign` | `complete_checkout` | `{ agreement_hash, signing_payload, alg: ["ES256","EdDSA"], authority: "principal" or "agent" }` | The platform returns a detached JWS over the agreement hash. It is not needed if AP2 is active and the business accepts the checkout mandate as acceptance |
| `org.accordproject.obligation.performance` | `complete_checkout` | `{ obligation: <obligation@1.0.0 projection>, input_path }` | A generic "do this before we can complete" gate for a `PerformanceObligation` whose bearer is the buyer and which is `DUE` pre-execution (e.g. provide a resale certificate) |

Each instance's `id` is the obligation's `obligationId`. That satisfies UCP's rule
that the same outstanding work keeps the same id, and replacement work (an
obligation `SUPERSEDED` by a re-draft) gets a new one. When an Action blocks
`complete_checkout`, the business returns the checkout with a `recoverable` error
message whose `path` selects that Action, as UCP requires.

#### (b) After execution: obligations on Order

Order does not adopt Actions, and UCP has no platform→business write channel on
Order (only the business→platform webhook and `get_order`). There are two options,
and the demo should do **both**:

1. **Now, inside the extension:** `org.accordproject.agreement` extends
   `dev.ucp.shopping.order` with `obligations[]`, a JSON projection of
   `obligation@1.0.0` (status, bearers and beneficiaries as UCP roles, `due_at`,
   `amount` as minor units + currency, `revision`). The business pushes it in
   every order webhook snapshot, so `ObligationTransition`s reach the platform
   through the existing signed webhook. For obligations whose **bearer is the
   buyer**, the entry carries a `perform` descriptor naming the APAP trigger that
   discharges it. For example:

   ```json
   {
     "obligation_id": "agr_7f3c/supply/paymentTerms",
     "kind": "payment",
     "status": "DUE",
     "due_at": "2026-11-14T00:00:00Z",
     "amount": 41200,
     "bearer": "buyer",
     "revision": 1,
     "perform": {
       "request_type": "org.example.wholesale@0.1.0.PaymentReceived",
       "endpoint": "https://supplier.example.com/apap/agreements/agr_7f3c/trigger",
       "continue_url": "https://supplier.example.com/invoices/inv_99"
     }
   }
   ```

2. **Proposal to UCP:** a UCP Enhancement Proposal for **Order Actions**, i.e.
   adopting the Actions shape on Order for post-purchase work the platform must
   process (pay an invoice, confirm receipt, approve a substitution, start a
   return). Accord obligations are the motivating case, but the proposal is
   generic. If it is accepted, (1) becomes `actions` entries on Order with the same
   `config`.

**Obligation type mapping** (bearer → UCP surface):

| `obligation@1.0.0` type | Bearer = business | Bearer = buyer |
|---|---|---|
| `PaymentObligation` | Credit or refund → `adjustments[]` (`credit` or `refund`, negative totals) | Pre-execution: `payment.terms[]` schedule. Post-execution: an `obligations[]` entry with `perform` (an Order Action under the proposal) |
| `PerformanceObligation` | Delivery → `fulfillment.expectations[]` (description generated from the clause; `fulfillable_on` / date from the data) | Checkout Action `org.accordproject.obligation.performance` |
| `NotificationObligation` | Order `messages[]` (`info`/`warning`); `presentation: disclosure` where the clause makes notice mandatory | Action (e.g. notice of rejection) |
| `RemediationObligation` | `adjustments[]` + a new fulfilment expectation (replace) | Action |
| `EvidenceObligation` | Fulfilment event evidence (tracking, proof of delivery) | Action (e.g. upload an inspection report) |

**Facts in, transitions out.** As in PR #528, logic never reads an obligation
registry. UCP events become typed requests (`DeliveryRecorded`, `PaymentReceived`,
`GoodsRejected`) with `$timestamp` taken from the event's `occurred_at`, not the
clock. The response's `ObligationIssued` and `ObligationTransition` events update
the registry, which the Order projection is rendered from. Replaying the Order's
append-only `fulfillment.events[]` reproduces the contract state. That property is
the reason to keep the UCP event log as the input of record.

### 3.4 Policies and links referencing Accord agreements

#### `links[]`

UCP describes `links[]` as "mandatory for legal compliance". Its `type` is an open
vocabulary, and platforms show unknown types by `title`.

- `terms_of_service` → the APAP rendition of the drafted agreement:
  `…/agreements/{id}/convert/html?rev=N`. A platform that knows nothing about Accord
  still shows the right, transaction-specific terms. This is the zero-cost win.
- `org.accordproject.agreement` (custom type, with a `title`) → the machine-readable
  agreement (`GET /agreements/{id}` from APAP: Concerto JSON with `$class`).
- The extension adds an optional `sha256` beside `url` on links it emits. That gives
  the LCP L2 "provable" guarantee: the bytes served must hash to it. Platforms that
  ignore unknown fields are unaffected.

#### `policies[]`

UCP policies are typed (reverse-DNS, open vocabulary), targeted with `applies_to`
(RFC 9535 JSONPath), resolved by longest-prefix precedence, snapshotted onto the
Order, and allow type-specific fields. That structure maps naturally onto clauses:

- **Keep the well-known type** where one fits (`dev.ucp.shopping.policy.return`,
  `…warranty`, `dev.ucp.lodging.policy.cancellation`), so every platform can present
  it. **Add an Accord annotation** that pins the policy to the clause it was rendered
  from:

  ```json
  {
    "type": "dev.ucp.shopping.policy.return",
    "description": { "plain": "Buyer may reject non-conforming goods within 5 business days of delivery." },
    "applies_to": ["$.line_items[?@.item.id=='sku_espresso_5kg']"],
    "url": "https://supplier.example.com/apap/agreements/agr_7f3c/convert/html?rev=4#inspection",
    "org.accordproject.clause": {
      "agreement_id": "agr_7f3c",
      "document_id": "supply",
      "clause_path": "inspection",
      "clause_hash": { "algorithm": "sha256", "value": "…" }
    }
  }
  ```

  `org.accordproject.clause` is a projection of `agreement@1.0.0.AgreementReference`,
  which already has exactly these fields: `agreementId`, `documentId`, `clausePath`,
  `clauseHash`, `template`.
- **Custom policy types** for clauses with no UCP counterpart:
  - `org.accordproject.policy.late_delivery`, which would carry type-specific fields
    `{ credit_rate_bps, cap_bps, grace_days }`;
  - `org.accordproject.policy.late_payment`;
  - `org.accordproject.policy.payment_terms`, a clause-backed view of the selected
    `payment.terms[]` entry.

  Platforms that don't model them still present `description`. Agents that do can
  reason over the numbers.
- **Mandatory disclosure.** Where the template marks a clause as requiring
  disclosure (e.g. late-payment interest), the business emits the
  `messages[]` warning UCP requires: `presentation: "disclosure"`, `code` set to the
  policy `type`, `path` set to the node. The `content` is rendered from the same
  clause, so UCP's rule that "a disclosure's content MUST agree with the policy it
  pairs with" holds by construction.
- **Generation, not authoring.** `policies[]` is *derived* from the drafted
  agreement. Each `{{#clause …}}` block with a `ucpPolicy` mapping in the template's
  package metadata yields one policy, and the clause's binding to line items yields
  `applies_to`. UCP precedence rules (one governing policy per type per node, no
  merging) mean the template must not emit two clauses of the same policy type with
  equal-depth targets. The generator checks this and fails the draft rather than
  emitting an undefined resolution.
- On the Order, policies are snapshotted. The extension requires the annotation to
  name the **executed** revision's hashes, so post-purchase disputes can cite the
  exact clause.

### 3.5 Acceptance and evidence

Ranked by strength:

1. **AP2 negotiated.** The business's `ap2.merchant_authorization` is a detached JWS
   over the JCS-canonical checkout, which includes
   `org.accordproject.agreement.agreement_hash`. The buyer's `ap2.checkout_mandate`
   embeds the full signed checkout. Record `acceptanceStatus: VERIFIED` with the
   mandate as `acceptanceProof`.
2. **The `org.accordproject.agreement.sign` Action.** A detached JWS over the
   agreement hash by an agent key, with `authorityRef` pointing at a delegation (the
   LCP `BuyerPolicy.signingThreshold` idea).
3. **Neither.** `complete_checkout` with `acknowledged_hash` → `DECLARED`, the same
   honest status the x402 demo uses.

Hash discipline should be stated explicitly, as the x402 README does:

- AP2 uses JCS + ES256 signatures;
- LCP-style rendition hashes are SHA-256 over raw bytes;
- the AOEP profile uses JCS + Keccak-256.

The extension carries a `ContentHash`-style `{algorithm, canonicalization}` on every
hash and never substitutes one discipline for another.

### 3.6 Status mapping

| UCP checkout status | Agreement status | Notes |
|---|---|---|
| `incomplete` | `draft` | Re-drafted on every update; `requires_buyer_input` for missing variables |
| `requires_escalation` | `draft` / `proposed` | `continue_url` → human review of terms (e.g. above a buyer-policy threshold) |
| `ready_for_complete` | `proposed` or `accepted` | No outstanding `org.accordproject.*` Actions |
| `complete_in_progress` | `accepted` | |
| `completed` (+ `order`) | `executed` | `init` runs; obligations issued |
| `canceled` | `void` | Pre-execution only; the agreement never existed |

---

## 4. Template design (1.0.0 models + template-engine logic API)

The templates follow PR #528 exactly:

- **No `@template` decorator.** The root is the one concrete `TemplateData`
  subtype.
- **Grammar roots at the data.**
- **Inline clauses are nested concepts.**
- **Composed clauses are separate templates** in the agreement's `clauses` map.
- **`PartyRef`, not relationships.**
- **State mirrors data.** One `StateData` subtype.
- **Obligations are issued and transitioned by events.** State holds only facts.
- **`PreciseAmount` with BigInt arithmetic.**
- **Timestamps come from requests and data, never the clock.**
- **`defineLogic` with factories.** No dispatch switch, no hand-written `$class`.

### 4.1 One agreement, three or four templates

| Template | Kind | Role |
|---|---|---|
| `wholesale-supply-agreement` | stateful document | Main terms. Inline clauses: `paymentTerms`, `delivery`, `inspection`. Issues the delivery and payment obligations |
| `late-payment` (reuse `late-payment-poc`'s API) | stateful composed clause at `"latePayment"` | Reminders and interest once payment is `DUE` and overdue |
| `late-delivery-credit` | stateful composed clause at `"lateDelivery"` | Computes the capped per-day credit; issues a `RemediationObligation` on the seller |
| `order-schedule` | stateless document | Schedule 1, rendered from the UCP `line_items` (read by the main document, like `licensed-work-schedule-poc`) |

### 4.2 Model sketch (`wholesale-supply-agreement/model/model.cto`)

```cto
concerto version "^5.0.0"

namespace org.accordproject.wholesalesupply@0.1.0

import org.accordproject.templatedata@1.0.0.{TemplateData, StateData}
import org.accordproject.party@1.0.0.PartyRef
import org.accordproject.money@1.0.0.PreciseAmount
import org.accordproject.runtime@1.0.0.{Request, Response}
import org.accordproject.obligation@1.0.0.{PaymentObligation, PerformanceObligation, ObligationIssued, ObligationTransition}

enum PaymentTermKind { o PAY_NOW o NET o DEPOSIT_BALANCE }

/* Inline clause: mirrors the selected UCP payment.terms[] entry */
concept PaymentTerms {
  o String ucpTermId                 // payment.selected_term_id
  o PaymentTermKind kind
  o Integer netDays optional range=[0,]
  o Integer depositBps optional range=[0,10000]
  o PreciseAmount total              // checkout total: unscaledValue = minor units
}

concept Delivery {
  o DateTime deliverBy
  o String incoterm default="DAP"
}

concept Inspection {
  o Integer windowBusinessDays range=[0,]
}

/* The template model: the renderable root, carrying variables directly */
concept WholesaleSupplyData extends TemplateData {
  o DateTime effectiveDate
  o PartyRef supplier
  o PartyRef buyer
  o String purchaseOrder optional    // requires_buyer_input if the buyer's tier mandates one
  o PaymentTerms paymentTerms
  o Delivery delivery
  o Inspection inspection
}

/* Facts only: logic derives obligation status from these */
concept PaymentTermsState {
  o String obligationId
  o PreciseAmount amountPaid
  o DateTime dueAt optional          // set when delivery is recorded (NET) or at execution (PAY_NOW)
}
concept DeliveryState {
  o String obligationId
  o DateTime deliveredAt optional
}
concept WholesaleSupplyState extends StateData {
  o PaymentTermsState paymentTerms
  o DeliveryState delivery
}

/* Requests are facts mapped from UCP Order events */
transaction DeliveryRecorded extends Request {
  o String ucpEventId                // fulfillment.events[].id: the idempotency key
}
transaction DeliveryReceipt extends Response {
  o PreciseAmount credit optional    // becomes an Order adjustments[] entry
}
transaction PaymentReceived extends Request {
  o PreciseAmount amount
  o String paymentReference
}
transaction PaymentReceipt extends Response {
  o PreciseAmount outstanding
}
transaction PaymentRequest extends Request {}
transaction PayOut extends Response { o PreciseAmount amount }
transaction GoodsRejected extends Request {
  o String[] lineItemIds
  o String reason
}
transaction RejectionReceipt extends Response {}
```

`late-delivery-credit/model/model.cto` is the analogue of `late-payment-poc`: its
data is `LateDeliveryCreditData extends TemplateData { creditBps, capBps, graceDays }`,
its state is `{ creditIssued }`, and it handles `DeliveryLate { daysLate }` →
`CreditComputed { credit }`, emitting `ObligationIssued` for a seller-borne
`RemediationObligation` (or a `PaymentObligation` with bearer = supplier).

### 4.3 Logic sketch (`logic/logic.ts`)

```ts
export type Supply = Self<IWholesaleSupplyData, IWholesaleSupplyState, {
    latePayment?: Clause<LatePayment>;
    lateDelivery?: Clause<LateDeliveryCredit>;
}>;

export default defineLogic<Supply>()
    .init(supply => {
        const { data } = supply;
        const base = `${supply.document.agreement.id}/${supply.document.id}`;
        supply.setState(WholesaleSupplyState.create({
            paymentTerms: PaymentTermsState.create({ obligationId: `${base}/paymentTerms`, amountPaid: precise(0n, data.paymentTerms.total.unit),
                dueAt: data.paymentTerms.kind === PaymentTermKind.PAY_NOW ? data.effectiveDate : undefined }),
            delivery: DeliveryState.create({ obligationId: `${base}/delivery` }),
        }));
        supply.emit(ObligationIssued.create({ $timestamp: data.effectiveDate, obligation: PerformanceObligation.create({
            obligationId: `${base}/delivery`, status: ObligationStatus.DUE, createdAt: data.effectiveDate, dueAt: data.delivery.deliverBy,
            bearers: [data.supplier], beneficiaries: [data.buyer], agreement: supply.reference('delivery'),
            performance: `Deliver the goods in Schedule 1 by ${data.delivery.deliverBy}`, revision: 0 }) }));
        supply.emit(ObligationIssued.create({ $timestamp: data.effectiveDate, obligation: PaymentObligation.create({
            obligationId: `${base}/paymentTerms`, status: /* PENDING, or DUE for PAY_NOW */ …, createdAt: data.effectiveDate,
            bearers: [data.buyer], beneficiaries: [data.supplier], agreement: supply.reference('paymentTerms'),
            amount: data.paymentTerms.total, revision: 0 }) }));
    })
    .on(DeliveryRecorded, async (request, supply): Promise<IDeliveryReceipt> => {
        // Idempotent on ucpEventId: UCP webhooks are full snapshots and may be redelivered.
        // 1. delivery obligation DUE → FULFILLED (ObligationTransition, revision+1)
        // 2. if late: await supply.clauses.lateDelivery?.trigger(DeliveryLate.create({ $timestamp, daysLate }))
        // 3. for NET terms: dueAt = deliveredAt + netDays; payment obligation PENDING → DUE
        // 4. return DeliveryReceipt { credit }   → business writes adjustments[] { type: "credit" }
    })
    .on(PaymentReceived, async (request, supply): Promise<IPaymentReceipt> => {
        // As copyright-license-agreement-poc: same-unit check, BigInt sum, no overpayment,
        // FULFILLED → await supply.clauses.latePayment?.trigger(PaymentSettled.create(...))
    })
    .on(PaymentRequest, async (request, supply): Promise<IPayOut> => {
        // Overdue → delegate to latePayment (PaymentOverdue), as in PR #528
    })
    .on(GoodsRejected, async (request, supply): Promise<IRejectionReceipt> => {
        // Only inside the inspection window measured from deliveredAt (business days from data).
        // Emits a RemediationObligation on the supplier → adjustments[] refund + return expectation.
    });
```

### 4.4 Checkout → TemplateData mapping (the "drafting adapter")

This is a pure, tested function. It is the UCP counterpart of the x402 demo's
`obligationToPaymentRequired`, run in the opposite direction.

| UCP checkout field | Template variable |
|---|---|
| business profile / legal entity | `supplier: PartyRef { id, scheme: "org.accordproject.party@1.0.0.Party", label }` |
| identity-linked account, or `buyer` | `buyer: PartyRef` (`scheme` = the identity provider's reverse-domain key) |
| `line_items[]` | `order-schedule` document data (one row per line item; `PreciseAmount` per line) |
| `totals[type=total]` + `currency` | `paymentTerms.total = { unscaledValue: String(amount), unit: { code: currency, scheme: "iso4217", scale: exponent(currency) } }` |
| `payment.selected_term_id` + `payment.terms[]` | `paymentTerms.{ucpTermId, kind, netDays, depositBps}` |
| `fulfillment` selected option | `delivery.deliverBy` |
| `org.accordproject.agreement.inputs.purchase_order` (extension request field) | `purchaseOrder` |

The reverse direction (agreement → UCP) is also pure and tested:

- `payment.terms[]` comes from the template's offered terms;
- `policies[]` and disclosures come from clauses;
- `links[]` come from renditions;
- `actions` come from outstanding pre-execution obligations;
- Order `obligations[]` and `adjustments[]` come from contract events.

---

## 5. Demo plan

Working name: **`accord-ucp-contract-server`**, a standalone reference business and
a scripted platform agent. It mirrors the x402 repo's layout and test discipline.

### 5.1 Architecture

```
 Platform agent (CLI / MCP client)                 Business: accord-ucp-contract-server
 ─────────────────────────────────                 ──────────────────────────────────────────
 GET /.well-known/ucp  ───────────────────────────▶ profile: checkout, order, payment.terms,
                                                    [ap2_mandate], org.accordproject.agreement
 negotiate (intersection)
 POST /checkout-sessions ─────────────────────────▶ drafting adapter → ContractRuntime.draft()
   ◀── checkout + org.accordproject.agreement,       (template-engine AgreementProcessor, or APAP)
       policies[], links[], actions{review,sign}
 GET rendition; verify sha256; policy check
 PUT /checkout-sessions/{id} (term, PO, ack hash) ▶ re-draft, re-hash, actions cleared
 POST …/complete (+ AP2 mandate | sign JWS) ──────▶ acceptance recorded → initialise() → Order
   ◀── order webhook (signed, full snapshot) ◀────── obligations[], expectations[]
                                                    admin: POST /simulate/fulfillment-events
   ◀── order webhook: delivered, credit adjustment ◀ DeliveryRecorded → contract → adjustments[]
 perform payment obligation ──────────────────────▶ POST /apap/agreements/{id}/trigger PaymentReceived
   ◀── order webhook: obligation FULFILLED
```

`ContractRuntime` has two implementations, as in the x402 demo:

- **`local`:** template-engine's `AgreementProcessor` (`initialise` / `execute`) with
  an in-memory store, using a conditional write on the revision and an events outbox.
- **`apap`:** the APAP RI in this repo:
  - `POST /agreements` to create the agreement;
  - `/agreements/{id}/convert/{format}` for renditions;
  - `/agreements/{id}/trigger` to run requests.

  This exercises the RI's retriever pattern for templates.

### 5.2 Phases

**Phase 0: decisions (this doc).**
- Lock the use case.
- Pin the UCP release (`2026-08-25`).
- Answer the open questions in §7.

**Phase 1: models and schemas.**
- Write `org.accordproject.protocol.ucp@0.1.0.cto`, covering:
  - a Concerto mirror of the UCP checkout, order, link, policy, action and message
    subset we touch (wire-faithful, like `x402@0.2.0.cto`);
  - the `org.accordproject.agreement` extension types.
- Generate the extension's JSON Schema with `$defs` per parent.
- Conformance test:
  1. compose the extension with the official UCP schemas (vendored from the release
     branch) using ajv;
  2. validate every emitted checkout and order fixture against the composed schema;
  3. validate it again against the Concerto model.

**Phase 2: templates.**
- Write `wholesale-supply-agreement`, `late-delivery-credit` and `order-schedule`,
  plus a copy or vendoring of `late-payment-poc`'s model, on the PR #528 toolchain
  (cicero-core / template-engine branches, `template-engine-codegen --offline`).
- Tests:
  - vitest unit tests with `testInstance` / `stubClause`;
  - an agreement test with `AgreementProcessor` over all four templates;
  - `types.check.ts` compile-time checks.
- Consider upstreaming them to cicero-template-library as `*-poc` templates.

**Phase 3: business server.**
- Serve `/.well-known/ucp` (correct `Cache-Control`).
- Implement the REST checkout operations:
  - `create`, `get`, `update`, `complete`, `cancel`, with `Idempotency-Key` and
    `UCP-Agent` handling;
  - the drafting adapter;
  - policy and link generation;
  - the Action gate logic;
  - `get_order`.
- Send order webhooks:
  - Standard Webhooks headers;
  - RFC 9421 signatures with a demo key in `keys[]`.
- Add the simulation endpoints for fulfilment events and the scheduled `PaymentRequest`.
- Add an MCP binding (`create_checkout` … `get_order` tools) after REST, reusing the
  same handlers.

**Phase 4: platform agent and e2e.**
- A CLI agent that runs the full flow and asserts on each step:
  1. discover;
  2. negotiate;
  3. create;
  4. verify the rendition hash;
  5. buyer-policy check (escalate above a threshold → `continue_url`);
  6. choose Net-30;
  7. supply the PO;
  8. sign;
  9. complete;
  10. receive the webhook;
  11. simulate a late delivery;
  12. check the credit adjustment;
  13. pay;
  14. check `FULFILLED`.
- `npm run test:e2e` drives it against a fresh server.
- `npm run test:e2e:apap` runs the same against `docker compose up` of this repo's RI.

**Phase 5 (optional).**
- AP2 acceptance path: a stub trusted-platform-provider mandate, so acceptance is
  `VERIFIED`.
- The lodging group-block template on `dev.ucp.lodging.booking`.
- Draft the UCP Enhancement Proposal for Order Actions, with the demo as the
  motivating implementation.

### 5.3 Changes likely needed in this repo (APAP RI)

These are small and can be split out as separate PRs:

- A `convert/markdown` rendition, and a stable byte output so a SHA-256 can be
  published.
- `trigger` must return emitted events (`ObligationIssued` / `ObligationTransition`)
  so the business can project them onto the Order.
- Agreement revisions (re-drafting during checkout), or create-on-complete with
  drafts kept outside APAP.
- Template support for the 1.0.0 models and the `defineLogic` runtime, tracking
  template-engine#187 / template-archive#946 / #950.

---

## 6. Why this is a better demo than "x402 with UCP swapped in"

- It shows **dynamic drafting**. The agreement text and hash change as the agent
  edits the cart and payment term. A static ToS link can't do that.
- It shows **post-execution automation** on the protocol's own event log: delivery
  events in, credits and payment status out, through UCP's Order webhook.
- It uses **UCP's own extension mechanics** (negotiation, `allOf` schemas, Actions,
  policies, disclosures, links) rather than tunnelling Accord through an opaque
  field.
- It turns the x402 demo's acknowledged gap (`DECLARED` acceptance) into a path to
  `VERIFIED` through AP2.

---

## 7. Open questions

- **Q1. Use case.** Is B2B wholesale on trade terms the right lead, with lodging
  group blocks second, or should the lead be lodging (fewer moving parts, an
  existing vertical, cancellation already structured)?
- **Q2. Order Actions.** Do we ship only the extension-local `obligations[]` with
  `perform`, or also draft a UCP Enhancement Proposal for Actions on Order? The
  proposal is the cleaner long-term answer, but it is a governance dependency.
- **Q3. Field key.** Should the extension field be `"org.accordproject.agreement"`
  (collision-proof) or a bare `agreement`? UCP core extensions use bare names
  (`discounts`, `consent`); vendor guidance is less explicit.
- **Q4. Hosting.** Can schemas be hosted on `accordproject.org` (giving names
  `org.accordproject.*`), or only on `models.accordproject.org` (giving
  `org.accordproject.models.*`)?
- **Q5. Legal effect.** Is an AP2 checkout mandate over a checkout containing the
  agreement hash enough to record acceptance as `VERIFIED`, or does it stay a
  payment authorization that only *evidences* assent? Should the `sign` Action be
  mandatory regardless?
- **Q6. Toolchain.** PR #528 runs on unreleased branches (concerto 5, template-engine
  #187, template-archive #946/#950). Do we pin those git refs in the demo, or wait
  for releases?
- **Q7. Where drafts live.** Should every checkout revision be an APAP agreement (a
  revision history the RI doesn't have yet), or should drafts be ephemeral in the
  business, with an APAP agreement created only at `complete_checkout`?
- **Q8. Recurring.** UCP excludes renewals. A standing supply agreement (a master
  agreement with per-order call-offs) would naturally span checkouts. Model each
  checkout as a schedule under a master `Agreement` (`agreement@1.0.0` supports
  several documents), or keep one agreement per order for the demo?
