import React from 'react'
import { createPortal } from 'react-dom'
import { X, CheckCircle, ChevronRight } from 'lucide-react'

// ── Field label display map ───────────────────────────────────────────────────
const FIELD_COLORS = {
  title:      { label: 'TITLE',            current: '#f87171', proposed: '#4ade80' },
  factText:   { label: 'FACT STATEMENT',   current: '#f87171', proposed: '#4ade80' },
  risk:       { label: 'RISK LEVEL',       current: '#f87171', proposed: '#4ade80' },
  confidence: { label: 'CONFIDENCE SCORE', current: '#f87171', proposed: '#4ade80' },
  validTo:    { label: 'VALIDITY PERIOD',  current: '#f87171', proposed: '#4ade80' },
  source:     { label: 'EVIDENCE SOURCE',  current: '#f87171', proposed: '#4ade80' },
}

function ChangeRow({ change }) {
  const colors = FIELD_COLORS[change.field] || FIELD_COLORS.factText
  const isLong = (change.current?.length ?? 0) > 60 || (change.proposed?.length ?? 0) > 60

  return (
    <div className={`${isLong ? '' : 'grid grid-cols-2 gap-3'}`}>
      {/* Field label */}
      <div className={`${isLong ? 'mb-3' : 'col-span-2'} flex items-center gap-2`}>
        <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.35)' }}>
          {change.label}
        </p>
        <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
      </div>

      {isLong ? (
        /* Long text: stack vertically */
        <div className="grid grid-cols-2 gap-3">
          <Cell value={change.current} type="current" />
          <Cell value={change.proposed} type="proposed" />
        </div>
      ) : (
        /* Short text: side-by-side in grid */
        <>
          <Cell value={change.current} type="current" />
          <Cell value={change.proposed} type="proposed" />
        </>
      )}
    </div>
  )
}

