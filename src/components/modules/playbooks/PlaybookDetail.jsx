import React, { useState, useEffect } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { createPortal } from 'react-dom'
import {
  ArrowLeft, ChevronRight, ChevronDown, Copy, Play, BookOpen, Archive, Trash2, Check,
  Eye, Settings, GitBranch, Activity, Clock, CheckCircle,
  Zap, Shield, User, Layers, AlertTriangle, X, Flag,
  Sparkles, Target, Lock, Save, FileText,
  TrendingUp, BarChart2, Users, ThumbsUp, ThumbsDown, Timer, MousePointer2,
} from 'lucide-react'
import { BasicsStep, KnowledgeStep, MomentStep, GatesStep, ObjectiveStep, PhasesStep, TrustStep, INITIAL } from './PlaybookBuilder'

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

// ── Activity / Usage mock data ────────────────────────────────────────────────
const ACTIVITY_DATA = {
  'PB-001': {
    momentsTriggered: 342, momentsDelta: '+12% vs last week',  momentsDeltaUp: true,
    plansInstantiated: 287, plansMeta: '84% conversion rate',
    autoExecuted: 244,      autoMeta: '85% of total plans',
    approvalsRequired: 29,  approvalsMeta: '10% of total plans',
    successRate: 71,        successCount: 204,
    nbaSelectionRate: 83,   avgPlanDays: 18, accountsReached: 261,
    weeklyTrend: [28, 35, 42, 38, 48, 52, 45, 54],
    weekLabels: ['W1','W2','W3','W4','W5','W6','W7','W8'],
    blockers: [
      { label: 'Email opt-out detected',     count: 28 },
      { label: 'Hard gate not satisfied',    count: 15 },
      { label: 'Confidence below threshold', count: 12 },
      { label: 'Rep conflict detected',      count: 6  },
      { label: 'Account suppressed',         count: 3  },
    ],
    approvals: { approved: 24, rejected: 3, pending: 2 },
    phases: [
      { name: 'Welcome & Orientation',  rate: 100, count: 287 },
      { name: 'Product Setup',          rate: 87,  count: 250 },
      { name: 'First Value Milestone',  rate: 73,  count: 210 },
      { name: 'Expansion Signal',       rate: 61,  count: 175 },
    ],
  },
  'PB-002': {
    momentsTriggered: 198, momentsDelta: '+5% vs last week',  momentsDeltaUp: true,
    plansInstantiated: 156, plansMeta: '79% conversion rate',
    autoExecuted: 82,       autoMeta: '53% of total plans',
    approvalsRequired: 74,  approvalsMeta: '47% of total plans',
    successRate: 68,        successCount: 106,
    nbaSelectionRate: 77,   avgPlanDays: 34, accountsReached: 141,
    weeklyTrend: [18, 22, 25, 28, 21, 30, 26, 29],
    weekLabels: ['W1','W2','W3','W4','W5','W6','W7','W8'],
    blockers: [
      { label: 'Rep conflict detected',      count: 22 },
      { label: 'Consent not confirmed',      count: 18 },
      { label: 'Hard gate not satisfied',    count: 12 },
      { label: 'Duplicate sequence active',  count: 8  },
      { label: 'Pricing freeze in place',    count: 4  },
    ],
    approvals: { approved: 61, rejected: 9, pending: 4 },
    phases: [
      { name: 'Risk Assessment',     rate: 100, count: 156 },
      { name: 'Renewal Engagement',  rate: 79,  count: 123 },
      { name: 'Executive Alignment', rate: 58,  count: 90  },
    ],
  },
  'PB-003': {
    momentsTriggered: 124, momentsDelta: '-3% vs last week', momentsDeltaUp: false,
    plansInstantiated: 89,  plansMeta: '72% conversion rate',
    autoExecuted: 31,       autoMeta: '35% of total plans',
    approvalsRequired: 58,  approvalsMeta: '65% of total plans',
    successRate: 54,        successCount: 48,
    nbaSelectionRate: 62,   avgPlanDays: 28, accountsReached: 83,
    weeklyTrend: [10, 12, 14, 11, 15, 13, 16, 18],
    weekLabels: ['W1','W2','W3','W4','W5','W6','W7','W8'],
    blockers: [
      { label: 'Hard gate not satisfied',    count: 18 },
      { label: 'Suppression list match',     count: 12 },
      { label: 'Competing sequence active',  count: 9  },
      { label: 'Confidence below threshold', count: 7  },
      { label: 'Email opt-out detected',     count: 5  },
    ],
    approvals: { approved: 49, rejected: 7, pending: 2 },
    phases: [
      { name: 'Re-engagement Outreach', rate: 100, count: 89 },
      { name: 'Adoption Guidance',      rate: 67,  count: 60 },
    ],
  },
  'PB-004': {
    momentsTriggered: 267, momentsDelta: '+18% vs last week', momentsDeltaUp: true,
    plansInstantiated: 198, plansMeta: '74% conversion rate',
    autoExecuted: 189,      autoMeta: '95% of total plans',
    approvalsRequired: 9,   approvalsMeta: '5% of total plans',
    successRate: 62,        successCount: 123,
    nbaSelectionRate: 78,   avgPlanDays: 22, accountsReached: 176,
    weeklyTrend: [22, 28, 31, 35, 38, 32, 41, 44],
    weekLabels: ['W1','W2','W3','W4','W5','W6','W7','W8'],
    blockers: [
      { label: 'Pricing freeze in place',    count: 19 },
      { label: 'Duplicate sequence active',  count: 14 },
      { label: 'Hard gate not satisfied',    count: 11 },
      { label: 'Email opt-out detected',     count: 5  },
      { label: 'Confidence below threshold', count: 4  },
    ],
    approvals: { approved: 7, rejected: 1, pending: 1 },
    phases: [
      { name: 'Signal Detection',    rate: 100, count: 198 },
      { name: 'Opportunity Framing', rate: 81,  count: 160 },
      { name: 'Upsell Facilitation', rate: 63,  count: 125 },
    ],
  },
  'PB-005': {
    momentsTriggered: 89,  momentsDelta: '+8% vs last week', momentsDeltaUp: true,
    plansInstantiated: 71,  plansMeta: '80% conversion rate',
    autoExecuted: 12,       autoMeta: '17% of total plans',
    approvalsRequired: 59,  approvalsMeta: '83% of total plans',
    successRate: 78,        successCount: 55,
    nbaSelectionRate: 91,   avgPlanDays: 41, accountsReached: 67,
    weeklyTrend: [6, 8, 9, 11, 8, 12, 10, 15],
    weekLabels: ['W1','W2','W3','W4','W5','W6','W7','W8'],
    blockers: [
      { label: 'Hard gate not satisfied',   count: 9  },
      { label: 'Human review pending',      count: 6  },
      { label: 'Suppression list match',    count: 4  },
      { label: 'Legal hold check failed',   count: 3  },
      { label: 'Account already enrolled',  count: 2  },
    ],
    approvals: { approved: 49, rejected: 4, pending: 6 },
    phases: [
      { name: 'Immediate Alert',             rate: 100, count: 71 },
      { name: 'CSM Intervention',            rate: 90,  count: 64 },
      { name: 'Product Value Reinforcement', rate: 76,  count: 54 },
      { name: 'Executive Escalation',        rate: 55,  count: 39 },
      { name: 'Win-Back Offer',              rate: 41,  count: 29 },
    ],
  },
}

// ── Sparkline SVG ─────────────────────────────────────────────────────────────
function Sparkline({ values, color = '#a78bfa', pbId = '' }) {
  const W = 300; const H = 64
  const max = Math.max(...values); const min = Math.min(...values)
  const range = max - min || 1
  const toX = (i) => (i / (values.length - 1)) * W
  const toY = (v) => H - ((v - min) / range) * (H - 10) - 5
  const pts  = values.map((v, i) => `${toX(i).toFixed(1)},${toY(v).toFixed(1)}`).join(' ')
  const area = `M ${toX(0)},${toY(values[0])} ` +
    values.slice(1).map((v, i) => `L ${toX(i+1).toFixed(1)},${toY(v).toFixed(1)}`).join(' ') +
    ` L ${W},${H} L 0,${H} Z`
  const uid = `sg-${pbId}-${color.replace('#','')}`
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 64 }} preserveAspectRatio="none">
      <defs>
        <linearGradient id={uid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0.01" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${uid})`} />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" />
      {/* Last dot */}
      <circle cx={toX(values.length-1)} cy={toY(values[values.length-1])} r="3"
        fill={color} />
    </svg>
  )
}

