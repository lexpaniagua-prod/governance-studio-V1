import React from 'react'
import { createPortal } from 'react-dom'
import { X, MoreVertical, ChevronRight } from 'lucide-react'
import clsx from 'clsx'

export function Badge({ variant = 'gray', children, className }) {
  const map = {
    promotable: 'badge-promotable', promoted: 'badge-promoted',
    conflict: 'badge-conflict', review: 'badge-review',
    pending: 'badge-pending', verified: 'badge-verified',
    active: 'badge-active', draft: 'badge-draft',
    ingestion: 'badge-ingestion', 'no-ingestion': 'badge-no-ingestion',
    'not-promotable': 'badge bg-slate-800/50 text-slate-500 border border-slate-700/50',
    'in-progress': 'badge bg-blue-500/15 text-blue-400 border border-blue-500/30',
    queue: 'badge bg-amber-500/12 text-amber-400 border border-amber-500/25',
  }
  return <span className={clsx('badge', map[variant] || 'badge', className)}>{children}</span>
}

export function Chip({ color = 'gray', children, tooltip }) {
  const [show, setShow] = React.useState(false)
  const map = { green: 'chip-green', amber: 'chip-amber', red: 'chip-red', purple: 'chip-purple', blue: 'chip-blue', gray: 'chip-gray' }
  if (!tooltip) return <span className={clsx('signal-chip', map[color])}>{children}</span>
  return (
    <span
      className={clsx('signal-chip', map[color])}
      style={{ position: 'relative', cursor: 'default' }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}>
      {children}
      {show && (
        <span style={{
          position: 'absolute',
          bottom: 'calc(100% + 7px)',
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#1a2033',
          border: '1px solid rgba(255,255,255,0.12)',
          color: '#cbd5e1',
          fontSize: '11px',
          lineHeight: '1.5',
          padding: '6px 10px',
          borderRadius: '8px',
          whiteSpace: 'nowrap',
          zIndex: 9999,
          pointerEvents: 'none',
          boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
        }}>
          {tooltip}
          {/* arrow */}
          <span style={{
            position: 'absolute',
            top: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 0,
            height: 0,
            borderLeft: '5px solid transparent',
            borderRight: '5px solid transparent',
            borderTop: '5px solid #1a2033',
          }} />
        </span>
      )}
    </span>
  )
}

export function TabBar({ tabs, active, onChange }) {
  return (
    <div className="tab-bar">
      {tabs.map(t => (
        <button key={t} className={clsx('tab-btn', active === t && 'active')} onClick={() => onChange(t)}>{t}</button>
      ))}
    </div>
  )
}

export function SlideOut({ title, subtitle, badges = [], onClose, actions, children }) {
  return createPortal(
    <>
      <div className="fixed inset-0 z-[9998] bg-black/30" onClick={onClose} />
      <aside className="slide-out-panel" style={{ zIndex: 9999 }}>
        <div className="sticky top-0 z-10 px-5 py-4 flex items-start gap-3"
          style={{ background: 'var(--slideout-bg)', borderBottom: '1px solid var(--slideout-border)' }}>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-text-primary leading-tight truncate">{title}</p>
            {subtitle && <p className="text-xs text-text-muted mt-0.5">{subtitle}</p>}
            {badges.length > 0 && (
              <div className="flex gap-1.5 mt-2 flex-wrap">
                {badges.map((b, i) => <Badge key={i} variant={b.variant}>{b.label}</Badge>)}
              </div>
            )}
          </div>
          <div className="flex gap-1.5 shrink-0">
            {actions}
            <button onClick={onClose} className="btn-ghost p-1.5"><X size={14} /></button>
          </div>
        </div>
        <div className="p-5">{children}</div>
      </aside>
    </>,
    document.body
  )
}

export function MetricCard({ label, value, color = 'white', icon, trend, className }) {
  const colorMap = {
    green: { bg: 'rgba(34,197,94,0.08)', border: 'rgba(34,197,94,0.2)', text: '#4ade80' },
    amber: { bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)', text: '#fbbf24' },
    red: { bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.2)', text: '#f87171' },
    purple: { bg: 'rgba(124,92,252,0.08)', border: 'rgba(124,92,252,0.2)', text: '#a78bfa' },
    blue: { bg: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.2)', text: '#60a5fa' },
    teal: { bg: 'rgba(20,184,166,0.08)', border: 'rgba(20,184,166,0.2)', text: '#2dd4bf' },
    white: { bg: 'var(--bg-elevated)', border: 'var(--border-default)', text: 'var(--text-primary)' },
  }
  const c = colorMap[color] || colorMap.white
  return (
    <div className={clsx('metric-card', className)} style={{ background: c.bg, borderColor: c.border }}>
      <div className="flex items-center gap-1.5 mb-2">
        {icon && <span style={{ color: c.text }} className="opacity-70">{icon}</span>}
        <p className="metric-label" style={{ color: c.text }}>{label}</p>
        {trend && <span className="ml-auto text-[10px] font-medium" style={{ color: c.text }}>{trend}</span>}
      </div>
      <p className="metric-value" style={{ color: c.text }}>{value}</p>
    </div>
  )
}

