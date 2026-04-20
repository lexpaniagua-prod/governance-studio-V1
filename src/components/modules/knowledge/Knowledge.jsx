import React, { useState, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import clsx from 'clsx'
import {
  BookOpen, Plus, Filter, LayoutGrid, List, Users, Bot, Network,
  FileText, Clock, TrendingUp, AlertTriangle, Sparkles, X,
  Building2, Search, CheckCircle, Archive, Copy, Edit, Activity,
  Shield, Calendar, Eye,
} from 'lucide-react'
import { truthPacks as SEED } from '../../../data/mockKnowledge'
import {
  SearchBar, ThreeDot, AllFiltersPanel, FilterSection, Modal, FormField,
} from '../../ui/index'
import TruthPackSlideOut from './TruthPackSlideOut'

// ── Design-system maps ────────────────────────────────────────────────────────

const STATUS_MAP = {
  active:   { label: 'Active',   bg: 'rgba(34,197,94,0.1)',   border: 'rgba(34,197,94,0.3)',   color: '#4ade80',  dot: '#22c55e' },
  draft:    { label: 'Draft',    bg: 'rgba(59,130,246,0.1)',  border: 'rgba(59,130,246,0.3)',  color: '#60a5fa',  dot: '#3b82f6' },
  archived: { label: 'Archived', bg: 'rgba(100,116,139,0.1)', border: 'rgba(100,116,139,0.3)', color: '#94a3b8', dot: '#64748b' },
}

const ACCESS_MAP = {
  users:             { label: 'Users',             color: '#60a5fa', bg: 'rgba(59,130,246,0.1)',  border: 'rgba(59,130,246,0.3)',  icon: Users   },
  agents:            { label: 'Agents',            color: '#a78bfa', bg: 'rgba(124,92,252,0.1)', border: 'rgba(124,92,252,0.3)', icon: Bot     },
  'agentic-networks':{ label: 'Agentic Networks',  color: '#2dd4bf', bg: 'rgba(20,184,166,0.1)', border: 'rgba(20,184,166,0.3)', icon: Network },
  mixed:             { label: 'Mixed Access',      color: '#fbbf24', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.3)', icon: Users   },
}

// ── Pill helper ───────────────────────────────────────────────────────────────

function FilterPill({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={clsx('text-[10px] font-medium px-2.5 py-1 rounded-full border transition-all', active && 'ring-1 ring-offset-0')}
      style={active
        ? { background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.45)', color: '#4ade80', ringColor: '#22c55e' }
        : { background: 'var(--filter-pill-bg)', border: '1px solid var(--filter-pill-border)', color: 'var(--filter-pill-color)' }}>
      {label}
    </button>
  )
}

// ── Stat card ─────────────────────────────────────────────────────────────────

function SummaryMetric({ icon: Icon, value, label, color }) {
  return (
    <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl"
      style={{ background: `${color}0d`, border: `1px solid ${color}28` }}>
      <div className="p-1.5 rounded-lg" style={{ background: `${color}18` }}>
        <Icon size={13} style={{ color }} />
      </div>
      <div>
        <p className="text-base font-bold leading-none" style={{ color }}>{value}</p>
        <p className="text-[10px] text-text-muted mt-0.5">{label}</p>
      </div>
    </div>
  )
}

// ── Grid card ─────────────────────────────────────────────────────────────────

function PackGridCard({ pack, onSelect, onPreview, onEdit, onArchive, onDuplicate }) {
  const st = STATUS_MAP[pack.status] || STATUS_MAP.draft
  const at = ACCESS_MAP[pack.accessType] || ACCESS_MAP.users

  const menuItems = [
    { label: 'Edit',         icon: Edit,     onClick: () => onEdit?.(pack)      },
    { label: 'Preview',      icon: Eye,      onClick: () => onPreview?.(pack)   },
    { label: 'Add Access',   icon: Users,    onClick: () => onSelect?.(pack)    },
    { label: 'Duplicate',    icon: Copy,     onClick: () => onDuplicate?.(pack) },
    { label: 'Archive',      icon: Archive,  onClick: () => onArchive?.(pack), danger: pack.status !== 'archived' },
  ]

  return (
    <div
      className="glass-card p-4 flex flex-col gap-3 cursor-pointer hover:border-white/15 transition-all relative group"
      style={{ borderLeft: `3px solid ${st.dot}` }}
      onClick={() => onSelect?.(pack)}>

      {/* Top row: status + 3-dot */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full"
            style={{ background: st.bg, border: `1px solid ${st.border}`, color: st.color }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: st.dot }} />
            {st.label}
          </span>
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full"
            style={{ background: at.bg, border: `1px solid ${at.border}`, color: at.color }}>
            {at.label}
          </span>
          {pack.isStale && (
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full"
              style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', color: '#fbbf24' }}>
              <AlertTriangle size={8} /> Stale
            </span>
          )}
        </div>
        <div onClick={e => e.stopPropagation()}>
          <ThreeDot items={menuItems} />
        </div>
      </div>

      {/* Name + description */}
      <div className="space-y-1">
        <p className="text-sm font-semibold text-text-primary leading-snug">{pack.name}</p>
        <p className="text-[11px] text-text-muted leading-relaxed line-clamp-2">{pack.description}</p>
      </div>

      {/* Dept / scope tags */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#64748b' }}>
          <Building2 size={8} /> {pack.department}
        </span>
        <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#64748b' }}>
          {pack.scope}
        </span>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-1.5">
        {[
          { icon: FileText, val: pack.factsCount,   label: 'facts',   color: '#22c55e' },
          { icon: Users,    val: pack.usersCount,   label: 'users',   color: '#60a5fa' },
          { icon: Bot,      val: pack.agentsCount,  label: 'agents',  color: '#a78bfa' },
          { icon: Network,  val: pack.networksCount,label: 'networks',color: '#2dd4bf' },
        ].map(({ icon: Icon, val, label, color }) => (
          <div key={label} className="rounded-lg p-2 text-center"
            style={{ background: `${color}0a`, border: `1px solid ${color}20` }}>
            <p className="text-sm font-bold" style={{ color }}>{val}</p>
            <p className="text-[9px] text-text-muted leading-tight mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Footer: owner + updated + CTA */}
      <div className="flex items-center gap-2 pt-0.5">
        <div className="w-4 h-4 rounded-full flex items-center justify-center text-[7px] font-bold text-white shrink-0"
          style={{ background: pack.ownerGradient }}>{pack.ownerInitials}</div>
        <span className="text-[11px] text-text-muted truncate">{pack.owner}</span>
        <span className="text-text-muted opacity-30">·</span>
        <span className="text-[10px] text-text-muted">{pack.lastUpdated}</span>
        <button
          className="ml-auto text-[10px] font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all hover:brightness-110 shrink-0"
          style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)', color: '#4ade80' }}
          onClick={e => { e.stopPropagation(); onSelect?.(pack) }}>
          Manage
        </button>
      </div>

    </div>
  )
}

// ── List row card ─────────────────────────────────────────────────────────────

function PackListCard({ pack, selected, onSelect, onPreview, onEdit, onArchive, onDuplicate }) {
  const st = STATUS_MAP[pack.status] || STATUS_MAP.draft
  const at = ACCESS_MAP[pack.accessType] || ACCESS_MAP.users

  const menuItems = [
    { label: 'Edit',         icon: Edit,     onClick: () => onEdit?.(pack)      },
    { label: 'Preview',      icon: Eye,      onClick: () => onPreview?.(pack)   },
    { label: 'Add Access',   icon: Users,    onClick: () => onSelect?.(pack)    },
    { label: 'Duplicate',    icon: Copy,     onClick: () => onDuplicate?.(pack) },
    { label: 'Archive',      icon: Archive,  onClick: () => onArchive?.(pack), danger: pack.status !== 'archived' },
  ]

  return (
    <div
      className={clsx('row-item cursor-pointer', selected && 'selected')}
      style={{ borderLeft: `3px solid ${st.dot}` }}
      onClick={() => onSelect?.(pack)}>
      <div className="flex items-center gap-3 pr-2">

        {/* Icon */}
        <div className="p-2 rounded-lg shrink-0"
          style={{ background: 'rgba(34,197,94,0.1)' }}>
          <BookOpen size={14} style={{ color: '#22c55e' }} />
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <p className="text-sm font-semibold text-text-primary">{pack.name}</p>
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full"
              style={{ background: st.bg, border: `1px solid ${st.border}`, color: st.color }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: st.dot }} />{st.label}
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full"
              style={{ background: at.bg, border: `1px solid ${at.border}`, color: at.color }}>
              {at.label}
            </span>
            {pack.isStale && (
              <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)', color: '#fbbf24' }}>
                <AlertTriangle size={8} /> Stale
              </span>
            )}
          </div>
          <p className="text-xs text-text-muted line-clamp-1">{pack.description}</p>

          <div className="flex items-center gap-3 mt-1.5 flex-wrap">
            <span className="text-[10px] text-text-muted flex items-center gap-1">
              <Building2 size={9} /> {pack.department} · {pack.scope}
            </span>
            <span className="text-[10px] flex items-center gap-1" style={{ color: '#4ade80' }}>
              <FileText size={9} /> {pack.factsCount} facts
            </span>
            <span className="text-[10px] flex items-center gap-1" style={{ color: '#60a5fa' }}>
              <Users size={9} /> {pack.usersCount}
            </span>
            <span className="text-[10px] flex items-center gap-1" style={{ color: '#a78bfa' }}>
              <Bot size={9} /> {pack.agentsCount}
            </span>
            <span className="text-[10px] flex items-center gap-1" style={{ color: '#2dd4bf' }}>
              <Network size={9} /> {pack.networksCount}
            </span>
            <span className="text-[10px] text-text-muted flex items-center gap-1 ml-auto">
              <div className="w-3.5 h-3.5 rounded-full flex items-center justify-center text-[6px] font-bold text-white"
                style={{ background: pack.ownerGradient }}>{pack.ownerInitials}</div>
              {pack.owner}
              <span className="opacity-40">·</span>
              {pack.lastUpdated}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 shrink-0" onClick={e => e.stopPropagation()}>
          <button
            className="text-[10px] font-semibold px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-all hover:brightness-110"
            style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)', color: '#4ade80' }}
            onClick={() => onSelect?.(pack)}>
            Manage
          </button>
          <ThreeDot items={menuItems} />
        </div>
      </div>
    </div>
  )
}

// ── New Truth Pack Modal ──────────────────────────────────────────────────────

const ACCESS_OPTIONS = [
  { id: 'users',              label: 'Users',            icon: Users,   color: '#60a5fa' },
  { id: 'agents',             label: 'Agents',           icon: Bot,     color: '#a78bfa' },
  { id: 'agentic-networks',   label: 'Agentic Networks', icon: Network, color: '#2dd4bf' },
]
const STATUS_OPTIONS = ['draft', 'active']

function NewPackModal({ onClose, onSubmit }) {
  const [form, setForm] = useState({
    name: '', description: '', status: 'draft', accessTypes: [],
    department: '', scope: '', owner: 'Alex Rivera',
  })
  const [errors, setErrors] = useState({})

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const toggleAccessType = (id) =>
    setForm(f => ({
      ...f,
      accessTypes: f.accessTypes.includes(id)
        ? f.accessTypes.filter(x => x !== id)
        : [...f.accessTypes, id],
    }))

  // Derive single accessType for the card: if >1 selected → 'mixed', else the single value
  const resolveAccessType = (types) =>
    types.length === 0 ? 'users' : types.length === 1 ? types[0] : 'mixed'

  const validate = () => {
    const e = {}
    if (!form.name.trim())           e.name = 'Name is required'
    if (!form.department.trim())     e.department = 'Department is required'
    if (form.accessTypes.length === 0) e.accessTypes = 'Select at least one access type'
    return e
  }

  const handleSubmit = () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    onSubmit({
      ...form,
      accessType: resolveAccessType(form.accessTypes),
      id: `PKG-${String(Math.floor(Math.random() * 900) + 100)}`,
      ownerInitials: form.owner.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2),
      ownerGradient: 'linear-gradient(135deg,#f59e0b,#ef4444)',
      factsCount: 0, usersCount: 0, agentsCount: 0, networksCount: 0,
      lastUpdated: new Date().toISOString().split('T')[0],
      usage: 'low', isStale: false, tags: [],
      recentActivity: [{ action: 'Pack created', by: form.owner, at: new Date().toISOString().split('T')[0] }],
      accessDetails: { users: [], agents: [], networks: [] },
    })
  }

  return (
    <Modal
      title="New Truth Pack"
      subtitle="Create a governed distribution unit of verified facts"
      onClose={onClose}
      footer={
        <>
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary gap-1.5" onClick={handleSubmit}>
            <BookOpen size={13} /> Create Pack
          </button>
        </>
      }>

      <FormField label="Pack Name" required hint="Give it a clear, descriptive name">
        <input
          className={clsx('input-base text-xs px-3 py-2 w-full', errors.name && 'border-red-500/50')}
          placeholder="e.g. Enterprise Contract Standards"
          value={form.name} onChange={e => set('name', e.target.value)} />
        {errors.name && <p className="text-[11px] text-red-400">{errors.name}</p>}
      </FormField>

      <FormField label="Purpose / Description">
        <textarea
          className="input-base text-xs px-3 py-2 w-full resize-none"
          rows={3}
          placeholder="What facts does this pack contain and who is it for?"
          value={form.description} onChange={e => set('description', e.target.value)} />
      </FormField>

      <div className="grid grid-cols-2 gap-3">
        <FormField label="Department" required>
          <input
            className={clsx('input-base text-xs px-3 py-2 w-full', errors.department && 'border-red-500/50')}
            placeholder="e.g. Legal"
            value={form.department} onChange={e => set('department', e.target.value)} />
          {errors.department && <p className="text-[11px] text-red-400">{errors.department}</p>}
        </FormField>
        <FormField label="Scope">
          <input
            className="input-base text-xs px-3 py-2 w-full"
            placeholder="e.g. Enterprise"
            value={form.scope} onChange={e => set('scope', e.target.value)} />
        </FormField>
      </div>

      <FormField label="Initial Status">
        <div className="flex gap-2">
          {STATUS_OPTIONS.map(s => {
            const st = STATUS_MAP[s]
            return (
              <button key={s}
                className="flex-1 text-xs py-2 rounded-lg font-medium border transition-all"
                style={form.status === s
                  ? { background: st.bg, border: `1px solid ${st.border}`, color: st.color }
                  : { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', color: '#64748b' }}
                onClick={() => set('status', s)}>
                {st.label}
              </button>
            )
          })}
        </div>
      </FormField>

      <FormField label="Access Type" hint="Select all that apply — who will consume this Truth Pack">
        <div className="grid grid-cols-3 gap-2">
          {ACCESS_OPTIONS.map(({ id, label, icon: Icon, color }) => {
            const active = form.accessTypes.includes(id)
            return (
              <button key={id}
                className="flex flex-col items-center gap-1.5 px-2 py-2.5 rounded-lg border text-xs font-medium transition-all relative"
                style={active
                  ? { background: `${color}18`, border: `1px solid ${color}55`, color }
                  : { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', color: '#64748b' }}
                onClick={() => toggleAccessType(id)}>
                {active && (
                  <span className="absolute top-1.5 right-1.5 w-3.5 h-3.5 rounded-full flex items-center justify-center"
                    style={{ background: color }}>
                    <CheckCircle size={9} style={{ color: '#fff' }} />
                  </span>
                )}
                <Icon size={16} style={{ color: active ? color : '#475569' }} />
                <span className="text-[10px] text-center leading-tight">{label}</span>
              </button>
            )
          })}
        </div>
        {form.accessTypes.length > 1 && (
          <p className="text-[10px] mt-1.5 flex items-center gap-1" style={{ color: '#fbbf24' }}>
            <Users size={9} /> Multiple types selected — pack will be marked as Mixed Access
          </p>
        )}
        {errors.accessTypes && <p className="text-[11px] text-red-400 mt-1">{errors.accessTypes}</p>}
      </FormField>

    </Modal>
  )
}

// ── All Filters Panel content ─────────────────────────────────────────────────

function KnowledgeFiltersPanel({ filters, setFilters, onClose }) {
  const toggle = (key, val) =>
    setFilters(f => ({ ...f, [key]: f[key] === val ? 'All' : val }))
  const toggleBool = key =>
    setFilters(f => ({ ...f, [key]: !f[key] }))

  const Pill = ({ label, active, onClick }) => (
    <button onClick={onClick}
      className="text-[10px] font-medium px-2.5 py-1 rounded-full border transition-all"
      style={active
        ? { background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.45)', color: '#4ade80' }
        : { background: 'var(--filter-pill-bg)', border: '1px solid var(--filter-pill-border)', color: 'var(--filter-pill-color)' }}>
      {label}
    </button>
  )

  return (
    <AllFiltersPanel onClose={onClose} onClear={() => setFilters(DEFAULT_FILTERS)}>
      <FilterSection label="Status">
        {['active','draft','archived'].map(s => (
          <Pill key={s} label={STATUS_MAP[s].label} active={filters.status === s}
            onClick={() => toggle('status', s)} />
        ))}
      </FilterSection>

      <FilterSection label="Access Type">
        {Object.entries(ACCESS_MAP).map(([id, { label }]) => (
          <Pill key={id} label={label} active={filters.accessType === id}
            onClick={() => toggle('accessType', id)} />
        ))}
      </FilterSection>

      <FilterSection label="Owner">
        {['Me', 'My Team', 'Sarah Chen', 'James Park', 'Alex Rivera', 'Emma Rodriguez'].map(o => (
          <Pill key={o} label={o} active={filters.owner === o}
            onClick={() => toggle('owner', o)} />
        ))}
      </FilterSection>

      <FilterSection label="Department / Scope">
        {['Legal', 'Compliance', 'Sales', 'Procurement', 'Technology', 'Finance', 'Partnerships'].map(d => (
          <Pill key={d} label={d} active={filters.department === d}
            onClick={() => toggle('department', d)} />
        ))}
      </FilterSection>

      <FilterSection label="Usage">
        {['high', 'medium', 'low'].map(u => (
          <Pill key={u} label={u.charAt(0).toUpperCase() + u.slice(1) + ' Usage'}
            active={filters.usage === u} onClick={() => toggle('usage', u)} />
        ))}
      </FilterSection>

      <FilterSection label="State">
        <Pill label="Has Facts"      active={filters.hasFacts}   onClick={() => toggleBool('hasFacts')} />
        <Pill label="Empty Pack"     active={filters.isEmpty}    onClick={() => toggleBool('isEmpty')} />
        <Pill label="Stale"          active={filters.stale}      onClick={() => toggleBool('stale')} />
        <Pill label="High Usage"     active={filters.highUsage}  onClick={() => toggleBool('highUsage')} />
      </FilterSection>
    </AllFiltersPanel>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────

const DEFAULT_FILTERS = {
  status: 'All', accessType: 'All', owner: 'All', department: 'All', usage: 'All',
  hasFacts: false, isEmpty: false, stale: false, highUsage: false,
}

export default function Knowledge() {
  const navigate = useNavigate()
  const [packs, setPacks]               = useState(SEED)
  const [search, setSearch]             = useState('')
  const [quickStatus, setQuickStatus]   = useState('All')
  const [quickAccess, setQuickAccess]   = useState('All')
  const [quickOwner, setQuickOwner]     = useState('All')
  const [viewMode, setViewMode]         = useState('list')   // 'grid' | 'list'
  const [showFilters, setShowFilters]   = useState(false)
  const [showNewModal, setShowNewModal] = useState(false)
  const [selected, setSelected]         = useState(null)
  const [allFilters, setAllFilters]     = useState(DEFAULT_FILTERS)
  const [toast, setToast]               = useState(null)

  const showToast = (msg, color = '#4ade80') => {
    setToast({ msg, color })
    setTimeout(() => setToast(null), 3000)
  }

  // ── Filtered packs ─────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    return packs.filter(p => {
      // search
      if (search.trim()) {
        const q = search.toLowerCase()
        if (
          !p.name.toLowerCase().includes(q) &&
          !p.description.toLowerCase().includes(q) &&
          !p.department.toLowerCase().includes(q) &&
          !p.id.toLowerCase().includes(q)
        ) return false
      }
      // quick filters
      if (quickStatus !== 'All' && p.status !== quickStatus) return false
      if (quickAccess !== 'All' && p.accessType !== quickAccess) return false
      if (quickOwner === 'Me' && p.owner !== 'Alex Rivera') return false
      // all-filter overrides
      if (allFilters.status !== 'All' && p.status !== allFilters.status) return false
      if (allFilters.accessType !== 'All' && p.accessType !== allFilters.accessType) return false
      if (allFilters.department !== 'All' && p.department !== allFilters.department) return false
      if (allFilters.usage !== 'All' && p.usage !== allFilters.usage) return false
      if (allFilters.hasFacts   && p.factsCount === 0) return false
      if (allFilters.isEmpty    && p.factsCount > 0)  return false
      if (allFilters.stale      && !p.isStale)         return false
      if (allFilters.highUsage  && p.usage !== 'high') return false
      return true
    })
  }, [packs, search, quickStatus, quickAccess, quickOwner, allFilters])

  // ── Summary stats ──────────────────────────────────────────────────────────
  const stats = useMemo(() => ({
    total:   packs.length,
    active:  packs.filter(p => p.status === 'active').length,
    stale:   packs.filter(p => p.isStale).length,
    facts:   packs.reduce((s, p) => s + p.factsCount, 0),
  }), [packs])

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleCreate = (pack) => {
    setPacks(prev => [pack, ...prev])
    setShowNewModal(false)
    showToast(`"${pack.name}" created`)
  }

  const handleArchive = (pack) => {
    setPacks(prev => prev.map(p => p.id === pack.id ? { ...p, status: 'archived' } : p))
    if (selected?.id === pack.id) setSelected(prev => ({ ...prev, status: 'archived' }))
    showToast(`"${pack.name}" archived`, '#94a3b8')
  }

  const handleDuplicate = (pack) => {
    const copy = {
      ...pack,
      id: `PKG-${String(Math.floor(Math.random() * 900) + 100)}`,
      name: `${pack.name} (Copy)`,
      status: 'draft',
      factsCount: 0, usersCount: 0, agentsCount: 0, networksCount: 0,
      lastUpdated: new Date().toISOString().split('T')[0],
      recentActivity: [{ action: 'Duplicated from ' + pack.id, by: 'Alex Rivera', at: new Date().toISOString().split('T')[0] }],
    }
    setPacks(prev => [copy, ...prev])
    showToast(`"${copy.name}" created`)
  }

  const activeFilterCount = Object.entries(allFilters).filter(([k, v]) =>
    (typeof v === 'boolean' && v) || (typeof v === 'string' && v !== 'All')
  ).length

  return (
    <div className="p-6 space-y-5">

      {/* ── Page header ─────────────────────────────── */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl" style={{ background: 'rgba(34,197,94,0.14)' }}>
            <BookOpen size={20} style={{ color: '#22c55e' }} />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-text-primary">Knowledge</h1>
            <p className="text-xs text-text-muted mt-0.5 max-w-lg">
              Manage Truth Packs to control how validated facts are used by users, agents, and agentic networks.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button className="btn-secondary gap-1.5 opacity-50 cursor-not-allowed" disabled title="Coming soon">
            <Sparkles size={13} /> AI Assistant
          </button>
          <button className="btn-primary gap-1.5" onClick={() => setShowNewModal(true)}>
            <Plus size={14} /> New Truth Pack
          </button>
        </div>
      </div>

      {/* ── Summary metrics ─────────────────────────── */}
      <div className="grid grid-cols-4 gap-3">
        <SummaryMetric icon={BookOpen}  value={stats.total}  label="Total Packs"    color="#22c55e" />
        <SummaryMetric icon={CheckCircle} value={stats.active} label="Active Packs" color="#4ade80" />
        <SummaryMetric icon={FileText}  value={stats.facts}  label="Total Facts"    color="#60a5fa" />
        <SummaryMetric icon={AlertTriangle} value={stats.stale} label="Stale Packs" color="#fbbf24" />
      </div>

      {/* ── Filter bar ──────────────────────────────── */}
      <div className="flex items-center gap-2 flex-wrap">
        <SearchBar placeholder="Search Truth Packs..." value={search} onChange={setSearch} />

        <select className="input-base text-xs px-3 py-2" style={{ width: 'auto' }}
          value={quickStatus} onChange={e => setQuickStatus(e.target.value)}>
          <option value="All">Status</option>
          <option value="active">Active</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
        </select>

        <select className="input-base text-xs px-3 py-2" style={{ width: 'auto' }}
          value={quickAccess} onChange={e => setQuickAccess(e.target.value)}>
          <option value="All">Access Type</option>
          <option value="users">Users</option>
          <option value="agents">Agents</option>
          <option value="agentic-networks">Agentic Networks</option>
          <option value="mixed">Mixed Access</option>
        </select>

        <select className="input-base text-xs px-3 py-2" style={{ width: 'auto' }}
          value={quickOwner} onChange={e => setQuickOwner(e.target.value)}>
          <option value="All">Owner</option>
          <option value="Me">Me</option>
          <option value="My Team">My Team</option>
        </select>

        <button
          className={clsx('btn-secondary gap-1.5', activeFilterCount > 0 && 'border-green-500/40')}
          style={activeFilterCount > 0 ? { color: '#4ade80' } : {}}
          onClick={() => setShowFilters(true)}>
          <Filter size={13} /> Filters
          {activeFilterCount > 0 && (
            <span className="inline-flex items-center justify-center w-4 h-4 rounded-full text-[9px] font-bold"
              style={{ background: 'rgba(34,197,94,0.25)', color: '#4ade80' }}>
              {activeFilterCount}
            </span>
          )}
        </button>

        {/* View toggle */}
        <div className="ml-auto flex items-center gap-0.5 rounded-lg p-0.5"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <button
            onClick={() => setViewMode('grid')}
            className={clsx('p-1.5 rounded-md transition-all', viewMode === 'grid' && 'bg-white/10')}
            style={{ color: viewMode === 'grid' ? '#e2e8f0' : '#64748b' }}>
            <LayoutGrid size={14} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={clsx('p-1.5 rounded-md transition-all', viewMode === 'list' && 'bg-white/10')}
            style={{ color: viewMode === 'list' ? '#e2e8f0' : '#64748b' }}>
            <List size={14} />
          </button>
        </div>
      </div>

      {/* ── Result count ────────────────────────────── */}
      <div className="flex items-center gap-2">
        <p className="text-xs text-text-muted">
          {filtered.length} pack{filtered.length !== 1 ? 's' : ''}
          {(search || quickStatus !== 'All' || quickAccess !== 'All' || quickOwner !== 'All')
            && <span className="ml-1 opacity-60">(filtered)</span>}
        </p>
        {(search || quickStatus !== 'All' || quickAccess !== 'All' || quickOwner !== 'All' || activeFilterCount > 0) && (
          <button
            className="text-[10px] text-text-muted hover:text-text-secondary underline"
            onClick={() => {
              setSearch(''); setQuickStatus('All'); setQuickAccess('All');
              setQuickOwner('All'); setAllFilters(DEFAULT_FILTERS)
            }}>
            Clear all
          </button>
        )}
      </div>

      {/* ── Card list ───────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <BookOpen size={32} className="mx-auto mb-4 text-text-muted opacity-25" />
          <p className="text-sm text-text-muted">No Truth Packs match your filters</p>
          <button className="btn-secondary mt-4" onClick={() => {
            setSearch(''); setQuickStatus('All'); setQuickAccess('All')
            setQuickOwner('All'); setAllFilters(DEFAULT_FILTERS)
          }}>Clear filters</button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(pack => (
            <PackGridCard key={pack.id} pack={pack}
              onSelect={p => navigate(`/intelligence-library/knowledge/${p.id}`)}
              onPreview={setSelected}
              onEdit={() => {}}
              onArchive={handleArchive}
              onDuplicate={handleDuplicate} />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(pack => (
            <PackListCard key={pack.id} pack={pack}
              selected={selected?.id === pack.id}
              onSelect={p => navigate(`/intelligence-library/knowledge/${p.id}`)}
              onPreview={setSelected}
              onEdit={() => {}}
              onArchive={handleArchive}
              onDuplicate={handleDuplicate} />
          ))}
        </div>
      )}

      {/* ── All Filters slide-out ────────────────────── */}
      {showFilters && (
        <KnowledgeFiltersPanel
          filters={allFilters}
          setFilters={setAllFilters}
          onClose={() => setShowFilters(false)} />
      )}

      {/* ── Truth Pack slide-out ─────────────────────── */}
      {selected && (
        <TruthPackSlideOut
          pack={selected}
          onClose={() => setSelected(null)}
          onEdit={() => {}}
          onArchive={() => handleArchive(selected)}
          onDuplicate={() => handleDuplicate(selected)} />
      )}

      {/* ── New Pack modal ───────────────────────────── */}
      {showNewModal && (
        <NewPackModal
          onClose={() => setShowNewModal(false)}
          onSubmit={handleCreate} />
      )}

      {/* ── Toast ───────────────────────────────────── */}
      {toast && createPortal(
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[99999] px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xl"
          style={{
            background: 'rgba(15,23,42,0.95)',
            border: `1px solid ${toast.color}50`,
            color: toast.color,
            backdropFilter: 'blur(12px)',
          }}>
          <CheckCircle size={13} /> {toast.msg}
        </div>,
        document.body
      )}
    </div>
  )
}
