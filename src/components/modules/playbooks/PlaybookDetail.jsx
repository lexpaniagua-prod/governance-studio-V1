import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createPortal } from 'react-dom'
import {
  ArrowLeft, ChevronRight, ChevronDown, Copy, Play, BookOpen, Archive, Trash2,
  Eye, Settings, GitBranch, Activity, Clock, CheckCircle,
  Zap, Shield, User, Layers, AlertTriangle, X, Flag,
  Sparkles, Target, Lock,
} from 'lucide-react'

// ── Shared mock (mirrors Playbooks.jsx) ───────────────────────────────────────
const PLAYBOOKS = [
  {
    id: 'PB-001',
    name: 'Customer Onboarding Excellence',
    description: 'Adaptive playbook for new customer success and value realization',
    moment: 'Customer Created',
    stage: 'Onboarding',
    department: 'Customer Success',
    owner: 'Sarah Chen',
    ownerInitials: 'SC',
    ownerGradient: 'linear-gradient(135deg,#a78bfa,#60a5fa)',
    status: 'Published',
    trustMode: 'Auto',
    version: 'v2.3',
    updatedAt: '2 hours ago',
    phases: 4,
    gates: 3,
  },
  {
    id: 'PB-002',
    name: 'Renewal Optimization Strategy',
    description: 'NBA-driven renewal engagement with risk detection and intervention',
    moment: '90 Days to Renewal',
    stage: 'Renewal',
    department: 'Sales',
    owner: 'Michael Torres',
    ownerInitials: 'MT',
    ownerGradient: 'linear-gradient(135deg,#f59e0b,#ef4444)',
    status: 'Published',
    trustMode: 'Approval',
    version: 'v1.8',
    updatedAt: '5 hours ago',
    phases: 3,
    gates: 4,
  },
  {
    id: 'PB-003',
    name: 'Product Adoption Accelerator',
    description: 'Dynamic feature adoption and usage expansion based on engagement signals',
    moment: 'Low Engagement Detected',
    stage: 'Adoption',
    department: 'Product',
    owner: 'Emily Rodriguez',
    ownerInitials: 'ER',
    ownerGradient: 'linear-gradient(135deg,#4ade80,#22d3ee)',
    status: 'Draft',
    trustMode: 'Draft',
    version: 'v0.4',
    updatedAt: '1 day ago',
    phases: 2,
    gates: 2,
  },
  {
    id: 'PB-004',
    name: 'Expansion Opportunity Generator',
    description: 'Identifies and orchestrates cross-sell and upsell opportunities',
    moment: 'Usage Threshold Met',
    stage: 'Expansion',
    department: 'Sales',
    owner: 'David Park',
    ownerInitials: 'DP',
    ownerGradient: 'linear-gradient(135deg,#2dd4bf,#60a5fa)',
    status: 'Published',
    trustMode: 'Auto',
    version: 'v3.1',
    updatedAt: '3 days ago',
    phases: 3,
    gates: 3,
  },
  {
    id: 'PB-005',
    name: 'Churn Prevention Protocol',
    description: 'Early warning system with adaptive intervention strategies for at-risk accounts',
    moment: 'Risk Score Change',
    stage: 'Retention',
    department: 'Customer Success',
    owner: 'Sarah Chen',
    ownerInitials: 'SC',
    ownerGradient: 'linear-gradient(135deg,#a78bfa,#60a5fa)',
    status: 'Published',
    trustMode: 'Approval',
    version: 'v2.0',
    updatedAt: '1 week ago',
    phases: 5,
    gates: 5,
  },
]

// ── Design tokens ─────────────────────────────────────────────────────────────
const STATUS_STYLE = {
  Published: { bg: 'rgba(34,197,94,0.12)',   color: '#4ade80', border: 'rgba(34,197,94,0.3)',   dot: '#22c55e' },
  Draft:     { bg: 'rgba(245,158,11,0.12)',  color: '#fbbf24', border: 'rgba(245,158,11,0.3)',  dot: '#f59e0b' },
  Archived:  { bg: 'rgba(100,116,139,0.12)', color: '#94a3b8', border: 'rgba(100,116,139,0.3)', dot: '#64748b' },
}

