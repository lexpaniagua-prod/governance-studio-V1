import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import {
  X, BookOpen, Users, Bot, Network, FileText, Clock,
  Shield, Activity, TrendingUp, AlertTriangle, CheckCircle,
  ExternalLink, Calendar, Building2, Tag, Eye,
} from 'lucide-react'
import clsx from 'clsx'
import { ThreeDot } from '../../ui/index'

// ── Status / access helpers ──────────────────────────────────────────────────

const STATUS_MAP = {
  active:   { label: 'Active',   bg: 'rgba(34,197,94,0.1)',   border: 'rgba(34,197,94,0.3)',   color: '#4ade80',  dot: '#22c55e' },
  draft:    { label: 'Draft',    bg: 'rgba(59,130,246,0.1)',  border: 'rgba(59,130,246,0.3)',  color: '#60a5fa',  dot: '#3b82f6' },
  archived: { label: 'Archived', bg: 'rgba(100,116,139,0.1)', border: 'rgba(100,116,139,0.3)', color: '#94a3b8', dot: '#64748b' },
}

const ACCESS_MAP = {
  users:            { label: 'Users',             color: '#60a5fa', bg: 'rgba(59,130,246,0.1)',  border: 'rgba(59,130,246,0.3)'  },
  agents:           { label: 'Agents',            color: '#a78bfa', bg: 'rgba(124,92,252,0.1)', border: 'rgba(124,92,252,0.3)' },
  'agentic-networks':{ label: 'Agentic Networks', color: '#2dd4bf', bg: 'rgba(20,184,166,0.1)', border: 'rgba(20,184,166,0.3)' },
  mixed:            { label: 'Mixed Access',      color: '#fbbf24', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.3)' },
}

const USAGE_MAP = {
  high:   { label: 'High Usage',   color: '#4ade80', icon: TrendingUp  },
  medium: { label: 'Med. Usage',   color: '#fbbf24', icon: TrendingUp  },
  low:    { label: 'Low Usage',    color: '#64748b', icon: TrendingUp  },
}

const TABS = ['Overview', 'Facts', 'Access', 'Activity']

// ── Sub-components ───────────────────────────────────────────────────────────

function KV({ label, children }) {
  return (
    <div className="space-y-1">
      <p className="text-[9px] uppercase tracking-wider font-semibold text-text-muted">{label}</p>
      <div className="text-xs text-text-secondary">{children}</div>
    </div>
  )
}

function StatBox({ icon: Icon, value, label, color }) {
  return (
    <div className="rounded-xl p-3 flex flex-col gap-1"
      style={{ background: `${color}10`, border: `1px solid ${color}28` }}>
      <div className="flex items-center gap-1.5">
        <Icon size={11} style={{ color }} />
        <span className="text-[9px] uppercase tracking-wider font-semibold" style={{ color: `${color}aa` }}>{label}</span>
      </div>
      <p className="text-xl font-bold" style={{ color }}>{value}</p>
    </div>
  )
}

