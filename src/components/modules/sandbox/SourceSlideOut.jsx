import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import {
  FileText, ExternalLink, X, Sparkles, AlertTriangle, CheckCircle,
  Shield, Clock, Eye, Layers, ChevronDown,
} from 'lucide-react'
import { bundles, claims, govTimeline } from '../../../data/mock'
import clsx from 'clsx'

// ── Governance Timeline & Traceability ────────────────────────────────────────
const TL_ICON = {
  file:   FileText,
  spark:  Sparkles,
  alert:  AlertTriangle,
  eye:    Eye,
  check:  CheckCircle,
  shield: Shield,
}

export function GovernanceTimeline({ events }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-5">
        <div className="p-1.5 rounded-lg" style={{ background: 'rgba(167,139,250,0.12)' }}>
          <Shield size={12} style={{ color: '#a78bfa' }} />
        </div>
        <p className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
          Governance Timeline &amp; Traceability
        </p>
      </div>

      <div className="relative">
        {events.map((evt, i) => {
          const Icon = TL_ICON[evt.icon] || FileText
          const isLast = i === events.length - 1
          const isActive = evt.status === 'active'

          return (
            <div key={evt.id} className="flex gap-3">
              {/* Icon column */}
              <div className="flex flex-col items-center shrink-0">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{
                    background: `${evt.color}15`,
                    border: `1.5px solid ${evt.color}${isActive ? 'cc' : '44'}`,
                    boxShadow: isActive ? `0 0 10px ${evt.color}30` : 'none',
                  }}
                >
                  <Icon size={13} style={{ color: evt.color }} />
                </div>
                {!isLast && (
                  <div className="w-px flex-1 mt-1" style={{ background: 'rgba(255,255,255,0.07)', minHeight: 24 }} />
                )}
              </div>

              {/* Content */}
              <div className={clsx('flex-1 min-w-0', isLast ? 'pb-0' : 'pb-5')}>
                <div className="flex items-start justify-between gap-2 -mt-0.5">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <p className="text-xs font-semibold text-text-primary">{evt.title}</p>
                    {isActive && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full font-semibold"
                        style={{ background: 'rgba(251,191,36,0.15)', color: '#fbbf24' }}>
                        Pending
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-text-muted shrink-0 whitespace-nowrap">{evt.time}</span>
                </div>
                <p className="text-[11px] text-text-muted leading-relaxed mt-0.5">{evt.desc}</p>
                <div className="mt-1.5">
                  {evt.actor === 'System' ? (
                    <span className="text-[10px] px-2 py-0.5 rounded-md font-medium inline-block"
                      style={{ background: 'rgba(100,116,139,0.1)', color: '#64748b', border: '1px solid rgba(100,116,139,0.15)' }}>
                      ⚙ System
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px]" style={{ color: '#a78bfa' }}>
                      <span className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold"
                        style={{ background: 'rgba(167,139,250,0.2)', color: '#a78bfa' }}>
                        {evt.actor.split(' ').map(w => w[0]).join('')}
                      </span>
                      {evt.actor}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Overview Tab ──────────────────────────────────────────────────────────────
function OverviewTab({ doc }) {
  const riskColor = { High: '#f87171', Medium: '#fbbf24', Low: '#4ade80' }

  const stats = [
    { label: 'Bundles',   value: doc.bundles,   Icon: Layers,       color: '#a78bfa', bg: 'rgba(167,139,250,0.12)' },
    { label: 'Claims',    value: doc.claims,    Icon: Sparkles,     color: '#fb923c', bg: 'rgba(251,146,60,0.12)'  },
    { label: 'Promoted',  value: doc.promoted,  Icon: CheckCircle,  color: '#4ade80', bg: 'rgba(74,222,128,0.12)'  },
    { label: 'Sensitive', value: doc.sensitive, Icon: Shield,       color: '#f87171', bg: 'rgba(248,113,113,0.12)' },
  ]

  return (
    <div className="space-y-4">
      {/* AI Summary */}
      <div className="glass-card p-4">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles size={13} style={{ color: '#a78bfa' }} />
          <p className="text-xs font-semibold text-text-secondary">AI Summary</p>
        </div>
        <p className="text-xs text-text-secondary leading-relaxed mb-3">{doc.aiSummary}</p>
        <ul className="space-y-2">
          {doc.aiPoints.map((pt, i) => (
            <li key={i} className="flex items-start gap-2 text-[11px] text-text-muted">
              <span className="w-1.5 h-1.5 rounded-full shrink-0 mt-1.5" style={{ background: '#60a5fa' }} />
              {pt}
            </li>
          ))}
        </ul>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-2">
        {stats.map(({ label, value, Icon, color, bg }) => (
          <div key={label} className="rounded-xl p-3 text-center" style={{ background: bg, border: `1px solid ${color}25` }}>
            <div className="flex justify-center mb-1.5">
              <Icon size={16} style={{ color }} />
            </div>
            <p className="text-lg font-bold" style={{ color }}>{value}</p>
            <p className="text-[10px] text-text-muted mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Next Best Action */}
      <div className="rounded-xl p-4"
        style={{ background: 'linear-gradient(135deg, rgba(124,92,252,0.12), rgba(59,130,246,0.08))', border: '1px solid rgba(124,92,252,0.22)' }}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Sparkles size={12} style={{ color: '#a78bfa' }} />
            <span className="text-xs font-semibold text-text-secondary">Next Best Action</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-medium"
              style={{
                background: `${riskColor[doc.nextAction.risk]}18`,
                color: riskColor[doc.nextAction.risk],
                border: `1px solid ${riskColor[doc.nextAction.risk]}35`,
              }}>
              {doc.nextAction.risk} Risk
            </span>
          </div>
          <button className="btn-primary text-[11px] py-1 px-2.5">{doc.nextAction.label}</button>
        </div>
        <p className="text-[11px] text-text-muted leading-relaxed">{doc.nextAction.desc}</p>
      </div>

      {/* Alerts */}
      {doc.alerts.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <p className="text-xs font-semibold text-text-secondary">Alerts</p>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-medium"
              style={{ background: 'rgba(248,113,113,0.12)', color: '#f87171', border: '1px solid rgba(248,113,113,0.25)' }}>
              High Risk
            </span>
          </div>
          <div className="space-y-1.5">
            {doc.alerts.map((a, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg"
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex items-center gap-2">
                  <AlertTriangle size={13} style={{ color: a.risk === 'High' ? '#f87171' : '#fbbf24' }} />
                  <span className="text-xs text-text-secondary">{a.type}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                    style={{
                      background: a.risk === 'High' ? 'rgba(248,113,113,0.12)' : 'rgba(251,191,36,0.12)',
                      color: a.risk === 'High' ? '#f87171' : '#fbbf24',
                    }}>
                    {a.risk} Risk
                  </span>
                  <ChevronDown size={13} className="text-text-muted" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Bundles Tab ───────────────────────────────────────────────────────────────
function BundlesTab() {
  return (
    <div className="space-y-2">
      {bundles.map(b => {
        const isPromoted = b.status === 'promoted'
        return (
          <div key={b.id} className="rounded-xl p-4"
            style={{
              background: isPromoted ? 'rgba(34,211,238,0.05)' : 'rgba(255,255,255,0.02)',
              border: `1px solid ${isPromoted ? 'rgba(34,211,238,0.25)' : 'rgba(255,255,255,0.07)'}`,
            }}>
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg shrink-0" style={{ background: 'rgba(124,92,252,0.12)' }}>
                <Layers size={15} style={{ color: '#a78bfa' }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded"
                    style={{ background: 'rgba(34,211,238,0.1)', color: '#22d3ee', border: '1px solid rgba(34,211,238,0.2)' }}>
                    {b.id}
                  </span>
                  <p className="text-xs font-semibold text-text-primary flex-1">{b.name}</p>
                  {isPromoted ? (
                    <span className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full"
                      style={{ background: 'rgba(34,211,238,0.12)', color: '#22d3ee', border: '1px solid rgba(34,211,238,0.25)' }}>
                      <CheckCircle size={10} /> PROMOTED
                    </span>
                  ) : (
                    <button className="btn-primary text-[11px] py-1 px-2.5 gap-1 flex items-center">
                      <Sparkles size={10} /> Promote
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-text-muted mb-2">{b.desc}</p>
                <div className="flex items-center gap-3 text-[10px] text-text-muted">
                  {isPromoted ? (
                    <span>Promoted by Sarah Chen · 2 months ago</span>
                  ) : (
                    <>
                      <span className="flex items-center gap-1" style={{ color: '#fb923c' }}>
                        <Sparkles size={10} /> Claims {b.claims}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={10} /> {b.time}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ── Claims Tab ────────────────────────────────────────────────────────────────
function ClaimsTab() {
  const statusStyle = {
    promotable: { bg: 'rgba(34,197,94,0.14)',  color: '#4ade80' },
    promoted:   { bg: 'rgba(34,197,94,0.14)',  color: '#4ade80' },
    conflict:   { bg: 'rgba(239,68,68,0.14)',   color: '#f87171' },
    review:     { bg: 'rgba(251,191,36,0.14)',  color: '#fbbf24' },
  }
  const polarityColor = p => p === '+' ? '#4ade80' : p === '−' ? '#f87171' : '#94a3b8'

  return (
    <div className="space-y-2">
      {claims.map(c => {
        const ss = statusStyle[c.status] || statusStyle.review
        const isPromoted = c.status === 'promoted'
        return (
          <div key={c.id} className="rounded-xl p-4"
            style={{
              background: isPromoted ? 'rgba(34,197,94,0.04)' : 'rgba(255,255,255,0.02)',
              border: `1px solid ${isPromoted ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.07)'}`,
            }}>
            <div className="flex items-start gap-2.5">
              <div className="p-1.5 rounded-lg shrink-0" style={{ background: ss.bg }}>
                <FileText size={14} style={{ color: ss.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-[10px] font-mono text-text-muted">{c.id}</span>
                  {!isPromoted && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
                      style={{ background: 'rgba(34,211,238,0.1)', color: '#22d3ee', border: '1px solid rgba(34,211,238,0.2)' }}>
                      Promotable
                    </span>
                  )}
                  <p className="text-xs font-semibold text-text-primary flex-1 min-w-0">{c.title}</p>
                  {isPromoted ? (
                    <span className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0"
                      style={{ background: 'rgba(34,197,94,0.12)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.25)' }}>
                      <CheckCircle size={10} /> PROMOTED
                    </span>
                  ) : (
                    <button className="btn-primary text-[11px] py-1 px-2.5 gap-1 flex items-center shrink-0">
                      <Sparkles size={10} /> Promote
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-2 text-[10px] text-text-muted flex-wrap mt-0.5">
                  <span>Section: {c.section}</span>
                  <span>·</span>
                  <span>¶ {c.subsection}</span>
                  <span className="w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] font-bold"
                    style={{ background: `${polarityColor(c.polarity)}18`, border: `1px solid ${polarityColor(c.polarity)}44`, color: polarityColor(c.polarity) }}>
                    {c.polarity === '+' ? '+' : c.polarity === '−' ? '−' : '·'}
                  </span>
                  <span style={{ color: '#60a5fa' }}>{c.confidence}%</span>
                  <span className="px-1.5 py-0.5 rounded font-mono"
                    style={{ background: 'rgba(124,92,252,0.1)', color: '#a78bfa' }}>
                    BU-001
                  </span>
                </div>
                {isPromoted && (
                  <p className="text-[10px] text-text-muted mt-1">
                    Promoted by <span style={{ color: '#a78bfa' }}>Sarah Chen</span> · 2 months ago
                  </p>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ── Details Tab ───────────────────────────────────────────────────────────────
function DetailsTab({ doc }) {
  const statusLabel = { processed: 'Completed', failed: 'Failed', processing: 'In Progress' }
  const meta = [
    ['File Name', doc.name],
    ['File Type', 'PDF Document'],
    ['Source Drive', 'Sales Drive'],
    ['Ingested', 'Apr 12, 2026 · 09:14 AM'],
    ['Last Modified', 'Apr 12, 2026 · 10:05 AM'],
    ['Processing Status', statusLabel[doc.status] || doc.status],
    ['Claims Extracted', `${doc.claims} claims`],
    ['Sensitive Data', doc.sensitive > 0 ? `Detected (${doc.sensitive} instances)` : 'None'],
  ]

  return (
    <div className="space-y-5">
      <div className="glass-card p-4">
        <p className="text-xs font-semibold text-text-secondary mb-3">Document Metadata</p>
        <div className="space-y-0">
          {meta.map(([k, v]) => (
            <div key={k} className="flex justify-between py-2 text-xs"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <span className="text-text-muted">{k}</span>
              <span className="font-medium text-text-secondary text-right max-w-[55%] truncate">{v}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card p-4">
        <GovernanceTimeline events={govTimeline} />
      </div>
    </div>
  )
}

// ── Main Slide-out ────────────────────────────────────────────────────────────
export default function SourceSlideOut({ doc, onClose }) {
  const [tab, setTab] = useState('Overview')

  const tabs = [
    { id: 'Overview', label: 'Overview' },
    { id: 'Bundles',  label: 'Bundles', count: doc.bundles },
    { id: 'Claims',   label: 'Claims',  count: doc.claims  },
    { id: 'Details',  label: 'Details' },
  ]

  return createPortal(
    <>
      <div className="fixed inset-0" style={{ background: 'rgba(0,0,0,0.45)', zIndex: 9998 }} onClick={onClose} />
      <div className="fixed top-0 right-0 h-screen flex flex-col"
        style={{ width: 560, zIndex: 9999, background: 'var(--slideout-bg)', borderLeft: '1px solid var(--slideout-border)' }}>

        {/* Header */}
        <div className="shrink-0 p-5 pb-0" style={{ borderBottom: '1px solid var(--slideout-border)' }}>
          <div className="flex items-start gap-3 mb-3">
            <div className="p-2.5 rounded-xl shrink-0"
              style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.2)' }}>
              <FileText size={18} style={{ color: '#f87171' }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-text-primary leading-snug truncate">{doc.name}</p>
              <span className="inline-flex mt-1 text-[10px] px-2 py-0.5 rounded-full font-medium"
                style={{ background: 'rgba(124,92,252,0.12)', color: '#a78bfa', border: '1px solid rgba(124,92,252,0.2)' }}>
                Sandbox
              </span>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button className="flex items-center gap-1 text-[11px] font-medium px-2.5 py-1.5 rounded-lg transition-all"
                style={{ background: 'rgba(124,92,252,0.1)', color: '#a78bfa', border: '1px solid rgba(124,92,252,0.2)' }}>
                <ExternalLink size={11} /> Go to Source Sandbox Details
              </button>
              <button className="btn-ghost p-1.5 rounded-lg"><FileText size={14} /></button>
              <button className="btn-ghost p-1.5 rounded-lg" onClick={onClose}><X size={14} /></button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-0.5">
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium transition-all"
                style={{
                  color: tab === t.id ? 'var(--text-primary)' : 'var(--text-muted)',
                  borderBottom: tab === t.id ? '2px solid #7c5cfc' : '2px solid transparent',
                }}>
                {t.label}
                {t.count !== undefined && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full min-w-[18px] text-center"
                    style={{
                      background: tab === t.id ? 'rgba(124,92,252,0.15)' : 'rgba(255,255,255,0.06)',
                      color: tab === t.id ? '#a78bfa' : 'var(--text-muted)',
                    }}>
                    {t.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {tab === 'Overview' && <OverviewTab doc={doc} />}
          {tab === 'Bundles'  && <BundlesTab />}
          {tab === 'Claims'   && <ClaimsTab />}
          {tab === 'Details'  && <DetailsTab doc={doc} />}
        </div>
      </div>
    </>,
    document.body
  )
}