const STAGE_STYLE = {
  Onboarding: { color: '#60a5fa', bg: 'rgba(59,130,246,0.12)',  border: 'rgba(59,130,246,0.28)'  },
  Renewal:    { color: '#a78bfa', bg: 'rgba(124,92,252,0.12)', border: 'rgba(124,92,252,0.28)'  },
  Adoption:   { color: '#2dd4bf', bg: 'rgba(20,184,166,0.12)', border: 'rgba(20,184,166,0.28)'  },
  Expansion:  { color: '#4ade80', bg: 'rgba(34,197,94,0.12)',  border: 'rgba(34,197,94,0.28)'   },
  Retention:  { color: '#fb923c', bg: 'rgba(249,115,22,0.12)', border: 'rgba(249,115,22,0.28)'  },
}

const TRUST_STYLE = {
  Auto:     { color: '#2dd4bf', bg: 'rgba(20,184,166,0.1)',  icon: <Zap size={11} />,    label: 'Auto-Execute'      },
  Approval: { color: '#a78bfa', bg: 'rgba(124,92,252,0.1)', icon: <Shield size={11} />, label: 'Approval Required' },
  Draft:    { color: '#fbbf24', bg: 'rgba(245,158,11,0.1)', icon: <GitBranch size={11} />, label: 'Draft Mode'     },
}

// ── Tabs definition ───────────────────────────────────────────────────────────
const TABS = [
  { id: 'overview',      label: 'Overview',       icon: Eye       },
  { id: 'configuration', label: 'Configuration',  icon: Settings  },
  { id: 'versions',      label: 'Versions',       icon: GitBranch },
  { id: 'history',       label: 'History',        icon: Clock     },
]

const OVERVIEW_SUBTABS = [
  { id: 'what',     label: 'What this playbook does', icon: Eye      },
  { id: 'activity', label: 'Activity / Usage',        icon: Activity },
]

