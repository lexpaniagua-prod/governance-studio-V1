import React from 'react'
import { useNavigate } from 'react-router-dom'
import { FolderOpen, LayoutGrid, Shield, BookOpen, Activity } from 'lucide-react'

const PLANES = [
  { icon: FolderOpen, label: 'Source Drives', sub: 'Where raw documents are organized and ingested.', value: 342, unit: 'Drives', color: '#14b8a6', path: '/intelligence-library/source-drives' },
  { icon: LayoutGrid, label: 'Sandbox Plane', sub: 'Where data is analyzed and structured into claims.', value: 23, unit: 'Planes', color: '#7c5cfc', path: '/sandbox' },
  { icon: Shield, label: 'Truth Plane', sub: 'Where verified facts are approved and enforced.', value: 27, unit: 'Planes', color: '#3b82f6', path: '/truth-plane' },
  { icon: BookOpen, label: 'Knowledge', sub: 'Where validated facts became truth packs to be used by agentic networks.', value: 138, unit: 'Truth packs', color: '#22c55e', path: '/intelligence-library/knowledge' },
]
const ACTIVITY = [
  { icon: LayoutGrid, color: '#7c5cfc', label: 'Experiment completed: Customer segmentation analysis', by: 'Alex Rodriguez', time: '1 hour ago' },
  { icon: Shield, color: '#3b82f6', label: 'New fact added: GDPR compliance requirement', by: 'Michael Chen', time: '3 hours ago' },
  { icon: FolderOpen, color: '#14b8a6', label: '12 files uploaded to Sales Drive', by: 'Emma Wilson', time: '6 hours ago' },
  { icon: BookOpen, color: '#22c55e', label: 'Knowledge article published: Q4 2024 Sales Strategy', by: 'David Park', time: 'Yesterday' },
  { icon: LayoutGrid, color: '#7c5cfc', label: 'New experiment created: Revenue forecasting model', by: 'Sarah Johnson', time: '2 days ago' },
]
export default function IntelligenceLibrary() {
  const navigate = useNavigate()
  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold text-text-primary mb-6">Intelligence Library</h1>
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        {PLANES.map(({ icon: Icon, label, sub, value, unit, color, path }) => (
          <button key={label} onClick={() => path && navigate(path)} disabled={!path}
            className="glass-card p-4 text-left transition-all hover:border-white/15"
            style={{ cursor: path ? 'pointer' : 'default' }}>
            <p className="text-sm font-semibold text-text-primary mb-1">{label}</p>
            <p className="text-xs text-text-muted mb-4 leading-relaxed">{sub}</p>
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg" style={{ background: color + '20' }}>
                <Icon size={16} style={{ color }} />
              </div>
              <span className="text-2xl font-bold" style={{ color }}>{value}</span>
              <span className="text-xs text-text-muted">{unit}</span>
            </div>
          </button>
        ))}
      </div>
      <div className="glass-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Activity size={14} className="text-text-muted" />
          <p className="text-sm font-semibold text-text-primary">Recent Activity</p>
        </div>
        {ACTIVITY.map(({ icon: Icon, color, label, by, time }, i) => (
          <div key={i} className="flex items-start gap-3 py-3" style={{ borderBottom: i < ACTIVITY.length-1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
            <div className="p-1.5 rounded-lg mt-0.5 shrink-0" style={{ background: color + '15' }}>
              <Icon size={13} style={{ color }} />
            </div>
            <div>
              <p className="text-xs text-text-secondary">{label}</p>
              <p className="text-[11px] text-text-muted mt-0.5">by {by} · {time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
