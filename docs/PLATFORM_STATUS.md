# Platform Status — Governance Studio

## Current Version

**Version:** `0.1.0` (from `package.json`)  
**Project name:** `governance-studio`  
**Repository branch:** `main`  
**Last commit message:** `promotion package claims badges` (commit `f40cdde`)

---

## Last Updated

The most recent source file changes were made on **2026-04-27** based on git commit history. The newest dated entries in mock data appear on `2026-04-20` (auto-verified facts TF-0016 through TF-0020) and `2026-04-27` (current session date). The most recently authored FRONTEND_TASKS.md session covers the Claims Tab and Create Claim overhaul.

---

## Feature Inventory

### Implemented and Navigable

| Feature | Route | Status |
|---|---|---|
| Intelligence Library home | `/intelligence-library` | Functional |
| Source Drives list | `/intelligence-library/source-drives` | Functional |
| Drive slide-out preview | — (opens from list) | Functional |
| Add Drive modal | — (opens from list) | Functional |
| Knowledge — Truth Packs list | `/intelligence-library/knowledge` | Functional |
| Truth Pack slide-out preview | — (opens from list) | Functional |
| Truth Pack detail | `/intelligence-library/knowledge/:id` | Functional |
| Sandbox Plane list | `/sandbox` | Functional |
| Sandbox slide-out preview | — (opens from list) | Functional |
| Create Sandbox modal | — (opens from list) | Functional |
| Sandbox detail — Overview tab | `/sandbox/:id` | Functional |
| Sandbox detail — Sources tab | `/sandbox/:id` | Functional |
| Sandbox detail — Claims tab | `/sandbox/:id` | Functional |
| Sandbox detail — Bundles tab | `/sandbox/:id` | Functional |
| Sandbox detail — Promotions tab | `/sandbox/:id` | Functional |
| Claim slide-out | — (opens from Claims tab) | Functional |
| Create Claim modal (create mode) | — (opens from Claims tab) | Functional |
| Create Claim modal (edit mode) | — (opens from ThreeDot menu) | Functional |
| Suggest Change modal | — (opens from ThreeDot menu) | Functional |
| View Suggestion modal | — (opens from claim card) | Functional |
| Source document slide-out | — (opens from Sources tab) | Functional |
| Promotion slide-out | — (opens from Promotions tab) | Functional |
| Promotion Builder wizard | `/sandbox/:id/promotion-builder` | Functional |
| Truth Plane list | `/truth-plane` | Functional |
| Truth Plane slide-out preview | — (opens from list) | Functional |
| Create Truth Plane modal | — (opens from list) | Functional |
| Truth Plane detail — Facts tab | `/truth-plane/:id` | Functional |
| Truth Plane detail — Review tab | `/truth-plane/:id` | Functional |
| Truth Plane detail — Proposals tab | `/truth-plane/:id` | Functional |
| Truth Fact full page | `/truth-plane/:id/fact/:factId` | Functional |
| Propose Change modal | — (opens from fact views) | Functional |
| Approve Confirm modal | — (opens from review queue) | Functional |
| Create Fact modal | — (opens from Facts tab) | Functional |
| Break Glass modal | — (opens from fact views) | Functional |
| Request Evidence modal | — (opens from review queue) | Functional |
| Escalate modal | — (opens from review queue) | Functional |
| Evidence Response modal | — (opens from review queue) | Functional |
| Governance Trail (compact, snapshot, timeline) | — (embedded in fact views) | Functional |
| Playbooks list | `/playbooks` | Functional |
| Create Playbook entry page | `/playbooks/create` | Functional |
| Playbook Builder wizard | `/playbooks/create/scratch` | Functional |
| Playbook detail | `/playbooks/:id` | Functional |

### Disabled (Nav items, no route)

| Feature | Reason |
|---|---|
| Control Center | `disabled: true` in sidebar nav |
| My Work | `disabled: true` in sidebar nav |
| Builder | `disabled: true` in sidebar nav |
| Deploy | `disabled: true` in sidebar nav |
| Admin | `disabled: true` in sidebar nav |

