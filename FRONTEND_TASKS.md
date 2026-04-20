# Frontend Implementation Tasks — Governance Studio
**Session:** Claims Tab & Create Claim overhaul  
**Stack:** React + Vite + Tailwind CSS (JSX, no TypeScript)  
**Key patterns:** `createPortal(…, document.body)` for all modals/slide-outs · React Router v6 · mock data in `src/data/mock.js`

---

## 1. Mock Data — `src/data/mock.js`

### 1.1 Add `hasSuggestion` flag to claims

In the `claims` array, mark two existing claims as having pending suggestions:

```js
// RC-0003 — promotable, non-conflict, has a suggestion from a colleague
{ id: 'RC-0003', ..., hasSuggestion: true, ... }

// RC-0004 — conflict status, also has a suggestion
{ id: 'RC-0004', ..., hasSuggestion: true, ... }
```

### 1.2 Export `claimSuggestions` map

Add and export a new object keyed by claim ID. Each entry represents one pending suggestion:

```js
export const claimSuggestions = {
  'RC-0003': {
    author: 'Sarah Chen',
    initials: 'SC',
    avatarGradient: 'linear-gradient(135deg,#a78bfa,#60a5fa)',
    time: '1 hour ago',
    suggestedText: '"This Agreement shall automatically renew for successive one-year terms unless either party provides written notice of non-renewal at least ninety (90) days prior to the current term expiration date."',
    rationale: 'Extending the notice window from 60 to 90 days gives both parties adequate time to plan for transitions and reduces last-minute contract reviews during quarter-end busy periods.',
    confidence: 95,
    risk: 'Low',
    polarity: '−',
    notes: 'Validated against renewal terms in the updated Global Partnership Framework v2.1.',
  },
  'RC-0004': {
    author: 'Alex Mercer',
    initials: 'AM',
    avatarGradient: 'linear-gradient(135deg,#f59e0b,#ef4444)',
    time: '3 hours ago',
    suggestedText: '"All invoices shall be paid within forty-five (45) days of the invoice date, with a 2% early-payment discount applicable if settled within fifteen (15) days of issuance."',
    rationale: 'Aligning with the industry-standard Net-45 window reduces late-payment disputes. The early-payment incentive benefits both parties and improves cash-flow predictability.',
    confidence: 91,
    risk: 'Medium',
    polarity: '−',
    notes: 'Aligns with the revised Accounts Payable policy approved in Q4 2024. Cross-referenced with MSA Addendum B, Section 3.2.',
  },
}
```

**Shape of each entry:**

| Field | Type | Notes |
|---|---|---|
| `author` | string | Display name of the person who submitted the suggestion |
| `initials` | string | 2-char initials for avatar |
| `avatarGradient` | string | CSS linear-gradient for the avatar pill |
| `time` | string | Human-readable time ago |
| `suggestedText` | string | Full proposed replacement for the claim text |
| `rationale` | string | Why the change was suggested |
| `confidence` | number | Suggested confidence % (0–100) |
| `risk` | `'Low' \| 'Medium' \| 'High'` | Suggested risk level |
| `polarity` | `'+' \| '−' \| '·'` | Suggested polarity |
| `notes` | string | Optional extra context |

---

## 2. Claims Tab — `src/components/modules/sandbox/SandboxDetail.jsx`

### 2.1 State additions to `ClaimsTab`

Add the following state variables inside the `ClaimsTab` function:

```js
const [editClaim, setEditClaim] = useState(null)          // opens Edit modal
const [suggestClaim, setSuggestClaim] = useState(null)     // opens Suggest Change modal
const [viewSuggestionClaim, setViewSuggestionClaim] = useState(null) // opens View Suggestion modal
```

Import `claimSuggestions` from mock data at the top of the file.

### 2.2 Claim card action buttons

Each claim card has an actions area (`ml-auto flex items-center gap-1.5`). The full button logic, in order:

```
1. [Promote button]       — only when status === 'promotable'
2. [✓ Promoted badge]     — only when status === 'promoted'
3. [View Suggestion btn]  — only when hasSuggestion && status !== 'conflict'  (blue)
4. [View Suggestion btn]  — only when status === 'conflict'                   (amber)
5. [Review button]        — only when status === 'review'
6. [Eye icon button]      — always present (opens ClaimSlideOut)
7. [ThreeDot menu]        — always present
```