function Cell({ value, type }) {
  const isCurrent  = type === 'current'
  const borderClr  = isCurrent ? 'rgba(239,68,68,0.35)'    : 'rgba(34,197,94,0.35)'
  const bgClr      = isCurrent ? 'rgba(239,68,68,0.05)'    : 'rgba(34,197,94,0.05)'
  const labelClr   = isCurrent ? 'rgba(248,113,113,0.7)'   : 'rgba(74,222,128,0.7)'
  const labelTxt   = isCurrent ? 'CURRENT'                 : 'PROPOSED'

  return (
    <div className="rounded-xl p-3.5 flex flex-col gap-1.5"
      style={{ background: bgClr, border: `1px solid ${borderClr}` }}>
      <p className="text-[9px] font-bold tracking-widest" style={{ color: labelClr }}>{labelTxt}</p>
      <p className="text-xs leading-relaxed" style={{ color: isCurrent ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.85)', fontWeight: isCurrent ? 400 : 500 }}>
        {value}
      </p>
    </div>
  )
}

// ── "What Changes" inline view (used in slide-out tab) ───────────────────────
export function WhatChangesView({ changes, isNewFact }) {
  if (isNewFact) {
    return (
      <div className="space-y-4 pb-4">
        <div className="rounded-xl p-4 flex items-start gap-3"
          style={{ background: 'rgba(20,184,166,0.07)', border: '1px solid rgba(20,184,166,0.3)' }}>
          <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5"
            style={{ background: 'rgba(20,184,166,0.15)' }}>
            <span className="text-base">🆕</span>
          </div>
          <div>
            <p className="text-xs font-bold mb-1" style={{ color: '#2dd4bf' }}>New Fact — No existing record</p>
            <p className="text-[11px] text-text-muted leading-snug">
              Approving this proposal will create a brand-new verified truth fact.
              No existing fact will be overwritten.
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (!changes || changes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 gap-2">
        <CheckCircle size={20} className="text-text-muted opacity-40" />
        <p className="text-xs text-text-muted">No specific field changes recorded for this item.</p>
      </div>
    )
  }

  return (
    <div className="space-y-5 pb-4">
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Changes</span>
        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded"
          style={{ background: 'rgba(124,92,252,0.12)', color: '#a78bfa', border: '1px solid rgba(124,92,252,0.25)' }}>
          {changes.length}
        </span>
        <div className="flex items-center gap-3 ml-auto text-[9px] font-bold uppercase tracking-wider">
          <span className="flex items-center gap-1" style={{ color: 'rgba(248,113,113,0.7)' }}>
            <span className="w-2 h-2 rounded-sm inline-block" style={{ background: 'rgba(239,68,68,0.35)' }} /> Current
          </span>
          <span className="flex items-center gap-1" style={{ color: 'rgba(74,222,128,0.7)' }}>
            <span className="w-2 h-2 rounded-sm inline-block" style={{ background: 'rgba(34,197,94,0.35)' }} /> Proposed
          </span>
        </div>
      </div>

      {changes.map((change, i) => (
        <ChangeRow key={change.field + i} change={change} />
      ))}
    </div>
  )
}

// ── Approval Confirmation Modal ───────────────────────────────────────────────
export default function ApproveConfirmModal({ item, onConfirm, onCancel }) {
  if (!item) return null

  const changes  = item.changes || []
  const isNewFact = item.scenario === 'new-fact'
  const title    = item.factTitle || item.id
  const subtitle = item.id

  return createPortal(
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(6px)' }}
      onClick={onCancel}>
      <div className="w-full rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        style={{ maxWidth: 720, maxHeight: '88vh', background: 'var(--modal-bg)', border: '1px solid rgba(34,197,94,0.3)' }}
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-4 shrink-0"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)' }}>
            <CheckCircle size={16} style={{ color: '#4ade80' }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-text-primary">Confirm Approval</p>
            <p className="text-[11px] text-text-muted mt-0.5 truncate">
              {subtitle} · <span className="text-text-secondary">{title}</span>
            </p>
          </div>
          <button className="btn-ghost p-1.5 rounded-lg shrink-0" onClick={onCancel}><X size={14} /></button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {/* Notice */}
          <div className="flex items-start gap-2.5 rounded-xl p-3.5 mb-5"
            style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.18)' }}>
            <ChevronRight size={13} style={{ color: '#4ade80', flexShrink: 0, marginTop: 1 }} />
            <p className="text-[11px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
              You are about to approve this {item._isReviewItem ? 'review item' : 'proposal'}.
              {isNewFact
                ? ' A new verified fact will be created in the Truth Plane.'
                : ' The fields shown below will be permanently updated in the Truth Plane.'}
              {' '}This action is recorded in the governance thread and cannot be undone.
            </p>
          </div>

          {/* Changes */}
          <div className="flex items-center gap-2 mb-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted">
              {isNewFact ? 'What will be created' : 'What will change'}
            </p>
            {!isNewFact && changes.length > 0 && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                style={{ background: 'rgba(124,92,252,0.12)', color: '#a78bfa', border: '1px solid rgba(124,92,252,0.25)' }}>
                {changes.length} field{changes.length !== 1 ? 's' : ''}
              </span>
            )}
            <div className="flex-1" />
            {!isNewFact && (
              <div className="flex items-center gap-3 text-[9px] font-bold uppercase tracking-wider">
                <span className="flex items-center gap-1" style={{ color: 'rgba(248,113,113,0.7)' }}>
                  <span className="w-2 h-2 rounded-sm inline-block" style={{ background: 'rgba(239,68,68,0.3)' }} /> Current
                </span>
                <span className="flex items-center gap-1" style={{ color: 'rgba(74,222,128,0.7)' }}>
                  <span className="w-2 h-2 rounded-sm inline-block" style={{ background: 'rgba(34,197,94,0.3)' }} /> Proposed
                </span>
              </div>
            )}
          </div>

          <div className="space-y-5">
            {isNewFact ? (
              <div className="rounded-xl p-4 flex items-start gap-3"
                style={{ background: 'rgba(20,184,166,0.07)', border: '1px solid rgba(20,184,166,0.3)' }}>
                <span className="text-xl shrink-0">🆕</span>
                <div>
                  <p className="text-xs font-bold mb-1" style={{ color: '#2dd4bf' }}>New Fact: {item.factTitle}</p>
                  <p className="text-[11px] text-text-muted leading-snug">
                    Approving will create this as a new verified truth in the Truth Plane. No existing fact will be overwritten.
                  </p>
                </div>
              </div>
            ) : changes.length > 0 ? (
              changes.map((change, i) => <ChangeRow key={change.field + i} change={change} />)
            ) : (
              <div className="rounded-xl p-4 text-center"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <p className="text-xs text-text-muted">No specific field changes recorded — you are confirming this fact as-is.</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2.5 px-6 py-4 shrink-0"
          style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <button className="btn-secondary text-xs py-2 px-5" onClick={onCancel}>Cancel</button>
          <button
            className="flex items-center gap-1.5 text-xs font-semibold py-2 px-5 rounded-lg transition-all hover:brightness-110"
            style={{ background: 'linear-gradient(135deg,#16a34a,#22c55e)', color: '#fff', boxShadow: '0 2px 12px rgba(34,197,94,0.3)' }}
            onClick={onConfirm}>
            <CheckCircle size={13} /> Confirm Approval
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}
