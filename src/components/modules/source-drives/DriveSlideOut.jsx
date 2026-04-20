import React, { useState } from 'react'
import { ExternalLink, Eye } from 'lucide-react'
import { SlideOut, TabBar } from '../../ui/index'
import { driveDetail } from '../../../data/mock'

export default function DriveSlideOut({ drive, onClose, onOpen }) {
  const [tab, setTab] = useState('Overview')
  const d = driveDetail

  return (
    <SlideOut
      title={drive.name}
      subtitle={drive.desc}
      badges={[
        { label: drive.owner, variant: 'gray' },
        { label: drive.status === 'active' ? 'Watching' : 'Not watching', variant: drive.status === 'active' ? 'active' : 'gray' },
      ]}
      onClose={onClose}
      actions={
        <button className="btn-primary text-xs py-1.5 px-3" onClick={onOpen}>
          <ExternalLink size={12} /> Go to Drive
        </button>
      }
    >
      <TabBar tabs={['Overview', 'Details']} active={tab} onChange={setTab} />

      {tab === 'Overview' && (
        <div className="mt-4 space-y-4">
          {/* Pipeline */}
          <div className="glass-card p-4">
            <p className="text-xs font-semibold text-text-secondary mb-3">Knowledge Pipeline</p>
            <div className="flex items-center gap-1 mb-3">
              {['Ingest','DIAN','Sandbox','Truth'].map((s, i) => (
                <React.Fragment key={s}>
                  <div className="flex-1 h-1 rounded-full" style={{ background: ['#475569','#7c5cfc','#f59e0b','#22c55e'][i] }} />
                  {i < 3 && <div className="w-1 h-1 rounded-full bg-text-muted opacity-40" />}
                </React.Fragment>
              ))}
            </div>
            <div className="flex justify-between text-[10px] text-text-muted">
              {['Ingest','DIAN','Sandbox','Truth'].map(s => <span key={s}>{s}</span>)}
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-2">
            <div className="glass-card p-3">
              <p className="text-[10px] text-text-muted mb-1">Not ingested</p>
              <div className="flex items-center gap-1.5">
                <p className="text-xl font-bold text-text-primary">5</p>
                <span className="badge badge-pending text-[10px]">pending</span>
              </div>
            </div>
            <div className="glass-card p-3">
              <p className="text-[10px] text-text-muted mb-1">In DIAN</p>
              <p className="text-xl font-bold" style={{ color: '#a78bfa' }}>298</p>
            </div>
            <div className="glass-card p-3">
              <p className="text-[10px] text-text-muted mb-1">Sandbox</p>
              <p className="text-xl font-bold" style={{ color: '#fbbf24' }}>127</p>
              <p className="text-[10px] mt-0.5" style={{ color: '#fbbf24' }}>8 need review</p>
            </div>
            <div className="glass-card p-3">
              <p className="text-[10px] text-text-muted mb-1">Claims</p>
              <p className="text-xl font-bold" style={{ color: '#60a5fa' }}>10</p>
            </div>
          </div>

          <div className="glass-card p-3">
            <p className="text-[10px] text-text-muted mb-1">Truth</p>
            <p className="text-xl font-bold" style={{ color: '#4ade80' }}>89</p>
          </div>

          {/* Actions */}
          <div>
            <p className="section-label mb-2">What can I do?</p>
            <div className="space-y-1.5">
              {[
                { label: 'Review Sandbox', sub: '8 items need attention' },
                { label: 'Add Files', sub: 'Upload documents to this drive' },
                { label: 'Watch Rules', sub: 'Configure auto-watch conditions' },
              ].map(({ label, sub }) => (
                <button key={label} className="w-full flex items-start gap-2.5 p-3 rounded-lg text-left transition-all"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}>
                  <div className="p-1.5 rounded mt-0.5 shrink-0" style={{ background: 'rgba(124,92,252,0.12)' }}>
                    <Eye size={12} style={{ color: '#a78bfa' }} />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-text-secondary">{label}</p>
                    <p className="text-[11px] text-text-muted">{sub}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'Details' && (
        <div className="mt-4 space-y-3">
          {[
            ['Owner', drive.owner],
            ['Scope', drive.scope],
            ['Status', drive.status === 'active' ? 'Active Ingestion' : 'No Ingestion'],
            ['Last Activity', drive.lastActivity],
            ['Documents', drive.docs],
          ].map(([k, v]) => (
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
