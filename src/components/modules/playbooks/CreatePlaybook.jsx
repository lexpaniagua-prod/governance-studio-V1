import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft, LayoutTemplate, MessageSquare, Plus,
  ChevronRight, Shield, HelpCircle, X, CheckCircle,
  Sparkles, Star, AlertTriangle, Zap, Users, Activity,
  Send, BookOpen, ChevronDown, FileText, Target, Layers,
  Wrench, LogOut, Database, Lock, Bot,
} from 'lucide-react'

// ── Templates ─────────────────────────────────────────────────────────────────
const TEMPLATES = [
  {
    id: 'new-lead',
    name: 'New Lead Follow-Up',
    description: 'Rapid multi-touch strategy for fresh leads with hot window urgency',
    phases: 3,
    tag: 'Acquisition',
    tagColor: '#60a5fa',
    tagBg: 'rgba(59,130,246,0.15)',
    tagBorder: 'rgba(59,130,246,0.3)',
  },
  {
    id: 'no-show',
    name: 'No-Show Recovery',
    description: 'Quick recovery strategy for missed appointments with re-engagement messaging',
    phases: 2,
    tag: 'Recovery',
    tagColor: '#fb923c',
    tagBg: 'rgba(249,115,22,0.15)',
    tagBorder: 'rgba(249,115,22,0.3)',
  },
  {
    id: 'service-retention',
    name: 'Service Reminder Retention',
    description: 'Proactive outreach for overdue service maintenance to prevent churn',
    phases: 3,
    tag: 'Retention',
    tagColor: '#a78bfa',
    tagBg: 'rgba(124,92,252,0.15)',
    tagBorder: 'rgba(124,92,252,0.3)',
  },
]

