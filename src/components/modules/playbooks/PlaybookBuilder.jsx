import React, { useState, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { truthPacks as KNOWLEDGE_PACKS } from '../../../data/mockKnowledge'
import TruthPackSlideOut from '../knowledge/TruthPackSlideOut'
import {
  ArrowLeft, ChevronRight, ChevronLeft, Save, CheckCircle, Check,
  FileText, Sparkles, Shield, Target, Layers, Zap, Eye,
  Globe, Building2, Home, User, Tag, AlignLeft, Hash, X,
  ChevronDown, ChevronUp, AlertTriangle, Plus, Trash2,
  Clock, Activity, BarChart2, Lock, BookOpen,
  UserCheck, Users, MessageSquare, Search,
  Flag, XCircle, PlayCircle, GitBranch, RotateCcw, Archive,
} from 'lucide-react'

// ── Tenant / Rooftop mock data ────────────────────────────────────────────────
const TENANT_ROOFTOPS = [
  {
    id: 'tenant-001', name: 'AutoNation Group', region: 'Southeast', active: true,
    rooftops: [
      { id: 'rt-001', name: 'AutoNation Ford Miami',            city: 'Miami, FL'         },
      { id: 'rt-002', name: 'AutoNation Toyota Doral',          city: 'Doral, FL'         },
      { id: 'rt-003', name: 'AutoNation Chevrolet Cutler Bay',  city: 'Cutler Bay, FL'    },
    ]
  },
  {
    id: 'tenant-002', name: 'Hendrick Automotive Group', region: 'Mid-Atlantic', active: true,
    rooftops: [
      { id: 'rt-004', name: 'Hendrick Chevrolet Charlotte',     city: 'Charlotte, NC'     },
      { id: 'rt-005', name: 'Hendrick BMW South',               city: 'Pineville, NC'     },
      { id: 'rt-006', name: 'Hendrick Honda Easley',            city: 'Easley, SC'        },
      { id: 'rt-007', name: 'Hendrick Acura of Overland Park',  city: 'Overland Park, KS' },
    ]
  },
  {
    id: 'tenant-003', name: 'Sonic Automotive', region: 'National', active: true,
    rooftops: [
      { id: 'rt-008', name: 'Sonic Lexus Las Vegas',            city: 'Las Vegas, NV'     },
      { id: 'rt-009', name: 'Sonic Chevrolet Oakland',          city: 'Oakland, CA'       },
      { id: 'rt-010', name: 'Sonic BMW Nashville',              city: 'Nashville, TN'     },
    ]
  },
  {
    id: 'tenant-004', name: 'Penske Automotive', region: 'Northeast', active: true,
    rooftops: [
      { id: 'rt-011', name: 'Penske BMW of Fairfield',          city: 'Fairfield, CT'     },
      { id: 'rt-012', name: 'Penske Toyota Lemon Grove',        city: 'Lemon Grove, CA'   },
    ]
  },
  {
    id: 'tenant-005', name: 'Lithia Motors', region: 'West Coast', active: false,
    rooftops: [
      { id: 'rt-013', name: 'Lithia Chevrolet of Tri-Cities',   city: 'Kennewick, WA'     },
      { id: 'rt-014', name: 'Lithia Toyota of Medford',         city: 'Medford, OR'       },
      { id: 'rt-015', name: 'Lithia Honda of Medford',          city: 'Medford, OR'       },
    ]
  },
]

// ── Steps definition ──────────────────────────────────────────────────────────
const STEPS = [
  { id: 'basics',    label: 'Basics',     icon: FileText  },
  { id: 'knowledge', label: 'Knowledge',  icon: BookOpen  },
  { id: 'moment',    label: 'Moment',     icon: Sparkles  },
  { id: 'gates',     label: 'Hard Gates', icon: Shield    },
  { id: 'objective', label: 'Objective',  icon: Target    },
  { id: 'phases',    label: 'Phases',     icon: Layers    },
  { id: 'trust',     label: 'Trust',      icon: Zap       },
  { id: 'review',    label: 'Review',     icon: Eye       },
]

// ── Step meta (header shown at top of content area) ───────────────────────────
const STEP_META = {
  basics:    { title: 'Basics',           desc: 'Define the identity, scope, and ownership of this playbook',                                                           iconBg: 'linear-gradient(135deg,#3b82f6,#7c5cfc)' },
  knowledge: { title: 'Knowledge',        desc: 'Select the knowledge packs that define what this playbook\'s AI actions can reference and reason from during execution', iconBg: 'linear-gradient(135deg,#7c5cfc,#a78bfa)' },
  moment:    { title: 'Moment',           desc: 'Choose the primary event or customer condition that makes this playbook a candidate strategy',                           iconBg: 'linear-gradient(135deg,#a78bfa,#ec4899)' },
  gates:     { title: 'Hard Gates',       desc: 'Set non-negotiable eligibility checks — if any fail, the playbook will not execute',                                    iconBg: 'linear-gradient(135deg,#16a34a,#2dd4bf)' },
  objective: { title: 'Objective & Success', desc: 'Define the business goal and the KPI the NBA engine should optimize toward',                                         iconBg: 'linear-gradient(135deg,#f59e0b,#ef4444)' },
  phases:    { title: 'Phases & Actions', desc: 'Structure the execution flow — each phase runs in sequence and can contain multiple actions',                            iconBg: 'linear-gradient(135deg,#2563eb,#0891b2)' },
  trust:     { title: 'Trust Controls',   desc: 'Set how much autonomy the NBA engine has and when human approval is required',                                          iconBg: 'linear-gradient(135deg,#7c5cfc,#2563eb)' },
  review:    { title: 'Review',           desc: 'Confirm all settings before saving. You can return to any step to make changes.',                                        iconBg: 'linear-gradient(135deg,#64748b,#475569)' },
}

// ── Initial data ──────────────────────────────────────────────────────────────
const INITIAL = {
  // Basics
  name: '', description: '', tenantScope: '', department: '', owner: '', priority: '', tags: [], internalNotes: '',
  knowledgePackages: [],
  selectedTenants: [], selectedRooftops: {},
  // Moment
  primaryMoment: '', eventSource: [], businessMeaning: '', qualifyingConditions: [],
  // Hard Gates (all optional — open = active)
  gate_consent_channels: [], gate_consent_ifNotMet: 'Suppress Playbook',
  gate_rep_window: 'Last 24 Hours', gate_rep_ifActive: 'Create Task Instead',
  gate_channel_channels: [], gate_channel_ifNotMet: 'Defer Until Met',
  gate_status_statuses: [], gate_status_ifBlocked: 'Suppress Playbook',
  gate_compliance_checks: [],
  gate_custom: [],
  // Objective & Success
  goalType: '', primarySuccessEvent: '', exitConditions: [],
  kpiAssociation: '', strategyNotes: '',
  // Phases
  phases: [],
  // Trust
  trustPreset: '',
  trustMode: '',
  confidenceThreshold: 75,
  requireApprovalBelow: true,
  sensitiveTopics: [
    { id: 1, label: 'Pricing or discounts',       action: 'require-approval', enabled: true },
    { id: 2, label: 'Legal or compliance terms',  action: 'block',            enabled: true },
    { id: 3, label: 'Competitor mentions',         action: 'require-approval', enabled: true },
    { id: 4, label: 'Medical or health claims',    action: 'block',            enabled: true },
    { id: 5, label: 'Negative sentiment detected', action: 'require-approval', enabled: true },
  ],
  handoffBehavior: '',
  approvalRequired: '',
  escalationPath: '',
  versionNote: '',
  // Human Intervention
  humanHandoffTriggers: [
    { id: 1, label: 'High purchase intent detected',      desc: 'e.g., "Can I come in today?" or "Ready to buy."',   enabled: true },
    { id: 2, label: 'Customer requests in-person visit',  desc: 'Requires appointment scheduling and coordination.', enabled: true },
    { id: 3, label: 'Trade-in or financing complexity',   desc: 'Credit questions, payoff amounts, or trade valuations.', enabled: true },
    { id: 4, label: 'Negotiation or pricing sensitivity', desc: 'Price objections, competitive quotes, or discount requests.', enabled: true },
    { id: 5, label: 'Negative sentiment detected',        desc: 'Frustration, complaints, or dissatisfaction signals.', enabled: true },
    { id: 6, label: 'Policy-restricted topic raised',     desc: 'Legal issues, warranty disputes, or recall questions.', enabled: true },
  ],
  humanHandoffCustom: '',
  humanPostHandoff: 'original-rep',
  humanReviewRequirements: [
    { id: 1, label: 'Require review for first contact attempt',           enabled: false },
    { id: 2, label: 'Require review for all phone call scripts',          enabled: true  },
    { id: 3, label: 'Require review for sensitive topic responses',       enabled: false },
    { id: 4, label: 'Require review for price negotiations or discounts', enabled: false },
    { id: 5, label: 'Require review for trade-in value discussions',      enabled: false },
    { id: 6, label: 'Require review for competitor comparisons',          enabled: false },
    { id: 7, label: 'Require review for delivery timeline commitments',   enabled: false },
  ],
  humanReviewCustom: '',
  humanApprovalTimeout: '4 hours',
  personalizationFields: ['name', 'vehicle_interest', 'assigned_bdc', 'source'],
}

// ── Sidebar field definitions per step ───────────────────────────────────────
const SIDEBAR_FIELDS = {
  basics:    [
    { key: 'name',        label: 'Playbook Name',  required: true  },
    { key: 'description', label: 'Description',    required: false },
    { key: 'tenantScope', label: 'Tenant Scope',   required: true  },
    { key: 'department',  label: 'Department',     required: true  },
    { key: 'owner',       label: 'Owner',          required: true  },
    { key: 'priority',    label: 'Priority',       required: true  },
    { key: 'tags',               label: 'Tags',               required: false },
  ],
  knowledge: [
    { key: 'knowledgePackages', label: 'Knowledge Packages', required: true },
  ],
  moment:    [
    { key: 'primaryMoment',        label: 'Primary Moment',    required: true  },
    { key: 'eventSource',          label: 'Event Source',      required: true  },
    { key: 'businessMeaning',      label: 'Business Meaning',  required: false },
    { key: 'qualifyingConditions', label: 'Conditions',        required: false },
  ],
  gates:     [
    { key: 'gate_consent_channels',   label: 'Consent Gate',      required: false },
    { key: 'gate_rep_window',         label: 'Rep Conflict',       required: false },
    { key: 'gate_channel_channels',   label: 'Channel Gate',       required: false },
    { key: 'gate_status_statuses',    label: 'Status Restrict.',   required: false },
    { key: 'gate_compliance_checks',  label: 'Compliance',         required: false },
  ],
  objective: [
    { key: 'goalType',            label: 'Goal Type',       required: true  },
    { key: 'primarySuccessEvent', label: 'Success Event',   required: true  },
    { key: 'exitConditions',      label: 'Exit Conditions', required: false },
    { key: 'kpiAssociation',      label: 'KPI Association', required: false },
    { key: 'strategyNotes',       label: 'Strategy Notes',  required: false },
  ],
  phases:    [
    { key: 'phases', label: 'Phases defined', required: true, isArray: true },
  ],
  trust:     [
    { key: 'trustPreset',         label: 'Trust Policy',     required: true  },
    { key: 'confidenceThreshold', label: 'Confidence',       required: false },
    { key: 'sensitiveTopics',     label: 'Sensitive Topics', required: false },
    { key: 'escalationPath',      label: 'Escalation Path',  required: false },
  ],
  review:    [],
}

const SIDEBAR_CALLOUTS = {
  basics:    { text: 'Name, scope and ownership define how this playbook is discovered and assigned across your org.' },
  knowledge: { text: 'Knowledge packs define what verified facts the AI can reference during execution. At least one pack is required.' },
  moment:    { text: 'The primary moment is the signal that qualifies a customer to enter this playbook execution.' },
  gates:     { text: 'Hard gates are non-negotiable checks. If any gate fails, the playbook will not execute for that customer.' },
  objective: { text: 'The objective drives NBA decisioning. Clear success metrics allow the engine to measure and adapt.' },
  phases:    { text: 'Each phase runs sequentially. Actions inside a phase can run in parallel or in order.' },
  trust:     { text: 'Select a trust policy preset to configure how the NBA engine behaves. All settings are editable after selection.' },
  review:    { text: 'Review all settings before saving. You can always return to any step to make changes.' },
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function hasValue(val) {
  if (Array.isArray(val)) return val.length > 0 && val.some(v => v.name || v)
  return val !== '' && val !== null && val !== undefined
}

function getRequiredCount(stepId, data) {
  const fields = SIDEBAR_FIELDS[stepId] || []
  const required = fields.filter(f => f.required)
  const complete  = required.filter(f => hasValue(data[f.key]))
  return { total: required.length, complete: complete.length }
}

function isStepDone(stepId, data) {
  const { total, complete } = getRequiredCount(stepId, data)
  if (total > 0) return complete === total
  // Steps with no required fields are "done" when at least one thing is configured
  if (stepId === 'gates') {
    return (
      data.gate_consent_channels?.length > 0 ||
      data.gate_channel_channels?.length  > 0 ||
      data.gate_status_statuses?.length   > 0 ||
      data.gate_compliance_checks?.length > 0 ||
      data.gate_custom?.length            > 0
    )
  }
  return false
}

// ── Sub-components ────────────────────────────────────────────────────────────
function FieldDot({ required, complete }) {
  if (complete)           return <span className="w-2 h-2 rounded-full shrink-0" style={{ background: '#4ade80' }} />
  if (required && !complete) return <span className="w-2 h-2 rounded-full shrink-0" style={{ background: '#f87171' }} />
  return <span className="w-2 h-2 rounded-full shrink-0" style={{ background: 'rgba(255,255,255,0.2)' }} />
}

function SectionLabel({ children }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <p className="text-[10px] font-bold tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>{children}</p>
      <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
    </div>
  )
}

function FieldLabel({ children, required, hint }) {
  return (
    <div className="mb-1.5">
      <label className="text-xs font-semibold flex items-center gap-1" style={{ color: 'var(--text-secondary)' }}>
        {children}
        {required && <span style={{ color: '#f87171' }}>*</span>}
      </label>
      {hint && <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{hint}</p>}
    </div>
  )
}

function RadioCard({ selected, onClick, icon: Icon, iconColor, iconBg, title, sub }) {
  return (
    <button type="button" onClick={onClick}
      className="flex-1 flex flex-col gap-2 p-4 rounded-xl text-left transition-all duration-150"
      style={{
        background: selected ? 'rgba(124,92,252,0.09)' : 'rgba(255,255,255,0.02)',
        border: `1.5px solid ${selected ? 'rgba(124,92,252,0.55)' : 'rgba(255,255,255,0.08)'}`,
        boxShadow: selected ? '0 0 0 1px rgba(124,92,252,0.2)' : 'none',
      }}>
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all"
          style={{ borderColor: selected ? '#a78bfa' : 'rgba(255,255,255,0.2)', background: selected ? '#a78bfa' : 'transparent' }}>
          {selected && <div className="w-2 h-2 rounded-full bg-white" />}
        </div>
        <div className="w-6 h-6 rounded-lg flex items-center justify-center"
          style={{ background: selected ? iconBg : 'rgba(255,255,255,0.06)' }}>
          <Icon size={13} style={{ color: selected ? iconColor : 'var(--text-muted)' }} />
        </div>
      </div>
      <div>
        <p className="text-xs font-bold" style={{ color: selected ? 'var(--text-primary)' : 'var(--text-secondary)' }}>{title}</p>
        <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{sub}</p>
      </div>
    </button>
  )
}

function Accordion({ label, icon: Icon, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
      <button type="button" onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-2 px-4 py-3 transition-all hover:bg-white/[0.02]"
        style={{ background: 'rgba(255,255,255,0.02)' }}>
        {Icon && <Icon size={13} style={{ color: 'var(--text-muted)' }} />}
        <span className="flex-1 text-xs font-semibold text-left" style={{ color: 'var(--text-secondary)' }}>{label}</span>
        {open ? <ChevronUp size={13} style={{ color: 'var(--text-muted)' }} /> : <ChevronDown size={13} style={{ color: 'var(--text-muted)' }} />}
      </button>
      {open && <div className="px-4 pb-4 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>{children}</div>}
    </div>
  )
}

// ── AI Assist Widget ──────────────────────────────────────────────────────────
const AI_ASSIST_ACTIONS = [
  { id: 'generate',   label: 'Generate',       Icon: Sparkles   },
  { id: 'rewrite',    label: 'Rewrite',         Icon: RotateCcw  },
  { id: 'shorten',    label: 'Shorten',         Icon: AlignLeft  },
  { id: 'specific',   label: 'Make Specific',   Icon: Target     },
  { id: 'actionable', label: 'Make Actionable', Icon: Zap        },
]

const AI_SUGGESTIONS = {
  generate: {
    description:      'Orchestrates a personalized, multi-touch engagement sequence triggered by key customer lifecycle moments, using NBA to optimize timing and channel selection for maximum impact.',
    businessMeaning:  'This moment signals a critical transition in the customer relationship — one that, if engaged correctly, significantly increases long-term retention and expansion potential.',
    strategyNotes:    'Prioritize early value demonstration over volume of outreach. NBA should weight engagement signals from the first 14 days heavily in all subsequent decisioning.',
    phaseNotes:       "This phase sets the tone for the entire playbook. Ensure messaging is personalized to the account's industry segment and that timing respects prior contact cadence.",
    gateDescription:  'This gate ensures only eligible, consented accounts enter execution — preventing wasted outreach and compliance violations before any action is taken.',
    internalNotes:    'Review quarterly with CS leadership to validate phase triggers align with current GTM motion. Escalation paths may shift with org structure changes.',
    default:          'Engages the target segment at the optimal moment with context-aware messaging, balancing automation efficiency with the need for human oversight on high-value interactions.',
  },
  rewrite: {
    description:      'A data-driven engagement playbook that activates automatically when key account signals are detected, coordinating AI-authored outreach with human review at critical decision points.',
    businessMeaning:  'Marks the point at which proactive intervention yields the highest ROI — acting here converts passive accounts into active participants in the customer success journey.',
    strategyNotes:    'The core objective is conversion efficiency: each phase should reduce friction in the customer\'s path to the next milestone, with NBA stepping back when confidence drops below threshold.',
    phaseNotes:       'Revised: focus this phase on establishing trust through relevance, not frequency. One targeted, well-timed action outperforms three generic follow-ups.',
    gateDescription:  'Rewritten: validates account eligibility across consent, engagement history, and active suppression flags before allowing execution to proceed.',
    internalNotes:    'Updated for Q2 GTM alignment. Verify owner assignment reflects current team structure before activating.',
    default:          'Triggers a structured, cadenced engagement sequence aligned to account health signals, with approval checkpoints at each phase transition.',
  },
  shorten: {
    description:      'Automates multi-phase outreach triggered by key account signals, with NBA managing timing and channel selection.',
    businessMeaning:  'Signals peak intervention opportunity — proactive engagement here drives measurable retention and expansion outcomes.',
    strategyNotes:    'Optimize for conversion efficiency; NBA prioritizes high-confidence actions and defers to human review when signals are ambiguous.',
    phaseNotes:       'Personalized, timely outreach based on engagement data. Avoid over-contact.',
    gateDescription:  'Blocks execution if required eligibility conditions are not met.',
    internalNotes:    'Align with GTM motion each quarter. Update escalation paths as org evolves.',
    default:          'Targeted engagement sequence triggered by account signals, with human review at key decision points.',
  },
  specific: {
    description:      'Targets enterprise accounts (ARR > $50K) within 48 hours of contract signing. Triggers a 4-phase onboarding sequence gated by CRM status, email consent, and no active suppression flags.',
    businessMeaning:  'This event indicates the account has passed the highest-risk churn window (days 1–14) and is ready for proactive expansion discovery. NBA should shift from retention to growth mode.',
    strategyNotes:    'Success is defined as the account reaching Feature Adoption Score > 70 within 30 days. NBA should deprioritize outreach to contacts with fewer than 2 product logins in the past 7 days.',
    phaseNotes:       'Phase activates only if prior phase email open rate exceeds 40%, or a product login occurs within 3 days of prior phase completion.',
    gateDescription:  'Gate passes only when: (1) email consent is active, (2) no suppression flag exists, and (3) account status is "Active" in CRM with a confirmed billing contact.',
    internalNotes:    'Applicable to Enterprise and Mid-Market segments only. Exclude SMB accounts with fewer than 10 seats. CSM must be assigned before activation.',
    default:          'Applies to accounts matching: segment = Enterprise, health score < 70, no active playbooks, consent verified across Email and SMS channels.',
  },
  actionable: {
    description:      'When triggered: (1) send personalized welcome via optimal channel, (2) create CSM onboarding task in CRM, (3) schedule activation check-in at day 7, (4) surface expansion signal to AE at day 21.',
    businessMeaning:  'When this moment fires: pause cold outreach, activate warm-handoff sequence, notify assigned CSM within 1 hour, and update account stage to "Active Onboarding" in CRM.',
    strategyNotes:    'NBA should: auto-send when confidence ≥ 75%, create draft for review at 60–74%, and escalate to CSM when below 60%. Re-evaluate if success rate drops below 65%.',
    phaseNotes:       'Step 1: trigger message within 2 hours of phase activation. Step 2: if no response in 72 hours, escalate to CSM with full context. Step 3: log outcome to CRM regardless of response.',
    gateDescription:  'Action if gate fails: (1) log blocked event to CRM, (2) notify assigned rep, (3) re-evaluate eligibility in 7 days — do not discard the record.',
    internalNotes:    'Required actions: (1) validate gate logic with compliance team by end of month. (2) update escalation path after Q2 reorg. (3) archive v1.x configs after v2.0 goes live.',
    default:          'On activation: send tailored outreach within 2 hours, create rep task if no engagement in 48 hours, escalate to manager if confidence falls below threshold after Phase 2.',
  },
}

function AIAssistWidget({ fieldKey = 'default', currentValue = '', onAccept }) {
  const [open,       setOpen]       = useState(false)
  const [loading,    setLoading]    = useState(false)
  const [suggestion, setSuggestion] = useState(null)
  const btnRef = useRef(null)
  const [pos,  setPos]  = useState({ top: 0, left: 0 })

  const handleOpen = () => {
    if (btnRef.current) {
      const r = btnRef.current.getBoundingClientRect()
      setPos({ top: r.bottom + 8, left: Math.max(8, r.right - 368) })
    }
    setSuggestion(null)
    setLoading(false)
    setOpen(true)
  }

  const handleClose = () => { setOpen(false); setSuggestion(null) }

  const handleAction = (actionId) => {
    setLoading(true)
    setSuggestion(null)
    setTimeout(() => {
      const map = AI_SUGGESTIONS[actionId] || {}
      setSuggestion(map[fieldKey] || map.default)
      setLoading(false)
    }, 1800)
  }

  const handleAccept = () => {
    if (suggestion) { onAccept(suggestion); handleClose() }
  }

  return (
    <>
      <button ref={btnRef} type="button" onClick={handleOpen}
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all hover:brightness-110"
        style={{ background: 'rgba(124,92,252,0.18)', border: '1px solid rgba(124,92,252,0.3)', color: '#a78bfa' }}>
        <Sparkles size={11} /> Assist
      </button>

      {open && createPortal(
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-[60]" onClick={handleClose} />

          {/* Popover */}
          <div className="fixed z-[61] w-[368px] rounded-2xl overflow-hidden"
            style={{
              top: pos.top, left: pos.left,
              background: 'var(--bg-surface, #1a1a2e)',
              border: '1px solid rgba(124,92,252,0.35)',
              boxShadow: '0 12px 48px rgba(0,0,0,0.6), 0 0 0 1px rgba(124,92,252,0.12)',
            }}>

            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3"
              style={{ background: 'rgba(124,92,252,0.1)', borderBottom: '1px solid rgba(124,92,252,0.2)' }}>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg,#7c5cfc,#3b82f6)' }}>
                  <Sparkles size={11} color="#fff" />
                </div>
                <span className="text-xs font-bold" style={{ color: 'var(--text-primary, #fff)' }}>AI Strategy Assistant</span>
              </div>
              <button type="button" onClick={handleClose}
                className="p-1 rounded-lg transition-colors hover:bg-white/5"
                style={{ color: 'var(--text-muted, #94a3b8)' }}>
                <X size={13} />
              </button>
            </div>

            <div className="p-4">
              {/* Action grid */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                {AI_ASSIST_ACTIONS.map(a => (
                  <button key={a.id} type="button"
                    onClick={() => handleAction(a.id)}
                    disabled={loading}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-[11px] font-medium transition-all hover:brightness-110 disabled:opacity-40"
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.09)',
                      color: 'var(--text-secondary, #cbd5e1)',
                      gridColumn: a.id === 'actionable' ? 'span 2' : undefined,
                    }}>
                    <a.Icon size={12} style={{ color: '#a78bfa', flexShrink: 0 }} />
                    {a.label}
                  </button>
                ))}
              </div>

              {/* Suggestion area */}
              {(loading || suggestion) && (
                <div className="rounded-xl p-3 mb-3"
                  style={{ background: 'rgba(124,92,252,0.07)', border: '1px solid rgba(124,92,252,0.22)' }}>
                  {loading ? (
                    <div className="flex items-center gap-2.5 py-1">
                      <svg className="animate-spin shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="none"
                        stroke="#a78bfa" strokeWidth="2.5"><path d="M21 12a9 9 0 11-6.219-8.56" /></svg>
                      <span className="text-[11px]" style={{ color: '#a78bfa' }}>Generating suggestion…</span>
                    </div>
                  ) : (
                    <>
                      <p className="text-[10px] font-semibold mb-1.5" style={{ color: '#a78bfa' }}>AI Suggestion:</p>
                      <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-secondary, #cbd5e1)' }}>
                        {suggestion}
                      </p>
                    </>
                  )}
                </div>
              )}

              {/* Accept / Dismiss */}
              {suggestion && !loading && (
                <div className="flex gap-2 mb-3">
                  <button type="button" onClick={handleAccept}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all hover:brightness-110"
                    style={{ background: 'linear-gradient(135deg,#7c5cfc,#3b82f6)', color: '#fff', boxShadow: '0 2px 12px rgba(124,92,252,0.4)' }}>
                    <Check size={12} /> Accept Suggestion
                  </button>
                  <button type="button" onClick={() => setSuggestion(null)}
                    className="px-4 rounded-xl text-xs font-semibold transition-all hover:brightness-110"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-muted, #94a3b8)' }}>
                    Dismiss
                  </button>
                </div>
              )}

              {/* Footer */}
              <p className="text-[9px] leading-relaxed" style={{ color: 'var(--text-muted, #94a3b8)', opacity: 0.6 }}>
                Your custom instructions guide NBA behavior. AI helps draft and refine them, but your saved values remain the source of truth.
              </p>
            </div>
          </div>
        </>,
        document.body
      )}
    </>
  )
}

