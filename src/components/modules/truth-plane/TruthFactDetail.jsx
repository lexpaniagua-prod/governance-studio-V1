import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Shield, ChevronRight, Sparkles, AlertTriangle, Zap } from 'lucide-react'
import { truthPlanes, truthFacts, factGovernance } from '../../../data/mock'
import { Badge, Chip, TabBar } from '../../ui/index'
import { GovernanceTimeline } from './GovernanceTrail'
import ProposeChangeModal from './ProposeChangeModal'
import BreakGlassModal from './BreakGlassModal'
import clsx from 'clsx'

// ── Shared evidence data (same as TruthPlaneDetail) ───────────────────────────
const EVIDENCE_BY_FACT = {
  'TF-0001': [
    { id: 'CL-0041', title: 'Uptime SLA – 99.9% Monthly Guarantee',    doc: 'Q1 Sales Contract - Acme Corp',        bundle: 'BDL-003', confidence: 97, risk: 'Low',    polarity: '+' },
    { id: 'CL-0042', title: 'Monthly Measurement Period Definition',     doc: 'Q1 Sales Contract - Acme Corp',        bundle: 'BDL-003', confidence: 95, risk: 'Low',    polarity: '+' },
    { id: 'CL-0043', title: 'Maintenance Window Exclusion Clause',       doc: 'Infrastructure Services Agreement v2', bundle: 'BDL-007', confidence: 91, risk: 'Medium', polarity: '−' },
  ],
  'TF-0002': [
    { id: 'CL-0011', title: 'Annual Contract Value $120,000',            doc: 'Q1 Sales Contract - Acme Corp',        bundle: 'BDL-001', confidence: 98, risk: 'Low',    polarity: '+' },
    { id: 'CL-0012', title: 'Quarterly Installment Schedule',            doc: 'Q1 Sales Contract - Acme Corp',        bundle: 'BDL-001', confidence: 96, risk: 'Low',    polarity: '+' },
  ],
  'TF-0003': [
    { id: 'CL-0021', title: 'Auto-Renewal Default Clause',               doc: 'Master Services Agreement 2024',       bundle: 'BDL-002', confidence: 94, risk: 'Medium', polarity: '−' },
    { id: 'CL-0022', title: '60-Day Non-Renewal Notice Requirement',     doc: 'Master Services Agreement 2024',       bundle: 'BDL-002', confidence: 92, risk: 'Medium', polarity: '+' },
    { id: 'CL-0023', title: 'Successive One-Year Term Definition',       doc: 'Enterprise Contract Template v3',      bundle: 'BDL-005', confidence: 89, risk: 'Medium', polarity: '+' },
    { id: 'CL-0024', title: 'Written Notice Delivery Method',            doc: 'Enterprise Contract Template v3',      bundle: 'BDL-005', confidence: 85, risk: 'Medium', polarity: '+' },
    { id: 'CL-0025', title: 'Expiration Date Anchor for Notice Window',  doc: 'Legal Addendum B – Renewals',          bundle: 'BDL-009', confidence: 82, risk: 'High',   polarity: '−' },
  ],
  'TF-0004': [
    { id: 'CL-0031', title: 'Net-30 Payment Term – Enterprise',          doc: 'Payment Terms Policy 2024',            bundle: 'BDL-004', confidence: 90, risk: 'High',   polarity: '+' },
    { id: 'CL-0032', title: '1.5% Monthly Late Payment Penalty',         doc: 'Payment Terms Policy 2024',            bundle: 'BDL-004', confidence: 88, risk: 'High',   polarity: '−' },
    { id: 'CL-0033', title: 'Maximum Statutory Rate Override',           doc: 'Finance Compliance Addendum',          bundle: 'BDL-006', confidence: 86, risk: 'High',   polarity: '−' },
    { id: 'CL-0034', title: 'Net-15 Payment Term – SMB',                 doc: 'SMB Contract Template v2',             bundle: 'BDL-008', confidence: 83, risk: 'Medium', polarity: '+' },
  ],
  'TF-0005': [
    { id: 'CL-0051', title: '24/7 Technical Support Availability',       doc: 'Support SLA Agreement 2023',           bundle: 'BDL-010', confidence: 87, risk: 'Medium', polarity: '+' },
  ],
  'TF-0006': [
    { id: 'CL-0061', title: 'EU-Only Data Center Residency',             doc: 'GDPR Data Processing Agreement',       bundle: 'BDL-011', confidence: 97, risk: 'Low',    polarity: '+' },
    { id: 'CL-0062', title: 'GDPR Compliance Data Sovereignty Clause',   doc: 'GDPR Data Processing Agreement',       bundle: 'BDL-011', confidence: 96, risk: 'Low',    polarity: '+' },
    { id: 'CL-0063', title: 'Cross-Border Transfer Restriction',         doc: 'EU Standard Contractual Clauses 2024', bundle: 'BDL-012', confidence: 95, risk: 'Low',    polarity: '+' },
    { id: 'CL-0064', title: 'Data Sovereignty Audit Rights',             doc: 'GDPR Data Processing Agreement',       bundle: 'BDL-011', confidence: 91, risk: 'Low',    polarity: '+' },
    { id: 'CL-0065', title: 'Controller-Processor Responsibility Scope', doc: 'EU Standard Contractual Clauses 2024', bundle: 'BDL-012', confidence: 88, risk: 'Medium', polarity: '+' },
    { id: 'CL-0066', title: 'Incident Notification Window for Breaches', doc: 'EU Standard Contractual Clauses 2024', bundle: 'BDL-012', confidence: 84, risk: 'Medium', polarity: '−' },
  ],
}

