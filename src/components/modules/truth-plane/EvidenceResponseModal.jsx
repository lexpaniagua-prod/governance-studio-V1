import React, { useState, useMemo, useRef } from 'react'
import { createPortal } from 'react-dom'
import { X, FileSearch, Search, ChevronDown, ChevronUp, Clock, Link2, Paperclip, Upload } from 'lucide-react'
import { Badge } from '../../ui/index'

// ── Static data ───────────────────────────────────────────────────────────────

const RESPONSE_TYPES = [
  { id: 'attached-evidence',  label: 'Attached evidence'       },
  { id: 'clarification',      label: 'Clarification provided'  },
  { id: 'cannot-provide',     label: 'Cannot provide evidence' },
  { id: 'need-reassignment',  label: 'Need reassignment'       },
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

const REQUEST_STATUS_STYLE = {
  'Pending':           { bg: 'rgba(59,130,246,0.12)', border: 'rgba(59,130,246,0.3)',  color: '#60a5fa', label: 'Pending'           },
  'Responded':         { bg: 'rgba(34,197,94,0.1)',   border: 'rgba(34,197,94,0.3)',   color: '#4ade80', label: 'Responded'         },
  'Reassigned':        { bg: 'rgba(124,92,252,0.1)',  border: 'rgba(124,92,252,0.3)',  color: '#a78bfa', label: 'Reassigned'        },
  'Unable to Provide': { bg: 'rgba(239,68,68,0.1)',   border: 'rgba(239,68,68,0.3)',   color: '#f87171', label: 'Unable to Provide' },
}

// ── Sub-components ────────────────────────────────────────────────────────────

function Pill({ label, selected, onClick }) {
  return (
    <button type="button" onClick={onClick}
      className="text-[11px] px-2.5 py-1 rounded-full font-medium transition-all border"
      style={selected
        ? { background: 'rgba(59,130,246,0.18)', borderColor: 'rgba(59,130,246,0.5)', color: '#60a5fa' }
        : { background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.1)', color: '#64748b' }
      }>
      {label}
    </button>
  )
}

function ModeTab({ label, active, onClick }) {
  return (
    <button type="button" onClick={onClick}
      className="flex-1 text-[11px] py-1 rounded-md font-medium transition-all"
      style={active
        ? { background: 'rgba(255,255,255,0.1)', color: '#f1f5f9' }
        : { color: '#64748b' }}>
      {label}
    </button>
  )
}

function Avatar({ user, size = 24 }) {
  return (
    <div className="rounded-full flex items-center justify-center shrink-0 font-bold text-white"
      style={{ background: user.gradient, width: size, height: size, fontSize: size <= 20 ? 8 : 10 }}>
      {user.initials}
    </div>
  )
}

function KV({ label, value, color }) {
  return (
    <div>
      <p className="text-[9px] text-text-muted uppercase tracking-wider mb-0.5">{label}</p>
      <p className="text-[11px] font-medium" style={{ color: color || 'var(--text-secondary)' }}>{value || '—'}</p>
    </div>
  )
}

// Renders a stored attachment (link or file) — used in history entries
function AttachmentChip({ attachment }) {
  if (!attachment) return null
  const isLink = attachment.type === 'link'
  const display = isLink ? attachment.value : attachment.name

  return (
    <div className="flex items-center gap-1.5 mt-1.5 px-2.5 py-1.5 rounded-lg w-fit max-w-full"
      style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.25)' }}>
      {isLink
        ? <Link2 size={10} style={{ color: '#60a5fa', flexShrink: 0 }} />
        : <Paperclip size={10} style={{ color: '#60a5fa', flexShrink: 0 }} />}
      {isLink ? (
        <a href={attachment.value} target="_blank" rel="noopener noreferrer"
          className="text-[10px] font-medium truncate max-w-xs hover:underline"
          style={{ color: '#60a5fa' }}>
          {display}
        </a>
      ) : (
        <span className="text-[10px] font-medium truncate max-w-xs" style={{ color: '#60a5fa' }}>
          {display}
        </span>
      )}
    </div>
  )
}

// ── Main modal ────────────────────────────────────────────────────────────────

