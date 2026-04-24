import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate, useParams } from 'react-router-dom'
import { Sparkles, Settings, FileText, FileSearch, Package, LayoutGrid, TrendingUp, ChevronRight, Plus, Filter, MoreHorizontal, AlertTriangle, CheckCircle, Clock, X, Eye, RefreshCw, List, MessageSquare, Send, Target, User, MapPin, Lock, Zap, Users } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { sandboxDetail, claims, bundles, promotions, sourceDocs, claimSuggestions } from '../../../data/mock'
import { Badge, Chip, ThreeDot, SearchBar, SlideOut, TabBar, AllFiltersPanel, FilterSection, Modal, FormField, SegmentedControl, MetricCard } from '../../ui/index'
import ClaimSlideOut from './ClaimSlideOut'
import SourceSlideOut from './SourceSlideOut'
import PromotionSlideOut from './PromotionSlideOut'
import clsx from 'clsx'

// ── helpers ──────────────────────────────────────────────────────────────────
const statusMap = {
  promotable: { label: 'Promotable', variant: 'promotable' },
  promoted: { label: 'Promoted', variant: 'promoted' },
  conflict: { label: 'Conflict', variant: 'conflict' },
  review: { label: 'Review', variant: 'review' },
}
const riskColor = { Low: 'green', Medium: 'amber', High: 'red' }

// ── Shared data for Claim modals ─────────────────────────────────────────────
const CLAIM_DOCS = [
  'Q1_Enterprise_Contracts.pdf',
  'Master_Service_Agreement.pdf',
  'Addendum_2024_Q1.pdf',
  'Payment_Terms_Schedule.pdf',
  'GDPR_Data_Processing_Agreement.pdf',
  'Security_Policy_Framework.pdf',
]
const CLAIM_PEOPLE = [
  { name: 'Sarah Chen',      email: 'sarah.chen@company.com',      initials: 'SC', gradient: 'linear-gradient(135deg,#a78bfa,#60a5fa)' },
  { name: 'Michael Torres',  email: 'michael.torres@company.com',  initials: 'MT', gradient: 'linear-gradient(135deg,#f59e0b,#ef4444)' },
  { name: 'Emily Rodriguez', email: 'emily.rodriguez@company.com', initials: 'ER', gradient: 'linear-gradient(135deg,#4ade80,#22d3ee)' },
  { name: 'David Kim',       email: 'david.kim@company.com',       initials: 'DK', gradient: 'linear-gradient(135deg,#f87171,#fb923c)' },
  { name: 'Lisa Anderson',   email: 'lisa.anderson@company.com',   initials: 'LA', gradient: 'linear-gradient(135deg,#2dd4bf,#60a5fa)' },
]

function ClaimSectionHeader({ icon: Icon, label, color = '#a78bfa' }) {
  return (
    <div className="flex items-center gap-2 pb-1.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <Icon size={13} style={{ color }} />
      <p className="text-xs font-semibold text-text-secondary">{label}</p>
    </div>
  )
}

