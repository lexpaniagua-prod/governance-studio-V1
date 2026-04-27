# Development Log — Governance Studio

## Project Genesis

Governance Studio began as a React prototype to communicate a product vision to engineering. The intent, inferred from the README and spec files, was to produce a high-fidelity clickable prototype that engineers could study before implementing the production system.

The original scope (from the README) covered four modules: Intelligence Library, Source Drives, Sandbox Plane, and Truth Plane. The codebase has since grown to include a Knowledge module (Truth Packs), a Playbooks module, and a comprehensive set of modals for collaborative claim and fact management.

The project is authored in JSX with no TypeScript. All data is mocked in `src/data/mock.js` and `src/data/mockKnowledge.js`. There are no API calls and no persistence layer — the prototype is intentionally lightweight so it can be deployed instantly and shared with stakeholders via Vercel.

The `FRONTEND_TASKS.md` file represents the most recent session of active development: a Claims Tab overhaul adding `SuggestChangeModal`, `ViewSuggestionModal`, and a redesigned `CreateClaimModal` with edit mode support. This was the last engineering work session recorded.

---

## Current State Summary (as of 2026-04-27)

The prototype is a fully deployable SPA covering the main governance pipeline from Source Drives through to Knowledge distribution. All primary navigation flows are implemented. Most modals, slide-outs, and filter panels are wired. The Playbooks module is functional but its mock data is local to each component file rather than centralised in `mock.js`.

---

## Module Completion Status

### Layout and Navigation
- Layout.jsx (Sidebar + top bar + theme toggle): Complete
- Dark/light mode toggle with `localStorage` persistence: Complete
- Sidebar collapse/expand with animated width transition: Complete
- Active route highlighting: Complete
- Disabled nav items (Control Center, My Work, Builder, Deploy, Admin): Visible but non-functional (by design for V1)

### Intelligence Library (`/intelligence-library`)
- Landing dashboard with 4 plane cards (Source Drives, Sandbox Plane, Truth Plane, Knowledge): Complete
- Recent activity feed: Complete
- Navigation to sub-modules: Complete

### Source Drives (`/intelligence-library/source-drives`)
- Drive list with search + department/date filter dropdowns: Complete
- All Filters panel with sections for Drive Status, Scope, Ingestion Status, Activity: Complete
- Drive row with counter chips (docs, sandbox, last activity): Complete
- `DriveSlideOut` preview panel with tabs (Overview / Details): Complete
- `AddDriveModal` with connection type, name, scope, owner fields: Complete
- Grid / list toggle buttons: UI-only (no grid layout implemented)

### Sandbox Plane (`/sandbox`)
- Sandbox list with search, status/scope/needs-attention filter dropdowns: Complete
- All Filters panel (Claim Status, Attention Required, Usage, Activity sections): Complete
- Sandbox row with counter chips (Sources, Bundles, Claims, Promotions): Complete
- `SandboxSlideOut` with Overview (AI Summary, Validation Signals, Content Breakdown) and Details tabs: Complete
- `CreateSandboxModal` with name, description, scope, owner fields: Complete

### Sandbox Detail (`/sandbox/:id`)
- 5-tab layout: Overview, Sources, Claims, Bundles, Promotions: Complete
- Overview tab with metrics cards and recharts `LineChart`: Complete
- Sources tab with `sourceDocs` cards and `SourceSlideOut`: Complete
- Claims tab with `claims` data, status badges, polarity/risk chips, action buttons: Complete
- Claims tab — `ClaimSlideOut` panel: Complete
- Claims tab — `CreateClaimModal` (create + edit modes, all 5 sections): Complete
- Claims tab — `SuggestChangeModal` (two-column layout, all optional fields): Complete
- Claims tab — `ViewSuggestionModal` (read-only + accept/decline flow): Complete
- Bundles tab with bundle cards and status badges: Complete
- Promotions tab with `PromotionSlideOut`: Complete
- Ingestion Pipeline tab: Placeholder — the tab button exists in `SandboxDetail` but shows a "coming soon" or stub state

