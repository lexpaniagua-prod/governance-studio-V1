import React, { useState } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { Sparkles, Wand2, Save, ChevronRight, CheckCircle, AlertTriangle, FileText, Shield, Tag, Calendar, Clock, Pencil, X, Eye } from 'lucide-react'
import { claims, sandboxes } from '../../../data/mock'
import ClaimSlideOut from './ClaimSlideOut'
import { Badge, Chip } from '../../ui/index'
import clsx from 'clsx'

const STEPS = ['Promotion', 'Target & Details', 'Claim Review', 'Summary']

function StepIndicator({ current, onStepClick }) {
  return (
    <div className="flex items-center gap-2">
      {STEPS.map((label, i) => {
        const done = i < current
        const active = i === current
        const clickable = !!onStepClick
        return (
          <React.Fragment key={label}>
            <div
              className={clsx('flex items-center gap-1.5 transition-opacity', clickable && 'cursor-pointer hover:opacity-90')}
              onClick={() => clickable && onStepClick(i)}
            >
              <div className={clsx(
                'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all',
                done && 'bg-green-500/80 text-white',
                active && 'border-2 border-purple-400 text-purple-400 bg-purple-400/10',
                !done && !active && clickable && 'border border-purple-400/40 text-purple-300/60',
                !done && !active && !clickable && 'border border-white/20 text-white/30'
              )}>
                {done ? <CheckCircle size={14} /> : i + 1}
              </div>
              <span className={clsx(
                'text-xs font-medium',
                active ? 'text-text-primary' : done ? 'text-green-400' : clickable ? 'text-purple-300/60' : 'text-text-muted'
              )}>
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && <ChevronRight size={14} className="text-white/20 mx-1" />}
          </React.Fragment>
        )
      })}
    </div>
  )
}

