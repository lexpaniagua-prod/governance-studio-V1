# Source Drives — Design & Flow Specification

## Overview
Source Drives is the ingestion layer of Governance Studio. It manages document repositories that feed the Sandbox pipeline. The UI must feel operational — showing real pipeline state, bottlenecks, and actionable next steps at a glance.

---

## Layout
- Full-width list page with optional slide-out panel (60/40 split when open)
- Header: icon + title + count + primary CTA (+ Add Drive)
- Filter bar: Search | Last Activity dropdown | Department Owner dropdown | All Filters | Grid/List toggle

---

## Drive List Row
Each drive card displays:
- Folder icon (teal, `#14b8a6`, bg `rgba(20,184,166,0.12)`)
- Drive name (bold, 14px)
- Ingestion status badge: `Active Ingestion` (green) | `No Ingestion` (gray)
- 3-dot menu: View Drive, Edit Drive, Watch
- Description (12px, muted)
- Metadata row: Owner | Scope (Globe icon = Company-wide, Lock = Private) | Last Activity timestamp
- Right-aligned counters: `Documents N` (blue) | `On Sandbox N` (purple) — hidden if 0

### Row States
| State | Border | Background |
|-------|--------|------------|
| Default | `rgba(255,255,255,0.06)` | `rgba(255,255,255,0.02)` |
| Hover | `rgba(255,255,255,0.12)` | `rgba(255,255,255,0.05)` |
| Selected | `rgba(124,92,252,0.4)` | `rgba(124,92,252,0.06)` |

---

## Slide-out Panel (Drive Preview)
Triggered by clicking any drive row. Width: 520px, fixed right.

### Header
- Drive name + description
- Badges: owner + watching status
- CTA: `Go to Drive` (opens full detail page)

### Tabs: Overview | Details

#### Overview tab
1. **Knowledge Pipeline** — horizontal progress bar: Ingest → DIAN → Sandbox → Truth (4 colored segments)
2. **Stats grid** (2×2): Not ingested (pending badge) | In DIAN (purple) | Sandbox (amber, with "N need review") | Claims (blue)
3. **Truth** metric (green, full width)
4. **What can I do?** — 3 action items: Review Sandbox | Add Files | Watch Rules

#### Details tab
Key-value list: Owner, Scope, Status, Last Activity, Documents count

---

## Modals

### Add Drive Modal
Two modes via SegmentedControl: `Select Existing` | `Create New`

**Select Existing**: Search input + scrollable list of org drives with radio selection. Each item shows: Name, description, owner·scope·docs·sandbox count.

**Create New**: 
- Folder name (required)
- Description
- **Intake mode** (required radio):
  - `Watched folder` (Recommended badge) — auto-send to DIAN
  - `Manual folder` — manual DIAN submission

---

## All Filters Panel
Sections and options:
| Section | Options |
|---------|---------|
| Sort by | Last Activity · Document Count · Name · Ingestion Activity |
| Department | Sales · Marketing · Engineering · Product · HR · Finance · Legal · Operations |
| Scope | Company-wide · Private |
| Ingestion Setup | Auto-ingestion enabled · Manual only |
| Content Volume | 0-10 · 10-50 · 50+ documents |
| Sandbox Activity | Has content in Sandbox · No Sandbox activity |

---

## Color Semantics (drives context)
- Teal `#14b8a6` — Source Drives identity color
- Purple `#a78bfa` — DIAN processing / sandbox count
- Blue `#60a5fa` — Documents / claims
- Green `#4ade80` — Active ingestion / truth promoted
- Gray — No ingestion / private scope

---

## Drive Detail Page (full view)
URL: `/intelligence-library/source-drives/:id`

**Header metrics** (4 cards, colored borders):
1. Files — white/neutral
2. In DIAN — purple
3. In Sandbox — amber/orange
4. Associated Claims — blue

**Tab toggle**: Overview | Files

**Overview sub-tabs**: Analytics & Insights | Ingestion Pipeline | Storage

**Analytics & Insights** content:
- Truth Validation Rate — large %, progress bar, "89 of 127 claims being promoted to truth"
- To Review — Slowest stage + avg days + Recommendation box (amber)
- Weekly Throughput chart — 3-line: Documents Ingested (blue) | Claims Created (purple) | Truth Promoted (green)
- Recommended Actions — actionable items with warning/info icons

**Files tab**:
- Filters: Search | Pipeline Status | Needs Attention | Source Type | All Filters | List/Grid | Folder | Upload
- Sections: Folders (collapsible) + Documents list
- Document row: type icon + name + AI summary excerpt + owner + status badge (Sandbox/Reading/In DIAN) + counters (Sandbox N · Claim N · Truth N)
- 3-dot: view, send to sandbox, etc.

**File Slide-out tabs**: Overview (AI Insights, counts, Alerts with risk badges, Processing Timeline) | Attestation (source metadata, versioning tags)

**Files All Filters**: Sort by (Document updated · Knowledge updated · Name · Created date) | Processing Status (Not Ingested · In DIAN · In Sandbox) | Attention Required | Processing Outputs | Source | File Type
