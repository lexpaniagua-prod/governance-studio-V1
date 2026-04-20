# Sandbox Plane — Design & Flow Specification

## Overview
The Sandbox Plane is where claims are validated, structured, and packaged for promotion. It is the operational core of Governance Studio. Every view must support a decision or action, not just display data.

**Hierarchy**: Intelligence Library → Sandbox Plane (list) → Sandbox Detail (5 tabs: Overview / Sources / Claims / Bundles / Promotions) → Promotion Builder (3-step full screen)

---

## Sandbox List

### Layout
- Full-width list + slide-out panel (same pattern as Source Drives)
- Header: icon + title + count + `+ New Sandbox` CTA (purple gradient)

### Filter bar
Search | Status dropdown | Needs Attention dropdown | Owner dropdown | All Filters

### Sandbox Row
- Grid icon (purple `#a78bfa`, bg `rgba(124,92,252,0.12)`)
- Name (bold 14px) + 3-dot menu
- Description (12px muted)
- Metadata: Owner | Scope badge (color per scope: Workspace=blue, Department=purple, Managed=green) | timestamp
- Right counters: Sources (gray) | Bundles (amber) | Claims (blue) | Promotions (green)

### Sandbox Slide-out
Tabs: Overview | Details

**Overview:**
1. AI Summary card (purple sparkles icon) — NL description of sandbox state
2. Validation & Readiness — Total Promotions metric (green, large)
3. Validation Signals — 3 colored rows: Pending Validations (amber) | Conflicts Detected (red) | Pending Promotions (blue) — each with numeric badge
4. Content Breakdown — 2×2 grid: Sources/Bundles/Claims/Promotions

**Details:** Sandbox Information key-value list

### Create Sandbox Modal
Fields: Sandbox Name* | Description | Scope* dropdown (Workspace/Department/Private) | Owner* (dependent on Scope)
Disabled submit until required fields filled.

### All Filters (Sandbox list)
| Section | Options |
|---------|---------|
| Claim Status | Active · In Review · Ready for Promotion · Completed |
| Attention Required | Claims Need Validation · Has Conflicts · Promotions Pending · Blocked |
| Usage | Used in Bundles · Used in Promotions · Not Used · High Usage (5+ uses) |
| Activity | Recently Updated · Recently Created · Stale (no activity in 7+ days) |

---

## Sandbox Detail Page
URL: `/sandbox/:id`

### Header
- Icon + name + Active badge + Workspace badge
- Description
- `Promotion Builder` CTA + `Settings` button

### Metrics row (5 cards)
1. Documents — neutral/white
2. Bundles — purple
3. Claims — blue
4. Promotions — amber/orange
5. Claims Promoted — green

### Tab Bar
Overview | Sources | Claims | Bundles | Promotions

---

### Overview Tab
Sub-tabs: Analytics & Insights | Validation Pipeline | Governance & Quality

**Analytics & Insights content:**
3 KPI cards:
1. **Truth Readiness Rate** (green) — %, progress bar, "N of N claims ready for promotion", trend "+5%"
2. **Conflict Rate** (red) — %, progress bar, "N of N claims have conflicts", trend "-1.2%"
3. **Validation Bottleneck** (amber) — "Slowest stage: Review", N.N days avg, recommendation box

**Weekly Validation Throughput chart:**
- 3 lines: Docs Ingested (blue) | Claims Created (purple) | Truth Promoted (green)
- X axis: Week 1-4, Y axis: 0-60 docs
- Dots on data points

---

### Claims Tab

#### Filter bar
Search | Documents dropdown | Bundles dropdown | All Filters | `+ Create Claim` CTA (purple)

#### Claim Row
- Purple sparkle icon
- Claim ID (monospace, muted, e.g. RC-0001)
- Title (bold 14px)
- Status badge: `Promotable` (purple) | `Promoted` (green) | `Conflict` (red) | `Review` (amber)
- **Contextual CTA** (primary action, right):
  - Promotable → `Promote` button (purple)
  - Promoted → no CTA (badge only)
  - Conflict → `View Suggestion` button (amber outline)
  - Review → `Review` button (amber outline)
- 3-dot menu: Edit Claim | Suggest Change | Quick Promote | Add to Bundle | Duplicate Claim
- Claim text (12px, italic, line-clamp 1)
- Metadata: Document | Section | Subsection | Timestamp
- Right signals: Confidence % | Risk chip | Polarity | Bundle count

#### Conflict row state
- Red left border
- Subtle red background tint

#### Claim Slide-out
Tabs: Overview | Bundles N | Details

**Overview:**
1. Context card (AI-generated context paragraph)
2. **CLAIM** highlighted card (purple bg, bold text) — the actual claim statement
3. Governance signals grid (3): Confidence / Risk / Polarity
4. Extracted Entities grid (6, 2-col): Organization · Date · Amount · Location · Person · Reference — each with distinct color

**Bundles tab:** List of bundles this claim belongs to, with status badges and stats

**Details tab:**
- Source Location tree: Document → Section → Subsection → CHK chunks
- Audit Trail: Extracted timestamp | Extracted By (AI Agent) | Last Activity

