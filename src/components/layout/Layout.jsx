import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  Library, Shield, LayoutGrid, Wrench, Rocket, Settings,
  CheckSquare, ChevronRight, Search, Bell, HelpCircle,
  Sun, Moon, ChevronLeft,
} from 'lucide-react'

const NAV = [
  { icon: LayoutGrid, label: 'Control Center',      path: null,                   disabled: true },
  { icon: CheckSquare, label: 'My Work',             path: null,                   disabled: true },
  { icon: Library,     label: 'Intelligence Library',path: '/intelligence-library' },
  { icon: Shield,      label: 'Truth Plane',         path: '/truth-plane' },
  { icon: LayoutGrid,  label: 'Sandbox Plane',       path: '/sandbox' },
  { icon: Wrench,      label: 'Builder',             path: null,                   disabled: true },
  { icon: Rocket,      label: 'Deploy',              path: null,                   disabled: true },
  { icon: Settings,    label: 'Admin',               path: null,                   disabled: true },
]

/* ─── Theme helpers ─────────────────────────────────── */

function getStoredTheme() {
  try { return localStorage.getItem('gs-theme') || 'dark' } catch { return 'dark' }
}

function applyTheme(theme, animate = false) {
  const html = document.documentElement
  if (animate) {
    html.classList.add('theme-transitioning')
    setTimeout(() => html.classList.remove('theme-transitioning'), 300)
  }
  if (theme === 'light') {
    html.classList.add('light')
    html.classList.remove('dark')
  } else {
    html.classList.add('dark')
    html.classList.remove('light')
  }
  try { localStorage.setItem('gs-theme', theme) } catch {}
}

/* ─── Component ─────────────────────────────────────── */

export default function Layout({ children }) {
  const [expanded, setExpanded] = useState(true)
  const [theme, setTheme]       = useState(getStoredTheme)
  const navigate  = useNavigate()
  const location  = useLocation()

  /* Apply theme on mount (no animation — avoids FOUC) */
  useEffect(() => { applyTheme(theme, false) }, [])

  const toggleTheme = useCallback(() => {
    setTheme(prev => {
      const next = prev === 'dark' ? 'light' : 'dark'
      applyTheme(next, true)
      return next
    })
  }, [])

  const isActive = (path) => path && location.pathname.startsWith(path)
  const isLight  = theme === 'light'

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: 'var(--bg-base)' }}
    >
      {/* ── Sidebar ─────────────────────────────────── */}
      <aside
        className="flex flex-col shrink-0 transition-all duration-200 relative"
        style={{
          width: expanded ? 220 : 56,
          background: 'var(--sidebar-bg)',
          borderRight: '1px solid var(--sidebar-border)',
        }}
      >
        {/* Toggle button — floats on the right edge */}
        <button
          onClick={() => setExpanded(e => !e)}
          className="absolute flex items-center justify-center w-6 h-6 rounded-md transition-all"
          title={expanded ? 'Collapse sidebar' : 'Expand sidebar'}
          style={{
            top: 18,
            right: -13,
            zIndex: 50,
            background: 'linear-gradient(135deg, #7c5cfc, #3b82f6)',
            color: '#fff',
            boxShadow: '0 2px 8px rgba(124,92,252,0.4)',
          }}
        >
          {expanded ? <ChevronLeft size={12} /> : <ChevronRight size={12} />}
        </button>

        {/* Workspace header */}
        <div
          className="flex items-center gap-2 px-3 py-4"
          style={{ borderBottom: '1px solid var(--sidebar-border)' }}
        >
          <div
            className="flex items-center justify-center w-7 h-7 rounded-md text-white text-xs font-bold shrink-0"
            style={{ background: 'linear-gradient(135deg, #7c5cfc, #3b82f6)' }}
          >
            C
          </div>

          {expanded && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                CRM Workspace
              </p>
              <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Pro Plan</p>
            </div>
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
                title={!expanded ? label : undefined}
                className="flex items-center gap-2.5 w-full px-2 py-2 rounded-lg transition-all duration-150 text-left"
                style={{
                  background: active
                    ? isLight
                      ? 'rgba(124,92,252,0.10)'
                      : 'linear-gradient(135deg, rgba(124,92,252,0.25), rgba(59,130,246,0.15))'
                    : 'transparent',
                  borderLeft: active ? '2px solid #7c5cfc' : '2px solid transparent',
                  color: disabled
                    ? 'var(--border-default)'
                    : active
                    ? isLight ? '#6d28d9' : '#e2e8f0'
                    : 'var(--text-muted)',
                  cursor: disabled ? 'default' : 'pointer',
                }}
              >
                <Icon size={16} className="shrink-0" />
                {expanded && (
                  <span className="text-xs font-medium truncate">{label}</span>
                )}
              </button>
            )
          })}
        </nav>

      </aside>

      {/* ── Main area ───────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Top bar */}
        <header
          className="flex items-center gap-3 px-6 py-3 shrink-0"
          style={{
            borderBottom: '1px solid var(--topbar-border)',
            background: 'var(--topbar-bg)',
          }}
        >
          {/* Search */}
          <div
            className="flex-1 flex items-center gap-2 px-3 py-1.5 rounded-lg max-w-md"
            style={{
              background: 'var(--input-bg)',
              border: '1px solid var(--input-border)',
            }}
          >
            <Search size={14} style={{ color: 'var(--text-muted)' }} className="shrink-0" />
            <input
              className="bg-transparent text-xs outline-none flex-1"
              style={{ color: 'var(--text-secondary)' }}
              placeholder="Search..."
            />
            <span
              className="text-[10px] px-1.5 py-0.5 rounded"
              style={{
                color: 'var(--text-muted)',
                background: isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)',
              }}
            >
              ⌘K
            </span>
          </div>

          {/* Right icons */}
          <div className="flex items-center gap-1 ml-auto">
            <button className="btn-ghost p-1.5 rounded-lg">
              <Bell size={15} />
            </button>
            <button className="btn-ghost p-1.5 rounded-lg">
              <HelpCircle size={15} />
            </button>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="btn-ghost p-1.5 rounded-lg"
              title={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
              style={{
                color: isLight ? '#d97706' : 'var(--text-muted)',
                background: isLight
                  ? 'rgba(217,119,6,0.10)'
                  : 'transparent',
              }}
            >
              {isLight ? <Sun size={15} /> : <Moon size={15} />}
            </button>

            {/* Avatar */}
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ml-1"
              style={{ background: 'linear-gradient(135deg, #f59e0b, #ef4444)', color: '#fff' }}
            >
              A
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto" style={{ background: 'var(--bg-base)' }}>
          {children}
        </main>
      </div>
    </div>
  )
}