**Eye icon button (standard on all operational cards):**
```jsx
<button className="btn-ghost p-1.5 rounded-lg" title="Preview"
  onClick={e => { e.stopPropagation(); setSelected(claim) }}>
  <Eye size={14} />
</button>
```

**View Suggestion — non-conflict (blue):**
```jsx
{claim.hasSuggestion && claim.status !== 'conflict' && (
  <button className="btn-secondary text-xs py-1 px-2.5 gap-1"
    style={{ color: '#60a5fa', borderColor: 'rgba(96,165,250,0.3)' }}
    onClick={e => { e.stopPropagation(); setViewSuggestionClaim(claim) }}>
    <MessageSquare size={11} /> View Suggestion
  </button>
)}
```

**View Suggestion — conflict (amber):**
```jsx
{claim.status === 'conflict' && (
  <button className="btn-secondary text-xs py-1 px-2.5 gap-1"
    style={{ color: '#fbbf24', borderColor: 'rgba(245,158,11,0.3)' }}
    onClick={e => { e.stopPropagation(); setViewSuggestionClaim(claim) }}>
    <MessageSquare size={11} /> View Suggestion
  </button>
)}
```

> Both "View Suggestion" variants use `MessageSquare` icon (not `Eye`). This is the system standard for suggestion-related actions.

### 2.3 ThreeDot menu — Claim cards

Three items only (no "Add to Bundle", no "Duplicate Claim"):

```js
[
  { label: 'Edit Claim',     onClick: e => { e?.stopPropagation?.(); setEditClaim(claim) } },
  { label: 'Suggest Change', onClick: e => { e?.stopPropagation?.(); setSuggestClaim(claim) } },
  { label: 'Quick Promote',  onClick: () => {} },
]
```

### 2.4 ThreeDot menu — Source document cards (SourcesTab)

Three items only (no "Download"):

```js
[
  { label: 'View Details',           onClick: () => setSelected(doc) },
  { label: 'Re-process',             onClick: () => {} },
  { label: 'Remove from Sandbox',    onClick: () => {}, danger: true },
]
```

### 2.5 Modal render block (bottom of ClaimsTab return)

```jsx
{selected && <ClaimSlideOut claim={selected} onClose={() => setSelected(null)} />}
{showCreate && <CreateClaimModal onClose={() => setShowCreate(false)} />}
{editClaim  && <CreateClaimModal initialData={editClaim} onClose={() => setEditClaim(null)} />}
{suggestClaim && <SuggestChangeModal claim={suggestClaim} onClose={() => setSuggestClaim(null)} />}
{viewSuggestionClaim && claimSuggestions[viewSuggestionClaim.id] && (
  <ViewSuggestionModal
    claim={viewSuggestionClaim}
    suggestion={claimSuggestions[viewSuggestionClaim.id]}
    onClose={() => setViewSuggestionClaim(null)}
  />
)}
```

---

## 3. SuggestChangeModal

**Trigger:** ThreeDot → "Suggest Change" on any claim card.  
**File:** Inline in `SandboxDetail.jsx` (or extract to `SuggestChangeModal.jsx`).  
**Portal:** `createPortal(…, document.body)` — z-index `9999`.

### Layout
- Fixed overlay `inset-0`, backdrop blur, click-outside closes
- Modal width: `maxWidth: 780`, `maxHeight: 88vh`, `border-radius: rounded-2xl`
- **Two-column body** — left column (current claim, read-only) + right column (suggestion fields, editable)

### Props
```js
{ claim, onClose }
```

### State
```js
const [suggestedText, setSuggestedText] = useState('')
const [rationale, setRationale]         = useState('')
const [risk, setRisk]                   = useState('')
const [confidence, setConfidence]       = useState('')
const [polarity, setPolarity]           = useState('')
const [notes, setNotes]                 = useState('')
```

### Header
- Icon: `MessageSquare` (16px), background `rgba(124,92,252,0.15)`, border `rgba(124,92,252,0.25)`, color `#a78bfa`
- Title: "Suggest a Change"
- Subtitle: "Submit an edit suggestion for this claim — all fields are optional"
- Claim ID badge (font-mono, muted)
- `X` close button

### Left column — "Current Claim" (read-only)
Section label: `CURRENT CLAIM` in `#a78bfa`

