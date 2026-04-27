# System Architecture — Governance Studio

## Project Overview

Governance Studio is a React prototype for a data governance and knowledge management platform. Its purpose is to give organisations a structured pipeline for converting raw documents into verified, auditable facts — and then distributing those facts to human reviewers, AI agents, and agentic networks.

The system follows a four-stage pipeline:

1. **Source Drives** — Raw document repositories (PDFs, spreadsheets, contracts) organised by department.
2. **Sandbox Plane** — AI-assisted claim extraction and validation workspace.
3. **Truth Plane** — The governed repository of approved, version-controlled facts with full attestation trails.
4. **Knowledge** — Packaged Truth Packs distributed to users, agents, and agentic networks.

The prototype also includes a **Playbooks** module for authoring governance-aware, NBA-driven workflow playbooks that are executed by AI agents.

The intended users are governance teams, legal and compliance reviewers, deal-desk agents, and platform administrators in enterprise organisations.

---

## Tech Stack

All versions come from `package.json`:

| Package | Version | Role |
|---|---|---|
| `react` | ^18.3.1 | UI rendering |
| `react-dom` | ^18.3.1 | DOM mounting |
| `react-router-dom` | ^6.26.0 | Client-side routing (SPA) |
| `lucide-react` | ^0.460.0 | Icon library (all icons across all components) |
| `recharts` | ^2.13.0 | Charts (`LineChart`, `AreaChart`, `BarChart`) |
| `clsx` | ^2.1.1 | Conditional CSS class composition |
| `vite` | ^5.4.8 | Build tool and dev server |
| `@vitejs/plugin-react` | ^4.3.1 | Vite plugin for JSX/React fast refresh |
| `tailwindcss` | ^3.4.13 | Utility-first CSS framework |
| `postcss` | ^8.4.47 | CSS post-processing |
| `autoprefixer` | ^10.4.20 | Vendor prefix automation |

**Runtime:** Node.js 18+  
**Language:** JavaScript (JSX) — no TypeScript  
**Module system:** ES Modules (`"type": "module"` in package.json)

---

## High-Level Architecture

The application is a pure client-side single-page application (SPA). There is no backend, no API, and no database. All data is imported from static mock files.

