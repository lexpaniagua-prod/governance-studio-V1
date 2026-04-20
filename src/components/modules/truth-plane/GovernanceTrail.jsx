import React from 'react'

// ── Role config ───────────────────────────────────────────────────────────────
const ROLES = [
  { key: 'createdBy',  label: 'Created by',           dotColor: '#60a5fa' }, // blue
  { key: 'promotedBy', label: 'Promoted to Truth by',  dotColor: '#a78bfa' }, // purple
  { key: 'resolvedBy', label: 'Conflict resolved by',  dotColor: '#fbbf24' }, // amber
  { key: 'approvedBy', label: 'Approved by',           dotColor: '#4ade80' }, // green
]

// ── Compact variant ───────────────────────────────────────────────────────────
// Shows 4 colored dots + the most relevant fulfilled person name.
// Intended for list cards — minimal footprint.
export function GovernanceCompact({ gov }) {
  if (!gov) return null

  // Pick the most "final" fulfilled role to surface as the key name.
  const keyRole = ['approvedBy', 'resolvedBy', 'promotedBy', 'createdBy'].find(k => gov[k]?.[2])
  const keyPerson = keyRole ? gov[keyRole][0] : null
  const keyLabel  = keyRole ? ROLES.find(r => r.key === keyRole)?.label : null

  return (
    <div className="flex items-center gap-2">
      {/* 4 role dots */}
      <div className="flex items-center gap-1">
        {ROLES.map(({ key, label, dotColor }) => {
          const filled = gov[key]?.[2]
          return (
            <span key={key} title={`${label}: ${gov[key]?.[0] || 'Pending'}`}
              className="w-2 h-2 rounded-full block transition-all"
              style={{
                background: filled ? dotColor : 'rgba(255,255,255,0.12)',
                border:     `1px solid ${filled ? dotColor + '80' : 'rgba(255,255,255,0.15)'}`,
              }} />
          )
        })}
      </div>
      {/* Most relevant name */}
      {keyPerson && (
        <span className="text-[10px] text-text-muted">
          {keyLabel?.split(' ')[0] === 'Approved' ? 'Approved by' : keyLabel?.split(' ')[0] === 'Promoted' ? 'Promoted by' : keyLabel?.split(' ')[0]}{' '}
          <span className="font-medium text-text-secondary">{keyPerson}</span>
        </span>
      )}
    </div>
  )
}

// ── Grid snapshot variant ─────────────────────────────────────────────────────
// 2×2 grid with ✓/! per role. Used in slide-out Overview tab.
export function GovernanceSnapshot({ gov }) {
  if (!gov) return null
  const filledCount = ROLES.filter(r => gov[r.key]?.[2]).length
  return (
    <div className="glass-card p-3.5">
      <div className="flex items-center justify-between mb-2">
        <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">Attestation</p>
        <span className="text-[10px] font-medium" style={{ color: filledCount === 4 ? '#4ade80' : '#fbbf24' }}>
          {filledCount}/4 roles filled
        </span>
      </div>
      <div className="grid grid-cols-2 gap-x-4">
        {ROLES.map(({ key, label, dotColor }) => {
          const [person, , done] = gov[key] || [null, null, false]
          return (
            <div key={key} className="flex items-center gap-1.5 py-1.5">
              <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0"
                style={{
                  background: done ? `${dotColor}22` : 'rgba(245,158,11,0.10)',
                  border: `1px solid ${done ? dotColor + '55' : 'rgba(245,158,11,0.25)'}`,
                }}>
                <span className="text-[8px]" style={{ color: done ? dotColor : '#fbbf24' }}>{done ? '✓' : '!'}</span>
              </div>
              <div className="min-w-0">
                <p className="text-[9px] text-text-muted leading-none mb-0.5">{label}</p>
                <p className="text-[11px] font-medium text-text-secondary truncate">
                  {person || <span className="italic opacity-50">Pending</span>}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Full timeline variant ─────────────────────────────────────────────────────
// Ordered vertical trail with dates, Done/Pending badges.
// Used in slide-out Details tab and full fact detail page.
export function GovernanceTimeline({ gov }) {
  if (!gov) return null
  return (
    <div className="relative pl-6">
      {/* Vertical connector line */}
      <div className="absolute left-2 top-2 bottom-2 w-px" style={{ background: 'rgba(255,255,255,0.08)' }} />

      {ROLES.map(({ key, label, dotColor }, idx) => {
        const [person, date, done] = gov[key] || [null, null, false]
        return (
          <div key={key} className={`relative flex gap-3 ${idx < ROLES.length - 1 ? 'mb-4' : ''}`}>
            {/* Timeline node */}
            <div className="absolute -left-6 w-4 h-4 rounded-full flex items-center justify-center shrink-0 top-1"
              style={{
                background: done ? `${dotColor}22` : 'rgba(255,255,255,0.05)',
                border: `1px solid ${done ? dotColor + '55' : 'rgba(255,255,255,0.12)'}`,
              }}>
              <div className="w-1.5 h-1.5 rounded-full"
                style={{ background: done ? dotColor : 'rgba(255,255,255,0.2)' }} />
            </div>

            <div className="flex-1 glass-card p-3">
              <div className="flex items-center justify-between">
                <p className="text-[10px] text-text-muted uppercase tracking-wider">{label}</p>
                {done
                  ? <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: 'rgba(34,197,94,0.1)', color: '#4ade80' }}>Done</span>
                  : <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: 'rgba(245,158,11,0.1)', color: '#fbbf24' }}>Pending</span>
                }
              </div>
              <p className="text-xs font-semibold text-text-primary mt-1">
                {person || <span className="italic text-text-muted opacity-60 font-normal">Not attested</span>}
              </p>
              {date && <p className="text-[10px] text-text-muted mt-0.5">{date}</p>}
            </div>
          </div>
        )
      })}
    </div>
  )
}
