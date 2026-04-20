import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import {
  X, Shield, FileText, Package, CheckCircle, Plus, ChevronRight,
  User, Calendar, Sparkles, AlertTriangle, Users, Zap, Target,
  Lock, Clock, Tag,
} from 'lucide-react'

// ── Shared data ───────────────────────────────────────────────────────────────
const PEOPLE = [
  { name: 'Sarah Chen',      email: 'sarah.chen@company.com',      initials: 'SC', gradient: 'linear-gradient(135deg,#a78bfa,#60a5fa)' },
  { name: 'Michael Torres',  email: 'michael.torres@company.com',  initials: 'MT', gradient: 'linear-gradient(135deg,#f59e0b,#ef4444)' },
  { name: 'Emily Rodriguez', email: 'emily.rodriguez@company.com', initials: 'ER', gradient: 'linear-gradient(135deg,#4ade80,#22d3ee)' },
  { name: 'David Kim',       email: 'david.kim@company.com',       initials: 'DK', gradient: 'linear-gradient(135deg,#f87171,#fb923c)' },
  { name: 'Lisa Anderson',   email: 'lisa.anderson@company.com',   initials: 'LA', gradient: 'linear-gradient(135deg,#2dd4bf,#60a5fa)' },
]

const DOCS = [
  'Q1_Enterprise_Contracts.pdf',
  'Master_Service_Agreement.pdf',
  'Addendum_2024_Q1.pdf',
  'Payment_Terms_Schedule.pdf',
  'GDPR_Data_Processing_Agreement.pdf',
  'Security_Policy_Framework.pdf',
]

const BUNDLES = [
  { id: 'BDL-001', name: 'Enterprise Contracts Q1' },
  { id: 'BDL-002', name: 'Master Services Pack' },
  { id: 'BDL-011', name: 'GDPR Compliance Bundle' },
  { id: 'BDL-020', name: 'Licensing & IP Terms' },
]

const TAGS = ['Finance', 'Compliance', 'Legal', 'Operations', 'Contracts', 'Eligibility']

// ── Sub-components ────────────────────────────────────────────────────────────
function SectionHeader({ icon: Icon, label, color = '#a78bfa' }) {
  return (
    <div className="flex items-center gap-2 pb-1.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <Icon size={13} style={{ color }} />
      <p className="text-xs font-semibold text-text-secondary">{label}</p>
    </div>
  )
}

function AutoLabel() {
  return (
    <span className="text-[10px] font-normal px-1.5 py-0.5 rounded ml-1"
      style={{ background: 'rgba(96,165,250,0.1)', color: '#60a5fa', border: '1px solid rgba(96,165,250,0.2)' }}>
      Auto
    </span>
  )
}