1. **Claim statement block** — purple-tinted card (`rgba(124,92,252,0.08)` bg, `rgba(124,92,252,0.2)` border), "C" circle badge, claim text with quotes stripped
2. **Title** — plain label + value
3. **3-col metric chips** — Confidence / Risk / Polarity, each colored per value:
   - Green `#4ade80` for Confidence and Low risk / Positive polarity
   - Amber `#fbbf24` for Medium risk
   - Red `#f87171` for High risk / Negative polarity
4. **Source row** — document name, section, subsection, timestamp in a lightly bordered card

### Right column — "Your Suggestion" (editable)
Section label: `YOUR SUGGESTION` in `#60a5fa`. All fields are optional.

| Field | Type | Rows | Placeholder |
|---|---|---|---|
| Suggested Claim Text | textarea | 5 | "Propose an updated version..." |
| Rationale | textarea | 3 | "Explain why this change improves the claim..." |
| Confidence (%) | text input | — | Current value as placeholder |
| Risk Level | select | — | "— keep —" + Low / Medium / High |
| Polarity | select | — | "— keep —" + Positive / Negative / Neutral |
| Additional Notes | textarea | 2 | "Any extra context, references, or comments..." |

### Footer
- Left: hint text "Suggestions are reviewed before any changes are applied."
- Right: `Cancel` (btn-secondary) + `Send Suggestion` (gradient button `linear-gradient(135deg, #7c5cfc, #60a5fa)` + `Send` icon, box-shadow `0 2px 12px rgba(124,92,252,0.35)`)

---

## 4. ViewSuggestionModal

**Trigger:** "View Suggestion" button on claim cards (both conflict and hasSuggestion variants).  
**File:** Inline in `SandboxDetail.jsx` (or extract to `ViewSuggestionModal.jsx`).  
**Portal:** `createPortal(…, document.body)` — z-index `9999`.

### Layout
Identical to `SuggestChangeModal` (same 780px two-column structure), but right column is **read-only**.

### Props
```js
{ claim, suggestion, onClose }
// suggestion comes from claimSuggestions[claim.id]
```

### State
```js
const [declining, setDeclining]       = useState(false)
const [declineReason, setDeclineReason] = useState('')
```

### Header
- Icon: `Eye` (16px), background `rgba(245,158,11,0.15)`, border `rgba(245,158,11,0.25)`, color `#fbbf24`
- Title: "View Suggestion"
- Subtitle row: avatar pill (from `suggestion.avatarGradient` + `suggestion.initials`) + "Suggested by **{suggestion.author}** · {suggestion.time}"
- Claim ID badge
- `X` close button

### Left column — "Current Claim" (identical to SuggestChangeModal left column)
Same purple read-only claim card, title, metric chips, source row. No changes needed.

### Right column — "Suggested Change" (read-only)
Section label: `SUGGESTED CHANGE` in `#fbbf24`

1. **Suggested claim text block** — amber-tinted card (`rgba(245,158,11,0.07)` bg, `rgba(245,158,11,0.2)` border), text with quotes stripped
2. **Rationale** — read-only styled container (`rgba(255,255,255,0.04)` bg, `rgba(255,255,255,0.08)` border)
3. **Metric chips** — same 3-col grid but values from `suggestion` object
4. **Additional Notes** — read-only styled container (only render if `suggestion.notes` is non-empty)

**Helper inner components:**
```jsx
// Colored read-only metric chip
const MetricChip = ({ label, value, color }) => (...)

// Generic read-only text block
const ReadBlock = ({ label, value, optional }) => (...)
```

### Footer — two states

**Default state (`declining === false`):**
- Left: "Review the suggested changes before accepting or declining."
- Right:
  - `Decline` button: `rgba(239,68,68,0.12)` bg, `#f87171` text, `rgba(239,68,68,0.25)` border, `X` icon → sets `declining(true)`
  - `Accept` button: gradient `linear-gradient(135deg, #22c55e, #16a34a)`, white text, `CheckCircle` icon, box-shadow `0 2px 12px rgba(34,197,94,0.3)` → calls `onClose()`

