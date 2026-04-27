# Business Rules — Governance Studio

## Domain Overview

Governance Studio solves the problem of **organisational knowledge decay and inconsistency**. Enterprises accumulate truth in contracts, policies, and agreements scattered across document repositories. Without a governed pipeline, different teams operate on conflicting versions of the same facts — leading to bad deals, compliance failures, and disputed contracts.

The platform enforces a one-directional, audited pipeline:

```
Source Documents → Claims (AI-extracted) → Sandbox Validation → Truth Plane (verified facts) → Knowledge (distributed Truth Packs)
```

Every step requires human attestation, and the system tracks who created, promoted, resolved, and approved each piece of knowledge.

---

## Core Entities

### Drive
A named document repository owned by a department. Drives are the top of the ingestion funnel. Documents in a drive can be ingested into a Sandbox. A drive has a `status` of `'active'` (ingestion enabled) or `'none'` (not yet connected to ingestion).

**Key business meaning:** Drives define the boundary of what raw material is eligible for governance processing. Not all drives are active — `HR Drive` in mock data has `status: 'none'` and zero sandboxes.

### Sandbox
A governed workspace for validating and structuring claims extracted from one or more source documents. Sandboxes are temporary working spaces — they do not contain verified truth. A sandbox belongs to a team (`owner`) and has a visibility level (`scope`).

**Key business meaning:** Sandboxes are where AI outputs meet human judgment. Claims can be promoted, flagged for conflict, or bundled for collective promotion.

### Claim
An AI-extracted or manually authored assertion drawn from a source document. A claim is the atomic unit of information that moves through the governance pipeline. Claims have a lifecycle state (`promotable`, `promoted`, `conflict`, `review`) and carry evidence traceability (source document, section, subsection).

**Key business meaning:** Claims are raw intelligence — not yet trusted. They must be validated, deduplicated (bundled), and promoted before becoming Truth.

### Bundle
A named collection of related claims grouped for collective promotion. Bundles allow governance teams to package thematically related claims (e.g. all payment terms) and promote them together as a unit.

**Key business meaning:** Bundles are the unit of quality review before promotion. A bundle can be `promotable`, `promoted`, or `not-promotable` based on its conflict rate.

### Promotion Package
A named set of claims (or a bundle) submitted for promotion to the Truth Plane. Packages carry metadata about the target Truth Plane, the submitter, and outcome statistics (`factsCreated`, `factsChanged`, `failed`).

**Key business meaning:** A promotion is a formal governance action. It creates or modifies facts in the Truth Plane.

### Truth Plane
A governed repository of verified facts within a specific domain (e.g. Pricing Policy, GDPR Compliance). Truth Planes have attestation requirements, expiry tracking, and proposal workflows. Multiple planes can exist per workspace.

**Key business meaning:** The Truth Plane is the organisational source of truth. Facts here have been through the full governance pipeline and carry the weight of official policy.

### Truth Fact
A verified, version-controlled organisational fact. Facts carry a confidence score, risk level, polarity, expiry date, governance trail (four roles), and evidence (linked claims). Facts can be human-approved or auto-verified by the AI engine.

**Key business meaning:** A Fact is the final output of governance. It is what agents, playbooks, and users consume as authoritative truth.

### Claim Suggestion
A proposed edit to an existing claim submitted by a collaborator. Suggestions are not automatically applied — they are reviewed via the `ViewSuggestionModal` and either accepted or declined with an optional reason.

**Key business meaning:** Suggestions enable collaborative refinement without allowing unilateral changes to claims under review.

### Fact Proposal
A formal request to change an existing fact (or create a new one) in the Truth Plane. Proposals carry structured change definitions (`changes[]`), evidence, urgency, scope impact, and a multi-approver workflow.

**Key business meaning:** Proposals are the primary mechanism for keeping verified facts up to date. They create an auditable record of why and when facts changed.

### Break Glass Record
An emergency override that temporarily suspends a verified fact's constraints. Break Glass is a two-step gated action: the requester must acknowledge consequences before proceeding.

**Key business meaning:** Break Glass exists for critical operational emergencies (e.g. an ERP migration blocking billing). It is always temporary, always logged, and triggers an automatic post-incident review.

### Truth Pack
A curated, named bundle of verified facts distributed to a defined audience: human users, AI agents, or agentic networks. Packs are linked to a source Truth Plane and have an access type (`users`, `agents`, `agentic-networks`, `mixed`).

