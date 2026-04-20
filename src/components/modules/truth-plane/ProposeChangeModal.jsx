import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import { X, Sparkles, Shield, CheckCircle, AlertTriangle, MessageSquare, Send, FileText, ChevronRight, Calendar, Hash } from 'lucide-react'
import { factGovernance } from '../../../data/mock'

const people = [
  { name: 'Sarah Chen',      email: 'sarah.chen@company.com',      initials: 'SC', gradient: 'linear-gradient(135deg,#a78bfa,#60a5fa)' },
  { name: 'Michael Torres',  email: 'michael.torres@company.com',  initials: 'MT', gradient: 'linear-gradient(135deg,#f59e0b,#ef4444)' },
  { name: 'Emily Rodriguez', email: 'emily.rodriguez@company.com', initials: 'ER', gradient: 'linear-gradient(135deg,#4ade80,#22d3ee)' },
  { name: 'David Kim',       email: 'david.kim@company.com',       initials: 'DK', gradient: 'linear-gradient(135deg,#f87171,#fb923c)' },
]
const departments   = ['Sales', 'Marketing', 'Engineering', 'Product', 'Legal', 'Finance', 'Customer Success', 'HR']
const polarityColor = { '+': '#4ade80', '−': '#f87171', '·': '#94a3b8' }
const riskColorMap  = { Low: '#4ade80', Medium: '#fbbf24', High: '#f87171' }

// ── Attestation steps ─────────────────────────────────────────────────────────
const ATTEST_STEPS = [
  { label: 'Propose',  color: '#a78bfa', desc: 'You'         },
  { label: 'Review',   color: '#60a5fa', desc: 'Reviewer'    },
  { label: 'Approve',  color: '#4ade80', desc: 'Approver'    },
  { label: 'Verified', color: '#4ade80', desc: 'Truth Plane'  },
]

// ── Success screen ────────────────────────────────────────────────────────────
function SuccessView({ fact, onClose }) {
  const proposalId = `PROP-${String(Date.now()).slice(-4)}`
  return (
    <div className="flex flex-col items-center justify-center py-10 px-6 text-center gap-5">
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
        <p className="text-xs text-text-muted mb-1">Linked to: <span className="font-medium text-text-secondary">{fact.id} — {fact.title}</span></p>
        <p className="text-xs text-text-muted">Submitted by: <span className="font-medium text-text-secondary">Alex Rivera</span></p>
      </div>

      <div className="flex items-start gap-2 w-full rounded-lg p-3 text-left"
        style={{ background: 'rgba(59,130,246,0.07)', border: '1px solid rgba(59,130,246,0.2)' }}>
        <AlertTriangle size={13} style={{ color: '#60a5fa' }} className="shrink-0 mt-0.5" />
        <p className="text-[11px] text-text-muted leading-relaxed">
          The verified truth is <strong className="text-text-secondary">unchanged</strong>. A reviewer and approver must both sign off through the governance attestation chain before this takes effect.
        </p>
      </div>

      <button className="btn-secondary w-full justify-center" onClick={onClose}>Close</button>
    </div>
  )
}