#### Create Claim Modal
Sections:
- **Basic Information**: Title* | Context* | Claim*
- **Source**: SegmentedControl (Document/Human) → document selector grid | + Upload Document
- **Metrics**: Confidence % | Risk Level | Polarity
- **Bundles**: Multi-select bundle pills
- **Details**: Created By* | Organization (Auto) | Location (Auto) | Amount (Optional) | Reference (Optional)

#### Suggest Change Modal
- Context panel (read-only): Source Document | Section | Subsection
- Current Claim Value (read-only, left col)
- Suggested Claim Value* (editable, right col)
- Rationale*
- Source to Validate*
- Assign Reviewer (optional dropdown)
- Submit / Cancel

#### Send for Review Modal
- Claim Information (read-only): Title | Statement | Claim Value | Confidence/Risk/Polarity | Bundle | Status
- Context panel: Source Document | Section | Subsection
- Review Type* | Assign To* | Review Instructions | Due Date | "Require approval before promotion" checkbox

#### View Suggestion Modal (diff view)
- Header: Rationale for Suggested Change (amber box) + Suggested By + Date + Reviewer
- Two-column diff: Current Information (blue) | Suggested Changes (purple)
- Fields per column: Title | Statement | Claim Value | Source Information | Metrics | Additional Details
- Footer: Decline (outline) | Approve (primary)

---

### Bundles Tab

#### Filter bar
Search | All Status | All Items | All Usage | All Filters | `+ New Bundle`

#### Bundle Row
- Amber cube icon
- Bundle ID + Name + Status badge
- Description
- Stats: Claims | Conflicts | Promoted | Timestamp
- CTA: `Promote` when status = Promotable

#### Bundle Slide-out
Tabs: Overview | Claims N

**Overview:**
1. AI Insights — bullet list
2. 3 KPI cards: Claims (purple) | Conflicts (red) | Promoted (green)
3. Bundle Summary card
4. Source Documents — expandible list with doc name, timestamp, claim count per doc

**Claims tab:** Compact claim list: ID | Title | Status badge | text | polarity icon | confidence | risk

#### All Filters (Bundles)
| Section | Options |
|---------|---------|
| Bundle Status | Promotable · Promoted · Not Promotable |
| Attention Required | Claims Need Validation · Has Conflicts · Promotions Pending · Blocked |
| Usage | High Usage (many claims) · Used in Promotions · Not Used |
| Performance | High Promotion Rate · Low Promotion Rate · High Conflict Rate |
| Activity | Recently Updated |

---

### Promotions Tab

#### Filter bar
Search | All Filters | `+ New Promotion` CTA → opens Promotion Builder

#### Promotion Package Row
- Purple sparkle icon
- PKG-XXX ID + Name
- Status badge: `Promoted` (green) | `In Progress` (blue) | `Queue` (amber)
- Description
- Owner avatar + timestamp
- Tags (colored pills)
- Right: Target Truth Plane | Claims count

#### Package Slide-out
Tabs: Overview | Claims N

**Overview:**
- Target Truth Plane card
- 4 KPI cards: Total Claims (purple) | Facts Created (green) | Facts Changed (blue) | Failed (red)
- Tags
- Audit Information: Created timestamp + Created By

**Claims tab:** List of claims in package — same row format as Claims tab

---

## Promotion Builder (3-step full-screen overlay)

### Header (sticky)
- Icon + "New Promotion Package" + Draft badge + "N claims selected" counter
- Step indicator: 1 Promotion → 2 Target & Details → 3 Review & Send (with checkmarks on completed)
- Actions: AI Builder | Wizard | Save Draft | Close (X)

---

### Step 1 — Promotion (Select Claims)
- Selection banner: "N Claims Selected — Manual selection" | Clear Selection
- Filter bar: Search | All Status | All Documents | All Bundles | Select All | All Filters
- Claim list (checkboxes): same row format as Claims tab
- Toast: "N claim(s) added to your promotion package" (bottom right, appears when selecting)

---

### Step 2 — Target & Details
Centered form, max-width 640px, two glass cards:

**Package Details card:**
- Package Name*
- Target Truth Plane* (dropdown)
- Description
- Tags (input + Add button)

**Configuration Mode card:**
- Toggle: Apply to all claims | Configure per claim
- Valid From / Valid To (date inputs, side by side)
- Review Period (days, number input, default 90)

---

### Step 3 — Review & Send
**Summary bar** (top): Total Claims | Ready / Issues | Target Truth Plane | Validity Window | Risk distribution (L/M/H chips)

**Two-panel layout** (50/50):

**Left panel — Selected Claims list:**
- Sub-tabs: All | Issues | Ready N
- Claim cards: Name | Status badge | Confidence chip | Risk chip
- Click to activate in right panel

**Right panel — Claim Detail:**
Sub-tabs: Details | Source Evidence

**Details sub-tab:**
- Context block
- CLAIM highlighted card (purple)
- Polarity / Risk / Claim Type / Review Period dropdowns
- Valid From / Valid To
- Incomplete warning if Step 2 not done

**Source Evidence sub-tab:**
- Source Extract — quoted text with entity highlights (org=blue, amount=green, date=purple, location=red, person=amber, ref=teal)
- Source Location — Document | Section | Subsection | Chunk

**Footer nav:**
- Previous / Cancel
- Next → (steps 1-2) | Send to Truth Plane (step 3, purple→green gradient)
