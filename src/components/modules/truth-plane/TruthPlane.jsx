import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Shield, Filter, LayoutGrid, List, Clock, Eye, X, ChevronRight, AlertTriangle, CheckCircle, FileText, Package, User, Calendar, TrendingUp, ChevronDown, Check, Sparkles, Activity, BookOpen, BarChart2, Zap, Plus } from 'lucide-react'
import { truthPlanes, planeGovernance, planeSourceHealth } from '../../../data/mock'
import { Badge, SearchBar, ThreeDot, SlideOut, TabBar, AllFiltersPanel, FilterSection, Modal, FormField } from '../../ui/index'

// ── Helpers ───────────────────────────────────────────────────────────────────
const STATUS_LABELS = {
  'verified':      'Verified',
  'pending-review':'Pending Review',
  'expiring-soon': 'Expiring Soon',
  'in-proposal':   'In Proposal',
}
const STATUS_COLORS = {
  'verified':      { bg: 'rgba(34,197,94,0.12)',  border: 'rgba(34,197,94,0.3)',  color: '#4ade80' },
  'pending-review':{ bg: 'rgba(96,165,250,0.12)', border: 'rgba(96,165,250,0.3)', color: '#60a5fa' },
  'expiring-soon': { bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.3)', color: '#fbbf24' },
  'in-proposal':   { bg: 'rgba(167,139,250,0.12)',border: 'rgba(167,139,250,0.3)',color: '#a78bfa' },
}
const RISK_COLORS = {
  'Low':    { color: '#4ade80' },
  'Medium': { color: '#fbbf24' },
  'High':   { color: '#f87171' },
}

function confidenceBucket(n) {
  if (n >= 90) return 'High confidence'
  if (n >= 70) return 'Medium confidence'
  return 'Low confidence'
}

function matchesFreshness(plane, labels) {
  return labels.some(l => {
    if (l === 'Updated today') return plane.daysAgo === 0
    if (l === 'Last 7 days')   return plane.daysAgo <= 7
    if (l === 'Last 30 days')  return plane.daysAgo <= 30
    return false
  })
}

// ── Filter definitions ────────────────────────────────────────────────────────
const FILTER_DIMS = [
  { key: 'status',     label: 'Status',           options: ['Verified', 'Pending Review', 'Expiring Soon', 'In Proposal'] },
  { key: 'risk',       label: 'Risk Level',        options: ['Low', 'Medium', 'High'] },
  { key: 'attention',  label: 'Lifecycle Signals', options: ['Expiring', 'Needs Review', 'Has Proposals'] },
  { key: 'owner',      label: 'Owner',             options: ['Sales', 'Engineering', 'Legal', 'Finance', 'HR'] },
  { key: 'scope',      label: 'Scope',             options: ['Workspace', 'Department', 'Company-wide'] },
  { key: 'activity',   label: 'Activity',          options: ['Recently Updated', 'Stale'] },
  { key: 'tag',        label: 'Tag / Category',    options: ['Compliance', 'Finance', 'Eligibility', 'Contracts', 'Operations'] },
  { key: 'attestation',label: 'Attestation',       options: ['Fully attested', 'Missing approver', 'Missing promoter', 'Missing resolver'] },
  { key: 'freshness',  label: 'Date / Freshness',  options: ['Updated today', 'Last 7 days', 'Last 30 days'] },
  { key: 'confidence', label: 'Evidence Strength', options: ['High confidence', 'Medium confidence', 'Low confidence'] },
]

const EMPTY_FILTERS = Object.fromEntries(FILTER_DIMS.map(d => [d.key, []]))