// ── Activity/Usage tab ────────────────────────────────────────────────────────
function ActivityUsageTab({ pb }) {
  const d = ACTIVITY_DATA[pb.id] || ACTIVITY_DATA['PB-001']
  const maxBlock = d.blockers[0]?.count || 1
  const totalApprovals = d.approvals.approved + d.approvals.rejected + d.approvals.pending

  // Donut arc helper (success rate ring)
  const R = 28; const CX = 36; const CY = 36; const circ = 2 * Math.PI * R
  const successArc  = (d.successRate / 100) * circ
  const successGap  = circ - successArc

  return (
    <div className="space-y-5">

      {/* ── Row 1: 4 primary KPI cards ── */}
      <div>
        <p className="text-[10px] font-bold tracking-widest uppercase mb-3"
          style={{ color: 'var(--text-muted)' }}>Activity & Usage Metrics</p>
        <div className="grid grid-cols-4 gap-3">
          {[
            {
              label: 'Moments Triggered', value: d.momentsTriggered.toLocaleString(),
              meta: d.momentsDelta, metaColor: d.momentsDeltaUp ? '#4ade80' : '#f87171',
              icon: Zap, color: '#a78bfa', bg: 'rgba(124,92,252,0.1)', border: 'rgba(124,92,252,0.2)',
            },
            {
              label: 'Plans Instantiated', value: d.plansInstantiated.toLocaleString(),
              meta: d.plansMeta, metaColor: '#60a5fa',
              icon: Activity, color: '#60a5fa', bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.2)',
            },
            {
              label: 'Auto-Executed', value: d.autoExecuted.toLocaleString(),
              meta: d.autoMeta, metaColor: '#2dd4bf',
              icon: TrendingUp, color: '#2dd4bf', bg: 'rgba(20,184,166,0.1)', border: 'rgba(20,184,166,0.2)',
            },
            {
              label: 'Approvals Required', value: d.approvalsRequired.toLocaleString(),
              meta: d.approvalsMeta, metaColor: '#fbbf24',
              icon: CheckCircle, color: '#fbbf24', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.2)',
            },
          ].map(card => {
            const Icon = card.icon
            return (
              <div key={card.label} className="rounded-xl p-4"
                style={{ background: card.bg, border: `1px solid ${card.border}` }}>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[10px] font-semibold" style={{ color: 'var(--text-muted)' }}>{card.label}</p>
                  <Icon size={13} style={{ color: card.color, opacity: 0.7 }} />
                </div>
                <p className="text-2xl font-black" style={{ color: 'var(--text-primary)' }}>{card.value}</p>
                <p className="text-[10px] mt-1.5 font-medium" style={{ color: card.metaColor }}>{card.meta}</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Row 2: 3 additional KPI cards (the "3 more") ── */}
      <div className="grid grid-cols-3 gap-3">

        {/* Plan Success Rate — with mini donut */}
        <div className="rounded-xl p-4 flex items-center gap-4"
          style={{ background: 'rgba(34,197,94,0.07)', border: '1px solid rgba(34,197,94,0.2)' }}>
          <svg width={72} height={72} viewBox="0 0 72 72" className="shrink-0">
            <circle cx={CX} cy={CY} r={R} fill="none"
              stroke="rgba(255,255,255,0.07)" strokeWidth="6" />
            <circle cx={CX} cy={CY} r={R} fill="none"
              stroke="#4ade80" strokeWidth="6"
              strokeDasharray={`${successArc} ${successGap}`}
              strokeLinecap="round"
              transform={`rotate(-90 ${CX} ${CY})`} />
            <text x={CX} y={CY + 5} textAnchor="middle"
              style={{ fill: '#4ade80', fontSize: 13, fontWeight: 800 }}>
              {d.successRate}%
            </text>
          </svg>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold mb-1" style={{ color: '#4ade80' }}>Plan Success Rate</p>
            <p className="text-[11px] leading-snug" style={{ color: 'var(--text-muted)' }}>
              {d.successCount} plans reached the primary success event
            </p>
            <p className="text-[10px] mt-2" style={{ color: 'rgba(74,222,128,0.6)' }}>
              {100 - d.successRate}% exited without success
            </p>
          </div>
        </div>

        {/* NBA Selection Rate */}
        <div className="rounded-xl p-4"
          style={{ background: 'rgba(124,92,252,0.07)', border: '1px solid rgba(124,92,252,0.2)' }}>
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] font-semibold" style={{ color: 'var(--text-muted)' }}>NBA Selection Rate</p>
            <MousePointer2 size={13} style={{ color: '#a78bfa', opacity: 0.7 }} />
          </div>
          <p className="text-2xl font-black mb-1" style={{ color: 'var(--text-primary)' }}>{d.nbaSelectionRate}%</p>
          <p className="text-[10px] mb-3 font-medium" style={{ color: '#a78bfa' }}>
            Of eligible moments, NBA chose this playbook
          </p>
          {/* Mini bar */}
          <div className="rounded-full overflow-hidden" style={{ height: 5, background: 'rgba(255,255,255,0.07)' }}>
            <div className="h-full rounded-full"
              style={{ width: `${d.nbaSelectionRate}%`, background: 'linear-gradient(90deg,#7c5cfc,#a78bfa)' }} />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>0%</span>
            <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>100%</span>
          </div>
        </div>

        {/* Avg Plan Duration + Accounts Reached */}
        <div className="rounded-xl p-4 flex flex-col gap-4"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>Avg Plan Duration</p>
              <p className="text-2xl font-black" style={{ color: 'var(--text-primary)' }}>
                {d.avgPlanDays}
                <span className="text-sm font-semibold ml-1" style={{ color: 'var(--text-muted)' }}>days</span>
              </p>
            </div>
            <Timer size={13} style={{ color: 'var(--text-muted)', opacity: 0.6 }} />
          </div>
          <div className="h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>Accounts Reached</p>
              <p className="text-2xl font-black" style={{ color: 'var(--text-primary)' }}>{d.accountsReached}</p>
            </div>
            <Users size={13} style={{ color: 'var(--text-muted)', opacity: 0.6 }} />
          </div>
        </div>

      </div>

      {/* ── Row 3: Activity Trend + Phase Completion ── */}
      <div className="grid grid-cols-2 gap-3">

        {/* Activity Trend */}
        <div className="rounded-xl overflow-hidden"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="flex items-center justify-between px-5 py-3.5"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="flex items-center gap-2">
              <BarChart2 size={13} style={{ color: '#a78bfa' }} />
              <span className="text-xs font-bold" style={{ color: 'var(--text-secondary)' }}>Moments Triggered — Last 8 Weeks</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
              style={{ background: d.momentsDeltaUp ? 'rgba(74,222,128,0.1)' : 'rgba(248,113,113,0.1)', color: d.momentsDeltaUp ? '#4ade80' : '#f87171', border: d.momentsDeltaUp ? '1px solid rgba(74,222,128,0.25)' : '1px solid rgba(248,113,113,0.25)' }}>
              {d.momentsDelta}
            </span>
          </div>
          <div className="px-5 pt-4 pb-1">
            <Sparkline values={d.weeklyTrend} color="#a78bfa" pbId={pb.id} />
          </div>
          {/* X labels */}
          <div className="flex justify-between px-5 pb-3">
            {d.weekLabels.map(w => (
              <span key={w} className="text-[9px]" style={{ color: 'var(--text-muted)' }}>{w}</span>
            ))}
          </div>
        </div>

        {/* Phase Completion Funnel */}
        <div className="rounded-xl overflow-hidden"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="flex items-center gap-2 px-5 py-3.5"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <Layers size={13} style={{ color: '#4ade80' }} />
            <span className="text-xs font-bold" style={{ color: 'var(--text-secondary)' }}>Phase Completion Funnel</span>
          </div>
          <div className="px-5 py-4 space-y-3">
            {d.phases.map((phase, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0"
                      style={{ background: 'rgba(34,197,94,0.2)', color: '#4ade80' }}>{i + 1}</span>
                    <span className="text-[11px] font-semibold" style={{ color: 'var(--text-secondary)' }}>{phase.name}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] font-bold" style={{ color: '#4ade80' }}>{phase.rate}%</span>
                    <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{phase.count} plans</span>
                  </div>
                </div>
                <div className="rounded-full overflow-hidden" style={{ height: 5, background: 'rgba(255,255,255,0.07)' }}>
                  <div className="h-full rounded-full transition-all"
                    style={{
                      width: `${phase.rate}%`,
                      background: `rgba(74,222,128,${0.3 + (phase.rate / 100) * 0.7})`,
                    }} />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ── Row 4: Top Blocked Reasons + Approval Metrics ── */}
      <div className="grid grid-cols-2 gap-3">

        {/* Top Blocked Reasons */}
        <div className="rounded-xl overflow-hidden"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="flex items-center justify-between px-5 py-3.5"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="flex items-center gap-2">
              <AlertTriangle size={13} style={{ color: '#f87171' }} />
              <span className="text-xs font-bold" style={{ color: 'var(--text-secondary)' }}>Top Blocked Reasons</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
              style={{ background: 'rgba(248,113,113,0.1)', color: '#f87171', border: '1px solid rgba(248,113,113,0.25)' }}>
              {d.blockers.reduce((s, b) => s + b.count, 0)} total blocks
            </span>
          </div>
          <div className="px-5 py-4 space-y-4">
            {d.blockers.map((b, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)' }}>
                      <X size={8} style={{ color: '#f87171' }} />
                    </div>
                    <span className="text-[11px] font-medium" style={{ color: 'var(--text-secondary)' }}>{b.label}</span>
                  </div>
                  <span className="text-[11px] font-bold shrink-0 ml-3" style={{ color: 'var(--text-primary)' }}>{b.count}</span>
                </div>
                <div className="rounded-full overflow-hidden" style={{ height: 4, background: 'rgba(255,255,255,0.07)' }}>
                  <div className="h-full rounded-full"
                    style={{ width: `${(b.count / maxBlock) * 100}%`, background: 'linear-gradient(90deg,#ef4444,#f87171)' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Approval Metrics */}
        <div className="rounded-xl overflow-hidden"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="flex items-center gap-2 px-5 py-3.5"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <CheckCircle size={13} style={{ color: '#fbbf24' }} />
            <span className="text-xs font-bold" style={{ color: 'var(--text-secondary)' }}>Approval Metrics</span>
          </div>
          <div className="px-5 py-4">

            {/* Big 3-col row */}
            <div className="grid grid-cols-3 gap-3 mb-5">
              {[
                { label: 'Approved', value: d.approvals.approved, icon: ThumbsUp,   color: '#4ade80', bg: 'rgba(34,197,94,0.08)',   border: 'rgba(34,197,94,0.2)'   },
                { label: 'Rejected', value: d.approvals.rejected, icon: ThumbsDown, color: '#f87171', bg: 'rgba(239,68,68,0.08)',   border: 'rgba(239,68,68,0.2)'   },
                { label: 'Pending',  value: d.approvals.pending,  icon: Clock,      color: '#fbbf24', bg: 'rgba(245,158,11,0.08)',  border: 'rgba(245,158,11,0.2)'  },
              ].map(item => {
                const Icon = item.icon
                return (
                  <div key={item.label} className="rounded-xl p-3 text-center"
                    style={{ background: item.bg, border: `1px solid ${item.border}` }}>
                    <Icon size={15} style={{ color: item.color, margin: '0 auto 6px' }} />
                    <p className="text-[10px] font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>{item.label}</p>
                    <p className="text-xl font-black" style={{ color: item.color }}>{item.value}</p>
                  </div>
                )
              })}
            </div>

            {/* Stacked bar breakdown */}
            <p className="text-[10px] font-semibold mb-2" style={{ color: 'var(--text-muted)' }}>
              Distribution of {totalApprovals} approval requests
            </p>
            <div className="flex rounded-full overflow-hidden" style={{ height: 8 }}>
              <div style={{ width: `${(d.approvals.approved / totalApprovals) * 100}%`, background: '#22c55e' }} />
              <div style={{ width: `${(d.approvals.rejected / totalApprovals) * 100}%`, background: '#ef4444', marginLeft: 2 }} />
              <div style={{ width: `${(d.approvals.pending  / totalApprovals) * 100}%`, background: '#f59e0b', marginLeft: 2 }} />
            </div>
            <div className="flex items-center gap-4 mt-2">
              {[
                { label: 'Approved', pct: Math.round((d.approvals.approved / totalApprovals) * 100), color: '#4ade80' },
                { label: 'Rejected', pct: Math.round((d.approvals.rejected / totalApprovals) * 100), color: '#f87171' },
                { label: 'Pending',  pct: Math.round((d.approvals.pending  / totalApprovals) * 100), color: '#fbbf24' },
              ].map(l => (
                <div key={l.label} className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ background: l.color }} />
                  <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{l.label} </span>
                  <span className="text-[10px] font-bold" style={{ color: l.color }}>{l.pct}%</span>
                </div>
              ))}
            </div>

            {/* Avg approval time note */}
            <div className="mt-4 flex items-center gap-2 px-3 py-2.5 rounded-lg"
              style={{ background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.18)' }}>
              <Clock size={11} style={{ color: '#fbbf24', flexShrink: 0 }} />
              <p className="text-[10px]" style={{ color: '#fcd34d' }}>
                Avg approval resolution time: <strong>4.2 hours</strong>
              </p>
            </div>

          </div>
        </div>

      </div>

    </div>
  )
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
    <div className="space-y-5">

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

      {/* ── Playbook Flow — two-column layout ── */}
      <div>
        <p className="text-[10px] font-bold tracking-widest uppercase mb-3"
          style={{ color: 'var(--text-muted)' }}>Playbook Flow</p>

        <div className="flex gap-4 items-start">

          {/* ── Left column (fixed 360px): Objective → Trigger → Trust ── */}
          <div className="flex flex-col shrink-0" style={{ width: 360 }}>

            <FlowNode color="#a78bfa" bg="rgba(124,92,252,0.08)" border="rgba(124,92,252,0.2)"
              icon={Target} typeLabel="Objective">
              <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                {detail.objective}
              </p>
            </FlowNode>

            <FlowConnector />

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

            <FlowNode color="#2dd4bf" bg="rgba(20,184,166,0.07)" border="rgba(20,184,166,0.2)"
              icon={Lock} typeLabel="Applies trust controls">
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Mode',                 val: detail.trust.mode,               color: trust.color },
                  { label: 'Confidence threshold', val: `${detail.trust.confidence}%`,   color: '#2dd4bf'   },
                  { label: 'Escalates to',         val: detail.trust.escalation,         color: 'var(--text-secondary)' },
                ].map(f => (
                  <div key={f.label}>
                    <p className="text-[10px] mb-0.5" style={{ color: 'var(--text-muted)' }}>{f.label}</p>
                    <p className="text-xs font-bold" style={{ color: f.color }}>{f.val}</p>
                  </div>
                ))}
              </div>
            </FlowNode>

          </div>

          {/* ── Center arrow divider ── */}
          <div className="flex flex-col items-center shrink-0 self-stretch justify-center gap-0.5" style={{ paddingTop: 52 }}>
            <div style={{ width: 28, height: 2, background: 'rgba(255,255,255,0.08)', borderRadius: 1 }} />
            <ChevronRight size={14} style={{ color: 'rgba(255,255,255,0.18)', marginLeft: -8 }} />
          </div>

          {/* ── Right column (flex-1): Gates + Phases + Outcome ── */}
          <div className="flex-1 min-w-0 flex flex-col gap-4">

            {/* Hard Gates — two-column checklist */}
            <FlowNode color="#fbbf24" bg="rgba(245,158,11,0.07)" border="rgba(245,158,11,0.2)"
              icon={Shield} typeLabel="Requires all hard gates to pass">
              <div className="grid grid-cols-2 gap-x-6 gap-y-1.5">
                {detail.gates.map((g, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle size={12} style={{ color: '#4ade80', marginTop: 1.5, flexShrink: 0 }} />
                    <span className="text-[12px]" style={{ color: 'var(--text-secondary)' }}>{g}</span>
                  </div>
                ))}
              </div>
            </FlowNode>

            {/* Phases — CSS grid, up to 3 cols */}
            <FlowNode color="#4ade80" bg="rgba(34,197,94,0.07)" border="rgba(34,197,94,0.2)"
              icon={Layers} typeLabel={`Executes through ${detail.phases.length} sequential phases`}>
              <div className="grid gap-3"
                style={{ gridTemplateColumns: `repeat(${Math.min(detail.phases.length, 3)}, 1fr)` }}>
                {detail.phases.map((phase, i) => (
                  <div key={i} className="rounded-lg p-3"
                    style={{ background: 'rgba(34,197,94,0.07)', border: '1px solid rgba(34,197,94,0.18)' }}>
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0"
                        style={{ background: 'rgba(34,197,94,0.2)', color: '#4ade80' }}>{i + 1}</span>
                      <span className="text-[11px] font-semibold leading-tight" style={{ color: '#4ade80' }}>{phase.name}</span>
                    </div>
                    <p className="text-[10px] leading-snug" style={{ color: 'var(--text-muted)' }}>{phase.desc}</p>
                  </div>
                ))}
              </div>
            </FlowNode>

            {/* Success condition */}
            <FlowNode color="#4ade80" bg="rgba(34,197,94,0.07)" border="rgba(34,197,94,0.2)"
              icon={CheckCircle} typeLabel="Success condition">
              <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                {detail.outcome}
              </p>
            </FlowNode>

          </div>
        </div>
      </div>
    </div>
  )
}

