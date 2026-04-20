import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import { X, AlertTriangle, Zap, ShieldAlert, Clock, CheckCircle } from 'lucide-react'

const DURATION_OPTIONS = [
  { label: '24 hours', value: '24h' },
  { label: '48 hours', value: '48h' },
  { label: '7 days',   value: '7d'  },
  { label: '14 days',  value: '14d' },
  { label: 'Custom date', value: 'custom' },
]

const CURRENT_USER = 'Alex Rivera'

// ── Step 1 — Warning Gate ─────────────────────────────────────────────────────
function GateScreen({ onCancel, onProceed }) {
  const [acknowledged, setAcknowledged] = useState(false)

  return (
    <div className="flex flex-col gap-5">
      {/* Critical warning banner */}
      <div className="rounded-xl p-5 text-center"
        style={{ background: 'rgba(185,28,28,0.12)', border: '2px solid rgba(239,68,68,0.4)' }}>
        <div className="flex justify-center mb-3">
          <div className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(185,28,28,0.2)', border: '2px solid rgba(239,68,68,0.5)' }}>
            <ShieldAlert size={28} style={{ color: '#ef4444' }} />
          </div>
        </div>
        <p className="text-base font-bold mb-1" style={{ color: '#f87171' }}>Emergency Override Action</p>
        <p className="text-sm text-text-muted leading-relaxed">
          You are about to initiate a <strong style={{ color: '#fca5a5' }}>Break Glass</strong> request.
          This is an exceptional governance action reserved for critical emergencies only.
        </p>
      </div>

      {/* What this means */}
      <div className="space-y-2.5">
        {[
          { icon: '🔴', text: 'The override is temporary — it must include an expiry date.' },
          { icon: '📋', text: 'This action is permanently and irreversibly logged in the audit trail.' },
          { icon: '👥', text: 'All Truth Plane administrators will be notified immediately.' },
          { icon: '⚡', text: 'The verified fact is flagged as "Break Glass Active" until expiry or revocation.' },
          { icon: '🔍', text: 'A mandatory post-incident review will be triggered after expiry.' },
        ].map(({ icon, text }) => (
          <div key={text} className="flex items-start gap-2.5 text-sm text-text-muted">
            <span className="shrink-0 text-base leading-none">{icon}</span>
            <span>{text}</span>
          </div>
        ))}
      </div>

      {/* Acknowledgment checkbox */}
      <label className="flex items-start gap-3 cursor-pointer rounded-xl p-3.5 select-none"
        style={{ background: 'rgba(239,68,68,0.06)', border: `1px solid ${acknowledged ? 'rgba(239,68,68,0.5)' : 'rgba(239,68,68,0.2)'}` }}>
        <div className="mt-0.5 w-4 h-4 rounded shrink-0 flex items-center justify-center"
          style={{ background: acknowledged ? '#dc2626' : 'transparent', border: `1.5px solid ${acknowledged ? '#dc2626' : 'rgba(239,68,68,0.4)'}` }}
          onClick={() => setAcknowledged(a => !a)}>
          {acknowledged && <span className="text-white text-[10px] font-bold">✓</span>}
        </div>
        <input type="checkbox" className="hidden" checked={acknowledged} onChange={e => setAcknowledged(e.target.checked)} />
        <span className="text-xs leading-relaxed" style={{ color: acknowledged ? '#fca5a5' : '#94a3b8' }}>
          I understand this action is permanently audited, visible to all administrators,
          and that the verified fact remains in effect — this is an override, not a correction.
        </span>
      </label>

      {/* Footer */}
      <div className="flex gap-3 pt-1">
        <button className="btn-secondary flex-1 justify-center" onClick={onCancel}>Cancel</button>
        <button
          className="flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm font-semibold transition-all"
          disabled={!acknowledged}
          onClick={onProceed}
          style={{
            background: acknowledged ? 'rgba(185,28,28,0.9)' : 'rgba(100,116,139,0.15)',
            border: `1px solid ${acknowledged ? 'rgba(239,68,68,0.6)' : 'rgba(100,116,139,0.2)'}`,
            color: acknowledged ? '#fca5a5' : '#475569',
            cursor: acknowledged ? 'pointer' : 'not-allowed',
          }}>
          <Zap size={14} /> I Understand — Continue
        </button>
      </div>
    </div>
  )
}