// ── Peer Reviewer picker ──────────────────────────────────────────────────────
function ReviewerPicker({ selected, onToggle, max }) {
  const [open, setOpen] = useState(false)
  const full = selected.length >= max

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <p className="text-[11px] text-text-muted">Assign specific reviewers <span className="opacity-60">(optional)</span></p>
        {selected.length > 0 && (
          <span className="text-[10px]" style={{ color: '#a78bfa' }}>{selected.length} selected</span>
        )}
      </div>

      {/* Selected avatars */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selected.map(p => (
            <div key={p.email} className="flex items-center gap-1.5 px-2 py-1 rounded-lg"
              style={{ background: 'rgba(124,92,252,0.1)', border: '1px solid rgba(124,92,252,0.25)' }}>
              <span className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold text-white shrink-0"
                style={{ background: p.gradient }}>{p.initials}</span>
              <span className="text-[11px] text-text-secondary">{p.name}</span>
              <button onClick={() => onToggle(p)} className="ml-1 opacity-60 hover:opacity-100">
                <X size={9} style={{ color: '#a78bfa' }} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add reviewer button */}
      {!full && (
        <button
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-all"
          style={{
            background: 'var(--input-bg)',
            border: `1px solid ${open ? 'rgba(124,92,252,0.5)' : 'var(--input-border)'}`,
            color: 'var(--text-muted)',
          }}
          onClick={() => setOpen(o => !o)}>
          <span>Add reviewer...</span>
          <ChevronRight size={12} className={`transition-transform shrink-0 ${open ? 'rotate-90' : ''}`}
            style={{ color: 'var(--text-muted)' }} />
        </button>
      )}

      {open && (
        <div className="rounded-xl overflow-hidden"
          style={{ border: '1px solid rgba(124,92,252,0.25)', background: '#131825' }}>
          {PEOPLE.filter(p => !selected.find(s => s.email === p.email)).map((p, i) => (
            <button key={p.email}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 text-left transition-all hover:bg-white/[0.04]"
              style={{ borderTop: i > 0 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}
              onClick={() => { onToggle(p); setOpen(false) }}>
              <span className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white shrink-0"
                style={{ background: p.gradient }}>{p.initials}</span>
              <span className="text-xs font-semibold text-text-primary">{p.name}</span>
              <span className="text-xs text-text-muted">{p.email}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Success view ──────────────────────────────────────────────────────────────
function SuccessView({ approvalMode, peerCount, onClose }) {
  const isAuto = approvalMode === 'self'
  return (
    <div className="flex flex-col items-center justify-center py-12 px-8 text-center gap-5">
      <div className="w-14 h-14 rounded-full flex items-center justify-center"
        style={{
          background: isAuto ? 'rgba(45,212,191,0.15)' : 'rgba(167,139,250,0.15)',
          border: `2px solid ${isAuto ? 'rgba(45,212,191,0.4)' : 'rgba(167,139,250,0.4)'}`,
        }}>
        {isAuto
          ? <Zap size={26} style={{ color: '#2dd4bf' }} />
          : <CheckCircle size={26} style={{ color: '#a78bfa' }} />}
      </div>
      <div>
        <p className="text-lg font-bold text-text-primary mb-1">
          {isAuto ? 'Fact Created & Auto-Verified' : 'Fact Submitted for Review'}
        </p>
        <p className="text-sm text-text-muted max-w-xs leading-relaxed">
          {isAuto
            ? 'Your fact has been added to the Truth Plane and marked as Verified. It is immediately active.'
            : `Your fact has been submitted and requires ${peerCount} peer approval${peerCount > 1 ? 's' : ''} before becoming Verified.`}
        </p>
      </div>

      <div className="w-full rounded-xl p-4 text-left"
        style={{
          background: isAuto ? 'rgba(45,212,191,0.07)' : 'rgba(124,92,252,0.07)',
          border: `1px solid ${isAuto ? 'rgba(45,212,191,0.25)' : 'rgba(124,92,252,0.25)'}`,
        }}>
        {isAuto ? (
          <div className="flex items-start gap-2">
            <Zap size={13} style={{ color: '#2dd4bf' }} className="mt-0.5 shrink-0" />
            <p className="text-[11px] text-text-muted leading-relaxed">
              Self-approved fact. Attestation chain complete — <strong className="text-text-secondary">Created by you · Approved by you</strong>. Visible immediately in the Facts tab.
            </p>
          </div>
        ) : (
          <div className="flex items-start gap-2">
            <Users size={13} style={{ color: '#a78bfa' }} className="mt-0.5 shrink-0" />
            <p className="text-[11px] text-text-muted leading-relaxed">
              Fact entered the <strong className="text-text-secondary">governance review queue</strong>. Requires <strong className="text-text-secondary">{peerCount} peer approval{peerCount > 1 ? 's' : ''}</strong> to become Verified. Visible as Pending until approved.
            </p>
          </div>
        )}
      </div>

      <button className="btn-secondary w-full justify-center" onClick={onClose}>Close</button>
    </div>
  )
}

// ── Main modal ────────────────────────────────────────────────────────────────
export default function CreateFactModal({ onClose, onSubmit }) {
  // Basic info
  const [title,     setTitle]     = useState('')
  const [context,   setContext]   = useState('')
  const [statement, setStatement] = useState('')
  const [tag,       setTag]       = useState('Finance')
  const [errors,    setErrors]    = useState({})

  // Evidence / source
  const [sourceType,    setSourceType]    = useState('Document')
  const [selectedDocs,  setSelectedDocs]  = useState([])
  const [selectedBundles, setSelectedBundles] = useState([])
  const [sourcePerson,  setSourcePerson]  = useState(null)
  const [personOpen,    setPersonOpen]    = useState(false)
  const [evidenceNotes, setEvidenceNotes] = useState('')

  // Governance signals
  const [confidence, setConfidence] = useState('95')
  const [risk,       setRisk]       = useState('Low')
  const [polarity,   setPolarity]   = useState('+')

  // Validity
  const [validFrom,   setValidFrom]   = useState('')
  const [expiresOn,   setExpiresOn]   = useState('')

  // Approval mode
  const [approvalMode, setApprovalMode] = useState('self')   // 'self' | 'peer'
  const [peerCount,    setPeerCount]    = useState(1)
  const [reviewers,    setReviewers]    = useState([])

  // Submission
  const [submitted, setSubmitted] = useState(false)

  const toggleDoc    = f  => setSelectedDocs(p    => p.includes(f)    ? p.filter(x => x !== f)    : [...p, f])
  const toggleBundle = id => setSelectedBundles(p => p.includes(id)   ? p.filter(x => x !== id)   : [...p, id])
  const toggleReviewer = p => setReviewers(prev => {
    const exists = prev.find(r => r.email === p.email)
    if (exists) return prev.filter(r => r.email !== p.email)
    return [...prev, p]
  })

  const validate = () => {
    const e = {}
    if (!title.trim())     e.title     = 'Title is required.'
    if (!context.trim())   e.context   = 'Context is required.'
    if (!statement.trim()) e.statement = 'Fact statement is required.'
    return e
  }

  const handleSubmit = () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setSubmitted(true)
    onSubmit?.({ title, context, statement, tag, confidence, risk, polarity, validFrom, expiresOn, approvalMode, peerCount, reviewers })
  }

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}>
      <div className="w-full rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        style={{ maxWidth: 860, maxHeight: '92vh', background: 'var(--modal-bg)', border: '1px solid var(--modal-border)' }}
        onClick={e => e.stopPropagation()}>

        {/* ── Header ── */}
        <div className="flex items-center gap-3 px-6 py-4 shrink-0"
          style={{ borderBottom: '1px solid var(--slideout-border)' }}>
          <div className="p-2 rounded-xl shrink-0"
            style={{ background: 'rgba(96,165,250,0.12)', border: '1px solid rgba(96,165,250,0.25)' }}>
            <Shield size={16} style={{ color: '#60a5fa' }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-text-primary">Create New Fact</p>
            <p className="text-xs text-text-muted mt-0.5">Add a verified governance fact directly to the Truth Plane</p>
          </div>
          <button className="btn-ghost p-1.5 rounded-lg" onClick={onClose}><X size={14} /></button>
        </div>

        {/* ── Body ── */}
        <div className="flex-1 overflow-y-auto">
          {submitted ? (
            <SuccessView approvalMode={approvalMode} peerCount={reviewers.length || 1} onClose={onClose} />
          ) : (
            <div className="grid grid-cols-2 divide-x" style={{ divideColor: 'rgba(255,255,255,0.06)' }}>

              {/* ════ LEFT — Content ════ */}
              <div className="p-6 space-y-6" style={{ borderRight: '1px solid rgba(255,255,255,0.06)' }}>

                {/* Basic Information */}
                <div className="space-y-3">
                  <SectionHeader icon={FileText} label="Basic Information" color="#60a5fa" />

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-text-secondary flex items-center gap-1">
                      Title <span style={{ color: '#f87171' }}>*</span>
                    </label>
                    <input
                      className={`input-base text-xs ${errors.title ? 'border-red-500/50' : ''}`}
                      placeholder="e.g., Service Level Agreement – Uptime Guarantee"
                      value={title} onChange={e => { setTitle(e.target.value); setErrors(p => ({ ...p, title: '' })) }}
                    />
                    {errors.title && <p className="text-[11px]" style={{ color: '#f87171' }}>{errors.title}</p>}
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-text-secondary flex items-center gap-1">
                      Context <span style={{ color: '#f87171' }}>*</span>
                    </label>
                    <textarea
                      className={`input-base resize-none text-xs leading-relaxed ${errors.context ? 'border-red-500/50' : ''}`}
                      rows={3}
                      placeholder="Describe what this fact governs and why it matters..."
                      value={context} onChange={e => { setContext(e.target.value); setErrors(p => ({ ...p, context: '' })) }}
                    />
                    {errors.context && <p className="text-[11px]" style={{ color: '#f87171' }}>{errors.context}</p>}
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-text-secondary flex items-center gap-1">
                      Fact Statement <span style={{ color: '#f87171' }}>*</span>
                    </label>
                    <textarea
                      className={`input-base resize-none text-xs leading-relaxed ${errors.statement ? 'border-red-500/50' : ''}`}
                      rows={5}
                      placeholder="Enter the exact verified truth statement..."
                      value={statement} onChange={e => { setStatement(e.target.value); setErrors(p => ({ ...p, statement: '' })) }}
                    />
                    {errors.statement && <p className="text-[11px]" style={{ color: '#f87171' }}>{errors.statement}</p>}
                  </div>
                </div>

                {/* Evidence / Source */}
                <div className="space-y-3">
                  <SectionHeader icon={FileText} label="Evidence & Source" color="#60a5fa" />

                  {/* Source type toggle */}
                  <div className="flex gap-1 p-1 rounded-lg" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                    {['Document', 'Bundle', 'Human', 'None'].map(opt => (
                      <button key={opt}
                        className="flex-1 py-1.5 rounded-md text-xs font-medium transition-all"
                        style={sourceType === opt ? {
                          background: 'rgba(96,165,250,0.18)', color: '#60a5fa', border: '1px solid rgba(96,165,250,0.35)',
                        } : { color: 'var(--text-muted)' }}
                        onClick={() => setSourceType(opt)}>
                        {opt}
                      </button>
                    ))}
                  </div>

                  {sourceType === 'Document' && (
                    <div className="space-y-2">
                      <p className="text-[11px] text-text-muted">Select source documents</p>
                      <div className="grid grid-cols-1 gap-1.5">
                        {DOCS.map(f => {
                          const checked = selectedDocs.includes(f)
                          return (
                            <label key={f} className="flex items-center gap-2 p-2.5 rounded-lg cursor-pointer transition-all"
                              style={{
                                background: checked ? 'rgba(96,165,250,0.08)' : 'rgba(255,255,255,0.02)',
                                border: `1px solid ${checked ? 'rgba(96,165,250,0.35)' : 'rgba(255,255,255,0.07)'}`,
                              }}>
                              {/* custom checkbox */}
                              <div className="w-3.5 h-3.5 rounded flex items-center justify-center shrink-0 transition-colors"
                                style={{
                                  background: checked ? '#3b82f6' : 'transparent',
                                  border: checked ? '1px solid #3b82f6' : '1px solid rgba(255,255,255,0.2)',
                                }}
                                onClick={() => toggleDoc(f)}>
                                {checked && <CheckCircle size={9} color="white" />}
                              </div>
                              <FileText size={11} style={{ color: '#f87171' }} className="shrink-0" />
                              <span className="text-xs text-text-secondary truncate">{f}</span>
                            </label>
                          )
                        })}
                      </div>
                      <button className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs text-text-muted transition-all hover:text-text-secondary"
                        style={{ border: '1px dashed rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.01)' }}>
                        <Plus size={11} /> Upload Document
                      </button>
                    </div>
                  )}

                  {sourceType === 'Bundle' && (
                    <div className="space-y-1.5">
                      <p className="text-[11px] text-text-muted">Select evidence bundles</p>
                      {BUNDLES.map(b => {
                        const checked = selectedBundles.includes(b.id)
                        return (
                          <label key={b.id} className="flex items-center gap-2.5 p-2.5 rounded-lg cursor-pointer transition-all"
                            style={{
                              background: checked ? 'rgba(96,165,250,0.08)' : 'rgba(255,255,255,0.02)',
                              border: `1px solid ${checked ? 'rgba(96,165,250,0.35)' : 'rgba(255,255,255,0.07)'}`,
                            }}>
                            <div className="w-3.5 h-3.5 rounded flex items-center justify-center shrink-0"
                              style={{
                                background: checked ? '#3b82f6' : 'transparent',
                                border: checked ? '1px solid #3b82f6' : '1px solid rgba(255,255,255,0.2)',
                              }}
                              onClick={() => toggleBundle(b.id)}>
                              {checked && <CheckCircle size={9} color="white" />}
                            </div>
                            <Package size={11} style={{ color: '#fbbf24' }} className="shrink-0" />
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded shrink-0"
                              style={{ background: 'rgba(124,92,252,0.12)', color: '#a78bfa', border: '1px solid rgba(124,92,252,0.2)' }}>
                              {b.id}
                            </span>
                            <span className="text-xs text-text-secondary truncate">{b.name}</span>
                          </label>
                        )
                      })}
                    </div>
                  )}

                  {sourceType === 'Human' && (
                    <div className="space-y-1.5">
                      <p className="text-[11px] text-text-muted">Select the person providing this evidence</p>
                      <button
                        className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs transition-all"
                        style={{
                          background: 'var(--input-bg)',
                          border: `1px solid ${personOpen ? 'rgba(96,165,250,0.5)' : 'var(--input-border)'}`,
                          color: sourcePerson ? 'var(--text-primary)' : 'var(--text-muted)',
                        }}
                        onClick={() => setPersonOpen(o => !o)}>
                        {sourcePerson ? (
                          <span className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white shrink-0"
                              style={{ background: sourcePerson.gradient }}>{sourcePerson.initials}</span>
                            <span className="font-medium text-text-primary">{sourcePerson.name}</span>
                          </span>
                        ) : <span>Select a person...</span>}
                        <ChevronRight size={12} className={`transition-transform shrink-0 ${personOpen ? 'rotate-90' : ''}`}
                          style={{ color: 'var(--text-muted)' }} />
                      </button>
                      {personOpen && (
                        <div className="rounded-xl overflow-hidden"
                          style={{ border: '1px solid rgba(96,165,250,0.25)', background: '#131825' }}>
                          {PEOPLE.map((p, i) => (
                            <button key={p.email}
                              className="w-full flex items-center gap-3 px-4 py-3 text-left transition-all hover:bg-white/[0.04]"
                              style={{
                                background: sourcePerson?.email === p.email ? 'rgba(96,165,250,0.15)' : 'transparent',
                                borderTop: i > 0 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                              }}
                              onClick={() => { setSourcePerson(p); setPersonOpen(false) }}>
                              <span className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                                style={{ background: p.gradient }}>{p.initials}</span>
                              <span className="text-xs font-semibold text-text-primary">{p.name}</span>
                              <span className="text-xs text-text-muted ml-1">{p.email}</span>
                              {sourcePerson?.email === p.email && (
                                <CheckCircle size={12} className="ml-auto shrink-0" style={{ color: '#60a5fa' }} />
                              )}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {sourceType === 'None' && (
                    <div className="flex items-start gap-2 rounded-lg px-3 py-2.5"
                      style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)' }}>
                      <AlertTriangle size={12} style={{ color: '#fbbf24', marginTop: 1, flexShrink: 0 }} />
                      <p className="text-[11px]" style={{ color: '#fbbf24' }}>
                        Facts without linked evidence may have lower confidence and will be flagged for review.
                      </p>
                    </div>
                  )}

                  {sourceType !== 'None' && (
                    <div className="space-y-1">
                      <label className="text-[11px] text-text-muted">Evidence notes <span className="opacity-60">(optional)</span></label>
                      <textarea
                        className="input-base resize-none text-xs"
                        rows={2}
                        placeholder="Reference specific sections, page numbers, or quotes..."
                        value={evidenceNotes} onChange={e => setEvidenceNotes(e.target.value)}
                      />
                    </div>
                  )}
                </div>

                {/* Auto-filled fields */}
                <div className="space-y-3">
                  <SectionHeader icon={User} label="Authorship" color="#94a3b8" />
                  <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg"
                    style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <span className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                      style={{ background: 'linear-gradient(135deg,#a78bfa,#60a5fa)' }}>JD</span>
                    <div>
                      <p className="text-xs font-medium text-text-secondary">John Doe</p>
                      <p className="text-[10px] text-text-muted">john.doe@company.com · Acme Corporation</p>
                    </div>
                    <AutoLabel />
                  </div>
                </div>
              </div>

              {/* ════ RIGHT — Governance ════ */}
              <div className="p-6 space-y-6">

                {/* Governance Signals */}
                <div className="space-y-3">
                  <SectionHeader icon={Target} label="Governance Signals" color="#60a5fa" />
                  <div className="grid grid-cols-3 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] text-text-muted">Confidence (%)</label>
                      <input className="input-base text-xs py-1.5 px-2"
                        value={confidence} onChange={e => setConfidence(e.target.value)} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-text-muted">Risk Level</label>
                      <select className="input-base text-xs py-1.5 px-2" value={risk} onChange={e => setRisk(e.target.value)}>
                        <option>Low</option><option>Medium</option><option>High</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-text-muted">Polarity</label>
                      <select className="input-base text-xs py-1.5 px-2" value={polarity} onChange={e => setPolarity(e.target.value)}>
                        <option value="+">Positive</option>
                        <option value="−">Negative</option>
                        <option value="·">Neutral</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Validity */}
                <div className="space-y-3">
                  <SectionHeader icon={Calendar} label="Validity" color="#a78bfa" />
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] text-text-muted">Valid From <span className="opacity-60">(optional)</span></label>
                      <input type="date" className="input-base text-xs"
                        value={validFrom} onChange={e => setValidFrom(e.target.value)} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-text-muted">Expiration Date <span className="opacity-60">(optional)</span></label>
                      <input type="date" className="input-base text-xs"
                        value={expiresOn} onChange={e => setExpiresOn(e.target.value)} />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-text-muted">Department Kb</label>
                    <select className="input-base text-xs" value={tag} onChange={e => setTag(e.target.value)}>
                      {TAGS.map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                </div>

                {/* Approval Mode */}
                <div className="space-y-3">
                  <SectionHeader icon={Lock} label="Approval Mode" color="#fbbf24" />

                  <div className="space-y-2">
                    {/* Self */}
                    <button
                      className="w-full flex items-start gap-3 p-3.5 rounded-xl text-left transition-all"
                      style={{
                        background: approvalMode === 'self' ? 'rgba(45,212,191,0.08)' : 'rgba(255,255,255,0.02)',
                        border: `1px solid ${approvalMode === 'self' ? 'rgba(45,212,191,0.35)' : 'rgba(255,255,255,0.08)'}`,
                      }}
                      onClick={() => setApprovalMode('self')}>
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                        style={{ background: approvalMode === 'self' ? 'rgba(45,212,191,0.15)' : 'rgba(255,255,255,0.04)' }}>
                        <Zap size={15} style={{ color: approvalMode === 'self' ? '#2dd4bf' : '#475569' }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="text-xs font-semibold text-text-primary">Self-approve</p>
                          {approvalMode === 'self' && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                              style={{ background: 'rgba(45,212,191,0.15)', color: '#2dd4bf', border: '1px solid rgba(45,212,191,0.3)' }}>
                              ⚡ Auto-verified
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-text-muted leading-snug">
                          I am the sole author and approver. Fact becomes Verified immediately upon creation.
                        </p>
                      </div>
                      <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-1"
                        style={{
                          background: approvalMode === 'self' ? '#2dd4bf' : 'transparent',
                          border: `2px solid ${approvalMode === 'self' ? '#2dd4bf' : 'rgba(255,255,255,0.2)'}`,
                        }}>
                        {approvalMode === 'self' && <div className="w-1.5 h-1.5 rounded-full bg-[#131825]" />}
                      </div>
                    </button>

                    {/* Peer */}
                    <button
                      className="w-full flex items-start gap-3 p-3.5 rounded-xl text-left transition-all"
                      style={{
                        background: approvalMode === 'peer' ? 'rgba(167,139,250,0.08)' : 'rgba(255,255,255,0.02)',
                        border: `1px solid ${approvalMode === 'peer' ? 'rgba(167,139,250,0.35)' : 'rgba(255,255,255,0.08)'}`,
                      }}
                      onClick={() => setApprovalMode('peer')}>
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                        style={{ background: approvalMode === 'peer' ? 'rgba(167,139,250,0.15)' : 'rgba(255,255,255,0.04)' }}>
                        <Users size={15} style={{ color: approvalMode === 'peer' ? '#a78bfa' : '#475569' }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="text-xs font-semibold text-text-primary">Peer approval</p>
                          {approvalMode === 'peer' && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                              style={{ background: 'rgba(167,139,250,0.15)', color: '#a78bfa', border: '1px solid rgba(167,139,250,0.3)' }}>
                              Review queue
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-text-muted leading-snug">
                          Requires sign-off from one or more peers before becoming Verified.
                        </p>
                      </div>
                      <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-1"
                        style={{
                          background: approvalMode === 'peer' ? '#a78bfa' : 'transparent',
                          border: `2px solid ${approvalMode === 'peer' ? '#a78bfa' : 'rgba(255,255,255,0.2)'}`,
                        }}>
                        {approvalMode === 'peer' && <div className="w-1.5 h-1.5 rounded-full bg-[#131825]" />}
                      </div>
                    </button>
                  </div>

                  {/* Peer options */}
                  {approvalMode === 'peer' && (
                    <div className="space-y-3 rounded-xl p-3.5"
                      style={{ background: 'rgba(124,92,252,0.05)', border: '1px solid rgba(124,92,252,0.18)' }}>

                      {/* Reviewer picker — unlimited selection */}
                      <div className="space-y-1">
                        <p className="text-[11px] text-text-muted font-medium">
                          Select one or more approvers — all must sign off before the fact becomes Verified.
                        </p>
                      </div>
                      <ReviewerPicker
                        selected={reviewers}
                        onToggle={toggleReviewer}
                        max={PEOPLE.length}
                      />

                      {/* Attestation path preview */}
                      <div className="flex items-center gap-1 pt-1">
                        {['Create', ...reviewers.map((_, i) => `Approve ${reviewers.length > 1 ? i + 1 : ''}`), 'Verified'].map((step, i, arr) => (
                          <React.Fragment key={step + i}>
                            <div className="flex flex-col items-center gap-0.5">
                              <div className="w-5 h-5 rounded-full flex items-center justify-center"
                                style={{
                                  background: i === arr.length - 1 ? 'rgba(34,197,94,0.15)' : 'rgba(167,139,250,0.12)',
                                  border: `1px solid ${i === arr.length - 1 ? 'rgba(34,197,94,0.4)' : 'rgba(167,139,250,0.3)'}`,
                                }}>
                                {i === arr.length - 1
                                  ? <CheckCircle size={9} style={{ color: '#4ade80' }} />
                                  : <span className="text-[8px] font-bold" style={{ color: '#a78bfa' }}>{i + 1}</span>}
                              </div>
                              <p className="text-[8px] text-text-muted text-center leading-tight max-w-[44px]">{step.trim()}</p>
                            </div>
                            {i < arr.length - 1 && (
                              <ChevronRight size={9} className="text-text-muted opacity-25 shrink-0 mb-3" />
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        {!submitted && (
          <div className="flex items-center justify-between px-6 py-4 shrink-0"
            style={{ borderTop: '1px solid var(--slideout-border)' }}>
            <p className="text-[11px] text-text-muted">
              {approvalMode === 'self'
                ? 'Fact will be immediately Verified upon creation.'
                : reviewers.length > 0
                  ? `Fact will require sign-off from ${reviewers.length} reviewer${reviewers.length > 1 ? 's' : ''}.`
                  : 'Fact will enter the review queue pending peer approval.'}
            </p>
            <div className="flex items-center gap-2.5">
              <button className="btn-secondary text-xs py-1.5 px-4" onClick={onClose}>Cancel</button>
              <button
                className="flex items-center gap-1.5 text-xs font-semibold py-1.5 px-4 rounded-lg transition-all"
                style={{
                  background: approvalMode === 'self'
                    ? 'linear-gradient(135deg, #0d9488, #0891b2)'
                    : 'linear-gradient(135deg, #7c5cfc, #60a5fa)',
                  color: '#fff',
                  boxShadow: approvalMode === 'self'
                    ? '0 2px 12px rgba(13,148,136,0.35)'
                    : '0 2px 12px rgba(124,92,252,0.35)',
                }}
                onClick={handleSubmit}>
                {approvalMode === 'self'
                  ? <><Zap size={12} /> Create & Verify</>
                  : <><Shield size={12} /> Submit for Review</>}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  )
}