// ── Per-playbook detail data ──────────────────────────────────────────────────
const PLAYBOOK_DETAIL_DATA = {
  'PB-001': {
    aiSummary: 'This playbook orchestrates a comprehensive onboarding journey for new enterprise customers, triggering automatically when an account is created in the CRM. It runs four sequential phases — from welcome and orientation through to expansion signal detection — using NBA to time and personalize every touchpoint based on real-time engagement signals. Operating in full auto-execute mode at 75% confidence, NBA can send messages and create tasks autonomously, escalating to the assigned CSM only when signals fall below threshold or a hard gate fails.',
    objective: 'Drive first value realization for new enterprise customers within 30 days of account creation',
    moment: { label: 'Customer Created', sources: ['CRM Platform', 'Customer Platform'] },
    gates: ['Email or SMS consent is active', 'Account activation confirmed in platform', 'No suppression or DNC flag present'],
    trust: { mode: 'Auto-Execute', confidence: 75, escalation: 'Assigned CSM' },
    phases: [
      { name: 'Welcome & Orientation', desc: 'Personalized welcome email + kickoff call scheduling' },
      { name: 'Product Setup',         desc: 'Guide customer through core feature activation checklist' },
      { name: 'First Value Milestone', desc: 'Monitor and celebrate first meaningful product usage event' },
      { name: 'Expansion Signal',      desc: 'Surface upsell readiness signals to Account Executive' },
    ],
    outcome: 'Customer achieves first meaningful product milestone within 30 days of account creation',
  },
  'PB-002': {
    aiSummary: 'This playbook activates 90 days before contract renewal to identify at-risk accounts and maximize retention outcomes. It monitors health scores, engagement trends, and open support tickets to determine which intervention path NBA should recommend — from personalized renewal outreach to CSM-led executive engagement. All actions require explicit human approval before execution, giving your team full control at this critical contract moment.',
    objective: 'Maximize contract renewal rate and expand ARR on qualifying accounts',
    moment: { label: '90 Days to Renewal', sources: ['CRM Platform', 'Data Warehouse'] },
    gates: ['Email consent confirmed and active', 'Subscription is active and not already in cancellation', 'No duplicate renewal sequences currently running', 'Rep conflict check cleared'],
    trust: { mode: 'Approval Required', confidence: 85, escalation: 'Rep + Revenue Manager' },
    phases: [
      { name: 'Risk Assessment',      desc: 'Score account health and flag intervention tier' },
      { name: 'Renewal Engagement',   desc: 'Personalized outreach aligned to account history and signals' },
      { name: 'Executive Alignment',  desc: 'CSM-led executive conversation for strategic accounts' },
    ],
    outcome: 'Contract renewed at same or higher ARR with no churn escalation',
  },
  'PB-003': {
    aiSummary: 'This playbook targets accounts showing sustained low feature engagement to accelerate adoption before churn risk escalates. When NBA detects usage drops below baseline for 14 or more days, it triggers a tailored re-engagement sequence across email and in-app channels. Currently operating in draft mode — NBA prepares suggested actions but does not execute until a CSM reviews and approves each step, making it ideal for high-touch accounts.',
    objective: 'Recover feature adoption and prevent disengagement from becoming a churn precursor',
    moment: { label: 'Low Engagement Detected', sources: ['Product Analytics', 'CRM Platform'] },
    gates: ['Email consent confirmed', 'Account not currently in any suppression list', 'No competing adoption or nurture sequence active'],
    trust: { mode: 'Draft Mode', confidence: 70, escalation: 'Customer Success Manager' },
    phases: [
      { name: 'Re-engagement Outreach', desc: 'Targeted email and in-app nudges toward underused features' },
      { name: 'Adoption Guidance',      desc: 'CSM-assisted onboarding for key activation milestones' },
    ],
    outcome: 'Feature adoption score returns to department baseline within 30 days',
  },
  'PB-004': {
    aiSummary: 'This playbook identifies accounts that have reached usage saturation and surfaces timely expansion opportunities to the right rep at the right moment. NBA monitors seat utilization, workflow creation rate, and overall account health to determine when and how to initiate an upsell conversation. With auto-execute trust mode, NBA can autonomously present relevant product upgrades to key contacts without requiring manual rep initiation.',
    objective: 'Convert high-utilization accounts into expansion opportunities by surfacing upsell signals proactively',
    moment: { label: 'Usage Threshold Met', sources: ['Product Analytics', 'CRM Platform'] },
    gates: ['All consent channels verified', 'Account not currently in pricing freeze or negotiation hold', 'No duplicate expansion outreach sequence active'],
    trust: { mode: 'Auto-Execute', confidence: 60, escalation: 'Account Executive' },
    phases: [
      { name: 'Signal Detection',       desc: 'Confirm saturation pattern and qualify expansion readiness' },
      { name: 'Opportunity Framing',    desc: 'Prepare personalized expansion narrative based on usage data' },
      { name: 'Upsell Facilitation',    desc: 'Deliver expansion offer to key stakeholder via optimal channel' },
    ],
    outcome: 'Account expands to next plan tier or adds additional licensed seats',
  },
  'PB-005': {
    aiSummary: 'This playbook is the last line of defense for critically at-risk accounts, activating the moment health scores drop into the danger zone. It runs a five-phase intervention — from immediate CSM alert through to executive escalation and targeted win-back offer — with approval gates at every step to ensure only deliberate, high-quality actions are taken. All five hard gates must pass before execution begins, guaranteeing this high-intensity playbook is reserved for genuinely critical situations.',
    objective: 'Prevent churn by executing a structured, human-in-the-loop intervention for critical-risk accounts',
    moment: { label: 'Risk Score Change', sources: ['CRM Platform', 'Data Warehouse', 'Product Analytics'] },
    gates: ['Email consent confirmed', 'Account is not already enrolled in a win-back flow', 'No active suppression or cooling-off period', 'CSM has completed human review and flag assessment', 'Legal hold check passed'],
    trust: { mode: 'Approval Required', confidence: 85, escalation: 'CSM + Director of CS' },
    phases: [
      { name: 'Immediate Alert',              desc: 'Notify CSM and flag account in CRM for priority review' },
      { name: 'CSM Intervention',             desc: 'Direct outreach from assigned CSM with tailored message' },
      { name: 'Product Value Reinforcement',  desc: 'Share ROI report and success stories relevant to account' },
      { name: 'Executive Escalation',         desc: 'VP-level engagement for strategic accounts above $50K ARR' },
      { name: 'Win-Back Offer',               desc: 'Present retention offer — discount, feature unlock, or SLA upgrade' },
    ],
    outcome: 'Account health score recovers above 60 and churn risk classification is removed',
  },
}

