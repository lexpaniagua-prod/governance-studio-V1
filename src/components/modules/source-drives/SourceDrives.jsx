import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FolderOpen, Plus, Globe, Lock, Clock, FileText, Sparkles, Filter, LayoutGrid, List, Eye } from 'lucide-react'
import { drives } from '../../../data/mock'
import { Badge, SearchBar, ThreeDot, AllFiltersPanel, FilterSection } from '../../ui/index'
import DriveSlideOut from './DriveSlideOut'
import AddDriveModal from './AddDriveModal'

export default function SourceDrives() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState(null)
  const [showAdd, setShowAdd] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [search, setSearch] = useState('')

  const filtered = drives.filter(d => d.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="flex h-full">
      <div className="flex-1 min-w-0 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg" style={{ background: 'rgba(20,184,166,0.15)' }}>
              <FolderOpen size={18} style={{ color: '#14b8a6' }} />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-text-primary">Source Drives</h1>
              <p className="text-xs text-text-muted">{drives.length} drives</p>
            </div>
          </div>
          <button className="btn-primary" onClick={() => setShowAdd(true)}>
            <Plus size={14} /> Add Drive
          </button>
        </div>

        {/* Filters row */}
        <div className="flex items-center gap-2 mb-4">
          <SearchBar placeholder="Search drives..." value={search} onChange={setSearch} />
          <select className="input-base w-auto text-xs px-3 py-2" style={{ width: 'auto' }}>
            {['All','Today','Yesterday','Last 7 days','Last 30 days','Older'].map(o => <option key={o}>{o}</option>)}
          </select>
          <select className="input-base w-auto text-xs px-3 py-2" style={{ width: 'auto' }}>
            {['All Departments','Sales','Marketing','Engineering','Product','HR'].map(o => <option key={o}>{o}</option>)}
          </select>
          <button className="btn-secondary gap-1.5" onClick={() => setShowFilters(true)}>
            <Filter size={13} /> All filters
          </button>
          <div className="flex gap-1 ml-auto">
            <button className="btn-ghost p-2"><LayoutGrid size={14} /></button>
            <button className="btn-ghost p-2"><List size={14} /></button>
          </div>
        </div>

        {/* Drive list */}
        <div className="space-y-2">
          {filtered.map(drive => (
            <div key={drive.id}
              className={`row-item ${selected?.id === drive.id ? 'selected' : ''}`}
              onClick={() => setSelected(drive)}>
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg mt-0.5 shrink-0" style={{ background: 'rgba(20,184,166,0.12)' }}>
                  <FolderOpen size={16} style={{ color: '#14b8a6' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-text-primary">{drive.name}</p>
                    <Badge variant={drive.status === 'active' ? 'ingestion' : 'no-ingestion'}>
                      {drive.status === 'active' ? 'Active Ingestion' : 'No Ingestion'}
                    </Badge>
                    <div className="ml-auto flex items-center gap-0.5">
                      <button className="btn-ghost p-1.5" onClick={e => { e.stopPropagation(); setSelected(drive) }}>
                        <Eye size={14} />
                      </button>
                      <ThreeDot items={[
                        { label: 'View Drive', onClick: () => navigate(`/intelligence-library/source-drives/${drive.id}`) },
                        { label: 'Edit Drive', onClick: () => {} },
                        { label: 'Watch', onClick: () => {} },
                      ]} />
                    </div>
                  </div>
                  <p className="text-xs text-text-muted mt-0.5">{drive.desc}</p>
                  <div className="flex items-center gap-4 mt-2 flex-wrap">
                    <span className="text-xs text-text-muted">Owner: <span className="font-medium text-text-secondary">{drive.owner}</span></span>
                    <span className="flex items-center gap-1 text-xs text-text-muted">
                      {drive.scope === 'Company-wide' ? <Globe size={11} /> : <Lock size={11} />}
                      {drive.scope}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-text-muted">
                      <Clock size={11} /> {drive.lastActivity}
                    </span>
                    <div className="ml-auto flex items-center gap-3 text-xs">
                      <span className="flex items-center gap-1" style={{ color: '#60a5fa' }}>
                        <FileText size={11} /> Documents {drive.docs}
                      </span>
                      {drive.sandbox > 0 && (
                        <span className="flex items-center gap-1" style={{ color: '#a78bfa' }}>
                          <Sparkles size={11} /> On Sandbox {drive.sandbox}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4 text-xs text-text-muted">
          <div className="flex items-center gap-2">
            Show
            <select className="input-base py-1 px-2" style={{ width: 56 }}>
              <option>10</option><option>25</option>
            </select>
          </div>
          <span>1-{filtered.length} of {drives.length} drives</span>
          <div className="flex gap-1">
            <button className="btn-ghost px-2 py-1">‹</button>
            <button className="px-2 py-1 rounded text-xs font-medium" style={{ background: '#7c5cfc', color: 'white' }}>1</button>
            <button className="btn-ghost px-2 py-1">›</button>
          </div>
        </div>
      </div>

      {/* Slide-out panel */}
      {selected && (
        <DriveSlideOut drive={selected} onClose={() => setSelected(null)}
          onOpen={() => navigate(`/intelligence-library/source-drives/${selected.id}`)} />
      )}

      {showAdd && <AddDriveModal onClose={() => setShowAdd(false)} />}

      {showFilters && (
        <AllFiltersPanel onClose={() => setShowFilters(false)}>
          <FilterSection label="Sort by">
            {['Last Activity','Document Count','Name','Ingestion Activity'].map(o => (
              <button key={o} className="filter-pill">{o}</button>
            ))}
          </FilterSection>
          <FilterSection label="Department">
            {['Sales','Marketing','Engineering','Product','HR','Finance','Legal','Operations'].map(o => (
              <button key={o} className="filter-pill">{o}</button>
            ))}
          </FilterSection>
          <FilterSection label="Scope">
            {['Company-wide','Private'].map(o => <button key={o} className="filter-pill">{o}</button>)}
          </FilterSection>
          <FilterSection label="Ingestion Setup">
            {['Auto-ingestion enabled','Manual only'].map(o => <button key={o} className="filter-pill">{o}</button>)}
          </FilterSection>
          <FilterSection label="Content Volume">
            {['0-10 documents','10-50 documents','50+ documents'].map(o => <button key={o} className="filter-pill">{o}</button>)}
          </FilterSection>
          <FilterSection label="Sandbox Activity">
            {['Has content in Sandbox','No Sandbox activity'].map(o => <button key={o} className="filter-pill">{o}</button>)}
          </FilterSection>
        </AllFiltersPanel>
      )}
    </div>
  )
}