// ── Simulation data (keyed by template id) ────────────────────────────────────
const SIM_DATA = {
  'new-lead': {
    scenarioInputs: [
      { label: 'Primary Moment',   title: 'New Enterprise Lead Created',  sub: 'Account Value: $250K ARR',                     color: '#a78bfa', bg: 'rgba(124,92,252,0.12)',  border: 'rgba(124,92,252,0.25)',  icon: <Star size={14} color="#fff" /> },
      { label: 'Engagement State', title: 'High Intent Signal',           sub: 'Demo requested, pricing page visited',          color: '#60a5fa', bg: 'rgba(59,130,246,0.12)',  border: 'rgba(59,130,246,0.25)',  icon: <Activity size={14} color="#fff" /> },
      { label: 'Consent State',    title: 'Email & SMS Opted In',         sub: '✓ All channels permitted',                     color: '#2dd4bf', bg: 'rgba(20,184,166,0.12)',  border: 'rgba(20,184,166,0.25)',  icon: <Shield size={14} color="#fff" /> },
      { label: 'Rep Activity',     title: 'No Recent Contact',            sub: 'Last touch: 14 days ago',                      color: '#fb923c', bg: 'rgba(249,115,22,0.12)',  border: 'rgba(249,115,22,0.25)',  icon: <Users size={14} color="#fff" /> },
      { label: 'Account Context',  title: 'Fortune 500 · Financial Services · 5,000+ employees · North America region', sub: null, color: '#94a3b8', bg: 'rgba(100,116,139,0.08)', border: 'rgba(100,116,139,0.2)',  icon: <Shield size={14} color="#94a3b8" /> },
    ],
    qualifies: [
      "Customer segment matches 'Enterprise' criteria (ARR > $100K)",
      "Primary moment 'New Lead Created' is active and triggered",
      "Lead source indicates high-intent signal (demo request)",
      "No conflicting playbooks with higher priority",
      "All required data fields are populated",
    ],
    hardGates: [
      'Consent verification passed',
      'Account eligibility confirmed',
      'No suppression rules active',
    ],
  },
  'no-show': {
    scenarioInputs: [
      { label: 'Primary Moment',   title: 'Appointment No-Show Detected', sub: 'Missed: Discovery Call – 2 days ago',           color: '#fb923c', bg: 'rgba(249,115,22,0.12)',  border: 'rgba(249,115,22,0.25)',  icon: <AlertTriangle size={14} color="#fff" /> },
      { label: 'Engagement State', title: 'Low Re-engagement Signal',     sub: 'No opens in last 7 days',                       color: '#60a5fa', bg: 'rgba(59,130,246,0.12)',  border: 'rgba(59,130,246,0.25)',  icon: <Activity size={14} color="#fff" /> },
      { label: 'Consent State',    title: 'Email Only',                   sub: 'SMS opted-out',                                 color: '#2dd4bf', bg: 'rgba(20,184,166,0.12)',  border: 'rgba(20,184,166,0.25)',  icon: <Shield size={14} color="#fff" /> },
      { label: 'Rep Activity',     title: 'Follow-up Pending',            sub: 'Last touch: same day as no-show',               color: '#a78bfa', bg: 'rgba(124,92,252,0.12)',  border: 'rgba(124,92,252,0.25)',  icon: <Users size={14} color="#fff" /> },
    ],
    qualifies: [
      "No-show event logged within the past 72 hours",
      "Contact has a prior positive engagement history",
      "Re-booking window is still open",
      "No active suppression or DNC flag",
    ],
    hardGates: [
      'Email consent confirmed',
      'No duplicate active sequences',
      'Re-contact cooldown cleared',
    ],
  },
  'service-retention': {
    scenarioInputs: [
      { label: 'Primary Moment',   title: 'Service Due – Overdue 30 Days', sub: 'Vehicle: 2021 Honda CR-V · Mileage: 42,300',   color: '#4ade80', bg: 'rgba(34,197,94,0.12)',   border: 'rgba(34,197,94,0.25)',   icon: <Zap size={14} color="#fff" /> },
      { label: 'Engagement State', title: 'Low Activity Signal',           sub: 'No dealership visit in 8 months',               color: '#60a5fa', bg: 'rgba(59,130,246,0.12)',  border: 'rgba(59,130,246,0.25)',  icon: <Activity size={14} color="#fff" /> },
      { label: 'Consent State',    title: 'Email & SMS Opted In',         sub: '✓ All channels permitted',                      color: '#2dd4bf', bg: 'rgba(20,184,166,0.12)',  border: 'rgba(20,184,166,0.25)',  icon: <Shield size={14} color="#fff" /> },
      { label: 'Rep Activity',     title: 'Service Advisor Unassigned',   sub: 'Auto-routing eligible',                         color: '#fb923c', bg: 'rgba(249,115,22,0.12)',  border: 'rgba(249,115,22,0.25)',  icon: <Users size={14} color="#fff" /> },
    ],
    qualifies: [
      "Service interval exceeded by 30+ days",
      "Customer has prior service history at dealership",
      "No active competing retention campaign",
      "Vehicle mileage within service band",
      "All required data fields are populated",
    ],
    hardGates: [
      'Consent verification passed',
      'Service eligibility confirmed',
      'No suppression rules active',
    ],
  },
}

// ── Creation modes ────────────────────────────────────────────────────────────
const MODES = [
  {
    id: 'template',
    icon: LayoutTemplate,
    iconColor: '#a78bfa',
    iconBg: 'linear-gradient(135deg,#6d28d9,#7c5cfc)',
    borderActive: 'rgba(124,92,252,0.7)',
    glowActive: 'rgba(124,92,252,0.25)',
    borderHover: 'rgba(124,92,252,0.4)',
    glowHover: 'rgba(124,92,252,0.12)',
    title: 'Start from a Template',
    description: 'Start with a proven strategy pre-configured with best practices. Customize to match your needs.',
  },
  {
    id: 'conversation',
    icon: MessageSquare,
    iconColor: '#2dd4bf',
    iconBg: 'linear-gradient(135deg,#0d9488,#0891b2)',
    borderActive: 'rgba(45,212,191,0.7)',
    glowActive: 'rgba(45,212,191,0.2)',
    borderHover: 'rgba(45,212,191,0.35)',
    glowHover: 'rgba(45,212,191,0.08)',
    title: 'Start with a Conversation',
    description: 'Conversational AI-guided setup without step-by-step forms. Natural configuration flow for faster creation.',
  },
  {
    id: 'scratch',
    icon: Plus,
    iconColor: '#60a5fa',
    iconBg: 'linear-gradient(135deg,#2563eb,#3b82f6)',
    borderActive: 'rgba(59,130,246,0.7)',
    glowActive: 'rgba(59,130,246,0.2)',
    borderHover: 'rgba(59,130,246,0.35)',
    glowHover: 'rgba(59,130,246,0.08)',
    title: 'Start from Scratch',
    description: 'Build a custom playbook tailored to your specific moment and objectives. Full control over every step.',
  },
]