---

## Frontend Pages and Views — Complete Route Map

| URL Pattern | Component | Description |
|---|---|---|
| `/` | Redirects → `/intelligence-library` | Default route |
| `/intelligence-library` | `IntelligenceLibrary.jsx` | Landing dashboard with plane cards and activity feed |
| `/intelligence-library/source-drives` | `SourceDrives.jsx` | Drive list, slide-out, add modal |
| `/intelligence-library/knowledge` | `Knowledge.jsx` | Truth Packs grid/list, slide-out, filters |
| `/intelligence-library/knowledge/:id` | `TruthPackDetail.jsx` | Pack detail: Overview/Facts/Users/Agents/Networks/Activity |
| `/sandbox` | `SandboxPlane.jsx` | Sandbox list, slide-out, create modal |
| `/sandbox/:id` | `SandboxDetail.jsx` | 5-tab detail: Overview/Sources/Claims/Bundles/Promotions |
| `/sandbox/:id/promotion-builder` | `PromotionBuilder.jsx` | 4-step full-screen promotion wizard |
| `/truth-plane` | `TruthPlane.jsx` | Truth plane list, multi-dim filters, slide-out, create modal |
| `/truth-plane/:id` | `TruthPlaneDetail.jsx` | 4-tab detail: Facts/Review/Proposals/Overview |
| `/truth-plane/:id/fact/:factId` | `TruthFactDetail.jsx` | Full fact page: Overview/Evidence/Proposals/Governance Trail |
| `/playbooks` | `Playbooks.jsx` | Playbook list with search and filters |
| `/playbooks/create` | `CreatePlaybook.jsx` | Playbook creation entry — template picker |
| `/playbooks/create/scratch` | `PlaybookBuilder.jsx` | Multi-step playbook authoring wizard |
| `/playbooks/:id` | `PlaybookDetail.jsx` | Playbook detail with performance metrics |

---

## Configuration Status

| Config | Value | Status |
|---|---|---|
| Dev port | `5173` (or `$PORT` env var) | Configured |
| Production base path | `/governance-studio-V1/` (vite.config.js) | Configured |
| Tailwind content paths | `./index.html`, `./src/**/*.{js,jsx}` | Configured |
| SPA rewrite (Vercel) | All paths → `/index.html` | Configured |
| Dark mode class strategy | `class` on `<html>` | Configured |
| Font families | Inter (sans), JetBrains Mono (mono) | Configured via Tailwind extend |
| `@` path alias | Points to `/src` | Configured |
| Environment variables | Only `PORT` (optional) | No `.env` file needed |
| Authentication | None | Not applicable (prototype) |
| API endpoints | None | Not applicable (prototype) |
| Database | None | Not applicable (prototype) |

---

## What Works Today

The following capabilities are fully functional in the current prototype:

1. **Full SPA navigation** across all implemented routes with browser back/forward support.
2. **Dark/light mode toggle** with `localStorage` persistence (preference survives page refresh). Smooth 300ms CSS transition on toggle.
3. **Sidebar collapse/expand** with smooth width animation and floating toggle button.
4. **Source Drives list** with text search filtering, department and date filter dropdowns, All Filters panel (no-op pills), drive slide-out with Overview and Details tabs, and Add Drive modal.
5. **Sandbox Plane list** with text search filtering, sandbox slide-out with AI Summary, Validation Signals, and Content Breakdown, and Create Sandbox modal with scope-dependent owner field.
6. **Sandbox Detail** with all 5 tabs rendering real mock data:
   - Overview tab with `LineChart` and truthReadiness/conflictRate/bottleneck metrics.
   - Sources tab with document cards, AI summary, alerts, and SourceSlideOut.
   - Claims tab with claim cards, status badges, confidence/risk/polarity chips, Promote/Review/View Suggestion action buttons, Eye preview, ThreeDot menu with Edit/Suggest/Quick Promote, and all three modals (ClaimSlideOut, CreateClaimModal, SuggestChangeModal, ViewSuggestionModal).
   - Bundles tab with bundle cards and status badges.
   - Promotions tab with promotion package cards and PromotionSlideOut.
