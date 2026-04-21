import React, { useState, useMemo, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  BookOpen, Zap, Search, SlidersHorizontal, X, Clock,
  User, Shield, GitBranch, ChevronRight, CheckCircle,
  Plus, HelpCircle, Layers, RotateCcw, Flag, Eye,
  Sparkles, Star, Activity, AlertTriangle, Users, ArrowRight,
} from 'lucide-react'

// ── Mock data ─────────────────────────────────────────────────────────────────
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

// ── Per-playbook simulation data ───────────────────────────────────────────────
const PB_SIM_DATA = {
  'PB-001': {
    scenarioInputs: [
      { label: 'Primary Moment',   title: 'Customer Account Created',        sub: 'Plan: Professional · MRR $2,400',          color: '#a78bfa', bg: 'rgba(124,92,252,0.1)',  border: 'rgba(124,92,252,0.25)', icon: <Star size={14} color="#fff" /> },
      { label: 'Engagement State', title: 'First Login Completed',           sub: 'Within 2 hrs of account creation',          color: '#60a5fa', bg: 'rgba(59,130,246,0.1)',  border: 'rgba(59,130,246,0.25)', icon: <Activity size={14} color="#fff" /> },
      { label: 'Consent State',    title: 'Email & SMS Opted In',            sub: '✓ All channels permitted',                  color: '#2dd4bf', bg: 'rgba(20,184,166,0.1)',  border: 'rgba(20,184,166,0.25)', icon: <Shield size={14} color="#fff" /> },
      { label: 'Account Context',  title: 'SMB · Technology · 45 employees · West Coast region', sub: null,                   color: '#94a3b8', bg: 'rgba(100,116,139,0.07)', border: 'rgba(100,116,139,0.2)', icon: <Users size={14} color="#94a3b8" /> },
    ],
    qualifies: [
      'New account matches onboarding eligibility criteria',
      'First login detected within the welcome window',
      'No conflicting active onboarding sequences',
      'All required profile fields are populated',
    ],
    hardGates: [
      'Consent verification passed',
      'Account activation confirmed',
      'No suppression or DNC flag active',
    ],
  },
  'PB-002': {
    scenarioInputs: [
      { label: 'Primary Moment',   title: '90-Day Renewal Window Opened',    sub: 'Contract value: $48,000 ARR',               color: '#fb923c', bg: 'rgba(249,115,22,0.1)',  border: 'rgba(249,115,22,0.25)', icon: <AlertTriangle size={14} color="#fff" /> },
      { label: 'Health Signal',    title: 'Risk Score Elevated',             sub: 'Score: 58 / 100 — Down 12 pts this month', color: '#f87171', bg: 'rgba(239,68,68,0.1)',   border: 'rgba(239,68,68,0.25)', icon: <Activity size={14} color="#fff" /> },
      { label: 'Consent State',    title: 'Email Opted In',                  sub: 'SMS not consented',                         color: '#2dd4bf', bg: 'rgba(20,184,166,0.1)',  border: 'rgba(20,184,166,0.25)', icon: <Shield size={14} color="#fff" /> },
      { label: 'Rep Activity',     title: 'Last Touch 3 Days Ago',           sub: 'AE: Michael Torres · Renewal meeting booked', color: '#a78bfa', bg: 'rgba(124,92,252,0.1)', border: 'rgba(124,92,252,0.25)', icon: <Users size={14} color="#fff" /> },
    ],
    qualifies: [
      'Account enters 90-day renewal eligibility window',
      'Risk score flags potential churn signal',
      'No higher-priority playbook currently active',
      'Account has upsell history — expansion opportunity detected',
    ],
    hardGates: [
      'Email consent confirmed',
      'Active subscription verified',
      'No duplicate renewal sequences running',
      'Rep conflict check passed',
    ],
  },
  'PB-003': {
    scenarioInputs: [
      { label: 'Primary Moment',   title: 'Low Engagement Detected',         sub: 'Feature usage below baseline for 14 days', color: '#fbbf24', bg: 'rgba(245,158,11,0.1)',  border: 'rgba(245,158,11,0.25)', icon: <AlertTriangle size={14} color="#fff" /> },
      { label: 'Product Signal',   title: 'Core Feature Underused',          sub: '3 of 8 key features never activated',      color: '#60a5fa', bg: 'rgba(59,130,246,0.1)',  border: 'rgba(59,130,246,0.25)', icon: <Activity size={14} color="#fff" /> },
      { label: 'Consent State',    title: 'Email & SMS Opted In',            sub: '✓ All channels permitted',                 color: '#2dd4bf', bg: 'rgba(20,184,166,0.1)',  border: 'rgba(20,184,166,0.25)', icon: <Shield size={14} color="#fff" /> },
      { label: 'CSM Activity',     title: 'No CSM Assigned',                 sub: 'Auto-routing eligible',                    color: '#94a3b8', bg: 'rgba(100,116,139,0.07)', border: 'rgba(100,116,139,0.2)', icon: <Users size={14} color="#94a3b8" /> },
    ],
    qualifies: [
      'Engagement drop sustained for 14+ days',
      'Account is within the first 90 days of activation',
      'Feature adoption score below department median',
      'No active nurture or adoption campaign running',
    ],
    hardGates: [
      'Email consent confirmed',
      'Account not in suppression list',
      'No competing adoption sequence active',
    ],
  },
  'PB-004': {
    scenarioInputs: [
      { label: 'Primary Moment',   title: 'Usage Threshold Met',             sub: 'Seats utilized: 95% — Expansion signal',   color: '#4ade80', bg: 'rgba(34,197,94,0.1)',   border: 'rgba(34,197,94,0.25)', icon: <Zap size={14} color="#fff" /> },
      { label: 'Engagement State', title: 'Power User Behavior Detected',    sub: 'Daily active · 3 workflows created',       color: '#60a5fa', bg: 'rgba(59,130,246,0.1)',  border: 'rgba(59,130,246,0.25)', icon: <Activity size={14} color="#fff" /> },
      { label: 'Consent State',    title: 'All Channels Permitted',          sub: '✓ Email, SMS, Push consented',             color: '#2dd4bf', bg: 'rgba(20,184,166,0.1)',  border: 'rgba(20,184,166,0.25)', icon: <Shield size={14} color="#fff" /> },
      { label: 'Account Context',  title: 'Mid-Market · Financial Services · 250 employees', sub: 'ARR: $18,000 · Expansion potential $12K', color: '#a78bfa', bg: 'rgba(124,92,252,0.1)', border: 'rgba(124,92,252,0.25)', icon: <Users size={14} color="#fff" /> },
    ],
    qualifies: [
      'Seat utilization exceeds 90% threshold',
      'No active upsell conversation in last 30 days',
      'Account health score above 75',
      'AE confirmed expansion readiness',
    ],
    hardGates: [
      'Consent verification passed',
      'Account not in freeze period',
      'No duplicate expansion outreach active',
    ],
  },
  'PB-005': {
    scenarioInputs: [
      { label: 'Primary Moment',   title: 'Risk Score Changed',              sub: 'Score: 38 / 100 — Critical drop detected',  color: '#f87171', bg: 'rgba(239,68,68,0.1)',   border: 'rgba(239,68,68,0.25)', icon: <AlertTriangle size={14} color="#fff" /> },
      { label: 'Health Signal',    title: 'Support Tickets Escalated',       sub: '3 unresolved tickets · CSAT: 2.1 / 5',     color: '#fb923c', bg: 'rgba(249,115,22,0.1)',  border: 'rgba(249,115,22,0.25)', icon: <Activity size={14} color="#fff" /> },
      { label: 'Consent State',    title: 'Email Only',                      sub: 'SMS opted-out',                             color: '#2dd4bf', bg: 'rgba(20,184,166,0.1)',  border: 'rgba(20,184,166,0.25)', icon: <Shield size={14} color="#fff" /> },
      { label: 'Rep Activity',     title: 'Last Touch 8 Days Ago',           sub: 'CSM flagged for manual review',             color: '#a78bfa', bg: 'rgba(124,92,252,0.1)',  border: 'rgba(124,92,252,0.25)', icon: <Users size={14} color="#fff" /> },
    ],
    qualifies: [
      'Risk score dropped below critical threshold (40)',
      'Account has 90+ days of relationship history',
      'Churn signal confirmed by multiple data points',
      'No active intervention playbook running',
    ],
    hardGates: [
      'Email consent confirmed',
      'Account not already in win-back flow',
      'No suppression or cooling-off period active',
      'Human review flag assessed by CSM',
      'Legal hold check passed',
    ],
  },
}

