import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import {
  X, Sparkles, CheckCircle, AlertTriangle, FileText, FileSearch,
  ChevronRight, Calendar, Lock, TrendingUp, Zap, Users, Send, Plus, Upload,
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
const TAGS = ['Finance', 'Compliance', 'Legal', 'Operations', 'Contracts', 'Eligibility']

function SectionHeader({ icon: Icon, label, color = '#a78bfa' }) {
  return (
    <div className="flex items-center gap-2 pb-1.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <Icon size={13} style={{ color }} />
      <p className="text-xs font-semibold text-text-secondary">{label}</p>
    </div>
  )
}

// ── Success screen ────────────────────────────────────────────────────────────
function SuccessView({ fact, onClose }) {
  const proposalId = `PROP-${String(Date.now()).slice(-4)}`
  return (
    <div className="flex flex-col items-center justify-center py-12 px-8 text-center gap-5">
      <div className="w-14 h-14 rounded-full flex items-center justify-center"
        style={{ background: 'rgba(167,139,250,0.15)', border: '2px solid rgba(167,139,250,0.4)' }}>
        <CheckCircle size={28} style={{ color: '#a78bfa' }} />
      </div>
      <div>
        <p className="text-lg font-bold text-text-primary mb-1">Proposal Submitted</p>
        <p className="text-sm text-text-muted max-w-xs leading-relaxed">
          Your change proposal has been added to the governance review queue.
          The verified fact remains unchanged until the attestation chain approves it.
        </p>
      </div>
      <div className="w-full rounded-xl p-4 text-left"
        style={{ background: 'rgba(124,92,252,0.08)', border: '1px solid rgba(124,92,252,0.3)' }}>
        <div className="flex items-center gap-2 mb-2.5">
          <span className="text-[10px] font-mono text-text-muted">{proposalId}</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full font-medium"
            style={{ background: 'rgba(245,158,11,0.15)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.3)' }}>
            Pending Review
          </span>
        </div>
        <p className="text-xs text-text-muted mb-1">
          Linked to: <span className="font-medium text-text-secondary">{fact.id} — {fact.title}</span>
        </p>
        <p className="text-xs text-text-muted">
          Submitted by: <span className="font-medium text-text-secondary">Alex Rivera</span>
        </p>
      </div>
      <div className="flex items-start gap-2 w-full rounded-lg p-3 text-left"
        style={{ background: 'rgba(59,130,246,0.07)', border: '1px solid rgba(59,130,246,0.2)' }}>
        <AlertTriangle size={13} style={{ color: '#60a5fa' }} className="shrink-0 mt-0.5" />
        <p className="text-[11px] text-text-muted leading-relaxed">
          The verified truth is <strong className="text-text-secondary">unchanged</strong>. A reviewer
          must sign off through the governance review queue before this proposal takes effect.
        </p>
      </div>
      <button className="btn-secondary w-full justify-center" onClick={onClose}>Close</button>
    </div>
  )
}

// ── Main modal ────────────────────────────────────────────────────────────────
export default function ProposeChangeModal({ fact, onClose, onSubmit }) {
  // Left column
  const [title,        setTitle]        = useState(fact?.title        || '')
  const [proposedText, setProposedText] = useState(fact?.text?.replace(/"/g, '') || '')
  const [reason,       setReason]       = useState('')
  const [sourceType,   setSourceType]   = useState('Document')
  const [selectedDocs, setSelectedDocs] = useState([])
  const [sourcePerson, setSourcePerson] = useState(null)
  const [personOpen,   setPersonOpen]   = useState(false)
  const [evidenceNotes, setEvidenceNotes] = useState('')

  // Right column
  const [confidence,    setConfidence]    = useState(String(fact?.confidence ?? '95'))
  const [risk,          setRisk]          = useState(fact?.risk        ?? 'Low')
  const [polarity,      setPolarity]      = useState(fact?.polarity    ?? '+')
  const [validFrom,     setValidFrom]     = useState('')
  const [expiresOn,     setExpiresOn]     = useState('')
  const [tag,           setTag]           = useState(fact?.tag         ?? 'Finance')
  const [effectiveDate, setEffectiveDate] = useState('')
  const [urgency,       setUrgency]       = useState('medium')
  const [approvalMode,  setApprovalMode]  = useState('peer')

  const [submitted, setSubmitted] = useState(false)

  const toggleDoc = f => setSelectedDocs(p => p.includes(f) ? p.filter(x => x !== f) : [...p, f])

  const handleSubmit = () => {
    setSubmitted(true)
    onSubmit?.({
      factId: fact?.id,
      factTitle: title,
      proposedText,
      reason,
      confidence: Number(confidence),
      risk,
      polarity,
      validFrom,
      expiresOn,
      tag,
      effectiveDate,
      urgency,
      approvalMode,
      submittedBy: 'Alex Rivera',
      status: 'pending',
    })
  }

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}>
      <div className="w-full rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        style={{ maxWidth: 880, maxHeight: '92vh', background: 'var(--modal-bg)', border: '1px solid rgba(124,92,252,0.35)' }}
        onClick={e => e.stopPropagation()}>

        {/* ── Header ── */}
        <div className="flex items-center gap-3 px-6 py-4 shrink-0"
          style={{ borderBottom: '1px solid var(--slideout-border)' }}>
          <div className="p-2 rounded-xl shrink-0"
            style={{ background: 'rgba(124,92,252,0.12)', border: '1px solid rgba(124,92,252,0.28)' }}>
            <Sparkles size={15} style={{ color: '#a78bfa' }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-mono text-text-muted mb-0.5">{fact?.id} · Proposal</p>
            <p className="text-sm font-semibold text-text-primary">Propose a Change</p>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded mr-1"
            style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)', border: '1px solid rgba(255,255,255,0.1)' }}>
            {fact?.tag}
          </span>
          <button className="btn-ghost p-1.5 rounded-lg shrink-0" onClick={onClose}><X size={14} /></button>
        </div>

        {/* ── Body ── */}
        <div className="flex-1 overflow-y-auto">
          {submitted ? (
            <SuccessView fact={fact} onClose={onClose} />
          ) : (
            <div className="grid grid-cols-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>

              {/* ════ LEFT ════ */}
              <div className="p-6 space-y-6" style={{ borderRight: '1px solid rgba(255,255,255,0.06)' }}>

                {/* Basic Information */}
                <div className="space-y-3">
                  <SectionHeader icon={FileText} label="Basic Information" color="#60a5fa" />

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-text-secondary">Fact Title</label>
                    <input
                      className="input-base text-xs"
                      placeholder="e.g., Service Level Agreement – Uptime Guarantee"
                      value={title}
                      onChange={e => setTitle(e.target.value)} />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-text-secondary flex items-center gap-1">
                      Proposed Statement <span style={{ color: '#f87171' }}>*</span>
                    </label>
                    <textarea
                      className="input-base resize-none text-xs leading-relaxed"
                      rows={5}
                      placeholder="Enter the exact proposed truth statement..."
                      value={proposedText}
                      onChange={e => setProposedText(e.target.value)} />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-text-secondary">
                      Rationale <span className="text-text-muted font-normal">(why this change)</span>
                    </label>
                    <textarea
                      className="input-base resize-none text-xs leading-relaxed"
                      rows={3}
                      placeholder="Explain the business or legal reason for this proposal..."
                      value={reason}
                      onChange={e => setReason(e.target.value)} />
                  </div>
                </div>

                {/* Evidence & Source */}
                <div className="space-y-3">
                  <SectionHeader icon={FileSearch} label="Evidence & Source" color="#60a5fa" />

                  <div className="flex gap-1 p-1 rounded-lg"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                    {['Document', 'Human'].map(opt => (
                      <button key={opt}
                        className="flex-1 py-1.5 rounded-md text-xs font-medium transition-all"
                        style={sourceType === opt
                          ? { background: 'rgba(96,165,250,0.18)', color: '#60a5fa', border: '1px solid rgba(96,165,250,0.35)' }
                          : { color: 'var(--text-muted)' }}
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
                            <label key={f}
                              className="flex items-center gap-2 p-2.5 rounded-lg cursor-pointer transition-all"
                              style={{
                                background: checked ? 'rgba(96,165,250,0.08)' : 'rgba(255,255,255,0.02)',
                                border: `1px solid ${checked ? 'rgba(96,165,250,0.35)' : 'rgba(255,255,255,0.07)'}`,
                              }}>
                              <div className="w-3.5 h-3.5 rounded flex items-center justify-center shrink-0"
                                style={{ background: checked ? '#3b82f6' : 'transparent', border: checked ? '1px solid #3b82f6' : '1px solid rgba(255,255,255,0.2)' }}
                                onClick={() => toggleDoc(f)}>
                                {checked && <CheckCircle size={9} color="white" />}
                              </div>
                              <FileText size={11} style={{ color: '#f87171' }} className="shrink-0" />
                              <span className="text-xs text-text-secondary truncate">{f}</span>
                            </label>
                          )
                        })}
                      </div>
                      <button className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs text-text-muted transition-all hover:text-text-secondary hover:border-white/20"
                        style={{ border: '1px dashed rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.01)' }}>
                        <Upload size={11} /> Upload a document
                      </button>
                    </div>
                  )}

                  {sourceType === 'Human' && (
                    <div className="space-y-1.5">
                      <p className="text-[11px] text-text-muted">Select the person providing this evidence</p>
                      <button
                        className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs transition-all"
                        style={{ background: 'var(--input-bg)', border: `1px solid ${personOpen ? 'rgba(96,165,250,0.5)' : 'var(--input-border)'}`, color: sourcePerson ? 'var(--text-primary)' : 'var(--text-muted)' }}
                        onClick={() => setPersonOpen(o => !o)}>
                        {sourcePerson ? (
                          <span className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white shrink-0"
                              style={{ background: sourcePerson.gradient }}>{sourcePerson.initials}</span>
                            <span className="font-medium text-text-primary">{sourcePerson.name}</span>
                          </span>
                        ) : <span>Select a person...</span>}
                        <ChevronRight size={12}
                          className={`transition-transform shrink-0 ${personOpen ? 'rotate-90' : ''}`}
                          style={{ color: 'var(--text-muted)' }} />
                      </button>
                      {personOpen && (
                        <div className="rounded-xl overflow-hidden"
                          style={{ border: '1px solid rgba(96,165,250,0.25)', background: '#131825' }}>
                          {PEOPLE.map((p, i) => (
                            <button key={p.email}
                              className="w-full flex items-center gap-3 px-4 py-3 text-left transition-all hover:bg-white/[0.04]"
                              style={{ background: sourcePerson?.email === p.email ? 'rgba(96,165,250,0.15)' : 'transparent', borderTop: i > 0 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}
                              onClick={() => { setSourcePerson(p); setPersonOpen(false) }}>
                              <span className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                                style={{ background: p.gradient }}>{p.initials}</span>
                              <span className="text-xs font-semibold text-text-primary">{p.name}</span>
                              <span className="text-xs text-text-muted ml-1">{p.email}</span>
                              {sourcePerson?.email === p.email && <CheckCircle size={12} className="ml-auto shrink-0" style={{ color: '#60a5fa' }} />}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {sourceType !== 'None' && (
                    <div className="space-y-1">
                      <label className="text-[11px] text-text-muted">Evidence notes <span className="opacity-60">(optional)</span></label>
                      <textarea
                        className="input-base resize-none text-xs"
                        rows={2}
                        placeholder="Reference specific sections, page numbers, or quotes..."
                        value={evidenceNotes}
                        onChange={e => setEvidenceNotes(e.target.value)} />
                    </div>
                  )}
                </div>
              </div>

              {/* ════ RIGHT ════ */}
              <div className="p-6 space-y-6">

                {/* Governance Signals */}
                <div className="space-y-3">
                  <SectionHeader icon={TrendingUp} label="Governance Signals" color="#60a5fa" />
                  <div className="grid grid-cols-3 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] text-text-muted">Confidence (%)</label>
                      <input className="input-base text-xs py-1.5 px-2"
                        type="number" min="0" max="100"
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
                  {/* Live confidence bar */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-text-muted">Confidence preview</span>
                      <span className="font-semibold"
                        style={{ color: Number(confidence) >= 90 ? '#4ade80' : Number(confidence) >= 70 ? '#fbbf24' : '#f87171' }}>
                        {confidence}%
                      </span>
                    </div>
                    <div className="rounded-full overflow-hidden" style={{ height: 5, background: 'rgba(255,255,255,0.06)' }}>
                      <div className="h-full rounded-full transition-all" style={{
                        width: `${Math.min(100, Math.max(0, Number(confidence)))}%`,
                        background: Number(confidence) >= 90
                          ? 'linear-gradient(90deg,#22c55e,#4ade80)'
                          : Number(confidence) >= 70
                            ? 'linear-gradient(90deg,#f59e0b,#fbbf24)'
                            : 'linear-gradient(90deg,#ef4444,#f87171)',
                      }} />
                    </div>
                  </div>
                </div>

                {/* Validity & Scope */}
                <div className="space-y-3">
                  <SectionHeader icon={Calendar} label="Validity & Scope" color="#a78bfa" />
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] text-text-muted">Valid From <span className="opacity-60">(optional)</span></label>
                      <input type="date" className="input-base text-xs"
                        value={validFrom} onChange={e => setValidFrom(e.target.value)} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-text-muted">Expiration <span className="opacity-60">(optional)</span></label>
                      <input type="date" className="input-base text-xs"
                        value={expiresOn} onChange={e => setExpiresOn(e.target.value)} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] text-text-muted">Knowledge Base</label>
                      <select className="input-base text-xs" value={tag} onChange={e => setTag(e.target.value)}>
                        {TAGS.map(t => <option key={t}>{t}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-text-muted">Effective Date <span className="opacity-60">(optional)</span></label>
                      <input type="date" className="input-base text-xs"
                        value={effectiveDate} onChange={e => setEffectiveDate(e.target.value)} />
                    </div>
                  </div>
                </div>

                {/* Urgency & Approval */}
                <div className="space-y-3">
                  <SectionHeader icon={Lock} label="Urgency & Approval" color="#fbbf24" />

                  {/* Urgency */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-text-muted">Urgency</label>
                    <div className="flex gap-1.5">
                      {[
                        { value: 'low',    label: 'Low',    color: '#60a5fa', border: 'rgba(59,130,246,0.4)',  bg: 'rgba(59,130,246,0.15)'  },
                        { value: 'medium', label: 'Normal', color: '#fbbf24', border: 'rgba(245,158,11,0.5)',  bg: 'rgba(245,158,11,0.15)'  },
                        { value: 'high',   label: 'Urgent', color: '#f87171', border: 'rgba(239,68,68,0.45)',  bg: 'rgba(239,68,68,0.15)'   },
                      ].map(u => (
                        <button key={u.value}
                          className="flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all"
                          style={urgency === u.value
                            ? { background: u.bg, border: `1px solid ${u.border}`, color: u.color }
                            : { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', color: '#64748b' }}
                          onClick={() => setUrgency(u.value)}>
                          {u.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Approval mode */}
                  <div className="space-y-2">
                    {/* Automatic */}
                    <button
                      className="w-full flex items-start gap-3 p-3 rounded-xl text-left transition-all"
                      style={{
                        background: approvalMode === 'self' ? 'rgba(45,212,191,0.08)' : 'rgba(255,255,255,0.02)',
                        border: `1px solid ${approvalMode === 'self' ? 'rgba(45,212,191,0.35)' : 'rgba(255,255,255,0.08)'}`,
                      }}
                      onClick={() => setApprovalMode('self')}>
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                        style={{ background: approvalMode === 'self' ? 'rgba(45,212,191,0.15)' : 'rgba(255,255,255,0.04)' }}>
                        <Zap size={14} style={{ color: approvalMode === 'self' ? '#2dd4bf' : '#475569' }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="text-xs font-semibold text-text-primary">Automatic</p>
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
                        style={{ background: approvalMode === 'self' ? '#2dd4bf' : 'transparent', border: `2px solid ${approvalMode === 'self' ? '#2dd4bf' : 'rgba(255,255,255,0.2)'}` }}>
                        {approvalMode === 'self' && <div className="w-1.5 h-1.5 rounded-full bg-[#131825]" />}
                      </div>
                    </button>

                    {/* Manual */}
                    <button
                      className="w-full flex items-start gap-3 p-3 rounded-xl text-left transition-all"
                      style={{
                        background: approvalMode === 'peer' ? 'rgba(167,139,250,0.08)' : 'rgba(255,255,255,0.02)',
                        border: `1px solid ${approvalMode === 'peer' ? 'rgba(167,139,250,0.35)' : 'rgba(255,255,255,0.08)'}`,
                      }}
                      onClick={() => setApprovalMode('peer')}>
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                        style={{ background: approvalMode === 'peer' ? 'rgba(167,139,250,0.15)' : 'rgba(255,255,255,0.04)' }}>
                        <Users size={14} style={{ color: approvalMode === 'peer' ? '#a78bfa' : '#475569' }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="text-xs font-semibold text-text-primary">Manual</p>
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
                        style={{ background: approvalMode === 'peer' ? '#a78bfa' : 'transparent', border: `2px solid ${approvalMode === 'peer' ? '#a78bfa' : 'rgba(255,255,255,0.2)'}` }}>
                        {approvalMode === 'peer' && <div className="w-1.5 h-1.5 rounded-full bg-[#131825]" />}
                      </div>
                    </button>
                  </div>

                  {/* Manual note card */}
                  {approvalMode === 'peer' && (
                    <div className="rounded-xl p-3.5"
                      style={{ background: 'rgba(124,92,252,0.05)', border: '1px solid rgba(124,92,252,0.18)' }}>
                      <p className="text-[11px] text-text-muted leading-relaxed">
                        Proposal will enter the review queue and require sign-off from a peer reviewer before becoming Verified.
                      </p>
                      <div className="flex items-center gap-1 pt-3">
                        {['Create', 'Approve', 'Verified'].map((step, i, arr) => (
                          <React.Fragment key={step}>
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
                              <p className="text-[8px] text-text-muted text-center leading-tight max-w-[44px]">{step}</p>
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
                ? 'Proposal will be automatically verified upon submission.'
                : 'Proposal will enter the governance review queue pending peer sign-off.'}
            </p>
            <div className="flex items-center gap-2.5">
              <button className="btn-secondary text-xs py-1.5 px-4" onClick={onClose}>Cancel</button>
              <button
                className="flex items-center gap-1.5 text-xs font-semibold py-1.5 px-5 rounded-lg transition-all hover:brightness-110"
                style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)', color: '#fff', boxShadow: '0 2px 12px rgba(124,92,252,0.35)' }}
                onClick={handleSubmit}>
                <Send size={12} /> Send Proposal
              </button>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  )
}