// ── Configuration tab data helpers ───────────────────────────────────────────
const MOMENT_MAP = {
  'Customer Created':        'Customer Signup Completed',
  '90 Days to Renewal':      'Renewal Window Opening',
  'Low Engagement Detected': 'Inactivity Period Detected',
  'Usage Threshold Met':     'Usage Threshold Crossed',
  'Risk Score Change':       'Inactivity Period Detected',
}
const CFG_TRUST_PRESET_MAP = { Auto: 'aggressive', Approval: 'conservative', Draft: 'balanced' }
const CFG_TRUST_MODE_MAP   = { Auto: 'auto-send',  Approval: 'approval',     Draft: 'draft'    }

const PB_CFG_OVERRIDES = {
  'PB-001': { goalType: 'Start Two-Way Conversation', primarySuccessEvent: 'Conversation started',  priority: 'high',     exitConditions: ['time-limit','opted-out'],                         failureOutcome: 'escalate', kpiAssociation: 'Customer Retention',  gate_consent_channels: ['Email','SMS'],               gate_status_statuses: ['Churned'],       gate_compliance_checks: [] },
  'PB-002': { goalType: 'Book Appointment',           primarySuccessEvent: 'Meeting confirmed',      priority: 'critical', exitConditions: ['time-limit','max-attempts','opted-out'],          failureOutcome: 'escalate', kpiAssociation: 'Customer Retention',  gate_consent_channels: ['Email'],                     gate_status_statuses: [],                gate_compliance_checks: ['Respect Do Not Call (DNC) Registry','Check GDPR Opt-Out Status'] },
  'PB-003': { goalType: 'Re-engage Lead',             primarySuccessEvent: 'Lead re-engaged',        priority: 'standard', exitConditions: ['max-attempts','opted-out'],                        failureOutcome: 'notify',   kpiAssociation: 'Customer Retention',  gate_consent_channels: ['Email','SMS'],               gate_status_statuses: [],                gate_compliance_checks: [] },
  'PB-004': { goalType: 'Book Appointment',           primarySuccessEvent: 'Demo scheduled',         priority: 'high',     exitConditions: ['time-limit','negative-response'],                  failureOutcome: 'retry',    kpiAssociation: 'Revenue Per Customer', gate_consent_channels: ['Email','SMS','Phone'],        gate_status_statuses: [],                gate_compliance_checks: [] },
  'PB-005': { goalType: 'Start Two-Way Conversation', primarySuccessEvent: 'Engagement initiated',   priority: 'critical', exitConditions: ['time-limit','max-attempts','opted-out','negative-response'], failureOutcome: 'escalate', kpiAssociation: 'Customer Retention',  gate_consent_channels: ['Email','SMS','Phone'], gate_status_statuses: ['Legal Hold'], gate_compliance_checks: ['Respect Do Not Call (DNC) Registry','Require TCPA Compliance for SMS/Calls','Check GDPR Opt-Out Status'] },
}