// ── Design tokens ─────────────────────────────────────────────────────────────
const STAGE_STYLE = {
  Onboarding: { bg: 'rgba(59,130,246,0.14)', color: '#60a5fa',  border: 'rgba(59,130,246,0.3)'  },
  Renewal:    { bg: 'rgba(124,92,252,0.14)', color: '#a78bfa',  border: 'rgba(124,92,252,0.3)'  },
  Adoption:   { bg: 'rgba(20,184,166,0.14)', color: '#2dd4bf',  border: 'rgba(20,184,166,0.3)'  },
  Expansion:  { bg: 'rgba(34,197,94,0.14)',  color: '#4ade80',  border: 'rgba(34,197,94,0.3)'   },
  Retention:  { bg: 'rgba(249,115,22,0.14)', color: '#fb923c',  border: 'rgba(249,115,22,0.3)'  },
}

const STATUS_STYLE = {
  Published: { bg: 'rgba(34,197,94,0.12)',  color: '#4ade80', border: 'rgba(34,197,94,0.3)'  },
  Draft:     { bg: 'rgba(245,158,11,0.12)', color: '#fbbf24', border: 'rgba(245,158,11,0.3)' },
  Archived:  { bg: 'rgba(100,116,139,0.12)',color: '#94a3b8', border: 'rgba(100,116,139,0.3)'},
}