7. **Promotion Builder** — all 4 steps navigable, claim selection with preview, package naming, claim review, summary screen.
8. **Truth Plane list** with multi-dimension filtering (10 filter dimensions), quick filter dropdowns with chip display, result count, and TruthPlaneSlideOut with AI-generated summary, Attention Items, Governance Health, Actions, and Governance Thread.
9. **Create Truth Plane modal** with scope-dependent owner dropdown.
10. **Truth Plane Detail** — Facts tab with search + status/tag dropdowns, fact cards with GovernanceCompact dots, fact slide-out with ProposeChangeModal, CreateFactModal, BreakGlassModal. Review tab with full review queue: EscalateModal, RequestEvidenceModal, EvidenceResponseModal, ApproveConfirmModal with WhatChangesView diff. Proposals tab with factProposals data.
11. **Truth Fact full page** — all 4 tabs working: Overview (entity tags, confidence bar, context), Evidence (linked claims from EVIDENCE_BY_FACT), Proposals (filtered proposals), Governance Trail (GovernanceTimeline).
12. **Break Glass modal** — full 2-step gate with acknowledgement checkbox and override form with duration picker.
13. **Knowledge — Truth Packs** — grid and list view toggle, search + filter, slide-out preview, truth pack detail page with all 6 tabs.
14. **Playbooks** — list, create entry page, multi-step builder wizard with tenant/rooftop targeting, playbook detail.
15. **Governance Trail components** — GovernanceCompact (4-dot indicator), GovernanceSnapshot (vertical thread), GovernanceTimeline (full event timeline) all render correctly from `factGovernance` data.
16. **All modal portals** render correctly at `z-index: 9999` via `createPortal` to prevent clipping.

---

## What Is Incomplete

The following are stubs, placeholders, or partially implemented:

1. **Sandbox Ingestion Pipeline tab** — The tab button exists in `SandboxDetail`'s TabBar but the tab content is a placeholder or stub. No ingestion pipeline UI is implemented.
2. **Truth Plane Detail — Overview tab** — Renders but README explicitly documents this as showing placeholder text. No real overview metrics or charts.
3. **Promotion Builder — AI Builder / Wizard mode buttons** — Both buttons render in Step 2 of the wizard but have no `onClick` handlers that do anything meaningful. They are visual only.
4. **Sandbox Plane list filter dropdowns** — The Status, Needs Attention, and Owner `<select>` elements in the Sandbox list toolbar have hardcoded options but no `onChange` handlers connected to filtering logic. Only text search works.
5. **Pagination** — All list views (Source Drives, Sandbox, Truth Plane) show prev/next buttons and page 1 button but no actual pagination logic. All filtered items are rendered on one "page".
6. **Grid layout toggle** — Source Drives, Sandbox Plane, and Truth Plane have LayoutGrid/List toggle buttons in the toolbar. Only the Knowledge module has a working grid/list toggle. All others render list-only regardless of toggle state.
7. **Light mode** — The toggle works and applies CSS class changes, but not all components have been audited or tested in light mode. Some hardcoded colour values in inline styles will not respect the light theme.
8. **ThreeDot actions (Knowledge)** — Archive, Duplicate, Edit, Preview, and Add Access menu items in `Knowledge.jsx` `PackGridCard` have handlers (`onArchive`, `onDuplicate`, `onEdit`) that are wired to `useState` but no UI is implemented for most actions beyond the slide-out preview.
9. **Quick Promote** — The "Quick Promote" ThreeDot option on claim cards has an empty `onClick: () => {}` handler. No action is taken.
10. **Governance Trail — resolvedBy role** — In all 25 truth fact governance records, the `resolvedBy` role is `[null, null, false]`. No fact in the mock data has had a conflict resolution recorded, so this governance dot is always grey/unfilled.
11. **Search in Knowledge module** — The search bar in Knowledge wires to a local `query` state, but the filtering is applied only to the pack name and description. Tags and access type are not searchable.
12. **Playbooks — Filter dropdowns** — Stage, status, and department filter dropdowns in Playbooks.jsx are present in the UI but their `onChange` is not connected to the `PLAYBOOKS` array filtering.
13. **Control Center, My Work, Builder, Deploy, Admin** — All are disabled nav items with `path: null`. No routes or components exist for them.

