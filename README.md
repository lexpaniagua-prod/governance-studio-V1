# Governance Studio — Prototype

React prototype for Governance Studio V1. Covers Intelligence Library, Source Drives, Sandbox Plane, and Truth Plane.

## Quick Start

### Prerequisites
- Node.js 18+
- npm or pnpm

### Install & Run
```bash
cd governance-studio
npm install
npm run dev
```
Opens at http://localhost:5173

### Build for production
```bash
npm run build
npm run preview   # preview production build locally
```

---

## Deploy Online (share with team)

### Option A — Vercel (recommended, free)
```bash
npm install -g vercel
vercel login
vercel          # first deploy (follow prompts)
vercel --prod   # subsequent deploys
```
Your prototype will be live at `https://governance-studio-[hash].vercel.app`

### Option B — Netlify
```bash
npm install -g netlify-cli
netlify login
npm run build
netlify deploy --dir=dist --prod
```

### Option C — GitHub Pages
Push to GitHub, then in repo Settings → Pages → Deploy from GitHub Actions using the Vite workflow.

---

## Project Structure

```
src/
├── components/
│   ├── layout/
│   │   └── Layout.jsx              # Sidebar + top bar
│   ├── ui/
│   │   └── index.jsx               # Reusable: Badge, Chip, SlideOut, Modal, TabBar, etc.
│   └── modules/
│       ├── IntelligenceLibrary.jsx # Home / landing
│       ├── source-drives/
│       │   ├── SourceDrives.jsx    # Drive list
│       │   ├── DriveSlideOut.jsx   # Preview panel
│       │   └── AddDriveModal.jsx   # Add drive modal
│       ├── sandbox/
│       │   ├── SandboxPlane.jsx    # Sandbox list
│       │   ├── SandboxDetail.jsx   # Detail + all tabs (Claims/Bundles/Promotions/Overview)
│       │   ├── ClaimSlideOut.jsx   # Claim preview panel
│       │   └── PromotionBuilder.jsx # 3-step builder (full-screen overlay)
│       └── truth-plane/
│           ├── TruthPlane.jsx      # Truth plane list
│           └── TruthPlaneDetail.jsx # Detail + Facts tab + Fact slide-out
├── data/
│   └── mock.js                     # All mock data (drives, sandboxes, claims, bundles, facts)
├── App.jsx                         # Routes
├── main.jsx                        # Entry point
└── index.css                       # Design system CSS (glass, badges, chips, buttons, etc.)

docs/
└── specs/
    ├── DESIGN-SYSTEM.md            # Color tokens, components, patterns
    ├── SOURCE-DRIVES.md            # Source Drives full spec
    ├── SANDBOX-PLANE.md            # Sandbox Plane full spec
    └── TRUTH-PLANE.md              # Truth Plane full spec
```

---

## Design Specs for Engineering

All specs are in `docs/specs/`. Read these before implementing production code:

| File | Covers |
|------|--------|
| `DESIGN-SYSTEM.md` | Colors, typography, components, patterns, navigation |
| `SOURCE-DRIVES.md` | Drive list, slide-out, add modal, drive detail page |
| `SANDBOX-PLANE.md` | All 5 sandbox tabs, all modals, promotion builder |
| `TRUTH-PLANE.md` | Fact list, slide-out, full page (4 tabs) |

---

## Active Routes

| URL | Module |
|-----|--------|
| `/intelligence-library` | Intelligence Library home |
| `/intelligence-library/source-drives` | Source Drives list |
| `/sandbox` | Sandbox Plane list |
| `/sandbox/:id` | Sandbox detail (all tabs) |
| `/truth-plane` | Truth Plane list |
| `/truth-plane/:id` | Truth Plane detail (Facts tab) |

---

## Tech Stack
- React 18 + React Router 6
- Vite (build tool)
- Tailwind CSS 3
- Recharts (charts)
- Lucide React (icons)
- clsx (conditional classes)

---

## Known V1 Limitations
- All data is mock (no API)
- Light mode not wired
- Some tabs show placeholder text (Truth Plane Overview/Review/Proposals, Sandbox Ingestion Pipeline)
- Promotion Builder AI Builder / Wizard buttons are UI-only
- Break Glass has no confirmation modal yet

See `docs/specs/DESIGN-SYSTEM.md` → V1 Scope section for full list.