// ── Step 2 — Form ─────────────────────────────────────────────────────────────
function FormScreen({ fact, onCancel, onSubmit }) {
  const [reason, setReason]           = useState('')
  const [impact, setImpact]           = useState('')
  const [tempChange, setTempChange]   = useState('')
  const [duration, setDuration]       = useState('7d')
  const [expiryDate, setExpiryDate]   = useState('')
  const [confirmName, setConfirmName] = useState('')
  const [errors, setErrors]           = useState({})

  const validate = () => {
    const e = {}
    if (!reason.trim())    e.reason    = 'Required.'
    if (!impact.trim())    e.impact    = 'Required.'
    if (!tempChange.trim()) e.tempChange = 'Required.'
    if (duration === 'custom' && !expiryDate) e.expiryDate = 'Required for custom duration.'
    if (confirmName.trim().toLowerCase() !== CURRENT_USER.toLowerCase())
      e.confirmName = `Type your full name exactly: "${CURRENT_USER}"`
    return e
  }

  const handleSubmit = () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }

    const id = `BG-${String(Date.now()).slice(-3)}`
    const expiryLabel = DURATION_OPTIONS.find(d => d.value === duration)?.label

    onSubmit({
      id,
      factId:        fact.id,
      factTitle:     fact.title,
      reason:        reason.trim(),
      businessImpact: impact.trim(),
      temporaryChange: tempChange.trim(),
      duration,
      expiryDate:    expiryDate || expiryLabel,
      requestedBy:   CURRENT_USER,
      initials:      'AR',
      avatarGradient: 'linear-gradient(135deg,#dc2626,#b91c1c)',
      requestedAt:   new Date().toISOString().slice(0, 10) + ' ' + new Date().toUTCString().slice(17, 22) + ' UTC',
      status:        'active',
      acknowledged:  true,
    })
  }

  const field = (label, required, error, children) => (
    <div>
      <label className="flex items-center gap-1 mb-1.5" style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94a3b8' }}>
        {label} {required && <span style={{ color: '#f87171' }}>*</span>}
      </label>
      {children}
      {error && <p className="text-[11px] mt-1" style={{ color: '#f87171' }}>{error}</p>}
    </div>
  )

  return (
    <div className="flex flex-col gap-4">
      {/* Context strip */}
      <div className="flex items-center gap-2.5 rounded-lg px-3 py-2.5"
        style={{ background: 'rgba(185,28,28,0.1)', border: '1px solid rgba(239,68,68,0.25)' }}>
        <AlertTriangle size={13} style={{ color: '#f87171' }} className="shrink-0" />
        <div className="min-w-0">
          <p className="text-[10px] text-text-muted">Override target</p>
          <p className="text-xs font-semibold text-text-primary truncate">{fact.title}</p>
        </div>
        <span className="text-[10px] font-mono text-text-muted shrink-0">{fact.id}</span>
      </div>

      {field('Reason for Emergency Override', true, errors.reason,
        <textarea className="input-base w-full text-sm leading-relaxed resize-none"
          style={{ borderColor: errors.reason ? 'rgba(239,68,68,0.5)' : undefined }}
          rows={3} value={reason} placeholder="Describe the specific emergency that requires this override…"
          onChange={e => { setReason(e.target.value); setErrors(er => ({ ...er, reason: '' })) }} />
      )}

      {field('Business Impact', true, errors.impact,
        <textarea className="input-base w-full text-sm leading-relaxed resize-none"
          style={{ borderColor: errors.impact ? 'rgba(239,68,68,0.5)' : undefined }}
          rows={3} value={impact} placeholder="Quantify the business impact if this override is NOT applied (revenue, customers, systems affected)…"
          onChange={e => { setImpact(e.target.value); setErrors(er => ({ ...er, impact: '' })) }} />
      )}

      {field('Requested Temporary Change', true, errors.tempChange,
        <textarea className="input-base w-full text-sm leading-relaxed resize-none"
          style={{ borderColor: errors.tempChange ? 'rgba(239,68,68,0.5)' : undefined }}
          rows={3} value={tempChange} placeholder="Describe exactly what should be temporarily overridden and how…"
          onChange={e => { setTempChange(e.target.value); setErrors(er => ({ ...er, tempChange: '' })) }} />
      )}

      {/* Duration row */}
      <div className="grid grid-cols-2 gap-3">
        {field('Override Duration', true, null,
          <select className="input-base w-full text-sm" value={duration}
            onChange={e => setDuration(e.target.value)}>
            {DURATION_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        )}
        {duration === 'custom'
          ? field('Expiry Date', true, errors.expiryDate,
              <input type="date" className="input-base w-full text-sm"
                style={{ borderColor: errors.expiryDate ? 'rgba(239,68,68,0.5)' : undefined }}
                value={expiryDate} onChange={e => { setExpiryDate(e.target.value); setErrors(er => ({ ...er, expiryDate: '' })) }} />
            )
          : <div className="flex flex-col justify-end pb-0.5">
              <p className="text-xs text-text-muted">Expires automatically after the selected duration from submission time.</p>
            </div>
        }
      </div>

      {/* Identity confirmation */}
      <div className="rounded-xl p-4" style={{ background: 'rgba(185,28,28,0.08)', border: '1px solid rgba(239,68,68,0.3)' }}>
        <p className="text-xs font-semibold mb-1" style={{ color: '#fca5a5' }}>
          Confirm your identity to submit
        </p>
        <p className="text-[11px] text-text-muted mb-2.5">
          Type <strong style={{ color: '#fca5a5' }}>{CURRENT_USER}</strong> to confirm you are authorizing this action.
        </p>
        <input className="input-base w-full text-sm"
          style={{ borderColor: errors.confirmName ? 'rgba(239,68,68,0.6)' : confirmName.toLowerCase() === CURRENT_USER.toLowerCase() ? 'rgba(34,197,94,0.4)' : undefined }}
          placeholder={`Type "${CURRENT_USER}"`}
          value={confirmName}
          onChange={e => { setConfirmName(e.target.value); setErrors(er => ({ ...er, confirmName: '' })) }} />
        {errors.confirmName && <p className="text-[11px] mt-1" style={{ color: '#f87171' }}>{errors.confirmName}</p>}
      </div>

      {/* Footer */}
      <div className="flex gap-3 pt-1">
        <button className="btn-secondary flex-1 justify-center" onClick={onCancel}>Cancel</button>
        <button className="flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm font-semibold transition-all"
          onClick={handleSubmit}
          style={{ background: 'rgba(185,28,28,0.85)', border: '1px solid rgba(239,68,68,0.5)', color: '#fca5a5' }}>
          <Zap size={14} /> Submit Break Glass Request
        </button>
      </div>
    </div>
  )
}

