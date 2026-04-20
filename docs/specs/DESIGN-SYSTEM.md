# Governance Studio — Design System Reference

## Visual Language

### Philosophy
Governance Studio is a control and decision layer — not a dashboard. Every element must answer: **what's happening, what needs attention, or what can I do now**.

### Aesthetic Direction
- **Dark mode first**: Base `#0a0b0f`, surfaces `#12141a / #1a1d26`
- **Glassmorphism**: Translucent panels, `backdrop-filter: blur(16px)`, soft borders
- **Modular cards**: No heavy full-screen blocks. Content lives in glass cards.
- **Progressive disclosure**: List → Slide-out → Full page. Never dump all detail upfront.

---

## Color System

### Backgrounds
| Token | Value | Usage |
|-------|-------|-------|
| `bg-base` | `#0a0b0f` | App background |
| `bg-surface` | `#12141a` | Sidebar, header |
| `bg-card` | `#1a1d26` | Glass card base |
| `bg-elevated` | `#1f2333` | Modals, slide-outs |
| `bg-glass` | `rgba(255,255,255,0.04)` | Default card bg |

### Semantic State Colors
| State | Hex | Usage |
|-------|-----|-------|
| Purple `state-purple` | `#7c5cfc` | DIAN processing, Sandbox, identity |
| Blue `state-blue` | `#3b82f6` | Claims active work, Truth Plane identity |
| Green `state-green` | `#22c55e` | Truth promoted, verified, ready |
| Amber `state-amber` | `#f59e0b` | Attention, warning, expiring |
| Red `state-red` | `#ef4444` | Conflict, error, break glass |
| Teal `state-teal` | `#14b8a6` | Source Drives identity |

### Text
- Primary: `#f1f5f9`
- Secondary: `#94a3b8`
- Muted: `#475569`
- Accent: `#7c5cfc`

### Borders
- Subtle: `rgba(255,255,255,0.06)`
- Default: `rgba(255,255,255,0.10)`
- Active: `rgba(255,255,255,0.20)`

---

## Typography
- Font: Inter (weights 300, 400, 500, 600)
- Mono: JetBrains Mono (IDs, code, chunk references)
- Page title: 18-20px / 600
- Section title: 14-15px / 600
- Body: 13-14px / 400
- Small / meta: 11-12px / 400-500
- Micro labels: 10-11px / 600 uppercase tracking-wider

---

## Component Library

### Glass Card
```css
background: rgba(255,255,255,0.04);
backdrop-filter: blur(16px);
border: 1px solid rgba(255,255,255,0.08);
border-radius: 12px;
```

### Row Item (list cards)
```css
padding: 14px 16px;
border-radius: 10px;
border: 1px solid rgba(255,255,255,0.06);
background: rgba(255,255,255,0.02);
```
States: hover / selected (purple tint) / conflict (red tint)

### Badges
Format: `badge badge-{variant}`
| Variant | Bg | Text | Border |
|---------|-----|------|--------|
| promotable | purple/15% | #a78bfa | purple/30% |
| promoted | green/15% | #4ade80 | green/30% |
| conflict | red/15% | #f87171 | red/30% |
| review | amber/15% | #fbbf24 | amber/30% |
| pending | amber/12% | #fbbf24 | amber/25% |
| verified | green/15% | #4ade80 | green/30% |
| active | green/12% | #4ade80 | green/25% |
| ingestion | green/12% | #4ade80 | green/25% |
| no-ingestion | slate/30% | #64748b | slate/40% |

### Signal Chips
Smaller inline indicators for confidence/risk.
```css
.chip-green  { background: rgba(34,197,94,0.12);  color: #4ade80; }
.chip-amber  { background: rgba(245,158,11,0.12); color: #fbbf24; }
.chip-red    { background: rgba(239,68,68,0.12);  color: #f87171; }
```

### Buttons
- **Primary**: `linear-gradient(135deg, #7c5cfc, #5b8def)`, white text
- **Secondary**: `rgba(255,255,255,0.06)` bg, muted text, subtle border
- **Ghost**: transparent, muted text, no border
- **Danger**: red tint (for Break Glass, destructive actions)

### Tab Bar
```css
background: rgba(255,255,255,0.03);
border: 1px solid rgba(255,255,255,0.06);
border-radius: 10px;
padding: 3px;
```
Active tab: `linear-gradient(135deg, #7c5cfc, #3b82f6)` bg, white text

### Slide-out Panel
- Width: 520px (filters: 360px)
- `position: fixed; right: 0; height: 100vh`
- Background: `#13151f`
- Border-left: `1px solid rgba(255,255,255,0.08)`
- Enter animation: `slideIn 0.2s ease`
- Backdrop: `rgba(0,0,0,0.3)` overlay on content behind

### Modal
- Max-width: 512px
- Background: `#13151f`
- Border: `1px solid rgba(255,255,255,0.1)`
- Backdrop blur overlay

---

## Interaction Patterns

### Primary Actions (CTA hierarchy)
1. **Primary CTA** — contextual to current state (Promote, Send to Truth Plane, Create Claim)
2. **Secondary actions** — 3-dot menu (Edit, Suggest, Duplicate, Archive, Delete)
3. Never bury frequent actions in menus

### Filter Pattern (standard)
```
[Search bar] [Quick filter 1 ▾] [Quick filter 2 ▾] [...] [All filters] [View toggle]
```
- Quick filters: 2-3 most common dimensions (Status, Owner, Type)
- All Filters: slide-out panel with all dimensions + Apply/Clear

### Progressive Disclosure
| Level | Content |
|-------|---------|
| List row | Name, key status, critical counters, primary CTA |
| Slide-out | AI summary, key metrics, action shortcuts, tabs for detail |
| Full page | All data, all actions, sub-tabs for deep detail |

### Extracted Entities Display
6-entity grid (2 columns) with distinct colors per type:
- ORGANIZATION — blue `#60a5fa`
- DATE — purple `#a78bfa`
- AMOUNT — green `#4ade80`
- LOCATION — red `#f87171`
- PERSON — amber `#fbbf24`
- REFERENCE — teal `#2dd4bf`

---

## Navigation Structure
```
Sidebar (220px expanded / 56px collapsed)
├── Control Center (disabled V1)
├── My Work (disabled V1)
├── Intelligence Library → /intelligence-library
│   └── Source Drives → /intelligence-library/source-drives
├── Truth Plane → /truth-plane
│   └── [Plane detail] → /truth-plane/:id
│       └── [Fact full page] → /truth-plane/:id/fact/:factId
├── Sandbox Plane → /sandbox
│   └── [Sandbox detail] → /sandbox/:id
│       └── Promotion Builder (overlay, no route change)
├── Builder (disabled V1)
├── Deploy (disabled V1)
└── Admin (disabled V1)
```

Active state: purple left border + gradient background tint

---

## V1 Scope — What's In vs Out

### ✅ In scope
- Intelligence Library home
- Source Drives (list + slide-out + drive detail + file list + filters + modals)
- Sandbox Plane (list + detail with all 5 tabs + all claim modals + promotion builder 3 steps)
- Truth Plane (list + detail + fact slide-out + fact full page 4 tabs)
- Dark mode only

### ⏳ Not in scope (V2+)
- Light mode (design exists, not wired)
- Control Center
- My Work
- Builder
- Deploy
- Admin
- Knowledge module
- Break Glass confirmation modal
- Truth Plane Overview/Review/Proposals tab content
- Sandbox Ingestion Pipeline and Governance & Quality sub-tabs
- AI Builder in Promotion Builder
- Real API integration