const TRUST_STYLE = {
  Auto:     { color: '#2dd4bf', icon: <Zap size={10} /> },
  Approval: { color: '#a78bfa', icon: <Shield size={10} /> },
  Draft:    { color: '#fbbf24', icon: <GitBranch size={10} /> },
}

// ── Filter options ────────────────────────────────────────────────────────────
const FILTER_OPTS = {
  status:     ['All', 'Published', 'Draft', 'Archived'],
  department: ['All', 'Sales', 'Customer Success', 'Product'],
  stage:      ['All', 'Onboarding', 'Renewal', 'Adoption', 'Expansion', 'Retention'],
  owner:      ['All', 'Sarah Chen', 'Michael Torres', 'Emily Rodriguez', 'David Park'],
  trustMode:  ['All', 'Auto', 'Approval'],
  updated:    ['Any time', 'Today', 'This week', 'This month'],
}

// ── Quick select ──────────────────────────────────────────────────────────────
function QuickSelect({ label, value, options, onChange }) {
  const active = value !== 'All'
  return (
    <div className="relative flex items-center shrink-0">
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="appearance-none pl-3 pr-7 py-2 rounded-xl text-xs font-medium outline-none cursor-pointer transition-all"
        style={{
          background: active ? 'rgba(124,92,252,0.15)' : 'var(--input-bg)',
          border: `1px solid ${active ? 'rgba(124,92,252,0.4)' : 'var(--input-border)'}`,
          color: active ? '#a78bfa' : 'var(--text-muted)',
          colorScheme: 'dark',
        }}>
        {options.map(o => (
          <option key={o} value={o} style={{ background: '#1a2035', color: '#e2e8f0' }}>
            {o === 'All' ? `${label}: All` : o}
          </option>
        ))}
      </select>
      <svg className="absolute right-2 pointer-events-none" width="10" height="10" viewBox="0 0 10 10" fill="none">
        <path d="M2 3.5L5 6.5L8 3.5" stroke={active ? '#a78bfa' : '#64748b'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  )
}

// ── Chip ──────────────────────────────────────────────────────────────────────
function Chip({ style, children }) {
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full"
      style={{ background: style.bg, color: style.color, border: `1px solid ${style.border}` }}>
      {children}
    </span>
  )
}

