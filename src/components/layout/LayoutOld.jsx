import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  Library, Shield, LayoutGrid, Wrench, Rocket, Settings,
  CheckSquare, ChevronRight, Search, Bell, HelpCircle, Moon, User,
  ChevronLeft
} from 'lucide-react'

const NAV = [
  { icon: LayoutGrid, label: 'Control Center', path: null, disabled: true },
  { icon: CheckSquare, label: 'My Work', path: null, disabled: true },
  { icon: Library, label: 'Intelligence Library', path: '/intelligence-library' },
  { icon: Shield, label: 'Truth Plane', path: '/truth-plane' },
  { icon: LayoutGrid, label: 'Sandbox Plane', path: '/sandbox' },
  { icon: Wrench, label: 'Builder', path: null, disabled: true },
  { icon: Rocket, label: 'Deploy', path: null, disabled: true },
  { icon: Settings, label: 'Admin', path: null, disabled: true },
]

export default function Layout({ children }) {
  const [expanded, setExpanded] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()

  const isActive = (path) => path && location.pathname.startsWith(path)

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#0a0b0f' }}>
      {/* Sidebar */}
      <aside
        className="flex flex-col shrink-0 transition-all duration-200"
        style={{
          width: expanded ? 220 : 56,
          background: 'rgba(18,20,26,0.95)',
          borderRight: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        {/* Workspace header */}
        <div className="flex items-center gap-2 px-3 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center justify-center w-7 h-7 rounded-md text-white text-xs font-bold shrink-0"
            style={{ background: 'linear-gradient(135deg, #7c5cfc, #3b82f6)' }}>C</div>
          {expanded && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-text-primary truncate">CRM Workspace</p>
              <p className="text-[10px] text-text-muted">Pro Plan</p>
            </div>
          )}
          {expanded && (
            <button onClick={() => setExpanded(false)} className="btn-ghost p-1">
              <ChevronLeft size={14} />
            </button>
          )}
        </div>

        {/* Nav items */}
        <nav className="flex-1 py-3 px-2 space-y-0.5">
          {NAV.map(({ icon: Icon, label, path, disabled }) => {
            const active = isActive(path)
            return (
              <button
                key={label}
                disabled={disabled}
                onClick={() => path && navigate(path)}
                className="flex items-center gap-2.5 w-full px-2 py-2 rounded-lg transition-all duration-150 text-left"
                style={{
                  background: active ? 'linear-gradient(135deg, rgba(124,92,252,0.25), rgba(59,130,246,0.15))' : 'transparent',
                  borderLeft: active ? '2px solid #7c5cfc' : '2px solid transparent',
                  color: disabled ? '#2d3748' : active ? '#e2e8f0' : '#64748b',
                  cursor: disabled ? 'default' : 'pointer',
                }}
              >
                <Icon size={16} className="shrink-0" />
                {expanded && <span className="text-xs font-medium truncate">{label}</span>}
              </button>
            )
          })}
        </nav>

        {/* Expand toggle when collapsed */}
        {!expanded && (
          <button onClick={() => setExpanded(true)} className="flex items-center justify-center py-3 btn-ghost">
            <ChevronRight size={14} />
          </button>
        )}
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center gap-3 px-6 py-3 shrink-0"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(10,11,15,0.8)' }}>
          <div className="flex-1 flex items-center gap-2 px-3 py-1.5 rounded-lg max-w-md"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <Search size={14} className="text-text-muted shrink-0" />
            <input className="bg-transparent text-xs text-text-secondary outline-none flex-1 placeholder:text-text-muted"
              placeholder="Search..." />
            <span className="text-[10px] text-text-muted px-1.5 py-0.5 rounded"
              style={{ background: 'rgba(255,255,255,0.06)' }}>⌘K</span>
          </div>
          <div className="flex items-center gap-2 ml-auto">
            {[Bell, HelpCircle, Moon].map((Icon, i) => (
              <button key={i} className="btn-ghost p-1.5 rounded-lg">
                <Icon size={15} />
              </button>
            ))}
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold"
              style={{ background: 'linear-gradient(135deg, #f59e0b, #ef4444)' }}>A</div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