function AccessRow({ name, initials }) {
  const gradient = `linear-gradient(135deg,#${Math.floor(Math.random()*0xfff+0x100).toString(16)},#${Math.floor(Math.random()*0xfff+0x100).toString(16)})`
  return (
    <div className="flex items-center gap-2 py-1.5">
      <div className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold text-white shrink-0"
        style={{ background: 'linear-gradient(135deg,#475569,#334155)' }}>
        {initials || name?.[0]?.toUpperCase()}
      </div>
      <span className="text-xs text-text-secondary">{name}</span>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export default function TruthPackSlideOut({ pack, onClose, onEdit, onArchive, onDuplicate }) {
  const [tab, setTab] = useState('Overview')

  const st  = STATUS_MAP[pack.status]  || STATUS_MAP.draft
  const at  = ACCESS_MAP[pack.accessType] || ACCESS_MAP.users
  const usg = USAGE_MAP[pack.usage]    || USAGE_MAP.low

  const menuItems = [
    { label: 'Edit Pack',      icon: FileText,   onClick: onEdit },
    { label: 'View Activity',  icon: Activity,   onClick: () => setTab('Activity') },
    { label: 'Duplicate',      icon: Eye,        onClick: onDuplicate },
    { label: 'Archive',        icon: AlertTriangle, onClick: onArchive, danger: pack.status !== 'archived' },
  ]

  return createPortal(
    <>
      <div className="fixed inset-0 z-[9998] bg-black/30" onClick={onClose} />
      <aside className="slide-out-panel" style={{ zIndex: 9999, width: 420 }}>

        {/* ── Sticky header ─────────────────────────────── */}
        <div className="sticky top-0 z-10 px-5 py-4 space-y-3"
          style={{ background: 'var(--slideout-bg)', borderBottom: '1px solid var(--slideout-border)' }}>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg shrink-0 mt-0.5"
              style={{ background: 'rgba(34,197,94,0.12)' }}>
              <BookOpen size={16} style={{ color: '#22c55e' }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-text-primary leading-tight">{pack.name}</p>
              <p className="text-[11px] text-text-muted mt-0.5">{pack.id} · {pack.department}</p>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <ThreeDot items={menuItems} />
              <button onClick={onClose} className="btn-ghost p-1.5"><X size={14} /></button>
            </div>
          </div>

          {/* Status / access / usage chips */}
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
            <span className="ml-auto inline-flex items-center gap-1 text-[10px]"
              style={{ color: usg.color }}>
              <usg.icon size={10} /> {usg.label}
            </span>
          </div>

          {/* Tab bar */}
          <div className="tab-bar -mb-px">
            {TABS.map(t => (
              <button key={t} className={clsx('tab-btn', tab === t && 'active')} onClick={() => setTab(t)}>
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* ── Body ─────────────────────────────────────── */}
        <div className="p-5 space-y-5">

          {/* ── OVERVIEW ──────────────────────────────── */}
          {tab === 'Overview' && (
            <>
              {/* Stats grid */}
              <div className="grid grid-cols-4 gap-2">
                <StatBox icon={FileText}  value={pack.factsCount}    label="Facts"    color="#22c55e" />
                <StatBox icon={Users}     value={pack.usersCount}    label="Users"    color="#60a5fa" />
                <StatBox icon={Bot}       value={pack.agentsCount}   label="Agents"   color="#a78bfa" />
                <StatBox icon={Network}   value={pack.networksCount} label="Networks" color="#2dd4bf" />
              </div>

              {/* Description */}
              <div className="rounded-xl p-4 space-y-1"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <p className="text-[9px] uppercase tracking-wider font-semibold text-text-muted mb-1.5">Purpose</p>
                <p className="text-xs text-text-secondary leading-relaxed">{pack.description}</p>
              </div>

              {/* Metadata grid */}
              <div className="grid grid-cols-2 gap-4">
                <KV label="Owner">
                  <div className="flex items-center gap-1.5">
                    <div className="w-4 h-4 rounded-full shrink-0 flex items-center justify-center text-[7px] font-bold text-white"
                      style={{ background: pack.ownerGradient }}>{pack.ownerInitials}</div>
                    {pack.owner}
                  </div>
                </KV>
                <KV label="Last Updated">
                  <div className="flex items-center gap-1">
                    <Calendar size={10} className="text-text-muted" /> {pack.lastUpdated}
                  </div>
                </KV>
                <KV label="Department">
                  <div className="flex items-center gap-1">
                    <Building2 size={10} className="text-text-muted" /> {pack.department}
                  </div>
                </KV>
                <KV label="Scope">
                  <div className="flex items-center gap-1">
                    <Tag size={10} className="text-text-muted" /> {pack.scope}
                  </div>
                </KV>
              </div>

              {/* Linked Truth Plane */}
              {pack.linkedTruthPlane ? (
                <div className="rounded-xl px-4 py-3 flex items-center gap-3"
                  style={{ background: 'rgba(59,130,246,0.07)', border: '1px solid rgba(59,130,246,0.2)' }}>
                  <Shield size={13} style={{ color: '#60a5fa' }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[9px] uppercase tracking-wider font-semibold mb-0.5" style={{ color: '#60a5fa88' }}>
                      Linked Truth Plane
                    </p>
                    <p className="text-xs font-semibold text-text-secondary">{pack.linkedTruthPlane}</p>
                  </div>
                  <ExternalLink size={11} style={{ color: '#60a5fa' }} className="shrink-0 opacity-60" />
                </div>
              ) : (
                <div className="rounded-xl px-4 py-3 flex items-center gap-3"
                  style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.1)' }}>
                  <Shield size={13} className="text-text-muted" />
                  <p className="text-xs italic text-text-muted">No linked Truth Plane — facts must be added manually</p>
                </div>
              )}

              {/* Tags */}
              {pack.tags?.length > 0 && (
                <div className="space-y-2">
                  <p className="text-[9px] uppercase tracking-wider font-semibold text-text-muted">Tags</p>
                  <div className="flex flex-wrap gap-1.5">
                    {pack.tags.map(tag => (
                      <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full"
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#64748b' }}>
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Stale warning */}
              {pack.isStale && (
                <div className="rounded-xl px-4 py-3 flex items-center gap-3"
                  style={{ background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.25)' }}>
                  <AlertTriangle size={13} style={{ color: '#fbbf24' }} />
                  <div>
                    <p className="text-xs font-semibold" style={{ color: '#fbbf24' }}>Pack may be stale</p>
                    <p className="text-[11px] text-text-muted mt-0.5">No updates in over 14 days. Review facts before next distribution cycle.</p>
                  </div>
                </div>
              )}
            </>
          )}

          {/* ── FACTS ─────────────────────────────────── */}
          {tab === 'Facts' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs text-text-muted">{pack.factsCount} facts included in this pack</p>
                <button className="text-[10px] font-medium flex items-center gap-1"
                  style={{ color: '#22c55e' }}>
                  <FileText size={10} /> Sync from Plane
                </button>
              </div>
              {pack.factsCount === 0 ? (
                <div className="rounded-xl p-8 text-center"
                  style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.1)' }}>
                  <FileText size={22} className="mx-auto mb-3 text-text-muted opacity-40" />
                  <p className="text-sm text-text-muted">No facts added yet</p>
                  <p className="text-xs text-text-muted mt-1 opacity-60">Link a Truth Plane or add facts manually to populate this pack.</p>
                  <button className="btn-secondary mt-4 text-xs">Link Truth Plane</button>
                </div>
              ) : (
                <div className="space-y-1.5">
                  {[
                    { id: 'TF-0001', title: 'Service Level Agreement - Uptime Guarantee', status: 'verified' },
                    { id: 'TF-0002', title: 'Contract Auto-Renewal Terms', status: 'verified' },
                    { id: 'TF-0003', title: 'Payment Terms and Conditions', status: 'in-review' },
                    { id: 'TF-0004', title: 'Technical Support Response Time', status: 'verified' },
                  ].slice(0, Math.min(pack.factsCount, 4)).map(f => (
                    <div key={f.id} className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg"
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <CheckCircle size={12} style={{ color: f.status === 'verified' ? '#4ade80' : '#fbbf24', flexShrink: 0 }} />
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-medium text-text-secondary truncate">{f.title}</p>
                        <p className="text-[10px] text-text-muted">{f.id}</p>
                      </div>
                    </div>
                  ))}
                  {pack.factsCount > 4 && (
                    <p className="text-center text-[11px] text-text-muted pt-1">
                      +{pack.factsCount - 4} more facts · <button className="underline opacity-70">View all</button>
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ── ACCESS ────────────────────────────────── */}
          {tab === 'Access' && (
            <div className="space-y-5">
              {/* Users */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Users size={12} style={{ color: '#60a5fa' }} />
                  <p className="text-[10px] font-semibold text-text-secondary">Users ({pack.usersCount})</p>
                  <button className="ml-auto text-[10px] font-medium" style={{ color: '#60a5fa' }}>+ Add</button>
                </div>
                {pack.accessDetails?.users?.length > 0 ? (
                  <div className="rounded-xl overflow-hidden"
                    style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
                    {pack.accessDetails.users.map((u, i) => (
                      <div key={i} className="flex items-center gap-2 px-3 py-2"
                        style={{ borderBottom: i < pack.accessDetails.users.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', background: 'rgba(255,255,255,0.02)' }}>
                        <div className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold text-white shrink-0"
                          style={{ background: 'linear-gradient(135deg,#475569,#334155)' }}>
                          {u[0]?.toUpperCase()}
                        </div>
                        <span className="text-xs text-text-secondary">{u}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-text-muted italic">No users added</p>
                )}
              </div>

              {/* Agents */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Bot size={12} style={{ color: '#a78bfa' }} />
                  <p className="text-[10px] font-semibold text-text-secondary">Agents ({pack.agentsCount})</p>
                  <button className="ml-auto text-[10px] font-medium" style={{ color: '#a78bfa' }}>+ Add</button>
                </div>
                {pack.accessDetails?.agents?.length > 0 ? (
                  <div className="rounded-xl overflow-hidden"
                    style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
                    {pack.accessDetails.agents.map((a, i) => (
                      <div key={i} className="flex items-center gap-2 px-3 py-2"
                        style={{ borderBottom: i < pack.accessDetails.agents.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', background: 'rgba(255,255,255,0.02)' }}>
                        <div className="p-1 rounded shrink-0" style={{ background: 'rgba(124,92,252,0.15)' }}>
                          <Bot size={9} style={{ color: '#a78bfa' }} />
                        </div>
                        <span className="text-xs text-text-secondary">{a}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-text-muted italic">No agents added</p>
                )}
              </div>

              {/* Agentic Networks */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Network size={12} style={{ color: '#2dd4bf' }} />
                  <p className="text-[10px] font-semibold text-text-secondary">Agentic Networks ({pack.networksCount})</p>
                  <button className="ml-auto text-[10px] font-medium" style={{ color: '#2dd4bf' }}>+ Add</button>
                </div>
                {pack.accessDetails?.networks?.length > 0 ? (
                  <div className="rounded-xl overflow-hidden"
                    style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
                    {pack.accessDetails.networks.map((n, i) => (
                      <div key={i} className="flex items-center gap-2 px-3 py-2"
                        style={{ borderBottom: i < pack.accessDetails.networks.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', background: 'rgba(255,255,255,0.02)' }}>
                        <div className="p-1 rounded shrink-0" style={{ background: 'rgba(20,184,166,0.15)' }}>
                          <Network size={9} style={{ color: '#2dd4bf' }} />
                        </div>
                        <span className="text-xs text-text-secondary">{n}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-text-muted italic">No networks added</p>
                )}
              </div>
            </div>
          )}

          {/* ── ACTIVITY ──────────────────────────────── */}
          {tab === 'Activity' && (
            <div className="space-y-1">
              {(pack.recentActivity || []).map((ev, i) => (
                <div key={i} className="flex items-start gap-3 py-3"
                  style={{ borderBottom: i < pack.recentActivity.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                  <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: '#22c55e' }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-text-secondary">{ev.action}</p>
                    <p className="text-[10px] text-text-muted mt-0.5">by {ev.by} · {ev.at}</p>
                  </div>
                </div>
              ))}
              {(!pack.recentActivity || pack.recentActivity.length === 0) && (
                <p className="text-center py-8 text-xs text-text-muted">No activity recorded yet.</p>
              )}
            </div>
          )}

        </div>

        {/* ── Sticky footer ─────────────────────────── */}
        <div className="sticky bottom-0 px-5 py-4 flex gap-2.5"
          style={{ background: 'var(--slideout-bg)', borderTop: '1px solid var(--slideout-border)' }}>
          <button className="btn-primary flex-1 gap-1.5" onClick={onEdit}>
            <FileText size={13} /> Manage Pack
          </button>
          <button className="btn-secondary gap-1.5" onClick={() => setTab('Access')}>
            <Users size={13} /> Access
          </button>
        </div>

      </aside>
    </>,
    document.body
  )
}