### Promotion Builder (`/sandbox/:id/promotion-builder`)
- 4-step wizard (Promotion / Target & Details / Claim Review / Summary): Complete
- Step 1: Claim selection with preview via `ClaimSlideOut`: Complete
- Step 2: Package naming, target Truth Plane selection, AI Builder / Wizard mode buttons: UI-only (AI Builder and Wizard buttons are visual only, no functionality)
- Step 3: Claim review grid: Complete
- Step 4: Summary screen: Complete
- Exit/cancel back to sandbox: Complete

### Truth Plane (`/truth-plane`)
- Plane list with search + multi-dimension quick filter dropdowns: Complete
- Quick filter dropdowns (Status, Risk Level, Attention Required) with chip removal: Complete
- All Filters panel with 9 filter dimensions: Complete
- Active filter chips with individual removal and "Clear all": Complete
- Plane row with status badge, risk, confidence, counters: Complete
- `TruthPlaneSlideOut` with Overview (AI Summary, Attention Items, Governance Health, Actions) and Details (Plane Details, Governance Thread) tabs: Complete
- `CreateTruthPlaneModal` with name, description, domain, risk, scope, owner fields: Complete
- Grid / list toggle: UI-only

### Truth Plane Detail (`/truth-plane/:id`)
- 4-tab layout: Facts, Review, Proposals, Overview: Complete
- Facts tab with search, status/tag filter dropdowns, fact rows: Complete
- Facts tab — fact slide-out panel within the detail page: Complete
- Facts tab — `CreateFactModal`: Complete
- Facts tab — `ProposeChangeModal` on individual facts: Complete
- Facts tab — `BreakGlassModal` on individual facts: Complete
- Facts tab — governance trail via `GovernanceCompact` and `GovernanceSnapshot` components: Complete
- Review tab with review queue items, escalation, evidence request flows: Complete
- Review tab — `EscalateModal`: Complete
- Review tab — `RequestEvidenceModal`: Complete
- Review tab — `EvidenceResponseModal`: Complete
- Review tab — `ApproveConfirmModal` with `WhatChangesView` diff: Complete
- Proposals tab: Complete — shows `factProposals[]` filtered to current plane's facts
- Overview tab: Shown as stub/placeholder in the tab list (per README: "Truth Plane Overview... shows placeholder text")

### Truth Fact Full Page (`/truth-plane/:id/fact/:factId`)
- 4-tab layout: Overview, Evidence, Proposals, Governance Trail: Complete
- Overview tab with fact text, confidence bar, entity tags, context: Complete
- Evidence tab with linked claims (`EVIDENCE_BY_FACT`): Complete
- Proposals tab with filtered proposals: Complete
- Governance Trail tab with `GovernanceTimeline`: Complete
- `ProposeChangeModal` integration: Complete
- `BreakGlassModal` integration: Complete

### Knowledge (`/intelligence-library/knowledge`)
- Truth Pack list with grid and list view toggle: Complete
- Search, filter bar, All Filters panel: Complete
- Summary metrics row (active packs, facts count, agents count, networks count): Complete
- `PackGridCard` and list-mode rows: Complete
- `TruthPackSlideOut`: Complete
- Archive, Duplicate, Edit, Preview, Add Access ThreeDot actions: UI hooks wired, no implementation

### Truth Pack Detail (`/intelligence-library/knowledge/:id`)
- 6-tab layout: Overview, Facts, Users, Agents, Agentic Networks, Activity Log: Complete
- Overview tab with pack stats, linked Truth Plane, recharts usage charts: Complete
- Facts tab with `truthFacts` filtered to `pack.factIds`: Complete
- Users tab with `MOCK_USERS` list: Complete
- Agents tab with `MOCK_AGENTS` list: Complete
- Agentic Networks tab with `MOCK_NETWORKS` list: Complete
- Activity Log tab: Complete

### Playbooks (`/playbooks`)
- Playbook list with search and stage/status/department filters: Complete
- Playbook row with status, trust mode, version, phase/gate counts: Complete
- `CreatePlaybook` entry page with template options: Complete