**Declining state (`declining === true`):**
Replace footer content with:
```
Label:   "Want to give a reason why?"  color #fbbf24  +  "(optional)" muted
Field:   textarea, rows=2, autoFocus, placeholder "Let the author know why their suggestion was declined..."
Buttons: [Cancel → setDeclining(false)]  [Confirm Decline → onClose()]
         Cancel = btn-secondary
         Confirm Decline = rgba(239,68,68,0.15) bg, #f87171 text, rgba(239,68,68,0.3) border, X icon
```

---

## 5. CreateClaimModal — Full Redesign + Edit Mode

**Trigger (create):** "+ Create Claim" button in Claims tab toolbar.  
**Trigger (edit):** ThreeDot → "Edit Claim" on any claim card.  
**Portal:** `createPortal(…, document.body)` — z-index `9999`.  
**Width:** `maxWidth: 640`, `maxHeight: 90vh`.

### Props
```js
{ onClose, initialData = null }
// initialData = null  →  Create mode
// initialData = claim →  Edit mode (pre-populated)
```

### Mode detection
```js
const isEdit = !!initialData
const polarityMap = { '+': 'Positive', '−': 'Negative', '·': 'Neutral' }
```

### State
```js
const [source, setSource]               = useState('Document')
const [selectedDocs, setSelectedDocs]   = useState([])
const [selectedBundles, setSelectedBundles] = useState([])
const [selectedPerson, setSelectedPerson] = useState(null)
const [personOpen, setPersonOpen]       = useState(false)
```

### Header
- **Create mode:** Title "Create New Claim" · Subtitle "Add a new claim manually with all required information"
- **Edit mode:** Title "Edit Claim" + claim ID badge (`rgba(124,92,252,0.12)` bg, `#a78bfa` text) · Subtitle "Update the claim details below."

### Section header pattern
Each section starts with a small divider-style header:
```jsx
const SectionHeader = ({ icon: Icon, label, color = '#a78bfa' }) => (
  <div className="flex items-center gap-2 pb-1"
    style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
    <Icon size={13} style={{ color }} />
    <p className="text-xs font-semibold text-text-secondary">{label}</p>
  </div>
)
```

### Section 1 — Basic Information (`FileText` icon, default purple)

| Field | Type | Required | Pre-populate (edit mode) |
|---|---|---|---|
| Title | text input | Yes | `initialData.title` |
| Context | textarea (rows=3) | Yes | Generic description string |
| Claim | textarea (rows=4) | Yes | `initialData.text` (strip surrounding `"`) |

### Section 2 — Source (`FileText` icon, `#60a5fa`)

`SegmentedControl` with options `['Document', 'Human']`.

**When "Document" selected:**
- Label: "Select Documents"
- 2-column grid of 4 checkboxes. Each row is a label with:
  - `FileText` icon (color `#f87171`) + filename
  - Selected state: `rgba(124,92,252,0.08)` bg, `rgba(124,92,252,0.35)` border
  - Unselected state: `rgba(255,255,255,0.03)` bg, `rgba(255,255,255,0.08)` border
- Dashed "Upload Document" button below grid

**File list:**
```
Q1_Enterprise_Contracts.pdf
Master_Service_Agreement.pdf
Addendum_2024_Q1.pdf
Payment_Terms_Schedule.pdf
```

**When "Human" selected:**
- Label: "Select Person"
- Custom dropdown trigger button (shows placeholder or selected person with avatar)
- Inline list opens below trigger (NOT absolutely positioned — avoids overflow clipping in scrollable modal)
- List background: solid `#131825`, border `rgba(124,92,252,0.25)`
- Each row: gradient avatar pill + **Name** + `(email)` + `CheckCircle` on selected item

**People list:**
```js
[
  { name: 'Sarah Chen',      email: 'sarah.chen@company.com',      initials: 'SC', gradient: 'linear-gradient(135deg,#a78bfa,#60a5fa)' },
  { name: 'Michael Torres',  email: 'michael.torres@company.com',  initials: 'MT', gradient: 'linear-gradient(135deg,#f59e0b,#ef4444)' },
  { name: 'Emily Rodriguez', email: 'emily.rodriguez@company.com', initials: 'ER', gradient: 'linear-gradient(135deg,#4ade80,#22d3ee)' },
  { name: 'David Kim',       email: 'david.kim@company.com',       initials: 'DK', gradient: 'linear-gradient(135deg,#f87171,#fb923c)' },
]
```

> Trigger border changes to `rgba(124,92,252,0.5)` when open. Chevron rotates 90° when open.