**Key business meaning:** Truth Packs are the consumption layer. An AI agent checking deal terms against policy consumes a Truth Pack, not the raw Truth Plane.

### Playbook
A governance-aware workflow definition that executes a sequence of phases and gates, triggered by a business moment (e.g. `'Customer Created'`, `'90 Days to Renewal'`). Playbooks have a trust mode (`Auto`, `Approval`, `Draft`) that controls whether AI actions require human sign-off.

---

## Business Rules by Domain

### Source Drives

- A drive with `status: 'none'` cannot be used as a sandbox source. The `sandbox` count is `0`.
- Drives have a `scope` of either `'Company-wide'` or `'Private'`. Company-wide drives are visible across the workspace.
- Documents within a drive can have an `auto` flag indicating automatic ingestion eligibility.
- Documents carry a processing `status`: `'sandbox'` (added to sandbox), `'reading'` (being read by AI), `'dian'` (in the DIAN processing pipeline).
- The `Add Drive` modal requires a name, connection type, and scope before enabling submission.

### Sandbox Plane

- A sandbox has a `scope` of `'Workspace'`, `'Department'`, or `'Managed'`. Each scope is color-coded: Workspace = blue (`#60a5fa`), Department = purple (`#a78bfa`), Managed = green (`#4ade80`).
- The `Create Sandbox` modal requires: Sandbox Name (required), Scope (required), Owner (required, dependent on Scope selection). Description is optional.
- Claims in a sandbox follow a strict lifecycle state machine:

```
[extracted] → promotable → promoted
              ↓
           conflict → (resolved) → promotable
              ↓
            review → (validated) → promotable
```

- A claim with `hasSuggestion: true` AND `status !== 'conflict'` shows a blue "View Suggestion" button.
- A claim with `status === 'conflict'` shows an amber "View Suggestion" button (overrides the standard hasSuggestion blue variant).
- The ThreeDot menu on claim cards contains exactly three items: `Edit Claim`, `Suggest Change`, `Quick Promote`.
- The ThreeDot menu on source document cards contains exactly three items: `View Details`, `Re-process`, `Remove from Sandbox` (danger).
- The Promotion Builder has four steps: `Promotion` (select claims), `Target & Details` (set name and target plane), `Claim Review` (review selected claims), `Summary`. Steps are navigable by clicking the step indicator if steps are clickable.

### Claims — Suggest a Change

- All fields in the `SuggestChangeModal` are optional. A suggestion can be submitted with zero fields filled.
- A suggestion can be routed to: `All` (all members with access), a specific `Person`, or a `Department`. The routing scope defaults to `All`.
- Suggestions are not auto-applied. They persist as pending until a reviewer opens `ViewSuggestionModal` and accepts or declines.
- On decline, the reviewer may optionally provide a reason. Providing a reason is not required.

### Truth Plane

- A Truth Plane has one of four statuses: `verified`, `pending-review`, `expiring-soon`, `in-proposal`. Status is color-coded: verified = green, pending-review = blue, expiring-soon = amber, in-proposal = purple.
- Attestation requires four roles to be filled: `createdBy`, `promotedBy`, `resolvedBy`, `approvedBy`. If any role is unfilled, the plane has an attestation gap (`missing-approver`, `missing-promoter`, or `missing-resolver`).
- A plane with `attestation !== 'full'` cannot be considered fully attested and triggers an attention item in the slide-out.
- The `Create Truth Plane` modal requires: Plane Name, Domain/Category, Risk Level, Scope, and Owner (dependent on Scope). Description is optional.
- The Owner dropdown is disabled until a Scope is selected. Owner options depend on Scope:
  - `Workspace`: Alex Rivera, Jordan Lee, Sam Torres
  - `Department`: Sales, Engineering, Legal, Finance, HR
  - `Company-wide`: Legal, Finance, Executive

### Truth Facts

- A fact has one of three statuses: `verified`, `pending`, `conflict`.
- Facts with `autoVerified: true` were approved by the `Auto · AI Engine` — they bypass human approval but are still logged in the governance trail.
- A fact can have a `breakGlassRecords` entry (keyed by `factId`). Active Break Glass records mark the fact as temporarily overridden.
- The Break Glass modal is a two-step gate:
  1. Warning screen — requester must check an acknowledgement checkbox before proceeding.
  2. Override details screen — requester fills in reason, business impact, temporary change description, and duration (24h, 48h, 7d, 14d, or custom date).
