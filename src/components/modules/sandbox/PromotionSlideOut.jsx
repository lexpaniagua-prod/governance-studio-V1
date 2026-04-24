import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import {
  Sparkles, X, CheckCircle, AlertTriangle, TrendingUp,
  Database, Tag, Shield, Calendar, User, Pencil, FileText, Clock,
} from 'lucide-react'
import { pkgClaims, claims } from '../../../data/mock'
import { Badge } from '../../ui/index'
import clsx from 'clsx'

// ── Overview Tab ──────────────────────────────────────────────────────────────
function OverviewTab({ pkg }) {
  const stats = [
    { label: 'Total Claims',  value: pkg.claims,        Icon: Sparkles,       color: '#a78bfa', bg: 'rgba(167,139,250,0.12)' },
    { label: 'Facts Created', value: pkg.factsCreated,  Icon: CheckCircle,    color: '#4ade80', bg: 'rgba(74,222,128,0.12)'  },
    { label: 'Facts Changed', value: pkg.factsChanged,  Icon: TrendingUp,     color: '#60a5fa', bg: 'rgba(96,165,250,0.12)'  },
    { label: 'Failed',        value: pkg.failed,        Icon: AlertTriangle,  color: '#f87171', bg: 'rgba(248,113,113,0.12)' },
  ]

  return (
    <div className="space-y-3">
      {/* Target Truth Plane */}
      <div className="glass-card p-4 flex items-center gap-3">
        <div className="p-2.5 rounded-xl shrink-0"
          style={{ background: 'rgba(96,165,250,0.12)', border: '1px solid rgba(96,165,250,0.2)' }}>
          <Database size={18} style={{ color: '#60a5fa' }} />
        </div>
        <div>
          <p className="text-[10px] text-text-muted mb-0.5">Target Truth Plane</p>
          <p className="text-sm font-semibold text-text-primary">{pkg.target}</p>
        </div>
      </div>

      {/* 2×2 Stats */}
      <div className="grid grid-cols-2 gap-2">
        {stats.map(({ label, value, Icon, color, bg }) => (
          <div key={label} className="rounded-xl p-4" style={{ background: bg, border: `1px solid ${color}20` }}>
            <div className="flex items-center gap-1.5 mb-2">
              <Icon size={13} style={{ color }} />
              <p className="text-xs font-medium" style={{ color }}>{label}</p>
            </div>
            <p className="text-2xl font-bold" style={{ color }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Tags */}
      <div className="glass-card p-4">
        <div className="flex items-center gap-2 mb-2.5">
          <Tag size={13} style={{ color: '#a78bfa' }} />
          <p className="text-xs font-semibold text-text-secondary">Tags</p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {pkg.tags.map(t => (
            <span key={t} className="text-xs px-2.5 py-1 rounded-full"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-secondary)' }}>
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Audit Information */}
      <div className="glass-card p-4">
        <div className="flex items-center gap-2 mb-3">
          <Shield size={13} style={{ color: '#a78bfa' }} />
          <p className="text-xs font-semibold text-text-secondary">Audit Information</p>
        </div>
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 10 }}>
            <span className="flex items-center gap-1.5 text-text-muted">
              <Calendar size={12} /> Created
            </span>
            <span className="font-medium text-text-secondary">{pkg.time}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 text-text-muted">
              <User size={12} /> Created By
            </span>
            <div className="flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white"
                style={{ background: 'linear-gradient(135deg, #a78bfa, #60a5fa)' }}>
                {pkg.owner.split(' ').map(w => w[0]).join('')}
              </span>
              <span className="font-medium text-text-secondary">{pkg.owner}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Claims Tab ────────────────────────────────────────────────────────────────
const CLAIM_STATUS = {
  promoted:  { variant: 'promoted',  label: 'Promoted'   },
  'in-review':{ variant: 'in-review', label: 'In Review'  },
  rejected:  { variant: 'rejected',  label: 'Rejected'   },
  'in-truth':{ variant: 'in-truth',  label: 'In Truth'   },
  queue:     { variant: 'queue',     label: 'Queue'       },
}

function ClaimsTab() {
  const polarityColor = p => p === '+' ? '#4ade80' : p === '−' ? '#f87171' : '#94a3b8'
  const riskColor = r => ({ Low: '#4ade80', Medium: '#fbbf24', High: '#f87171' }[r] || '#94a3b8')

  return (
    <div className="space-y-2">
      {pkgClaims.map(c => (
        <div key={c.id} className="glass-card p-4">
          <div className="flex items-start gap-2.5">
            <div className="p-1.5 rounded-lg shrink-0 mt-0.5"
              style={{ background: 'rgba(124,92,252,0.12)' }}>
              <Sparkles size={13} style={{ color: '#a78bfa' }} />
            </div>
            <div className="flex-1 min-w-0">
              {/* ID + title + badge */}
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="text-[10px] font-mono text-text-muted">{c.id}</span>
                <p className="text-xs font-semibold text-text-primary">{c.title}</p>
                <Badge variant={CLAIM_STATUS[c.status]?.variant ?? 'gray'}>
                  {CLAIM_STATUS[c.status]?.label ?? c.status}
                </Badge>
              </div>

              {/* Claim text */}
              <p className="text-[11px] text-text-muted italic line-clamp-2 mb-2 leading-relaxed">
                {c.text}
                <button className="not-italic ml-1" style={{ color: '#a78bfa' }}>more</button>
              </p>

              {/* Source info */}
              <div className="flex items-center gap-2.5 text-[10px] text-text-muted flex-wrap mb-2">
                <span className="flex items-center gap-1"><FileText size={10} /> {c.doc}</span>
                <span className="flex items-center gap-1">§ {c.section}</span>
                <span className="flex items-center gap-1">📁 {c.subsection}</span>
                <span className="flex items-center gap-1"><Clock size={10} /> {c.time}</span>
              </div>

              {/* Chips row */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded"
                  style={{ background: 'rgba(34,211,238,0.1)', color: '#22d3ee', border: '1px solid rgba(34,211,238,0.2)' }}>
                  {c.bundle}
                </span>
                <span className="w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] font-bold"
                  style={{ background: `${polarityColor(c.polarity)}18`, border: `1px solid ${polarityColor(c.polarity)}44`, color: polarityColor(c.polarity) }}>
                  {c.polarity === '+' ? '+' : c.polarity === '−' ? '−' : '·'}
                </span>
                <span className="text-[10px] font-medium" style={{ color: '#60a5fa' }}>{c.confidence}%</span>
                <span className="text-[10px] font-medium" style={{ color: riskColor(c.risk) }}>{c.risk}</span>
                {c.conflicts > 0 && (
                  <span className="flex items-center gap-0.5 text-[10px] font-medium" style={{ color: '#f87171' }}>
                    <AlertTriangle size={10} /> {c.conflicts}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function PromotionSlideOut({ pkg, sandboxId, onClose }) {
  const navigate = useNavigate()
  const [tab, setTab] = useState('Overview')

  const statusVariant = { promoted: 'promoted', 'in-progress': 'in-progress', queue: 'queue' }
  const statusLabel   = { promoted: 'Promoted',  'in-progress': 'In Progress', queue: 'Queue' }

  const tabs = [
    { id: 'Overview', label: 'Overview' },
    { id: 'Claims',   label: 'Claims', count: pkg.claims },
  ]

  const handleEdit = () => {
    onClose()
    navigate(`/sandbox/${sandboxId}/promotion-builder`, {
      state: { editPkg: pkg, initialClaims: claims.map(c => c.id) },
    })
  }

  return createPortal(
    <>
      <div className="fixed inset-0" style={{ background: 'rgba(0,0,0,0.45)', zIndex: 9998 }} onClick={onClose} />
      <div className="fixed top-0 right-0 h-screen flex flex-col"
        style={{ width: 580, zIndex: 9999, background: 'var(--slideout-bg)', borderLeft: '1px solid var(--slideout-border)' }}>

        {/* Header */}
        <div className="shrink-0 p-5 pb-0" style={{ borderBottom: '1px solid var(--slideout-border)' }}>
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl shrink-0"
                style={{ background: 'rgba(124,92,252,0.15)', border: '1px solid rgba(124,92,252,0.25)' }}>
                <Sparkles size={18} style={{ color: '#a78bfa' }} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded"
                    style={{ background: 'rgba(255,255,255,0.07)', color: 'var(--text-muted)', border: '1px solid rgba(255,255,255,0.1)' }}>
                    {pkg.id}
                  </span>
                  <Badge variant={statusVariant[pkg.status]}>{statusLabel[pkg.status]}</Badge>
                </div>
                <p className="text-base font-bold text-text-primary leading-snug">{pkg.name}</p>
                <p className="text-xs text-text-muted mt-0.5">{pkg.desc}</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-all"
                style={{ background: 'rgba(124,92,252,0.12)', color: '#a78bfa', border: '1px solid rgba(124,92,252,0.2)' }}
                onClick={handleEdit}>
                <Pencil size={12} /> Edit Package
              </button>
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
          {tab === 'Overview' && <OverviewTab pkg={pkg} />}
          {tab === 'Claims'   && <ClaimsTab />}
        </div>
      </div>
    </>,
    document.body
  )
}
