import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LayoutGrid, Plus, Filter, ExternalLink, Sparkles, Eye } from 'lucide-react'
import { sandboxes } from '../../../data/mock'
import { Badge, SearchBar, ThreeDot, SlideOut, TabBar, AllFiltersPanel, FilterSection, Modal, FormField } from '../../ui/index'

function SandboxSlideOut({ sandbox, onClose, onOpen }) {
  const [tab, setTab] = useState('Overview')
  return (
    <SlideOut title={sandbox.name} subtitle={sandbox.desc}
      badges={[{ label: 'Active', variant: 'active' }, { label: sandbox.scope, variant: 'gray' }]}
      onClose={onClose}
      actions={
        <div className="flex gap-1.5">
          <button className="btn-primary text-xs py-1.5 px-3" onClick={onOpen}>
            <ExternalLink size={12} /> Open Sandbox
          </button>
          <button className="btn-secondary text-xs py-1.5 px-3">
            <Sparkles size={12} /> Go to Claims
          </button>
        </div>
      }>
      <TabBar tabs={['Overview', 'Details']} active={tab} onChange={setTab} />

      {tab === 'Overview' && (
        <div className="mt-4 space-y-4">
          <div className="glass-card p-4">
            <div className="flex gap-1.5 mb-1">
              <Sparkles size={13} style={{ color: '#a78bfa' }} />
              <p className="text-xs font-semibold text-text-secondary">AI Summary</p>
            </div>
            <p className="text-xs text-text-muted leading-relaxed">
              This sandbox contains {sandbox.claims} claims generated from {sandbox.sources} sources organized into {sandbox.bundles} bundles. 15 claims require validation. 2 conflicts detected. Ready for promotion.
            </p>
          </div>

          <div>
            <p className="section-label mb-2">Validation &amp; Readiness</p>
            <div className="glass-card p-3 mb-2">
              <p className="text-xs text-text-muted mb-1">Total Promotions</p>
              <p className="text-2xl font-bold" style={{ color: '#4ade80' }}>{sandbox.promotions}</p>
              <p className="text-[11px] text-text-muted">Facts successfully promoted to Truth Plane</p>
            </div>
          </div>

          <div>
            <p className="section-label mb-2">Validation Signals</p>
            <div className="space-y-1.5">
              {[
                { label: 'Pending Validations', count: 15, color: '#fbbf24', bg: 'rgba(245,158,11,0.1)' },
                { label: 'Conflicts Detected', count: 2, color: '#f87171', bg: 'rgba(239,68,68,0.1)' },
                { label: 'Pending Promotions', count: 13, color: '#60a5fa', bg: 'rgba(59,130,246,0.1)' },
              ].map(({ label, count, color, bg }) => (
                <div key={label} className="flex items-center justify-between px-3 py-2 rounded-lg"
                  style={{ background: bg, border: `1px solid ${color}30` }}>
                  <p className="text-xs font-medium" style={{ color }}>{label}</p>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: color + '20', color }}>{count}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="section-label mb-2">Content Breakdown</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Sources', value: sandbox.sources, color: '#60a5fa' },
                { label: 'Bundles', value: sandbox.bundles, color: '#a78bfa' },
                { label: 'Claims', value: sandbox.claims, color: '#60a5fa' },
                { label: 'Promotions', value: sandbox.promotions, color: '#4ade80' },
              ].map(({ label, value, color }) => (
                <div key={label} className="glass-card p-3 text-center">
                  <p className="text-xl font-bold" style={{ color }}>{value}</p>
                  <p className="text-[11px] text-text-muted mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'Details' && (
        <div className="mt-4 space-y-3">
          <p className="text-xs font-semibold text-text-secondary">Sandbox Information</p>
          {[['Owner', sandbox.owner], ['Scope', sandbox.scope], ['Created by', 'Sarah Johnson'], ['Created', 'Feb 10, 2026'], ['Last updated', 'Apr 8, 2026'], ['Last activity', 'Apr 8, 2026 8:03 PM']].map(([k, v]) => (
            <div key={k} className="flex justify-between py-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <span className="text-xs text-text-muted">{k}</span>
              <span className="text-xs font-medium text-text-secondary">{v}</span>
            </div>
          ))}
        </div>
      )}
    </SlideOut>
  )
}

function CreateSandboxModal({ onClose }) {
  return (
    <Modal title="Create Sandbox" subtitle="Create an empty workspace to validate and structure claims. Sources can be added later from within the Sandbox."
      onClose={onClose}
      footer={
        <>
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary">+ Create Sandbox</button>
        </>
      }>
      <FormField label="Sandbox Name" required>
        <input className="input-base" placeholder="e.g. Q1 Pricing Validation, Compliance Review" />
      </FormField>
      <FormField label="Description">
        <textarea className="input-base resize-none h-20" placeholder="Describe the purpose of this sandbox" />
      </FormField>
      <div className="grid grid-cols-2 gap-3">
        <FormField label="Scope" required>
          <select className="input-base"><option value="">Select scope</option><option>Workspace</option><option>Department</option><option>Private</option></select>
        </FormField>
        <FormField label="Owner" required>
          <select className="input-base"><option value="">Select scope first</option></select>
        </FormField>
      </div>
    </Modal>
  )
}

export default function SandboxPlane() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState(null)
  const [showCreate, setShowCreate] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [search, setSearch] = useState('')

  const filtered = sandboxes.filter(s => s.name.toLowerCase().includes(search.toLowerCase()))

  const scopeColor = { Workspace: '#60a5fa', Department: '#a78bfa', Managed: '#4ade80' }

  return (
    <div className="flex h-full">
      <div className="flex-1 min-w-0 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg" style={{ background: 'rgba(124,92,252,0.15)' }}>
              <LayoutGrid size={18} style={{ color: '#a78bfa' }} />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-text-primary">Sandbox Plane</h1>
              <p className="text-xs text-text-muted">{sandboxes.length} experiments</p>
            </div>
          </div>
          <button className="btn-primary" onClick={() => setShowCreate(true)}>
            <Plus size={14} /> New Sandbox
          </button>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <SearchBar placeholder="Search experiments..." value={search} onChange={setSearch} />
          <select className="input-base text-xs px-3 py-2" style={{ width: 'auto' }}>
            <option>Status</option><option>Active</option><option>Archived</option>
          </select>
          <select className="input-base text-xs px-3 py-2" style={{ width: 'auto' }}>
            <option>Needs Attention</option><option>All</option>
          </select>
          <select className="input-base text-xs px-3 py-2" style={{ width: 'auto' }}>
            <option>Owner</option>
          </select>
          <button className="btn-secondary gap-1.5" onClick={() => setShowFilters(true)}>
            <Filter size={13} /> All filters
          </button>
        </div>

        <div className="space-y-2">
          {filtered.map(sandbox => (
            <div key={sandbox.id}
              className={`row-item ${selected?.id === sandbox.id ? 'selected' : ''}`}
              onClick={() => navigate(`/sandbox/${sandbox.id}`)}>
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg mt-0.5 shrink-0" style={{ background: 'rgba(124,92,252,0.12)' }}>
                  <LayoutGrid size={16} style={{ color: '#a78bfa' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-text-primary">{sandbox.name}</p>
                    <div className="ml-auto flex items-center gap-0.5">
                      <button className="btn-ghost p-1.5 rounded-lg" title="Preview" onClick={e => { e.stopPropagation(); setSelected(sandbox) }}>
                        <Eye size={14} />
                      </button>
                      <ThreeDot items={[
                        { label: 'Open Sandbox', onClick: () => navigate(`/sandbox/${sandbox.id}`) },
                        { label: 'Archive', onClick: () => {} },
                        { label: 'Delete', onClick: () => {}, danger: true },
                      ]} />
                    </div>
                  </div>
                  <p className="text-xs text-text-muted mt-0.5">{sandbox.desc}</p>
                  <div className="flex items-center gap-3 mt-2 flex-wrap">
                    <span className="text-xs text-text-muted">Owner: <span className="font-medium text-text-secondary">{sandbox.owner}</span></span>
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium"
                      style={{ background: scopeColor[sandbox.scope] + '15', color: scopeColor[sandbox.scope] }}>
                      {sandbox.scope}
                    </span>
                    <span className="text-xs text-text-muted">🕐 {sandbox.lastActivity}</span>
                    <div className="ml-auto flex items-center gap-3 text-xs">
                      {[
                        { label: `Sources ${sandbox.sources}`, color: '#94a3b8' },
                        { label: `Bundles ${sandbox.bundles}`, color: '#fbbf24' },
                        { label: `Claims ${sandbox.claims}`, color: '#60a5fa' },
                        { label: `Promotions ${sandbox.promotions}`, color: '#4ade80' },
                      ].map(({ label, color }) => (
                        <span key={label} style={{ color }}>{label}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between mt-4 text-xs text-text-muted">
          <span>1-{filtered.length} of {sandboxes.length} experiments</span>
          <div className="flex gap-1">
            <button className="btn-ghost px-2 py-1">‹</button>
            <button className="px-2 py-1 rounded text-xs font-medium" style={{ background: '#7c5cfc', color: 'white' }}>1</button>
            <button className="btn-ghost px-2 py-1">›</button>
          </div>
        </div>
      </div>

      {selected && (
        <SandboxSlideOut sandbox={selected} onClose={() => setSelected(null)}
          onOpen={() => navigate(`/sandbox/${selected.id}`)} />
      )}
      {showCreate && <CreateSandboxModal onClose={() => setShowCreate(false)} />}
      {showFilters && (
        <AllFiltersPanel onClose={() => setShowFilters(false)}>
          <FilterSection label="Claim Status">
            {['Active','In Review','Ready for Promotion','Completed'].map(o => (
              <button key={o} className="filter-pill">{o}</button>
            ))}
          </FilterSection>
          <FilterSection label="Attention Required">
            {['Claims Need Validation','Has Conflicts','Promotions Pending','Blocked'].map(o => (
              <button key={o} className="filter-pill">{o}</button>
            ))}
          </FilterSection>
          <FilterSection label="Usage">
            {['Used in Bundles','Used in Promotions','Not Used','High Usage (5+ uses)'].map(o => (
              <button key={o} className="filter-pill">{o}</button>
            ))}
          </FilterSection>
          <FilterSection label="Activity">
            {['Recently Updated','Recently Created','Stale (no activity in 7+ days)'].map(o => (
              <button key={o} className="filter-pill">{o}</button>
            ))}
          </FilterSection>
        </AllFiltersPanel>
      )}
    </div>
  )
}
