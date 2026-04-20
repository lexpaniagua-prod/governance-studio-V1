import React, { useState, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { X, FileSearch, Shield, Search, CheckCircle } from 'lucide-react'
import { Badge } from '../../ui/index'

// ── Static data ───────────────────────────────────────────────────────────────

const REASONS = [
  { id: 'missing-evidence',    label: 'Missing supporting evidence' },
  { id: 'low-confidence',      label: 'Low confidence'              },
  { id: 'conflicting-evidence',label: 'Conflicting evidence'        },
  { id: 'outdated',            label: 'Outdated information'        },
  { id: 'other',               label: 'Other'                       },
]

const REQUESTED_ITEMS = [
  { id: 'source-doc',      label: 'Source document'           },
  { id: 'excerpt',         label: 'Supporting excerpt'        },
  { id: 'claim',           label: 'Additional claim'          },
  { id: 'attestation',     label: 'Approval / attestation proof' },
  { id: 'validity-dates',  label: 'Updated validity dates'    },
  { id: 'scope',           label: 'Clarification of scope'    },
  { id: 'other',           label: 'Other'                     },
]

const ALL_USERS = [
  { id: 'u1', name: 'Sarah Chen',      role: 'Compliance Lead', initials: 'SC', gradient: 'linear-gradient(135deg,#3b82f6,#60a5fa)' },
  { id: 'u2', name: 'James Park',      role: 'Legal',           initials: 'JP', gradient: 'linear-gradient(135deg,#6366f1,#a78bfa)' },
  { id: 'u3', name: 'Emma Rodriguez',  role: 'Finance',         initials: 'ER', gradient: 'linear-gradient(135deg,#059669,#4ade80)' },
  { id: 'u4', name: 'Alex Rivera',     role: 'Governance',      initials: 'AR', gradient: 'linear-gradient(135deg,#d97706,#fbbf24)' },
  { id: 'u5', name: 'Maria Santos',    role: 'Compliance',      initials: 'MS', gradient: 'linear-gradient(135deg,#dc2626,#f87171)' },
  { id: 'u6', name: 'David Kim',       role: 'Engineering',     initials: 'DK', gradient: 'linear-gradient(135deg,#0891b2,#2dd4bf)' },
]

const ROLES = [
  { id: 'role-compliance', name: 'Compliance Team',  initials: 'CT', type: 'role' },
  { id: 'role-legal',      name: 'Legal Team',       initials: 'LT', type: 'role' },
  { id: 'role-finance',    name: 'Finance Team',     initials: 'FT', type: 'role' },
]

const REASON_BADGE_VARIANT = {
  'expiring':            'review',
  'evidence-changed':    'conflict',
  'conflicting-signal':  'conflict',
  'manual':              'pending',
}

// ── Sub-components ────────────────────────────────────────────────────────────

function Pill({ label, selected, onClick, multi = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-[11px] px-2.5 py-1 rounded-full font-medium transition-all border"
      style={selected
        ? { background: 'rgba(59,130,246,0.18)', borderColor: 'rgba(59,130,246,0.5)', color: '#60a5fa' }
        : { background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.1)', color: '#64748b' }
      }>
      {multi && selected && <span className="mr-1">✓</span>}
      {label}
    </button>
  )
}

function Avatar({ item }) {
  if (item.gradient) {
    return (
      <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-[9px] font-bold text-white"
        style={{ background: item.gradient }}>
        {item.initials}
      </div>
    )
  }
  return (
    <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-[9px] font-bold"
      style={{ background: 'rgba(100,116,139,0.3)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.1)' }}>
      {item.initials}
    </div>
  )
}

// ── Main modal ────────────────────────────────────────────────────────────────

export default function RequestEvidenceModal({ item, onClose, onSubmit }) {
  const [reason,              setReason]              = useState('')
  const [otherReason,         setOtherReason]         = useState('')
  const [requestedItems,      setRequestedItems]      = useState([])
  const [otherRequestedItem,  setOtherRequestedItem]  = useState('')
  const [assignedTo,          setAssignedTo]          = useState(null)
  const [userSearch,     setUserSearch]     = useState('')
  const [message,        setMessage]        = useState('')
  const [dueDate,        setDueDate]        = useState('')
  const [errors,         setErrors]         = useState({})

  // Pre-suggested users (last approver shown first, then others)
  const suggested = useMemo(() => {
    const approverName = item.lastApprovedBy
    if (!approverName) return ALL_USERS.slice(0, 3)
    const found = ALL_USERS.find(u => u.name === approverName)
    const rest   = ALL_USERS.filter(u => u.name !== approverName)
    return found ? [found, ...rest].slice(0, 3) : ALL_USERS.slice(0, 3)
  }, [item.lastApprovedBy])

  // Filtered search results (users + roles)
  const searchResults = useMemo(() => {
    if (!userSearch.trim()) return []
    const q = userSearch.toLowerCase()
    const users = ALL_USERS.filter(u =>
      u.name.toLowerCase().includes(q) || u.role.toLowerCase().includes(q)
    )
    const roles = ROLES.filter(r => r.name.toLowerCase().includes(q))
    return [...users, ...roles]
  }, [userSearch])

  const toggleItem = (id) =>
    setRequestedItems(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )

  const validate = () => {
    const e = {}
    if (!reason)                 e.reason        = 'Select a reason.'
    if (reason === 'other' && !otherReason.trim()) e.otherReason = 'Describe the reason.'
    if (requestedItems.length === 0) e.requestedItems = 'Select at least one item.'
    if (requestedItems.includes('other') && !otherRequestedItem.trim()) e.otherRequestedItem = 'Describe what you need.'
    if (!assignedTo)             e.assignedTo    = 'Assign to someone.'
    return e
  }

  const handleSubmit = () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }

    const request = {
      id:             `ER-${String(Date.now()).slice(-5)}`,
      factId:         item.factId,
      reviewItemId:   item.id,
      factTitle:      item.factTitle,
      reason:         reason === 'other' ? otherReason.trim() : REASONS.find(r => r.id === reason)?.label,
      reasonId:       reason,
      requestedItems: requestedItems.map(id => id === 'other' ? otherRequestedItem.trim() : REQUESTED_ITEMS.find(r => r.id === id)?.label).filter(Boolean),
      assignedTo:     assignedTo.name,
      assignedToId:   assignedTo.id,
      message:        message.trim() || null,
      dueDate:        dueDate || null,
      status:         'Pending',
      createdAt:      new Date().toISOString().slice(0, 10),
      createdBy:      'Alex Rivera',
    }
    onSubmit?.(request)
  }

  // Risk / confidence display
  const riskColor = item.risk === 'Low' ? '#4ade80' : item.risk === 'Medium' ? '#fbbf24' : '#f87171'
  const confColor = item.confidence >= 90 ? '#4ade80' : item.confidence >= 70 ? '#fbbf24' : '#f87171'

  return createPortal(
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-[9998] bg-black/55 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none">
        <div className="pointer-events-auto w-full max-w-[520px] rounded-2xl flex flex-col"
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
                style={{ background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)' }}>
                <FileSearch size={14} style={{ color: '#60a5fa' }} />
              </div>
              <div>
                <p className="text-sm font-semibold text-text-primary">Request More Evidence</p>
                <p className="text-[10px] text-text-muted">Ask for additional supporting information before validating this fact</p>
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
              {item.lastApprovedBy && (
                <p className="text-[10px] text-text-muted mt-1.5">
                  Last approved: <span className="text-text-secondary">{item.lastApprovedBy} · {item.lastApprovedAt}</span>
                </p>
              )}
            </div>

            {/* 2 ── Reason */}
            <div>
              <p className="section-label mb-2">
                Reason <span style={{ color: '#f87171' }}>*</span>
              </p>
              <div className="flex flex-wrap gap-1.5">
                {REASONS.map(r => (
                  <Pill key={r.id} label={r.label}
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

            {/* 3 ── What do you need? */}
            <div>
              <p className="section-label mb-2">
                What do you need? <span style={{ color: '#f87171' }}>*</span>
              </p>
              <div className="flex flex-wrap gap-1.5">
                {REQUESTED_ITEMS.map(r => (
                  <Pill key={r.id} label={r.label} multi
                    selected={requestedItems.includes(r.id)}
                    onClick={() => { toggleItem(r.id); setErrors(e => ({ ...e, requestedItems: '', otherRequestedItem: '' })) }} />
                ))}
              </div>
              {errors.requestedItems && <p className="text-[10px] text-red-400 mt-1">{errors.requestedItems}</p>}
              {requestedItems.includes('other') && (
                <div className="mt-2">
                  <textarea
                    className="input-base w-full text-xs resize-none leading-relaxed"
                    rows={2}
                    placeholder="Describe what you need…"
                    value={otherRequestedItem}
                    onChange={e => { setOtherRequestedItem(e.target.value); setErrors(er => ({ ...er, otherRequestedItem: '' })) }} />
                  {errors.otherRequestedItem && <p className="text-[10px] text-red-400 mt-1">{errors.otherRequestedItem}</p>}
                </div>
              )}
            </div>

            {/* 4 ── Assign to */}
            <div>
              <p className="section-label mb-2">
                Assign to <span style={{ color: '#f87171' }}>*</span>
              </p>

              {/* Pre-suggestions */}
              {!assignedTo && (
                <div className="flex gap-2 mb-2 flex-wrap">
                  {suggested.map(u => (
                    <button key={u.id} type="button"
                      onClick={() => { setAssignedTo(u); setUserSearch(''); setErrors(e => ({ ...e, assignedTo: '' })) }}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] transition-all border hover:brightness-110"
                      style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.1)', color: '#94a3b8' }}>
                      <Avatar item={u} />
                      <span className="font-medium text-text-secondary">{u.name}</span>
                      <span className="text-text-muted">{u.role}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Selected user chip */}
              {assignedTo && (
                <div className="flex items-center gap-2 mb-2 px-3 py-2 rounded-lg"
                  style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)' }}>
                  <Avatar item={assignedTo} />
                  <span className="text-[11px] font-medium text-text-secondary flex-1">{assignedTo.name}</span>
                  <span className="text-[10px] text-text-muted">{assignedTo.role}</span>
                  <button className="btn-ghost p-1" onClick={() => setAssignedTo(null)}>
                    <X size={11} />
                  </button>
                </div>
              )}

              {/* Search */}
              {!assignedTo && (
                <div className="relative">
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg"
                    style={{ background: 'var(--input-bg)', border: `1px solid ${errors.assignedTo ? 'rgba(239,68,68,0.5)' : 'var(--input-border)'}` }}>
                    <Search size={12} className="text-text-muted shrink-0" />
                    <input
                      className="bg-transparent text-xs text-text-secondary outline-none flex-1 placeholder:text-text-muted"
                      placeholder="Search by name or role…"
                      value={userSearch}
                      onChange={e => setUserSearch(e.target.value)} />
                  </div>
                  {searchResults.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 rounded-lg overflow-hidden shadow-xl z-10"
                      style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)' }}>
                      {searchResults.map(u => (
                        <button key={u.id} type="button"
                          onClick={() => { setAssignedTo(u); setUserSearch(''); setErrors(e => ({ ...e, assignedTo: '' })) }}
                          className="flex items-center gap-2.5 w-full px-3 py-2 text-xs hover:bg-white/5 transition-colors text-left">
                          <Avatar item={u} />
                          <span className="font-medium text-text-secondary">{u.name}</span>
                          <span className="text-text-muted ml-auto">{u.role || u.type}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
              {errors.assignedTo && <p className="text-[10px] text-red-400 mt-1">{errors.assignedTo}</p>}
            </div>

            {/* 5 ── Message */}
            <div>
              <p className="section-label mb-2">Message <span className="text-text-muted font-normal">(optional)</span></p>
              <textarea
                className="input-base w-full text-xs resize-none leading-relaxed"
                rows={3}
                placeholder="Add context or instructions…"
                value={message}
                onChange={e => setMessage(e.target.value)} />
            </div>

            {/* 6 ── Due date */}
            <div>
              <p className="section-label mb-2">Due date <span className="text-text-muted font-normal">(optional)</span></p>
              <input
                type="date"
                className="input-base text-xs w-48"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                style={{ colorScheme: 'dark' }} />
            </div>

          </div>

          {/* ── Footer ── */}
          <div className="flex items-center justify-end gap-2.5 px-5 py-4 shrink-0"
            style={{ borderTop: '1px solid var(--slideout-border)' }}>
            <button className="btn-secondary text-xs" onClick={onClose}>Cancel</button>
            <button
              className="btn-primary text-xs gap-1.5"
              style={{ background: '#3b82f6', borderColor: '#3b82f6' }}
              onClick={handleSubmit}>
              <FileSearch size={12} /> Send Request
            </button>
          </div>

        </div>
      </div>
    </>,
    document.body
  )
}