function ConfidenceBar({ value, risk }) {
  const color = risk === 'Low' ? '#4ade80' : risk === 'Medium' ? '#fbbf24' : '#f87171'
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 rounded-full overflow-hidden" style={{ height: 5, background: 'rgba(255,255,255,0.08)' }}>
        <div className="h-full rounded-full" style={{ width: `${value}%`, background: color }} />
      </div>
      <span className="text-xs font-semibold w-8 text-right" style={{ color }}>{value}%</span>
    </div>
  )
}

export default function TruthFactDetail() {
  const navigate = useNavigate()
  const { id: planeId, factId } = useParams()
  const [tab, setTab] = useState('Overview')
  const [showPropose, setShowPropose]       = useState(false)
  const [showBreakGlass, setShowBreakGlass] = useState(false)

  const plane = truthPlanes.find(p => p.id === planeId) || truthPlanes[0]
  const fact  = truthFacts.find(f => f.id === factId)   || truthFacts[0]
  const gov   = factGovernance[fact.id] || {}
  const evidence = (EVIDENCE_BY_FACT[fact.id] || []).sort((a, b) => b.confidence - a.confidence)

  const sigColor = (c) => ({
    green:  ['rgba(34,197,94,0.08)',  'rgba(34,197,94,0.2)',  '#4ade80'],
    amber:  ['rgba(245,158,11,0.08)', 'rgba(245,158,11,0.2)', '#fbbf24'],
    red:    ['rgba(239,68,68,0.08)',  'rgba(239,68,68,0.2)',  '#f87171'],
    purple: ['rgba(124,92,252,0.08)', 'rgba(124,92,252,0.2)', '#a78bfa'],
  }[c] || ['rgba(71,85,105,0.15)', 'rgba(71,85,105,0.3)', '#94a3b8'])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-text-muted mb-5">
        <button onClick={() => navigate('/intelligence-library')} className="hover:text-text-secondary">Intelligence Library</button>
        <ChevronRight size={12} className="opacity-40" />
        <button onClick={() => navigate('/truth-plane')} className="hover:text-text-secondary">Truth Plane</button>
        <ChevronRight size={12} className="opacity-40" />
        <button onClick={() => navigate(`/truth-plane/${plane.id}`)} className="hover:text-text-secondary">{plane.name}</button>
        <ChevronRight size={12} className="opacity-40" />
        <span className="text-text-secondary font-medium truncate max-w-[200px]">{fact.title}</span>
      </nav>

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl shrink-0" style={{ background: 'rgba(59,130,246,0.15)' }}>
            <Shield size={20} style={{ color: '#60a5fa' }} />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h1 className="text-xl font-bold text-text-primary">{fact.title}</h1>
              <Badge variant={fact.status}>
                {fact.status === 'verified' ? '✓ Verified' : fact.status === 'pending' ? '⏳ Pending' : '⚠ Conflict'}
              </Badge>
              <span className="text-xs px-2 py-0.5 rounded" style={{ background: 'rgba(124,92,252,0.1)', color: '#a78bfa', border: '1px solid rgba(124,92,252,0.2)' }}>{fact.tag}</span>
              <span className="text-xs font-mono text-text-muted">{fact.id}</span>
            </div>
            <p className="text-sm text-text-muted">{plane.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button className="btn-secondary gap-1.5" onClick={() => setShowBreakGlass(true)}
            style={{ background: 'rgba(185,28,28,0.15)', border: '1px solid rgba(239,68,68,0.4)', color: '#f87171' }}>
            <Zap size={13} /> Break Glass
          </button>
        </div>
      </div>

      {/* Truth statement */}
      <div className="rounded-xl p-5 mb-6" style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.25)' }}>
        <div className="flex items-center gap-1.5 mb-3">
          <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0" style={{ background: '#3b82f6' }}>
            <span className="text-[8px] text-white font-bold">V</span>
          </div>
          <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#60a5fa' }}>Verified Truth Statement</p>
        </div>
        <p className="text-base font-medium text-text-primary leading-relaxed">{fact.text?.replace(/"/g, '')}</p>
      </div>

      {/* Tabs */}
      <div className="tab-bar mb-6">
        {['Overview', `Evidence (${evidence.length})`, 'Governance Thread'].map(t => (
          <button key={t} className={clsx('tab-btn', tab === t && 'active')} onClick={() => setTab(t)}>{t}</button>
        ))}
      </div>

      {/* ── OVERVIEW ── */}
      {tab === 'Overview' && (
        <div className="space-y-5">
          {/* Signals */}
          <div>
            <p className="section-label mb-3">Signals</p>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Confidence', value: `${fact.confidence}%`, color: fact.confidence >= 90 ? 'green' : fact.confidence >= 70 ? 'amber' : 'red' },
                { label: 'Risk',       value: fact.risk,             color: fact.risk === 'Low' ? 'green' : fact.risk === 'Medium' ? 'amber' : 'red' },
                { label: 'Polarity',   value: fact.polarity === '+' ? 'Positive' : 'Negative', color: fact.polarity === '+' ? 'green' : 'red' },
                { label: 'Valid From', value: 'Jan 10, 2024',        color: 'purple' },
                { label: 'Valid To',   value: fact.expired ? 'Expired' : 'Dec 31, 2025', color: fact.expired ? 'red' : 'purple' },
                { label: 'Last Review',value: fact.time,             color: 'purple' },
              ].map(({ label, value, color }) => {
                const c = sigColor(color)
                return (
                  <div key={label} className="rounded-xl p-4" style={{ background: c[0], border: `1px solid ${c[1]}` }}>
                    <p className="text-[10px] text-text-muted mb-1.5">{label}</p>
                    <p className="text-sm font-bold" style={{ color: c[2] }}>{value}</p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Expiry alert */}
          {fact.expired && (
            <div className="flex items-start gap-3 rounded-xl p-4" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)' }}>
              <AlertTriangle size={16} style={{ color: '#f87171' }} className="shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold" style={{ color: '#f87171' }}>Fact has expired</p>
                <p className="text-xs text-text-muted mt-0.5">{fact.expiry}. This fact should be reviewed and renewed or retired.</p>
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="glass-card divide-y" style={{ '--tw-divide-opacity': 1 }}>
            {[
              ['Owner',       plane.owner],
              ['Scope',       plane.scope],
              ['Sources',     `${fact.sources} source documents`],
              ['Proposals',   `${fact.proposals} open proposals`],
              ['State',       fact.status === 'verified' ? 'Verified' : fact.status === 'pending' ? 'Pending Review' : 'In Conflict'],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between items-center px-4 py-3">
                <span className="text-xs text-text-muted">{k}</span>
                <span className="text-xs font-medium text-text-secondary">{v}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── EVIDENCE ── */}
      {tab.startsWith('Evidence') && (
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-1">
            <p className="section-label">Source Claims</p>
            <span className="text-xs text-text-muted">Ranked by confidence</span>
          </div>
          {evidence.length === 0 ? (
            <p className="text-sm text-text-muted italic py-8 text-center">No evidence linked to this fact.</p>
          ) : evidence.map((c, i) => (
            <div key={c.id} className="glass-card p-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0 text-[10px] font-bold mt-0.5"
                  style={{ background: i === 0 ? 'rgba(167,139,250,0.2)' : 'rgba(255,255,255,0.06)', color: i === 0 ? '#a78bfa' : '#64748b', border: `1px solid ${i === 0 ? 'rgba(167,139,250,0.3)' : 'rgba(255,255,255,0.1)'}` }}>
                  #{i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <span className="text-[10px] font-mono text-text-muted">{c.id}</span>
                    <p className="text-sm font-semibold text-text-primary">{c.title}</p>
                  </div>
                  <ConfidenceBar value={c.confidence} risk={c.risk} />
                  <div className="flex items-center gap-3 mt-2 flex-wrap">
                    <span className="text-xs text-text-muted">{c.doc}</span>
                    <span className="text-[11px] px-2 py-0.5 rounded"
                      style={{ background: 'rgba(124,92,252,0.1)', color: '#a78bfa', border: '1px solid rgba(124,92,252,0.2)' }}>
                      {c.bundle}
                    </span>
                    <Chip color={c.risk === 'Low' ? 'green' : c.risk === 'Medium' ? 'amber' : 'red'}>{c.risk}</Chip>
                    <span className="text-xs font-semibold ml-auto" style={{ color: c.polarity === '+' ? '#4ade80' : '#f87171' }}>
                      {c.polarity === '+' ? '+ Positive' : '− Negative'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── GOVERNANCE THREAD ── */}
      {tab === 'Governance Thread' && (
        <div className="space-y-6">
          <GovernanceTimeline gov={gov} />
        </div>
      )}

      {/* Propose Change modal */}
      {showPropose && (
        <ProposeChangeModal
          fact={fact}
          onClose={() => setShowPropose(false)}
          onSubmit={() => {}} />
      )}

      {/* Break Glass modal */}
      {showBreakGlass && (
        <BreakGlassModal
          fact={fact}
          onClose={() => setShowBreakGlass(false)}
          onSubmit={() => setShowBreakGlass(false)} />
      )}
    </div>
  )
}