### Playbook Builder (`/playbooks/create/scratch`)
- Multi-step wizard: Basics, Moment, Objective, Trust, Phases, Gates: Complete
- Tenant/Rooftop targeting with mock data (AutoNation, Hendrick, Sonic, Penske, Lithia): Complete
- Knowledge Pack selection (reads from `mockKnowledge.js`): Complete
- Export steps as reusable components (`BasicsStep`, `MomentStep`, `GatesStep`, `ObjectiveStep`, `PhasesStep`, `TrustStep`, `INITIAL`): Complete

### Playbook Detail (`/playbooks/:id`)
- Detail page with performance metrics, phase/gate overview: Complete
- Tabs: Overview, Phases & Gates, Performance, Settings: Visible, content varies by tab
- Edit mode using reusable `PlaybookBuilder` step components: Complete

---

## Known TODOs

All items below are inferred from comments in spec files and README notes. No `TODO`, `FIXME`, or `HACK` comments are present in the JSX source files.

| Item | Source | Description |
|---|---|---|
| Quick filters on Truth Plane | `docs/specs/TRUTH-PLANE.md` line 17 | "Homologate quick filters to match Source Drives and Sandbox standards (Status + Owner + more dropdowns before 'All Filters')" |
| Light mode | `README.md` | "Light mode not wired" — the toggle exists in `Layout.jsx` and CSS variables for light mode exist, but not all components are tested in light mode |
| Truth Plane Overview/Review/Proposals placeholder tabs | `README.md` | "Some tabs show placeholder text (Truth Plane Overview/Review/Proposals, Sandbox Ingestion Pipeline)" |
| Sandbox Ingestion Pipeline tab | `README.md` | Tab is present in `SandboxDetail` tab bar but content is placeholder |
| Promotion Builder AI Builder / Wizard buttons | `README.md` | "Promotion Builder AI Builder / Wizard buttons are UI-only" |
| Break Glass confirmation modal | `README.md` | "Break Glass has no confirmation modal yet" — NOTE: `BreakGlassModal.jsx` was subsequently implemented, so this TODO may be resolved |
| Grid view for Source Drives, Sandbox, Truth Plane | Inferred from UI-only grid/list toggle buttons | LayoutGrid toggle buttons exist in toolbar but no grid layout is rendered |
| Knowledge pack Archive / Duplicate / Edit / Add Access | Inferred from ThreeDot menu handlers | `onArchive`, `onDuplicate`, `onEdit` props are wired but handlers are no-ops |
| Pagination | Inferred from pagination controls | All list views show pagination UI (prev/next buttons, page `1` active button) but no actual page-slicing logic is implemented |
| Search is not functional for all modules | Inferred | Knowledge module search wires to local state but filtering is implemented. Playbooks search also wires to local state. Some dropdowns (Status, Needs Attention, Owner on Sandbox list) do not filter. |

---

## Dependencies

All from `package.json`:

| Package | Why used |
|---|---|
| `react` ^18.3.1 | Core UI library, hooks, component model |
| `react-dom` ^18.3.1 | DOM rendering and `createPortal` for modals/slide-outs |
| `react-router-dom` ^6.26.0 | Client-side SPA routing — `useNavigate`, `useParams`, `useLocation`, `Routes`, `Route` |
| `lucide-react` ^0.460.0 | All icons across all components (Library, Shield, LayoutGrid, Sparkles, MessageSquare, Send, Target, MapPin, CheckCircle, AlertTriangle, etc.) |
| `recharts` ^2.13.0 | Charts — `LineChart` in SandboxDetail, `AreaChart` in TruthPackDetail, `BarChart` in TruthPackDetail |
| `clsx` ^2.1.1 | Conditional className composition — used in most components for state-driven class toggling |
| `vite` ^5.4.8 | Build tooling and dev server with HMR |
| `@vitejs/plugin-react` ^4.3.1 | Enables JSX transform and React Fast Refresh in Vite |
| `tailwindcss` ^3.4.13 | Utility CSS — all layout, spacing, and colour utilities; extended with custom CSS variable tokens |
| `postcss` ^8.4.47 | Required by Tailwind for CSS processing pipeline |
| `autoprefixer` ^10.4.20 | Adds vendor prefixes to generated CSS for browser compatibility |