function buildConfigData(pb, detail) {
  const ov  = PB_CFG_OVERRIDES[pb.id] || {}
  const iconOrder = ['urgent','followup','nurture','reengagement','custom']
  const durOrder  = [3, 7, 14, 21, 30]
  const attOrder  = [3, 4, 5, 3, 2]

  const formPhases = detail.phases.map((p, i) => ({
    id: 1000 + i,
    name: p.name,
    icon: iconOrder[i] || 'custom',
    goal: p.desc,
    duration: String(durOrder[i] || 7),
    durationUnit: 'Days',
    maxAttempts: String(attOrder[i] || 3),
    channels: ['email', 'sms'],
    notes: '',
  }))

  const customGates = detail.gates.map((g, i) => ({
    id: 2000 + i,
    name: `Gate ${i + 1}`,
    description: g,
    ifNotMet: 'Suppress Playbook',
  }))

  return {
    ...INITIAL,
    // Basics
    name:          pb.name,
    description:   pb.description,
    tenantScope:   'global',
    department:    pb.department,
    owner:         pb.owner,
    priority:      ov.priority || 'standard',
    tags:          [pb.stage],
    // Moment
    primaryMoment:  MOMENT_MAP[pb.moment] || 'Feature Adoption Event',
    eventSource:    detail.moment.sources,
    businessMeaning: `This playbook becomes eligible when "${detail.moment.label}" is detected. ${detail.objective}`,
    // Gates
    gate_consent_channels:  ov.gate_consent_channels  || ['Email'],
    gate_consent_ifNotMet:  'Skip Channel Only',
    gate_status_statuses:   ov.gate_status_statuses   || [],
    gate_compliance_checks: ov.gate_compliance_checks || [],
    gate_custom:            customGates,
    // Objective
    goalType:             ov.goalType             || 'Book Appointment',
    primarySuccessEvent:  ov.primarySuccessEvent  || '',
    exitConditions:       ov.exitConditions       || ['time-limit'],
    failureOutcome:       ov.failureOutcome       || 'archive',
    kpiAssociation:       ov.kpiAssociation       || '',
    strategyNotes:        detail.objective,
    // Phases
    phases: formPhases,
    // Trust
    trustPreset:          CFG_TRUST_PRESET_MAP[pb.trustMode] || 'balanced',
    trustMode:            CFG_TRUST_MODE_MAP[pb.trustMode]   || 'draft',
    confidenceThreshold:  detail.trust.confidence,
    escalationPath:       detail.trust.escalation,
    requireApprovalBelow: pb.trustMode !== 'Auto',
  }
}

// ── Configuration section header ──────────────────────────────────────────────
function CfgSectionHeader({ sec }) {
  const Icon = sec.icon
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: sec.iconBg }}>
        <Icon size={18} color="#fff" />
      </div>
      <div>
        <h2 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>{sec.label}</h2>
        <p className="text-[11px] mt-0.5 leading-snug" style={{ color: 'var(--text-muted)', maxWidth: 480 }}>{sec.desc}</p>
      </div>
    </div>
  )
}

// ── Version history data ──────────────────────────────────────────────────────
const VERSION_HISTORY = {
  'PB-001': [
    { version: 'v2.3', date: 'Apr 18, 2026', author: 'Sarah Chen',      authorInitials: 'SC', authorGradient: 'linear-gradient(135deg,#a78bfa,#60a5fa)', message: 'Added executive touchpoint phase and refined trust thresholds', current: true  },
    { version: 'v2.2', date: 'Apr 9, 2026',  author: 'Sarah Chen',      authorInitials: 'SC', authorGradient: 'linear-gradient(135deg,#a78bfa,#60a5fa)', message: 'Updated NBA confidence threshold from 70% to 75%',            current: false },
    { version: 'v2.1', date: 'Mar 28, 2026', author: 'Michael Torres',  authorInitials: 'MT', authorGradient: 'linear-gradient(135deg,#f59e0b,#ef4444)',  message: 'Fixed gate condition for email opt-in validation',            current: false },
    { version: 'v2.0', date: 'Mar 16, 2026', author: 'Sarah Chen',      authorInitials: 'SC', authorGradient: 'linear-gradient(135deg,#a78bfa,#60a5fa)', message: 'Major refactor: moved to 4-phase structure, added expansion signal phase', current: false },
    { version: 'v1.0', date: 'Feb 28, 2026', author: 'Sarah Chen',      authorInitials: 'SC', authorGradient: 'linear-gradient(135deg,#a78bfa,#60a5fa)', message: 'Initial production release',                                 current: false },
  ],
  'PB-002': [
    { version: 'v1.8', date: 'Apr 16, 2026', author: 'Michael Torres',  authorInitials: 'MT', authorGradient: 'linear-gradient(135deg,#f59e0b,#ef4444)',  message: 'Added rep conflict detection gate and tightened renewal window to 90 days', current: true  },
    { version: 'v1.7', date: 'Apr 5, 2026',  author: 'Michael Torres',  authorInitials: 'MT', authorGradient: 'linear-gradient(135deg,#f59e0b,#ef4444)',  message: 'Updated approval workflow to include Revenue Manager sign-off', current: false },
    { version: 'v1.6', date: 'Mar 20, 2026', author: 'Sarah Chen',      authorInitials: 'SC', authorGradient: 'linear-gradient(135deg,#a78bfa,#60a5fa)', message: 'Updated approval requirements for trial extensions',           current: false },
    { version: 'v1.0', date: 'Feb 10, 2026', author: 'Michael Torres',  authorInitials: 'MT', authorGradient: 'linear-gradient(135deg,#f59e0b,#ef4444)',  message: 'Initial production release',                                 current: false },
  ],
  'PB-003': [
    { version: 'v0.4', date: 'Apr 20, 2026', author: 'Emily Rodriguez', authorInitials: 'ER', authorGradient: 'linear-gradient(135deg,#4ade80,#22d3ee)',  message: 'Adjusted engagement threshold from 7 to 14 days before triggering', current: true  },
    { version: 'v0.3', date: 'Apr 12, 2026', author: 'Emily Rodriguez', authorInitials: 'ER', authorGradient: 'linear-gradient(135deg,#4ade80,#22d3ee)',  message: 'Added in-app nudge channel alongside email sequence',         current: false },
    { version: 'v0.2', date: 'Apr 1, 2026',  author: 'Emily Rodriguez', authorInitials: 'ER', authorGradient: 'linear-gradient(135deg,#4ade80,#22d3ee)',  message: 'First draft with CSM-assisted adoption guidance phase',       current: false },
  ],
  'PB-004': [
    { version: 'v3.1', date: 'Apr 18, 2026', author: 'David Park',      authorInitials: 'DP', authorGradient: 'linear-gradient(135deg,#2dd4bf,#60a5fa)', message: 'Lowered auto-execute confidence to 60% to increase reach on warm accounts', current: true  },
    { version: 'v3.0', date: 'Apr 7, 2026',  author: 'David Park',      authorInitials: 'DP', authorGradient: 'linear-gradient(135deg,#2dd4bf,#60a5fa)', message: 'Added "Opportunity Framing" phase with NBA-generated messaging', current: false },
    { version: 'v2.1', date: 'Mar 25, 2026', author: 'Sarah Chen',      authorInitials: 'SC', authorGradient: 'linear-gradient(135deg,#a78bfa,#60a5fa)', message: 'Excluded accounts in active pricing negotiation via new gate', current: false },
    { version: 'v2.0', date: 'Mar 12, 2026', author: 'David Park',      authorInitials: 'DP', authorGradient: 'linear-gradient(135deg,#2dd4bf,#60a5fa)', message: 'Restructured to 3-phase model and added seat utilization trigger', current: false },
    { version: 'v1.0', date: 'Jan 30, 2026', author: 'David Park',      authorInitials: 'DP', authorGradient: 'linear-gradient(135deg,#2dd4bf,#60a5fa)', message: 'Initial production release',                                 current: false },
  ],
  'PB-005': [
    { version: 'v2.0', date: 'Apr 14, 2026', author: 'Sarah Chen',      authorInitials: 'SC', authorGradient: 'linear-gradient(135deg,#a78bfa,#60a5fa)', message: 'Added executive escalation phase and legal hold compliance gate', current: true  },
    { version: 'v1.2', date: 'Apr 2, 2026',  author: 'Sarah Chen',      authorInitials: 'SC', authorGradient: 'linear-gradient(135deg,#a78bfa,#60a5fa)', message: 'Expanded win-back offer options: discount, feature unlock, SLA upgrade', current: false },
    { version: 'v1.1', date: 'Mar 18, 2026', author: 'Michael Torres',  authorInitials: 'MT', authorGradient: 'linear-gradient(135deg,#f59e0b,#ef4444)',  message: 'Tightened approval gates — all 5 hard gates must pass before execution', current: false },
    { version: 'v1.0', date: 'Mar 1, 2026',  author: 'Sarah Chen',      authorInitials: 'SC', authorGradient: 'linear-gradient(135deg,#a78bfa,#60a5fa)', message: 'Initial production release',                                 current: false },
  ],
}