// ── Mode card ─────────────────────────────────────────────────────────────────
function ModeCard({ mode, selected, onSelect }) {
  const [hovered, setHovered] = useState(false)
  const Icon = mode.icon
  const isActive  = selected === mode.id
  const isHovered = hovered && !isActive

  const borderColor = isActive ? mode.borderActive : isHovered ? mode.borderHover : 'rgba(255,255,255,0.09)'
  const boxShadow   = isActive
    ? `0 0 0 1px ${mode.borderActive}, 0 8px 32px ${mode.glowActive}`
    : isHovered
    ? `0 0 0 1px ${mode.borderHover}, 0 4px 20px ${mode.glowHover}`
    : 'none'

  return (
    <button
      className="flex-1 flex flex-col items-start gap-4 p-6 rounded-2xl text-left transition-all duration-200 cursor-pointer relative"
      style={{ background: isActive ? 'rgba(255,255,255,0.045)' : isHovered ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.02)', border: `1.5px solid ${borderColor}`, boxShadow, outline: 'none' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onSelect(mode.id)}>
      {isActive && (
        <div className="absolute top-3 right-3">
          <CheckCircle size={16} style={{ color: mode.iconColor }} />
        </div>
      )}
      <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200"
        style={{ background: isActive || isHovered ? mode.iconBg : 'rgba(255,255,255,0.06)', boxShadow: isActive ? `0 4px 16px ${mode.glowActive}` : 'none' }}>
        <Icon size={20} style={{ color: isActive || isHovered ? '#fff' : mode.iconColor }} strokeWidth={isActive ? 2.2 : 1.8} />
      </div>
      <div>
        <p className="text-sm font-bold mb-2 transition-colors duration-150" style={{ color: isActive ? '#fff' : 'var(--text-primary)' }}>{mode.title}</p>
        <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>{mode.description}</p>
      </div>
    </button>
  )
}

// ── Template card ─────────────────────────────────────────────────────────────
function TemplateCard({ tpl, selected, onSelect }) {
  const [hovered, setHovered] = useState(false)
  const isActive  = selected === tpl.id
  const isHovered = hovered && !isActive

  const borderColor = isActive
    ? 'rgba(59,130,246,0.7)'
    : isHovered
    ? 'rgba(59,130,246,0.35)'
    : 'rgba(255,255,255,0.08)'
  const boxShadow = isActive
    ? '0 0 0 1px rgba(59,130,246,0.5), 0 8px 28px rgba(59,130,246,0.18)'
    : isHovered
    ? '0 0 0 1px rgba(59,130,246,0.2), 0 4px 16px rgba(59,130,246,0.08)'
    : 'none'

  return (
    <button
      className="flex-1 flex flex-col gap-3 p-4 rounded-xl text-left transition-all duration-200 cursor-pointer relative"
      style={{ background: isActive ? 'rgba(59,130,246,0.07)' : isHovered ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.02)', border: `1.5px solid ${borderColor}`, boxShadow, outline: 'none' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onSelect(tpl.id)}>
      {isActive && (
        <div className="absolute top-3 right-3">
          <CheckCircle size={14} style={{ color: '#60a5fa' }} />
        </div>
      )}
      <div className="pr-5">
        <p className="text-sm font-bold mb-1" style={{ color: isActive ? '#fff' : 'var(--text-primary)' }}>{tpl.name}</p>
        <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>{tpl.description}</p>
      </div>
      <div className="flex items-center gap-2 mt-auto">
        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full"
          style={{ background: 'rgba(255,255,255,0.07)', color: 'var(--text-muted)', border: '1px solid rgba(255,255,255,0.1)' }}>
          {tpl.phases} phases
        </span>
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
          style={{ background: tpl.tagBg, color: tpl.tagColor, border: `1px solid ${tpl.tagBorder}` }}>
          {tpl.tag}
        </span>
      </div>
    </button>
  )
}

// ── Template → existing playbook ID map (for prototype navigation) ───────────
const TEMPLATE_PB_MAP = {
  'new-lead':          'PB-001',
  'no-show':           'PB-002',
  'service-retention': 'PB-003',
}

// ── Simulation preview slide-out ──────────────────────────────────────────────
function SimulationPreview({ templateId, onClose, onEditPlaybook }) {
  const tpl  = TEMPLATES.find(t => t.id === templateId)
  const data = SIM_DATA[templateId]
  if (!tpl || !data) return null

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-[800]" onClick={onClose} />

      {/* Panel */}
      <div className="fixed top-0 right-0 h-full z-[801] flex flex-col"
        style={{ width: 480, background: 'var(--slideout-bg)', borderLeft: '1px solid var(--slideout-border)', boxShadow: '-12px 0 48px rgba(0,0,0,0.5)' }}>

        {/* Header */}
        <div className="flex items-start justify-between px-5 py-4 shrink-0"
          style={{ borderBottom: '1px solid var(--slideout-border)' }}>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Simulation Preview</p>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(124,92,252,0.18)', color: '#a78bfa', border: '1px solid rgba(124,92,252,0.3)' }}>
                Preview Mode
              </span>
            </div>
            <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
              Example generated plan for: <strong style={{ color: 'var(--text-secondary)' }}>{tpl.name}</strong>
            </p>
          </div>
          <button className="btn-ghost p-1.5 rounded-lg shrink-0" onClick={onClose}><X size={14} /></button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">

          {/* Note banner */}
          <div className="flex items-start gap-2.5 px-3.5 py-3 rounded-xl"
            style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)' }}>
            <AlertTriangle size={13} style={{ color: '#fbbf24', marginTop: 1, flexShrink: 0 }} />
            <p className="text-[11px] leading-relaxed" style={{ color: '#fbbf24' }}>
              <strong>Note:</strong> This is an example preview based on representative data. Actual runtime behavior may vary based on real-time data, consent states, and NBA engine decisioning.
            </p>
          </div>

          {/* Scenario Input */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={13} style={{ color: '#a78bfa' }} />
              <p className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>Scenario Input</p>
            </div>
            <div className="space-y-2">
              {data.scenarioInputs.map((inp, i) => (
                <div key={i} className="flex items-start gap-3 px-3.5 py-3 rounded-xl"
                  style={{ background: inp.bg, border: `1px solid ${inp.border}` }}>
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                    style={{ background: 'rgba(255,255,255,0.1)' }}>
                    {inp.icon}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold mb-0.5" style={{ color: inp.color }}>{inp.label}</p>
                    <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{inp.title}</p>
                    {inp.sub && <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{inp.sub}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Why This Playbook Qualifies */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle size={13} style={{ color: '#4ade80' }} />
              <p className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>Why This Playbook Qualifies</p>
            </div>
            <div className="px-3.5 py-3 rounded-xl space-y-2"
              style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.2)' }}>
              {data.qualifies.map((q, i) => (
                <div key={i} className="flex items-start gap-2">
                  <CheckCircle size={12} style={{ color: '#4ade80', marginTop: 1, flexShrink: 0 }} />
                  <p className="text-[11px] leading-relaxed" style={{ color: 'rgba(74,222,128,0.85)' }}>{q}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Hard Gate Evaluation */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Shield size={13} style={{ color: '#60a5fa' }} />
              <p className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>Hard Gate Evaluation</p>
            </div>
            <div className="px-3.5 py-3 rounded-xl space-y-2.5"
              style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.2)' }}>
              <p className="text-[11px] font-medium mb-3" style={{ color: '#60a5fa' }}>
                All hard gates passed. Playbook is eligible for execution.
              </p>
              {data.hardGates.map((g, i) => (
                <div key={i} className="flex items-center gap-2">
                  <CheckCircle size={12} style={{ color: '#4ade80', flexShrink: 0 }} />
                  <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{g}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-4 shrink-0"
          style={{ borderTop: '1px solid var(--slideout-border)' }}>
          <button className="text-sm font-medium transition-colors hover:opacity-70"
            style={{ color: 'var(--text-muted)' }} onClick={onClose}>
            Close
          </button>
          <button onClick={onEditPlaybook}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:brightness-110"
            style={{ background: 'linear-gradient(135deg,#7c5cfc,#3b82f6)', color: '#fff', boxShadow: '0 2px 12px rgba(124,92,252,0.35)' }}>
            <Sparkles size={13} /> Edit Playbook
          </button>
        </div>
      </div>
    </>
  )
}

// ── Playbook summary accordion sections ───────────────────────────────────────
const SUMMARY_SECTIONS = [
  { id: 'basics',    icon: FileText,    label: 'Basics'             },
  { id: 'knowledge', icon: BookOpen,    label: 'Knowledge'          },
  { id: 'moment',    icon: Sparkles,    label: 'Moment'             },
  { id: 'gates',     icon: Shield,      label: 'Hard Gates'         },
  { id: 'objective', icon: Target,      label: 'Objective & Success'},
  { id: 'phases',    icon: Layers,      label: 'Phases & Actions'   },
  { id: 'trust',     icon: Zap,         label: 'Trust Controls'     },
  { id: 'tools',     icon: Wrench,      label: 'Tools & Actions'    },
  { id: 'exit',      icon: LogOut,      label: 'Exit Conditions'    },
]

const OPENING_MESSAGE = `Hi! I'll help you create your playbook step by step. This is a conversation, not a form — so just answer naturally.

To get started: **What do you want to call this playbook, and what's its main objective?**

For example: *"Onboarding for enterprise clients who purchased in the last month"*.`

const ASSISTANT_PLACEHOLDER = `Got it, processing your response... I'm updating the playbook draft on the left as we go. What would you like to define next?`

// ── Conversation Chat ─────────────────────────────────────────────────────────
function ConversationChat({ onClose }) {
  const [messages,    setMessages]    = useState([{ id: 0, role: 'assistant', text: OPENING_MESSAGE }])
  const [input,       setInput]       = useState('')
  const [expanded,    setExpanded]    = useState({})
  const [confirmed,   setConfirmed]   = useState({})
  const [sending,     setSending]     = useState(false)
  const [leftPx,      setLeftPx]      = useState(null)   // null = use 30% default until first drag
  const [dragging,    setDragging]    = useState(false)
  const bottomRef    = useRef(null)
  const inputRef     = useRef(null)
  const containerRef = useRef(null)

  // ── Drag logic ──
  const onDividerMouseDown = (e) => {
    e.preventDefault()
    setDragging(true)
    const startX     = e.clientX
    const startWidth = containerRef.current
      ? (leftPx ?? containerRef.current.offsetWidth * 0.30)
      : e.currentTarget.previousSibling?.offsetWidth ?? 300

    const onMove = (ev) => {
      const containerW = containerRef.current?.offsetWidth ?? window.innerWidth
      const min = 160
      const max = containerW * 0.60
      const newW = Math.min(max, Math.max(min, startWidth + (ev.clientX - startX)))
      setLeftPx(newW)
    }
    const onUp = () => {
      setDragging(false)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = () => {
    const text = input.trim()
    if (!text || sending) return
    const userMsg = { id: messages.length, role: 'user', text }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setSending(true)
    // Simulate assistant reply
    setTimeout(() => {
      setMessages(prev => [...prev, { id: prev.length, role: 'assistant', text: ASSISTANT_PLACEHOLDER }])
      // Mark basics as confirmed after first user reply
      if (!confirmed.basics) setConfirmed(p => ({ ...p, basics: true }))
      setSending(false)
      inputRef.current?.focus()
    }, 900)
  }

  const toggleSection = (id) => setExpanded(p => ({ ...p, [id]: !p[id] }))

  const hasAnyConfirmed = Object.keys(confirmed).length > 0

  return (
    <div ref={containerRef} className="flex h-full"
      style={{ animation: 'fadeIn 0.2s ease', userSelect: dragging ? 'none' : 'auto', cursor: dragging ? 'col-resize' : 'auto' }}>

      {/* ── Left panel: Live Playbook Summary ── */}
      <div className="flex flex-col shrink-0"
        style={{ width: leftPx ? `${leftPx}px` : '30%', background: 'var(--sidebar-bg)', minWidth: 160 }}>

        {/* Panel header */}
        <div className="px-5 pt-5 pb-4 shrink-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Live Playbook Summary</p>
          <p className="text-[11px] mt-0.5" style={{ color: '#a78bfa' }}>Updates as you configure</p>
        </div>

        {/* Accordion */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
          {SUMMARY_SECTIONS.map(sec => {
            const Icon = sec.icon
            const isOpen = !!expanded[sec.id]
            const isDone = !!confirmed[sec.id]
            return (
              <div key={sec.id} className="rounded-xl overflow-hidden transition-all"
                style={{ border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)' }}>
                <button
                  className="w-full flex items-center gap-2.5 px-3.5 py-3 text-left transition-all hover:bg-white/[0.03]"
                  onClick={() => toggleSection(sec.id)}>
                  {isDone
                    ? <CheckCircle size={13} style={{ color: '#4ade80', flexShrink: 0 }} />
                    : <Icon size={13} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />}
                  <span className="flex-1 text-xs font-semibold"
                    style={{ color: isDone ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                    {sec.label}
                  </span>
                  <ChevronDown size={12}
                    className="transition-transform shrink-0"
                    style={{ color: 'var(--text-muted)', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
                </button>
                {isOpen && (
                  <div className="px-4 pb-3 pt-1">
                    {isDone && sec.id === 'basics' ? (
                      <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                        Name and objective captured from conversation.
                      </p>
                    ) : (
                      <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.2)' }}>
                        Not yet defined
                      </p>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Save draft button */}
        <div className="px-4 py-4 shrink-0" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <button
            disabled={!hasAnyConfirmed}
            className="w-full py-2 rounded-xl text-xs font-semibold transition-all"
            style={{
              background: hasAnyConfirmed ? 'rgba(124,92,252,0.15)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${hasAnyConfirmed ? 'rgba(124,92,252,0.4)' : 'rgba(255,255,255,0.08)'}`,
              color: hasAnyConfirmed ? '#a78bfa' : 'var(--text-muted)',
              cursor: hasAnyConfirmed ? 'pointer' : 'not-allowed',
              opacity: hasAnyConfirmed ? 1 : 0.5,
            }}>
            Save draft
          </button>
        </div>
      </div>

      {/* ── Draggable divider ── */}
      <div
        onMouseDown={onDividerMouseDown}
        className="group shrink-0 flex items-center justify-center"
        style={{ width: 8, cursor: 'col-resize', background: 'transparent', position: 'relative', zIndex: 10 }}>
        {/* Visual track */}
        <div className="h-full transition-all duration-150"
          style={{ width: dragging ? 3 : 1, background: dragging ? 'rgba(124,92,252,0.7)' : 'rgba(255,255,255,0.07)' }} />
        {/* Drag handle pill */}
        <div className="absolute flex flex-col gap-0.5 items-center opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ top: '50%', transform: 'translateY(-50%)' }}>
          {[0,1,2,3].map(i => (
            <div key={i} className="w-0.5 h-1 rounded-full"
              style={{ background: dragging ? '#a78bfa' : 'rgba(255,255,255,0.35)' }} />
          ))}
        </div>
      </div>

      {/* ── Right panel: Chat ── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Chat header */}
        <div className="flex items-center justify-between px-6 py-4 shrink-0"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg,#0d9488,#7c5cfc)' }}>
              <Bot size={15} color="#fff" />
            </div>
            <div>
              <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Playbook Assistant</p>
              <p className="text-[10px]" style={{ color: '#2dd4bf' }}>● Online · Conversational setup</p>
            </div>
          </div>
          <button onClick={onClose}
            className="p-1.5 rounded-lg transition-all hover:brightness-110"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)', color: 'var(--text-muted)' }}>
            <X size={14} />
          </button>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {messages.map(msg => (
            <div key={msg.id} className={`flex items-end gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>

              {/* Avatar */}
              {msg.role === 'assistant' && (
                <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mb-0.5"
                  style={{ background: 'linear-gradient(135deg,#0d9488,#7c5cfc)' }}>
                  <Bot size={13} color="#fff" />
                </div>
              )}

              {/* Bubble */}
              <div className="max-w-[75%]">
                <div className="px-4 py-3 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap"
                  style={msg.role === 'assistant'
                    ? { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)', color: 'var(--text-secondary)', borderBottomLeftRadius: 6 }
                    : { background: 'linear-gradient(135deg,#7c5cfc,#3b82f6)', color: '#fff', borderBottomRightRadius: 6 }}>
                  {/* Render **bold** inline */}
                  {msg.text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).map((part, i) => {
                    if (part.startsWith('**') && part.endsWith('**'))
                      return <strong key={i}>{part.slice(2, -2)}</strong>
                    if (part.startsWith('*') && part.endsWith('*'))
                      return <em key={i} style={{ color: '#a78bfa' }}>{part.slice(1, -1)}</em>
                    return part
                  })}
                </div>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {sending && (
            <div className="flex items-end gap-2.5">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: 'linear-gradient(135deg,#0d9488,#7c5cfc)' }}>
                <Bot size={13} color="#fff" />
              </div>
              <div className="px-4 py-3 rounded-2xl flex items-center gap-1.5"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)', borderBottomLeftRadius: 6 }}>
                {[0,1,2].map(i => (
                  <span key={i} className="w-1.5 h-1.5 rounded-full"
                    style={{ background: '#a78bfa', animation: `bounce 1s infinite ${i * 0.15}s`, opacity: 0.7 }} />
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="px-6 py-4 shrink-0" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="flex items-end gap-3 px-4 py-3 rounded-2xl"
            style={{ background: 'var(--input-bg)', border: '1px solid rgba(124,92,252,0.3)' }}>
            <textarea
              ref={inputRef}
              rows={1}
              className="flex-1 bg-transparent text-xs outline-none resize-none leading-relaxed placeholder:text-text-muted"
              style={{ color: 'var(--text-secondary)', maxHeight: 120 }}
              placeholder="Type your response..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || sending}
              className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all"
              style={{
                background: input.trim() && !sending ? 'linear-gradient(135deg,#7c5cfc,#3b82f6)' : 'rgba(255,255,255,0.06)',
                boxShadow: input.trim() ? '0 2px 8px rgba(124,92,252,0.3)' : 'none',
                opacity: input.trim() && !sending ? 1 : 0.4,
              }}>
              <Send size={13} color="#fff" />
            </button>
          </div>
          <p className="text-[10px] text-center mt-2" style={{ color: 'rgba(255,255,255,0.2)' }}>
            Press Enter to send · Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function CreatePlaybook() {
  const navigate = useNavigate()
  const [mode,           setMode]           = useState(null)
  const [selectedTpl,    setSelectedTpl]    = useState(null)
  const [showSimPreview, setShowSimPreview] = useState(false)
  const [showChat,       setShowChat]       = useState(false)

  const handleModeSelect = (id) => {
    setMode(id)
    setSelectedTpl(null)
    setShowSimPreview(false)
    setShowChat(false)
  }

  const handleTplSelect = (id) => {
    setSelectedTpl(id)
    setShowSimPreview(true)
  }

  // Continue is enabled when: non-template mode selected, OR template mode + template selected
  const canContinue = mode && (mode !== 'template' || selectedTpl)

  return (
    <div className="flex flex-col h-full" style={{ background: 'var(--bg-base)' }}>

      {/* ── Header ── */}
      <div className="px-8 pt-6 pb-5 shrink-0"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center gap-1.5 mb-3 text-[11px]" style={{ color: 'var(--text-muted)' }}>
          <button onClick={() => navigate('/playbooks')} className="hover:opacity-80 transition-opacity">Playbooks</button>
          <ChevronRight size={11} />
          <span style={{ color: 'var(--text-secondary)' }}>Create</span>
        </div>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/playbooks')}
              className="p-1.5 rounded-lg transition-all hover:brightness-110 shrink-0"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)' }}>
              <ArrowLeft size={14} style={{ color: 'var(--text-muted)' }} />
            </button>
            <div>
              <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Create Playbook</h1>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Start a new adaptive strategy for NBA-driven 1:1 client plans</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:brightness-110"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)', color: 'var(--text-muted)' }}>
              <HelpCircle size={13} /> What You'll Define
            </button>
            <button onClick={() => navigate('/playbooks')}
              className="p-1.5 rounded-lg transition-all hover:brightness-110"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)', color: 'var(--text-muted)' }}>
              <X size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Body: Chat view ── */}
      {showChat && (
        <div className="flex-1 overflow-hidden" style={{ animation: 'fadeIn 0.25s ease' }}>
          <ConversationChat onClose={() => setShowChat(false)} />
        </div>
      )}

      {/* ── Body: Mode selection ── */}
      {!showChat && <div className="flex-1 overflow-y-auto flex flex-col items-center px-8 py-8 gap-6">

        {/* Mode cards */}
        <div className="flex gap-4 w-full" style={{ maxWidth: 960 }}>
          {MODES.map(m => (
            <ModeCard key={m.id} mode={m} selected={mode} onSelect={handleModeSelect} />
          ))}
        </div>

        {/* Start Building button — revealed when scratch mode selected */}
        {mode === 'scratch' && (
          <div className="w-full flex justify-center" style={{ maxWidth: 960 }}>
            <button
              onClick={() => navigate('/playbooks/create/scratch')}
              className="flex items-center gap-2.5 px-8 py-3 rounded-2xl text-sm font-bold transition-all hover:brightness-110"
              style={{
                background: 'linear-gradient(135deg,#2563eb,#7c5cfc)',
                color: '#fff',
                boxShadow: '0 4px 20px rgba(59,130,246,0.35)',
              }}>
              <Plus size={16} />
              Start Building
              <ChevronRight size={15} />
            </button>
          </div>
        )}

        {/* Start Conversation button — revealed when conversation mode selected */}
        {mode === 'conversation' && (
          <div className="w-full flex justify-center" style={{ maxWidth: 960 }}>
            <button
              onClick={() => setShowChat(true)}
              className="flex items-center gap-2.5 px-8 py-3 rounded-2xl text-sm font-bold transition-all hover:brightness-110"
              style={{
                background: 'linear-gradient(135deg,#0d9488,#7c5cfc)',
                color: '#fff',
                boxShadow: '0 4px 20px rgba(13,148,136,0.35)',
              }}>
              <MessageSquare size={16} />
              Start Conversation
              <ChevronRight size={15} />
            </button>
          </div>
        )}

        {/* Template picker — revealed when template mode selected */}
        {mode === 'template' && (
          <div className="w-full" style={{ maxWidth: 960 }}>
            <p className="text-sm font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Choose a Template</p>
            <div className="flex gap-4">
              {TEMPLATES.map(tpl => (
                <TemplateCard key={tpl.id} tpl={tpl} selected={selectedTpl} onSelect={handleTplSelect} />
              ))}
            </div>
          </div>
        )}

        {/* Governed Execution banner */}
        <div className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl"
          style={{ maxWidth: 960, background: 'rgba(13,148,136,0.08)', border: '1px solid rgba(13,148,136,0.3)' }}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: 'linear-gradient(135deg,#0d9488,#059669)' }}>
            <Shield size={16} color="#fff" />
          </div>
          <div>
            <p className="text-sm font-semibold mb-0.5" style={{ color: '#2dd4bf' }}>Governed Execution</p>
            <p className="text-xs" style={{ color: 'rgba(45,212,191,0.7)' }}>
              NBA may select and adapt within the strategy's guardrails
              <span className="mx-2" style={{ color: 'rgba(45,212,191,0.35)' }}>•</span>
              Real execution runs through governed orchestration policies
            </p>
          </div>
        </div>
      </div>}

      {/* ── Footer — hidden inside chat ── */}
      {!showChat && (
        <div className="flex items-center px-8 py-4 shrink-0"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <button onClick={() => navigate('/playbooks')}
            className="text-sm font-medium transition-colors hover:opacity-70"
            style={{ color: 'var(--text-muted)' }}>
            Cancel
          </button>
        </div>
      )}

      {/* Simulation preview slide-out */}
      {showSimPreview && selectedTpl && (
        <SimulationPreview
          templateId={selectedTpl}
          onClose={() => setShowSimPreview(false)}
          onEditPlaybook={() => {
            const tpl = TEMPLATES.find(t => t.id === selectedTpl)
            const pbId = TEMPLATE_PB_MAP[selectedTpl] || 'PB-001'
            navigate(`/playbooks/${pbId}`, { state: { copyName: `${tpl?.name} (Copy)` } })
          }}
        />
      )}
    </div>
  )
}