export function ThreeDot({ items }) {
  const [open, setOpen] = React.useState(false)
  return (
    <div className="relative">
      <button className="btn-ghost p-1.5" onClick={e => { e.stopPropagation(); setOpen(!open) }}>
        <MoreVertical size={14} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-50" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-8 z-50 min-w-40 py-1 rounded-lg shadow-xl"
            style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)' }}>
            {items.map(({ label, icon: Icon, onClick, danger }) => (
              <button key={label} onClick={e => { e.stopPropagation(); onClick?.(); setOpen(false) }}
                className="flex items-center gap-2.5 w-full px-3 py-2 text-xs hover:bg-white/5 transition-colors text-left"
                style={{ color: danger ? '#f87171' : '#94a3b8' }}>
                {Icon && <Icon size={13} />}{label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export function SearchBar({ placeholder, value, onChange }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-lg flex-1 max-w-sm"
      style={{ background: 'var(--input-bg)', border: '1px solid var(--input-border)' }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2">
        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
      </svg>
      <input className="bg-transparent text-xs text-text-secondary outline-none flex-1 placeholder:text-text-muted"
        placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)} />
    </div>
  )
}

export function Breadcrumb({ items }) {
  return (
    <nav className="flex items-center gap-1.5 text-xs text-text-muted mb-4">
      {items.map((item, i) => (
        <React.Fragment key={i}>
          {i > 0 && <ChevronRight size={12} className="opacity-40" />}
          <span className={i === items.length - 1 ? 'text-text-secondary font-medium' : 'hover:text-text-secondary cursor-pointer transition-colors'}>
            {item}
          </span>
        </React.Fragment>
      ))}
    </nav>
  )
}

export function Modal({ title, subtitle, onClose, children, footer }) {
  return createPortal(
    <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-lg rounded-xl shadow-2xl"
        style={{ background: 'var(--modal-bg)', border: '1px solid var(--modal-border)' }}>
        <div className="flex items-start justify-between px-5 py-4"
          style={{ borderBottom: '1px solid var(--slideout-border)' }}>
          <div>
            <p className="text-sm font-semibold text-text-primary">{title}</p>
            {subtitle && <p className="text-xs text-text-muted mt-0.5">{subtitle}</p>}
          </div>
          <button onClick={onClose} className="btn-ghost p-1.5"><X size={14} /></button>
        </div>
        <div className="p-5 space-y-4 max-h-[65vh] overflow-y-auto">{children}</div>
        {footer && <div className="px-5 py-4 flex justify-end gap-2.5"
          style={{ borderTop: '1px solid var(--slideout-border)' }}>{footer}</div>}
      </div>
    </div>,
    document.body
  )
}

export function FormField({ label, required, children, hint }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-text-secondary">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
      {hint && <p className="text-[11px] text-text-muted">{hint}</p>}
    </div>
  )
}

export function SegmentedControl({ options, value, onChange }) {
  return (
    <div className="flex rounded-lg p-0.5 gap-0.5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
      {options.map(opt => (
        <button key={opt} onClick={() => onChange(opt)}
          className="flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-all"
          style={value === opt
            ? { background: 'rgba(255,255,255,0.1)', color: '#f1f5f9' }
            : { color: '#64748b' }}>
          {opt}
        </button>
      ))}
    </div>
  )
}

export function AllFiltersPanel({ onClose, onClear, children }) {
  return createPortal(
    <>
      <div className="fixed inset-0 z-[9998] bg-black/30" onClick={onClose} />
      <aside className="slide-out-panel" style={{ width: 360, zIndex: 9999 }}>
        <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-4"
          style={{ background: 'var(--slideout-bg)', borderBottom: '1px solid var(--slideout-border)' }}>
          <p className="text-sm font-semibold text-text-primary">All Filters</p>
          <button onClick={onClose} className="btn-ghost p-1.5"><X size={14} /></button>
        </div>
        <div className="p-5 space-y-6">{children}</div>
        <div className="sticky bottom-0 flex gap-2.5 p-4"
          style={{ background: 'var(--slideout-bg)', borderTop: '1px solid var(--slideout-border)' }}>
          <button className="btn-secondary flex-1" onClick={onClear}>Clear all</button>
          <button className="btn-primary flex-1" onClick={onClose}>Apply filters</button>
        </div>
      </aside>
    </>,
    document.body
  )
}

export function FilterSection({ label, children }) {
  return (
    <div className="space-y-2.5">
      <p className="section-label">{label}</p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  )
}