```
┌─────────────────────────────────────────────────────┐
│                    Browser (SPA)                    │
│                                                     │
│  ┌──────────────────────────────────────────────┐   │
│  │              Layout.jsx                      │   │
│  │  (Sidebar nav + Top bar + Theme toggle)      │   │
│  │                                              │   │
│  │  ┌──────────────────────────────────────┐   │   │
│  │  │        React Router v6               │   │   │
│  │  │  (App.jsx — all route definitions)   │   │   │
│  │  │                                      │   │   │
│  │  │  /intelligence-library  ─────────► IntelligenceLibrary.jsx  │
│  │  │  /intelligence-library                                       │
│  │  │    /source-drives       ─────────► SourceDrives.jsx          │
│  │  │  /intelligence-library                                       │
│  │  │    /knowledge           ─────────► Knowledge.jsx             │
│  │  │  /intelligence-library                                       │
│  │  │    /knowledge/:id       ─────────► TruthPackDetail.jsx       │
│  │  │  /sandbox               ─────────► SandboxPlane.jsx          │
│  │  │  /sandbox/:id           ─────────► SandboxDetail.jsx         │
│  │  │  /sandbox/:id/                                               │
│  │  │    promotion-builder    ─────────► PromotionBuilder.jsx       │
│  │  │  /truth-plane           ─────────► TruthPlane.jsx            │
│  │  │  /truth-plane/:id       ─────────► TruthPlaneDetail.jsx      │
│  │  │  /truth-plane/:id/                                           │
│  │  │    fact/:factId         ─────────► TruthFactDetail.jsx       │
│  │  │  /playbooks             ─────────► Playbooks.jsx             │
│  │  │  /playbooks/create      ─────────► CreatePlaybook.jsx        │
│  │  │  /playbooks/create/                                          │
│  │  │    scratch              ─────────► PlaybookBuilder.jsx        │
│  │  │  /playbooks/:id         ─────────► PlaybookDetail.jsx        │
│  │  └──────────────────────────────────────────────┘   │
│  └──────────────────────────────────────────────────┘   │
│                                                         │
│  ┌──────────────────────┐  ┌───────────────────────┐   │
│  │  src/data/mock.js    │  │ src/data/mockKnowledge │   │
│  │  (All mock entities) │  │ .js (Truth Packs)     │   │
│  └──────────────────────┘  └───────────────────────┘   │
│                                                         │
│  ┌──────────────────────────────────────────────────┐   │
│  │  src/components/ui/index.jsx                     │   │
│  │  (Badge, Chip, SlideOut, Modal, TabBar,          │   │
│  │   ThreeDot, SearchBar, FormField, MetricCard,    │   │
│  │   AllFiltersPanel, FilterSection,                │   │
│  │   SegmentedControl)                              │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

**Rendering pattern:** All modals and slide-out panels use `React.createPortal(…, document.body)` at z-index 9999 to avoid stacking context clipping within scrollable containers.

---

## Directory Structure

```
governance-studio/
├── src/
│   ├── main.jsx                        # App entry point — mounts <App> in <BrowserRouter>
│   ├── App.jsx                         # Route table (all 14 routes)
│   ├── index.css                       # Global CSS: design tokens, glass cards, badges,
│   │                                   #   buttons, chips, tab bars, slide-out panels
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Layout.jsx              # Sidebar + top bar, theme toggle, nav state
│   │   │   └── LayoutOld.jsx           # Deprecated previous layout (not in use)
│   │   ├── ui/
│   │   │   └── index.jsx               # Shared component library:
│   │   │                               #   Badge, Chip, TabBar, SlideOut, Modal,
│   │   │                               #   ThreeDot, SearchBar, FormField,
│   │   │                               #   MetricCard, AllFiltersPanel,
│   │   │                               #   FilterSection, SegmentedControl
│   │   └── modules/
│   │       ├── IntelligenceLibrary.jsx # Home / landing dashboard
│   │       ├── source-drives/
│   │       │   ├── SourceDrives.jsx    # Drive list with search + filters
│   │       │   ├── DriveSlideOut.jsx   # Drive preview slide-out panel
│   │       │   └── AddDriveModal.jsx   # Add drive modal
│   │       ├── sandbox/
│   │       │   ├── SandboxPlane.jsx    # Sandbox list + create modal
│   │       │   ├── SandboxDetail.jsx   # Detail page: 5 tabs
│   │       │   │                       #   (Overview/Sources/Claims/Bundles/Promotions)
│   │       │   │                       #   + inline modals: CreateClaimModal,
│   │       │   │                       #   SuggestChangeModal, ViewSuggestionModal
│   │       │   ├── ClaimSlideOut.jsx   # Claim preview panel
│   │       │   ├── SourceSlideOut.jsx  # Source document preview panel
│   │       │   ├── PromotionSlideOut.jsx # Promotion package preview panel
│   │       │   └── PromotionBuilder.jsx  # 4-step full-screen promotion wizard
│   │       ├── truth-plane/
│   │       │   ├── TruthPlane.jsx      # Truth plane list + filters + create modal
│   │       │   ├── TruthPlaneDetail.jsx# Detail: Facts/Review/Proposals/Overview tabs
│   │       │   ├── TruthFactDetail.jsx # Full fact page: 4 tabs (Overview/Evidence/
│   │       │   │                       #   Proposals/Governance Trail)
│   │       │   ├── GovernanceTrail.jsx # GovernanceCompact, GovernanceSnapshot,
│   │       │   │                       #   GovernanceTimeline shared components
│   │       │   ├── ProposeChangeModal.jsx     # Propose fact change modal
│   │       │   ├── ApproveConfirmModal.jsx    # Approval confirmation + WhatChangesView
│   │       │   ├── CreateFactModal.jsx        # Create new fact modal
│   │       │   ├── BreakGlassModal.jsx        # Emergency override modal (2-step gate)
│   │       │   ├── RequestEvidenceModal.jsx   # Request evidence from reviewer
│   │       │   ├── EscalateModal.jsx          # Escalate review queue item
│   │       │   └── EvidenceResponseModal.jsx  # Respond to evidence request
│   │       ├── knowledge/
│   │       │   ├── Knowledge.jsx       # Truth Packs list (grid + list view)
│   │       │   ├── TruthPackDetail.jsx # Pack detail: 6 tabs
│   │       │   │                       #   (Overview/Facts/Users/Agents/
│   │       │   │                       #   Agentic Networks/Activity Log)
│   │       │   └── TruthPackSlideOut.jsx # Pack preview slide-out
│   │       └── playbooks/
│   │           ├── Playbooks.jsx       # Playbook list
│   │           ├── CreatePlaybook.jsx  # Playbook creation entry (template picker)
│   │           ├── PlaybookBuilder.jsx # Multi-step playbook authoring wizard
│   │           │                       #   Steps: Basics/Moment/Objective/Trust/
│   │           │                       #   Phases/Gates + Tenant/Rooftop targeting
│   │           └── PlaybookDetail.jsx  # Playbook detail page
│   └── data/
│       ├── mock.js                     # Primary mock data — exports: drives,
│       │                               #   driveDetail, sandboxes, sandboxDetail,
│       │                               #   claims, bundles, promotions, pkgClaims,
│       │                               #   claimSuggestions, truthPlanes, truthFacts,
│       │                               #   factGovernance, factProposals,
│       │                               #   breakGlassRecords, reviewQueue,
│       │                               #   planeGovernance, planeSourceHealth,
│       │                               #   sourceDocs, govTimeline
│       └── mockKnowledge.js            # Truth Packs mock data — exports: truthPacks
├── docs/
│   └── specs/
│       ├── DESIGN-SYSTEM.md            # Full design token and component spec
│       ├── SOURCE-DRIVES.md            # Source Drives feature spec
│       ├── SANDBOX-PLANE.md            # Sandbox Plane feature spec
│       └── TRUTH-PLANE.md              # Truth Plane feature spec
├── public/                             # Static assets
├── index.html                          # Vite HTML entry
├── vite.config.js                      # Vite config — base '/governance-studio-V1/',
│                                       #   alias '@' → '/src', port 5173
├── tailwind.config.js                  # Tailwind with CSS variable tokens,
│                                       #   Inter + JetBrains Mono fonts
├── postcss.config.js                   # PostCSS: tailwindcss + autoprefixer
├── vercel.json                         # SPA rewrite rule for Vercel
├── package.json                        # Project manifest
├── FIELD_DEFINITIONS.md                # Data model field reference doc
└── FRONTEND_TASKS.md                   # Engineering task specification
```

---

## Data Flow

Because there is no backend, "data flow" means the path from mock data to rendered UI state:

```
1. User navigates to a route (e.g. /sandbox/s1)
   │
   ▼