// ── Step Sidebar ──────────────────────────────────────────────────────────────
function StepSidebar({ stepId, data }) {
  const fields   = SIDEBAR_FIELDS[stepId] || []
  const callout  = SIDEBAR_CALLOUTS[stepId]

  return (
    <div className="flex flex-col shrink-0 h-full" style={{ width: 220, borderRight: '1px solid rgba(255,255,255,0.07)', background: 'var(--sidebar-bg)' }}>
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-1.5">
        <p className="text-[10px] font-bold tracking-widest uppercase mb-3" style={{ color: 'var(--text-muted)' }}>
          Step progress
        </p>
        {fields.map(f => {
          const val = data[f.key]
          const complete = hasValue(val)
          return (
            <div key={f.key} className="flex items-start gap-2 py-1.5">
              <FieldDot required={f.required} complete={complete} />
              <div className="min-w-0">
                <p className="text-[11px] font-medium leading-tight" style={{ color: complete ? 'var(--text-secondary)' : 'var(--text-muted)' }}>
                  {f.label}
                  {f.required && !complete && <span style={{ color: '#f87171' }}> *</span>}
                </p>
                {complete && (
                  <p className="text-[10px] truncate mt-0.5" style={{ color: '#4ade80', maxWidth: 160 }}>
                    {Array.isArray(val)
                      ? val.length > 0
                        ? (typeof val[0] === 'object' ? `${val.length} phase${val.length > 1 ? 's' : ''}` : val.join(', '))
                        : '—'
                      : String(val).length > 24 ? String(val).slice(0, 24) + '…' : val}
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {callout && (
        <div className="px-4 py-4 mx-3 mb-4 rounded-xl"
          style={{ background: 'rgba(124,92,252,0.07)', border: '1px solid rgba(124,92,252,0.2)' }}>
          <p className="text-[10px] leading-relaxed" style={{ color: 'rgba(167,139,250,0.8)' }}>{callout.text}</p>
        </div>
      )}
    </div>
  )
}

// ── Step: Basics ──────────────────────────────────────────────────────────────
function BasicsStep({ data, onChange }) {
  const [tagInput, setTagInput] = useState('')
  const [tenantSearch,    setTenantSearch]    = useState('')
  const [expandedTenants, setExpandedTenants] = useState({})
  const set = (key, val) => onChange({ ...data, [key]: val })

  const addTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      set('tags', [...data.tags, tagInput.trim()])
      setTagInput('')
    }
  }
  const removeTag = (t) => set('tags', data.tags.filter(x => x !== t))

  const DEPARTMENTS = ['Sales', 'Customer Success', 'Product', 'Marketing', 'Operations']
  const OWNERS      = ['Sarah Chen', 'Michael Torres', 'Emily Rodriguez', 'David Park', 'Lisa Anderson']
  const PRIORITIES  = [
    { val: 'critical', label: 'Critical – P1', sub: 'Overrides all other playbooks' },
    { val: 'high',     label: 'High – P2',     sub: 'Runs before standard playbooks' },
    { val: 'standard', label: 'Standard – P3', sub: 'Default arbitration priority'   },
    { val: 'low',      label: 'Low – P4',      sub: 'Runs only if no higher applies' },
  ]

  return (
    <div className="space-y-8">

      {/* Section 1: Identity */}
      <div>
        <SectionLabel>Playbook Identity</SectionLabel>
        <div className="space-y-4">
          <div>
            <FieldLabel required hint="A clear, unique name visible to all team members">Playbook Name</FieldLabel>
            <input className="input-base w-full text-sm"
              placeholder="e.g. Enterprise Onboarding Excellence"
              value={data.name} onChange={e => set('name', e.target.value)} />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <FieldLabel hint="Brief summary of what this playbook does and who it targets">Short Description</FieldLabel>
              <AIAssistWidget fieldKey="description" currentValue={data.description}
                onAccept={val => set('description', val)} />
            </div>
            <textarea className="input-base w-full text-xs resize-none leading-relaxed" rows={3}
              placeholder="Describe the strategy, target segment, and expected outcome..."
              value={data.description} onChange={e => set('description', e.target.value)} />
          </div>
        </div>
      </div>

      <div className="h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />

      {/* Section 2: Tenant Scope */}
      <div>
        <SectionLabel>Tenant Scope</SectionLabel>
        <p className="text-[11px] mb-3" style={{ color: 'var(--text-muted)' }}>
          Define where this playbook can be applied across the organization
        </p>
        <div className="flex gap-3">
          <RadioCard selected={data.tenantScope === 'global'}   onClick={() => set('tenantScope', 'global')}
            icon={Globe}     iconColor="#60a5fa" iconBg="rgba(59,130,246,0.2)"  title="Global"                       sub="All tenants" />
          <RadioCard selected={data.tenantScope === 'specific'} onClick={() => set('tenantScope', 'specific')}
            icon={Building2} iconColor="#a78bfa" iconBg="rgba(124,92,252,0.2)" title="Specific Tenants & Rooftops"   sub="Multi-select" />
        </div>

        {/* ── Tenant / Rooftop tree picker ─────────────────────────────────── */}
        {data.tenantScope === 'specific' && (() => {
          const selTenants  = data.selectedTenants  || []
          const selRooftops = data.selectedRooftops || {}
          const q = tenantSearch.trim().toLowerCase()
          const filtered = TENANT_ROOFTOPS.filter(t =>
            !q ||
            t.name.toLowerCase().includes(q) ||
            t.region.toLowerCase().includes(q) ||
            t.rooftops.some(r => r.name.toLowerCase().includes(q) || r.city.toLowerCase().includes(q))
          )
          const totalRt = Object.values(selRooftops).reduce((s, arr) => s + arr.length, 0)

          const toggleTenant = (tenantId) => {
            const tenant = TENANT_ROOFTOPS.find(t => t.id === tenantId)
            if (selTenants.includes(tenantId)) {
              const nr = { ...selRooftops }; delete nr[tenantId]
              onChange({ ...data, selectedTenants: selTenants.filter(id => id !== tenantId), selectedRooftops: nr })
              setExpandedTenants(prev => ({ ...prev, [tenantId]: false }))
            } else {
              onChange({
                ...data,
                selectedTenants: [...selTenants, tenantId],
                selectedRooftops: { ...selRooftops, [tenantId]: tenant.rooftops.map(r => r.id) },
              })
              setExpandedTenants(prev => ({ ...prev, [tenantId]: true }))
            }
          }

          const toggleRooftop = (tenantId, rooftopId) => {
            const cur = selRooftops[tenantId] || []
            const next = cur.includes(rooftopId) ? cur.filter(id => id !== rooftopId) : [...cur, rooftopId]
            onChange({ ...data, selectedRooftops: { ...selRooftops, [tenantId]: next } })
          }

          const toggleAllRooftops = (tenantId) => {
            const tenant = TENANT_ROOFTOPS.find(t => t.id === tenantId)
            const cur    = selRooftops[tenantId] || []
            const allIds = tenant.rooftops.map(r => r.id)
            const allSel = allIds.every(id => cur.includes(id))
            onChange({ ...data, selectedRooftops: { ...selRooftops, [tenantId]: allSel ? [] : allIds } })
          }

          return (
            <div className="mt-4">
              {/* Search */}
              <div className="relative mb-2">
                <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ color: 'var(--text-muted)' }} />
                <input className="input-base w-full text-xs pl-8"
                  placeholder="Search tenants or rooftops…"
                  value={tenantSearch}
                  onChange={e => setTenantSearch(e.target.value)} />
              </div>

              {/* Tree list */}
              <div className="rounded-xl overflow-hidden"
                style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                {filtered.length === 0 && (
                  <div className="px-4 py-5 text-center text-[11px]" style={{ color: 'var(--text-muted)' }}>
                    No tenants match "{tenantSearch}"
                  </div>
                )}
                {filtered.map((tenant, idx) => {
                  const isTenantSel  = selTenants.includes(tenant.id)
                  const isExpanded   = expandedTenants[tenant.id]
                  const tenantRts    = selRooftops[tenant.id] || []
                  const allRtSel     = tenant.rooftops.length > 0 && tenant.rooftops.every(r => tenantRts.includes(r.id))
                  const someRtSel    = tenant.rooftops.some(r => tenantRts.includes(r.id))

                  return (
                    <div key={tenant.id}
                      style={{ borderTop: idx > 0 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>

                      {/* Tenant row */}
                      <div className="flex items-center gap-3 px-4 py-3 cursor-pointer select-none"
                        style={{ background: isTenantSel ? 'rgba(124,92,252,0.08)' : 'transparent' }}
                        onClick={() => toggleTenant(tenant.id)}>
                        {/* Checkbox */}
                        <div className="w-4 h-4 rounded flex-shrink-0 flex items-center justify-center"
                          style={{
                            background: isTenantSel ? '#7c5cfc' : 'transparent',
                            border: `1.5px solid ${isTenantSel ? '#7c5cfc' : 'rgba(255,255,255,0.2)'}`,
                            transition: 'all 0.15s',
                          }}>
                          {isTenantSel && <Check size={10} color="#fff" strokeWidth={3} />}
                        </div>
                        {/* Icon */}
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ background: isTenantSel ? 'rgba(124,92,252,0.2)' : 'rgba(255,255,255,0.06)' }}>
                          <Building2 size={13} style={{ color: isTenantSel ? '#a78bfa' : 'var(--text-muted)' }} />
                        </div>
                        {/* Name + meta */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold truncate"
                              style={{ color: isTenantSel ? '#e2d9ff' : 'var(--text-primary)' }}>
                              {tenant.name}
                            </span>
                            {!tenant.active && (
                              <span className="text-[9px] px-1.5 py-0.5 rounded font-semibold flex-shrink-0"
                                style={{ background: 'rgba(239,68,68,0.15)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' }}>
                                Inactive
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{tenant.region}</span>
                            <span style={{ color: 'var(--text-muted)', fontSize: 10 }}>·</span>
                            <span className="text-[10px]" style={{ color: isTenantSel ? '#a78bfa' : 'var(--text-muted)' }}>
                              {tenant.rooftops.length} rooftop{tenant.rooftops.length !== 1 ? 's' : ''}
                              {isTenantSel && tenantRts.length > 0 && ` · ${tenantRts.length} selected`}
                            </span>
                          </div>
                        </div>
                        {/* Expand toggle */}
                        {isTenantSel && (
                          <button className="p-1 rounded flex-shrink-0 hover:opacity-70"
                            style={{ color: 'var(--text-muted)' }}
                            onClick={e => { e.stopPropagation(); setExpandedTenants(prev => ({ ...prev, [tenant.id]: !prev[tenant.id] })) }}>
                            {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                          </button>
                        )}
                      </div>

                      {/* Rooftop sub-rows */}
                      {isTenantSel && isExpanded && (
                        <div style={{ background: 'rgba(0,0,0,0.18)', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                          {/* Select All row */}
                          <div className="flex items-center gap-3 px-4 py-2 cursor-pointer select-none"
                            style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                            onClick={() => toggleAllRooftops(tenant.id)}>
                            <div className="w-3.5 h-3.5 rounded flex-shrink-0 flex items-center justify-center ml-0.5"
                              style={{
                                background: allRtSel ? '#7c5cfc' : someRtSel ? 'rgba(124,92,252,0.35)' : 'transparent',
                                border: `1.5px solid ${allRtSel || someRtSel ? '#7c5cfc' : 'rgba(255,255,255,0.15)'}`,
                              }}>
                              {allRtSel  && <Check size={8} color="#fff" strokeWidth={3} />}
                              {!allRtSel && someRtSel && <div style={{ width: 6, height: 2, background: '#fff', borderRadius: 1 }} />}
                            </div>
                            <span className="text-[10px] font-semibold" style={{ color: '#a78bfa', marginLeft: 18 }}>
                              {allRtSel ? 'Deselect all rooftops' : 'Select all rooftops'}
                            </span>
                          </div>
                          {/* Individual rooftops */}
                          {tenant.rooftops.map((rt, rtIdx) => {
                            const isRtSel = tenantRts.includes(rt.id)
                            return (
                              <div key={rt.id}
                                className="flex items-center gap-3 cursor-pointer select-none"
                                style={{
                                  padding: '8px 16px 8px 24px',
                                  borderBottom: rtIdx < tenant.rooftops.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                                  background: isRtSel ? 'rgba(124,92,252,0.05)' : 'transparent',
                                }}
                                onClick={() => toggleRooftop(tenant.id, rt.id)}>
                                <div className="w-3.5 h-3.5 rounded flex-shrink-0 flex items-center justify-center"
                                  style={{
                                    background: isRtSel ? '#7c5cfc' : 'transparent',
                                    border: `1.5px solid ${isRtSel ? '#7c5cfc' : 'rgba(255,255,255,0.15)'}`,
                                  }}>
                                  {isRtSel && <Check size={8} color="#fff" strokeWidth={3} />}
                                </div>
                                <Home size={11} style={{ color: isRtSel ? '#a78bfa' : 'var(--text-muted)', flexShrink: 0 }} />
                                <span className="text-[11px] flex-1 truncate"
                                  style={{ color: isRtSel ? '#e2d9ff' : 'var(--text-secondary)' }}>
                                  {rt.name}
                                </span>
                                <span className="text-[10px] flex-shrink-0" style={{ color: 'var(--text-muted)' }}>
                                  {rt.city}
                                </span>
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Summary chips */}
              {selTenants.length > 0 && (
                <div className="mt-3 flex items-center gap-2 flex-wrap">
                  <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                    {selTenants.length} tenant{selTenants.length > 1 ? 's' : ''} · {totalRt} rooftop{totalRt !== 1 ? 's' : ''} selected
                  </span>
                  {selTenants.map(tid => {
                    const tenant  = TENANT_ROOFTOPS.find(t => t.id === tid)
                    const rtCount = (selRooftops[tid] || []).length
                    return (
                      <div key={tid}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium"
                        style={{ background: 'rgba(124,92,252,0.15)', border: '1px solid rgba(124,92,252,0.3)', color: '#c4b5fd' }}>
                        <Building2 size={9} />
                        {tenant?.name}
                        <span style={{ opacity: 0.7 }}>({rtCount} rt)</span>
                        <button
                          onClick={e => { e.stopPropagation(); toggleTenant(tid) }}
                          className="ml-0.5 hover:opacity-70"
                          style={{ color: '#a78bfa', lineHeight: 1 }}>
                          <X size={9} />
                        </button>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })()}
      </div>

      <div className="h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />

      {/* Section 3: Organization */}
      <div>
        <SectionLabel>Organization</SectionLabel>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <FieldLabel required>Department / Team</FieldLabel>
            <select className="input-base w-full text-xs" value={data.department} onChange={e => set('department', e.target.value)}>
              <option value="">Select department...</option>
              {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <FieldLabel required>Owner</FieldLabel>
            <select className="input-base w-full text-xs" value={data.owner} onChange={e => set('owner', e.target.value)}>
              <option value="">Select owner...</option>
              {OWNERS.map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
        </div>

        <div>
          <FieldLabel required hint="Determines selection order when multiple playbooks qualify">Priority / Arbitration Rank</FieldLabel>
          <div className="grid grid-cols-2 gap-2">
            {PRIORITIES.map(p => (
              <button key={p.val} type="button" onClick={() => set('priority', p.val)}
                className="flex items-start gap-2 p-3 rounded-xl text-left transition-all"
                style={{
                  background: data.priority === p.val ? 'rgba(124,92,252,0.1)' : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${data.priority === p.val ? 'rgba(124,92,252,0.45)' : 'rgba(255,255,255,0.07)'}`,
                }}>
                <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all"
                  style={{ borderColor: data.priority === p.val ? '#a78bfa' : 'rgba(255,255,255,0.2)', background: data.priority === p.val ? '#a78bfa' : 'transparent' }}>
                  {data.priority === p.val && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
                <div>
                  <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{p.label}</p>
                  <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{p.sub}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />

      {/* Accordions */}
      <div className="space-y-2">
        <Accordion label="Tags" icon={Hash}>
          <div className="space-y-2">
            <input className="input-base w-full text-xs"
              placeholder="Type and press Enter..."
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={addTag} />
            {data.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {data.tags.map(t => (
                  <span key={t} className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full"
                    style={{ background: 'rgba(124,92,252,0.12)', color: '#a78bfa', border: '1px solid rgba(124,92,252,0.25)' }}>
                    {t}
                    <button onClick={() => removeTag(t)} className="opacity-60 hover:opacity-100"><span>×</span></button>
                  </span>
                ))}
              </div>
            )}
            <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
              Add keywords to organize and retrieve this playbook. Tags support filtering and discovery but do not affect execution logic.
            </p>
          </div>
        </Accordion>

        <Accordion label="Internal Notes (Optional)" icon={FileText}>
          <div className="space-y-2">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>Team Notes & Context</p>
              <AIAssistWidget fieldKey="internalNotes" currentValue={data.internalNotes}
                onAccept={val => set('internalNotes', val)} />
            </div>
            <textarea className="input-base w-full text-xs resize-none leading-relaxed" rows={4}
              placeholder="Add internal context, rollout notes, or exceptions..."
              value={data.internalNotes} onChange={e => set('internalNotes', e.target.value)} />
            <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
              Used for internal team context only. Not used by NBA for decisioning or execution.
            </p>
          </div>
        </Accordion>
      </div>
    </div>
  )
}

// ── Step: Knowledge ──────────────────────────────────────────────────────────
function KnowledgeStep({ data, onChange }) {
  const [search,      setSearch]      = useState('')
  const [filter,      setFilter]      = useState('all') // all | selected
  const [previewPack, setPreviewPack] = useState(null)
  const set = (key, val) => onChange({ ...data, [key]: val })
  const selected = data.knowledgePackages || []

  const STATUS_DOT   = { active: '#22c55e', draft: '#3b82f6', archived: '#64748b' }
  const STATUS_LABEL = { active: 'Active',  draft: 'Draft',   archived: 'Archived' }
  const USAGE_COLOR  = { high: '#4ade80', medium: '#fbbf24', low: '#94a3b8' }

  const q = search.trim().toLowerCase()
  const visible = KNOWLEDGE_PACKS.filter(p => {
    if (p.status === 'archived') return false
    if (filter === 'selected' && !selected.includes(p.id)) return false
    if (q) return (
      p.name.toLowerCase().includes(q) ||
      p.department.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      (p.tags || []).some(t => t.toLowerCase().includes(q))
    )
    return true
  })

  const toggle = (id) => {
    set('knowledgePackages', selected.includes(id) ? selected.filter(x => x !== id) : [...selected, id])
  }

  return (
    <div className="space-y-6">

      {/* Intro callout */}
      <div className="flex items-start gap-3 p-4 rounded-xl"
        style={{ background: 'rgba(124,92,252,0.07)', border: '1px solid rgba(124,92,252,0.2)' }}>
        <div className="p-2 rounded-lg shrink-0" style={{ background: 'rgba(124,92,252,0.15)' }}>
          <BookOpen size={14} style={{ color: '#a78bfa' }} />
        </div>
        <div>
          <p className="text-xs font-semibold mb-1" style={{ color: '#a78bfa' }}>What are Knowledge Packs?</p>
          <p className="text-[11px] leading-relaxed" style={{ color: 'rgba(167,139,250,0.75)' }}>
            Knowledge packs are curated collections of verified facts governed by your Truth Planes.
            Selecting a pack grants this playbook's AI actions the ability to reference, reason from, and cite those facts
            during live execution — ensuring every response is grounded in your organisation's governed data.
          </p>
        </div>
      </div>

      {/* Selected summary bar */}
      {selected.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap p-3 rounded-xl"
          style={{ background: 'rgba(74,222,128,0.06)', border: '1px solid rgba(74,222,128,0.2)' }}>
          <CheckCircle size={12} style={{ color: '#4ade80', flexShrink: 0 }} />
          <p className="text-xs font-semibold" style={{ color: '#4ade80' }}>
            {selected.length} pack{selected.length > 1 ? 's' : ''} selected
          </p>
          <div className="flex flex-wrap gap-1.5 ml-1">
            {selected.map(id => {
              const pack = KNOWLEDGE_PACKS.find(p => p.id === id)
              if (!pack) return null
              return (
                <span key={id} className="flex items-center gap-1.5 pl-2.5 pr-1.5 py-0.5 rounded-full text-[10px] font-medium"
                  style={{ background: 'rgba(124,92,252,0.12)', color: 'var(--text-secondary)', border: '1px solid rgba(124,92,252,0.25)' }}>
                  {pack.name}
                  <button type="button" onClick={() => toggle(id)}
                    className="opacity-50 hover:opacity-100 transition-opacity">
                    <X size={9} />
                  </button>
                </span>
              )
            })}
          </div>
        </div>
      )}

      {/* Search + filter row */}
      <div className="flex items-center gap-2">
        <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl"
          style={{ background: 'var(--input-bg)', border: '1px solid var(--input-border)' }}>
          <Search size={12} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
          <input
            className="flex-1 bg-transparent text-xs outline-none"
            style={{ color: 'var(--text-secondary)' }}
            placeholder="Search by name, department, or tag…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button type="button" onClick={() => setSearch('')}>
              <X size={11} style={{ color: 'var(--text-muted)' }} />
            </button>
          )}
        </div>
        <div className="flex rounded-lg p-0.5 gap-0.5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          {['all', 'selected'].map(f => (
            <button key={f} type="button" onClick={() => setFilter(f)}
              className="px-3 py-1.5 text-xs font-medium rounded-md transition-all capitalize"
              style={filter === f
                ? { background: 'rgba(255,255,255,0.1)', color: '#f1f5f9' }
                : { color: '#64748b' }}>
              {f === 'all' ? `All (${KNOWLEDGE_PACKS.filter(p => p.status !== 'archived').length})` : `Selected (${selected.length})`}
            </button>
          ))}
        </div>
      </div>

      {/* Pack grid */}
      {visible.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 rounded-xl"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.1)' }}>
          <BookOpen size={24} style={{ color: 'var(--text-muted)', marginBottom: 8 }} />
          <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
            {filter === 'selected' ? 'No packs selected yet' : 'No packs match your search'}
          </p>
          {filter === 'selected' && (
            <button type="button" onClick={() => setFilter('all')}
              className="mt-2 text-xs underline" style={{ color: '#a78bfa' }}>
              Browse all packs
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {visible.map(pack => {
            const isSelected = selected.includes(pack.id)
            return (
              <button key={pack.id} type="button" onClick={() => toggle(pack.id)}
                className="flex items-start gap-4 p-4 rounded-xl text-left w-full transition-all duration-150"
                style={{
                  background: isSelected ? 'rgba(124,92,252,0.09)' : 'rgba(255,255,255,0.02)',
                  border: `1.5px solid ${isSelected ? 'rgba(124,92,252,0.5)' : 'rgba(255,255,255,0.07)'}`,
                }}>

                {/* Left: icon + id */}
                <div className="shrink-0 flex flex-col items-center gap-1.5 mt-0.5">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background: isSelected ? 'rgba(124,92,252,0.18)' : 'rgba(255,255,255,0.05)', border: `1px solid ${isSelected ? 'rgba(124,92,252,0.35)' : 'rgba(255,255,255,0.08)'}` }}>
                    <BookOpen size={15} style={{ color: isSelected ? '#a78bfa' : 'var(--text-muted)' }} />
                  </div>
                  <span className="text-[9px] font-mono" style={{ color: 'var(--text-muted)' }}>{pack.id}</span>
                </div>

                {/* Center: info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <p className="text-sm font-semibold" style={{ color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                      {pack.name}
                    </p>
                    {/* Status */}
                    <span className="flex items-center gap-1 text-[10px] font-medium">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: STATUS_DOT[pack.status] }} />
                      <span style={{ color: STATUS_DOT[pack.status] }}>{STATUS_LABEL[pack.status]}</span>
                    </span>
                    {/* Stale */}
                    {pack.isStale && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                        style={{ background: 'rgba(245,158,11,0.15)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.3)' }}>
                        ⚠ Stale
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] leading-relaxed mb-2.5" style={{ color: 'var(--text-muted)' }}>
                    {pack.description}
                  </p>

                  {/* Meta row */}
                  <div className="flex items-center gap-3 flex-wrap mb-2">
                    <span className="flex items-center gap-1 text-[10px]" style={{ color: 'var(--text-muted)' }}>
                      <Sparkles size={10} />
                      <span className="font-semibold" style={{ color: 'var(--text-secondary)' }}>{pack.factsCount}</span> facts
                    </span>
                    <span className="flex items-center gap-1 text-[10px]" style={{ color: 'var(--text-muted)' }}>
                      <Building2 size={10} /> {pack.department}
                    </span>
                    <span className="flex items-center gap-1 text-[10px]" style={{ color: 'var(--text-muted)' }}>
                      <Globe size={10} /> {pack.scope}
                    </span>
                    <span className="flex items-center gap-1 text-[10px]" style={{ color: 'var(--text-muted)' }}>
                      <Activity size={10} />
                      <span style={{ color: USAGE_COLOR[pack.usage] || '#94a3b8' }}>
                        {pack.usage ? pack.usage.charAt(0).toUpperCase() + pack.usage.slice(1) : '—'} usage
                      </span>
                    </span>
                    {pack.linkedTruthPlane && (
                      <span className="flex items-center gap-1 text-[10px]" style={{ color: 'var(--text-muted)' }}>
                        <Shield size={10} /> {pack.linkedTruthPlane}
                      </span>
                    )}
                  </div>

                  {/* Tags */}
                  {pack.tags && pack.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {pack.tags.map(t => (
                        <span key={t} className="text-[9px] px-1.5 py-0.5 rounded-full font-medium"
                          style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)', border: '1px solid rgba(255,255,255,0.08)' }}>
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right: eye preview + checkbox */}
                <div className="shrink-0 flex flex-col items-center gap-2 mt-0.5">
                  <button
                    type="button"
                    onClick={e => { e.stopPropagation(); setPreviewPack(pack) }}
                    className="btn-ghost p-1.5 rounded-lg"
                    title="Preview pack">
                    <Eye size={14} />
                  </button>
                  <div className="w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all"
                    style={{ borderColor: isSelected ? '#7c5cfc' : 'rgba(255,255,255,0.2)', background: isSelected ? '#7c5cfc' : 'transparent' }}>
                    {isSelected && <Check size={11} color="#fff" strokeWidth={3} />}
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      )}

      {/* Validation hint */}
      {selected.length === 0 && (
        <p className="text-[11px] text-center" style={{ color: '#f87171' }}>
          ⚠ At least one knowledge pack is required before proceeding
        </p>
      )}

      {/* Pack slide-out preview */}
      {previewPack && (
        <TruthPackSlideOut
          pack={previewPack}
          onClose={() => setPreviewPack(null)}
          onEdit={() => setPreviewPack(null)}
          onArchive={() => setPreviewPack(null)}
          onDuplicate={() => setPreviewPack(null)}
        />
      )}

    </div>
  )
}

// ── Step: Moment ──────────────────────────────────────────────────────────────
const MOMENT_OPTS = [
  'New Lead Created',
  'Customer Signup Completed',
  'Trial Started',
  'First Login Detected',
  'Renewal Window Opening',
  'Usage Threshold Crossed',
  'Support Ticket Created',
  'Inactivity Period Detected',
  'Feature Adoption Event',
]
const SOURCE_OPTS = [
  { id: 'CRM Platform',        label: 'CRM Platform',        icon: Users,         color: '#60a5fa', bg: 'rgba(59,130,246,0.15)',   desc: 'Contacts, deals & lead records'      },
  { id: 'Marketing Automation', label: 'Marketing Automation', icon: Sparkles,      color: '#a78bfa', bg: 'rgba(124,92,252,0.15)',  desc: 'Email, campaigns & nurture flows'    },
  { id: 'Product Analytics',   label: 'Product Analytics',   icon: BarChart2,     color: '#4ade80', bg: 'rgba(34,197,94,0.15)',    desc: 'Usage events, sessions & funnels'    },
  { id: 'Customer Platform',   label: 'Customer Platform',   icon: UserCheck,     color: '#2dd4bf', bg: 'rgba(20,184,166,0.15)',   desc: 'Onboarding, success & health scores' },
  { id: 'Support System',      label: 'Support System',      icon: MessageSquare, color: '#fbbf24', bg: 'rgba(245,158,11,0.15)',   desc: 'Tickets, escalations & CSAT'         },
  { id: 'Data Warehouse',      label: 'Data Warehouse',      icon: Hash,          color: '#94a3b8', bg: 'rgba(100,116,139,0.15)',  desc: 'Batch syncs & streaming pipelines'   },
  { id: 'Web Events',          label: 'Web Events',          icon: Globe,         color: '#818cf8', bg: 'rgba(99,102,241,0.15)',   desc: 'Sessions, clicks & form submissions' },
]
const CONDITION_FIELDS = ['Lead Source', 'Consent Availability', 'Rooftop / Store', 'Customer Type', 'Engagement State']
const CONDITION_OPS    = ['Equals', 'Not Equals', 'Contains', 'Is Empty', 'Is Not Empty']

function MomentStep({ data, onChange }) {
  const set = (key, val) => onChange({ ...data, [key]: val })

  // Qualifying conditions helpers
  const conditions = data.qualifyingConditions || []
  const addCondition = () => {
    const next = [...conditions, { id: Date.now(), field: '', operator: 'Equals', value: '' }]
    set('qualifyingConditions', next)
  }
  const removeCondition = (id) => set('qualifyingConditions', conditions.filter(c => c.id !== id))
  const updateCondition = (id, patch) =>
    set('qualifyingConditions', conditions.map(c => c.id === id ? { ...c, ...patch } : c))

  return (
    <div className="space-y-6">

      {/* Eligibility callout */}
      <div className="flex gap-3 p-4 rounded-xl"
        style={{ background: 'rgba(124,92,252,0.08)', border: '1px solid rgba(124,92,252,0.25)' }}>
        <div className="shrink-0 mt-0.5">
          <div className="w-5 h-5 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(124,92,252,0.25)' }}>
            <span style={{ color: '#a78bfa', fontSize: 11, fontWeight: 700 }}>i</span>
          </div>
        </div>
        <div>
          <p className="text-xs font-bold mb-1" style={{ color: '#a78bfa' }}>Eligibility, Not Auto-Launch</p>
          <p className="text-[11px] leading-relaxed" style={{ color: '#c4b5fd' }}>
            Meeting this moment makes the playbook <span style={{ color: '#a78bfa', fontWeight: 600 }}>available for NBA evaluation</span>—it
            doesn't automatically launch execution. NBA will consider this playbook alongside others and select the best fit.
          </p>
        </div>
      </div>

      {/* Primary Event / Moment */}
      <div>
        <FieldLabel required>Primary Event / Moment</FieldLabel>
        <select className="input-base w-full text-xs" value={data.primaryMoment}
          onChange={e => set('primaryMoment', e.target.value)}>
          <option value="">Select a moment...</option>
          {MOMENT_OPTS.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
        <p className="text-[10px] mt-1.5" style={{ color: 'var(--text-muted)' }}>
          The triggering event that signals playbook consideration
        </p>
      </div>

      {/* Event Source / System — multi-select */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <FieldLabel required>Event Source / System</FieldLabel>
          {(data.eventSource || []).length > 0 && (
            <button type="button"
              className="text-[10px] hover:opacity-70 transition-opacity"
              style={{ color: 'var(--text-muted)' }}
              onClick={() => set('eventSource', [])}>
              Clear all
            </button>
          )}
        </div>

        {/* OR callout */}
        <div className="flex items-center gap-2 mb-3 px-3 py-2 rounded-lg"
          style={{ background: 'rgba(124,92,252,0.07)', border: '1px solid rgba(124,92,252,0.18)' }}>
          <div className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(124,92,252,0.25)' }}>
            <span style={{ color: '#a78bfa', fontSize: 9, fontWeight: 700 }}>OR</span>
          </div>
          <p className="text-[10px] leading-relaxed" style={{ color: '#c4b5fd' }}>
            Select one or more sources — the playbook becomes eligible when <span style={{ fontWeight: 600 }}>any</span> selected system fires the event
          </p>
        </div>

        {/* Source cards grid */}
        <div className="grid grid-cols-2 gap-2">
          {SOURCE_OPTS.map(src => {
            const SrcIcon  = src.icon
            const selected = (data.eventSource || []).includes(src.id)
            const toggle   = () => {
              const cur  = data.eventSource || []
              const next = selected ? cur.filter(id => id !== src.id) : [...cur, src.id]
              set('eventSource', next)
            }
            return (
              <button key={src.id} type="button" onClick={toggle}
                className="flex items-start gap-3 p-3 rounded-xl text-left transition-all"
                style={{
                  background: selected ? 'rgba(124,92,252,0.1)' : 'rgba(255,255,255,0.03)',
                  border: `1.5px solid ${selected ? 'rgba(124,92,252,0.5)' : 'rgba(255,255,255,0.08)'}`,
                  transition: 'all 0.15s',
                }}>
                {/* Icon */}
                <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: selected ? src.bg : 'rgba(255,255,255,0.06)' }}>
                  <SrcIcon size={13} style={{ color: selected ? src.color : 'var(--text-muted)' }} />
                </div>
                {/* Text */}
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-semibold leading-tight"
                    style={{ color: selected ? '#e2d9ff' : 'var(--text-primary)' }}>
                    {src.label}
                  </p>
                  <p className="text-[10px] mt-0.5 leading-snug"
                    style={{ color: selected ? '#c4b5fd' : 'var(--text-muted)' }}>
                    {src.desc}
                  </p>
                </div>
                {/* Check indicator */}
                <div className="w-4 h-4 rounded flex-shrink-0 flex items-center justify-center mt-0.5"
                  style={{
                    background: selected ? '#7c5cfc' : 'transparent',
                    border: `1.5px solid ${selected ? '#7c5cfc' : 'rgba(255,255,255,0.15)'}`,
                    transition: 'all 0.15s',
                  }}>
                  {selected && <Check size={9} color="#fff" strokeWidth={3} />}
                </div>
              </button>
            )
          })}
        </div>

        {/* Selected summary */}
        {(data.eventSource || []).length > 0 ? (
          <p className="text-[10px] mt-2" style={{ color: '#a78bfa' }}>
            {(data.eventSource || []).length} source{(data.eventSource || []).length > 1 ? 's' : ''} selected as trigger
          </p>
        ) : (
          <p className="text-[10px] mt-2" style={{ color: 'var(--text-muted)' }}>
            Where NBA will listen for this event
          </p>
        )}
      </div>

      {/* Business Meaning */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <FieldLabel>Business Meaning <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(Optional)</span></FieldLabel>
          <AIAssistWidget fieldKey="businessMeaning" currentValue={data.businessMeaning}
            onAccept={val => set('businessMeaning', val)} />
        </div>
        <textarea className="input-base w-full text-xs resize-none leading-relaxed" rows={3}
          placeholder="Explain what this moment represents in the customer lifecycle and why it matters..."
          value={data.businessMeaning} onChange={e => set('businessMeaning', e.target.value)} />
        <p className="text-[10px] mt-1.5 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
          Describe the business significance of this moment. NBA uses this to understand why the event matters and how to
          prioritize actions. Your explanation overrides generic event interpretation.
        </p>
      </div>

      {/* Qualifying Conditions */}
      <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>Qualifying Conditions</p>
            <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>Additional filters that must be met for eligibility</p>
          </div>
          <button type="button" onClick={addCondition}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all hover:brightness-110"
            style={{ background: 'linear-gradient(135deg,#2563eb,#7c5cfc)', color: '#fff' }}>
            <Plus size={11} /> Add Condition
          </button>
        </div>

        {conditions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 gap-1.5 rounded-lg"
            style={{ background: 'rgba(255,255,255,0.025)', border: '1px dashed rgba(255,255,255,0.1)' }}>
            <Activity size={18} style={{ color: 'rgba(255,255,255,0.2)' }} />
            <p className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.35)' }}>No conditions yet</p>
            <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.2)' }}>Add filters to refine when this playbook qualifies</p>
          </div>
        ) : (
          <div className="space-y-2">
            {conditions.map((cond, idx) => (
              <div key={cond.id} className="flex items-center gap-2">
                {/* Index badge */}
                <div className="w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-[10px] font-bold"
                  style={{ background: 'rgba(124,92,252,0.2)', color: '#a78bfa' }}>
                  {idx + 1}
                </div>
                {/* Field */}
                <select className="input-base text-xs flex-1" value={cond.field}
                  onChange={e => updateCondition(cond.id, { field: e.target.value })}>
                  <option value="">Select field…</option>
                  {CONDITION_FIELDS.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
                {/* Operator */}
                <select className="input-base text-xs" style={{ width: 120 }} value={cond.operator}
                  onChange={e => updateCondition(cond.id, { operator: e.target.value })}>
                  {CONDITION_OPS.map(op => <option key={op} value={op}>{op}</option>)}
                </select>
                {/* Value */}
                <input type="text" className="input-base text-xs flex-1" placeholder="Enter value..."
                  value={cond.value} onChange={e => updateCondition(cond.id, { value: e.target.value })} />
                {/* Remove */}
                <button type="button" onClick={() => removeCondition(cond.id)}
                  className="w-6 h-6 flex items-center justify-center rounded transition-colors hover:opacity-70 shrink-0"
                  style={{ color: 'rgba(255,255,255,0.35)', fontSize: 18, lineHeight: 1 }}>
                  —
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Hard Gates sub-components ─────────────────────────────────────────────────
function GateCard({ icon: Icon, title, desc, children }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="rounded-xl overflow-hidden transition-all"
      style={{
        border: `1px solid ${open ? 'rgba(59,130,246,0.35)' : 'rgba(255,255,255,0.08)'}`,
        background: open ? 'rgba(59,130,246,0.03)' : 'rgba(255,255,255,0.02)',
      }}>
      <button type="button" onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-3 px-4 py-3.5 text-left">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: 'rgba(255,255,255,0.07)' }}>
          <Icon size={16} style={{ color: 'rgba(255,255,255,0.7)' }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>{title}</p>
          <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{desc}</p>
        </div>
        {open && (
          <span className="text-[10px] px-2 py-0.5 rounded font-bold mr-2 shrink-0"
            style={{ background: 'rgba(59,130,246,0.18)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.35)' }}>
            Active
          </span>
        )}
        <ChevronDown size={14} style={{ color: 'var(--text-muted)', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }} />
      </button>
      {open && (
        <div className="px-4 pb-4">
          <div className="h-px mb-4" style={{ background: 'rgba(255,255,255,0.06)' }} />
          {children}
        </div>
      )}
    </div>
  )
}

function GateCheckGrid({ label, items, selected, onToggle, cols = 2 }) {
  return (
    <div className="mb-4">
      <p className="text-[11px] font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>{label}</p>
      <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {items.map(item => {
          const checked = selected.includes(item)
          return (
            <button key={item} type="button" onClick={() => onToggle(item)}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-all text-left"
              style={{
                background: checked ? 'rgba(59,130,246,0.08)' : 'rgba(255,255,255,0.025)',
                border: `1px solid ${checked ? 'rgba(59,130,246,0.35)' : 'rgba(255,255,255,0.09)'}`,
              }}>
              <div className="w-4 h-4 rounded flex items-center justify-center shrink-0 transition-all"
                style={{ background: checked ? '#3b82f6' : 'transparent', border: `1.5px solid ${checked ? '#3b82f6' : 'rgba(255,255,255,0.25)'}` }}>
                {checked && (
                  <svg width="8" height="6" viewBox="0 0 8 6">
                    <path d="M1 3l2 2 4-4" stroke="#fff" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
              <span className="text-[11px]" style={{ color: checked ? 'var(--text-primary)' : 'var(--text-muted)' }}>{item}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function GateSelect({ label, value, onChange, opts }) {
  return (
    <div>
      <p className="text-[11px] font-semibold mb-1.5" style={{ color: 'var(--text-primary)' }}>{label}</p>
      <select className="input-base w-full text-xs" value={value} onChange={e => onChange(e.target.value)}>
        {opts.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  )
}

// ── Add Custom Gate Modal ─────────────────────────────────────────────────────
const CUSTOM_GATE_OUTCOMES = [
  'Suppress Playbook',
  'Defer Until Met',
  'Route to Draft Review',
  'Create Task Instead',
  'Mark Not Eligible',
]

function AddCustomGateModal({ onClose, onSave }) {
  const [name,        setName]        = useState('Custom Gate')
  const [description, setDescription] = useState('')
  const [ifNotMet,    setIfNotMet]    = useState('Suppress Playbook')

  const handleSave = () => {
    if (!description.trim()) return
    onSave({ id: Date.now(), name: name.trim() || 'Custom Gate', description: description.trim(), ifNotMet })
    onClose()
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
      onMouseDown={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="w-full rounded-2xl flex flex-col"
        style={{ maxWidth: 480, background: 'rgba(18,14,36,0.97)', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 24px 64px rgba(0,0,0,0.6)' }}>

        {/* Header — editable name */}
        <div className="flex items-center gap-3 px-5 pt-5 pb-4"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <input
            className="flex-1 bg-transparent text-sm font-bold outline-none"
            style={{ color: 'var(--text-primary)' }}
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Gate name..."
          />
          <button type="button" onClick={onClose}
            className="w-6 h-6 flex items-center justify-center rounded-md transition-colors hover:opacity-70"
            style={{ color: 'var(--text-muted)', fontSize: 18, lineHeight: 1 }}>
            ×
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4 space-y-4">

          {/* Description */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-[11px] font-semibold" style={{ color: 'var(--text-primary)' }}>Description</p>
              <AIAssistWidget fieldKey="gateDescription" currentValue={description}
                onAccept={val => setDescription(val)} />
            </div>
            <textarea
              className="input-base w-full text-xs resize-none leading-relaxed"
              rows={3}
              placeholder="Describe the rule, condition, or restriction..."
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
            <p className="text-[10px] mt-1.5 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              Clearly explain the condition and its intent. NBA and the execution engine will use this to determine
              whether to proceed, defer, or block actions.
            </p>
          </div>

          {/* If not met */}
          <div>
            <select className="input-base w-full text-xs" value={ifNotMet} onChange={e => setIfNotMet(e.target.value)}>
              {CUSTOM_GATE_OUTCOMES.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-5 py-4"
          style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <button type="button" onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-medium transition-all hover:opacity-70"
            style={{ color: 'var(--text-muted)' }}>
            Cancel
          </button>
          <button type="button" onClick={handleSave} disabled={!description.trim()}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all hover:brightness-110 disabled:opacity-40"
            style={{ background: 'linear-gradient(135deg,#2563eb,#7c5cfc)', color: '#fff' }}>
            <Plus size={12} /> Add Gate
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}

// ── Step: Hard Gates ──────────────────────────────────────────────────────────
function GatesStep({ data, onChange }) {
  const set = (key, val) => onChange({ ...data, [key]: val })
  const toggleArr = (key, val) => {
    const arr = data[key] || []
    set(key, arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val])
  }
  const [showGateModal, setShowGateModal] = useState(false)
  const customGates = data.gate_custom || []
  const addCustomGate  = (gate) => set('gate_custom', [...customGates, gate])
  const removeCustomGate = (id) => set('gate_custom', customGates.filter(g => g.id !== id))

  return (
    <div className="space-y-4">

      {/* Orange callout — What NBA Cannot Override */}
      <div className="flex gap-3 p-4 rounded-xl"
        style={{ background: 'rgba(234,88,12,0.08)', border: '1px solid rgba(234,88,12,0.28)' }}>
        <Shield size={15} style={{ color: '#fb923c', flexShrink: 0, marginTop: 1 }} />
        <div>
          <p className="text-xs font-bold mb-1" style={{ color: '#fb923c' }}>What NBA Cannot Override</p>
          <p className="text-[11px] leading-relaxed" style={{ color: '#fdba74' }}>
            Hard Gates are <span style={{ fontWeight: 600 }}>deterministic constraints</span> that NBA must respect. If a gate
            fails, the playbook will follow the configured outcome—no exceptions. Use these to enforce compliance, legal
            requirements, and business rules.
          </p>
        </div>
      </div>

      {/* Blue info callout */}
      <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl"
        style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.2)' }}>
        <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0"
          style={{ background: 'rgba(59,130,246,0.25)' }}>
          <span style={{ color: '#60a5fa', fontSize: 10, fontWeight: 700 }}>i</span>
        </div>
        <p className="text-[11px]" style={{ color: '#93c5fd' }}>
          <span style={{ fontWeight: 600, color: '#60a5fa' }}>All gates are optional.</span> Enable only the constraints your
          playbook truly requires. More gates = more restrictive eligibility.
        </p>
      </div>

      {/* ── Gate 1: Consent Required ── */}
      <GateCard icon={UserCheck} title="Consent Required" desc="Require customer consent for specific channels">
        <GateCheckGrid
          label="Required Consent Channels"
          items={['SMS', 'Email', 'Phone', 'WhatsApp']}
          selected={data.gate_consent_channels || []}
          onToggle={val => toggleArr('gate_consent_channels', val)}
        />
        <GateSelect
          label="If Consent Not Met"
          value={data.gate_consent_ifNotMet}
          onChange={v => set('gate_consent_ifNotMet', v)}
          opts={['Suppress Playbook', 'Skip Channel Only', 'Defer Until Met', 'Log & Continue']}
        />
      </GateCard>

      {/* ── Gate 2: Rep Active / Ownership Conflict ── */}
      <GateCard icon={Users} title="Rep Active / Ownership Conflict" desc="Block if rep is actively working this customer">
        <GateSelect
          label="Check Activity Window"
          value={data.gate_rep_window}
          onChange={v => set('gate_rep_window', v)}
          opts={['Last 24 Hours', 'Last 48 Hours', 'Last 7 Days', 'Last 30 Days']}
        />
        <div className="mt-3">
          <GateSelect
            label="If Rep Is Active"
            value={data.gate_rep_ifActive}
            onChange={v => set('gate_rep_ifActive', v)}
            opts={['Create Task Instead', 'Skip Playbook', 'Notify Rep', 'Suppress Until Inactive']}
          />
        </div>
      </GateCard>

      {/* ── Gate 3: Channel Availability ── */}
      <GateCard icon={MessageSquare} title="Channel Availability" desc="Require specific communication channels to be available">
        <GateCheckGrid
          label="Required Available Channels"
          items={['SMS', 'Email', 'Phone', 'In-App']}
          selected={data.gate_channel_channels || []}
          onToggle={val => toggleArr('gate_channel_channels', val)}
        />
        <GateSelect
          label="If Channel Not Available"
          value={data.gate_channel_ifNotMet}
          onChange={v => set('gate_channel_ifNotMet', v)}
          opts={['Defer Until Met', 'Skip Channel Only', 'Suppress Playbook', 'Use Fallback Channel']}
        />
      </GateCard>

      {/* ── Gate 4: Customer Status Restrictions ── */}
      <GateCard icon={Activity} title="Customer Status Restrictions" desc="Block customers with specific statuses">
        <GateCheckGrid
          label="Blocked Customer Statuses"
          items={['Churned', 'Suspended', 'Payment Past Due', 'Legal Hold']}
          selected={data.gate_status_statuses || []}
          onToggle={val => toggleArr('gate_status_statuses', val)}
        />
        <GateSelect
          label="If Status Blocked"
          value={data.gate_status_ifBlocked}
          onChange={v => set('gate_status_ifBlocked', v)}
          opts={['Suppress Playbook', 'Defer Execution', 'Notify Account Team', 'Mark Not Eligible']}
        />
      </GateCard>

      {/* ── Gate 6: Compliance Restrictions ── */}
      <GateCard icon={FileText} title="Compliance Restrictions" desc="Enforce legal and compliance requirements">
        <GateCheckGrid
          label="Compliance Checks"
          items={[
            'Respect Do Not Call (DNC) Registry',
            'Require TCPA Compliance for SMS/Calls',
            'Check GDPR Opt-Out Status',
          ]}
          selected={data.gate_compliance_checks || []}
          onToggle={val => toggleArr('gate_compliance_checks', val)}
          cols={1}
        />
        {/* "If not met" behavior — coming in next iteration */}
      </GateCard>

      {/* ── Custom Gates ── */}
      <div className="rounded-xl overflow-hidden"
        style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)' }}>

        {/* Header row */}
        <div className="flex items-start justify-between px-4 py-3.5">
          <div className="flex-1 min-w-0 pr-4">
            <p className="text-xs font-bold mb-0.5" style={{ color: 'var(--text-primary)' }}>Custom Gates</p>
            <p className="text-[10px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              Define rules that must be respected before this playbook can run. These constraints override default NBA
              behavior and are enforced during execution.
            </p>
          </div>
          <button type="button" onClick={() => setShowGateModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[11px] font-semibold transition-all hover:brightness-110 shrink-0"
            style={{ background: 'linear-gradient(135deg,#2563eb,#7c5cfc)', color: '#fff' }}>
            <Plus size={11} /> Add Custom Gate
          </button>
        </div>

        {/* Saved custom gates */}
        {customGates.length > 0 && (
          <div className="px-4 pb-4 space-y-2">
            <div className="h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
            {customGates.map(gate => (
              <div key={gate.id} className="flex items-start gap-3 px-3 py-3 rounded-lg"
                style={{ background: 'rgba(124,92,252,0.06)', border: '1px solid rgba(124,92,252,0.2)' }}>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>{gate.name}</p>
                  <p className="text-[10px] mt-0.5 leading-relaxed" style={{ color: 'var(--text-muted)' }}>{gate.description}</p>
                  <span className="inline-block mt-1.5 text-[9px] px-2 py-0.5 rounded-full font-semibold"
                    style={{ background: 'rgba(234,88,12,0.15)', color: '#fb923c', border: '1px solid rgba(234,88,12,0.3)' }}>
                    {gate.ifNotMet}
                  </span>
                </div>
                <button type="button" onClick={() => removeCustomGate(gate.id)}
                  className="shrink-0 mt-0.5 transition-opacity hover:opacity-70"
                  style={{ color: 'rgba(255,255,255,0.3)' }}>
                  <span style={{ fontSize: 16, lineHeight: 1 }}>×</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showGateModal && (
        <AddCustomGateModal
          onClose={() => setShowGateModal(false)}
          onSave={addCustomGate}
        />
      )}

    </div>
  )
}

// ── Objective & Success constants ─────────────────────────────────────────────
const GOAL_TYPES = [
  'Book Appointment',
  'Start Two-Way Conversation',
  'Qualify Lead',
  'Re-engage Lead',
  'Drive Service Appointment',
  'Collect Feedback',
  'Compliance Notification',
  'Collect Missing Info',
]
const SUCCESS_EVENTS_MAP = {
  'Book Appointment':           ['Appointment booked', 'Demo scheduled', 'Meeting confirmed', 'Callback requested'],
  'Start Two-Way Conversation': ['Conversation started', 'Reply received', 'Engagement initiated'],
  'Qualify Lead':               ['Lead qualified', 'Qualification completed', 'BANT captured'],
  'Re-engage Lead':             ['Lead re-engaged', 'Response received', 'Meeting rescheduled'],
  'Drive Service Appointment':  ['Service appointment booked', 'Service scheduled', 'Visit confirmed'],
  'Collect Feedback':           ['Survey completed', 'Feedback submitted', 'Review posted', 'Rating provided'],
  'Compliance Notification':    ['Notification sent', 'Acknowledgment received', 'Opt-in confirmed'],
  'Collect Missing Info':       ['Information provided', 'Form completed', 'Data captured'],
}
const EXIT_CONDITIONS = [
  { id: 'time-limit',        label: 'Maximum Time Limit',          sub: 'Time-based limit'        },
  { id: 'max-attempts',      label: 'Maximum Attempts Reached',     sub: 'Action-based threshold'  },
  { id: 'opted-out',         label: 'Customer Opted Out',           sub: 'Event-based trigger'     },
  { id: 'negative-response', label: 'Negative Response Received',   sub: 'Event-based trigger'     },
]
const FAILURE_OUTCOMES = [
  { id: 'archive',        label: 'Archive',        sub: 'Mark complete, no action',   icon: Archive       },
  { id: 'escalate',       label: 'Escalate',       sub: 'Send to manager review',     icon: UserCheck     },
  { id: 'notify',         label: 'Notify',         sub: 'Alert a team member',        icon: MessageSquare },
  { id: 'retry',          label: 'Retry Later',    sub: 'Re-enter the queue',         icon: RotateCcw     },
  { id: 'apply-playbook', label: 'Apply Playbook', sub: 'Hand off to another playbook', icon: GitBranch   },
]
const NEXT_PLAYBOOKS = [
  'Enterprise Onboarding', 'No-Show Recovery', 'Service Reminder Retention',
  'Re-engagement Campaign', 'VIP Follow-Up',
]

// ── Step: Objective & Success ─────────────────────────────────────────────────
function ObjectiveStep({ data, onChange }) {
  const set = (key, val) => onChange({ ...data, [key]: val })

  const toggleExit = (id) => {
    const arr = data.exitConditions || []
    const exists = arr.some(e => e.id === id)
    set('exitConditions', exists
      ? arr.filter(e => e.id !== id)
      : [...arr, { id, outcome: '', nextPlaybook: '' }]
    )
  }
  const setExitOutcome = (id, outcome) =>
    set('exitConditions', (data.exitConditions || []).map(e =>
      e.id === id ? { ...e, outcome, nextPlaybook: '' } : e
    ))
  const setExitPlaybook = (id, nextPlaybook) =>
    set('exitConditions', (data.exitConditions || []).map(e =>
      e.id === id ? { ...e, nextPlaybook } : e
    ))
  const successEvents = SUCCESS_EVENTS_MAP[data.goalType] || []

  return (
    <div className="space-y-5">

      {/* ── Plan Lifecycle diagram ── */}
      <div className="rounded-xl p-4" style={{ background: 'rgba(30,27,75,0.5)', border: '1px solid rgba(99,102,241,0.2)' }}>
        <div className="flex items-center gap-2 mb-4">
          <Activity size={13} style={{ color: '#818cf8' }} />
          <p className="text-xs font-bold" style={{ color: '#818cf8' }}>Plan Lifecycle</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Eligible box */}
          <div className="flex-1 rounded-lg px-3 py-2.5" style={{ background: 'rgba(37,99,235,0.12)', border: '1px solid rgba(37,99,235,0.25)' }}>
            <div className="flex items-center gap-1.5 mb-0.5">
              <PlayCircle size={12} style={{ color: '#60a5fa' }} />
              <p className="text-xs font-bold" style={{ color: '#60a5fa' }}>Eligible</p>
            </div>
            <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.4)' }}>Moment triggers, gates pass</p>
          </div>
          <ChevronRight size={13} style={{ color: 'rgba(255,255,255,0.2)', flexShrink: 0 }} />
          {/* Active Plan box */}
          <div className="flex-1 rounded-lg px-3 py-2.5" style={{ background: 'rgba(124,92,252,0.12)', border: '1px solid rgba(124,92,252,0.25)' }}>
            <div className="flex items-center gap-1.5 mb-0.5">
              <Activity size={12} style={{ color: '#a78bfa' }} />
              <p className="text-xs font-bold" style={{ color: '#a78bfa' }}>Active Plan</p>
            </div>
            <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.4)' }}>Actions executing</p>
          </div>
          <ChevronRight size={13} style={{ color: 'rgba(255,255,255,0.2)', flexShrink: 0 }} />
          {/* Outcomes */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.3)' }}>
              <CheckCircle size={11} style={{ color: '#4ade80' }} />
              <p className="text-[11px] font-semibold" style={{ color: '#4ade80' }}>Success</p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: 'rgba(234,88,12,0.08)', border: '1px solid rgba(234,88,12,0.35)' }}>
              <XCircle size={11} style={{ color: '#fb923c' }} />
              <p className="text-[11px] font-semibold" style={{ color: '#fb923c' }}>Exit</p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)' }}>
              <Clock size={11} style={{ color: 'rgba(255,255,255,0.35)' }} />
              <p className="text-[11px] font-semibold" style={{ color: 'rgba(255,255,255,0.35)' }}>Expired</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Goal Type ── */}
      <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="flex items-start gap-3 mb-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.28)' }}>
            <Flag size={14} style={{ color: '#4ade80' }} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-1">
              <p className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>Goal Type</p>
              <span style={{ color: '#ef4444', fontSize: 12, lineHeight: 1 }}>*</span>
            </div>
            <p className="text-[10px] mt-0.5 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              Defines the primary intent of this strategy. NBA uses this to prioritize actions and recommend success criteria.
            </p>
          </div>
        </div>
        <select className="input-base w-full text-xs" value={data.goalType}
          onChange={e => onChange({ ...data, goalType: e.target.value, primarySuccessEvent: '' })}>
          <option value="">Select goal type...</option>
          {GOAL_TYPES.map(g => <option key={g} value={g}>{g}</option>)}
        </select>
      </div>

      {/* ── Primary Success Event — revealed when goal type selected ── */}
      {data.goalType && (
        <div>
          <div className="flex items-center gap-1 mb-1.5">
            <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>Primary Success Event</p>
            <span style={{ color: '#ef4444', fontSize: 12, lineHeight: 1 }}>*</span>
          </div>
          <select className="input-base w-full text-xs" value={data.primarySuccessEvent}
            onChange={e => set('primarySuccessEvent', e.target.value)}>
            <option value="">Select primary success event...</option>
            {successEvents.map(ev => <option key={ev} value={ev}>{ev}</option>)}
          </select>
          <p className="text-[10px] mt-1.5" style={{ color: '#60a5fa' }}>
            • Secondary signals help NBA adapt the plan over time
          </p>
        </div>
      )}

      {/* ── Exit Conditions — each with its own inline outcome ── */}
      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(234,88,12,0.25)' }}>

        {/* Header */}
        <div className="flex items-center gap-3 px-4 pt-4 pb-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: 'rgba(234,88,12,0.12)', border: '1px solid rgba(234,88,12,0.28)' }}>
            <XCircle size={14} style={{ color: '#fb923c' }} />
          </div>
          <div>
            <p className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>Exit Conditions</p>
            <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
              Select each condition that can stop this plan early, then define what happens for each one.
            </p>
          </div>
        </div>

        {/* Conditions list */}
        <div className="px-4 space-y-2 pb-4">
          {EXIT_CONDITIONS.map(ec => {
            const entry   = (data.exitConditions || []).find(e => e.id === ec.id)
            const checked = !!entry
            return (
              <div key={ec.id} className="rounded-xl overflow-hidden transition-all"
                style={{ border: `1.5px solid ${checked ? 'rgba(234,88,12,0.4)' : 'rgba(255,255,255,0.08)'}` }}>

                {/* Condition toggle row */}
                <button type="button" onClick={() => toggleExit(ec.id)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-left transition-all"
                  style={{ background: checked ? 'rgba(234,88,12,0.06)' : 'rgba(255,255,255,0.02)' }}>
                  <div className="w-4 h-4 rounded flex items-center justify-center shrink-0 transition-all"
                    style={{ background: checked ? '#fb923c' : 'transparent', border: `1.5px solid ${checked ? '#fb923c' : 'rgba(255,255,255,0.25)'}` }}>
                    {checked && <svg width="8" height="6" viewBox="0 0 8 6"><path d="M1 3l2 2 4-4" stroke="#fff" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold" style={{ color: checked ? 'var(--text-primary)' : 'rgba(255,255,255,0.55)' }}>{ec.label}</p>
                    <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{ec.sub}</p>
                  </div>
                  {checked && entry.outcome && (
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0"
                      style={{ background: 'rgba(234,88,12,0.12)', color: '#fb923c', border: '1px solid rgba(234,88,12,0.25)' }}>
                      {FAILURE_OUTCOMES.find(f => f.id === entry.outcome)?.label || entry.outcome}
                    </span>
                  )}
                </button>

                {/* Per-condition outcome — only when checked */}
                {checked && (
                  <div className="px-4 pt-3 pb-4"
                    style={{ borderTop: '1px solid rgba(234,88,12,0.15)', background: 'rgba(0,0,0,0.12)' }}>
                    <p className="text-[10px] font-semibold mb-2" style={{ color: 'rgba(255,255,255,0.45)' }}>
                      OUTCOME WHEN THIS CONDITION IS MET
                    </p>
                    <div className="grid grid-cols-2 gap-1.5 mb-2">
                      {FAILURE_OUTCOMES.map(fo => {
                        const active = entry.outcome === fo.id
                        const Icon   = fo.icon
                        return (
                          <button key={fo.id} type="button"
                            onClick={() => setExitOutcome(ec.id, fo.id)}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-all"
                            style={{
                              background: active ? 'rgba(124,92,252,0.12)' : 'rgba(255,255,255,0.03)',
                              border: `1.5px solid ${active ? 'rgba(124,92,252,0.5)' : 'rgba(255,255,255,0.08)'}`,
                            }}>
                            <Icon size={12} style={{ color: active ? '#a78bfa' : 'rgba(255,255,255,0.35)', flexShrink: 0 }} />
                            <div>
                              <p className="text-[11px] font-semibold leading-tight"
                                style={{ color: active ? '#fff' : 'rgba(255,255,255,0.6)' }}>
                                {fo.label}
                              </p>
                              <p className="text-[9px] leading-tight" style={{ color: 'var(--text-muted)' }}>{fo.sub}</p>
                            </div>
                          </button>
                        )
                      })}
                    </div>

                    {/* Apply Playbook selector */}
                    {entry.outcome === 'apply-playbook' && (
                      <div className="mt-2 p-3 rounded-xl"
                        style={{ background: 'rgba(37,99,235,0.07)', border: '1px solid rgba(37,99,235,0.22)' }}>
                        <p className="text-[10px] font-semibold mb-1.5" style={{ color: '#93c5fd' }}>Select Next Playbook</p>
                        <select className="input-base w-full text-xs" value={entry.nextPlaybook || ''}
                          onChange={e => setExitPlaybook(ec.id, e.target.value)}>
                          <option value="">Choose a playbook…</option>
                          {NEXT_PLAYBOOKS.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                        <p className="text-[10px] mt-1.5 leading-relaxed" style={{ color: '#60a5fa' }}>
                          When <span style={{ fontWeight: 600 }}>"{ec.label}"</span> is triggered, this playbook will be automatically applied.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Footer note */}
        <div className="flex items-center gap-2 px-4 pb-4 -mt-2">
          <div className="w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0"
            style={{ background: 'rgba(255,255,255,0.1)' }}>
            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 9, fontWeight: 700 }}>i</span>
          </div>
          <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.3)' }}>
            Each condition can trigger a different outcome — archive, escalate, retry, or hand off to another playbook
          </p>
        </div>
      </div>

      {/* ── Business KPI Association ── */}
      <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: 'rgba(124,92,252,0.15)', border: '1px solid rgba(124,92,252,0.3)' }}>
            <BarChart2 size={14} style={{ color: '#a78bfa' }} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <p className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>Business KPI Association</p>
              <span className="text-[10px] font-normal" style={{ color: 'var(--text-muted)' }}>(Optional)</span>
            </div>
            <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
              Link this objective to a business metric for reporting
            </p>
          </div>
        </div>
        <select className="input-base w-full text-xs" value={data.kpiAssociation}
          onChange={e => set('kpiAssociation', e.target.value)}>
          <option value="">No KPI association</option>
          <option>Conversion Rate</option>
          <option>Customer Retention</option>
          <option>Revenue Per Customer</option>
          <option>Appointment Show Rate</option>
          <option>Service Completion</option>
        </select>
      </div>

      {/* ── Strategy Intent Notes ── */}
      <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: 'rgba(255,255,255,0.06)' }}>
              <MessageSquare size={14} style={{ color: 'rgba(255,255,255,0.45)' }} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>Strategy Intent Notes</p>
                <span className="text-[10px] font-normal" style={{ color: 'var(--text-muted)' }}>(Optional)</span>
              </div>
              <p className="text-[10px] mt-0.5 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                Describe the strategic reasoning behind this objective. NBA uses this guidance to align decisions with
                business intent. Your instructions take priority over default optimization logic.
              </p>
            </div>
          </div>
          <AIAssistWidget fieldKey="strategyNotes" currentValue={data.strategyNotes}
            onAccept={val => set('strategyNotes', val)} />
        </div>
        <textarea className="input-base w-full text-xs resize-none leading-relaxed" rows={3}
          placeholder="Explain why this objective matters and how success should be interpreted..."
          value={data.strategyNotes} onChange={e => set('strategyNotes', e.target.value)} />
      </div>

    </div>
  )
}

// ── Phases constants ──────────────────────────────────────────────────────────
const PHASE_TYPES = [
  { id: 'urgent',       emoji: '⚡', label: 'Urgente'       },
  { id: 'followup',     emoji: '📈', label: 'Follow-Up'     },
  { id: 'nurture',      emoji: '💛', label: 'Nurture'       },
  { id: 'reengagement', emoji: '🔁', label: 'Re-engagement' },
  { id: 'custom',       emoji: '⭐', label: 'Custom'        },
]
const PHASE_CHANNELS = [
  { id: 'sms',      label: 'SMS',      color: '#22c55e', bg: 'rgba(34,197,94,0.15)',  border: 'rgba(34,197,94,0.3)'  },
  { id: 'phone',    label: 'Phone',    color: '#3b82f6', bg: 'rgba(59,130,246,0.15)', border: 'rgba(59,130,246,0.3)' },
  { id: 'email',    label: 'Email',    color: '#a78bfa', bg: 'rgba(124,92,252,0.15)', border: 'rgba(124,92,252,0.3)' },
  { id: 'whatsapp', label: 'WhatsApp', color: '#14b8a6', bg: 'rgba(20,184,166,0.15)', border: 'rgba(20,184,166,0.3)' },
  { id: 'inapp',    label: 'In-App',   color: '#fb923c', bg: 'rgba(249,115,22,0.15)', border: 'rgba(249,115,22,0.3)' },
]
const PHASES_TEMPLATES = [
  {
    id: 'hot-window',
    name: 'Hot Window + Follow-Up',
    desc: 'Urgent outreach followed by a structured nurture sequence',
    phases: [
      { name: 'Hot Window', icon: 'urgent',       duration: '3',  durationUnit: 'Days', maxAttempts: '3', channels: ['sms','phone'],  goal: 'Immediate high-urgency contact attempt',   notes: '' },
      { name: 'Follow-Up',  icon: 'followup',     duration: '7',  durationUnit: 'Days', maxAttempts: '4', channels: ['email','sms'],  goal: 'Maintain engagement and drive conversion', notes: '' },
      { name: 'Nurture',    icon: 'nurture',      duration: '30', durationUnit: 'Days', maxAttempts: '5', channels: ['email'],         goal: 'Long-term relationship building',          notes: '' },
    ],
  },
  {
    id: 'reengagement',
    name: 'Re-engagement Campaign',
    desc: 'Multi-touch win-back sequence for inactive customers',
    phases: [
      { name: 'Re-activate', icon: 'reengagement', duration: '7', durationUnit: 'Days', maxAttempts: '3', channels: ['email','sms'], goal: 'Re-ignite customer interest',       notes: '' },
      { name: 'Final Push',  icon: 'urgent',        duration: '3', durationUnit: 'Days', maxAttempts: '2', channels: ['phone','sms'], goal: 'Last-chance conversion attempt',    notes: '' },
    ],
  },
  {
    id: 'service',
    name: 'Service Reminder',
    desc: 'Proactive service appointment follow-up sequence',
    phases: [
      { name: 'Reminder',   icon: 'nurture', duration: '7', durationUnit: 'Days', maxAttempts: '2', channels: ['sms','email'], goal: 'Notify customer of upcoming service need', notes: '' },
      { name: 'Escalation', icon: 'urgent',  duration: '3', durationUnit: 'Days', maxAttempts: '3', channels: ['phone','sms'], goal: 'Ensure service appointment is booked',     notes: '' },
    ],
  },
]
function getPhaseType(id) { return PHASE_TYPES.find(t => t.id === id) || PHASE_TYPES[4] }

// ── Step: Phases ──────────────────────────────────────────────────────────────
function PhasesStep({ data, onChange }) {
  const phases = data.phases || []
  const setPhases = (p) => onChange({ ...data, phases: p })
  const updatePhase = (id, patch) => setPhases(phases.map(p => p.id === id ? { ...p, ...patch } : p))
  const removePhase = (id) => setPhases(phases.filter(p => p.id !== id))

  const [showTemplates, setShowTemplates] = useState(phases.length === 0)
  const [activeTemplate, setActiveTemplate] = useState(null)

  const addBlankPhase = () => {
    const id = Date.now()
    setPhases([...phases, { id, name: `Phase ${phases.length + 1}`, icon: 'custom', goal: '', duration: '', durationUnit: 'Days', maxAttempts: '', channels: [], notes: '' }])
    setShowTemplates(false)
  }

  const applyTemplate = (tpl) => {
    const newPhases = tpl.phases.map((p, i) => ({ ...p, id: Date.now() + i }))
    setPhases(newPhases)
    setActiveTemplate(tpl.id)
    setShowTemplates(false)
  }

  const toggleChannel = (phaseId, chId) => {
    const phase = phases.find(p => p.id === phaseId)
    if (!phase) return
    const ch = phase.channels || []
    updatePhase(phaseId, { channels: ch.includes(chId) ? ch.filter(c => c !== chId) : [...ch, chId] })
  }

  return (
    <div className="space-y-5">

      {/* ── Template picker ── */}
      {showTemplates ? (
        <div>
          <SectionLabel>Quick Start from Template</SectionLabel>
          <div className="space-y-2 mb-4">
            {PHASES_TEMPLATES.map(tpl => (
              <button key={tpl.id} type="button" onClick={() => applyTemplate(tpl)}
                className="w-full text-left p-4 rounded-xl transition-all hover:brightness-110"
                style={{
                  background: activeTemplate === tpl.id ? 'rgba(59,130,246,0.08)' : 'rgba(255,255,255,0.02)',
                  border: `1.5px solid ${activeTemplate === tpl.id ? 'rgba(59,130,246,0.4)' : 'rgba(255,255,255,0.08)'}`,
                }}>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <p className="text-xs font-bold mb-0.5" style={{ color: 'var(--text-primary)' }}>{tpl.name}</p>
                    <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{tpl.desc}</p>
                  </div>
                  <span className="text-[9px] px-2 py-0.5 rounded-full font-bold shrink-0"
                    style={{ background: 'rgba(59,130,246,0.15)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.3)' }}>
                    {tpl.phases.length} phases
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {tpl.phases.map((p, i) => {
                    const pt = getPhaseType(p.icon)
                    return (
                      <span key={i} className="inline-flex items-center gap-1 text-[9px] px-2 py-0.5 rounded-full font-medium"
                        style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)', border: '1px solid rgba(255,255,255,0.1)' }}>
                        {pt.emoji} {p.name}
                      </span>
                    )
                  })}
                </div>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="h-px flex-1" style={{ background: 'rgba(255,255,255,0.07)' }} />
            <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>or</span>
            <div className="h-px flex-1" style={{ background: 'rgba(255,255,255,0.07)' }} />
          </div>

          <button type="button" onClick={addBlankPhase}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-medium transition-all hover:brightness-110 mt-3"
            style={{ background: 'rgba(124,92,252,0.07)', border: '1px dashed rgba(124,92,252,0.35)', color: '#a78bfa' }}>
            <Plus size={13} /> Start from Scratch
          </button>
        </div>
      ) : (
        /* ── Header row when phases exist ── */
        <div className="flex items-center justify-between">
          <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
            {phases.length} phase{phases.length !== 1 ? 's' : ''} configured
          </p>
          <button type="button" onClick={() => setShowTemplates(true)}
            className="text-[11px] font-medium transition-colors hover:opacity-70"
            style={{ color: '#60a5fa' }}>
            Change template
          </button>
        </div>
      )}

      {/* ── Phase cards ── */}
      {phases.length > 0 && !showTemplates && (
        <div className="space-y-4">
          <SectionLabel>Phases</SectionLabel>

          {phases.map((phase, i) => (
              <div key={phase.id} className="rounded-xl overflow-hidden"
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)' }}>

                {/* Card header — editable name */}
                <div className="flex items-center gap-3 px-4 py-3"
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.01)' }}>
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold shrink-0"
                    style={{ background: 'rgba(124,92,252,0.15)', border: '1px solid rgba(124,92,252,0.25)', color: '#a78bfa' }}>
                    {i + 1}
                  </div>
                  <input
                    className="flex-1 bg-transparent text-xs font-bold outline-none"
                    style={{ color: 'var(--text-primary)' }}
                    value={phase.name}
                    onChange={e => updatePhase(phase.id, { name: e.target.value })}
                    placeholder={`Phase ${i + 1} name...`}
                  />
                  <button type="button" onClick={() => removePhase(phase.id)}
                    className="opacity-35 hover:opacity-80 transition-opacity shrink-0">
                    <Trash2 size={12} style={{ color: '#f87171' }} />
                  </button>
                </div>

                {/* Card body */}
                <div className="px-4 py-4 space-y-4">

                  {/* Goal */}
                  <div>
                    <FieldLabel required>Phase Goal</FieldLabel>
                    <input type="text" className="input-base w-full text-xs"
                      placeholder="What should this phase achieve?"
                      value={phase.goal || ''} onChange={e => updatePhase(phase.id, { goal: e.target.value })} />
                  </div>

                  {/* Duration · Unit · Max Attempts — with individual sub-labels */}
                  <div>
                    <FieldLabel>Duration & Pacing</FieldLabel>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <input type="number" min="1" className="input-base w-full text-xs" placeholder="e.g. 7"
                          value={phase.duration || ''} onChange={e => updatePhase(phase.id, { duration: e.target.value })} />
                        <p className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>Duration</p>
                      </div>
                      <div>
                        <select className="input-base w-full text-xs" value={phase.durationUnit || 'Days'}
                          onChange={e => updatePhase(phase.id, { durationUnit: e.target.value })}>
                          <option>Days</option><option>Weeks</option><option>Months</option>
                        </select>
                        <p className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>Unit</p>
                      </div>
                      <div>
                        <input type="number" min="1" className="input-base w-full text-xs" placeholder="e.g. 3"
                          value={phase.maxAttempts || ''} onChange={e => updatePhase(phase.id, { maxAttempts: e.target.value })} />
                        <p className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>Max attempts / customer</p>
                      </div>
                    </div>
                  </div>

                  {/* Channel Priority — numbered by selection order */}
                  <div>
                    <FieldLabel hint="Click channels in order of preference — first selected becomes Priority 1">
                      Channel Priority
                    </FieldLabel>
                    <div className="flex flex-wrap gap-2">
                      {PHASE_CHANNELS.map(ch => {
                        const channels = phase.channels || []
                        const idx      = channels.indexOf(ch.id)
                        const active   = idx !== -1
                        const priority = idx + 1
                        return (
                          <button key={ch.id} type="button" onClick={() => toggleChannel(phase.id, ch.id)}
                            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all"
                            style={{
                              background: active ? ch.bg : 'rgba(255,255,255,0.04)',
                              color:      active ? ch.color : 'var(--text-muted)',
                              border:     `1.5px solid ${active ? ch.border : 'rgba(255,255,255,0.1)'}`,
                            }}>
                            {active && (
                              <span className="inline-flex items-center justify-center w-4 h-4 rounded-full text-[9px] font-bold leading-none shrink-0"
                                style={{ background: ch.color, color: '#fff' }}>
                                {priority}
                              </span>
                            )}
                            {ch.label}
                          </button>
                        )
                      })}
                    </div>
                    {(phase.channels || []).length > 0 && (
                      <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
                        {(phase.channels || []).map((chId, idx) => {
                          const ch = PHASE_CHANNELS.find(c => c.id === chId)
                          if (!ch) return null
                          return (
                            <span key={chId} className="text-[10px] flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
                              <span className="font-bold" style={{ color: ch.color }}>P{idx + 1}</span>
                              {ch.label}
                            </span>
                          )
                        })}
                      </div>
                    )}
                  </div>

                  {/* Notes */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <FieldLabel>Notes <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(Optional)</span></FieldLabel>
                      <AIAssistWidget fieldKey="phaseNotes" currentValue={phase.notes || ''}
                        onAccept={val => updatePhase(phase.id, { notes: val })} />
                    </div>
                    <textarea className="input-base w-full text-xs resize-none" rows={2}
                      placeholder="Describe the purpose, pacing, or tone of this phase..."
                      value={phase.notes || ''} onChange={e => updatePhase(phase.id, { notes: e.target.value })} />
                  </div>
                </div>
              </div>
          ))}

          {/* Add Phase */}
          <button type="button" onClick={addBlankPhase}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-medium transition-all hover:brightness-110"
            style={{ background: 'rgba(124,92,252,0.07)', border: '1px dashed rgba(124,92,252,0.35)', color: '#a78bfa' }}>
            <Plus size={13} /> Add Phase
          </button>
        </div>
      )}

    </div>
  )
}

// ── Step: Trust ───────────────────────────────────────────────────────────────
function TrustStep({ data, onChange }) {
  const set = (key, val) => onChange({ ...data, [key]: val })

  // ── Preset definitions ────────────────────────────────────────────────────
  const TRUST_PRESETS = [
    {
      id: 'tenant-defaults',
      label: 'Tenant Defaults',
      sub: "Uses your organization's default guardrails from tenant settings",
      icon: Globe,
      personalizationLevel: 1,
      traits: [
        { icon: Eye,          text: 'Draft for Review'   },
        { icon: Activity,     text: '75% Confidence'     },
        { icon: Shield,       text: 'All Topics Enabled' },
        { icon: User,         text: 'Personalization L1' },
      ],
      config: { trustMode: 'draft', confidenceThreshold: 75, handoffBehavior: 'Create Task', requireApprovalBelow: true,
                personalizationFields: ['name', 'vehicle_interest', 'assigned_bdc', 'source'] },
    },
    {
      id: 'conservative',
      label: 'Conservative',
      sub: 'Maximum human oversight — all actions require approval',
      icon: Shield,
      personalizationLevel: 1,
      traits: [
        { icon: Lock,         text: 'Approval Required'    },
        { icon: Activity,     text: '85% Confidence'       },
        { icon: AlertTriangle,text: 'Strictest Guardrails' },
        { icon: User,         text: 'Personalization L1'   },
      ],
      config: { trustMode: 'approval', confidenceThreshold: 85, handoffBehavior: 'Escalate', requireApprovalBelow: true,
                personalizationFields: ['name', 'vehicle_interest', 'assigned_bdc', 'source'] },
    },
    {
      id: 'balanced',
      label: 'Balanced',
      sub: 'Good mix of automation and human review',
      icon: BarChart2,
      personalizationLevel: 2,
      traits: [
        { icon: Eye,      text: 'Draft for Review'   },
        { icon: Activity, text: '70% Confidence'     },
        { icon: User,     text: 'Personalization L2' },
      ],
      config: { trustMode: 'draft', confidenceThreshold: 70, handoffBehavior: 'Create Task', requireApprovalBelow: true,
                personalizationFields: ['name', 'vehicle_interest', 'assigned_bdc', 'source', 'hobbies', 'proximity', 'upcoming_service', 'current_vehicle'] },
    },
    {
      id: 'aggressive',
      label: 'Aggressive',
      sub: 'More automation with less manual review',
      icon: Zap,
      personalizationLevel: 2,
      traits: [
        { icon: Zap,      text: 'Auto-Send'          },
        { icon: Activity, text: '60% Confidence'     },
        { icon: User,     text: 'Personalization L2' },
      ],
      config: { trustMode: 'auto-send', confidenceThreshold: 60, handoffBehavior: 'None', requireApprovalBelow: false,
                personalizationFields: ['name', 'vehicle_interest', 'assigned_bdc', 'source', 'hobbies', 'proximity', 'upcoming_service', 'current_vehicle', 'current_products'] },
    },
    {
      id: 'auto-pilot',
      label: 'Auto Pilot',
      sub: 'Maximum automation — minimal human intervention',
      icon: PlayCircle,
      personalizationLevel: 3,
      traits: [
        { icon: Zap,      text: 'Auto-Send'          },
        { icon: Activity, text: '50% Confidence'     },
        { icon: User,     text: 'Personalization L3' },
      ],
      config: { trustMode: 'auto-send', confidenceThreshold: 50, handoffBehavior: 'None', requireApprovalBelow: false,
                personalizationFields: ['name', 'vehicle_interest', 'assigned_bdc', 'source', 'hobbies', 'proximity', 'upcoming_service', 'current_vehicle', 'current_products', 'regional_lang', 'family_info', 'activity_history', 'relationship'] },
    },
  ]

  const TRUST_MODE_LABELS = { draft: 'Draft for Review', 'auto-send': 'Auto-Send', approval: 'Approval Required' }

  const applyPreset = (preset) => onChange({ ...data, trustPreset: preset.id, ...preset.config })

  const threshold = data.confidenceThreshold ?? 75

  const addTopic = () =>
    set('sensitiveTopics', [...(data.sensitiveTopics || []),
      { id: Date.now(), label: 'New topic', action: 'require-approval', enabled: true }])

  const updateTopic = (id, updates) =>
    set('sensitiveTopics', (data.sensitiveTopics || []).map(t => t.id === id ? { ...t, ...updates } : t))

  const removeTopic = (id) =>
    set('sensitiveTopics', (data.sensitiveTopics || []).filter(t => t.id !== id))

  // ── Inline preset card renderer (not a component — avoids remount issues) ─
  const renderPreset = (preset) => {
    const selected = data.trustPreset === preset.id
    const Icon = preset.icon
    return (
      <button key={preset.id} type="button" onClick={() => applyPreset(preset)}
        className="flex flex-col gap-2.5 p-4 rounded-xl text-left transition-all w-full"
        style={{
          background: selected ? 'rgba(37,99,235,0.08)' : 'rgba(255,255,255,0.02)',
          border: `1.5px solid ${selected ? 'rgba(59,130,246,0.5)' : 'rgba(255,255,255,0.07)'}`,
        }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon size={13} style={{ color: selected ? '#60a5fa' : 'var(--text-muted)' }} />
            <span className="text-xs font-bold"
              style={{ color: selected ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
              {preset.label}
            </span>
          </div>
          {selected && <CheckCircle size={12} style={{ color: '#60a5fa' }} />}
        </div>
        <p className="text-[10px] leading-relaxed pb-2.5"
          style={{ color: 'var(--text-muted)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          {preset.sub}
        </p>
        <div className="space-y-1.5">
          {preset.traits.map((t, i) => {
            const TIcon = t.icon
            return (
              <div key={i} className="flex items-center gap-1.5">
                <TIcon size={10} style={{ color: 'var(--text-muted)' }} />
                <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{t.text}</span>
              </div>
            )
          })}
        </div>
      </button>
    )
  }

  return (
    <div className="space-y-6">

      {/* ── Top callout ───────────────────────────────────────────────────────── */}
      <div className="flex gap-3 px-4 py-3.5 rounded-xl"
        style={{ background: 'rgba(20,184,166,0.07)', border: '1px solid rgba(20,184,166,0.25)' }}>
        <Activity size={15} style={{ color: '#2dd4bf', flexShrink: 0, marginTop: 1 }} />
        <div>
          <p className="text-xs font-bold mb-1" style={{ color: '#2dd4bf' }}>NBA Proposes; Orchestration Enforces</p>
          <p className="text-[11px] leading-relaxed" style={{ color: 'rgba(45,212,191,0.72)' }}>
            NBA may propose actions based on context and customer signals. Your trust controls determine whether those proposals execute automatically, require human review, or need explicit approval before sending.
          </p>
        </div>
      </div>

      {/* ── Default Trust Policy ───────────────────────────────────────────────── */}
      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.09)' }}>

        {/* Header */}
        <div className="px-5 pt-4 pb-3" style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-2 mb-3">
            <Shield size={13} style={{ color: 'var(--text-muted)' }} />
            <span className="text-xs font-bold" style={{ color: 'var(--text-secondary)' }}>Default Trust Policy</span>
            <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full"
              style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)' }}>
              Playbook-Level
            </span>
          </div>
          <p className="text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Select Policy Preset</p>
          <p className="text-[10px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            Choose a preset to automatically configure trust mode, confidence thresholds, sensitive topics, and handoff behavior. You can customize these settings after selection.
          </p>
        </div>

        {/* Preset cards: 2 on top, 3 on bottom */}
        <div className="p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            {TRUST_PRESETS.slice(0, 2).map(p => renderPreset(p))}
          </div>
          <div className="grid grid-cols-3 gap-3">
            {TRUST_PRESETS.slice(2).map(p => renderPreset(p))}
          </div>
        </div>

        {/* Policy applied callout + current config (shows after any preset is selected) */}
        {data.trustPreset && (
          <div className="px-4 pb-4 space-y-3">
            {/* Blue info banner */}
            <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl"
              style={{ background: 'rgba(37,99,235,0.08)', border: '1px solid rgba(59,130,246,0.25)' }}>
              <CheckCircle size={13} style={{ color: '#60a5fa', flexShrink: 0 }} />
              <p className="text-[11px]" style={{ color: '#93c5fd' }}>
                <strong>Policy applied!</strong> All settings below have been pre-configured. You can still customize any setting as needed.
              </p>
            </div>

            {/* 4-item current config grid */}
            <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="px-4 py-2.5" style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <p className="text-[10px] font-bold" style={{ color: 'var(--text-secondary)' }}>Current Configuration</p>
              </div>
              {(() => {
                const pFields = data.personalizationFields || []
                const L3_IDS = ['regional_lang','family_info','activity_history','relationship']
                const L2_IDS = ['hobbies','proximity','upcoming_service','current_vehicle','current_products']
                const pLevel = pFields.some(f => L3_IDS.includes(f)) ? 3
                             : pFields.some(f => L2_IDS.includes(f)) ? 2 : 1
                const pLevelColor = pLevel === 3 ? '#f472b6' : pLevel === 2 ? '#60a5fa' : '#4ade80'
                const cfgItems = [
                  { label: 'Trust Mode',            val: TRUST_MODE_LABELS[data.trustMode] || data.trustMode || '—' },
                  { label: 'Confidence Threshold',  val: `${threshold}%` },
                  { label: 'Sensitive Topics',       val: `${(data.sensitiveTopics || []).filter(t => t.enabled).length} of ${(data.sensitiveTopics || []).length} enabled` },
                  { label: 'Handoff Behavior',       val: data.handoffBehavior || '—' },
                  { label: 'Personalization Level',  val: `Level ${pLevel}`, color: pLevelColor },
                  { label: 'Data Fields Enabled',    val: `${pFields.length} field${pFields.length !== 1 ? 's' : ''}` },
                ]
                return (
                  <div className="grid grid-cols-2">
                    {cfgItems.map((item, i) => (
                      <div key={item.label} className="px-4 py-3"
                        style={{
                          borderRight: i % 2 === 0 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                          borderTop:   i >= 2       ? '1px solid rgba(255,255,255,0.05)' : 'none',
                        }}>
                        <p className="text-[10px] mb-1" style={{ color: 'var(--text-muted)' }}>{item.label}</p>
                        <p className="text-xs font-bold" style={{ color: item.color || 'var(--text-secondary)' }}>{item.val}</p>
                      </div>
                    ))}
                  </div>
                )
              })()}
            </div>
          </div>
        )}
      </div>

      {/* ── Confidence & Review Thresholds ────────────────────────────────────── */}
      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.09)' }}>
        <div className="flex items-center gap-2 px-5 py-3.5"
          style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <Activity size={13} style={{ color: '#a78bfa' }} />
          <span className="text-xs font-bold" style={{ color: '#a78bfa' }}>Confidence & Review Thresholds</span>
        </div>

        <div className="px-5 py-5 space-y-5">
          {/* Slider */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>Default Confidence Threshold</p>
              <span className="text-sm font-bold" style={{ color: '#a78bfa' }}>{threshold}%</span>
            </div>
            <input type="range" min="0" max="100" value={threshold}
              onChange={e => set('confidenceThreshold', Number(e.target.value))}
              className="w-full" style={{ accentColor: '#7c5cfc' }} />
            <div className="flex justify-between mt-2">
              <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>0% — Always review</span>
              <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>100% — High confidence</span>
            </div>
            <p className="text-[10px] mt-2.5" style={{ color: 'var(--text-muted)' }}>
              NBA's confidence score must meet or exceed this threshold to use the default routing mode
            </p>
          </div>

          {/* Require approval checkbox */}
          <button type="button" onClick={() => set('requireApprovalBelow', !data.requireApprovalBelow)}
            className="w-full flex items-start gap-3 px-4 py-3.5 rounded-xl text-left transition-all"
            style={{
              background: data.requireApprovalBelow ? 'rgba(124,92,252,0.09)' : 'rgba(255,255,255,0.02)',
              border: `1px solid ${data.requireApprovalBelow ? 'rgba(124,92,252,0.4)' : 'rgba(255,255,255,0.08)'}`,
            }}>
            <div className="w-4 h-4 rounded flex items-center justify-center shrink-0 mt-0.5"
              style={{
                background: data.requireApprovalBelow ? '#7c5cfc' : 'rgba(255,255,255,0.06)',
                border: `1.5px solid ${data.requireApprovalBelow ? '#7c5cfc' : 'rgba(255,255,255,0.18)'}`,
                minWidth: 16, minHeight: 16,
              }}>
              {data.requireApprovalBelow && <CheckCircle size={9} color="#fff" />}
            </div>
            <div>
              <p className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>Require approval below threshold</p>
              <p className="text-[10px] mt-0.5 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                When NBA's confidence is below {threshold}%, automatically route to approval regardless of default mode
              </p>
            </div>
          </button>

          {/* Confidence bands */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Low Confidence',    range: '0–59%',   note: 'Likely approval',  color: '#f87171', bg: 'rgba(248,113,113,0.06)', border: 'rgba(248,113,113,0.2)' },
              { label: 'Medium Confidence', range: '60–84%',  note: 'Review suggested', color: '#fbbf24', bg: 'rgba(251,191,36,0.06)',  border: 'rgba(251,191,36,0.2)'  },
              { label: 'High Confidence',   range: '85–100%', note: 'Trusted auto',     color: '#4ade80', bg: 'rgba(74,222,128,0.06)', border: 'rgba(74,222,128,0.2)'  },
            ].map(band => (
              <div key={band.label} className="rounded-xl px-4 py-3 text-center"
                style={{ background: band.bg, border: `1px solid ${band.border}` }}>
                <p className="text-[10px] mb-1.5" style={{ color: 'var(--text-muted)' }}>{band.label}</p>
                <p className="text-sm font-bold" style={{ color: band.color }}>{band.range}</p>
                <p className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>{band.note}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Sensitive Topics & Guardrails ─────────────────────────────────────── */}
      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.09)' }}>
        <div className="flex items-center justify-between px-5 py-3.5"
          style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-2">
            <Flag size={13} style={{ color: '#f87171' }} />
            <span className="text-xs font-bold" style={{ color: '#f87171' }}>Sensitive Topics & Guardrails</span>
          </div>
          <button type="button" onClick={addTopic}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all hover:brightness-110"
            style={{ background: 'rgba(124,92,252,0.15)', color: '#a78bfa', border: '1px solid rgba(124,92,252,0.3)' }}>
            <Plus size={11} /> Add Topic
          </button>
        </div>

        <div className="px-5 pt-3 pb-4 space-y-2.5">
          <p className="text-[10px] pb-1" style={{ color: 'var(--text-muted)' }}>
            Define sensitive content patterns that trigger special handling or blocking
          </p>

          {(data.sensitiveTopics || []).map(topic => {
            const actionBadge = topic.action === 'block'
              ? { label: 'Blocked',  color: '#f87171', bg: 'rgba(239,68,68,0.15)',  border: 'rgba(239,68,68,0.3)'  }
              : topic.action === 'flag'
              ? { label: 'Flagged',  color: '#60a5fa', bg: 'rgba(59,130,246,0.15)', border: 'rgba(59,130,246,0.3)' }
              : { label: 'Approval', color: '#fbbf24', bg: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.3)' }

            return (
              <div key={topic.id} className="flex items-center gap-2.5 px-4 py-3 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}>

                {/* Enable toggle */}
                <button type="button" onClick={() => updateTopic(topic.id, { enabled: !topic.enabled })}
                  className="rounded flex items-center justify-center shrink-0 transition-all"
                  style={{
                    width: 16, height: 16, minWidth: 16,
                    background: topic.enabled ? '#7c5cfc' : 'rgba(255,255,255,0.06)',
                    border: `1.5px solid ${topic.enabled ? '#7c5cfc' : 'rgba(255,255,255,0.18)'}`,
                  }}>
                  {topic.enabled && <CheckCircle size={9} color="#fff" />}
                </button>

                {/* Editable label */}
                <input
                  className="flex-1 bg-transparent text-xs font-medium outline-none min-w-0"
                  style={{ color: 'var(--text-secondary)' }}
                  value={topic.label}
                  onChange={e => updateTopic(topic.id, { label: e.target.value })}
                />

                {/* When detected + dropdown + badge */}
                <span className="text-[10px] shrink-0" style={{ color: 'var(--text-muted)' }}>When detected:</span>
                <select
                  value={topic.action}
                  onChange={e => updateTopic(topic.id, { action: e.target.value })}
                  className="text-[10px] font-medium rounded-lg px-2 py-1.5 outline-none shrink-0"
                  style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--text-secondary)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <option value="require-approval">Require Approval</option>
                  <option value="block">Block Action</option>
                  <option value="flag">Flag for Review</option>
                </select>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0"
                  style={{ background: actionBadge.bg, color: actionBadge.color, border: `1px solid ${actionBadge.border}` }}>
                  {actionBadge.label}
                </span>

                {/* Remove */}
                <button type="button" onClick={() => removeTopic(topic.id)}
                  className="p-1 rounded-lg hover:bg-white/5 shrink-0 transition-all"
                  style={{ color: 'var(--text-muted)' }}>
                  <XCircle size={13} />
                </button>
              </div>
            )
          })}

          {(data.sensitiveTopics || []).length === 0 && (
            <div className="py-4 text-center">
              <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>No sensitive topics defined. Click <strong>+ Add Topic</strong> to add one.</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Human Intervention Settings ───────────────────────────────────────── */}
      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.09)' }}>

        {/* Section header */}
        <div className="flex items-center gap-3 px-5 py-3.5"
          style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: 'linear-gradient(135deg,#a78bfa,#60a5fa)', boxShadow: '0 2px 8px rgba(124,92,252,0.35)' }}>
            <Users size={13} color="#fff" />
          </div>
          <div>
            <p className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>Human Intervention Settings</p>
            <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>Define when NBA should transfer control to a human representative</p>
          </div>
        </div>

        <div className="p-4">
          <div className="grid grid-cols-2 gap-3">

            {/* ── Left panel: AI Handoff Triggers + Post-Handoff ── */}
            <div className="rounded-xl flex flex-col overflow-hidden"
              style={{ border: '1px solid rgba(255,255,255,0.08)' }}>

              {/* Sub-header */}
              <div className="flex items-center gap-2 px-4 py-2.5"
                style={{ background: 'rgba(255,255,255,0.025)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="w-5 h-5 rounded-md flex items-center justify-center"
                  style={{ background: 'rgba(251,146,60,0.15)' }}>
                  <UserCheck size={11} style={{ color: '#fb923c' }} />
                </div>
                <span className="text-[11px] font-semibold" style={{ color: '#fb923c' }}>AI Handoff to Human</span>
              </div>

              {/* Trigger list */}
              <div className="p-3 flex flex-col gap-1.5">
                {/* Sub-label */}
                <div className="flex items-center justify-between mb-1">
                  <p className="text-[11px] font-semibold" style={{ color: 'var(--text-secondary)' }}>
                    Automatic Handoff Triggers
                  </p>
                </div>
                <p className="text-[10px] -mt-1 mb-1" style={{ color: 'var(--text-muted)' }}>
                  When AI should stop and transfer control to a human
                </p>

                {(data.humanHandoffTriggers || []).map(trigger => (
                  <div key={trigger.id} className="flex items-start gap-2.5 px-3 py-2.5 rounded-lg"
                    style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}>
                    <button type="button"
                      onClick={() => set('humanHandoffTriggers', (data.humanHandoffTriggers || []).map(t =>
                        t.id === trigger.id ? { ...t, enabled: !t.enabled } : t))}
                      className="rounded flex items-center justify-center shrink-0 transition-all mt-0.5"
                      style={{
                        width: 14, height: 14, minWidth: 14,
                        background: trigger.enabled ? '#7c5cfc' : 'rgba(255,255,255,0.06)',
                        border: `1.5px solid ${trigger.enabled ? '#7c5cfc' : 'rgba(255,255,255,0.2)'}`,
                      }}>
                      {trigger.enabled && <Check size={8} color="#fff" />}
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-medium leading-snug" style={{ color: 'var(--text-secondary)' }}>
                        {trigger.label}
                      </p>
                      {trigger.desc && (
                        <p className="text-[10px] mt-0.5 leading-snug" style={{ color: 'var(--text-muted)' }}>
                          {trigger.desc}
                        </p>
                      )}
                    </div>
                    <button type="button"
                      onClick={() => set('humanHandoffTriggers', (data.humanHandoffTriggers || []).filter(t => t.id !== trigger.id))}
                      className="p-0.5 rounded hover:bg-white/5 shrink-0 transition-all mt-0.5"
                      style={{ color: 'var(--text-muted)' }}>
                      <X size={11} />
                    </button>
                  </div>
                ))}

                {/* Custom trigger input */}
                <div className="flex gap-2 pt-1">
                  <input
                    value={data.humanHandoffCustom || ''}
                    onChange={e => set('humanHandoffCustom', e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        const val = (data.humanHandoffCustom || '').trim()
                        if (val) onChange({ ...data,
                          humanHandoffTriggers: [...(data.humanHandoffTriggers || []),
                            { id: Date.now(), label: val, desc: '', enabled: true }],
                          humanHandoffCustom: '',
                        })
                      }
                    }}
                    placeholder="e.g., Customer asks about competitor pricing"
                    className="flex-1 text-[11px] rounded-lg px-3 py-2 outline-none"
                    style={{ background: 'rgba(255,255,255,0.04)', color: 'var(--text-secondary)', border: '1px solid rgba(255,255,255,0.09)' }}
                  />
                  <button type="button"
                    onClick={() => {
                      const val = (data.humanHandoffCustom || '').trim()
                      if (val) onChange({ ...data,
                        humanHandoffTriggers: [...(data.humanHandoffTriggers || []),
                          { id: Date.now(), label: val, desc: '', enabled: true }],
                        humanHandoffCustom: '',
                      })
                    }}
                    className="px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all hover:brightness-110"
                    style={{ background: 'rgba(124,92,252,0.14)', color: '#a78bfa', border: '1px solid rgba(124,92,252,0.28)' }}>
                    + Add
                  </button>
                </div>
              </div>

              {/* Post-Handoff Behavior */}
              <div className="px-3 pb-3 pt-0">
                <div className="pt-3 px-1" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-5 h-5 rounded-md flex items-center justify-center shrink-0"
                      style={{ background: 'rgba(124,92,252,0.15)' }}>
                      <User size={11} style={{ color: '#a78bfa' }} />
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold" style={{ color: 'var(--text-secondary)' }}>Post-Handoff Behavior</p>
                      <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Where to route the conversation after handoff</p>
                    </div>
                  </div>
                  {[
                    { val: 'original-rep',  label: 'Assign to original rep',    desc: 'Lead returns to the rep who originally owned it.'                              },
                    { val: 'sales-manager', label: 'Assign to Sales Manager',   desc: 'Escalate complex situations to management.'                                    },
                    { val: 'round-robin',   label: 'Round Robin',               desc: 'Automatically distribute to the next available agent — no orphaned leads.'    },
                  ].map(opt => {
                    const active = (data.humanPostHandoff || 'original-rep') === opt.val
                    return (
                      <div key={opt.val}
                        onClick={() => set('humanPostHandoff', opt.val)}
                        className="flex items-start gap-2.5 px-3 py-2.5 rounded-lg cursor-pointer mb-1.5 transition-all"
                        style={{
                          background: active ? 'rgba(124,92,252,0.08)' : 'rgba(255,255,255,0.02)',
                          border: `1px solid ${active ? 'rgba(124,92,252,0.25)' : 'rgba(255,255,255,0.07)'}`,
                        }}>
                        <div className="mt-0.5 w-3 h-3 rounded-full shrink-0 flex items-center justify-center"
                          style={{
                            border: `1.5px solid ${active ? '#7c5cfc' : 'rgba(255,255,255,0.25)'}`,
                          }}>
                          {active && <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#7c5cfc' }} />}
                        </div>
                        <div>
                          <p className="text-[11px] font-medium" style={{ color: active ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                            {opt.label}
                          </p>
                          <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{opt.desc}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* ── Right panel: Human-in-the-Loop Review ── */}
            <div className="rounded-xl flex flex-col overflow-hidden"
              style={{ border: '1px solid rgba(255,255,255,0.08)' }}>

              {/* Sub-header */}
              <div className="flex items-center gap-2 px-4 py-2.5"
                style={{ background: 'rgba(255,255,255,0.025)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="w-5 h-5 rounded-md flex items-center justify-center"
                  style={{ background: 'rgba(245,158,11,0.15)' }}>
                  <CheckCircle size={11} style={{ color: '#fbbf24' }} />
                </div>
                <span className="text-[11px] font-semibold" style={{ color: '#fbbf24' }}>Human-in-the-Loop Review</span>
              </div>

              {/* Review requirements */}
              <div className="p-3 flex flex-col gap-1.5">
                {/* Sub-label */}
                <p className="text-[11px] font-semibold mb-0" style={{ color: 'var(--text-secondary)' }}>
                  Review Requirements
                </p>
                <p className="text-[10px] -mt-1 mb-1" style={{ color: 'var(--text-muted)' }}>
                  Require approval before sending
                </p>

                {(data.humanReviewRequirements || []).map(req => {
                  const on = req.enabled
                  return (
                    <div key={req.id}
                      className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-all"
                      style={{
                        background: on ? 'rgba(245,158,11,0.06)' : 'rgba(255,255,255,0.025)',
                        border: `1px solid ${on ? 'rgba(245,158,11,0.22)' : 'rgba(255,255,255,0.07)'}`,
                      }}>
                      <div
                        className="rounded flex items-center justify-center shrink-0 cursor-pointer"
                        onClick={() => set('humanReviewRequirements', (data.humanReviewRequirements || []).map(r =>
                          r.id === req.id ? { ...r, enabled: !r.enabled } : r))}
                        style={{
                          width: 14, height: 14, minWidth: 14,
                          background: on ? '#7c5cfc' : 'rgba(255,255,255,0.06)',
                          border: `1.5px solid ${on ? '#7c5cfc' : 'rgba(255,255,255,0.2)'}`,
                        }}>
                        {on && <Check size={8} color="#fff" />}
                      </div>
                      <span
                        className="text-[11px] flex-1 cursor-pointer"
                        style={{ color: 'var(--text-secondary)' }}
                        onClick={() => set('humanReviewRequirements', (data.humanReviewRequirements || []).map(r =>
                          r.id === req.id ? { ...r, enabled: !r.enabled } : r))}>
                        {req.label}
                      </span>
                      <button
                        type="button"
                        onClick={() => set('humanReviewRequirements', (data.humanReviewRequirements || []).filter(r => r.id !== req.id))}
                        className="ml-auto shrink-0 flex items-center justify-center rounded transition-all hover:bg-white/10"
                        style={{ width: 18, height: 18, color: 'rgba(255,255,255,0.3)' }}>
                        <X size={10} />
                      </button>
                    </div>
                  )
                })}

                {/* Custom review requirement input */}
                <div className="flex gap-2 pt-1">
                  <input
                    value={data.humanReviewCustom || ''}
                    onChange={e => set('humanReviewCustom', e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        const val = (data.humanReviewCustom || '').trim()
                        if (val) onChange({ ...data,
                          humanReviewRequirements: [...(data.humanReviewRequirements || []),
                            { id: Date.now(), label: val, enabled: true }],
                          humanReviewCustom: '',
                        })
                      }
                    }}
                    placeholder="e.g., Review messages mentioning financing"
                    className="flex-1 text-[11px] rounded-lg px-3 py-2 outline-none"
                    style={{ background: 'rgba(255,255,255,0.04)', color: 'var(--text-secondary)', border: '1px solid rgba(255,255,255,0.09)' }}
                  />
                  <button type="button"
                    onClick={() => {
                      const val = (data.humanReviewCustom || '').trim()
                      if (val) onChange({ ...data,
                        humanReviewRequirements: [...(data.humanReviewRequirements || []),
                          { id: Date.now(), label: val, enabled: true }],
                        humanReviewCustom: '',
                      })
                    }}
                    className="px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all hover:brightness-110"
                    style={{ background: 'rgba(124,92,252,0.14)', color: '#a78bfa', border: '1px solid rgba(124,92,252,0.28)' }}>
                    + Add
                  </button>
                </div>
                <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                  Define scenarios that require human review before sending.
                </p>
              </div>

              {/* Round Robin Escalation Timeout */}
              <div className="px-3 pb-3 pt-0">
                <div className="pt-3 px-1" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-5 h-5 rounded-md flex items-center justify-center shrink-0"
                      style={{ background: 'rgba(245,158,11,0.12)' }}>
                      <Clock size={11} style={{ color: '#fbbf24' }} />
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold" style={{ color: 'var(--text-secondary)' }}>Round Robin Escalation Timeout</p>
                      <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Reassign to next available agent if not reviewed within</p>
                    </div>
                  </div>
                  <select
                    value={data.humanApprovalTimeout || '30 minutes'}
                    onChange={e => set('humanApprovalTimeout', e.target.value)}
                    className="w-full text-xs rounded-lg px-3 py-2.5 outline-none"
                    style={{ background: 'rgba(255,255,255,0.04)', color: 'var(--text-secondary)', border: '1px solid rgba(255,255,255,0.09)' }}>
                    <option>10 minutes</option>
                    <option>15 minutes</option>
                    <option>20 minutes</option>
                    <option>30 minutes</option>
                    <option>45 minutes</option>
                    <option>1 hour</option>
                    <option>1.5 hours</option>
                    <option>2 hours</option>
                    <option>3 hours</option>
                  </select>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── Messaging Personalization Level ────────────────────────────────────── */}
      {(() => {
        const PERSONALIZATION_GROUPS = [
          {
            id: 'basic', level: 1, color: '#4ade80', label: 'Basic Lead Data',
            desc: 'Core intake fields — always available at first contact',
            fields: [
              { id: 'name',             label: 'Customer Name',       example: 'e.g. "Maria Gomez"'             },
              { id: 'vehicle_interest', label: 'Vehicle Interest',    example: 'e.g. "2023 Ford Explorer XLT"'  },
              { id: 'assigned_bdc',     label: 'Assigned BDC Agent',  example: 'e.g. "alex.bdc"'                },
              { id: 'source',           label: 'Lead Source',         example: 'e.g. "OEM Website"'             },
            ],
          },
          {
            id: 'enhanced', level: 2, color: '#60a5fa', label: 'Enhanced Profile',
            desc: 'Enriched CRM data — available after initial engagement',
            fields: [
              { id: 'hobbies',          label: 'Hobbies & Interests',  example: 'From CRM enrichment'            },
              { id: 'proximity',        label: 'Proximity & Location', example: 'Distance & local context'       },
              { id: 'upcoming_service', label: 'Upcoming Services',    example: 'Scheduled maintenance alerts'   },
              { id: 'current_vehicle',  label: 'Current Vehicle',      example: 'Trade-in / owned vehicle info'  },
              { id: 'current_products', label: 'Current Products',     example: 'Active deals or subscriptions'  },
            ],
          },
          {
            id: 'deep', level: 3, color: '#f472b6', label: 'Deep Relationship',
            desc: 'High-touch data — use carefully, requires explicit consent',
            fields: [
              { id: 'regional_lang',    label: 'Regional Language',   example: 'Local tone & expressions'        },
              { id: 'family_info',      label: 'Family & Household',  example: 'Spouse, kids, lifestyle notes'   },
              { id: 'activity_history', label: 'Dealership Activity', example: 'Past visits, purchases, behavior'},
              { id: 'relationship',     label: 'Relationship Notes',  example: 'Rep–customer history & context'  },
            ],
          },
        ]

        const pFields = data.personalizationFields || []
        const L3_IDS  = PERSONALIZATION_GROUPS[2].fields.map(f => f.id)
        const L2_IDS  = PERSONALIZATION_GROUPS[1].fields.map(f => f.id)
        const pLevel  = pFields.some(f => L3_IDS.includes(f)) ? 3
                      : pFields.some(f => L2_IDS.includes(f)) ? 2 : 1

        const toggleField = (id) => {
          const next = pFields.includes(id) ? pFields.filter(f => f !== id) : [...pFields, id]
          set('personalizationFields', next)
        }

        const LEVEL_META = [
          { n: 1, color: '#4ade80', bg: 'rgba(74,222,128,0.12)', label: 'Basic',    desc: 'Name, vehicle interest & assigned rep'                  },
          { n: 2, color: '#60a5fa', bg: 'rgba(96,165,250,0.12)', label: 'Enhanced', desc: '+ Hobbies, services, current vehicle & product history' },
          { n: 3, color: '#f472b6', bg: 'rgba(244,114,182,0.12)',label: 'Full',      desc: '+ Regional tone, family, dealership activity & notes'   },
        ]

        return (
          <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.09)' }}>

            {/* Header */}
            <div className="flex items-center gap-2 px-5 py-3.5"
              style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <User size={13} style={{ color: '#a78bfa' }} />
              <span className="text-xs font-bold" style={{ color: '#a78bfa' }}>Messaging Personalization Level</span>
              <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full ml-1"
                style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)' }}>
                NBA Guardrail
              </span>
            </div>

            <div className="px-5 py-4 space-y-5">

              {/* Callout */}
              <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                Select which lead data fields the NBA AI network is allowed to use when composing personalized messages. The active level is automatically derived from your selection and acts as a trust guardrail.
              </p>

              {/* Level bar */}
              <div>
                <p className="text-[11px] font-semibold mb-3" style={{ color: 'var(--text-secondary)' }}>
                  Active Level
                </p>
                <div className="flex gap-2">
                  {LEVEL_META.map(lm => {
                    const active = pLevel >= lm.n
                    const current = pLevel === lm.n
                    return (
                      <div key={lm.n} className="flex-1 rounded-xl px-3 py-3 transition-all"
                        style={{
                          background: active ? lm.bg : 'rgba(255,255,255,0.02)',
                          border: `1.5px solid ${active ? lm.color + '55' : 'rgba(255,255,255,0.07)'}`,
                        }}>
                        <div className="flex items-center gap-2 mb-1.5">
                          <div className="w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold shrink-0"
                            style={{ background: active ? lm.color + '25' : 'rgba(255,255,255,0.04)', color: active ? lm.color : 'var(--text-muted)', border: `1px solid ${active ? lm.color + '40' : 'rgba(255,255,255,0.08)'}` }}>
                            {lm.n}
                          </div>
                          <span className="text-[11px] font-bold" style={{ color: active ? lm.color : 'var(--text-muted)' }}>
                            {lm.label}
                          </span>
                          {current && (
                            <span className="ml-auto text-[9px] font-semibold px-1.5 py-0.5 rounded-full"
                              style={{ background: lm.color + '20', color: lm.color }}>
                              Active
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] leading-snug" style={{ color: active ? lm.color + 'bb' : 'var(--text-muted)' }}>
                          {lm.desc}
                        </p>
                      </div>
                    )
                  })}
                </div>
                {/* Progress fill bar — width = % of fields selected, color = level reached */}
                {(() => {
                  const totalFields = PERSONALIZATION_GROUPS.reduce((s, g) => s + g.fields.length, 0)
                  const fillPct = totalFields > 0 ? Math.round((pFields.length / totalFields) * 100) : 0
                  return (
                    <div className="mt-3">
                      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                        <div className="h-full rounded-full transition-all duration-300"
                          style={{
                            width: `${fillPct}%`,
                            background: pLevel === 3 ? 'linear-gradient(90deg,#4ade80,#60a5fa,#f472b6)'
                                      : pLevel === 2 ? 'linear-gradient(90deg,#4ade80,#60a5fa)'
                                      : '#4ade80',
                          }} />
                      </div>
                      <div className="flex justify-between mt-1.5">
                        <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{pFields.length} of {totalFields} fields selected</span>
                        <span className="text-[10px] font-semibold" style={{ color: pLevel === 3 ? '#f472b6' : pLevel === 2 ? '#60a5fa' : '#4ade80' }}>{fillPct}%</span>
                      </div>
                    </div>
                  )
                })()}
              </div>

              {/* Field groups */}
              <div className="space-y-4">
                {PERSONALIZATION_GROUPS.map(group => (
                  <div key={group.id}>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: group.color }} />
                      <p className="text-[11px] font-semibold" style={{ color: 'var(--text-secondary)' }}>
                        Level {group.level} — {group.label}
                      </p>
                      <span className="text-[10px] ml-1" style={{ color: 'var(--text-muted)' }}>{group.desc}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {group.fields.map(field => {
                        const on = pFields.includes(field.id)
                        return (
                          <button key={field.id} type="button"
                            onClick={() => toggleField(field.id)}
                            className="flex flex-col gap-0.5 px-3 py-2 rounded-lg text-left transition-all"
                            style={{
                              background: on ? group.color + '12' : 'rgba(255,255,255,0.03)',
                              border: `1px solid ${on ? group.color + '45' : 'rgba(255,255,255,0.08)'}`,
                            }}>
                            <div className="flex items-center gap-1.5">
                              <div className="w-3 h-3 rounded flex items-center justify-center shrink-0"
                                style={{
                                  background: on ? group.color : 'rgba(255,255,255,0.07)',
                                  border: `1.5px solid ${on ? group.color : 'rgba(255,255,255,0.2)'}`,
                                }}>
                                {on && <Check size={7} color="#000" />}
                              </div>
                              <span className="text-[11px] font-medium whitespace-nowrap"
                                style={{ color: on ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                                {field.label}
                              </span>
                            </div>
                            <p className="text-[10px] pl-[18px] whitespace-nowrap" style={{ color: 'var(--text-muted)' }}>
                              {field.example}
                            </p>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        )
      })()}

    </div>
  )
}

// ── Step: Review ──────────────────────────────────────────────────────────────
function ReviewStep({ data, onChange, onJump }) {
  const [openSections, setOpenSections] = useState(
    { basics: true, knowledge: true, moment: true, gates: true, objective: false, phases: false, trust: false }
  )
  const toggle = (id) => setOpenSections(s => ({ ...s, [id]: !s[id] }))

  const PRIORITY_LABELS     = { critical: 'Critical – P1', high: 'High – P2', standard: 'Standard – P3', low: 'Low – P4' }
  const TRUST_MODE_LABELS   = { draft: 'Draft for Review', 'auto-send': 'Auto-Send', approval: 'Approval Required' }
  const TRUST_PRESET_LABELS = { 'tenant-defaults': 'Tenant Defaults', conservative: 'Conservative', balanced: 'Balanced', aggressive: 'Aggressive', 'auto-pilot': 'Auto Pilot' }

  // ── Validation status per section ─────────────────────────────────────────
  const getSectionStatus = (stepId) => {
    const fields   = SIDEBAR_FIELDS[stepId] || []
    const required = fields.filter(f => f.required)
    if (required.length === 0) return 'complete'
    const done = required.filter(f => hasValue(data[f.key]))
    if (done.length === required.length) return 'complete'
    return 'incomplete'
  }

  const STEP_IDS     = ['basics', 'knowledge', 'moment', 'gates', 'objective', 'phases', 'trust']
  const passedCount  = STEP_IDS.filter(id => getSectionStatus(id) === 'complete').length
  const incompleteCount = STEP_IDS.filter(id => getSectionStatus(id) === 'incomplete').length

  // ── Gate count ─────────────────────────────────────────────────────────────
  const gatesConfigured = [
    data.gate_consent_channels.length > 0,
    data.gate_channel_channels.length > 0,
    data.gate_status_statuses.length > 0,
    data.gate_compliance_checks.length > 0,
    data.gate_custom.length > 0,
  ].filter(Boolean).length

  // ── Section data rows (2-col pairs) ───────────────────────────────────────
  const SECTIONS = [
    {
      id: 'basics', stepIdx: 0,
      icon: FileText, iconBg: 'linear-gradient(135deg,#3b82f6,#7c5cfc)',
      label: 'Basics',
      pairs: [
        { label: 'Playbook Name', val: data.name },
        { label: 'Department',    val: data.department },
        { label: 'Priority',      val: PRIORITY_LABELS[data.priority] || data.priority },
        { label: 'Owner',         val: data.owner },
        { label: 'Tenant Scope',
          val: data.tenantScope === 'global'
            ? 'Global — All Tenants'
            : data.tenantScope === 'specific'
              ? (() => {
                  const st = data.selectedTenants || []
                  const sr = data.selectedRooftops || {}
                  const totalRt = Object.values(sr).reduce((s, a) => s + a.length, 0)
                  return st.length > 0
                    ? `${st.length} tenant${st.length > 1 ? 's' : ''}, ${totalRt} rooftop${totalRt !== 1 ? 's' : ''}`
                    : 'Specific Tenants & Rooftops (none selected)'
                })()
              : data.tenantScope || '' },
        { label: 'Tags',          val: data.tags.length > 0 ? data.tags.join(', ') : '' },
      ],
    },
    {
      id: 'knowledge', stepIdx: 1,
      icon: BookOpen, iconBg: 'linear-gradient(135deg,#7c5cfc,#a78bfa)',
      label: 'Knowledge',
      pairs: (data.knowledgePackages || []).length > 0
        ? (data.knowledgePackages || []).map((id, i) => {
            const pack = KNOWLEDGE_PACKS.find(p => p.id === id)
            return { label: `Pack ${i + 1}`, val: pack ? `${pack.name} · ${pack.department}` : id }
          })
        : [{ label: 'Knowledge Packs', val: 'None selected' }],
    },
    {
      id: 'moment', stepIdx: 2,
      icon: Sparkles, iconBg: 'linear-gradient(135deg,#7c5cfc,#a78bfa)',
      label: 'Moment Definition',
      pairs: [
        { label: 'Primary Moment',        val: data.primaryMoment },
        { label: 'Event Source',          val: Array.isArray(data.eventSource) ? data.eventSource.join(', ') : data.eventSource },
        { label: 'Qualifying Conditions', val: data.qualifyingConditions.length > 0 ? `${data.qualifyingConditions.length} condition${data.qualifyingConditions.length > 1 ? 's' : ''} defined` : '' },
        { label: 'Business Meaning',      val: data.businessMeaning ? (data.businessMeaning.length > 38 ? data.businessMeaning.slice(0,38)+'…' : data.businessMeaning) : '' },
      ],
    },
    {
      id: 'gates', stepIdx: 3,
      icon: Shield, iconBg: 'linear-gradient(135deg,#16a34a,#2dd4bf)',
      label: 'Hard Gates',
      pairs: [
        { label: 'Gates Active',   val: gatesConfigured > 0 ? `${gatesConfigured} gate${gatesConfigured > 1 ? 's' : ''} configured` : 'None configured' },
        { label: 'Custom Gates',   val: data.gate_custom.length > 0 ? `${data.gate_custom.length} custom gate${data.gate_custom.length > 1 ? 's' : ''}` : '' },
        { label: 'Consent Gate',   val: data.gate_consent_channels.length > 0 ? data.gate_consent_channels.join(', ') : '' },
        { label: 'If Not Met',     val: data.gate_consent_channels.length > 0 ? data.gate_consent_ifNotMet : '' },
        { label: 'Status Restrict.',val: data.gate_status_statuses.length > 0 ? data.gate_status_statuses.join(', ') : '' },
        { label: 'Compliance',     val: data.gate_compliance_checks.length > 0 ? `${data.gate_compliance_checks.length} check${data.gate_compliance_checks.length > 1 ? 's' : ''}` : '' },
      ],
    },
    {
      id: 'objective', stepIdx: 4,
      icon: Target, iconBg: 'linear-gradient(135deg,#f59e0b,#ef4444)',
      label: 'Objective & Success',
      pairs: [
        { label: 'Goal Type',       val: data.goalType },
        { label: 'Success Event',   val: data.primarySuccessEvent },
        { label: 'Exit Conditions', val: (data.exitConditions || []).length > 0
            ? (data.exitConditions || []).map(e => {
                const fo = FAILURE_OUTCOMES.find(f => f.id === e.outcome)
                const ec = EXIT_CONDITIONS.find(c => c.id === e.id)
                return fo ? `${ec?.label} → ${fo.label}` : ec?.label
              }).join(' · ')
            : '' },
        { label: 'KPI Association', val: data.kpiAssociation },
        { label: 'Strategy Notes',  val: data.strategyNotes ? (data.strategyNotes.length > 38 ? data.strategyNotes.slice(0,38)+'…' : data.strategyNotes) : '' },
      ],
    },
    {
      id: 'phases', stepIdx: 5,
      icon: Layers, iconBg: 'linear-gradient(135deg,#2563eb,#0891b2)',
      label: 'Phases',
      pairs: data.phases.length > 0
        ? data.phases.map((p, i) => [
            { label: `Phase ${i + 1}`, val: p.name },
            { label: 'Duration',       val: p.duration ? `${p.duration} ${p.durationUnit || 'Days'}` : '' },
          ]).flat()
        : [{ label: 'Phases', val: 'No phases defined' }],
    },
    {
      id: 'trust', stepIdx: 6,
      icon: Zap, iconBg: 'linear-gradient(135deg,#7c5cfc,#2563eb)',
      label: 'Trust Controls',
      pairs: [
        { label: 'Trust Policy',    val: TRUST_PRESET_LABELS[data.trustPreset] || data.trustPreset },
        { label: 'Trust Mode',      val: TRUST_MODE_LABELS[data.trustMode] || data.trustMode },
        { label: 'Confidence',      val: data.confidenceThreshold != null ? `${data.confidenceThreshold}%` : '' },
        { label: 'Sensitive Topics',val: (data.sensitiveTopics || []).filter(t => t.enabled).length > 0 ? `${(data.sensitiveTopics || []).filter(t => t.enabled).length} active` : '' },
      ],
    },
  ]

  // ── NBA Intelligence bullets (generated from data) ─────────────────────────
  const whySelected = [
    data.primaryMoment                   && `${data.primaryMoment} (moment trigger)`,
    gatesConfigured > 0                  && `Passes all ${gatesConfigured} configured gate${gatesConfigured > 1 ? 's' : ''}`,
    data.priority                        && `${PRIORITY_LABELS[data.priority] || data.priority} priority`,
    data.goalType                        && `Goal: ${data.goalType}`,
  ].filter(Boolean)

  const whatBlocks = [
    data.gate_consent_channels.length > 0  && 'Consent not met for required channels',
    data.gate_status_statuses.length > 0   && 'Customer status restriction active',
    (data.exitConditions || []).length > 0  && `Exit: ${(data.exitConditions || []).slice(0,2).map(e => EXIT_CONDITIONS.find(c=>c.id===e.id)?.label || e.id).join(', ')}${(data.exitConditions||[]).length > 2 ? '…' : ''}`,
    data.gate_compliance_checks.length > 0 && `${data.gate_compliance_checks.length} compliance check${data.gate_compliance_checks.length > 1 ? 's' : ''} active`,
    data.gate_custom.length > 0            && `${data.gate_custom.length} custom gate${data.gate_custom.length > 1 ? 's' : ''} enforced`,
  ].filter(Boolean)

  const whatAdapts = [
    { label: 'Timing',   detail: 'When to send actions within eligibility windows' },
    { label: 'Channel',  detail: 'Best channel from allowed set based on preference' },
    { label: 'Content',  detail: 'Personalization within content mode constraints' },
    { label: 'Skipping', detail: 'May skip optional actions if unneeded' },
  ]

  const enabledSensitive = (data.sensitiveTopics || []).filter(t => t.enabled && t.action !== 'flag')
  const whatApproval = [
    data.trustMode                                               && `Default mode: ${TRUST_MODE_LABELS[data.trustMode] || data.trustMode} on all actions`,
    data.requireApprovalBelow && data.confidenceThreshold != null && `Confidence below ${data.confidenceThreshold}% → automatic approval routing`,
    enabledSensitive.length > 0                                  && `${enabledSensitive.length} sensitive topic${enabledSensitive.length > 1 ? 's' : ''} → blocked or requires approval`,
  ].filter(Boolean)

  return (
    <div className="space-y-5">

      {/* ── Ready to Publish banner ───────────────────────────────────────────── */}
      <div className="flex items-center gap-4 px-5 py-4 rounded-xl"
        style={{ background: 'rgba(20,184,166,0.07)', border: '1px solid rgba(20,184,166,0.22)' }}>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: 'rgba(20,184,166,0.15)' }}>
          <CheckCircle size={18} style={{ color: '#2dd4bf' }} />
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold" style={{ color: '#2dd4bf' }}>Ready to Publish</p>
          <div className="flex items-center gap-4 mt-1">
            <div className="flex items-center gap-1.5">
              <CheckCircle size={11} style={{ color: '#4ade80' }} />
              <span className="text-[11px] font-medium" style={{ color: '#4ade80' }}>{passedCount} passed</span>
            </div>
            {incompleteCount > 0 && (
              <div className="flex items-center gap-1.5">
                <AlertTriangle size={11} style={{ color: '#f87171' }} />
                <span className="text-[11px] font-medium" style={{ color: '#f87171' }}>{incompleteCount} incomplete</span>
              </div>
            )}
          </div>
        </div>
        <p className="text-[10px] leading-relaxed text-right" style={{ color: 'rgba(45,212,191,0.6)', maxWidth: 200 }}>
          Review your strategy, resolve validation issues, and confirm how this playbook can be applied
        </p>
      </div>

      {/* ── Collapsible section cards ─────────────────────────────────────────── */}
      {SECTIONS.map(section => {
        const status = getSectionStatus(section.id)
        const open   = !!openSections[section.id]
        const Icon   = section.icon

        // Pair rows into 2-col grid: [[pair1, pair2], [pair3, pair4], …]
        const filteredPairs = section.pairs.filter(p => p.val)
        const gridRows = []
        for (let i = 0; i < filteredPairs.length; i += 2) {
          gridRows.push([filteredPairs[i], filteredPairs[i + 1] || null])
        }

        return (
          <div key={section.id} className="rounded-xl overflow-hidden transition-all"
            style={{ border: `1px solid ${status === 'incomplete' ? 'rgba(248,113,113,0.3)' : 'rgba(255,255,255,0.09)'}` }}>

            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3"
              style={{ background: 'rgba(255,255,255,0.02)', borderBottom: open ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: section.iconBg }}>
                <Icon size={15} color="#fff" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold leading-tight" style={{ color: 'var(--text-primary)' }}>{section.label}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  {status === 'complete'   && <><CheckCircle size={10} style={{ color: '#4ade80' }} /><span className="text-[10px] font-semibold" style={{ color: '#4ade80' }}>Complete</span></>}
                  {status === 'incomplete' && <><XCircle     size={10} style={{ color: '#f87171' }} /><span className="text-[10px] font-semibold" style={{ color: '#f87171' }}>Incomplete</span></>}
                </div>
              </div>
              <button type="button" onClick={() => onJump(section.stepIdx)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-semibold shrink-0 transition-all hover:brightness-110"
                style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <BookOpen size={9} /> Edit
              </button>
              <button type="button" onClick={() => toggle(section.id)}
                className="p-1.5 rounded-lg transition-all hover:bg-white/5 shrink-0"
                style={{ color: 'var(--text-muted)' }}>
                {open ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
              </button>
            </div>

            {/* Expandable body */}
            {open && gridRows.length > 0 && (
              <div className="px-5 py-2 pb-3">
                {gridRows.map((row, ri) => (
                  <div key={ri} className="grid grid-cols-2 gap-x-8 py-2"
                    style={{ borderTop: ri > 0 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                    {row.map((cell, ci) => cell ? (
                      <div key={ci}>
                        <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{cell.label}</p>
                        <p className="text-xs font-semibold mt-0.5" style={{ color: 'var(--text-secondary)' }}>{cell.val}</p>
                      </div>
                    ) : <div key={ci} />)}
                  </div>
                ))}
              </div>
            )}

            {open && gridRows.length === 0 && (
              <div className="px-5 py-3">
                <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>No data configured yet — click Edit to fill in this step.</p>
              </div>
            )}
          </div>
        )
      })}

      {/* ── NBA Intelligence Summary 2×2 ─────────────────────────────────────── */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <p className="text-[10px] font-bold tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>NBA Intelligence Summary</p>
          <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
        </div>
        <div className="grid grid-cols-2 gap-3">

          {/* Why selected */}
          <div className="rounded-xl p-4" style={{ background: 'rgba(37,99,235,0.1)', border: '1px solid rgba(59,130,246,0.22)' }}>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'rgba(59,130,246,0.22)' }}>
                <Sparkles size={12} style={{ color: '#60a5fa' }} />
              </div>
              <div>
                <p className="text-[11px] font-bold leading-tight" style={{ color: '#93c5fd' }}>Why This Playbook May Be Selected</p>
                <p className="text-[9px] mt-0.5" style={{ color: 'rgba(147,197,253,0.55)' }}>When NBA evaluates customer moments</p>
              </div>
            </div>
            <div className="space-y-1.5">
              {whySelected.length > 0
                ? whySelected.map((item, i) => (
                  <div key={i} className="flex items-start gap-1.5">
                    <CheckCircle size={10} style={{ color: '#60a5fa', flexShrink: 0, marginTop: 1 }} />
                    <p className="text-[10px] leading-relaxed" style={{ color: 'rgba(147,197,253,0.85)' }}>{item}</p>
                  </div>
                ))
                : <p className="text-[10px]" style={{ color: 'rgba(147,197,253,0.4)' }}>Complete earlier steps to see selection criteria</p>
              }
            </div>
          </div>

          {/* What can block */}
          <div className="rounded-xl p-4" style={{ background: 'rgba(185,28,28,0.12)', border: '1px solid rgba(248,113,113,0.22)' }}>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'rgba(239,68,68,0.2)' }}>
                <XCircle size={12} style={{ color: '#f87171' }} />
              </div>
              <div>
                <p className="text-[11px] font-bold leading-tight" style={{ color: '#fca5a5' }}>What Can Block Execution</p>
                <p className="text-[9px] mt-0.5" style={{ color: 'rgba(252,165,165,0.55)' }}>Hard gates and exit conditions</p>
              </div>
            </div>
            <div className="space-y-1.5">
              {whatBlocks.length > 0
                ? whatBlocks.map((item, i) => (
                  <div key={i} className="flex items-start gap-1.5">
                    <XCircle size={10} style={{ color: '#f87171', flexShrink: 0, marginTop: 1 }} />
                    <p className="text-[10px] leading-relaxed" style={{ color: 'rgba(252,165,165,0.85)' }}>{item}</p>
                  </div>
                ))
                : <p className="text-[10px]" style={{ color: 'rgba(252,165,165,0.4)' }}>No blocking conditions configured</p>
              }
            </div>
          </div>

          {/* What NBA can adapt */}
          <div className="rounded-xl p-4" style={{ background: 'rgba(109,40,217,0.12)', border: '1px solid rgba(167,139,250,0.22)' }}>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'rgba(124,92,252,0.25)' }}>
                <Zap size={12} style={{ color: '#a78bfa' }} />
              </div>
              <div>
                <p className="text-[11px] font-bold leading-tight" style={{ color: '#c4b5fd' }}>What NBA Can Adapt</p>
                <p className="text-[9px] mt-0.5" style={{ color: 'rgba(196,181,253,0.55)' }}>Within your guardrails</p>
              </div>
            </div>
            <div className="space-y-1.5">
              {whatAdapts.map((item, i) => (
                <div key={i} className="flex items-start gap-1.5">
                  <Zap size={10} style={{ color: '#a78bfa', flexShrink: 0, marginTop: 1 }} />
                  <p className="text-[10px] leading-relaxed" style={{ color: 'rgba(196,181,253,0.85)' }}>
                    <strong style={{ color: '#c4b5fd' }}>{item.label}:</strong> {item.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* What requires approval */}
          <div className="rounded-xl p-4" style={{ background: 'rgba(120,53,15,0.15)', border: '1px solid rgba(245,158,11,0.22)' }}>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'rgba(245,158,11,0.2)' }}>
                <UserCheck size={12} style={{ color: '#fbbf24' }} />
              </div>
              <div>
                <p className="text-[11px] font-bold leading-tight" style={{ color: '#fcd34d' }}>What Requires Approval</p>
                <p className="text-[9px] mt-0.5" style={{ color: 'rgba(252,211,77,0.55)' }}>Human review checkpoints</p>
              </div>
            </div>
            <div className="space-y-1.5">
              {whatApproval.length > 0
                ? whatApproval.map((item, i) => (
                  <div key={i} className="flex items-start gap-1.5">
                    <UserCheck size={10} style={{ color: '#fbbf24', flexShrink: 0, marginTop: 1 }} />
                    <p className="text-[10px] leading-relaxed" style={{ color: 'rgba(252,211,77,0.85)' }}>{item}</p>
                  </div>
                ))
                : <p className="text-[10px]" style={{ color: 'rgba(252,211,77,0.4)' }}>Configure trust controls to see approval requirements</p>
              }
            </div>
          </div>

        </div>
      </div>

      {/* ── Version & Publishing Notes ────────────────────────────────────────── */}
      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.09)' }}>
        <div className="flex items-center gap-2 px-5 py-3.5"
          style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <GitBranch size={13} style={{ color: '#a78bfa' }} />
          <span className="text-xs font-bold" style={{ color: '#a78bfa' }}>Version & Publishing Notes</span>
        </div>
        <div className="px-5 py-4 space-y-4">

          {/* v1 badge row */}
          <div className="flex items-center gap-3 px-4 py-3.5 rounded-xl"
            style={{ background: 'rgba(124,92,252,0.08)', border: '1px solid rgba(124,92,252,0.2)' }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: 'linear-gradient(135deg,#7c5cfc,#3b82f6)' }}>
              <span className="text-xs font-black text-white">v1</span>
            </div>
            <div>
              <p className="text-xs font-bold" style={{ color: 'var(--text-secondary)' }}>Initial Version</p>
              <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>This will be published as the first version of this playbook</p>
            </div>
          </div>

          {/* Version note input */}
          <div>
            <FieldLabel hint="Help your team understand what changed in this version">
              Version Note <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(Optional)</span>
            </FieldLabel>
            <input
              type="text"
              className="input-base w-full text-xs"
              placeholder="e.g., Initial release, Updated trust controls, Added SMS channel"
              value={data.versionNote || ''}
              onChange={e => onChange({ ...data, versionNote: e.target.value })}
            />
          </div>

        </div>
      </div>

    </div>
  )
}

// ── Finish Modal ──────────────────────────────────────────────────────────────
function FinishModal({ finishData, data, onContinue, onExit, onSaveDraft, onPublish }) {
  const { complete, missing } = finishData

  return createPortal(
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}>
      <div className="relative flex flex-col rounded-2xl overflow-hidden"
        style={{ width: 520, maxWidth: '90vw', background: 'var(--slideout-bg)', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 28px 64px rgba(0,0,0,0.65)' }}>

        {complete ? (
          <>
            {/* ✅ All good header */}
            <div className="px-6 pt-6 pb-5"
              style={{ background: 'rgba(34,197,94,0.06)', borderBottom: '1px solid rgba(34,197,94,0.12)' }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)' }}>
                  <CheckCircle size={20} style={{ color: '#4ade80' }} />
                </div>
                <div>
                  <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Everything looks good!</p>
                  <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                    <strong style={{ color: '#4ade80' }}>{data.name || 'Untitled Playbook'}</strong> is fully configured and ready
                  </p>
                </div>
              </div>
            </div>

            {/* Summary + save options */}
            <div className="px-6 py-5">
              <p className="text-[10px] font-bold tracking-widest uppercase mb-3" style={{ color: 'var(--text-muted)' }}>Configuration Summary</p>
              <div className="space-y-1.5 mb-5">
                {[
                  'All 6 steps complete',
                  data.primaryMoment    && `Moment: ${data.primaryMoment}`,
                  data.goalType         && `Goal: ${data.goalType}`,
                  data.phases.length > 0 && `${data.phases.length} phase${data.phases.length > 1 ? 's' : ''} defined`,
                  data.trustPreset      && `Trust: ${data.trustPreset.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}`,
                ].filter(Boolean).map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <CheckCircle size={10} style={{ color: '#4ade80' }} />
                    <p className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>{item}</p>
                  </div>
                ))}
              </div>

              <p className="text-xs font-semibold mb-3" style={{ color: 'var(--text-secondary)' }}>How would you like to save?</p>
              <div className="grid grid-cols-2 gap-3">
                <button type="button" onClick={onSaveDraft}
                  className="flex flex-col gap-2 p-4 rounded-xl text-left transition-all hover:brightness-110"
                  style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.28)' }}>
                  <div className="flex items-center gap-2">
                    <Save size={13} style={{ color: '#fbbf24' }} />
                    <p className="text-xs font-bold" style={{ color: '#fbbf24' }}>Save and Exit</p>
                  </div>
                  <p className="text-[10px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                    Saved as <strong style={{ color: '#fcd34d' }}>Draft</strong>. Not visible to reps until published.
                  </p>
                </button>
                <button type="button" onClick={onPublish}
                  className="flex flex-col gap-2 p-4 rounded-xl text-left transition-all hover:brightness-110"
                  style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.28)' }}>
                  <div className="flex items-center gap-2">
                    <PlayCircle size={13} style={{ color: '#4ade80' }} />
                    <p className="text-xs font-bold" style={{ color: '#4ade80' }}>Publish Now</p>
                  </div>
                  <p className="text-[10px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                    Status set to <strong style={{ color: '#4ade80' }}>Published</strong>. Live and available for execution.
                  </p>
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* ⚠️ Incomplete header */}
            <div className="px-6 pt-6 pb-5"
              style={{ background: 'rgba(245,158,11,0.06)', borderBottom: '1px solid rgba(245,158,11,0.12)' }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)' }}>
                  <AlertTriangle size={20} style={{ color: '#fbbf24' }} />
                </div>
                <div>
                  <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Almost there</p>
                  <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>Some required fields are still missing</p>
                </div>
              </div>
            </div>

            <div className="px-6 py-5 space-y-4">
              {/* Saved as draft notice */}
              <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl"
                style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
                <Save size={12} style={{ color: '#fbbf24', flexShrink: 0 }} />
                <p className="text-[11px]" style={{ color: '#fcd34d' }}>
                  Your progress has been saved as a <strong>Draft</strong> and can be completed later
                </p>
              </div>

              {/* Missing fields list */}
              <div>
                <p className="text-[10px] font-bold tracking-widest uppercase mb-2.5" style={{ color: 'var(--text-muted)' }}>
                  Required fields missing
                </p>
                <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                  {missing.map((m, i) => (
                    <div key={i} className="flex items-start gap-2.5 px-3.5 py-2.5 rounded-xl"
                      style={{ background: 'rgba(248,113,113,0.06)', border: '1px solid rgba(248,113,113,0.18)' }}>
                      <XCircle size={11} style={{ color: '#f87171', flexShrink: 0, marginTop: 1 }} />
                      <div>
                        <p className="text-[11px] font-semibold" style={{ color: 'var(--text-secondary)' }}>{m.step}</p>
                        <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{m.fields.join(' · ')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-6 py-4 shrink-0"
              style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
              <button type="button" onClick={onExit}
                className="flex items-center gap-1.5 text-xs font-medium transition-all hover:opacity-75"
                style={{ color: 'var(--text-muted)' }}>
                Exit to Library <ChevronRight size={12} />
              </button>
              <button type="button" onClick={onContinue}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all hover:brightness-110"
                style={{ background: 'linear-gradient(135deg,#7c5cfc,#3b82f6)', color: '#fff', boxShadow: '0 2px 12px rgba(124,92,252,0.35)' }}>
                Continue Editing <ChevronRight size={12} />
              </button>
            </div>
          </>
        )}

      </div>
    </div>,
    document.body
  )
}

// ── Stepper ───────────────────────────────────────────────────────────────────
function TopStepper({ currentIndex, steps, data, onJump }) {
  return (
    <div className="flex items-center gap-1 px-8 py-3 shrink-0 overflow-x-auto"
      style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.01)' }}>
      {steps.map((step, i) => {
        const done    = isStepDone(step.id, data)
        const active  = i === currentIndex
        const past    = i < currentIndex
        const Icon    = step.icon

        return (
          <React.Fragment key={step.id}>
            <button
              type="button"
              onClick={() => onJump(i)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all"
              style={{
                background: active ? 'linear-gradient(135deg,#7c5cfc,#3b82f6)' : done ? 'rgba(34,197,94,0.1)' : 'rgba(255,255,255,0.04)',
                color: active ? '#fff' : done ? '#4ade80' : past ? 'var(--text-secondary)' : 'var(--text-muted)',
                border: active ? 'none' : done ? '1px solid rgba(34,197,94,0.3)' : '1px solid rgba(255,255,255,0.07)',
              }}>
              {done && !active
                ? <CheckCircle size={11} style={{ color: '#4ade80' }} />
                : <span className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0"
                    style={{ background: active ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.08)' }}>
                    {i + 1}
                  </span>}
              {step.label}
            </button>
            {i < steps.length - 1 && (
              <ChevronRight size={12} style={{ color: 'rgba(255,255,255,0.18)', flexShrink: 0 }} />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function PlaybookBuilder() {
  const navigate     = useNavigate()
  const [step,  setStep]  = useState(0)
  const [data,  setData]  = useState(INITIAL)
  const [saved,       setSaved]       = useState(false)
  const [showFinish,  setShowFinish]  = useState(false)
  const [finishData,  setFinishData]  = useState(null)

  const currentStepDef = STEPS[step]
  const { total, complete } = getRequiredCount(currentStepDef.id, data)
  const isReviewStep = currentStepDef.id === 'review'
  const canContinue = isReviewStep || complete === total

  const goNext = () => { if (step < STEPS.length - 1) setStep(s => s + 1) }
  const goBack = () => { if (step > 0) setStep(s => s - 1) }

  const handleSaveDraft = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const handleFinish = () => {
    const missing = []
    STEPS.filter(s => s.id !== 'review').forEach(stepDef => {
      const fields     = SIDEBAR_FIELDS[stepDef.id] || []
      const required   = fields.filter(f => f.required)
      const incomplete = required.filter(f => !hasValue(data[f.key]))
      if (incomplete.length > 0) {
        missing.push({ step: STEP_META[stepDef.id].title, fields: incomplete.map(f => f.label) })
      }
    })
    setFinishData({ complete: missing.length === 0, missing })
    setShowFinish(true)
  }

  const STEP_COMPONENTS = {
    basics:    <BasicsStep     data={data} onChange={setData} />,
    knowledge: <KnowledgeStep  data={data} onChange={setData} />,
    moment:    <MomentStep     data={data} onChange={setData} />,
    gates:     <GatesStep      data={data} onChange={setData} />,
    objective: <ObjectiveStep  data={data} onChange={setData} />,
    phases:    <PhasesStep     data={data} onChange={setData} />,
    trust:     <TrustStep      data={data} onChange={setData} />,
    review:    <ReviewStep     data={data} onChange={setData} onJump={setStep} />,
  }

  const isLastStep = step === STEPS.length - 1

  return (
    <div className="flex flex-col h-full" style={{ background: 'var(--bg-base)' }}>

      {/* ── Header ── */}
      <div className="flex items-center justify-between px-8 py-4 shrink-0"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/playbooks/create')}
            className="p-1.5 rounded-lg transition-all hover:brightness-110"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)' }}>
            <ArrowLeft size={14} style={{ color: 'var(--text-muted)' }} />
          </button>
          <div>
            <div className="flex items-center gap-2 mb-0.5 text-[11px]" style={{ color: 'var(--text-muted)' }}>
              <span onClick={() => navigate('/playbooks')} className="cursor-pointer hover:opacity-80">Playbooks</span>
              <ChevronRight size={10} />
              <span onClick={() => navigate('/playbooks/create')} className="cursor-pointer hover:opacity-80">Create Playbook</span>
            </div>
            <h1 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Playbook Builder</h1>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="text-[10px] px-2 py-0.5 rounded-full font-bold"
            style={{ background: 'rgba(245,158,11,0.15)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.3)' }}>
            Draft
          </span>
          <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
            {data.name || 'Untitled Playbook'}
          </span>
          <button onClick={handleSaveDraft}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all hover:brightness-110"
            style={{
              background: saved ? 'rgba(34,197,94,0.15)' : 'rgba(59,130,246,0.15)',
              border: `1px solid ${saved ? 'rgba(34,197,94,0.4)' : 'rgba(59,130,246,0.4)'}`,
              color: saved ? '#4ade80' : '#60a5fa',
            }}>
            {saved ? <CheckCircle size={12} /> : <Save size={12} />}
            {saved ? 'Saved!' : 'Save Draft'}
          </button>
        </div>
      </div>

      {/* ── Stepper ── */}
      <TopStepper currentIndex={step} steps={STEPS} data={data} onJump={setStep} />

      {/* ── Body: sidebar + content ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* Sidebar */}
        <StepSidebar stepId={currentStepDef.id} data={data} />

        {/* Step content */}
        <div className="flex-1 overflow-y-auto px-10 py-7">
          <div style={{ maxWidth: 720 }}>

            {/* Step header */}
            {(() => {
              const meta = STEP_META[currentStepDef.id]
              const Icon = currentStepDef.icon
              return (
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: meta.iconBg }}>
                      <Icon size={18} color="#fff" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>{meta.title}</h2>
                      <p className="text-[11px] mt-0.5 leading-snug" style={{ color: 'var(--text-muted)', maxWidth: 480 }}>{meta.desc}</p>
                    </div>
                  </div>
                </div>
              )
            })()}

            {STEP_COMPONENTS[currentStepDef.id]}
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <div className="flex items-center justify-between px-8 py-4 shrink-0"
        style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <button
          onClick={step === 0 ? () => navigate('/playbooks/create') : goBack}
          className="flex items-center gap-1.5 text-sm font-medium transition-colors hover:opacity-70"
          style={{ color: 'var(--text-muted)' }}>
          <ChevronLeft size={14} />
          {step === 0 ? 'Cancel' : 'Back'}
        </button>

        <div className="flex items-center gap-4">
          {/* Progress counter */}
          {total > 0 && (
            <p className="text-[11px]" style={{ color: canContinue ? '#4ade80' : 'var(--text-muted)' }}>
              {complete} / {total} required fields complete
            </p>
          )}

          <button
            onClick={isLastStep ? handleFinish : goNext}
            disabled={!canContinue}
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold transition-all"
            style={{
              background: canContinue ? 'linear-gradient(135deg,#7c5cfc,#3b82f6)' : 'rgba(255,255,255,0.06)',
              color: canContinue ? '#fff' : 'var(--text-muted)',
              boxShadow: canContinue ? '0 2px 12px rgba(124,92,252,0.35)' : 'none',
              cursor: canContinue ? 'pointer' : 'not-allowed',
              opacity: canContinue ? 1 : 0.5,
            }}>
            {isLastStep ? <><Flag size={13} /> Finish Playbook</> : <>Continue <ChevronRight size={14} /></>}
          </button>
        </div>
      </div>

      {/* ── Finish modal ── */}
      {showFinish && finishData && (
        <FinishModal
          finishData={finishData}
          data={data}
          onContinue={() => setShowFinish(false)}
          onExit={()       => navigate('/playbooks', { state: { saved: true, status: 'draft',     name: data.name || 'Untitled Playbook' } })}
          onSaveDraft={()  => navigate('/playbooks', { state: { saved: true, status: 'draft',     name: data.name || 'Untitled Playbook' } })}
          onPublish={()    => navigate('/playbooks', { state: { saved: true, status: 'published', name: data.name || 'Untitled Playbook' } })}
        />
      )}

    </div>
  )
}

// ── Named exports for Configuration tab in PlaybookDetail ─────────────────────
export { BasicsStep, KnowledgeStep, MomentStep, GatesStep, ObjectiveStep, PhasesStep, TrustStep, INITIAL }