- Break Glass consequences enforced at the UI level:
  - Action is permanently logged in the audit trail.
  - All Truth Plane administrators are notified.
  - A post-incident review is triggered after expiry.
  - The fact is flagged as "Break Glass Active" during the override period.

### Fact Proposals

- A proposal has one of four statuses: `under-review`, `pending`, `draft`.
- A proposal with `origin: 'sandbox-promotion'` originated from a Sandbox promotion package and carries `originMeta` (sandbox name, package ID, sandbox ID) and `sourceBundle` details.
- A proposal with `origin: 'manual'` was submitted via the Propose Change modal.
- A proposal with `scenario: 'new-fact'` creates a new Truth Fact (the `factId` field is `null`).
- A proposal with `scenario: 'modify-fact'` modifies an existing Truth Fact.
- Proposals carry a `changes[]` array describing each field being modified (title, factText, confidence, risk, validTo, source).
- Proposals can have multiple approvers, each with an independent `status` of `'approved'` or `'pending'`.
- Proposals can have evidence entries with a `type` of `'report'`, `'legal'`, or `'claim'` and a `confidence` score.

### Review Queue

- A fact enters the review queue for one of four reasons: `'expiring-soon'`, `'evidence-changed'`, `'new-conflict'`, `'manual-review'`.
- Review queue items track `required_approvals` and `current_approvals`. An item with `current_approvals < required_approvals` is not approved.
- A review queue item can be `escalated: true`, which adds `escalated_to_details` (an array of people with roles), `escalation_reason`, and `escalation_priority`.
- Items in escalated state cannot be approved without the escalated reviewers' input.

### Knowledge — Truth Packs

- A Truth Pack has a status of `'active'`, `'draft'`, or `'archived'`.
- Access type determines the primary consumer: `users` (human), `agents` (single AI agents), `agentic-networks` (networks of agents), `mixed` (combination).
- A pack is `isStale: true` if it has not been updated within the expected review window.
- A pack links to exactly one Truth Plane via `linkedTruthPlaneId`.
- Packs carry a `factIds[]` array — the specific `TF-XXXX` IDs included in the pack.

### Playbooks

- A Playbook has a `trustMode` of `'Auto'` (AI acts without approval), `'Approval'` (AI actions require human sign-off), or `'Draft'` (not yet deployed).
- A Playbook is triggered by a named `moment` (e.g. `'Customer Created'`, `'90 Days to Renewal'`, `'Low Engagement Detected'`, `'Usage Threshold Met'`).
- A Playbook has a `status` of `'Published'` or `'Draft'`.
- The Playbook Builder includes a tenant/rooftop targeting step that scopes the playbook to specific customer organisations (AutoNation Group, Hendrick Automotive Group, Sonic Automotive, Penske Automotive, Lithia Motors) and their individual rooftops.

---

## Permissions and Roles

No authentication system is implemented in the prototype. The current user is hardcoded as:
- **Name:** John Doe (referenced in `CreateClaimModal` auto-fields and `BreakGlassModal`)
- **Avatar:** Amber-red gradient, initials `A`
- **Organisation:** Acme Corporation
- **Location:** New York, NY

The system implies the following role model based on governance trail fields and proposal approver structures:

| Role | Responsibility |
|---|---|
| **Creator** | Initiates a claim or fact. First step in the governance trail. |
| **Promoter** | Promotes a validated claim or bundle to the Truth Plane. |
| **Resolver** | Resolves conflicts in claims or facts before promotion can proceed. |
| **Truth Approver** | Gives final approval to a fact proposal or review queue item. |
| **Legal Sign-off** | Domain-specific approver for legal facts and proposals. |
| **Finance Sign-off** | Domain-specific approver for financial facts and proposals. |
| **Platform Admin** | Administrative access to workspace settings and governance controls. |

The sidebar navigation shows `Control Center`, `My Work`, `Builder`, `Deploy`, and `Admin` items as `disabled: true` — indicating those role-gated surfaces are planned but not implemented.

---

## Workflow Logic

### Claim Lifecycle State Machine