### Section 3 — Metrics (`Target` icon, `#60a5fa`)

3-column grid:

| Field | Type | Default (create) | Pre-populate (edit) |
|---|---|---|---|
| Confidence (%) | text input | `85` | `initialData.confidence` |
| Risk Level | select | `Low` | `initialData.risk` |
| Polarity | select | `Positive` | `polarityMap[initialData.polarity]` |

### Section 4 — Bundles (`Package` icon, `#fbbf24`)

Full-width list of bundle rows (one per line, not grid). Each row is a checkbox label with:
- `Package` icon (color `#fbbf24`)
- Purple ID badge (font-mono)
- Bundle name truncated

Selection state same as Documents: purple border/bg when checked.
Render from the `bundles` array imported from mock data.

### Section 5 — Details (`Sparkles` icon, default purple)

All fields in this section are informational or optional — none are required.

**Order:**

1. **Amount** — optional editable input, placeholder `"e.g., $2,500,000"` — **first field**
2. **Reference** — optional editable input, placeholder `"e.g., Section 4.2.1"` — **second field**
3. **Created By** — read-only auto block (not an input):
   - Shows logged-in user avatar + name "John Doe"
   - `Auto` badge (`rgba(96,165,250,0.1)` bg, `#60a5fa` text)
   - Hint: "Taken from your logged-in account"
4. **Organization** — read-only auto block: "Acme Corporation" · Hint: "Automatically detected from your workspace"
5. **Location** — read-only auto block: "New York, NY" · Hint: "Automatically detected from your workspace"

**Read-only auto block pattern** (same for Created By, Organization, Location):
```jsx
<div className="space-y-1">
  <p className="text-xs font-medium text-text-secondary flex items-center gap-1.5">
    <Icon size={11} style={{ color: '#60a5fa' }} />
    {label}
    <span className="text-[10px] font-normal px-1.5 py-0.5 rounded"
      style={{ background: 'rgba(96,165,250,0.1)', color: '#60a5fa' }}>Auto</span>
  </p>
  <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs"
    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
    {/* avatar + value */}
  </div>
  <p className="text-[11px] text-text-muted">{hint}</p>
</div>
```

### Footer

- `Cancel` → `btn-secondary` → calls `onClose()`
- Submit → `btn-primary`:
  - **Create mode:** `<Plus size={13} /> Create Claim`
  - **Edit mode:** `<CheckCircle size={13} /> Save Changes`

---

## 6. Required Lucide Icons (additions to existing imports)

The following icons are needed in `SandboxDetail.jsx` in addition to whatever was already imported:

| Icon | Used in |
|---|---|
| `MessageSquare` | SuggestChangeModal header, "View Suggestion" buttons |
| `Send` | SuggestChangeModal footer |
| `Target` | CreateClaimModal — Metrics section header |
| `MapPin` | CreateClaimModal — Location auto field |
| `User` | CreateClaimModal — Created By / Organization auto fields |

---

## 7. Design Tokens Quick Reference

All modals share the same base structure:

```
Portal:       createPortal(…, document.body)
z-index:      9999 (modal) / 9998 (backdrop)
Backdrop:     rgba(0,0,0,0.65) + backdropFilter: blur(4px)
Modal bg:     var(--modal-bg)
Modal border: var(--modal-border)
Dividers:     1px solid var(--slideout-border)
Border radius: rounded-2xl
```

**Color system for governance metrics:**
```
Confidence / Low risk / Positive polarity  →  #4ade80 (green)
Medium risk                                →  #fbbf24 (amber)
High risk / Negative polarity              →  #f87171 (red)
Neutral                                    →  #94a3b8 (gray)
Claims / AI features                       →  #a78bfa (purple)
Source / Technical                         →  #60a5fa (blue)
```

---

## 8. File Change Summary

| File | Changes |
|---|---|
| `src/data/mock.js` | Add `hasSuggestion: true` to RC-0003 and RC-0004 · Export `claimSuggestions` map |
| `src/components/modules/sandbox/SandboxDetail.jsx` | Add `SuggestChangeModal` component · Add `ViewSuggestionModal` component · Rebuild `CreateClaimModal` (sections, human source, auto fields, edit mode) · Update `ClaimsTab` state + card actions + ThreeDot menu · Update SourcesTab ThreeDot menu |