2. React Router matches the route → renders SandboxDetail.jsx
   │
   ▼
3. Component imports mock arrays at module load time:
   import { sandboxDetail, claims, bundles, promotions,
            sourceDocs, claimSuggestions } from '../../../data/mock'
   │
   ▼
4. Component initialises local React state (useState) for:
   - active tab, selected item, modal open/closed, filter values,
     search query, edit targets, etc.
   │
   ▼
5. Filtering: mock arrays are filtered in-component using .filter()
   driven by search + activeFilters state
   │
   ▼
6. Rendered output: list rows → user clicks Eye icon → opens
   SlideOut via createPortal → user clicks action button →
   opens Modal via createPortal
   │
   ▼
7. Modal/SlideOut interactions are UI-only (no state persistence
   across page refreshes — all state resets on navigation)
   │
   ▼
8. Navigation actions (e.g. "Open Sandbox") call
   useNavigate() from react-router-dom to push a new route
```

---

## Database Schema

There is no real database. The schema is represented by the exported arrays and objects in `src/data/mock.js` and `src/data/mockKnowledge.js`.

### `drives[]`
| Field | Type | Description |
|---|---|---|
| `id` | string | `d1`–`d5` |
| `name` | string | Drive display name |
| `desc` | string | Drive description |
| `owner` | string | Owning department |
| `scope` | `'Company-wide' \| 'Private'` | Visibility |
| `status` | `'active' \| 'none'` | Ingestion status |
| `docs` | number | Document count |
| `sandbox` | number | Sandbox count |
| `lastActivity` | string | Human-readable time |

### `sandboxes[]`
| Field | Type | Description |
|---|---|---|
| `id` | string | `s1`–`s5` |
| `name` | string | Sandbox name |
| `desc` | string | Purpose description |
| `owner` | string | Owning team |
| `scope` | `'Workspace' \| 'Department' \| 'Managed'` | Scope level |
| `lastActivity` | string | Time since last activity |
| `sources` | number | Source document count |
| `bundles` | number | Bundle count |
| `claims` | number | Claim count |
| `promotions` | number | Promotion count |

### `claims[]`
| Field | Type | Description |
|---|---|---|
| `id` | string | Format `RC-XXXX` |
| `title` | string | Short label |
| `status` | `'promotable' \| 'promoted' \| 'conflict' \| 'review'` | Governance lifecycle state |
| `text` | string | Verbatim claim statement (quoted) |
| `context` | string | Interpretive description |
| `doc` | string | Primary source document name |
| `section` | string | Document section |
| `subsection` | string | Document sub-section |
| `time` | string | Human-readable creation time |
| `confidence` | number 0–100 | AI confidence score |
| `risk` | `'Low' \| 'Medium' \| 'High'` | Risk level |
| `polarity` | `'+' \| '−' \| '·'` | Sentiment direction |
| `bundles` | number | Bundle membership count |
| `hasSuggestion` | boolean | Pending change suggestion exists |
| `sources` | `SourceEntry[]` | Optional multi-source array |

### `bundles[]`
| Field | Type | Description |
|---|---|---|
| `id` | string | Format `BU-XXX` |
| `name` | string | Bundle display name |
| `status` | `'promotable' \| 'promoted' \| 'not-promotable'` | Promotion readiness |
| `desc` | string | Bundle description |
| `claims` | number | Claim count |
| `conflicts` | number | Conflict count |
| `promoted` | number | Promoted claims count |
| `time` | string | Last updated time |

### `promotions[]`
| Field | Type | Description |
|---|---|---|
| `id` | string | Format `PKG-XXX` |
| `name` | string | Package name |
| `desc` | string | Description |
| `owner` | string | Owner name |
| `tags` | string[] | Category tags |
| `target` | string | Target Truth Plane name |
| `claims` | number | Claim count in package |
| `status` | `'promoted' \| 'in-progress' \| 'queue'` | Promotion status |
| `time` | string | Time ago |
| `factsCreated` | number | New facts created |
| `factsChanged` | number | Facts modified |
| `failed` | number | Failed promotions |

### `truthPlanes[]`
| Field | Type | Description |
|---|---|---|
| `id` | string | `tp1`–`tp5` |
| `name` | string | Plane name |
| `desc` | string | Governed domain description |
| `owner` | string | Owning team |
| `scope` | string | Visibility scope |
| `facts` | number | Verified fact count |
| `expiring` | number | Facts expiring soon |
| `review` | number | Facts pending review |
| `proposals` | number | Active change proposals |
| `time` | string | Last activity |
| `status` | `'verified' \| 'pending-review' \| 'expiring-soon' \| 'in-proposal'` | Plane health status |
| `tag` | string | Domain category |
| `risk` | `'Low' \| 'Medium' \| 'High'` | Risk level |
| `attestation` | `'full' \| 'missing-approver' \| 'missing-promoter' \| 'missing-resolver'` | Governance completeness |
| `confidence` | number 0–100 | Aggregate confidence |
| `daysAgo` | number | Days since last update |

### `truthFacts[]`
| Field | Type | Description |
|---|---|---|
| `id` | string | Format `TF-XXXX` (TF-0001 through TF-0025) |
| `title` | string | Fact display name |
| `tag` | string | Category (Compliance/Finance/Legal/Operations/Eligibility/Contracts) |
| `status` | `'verified' \| 'pending' \| 'conflict'` | Fact state |
| `text` | string | Verbatim fact statement |
| `approvedBy` | string | Approver name (or `'Auto'` for AI-approved) |
| `autoVerified` | boolean | Whether approved by AI governance engine |
| `time` | string | Approval time |
| `expiry` | string | Validity expiry label |
| `expired` | boolean | Whether expiry has passed |
| `sources` | number | Supporting evidence claim count |
| `proposals` | number | Active change proposal count |
| `confidence` | number 0–100 | Confidence score |
| `risk` | `'Low' \| 'Medium' \| 'High'` | Risk level |
| `polarity` | `'+' \| '−' \| '·'` | Sentiment direction |

### `factGovernance{}`
Keyed by `factId`. Each entry tracks the four governance roles:
```
createdBy:  [personName, date, fulfilled]
promotedBy: [personName, date, fulfilled]
resolvedBy: [personName, date, fulfilled]
approvedBy: [personName, date, fulfilled]
```
`Auto · AI Engine` appears as the person name for AI-verified facts (TF-0016 through TF-0020).

### `factProposals[]`
Complex proposal objects with fields: `id`, `factId`, `origin` (`'manual'` or `'sandbox-promotion'`), `currentText`, `proposedText`, `reason`, `scopeImpact`, `effectiveDate`, `urgency`, `evidence[]`, `submittedBy`, `status`, `comments[]`, `approvers[]`, `changes[]`.

### `breakGlassRecords{}`
Keyed by `factId`. Contains emergency override records with `reason`, `businessImpact`, `temporaryChange`, `duration`, `expiryDate`, `requestedBy`, `status`, and `acknowledged`.

### `reviewQueue[]`
Facts flagged for human review. Each entry includes `reason` (`'expiring-soon'`, `'evidence-changed'`, `'new-conflict'`, `'manual-review'`), `priority`, `daysInQueue`, `required_approvals`, `current_approvals`, `comments[]`, and `changes[]`.

### `truthPacks[]` (mockKnowledge.js)
| Field | Type | Description |
|---|---|---|
| `id` | string | Format `PKG-XXX` |
| `name` | string | Pack name |
| `status` | `'active' \| 'draft' \| 'archived'` | Pack status |
| `accessType` | `'users' \| 'agents' \| 'agentic-networks' \| 'mixed'` | Primary consumer type |
| `factsCount` | number | Number of facts in pack |
| `usersCount` | number | Human users with access |
| `agentsCount` | number | AI agents with access |
| `networksCount` | number | Agentic networks with access |
| `linkedTruthPlane` | string | Source Truth Plane name |
| `linkedTruthPlaneId` | string | Source Truth Plane ID |
| `factIds` | string[] | Array of `TF-XXXX` IDs |
| `recentActivity` | object[] | Activity log entries |
| `accessDetails` | object | Named users, agents, networks |

---

## External Integrations

None. The prototype has no external API integrations, authentication providers, or third-party services. All data is local and static.

The design anticipates these future integrations (inferred from mock data fields and UI patterns):
- An AI extraction/NLP engine (referenced as `Auto · AI Engine` in governance trails)
- A document ingestion pipeline (referenced in `govTimeline` events)
- An agentic network API (agents and agentic networks appear in Knowledge access details)
- Claude 3 / Claude 3.5 (named explicitly in `MOCK_AGENTS` within `TruthPackDetail.jsx`)

---

## Environment Variables

No `.env` file is present. The only runtime-configurable value is the dev server port:

| Variable | Source | Description |
|---|---|---|
| `PORT` | `process.env.PORT` in `vite.config.js` | Dev server port. Defaults to `5173` if not set. |

The Vite `base` path is hardcoded to `'/governance-studio-V1/'` in `vite.config.js`. This must match the deployment subdirectory if not deploying at root.

---

## Deployment Notes

### Scripts (from `package.json`)

| Script | Command | Purpose |
|---|---|---|
| `npm run dev` | `vite --host` | Start dev server, accessible on LAN |
| `npm run build` | `vite build` | Production build to `dist/` |
| `npm run build:watch` | `vite build --watch` | Incremental production build |
| `npm run preview` | `vite preview --port 4173 --host` | Preview production build locally |

### Vercel

`vercel.json` contains a single SPA rewrite rule:
```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```
This routes all paths to `index.html` so React Router handles navigation client-side.

Deploy with: `vercel --prod`

### Netlify

`npm run build && netlify deploy --dir=dist --prod`

### GitHub Pages

Requires a Vite workflow in GitHub Actions. The `base` option in `vite.config.js` (`'/governance-studio-V1/'`) must match the repository subdirectory path.

### Build output

`dist/` — standard Vite static bundle (HTML + JS + CSS).