// ── Versions tab ──────────────────────────────────────────────────────────────
function VersionsTab({ pb }) {
  const versions = VERSION_HISTORY[pb.id] || VERSION_HISTORY['PB-001']
  const [restoring, setRestoring] = useState(null)
  const [restored,  setRestored]  = useState(null)

  const handleRestore = (v) => {
    setRestoring(v.version)
    setTimeout(() => {
      setRestoring(null)
      setRestored(v.version)
      setTimeout(() => setRestored(null), 2500)
    }, 900)
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-2">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>Version History</h2>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
            {versions.length} saved versions · current is <span className="font-mono" style={{ color: 'var(--text-secondary)' }}>{versions[0]?.version}</span>
          </p>
        </div>
        {/* timeline dot connector hint */}
        <div className="flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-lg"
          style={{ background: 'rgba(124,92,252,0.08)', border: '1px solid rgba(124,92,252,0.18)', color: '#a78bfa' }}>
          <GitBranch size={11} />
          <span>Auto-saved on publish</span>
        </div>
      </div>

      {/* Version cards */}
      <div className="relative">
        {/* Vertical timeline line */}
        <div className="absolute left-[27px] top-10 bottom-10 w-px"
          style={{ background: 'linear-gradient(to bottom, rgba(124,92,252,0.4), rgba(124,92,252,0.08))' }} />

        <div className="flex flex-col gap-3">
          {versions.map((v, idx) => {
            const isRestoring = restoring === v.version
            const isRestored  = restored  === v.version
            return (
              <div key={v.version} className="flex items-start gap-4">
                {/* Timeline icon */}
                <div className="relative shrink-0 z-10 w-[56px] flex flex-col items-center">
                  <div className="w-[30px] h-[30px] rounded-xl flex items-center justify-center shrink-0 mt-2"
                    style={{
                      background: v.current
                        ? 'linear-gradient(135deg,#7c5cfc,#3b82f6)'
                        : 'rgba(255,255,255,0.05)',
                      border: v.current
                        ? 'none'
                        : '1px solid rgba(255,255,255,0.1)',
                      boxShadow: v.current ? '0 0 16px rgba(124,92,252,0.4)' : 'none',
                    }}>
                    <GitBranch size={13} style={{ color: v.current ? '#fff' : 'var(--text-muted)' }} />
                  </div>
                </div>

                {/* Card */}
                <div className="flex-1 rounded-xl px-5 py-4 transition-all"
                  style={{
                    background: v.current
                      ? 'rgba(124,92,252,0.07)'
                      : 'rgba(255,255,255,0.03)',
                    border: v.current
                      ? '1px solid rgba(124,92,252,0.25)'
                      : '1px solid rgba(255,255,255,0.07)',
                  }}>
                  <div className="flex items-start justify-between gap-4">
                    {/* Left: version + meta */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="font-mono text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                          {v.version}
                        </span>
                        {v.current && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold"
                            style={{ background: 'rgba(124,92,252,0.18)', color: '#a78bfa', border: '1px solid rgba(124,92,252,0.3)' }}>
                            <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#a78bfa' }} />
                            Current
                          </span>
                        )}
                        {isRestored && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold"
                            style={{ background: 'rgba(34,197,94,0.12)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.25)' }}>
                            <CheckCircle size={9} /> Restored
                          </span>
                        )}
                      </div>

                      {/* Author + date row */}
                      <div className="flex items-center gap-2 mt-1.5">
                        <div className="w-4 h-4 rounded-full flex items-center justify-center text-[7px] font-bold text-white shrink-0"
                          style={{ background: v.authorGradient }}>
                          {v.authorInitials}
                        </div>
                        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{v.author}</span>
                        <span style={{ color: 'rgba(255,255,255,0.15)' }}>·</span>
                        <Clock size={10} style={{ color: 'var(--text-muted)', opacity: 0.6 }} />
                        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{v.date}</span>
                      </div>

                      {/* Commit message */}
                      <p className="text-sm mt-2.5 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                        {v.message}
                      </p>
                    </div>

                    {/* Right: restore button */}
                    {!v.current && (
                      <button
                        onClick={() => handleRestore(v)}
                        disabled={!!restoring}
                        className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:brightness-110 disabled:opacity-50"
                        style={{
                          background: isRestoring ? 'rgba(124,92,252,0.15)' : 'rgba(255,255,255,0.06)',
                          border: isRestoring ? '1px solid rgba(124,92,252,0.3)' : '1px solid rgba(255,255,255,0.1)',
                          color: isRestoring ? '#a78bfa' : 'var(--text-secondary)',
                        }}>
                        {isRestoring ? (
                          <>
                            <svg className="animate-spin" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <path d="M21 12a9 9 0 11-6.219-8.56" />
                            </svg>
                            Restoring…
                          </>
                        ) : (
                          <>
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                              <path d="M3 3v5h5" />
                            </svg>
                            Restore
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ── History tab data ──────────────────────────────────────────────────────────
const HISTORY_ACTORS = {
  SC: { name: 'Sarah Chen',      initials: 'SC', gradient: 'linear-gradient(135deg,#a78bfa,#60a5fa)' },
  MT: { name: 'Michael Torres',  initials: 'MT', gradient: 'linear-gradient(135deg,#f59e0b,#ef4444)' },
  ER: { name: 'Emily Rodriguez', initials: 'ER', gradient: 'linear-gradient(135deg,#4ade80,#22d3ee)' },
  DP: { name: 'David Park',      initials: 'DP', gradient: 'linear-gradient(135deg,#2dd4bf,#60a5fa)' },
  JL: { name: 'Jordan Lee',      initials: 'JL', gradient: 'linear-gradient(135deg,#f472b6,#a78bfa)' },
}

const HISTORY_TYPES = {
  publish:   { color: '#4ade80', bg: 'rgba(34,197,94,0.1)',   Icon: CheckCircle, label: 'Published'    },
  config:    { color: '#60a5fa', bg: 'rgba(59,130,246,0.1)',  Icon: FileText,    label: 'Configuration' },
  trust:     { color: '#a78bfa', bg: 'rgba(124,92,252,0.1)', Icon: Zap,          label: 'Trust & NBA'  },
  gate:      { color: '#2dd4bf', bg: 'rgba(20,184,166,0.1)', Icon: Shield,       label: 'Gates'        },
  phase:     { color: '#38bdf8', bg: 'rgba(14,165,233,0.1)', Icon: Layers,       label: 'Phases'       },
  moment:    { color: '#fbbf24', bg: 'rgba(245,158,11,0.1)', Icon: Sparkles,     label: 'Moment'       },
  objective: { color: '#fb923c', bg: 'rgba(249,115,22,0.1)', Icon: Target,       label: 'Objective'    },
  restore:   { color: '#f472b6', bg: 'rgba(236,72,153,0.1)', Icon: GitBranch,    label: 'Restore'      },
}

const PLAYBOOK_HISTORY = {
  'PB-001': [
    { id:1,  type:'trust',   actor:'MT', action:'Updated NBA confidence threshold',      detail:{ from:'70%', to:'75%' },                      ts:'Apr 21, 2026 · 10:32 AM', rel:'2 hours ago',   group:'Today' },
    { id:2,  type:'config',  actor:'SC', action:'Changed escalation contact',            detail:{ from:'Team Lead', to:'Assigned CSM' },        ts:'Apr 21, 2026 · 8:14 AM',  rel:'5 hours ago',   group:'Today' },
    { id:3,  type:'publish', actor:'SC', action:'Published playbook as v2.3',            detail:null,                                           ts:'Apr 18, 2026 · 2:14 PM',  rel:'3 days ago',    group:'Apr 18, 2026' },
    { id:4,  type:'phase',   actor:'SC', action:'Added phase "Expansion Signal"',         detail:null,                                           ts:'Apr 18, 2026 · 1:58 PM',  rel:'3 days ago',    group:'Apr 18, 2026' },
    { id:5,  type:'gate',    actor:'SC', action:'Updated consent gate',                  detail:{ from:'Email only', to:'Email + SMS' },         ts:'Apr 18, 2026 · 1:45 PM',  rel:'3 days ago',    group:'Apr 18, 2026' },
    { id:6,  type:'trust',   actor:'SC', action:'Changed trust mode',                    detail:{ from:'Approval', to:'Auto-Execute' },          ts:'Apr 18, 2026 · 1:20 PM',  rel:'3 days ago',    group:'Apr 18, 2026' },
    { id:7,  type:'publish', actor:'SC', action:'Published playbook as v2.2',            detail:null,                                           ts:'Apr 9, 2026 · 11:05 AM',  rel:'12 days ago',   group:'Apr 9, 2026' },
    { id:8,  type:'phase',   actor:'MT', action:'Edited "Product Setup" phase goal',     detail:'Updated milestone criteria for activation',    ts:'Apr 9, 2026 · 10:44 AM',  rel:'12 days ago',   group:'Apr 9, 2026' },
    { id:9,  type:'publish', actor:'MT', action:'Published playbook as v2.1',            detail:null,                                           ts:'Mar 28, 2026 · 3:22 PM',  rel:'24 days ago',   group:'Mar 28, 2026' },
    { id:10, type:'gate',    actor:'MT', action:'Fixed email opt-in validation gate',    detail:'Resolved incorrect field binding',             ts:'Mar 28, 2026 · 3:10 PM',  rel:'24 days ago',   group:'Mar 28, 2026' },
    { id:11, type:'publish', actor:'SC', action:'Published playbook as v2.0',            detail:null,                                           ts:'Mar 16, 2026 · 9:30 AM',  rel:'36 days ago',   group:'Mar 16, 2026' },
    { id:12, type:'phase',   actor:'SC', action:'Restructured to 4-phase execution flow', detail:'Added "First Value Milestone", removed "Follow-Up"', ts:'Mar 16, 2026 · 9:15 AM', rel:'36 days ago', group:'Mar 16, 2026' },
    { id:13, type:'publish', actor:'SC', action:'Published playbook as v1.0',            detail:'Initial production release',                  ts:'Feb 28, 2026 · 10:00 AM', rel:'52 days ago',   group:'Feb 28, 2026' },
    { id:14, type:'config',  actor:'SC', action:'Created playbook',                      detail:null,                                           ts:'Feb 27, 2026 · 4:45 PM',  rel:'53 days ago',   group:'Feb 27, 2026' },
  ],
  'PB-002': [
    { id:1,  type:'trust',     actor:'MT', action:'Increased NBA confidence threshold',  detail:{ from:'80%', to:'85%' },                      ts:'Apr 16, 2026 · 3:55 PM',  rel:'5 days ago',    group:'Apr 16, 2026' },
    { id:2,  type:'publish',   actor:'MT', action:'Published playbook as v1.8',          detail:null,                                           ts:'Apr 16, 2026 · 3:40 PM',  rel:'5 days ago',    group:'Apr 16, 2026' },
    { id:3,  type:'gate',      actor:'MT', action:'Added gate: rep conflict detection',  detail:null,                                           ts:'Apr 16, 2026 · 3:20 PM',  rel:'5 days ago',    group:'Apr 16, 2026' },
    { id:4,  type:'config',    actor:'MT', action:'Updated renewal trigger window',       detail:{ from:'60 days', to:'90 days' },               ts:'Apr 16, 2026 · 2:58 PM',  rel:'5 days ago',    group:'Apr 16, 2026' },
    { id:5,  type:'publish',   actor:'MT', action:'Published playbook as v1.7',          detail:null,                                           ts:'Apr 5, 2026 · 11:22 AM',  rel:'16 days ago',   group:'Apr 5, 2026' },
    { id:6,  type:'trust',     actor:'SC', action:'Added Revenue Manager to approval chain', detail:null,                                       ts:'Apr 5, 2026 · 11:10 AM',  rel:'16 days ago',   group:'Apr 5, 2026' },
    { id:7,  type:'objective', actor:'MT', action:'Updated primary success event',        detail:{ from:'Demo scheduled', to:'Meeting confirmed' }, ts:'Apr 5, 2026 · 10:45 AM', rel:'16 days ago', group:'Apr 5, 2026' },
    { id:8,  type:'publish',   actor:'SC', action:'Published playbook as v1.6',          detail:null,                                           ts:'Mar 20, 2026 · 4:00 PM',  rel:'32 days ago',   group:'Mar 20, 2026' },
    { id:9,  type:'gate',      actor:'SC', action:'Updated consent gate to require email confirmation', detail:null,                            ts:'Mar 20, 2026 · 3:42 PM',  rel:'32 days ago',   group:'Mar 20, 2026' },
    { id:10, type:'phase',     actor:'MT', action:'Renamed phase "Contract Review"',      detail:{ from:'Contract Review', to:'Executive Alignment' }, ts:'Mar 20, 2026 · 3:30 PM', rel:'32 days ago', group:'Mar 20, 2026' },
    { id:11, type:'publish',   actor:'MT', action:'Published playbook as v1.0',          detail:'Initial production release',                  ts:'Feb 10, 2026 · 9:00 AM',  rel:'70 days ago',   group:'Feb 10, 2026' },
    { id:12, type:'config',    actor:'MT', action:'Created playbook',                    detail:null,                                           ts:'Feb 9, 2026 · 5:30 PM',   rel:'71 days ago',   group:'Feb 9, 2026' },
  ],
  'PB-003': [
    { id:1,  type:'config',  actor:'ER', action:'Updated playbook description',          detail:null,                                           ts:'Apr 20, 2026 · 2:10 PM',  rel:'Yesterday',     group:'Apr 20, 2026' },
    { id:2,  type:'trust',   actor:'ER', action:'Changed engagement trigger threshold',  detail:{ from:'7 days', to:'14 days' },                ts:'Apr 20, 2026 · 1:48 PM',  rel:'Yesterday',     group:'Apr 20, 2026' },
    { id:3,  type:'publish', actor:'ER', action:'Saved as draft v0.4',                   detail:null,                                           ts:'Apr 20, 2026 · 1:30 PM',  rel:'Yesterday',     group:'Apr 20, 2026' },
    { id:4,  type:'publish', actor:'ER', action:'Saved as draft v0.3',                   detail:null,                                           ts:'Apr 12, 2026 · 4:20 PM',  rel:'9 days ago',    group:'Apr 12, 2026' },
    { id:5,  type:'phase',   actor:'ER', action:'Added in-app nudge actions to Phase 1', detail:null,                                           ts:'Apr 12, 2026 · 4:05 PM',  rel:'9 days ago',    group:'Apr 12, 2026' },
    { id:6,  type:'gate',    actor:'ER', action:'Removed duplicate suppression gate',    detail:null,                                           ts:'Apr 12, 2026 · 3:50 PM',  rel:'9 days ago',    group:'Apr 12, 2026' },
    { id:7,  type:'moment',  actor:'JL', action:'Verified moment source configuration',  detail:'"Product Analytics" source confirmed',         ts:'Apr 12, 2026 · 2:30 PM',  rel:'9 days ago',    group:'Apr 12, 2026' },
    { id:8,  type:'publish', actor:'ER', action:'Saved as draft v0.2',                   detail:null,                                           ts:'Apr 1, 2026 · 11:00 AM',  rel:'20 days ago',   group:'Apr 1, 2026' },
    { id:9,  type:'phase',   actor:'ER', action:'Added phase "Adoption Guidance"',        detail:null,                                           ts:'Apr 1, 2026 · 10:45 AM',  rel:'20 days ago',   group:'Apr 1, 2026' },
    { id:10, type:'config',  actor:'ER', action:'Created playbook',                      detail:null,                                           ts:'Mar 31, 2026 · 3:15 PM',  rel:'21 days ago',   group:'Mar 31, 2026' },
  ],
  'PB-004': [
    { id:1,  type:'trust',     actor:'DP', action:'Lowered NBA confidence threshold',    detail:{ from:'70%', to:'60%' },                       ts:'Apr 18, 2026 · 5:20 PM',  rel:'3 days ago',    group:'Apr 18, 2026' },
    { id:2,  type:'publish',   actor:'DP', action:'Published playbook as v3.1',          detail:null,                                           ts:'Apr 18, 2026 · 5:10 PM',  rel:'3 days ago',    group:'Apr 18, 2026' },
    { id:3,  type:'objective', actor:'DP', action:'Updated KPI association',              detail:{ from:'Pipeline Growth', to:'Revenue Per Customer' }, ts:'Apr 18, 2026 · 4:55 PM', rel:'3 days ago', group:'Apr 18, 2026' },
    { id:4,  type:'publish',   actor:'DP', action:'Published playbook as v3.0',          detail:null,                                           ts:'Apr 7, 2026 · 1:30 PM',   rel:'14 days ago',   group:'Apr 7, 2026' },
    { id:5,  type:'phase',     actor:'DP', action:'Added phase "Opportunity Framing"',   detail:'NBA-generated personalized messaging',         ts:'Apr 7, 2026 · 1:15 PM',   rel:'14 days ago',   group:'Apr 7, 2026' },
    { id:6,  type:'config',    actor:'SC', action:'Changed department assignment',        detail:{ from:'Customer Success', to:'Sales' },        ts:'Apr 7, 2026 · 12:40 PM',  rel:'14 days ago',   group:'Apr 7, 2026' },
    { id:7,  type:'publish',   actor:'SC', action:'Published playbook as v2.1',          detail:null,                                           ts:'Mar 25, 2026 · 3:00 PM',  rel:'27 days ago',   group:'Mar 25, 2026' },
    { id:8,  type:'gate',      actor:'SC', action:'Added gate: active pricing negotiation exclusion', detail:null,                              ts:'Mar 25, 2026 · 2:45 PM',  rel:'27 days ago',   group:'Mar 25, 2026' },
    { id:9,  type:'publish',   actor:'DP', action:'Published playbook as v2.0',          detail:null,                                           ts:'Mar 12, 2026 · 10:00 AM', rel:'40 days ago',   group:'Mar 12, 2026' },
    { id:10, type:'phase',     actor:'DP', action:'Restructured to 3-phase model',        detail:'Added seat utilization as trigger signal',    ts:'Mar 12, 2026 · 9:45 AM',  rel:'40 days ago',   group:'Mar 12, 2026' },
    { id:11, type:'publish',   actor:'DP', action:'Published playbook as v1.0',          detail:'Initial production release',                  ts:'Jan 30, 2026 · 9:00 AM',  rel:'81 days ago',   group:'Jan 30, 2026' },
    { id:12, type:'config',    actor:'DP', action:'Created playbook',                    detail:null,                                           ts:'Jan 29, 2026 · 2:30 PM',  rel:'82 days ago',   group:'Jan 29, 2026' },
  ],
  'PB-005': [
    { id:1,  type:'publish',   actor:'SC', action:'Published playbook as v2.0',          detail:null,                                           ts:'Apr 14, 2026 · 4:30 PM',  rel:'7 days ago',    group:'Apr 14, 2026' },
    { id:2,  type:'phase',     actor:'SC', action:'Added phase "Executive Escalation"',  detail:'Targets strategic accounts >$50K ARR',        ts:'Apr 14, 2026 · 4:15 PM',  rel:'7 days ago',    group:'Apr 14, 2026' },
    { id:3,  type:'gate',      actor:'SC', action:'Added compliance gate: legal hold check', detail:null,                                       ts:'Apr 14, 2026 · 4:00 PM',  rel:'7 days ago',    group:'Apr 14, 2026' },
    { id:4,  type:'trust',     actor:'MT', action:'Updated approval chain',               detail:{ from:'CSM only', to:'CSM + Director of CS' }, ts:'Apr 14, 2026 · 3:40 PM', rel:'7 days ago',   group:'Apr 14, 2026' },
    { id:5,  type:'publish',   actor:'SC', action:'Published playbook as v1.2',          detail:null,                                           ts:'Apr 2, 2026 · 11:15 AM',  rel:'19 days ago',   group:'Apr 2, 2026' },
    { id:6,  type:'phase',     actor:'SC', action:'Expanded win-back offer options',      detail:'Added: discount, feature unlock, SLA upgrade', ts:'Apr 2, 2026 · 11:00 AM', rel:'19 days ago',   group:'Apr 2, 2026' },
    { id:7,  type:'objective', actor:'SC', action:'Updated failure outcome',              detail:{ from:'Notify only', to:'Escalate to Director' }, ts:'Apr 2, 2026 · 10:45 AM', rel:'19 days ago', group:'Apr 2, 2026' },
    { id:8,  type:'publish',   actor:'MT', action:'Published playbook as v1.1',          detail:null,                                           ts:'Mar 18, 2026 · 2:00 PM',  rel:'34 days ago',   group:'Mar 18, 2026' },
    { id:9,  type:'gate',      actor:'MT', action:'Enforced all 5 gates as hard requirements', detail:'Previously 3 of 5 required',            ts:'Mar 18, 2026 · 1:45 PM',  rel:'34 days ago',   group:'Mar 18, 2026' },
    { id:10, type:'trust',     actor:'MT', action:'Set NBA confidence threshold',         detail:{ from:'75%', to:'85%' },                      ts:'Mar 18, 2026 · 1:30 PM',  rel:'34 days ago',   group:'Mar 18, 2026' },
    { id:11, type:'publish',   actor:'SC', action:'Published playbook as v1.0',          detail:'Initial production release',                  ts:'Mar 1, 2026 · 9:00 AM',   rel:'51 days ago',   group:'Mar 1, 2026' },
    { id:12, type:'moment',    actor:'SC', action:'Configured trigger: Risk Score Change', detail:'Sources: CRM, Data Warehouse, Product Analytics', ts:'Feb 28, 2026 · 4:30 PM', rel:'52 days ago', group:'Feb 28, 2026' },
    { id:13, type:'config',    actor:'SC', action:'Created playbook',                    detail:null,                                           ts:'Feb 28, 2026 · 9:00 AM',  rel:'52 days ago',   group:'Feb 28, 2026' },
  ],
}

// ── History tab ───────────────────────────────────────────────────────────────
function HistoryTab({ pb }) {
  const allEntries = PLAYBOOK_HISTORY[pb.id] || PLAYBOOK_HISTORY['PB-001']
  const [filter, setFilter] = useState('all')

  const filtered   = filter === 'all' ? allEntries : allEntries.filter(e => e.type === filter)
  const groupOrder = [...new Set(filtered.map(e => e.group))]
  const grouped    = filtered.reduce((acc, entry) => {
    ;(acc[entry.group] = acc[entry.group] || []).push(entry)
    return acc
  }, {})

  return (
    <div className="max-w-3xl mx-auto py-8">

      {/* ── Filter bar ── */}
      <div className="flex items-center gap-2 flex-wrap mb-8">
        <button onClick={() => setFilter('all')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
          style={filter === 'all'
            ? { background:'rgba(124,92,252,0.14)', color:'#a78bfa', border:'1px solid rgba(124,92,252,0.3)' }
            : { background:'rgba(255,255,255,0.04)', color:'var(--text-muted)', border:'1px solid rgba(255,255,255,0.08)' }}>
          All
          <span className="opacity-50 ml-0.5">{allEntries.length}</span>
        </button>

        {Object.entries(HISTORY_TYPES).map(([key, t]) => {
          const count = allEntries.filter(e => e.type === key).length
          if (!count) return null
          return (
            <button key={key} onClick={() => setFilter(key)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={filter === key
                ? { background: t.bg, color: t.color, border:`1px solid ${t.color}55` }
                : { background:'rgba(255,255,255,0.04)', color:'var(--text-muted)', border:'1px solid rgba(255,255,255,0.08)' }}>
              <t.Icon size={10} />
              {t.label}
              <span className="opacity-50 ml-0.5">{count}</span>
            </button>
          )
        })}
      </div>

      {/* ── Feed ── */}
      {groupOrder.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)' }}>
            <Clock size={18} style={{ color:'var(--text-muted)', opacity:0.4 }} />
          </div>
          <p className="text-sm" style={{ color:'var(--text-muted)' }}>No events match this filter</p>
        </div>
      ) : (
        <div className="flex flex-col gap-7">
          {groupOrder.map(group => (
            <div key={group}>

              {/* Date separator */}
              <div className="flex items-center gap-3 mb-3">
                <span className="text-[10px] font-semibold tracking-widest uppercase shrink-0"
                  style={{ color:'var(--text-muted)', opacity:0.5 }}>{group}</span>
                <div className="flex-1 h-px" style={{ background:'rgba(255,255,255,0.06)' }} />
              </div>

              {/* Entries */}
              <div className="flex flex-col">
                {grouped[group].map((entry, i) => {
                  const t     = HISTORY_TYPES[entry.type]
                  const actor = HISTORY_ACTORS[entry.actor]
                  const isLast = i === grouped[group].length - 1
                  return (
                    <div key={entry.id}
                      className="flex items-start gap-3 px-3 py-3 rounded-xl transition-colors cursor-default"
                      style={{ borderBottom: isLast ? 'none' : '1px solid rgba(255,255,255,0.04)' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.025)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>

                      {/* Category icon */}
                      <div className="shrink-0 mt-0.5 w-7 h-7 rounded-lg flex items-center justify-center"
                        style={{ background: t.bg }}>
                        <t.Icon size={12} style={{ color: t.color }} />
                      </div>

                      {/* Body */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-6">

                          {/* Left: actor + action + detail */}
                          <div className="flex items-baseline gap-2 flex-wrap min-w-0">

                            {/* Actor */}
                            <div className="flex items-center gap-1.5 shrink-0">
                              <div className="w-4 h-4 rounded-full flex items-center justify-center text-[7px] font-bold text-white shrink-0"
                                style={{ background: actor.gradient }}>
                                {actor.initials}
                              </div>
                              <span className="text-xs font-semibold" style={{ color:'var(--text-primary)' }}>
                                {actor.name}
                              </span>
                            </div>

                            {/* Action text */}
                            <span className="text-xs" style={{ color:'var(--text-secondary)' }}>
                              {entry.action}
                            </span>

                            {/* Value diff chip */}
                            {entry.detail && typeof entry.detail === 'object' && entry.detail.from ? (
                              <div className="flex items-center gap-1 shrink-0">
                                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded"
                                  style={{ background:'rgba(255,255,255,0.06)', color:'var(--text-muted)', border:'1px solid rgba(255,255,255,0.09)' }}>
                                  {entry.detail.from}
                                </span>
                                <span className="text-[10px]" style={{ color:'rgba(255,255,255,0.25)' }}>→</span>
                                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded"
                                  style={{ background: t.bg, color: t.color, border:`1px solid ${t.color}33` }}>
                                  {entry.detail.to}
                                </span>
                              </div>
                            ) : typeof entry.detail === 'string' ? (
                              <span className="text-[11px]" style={{ color:'var(--text-muted)', opacity:0.65 }}>
                                · {entry.detail}
                              </span>
                            ) : null}
                          </div>

                          {/* Right: timestamps */}
                          <div className="shrink-0 text-right">
                            <p className="text-[10px] font-medium" style={{ color:'var(--text-muted)' }}>
                              {entry.rel}
                            </p>
                            <p className="text-[10px] mt-0.5 tabular-nums" style={{ color:'rgba(255,255,255,0.2)' }}>
                              {entry.ts.split('·')[1]?.trim()}
                            </p>
                          </div>

                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Configuration tab ─────────────────────────────────────────────────────────
function ConfigurationTab({ pb, onNameChange, initialCopyName }) {
  const detail     = PLAYBOOK_DETAIL_DATA[pb.id] || PLAYBOOK_DETAIL_DATA['PB-001']
  const [formData, setFormData] = useState(() => {
    const base = buildConfigData(pb, detail)
    return initialCopyName ? { ...base, name: initialCopyName } : base
  })
  const [saved,    setSaved]    = useState(false)

  useEffect(() => { onNameChange?.(formData.name) }, [formData.name])

  const handleSave    = () => { setSaved(true); setTimeout(() => setSaved(false), 2500) }
  const handleDiscard = () => setFormData(buildConfigData(pb, detail))

  const SECTIONS = [
    { id: 'basics',    label: 'Basics',             icon: FileText,  iconBg: 'linear-gradient(135deg,#3b82f6,#7c5cfc)', desc: 'Identity, scope & ownership'      },
    { id: 'knowledge', label: 'Knowledge',          icon: BookOpen,  iconBg: 'linear-gradient(135deg,#7c5cfc,#a78bfa)', desc: 'Knowledge packs & reference data' },
    { id: 'moment',    label: 'Moment',             icon: Sparkles,  iconBg: 'linear-gradient(135deg,#a78bfa,#ec4899)', desc: 'Trigger event & conditions'       },
    { id: 'gates',     label: 'Hard Gates',         icon: Shield,    iconBg: 'linear-gradient(135deg,#16a34a,#2dd4bf)', desc: 'Eligibility constraints'          },
    { id: 'objective', label: 'Objective & Success',icon: Target,    iconBg: 'linear-gradient(135deg,#f59e0b,#ef4444)', desc: 'Goal, success & exit conditions'  },
    { id: 'phases',    label: 'Phases & Actions',   icon: Layers,    iconBg: 'linear-gradient(135deg,#2563eb,#0891b2)', desc: 'Execution phases'                 },
    { id: 'trust',     label: 'Trust Controls',     icon: Zap,       iconBg: 'linear-gradient(135deg,#7c5cfc,#2563eb)', desc: 'NBA autonomy & guardrails'        },
  ]

  return (
    <div className="flex h-full">

      {/* ── Left section nav ── */}
      <div className="shrink-0 flex flex-col overflow-y-auto"
        style={{ width: 220, borderRight: '1px solid rgba(255,255,255,0.07)', background: 'var(--sidebar-bg)' }}>
        <div className="flex-1 px-4 py-6">
          <p className="text-[10px] font-bold tracking-widest uppercase mb-4 px-2"
            style={{ color: 'var(--text-muted)' }}>Sections</p>
          {SECTIONS.map(sec => {
            const Icon = sec.icon
            return (
              <a key={sec.id} href={`#cfg-${sec.id}`}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg mb-0.5 transition-all hover:bg-white/[0.04]"
                style={{ textDecoration: 'none' }}>
                <div className="w-6 h-6 rounded-md flex items-center justify-center shrink-0"
                  style={{ background: sec.iconBg }}>
                  <Icon size={11} color="#fff" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold truncate" style={{ color: 'var(--text-secondary)' }}>{sec.label}</p>
                  <p className="text-[10px] truncate"            style={{ color: 'var(--text-muted)' }}>{sec.desc}</p>
                </div>
              </a>
            )
          })}
        </div>

        {/* Sidebar callout */}
        <div className="shrink-0 mx-4 mb-5 p-3 rounded-xl"
          style={{ background: 'rgba(124,92,252,0.07)', border: '1px solid rgba(124,92,252,0.2)' }}>
          <p className="text-[10px] leading-relaxed" style={{ color: 'rgba(167,139,250,0.8)' }}>
            All changes create a new draft revision. Publish when ready to go live.
          </p>
        </div>
      </div>

      {/* ── Main scrollable content ── */}
      <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto px-10 py-7">

          <section id="cfg-basics" className="mb-10">
            <CfgSectionHeader sec={SECTIONS[0]} />
            <BasicsStep data={formData} onChange={setFormData} />
          </section>

          <div className="h-px my-10" style={{ background: 'rgba(255,255,255,0.06)' }} />

          <section id="cfg-knowledge" className="mb-10">
            <CfgSectionHeader sec={SECTIONS[1]} />
            <KnowledgeStep data={formData} onChange={setFormData} />
          </section>

          <div className="h-px my-10" style={{ background: 'rgba(255,255,255,0.06)' }} />

          <section id="cfg-moment" className="mb-10">
            <CfgSectionHeader sec={SECTIONS[2]} />
            <MomentStep data={formData} onChange={setFormData} />
          </section>

          <div className="h-px my-10" style={{ background: 'rgba(255,255,255,0.06)' }} />

          <section id="cfg-gates" className="mb-10">
            <CfgSectionHeader sec={SECTIONS[3]} />
            <GatesStep data={formData} onChange={setFormData} />
          </section>

          <div className="h-px my-10" style={{ background: 'rgba(255,255,255,0.06)' }} />

          <section id="cfg-objective" className="mb-10">
            <CfgSectionHeader sec={SECTIONS[4]} />
            <ObjectiveStep data={formData} onChange={setFormData} />
          </section>

          <div className="h-px my-10" style={{ background: 'rgba(255,255,255,0.06)' }} />

          <section id="cfg-phases" className="mb-10">
            <CfgSectionHeader sec={SECTIONS[5]} />
            <PhasesStep data={formData} onChange={setFormData} />
          </section>

          <div className="h-px my-10" style={{ background: 'rgba(255,255,255,0.06)' }} />

          <section id="cfg-trust">
            <CfgSectionHeader sec={SECTIONS[6]} />
            <TrustStep data={formData} onChange={setFormData} />
          </section>

        </div>

        {/* ── Sticky save bar ── */}
        <div className="shrink-0 flex items-center justify-between px-10 py-4 z-10"
          style={{ borderTop: '1px solid rgba(255,255,255,0.08)', background: 'var(--bg-base)' }}>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Saving creates a new draft revision — publish when ready to go live
          </p>
          <div className="flex items-center gap-2">
            <button type="button" onClick={handleDiscard}
              className="px-4 py-2 rounded-xl text-xs font-semibold transition-all hover:brightness-110"
              style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)', border: '1px solid rgba(255,255,255,0.1)' }}>
              Discard Changes
            </button>
            <button type="button" onClick={handleSave}
              className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold transition-all hover:brightness-110"
              style={{
                background: saved ? 'rgba(34,197,94,0.15)' : 'linear-gradient(135deg,#7c5cfc,#3b82f6)',
                color:      saved ? '#4ade80' : '#fff',
                border:     saved ? '1px solid rgba(34,197,94,0.4)' : 'none',
              }}>
              {saved
                ? <><CheckCircle size={12} /> Saved!</>
                : <><Save size={12} /> Save Changes</>}
            </button>
          </div>
        </div>
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
  const location  = useLocation()
  const copyName  = location.state?.copyName
  const [activeTab,       setActiveTab]       = useState('overview')
  const [overviewSubTab,  setOverviewSubTab]  = useState('what')
  const [confirmType,     setConfirmType]     = useState(null) // 'publish' | 'archive' | 'delete'

  const pb = PLAYBOOKS.find(p => p.id === id) || PLAYBOOKS[0]

  const [displayName, setDisplayName] = useState(copyName || pb.name)

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
    activity: <ActivityUsageTab pb={pb} />,
  }

  // ── Top-level tab content (non-configuration tabs) ──
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
    // configuration handled separately below
    versions: <VersionsTab pb={pb} />,
    history: <HistoryTab pb={pb} />,
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
          <span style={{ color: 'var(--text-secondary)' }}>{displayName}</span>
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
                  {displayName}
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
      {activeTab === 'configuration' ? (
        <div className="flex-1 overflow-hidden">
          <ConfigurationTab pb={pb} onNameChange={setDisplayName} initialCopyName={copyName} />
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto px-8 py-6">
          {tabContent[activeTab]}
        </div>
      )}

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