// ── Filters slide-out ─────────────────────────────────────────────────────────
function FiltersSlideOut({ filters, onChange, onClear, onClose, total, filtered }) {
  return createPortal(
    <>
      <div className="fixed inset-0 z-[900]" onClick={onClose} />
      <div className="fixed top-0 right-0 h-full z-[901] flex flex-col"
        style={{ width: 340, background: 'var(--slideout-bg)', borderLeft: '1px solid var(--slideout-border)', boxShadow: '-8px 0 32px rgba(0,0,0,0.35)' }}>

        <div className="flex items-center justify-between px-5 py-4 shrink-0"
          style={{ borderBottom: '1px solid var(--slideout-border)' }}>
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={14} style={{ color: '#a78bfa' }} />
            <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Filters</p>
          </div>
          <button className="btn-ghost p-1.5 rounded-lg" onClick={onClose}><X size={14} /></button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
          {[
            { key: 'status',    label: 'Status',          opts: FILTER_OPTS.status },
            { key: 'stage',     label: 'Lifecycle Stage', opts: FILTER_OPTS.stage },
            { key: 'owner',     label: 'Owner',           opts: FILTER_OPTS.owner },
            { key: 'trustMode', label: 'Trust Mode',      opts: FILTER_OPTS.trustMode },
            { key: 'updated',   label: 'Last Updated',    opts: FILTER_OPTS.updated },
          ].map(({ key, label, opts }) => (
            <div key={key} className="space-y-2">
              <p className="text-[10px] font-semibold tracking-widest uppercase"
                style={{ color: 'var(--text-muted)' }}>{label}</p>
              <div className="flex flex-wrap gap-1.5">
                {opts.map(opt => {
                  const active = filters[key] === opt
                  return (
                    <button key={opt} onClick={() => onChange(key, opt)}
                      className="text-[11px] px-2.5 py-1 rounded-full font-medium transition-all border"
                      style={active
                        ? { background: 'rgba(124,92,252,0.18)', borderColor: 'rgba(124,92,252,0.5)', color: '#a78bfa' }
                        : { background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.1)', color: 'var(--text-muted)' }}>
                      {opt}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="px-5 py-4 shrink-0 flex items-center justify-between"
          style={{ borderTop: '1px solid var(--slideout-border)' }}>
          <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
            Showing <span style={{ color: 'var(--text-secondary)' }}>{filtered}</span> of {total} playbooks
          </p>
          <button onClick={onClear}
            className="flex items-center gap-1.5 text-xs font-medium transition-colors hover:opacity-80"
            style={{ color: '#a78bfa' }}>
            <RotateCcw size={11} /> Clear all
          </button>
        </div>
      </div>
    </>,
    document.body
  )
}

// ── Playbook slide-out ────────────────────────────────────────────────────────
function PlaybookSlideOut({ pb, onClose, onGoTo }) {
  const sim    = PB_SIM_DATA[pb.id]
  const status = STATUS_STYLE[pb.status] || STATUS_STYLE.Draft
  const stage  = STAGE_STYLE[pb.stage]  || STAGE_STYLE.Onboarding

  return createPortal(
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-[900]" onClick={onClose} />

      {/* Panel */}
      <div className="fixed top-0 right-0 h-full z-[901] flex flex-col"
        style={{ width: 480, background: 'var(--slideout-bg)', borderLeft: '1px solid var(--slideout-border)', boxShadow: '-12px 0 48px rgba(0,0,0,0.5)' }}>

        {/* Header */}
        <div className="px-5 py-4 shrink-0"
          style={{ borderBottom: '1px solid var(--slideout-border)' }}>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              {/* Status + stage row */}
              <div className="flex items-center gap-2 mb-1.5">
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full"
                  style={{ background: status.bg, color: status.color, border: `1px solid ${status.border}` }}>
                  {pb.status === 'Published' ? <CheckCircle size={9} /> : <GitBranch size={9} />}
                  {pb.status}
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full"
                  style={{ background: stage.bg, color: stage.color, border: `1px solid ${stage.border}` }}>
                  {pb.stage}
                </span>
                <span className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>{pb.version}</span>
              </div>
              {/* Title */}
              <p className="text-sm font-bold leading-snug" style={{ color: 'var(--text-primary)' }}>
                {pb.name}
              </p>
              {/* Meta */}
              <div className="flex items-center gap-2 mt-1">
                <div className="w-4 h-4 rounded-full flex items-center justify-center text-[7px] font-bold text-white shrink-0"
                  style={{ background: pb.ownerGradient }}>{pb.ownerInitials}</div>
                <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{pb.owner}</span>
                <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: 10 }}>·</span>
                <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{pb.department}</span>
                <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: 10 }}>·</span>
                <Clock size={9} style={{ color: 'var(--text-muted)' }} />
                <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{pb.updatedAt}</span>
              </div>
            </div>
            <button className="btn-ghost p-1.5 rounded-lg shrink-0" onClick={onClose}>
              <X size={14} />
            </button>
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-3 mt-3">
            {[
              { label: 'Phases',  val: pb.phases },
              { label: 'Gates',   val: pb.gates  },
              { label: 'Moment',  val: pb.moment },
            ].map(s => (
              <div key={s.label} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <span className="text-[10px] font-semibold" style={{ color: 'var(--text-muted)' }}>{s.label}</span>
                <span className="text-[10px] font-bold" style={{ color: 'var(--text-secondary)' }}>{s.val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">

          {/* Note banner */}
          <div className="flex items-start gap-2.5 px-3.5 py-3 rounded-xl"
            style={{ background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.2)' }}>
            <AlertTriangle size={12} style={{ color: '#fbbf24', marginTop: 1, flexShrink: 0 }} />
            <p className="text-[11px] leading-relaxed" style={{ color: '#fbbf24' }}>
              <strong>Preview:</strong> Example simulation based on representative data. Actual runtime behavior varies by real-time signals and NBA engine decisioning.
            </p>
          </div>

          {/* Scenario Input */}
          {sim && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={13} style={{ color: '#a78bfa' }} />
                <p className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>Scenario Input</p>
              </div>
              <div className="space-y-2">
                {sim.scenarioInputs.map((inp, i) => (
                  <div key={i} className="flex items-start gap-3 px-3.5 py-3 rounded-xl"
                    style={{ background: inp.bg, border: `1px solid ${inp.border}` }}>
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                      style={{ background: 'rgba(255,255,255,0.1)' }}>
                      {inp.icon}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-semibold mb-0.5" style={{ color: inp.color }}>{inp.label}</p>
                      <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{inp.title}</p>
                      {inp.sub && <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{inp.sub}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Why This Playbook Qualifies */}
          {sim && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle size={13} style={{ color: '#4ade80' }} />
                <p className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>Why This Playbook Qualifies</p>
              </div>
              <div className="px-3.5 py-3 rounded-xl space-y-2"
                style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.2)' }}>
                {sim.qualifies.map((q, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle size={12} style={{ color: '#4ade80', marginTop: 1, flexShrink: 0 }} />
                    <p className="text-[11px] leading-relaxed" style={{ color: 'rgba(74,222,128,0.85)' }}>{q}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Hard Gate Evaluation */}
          {sim && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Shield size={13} style={{ color: '#60a5fa' }} />
                <p className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>Hard Gate Evaluation</p>
              </div>
              <div className="px-3.5 py-3 rounded-xl space-y-2.5"
                style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.2)' }}>
                <p className="text-[11px] font-medium" style={{ color: '#60a5fa' }}>
                  All hard gates passed — playbook is eligible for execution.
                </p>
                {sim.hardGates.map((g, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <CheckCircle size={12} style={{ color: '#4ade80', flexShrink: 0 }} />
                    <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{g}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-4 shrink-0"
          style={{ borderTop: '1px solid var(--slideout-border)' }}>
          <button className="text-sm font-medium transition-colors hover:opacity-70"
            style={{ color: 'var(--text-muted)' }} onClick={onClose}>
            Close
          </button>
          <button
            onClick={onGoTo}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:brightness-110"
            style={{ background: 'linear-gradient(135deg,#7c5cfc,#3b82f6)', color: '#fff', boxShadow: '0 2px 12px rgba(124,92,252,0.35)' }}>
            Go to Playbook <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </>,
    document.body
  )
}

// ── Playbook card ─────────────────────────────────────────────────────────────
function PlaybookCard({ pb, onPreview, onNavigate }) {
  const stage  = STAGE_STYLE[pb.stage]  || STAGE_STYLE.Onboarding
  const status = STATUS_STYLE[pb.status] || STATUS_STYLE.Draft
  const trust  = TRUST_STYLE[pb.trustMode] || TRUST_STYLE.Draft

  return (
    <div
      className="group relative flex items-center gap-4 px-5 py-3 rounded-xl transition-all cursor-pointer"
      style={{
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderLeft: `3px solid ${stage.color}`,
      }}
      onClick={() => onNavigate(pb.id)}
      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.045)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.13)'; e.currentTarget.style.borderLeftColor = stage.color }}
      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)';  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';  e.currentTarget.style.borderLeftColor = stage.color }}>

      {/* Left: title → description → metadata */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold leading-snug group-hover:text-white transition-colors"
          style={{ color: 'var(--text-primary)' }}>{pb.name}</p>
        <p className="text-xs mt-0.5 leading-relaxed" style={{ color: 'var(--text-muted)' }}>{pb.description}</p>
        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
          <span className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>{pb.id}</span>
          <span style={{ color: 'rgba(255,255,255,0.15)' }}>·</span>
          <div className="flex items-center gap-1 text-[10px]" style={{ color: 'var(--text-muted)' }}>
            <Layers size={9} style={{ color: stage.color }} />
            <span>{pb.moment}</span>
          </div>
          <span style={{ color: 'rgba(255,255,255,0.15)' }}>·</span>
          <div className="flex items-center gap-1">
            <span className="w-3.5 h-3.5 rounded-full flex items-center justify-center text-[7px] font-bold text-white shrink-0"
              style={{ background: pb.ownerGradient }}>{pb.ownerInitials}</span>
            <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{pb.owner}</span>
          </div>
          <span style={{ color: 'rgba(255,255,255,0.15)' }}>·</span>
          <span className="flex items-center gap-1 text-[10px] font-medium" style={{ color: trust.color }}>
            {trust.icon} {pb.trustMode}
          </span>
          <span style={{ color: 'rgba(255,255,255,0.15)' }}>·</span>
          <span className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>{pb.version}</span>
          <span style={{ color: 'rgba(255,255,255,0.15)' }}>·</span>
          <div className="flex items-center gap-1 text-[10px]" style={{ color: 'var(--text-muted)' }}>
            <Clock size={9} /> {pb.updatedAt}
          </div>
        </div>
      </div>

      {/* Right: chips + eye icon */}
      <div className="flex items-center gap-2 shrink-0">
        <Chip style={stage}>{pb.stage}</Chip>
        <Chip style={status}>{pb.status}</Chip>

        {/* Eye button — preview slide-out */}
        <button
          type="button"
          title="Quick preview"
          onClick={e => { e.stopPropagation(); onPreview(pb) }}
          className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg transition-all hover:brightness-110"
          style={{
            background: 'rgba(124,92,252,0.15)',
            border: '1px solid rgba(124,92,252,0.3)',
            color: '#a78bfa',
          }}>
          <Eye size={13} />
        </button>
      </div>
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function Playbooks() {
  const navigate  = useNavigate()
  const location  = useLocation()
  const [toast,       setToast]       = useState(() => location.state?.saved ? location.state : null)
  const [previewPb,   setPreviewPb]   = useState(null)
  const [search,      setSearch]      = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    status:     'All',
    department: 'All',
    stage:      'All',
    owner:      'All',
    trustMode:  'All',
    updated:    'Any time',
  })

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 5000)
      return () => clearTimeout(t)
    }
  }, [toast])

  const handleFilterChange = (key, val) => setFilters(f => ({ ...f, [key]: val }))
  const clearFilters = () => setFilters({ status: 'All', department: 'All', stage: 'All', owner: 'All', trustMode: 'All', updated: 'Any time' })

  const activeFilterCount = Object.entries(filters).filter(([k, v]) =>
    (k === 'updated' ? v !== 'Any time' : v !== 'All')
  ).length
  const quickFilterCount = (filters.department !== 'All' ? 1 : 0) + (filters.owner !== 'All' ? 1 : 0)

  const filtered = useMemo(() => {
    return PLAYBOOKS.filter(pb => {
      const q = search.toLowerCase()
      if (q && !pb.name.toLowerCase().includes(q) && !pb.description.toLowerCase().includes(q) && !pb.owner.toLowerCase().includes(q)) return false
      if (filters.status     !== 'All' && pb.status     !== filters.status)     return false
      if (filters.department !== 'All' && pb.department !== filters.department) return false
      if (filters.stage      !== 'All' && pb.stage      !== filters.stage)      return false
      if (filters.owner      !== 'All' && pb.owner      !== filters.owner)      return false
      if (filters.trustMode  !== 'All' && pb.trustMode  !== filters.trustMode)  return false
      return true
    })
  }, [search, filters])

  return (
    <div className="flex flex-col h-full">

      {/* ── Toast ── */}
      {toast && (
        <div className="shrink-0 mx-6 mt-4 flex items-center gap-3 px-5 py-3.5 rounded-xl transition-all"
          style={{
            background: toast.status === 'published' ? 'rgba(34,197,94,0.08)'  : 'rgba(245,158,11,0.08)',
            border:     toast.status === 'published' ? '1px solid rgba(34,197,94,0.3)' : '1px solid rgba(245,158,11,0.3)',
          }}>
          <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: toast.status === 'published' ? 'rgba(34,197,94,0.18)' : 'rgba(245,158,11,0.18)' }}>
            {toast.status === 'published'
              ? <Flag size={13} style={{ color: '#4ade80' }} />
              : <CheckCircle size={13} style={{ color: '#fbbf24' }} />}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold" style={{ color: toast.status === 'published' ? '#4ade80' : '#fbbf24' }}>
              {toast.status === 'published' ? 'Playbook published' : 'Playbook saved as Draft'}
            </p>
            <p className="text-[11px] mt-0.5 truncate" style={{ color: 'var(--text-muted)' }}>
              <strong style={{ color: 'var(--text-secondary)' }}>{toast.name}</strong>
              {toast.status === 'published'
                ? ' is now live and available for execution'
                : ' was saved. Complete any missing fields and publish when ready.'}
            </p>
          </div>
          <button type="button" onClick={() => setToast(null)}
            className="p-1 rounded-lg hover:bg-white/5 shrink-0 transition-all"
            style={{ color: 'var(--text-muted)' }}>
            <X size={13} />
          </button>
        </div>
      )}

      {/* ── Page header ── */}
      <div className="px-8 pt-7 pb-5 shrink-0"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: 'rgba(124,92,252,0.15)', border: '1px solid rgba(124,92,252,0.3)' }}>
              <BookOpen size={18} style={{ color: '#a78bfa' }} />
            </div>
            <div>
              <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Playbooks</h1>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                Design and govern customer execution strategies across adaptive playbooks and deterministic journeys
              </p>
            </div>
          </div>
          <div className="relative group/create">
            <button
              onClick={() => navigate('/playbooks/create')}
              className="flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-xl transition-all hover:brightness-110"
              style={{ background: 'linear-gradient(135deg,#7c5cfc,#3b82f6)', color: '#fff', boxShadow: '0 2px 12px rgba(124,92,252,0.35)' }}>
              <Plus size={14} /> Create client playbook <ChevronRight size={13} />
            </button>
            <div className="absolute right-0 top-full mt-2.5 z-50 w-72 rounded-2xl pointer-events-none
              opacity-0 translate-y-1 group-hover/create:opacity-100 group-hover/create:translate-y-0
              transition-all duration-200"
              style={{ background: 'var(--slideout-bg)', border: '1px solid rgba(59,130,246,0.35)', boxShadow: '0 12px 40px rgba(0,0,0,0.5)' }}>
              <div className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: 'linear-gradient(135deg,#3b82f6,#7c5cfc)', boxShadow: '0 4px 12px rgba(59,130,246,0.3)' }}>
                    <Zap size={16} color="#fff" />
                  </div>
                  <div>
                    <p className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>Client Playbooks</p>
                    <p className="text-[10px] mt-0.5" style={{ color: '#60a5fa' }}>Adaptive · NBA-driven</p>
                  </div>
                </div>
                <p className="text-[11px] leading-relaxed mb-3" style={{ color: 'var(--text-muted)' }}>
                  Adaptive NBA strategies for customer lifecycle engagement and 1:1 plan execution
                </p>
                <div className="flex items-center gap-1.5 text-[11px] font-medium" style={{ color: '#60a5fa' }}>
                  <Zap size={10} /> Dynamic execution based on real-time signals
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Library ── */}
      <div className="flex-1 overflow-y-auto px-8 py-6">

        {/* Search + filter bar */}
        <div className="flex items-center gap-2 mb-5">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl min-w-0 flex-1"
            style={{ background: 'var(--input-bg)', border: '1px solid var(--input-border)' }}>
            <Search size={13} style={{ color: 'var(--text-muted)' }} className="shrink-0" />
            <input
              className="bg-transparent text-xs outline-none flex-1 placeholder:text-text-muted min-w-0"
              style={{ color: 'var(--text-secondary)' }}
              placeholder="Search playbooks..."
              value={search}
              onChange={e => setSearch(e.target.value)} />
            {search && (
              <button onClick={() => setSearch('')}><X size={11} style={{ color: 'var(--text-muted)' }} /></button>
            )}
          </div>
          <QuickSelect label="Department" value={filters.department} options={FILTER_OPTS.department} onChange={val => handleFilterChange('department', val)} />
          <QuickSelect label="Owner"      value={filters.owner}      options={FILTER_OPTS.owner}      onChange={val => handleFilterChange('owner', val)} />
          <button onClick={() => setShowFilters(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium transition-all shrink-0"
            style={{
              background: activeFilterCount - quickFilterCount > 0 ? 'rgba(124,92,252,0.15)' : 'var(--input-bg)',
              border: `1px solid ${activeFilterCount - quickFilterCount > 0 ? 'rgba(124,92,252,0.4)' : 'var(--input-border)'}`,
              color: activeFilterCount - quickFilterCount > 0 ? '#a78bfa' : 'var(--text-muted)',
            }}>
            <SlidersHorizontal size={13} />
            All filters
            {activeFilterCount - quickFilterCount > 0 && (
              <span className="w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center"
                style={{ background: '#7c5cfc', color: '#fff' }}>{activeFilterCount - quickFilterCount}</span>
            )}
          </button>
        </div>

        {/* Cards */}
        <div className="space-y-2">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <BookOpen size={32} style={{ color: 'var(--text-muted)', opacity: 0.4 }} />
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No playbooks match your filters</p>
              <button onClick={() => { setSearch(''); clearFilters() }}
                className="text-xs font-medium transition-colors hover:opacity-80" style={{ color: '#a78bfa' }}>
                Clear filters
              </button>
            </div>
          ) : (
            filtered.map(pb => (
              <PlaybookCard
                key={pb.id}
                pb={pb}
                onPreview={setPreviewPb}
                onNavigate={id => navigate(`/playbooks/${id}`)}
              />
            ))
          )}
        </div>

        {filtered.length > 0 && (
          <p className="text-[11px] mt-4" style={{ color: 'var(--text-muted)' }}>
            Showing {filtered.length} of {PLAYBOOKS.length} playbooks
          </p>
        )}
      </div>

      {/* Filters slide-out */}
      {showFilters && (
        <FiltersSlideOut
          filters={filters}
          onChange={handleFilterChange}
          onClear={clearFilters}
          onClose={() => setShowFilters(false)}
          total={PLAYBOOKS.length}
          filtered={filtered.length}
        />
      )}

      {/* Playbook preview slide-out */}
      {previewPb && (
        <PlaybookSlideOut
          pb={previewPb}
          onClose={() => setPreviewPb(null)}
          onGoTo={() => navigate(`/playbooks/${previewPb.id}`)}
        />
      )}
    </div>
  )
}
