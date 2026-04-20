# Field Definitions — Governance Studio
**Session scope:** Claims Tab modals & data model additions  
**Reference:** All fields listed here correspond to the prototype built in `SandboxDetail.jsx` and `src/data/mock.js`

---

## 1. Claim (data model) — `src/data/mock.js › claims[]`

Core entity. Each claim is an AI-extracted or manually created assertion derived from one or more source documents.

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | Yes | Unique identifier. Format: `RC-XXXX` (e.g. `RC-0001`). Assigned by the system. |
| `title` | string | Yes | Short human-readable label for the claim. Displayed as the primary name in all card and list views. |
| `status` | `'promotable' \| 'promoted' \| 'conflict' \| 'review'` | Yes | Governance lifecycle state. Controls which action buttons appear on the card. |
| `text` | string | Yes | The full verbatim claim statement, typically quoted directly from the source document. |
| `context` | string | Yes | A plain-language description of what the claim governs and why it exists. Provides the interpretive frame for reviewers. Shown in Suggest Change and View Suggestion modals. |
| `doc` | string | Yes | Display name of the primary source document (may be truncated). Used as the single-source fallback when `sources[]` is not present. |
| `section` | string | Yes | Top-level section within the source document where the claim was extracted. |
| `subsection` | string | Yes | Sub-section or clause within the document section. Provides more precise traceability. |
| `time` | string | Yes | Human-readable time since the claim was created or last updated (e.g. `"2 hours ago"`). |
| `confidence` | number (0–100) | Yes | AI-assigned confidence score for the extraction quality or claim validity. Displayed as a percentage chip. |
| `risk` | `'Low' \| 'Medium' \| 'High'` | Yes | Risk level associated with the claim. Drives color-coding across all views (green / amber / red). |
| `polarity` | `'+' \| '−' \| '·'` | Yes | Sentiment direction of the claim. `+` = Positive, `−` = Negative, `·` = Neutral. |
| `bundles` | number | No | Count of bundles this claim belongs to. Displayed as a muted counter (`× N`) on the card. |
| `hasSuggestion` | boolean | No | When `true`, a pending change suggestion exists for this claim. Triggers the "View Suggestion" button on the claim card. |
| `sources` | `SourceEntry[]` | No | Array of all source documents that back this claim. When present, replaces the single `doc/section/subsection` display with a multi-source list. See **SourceEntry** below. |

### SourceEntry (within `sources[]`)

| Field | Type | Required | Description |
|---|---|---|---|
| `doc` | string | Yes | Display name of the source document. |
| `section` | string | Yes | Section within the document. |
| `subsection` | string | Yes | Sub-section or clause within the section. |
| `time` | string | Yes | When this source was linked or processed. |

---

## 2. Claim Suggestion (data model) — `src/data/mock.js › claimSuggestions{}`

Keyed object (`claimId → SuggestionEntry`). Each entry represents one pending suggestion submitted by a collaborator for a specific claim.

| Field | Type | Required | Description |
|---|---|---|---|
| `author` | string | Yes | Full name of the person who submitted the suggestion. |
| `initials` | string | Yes | Two-character initials derived from the author's name. Used to render the avatar pill. |
| `avatarGradient` | string | Yes | CSS `linear-gradient` string used as the avatar background color. Each person has a consistent gradient. |
| `time` | string | Yes | Human-readable time since the suggestion was submitted (e.g. `"3 hours ago"`). |
| `suggestedText` | string | Yes | The proposed replacement for the claim's `text` field. Full verbatim statement. |
| `suggestedContext` | string \| null | No | Proposed replacement for the claim's `context` field. `null` means no context change is suggested — the "Same Context" placeholder is shown. |
| `suggestedSource` | string \| null | No | Proposed new source reference if the suggester believes the claim should point to a different document or section. `null` means no source change — the "Same Source" placeholder is shown. |
| `rationale` | string | Yes | The suggester's explanation for why the change improves the claim. Displayed full-width above the comparison columns in View Suggestion. |
| `confidence` | number (0–100) | No | Suggested replacement confidence score. If omitted, current value is kept. |
| `risk` | `'Low' \| 'Medium' \| 'High'` | No | Suggested replacement risk level. |
| `polarity` | `'+' \| '−' \| '·'` | No | Suggested replacement polarity. |
| `notes` | string | No | Any supplementary context, cross-references, or policy citations relevant to the suggestion. Displayed at the bottom of View Suggestion. Empty string = section not rendered. |

