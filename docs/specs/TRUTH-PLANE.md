# Truth Plane — Design & Flow Specification

## Overview
The Truth Plane is the final, governed knowledge repository. Facts here have been validated, promoted from Sandbox, and represent organizational truth. The UI must convey authority, traceability, and urgency around expiring/conflicting facts.

**Hierarchy**: Intelligence Library → Truth Plane (list) → Truth Plane Detail (Facts/Review/Proposals tabs) → Fact Full Page (4 tabs)

---

## Truth Plane List

### Layout
Full-width list + slide-out panel

### Filter bar
Search | Filters (opens slide-out) | Grid/List toggle
⚠️ **TO DO**: Homologate quick filters to match Source Drives and Sandbox standards (Status + Owner + more dropdowns before "All Filters")

### Plane Row
- Shield icon (blue `#60a5fa`, bg `rgba(59,130,246,0.12)`)
- Plane name (bold 14px) + 3-dot menu
- Description (12px muted)
- Owner | Scope badge | Timestamp
- Right counters: `⊙ Facts N` (purple) | `⏱ Expiring N` (amber) | `👁 Review N` (blue) | `✦ Proposals N` (purple)

### Plane Slide-out
Tabs: Overview | Details

**Overview:**
4 KPI cards (2×2): Facts (green) | About to Expire (amber) | Needs Review (blue) | Proposals (purple)

---

## Truth Plane Detail Page
URL: `/truth-plane/:id`

### Header
- Shield icon + plane name + `Verified` badge (green) + scope badge
- Description
- `Settings` button

### Metrics row (4 cards)
1. Facts — green
2. About to Expire — amber
3. Needs Review — blue  
4. Proposals — purple

### Tab Bar
Overview | Facts | Review | Proposals

---

### Facts Tab

#### Filter bar
Search | Status dropdown | Tag dropdown | Filters button

#### Fact Row
- Shield icon (blue)
- Fact ID (TF-XXXX, monospace muted)
- Title (bold 14px)
- Tag pill (category: Compliance/Finance/Eligibility/Legal etc., purple tint)
- Status badge: `✓ Verified` (green) | `⏳ Pending` (amber) | `⚠ Conflict` (red)
- 3-dot menu: Propose Change | View Evidence | Break Glass
- Claim text (12px italic, line-clamp 1)
- Metadata: Approved By (avatar + name) | timestamp | expiry date
- **Expiry state**: normal date shown gray; expired = shown in red with AlertTriangle icon
- Right signals: source count | proposal count | polarity | confidence % | risk

#### Conflict row state
- Red border + faint red background (same as Claims conflict)

#### Verified at tooltip
On hover of `Verified` badge → tooltip showing "Verified At: [date] at [time]"

---

### Fact Slide-out

**Header:**
- Title + TF-XXXX ID + Verified badge + tag badge
- `Propose Change` CTA + expand icon (opens full page)
- Close button

**Tabs: Overview | Evidence N | Details**

#### Overview tab
1. **Context** card — AI-generated context paragraph
2. **VERIFIED FACT** highlighted card (blue bg/border, bold text) — the actual fact statement
3. 6 governance signal cards (3×2): Confidence | Risk | Polarity | Last Review | Valid From | Valid To
4. **Extracted Entities** grid (2-col, 6 entities): Organization (blue) · Date (purple) · Amount (green) · Location (red) · Person (amber) · Reference (teal)
5. Footer: `Propose Change` (outline, full width) | `⊗ Break Glass` (red outline, full width)

**Key distinction from Sandbox claim:**
- Card label is `VERIFIED FACT` (blue) not `CLAIM` (purple)
- Additional signals: Last Review, Valid From, Valid To
- Break Glass is a prominent action

#### Evidence tab
Sub-tabs: Source Claims N | Source Documents N

**Source Claims:** list of sandbox claims that support this fact — ID + title + doc + bundle + confidence + risk

**Source Documents:** list of supporting PDFs/docs

#### Details tab (slide-out)
Attestation & Governance Trail — 4 pairs (2×2 grid):
- Created by + Created on
- Conflict resolved by + Resolution date
- Promoted to Truth by + Promotion date
- Approved by + Approval date

---

## Fact Full Page
URL: `/truth-plane/:planeId/fact/:factId`

**Header metrics** (4 colored cards): Confidence | Risk Level | Evidence N | Polarity

**Tab Bar**: Overview | Evidence | Governance | Lineage

### Overview tab
- Context section
- VERIFIED FACT highlighted block
- Extracted Entities grid (full width 2-col)
- **Dashboard View** (with Performance Overview dropdown):
  - 4 metric cards: Confidence Score (green) | Evidence Count (blue) | Risk Level (green) | Last Verified (blue)
  - Verification History feed: Confidence increased → NN%→NN% · N time | Evidence added · doc name · N time | Initial verification · name · N time
  - Source Document: Document name | Section | Subsection
- Footer: `Propose Change` | `⊗ Break Glass`

### Evidence tab
Sub-tabs: All N | Claims N | Documents N

**Evidence Claims list:** Each claim row: sparkle icon | CL-XXXX | title | excerpt | source doc | confidence | risk
**Supporting Documents:** doc icon | name | "No extract available" if none

### Governance tab
- **Attestation & Governance Trail** (3×2 grid cards):
  - Created by + Created on
  - Last modified by + Last modified
  - Verified by + Verified on
- **Change History** feed (timeline):
  - Fact verified — by name · time
  - Confidence score updated — by name · time
  - Evidence added — by name · time
  - (more items scroll)

### Lineage tab
- **Source Information** card: Source Document | Section | Subsection
- **Downstream Usage** list: 
  - Workflow icon — workflow name
  - Report icon — report name
  - Integration icon — integration name
- **Related Facts** (with relationship badge, e.g. "Depends on"): TF-XXXX with shield icon

---

## All Filters Panel (Truth Plane)
| Section | Options |
|---------|---------|
| Status | All · Active · Archived · Draft · Under Review |
| Scope | All · Global · Regional · Departmental · Project-specific |
| Category | All · Policy · Procedure · Requirement · Guideline · Standard |
| Risk Level | All · Low · Medium · High · Critical |
| Confidence Score | Min — Max range inputs |
| Source Claims Count | Min — Max range inputs |

---

## Color Semantics (Truth Plane context)
- Blue `#3b82f6 / #60a5fa` — Truth Plane identity color, Verified facts
- Green `#22c55e / #4ade80` — Verified state, healthy signals
- Amber `#f59e0b / #fbbf24` — Expiring, Pending, attention needed
- Red `#ef4444 / #f87171` — Conflict, expired, Break Glass
- Purple `#7c5cfc / #a78bfa` — Proposals, governance lineage

---

## Break Glass
Special emergency action that allows bypassing normal governance workflow. Displayed as a red-outlined button with `⊗` icon. Should trigger a confirmation modal (V2) explaining consequences and requiring explicit acknowledgment.

---

## Known Gaps (V2 backlog)
- Overview tab content (analytics for the truth plane)
- Review tab (queue of facts pending human validation)
- Proposals tab (incoming packages from Sandbox)
- Break Glass confirmation modal
- Fact full page Lineage → visual graph (not just list)
- Quick filters on list view (needs homologation with Sandbox/Source Drives pattern)