// ── Step 1: Select Claims ─────────────────────────────────────────────────────
function Step1({ selected, onToggle }) {
  const [previewClaim, setPreviewClaim] = useState(null)
  return (
    <div className="space-y-3">
      {/* Selection bar */}
      <div className="flex items-center justify-between px-4 py-2.5 rounded-lg"
        style={{ background: selected.length > 0 ? 'rgba(34,197,94,0.08)' : 'rgba(255,255,255,0.03)', border: `1px solid ${selected.length > 0 ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.06)'}` }}>
        <div className="flex items-center gap-2">
          {selected.length > 0 && <CheckCircle size={14} style={{ color: '#4ade80' }} />}
          <p className="text-xs font-medium" style={{ color: selected.length > 0 ? '#4ade80' : '#64748b' }}>
            {selected.length > 0 ? `${selected.length} Claim${selected.length > 1 ? 's' : ''} Selected` : 'No claims selected'} — Manual selection
          </p>
        </div>
        {selected.length > 0 && (
          <button className="text-xs text-text-muted hover:text-text-secondary transition-colors flex items-center gap-1">
            <X size={12} /> Clear Selection
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input className="bg-transparent text-xs text-text-secondary outline-none w-40 placeholder:text-text-muted" placeholder="Search claims..." />
        </div>
        {['All Status', 'All Documents', 'All Bundles'].map(f => (
          <button key={f} className="btn-secondary text-xs py-1.5 px-3">{f} ▾</button>
        ))}
        <button className="btn-secondary text-xs py-1.5 px-3 gap-1.5">
          <CheckCircle size={12} /> Select All
        </button>
        <button className="btn-secondary text-xs py-1.5 px-3 gap-1.5">All Filters</button>
      </div>

      {/* Claims list */}
      <div className="space-y-2">
        {claims.map(claim => {
          const isSelected = selected.includes(claim.id)
          return (
            <label key={claim.id}
              className={clsx('row-item flex items-start gap-3 cursor-pointer', isSelected && 'selected', claim.status === 'conflict' && 'conflict')}
              onClick={() => onToggle(claim.id)}>
              <div className="mt-1 shrink-0">
                <div className={clsx(
                  'w-4 h-4 rounded border flex items-center justify-center transition-all',
                  isSelected ? 'bg-purple-500 border-purple-500' : 'border-white/20'
                )}>
                  {isSelected && <CheckCircle size={10} className="text-white" />}
                </div>
              </div>
              <div className="p-1.5 rounded-lg mt-0.5 shrink-0" style={{ background: 'rgba(124,92,252,0.12)' }}>
                <Sparkles size={14} style={{ color: '#a78bfa' }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-mono text-text-muted">{claim.id}</span>
                  <p className="text-sm font-medium text-text-primary">{claim.title}</p>
                  <Badge variant={claim.status}>{claim.status === 'promotable' ? 'Promotable' : claim.status === 'promoted' ? 'Promoted' : 'Conflict'}</Badge>
                  <button className="btn-ghost p-1 ml-auto rounded-lg" title="Preview claim"
                    onClick={e => { e.stopPropagation(); setPreviewClaim(claim) }}>
                    <Eye size={13} />
                  </button>
                </div>
                <p className="text-xs text-text-muted mt-1 line-clamp-1 italic">{claim.text?.replace(/"/g, '')}</p>
                <div className="flex items-center gap-2 mt-1.5 text-[11px] text-text-muted flex-wrap">
                  <span>📄 {claim.doc}</span>
                  <span>§ {claim.section}</span>
                  <span>🕐 {claim.time}</span>
                  <Chip color={claim.risk === 'Low' ? 'green' : claim.risk === 'Medium' ? 'amber' : 'red'}>{claim.confidence}% Conf.</Chip>
                  <Chip color={claim.risk === 'Low' ? 'green' : claim.risk === 'Medium' ? 'amber' : 'red'}>{claim.risk}</Chip>
                </div>
              </div>
            </label>
          )
        })}
      </div>

      {selected.length > 0 && (
        <div className="fixed bottom-20 right-8 px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2"
          style={{ background: '#1f2333', border: '1px solid rgba(255,255,255,0.15)' }}>
          <CheckCircle size={14} style={{ color: '#4ade80' }} />
          <span className="text-xs font-medium text-text-secondary">{selected.length} claim{selected.length > 1 ? 's' : ''} added to your promotion package</span>
        </div>
      )}

      {previewClaim && (
        <ClaimSlideOut claim={previewClaim} onClose={() => setPreviewClaim(null)} hidePromote />
      )}
    </div>
  )
}

// ── Step 2: Target & Details ──────────────────────────────────────────────────
function Step2({ pkg }) {
  const [configMode, setConfigMode] = useState('Apply to all claims')
  const [tags, setTags] = useState(pkg?.tags ?? [])
  const [tagInput, setTagInput] = useState('')

  const addTag = () => {
    const t = tagInput.trim()
    if (t && !tags.includes(t)) setTags(prev => [...prev, t])
    setTagInput('')
  }

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div className="glass-card p-5 space-y-4">
        <p className="text-sm font-semibold text-text-primary">Package Details</p>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-text-secondary">Package Name <span className="text-red-400">*</span></label>
          <input className="input-base" placeholder="Enter package name" defaultValue={pkg?.name ?? ''} />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-text-secondary">Target Truth Plane <span className="text-red-400">*</span></label>
          <select className="input-base" defaultValue={pkg?.target ?? ''}>
            <option value="">Select target plane</option>
            <option>Financial Truth Plane</option>
            <option>Technical Truth Plane</option>
            <option>Legal Truth Plane</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-text-secondary">Description</label>
          <textarea className="input-base resize-none h-20" placeholder="Enter package description" defaultValue={pkg?.desc ?? ''} />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-text-secondary">Tags</label>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-2">
              {tags.map(t => (
                <span key={t} className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full"
                  style={{ background: 'rgba(124,92,252,0.12)', color: '#a78bfa', border: '1px solid rgba(124,92,252,0.2)' }}>
                  {t}
                  <button className="opacity-60 hover:opacity-100" onClick={() => setTags(prev => prev.filter(x => x !== t))}>
                    <X size={10} />
                  </button>
                </span>
              ))}
            </div>
          )}
          <div className="flex gap-2">
            <input className="input-base flex-1" placeholder="Add a tag…" value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addTag()} />
            <button className="btn-secondary px-3" onClick={addTag}>Add</button>
          </div>
        </div>
      </div>

      <div className="glass-card p-5 space-y-4">
        <p className="text-sm font-semibold text-text-primary">Configuration Mode</p>
        <div className="flex rounded-lg p-0.5 gap-0.5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          {['Apply to all claims', 'Configure per claim'].map(opt => (
            <button key={opt} onClick={() => setConfigMode(opt)}
              className="flex-1 px-3 py-2 text-xs font-medium rounded-md transition-all"
              style={configMode === opt ? { background: 'rgba(255,255,255,0.1)', color: '#f1f5f9' } : { color: '#64748b' }}>
              {opt}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-text-secondary">Valid From</label>
            <input type="date" className="input-base" defaultValue="2024-01-01" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-text-secondary">Valid To</label>
            <input type="date" className="input-base" defaultValue="2024-12-31" />
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-text-secondary">Review Period (days)</label>
          <input type="number" className="input-base" defaultValue="90" />
        </div>
      </div>
    </div>
  )
}

// ── Step 3: Review & Send ─────────────────────────────────────────────────────
function Step3({ selected }) {
  const [activeClaim, setActiveClaim] = useState(selected[0] || null)
  const [detailTab, setDetailTab] = useState('Details')
  const [reviewed, setReviewed] = useState(new Set())
  const selectedClaims = claims.filter(c => selected.includes(c.id))

  const toggleReview = (id) => setReviewed(prev => {
    const next = new Set(prev)
    next.has(id) ? next.delete(id) : next.add(id)
    return next
  })

  const polarityLabel = p => p === '+' ? 'Positive' : p === '−' ? 'Negative' : 'Neutral'
  const polarityColor = p => p === '+' ? '#4ade80' : p === '−' ? '#f87171' : '#94a3b8'
  const riskColor = r => ({ Low: '#4ade80', Medium: '#fbbf24', High: '#f87171' }[r] || '#94a3b8')

  return (
    <div className="space-y-3">
      {/* Summary bar */}
      <div className="flex items-center gap-4 px-4 py-2.5 rounded-lg text-xs flex-wrap"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="flex items-center gap-1.5">
          <Sparkles size={12} style={{ color: '#a78bfa' }} />
          <span className="text-text-muted">Promotion Package Summary</span>
        </div>
        <span className="text-text-muted">Total Claims <span className="font-semibold text-text-primary">{selected.length}</span></span>
        <span className="text-text-muted">Status <span className="font-medium text-green-400">{Math.max(selected.length - 1, 0)} Ready</span> / <span className="font-medium text-red-400">0 Issues</span></span>
        <span className="text-text-muted">Target Truth Plane <span className="font-medium text-red-400">Not set</span></span>
        <span className="text-text-muted">Validity <span className="font-medium text-text-primary">2024-01-01 → 2024-12-31</span></span>
        <div className="flex items-center gap-1 ml-auto">
          <span className="text-text-muted">Risk</span>
          <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-green-500/15 text-green-400">2L</span>
          <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-500/15 text-amber-400">1M</span>
          <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-red-500/15 text-red-400">0H</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3" style={{ height: 500 }}>
        {/* Left: claim list */}
        <div className="glass-card p-3 overflow-y-auto">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <p className="text-xs font-semibold text-text-secondary">Promotion Package ({selected.length})</p>
              {reviewed.size > 0 && (
                <span className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                  style={{ background: 'rgba(34,197,94,0.12)', color: '#4ade80' }}>
                  {reviewed.size}/{selected.length} Reviewed
                </span>
              )}
            </div>
            <button className="flex items-center gap-1 text-[11px] text-text-muted hover:text-text-secondary transition-colors">
              Review All <CheckCircle size={12} />
            </button>
          </div>
          <div className="space-y-2">
            {selectedClaims.map(c => {
              const isActive = activeClaim === c.id
              const isReviewed = reviewed.has(c.id)
              return (
                <div key={c.id}
                  className="rounded-lg cursor-pointer transition-all"
                  style={{
                    padding: '10px 12px',
                    background: isActive ? 'rgba(124,92,252,0.08)' : 'rgba(255,255,255,0.02)',
                    border: `1px solid ${isActive ? 'rgba(167,139,250,0.35)' : isReviewed ? 'rgba(34,197,94,0.25)' : 'rgba(255,255,255,0.07)'}`,
                  }}
                  onClick={() => setActiveClaim(c.id)}>

                  {/* Header row */}
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-mono text-text-muted">{c.id}</span>
                      <p className="text-xs font-semibold text-text-primary mt-0.5 leading-snug">{c.title}</p>
                    </div>
                    <button
                      title={isReviewed ? 'Mark as Unreviewed' : 'Mark as Reviewed'}
                      onClick={e => { e.stopPropagation(); toggleReview(c.id) }}
                      className="shrink-0 mt-0.5 transition-all"
                      style={{ color: isReviewed ? '#4ade80' : 'rgba(255,255,255,0.2)' }}>
                      <CheckCircle size={15} />
                    </button>
                  </div>

                  {/* Claim text */}
                  <p className="text-[11px] text-text-muted italic leading-relaxed line-clamp-2 mb-2">
                    {c.text}
                  </p>

                  {/* Bottom row */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="flex items-center gap-1 text-[10px] font-medium" style={{ color: '#60a5fa' }}>
                      <span className="w-3.5 h-3.5 rounded-full flex items-center justify-center"
                        style={{ background: 'rgba(96,165,250,0.15)', border: '1px solid rgba(96,165,250,0.3)' }}>
                        <span className="text-[8px] font-bold">%</span>
                      </span>
                      {c.confidence}%
                    </span>
                    <span className="flex items-center gap-1 text-[10px] font-medium"
                      style={{ color: riskColor(c.risk) }}>
                      <span className="w-3.5 h-3.5 rounded-full flex items-center justify-center"
                        style={{ background: `${riskColor(c.risk)}22`, border: `1px solid ${riskColor(c.risk)}44` }}>
                        <span className="text-[8px] font-bold">!</span>
                      </span>
                      {c.risk}
                    </span>
                    <div className="ml-auto">
                      <Badge variant={c.status === 'conflict' ? 'conflict' : 'promotable'}>
                        {c.status === 'conflict' ? 'Conflict' : 'Promotable'}
                      </Badge>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Right: claim detail */}
        <div className="glass-card p-4 overflow-y-auto">
          {activeClaim ? (() => {
            const c = claims.find(cl => cl.id === activeClaim)
            if (!c) return null
            return (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Sparkles size={14} style={{ color: '#a78bfa' }} />
                  <span className="text-xs font-mono text-text-muted">{c.id}</span>
                </div>
                <div className="flex gap-1.5">
                  {['Details', 'Source Evidence'].map(t => (
                    <button key={t} onClick={() => setDetailTab(t)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                      style={detailTab === t
                        ? { background: 'rgba(255,255,255,0.1)', color: '#f1f5f9' }
                        : { color: '#64748b' }}>
                      {t}
                    </button>
                  ))}
                </div>

                {detailTab === 'Details' && (
                  <div className="space-y-3">
                    <div className="glass-card p-3">
                      <p className="text-[10px] text-text-muted mb-1.5 flex items-center gap-1"><Sparkles size={10} /> Context</p>
                      <p className="text-xs text-text-muted leading-relaxed">This claim has been selected for promotion to a Truth Plane. Review the details and configure the promotion parameters below.</p>
                    </div>
                    <div className="rounded-lg p-3" style={{ background: 'rgba(124,92,252,0.08)', border: '1px solid rgba(124,92,252,0.2)' }}>
                      <p className="text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: '#a78bfa' }}>CLAIM</p>
                      <p className="text-xs text-text-primary leading-relaxed">{c.text?.replace(/"/g, '')}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-[10px] text-text-muted">Polarity</label>
                        <select className="input-base text-xs py-1.5"><option>Positive</option><option>Negative</option></select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] text-text-muted">Risk</label>
                        <select className="input-base text-xs py-1.5"><option>Low</option><option>Medium</option><option>High</option></select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] text-text-muted">Claim Type</label>
                        <select className="input-base text-xs py-1.5"><option>Performance</option><option>Compliance</option><option>Financial</option></select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] text-text-muted">Review Period</label>
                        <input className="input-base text-xs py-1.5" defaultValue="90 days" />
                      </div>
                    </div>
                    <div className="px-3 py-2 rounded-lg text-xs flex items-start gap-2"
                      style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)' }}>
                      <AlertTriangle size={12} style={{ color: '#60a5fa', flexShrink: 0, marginTop: 1 }} />
                      <span style={{ color: '#60a5fa' }}>Package Configuration Incomplete — Please complete all required fields in Step 2 before sending to Truth Plane.</span>
                    </div>
                  </div>
                )}

                {detailTab === 'Source Evidence' && (
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-semibold text-text-secondary mb-2">Source Extract</p>
                      <div className="rounded-lg p-3 text-xs leading-relaxed" style={{ background: 'rgba(255,255,255,0.03)', borderLeft: '3px solid #7c5cfc' }}>
                        <span className="text-text-muted">…</span>
                        <span className="text-text-secondary italic">The Contractor agrees that payment of </span>
                        <span style={{ color: '#4ade80' }}>$2,500,000</span>
                        <span className="text-text-secondary italic"> shall be made by </span>
                        <span style={{ color: '#60a5fa' }}>Acme Corporation</span>
                        <span className="text-text-secondary italic"> to the designated account no later than </span>
                        <span style={{ color: '#a78bfa' }}>December 31, 2025</span>
                        <span className="text-text-secondary italic">, as specified in </span>
                        <span style={{ color: '#2dd4bf' }}>Section 4.2.1</span>
                        <span className="text-text-muted">…</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-text-secondary mb-2">Source Location</p>
                      <div className="space-y-1.5 text-xs">
                        {[['Source Document', 'Q1 Sales Contract - Acme Corp'], ['Section', 'Terms of Service'], ['Subsection', 'Service Availability'], ['Chunk', 'CHK-0042']].map(([k, v]) => (
                          <div key={k} className="flex justify-between py-1" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                            <span className="text-text-muted flex items-center gap-1.5">
                              {k === 'Source Document' ? <FileText size={11} /> : null} {k}
                            </span>
                            <span className="font-medium text-text-secondary">{v}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })() : (
            <p className="text-xs text-text-muted text-center mt-8">Select a claim to review its details</p>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Step 4: Summary ───────────────────────────────────────────────────────────
function Step4({ selected }) {
  const [previewClaim, setPreviewClaim] = useState(null)
  const selectedClaims = claims.filter(c => selected.includes(c.id))
  const polarityLabel = p => p === '+' ? 'Positive' : p === '−' ? 'Negative' : 'Neutral'
  const polarityColor = p => p === '+' ? '#4ade80' : p === '−' ? '#f87171' : '#94a3b8'
  const riskColor = r => ({ Low: '#4ade80', Medium: '#fbbf24', High: '#f87171' }[r] || '#94a3b8')

  return (
    <div className="space-y-4">
      {/* Promotion Summary card */}
      <div className="glass-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 rounded-lg" style={{ background: 'rgba(124,92,252,0.12)' }}>
            <Sparkles size={13} style={{ color: '#a78bfa' }} />
          </div>
          <p className="text-xs font-bold uppercase tracking-wider text-text-muted">Promotion Summary</p>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-3">
          {/* Package Name */}
          <div className="rounded-xl p-4" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)' }}>
            <p className="text-[10px] text-text-muted mb-1.5">Package Name</p>
            <p className="text-sm font-semibold text-text-primary">New Promotion Package</p>
          </div>
          {/* Target Truth Plane */}
          <div className="rounded-xl p-4 flex items-center gap-3" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)' }}>
            <div className="p-2 rounded-lg" style={{ background: 'rgba(59,130,246,0.12)' }}>
              <Shield size={16} style={{ color: '#60a5fa' }} />
            </div>
            <div>
              <p className="text-[10px] text-text-muted mb-0.5">Target Truth Plane</p>
              <p className="text-sm font-semibold text-text-primary">Financial Performance</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-text-muted">
          <FileText size={11} />
          <span>No description provided</span>
        </div>
      </div>

      {/* Claims list */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <p className="text-sm font-semibold text-text-primary">Package Claims</p>
          <span className="text-xs px-2 py-0.5 rounded-full font-medium"
            style={{ background: 'rgba(124,92,252,0.12)', color: '#a78bfa' }}>
            {selectedClaims.length}
          </span>
        </div>

        <div className="space-y-2">
          {selectedClaims.map(claim => (
            <div key={claim.id} className="glass-card px-4 py-3">
              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-lg mt-0.5 shrink-0" style={{ background: 'rgba(124,92,252,0.10)' }}>
                  <Sparkles size={13} style={{ color: '#a78bfa' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-[10px] font-mono text-text-muted">{claim.id}</span>
                    <p className="text-sm font-semibold text-text-primary">{claim.title}</p>
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium"
                      style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                      <Tag size={9} /> performance
                    </span>
                    <div className="ml-auto flex items-center gap-3 text-[11px]">
                      <span className="flex items-center gap-1 text-text-muted">
                        <Calendar size={11} /> Dec 31 – Dec 30
                      </span>
                      <span className="flex items-center gap-1 text-text-muted">
                        <Clock size={11} /> Quarterly
                      </span>
                      <span className="font-medium" style={{ color: polarityColor(claim.polarity) }}>
                        {claim.polarity === '+' ? '+ ' : claim.polarity === '−' ? '− ' : ''}{polarityLabel(claim.polarity)}
                      </span>
                      <span className="font-medium" style={{ color: riskColor(claim.risk) }}>
                        {claim.risk}
                      </span>
                      <span className="font-semibold" style={{ color: '#4ade80' }}>{claim.confidence}%</span>
                      <CheckCircle size={14} style={{ color: '#4ade80' }} />
                      <button className="btn-ghost p-1 rounded-lg" title="Preview claim"
                        onClick={() => setPreviewClaim(claim)}>
                        <Eye size={12} />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-text-muted italic line-clamp-1">{claim.text?.replace(/"/g, '')}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {previewClaim && (
        <ClaimSlideOut claim={previewClaim} onClose={() => setPreviewClaim(null)} hidePromote />
      )}
    </div>
  )
}

// ── Main Builder ──────────────────────────────────────────────────────────────
export default function PromotionBuilder() {
  const navigate = useNavigate()
  const { id } = useParams()
  const location = useLocation()
  const editPkg = location.state?.editPkg ?? null
  const [step, setStep] = useState(0)
  const [selected, setSelected] = useState(location.state?.initialClaims ?? [])

  const sandbox = sandboxes.find(s => s.id === id)
  const back = () => navigate(`/sandbox/${id}`)

  const toggleClaim = (id) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  return (
    <div className="flex flex-col h-full">
      {/* Breadcrumb */}
      <div className="px-6 pt-5 pb-0">
        <nav className="flex items-center gap-1.5 text-xs text-text-muted mb-4">
          <button onClick={() => navigate('/intelligence-library')} className="hover:text-text-secondary transition-colors">Intelligence Library</button>
          <ChevronRight size={12} className="opacity-40" />
          <button onClick={() => navigate('/sandbox')} className="hover:text-text-secondary transition-colors">Sandbox Plane</button>
          <ChevronRight size={12} className="opacity-40" />
          <button onClick={back} className="hover:text-text-secondary transition-colors">{sandbox?.name ?? id}</button>
          <ChevronRight size={12} className="opacity-40" />
          <span className="text-text-secondary font-medium">Promotion Builder</span>
        </nav>
      </div>

      {/* Header bar */}
      <div className="flex items-center gap-4 px-6 py-3 shrink-0 sticky top-0 z-10"
        style={{ borderBottom: '1px solid var(--topbar-border)', background: 'var(--topbar-bg)' }}>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg" style={{ background: 'rgba(124,92,252,0.15)' }}>
            <Sparkles size={16} style={{ color: '#a78bfa' }} />
          </div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-text-primary">
              {editPkg ? editPkg.name : 'New Promotion Package'}
            </p>
            <span className={editPkg ? 'badge badge-in-progress' : 'badge badge-draft'}>
              {editPkg ? 'Editing' : 'Draft'}
            </span>
            {selected.length > 0 && (
              <span className="text-xs text-text-muted">{selected.length} claim{selected.length > 1 ? 's' : ''} selected</span>
            )}
          </div>
        </div>

        <div className="ml-6">
          <StepIndicator current={step} onStepClick={editPkg ? setStep : undefined} />
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <button className="btn-secondary gap-1.5 text-xs"><Wand2 size={13} /> AI Builder</button>
          <button className="btn-secondary gap-1.5 text-xs"><Wand2 size={13} /> Wizard</button>
          <button className="btn-secondary gap-1.5 text-xs"><Save size={13} /> Save Draft</button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {step === 0 && <Step1 selected={selected} onToggle={toggleClaim} />}
        {step === 1 && <Step2 pkg={editPkg} />}
        {step === 2 && <Step3 selected={selected} />}
        {step === 3 && <Step4 selected={selected} />}
      </div>

      {/* Footer nav */}
      <div className="flex items-center justify-between px-6 py-4 shrink-0 sticky bottom-0"
        style={{ borderTop: '1px solid var(--topbar-border)', background: 'var(--topbar-bg)' }}>
        <button className="btn-secondary gap-1.5" onClick={() => step > 0 ? setStep(s => s - 1) : back()}>
          ← {step > 0 ? 'Previous' : 'Cancel'}
        </button>
        {step < STEPS.length - 1 ? (
          <button className="btn-primary gap-1.5" onClick={() => setStep(s => s + 1)}>
            Next →
          </button>
        ) : (
          <button className="btn-primary gap-1.5" style={{ background: 'linear-gradient(135deg, #7c5cfc, #22c55e)' }}>
            <Sparkles size={13} /> {editPkg ? 'Save Changes' : 'Submit Promotion'}
          </button>
        )}
      </div>
    </div>
  )
}