---

## 3. Suggest a Change Modal

Triggered from ThreeDot → **Suggest Change** on any claim card. All fields in this modal are optional — the user may fill in as many or as few as they wish.

### Recipient (who receives the suggestion)

| Field | Type | Required | Description |
|---|---|---|---|
| `sendTo` | `'All' \| 'Person' \| 'Department'` | No | Routing scope for the suggestion. Default: `'All'`. |
| `sendToPerson` | Person object \| null | Conditional | Required when `sendTo === 'Person'`. The selected team member who will receive the suggestion. |
| `sendToDept` | string \| null | Conditional | Required when `sendTo === 'Department'`. The selected department name (e.g. `'Legal'`, `'Finance'`). |

**Routing options:**
- **All** — Suggestion is visible to every member with access to the claim. No additional selection needed.
- **Person** — Suggestion is directed to a specific individual. Displays inline person picker.
- **Department** — Suggestion is directed to an entire department. Displays inline department picker.

### Suggestion Content

| Field | Type | Required | Description |
|---|---|---|---|
| `suggestedText` | string | No | Proposed new wording for the claim's main statement (`text` field). |
| `suggestedContext` | string | No | Proposed new context description for the claim (`context` field). |
| `rationale` | string | No | Explanation of why the suggested changes are an improvement. This becomes the `rationale` field in the stored suggestion. |
| `confidence` | string (numeric) | No | Proposed override for the confidence score. Empty = keep current value. |
| `risk` | `'' \| 'Low' \| 'Medium' \| 'High'` | No | Proposed override for the risk level. Empty (`— keep —`) = keep current value. |
| `polarity` | `'' \| '+' \| '−' \| '·'` | No | Proposed override for polarity. Empty (`— keep —`) = keep current value. |
| `suggestedSource` | string | No | Proposed new source reference (free-text). Indicates that the claim should point to a different document, section, or external reference. |
| `notes` | string | No | Any additional context, policy references, or comments not covered by the other fields. |

---

## 4. View Suggestion Modal

Read-only modal for reviewing a pending suggestion. Opened via the **"View Suggestion"** button on claim cards (`hasSuggestion: true` or `status === 'conflict'`).

### Header

| Field | Source | Description |
|---|---|---|
| Claim ID | `claim.id` | Displayed as a monospace badge in the header. |
| Author name | `suggestion.author` | The person who submitted the suggestion. |
| Author avatar | `suggestion.initials` + `suggestion.avatarGradient` | Rendered as a small gradient pill next to the author name. |
| Submission time | `suggestion.time` | How long ago the suggestion was submitted. |

### Left column — Current Claim (read-only)

Displays the claim's existing values for comparison.

| Section | Field shown | Source |
|---|---|---|
| Claim | Claim text | `claim.text` (quotes stripped) |
| Claim | Title | `claim.title` |
| Context | Context description | `claim.context` |
| Metrics | Confidence | `claim.confidence` |
| Metrics | Risk | `claim.risk` |
| Metrics | Polarity | `claim.polarity` (mapped to label) |
| Sources | All source entries | `claim.sources[]` or fallback single source fields |

### Right column — Suggested Change (read-only)

Displays what the suggester proposes to change. Fields that were not changed show a placeholder.

| Section | Field shown | Source | Placeholder when null/empty |
|---|---|---|---|
| Claim | Suggested text | `suggestion.suggestedText` | — (always present) |
| Context | Suggested context | `suggestion.suggestedContext` | "Same Context — No context change suggested" |
| Metrics | Confidence | `suggestion.confidence` | — (always present) |
| Metrics | Risk | `suggestion.risk` | — (always present) |
| Metrics | Polarity | `suggestion.polarity` | — (always present) |
| Source | Suggested source | `suggestion.suggestedSource` | "Same Source — No source change suggested" |
| Sent By | Author name + time | `suggestion.author`, `suggestion.time`, `suggestion.avatarGradient`, `suggestion.initials` | — |