// ── Main modal ────────────────────────────────────────────────────────────────
export default function ProposeChangeModal({ fact, onClose, onSubmit }) {
  // Right-panel state (all optional, matching SuggestChangeModal pattern)
  const [proposedText,     setProposedText]     = useState('')
  const [proposedContext,  setProposedContext]  = useState('')
  const [rationale,        setRationale]        = useState('')
  const [confidence,       setConfidence]       = useState('')
  const [risk,             setRisk]             = useState('')
  const [polarity,         setPolarity]         = useState('')
  const [suggestedSource,  setSuggestedSource]  = useState('')
  const [notes,            setNotes]            = useState('')
  const [submitted,        setSubmitted]        = useState(false)

  // Who receives
  const [sendTo,       setSendTo]       = useState('All')
  const [sendToPerson, setSendToPerson] = useState(null)
  const [personOpen,   setPersonOpen]   = useState(false)
  const [sendToDept,   setSendToDept]   = useState(null)
  const [deptOpen,     setDeptOpen]     = useState(false)

  const gov        = factGovernance[fact.id] || {}
  const riskColor  = riskColorMap[fact.risk] || '#94a3b8'
  const polColor   = polarityColor[fact.polarity] || '#94a3b8'
  const polLabel   = fact.polarity === '+' ? 'Positive' : fact.polarity === '−' ? 'Negative' : 'Neutral'

  const handleSubmit = () => {
    setSubmitted(true)
    onSubmit?.({
      factId: fact.id, factTitle: fact.title,
      proposedText, proposedContext, rationale,
      confidence, risk, polarity, suggestedSource, notes,
      sendTo, sendToPerson, sendToDept,
      submittedBy: 'Alex Rivera', status: 'pending',
    })
  }

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}>
      <div className="w-full rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        style={{ maxWidth: 820, maxHeight: '90vh', background: 'var(--modal-bg)', border: '1px solid var(--modal-border)' }}
        onClick={e => e.stopPropagation()}>

        {/* ── Header ── */}
        <div className="flex items-center gap-3 px-6 py-4 shrink-0"
          style={{ borderBottom: '1px solid var(--slideout-border)' }}>
          <div className="p-2 rounded-xl shrink-0"
            style={{ background: 'rgba(124,92,252,0.15)', border: '1px solid rgba(124,92,252,0.25)' }}>
            <Sparkles size={16} style={{ color: '#a78bfa' }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-text-primary">Propose a Change</p>
            <p className="text-xs text-text-muted mt-0.5">Creates a governance proposal — fact unchanged until the attestation chain approves</p>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded mr-1"
            style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)', border: '1px solid rgba(255,255,255,0.1)' }}>
            {fact.id}
          </span>
          <button className="btn-ghost p-1.5 rounded-lg" onClick={onClose}><X size={14} /></button>
        </div>

        {/* ── Body ── */}
        <div className="flex-1 overflow-y-auto">
          {submitted ? (
            <SuccessView fact={fact} onClose={onClose} />
          ) : (
            <div className="grid grid-cols-2 divide-x" style={{ divideColor: 'rgba(255,255,255,0.06)' }}>

              {/* ════ LEFT — Current Verified Fact (read-only) ════ */}
              <div className="p-6 space-y-4" style={{ borderRight: '1px solid rgba(255,255,255,0.06)' }}>
                <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#60a5fa' }}>Current Verified Fact</p>

                {/* Fact statement card */}
                <div className="rounded-xl p-4" style={{ background: 'rgba(59,130,246,0.07)', border: '1px solid rgba(59,130,246,0.2)' }}>
                  <div className="flex items-center gap-2 mb-2.5">
                    <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0" style={{ background: '#3b82f6' }}>
                      <span className="text-[8px] text-white font-bold">V</span>
                    </div>
                    <span className="text-[10px] font-mono text-text-muted">{fact.id}</span>
                    <span className="text-[10px] font-semibold" style={{ color: '#60a5fa' }}>Verified</span>
                    <Shield size={10} style={{ color: '#60a5fa' }} />
                    <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded font-medium"
                      style={{ background: 'rgba(124,92,252,0.1)', color: '#a78bfa', border: '1px solid rgba(124,92,252,0.2)' }}>
                      {fact.tag}
                    </span>
                  </div>
                  <p className="text-xs text-text-primary leading-relaxed">{fact.text?.replace(/"/g, '')}</p>
                </div>

                {/* Title */}
                <div>
                  <p className="text-[10px] text-text-muted mb-0.5">Title</p>
                  <p className="text-xs font-medium text-text-secondary">{fact.title}</p>
                </div>

                {/* Governance metrics */}
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'Confidence', value: `${fact.confidence}%`, color: fact.confidence >= 90 ? '#4ade80' : fact.confidence >= 70 ? '#fbbf24' : '#f87171' },
                    { label: 'Risk',       value: fact.risk,             color: riskColor },
                    { label: 'Polarity',   value: polLabel,              color: polColor  },
                  ].map(({ label, value, color }) => (
                    <div key={label} className="rounded-lg p-2.5 text-center"
                      style={{ background: `${color}10`, border: `1px solid ${color}28` }}>
                      <p className="text-[9px] text-text-muted mb-0.5">{label}</p>
                      <p className="text-xs font-bold" style={{ color }}>{value}</p>
                    </div>
                  ))}
                </div>

                {/* Expiry + Sources */}
                <div className="rounded-lg p-3 space-y-1.5"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <div className="flex items-center gap-2">
                    {fact.expired
                      ? <AlertTriangle size={11} style={{ color: '#f87171' }} />
                      : <Calendar size={11} style={{ color: '#94a3b8' }} />}
                    <p className={`text-[11px] ${fact.expired ? 'text-red-400' : 'text-text-muted'}`}>
                      {fact.expired ? 'Expired · ' : 'Expires · '}{fact.expiry}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText size={11} style={{ color: '#94a3b8' }} />
                    <p className="text-[11px] text-text-muted">{fact.sources} linked sources</p>
                  </div>
                </div>

                {/* Attestation status */}
                <div>
                  <p className="text-[10px] text-text-muted font-medium uppercase tracking-wide mb-2">Current Attestation</p>
                  <div className="space-y-1.5">
                    {[
                      { role: 'Created by',  data: gov.createdBy,  color: '#60a5fa' },
                      { role: 'Promoted by', data: gov.promotedBy, color: '#a78bfa' },
                      { role: 'Resolved by', data: gov.resolvedBy, color: '#2dd4bf' },
                      { role: 'Approved by', data: gov.approvedBy, color: '#4ade80' },
                    ].map(({ role, data, color }) => {
                      const done = Array.isArray(data) ? data[2] : !!data
                      const name = Array.isArray(data) ? data[0] : data
                      return (
                        <div key={role} className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg"
                          style={{
                            background: done ? `${color}0d` : 'rgba(255,255,255,0.02)',
                            border: `1px solid ${done ? color + '28' : 'rgba(255,255,255,0.06)'}`,
                          }}>
                          <div className="w-1.5 h-1.5 rounded-full shrink-0"
                            style={{ background: done ? color : 'rgba(255,255,255,0.15)' }} />
                          <span className="text-[10px] text-text-muted w-20 shrink-0">{role}</span>
                          <span className={`text-[10px] flex-1 truncate ${done ? 'text-text-secondary font-medium' : 'italic text-text-muted opacity-50'}`}>
                            {done ? name : 'Not fulfilled'}
                          </span>
                          {done
                            ? <CheckCircle size={10} style={{ color: '#4ade80', shrink: 0 }} />
                            : <AlertTriangle size={10} style={{ color: '#fbbf24', shrink: 0 }} />}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* ════ RIGHT — Proposal fields (editable) ════ */}
              <div className="p-6 space-y-4">
                <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#a78bfa' }}>Your Proposal</p>

                {/* Who receives */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-text-secondary flex items-center gap-1">
                    Who should receive this proposal?
                    <span className="text-[10px] text-text-muted font-normal ml-1">optional</span>
                  </label>
                  <div className="flex gap-1.5">
                    {['All', 'Person', 'Department'].map(opt => (
                      <button key={opt}
                        className="flex-1 py-1.5 rounded-lg text-xs font-medium transition-all"
                        style={sendTo === opt ? {
                          background: 'rgba(124,92,252,0.18)', color: '#a78bfa', border: '1px solid rgba(124,92,252,0.4)',
                        } : {
                          background: 'rgba(255,255,255,0.04)', color: 'var(--text-muted)', border: '1px solid rgba(255,255,255,0.08)',
                        }}
                        onClick={() => { setSendTo(opt); setSendToPerson(null); setSendToDept(null); setPersonOpen(false); setDeptOpen(false) }}>
                        {opt === 'All' && '🌐 '}{opt === 'Person' && '👤 '}{opt === 'Department' && '🏢 '}
                        {opt}
                      </button>
                    ))}
                  </div>
                  {sendTo === 'All' && (
                    <p className="text-[11px] text-text-muted px-1">
                      This proposal will be visible to all governance members with access to this fact.
                    </p>
                  )}
                  {sendTo === 'Person' && (
                    <div className="space-y-1">
                      <button
                        className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-all"
                        style={{ background: 'var(--input-bg)', border: `1px solid ${personOpen ? 'rgba(124,92,252,0.5)' : 'var(--input-border)'}`, color: sendToPerson ? 'var(--text-primary)' : 'var(--text-muted)' }}
                        onClick={() => setPersonOpen(o => !o)}>
                        {sendToPerson ? (
                          <span className="flex items-center gap-2">
                            <span className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold text-white shrink-0"
                              style={{ background: sendToPerson.gradient }}>{sendToPerson.initials}</span>
                            <span className="font-medium text-text-primary">{sendToPerson.name}</span>
                          </span>
                        ) : <span>Select a person...</span>}
                        <ChevronRight size={12} className={`transition-transform shrink-0 ${personOpen ? 'rotate-90' : ''}`} style={{ color: 'var(--text-muted)' }} />
                      </button>
                      {personOpen && (
                        <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(124,92,252,0.25)', background: '#131825' }}>
                          {people.map((p, i) => (
                            <button key={p.email}
                              className="w-full flex items-center gap-2.5 px-3 py-2.5 text-left transition-all hover:bg-white/[0.04]"
                              style={{ background: sendToPerson?.email === p.email ? 'rgba(124,92,252,0.18)' : 'transparent', borderTop: i > 0 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}
                              onClick={() => { setSendToPerson(p); setPersonOpen(false) }}>
                              <span className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white shrink-0" style={{ background: p.gradient }}>{p.initials}</span>
                              <span className="text-xs font-semibold text-text-primary">{p.name}</span>
                              <span className="text-xs text-text-muted">{p.email}</span>
                              {sendToPerson?.email === p.email && <CheckCircle size={12} className="ml-auto shrink-0" style={{ color: '#a78bfa' }} />}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  {sendTo === 'Department' && (
                    <div className="space-y-1">
                      <button
                        className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-all"
                        style={{ background: 'var(--input-bg)', border: `1px solid ${deptOpen ? 'rgba(124,92,252,0.5)' : 'var(--input-border)'}`, color: sendToDept ? 'var(--text-primary)' : 'var(--text-muted)' }}
                        onClick={() => setDeptOpen(o => !o)}>
                        {sendToDept ? <span className="font-medium text-text-primary">🏢 {sendToDept}</span> : <span>Select a department...</span>}
                        <ChevronRight size={12} className={`transition-transform shrink-0 ${deptOpen ? 'rotate-90' : ''}`} style={{ color: 'var(--text-muted)' }} />
                      </button>
                      {deptOpen && (
                        <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(124,92,252,0.25)', background: '#131825' }}>
                          {departments.map((d, i) => (
                            <button key={d}
                              className="w-full flex items-center gap-2.5 px-3 py-2.5 text-left transition-all hover:bg-white/[0.04]"
                              style={{ background: sendToDept === d ? 'rgba(124,92,252,0.18)' : 'transparent', borderTop: i > 0 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}
                              onClick={() => { setSendToDept(d); setDeptOpen(false) }}>
                              <span className="text-xs font-medium text-text-secondary">{d}</span>
                              {sendToDept === d && <CheckCircle size={12} className="ml-auto shrink-0" style={{ color: '#a78bfa' }} />}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }} />

                {/* Proposed fact text */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-text-secondary flex items-center gap-1">
                    Proposed Fact Text
                    <span className="text-[10px] text-text-muted font-normal ml-1">optional</span>
                  </label>
                  <textarea
                    className="input-base resize-none text-xs leading-relaxed"
                    rows={5}
                    placeholder="Propose an updated version of the verified fact statement..."
                    value={proposedText}
                    onChange={e => setProposedText(e.target.value)}
                  />
                </div>

                {/* Proposed context */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-text-secondary flex items-center gap-1">
                    Proposed Context
                    <span className="text-[10px] text-text-muted font-normal ml-1">optional</span>
                  </label>
                  <textarea
                    className="input-base resize-none text-xs leading-relaxed"
                    rows={3}
                    placeholder="Propose an updated governance context for this fact..."
                    value={proposedContext}
                    onChange={e => setProposedContext(e.target.value)}
                  />
                </div>

                {/* Rationale */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-text-secondary flex items-center gap-1">
                    Rationale
                    <span className="text-[10px] text-text-muted font-normal ml-1">optional</span>
                  </label>
                  <textarea
                    className="input-base resize-none text-xs leading-relaxed"
                    rows={3}
                    placeholder="Explain why this change improves the verified fact..."
                    value={rationale}
                    onChange={e => setRationale(e.target.value)}
                  />
                </div>

                {/* Suggested metrics */}
                <div>
                  <p className="text-xs font-medium text-text-secondary mb-2">
                    Suggested Metrics
                    <span className="text-[10px] text-text-muted font-normal ml-1">optional</span>
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] text-text-muted">Confidence (%)</label>
                      <input className="input-base text-xs py-1.5 px-2"
                        placeholder={String(fact.confidence)}
                        value={confidence}
                        onChange={e => setConfidence(e.target.value)} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-text-muted">Risk Level</label>
                      <select className="input-base text-xs py-1.5 px-2" value={risk} onChange={e => setRisk(e.target.value)}>
                        <option value="">— keep —</option>
                        <option>Low</option><option>Medium</option><option>High</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-text-muted">Polarity</label>
                      <select className="input-base text-xs py-1.5 px-2" value={polarity} onChange={e => setPolarity(e.target.value)}>
                        <option value="">— keep —</option>
                        <option value="+">Positive</option>
                        <option value="−">Negative</option>
                        <option value="·">Neutral</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Suggested source */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-text-secondary flex items-center gap-1">
                    Suggested Source
                    <span className="text-[10px] text-text-muted font-normal ml-1">optional</span>
                  </label>
                  <input
                    className="input-base text-xs"
                    placeholder="e.g., New document, section, or reference..."
                    value={suggestedSource}
                    onChange={e => setSuggestedSource(e.target.value)}
                  />
                </div>

                {/* Attestation path — read-only governance flow */}
                <div className="rounded-xl p-3.5"
                  style={{ background: 'rgba(124,92,252,0.06)', border: '1px solid rgba(124,92,252,0.2)' }}>
                  <p className="text-[10px] font-semibold uppercase tracking-wider mb-3" style={{ color: '#a78bfa' }}>
                    Attestation Path
                  </p>
                  <div className="flex items-center gap-1">
                    {ATTEST_STEPS.map((step, i) => (
                      <React.Fragment key={step.label}>
                        <div className="flex flex-col items-center gap-1 flex-1">
                          <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                            style={{ background: `${step.color}22`, border: `1px solid ${step.color}55` }}>
                            {i === ATTEST_STEPS.length - 1
                              ? <CheckCircle size={10} style={{ color: step.color }} />
                              : <span className="text-[8px] font-bold" style={{ color: step.color }}>{i + 1}</span>}
                          </div>
                          <p className="text-[9px] font-semibold text-center leading-tight" style={{ color: step.color }}>{step.label}</p>
                          <p className="text-[9px] text-text-muted text-center leading-tight">{step.desc}</p>
                        </div>
                        {i < ATTEST_STEPS.length - 1 && (
                          <ChevronRight size={10} className="text-text-muted opacity-30 shrink-0 mb-4" />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                {/* Additional notes */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-text-secondary flex items-center gap-1">
                    Additional Notes
                    <span className="text-[10px] text-text-muted font-normal ml-1">optional</span>
                  </label>
                  <textarea
                    className="input-base resize-none text-xs leading-relaxed"
                    rows={2}
                    placeholder="Any extra context, references, or comments..."
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                  />
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
              Proposals enter the full governance attestation process before taking effect.
            </p>
            <div className="flex items-center gap-2.5">
              <button className="btn-secondary text-xs py-1.5 px-4" onClick={onClose}>Cancel</button>
              <button
                className="flex items-center gap-1.5 text-xs font-semibold py-1.5 px-4 rounded-lg transition-all"
                style={{ background: 'linear-gradient(135deg, #7c5cfc, #60a5fa)', color: '#fff', boxShadow: '0 2px 12px rgba(124,92,252,0.35)' }}
                onClick={handleSubmit}>
                <Sparkles size={12} /> Submit Proposal
              </button>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  )
}