```
         ┌────────────────────────────────────┐
         │           CLAIM EXTRACTED           │
         └──────────────┬─────────────────────┘
                        │
              ┌─────────▼──────────┐
              │     PROMOTABLE      │  ← AI confidence high, no conflict
              └─────────┬──────────┘
           ┌────────────┼────────────────┐
           │            │                │
     ┌─────▼──┐   ┌─────▼────┐   ┌──────▼────┐
     │CONFLICT│   │  REVIEW   │   │ PROMOTED  │
     └────────┘   └──────────┘   └───────────┘
     (hasSuggestion  (human
      = amber btn)    review
                      needed)
```

### Truth Fact Proposal Flow

```
Reviewer clicks "Propose Change"
  │
  ▼
ProposeChangeModal — fills in proposed text, reason,
  evidence, scope impact, urgency, effective date,
  adds approvers
  │
  ▼
Proposal created (status: 'draft' or 'pending')
  │
  ▼
Approvers review — can request evidence (RequestEvidenceModal)
                 — can escalate (EscalateModal)
  │
  ▼
ApproveConfirmModal shows a diff of current vs proposed values
  │
  ▼ (all approvers approved)
Fact is updated in Truth Plane
```

### Break Glass Flow

```
Reviewer clicks "Break Glass" on a fact
  │
  ▼
Step 1 — Warning Gate (acknowledgement checkbox required)
  │ (acknowledged)
  ▼
Step 2 — Override Form (reason, business impact,
          temporary change, duration)
  │ (submitted)
  ▼
Fact flagged as "Break Glass Active"
All admins notified
Permanent audit log entry created
Post-incident review scheduled for expiry date
```

### Promotion Builder Flow (4 Steps)

```
Step 1 — Promotion: Select claims from sandbox
  │
  ▼
Step 2 — Target & Details: Name the package, pick target Truth Plane
  │
  ▼
Step 3 — Claim Review: Review all selected claims before commit
  │
  ▼
Step 4 — Summary: Confirmation with outcome metrics
```

### Review Queue Escalation Flow

```
Reviewer opens review queue item
  │
  ▼ (cannot resolve alone)
EscalateModal — selects escalation reason (high-risk,
                 needs-domain-expert, requires-legal,
                 requires-compliance)
              — selects target people to escalate to
              — sets priority and optional message
  │
  ▼
Item status → 'escalated'
escalated_to_details[] populated
escalation_priority set
```

---

## Constraints and Invariants

1. A claim cannot be in both `promoted` and `conflict` status simultaneously.
2. A sandbox promotion package must have at least one selected claim (Step 1 of `PromotionBuilder` shows a zero-selection state and no next action is implied without selection).
3. A fact's governance trail must progress in order: Created → Promoted → (Resolved if conflict) → Approved. Roles cannot be completed out of order.
4. A Truth Plane with incomplete attestation (`attestation !== 'full'`) cannot be marked as fully governed. The attention item "Attestation incomplete" is always shown.
5. A Break Glass record has a mandatory `duration` — there is no indefinite override. Duration options are `24h`, `48h`, `7d`, `14d`, or a custom date.
6. A Claim Suggestion has no mandatory fields — any combination of fields is valid, including a completely empty submission.
7. A Playbook with `trustMode: 'Draft'` has `status: 'Draft'` and cannot be deployed.
8. A Truth Pack with `isStale: true` displays a stale indicator to consumers.
9. The Owner dropdown in Create Sandbox and Create Truth Plane modals is disabled (`disabled={!scope}`) until a Scope is selected — enforcing the dependency constraint.

---

## Error Handling Patterns

The prototype does not implement error boundaries, API error handling, or form validation error states in the traditional sense. The following patterns are used as proxies:

| Pattern | Implementation |
|---|---|
| Required field enforcement | `required` labels and disabled submit buttons on modals (`Create Sandbox`, `Create Truth Plane`) |
| Governance gap warning | `attestation !== 'full'` triggers amber `AlertTriangle` in slide-out with explanatory text |
| Conflict signaling | Claims with `status: 'conflict'` use red badge and amber "View Suggestion" button |
| Expired facts | Facts with `expired: true` show `expiry` label prominently with context that revalidation is needed |
| Review queue urgency | `priority: 'high'` items are sorted to the top and displayed with red accent |
| Empty filter results | Truth Plane list shows `"No planes match the active filters."` message when `filtered.length === 0` |
| Break Glass gate | Two-step confirmation with acknowledgement checkbox prevents accidental overrides |
| Evidence request | `RequestEvidenceModal` allows reviewers to formally block approval pending additional documentation |