function ClaimEvidencePanel({ sourceType, setSourceType, selectedDocs, toggleDoc, sourcePerson, setSourcePerson, personOpen, setPersonOpen, evidenceNotes, setEvidenceNotes }) {
  return (
    <div className="space-y-3">
      <ClaimSectionHeader icon={FileSearch} label="Evidence & Source" color="#60a5fa" />
      <div className="flex gap-1 p-1 rounded-lg"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
        {['Document', 'Human'].map(opt => (
          <button key={opt}
            className="flex-1 py-1.5 rounded-md text-xs font-medium transition-all"
            style={sourceType === opt
              ? { background: 'rgba(96,165,250,0.18)', color: '#60a5fa', border: '1px solid rgba(96,165,250,0.35)' }
              : { color: 'var(--text-muted)' }}
            onClick={() => setSourceType(opt)}>
            {opt}
          </button>
        ))}
      </div>
      {sourceType === 'Document' && (
        <div className="space-y-2">
          <p className="text-[11px] text-text-muted">Select source documents</p>
          <div className="grid grid-cols-1 gap-1.5">
            {CLAIM_DOCS.map(f => {
              const checked = selectedDocs.includes(f)
              return (
                <label key={f}
                  className="flex items-center gap-2 p-2.5 rounded-lg cursor-pointer transition-all"
                  style={{ background: checked ? 'rgba(96,165,250,0.08)' : 'rgba(255,255,255,0.02)', border: `1px solid ${checked ? 'rgba(96,165,250,0.35)' : 'rgba(255,255,255,0.07)'}` }}>
                  <div className="w-3.5 h-3.5 rounded flex items-center justify-center shrink-0"
                    style={{ background: checked ? '#3b82f6' : 'transparent', border: checked ? '1px solid #3b82f6' : '1px solid rgba(255,255,255,0.2)' }}
                    onClick={() => toggleDoc(f)}>
                    {checked && <CheckCircle size={9} color="white" />}
                  </div>
                  <FileText size={11} style={{ color: '#f87171' }} className="shrink-0" />
                  <span className="text-xs text-text-secondary truncate">{f}</span>
                </label>
              )
            })}
          </div>
        </div>
      )}
      {sourceType === 'Human' && (
        <div className="space-y-1.5">
          <p className="text-[11px] text-text-muted">Select the person providing this evidence</p>
          <button
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs transition-all"
            style={{ background: 'var(--input-bg)', border: `1px solid ${personOpen ? 'rgba(96,165,250,0.5)' : 'var(--input-border)'}`, color: sourcePerson ? 'var(--text-primary)' : 'var(--text-muted)' }}
            onClick={() => setPersonOpen(o => !o)}>
            {sourcePerson ? (
              <span className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white shrink-0"
                  style={{ background: sourcePerson.gradient }}>{sourcePerson.initials}</span>
                <span className="font-medium text-text-primary">{sourcePerson.name}</span>
              </span>
            ) : <span>Select a person...</span>}
            <ChevronRight size={12} className={`transition-transform shrink-0 ${personOpen ? 'rotate-90' : ''}`} style={{ color: 'var(--text-muted)' }} />
          </button>
          {personOpen && (
            <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(96,165,250,0.25)', background: '#131825' }}>
              {CLAIM_PEOPLE.map((p, i) => (
                <button key={p.email}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left transition-all hover:bg-white/[0.04]"
                  style={{ background: sourcePerson?.email === p.email ? 'rgba(96,165,250,0.15)' : 'transparent', borderTop: i > 0 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}
                  onClick={() => { setSourcePerson(p); setPersonOpen(false) }}>
                  <span className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                    style={{ background: p.gradient }}>{p.initials}</span>
                  <span className="text-xs font-semibold text-text-primary">{p.name}</span>
                  <span className="text-xs text-text-muted ml-1">{p.email}</span>
                  {sourcePerson?.email === p.email && <CheckCircle size={12} className="ml-auto shrink-0" style={{ color: '#60a5fa' }} />}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
      <div className="space-y-1">
        <label className="text-[11px] text-text-muted">Evidence notes <span className="opacity-60">(optional)</span></label>
        <textarea className="input-base resize-none text-xs" rows={2}
          placeholder="Reference specific sections, page numbers, or quotes..."
          value={evidenceNotes} onChange={e => setEvidenceNotes(e.target.value)} />
      </div>
    </div>
  )
}

// ── Suggest a Change Modal (Homologated) ──────────────────────────────────────
function SuggestSuccessView({ claim, onClose }) {
  const suggId = `SUG-${String(Date.now()).slice(-4)}`
  return (
    <div className="flex flex-col items-center justify-center py-12 px-8 text-center gap-5">
      <div className="w-14 h-14 rounded-full flex items-center justify-center"
        style={{ background: 'rgba(167,139,250,0.15)', border: '2px solid rgba(167,139,250,0.4)' }}>
        <CheckCircle size={28} style={{ color: '#a78bfa' }} />
      </div>
      <div>
        <p className="text-lg font-bold text-text-primary mb-1">Suggestion Submitted</p>
        <p className="text-sm text-text-muted max-w-xs leading-relaxed">
          Your suggestion has been added to the review queue. The claim remains unchanged until a reviewer accepts it.
        </p>
      </div>
      <div className="w-full rounded-xl p-4 text-left"
        style={{ background: 'rgba(124,92,252,0.08)', border: '1px solid rgba(124,92,252,0.3)' }}>
        <div className="flex items-center gap-2 mb-2.5">
          <span className="text-[10px] font-mono text-text-muted">{suggId}</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full font-medium"
            style={{ background: 'rgba(245,158,11,0.15)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.3)' }}>
            Pending Review
          </span>
        </div>
        <p className="text-xs text-text-muted mb-1">
          Linked to: <span className="font-medium text-text-secondary">{claim.id} — {claim.title}</span>
        </p>
        <p className="text-xs text-text-muted">
          Submitted by: <span className="font-medium text-text-secondary">Alex Rivera</span>
        </p>
      </div>
      <div className="flex items-start gap-2 w-full rounded-lg p-3 text-left"
        style={{ background: 'rgba(59,130,246,0.07)', border: '1px solid rgba(59,130,246,0.2)' }}>
        <AlertTriangle size={13} style={{ color: '#60a5fa' }} className="shrink-0 mt-0.5" />
        <p className="text-[11px] text-text-muted leading-relaxed">
          The claim is <strong className="text-text-secondary">unchanged</strong>. A reviewer must accept this suggestion through the review queue before it takes effect.
        </p>
      </div>
      <button className="btn-secondary w-full justify-center" onClick={onClose}>Close</button>
    </div>
  )
}

function SuggestChangeModal({ claim, onClose }) {
  // Left column
  const [title,         setTitle]         = useState(claim?.title || '')
  const [claimText,     setClaimText]     = useState(claim?.text?.replace(/"/g, '') || '')
  const [rationale,     setRationale]     = useState('')
  const [sourceType,    setSourceType]    = useState('Document')
  const [selectedDocs,  setSelectedDocs]  = useState([])
  const [sourcePerson,  setSourcePerson]  = useState(null)
  const [personOpen,    setPersonOpen]    = useState(false)
  const [evidenceNotes, setEvidenceNotes] = useState('')
  // Right column
  const [confidence,    setConfidence]    = useState(String(claim?.confidence ?? '90'))
  const [risk,          setRisk]          = useState(claim?.risk ?? 'Low')
  const [polarity,      setPolarity]      = useState(claim?.polarity ?? '+')
  const [doc,           setDoc]           = useState(claim?.doc || '')
  const [section,       setSection]       = useState(claim?.section || '')
  const [subsection,    setSubsection]    = useState(claim?.subsection || '')
  const [urgency,       setUrgency]       = useState('medium')
  const [approvalMode,  setApprovalMode]  = useState('peer')
  const [submitted,     setSubmitted]     = useState(false)

  const toggleDoc = f => setSelectedDocs(p => p.includes(f) ? p.filter(x => x !== f) : [...p, f])

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}>
      <div className="w-full rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        style={{ maxWidth: 880, maxHeight: '92vh', background: 'var(--modal-bg)', border: '1px solid rgba(124,92,252,0.35)' }}
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-4 shrink-0"
          style={{ borderBottom: '1px solid var(--slideout-border)' }}>
          <div className="p-2 rounded-xl shrink-0"
            style={{ background: 'rgba(124,92,252,0.12)', border: '1px solid rgba(124,92,252,0.28)' }}>
            <MessageSquare size={15} style={{ color: '#a78bfa' }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-mono text-text-muted mb-0.5">{claim?.id} · Suggestion</p>
            <p className="text-sm font-semibold text-text-primary">Suggest a Change</p>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded mr-1"
            style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)', border: '1px solid rgba(255,255,255,0.1)' }}>
            {claim?.doc?.split('_')[0] || 'Claim'}
          </span>
          <button className="btn-ghost p-1.5 rounded-lg shrink-0" onClick={onClose}><X size={14} /></button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {submitted ? <SuggestSuccessView claim={claim} onClose={onClose} /> : (
            <div className="grid grid-cols-2">

              {/* ════ LEFT ════ */}
              <div className="p-6 space-y-6" style={{ borderRight: '1px solid rgba(255,255,255,0.06)' }}>

                {/* Basic Information */}
                <div className="space-y-3">
                  <ClaimSectionHeader icon={FileText} label="Basic Information" color="#60a5fa" />
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-text-secondary">Claim Title</label>
                    <input className="input-base text-xs" placeholder="Claim title..."
                      value={title} onChange={e => setTitle(e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-text-secondary flex items-center gap-1">
                      Claim Statement <span style={{ color: '#f87171' }}>*</span>
                    </label>
                    <textarea className="input-base resize-none text-xs leading-relaxed" rows={5}
                      placeholder="Enter the proposed claim statement..."
                      value={claimText} onChange={e => setClaimText(e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-text-secondary">
                      Rationale <span className="text-text-muted font-normal">(why this change)</span>
                    </label>
                    <textarea className="input-base resize-none text-xs leading-relaxed" rows={3}
                      placeholder="Explain the reason for this suggestion..."
                      value={rationale} onChange={e => setRationale(e.target.value)} />
                  </div>
                </div>

                <ClaimEvidencePanel
                  sourceType={sourceType} setSourceType={setSourceType}
                  selectedDocs={selectedDocs} toggleDoc={toggleDoc}
                  sourcePerson={sourcePerson} setSourcePerson={setSourcePerson}
                  personOpen={personOpen} setPersonOpen={setPersonOpen}
                  evidenceNotes={evidenceNotes} setEvidenceNotes={setEvidenceNotes} />
              </div>

              {/* ════ RIGHT ════ */}
              <div className="p-6 space-y-6">

                {/* Governance Signals */}
                <div className="space-y-3">
                  <ClaimSectionHeader icon={TrendingUp} label="Governance Signals" color="#60a5fa" />
                  <div className="grid grid-cols-3 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] text-text-muted">Confidence (%)</label>
                      <input className="input-base text-xs py-1.5 px-2" type="number" min="0" max="100"
                        value={confidence} onChange={e => setConfidence(e.target.value)} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-text-muted">Risk Level</label>
                      <select className="input-base text-xs py-1.5 px-2" value={risk} onChange={e => setRisk(e.target.value)}>
                        <option>Low</option><option>Medium</option><option>High</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-text-muted">Polarity</label>
                      <select className="input-base text-xs py-1.5 px-2" value={polarity} onChange={e => setPolarity(e.target.value)}>
                        <option value="+">Positive</option>
                        <option value="−">Negative</option>
                        <option value="·">Neutral</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-text-muted">Confidence preview</span>
                      <span className="font-semibold"
                        style={{ color: Number(confidence) >= 90 ? '#4ade80' : Number(confidence) >= 70 ? '#fbbf24' : '#f87171' }}>
                        {confidence}%
                      </span>
                    </div>
                    <div className="rounded-full overflow-hidden" style={{ height: 5, background: 'rgba(255,255,255,0.06)' }}>
                      <div className="h-full rounded-full transition-all" style={{
                        width: `${Math.min(100, Math.max(0, Number(confidence)))}%`,
                        background: Number(confidence) >= 90 ? 'linear-gradient(90deg,#22c55e,#4ade80)' : Number(confidence) >= 70 ? 'linear-gradient(90deg,#f59e0b,#fbbf24)' : 'linear-gradient(90deg,#ef4444,#f87171)',
                      }} />
                    </div>
                  </div>
                </div>

                {/* Source Info */}
                <div className="space-y-3">
                  <ClaimSectionHeader icon={MapPin} label="Source Info" color="#a78bfa" />
                  <div className="space-y-1">
                    <label className="text-[10px] text-text-muted">Document</label>
                    <input className="input-base text-xs" placeholder="Document name..."
                      value={doc} onChange={e => setDoc(e.target.value)} />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] text-text-muted">Section</label>
                      <input className="input-base text-xs" placeholder="Section..."
                        value={section} onChange={e => setSection(e.target.value)} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-text-muted">Subsection</label>
                      <input className="input-base text-xs" placeholder="Subsection..."
                        value={subsection} onChange={e => setSubsection(e.target.value)} />
                    </div>
                  </div>
                </div>

                {/* Urgency & Approval */}
                <div className="space-y-3">
                  <ClaimSectionHeader icon={Lock} label="Urgency & Approval" color="#fbbf24" />
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-text-muted">Urgency</label>
                    <div className="flex gap-1.5">
                      {[
                        { value: 'low',    label: 'Low',    color: '#60a5fa', border: 'rgba(59,130,246,0.4)',  bg: 'rgba(59,130,246,0.15)'  },
                        { value: 'medium', label: 'Normal', color: '#fbbf24', border: 'rgba(245,158,11,0.5)',  bg: 'rgba(245,158,11,0.15)'  },
                        { value: 'high',   label: 'Urgent', color: '#f87171', border: 'rgba(239,68,68,0.45)',  bg: 'rgba(239,68,68,0.15)'   },
                      ].map(u => (
                        <button key={u.value}
                          className="flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all"
                          style={urgency === u.value
                            ? { background: u.bg, border: `1px solid ${u.border}`, color: u.color }
                            : { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', color: '#64748b' }}
                          onClick={() => setUrgency(u.value)}>
                          {u.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    {/* Automatic */}
                    <button
                      className="w-full flex items-start gap-3 p-3 rounded-xl text-left transition-all"
                      style={{ background: approvalMode === 'self' ? 'rgba(45,212,191,0.08)' : 'rgba(255,255,255,0.02)', border: `1px solid ${approvalMode === 'self' ? 'rgba(45,212,191,0.35)' : 'rgba(255,255,255,0.08)'}` }}
                      onClick={() => setApprovalMode('self')}>
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                        style={{ background: approvalMode === 'self' ? 'rgba(45,212,191,0.15)' : 'rgba(255,255,255,0.04)' }}>
                        <Zap size={14} style={{ color: approvalMode === 'self' ? '#2dd4bf' : '#475569' }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="text-xs font-semibold text-text-primary">Automatic</p>
                          {approvalMode === 'self' && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                              style={{ background: 'rgba(45,212,191,0.15)', color: '#2dd4bf', border: '1px solid rgba(45,212,191,0.3)' }}>⚡ Auto-applied</span>
                          )}
                        </div>
                        <p className="text-[11px] text-text-muted leading-snug">
                          Suggestion is applied immediately without review.
                        </p>
                      </div>
                      <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-1"
                        style={{ background: approvalMode === 'self' ? '#2dd4bf' : 'transparent', border: `2px solid ${approvalMode === 'self' ? '#2dd4bf' : 'rgba(255,255,255,0.2)'}` }}>
                        {approvalMode === 'self' && <div className="w-1.5 h-1.5 rounded-full bg-[#131825]" />}
                      </div>
                    </button>
                    {/* Manual */}
                    <button
                      className="w-full flex items-start gap-3 p-3 rounded-xl text-left transition-all"
                      style={{ background: approvalMode === 'peer' ? 'rgba(167,139,250,0.08)' : 'rgba(255,255,255,0.02)', border: `1px solid ${approvalMode === 'peer' ? 'rgba(167,139,250,0.35)' : 'rgba(255,255,255,0.08)'}` }}
                      onClick={() => setApprovalMode('peer')}>
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                        style={{ background: approvalMode === 'peer' ? 'rgba(167,139,250,0.15)' : 'rgba(255,255,255,0.04)' }}>
                        <Users size={14} style={{ color: approvalMode === 'peer' ? '#a78bfa' : '#475569' }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="text-xs font-semibold text-text-primary">Manual</p>
                          {approvalMode === 'peer' && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                              style={{ background: 'rgba(167,139,250,0.15)', color: '#a78bfa', border: '1px solid rgba(167,139,250,0.3)' }}>Review queue</span>
                          )}
                        </div>
                        <p className="text-[11px] text-text-muted leading-snug">
                          Requires review and sign-off before the claim is updated.
                        </p>
                      </div>
                      <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-1"
                        style={{ background: approvalMode === 'peer' ? '#a78bfa' : 'transparent', border: `2px solid ${approvalMode === 'peer' ? '#a78bfa' : 'rgba(255,255,255,0.2)'}` }}>
                        {approvalMode === 'peer' && <div className="w-1.5 h-1.5 rounded-full bg-[#131825]" />}
                      </div>
                    </button>
                  </div>
                  {approvalMode === 'peer' && (
                    <div className="rounded-xl p-3.5"
                      style={{ background: 'rgba(124,92,252,0.05)', border: '1px solid rgba(124,92,252,0.18)' }}>
                      <p className="text-[11px] text-text-muted leading-relaxed">
                        Suggestion will enter the review queue and require sign-off before the claim is updated.
                      </p>
                      <div className="flex items-center gap-1 pt-3">
                        {['Suggest', 'Review', 'Applied'].map((step, i, arr) => (
                          <React.Fragment key={step}>
                            <div className="flex flex-col items-center gap-0.5">
                              <div className="w-5 h-5 rounded-full flex items-center justify-center"
                                style={{ background: i === arr.length - 1 ? 'rgba(34,197,94,0.15)' : 'rgba(167,139,250,0.12)', border: `1px solid ${i === arr.length - 1 ? 'rgba(34,197,94,0.4)' : 'rgba(167,139,250,0.3)'}` }}>
                                {i === arr.length - 1
                                  ? <CheckCircle size={9} style={{ color: '#4ade80' }} />
                                  : <span className="text-[8px] font-bold" style={{ color: '#a78bfa' }}>{i + 1}</span>}
                              </div>
                              <p className="text-[8px] text-text-muted text-center leading-tight max-w-[44px]">{step}</p>
                            </div>
                            {i < arr.length - 1 && <ChevronRight size={9} className="text-text-muted opacity-25 shrink-0 mb-3" />}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {!submitted && (
          <div className="flex items-center justify-between px-6 py-4 shrink-0"
            style={{ borderTop: '1px solid var(--slideout-border)' }}>
            <p className="text-[11px] text-text-muted">
              {approvalMode === 'self' ? 'Suggestion will be applied immediately upon submission.' : 'Suggestion will enter the review queue pending sign-off.'}
            </p>
            <div className="flex items-center gap-2.5">
              <button className="btn-secondary text-xs py-1.5 px-4" onClick={onClose}>Cancel</button>
              <button
                className="flex items-center gap-1.5 text-xs font-semibold py-1.5 px-5 rounded-lg transition-all hover:brightness-110"
                style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)', color: '#fff', boxShadow: '0 2px 12px rgba(124,92,252,0.35)' }}
                onClick={() => setSubmitted(true)}>
                <Send size={12} /> Send Suggestion
              </button>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  )
}

// ── View Suggestion Modal ─────────────────────────────────────────────────────
function ViewSuggestionModal({ claim, suggestion, onClose }) {
  const [declining, setDeclining] = useState(false)
  const [declineReason, setDeclineReason] = useState('')

  const polarityLabel = { '+': 'Positive', '−': 'Negative', '·': 'Neutral' }
  const polarityColor = { '+': '#4ade80', '−': '#f87171', '·': '#94a3b8' }
  const riskColorMap  = { Low: '#4ade80', Medium: '#fbbf24', High: '#f87171' }

  // Read-only metric chip
  const MetricChip = ({ label, value, color }) => (
    <div className="rounded-lg p-2.5 text-center"
      style={{ background: `${color}10`, border: `1px solid ${color}28` }}>
      <p className="text-[9px] text-text-muted mb-0.5">{label}</p>
      <p className="text-xs font-bold" style={{ color }}>{value}</p>
    </div>
  )

  // Read-only text block
  const ReadBlock = ({ label, value, optional }) => (
    <div className="space-y-1.5">
      <p className="text-xs font-medium text-text-secondary flex items-center gap-1">
        {label}
        {optional && <span className="text-[10px] text-text-muted font-normal">optional</span>}
      </p>
      <div className="rounded-lg px-3 py-2.5 text-xs text-text-secondary leading-relaxed"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
        {value || <span className="italic text-text-muted">No value provided</span>}
      </div>
    </div>
  )

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}>
      <div className="w-full rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        style={{ maxWidth: 780, maxHeight: '88vh', background: 'var(--modal-bg)', border: '1px solid var(--modal-border)' }}
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-4 shrink-0"
          style={{ borderBottom: '1px solid var(--slideout-border)' }}>
          <div className="p-2 rounded-xl shrink-0"
            style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.25)' }}>
            <Eye size={16} style={{ color: '#fbbf24' }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-text-primary">View Suggestion</p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold text-white shrink-0"
                style={{ background: suggestion.avatarGradient }}>{suggestion.initials}</span>
              <p className="text-xs text-text-muted">Suggested by <span className="text-text-secondary font-medium">{suggestion.author}</span> · {suggestion.time}</p>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded mr-1"
            style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)', border: '1px solid rgba(255,255,255,0.1)' }}>
            {claim.id}
          </span>
          <button className="btn-ghost p-1.5 rounded-lg" onClick={onClose}><X size={14} /></button>
        </div>

        {/* Body — aligned row pairs */}
        <div className="flex-1 overflow-y-auto">

          {/* ── Rationale — full width, above column labels ── */}
          <div className="px-6 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(245,158,11,0.03)' }}>
            <p className="text-xs font-medium text-text-secondary mb-2">Rationale</p>
            <div className="rounded-lg px-3 py-2.5 text-xs text-text-secondary leading-relaxed"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              {suggestion.rationale}
            </div>
          </div>

          {/* ── Column labels ── */}
          <div className="grid grid-cols-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="px-6 py-3" style={{ borderRight: '1px solid rgba(255,255,255,0.06)' }}>
              <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#a78bfa' }}>Current Claim</p>
            </div>
            <div className="px-6 py-3">
              <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#fbbf24' }}>Suggested Change</p>
            </div>
          </div>

          {/* ── Row 1: Claim vs Suggested Claim ── */}
          <div className="grid grid-cols-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            {/* Left — current */}
            <div className="p-5 space-y-2" style={{ borderRight: '1px solid rgba(255,255,255,0.06)' }}>
              <p className="text-[10px] text-text-muted font-medium uppercase tracking-wide">Claim</p>
              <p className="text-[10px] text-text-muted mb-0.5">Title: <span className="text-text-secondary font-medium">{claim.title}</span></p>
              <div className="rounded-xl p-3.5" style={{ background: 'rgba(124,92,252,0.08)', border: '1px solid rgba(124,92,252,0.2)' }}>
                <div className="flex items-center gap-1.5 mb-1.5">
                  <div className="w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0" style={{ background: '#7c5cfc' }}>
                    <span className="text-[7px] text-white font-bold">C</span>
                  </div>
                  <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: '#a78bfa' }}>Current</p>
                </div>
                <p className="text-xs text-text-primary leading-relaxed">{claim.text?.replace(/"/g, '')}</p>
              </div>
            </div>
            {/* Right — suggested */}
            <div className="p-5 space-y-2">
              <p className="text-[10px] text-text-muted font-medium uppercase tracking-wide">Suggested Text</p>
              <div className="rounded-xl p-3.5" style={{ background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.2)' }}>
                <div className="flex items-center gap-1.5 mb-1.5">
                  <div className="w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0" style={{ background: '#d97706' }}>
                    <span className="text-[7px] text-white font-bold">S</span>
                  </div>
                  <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: '#fbbf24' }}>Suggested</p>
                </div>
                <p className="text-xs text-text-primary leading-relaxed">{suggestion.suggestedText?.replace(/"/g, '')}</p>
              </div>
            </div>
          </div>

          {/* ── Row 1b: Context vs Suggested Context ── */}
          <div className="grid grid-cols-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="p-5 space-y-2" style={{ borderRight: '1px solid rgba(255,255,255,0.06)' }}>
              <p className="text-[10px] text-text-muted font-medium uppercase tracking-wide">Context</p>
              <div className="rounded-lg px-3 py-2.5 text-xs text-text-secondary leading-relaxed"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                {claim.context || <span className="italic text-text-muted">No context available</span>}
              </div>
            </div>
            <div className="p-5 space-y-2">
              <p className="text-[10px] text-text-muted font-medium uppercase tracking-wide">Suggested Context</p>
              {suggestion.suggestedContext ? (
                <div className="rounded-lg px-3 py-2.5 text-xs text-text-secondary leading-relaxed"
                  style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.18)' }}>
                  {suggestion.suggestedContext}
                </div>
              ) : (
                <div className="rounded-lg px-3 py-2.5 flex items-center gap-2"
                  style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.1)' }}>
                  <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.3)' }}>Same Context</span>
                  <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.2)' }}>— No context change suggested</span>
                </div>
              )}
            </div>
          </div>

          {/* ── Row 2: Metrics vs Suggested Metrics ── */}
          <div className="grid grid-cols-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="p-5 space-y-2.5" style={{ borderRight: '1px solid rgba(255,255,255,0.06)' }}>
              <p className="text-[10px] text-text-muted font-medium uppercase tracking-wide">Metrics</p>
              <div className="grid grid-cols-3 gap-2">
                <MetricChip label="Confidence" value={`${claim.confidence}%`} color="#4ade80" />
                <MetricChip label="Risk"       value={claim.risk}            color={riskColorMap[claim.risk] || '#94a3b8'} />
                <MetricChip label="Polarity"   value={polarityLabel[claim.polarity] || 'Neutral'} color={polarityColor[claim.polarity] || '#94a3b8'} />
              </div>
            </div>
            <div className="p-5 space-y-2.5">
              <p className="text-[10px] text-text-muted font-medium uppercase tracking-wide">Suggested Metrics</p>
              <div className="grid grid-cols-3 gap-2">
                <MetricChip label="Confidence" value={`${suggestion.confidence}%`} color="#4ade80" />
                <MetricChip label="Risk"       value={suggestion.risk}            color={riskColorMap[suggestion.risk] || '#94a3b8'} />
                <MetricChip label="Polarity"   value={polarityLabel[suggestion.polarity] || 'Neutral'} color={polarityColor[suggestion.polarity] || '#94a3b8'} />
              </div>
            </div>
          </div>

          {/* ── Row 3: Source vs Suggested Source + Sent By ── */}
          <div className="grid grid-cols-2" style={{ borderBottom: suggestion.notes ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
            {/* Left — current source(s) */}
            <div className="p-5 space-y-2" style={{ borderRight: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="flex items-center gap-2">
                <p className="text-[10px] text-text-muted font-medium uppercase tracking-wide">Sources</p>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                  style={{ background: 'rgba(96,165,250,0.12)', color: '#60a5fa', border: '1px solid rgba(96,165,250,0.2)' }}>
                  {(claim.sources ?? [{ doc: claim.doc, section: claim.section, subsection: claim.subsection, time: claim.time }]).length}
                </span>
              </div>
              <div className="space-y-1.5">
                {(claim.sources ?? [{ doc: claim.doc, section: claim.section, subsection: claim.subsection, time: claim.time }]).map((src, i) => (
                  <div key={i} className="rounded-lg p-3 space-y-1"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                    <div className="flex items-center gap-2">
                      <FileText size={11} style={{ color: '#60a5fa' }} className="shrink-0" />
                      <p className="text-[11px] text-text-secondary font-medium truncate">{src.doc}</p>
                    </div>
                    <p className="text-[11px] text-text-muted pl-4">§ {src.section} · {src.subsection}</p>
                    <p className="text-[11px] text-text-muted pl-4">🕐 {src.time}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — suggested source + sent by */}
            <div className="p-5 space-y-3">
              {/* Suggested source */}
              <div className="space-y-2">
                <p className="text-[10px] text-text-muted font-medium uppercase tracking-wide">Source</p>
                {suggestion.suggestedSource ? (
                  <div className="rounded-lg p-3 space-y-1.5"
                    style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.18)' }}>
                    <div className="flex items-center gap-2">
                      <FileText size={11} style={{ color: '#fbbf24' }} />
                      <p className="text-[11px]" style={{ color: '#fbbf24' }}>{suggestion.suggestedSource}</p>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-lg p-3 flex items-center gap-2.5"
                    style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.1)' }}>
                    <FileText size={13} style={{ color: 'rgba(255,255,255,0.2)' }} className="shrink-0" />
                    <div>
                      <p className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.3)' }}>Same Source</p>
                      <p className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.2)' }}>No source change suggested</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Sent by */}
              <div className="space-y-2">
                <p className="text-[10px] text-text-muted font-medium uppercase tracking-wide">Sent By</p>
                <div className="rounded-lg p-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0"
                      style={{ background: suggestion.avatarGradient }}>
                      {suggestion.initials}
                    </span>
                    <div>
                      <p className="text-xs font-semibold text-text-primary">{suggestion.author}</p>
                      <p className="text-[10px] text-text-muted mt-0.5">🕐 {suggestion.time}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Row 4: Notes — full width (only if present) ── */}
          {suggestion.notes && (
            <div className="px-6 py-4">
              <p className="text-xs font-medium text-text-secondary mb-2">
                Additional Notes
                <span className="text-[10px] text-text-muted font-normal ml-1.5">optional</span>
              </p>
              <div className="rounded-lg px-3 py-2.5 text-xs text-text-secondary leading-relaxed"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                {suggestion.notes}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 shrink-0" style={{ borderTop: '1px solid var(--slideout-border)' }}>
          {declining ? (
            /* Decline reason step */
            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium flex items-center gap-1.5" style={{ color: '#fbbf24' }}>
                  Want to give a reason why?
                  <span className="text-[10px] text-text-muted font-normal">optional</span>
                </label>
                <textarea
                  className="input-base resize-none text-xs leading-relaxed w-full"
                  rows={2}
                  placeholder="Let the author know why their suggestion was declined..."
                  value={declineReason}
                  onChange={e => setDeclineReason(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="flex items-center justify-end gap-2.5">
                <button className="btn-secondary text-xs py-1.5 px-4" onClick={() => setDeclining(false)}>
                  Cancel
                </button>
                <button
                  className="flex items-center gap-1.5 text-xs font-semibold py-1.5 px-4 rounded-lg transition-all"
                  style={{ background: 'rgba(239,68,68,0.15)', color: '#f87171', border: '1px solid rgba(239,68,68,0.3)' }}
                  onClick={onClose}>
                  <X size={12} /> Confirm Decline
                </button>
              </div>
            </div>
          ) : (
            /* Default footer */
            <div className="flex items-center justify-between">
              <p className="text-[11px] text-text-muted">Review the suggested changes before accepting or declining.</p>
              <div className="flex items-center gap-2.5">
                <button
                  className="flex items-center gap-1.5 text-xs font-semibold py-1.5 px-4 rounded-lg transition-all"
                  style={{ background: 'rgba(239,68,68,0.12)', color: '#f87171', border: '1px solid rgba(239,68,68,0.25)' }}
                  onClick={() => setDeclining(true)}>
                  <X size={12} /> Decline
                </button>
                <button
                  className="flex items-center gap-1.5 text-xs font-semibold py-1.5 px-4 rounded-lg transition-all"
                  style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)', color: '#fff', boxShadow: '0 2px 12px rgba(34,197,94,0.3)' }}
                  onClick={onClose}>
                  <CheckCircle size={12} /> Accept
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  )
}

// ── Edit Claim Modal ──────────────────────────────────────────────────────────
function EditClaimModal({ claim, onClose }) {
  // Left column
  const [title,         setTitle]         = useState(claim?.title || '')
  const [claimText,     setClaimText]     = useState(claim?.text?.replace(/"/g, '') || '')
  const [context,       setContext]       = useState(claim?.context || '')
  const [sourceType,    setSourceType]    = useState('Document')
  const [selectedDocs,  setSelectedDocs]  = useState([])
  const [sourcePerson,  setSourcePerson]  = useState(null)
  const [personOpen,    setPersonOpen]    = useState(false)
  const [evidenceNotes, setEvidenceNotes] = useState('')
  // Right column
  const [confidence,    setConfidence]    = useState(String(claim?.confidence ?? '90'))
  const [risk,          setRisk]          = useState(claim?.risk ?? 'Low')
  const [polarity,      setPolarity]      = useState(claim?.polarity ?? '+')
  const [doc,           setDoc]           = useState(claim?.doc || '')
  const [section,       setSection]       = useState(claim?.section || '')
  const [subsection,    setSubsection]    = useState(claim?.subsection || '')

  const toggleDoc = f => setSelectedDocs(p => p.includes(f) ? p.filter(x => x !== f) : [...p, f])

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}>
      <div className="w-full rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        style={{ maxWidth: 880, maxHeight: '92vh', background: 'var(--modal-bg)', border: '1px solid rgba(96,165,250,0.35)' }}
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-4 shrink-0"
          style={{ borderBottom: '1px solid var(--slideout-border)' }}>
          <div className="p-2 rounded-xl shrink-0"
            style={{ background: 'rgba(96,165,250,0.12)', border: '1px solid rgba(96,165,250,0.28)' }}>
            <Settings size={15} style={{ color: '#60a5fa' }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-mono text-text-muted mb-0.5">{claim?.id} · Edit</p>
            <p className="text-sm font-semibold text-text-primary">Edit Claim</p>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded mr-1"
            style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)', border: '1px solid rgba(255,255,255,0.1)' }}>
            {claim?.doc?.split('_')[0] || 'Claim'}
          </span>
          <button className="btn-ghost p-1.5 rounded-lg shrink-0" onClick={onClose}><X size={14} /></button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-2">

            {/* ════ LEFT ════ */}
            <div className="p-6 space-y-6" style={{ borderRight: '1px solid rgba(255,255,255,0.06)' }}>

              {/* Basic Information */}
              <div className="space-y-3">
                <ClaimSectionHeader icon={FileText} label="Basic Information" color="#60a5fa" />
                <div className="space-y-1">
                  <label className="text-xs font-medium text-text-secondary">Claim Title</label>
                  <input className="input-base text-xs" placeholder="Claim title..."
                    value={title} onChange={e => setTitle(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-text-secondary flex items-center gap-1">
                    Claim Statement <span style={{ color: '#f87171' }}>*</span>
                  </label>
                  <textarea className="input-base resize-none text-xs leading-relaxed" rows={5}
                    placeholder="Enter the claim statement..."
                    value={claimText} onChange={e => setClaimText(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-text-secondary">
                    Context <span className="text-text-muted font-normal">(optional)</span>
                  </label>
                  <textarea className="input-base resize-none text-xs leading-relaxed" rows={3}
                    placeholder="Additional context for this claim..."
                    value={context} onChange={e => setContext(e.target.value)} />
                </div>
              </div>

              <ClaimEvidencePanel
                sourceType={sourceType} setSourceType={setSourceType}
                selectedDocs={selectedDocs} toggleDoc={toggleDoc}
                sourcePerson={sourcePerson} setSourcePerson={setSourcePerson}
                personOpen={personOpen} setPersonOpen={setPersonOpen}
                evidenceNotes={evidenceNotes} setEvidenceNotes={setEvidenceNotes} />
            </div>

            {/* ════ RIGHT ════ */}
            <div className="p-6 space-y-6">

              {/* Governance Signals */}
              <div className="space-y-3">
                <ClaimSectionHeader icon={TrendingUp} label="Governance Signals" color="#60a5fa" />
                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-1">
                    <label className="text-[10px] text-text-muted">Confidence (%)</label>
                    <input className="input-base text-xs py-1.5 px-2" type="number" min="0" max="100"
                      value={confidence} onChange={e => setConfidence(e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-text-muted">Risk Level</label>
                    <select className="input-base text-xs py-1.5 px-2" value={risk} onChange={e => setRisk(e.target.value)}>
                      <option>Low</option><option>Medium</option><option>High</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-text-muted">Polarity</label>
                    <select className="input-base text-xs py-1.5 px-2" value={polarity} onChange={e => setPolarity(e.target.value)}>
                      <option value="+">Positive</option>
                      <option value="−">Negative</option>
                      <option value="·">Neutral</option>
                    </select>
                  </div>
                </div>
                {/* Live confidence bar */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-text-muted">Confidence preview</span>
                    <span className="font-semibold"
                      style={{ color: Number(confidence) >= 90 ? '#4ade80' : Number(confidence) >= 70 ? '#fbbf24' : '#f87171' }}>
                      {confidence}%
                    </span>
                  </div>
                  <div className="rounded-full overflow-hidden" style={{ height: 5, background: 'rgba(255,255,255,0.06)' }}>
                    <div className="h-full rounded-full transition-all" style={{
                      width: `${Math.min(100, Math.max(0, Number(confidence)))}%`,
                      background: Number(confidence) >= 90 ? 'linear-gradient(90deg,#22c55e,#4ade80)' : Number(confidence) >= 70 ? 'linear-gradient(90deg,#f59e0b,#fbbf24)' : 'linear-gradient(90deg,#ef4444,#f87171)',
                    }} />
                  </div>
                </div>
              </div>

              {/* Source Info */}
              <div className="space-y-3">
                <ClaimSectionHeader icon={MapPin} label="Source Info" color="#a78bfa" />
                <div className="space-y-1">
                  <label className="text-[10px] text-text-muted">Document</label>
                  <input className="input-base text-xs" placeholder="Document name..."
                    value={doc} onChange={e => setDoc(e.target.value)} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[10px] text-text-muted">Section</label>
                    <input className="input-base text-xs" placeholder="Section..."
                      value={section} onChange={e => setSection(e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-text-muted">Subsection</label>
                    <input className="input-base text-xs" placeholder="Subsection..."
                      value={subsection} onChange={e => setSubsection(e.target.value)} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 shrink-0"
          style={{ borderTop: '1px solid var(--slideout-border)' }}>
          <p className="text-[11px] text-text-muted">Changes are saved directly to this claim record.</p>
          <div className="flex items-center gap-2.5">
            <button className="btn-secondary text-xs py-1.5 px-4" onClick={onClose}>Cancel</button>
            <button
              className="flex items-center gap-1.5 text-xs font-semibold py-1.5 px-5 rounded-lg transition-all hover:brightness-110"
              style={{ background: 'linear-gradient(135deg,#1d4ed8,#3b82f6)', color: '#fff', boxShadow: '0 2px 12px rgba(59,130,246,0.35)' }}
              onClick={onClose}>
              <CheckCircle size={12} /> Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}

// ── Claims Tab ────────────────────────────────────────────────────────────────
function ClaimsTab({ onOpenBuilder }) {
  const [selected, setSelected] = useState(null)
  const [showCreate, setShowCreate] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [suggestClaim, setSuggestClaim] = useState(null)
  const [viewSuggestionClaim, setViewSuggestionClaim] = useState(null)
  const [editClaim, setEditClaim] = useState(null)

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <SearchBar placeholder="Search claims..." value="" onChange={() => {}} />
        <select className="input-base text-xs px-3 py-2" style={{ width: 'auto' }}>
          <option>Documents</option>
        </select>
        <select className="input-base text-xs px-3 py-2" style={{ width: 'auto' }}>
          <option>Bundles</option>
        </select>
        <button className="btn-secondary gap-1.5" onClick={() => setShowFilters(true)}>
          <Filter size={13} /> All filters
        </button>
        <button className="btn-primary ml-auto gap-1.5" onClick={() => setShowCreate(true)}>
          <Plus size={13} /> Create Claim
        </button>
      </div>

      <div className="space-y-2">
        {claims.map(claim => (
          <div key={claim.id}
            className={clsx('row-item', claim.status === 'conflict' && 'conflict', selected?.id === claim.id && 'selected')}
            onClick={() => setSelected(claim)}>
            <div className="flex items-start gap-3">
              <div className="p-1.5 rounded-lg mt-0.5 shrink-0" style={{ background: 'rgba(124,92,252,0.12)' }}>
                <Sparkles size={14} style={{ color: '#a78bfa' }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-mono text-text-muted">{claim.id}</span>
                  <p className="text-sm font-medium text-text-primary">{claim.title}</p>
                  <Badge variant={claim.status}>{statusMap[claim.status]?.label}</Badge>
                  <div className="ml-auto flex items-center gap-1.5">
                    {claim.status === 'promotable' && (
                      <button className="btn-primary text-xs py-1 px-2.5 gap-1" onClick={e => { e.stopPropagation(); onOpenBuilder() }}>
                        <Sparkles size={11} /> Promote
                      </button>
                    )}
                    {claim.status === 'promoted' && (
                      <Badge variant="promoted">✓ Promoted</Badge>
                    )}
                    {claim.hasSuggestion && claim.status !== 'conflict' && (
                      <button className="btn-secondary text-xs py-1 px-2.5 gap-1"
                        style={{ color: '#60a5fa', borderColor: 'rgba(96,165,250,0.3)' }}
                        onClick={e => { e.stopPropagation(); setViewSuggestionClaim(claim) }}>
                        <MessageSquare size={11} /> View Suggestion
                      </button>
                    )}
                    {claim.status === 'conflict' && (
                      <button className="btn-secondary text-xs py-1 px-2.5 gap-1"
                        style={{ color: '#fbbf24', borderColor: 'rgba(245,158,11,0.3)' }}
                        onClick={e => { e.stopPropagation(); setViewSuggestionClaim(claim) }}>
                        <MessageSquare size={11} /> View Suggestion
                      </button>
                    )}
                    {claim.status === 'review' && (
                      <button className="btn-secondary text-xs py-1 px-2.5 gap-1" style={{ color: '#fbbf24', borderColor: 'rgba(245,158,11,0.3)' }}>
                        <AlertTriangle size={11} /> Review
                      </button>
                    )}
                    <button className="btn-ghost p-1.5 rounded-lg" title="Preview"
                      onClick={e => { e.stopPropagation(); setSelected(claim) }}>
                      <Eye size={14} />
                    </button>
                    <ThreeDot items={[
                      { label: 'Edit Claim', onClick: e => { e?.stopPropagation?.(); setEditClaim(claim) } },
                      { label: 'Suggest Change', onClick: e => { e?.stopPropagation?.(); setSuggestClaim(claim) } },
                      { label: 'Quick Promote', onClick: () => {} },
                    ]} />
                  </div>
                </div>
                <p className="text-xs text-text-muted mt-1 line-clamp-1 italic">{claim.text}</p>
                <div className="flex items-center gap-3 mt-1.5 flex-wrap text-[11px] text-text-muted">
                  <span>📄 {claim.doc}</span>
                  <span>§ {claim.section}</span>
                  <span>📁 {claim.subsection}</span>
                  <span>🕐 {claim.time}</span>
                  <div className="ml-auto flex items-center gap-1.5">
                    <Chip color={riskColor[claim.risk] || 'gray'} tooltip="Confidence Score — AI-assessed likelihood this claim is accurate and well-supported by evidence">{claim.confidence}%</Chip>
                    <Chip color={riskColor[claim.risk] || 'gray'} tooltip="Information Risk Level — Potential impact if this claim is incorrect or disputed">{claim.risk}</Chip>
                    <span className="text-text-muted">× {claim.bundles}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selected && <ClaimSlideOut claim={selected} onClose={() => setSelected(null)} />}
      {showCreate && <CreateClaimModal onClose={() => setShowCreate(false)} />}
      {editClaim && <EditClaimModal claim={editClaim} onClose={() => setEditClaim(null)} />}
      {suggestClaim && <SuggestChangeModal claim={suggestClaim} onClose={() => setSuggestClaim(null)} />}
      {viewSuggestionClaim && claimSuggestions[viewSuggestionClaim.id] && (
        <ViewSuggestionModal
          claim={viewSuggestionClaim}
          suggestion={claimSuggestions[viewSuggestionClaim.id]}
          onClose={() => setViewSuggestionClaim(null)}
        />
      )}
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
        </AllFiltersPanel>
      )}
    </div>
  )
}

// ── Bundles Tab ───────────────────────────────────────────────────────────────
function BundlesTab() {
  const [selected, setSelected] = useState(null)
  const bundleStatus = { promotable: 'promotable', promoted: 'promoted', 'not-promotable': 'not-promotable' }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <SearchBar placeholder="Search bundles..." value="" onChange={() => {}} />
        <select className="input-base text-xs px-3 py-2" style={{ width: 'auto' }}><option>All Status</option></select>
        <select className="input-base text-xs px-3 py-2" style={{ width: 'auto' }}><option>All Items</option></select>
        <select className="input-base text-xs px-3 py-2" style={{ width: 'auto' }}><option>All Usage</option></select>
        <button className="btn-secondary gap-1.5"><Filter size={13} /> All Filters</button>
        <button className="btn-primary ml-auto gap-1.5"><Plus size={13} /> New Bundle</button>
      </div>

      {bundles.map(bundle => (
        <div key={bundle.id}
          className={clsx('row-item', selected?.id === bundle.id && 'selected')}
          onClick={() => setSelected(bundle)}>
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg mt-0.5 shrink-0" style={{ background: 'rgba(245,158,11,0.12)' }}>
              <Package size={15} style={{ color: '#fbbf24' }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-mono text-text-muted">{bundle.id}</span>
                <p className="text-sm font-medium text-text-primary">{bundle.name}</p>
                <Badge variant={bundle.status}>{bundle.status === 'promotable' ? 'Promotable' : bundle.status === 'promoted' ? 'Promoted' : 'Not Promotable'}</Badge>
                <div className="ml-auto flex items-center gap-1.5">
                  {bundle.status === 'promotable' && (
                    <button className="btn-primary text-xs py-1 px-2.5 gap-1">
                      <Sparkles size={11} /> Promote
                    </button>
                  )}
                  <ThreeDot items={[
                    { label: 'View Bundle', onClick: () => {} },
                    { label: 'Edit', onClick: () => {} },
                    { label: 'Delete', onClick: () => {}, danger: true },
                  ]} />
                </div>
              </div>
              <p className="text-xs text-text-muted mt-0.5">{bundle.desc}</p>
              <div className="flex items-center gap-3 mt-1.5 text-[11px]">
                <span className="flex items-center gap-1" style={{ color: '#a78bfa' }}>
                  <Sparkles size={10} /> Claims {bundle.claims}
                </span>
                {bundle.conflicts > 0 && (
                  <span className="flex items-center gap-1 text-red-400">
                    <AlertTriangle size={10} /> Conflicts {bundle.conflicts}
                  </span>
                )}
                <span className="flex items-center gap-1 text-green-400">
                  <CheckCircle size={10} /> Promoted {bundle.promoted}
                </span>
                <span className="flex items-center gap-1 text-text-muted">
                  <Clock size={10} /> {bundle.time}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Promotions Tab ────────────────────────────────────────────────────────────
function PromotionsTab({ onOpenBuilder, sandboxId }) {
  const [selected, setSelected] = useState(null)
  const [showFilters, setShowFilters] = useState(false)
  const statusVariant = { promoted: 'promoted', 'in-progress': 'in-progress', queue: 'queue' }
  const statusLabel = { promoted: 'Promoted', 'in-progress': 'In Progress', queue: 'Queue' }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <SearchBar placeholder="Search promotion packages..." value="" onChange={() => {}} />
        <select className="input-base text-xs px-3 py-2" style={{ width: 'auto' }}>
          <option>All Status</option>
          <option>Promoted</option>
          <option>In Progress</option>
          <option>Queue</option>
        </select>
        <select className="input-base text-xs px-3 py-2" style={{ width: 'auto' }}>
          <option>All Targets</option>
          <option>Financial Truth Plane</option>
          <option>Technical Truth Plane</option>
          <option>Legal Truth Plane</option>
        </select>
        <button className="btn-secondary gap-1.5" onClick={() => setShowFilters(true)}>
          <Filter size={13} /> All filters
        </button>
        <button className="btn-primary ml-auto gap-1.5" onClick={onOpenBuilder}>
          <Sparkles size={13} /> New Promotion
        </button>
      </div>

      {promotions.map(pkg => (
        <div key={pkg.id} className="row-item cursor-pointer" onClick={() => setSelected(pkg)}>
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg mt-0.5 shrink-0" style={{ background: 'rgba(124,92,252,0.12)' }}>
              <Sparkles size={15} style={{ color: '#a78bfa' }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-mono text-text-muted">{pkg.id}</span>
                <p className="text-sm font-medium text-text-primary">{pkg.name}</p>
                <Badge variant={statusVariant[pkg.status]}>{statusLabel[pkg.status]}</Badge>
                <div className="ml-auto flex items-center gap-1.5">
                  <button className="btn-ghost p-1.5 rounded-lg" title="Preview"
                    onClick={e => { e.stopPropagation(); setSelected(pkg) }}>
                    <Eye size={14} />
                  </button>
                  <ThreeDot items={[
                    { label: 'View Package', onClick: () => setSelected(pkg) },
                    { label: 'Edit Package', onClick: () => setSelected(pkg) },
                    { label: 'Duplicate', onClick: () => {} },
                    { label: 'Archive', onClick: () => {}, danger: true },
                  ]} />
                </div>
              </div>
              <p className="text-xs text-text-muted mt-0.5">{pkg.desc}</p>
              <div className="flex items-center gap-3 mt-1.5 flex-wrap text-[11px] text-text-muted">
                <span>👤 {pkg.owner}</span>
                <span>🕐 {pkg.time}</span>
                <div className="flex gap-1.5 flex-wrap">
                  {pkg.tags.map(t => (
                    <span key={t} className="px-1.5 py-0.5 rounded text-[10px]"
                      style={{ background: 'rgba(124,92,252,0.1)', color: '#a78bfa' }}>{t}</span>
                  ))}
                </div>
                <span className="ml-auto" style={{ color: '#60a5fa' }}>📋 {pkg.target}</span>
                <span style={{ color: '#a78bfa' }}>✦ Claims {pkg.claims}</span>
              </div>
            </div>
          </div>
        </div>
      ))}

      {selected && (
        <PromotionSlideOut pkg={selected} sandboxId={sandboxId} onClose={() => setSelected(null)} />
      )}
      {showFilters && (
        <AllFiltersPanel onClose={() => setShowFilters(false)}>
          <FilterSection label="Package Status">
            {['Promoted', 'In Progress', 'Queue'].map(o => (
              <button key={o} className="filter-pill">{o}</button>
            ))}
          </FilterSection>
          <FilterSection label="Target Truth Plane">
            {['Financial Truth Plane', 'Technical Truth Plane', 'Legal Truth Plane'].map(o => (
              <button key={o} className="filter-pill">{o}</button>
            ))}
          </FilterSection>
          <FilterSection label="Tags">
            {['Financial', 'Revenue', 'Q1', 'Cloud', 'Infrastructure', 'Migration', 'Legal', 'Partnerships'].map(o => (
              <button key={o} className="filter-pill">{o}</button>
            ))}
          </FilterSection>
          <FilterSection label="Owner">
            {['Sarah Chen', 'Michael Torres', 'Emma Wilson'].map(o => (
              <button key={o} className="filter-pill">{o}</button>
            ))}
          </FilterSection>
        </AllFiltersPanel>
      )}
    </div>
  )
}

// ── Sources Tab ───────────────────────────────────────────────────────────────
function SourcesTab() {
  const [selected, setSelected] = useState(null)
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState('list')

  return (
    <div className="space-y-3">
      {/* Filter bar */}
      <div className="flex items-center gap-2 flex-wrap">
        <SearchBar placeholder="Search documents..." value="" onChange={() => {}} />
        <select className="input-base text-xs px-3 py-2" style={{ width: 'auto' }}>
          <option>All Claims</option><option>With Claims</option><option>No Claims</option>
        </select>
        <select className="input-base text-xs px-3 py-2" style={{ width: 'auto' }}>
          <option>All Actions</option><option>Retry</option><option>Review</option>
        </select>
        <select className="input-base text-xs px-3 py-2" style={{ width: 'auto' }}>
          <option>All Uses</option><option>In Bundles</option><option>In Promotions</option>
        </select>
        <button className="btn-secondary gap-1.5" onClick={() => setShowFilters(true)}>
          <Filter size={13} /> All Filters
        </button>
        {/* List / Grid toggle */}
        <div className="flex items-center gap-0.5 ml-auto p-0.5 rounded-lg"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          {[{ id: 'list', Icon: List }, { id: 'grid', Icon: LayoutGrid }].map(({ id, Icon }) => (
            <button key={id} onClick={() => setViewMode(id)}
              className="p-1.5 rounded-md transition-all"
              style={{
                background: viewMode === id ? 'rgba(255,255,255,0.1)' : 'transparent',
                color: viewMode === id ? 'var(--text-primary)' : 'var(--text-muted)',
              }}>
              <Icon size={14} />
            </button>
          ))}
        </div>
      </div>

      {/* Document cards */}
      <div className="space-y-2">
        {sourceDocs.map(doc => {
          const isFailed = doc.status === 'failed'
          return (
            <div key={doc.id} className="row-item cursor-pointer"
              style={isFailed ? { borderColor: 'rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.03)' } : {}}
              onClick={() => setSelected(doc)}>
              <div className="flex items-start gap-3">
                {/* PDF icon */}
                <div className="flex flex-col items-center p-2 rounded-lg shrink-0 mt-0.5"
                  style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.2)' }}>
                  <FileText size={15} style={{ color: '#f87171' }} />
                  <span className="text-[7px] font-bold mt-0.5" style={{ color: '#f87171' }}>PDF</span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-semibold text-text-primary truncate">{doc.name}</p>
                    <div className="flex items-center gap-1.5 ml-auto shrink-0">
                      <button className="btn-ghost p-1.5 rounded-lg" title="Preview"
                        onClick={e => { e.stopPropagation(); setSelected(doc) }}>
                        <Eye size={14} />
                      </button>
                      {isFailed ? (
                        <button className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg font-medium"
                          style={{ background: 'rgba(239,68,68,0.15)', color: '#f87171', border: '1px solid rgba(239,68,68,0.25)' }}
                          onClick={e => e.stopPropagation()}>
                          <RefreshCw size={11} /> Retry
                        </button>
                      ) : (
                        <button className="btn-primary text-xs py-1 px-2.5 gap-1"
                          onClick={e => { e.stopPropagation(); setSelected(doc) }}>
                          <Sparkles size={11} /> View Claims
                        </button>
                      )}
                      <ThreeDot items={[
                        { label: 'View Details', onClick: () => setSelected(doc) },
                        { label: 'Re-process', onClick: () => {} },
                        { label: 'Remove from Sandbox', onClick: () => {}, danger: true },
                      ]} />
                    </div>
                  </div>

                  {/* AI summary */}
                  <div className="flex items-start gap-1 mb-1.5">
                    <Sparkles size={11} className="shrink-0 mt-0.5" style={{ color: '#a78bfa' }} />
                    <p className="text-xs text-text-muted line-clamp-1">
                      {doc.aiSummary}
                      <button className="ml-1 text-[11px]" style={{ color: '#a78bfa' }}
                        onClick={e => { e.stopPropagation(); setSelected(doc) }}>more</button>
                    </p>
                  </div>

                  {/* Footer row */}
                  <div className="flex items-center gap-2 flex-wrap text-[11px]">
                    <div className="flex items-center gap-1.5 text-text-muted">
                      <span className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold text-white shrink-0"
                        style={{ background: 'linear-gradient(135deg, #f59e0b, #ef4444)' }}>
                        {doc.promotedBy.initials}
                      </span>
                      Promoted by <span className="text-text-secondary font-medium ml-1">{doc.promotedBy.name}</span>
                      <span className="ml-1">{doc.time}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium"
                      style={isFailed
                        ? { background: 'rgba(239,68,68,0.12)', color: '#f87171', border: '1px solid rgba(239,68,68,0.25)' }
                        : { background: 'rgba(34,197,94,0.1)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.2)' }}>
                      {isFailed ? 'Failed' : 'Processed'}
                    </span>
                    {!isFailed && (
                      <div className="flex items-center gap-2 ml-auto">
                        <span className="flex items-center gap-1 text-text-muted">
                          <Package size={10} style={{ color: '#a78bfa' }} /> Bundles {doc.bundles}
                        </span>
                        <span className="flex items-center gap-1 text-text-muted">
                          <Sparkles size={10} style={{ color: '#fb923c' }} /> Claims {doc.claims}
                        </span>
                        {doc.conflicts > 0 && (
                          <span className="flex items-center gap-1 text-red-400">
                            <AlertTriangle size={10} /> Conflicts {doc.conflicts}
                          </span>
                        )}
                        <span className="flex items-center gap-1 text-green-400">
                          <CheckCircle size={10} /> Promoted {doc.promoted}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Filter panel */}
      {showFilters && (
        <AllFiltersPanel onClose={() => setShowFilters(false)}>
          <FilterSection label="Claim Status">
            {['Active', 'In Review', 'Ready for Promotion', 'Completed'].map(o => (
              <label key={o} className="flex items-center gap-2 py-1 cursor-pointer">
                <input type="checkbox" className="rounded accent-purple-500" />
                <span className="text-xs text-text-secondary">{o}</span>
              </label>
            ))}
          </FilterSection>
          <FilterSection label="Attention Required">
            {['Claims Need Validation', 'Has Conflicts', 'Promotions Pending', 'Blocked'].map(o => (
              <label key={o} className="flex items-center gap-2 py-1 cursor-pointer">
                <input type="checkbox" className="rounded accent-purple-500" />
                <span className="text-xs text-text-secondary">{o}</span>
              </label>
            ))}
          </FilterSection>
          <FilterSection label="Usage">
            {['Used in Bundles', 'Used in Promotions', 'Not Used', 'High Usage (5+ uses)'].map(o => (
              <label key={o} className="flex items-center gap-2 py-1 cursor-pointer">
                <input type="checkbox" className="rounded accent-purple-500" />
                <span className="text-xs text-text-secondary">{o}</span>
              </label>
            ))}
          </FilterSection>
          <FilterSection label="Activity">
            {['Recently Updated', 'Recently Created', 'Stale (no activity in 7+ days)'].map(o => (
              <label key={o} className="flex items-center gap-2 py-1 cursor-pointer">
                <input type="checkbox" className="rounded accent-purple-500" />
                <span className="text-xs text-text-secondary">{o}</span>
              </label>
            ))}
          </FilterSection>
        </AllFiltersPanel>
      )}

      {selected && <SourceSlideOut doc={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}

// ── Overview Tab ──────────────────────────────────────────────────────────────
function OverviewTab({ d }) {
  const [analyticsTab, setAnalyticsTab] = useState('Analytics & Insights')
  return (
    <div className="space-y-4">
      <div className="flex gap-1.5 text-xs">
        {['Analytics & Insights','Validation Pipeline','Governance & Quality'].map(t => (
          <button key={t}
            className="px-3 py-1.5 rounded-lg transition-all font-medium"
            style={analyticsTab === t
              ? { background: 'rgba(255,255,255,0.1)', color: '#f1f5f9', border: '1px solid rgba(255,255,255,0.15)' }
              : { color: '#64748b', border: '1px solid transparent' }}
            onClick={() => setAnalyticsTab(t)}>{t}</button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="glass-card p-4">
          <div className="flex items-center gap-1.5 mb-2">
            <CheckCircle size={13} style={{ color: '#4ade80' }} />
            <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">Truth Readiness</p>
            <span className="ml-auto text-[11px] font-medium" style={{ color: '#4ade80' }}>+5%</span>
          </div>
          <p className="text-2xl font-bold" style={{ color: '#4ade80' }}>{d.truthReadiness}%</p>
          <div className="h-1 rounded-full mt-2" style={{ background: 'rgba(34,197,94,0.15)' }}>
            <div className="h-full rounded-full" style={{ width: `${d.truthReadiness}%`, background: '#22c55e' }} />
          </div>
          <p className="text-[11px] text-text-muted mt-1">89 of 127 claims ready</p>
        </div>

        <div className="glass-card p-4">
          <div className="flex items-center gap-1.5 mb-2">
            <AlertTriangle size={13} style={{ color: '#f87171' }} />
            <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">Conflict Rate</p>
            <span className="ml-auto text-[11px] font-medium" style={{ color: '#f87171' }}>-1.2%</span>
          </div>
          <p className="text-2xl font-bold" style={{ color: '#f87171' }}>{d.conflictRate}%</p>
          <div className="h-1 rounded-full mt-2" style={{ background: 'rgba(239,68,68,0.15)' }}>
            <div className="h-full rounded-full" style={{ width: `${d.conflictRate}%`, background: '#ef4444' }} />
          </div>
          <p className="text-[11px] text-text-muted mt-1">8 of 127 claims have conflicts</p>
        </div>

        <div className="glass-card p-4">
          <div className="flex items-center gap-1.5 mb-2">
            <Clock size={13} style={{ color: '#fbbf24' }} />
            <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">Validation Bottleneck</p>
          </div>
          <p className="text-sm font-semibold text-text-primary mb-1">Slowest: {d.bottleneck}</p>
          <p className="text-2xl font-bold" style={{ color: '#fbbf24' }}>{d.bottleneckDays} days</p>
          <div className="mt-2 px-2 py-1.5 rounded text-[11px]"
            style={{ background: 'rgba(245,158,11,0.1)', color: '#fbbf24' }}>
            💡 Assign 2 more reviewers
          </div>
        </div>
      </div>

      <div className="glass-card p-4">
        <p className="text-xs font-semibold text-text-secondary mb-3">Weekly Validation Throughput</p>
        <ResponsiveContainer width="100%" height={160}>
          <LineChart data={d.weeklyData}>
            <XAxis dataKey="w" tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: '#1f2333', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 11 }} />
            <Line type="monotone" dataKey="docs" stroke="#60a5fa" strokeWidth={2} dot={{ fill: '#60a5fa', r: 3 }} name="Docs Ingested" />
            <Line type="monotone" dataKey="claims" stroke="#a78bfa" strokeWidth={2} dot={{ fill: '#a78bfa', r: 3 }} name="Claims Created" />
            <Line type="monotone" dataKey="truth" stroke="#4ade80" strokeWidth={2} dot={{ fill: '#4ade80', r: 3 }} name="Truth Promoted" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

// ── Create / Edit Claim Modal ─────────────────────────────────────────────────
function CreateClaimModal({ onClose, initialData = null }) {
  const isEdit = !!initialData
  const polarityMap = { '+': 'Positive', '−': 'Negative', '·': 'Neutral' }

  const [source, setSource] = useState('Document')
  const [selectedDocs, setSelectedDocs] = useState([])
  const [selectedBundles, setSelectedBundles] = useState([])
  const [selectedPerson, setSelectedPerson] = useState(null)
  const [personOpen, setPersonOpen] = useState(false)

  const people = [
    { name: 'Sarah Chen',       email: 'sarah.chen@company.com',       initials: 'SC', gradient: 'linear-gradient(135deg,#a78bfa,#60a5fa)' },
    { name: 'Michael Torres',   email: 'michael.torres@company.com',   initials: 'MT', gradient: 'linear-gradient(135deg,#f59e0b,#ef4444)' },
    { name: 'Emily Rodriguez',  email: 'emily.rodriguez@company.com',  initials: 'ER', gradient: 'linear-gradient(135deg,#4ade80,#22d3ee)' },
    { name: 'David Kim',        email: 'david.kim@company.com',        initials: 'DK', gradient: 'linear-gradient(135deg,#f87171,#fb923c)' },
  ]

  const docList = [
    'Q1_Enterprise_Contracts.pdf',
    'Master_Service_Agreement.pdf',
    'Addendum_2024_Q1.pdf',
    'Payment_Terms_Schedule.pdf',
  ]

  const toggleDoc    = f  => setSelectedDocs(p    => p.includes(f)    ? p.filter(x => x !== f)    : [...p, f])
  const toggleBundle = id => setSelectedBundles(p => p.includes(id)   ? p.filter(x => x !== id)   : [...p, id])

  const SectionHeader = ({ icon: Icon, label, color = '#a78bfa' }) => (
    <div className="flex items-center gap-2 pb-1" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <Icon size={13} style={{ color }} />
      <p className="text-xs font-semibold text-text-secondary">{label}</p>
    </div>
  )

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}>
      <div className="w-full rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        style={{ maxWidth: 640, maxHeight: '90vh', background: 'var(--modal-bg)', border: '1px solid var(--modal-border)' }}
        onClick={e => e.stopPropagation()}>

        {/* ── Header ── */}
        <div className="flex items-start justify-between px-6 py-4 shrink-0"
          style={{ borderBottom: '1px solid var(--slideout-border)' }}>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-text-primary">{isEdit ? 'Edit Claim' : 'Create New Claim'}</p>
              {isEdit && (
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded"
                  style={{ background: 'rgba(124,92,252,0.12)', color: '#a78bfa', border: '1px solid rgba(124,92,252,0.2)' }}>
                  {initialData.id}
                </span>
              )}
            </div>
            <p className="text-xs text-text-muted mt-0.5">
              {isEdit ? 'Update the claim details below.' : 'Add a new claim manually with all required information'}
            </p>
          </div>
          <button onClick={onClose} className="btn-ghost p-1.5 rounded-lg"><X size={14} /></button>
        </div>

        {/* ── Body ── */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* Basic Information */}
          <div className="space-y-3">
            <SectionHeader icon={FileText} label="Basic Information" />
            <FormField label="Title" required>
              <input className="input-base" placeholder="e.g., Service Level Agreement - Uptime Guarantee"
                defaultValue={initialData?.title ?? ''} />
            </FormField>
            <FormField label="Context" required>
              <textarea className="input-base resize-none" rows={3} placeholder="Provide context for this claim..."
                defaultValue={isEdit ? 'Establishes the contractual obligation and conditions as extracted from the referenced document section.' : ''} />
            </FormField>
            <FormField label="Claim" required>
              <textarea className="input-base resize-none" rows={4} placeholder="Enter the actual claim statement..."
                defaultValue={initialData?.text?.replace(/"/g, '') ?? ''} />
            </FormField>
          </div>

          {/* Source */}
          <div className="space-y-3">
            <SectionHeader icon={FileText} label="Source" color="#60a5fa" />
            <SegmentedControl options={['Document', 'Human']} value={source} onChange={setSource} />
            {source === 'Document' && (
              <div className="space-y-2.5">
                <p className="text-xs text-text-muted">Select Documents</p>
                <div className="grid grid-cols-2 gap-2">
                  {docList.map(f => {
                    const checked = selectedDocs.includes(f)
                    return (
                      <label key={f} className="flex items-center gap-2 p-2.5 rounded-lg cursor-pointer transition-all"
                        style={{
                          background: checked ? 'rgba(124,92,252,0.08)' : 'rgba(255,255,255,0.03)',
                          border: `1px solid ${checked ? 'rgba(124,92,252,0.35)' : 'rgba(255,255,255,0.08)'}`,
                        }}>
                        <input type="checkbox" className="accent-purple-500 shrink-0" checked={checked} onChange={() => toggleDoc(f)} />
                        <FileText size={11} style={{ color: '#f87171' }} className="shrink-0" />
                        <span className="text-xs text-text-secondary truncate">{f}</span>
                      </label>
                    )
                  })}
                </div>
                <button className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs text-text-muted transition-all hover:text-text-secondary"
                  style={{ border: '1px dashed rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.02)' }}>
                  <Plus size={12} /> Upload Document
                </button>
              </div>
            )}

            {source === 'Human' && (
              <div className="space-y-1.5">
                <p className="text-xs text-text-muted">Select Person</p>

                {/* Trigger */}
                <button
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs transition-all"
                  style={{
                    background: 'var(--input-bg)',
                    border: `1px solid ${personOpen ? 'rgba(124,92,252,0.5)' : 'var(--input-border)'}`,
                    color: selectedPerson ? 'var(--text-primary)' : 'var(--text-muted)',
                  }}
                  onClick={() => setPersonOpen(o => !o)}>
                  {selectedPerson ? (
                    <span className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white shrink-0"
                        style={{ background: selectedPerson.gradient }}>{selectedPerson.initials}</span>
                      <span className="font-medium text-text-primary">{selectedPerson.name}</span>
                      <span style={{ color: 'var(--text-muted)' }}>({selectedPerson.email})</span>
                    </span>
                  ) : (
                    <span>Select a person...</span>
                  )}
                  <ChevronRight size={13} className={`transition-transform shrink-0 ${personOpen ? 'rotate-90' : ''}`}
                    style={{ color: 'var(--text-muted)' }} />
                </button>

                {/* Inline list — no absolute, avoids overflow clipping */}
                {personOpen && (
                  <div className="rounded-xl overflow-hidden"
                    style={{ border: '1px solid rgba(124,92,252,0.25)', background: '#131825' }}>
                    {people.map((p, i) => (
                      <button key={p.email}
                        className="w-full flex items-center gap-3 px-4 py-3 text-left transition-all"
                        style={{
                          background: selectedPerson?.email === p.email ? 'rgba(124,92,252,0.18)' : 'transparent',
                          borderTop: i > 0 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                        }}
                        onMouseEnter={e => { if (selectedPerson?.email !== p.email) e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
                        onMouseLeave={e => { if (selectedPerson?.email !== p.email) e.currentTarget.style.background = 'transparent' }}
                        onClick={() => { setSelectedPerson(p); setPersonOpen(false) }}>
                        <span className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                          style={{ background: p.gradient }}>{p.initials}</span>
                        <span>
                          <span className="text-xs font-semibold text-text-primary">{p.name}</span>
                          <span className="text-xs text-text-muted ml-2">({p.email})</span>
                        </span>
                        {selectedPerson?.email === p.email && (
                          <CheckCircle size={13} className="ml-auto shrink-0" style={{ color: '#a78bfa' }} />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Metrics */}
          <div className="space-y-3">
            <SectionHeader icon={Target} label="Metrics" color="#60a5fa" />
            <div className="grid grid-cols-3 gap-3">
              <FormField label="Confidence (%)">
                <input className="input-base" defaultValue={initialData?.confidence ?? 85} />
              </FormField>
              <FormField label="Risk Level">
                <select className="input-base" defaultValue={initialData?.risk ?? 'Low'}>
                  <option>Low</option><option>Medium</option><option>High</option>
                </select>
              </FormField>
            </div>
          </div>

          {/* Bundles */}
          <div className="space-y-3">
            <SectionHeader icon={Package} label="Bundles" color="#fbbf24" />
            <div className="grid grid-cols-1 gap-2">
              {bundles.map(b => {
                const checked = selectedBundles.includes(b.id)
                return (
                  <label key={b.id} className="flex items-center gap-2.5 p-2.5 rounded-lg cursor-pointer transition-all"
                    style={{
                      background: checked ? 'rgba(124,92,252,0.08)' : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${checked ? 'rgba(124,92,252,0.35)' : 'rgba(255,255,255,0.08)'}`,
                    }}>
                    <input type="checkbox" className="accent-purple-500 shrink-0" checked={checked} onChange={() => toggleBundle(b.id)} />
                    <Package size={12} style={{ color: '#fbbf24' }} className="shrink-0" />
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded shrink-0"
                      style={{ background: 'rgba(124,92,252,0.15)', color: '#a78bfa', border: '1px solid rgba(124,92,252,0.2)' }}>
                      {b.id}
                    </span>
                    <span className="text-xs text-text-secondary truncate">{b.name}</span>
                  </label>
                )
              })}
            </div>
          </div>

          {/* Details */}
          <div className="space-y-3">
            <SectionHeader icon={Sparkles} label="Details" color="#a78bfa" />

            {/* Amount — optional, first */}
            <FormField label="Amount" hint="Optional">
              <input className="input-base" placeholder="e.g., $2,500,000" />
            </FormField>

            {/* Reference — optional, second */}
            <FormField label="Reference" hint="Optional">
              <input className="input-base" placeholder="e.g., Section 4.2.1" />
            </FormField>

            {/* Created By — auto / read-only */}
            <div className="space-y-1">
              <p className="text-xs font-medium text-text-secondary flex items-center gap-1.5">
                <User size={11} style={{ color: '#60a5fa' }} />
                Created By
                <span className="text-[10px] font-normal px-1.5 py-0.5 rounded"
                  style={{ background: 'rgba(96,165,250,0.1)', color: '#60a5fa' }}>Auto</span>
              </p>
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <span className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white shrink-0"
                  style={{ background: 'linear-gradient(135deg,#a78bfa,#60a5fa)' }}>JD</span>
                <span className="text-text-secondary">John Doe</span>
              </div>
              <p className="text-[11px] text-text-muted">Taken from your logged-in account</p>
            </div>

            {/* Organization — auto / read-only */}
            <div className="space-y-1">
              <p className="text-xs font-medium text-text-secondary flex items-center gap-1.5">
                <User size={11} style={{ color: '#60a5fa' }} />
                Organization
                <span className="text-[10px] font-normal px-1.5 py-0.5 rounded"
                  style={{ background: 'rgba(96,165,250,0.1)', color: '#60a5fa' }}>Auto</span>
              </p>
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <span className="text-text-secondary">Acme Corporation</span>
              </div>
              <p className="text-[11px] text-text-muted">Automatically detected from your workspace</p>
            </div>

            {/* Location — auto / read-only */}
            <div className="space-y-1">
              <p className="text-xs font-medium text-text-secondary flex items-center gap-1.5">
                <MapPin size={11} style={{ color: '#60a5fa' }} />
                Location
                <span className="text-[10px] font-normal px-1.5 py-0.5 rounded"
                  style={{ background: 'rgba(96,165,250,0.1)', color: '#60a5fa' }}>Auto</span>
              </p>
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <span className="text-text-secondary">New York, NY</span>
              </div>
              <p className="text-[11px] text-text-muted">Automatically detected from your workspace</p>
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="flex items-center justify-end gap-2.5 px-6 py-4 shrink-0"
          style={{ borderTop: '1px solid var(--slideout-border)' }}>
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary gap-1.5">
            {isEdit ? <><CheckCircle size={13} /> Save Changes</> : <><Plus size={13} /> Create Claim</>}
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function SandboxDetail() {
  const navigate = useNavigate()
  const { id } = useParams()
  const d = sandboxDetail
  const [tab, setTab] = useState('Overview')

  const TABS = ['Overview', 'Sources', 'Claims', 'Bundles', 'Promotions']

  const metrics = [
    { label: 'Documents', value: d.docs, color: 'white' },
    { label: 'Bundles', value: d.bundles, color: 'purple' },
    { label: 'Claims', value: d.claims, color: 'blue' },
    { label: 'Promotions', value: d.promotions, color: 'amber' },
    { label: 'Claims Promoted', value: d.claimed, color: 'green' },
  ]

  return (
    <div className="p-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-text-muted mb-4">
        <button onClick={() => navigate('/intelligence-library')} className="hover:text-text-secondary">Intelligence Library</button>
        <ChevronRight size={12} className="opacity-40" />
        <button onClick={() => navigate('/sandbox')} className="hover:text-text-secondary">Sandbox Plane</button>
        <ChevronRight size={12} className="opacity-40" />
        <span className="text-text-secondary font-medium">{d.name}</span>
      </nav>

      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl" style={{ background: 'rgba(124,92,252,0.15)' }}>
            <LayoutGrid size={20} style={{ color: '#a78bfa' }} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-xl font-bold text-text-primary">{d.name}</h1>
              <Badge variant="active">Active</Badge>
              <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(59,130,246,0.15)', color: '#60a5fa' }}>Workspace</span>
            </div>
            <p className="text-sm text-text-muted">{d.desc}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="btn-primary gap-1.5" onClick={() => navigate(`/sandbox/${id}/promotion-builder`)}>
            <Sparkles size={14} /> Promotion Builder
          </button>
          <button className="btn-secondary gap-1.5">
            <Settings size={14} /> Settings
          </button>
        </div>
      </div>

      {/* Metrics row */}
      <div className="grid grid-cols-5 gap-2 mb-5">
        {metrics.map(m => (
          <MetricCard key={m.label} label={m.label} value={m.value} color={m.color} />
        ))}
      </div>

      {/* Tab bar */}
      <div className="tab-bar mb-5">
        {TABS.map(t => (
          <button key={t} className={clsx('tab-btn', tab === t && 'active')} onClick={() => setTab(t)}>{t}</button>
        ))}
      </div>

      {/* Tab content */}
      {tab === 'Overview' && <OverviewTab d={d} />}
      {tab === 'Claims' && <ClaimsTab onOpenBuilder={() => navigate(`/sandbox/${id}/promotion-builder`)} />}
      {tab === 'Bundles' && <BundlesTab />}
      {tab === 'Promotions' && <PromotionsTab onOpenBuilder={() => navigate(`/sandbox/${id}/promotion-builder`)} sandboxId={id} />}
      {tab === 'Sources' && <SourcesTab />}

    </div>
  )
}