// ── Step 3 — Confirmed ────────────────────────────────────────────────────────
function ConfirmedScreen({ record, onClose }) {
  return (
    <div className="flex flex-col items-center gap-5 py-8 px-4 text-center">
      <div className="w-14 h-14 rounded-full flex items-center justify-center"
        style={{ background: 'rgba(185,28,28,0.2)', border: '2px solid rgba(239,68,68,0.5)' }}>
        <Zap size={26} style={{ color: '#f87171' }} />
      </div>

      <div>
        <p className="text-base font-bold mb-1" style={{ color: '#fca5a5' }}>Break Glass Activated</p>
        <p className="text-sm text-text-muted max-w-xs">
          The override request has been logged, administrators have been notified,
          and the fact is now flagged as under emergency override.
        </p>
      </div>

      {/* Record card */}
      <div className="w-full rounded-xl p-4 text-left"
        style={{ background: 'rgba(185,28,28,0.1)', border: '1px solid rgba(239,68,68,0.35)' }}>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[10px] font-mono" style={{ color: '#f87171' }}>{record.id}</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
            style={{ background: 'rgba(185,28,28,0.2)', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.4)' }}>
            ⚡ Active
          </span>
        </div>
        {[
          ['Override target', record.factTitle],
          ['Duration',        record.expiryDate],
          ['Requested by',    record.requestedBy],
          ['Logged at',       record.requestedAt],
        ].map(([k, v]) => (
          <div key={k} className="flex justify-between py-1.5" style={{ borderBottom: '1px solid rgba(239,68,68,0.1)' }}>
            <span className="text-[11px] text-text-muted">{k}</span>
            <span className="text-[11px] font-medium" style={{ color: '#fca5a5' }}>{v}</span>
          </div>
        ))}
      </div>

      {/* Audit notice */}
      <div className="flex items-start gap-2 w-full rounded-lg p-3 text-left"
        style={{ background: 'rgba(185,28,28,0.07)', border: '1px solid rgba(239,68,68,0.2)' }}>
        <Clock size={12} style={{ color: '#f87171' }} className="shrink-0 mt-0.5" />
        <p className="text-[11px] leading-relaxed" style={{ color: '#f87171' }}>
          A post-incident review will be automatically triggered when this override expires on{' '}
          <strong>{record.expiryDate}</strong>. The original verified fact remains on record.
        </p>
      </div>

      <button className="btn-secondary w-full justify-center" onClick={onClose}>
        Close
      </button>
    </div>
  )
}

// ── Main export ───────────────────────────────────────────────────────────────
export default function BreakGlassModal({ fact, onClose, onSubmit }) {
  const [step, setStep]       = useState('gate')  // gate | form | confirmed
  const [record, setRecord]   = useState(null)

  const handleSubmit = (rec) => {
    setRecord(rec)
    setStep('confirmed')
    onSubmit?.(rec)
  }

  const STEP_LABELS = { gate: 'Step 1 of 2 — Acknowledge', form: 'Step 2 of 2 — Details', confirmed: 'Confirmed' }

  return createPortal(
    <>
      {/* Backdrop — extra dark for gravity */}
      <div className="fixed inset-0 z-[9998] bg-black/70" onClick={step !== 'confirmed' ? onClose : undefined} />

      {/* Modal */}
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none">
        <div className="pointer-events-auto w-full max-w-[600px] rounded-2xl overflow-hidden flex flex-col"
          style={{
            background: 'var(--slideout-bg)',
            border: '2px solid rgba(239,68,68,0.35)',
            boxShadow: '0 0 60px rgba(185,28,28,0.25)',
            maxHeight: '90vh',
          }}>

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 shrink-0"
            style={{ background: 'rgba(185,28,28,0.08)', borderBottom: '1px solid rgba(239,68,68,0.25)' }}>
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background: 'rgba(185,28,28,0.2)', border: '1px solid rgba(239,68,68,0.4)' }}>
                <Zap size={14} style={{ color: '#f87171' }} />
              </div>
              <div>
                <p className="text-sm font-bold" style={{ color: '#fca5a5' }}>Break Glass</p>
                <p className="text-[10px]" style={{ color: '#f87171', opacity: 0.7 }}>{STEP_LABELS[step]}</p>
              </div>
            </div>
            <button className="btn-ghost p-1.5" onClick={onClose}><X size={15} /></button>
          </div>

          {/* Body */}
          <div className="overflow-y-auto flex-1 px-6 py-5">
            {step === 'gate' && (
              <GateScreen
                onCancel={onClose}
                onProceed={() => setStep('form')} />
            )}
            {step === 'form' && (
              <FormScreen
                fact={fact}
                onCancel={onClose}
                onSubmit={handleSubmit} />
            )}
            {step === 'confirmed' && record && (
              <ConfirmedScreen record={record} onClose={onClose} />
            )}
          </div>
        </div>
      </div>
    </>,
    document.body
  )
}