---

## Onboarding Checklist

Step-by-step for a new developer to get the project running locally:

### Prerequisites

- [ ] Node.js 18 or higher installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] Git installed

### Clone and Install

1. Clone the repository or unzip the project directory.
2. Open a terminal and navigate to the project root:
   ```
   cd governance-studio
   ```
3. Install dependencies:
   ```
   npm install
   ```
   This installs all packages listed in `package.json` (react, react-dom, react-router-dom, lucide-react, recharts, clsx, vite, @vitejs/plugin-react, tailwindcss, postcss, autoprefixer).

### Run Development Server

4. Start the dev server:
   ```
   npm run dev
   ```
5. Open a browser at `http://localhost:5173`
   (Port defaults to 5173 unless the `PORT` environment variable is set.)

### Understand the Project Structure

6. Read `README.md` in the project root for the original quick-start guide.
7. Read `docs/specs/DESIGN-SYSTEM.md` for the colour system, component patterns, and design philosophy.
8. Read `docs/specs/SANDBOX-PLANE.md` and `docs/specs/TRUTH-PLANE.md` for the full feature specifications of the two most complex modules.
9. Read `FIELD_DEFINITIONS.md` for the data model reference (claim, suggestion, modal fields).
10. Read `FRONTEND_TASKS.md` for the most recent engineering task specification (Claims Tab overhaul).

### Key Files to Know

| File | Why it matters |
|---|---|
| `src/App.jsx` | All 14 routes — start here to understand navigation |
| `src/data/mock.js` | All mock data — start here to understand the data model |
| `src/data/mockKnowledge.js` | Truth Packs mock data |
| `src/components/ui/index.jsx` | Shared UI components — Badge, Chip, SlideOut, Modal, TabBar, ThreeDot, SearchBar, FormField, MetricCard, AllFiltersPanel, FilterSection, SegmentedControl |
| `src/components/layout/Layout.jsx` | App shell — sidebar nav, top bar, theme toggle |
| `src/index.css` | All global CSS — design tokens (CSS variables), glass cards, badges, chips, buttons, tab bars, slide-out panels |
| `tailwind.config.js` | Tailwind configuration with CSS variable token extension |
| `vite.config.js` | Build configuration — base path `/governance-studio-V1/`, `@` alias |

### Build for Production

11. Build the production bundle:
    ```
    npm run build
    ```
12. Preview the production build locally:
    ```
    npm run preview
    ```
    Opens at `http://localhost:4173`

### Deploy to Vercel (optional, for sharing)

13. Install Vercel CLI: `npm install -g vercel`
14. Login: `vercel login`
15. First deploy: `vercel` (follow prompts)
16. Subsequent deploys: `vercel --prod`
    The app will be live at `https://governance-studio-[hash].vercel.app`

### Common Gotchas

- The Vite `base` is set to `/governance-studio-V1/` in `vite.config.js`. If deploying to the root of a domain (not a subdirectory), change `base` to `'/'` before building.
- `vercel.json` contains an SPA rewrite rule so all routes resolve to `index.html`. This is required for React Router to work on direct URL access or page refresh.
- There is no backend — all data is in `src/data/mock.js`. No environment variables or API keys are needed.
- `LayoutOld.jsx` and `tailwindOld.config.js` are dead files. Do not edit them — they are not used anywhere.
- `vite.config.js.bak` is a backup file. Ignore it.
- All modals and slide-outs use `React.createPortal(…, document.body)` at `z-index: 9999`. If a new modal appears behind other content, check that it is using the portal pattern.