// ── Quick Filter Dropdown ─────────────────────────────────────────────────────
function QuickFilterDropdown({ label, options, selected, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handler = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const toggle = opt =>
    onChange(selected.includes(opt) ? selected.filter(x => x !== opt) : [...selected, opt])

  const hasActive = selected.length > 0

  return (
    <div className="relative" ref={ref}>
      <button
        className="btn-secondary text-xs gap-1.5 flex items-center"
        style={hasActive ? { borderColor: 'rgba(167,139,250,0.5)', color: '#a78bfa' } : {}}
        onClick={() => setOpen(o => !o)}>
        {label}
        {hasActive && (
          <span className="flex items-center justify-center w-4 h-4 rounded-full text-[9px] font-bold"
            style={{ background: 'rgba(167,139,250,0.25)', color: '#a78bfa' }}>
            {selected.length}
          </span>
        )}
        <ChevronDown size={11} style={{ opacity: 0.6, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1.5 z-50 rounded-xl min-w-[168px] py-1.5 shadow-2xl"
          style={{ background: 'var(--slideout-bg, #1a1f2e)', border: '1px solid rgba(255,255,255,0.1)' }}>
          {options.map(opt => {
            const active = selected.includes(opt)
            return (
              <button key={opt}
                className="flex items-center gap-2.5 w-full px-3 py-2 text-xs text-left transition-colors hover:bg-white/5"
                onClick={() => toggle(opt)}>
                <div className="w-3.5 h-3.5 rounded flex items-center justify-center shrink-0 transition-colors"
                  style={{
                    background: active ? '#7c3aed' : 'transparent',
                    border: active ? '1px solid #7c3aed' : '1px solid rgba(255,255,255,0.2)',
                  }}>
                  {active && <Check size={9} color="white" />}
                </div>
                <span style={{ color: active ? '#c4b5fd' : 'var(--text-secondary, #94a3b8)' }}>{opt}</span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ── AI Summary generator ──────────────────────────────────────────────────────
function getAISummary(plane, isFullyAttested) {
  const domain = plane.tag.toLowerCase()
  const stateWord = (plane.risk === 'Low' && plane.status === 'verified')
    ? 'healthy and fully verified'
    : plane.risk === 'High'
      ? 'at elevated risk and requires attention'
      : 'active with items pending review'

  const descLower = plane.desc.charAt(0).toLowerCase() + plane.desc.slice(1)
  const body = `This ${domain} truth plane governs ${descLower}. ` +
    `It is currently ${stateWord} with ${plane.confidence}% confidence across ${plane.facts} verified facts.`

  let rec = null
  if (plane.expiring > 0 && plane.review > 0) {
    rec = `Review ${plane.review} pending claims and renew ${plane.expiring} expiring facts before the next audit cycle.`
  } else if (plane.review > 0) {
    rec = `${plane.review} claims await human review — clearing this queue will strengthen governance health.`
  } else if (plane.expiring > 0) {
    rec = `${plane.expiring} facts are approaching expiration. Schedule renewals to maintain compliance.`
  } else if (!isFullyAttested) {
    rec = `Attestation is incomplete. Fill remaining governance roles to maintain Verified status.`
  } else {
    rec = `All signals are nominal. This plane is in good standing — continue monitoring for new submissions.`
  }
  return { body, rec }
}

// ── SlideOut panel ────────────────────────────────────────────────────────────
function TruthPlaneSlideOut({ plane, onClose, onOpen, onNavigate }) {
  const [tab, setTab] = useState('Overview')
  const navigate = useNavigate()

  const gov = planeGovernance[plane.id]   || {}
  const src = planeSourceHealth[plane.id] || {}

  // Derived color helpers
  const sigPalette = (t90, t70) => ({
    color:  t90 ? '#4ade80' : t70 ? '#fbbf24' : '#f87171',
    bg:     t90 ? 'rgba(34,197,94,0.1)'  : t70 ? 'rgba(245,158,11,0.1)'  : 'rgba(239,68,68,0.1)',
    border: t90 ? 'rgba(34,197,94,0.25)' : t70 ? 'rgba(245,158,11,0.25)' : 'rgba(239,68,68,0.25)',
  })
  const confP     = sigPalette(plane.confidence >= 90, plane.confidence >= 70)
  const confLabel = plane.confidence >= 90 ? 'High' : plane.confidence >= 70 ? 'Medium' : 'Low'

  const isFullyAttested = plane.attestation === 'full'
  const attestText = {
    full: 'Fully Attested',
    'missing-approver': 'Missing Approver',
    'missing-promoter': 'Missing Promoter',
    'missing-resolver': 'Missing Resolver',
  }[plane.attestation] || '—'
  const attestP = isFullyAttested
    ? { color: '#4ade80', bg: 'rgba(34,197,94,0.1)',  border: 'rgba(34,197,94,0.25)'  }
    : { color: '#fbbf24', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.25)' }

  // Attention items
  const attentionItems = [
    plane.expiring > 0 && {
      dot: '#fbbf24', bg: 'rgba(245,158,11,0.07)', border: 'rgba(245,158,11,0.22)',
      label: 'Facts expiring soon', count: plane.expiring, color: '#fbbf24', cta: 'Review →',
      priority: 'high',
    },
    plane.review > 0 && {
      dot: '#60a5fa', bg: 'rgba(59,130,246,0.07)', border: 'rgba(59,130,246,0.22)',
      label: 'Pending human review', count: plane.review, color: '#60a5fa', cta: 'Open queue →',
      priority: 'medium',
    },
    plane.proposals > 0 && {
      dot: '#a78bfa', bg: 'rgba(124,92,252,0.07)', border: 'rgba(124,92,252,0.22)',
      label: 'Active proposals', count: plane.proposals, color: '#a78bfa', cta: 'View →',
      priority: 'low',
    },
    !isFullyAttested && {
      dot: '#f87171', bg: 'rgba(239,68,68,0.06)', border: 'rgba(239,68,68,0.2)',
      label: attestText, count: null, color: '#f87171', cta: 'Fix →',
      priority: 'high',
    },
  ].filter(Boolean)

  // Governance Health derived metrics
  const auditPct      = plane.attestation === 'full' ? 100 : 75
  const conflictRate  = Math.round((plane.review / Math.max(plane.facts + plane.review, 1)) * 100)
  const humanPct      = plane.confidence >= 90 ? 72 : plane.confidence >= 80 ? 60 : 45

  // Confidence distribution (spread around actual score)
  const seed    = plane.id.charCodeAt(plane.id.length - 1) % 10
  const highPct = Math.min(90, Math.max(35, plane.confidence - 8 + seed))
  const lowPct  = Math.max(5,  Math.min(25, 105 - plane.confidence - seed))
  const medPct  = 100 - highPct - lowPct

  // AI Summary
  const aiSum = getAISummary(plane, isFullyAttested)

  // Governance trail rows for Details tab
  const trailRows = [
    { role: 'Created by',    person: gov.createdBy,  date: gov.createdOn,      Icon: User,        color: '#60a5fa' },
    { role: 'Promoted by',   person: gov.promotedBy, date: gov.promotionDate,  Icon: TrendingUp,  color: '#a78bfa' },
    { role: 'Approved by',   person: gov.approvedBy, date: gov.approvalDate,   Icon: CheckCircle, color: '#4ade80' },
    { role: 'Last reviewed', person: null,            date: gov.lastReviewDate, Icon: Calendar,    color: '#fbbf24' },
  ]

  const goToPlane = () => navigate(`/truth-plane/${plane.id}`)

  return (
    <SlideOut
      title={plane.name}
      subtitle={plane.desc}
      badges={[
        { label: STATUS_LABELS[plane.status] || plane.status, variant: plane.status === 'verified' ? 'verified' : 'gray' },
        { label: plane.scope, variant: 'gray' },
      ]}
      onClose={onClose}
      actions={
        <button className="btn-primary text-xs py-1.5 px-3 gap-1" onClick={onOpen}>
          <Eye size={12} /> Open
        </button>
      }>

      <TabBar tabs={['Overview', 'Details']} active={tab} onChange={setTab} />

      {/* ══════════ OVERVIEW ══════════ */}
      {tab === 'Overview' && (
        <div className="mt-4 space-y-5">

          {/* AI Summary */}
          <div className="rounded-xl p-4 relative overflow-hidden"
            style={{ background: 'rgba(124,92,252,0.07)', border: '1px solid rgba(124,92,252,0.28)' }}>
            <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-xl"
              style={{ background: 'linear-gradient(90deg, #7c3aed 0%, #3b82f6 50%, #7c3aed 100%)' }} />
            <div className="flex items-start gap-2.5">
              <div className="p-1.5 rounded-lg shrink-0 mt-0.5"
                style={{ background: 'rgba(124,92,252,0.18)' }}>
                <Sparkles size={12} style={{ color: '#a78bfa' }} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-wider mb-1.5"
                  style={{ color: '#a78bfa' }}>AI Summary</p>
                <p className="text-[11px] text-text-secondary leading-relaxed">{aiSum.body}</p>
                {aiSum.rec && (
                  <p className="text-[11px] mt-1.5 font-medium leading-relaxed" style={{ color: '#c4b5fd' }}>
                    → {aiSum.rec}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* A ── What Needs Attention */}
          {attentionItems.length > 0 && (
            <div>
              <p className="section-label mb-2">What Needs Attention</p>
              <div className="space-y-1.5">
                {attentionItems.map((item, i) => (
                  <button key={i}
                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-left transition-all hover:brightness-110"
                    style={{ background: item.bg, border: `1px solid ${item.border}` }}
                    onClick={goToPlane}>
                    {/* priority dot */}
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ background: item.dot }} />
                    <span className="text-xs text-text-secondary flex-1">{item.label}</span>
                    {item.count !== null && (
                      <span className="text-base font-bold shrink-0" style={{ color: item.color }}>{item.count}</span>
                    )}
                    <span className="text-[10px] font-semibold shrink-0" style={{ color: item.color }}>{item.cta}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* B ── Governance Health */}
          <div>
            <p className="section-label mb-2.5">Governance Health</p>
            <div className="rounded-xl p-4 space-y-4"
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}>

              {/* Confidence distribution */}
              <div>
                <p className="text-[10px] text-text-muted mb-2 uppercase tracking-wider">Confidence Distribution</p>
                {[
                  { label: 'High',   pct: highPct, color: '#4ade80' },
                  { label: 'Medium', pct: medPct,  color: '#fbbf24' },
                  { label: 'Low',    pct: lowPct,  color: '#f87171' },
                ].map(({ label, pct, color }) => (
                  <div key={label} className="flex items-center gap-2 mb-1.5">
                    <span className="text-[10px] text-text-muted w-10 shrink-0">{label}</span>
                    <div className="flex-1 h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                      <div className="h-full rounded-full"
                        style={{ width: `${pct}%`, background: color, transition: 'width 0.4s ease' }} />
                    </div>
                    <span className="text-[10px] font-semibold w-7 text-right shrink-0" style={{ color }}>{pct}%</span>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }} />

              {/* Key ratios */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  {
                    label: 'Human Validated',
                    value: `${humanPct}%`,
                    sub: `${100 - humanPct}% AI`,
                    color: '#60a5fa',
                  },
                  {
                    label: 'Audit Complete',
                    value: `${auditPct}%`,
                    sub: auditPct === 100 ? 'All roles filled' : 'Role missing',
                    color: auditPct === 100 ? '#4ade80' : '#fbbf24',
                  },
                  {
                    label: 'Conflict Rate',
                    value: `${conflictRate}%`,
                    sub: conflictRate < 10 ? 'Low' : conflictRate < 25 ? 'Medium' : 'High',
                    color: conflictRate < 10 ? '#4ade80' : conflictRate < 25 ? '#fbbf24' : '#f87171',
                  },
                ].map(({ label, value, sub, color }) => (
                  <div key={label} className="rounded-lg p-2.5 text-center"
                    style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <p className="text-sm font-bold leading-none mb-1" style={{ color }}>{value}</p>
                    <p className="text-[9px] text-text-muted uppercase tracking-wide leading-tight mb-0.5">{label}</p>
                    <p className="text-[9px]" style={{ color: `${color}99` }}>{sub}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* C ── Actions & Shortcuts */}
          <div>
            <p className="section-label mb-2">Actions & Shortcuts</p>
            <div className="space-y-1">
              {[
                { Icon: Eye,      label: 'Open Review Queue',           color: '#60a5fa', action: goToPlane },
                { Icon: Clock,    label: 'View Expiring Facts',          color: '#fbbf24', action: goToPlane },
                { Icon: TrendingUp, label: 'Go to Promotions',          color: '#a78bfa', action: goToPlane },
                { Icon: BookOpen, label: 'Open Knowledge (Truth Packs)', color: '#4ade80', action: () => navigate('/knowledge') },
                { Icon: Activity, label: 'View Activity Log',            color: '#2dd4bf', action: goToPlane },
              ].map(({ Icon, label, color, action }) => (
                <button key={label}
                  className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-left group transition-all hover:brightness-110"
                  style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}
                  onClick={action}>
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: `${color}1a` }}>
                    <Icon size={12} style={{ color }} />
                  </div>
                  <span className="text-xs text-text-secondary flex-1">{label}</span>
                  <ChevronRight size={11} className="text-text-muted transition-opacity opacity-0 group-hover:opacity-60" />
                </button>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ══════════ DETAILS ══════════ */}
      {tab === 'Details' && (
        <div className="mt-4 space-y-5">

          {/* Plane Details */}
          <div>
            <p className="section-label mb-2">Plane Details</p>
            <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
              {[
                ['Owner',             plane.owner],
                ['Domain / Category', plane.tag],
                ['Scope',             plane.scope],
                ['Risk Level',        plane.risk],
                ['Confidence',        `${plane.confidence}%`],
                ['Last Activity',     plane.time],
                ['Last Review Date',  gov.lastReviewDate    || '—'],
                ['Last Validated',    gov.lastValidatedDate || '—'],
              ].map(([k, v], i, arr) => (
                <div key={k}
                  className="flex items-center justify-between px-3 py-2.5"
                  style={{
                    borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                    background: i % 2 === 0 ? 'rgba(255,255,255,0.015)' : 'transparent',
                  }}>
                  <span className="text-[11px] text-text-muted">{k}</span>
                  <span className="text-[11px] font-medium text-text-secondary">{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Governance Thread */}
          <div>
            <p className="section-label mb-2">Governance Thread</p>
            <div className="space-y-1.5">
              {trailRows.map(({ role, person, date, Icon, color }) => {
                const done = person || date
                const summary = done ? [person, date].filter(Boolean).join(' · ') : 'Not completed'
                return (
                  <div key={role}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg"
                    style={{
                      background: done ? `${color}0d` : 'rgba(255,255,255,0.02)',
                      border: `1px solid ${done ? color + '28' : 'rgba(255,255,255,0.06)'}`,
                    }}>
                    <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: done ? `${color}1a` : 'rgba(255,255,255,0.04)' }}>
                      <Icon size={10} style={{ color: done ? color : '#475569' }} />
                    </div>
                    <span className="text-[10px] text-text-muted shrink-0 w-[78px]">{role}</span>
                    <span className={`text-[11px] flex-1 truncate ${done ? 'font-medium text-text-secondary' : 'italic text-text-muted opacity-60'}`}>
                      {summary}
                    </span>
                    <div className="shrink-0">
                      {done
                        ? <CheckCircle size={11} style={{ color: '#4ade80' }} />
                        : <div className="w-3 h-3 rounded-full" style={{ border: '2px solid rgba(255,255,255,0.15)' }} />
                      }
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="mt-3 rounded-xl p-3.5"
              style={{ background: attestP.bg, border: `1px solid ${attestP.border}` }}>
              <div className="flex items-center gap-2 mb-1">
                {isFullyAttested
                  ? <CheckCircle size={13} style={{ color: attestP.color }} />
                  : <AlertTriangle size={13} style={{ color: attestP.color }} />
                }
                <p className="text-[11px] font-semibold" style={{ color: attestP.color }}>
                  {isFullyAttested ? 'Plane is fully attested' : `Attestation incomplete — ${attestText}`}
                </p>
              </div>
              <p className="text-[10px] text-text-muted leading-relaxed">
                {isFullyAttested
                  ? 'All governance roles are filled. This plane maintains full traceability and trust status.'
                  : 'One or more governance roles are unfilled. Complete attestation to maintain Verified status.'}
              </p>
            </div>
          </div>

        </div>
      )}
    </SlideOut>
  )
}

// ── Create Truth Plane Modal ──────────────────────────────────────────────────
function CreateTruthPlaneModal({ onClose }) {
  const [scope, setScope] = useState('')

  const ownersByScope = {
    Workspace:      ['Alex Rivera', 'Jordan Lee', 'Sam Torres'],
    Department:     ['Sales', 'Engineering', 'Legal', 'Finance', 'HR'],
    'Company-wide': ['Legal', 'Finance', 'Executive'],
  }

  return (
    <Modal
      title="Create Truth Plane"
      subtitle="Define a governed space for verified facts. Sources and facts can be added after creation."
      onClose={onClose}
      footer={
        <>
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary">+ Create Truth Plane</button>
        </>
      }>

      <FormField label="Plane Name" required>
        <input
          className="input-base"
          placeholder="e.g. Pricing Policy, Compliance Standards, Contract Terms"
        />
      </FormField>

      <FormField label="Description">
        <textarea
          className="input-base resize-none h-20"
          placeholder="Describe what facts this plane will govern"
        />
      </FormField>

      <div className="grid grid-cols-2 gap-3">
        <FormField label="Domain / Category" required>
          <select className="input-base">
            <option value="">Select domain</option>
            <option>Compliance</option>
            <option>Finance</option>
            <option>Eligibility</option>
            <option>Contracts</option>
            <option>Operations</option>
          </select>
        </FormField>
        <FormField label="Risk Level" required>
          <select className="input-base">
            <option value="">Select risk level</option>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </FormField>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <FormField label="Scope" required>
          <select className="input-base" value={scope} onChange={e => setScope(e.target.value)}>
            <option value="">Select scope</option>
            <option>Workspace</option>
            <option>Department</option>
            <option>Company-wide</option>
          </select>
        </FormField>
        <FormField label="Owner" required>
          <select className="input-base" disabled={!scope}>
            <option value="">{scope ? 'Select owner' : 'Select scope first'}</option>
            {(ownersByScope[scope] || []).map(o => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </FormField>
      </div>

    </Modal>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export default function TruthPlane() {
  const navigate = useNavigate()
  const [selected, setSelected]           = useState(null)
  const [showCreate, setShowCreate]       = useState(false)
  const [showFilters, setShowFilters]     = useState(false)
  const [search, setSearch]               = useState('')
  const [activeFilters, setActiveFilters] = useState(EMPTY_FILTERS)

  const toggleFilter = (dim, val) =>
    setActiveFilters(f => ({
      ...f,
      [dim]: f[dim].includes(val) ? f[dim].filter(x => x !== val) : [...f[dim], val],
    }))

  const setDimFilters = (dim, vals) =>
    setActiveFilters(f => ({ ...f, [dim]: vals }))

  const clearAll = () => setActiveFilters(EMPTY_FILTERS)

  // Map label → data value for status/attestation
  const statusMap = {
    'Verified':      'verified',
    'Pending Review':'pending-review',
    'Expiring Soon': 'expiring-soon',
    'In Proposal':   'in-proposal',
  }
  const attestMap = {
    'Fully attested':    'full',
    'Missing approver':  'missing-approver',
    'Missing promoter':  'missing-promoter',
    'Missing resolver':  'missing-resolver',
  }

  const filtered = truthPlanes.filter(p => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) &&
        !p.desc.toLowerCase().includes(search.toLowerCase())) return false

    const af = activeFilters
    if (af.status.length      && !af.status.map(l => statusMap[l]).includes(p.status)) return false
    if (af.tag.length         && !af.tag.includes(p.tag)) return false
    if (af.scope.length       && !af.scope.includes(p.scope)) return false
    if (af.risk.length        && !af.risk.includes(p.risk)) return false
    if (af.owner.length       && !af.owner.includes(p.owner)) return false
    if (af.attestation.length && !af.attestation.map(l => attestMap[l]).includes(p.attestation)) return false
    if (af.freshness.length   && !matchesFreshness(p, af.freshness)) return false
    if (af.confidence.length  && !af.confidence.includes(confidenceBucket(p.confidence))) return false
    if (af.attention.length) {
      const ok = af.attention.some(a => {
        if (a === 'Expiring')     return p.expiring > 0
        if (a === 'Needs Review') return p.review > 0
        if (a === 'Has Proposals')return p.proposals > 0
        return false
      })
      if (!ok) return false
    }
    if (af.activity.length) {
      const ok = af.activity.some(a => {
        if (a === 'Recently Updated') return p.daysAgo <= 1
        if (a === 'Stale')            return p.daysAgo >= 7
        return false
      })
      if (!ok) return false
    }
    return true
  })

  // Active chip list for display
  const activeChips = FILTER_DIMS.flatMap(d =>
    activeFilters[d.key].map(val => ({ dim: d.key, val }))
  )
  const totalActive = activeChips.length

  return (
    <div className="flex h-full">
      <div className="flex-1 min-w-0 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg" style={{ background: 'rgba(59,130,246,0.15)' }}>
              <Shield size={18} style={{ color: '#60a5fa' }} />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-text-primary">Truth Plane</h1>
              <p className="text-xs text-text-muted">{truthPlanes.length} planes</p>
            </div>
          </div>
          <button className="btn-primary" onClick={() => setShowCreate(true)}>
            <Plus size={14} /> New Truth Plane
          </button>
        </div>

        {/* Search + filter bar */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <SearchBar placeholder="Search planes..." value={search} onChange={setSearch} />

          {/* Quick filters */}
          <QuickFilterDropdown
            label="Status"
            options={['Verified', 'Pending Review', 'Expiring Soon']}
            selected={activeFilters.status}
            onChange={vals => setDimFilters('status', vals)}
          />
          <QuickFilterDropdown
            label="Risk Level"
            options={['Low', 'Medium', 'High']}
            selected={activeFilters.risk}
            onChange={vals => setDimFilters('risk', vals)}
          />
          <QuickFilterDropdown
            label="Attention Required"
            options={['Expiring', 'Needs Review', 'Has Proposals']}
            selected={activeFilters.attention}
            onChange={vals => setDimFilters('attention', vals)}
          />

          {/* All Filters button */}
          <button
            className={`btn-secondary gap-1.5${totalActive > 0 ? ' !border-purple-500/40 !text-purple-400' : ''}`}
            onClick={() => setShowFilters(true)}>
            <Filter size={13} />
            Filters
            {totalActive > 0 && (
              <span className="ml-0.5 flex items-center justify-center w-4 h-4 rounded-full text-[9px] font-bold"
                style={{ background: 'rgba(167,139,250,0.25)', color: '#a78bfa' }}>
                {totalActive}
              </span>
            )}
          </button>

          <div className="flex gap-1 ml-auto">
            <button className="btn-ghost p-2"><LayoutGrid size={14} /></button>
            <button className="btn-ghost p-2"><List size={14} /></button>
          </div>
        </div>

        {/* Active filter chips */}
        {activeChips.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 mb-3">
            {activeChips.map(({ dim, val }) => (
              <button key={`${dim}-${val}`}
                className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full transition-all"
                style={{ background: 'rgba(167,139,250,0.12)', border: '1px solid rgba(167,139,250,0.3)', color: '#a78bfa' }}
                onClick={() => toggleFilter(dim, val)}>
                {val}
                <X size={10} />
              </button>
            ))}
            <button className="text-[11px] text-text-muted hover:text-text-secondary underline ml-1"
              onClick={clearAll}>
              Clear all
            </button>
          </div>
        )}

        {/* Result count */}
        <p className="text-xs text-text-muted mb-3">
          {filtered.length === truthPlanes.length
            ? `${truthPlanes.length} planes`
            : `${filtered.length} of ${truthPlanes.length} planes`}
        </p>

        {/* List */}
        <div className="space-y-2">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-text-muted text-sm">
              No planes match the active filters.
            </div>
          ) : filtered.map(plane => {
            const sc = STATUS_COLORS[plane.status] || STATUS_COLORS['verified']
            const rc = RISK_COLORS[plane.risk]     || RISK_COLORS['Low']
            return (
              <div key={plane.id}
                className={`row-item ${selected?.id === plane.id ? 'selected' : ''}`}
                onClick={() => setSelected(plane)}>
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg mt-0.5 shrink-0" style={{ background: 'rgba(59,130,246,0.12)' }}>
                    <Shield size={16} style={{ color: '#60a5fa' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold text-text-primary">{plane.name}</p>
                      {/* Status badge */}
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                        style={{ background: sc.bg, border: `1px solid ${sc.border}`, color: sc.color }}>
                        {STATUS_LABELS[plane.status]}
                      </span>
                      <div className="ml-auto flex items-center gap-0.5">
                        <button className="btn-ghost p-1.5" onClick={e => { e.stopPropagation(); setSelected(plane) }}>
                          <Eye size={14} />
                        </button>
                        <ThreeDot items={[
                          { label: 'Open Plane', onClick: () => navigate(`/truth-plane/${plane.id}`) },
                          { label: 'Settings',   onClick: () => {} },
                        ]} />
                      </div>
                    </div>
                    <p className="text-xs text-text-muted mt-0.5">{plane.desc}</p>
                    <div className="flex items-center gap-4 mt-2 flex-wrap">
                      <span className="text-xs text-text-muted">Owner: <span className="font-medium text-text-secondary">{plane.owner}</span></span>
                      {/* Scope */}
                      <span className="text-xs text-text-muted">{plane.scope}</span>
                      {/* Tag */}
                      <span className="text-[10px] px-1.5 py-0.5 rounded"
                        style={{ background: 'rgba(255,255,255,0.05)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.08)' }}>
                        {plane.tag}
                      </span>
                      {/* Risk */}
                      <span className="text-[10px] font-medium" style={{ color: rc.color }}>
                        ⬤ {plane.risk} risk
                      </span>
                      {/* Confidence */}
                      <span className="text-[10px] text-text-muted">{plane.confidence}% confidence</span>
                      <span className="flex items-center gap-1 text-xs text-text-muted ml-auto">
                        <Clock size={11} /> {plane.time}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-1.5 text-xs">
                      <span style={{ color: '#a78bfa' }}>⊙ Facts {plane.facts}</span>
                      <span style={{ color: '#fbbf24' }}>⏱ Expiring {plane.expiring}</span>
                      <span style={{ color: '#60a5fa' }}>👁 Review {plane.review}</span>
                      <span style={{ color: '#a78bfa' }}>✦ Proposals {plane.proposals}</span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4 text-xs text-text-muted">
          <span>1–{filtered.length} of {truthPlanes.length} planes</span>
          <div className="flex gap-1">
            <button className="btn-ghost px-2 py-1">‹</button>
            <button className="px-2 py-1 rounded text-xs font-medium" style={{ background: '#3b82f6', color: 'white' }}>1</button>
            <button className="btn-ghost px-2 py-1">›</button>
          </div>
        </div>
      </div>

      {/* Slide-out */}
      {selected && (
        <TruthPlaneSlideOut plane={selected} onClose={() => setSelected(null)}
          onOpen={() => navigate(`/truth-plane/${selected.id}`)}
          onNavigate={() => navigate(`/truth-plane/${selected.id}`)} />
      )}

      {/* Create Truth Plane modal */}
      {showCreate && <CreateTruthPlaneModal onClose={() => setShowCreate(false)} />}

      {/* All Filters panel */}
      {showFilters && (
        <AllFiltersPanel onClose={() => setShowFilters(false)} onClear={clearAll}>

          <FilterSection label="Status">
            {['Verified', 'Pending Review', 'Expiring Soon'].map(opt => (
              <button key={opt}
                className={`filter-pill${activeFilters.status.includes(opt) ? ' active' : ''}`}
                onClick={() => toggleFilter('status', opt)}>
                {opt}
              </button>
            ))}
          </FilterSection>

          <FilterSection label="Risk Level">
            {['Low', 'Medium', 'High'].map(opt => (
              <button key={opt}
                className={`filter-pill${activeFilters.risk.includes(opt) ? ' active' : ''}`}
                onClick={() => toggleFilter('risk', opt)}>
                {opt}
              </button>
            ))}
          </FilterSection>

          <FilterSection label="Lifecycle Signals">
            {['Expiring', 'Needs Review', 'Has Proposals'].map(opt => (
              <button key={opt}
                className={`filter-pill${activeFilters.attention.includes(opt) ? ' active' : ''}`}
                onClick={() => toggleFilter('attention', opt)}>
                {opt}
              </button>
            ))}
          </FilterSection>

          <FilterSection label="Ownership">
            <p className="text-[10px] text-text-muted w-full" style={{ marginBottom: '-4px' }}>Owner</p>
            {['Sales', 'Engineering', 'Legal', 'Finance', 'HR'].map(opt => (
              <button key={opt}
                className={`filter-pill${activeFilters.owner.includes(opt) ? ' active' : ''}`}
                onClick={() => toggleFilter('owner', opt)}>
                {opt}
              </button>
            ))}
            <p className="text-[10px] text-text-muted w-full mt-2" style={{ marginBottom: '-4px' }}>Department / Workspace</p>
            {['Workspace', 'Department', 'Company-wide'].map(opt => (
              <button key={opt}
                className={`filter-pill${activeFilters.scope.includes(opt) ? ' active' : ''}`}
                onClick={() => toggleFilter('scope', opt)}>
                {opt}
              </button>
            ))}
          </FilterSection>

          <FilterSection label="Activity">
            {['Recently Updated', 'Stale'].map(opt => (
              <button key={opt}
                className={`filter-pill${activeFilters.activity.includes(opt) ? ' active' : ''}`}
                onClick={() => toggleFilter('activity', opt)}>
                {opt}
              </button>
            ))}
          </FilterSection>

        </AllFiltersPanel>
      )}
    </div>
  )
}
