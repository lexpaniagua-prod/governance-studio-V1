import React, { useState, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { X, ArrowUpCircle, Search, CheckCircle } from 'lucide-react'
import { Badge } from '../../ui/index'

// ── Static data ───────────────────────────────────────────────────────────────

const ESCALATION_REASONS = [
  { id: 'expert-input',         label: 'Needs expert input'    },
  { id: 'conflicting-evidence', label: 'Conflicting evidence'  },
  { id: 'high-risk',            label: 'High risk / sensitive' },
  { id: 'unclear-policy',       label: 'Unclear policy'        },
  { id: 'other',                label: 'Other'                 },
]

const ALL_USERS = [
  { id: 'u1', name: 'Sarah Chen',     role: 'Compliance Lead', initials: 'SC', gradient: 'linear-gradient(135deg,#3b82f6,#60a5fa)' },
  { id: 'u2', name: 'James Park',     role: 'Legal',           initials: 'JP', gradient: 'linear-gradient(135deg,#6366f1,#a78bfa)' },
  { id: 'u3', name: 'Emma Rodriguez', role: 'Finance',         initials: 'ER', gradient: 'linear-gradient(135deg,#059669,#4ade80)' },
  { id: 'u4', name: 'Alex Rivera',    role: 'Governance',      initials: 'AR', gradient: 'linear-gradient(135deg,#d97706,#fbbf24)' },
  { id: 'u5', name: 'Maria Santos',   role: 'Compliance',      initials: 'MS', gradient: 'linear-gradient(135deg,#dc2626,#f87171)' },
  { id: 'u6', name: 'David Kim',      role: 'Engineering',     initials: 'DK', gradient: 'linear-gradient(135deg,#0891b2,#2dd4bf)' },
]

const REASON_BADGE_VARIANT = {
  'expiring':           'review',
  'evidence-changed':   'conflict',
  'conflicting-signal': 'conflict',
  'manual':             'pending',
}

// ── Sub-components ────────────────────────────────────────────────────────────

function Pill({ label, selected, onClick, color = 'blue' }) {
  const colors = {
    blue:   { sel: ['rgba(59,130,246,0.18)', 'rgba(59,130,246,0.5)', '#60a5fa'] },
    orange: { sel: ['rgba(245,158,11,0.18)', 'rgba(245,158,11,0.5)', '#fbbf24'] },
    gray:   { sel: ['rgba(100,116,139,0.18)', 'rgba(100,116,139,0.4)', '#94a3b8'] },
  }
  const [bg, border, text] = colors[color]?.sel || colors.blue.sel
  return (
    <button type="button" onClick={onClick}
      className="text-[11px] px-2.5 py-1 rounded-full font-medium transition-all border"
      style={selected
        ? { background: bg, borderColor: border, color: text }
        : { background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.1)', color: '#64748b' }
      }>
      {label}
    </button>
  )
}

function Avatar({ user, size = 6 }) {
  const px = size * 4
  return (
    <div
      className={`w-${size} h-${size} rounded-full flex items-center justify-center shrink-0 font-bold text-white`}
      style={{ background: user.gradient, fontSize: size <= 6 ? 9 : 11, width: px, height: px }}>
      {user.initials}
    </div>
  )
}

// ── Main modal ────────────────────────────────────────────────────────────────

export default function EscalateModal({ item, onClose, onSubmit }) {
  const [reason,       setReason]       = useState('')
  const [otherReason,  setOtherReason]  = useState('')
  const [assignedTo,   setAssignedTo]   = useState([])   // multi-select
  const [userSearch,   setUserSearch]   = useState('')
  const [message,      setMessage]      = useState('')
  const [priority,     setPriority]     = useState('Normal')
  const [errors,       setErrors]       = useState({})

  // Pre-suggested: last approver first, then 2 others
  const suggested = useMemo(() => {
    const approverName = item.lastApprovedBy
    if (!approverName) return ALL_USERS.slice(0, 3)
    const found = ALL_USERS.find(u => u.name === approverName)
    const rest   = ALL_USERS.filter(u => u.name !== approverName)
    return found ? [found, ...rest].slice(0, 3) : ALL_USERS.slice(0, 3)
  }, [item.lastApprovedBy])

  const searchResults = useMemo(() => {
    if (!userSearch.trim()) return []
    const q = userSearch.toLowerCase()
    return ALL_USERS.filter(u =>
      !assignedTo.find(a => a.id === u.id) &&
      (u.name.toLowerCase().includes(q) || u.role.toLowerCase().includes(q))
    )
  }, [userSearch, assignedTo])

  const toggleUser = (user) => {
    setAssignedTo(prev =>
      prev.find(u => u.id === user.id)
        ? prev.filter(u => u.id !== user.id)
        : [...prev, user]
    )
    setErrors(e => ({ ...e, assignedTo: '' }))
    setUserSearch('')
  }

  const removeUser = (id) =>
    setAssignedTo(prev => prev.filter(u => u.id !== id))

  const validate = () => {
    const e = {}
    if (!reason)                               e.reason     = 'Select a reason.'
    if (reason === 'other' && !otherReason.trim()) e.otherReason = 'Describe the reason.'
    if (assignedTo.length === 0)               e.assignedTo = 'Assign at least one collaborator.'
    if (!message.trim())                       e.message    = 'A message is required.'
    return e
  }

  const handleSubmit = () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }

    onSubmit?.({
      escalated:            true,
      escalated_to:         assignedTo.map(u => u.name),
      escalated_to_details: assignedTo,
      escalation_reason:    reason === 'other'
                              ? otherReason.trim()
                              : ESCALATION_REASONS.find(r => r.id === reason)?.label,
      escalation_reason_id: reason,
      escalation_message:   message.trim(),
      escalation_priority:  priority,
      escalated_by:         'Alex Rivera',
      escalated_at:         new Date().toISOString().slice(0, 10),
    })
  }

  const riskColor = item.risk === 'Low' ? '#4ade80' : item.risk === 'Medium' ? '#fbbf24' : '#f87171'
  const confColor = item.confidence >= 90 ? '#4ade80' : item.confidence >= 70 ? '#fbbf24' : '#f87171'

  return createPortal(
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-[9998] bg-black/55 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none">
        <div className="pointer-events-auto w-full max-w-[480px] rounded-2xl flex flex-col"
          style={{
            background: 'var(--slideout-bg)',
            border: '1px solid var(--slideout-border)',
            maxHeight: '88vh',
          }}>

          {/* ── Header ── */}
          <div className="flex items-center justify-between px-5 py-4 shrink-0"
            style={{ borderBottom: '1px solid var(--slideout-border)' }}>
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)' }}>
                <ArrowUpCircle size={14} style={{ color: '#fbbf24' }} />
              </div>
              <div>
                <p className="text-sm font-semibold text-text-primary">Escalate</p>
                <p className="text-[10px] text-text-muted">Ask for help or decision from other collaborators</p>
              </div>
            </div>
            <button className="btn-ghost p-1.5 shrink-0" onClick={onClose}><X size={14} /></button>
          </div>

          {/* ── Scrollable body ── */}
          <div className="overflow-y-auto flex-1 px-5 py-4 space-y-5">

            {/* 1 ── Fact Context */}
            <div className="rounded-xl px-3.5 py-3"
              style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <p className="text-[11px] font-semibold text-text-secondary leading-tight flex-1">{item.factTitle}</p>
                <span className="text-[10px] font-mono text-text-muted shrink-0 pt-0.5">{item.id}</span>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <Badge variant={REASON_BADGE_VARIANT[item.reason] || 'pending'}>{item.reasonLabel}</Badge>
                {item.priority === 'high' && <Badge variant="conflict">High Priority</Badge>}
                <span className="text-[10px] font-medium ml-auto" style={{ color: confColor }}>{item.confidence}% conf</span>
                <span className="text-[10px] font-medium" style={{ color: riskColor }}>{item.risk} risk</span>
              </div>
            </div>

            {/* 2 ── Why are you escalating? */}
            <div>
              <p className="section-label mb-2">
                Why are you escalating? <span style={{ color: '#f87171' }}>*</span>
              </p>
              <div className="flex flex-wrap gap-1.5">
                {ESCALATION_REASONS.map(r => (
                  <Pill key={r.id} label={r.label} color="orange"
                    selected={reason === r.id}
                    onClick={() => { setReason(r.id); setErrors(e => ({ ...e, reason: '', otherReason: '' })) }} />
                ))}
              </div>
              {errors.reason && <p className="text-[10px] text-red-400 mt-1">{errors.reason}</p>}
              {reason === 'other' && (
                <input
                  className="input-base w-full text-xs mt-2"
                  placeholder="Describe the reason…"
                  value={otherReason}
                  onChange={e => { setOtherReason(e.target.value); setErrors(er => ({ ...er, otherReason: '' })) }} />
              )}
              {errors.otherReason && <p className="text-[10px] text-red-400 mt-1">{errors.otherReason}</p>}
            </div>

            {/* 3 ── Assign collaborators */}
            <div>
              <p className="section-label mb-2">
                Assign collaborators <span style={{ color: '#f87171' }}>*</span>
              </p>

              {/* Selected chips */}
              {assignedTo.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {assignedTo.map(u => (
                    <div key={u.id}
                      className="flex items-center gap-1.5 px-2 py-1 rounded-full text-[11px]"
                      style={{ background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.3)' }}>
                      <Avatar user={u} size={5} />
                      <span className="font-medium" style={{ color: '#fbbf24' }}>{u.name}</span>
                      <button className="btn-ghost p-0.5 rounded-full ml-0.5" onClick={() => removeUser(u.id)}>
                        <X size={9} style={{ color: '#fbbf24' }} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Suggestions (hide already-selected) */}
              {assignedTo.length < 3 && (
                <div className="flex gap-1.5 mb-2 flex-wrap">
                  {suggested
                    .filter(u => !assignedTo.find(a => a.id === u.id))
                    .map(u => (
                      <button key={u.id} type="button"
                        onClick={() => toggleUser(u)}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] transition-all border hover:brightness-110"
                        style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.1)', color: '#94a3b8' }}>
                        <Avatar user={u} size={5} />
                        <span className="font-medium text-text-secondary">{u.name}</span>
                        <span className="text-text-muted text-[10px]">{u.role}</span>
                      </button>
                    ))}
                </div>
              )}

              {/* Search */}
              <div className="relative">
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg"
                  style={{ background: 'var(--input-bg)', border: `1px solid ${errors.assignedTo ? 'rgba(239,68,68,0.5)' : 'var(--input-border)'}` }}>
                  <Search size={12} className="text-text-muted shrink-0" />
                  <input
                    className="bg-transparent text-xs text-text-secondary outline-none flex-1 placeholder:text-text-muted"
                    placeholder="Search collaborators…"
                    value={userSearch}
                    onChange={e => setUserSearch(e.target.value)} />
                </div>
                {searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 rounded-lg overflow-hidden shadow-xl z-10"
                    style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)' }}>
                    {searchResults.map(u => (
                      <button key={u.id} type="button"
                        onClick={() => toggleUser(u)}
                        className="flex items-center gap-2.5 w-full px-3 py-2 text-xs hover:bg-white/5 transition-colors text-left">
                        <Avatar user={u} size={6} />
                        <span className="font-medium text-text-secondary">{u.name}</span>
                        <span className="text-text-muted ml-auto">{u.role}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {errors.assignedTo && <p className="text-[10px] text-red-400 mt-1">{errors.assignedTo}</p>}
            </div>

            {/* 4 ── Message */}
            <div>
              <p className="section-label mb-2">
                Message <span style={{ color: '#f87171' }}>*</span>
              </p>
              <textarea
                className={`input-base w-full text-xs resize-none leading-relaxed ${errors.message ? 'border-red-500/50' : ''}`}
                rows={3}
                placeholder="Explain what you need help with…"
                value={message}
                onChange={e => { setMessage(e.target.value); setErrors(er => ({ ...er, message: '' })) }} />
              {errors.message && <p className="text-[10px] text-red-400 mt-1">{errors.message}</p>}
            </div>

            {/* 5 ── Priority */}
            <div>
              <p className="section-label mb-2">Priority <span className="text-text-muted font-normal">(optional)</span></p>
              <div className="flex gap-1.5">
                <Pill label="Normal" color="gray"
                  selected={priority === 'Normal'}
                  onClick={() => setPriority('Normal')} />
                <Pill label="High" color="orange"
                  selected={priority === 'High'}
                  onClick={() => setPriority('High')} />
              </div>
            </div>

          </div>

          {/* ── Footer ── */}
          <div className="flex items-center justify-end gap-2.5 px-5 py-4 shrink-0"
            style={{ borderTop: '1px solid var(--slideout-border)' }}>
            <button className="btn-secondary text-xs" onClick={onClose}>Cancel</button>
            <button
              className="btn-primary text-xs gap-1.5"
              style={{ background: '#d97706', borderColor: '#d97706' }}
              onClick={handleSubmit}>
              <ArrowUpCircle size={12} /> Escalate
            </button>
          </div>

        </div>
      </div>
    </>,
    document.body
  )
}