export default function EvidenceResponseModal({ item, onClose, onSubmit }) {
  const req = item.evidenceRequest || {}
  const hasResponses = (req.responses?.length || 0) > 0

  const [responseMessage,  setResponseMessage]  = useState('')
  const [responseType,     setResponseType]      = useState('')
  const [unableReason,     setUnableReason]      = useState('')
  const [reference,        setReference]         = useState('')
  const [reassignTo,       setReassignTo]        = useState(null)
  const [userSearch,       setUserSearch]        = useState('')

  // Attachment state (only relevant when responseType === 'attached-evidence')
  const [attachMode,       setAttachMode]        = useState('link')   // 'link' | 'file'
  const [attachLink,       setAttachLink]        = useState('')
  const [attachFile,       setAttachFile]        = useState(null)     // File object
  const fileInputRef = useRef(null)

  // History auto-expanded when there are previous responses (View mode)
  const [historyExpanded,  setHistoryExpanded]   = useState(hasResponses)
  const [errors,           setErrors]            = useState({})

  const searchResults = useMemo(() => {
    if (!userSearch.trim()) return []
    const q = userSearch.toLowerCase()
    return ALL_USERS.filter(u =>
      u.id !== 'u4' &&
      (u.name.toLowerCase().includes(q) || u.role.toLowerCase().includes(q))
    )
  }, [userSearch])

  // Build attachment object from current input state
  const buildAttachment = () => {
    if (responseType !== 'attached-evidence') return null
    if (attachMode === 'link' && attachLink.trim())
      return { type: 'link', value: attachLink.trim(), name: attachLink.trim() }
    if (attachMode === 'file' && attachFile)
      return { type: 'file', value: attachFile.name, name: attachFile.name }
    return null
  }

  const validate = () => {
    const e = {}
    if (!responseMessage.trim())   e.responseMessage = 'A response message is required.'
    if (!responseType)             e.responseType    = 'Select a response type.'
    if (responseType === 'cannot-provide' && !unableReason.trim())
                                   e.unableReason    = 'Explain why you cannot provide evidence.'
    if (responseType === 'need-reassignment' && !reassignTo)
                                   e.reassignTo      = 'Select a user to reassign to.'
    if (responseType === 'attached-evidence' && !buildAttachment())
                                   e.attachment      = 'Add a link or file to attach.'
    return e
  }

  const handleSubmit = () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }

    const statusMap = {
      'attached-evidence': 'Responded',
      'clarification':     'Responded',
      'cannot-provide':    'Unable to Provide',
      'need-reassignment': 'Reassigned',
    }

    onSubmit?.({
      responded_by:          'Alex Rivera',
      responded_at:          new Date().toISOString().slice(0, 10),
      response_type:         responseType,
      response_type_label:   RESPONSE_TYPES.find(r => r.id === responseType)?.label,
      response_message:      responseMessage.trim(),
      response_reference:    reference.trim() || null,
      response_attachment:   buildAttachment(),
      reassigned_to:         reassignTo?.name || null,
      reassigned_to_details: reassignTo || null,
      unable_reason:         responseType === 'cannot-provide' ? unableReason.trim() : null,
      new_status:            statusMap[responseType],
    })
  }

  const riskColor      = item.risk === 'Low' ? '#4ade80' : item.risk === 'Medium' ? '#fbbf24' : '#f87171'
  const confColor      = item.confidence >= 90 ? '#4ade80' : item.confidence >= 70 ? '#fbbf24' : '#f87171'
  const reqStatusStyle = REQUEST_STATUS_STYLE[req.status] || REQUEST_STATUS_STYLE['Pending']

  const dueText = useMemo(() => {
    if (!req.dueDate) return null
    const diff = Math.ceil((new Date(req.dueDate) - new Date()) / 86400000)
    if (diff < 0)   return `Overdue by ${Math.abs(diff)}d`
    if (diff === 0) return 'Due today'
    return `Due in ${diff}d`
  }, [req.dueDate])

  return createPortal(
    <>
      <div className="fixed inset-0 z-[9998] bg-black/55 backdrop-blur-sm" onClick={onClose} />

      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none">
        <div className="pointer-events-auto w-full max-w-[520px] rounded-2xl flex flex-col"
          style={{ background: 'var(--slideout-bg)', border: '1px solid var(--slideout-border)', maxHeight: '90vh' }}>

          {/* ── Header ── */}
          <div className="flex items-center justify-between px-5 py-4 shrink-0"
            style={{ borderBottom: '1px solid var(--slideout-border)' }}>
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)' }}>
                <FileSearch size={14} style={{ color: '#60a5fa' }} />
              </div>
              <div>
                <p className="text-sm font-semibold text-text-primary">Evidence Request</p>
                <p className="text-[10px] text-text-muted">Review the request and provide supporting information</p>
              </div>
            </div>
            <button className="btn-ghost p-1.5 shrink-0" onClick={onClose}><X size={14} /></button>
          </div>

          {/* ── Scrollable body ── */}
          <div className="overflow-y-auto flex-1 px-5 py-4 space-y-4">

            {/* 1 ── Fact Context */}
            <div className="rounded-xl px-3.5 py-3"
              style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <p className="text-[11px] font-semibold text-text-secondary leading-tight flex-1">{item.factTitle}</p>
                <span className="text-[10px] font-mono text-text-muted shrink-0 pt-0.5">{item.factId}</span>
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

            {/* 2 ── Request Summary */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="section-label">Request Summary</p>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                  style={{ background: reqStatusStyle.bg, border: `1px solid ${reqStatusStyle.border}`, color: reqStatusStyle.color }}>
                  {reqStatusStyle.label}
                </span>
              </div>
              <div className="rounded-xl p-3.5 space-y-3"
                style={{ background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.18)' }}>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
                  <KV label="Requested by" value={req.createdBy} />
                  <KV label="Requested on" value={req.createdAt} />
                  <KV label="Assigned to"  value={req.assignedTo} />
                  {req.dueDate && (
                    <KV label="Due date"
                      value={`${req.dueDate}${dueText ? ` (${dueText})` : ''}`}
                      color={dueText?.startsWith('Overdue') ? '#f87171' : dueText === 'Due today' ? '#fbbf24' : undefined} />
                  )}
                </div>
                <div style={{ borderTop: '1px solid rgba(59,130,246,0.12)', paddingTop: 10 }}>
                  <KV label="Reason" value={req.reason} />
                </div>
                {req.requestedItems?.length > 0 && (
                  <div>
                    <p className="text-[9px] text-text-muted uppercase tracking-wider mb-1.5">What was requested</p>
                    <div className="flex flex-wrap gap-1">
                      {req.requestedItems.map((ri, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 rounded-full"
                          style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', color: '#60a5fa' }}>
                          {ri}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {req.message && (
                  <div style={{ borderTop: '1px solid rgba(59,130,246,0.12)', paddingTop: 10 }}>
                    <p className="text-[9px] text-text-muted uppercase tracking-wider mb-1">Original message</p>
                    <p className="text-[11px] text-text-secondary leading-relaxed italic">"{req.message}"</p>
                  </div>
                )}
              </div>
            </div>

            {/* 3 ── Your Response */}
            <div>
              <p className="section-label mb-2">Your Response <span style={{ color: '#f87171' }}>*</span></p>
              <textarea
                className={`input-base w-full text-xs resize-none leading-relaxed ${errors.responseMessage ? 'border-red-500/50' : ''}`}
                rows={3}
                placeholder="Add the supporting information, clarification, or response…"
                value={responseMessage}
                onChange={e => { setResponseMessage(e.target.value); setErrors(er => ({ ...er, responseMessage: '' })) }} />
              {errors.responseMessage && <p className="text-[10px] text-red-400 mt-1">{errors.responseMessage}</p>}
            </div>

            {/* 4 ── Response Type */}
            <div>
              <p className="section-label mb-2">Response Type <span style={{ color: '#f87171' }}>*</span></p>
              <div className="flex flex-wrap gap-1.5">
                {RESPONSE_TYPES.map(r => (
                  <Pill key={r.id} label={r.label}
                    selected={responseType === r.id}
                    onClick={() => {
                      setResponseType(r.id)
                      setErrors(e => ({ ...e, responseType: '', unableReason: '', reassignTo: '', attachment: '' }))
                    }} />
                ))}
              </div>
              {errors.responseType && <p className="text-[10px] text-red-400 mt-1">{errors.responseType}</p>}

              {/* ── Attached evidence → link or file ── */}
              {responseType === 'attached-evidence' && (
                <div className="mt-2.5 rounded-xl overflow-hidden"
                  style={{ background: 'rgba(59,130,246,0.06)', border: `1px solid ${errors.attachment ? 'rgba(239,68,68,0.4)' : 'rgba(59,130,246,0.2)'}` }}>
                  {/* Mode toggle */}
                  <div className="flex p-1 gap-0.5 m-2.5 mb-0 rounded-lg"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <ModeTab label="Link" active={attachMode === 'link'} onClick={() => setAttachMode('link')} />
                    <ModeTab label="File" active={attachMode === 'file'} onClick={() => setAttachMode('file')} />
                  </div>

                  <div className="p-2.5 pt-2">
                    {attachMode === 'link' && (
                      <div className="flex items-center gap-2 px-3 py-2 rounded-lg"
                        style={{ background: 'var(--input-bg)', border: '1px solid var(--input-border)' }}>
                        <Link2 size={12} style={{ color: '#60a5fa', flexShrink: 0 }} />
                        <input
                          className="bg-transparent text-xs text-text-secondary outline-none flex-1 placeholder:text-text-muted"
                          placeholder="https://docs.example.com/evidence-reference"
                          value={attachLink}
                          onChange={e => { setAttachLink(e.target.value); setErrors(er => ({ ...er, attachment: '' })) }} />
                        {attachLink && (
                          <button className="btn-ghost p-0.5" onClick={() => setAttachLink('')}>
                            <X size={10} className="text-text-muted" />
                          </button>
                        )}
                      </div>
                    )}

                    {attachMode === 'file' && (
                      <>
                        <input
                          ref={fileInputRef}
                          type="file"
                          className="hidden"
                          onChange={e => {
                            const f = e.target.files?.[0]
                            if (f) { setAttachFile(f); setErrors(er => ({ ...er, attachment: '' })) }
                          }} />
                        {attachFile ? (
                          <div className="flex items-center gap-2 px-3 py-2 rounded-lg"
                            style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.25)' }}>
                            <Paperclip size={11} style={{ color: '#60a5fa', flexShrink: 0 }} />
                            <span className="text-[11px] font-medium flex-1 truncate" style={{ color: '#60a5fa' }}>
                              {attachFile.name}
                            </span>
                            <span className="text-[10px] text-text-muted shrink-0">
                              {(attachFile.size / 1024).toFixed(0)} KB
                            </span>
                            <button className="btn-ghost p-0.5" onClick={() => setAttachFile(null)}>
                              <X size={10} className="text-text-muted" />
                            </button>
                          </div>
                        ) : (
                          <button type="button"
                            className="flex items-center justify-center gap-2 w-full py-3 rounded-lg border border-dashed transition-all hover:brightness-110"
                            style={{ borderColor: 'rgba(59,130,246,0.3)', color: '#60a5fa' }}
                            onClick={() => fileInputRef.current?.click()}>
                            <Upload size={13} />
                            <span className="text-[11px] font-medium">Click to upload file</span>
                          </button>
                        )}
                      </>
                    )}
                  </div>
                  {errors.attachment && <p className="text-[10px] text-red-400 px-2.5 pb-2">{errors.attachment}</p>}
                </div>
              )}

              {/* Cannot provide → explanation */}
              {responseType === 'cannot-provide' && (
                <div className="mt-2 p-3 rounded-lg"
                  style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)' }}>
                  <p className="text-[10px] text-text-muted mb-1.5">Explain why you cannot provide this evidence</p>
                  <input
                    className={`input-base w-full text-xs ${errors.unableReason ? 'border-red-500/50' : ''}`}
                    placeholder="e.g. Document no longer exists, outside my scope…"
                    value={unableReason}
                    onChange={e => { setUnableReason(e.target.value); setErrors(er => ({ ...er, unableReason: '' })) }} />
                  {errors.unableReason && <p className="text-[10px] text-red-400 mt-1">{errors.unableReason}</p>}
                </div>
              )}

              {/* Need reassignment → user selector */}
              {responseType === 'need-reassignment' && (
                <div className="mt-2 p-3 rounded-lg"
                  style={{ background: 'rgba(124,92,252,0.06)', border: '1px solid rgba(124,92,252,0.2)' }}>
                  <p className="text-[10px] text-text-muted mb-1.5">Reassign to</p>
                  {reassignTo ? (
                    <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg"
                      style={{ background: 'rgba(124,92,252,0.1)', border: '1px solid rgba(124,92,252,0.25)' }}>
                      <Avatar user={reassignTo} size={20} />
                      <span className="text-[11px] font-medium text-text-secondary flex-1">{reassignTo.name}</span>
                      <span className="text-[10px] text-text-muted">{reassignTo.role}</span>
                      <button className="btn-ghost p-1" onClick={() => setReassignTo(null)}><X size={10} /></button>
                    </div>
                  ) : (
                    <div className="relative">
                      <div className="flex items-center gap-2 px-3 py-2 rounded-lg"
                        style={{ background: 'var(--input-bg)', border: `1px solid ${errors.reassignTo ? 'rgba(239,68,68,0.5)' : 'var(--input-border)'}` }}>
                        <Search size={11} className="text-text-muted shrink-0" />
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
                              onClick={() => { setReassignTo(u); setUserSearch(''); setErrors(e => ({ ...e, reassignTo: '' })) }}
                              className="flex items-center gap-2.5 w-full px-3 py-2 text-xs hover:bg-white/5 transition-colors text-left">
                              <Avatar user={u} size={22} />
                              <span className="font-medium text-text-secondary">{u.name}</span>
                              <span className="text-text-muted ml-auto">{u.role}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  {errors.reassignTo && <p className="text-[10px] text-red-400 mt-1">{errors.reassignTo}</p>}
                </div>
              )}
            </div>

            {/* 5 ── Reference (optional, only when NOT attached-evidence — that already has its own attachment UI) */}
            {responseType !== 'attached-evidence' && (
              <div>
                <p className="section-label mb-2">Reference <span className="text-text-muted font-normal">(optional)</span></p>
                <input
                  className="input-base w-full text-xs"
                  placeholder="Paste source name, claim ID, or short evidence reference…"
                  value={reference}
                  onChange={e => setReference(e.target.value)} />
              </div>
            )}

            {/* 6 ── Request History */}
            {hasResponses && (
              <div>
                <button type="button"
                  className="flex items-center gap-1.5 w-full text-left"
                  onClick={() => setHistoryExpanded(h => !h)}>
                  <p className="section-label flex-1">Response History ({req.responses.length})</p>
                  {historyExpanded
                    ? <ChevronUp size={12} className="text-text-muted" />
                    : <ChevronDown size={12} className="text-text-muted" />}
                </button>
                {historyExpanded && (
                  <div className="mt-2 space-y-2">
                    {req.responses.map((r, i) => {
                      const st = REQUEST_STATUS_STYLE[r.new_status]
                      return (
                        <div key={i} className="rounded-lg px-3 py-2.5 space-y-1.5"
                          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}>
                          {/* Header row */}
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-semibold text-text-secondary">{r.responded_by}</span>
                            {st && (
                              <span className="text-[9px] px-1.5 py-0.5 rounded-full font-medium"
                                style={{ background: st.bg, border: `1px solid ${st.border}`, color: st.color }}>
                                {r.response_type_label}
                              </span>
                            )}
                            <span className="text-[9px] text-text-muted ml-auto flex items-center gap-1">
                              <Clock size={9} /> {r.responded_at}
                            </span>
                          </div>
                          {/* Message */}
                          <p className="text-[10px] text-text-muted leading-relaxed">{r.response_message}</p>
                          {/* Attachment — shown when present */}
                          {r.response_attachment && (
                            <AttachmentChip attachment={r.response_attachment} />
                          )}
                          {/* Unable reason */}
                          {r.unable_reason && (
                            <p className="text-[10px] leading-relaxed" style={{ color: '#f87171' }}>
                              Reason: {r.unable_reason}
                            </p>
                          )}
                          {/* Reference */}
                          {r.response_reference && (
                            <p className="text-[10px] text-text-muted">
                              Ref: <span className="text-text-secondary font-medium">{r.response_reference}</span>
                            </p>
                          )}
                          {/* Reassigned to */}
                          {r.reassigned_to && (
                            <p className="text-[10px]" style={{ color: '#a78bfa' }}>
                              Reassigned to <span className="font-semibold">{r.reassigned_to}</span>
                            </p>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Timeline note when no responses yet */}
            {!hasResponses && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg"
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <Clock size={11} className="text-text-muted shrink-0 opacity-50" />
                <p className="text-[10px] text-text-muted">
                  Request opened {req.createdAt} by <span className="text-text-secondary">{req.createdBy}</span>
                  {dueText && (
                    <span className={`ml-1.5 font-medium ${dueText.startsWith('Overdue') ? 'text-red-400' : ''}`}>
                      · {dueText}
                    </span>
                  )}
                  <span className="ml-1.5 font-medium" style={{ color: reqStatusStyle.color }}>
                    · {reqStatusStyle.label}
                  </span>
                </p>
              </div>
            )}

          </div>

          {/* ── Footer ── */}
          <div className="flex items-center justify-end gap-2.5 px-5 py-4 shrink-0"
            style={{ borderTop: '1px solid var(--slideout-border)' }}>
            <button className="btn-secondary text-xs" onClick={onClose}>Cancel</button>
            <button
              className="btn-primary text-xs gap-1.5"
              style={{ background: '#3b82f6', borderColor: '#3b82f6' }}
              onClick={handleSubmit}>
              <FileSearch size={12} /> Send Response
            </button>
          </div>

        </div>
      </div>
    </>,
    document.body
  )
}