// ── Flow diagram components ───────────────────────────────────────────────────
function FlowConnector() {
  return (
    <div className="flex flex-col items-center" style={{ marginLeft: 20 }}>
      <div style={{ width: 2, height: 18, background: 'rgba(255,255,255,0.1)' }} />
      <ChevronDown size={13} style={{ color: 'rgba(255,255,255,0.18)', marginTop: -3 }} />
    </div>
  )
}

function FlowNode({ color, bg, border, icon: Icon, typeLabel, children }) {
  return (
    <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${border}` }}>
      <div className="flex items-center gap-2 px-4 py-2"
        style={{ background: bg, borderBottom: `1px solid ${border}` }}>
        <Icon size={12} style={{ color, flexShrink: 0 }} />
        <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color }}>
          {typeLabel}
        </span>
      </div>
      <div className="px-4 py-3.5" style={{ background: 'rgba(255,255,255,0.015)' }}>
        {children}
      </div>
    </div>
  )
}

function OverviewWhatTab({ pb }) {
  const detail = PLAYBOOK_DETAIL_DATA[pb.id] || PLAYBOOK_DETAIL_DATA['PB-001']
  const trust  = TRUST_STYLE[pb.trustMode] || TRUST_STYLE.Draft

  return (
    <div className="space-y-5 max-w-3xl">

      {/* ── AI Intelligence Summary ── */}
      <div className="rounded-xl p-5"
        style={{ background: 'rgba(124,92,252,0.07)', border: '1px solid rgba(124,92,252,0.25)' }}>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: 'linear-gradient(135deg,#7c5cfc,#3b82f6)' }}>
            <Sparkles size={11} color="#fff" />
          </div>
          <span className="text-xs font-bold" style={{ color: '#a78bfa' }}>AI Intelligence Summary</span>
          <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full font-medium"
            style={{ background: 'rgba(124,92,252,0.15)', color: '#c4b5fd', border: '1px solid rgba(124,92,252,0.3)' }}>
            Auto-generated
          </span>
        </div>
        <p className="text-[13px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          {detail.aiSummary}
        </p>
        {/* Quick stat chips */}
        <div className="flex items-center gap-2 mt-4 flex-wrap">
          {[
            { label: 'Stage',   val: pb.stage,                color: STAGE_STYLE[pb.stage]?.color  || '#60a5fa' },
            { label: 'Phases',  val: `${pb.phases} phases`,   color: '#4ade80' },
            { label: 'Gates',   val: `${pb.gates} gates`,     color: '#fbbf24' },
            { label: 'Trust',   val: trust.label,             color: trust.color },
          ].map(s => (
            <div key={s.label}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold"
              style={{ background: `${s.color}18`, color: s.color, border: `1px solid ${s.color}35` }}>
              <span style={{ opacity: 0.65 }}>{s.label}:</span> {s.val}
            </div>
          ))}
        </div>
      </div>

      {/* ── Playbook Flow ── */}
      <div>
        <p className="text-[10px] font-bold tracking-widest uppercase mb-3"
          style={{ color: 'var(--text-muted)' }}>Playbook Flow</p>

        {/* Objective */}
        <FlowNode color="#a78bfa" bg="rgba(124,92,252,0.08)" border="rgba(124,92,252,0.2)"
          icon={Target} typeLabel="Objective">
          <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            {detail.objective}
          </p>
        </FlowNode>

        <FlowConnector />

        {/* Trigger */}
        <FlowNode color="#60a5fa" bg="rgba(59,130,246,0.08)" border="rgba(59,130,246,0.2)"
          icon={Zap} typeLabel="Enters play when">
          <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            {detail.moment.label}
          </p>
          {detail.moment.sources.length > 0 && (
            <div className="flex items-center gap-1.5 mt-2 flex-wrap">
              <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Listening on:</span>
              {detail.moment.sources.map(s => (
                <span key={s} className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                  style={{ background: 'rgba(96,165,250,0.12)', color: '#60a5fa', border: '1px solid rgba(96,165,250,0.25)' }}>
                  {s}
                </span>
              ))}
            </div>
          )}
        </FlowNode>

        <FlowConnector />

        {/* Hard Gates */}
        <FlowNode color="#fbbf24" bg="rgba(245,158,11,0.07)" border="rgba(245,158,11,0.2)"
          icon={Shield} typeLabel="Requires all hard gates to pass">
          <div className="space-y-1.5">
            {detail.gates.map((g, i) => (
              <div key={i} className="flex items-start gap-2">
                <CheckCircle size={12} style={{ color: '#4ade80', marginTop: 1.5, flexShrink: 0 }} />
                <span className="text-[12px]" style={{ color: 'var(--text-secondary)' }}>{g}</span>
              </div>
            ))}
          </div>
        </FlowNode>

        <FlowConnector />

        {/* Trust Controls */}
        <FlowNode color="#2dd4bf" bg="rgba(20,184,166,0.07)" border="rgba(20,184,166,0.2)"
          icon={Lock} typeLabel="Applies trust controls">
          <div className="flex items-center gap-6 flex-wrap">
            {[
              { label: 'Mode',                 val: detail.trust.mode,          color: trust.color },
              { label: 'Confidence threshold', val: `${detail.trust.confidence}%`, color: '#2dd4bf' },
              { label: 'Escalates to',         val: detail.trust.escalation,    color: 'var(--text-secondary)' },
            ].map(f => (
              <div key={f.label}>
                <p className="text-[10px] mb-0.5" style={{ color: 'var(--text-muted)' }}>{f.label}</p>
                <p className="text-xs font-bold" style={{ color: f.color }}>{f.val}</p>
              </div>
            ))}
          </div>
        </FlowNode>

        <FlowConnector />

        {/* Phases */}
        <FlowNode color="#4ade80" bg="rgba(34,197,94,0.07)" border="rgba(34,197,94,0.2)"
          icon={Layers} typeLabel={`Executes through ${detail.phases.length} sequential phases`}>
          <div className="flex items-stretch gap-2 overflow-x-auto pb-1">
            {detail.phases.map((phase, i) => (
              <React.Fragment key={i}>
                <div className="flex-1 min-w-[148px] rounded-lg p-3"
                  style={{ background: 'rgba(34,197,94,0.07)', border: '1px solid rgba(34,197,94,0.18)' }}>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0"
                      style={{ background: 'rgba(34,197,94,0.2)', color: '#4ade80' }}>{i + 1}</span>
                    <span className="text-[11px] font-semibold" style={{ color: '#4ade80' }}>{phase.name}</span>
                  </div>
                  <p className="text-[10px] leading-snug" style={{ color: 'var(--text-muted)' }}>{phase.desc}</p>
                </div>
                {i < detail.phases.length - 1 && (
                  <div className="flex items-center shrink-0">
                    <ChevronRight size={13} style={{ color: 'rgba(255,255,255,0.2)' }} />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </FlowNode>

        <FlowConnector />

        {/* Outcome */}
        <FlowNode color="#4ade80" bg="rgba(34,197,94,0.07)" border="rgba(34,197,94,0.2)"
          icon={CheckCircle} typeLabel="Success condition">
          <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            {detail.outcome}
          </p>
        </FlowNode>

      </div>
    </div>
  )
}

// ── Confirm modal (Publish / Archive / Delete) ────────────────────────────────
function ConfirmModal({ type, pbName, onConfirm, onCancel }) {
  const cfg = {
    publish: {
      icon: <Play size={18} />,
      iconBg: 'linear-gradient(135deg,#16a34a,#22c55e)',
      title: 'Publish Playbook',
      body: `"${pbName}" will become live and available for NBA execution. Active clients may be matched immediately.`,
      confirmLabel: 'Publish Now',
      confirmStyle: { background: 'linear-gradient(135deg,#16a34a,#22c55e)', color: '#fff' },
    },
    archive: {
      icon: <Archive size={18} />,
      iconBg: 'linear-gradient(135deg,#475569,#64748b)',
      title: 'Archive Playbook',
      body: `"${pbName}" will be archived and removed from active execution. It can be restored later from the archive.`,
      confirmLabel: 'Archive',
      confirmStyle: { background: 'rgba(100,116,139,0.2)', color: '#94a3b8', border: '1px solid rgba(100,116,139,0.35)' },
    },
    delete: {
      icon: <Trash2 size={18} />,
      iconBg: 'linear-gradient(135deg,#dc2626,#ef4444)',
      title: 'Delete Playbook',
      body: `"${pbName}" will be permanently deleted. This action cannot be undone. All versions and history will be lost.`,
      confirmLabel: 'Delete Permanently',
      confirmStyle: { background: 'linear-gradient(135deg,#dc2626,#ef4444)', color: '#fff' },
    },
  }[type]

  if (!cfg) return null

  return createPortal(
    <>
      <div className="fixed inset-0 z-[1000]" style={{ background: 'rgba(0,0,0,0.6)' }} onClick={onCancel} />
      <div className="fixed inset-0 z-[1001] flex items-center justify-center pointer-events-none">
        <div className="pointer-events-auto w-[420px] rounded-2xl overflow-hidden"
          style={{ background: 'var(--slideout-bg)', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 24px 64px rgba(0,0,0,0.6)' }}>

          {/* Header */}
          <div className="flex items-start justify-between px-6 pt-6 pb-4"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white"
                style={{ background: cfg.iconBg }}>
                {cfg.icon}
              </div>
              <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{cfg.title}</p>
            </div>
            <button className="btn-ghost p-1.5 rounded-lg" onClick={onCancel}><X size={14} /></button>
          </div>

          {/* Body */}
          <div className="px-6 py-5">
            {type === 'delete' && (
              <div className="flex items-start gap-2.5 px-3.5 py-3 rounded-xl mb-4"
                style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)' }}>
                <AlertTriangle size={13} style={{ color: '#f87171', marginTop: 1, flexShrink: 0 }} />
                <p className="text-[11px]" style={{ color: '#fca5a5' }}>
                  <strong>Destructive action.</strong> This cannot be undone.
                </p>
              </div>
            )}
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{cfg.body}</p>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 px-6 py-4"
            style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
            <button className="px-4 py-2 rounded-xl text-xs font-semibold transition-all hover:opacity-80"
              style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)', border: '1px solid rgba(255,255,255,0.1)' }}
              onClick={onCancel}>
              Cancel
            </button>
            <button className="px-4 py-2 rounded-xl text-xs font-semibold transition-all hover:brightness-110"
              style={cfg.confirmStyle}
              onClick={onConfirm}>
              {cfg.confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </>,
    document.body
  )
}

// ── Empty tab placeholder ─────────────────────────────────────────────────────
function TabPlaceholder({ icon: Icon, title, desc }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
        style={{ background: 'rgba(124,92,252,0.1)', border: '1px solid rgba(124,92,252,0.2)' }}>
        <Icon size={22} style={{ color: '#a78bfa' }} />
      </div>
      <div className="text-center max-w-xs">
        <p className="text-sm font-semibold mb-1.5" style={{ color: 'var(--text-primary)' }}>{title}</p>
        <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>{desc}</p>
      </div>
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function PlaybookDetail() {
  const navigate  = useNavigate()
  const { id }    = useParams()
  const [activeTab,       setActiveTab]       = useState('overview')
  const [overviewSubTab,  setOverviewSubTab]  = useState('what')
  const [confirmType,     setConfirmType]     = useState(null) // 'publish' | 'archive' | 'delete'

  const pb = PLAYBOOKS.find(p => p.id === id) || PLAYBOOKS[0]

  const status = STATUS_STYLE[pb.status] || STATUS_STYLE.Draft
  const stage  = STAGE_STYLE[pb.stage]  || STAGE_STYLE.Onboarding
  const trust  = TRUST_STYLE[pb.trustMode] || TRUST_STYLE.Draft

  const handleConfirm = () => {
    // Prototype: just close the modal
    setConfirmType(null)
  }

  // ── Overview sub-tab content ──
  const overviewSubContent = {
    what: <OverviewWhatTab pb={pb} />,
    activity: (
      <TabPlaceholder
        icon={Activity}
        title="Activity / Usage"
        desc="Execution stats, NBA selection rate, phase completion, and outcome tracking over time. Coming soon."
      />
    ),
  }

  // ── Top-level tab content ──
  const tabContent = {
    overview: (
      <div>
        {/* Sub-tab bar */}
        <div className="flex items-center gap-1 mb-6 pb-0"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          {OVERVIEW_SUBTABS.map(sub => {
            const SubIcon  = sub.icon
            const isActive = overviewSubTab === sub.id
            return (
              <button key={sub.id}
                onClick={() => setOverviewSubTab(sub.id)}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold transition-all relative"
                style={{ color: isActive ? '#a78bfa' : 'var(--text-muted)' }}>
                <SubIcon size={11} />
                {sub.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-px rounded-t-full"
                    style={{ background: 'linear-gradient(90deg,#7c5cfc,#3b82f6)' }} />
                )}
              </button>
            )
          })}
        </div>
        {/* Sub-tab content */}
        {overviewSubContent[overviewSubTab]}
      </div>
    ),
    configuration: (
      <TabPlaceholder
        icon={Settings}
        title="Configuration"
        desc="Full playbook configuration — moment, gates, objective, phases, and trust controls. Coming soon."
      />
    ),
    versions: (
      <TabPlaceholder
        icon={GitBranch}
        title="Versions"
        desc="Version history with diff comparison, rollback, and publish log across all playbook revisions. Coming soon."
      />
    ),
    history: (
      <TabPlaceholder
        icon={Clock}
        title="History"
        desc="Full audit trail of every edit, publish, gate change, and trust policy update made to this playbook. Coming soon."
      />
    ),
  }

  return (
    <div className="flex flex-col h-full" style={{ background: 'var(--bg-base)' }}>

      {/* ── Breadcrumbs ── */}
      <div className="px-8 pt-5 pb-0 shrink-0">
        <div className="flex items-center gap-1.5 text-[11px]" style={{ color: 'var(--text-muted)' }}>
          <span className="hover:opacity-80 cursor-pointer transition-opacity" onClick={() => navigate('/')}>Orchestration</span>
          <ChevronRight size={11} style={{ opacity: 0.4 }} />
          <span className="hover:opacity-80 cursor-pointer transition-opacity" onClick={() => navigate('/playbooks')}>Playbooks</span>
          <ChevronRight size={11} style={{ opacity: 0.4 }} />
          <span style={{ color: 'var(--text-secondary)' }}>{pb.name}</span>
        </div>
      </div>

      {/* ── Header ── */}
      <div className="px-8 pt-4 pb-0 shrink-0">
        <div className="flex items-start justify-between gap-6">

          {/* Left: back + title + meta */}
          <div className="flex items-start gap-3 min-w-0">
            <button
              onClick={() => navigate('/playbooks')}
              className="p-1.5 rounded-lg transition-all hover:brightness-110 shrink-0 mt-0.5"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)' }}>
              <ArrowLeft size={14} style={{ color: 'var(--text-muted)' }} />
            </button>

            <div className="min-w-0">
              {/* Title row */}
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-xl font-bold leading-tight" style={{ color: 'var(--text-primary)' }}>
                  {pb.name}
                </h1>

                {/* Status badge */}
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold shrink-0"
                  style={{ background: status.bg, color: status.color, border: `1px solid ${status.border}` }}>
                  <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: status.dot }} />
                  {pb.status}
                </span>

                {/* Version */}
                <span className="text-xs font-mono px-2 py-0.5 rounded"
                  style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  {pb.version}
                </span>
              </div>

              {/* Meta row */}
              <div className="flex items-center gap-3 mt-2 flex-wrap">
                {/* Owner */}
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold text-white shrink-0"
                    style={{ background: pb.ownerGradient }}>
                    {pb.ownerInitials}
                  </div>
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{pb.owner}</span>
                </div>

                <span style={{ color: 'rgba(255,255,255,0.15)' }}>·</span>

                {/* Updated */}
                <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                  <Clock size={11} />
                  Updated {pb.updatedAt}
                </div>

                <span style={{ color: 'rgba(255,255,255,0.15)' }}>·</span>

                {/* Stage */}
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full"
                  style={{ background: stage.bg, color: stage.color, border: `1px solid ${stage.border}` }}>
                  {pb.stage}
                </span>

                {/* Trust mode */}
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full"
                  style={{ background: trust.bg, color: trust.color, border: `1px solid rgba(255,255,255,0.1)` }}>
                  {trust.icon} {trust.label}
                </span>

                {/* Quick stats */}
                <span style={{ color: 'rgba(255,255,255,0.15)' }}>·</span>
                <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                  <Layers size={11} style={{ color: stage.color }} />
                  {pb.phases} phases
                </div>
                <span style={{ color: 'rgba(255,255,255,0.15)' }}>·</span>
                <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                  <Shield size={11} style={{ color: '#60a5fa' }} />
                  {pb.gates} gates
                </div>
              </div>
            </div>
          </div>

          {/* Right: action buttons */}
          <div className="flex items-center gap-1.5 shrink-0 mt-1">

            {/* Duplicate */}
            <ActionBtn icon={Copy} title="Duplicate playbook"
              onClick={() => {}} />

            {/* Publish — only when Draft */}
            {pb.status === 'Draft' && (
              <ActionBtn icon={Play} title="Publish playbook"
                accent={{ bg: 'rgba(34,197,94,0.12)', border: 'rgba(34,197,94,0.35)', color: '#4ade80' }}
                onClick={() => setConfirmType('publish')} />
            )}

            {/* Documentation */}
            <ActionBtn icon={BookOpen} title="View documentation"
              onClick={() => {}} />

            {/* Archive */}
            <ActionBtn icon={Archive} title="Archive playbook"
              onClick={() => setConfirmType('archive')} />

            {/* Delete */}
            <ActionBtn icon={Trash2} title="Delete playbook"
              accent={{ bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.3)', color: '#f87171' }}
              onClick={() => setConfirmType('delete')} />
          </div>
        </div>

        {/* ── Tab bar ── */}
        <div className="flex items-end gap-1 mt-5"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          {TABS.map(tab => {
            const Icon    = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold transition-all relative shrink-0"
                style={{ color: isActive ? '#a78bfa' : 'var(--text-muted)' }}>
                <Icon size={12} />
                {tab.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t-full"
                    style={{ background: 'linear-gradient(90deg,#7c5cfc,#3b82f6)' }} />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Tab content ── */}
      <div className="flex-1 overflow-y-auto px-8 py-6">
        {tabContent[activeTab]}
      </div>

      {/* ── Confirm modals ── */}
      {confirmType && (
        <ConfirmModal
          type={confirmType}
          pbName={pb.name}
          onConfirm={handleConfirm}
          onCancel={() => setConfirmType(null)}
        />
      )}

    </div>
  )
}

// ── Action button helper ──────────────────────────────────────────────────────
function ActionBtn({ icon: Icon, title, onClick, accent }) {
  const base = {
    background: accent?.bg    || 'rgba(255,255,255,0.05)',
    border:     `1px solid ${accent?.border || 'rgba(255,255,255,0.1)'}`,
    color:      accent?.color || 'var(--text-muted)',
  }
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:brightness-110"
      style={base}>
      <Icon size={14} />
    </button>
  )
}