---

## Open Issues / Debt

### Commented-out / duplicate code
- `src/components/layout/LayoutOld.jsx` exists alongside `Layout.jsx`. The old layout is never imported anywhere. It is dead code and should be removed.
- `tailwindOld.config.js` exists alongside `tailwind.config.js`. The old config file is not referenced anywhere. Dead file.
- `vite.config.js.bak` is a backup file of a previous Vite configuration. Should be deleted.

### Incomplete implementations
- Pagination controls are purely decorative. The `.filter()` result set is rendered in full without any page-slicing.
- Status / Owner / Needs Attention dropdowns in the Sandbox Plane list do not apply any filtering — they render `<select>` elements with hardcoded `<option>` values and no `onChange` handler connected to filter logic.
- The grid layout toggle (LayoutGrid icon button) is present in Source Drives, Sandbox, Truth Plane, and Knowledge toolbars but only Knowledge has a working grid/list toggle.

### Architecture / technical debt
- Evidence data (`EVIDENCE_BY_FACT`) is duplicated between `TruthPlaneDetail.jsx` and `TruthFactDetail.jsx`. If evidence data ever grows, it should be moved to `mock.js` and exported once.
- Playbook mock data (`PLAYBOOKS` array) is duplicated between `Playbooks.jsx` and `PlaybookDetail.jsx`. It should be centralised in `mock.js`.
- `TruthPlane.jsx` `getAISummary()` function generates text dynamically from data fields. In production, this would be replaced by an actual AI API call.
- `confPalette` / `sigPalette` helper functions in `TruthPlane.jsx` are defined inline within the `TruthPlaneSlideOut` component. These colour utilities are also duplicated across `TruthPlaneDetail.jsx`.

### Mock data gaps
- `factProposals` has IDs `PROP-001`, `PROP-002`, `PROP-003`, `PROP-006`, `PROP-007`, `PROP-008`, `PROP-009`, `PROP-010`. IDs `PROP-004` and `PROP-005` are missing — suggesting removed or planned entries.
- `reviewQueue` has `RV-0001` through `RV-0005`. All five items are tied to `TF-0001` through `TF-0006` — no review items exist for any of the auto-verified facts (TF-0016 to TF-0020).
- `breakGlassRecords` contains only one entry (`BG-001` for `TF-0004`). All other facts have no break glass history.

---

## Next Steps

Based on the TODOs, incomplete implementations, and the FRONTEND_TASKS.md task list, the logical next development priorities are:

1. **Wire filter dropdowns in Sandbox Plane list** — Status, Needs Attention, and Owner selects currently have no `onChange` logic. Connect them to the existing `search` filter pattern.
2. **Implement pagination** — Add `page` state and slice `filtered` array by `PAGE_SIZE` in each list component.
3. **Implement grid layout toggle** — Wire the LayoutGrid/List icon buttons in Source Drives, Sandbox, and Truth Plane to a local `view` state that switches between list and grid rendering.
4. **Homologate Truth Plane quick filters** — As specified in `docs/specs/TRUTH-PLANE.md`, add Status and Owner quick-filter dropdowns to match the Source Drives and Sandbox Plane toolbar pattern.
5. **Implement stub Truth Plane Overview tab** — Replace the placeholder content in the Truth Plane Detail Overview tab with actual metrics, charts, and governance summary.
6. **Implement Sandbox Ingestion Pipeline tab** — Build out the ingestion pipeline visualisation inside `SandboxDetail`.
7. **Remove dead files** — Delete `LayoutOld.jsx`, `tailwindOld.config.js`, and `vite.config.js.bak`.
8. **Centralise Playbook mock data** — Move `PLAYBOOKS` array from `Playbooks.jsx` and `PlaybookDetail.jsx` to `mock.js`.
9. **Centralise evidence data** — Move `EVIDENCE_BY_FACT` from `TruthPlaneDetail.jsx` and `TruthFactDetail.jsx` to `mock.js`.
10. **Light mode audit** — Review all components in light mode and fix any hardcoded dark values that don't respect the CSS variable token system.