### Full-width sections

| Section | Source | Condition |
|---|---|---|
| Rationale | `suggestion.rationale` | Always shown (above the column labels) |
| Additional Notes | `suggestion.notes` | Only rendered if `suggestion.notes` is a non-empty string |

### Footer actions

| Action | Behavior |
|---|---|
| **Accept** | Applies the suggestion. Closes modal. |
| **Decline** | Reveals an inline "Want to give a reason why?" text area. |
| Decline reason | Optional free-text field explaining why the suggestion was rejected. Submitted alongside the decline action. |
| **Confirm Decline** | Finalizes the rejection (with or without a reason). Closes modal. |
| **Cancel** (in decline state) | Returns to the default Accept / Decline footer without submitting. |

---

## 5. Create / Edit Claim Modal

Single modal component used for both creating a new claim and editing an existing one. Edit mode is activated by passing `initialData` (the existing claim object). All fields marked as **Auto** are read-only and populated from the user session or workspace settings.

### Basic Information

| Field | Type | Required | Edit mode default | Description |
|---|---|---|---|---|
| Title | text input | Yes | `claim.title` | Short label identifying the claim. Shown in all list and card views. |
| Context | textarea | Yes | Generic description | The interpretive frame for the claim — what it governs and why it matters. |
| Claim | textarea | Yes | `claim.text` (quotes stripped) | The full verbatim claim statement. |

### Source

| Field | Type | Required | Description |
|---|---|---|---|
| Source type | `'Document' \| 'Human'` | Yes | Whether the claim originates from a document or from a person's direct input. |
| Selected documents | checkbox list | Conditional | One or more source documents. Required when type is `'Document'`. |
| Selected person | person picker | Conditional | The individual who stated the claim. Required when type is `'Human'`. |

### Metrics

| Field | Type | Required | Edit mode default | Description |
|---|---|---|---|---|
| Confidence (%) | number input (0–100) | No | `claim.confidence` | Reviewer's or AI's confidence in the claim's accuracy and relevance. |
| Risk Level | `'Low' \| 'Medium' \| 'High'` | No | `claim.risk` | Assessed risk level associated with this claim being incorrect or contested. |

> **Note:** Polarity is not collected at creation time. It is inferred by the system or set during the review/promotion flow.

### Bundles

| Field | Type | Required | Description |
|---|---|---|---|
| Bundle selection | checkbox list | No | One or more bundles this claim should belong to. Bundles group related claims for collective promotion. |

### Details

| Field | Type | Required | Edit mode default | Description |
|---|---|---|---|---|
| Amount | text input | No | — | Optional monetary or quantitative value referenced in the claim (e.g. `$2,500,000`). Relevant for financial or contractual claims. |
| Reference | text input | No | — | Optional pointer to a specific section, clause, or article (e.g. `Section 4.2.1`). Aids traceability. |
| Created By | Auto / read-only | — | Current user | Populated from the logged-in user's account. Not editable. |
| Organization | Auto / read-only | — | Workspace setting | Company or organization name, automatically detected from the workspace. Not editable. |
| Location | Auto / read-only | — | Workspace setting | Geographic location, automatically detected from the workspace. Not editable. |

---

## 6. Quick Reference — Field Optionality Summary

| Field | Suggest Change | View Suggestion | Create Claim | Edit Claim |
|---|---|---|---|---|
| Title | — | Read-only | Required | Pre-filled |
| Claim text | Optional | Read-only | Required | Pre-filled |
| Context | Optional | Read-only | Required | Pre-filled |
| Confidence | Optional (keep) | Read-only | Optional | Pre-filled |
| Risk Level | Optional (keep) | Read-only | Optional | Pre-filled |
| Polarity | Optional (keep) | Read-only | Not collected | Not collected |
| Source | Optional (suggest new) | Read-only / Same Source | Required | Pre-filled |
| Rationale | Optional | Read-only | — | — |
| Notes | Optional | Read-only | — | — |
| Amount | — | — | Optional | Optional |
| Reference | — | — | Optional | Optional |
| Recipient | Optional | — | — | — |
