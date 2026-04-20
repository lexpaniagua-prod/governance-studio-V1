import React, { useState, useMemo, useRef, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { createPortal } from 'react-dom'
import clsx from 'clsx'
import {
  BookOpen, ArrowLeft, ChevronDown, Edit, Plus, Users, Bot, Network,
  FileText, Archive, Sparkles, Shield, CheckCircle, AlertTriangle,
  ExternalLink, Calendar, Building2, Tag, TrendingUp, Activity,
  Search, Filter, MoreVertical, X, Clock, Eye, Package,
  XCircle, ChevronRight, RefreshCw, Zap, DollarSign, MapPin, User, Hash,
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts'
import { truthPacks as SEED } from '../../../data/mockKnowledge'
import { truthFacts, factGovernance } from '../../../data/mock'
import { SlideOut, Badge, Chip, SearchBar, ThreeDot, AllFiltersPanel, FilterSection, TabBar } from '../../ui/index'
import { GovernanceSnapshot, GovernanceTimeline } from '../truth-plane/GovernanceTrail'

// ── Design-system maps ────────────────────────────────────────────────────────

const STATUS_MAP = {
  active:   { label: 'Active',   bg: 'rgba(34,197,94,0.1)',    border: 'rgba(34,197,94,0.3)',    color: '#4ade80', dot: '#22c55e' },
  draft:    { label: 'Draft',    bg: 'rgba(59,130,246,0.1)',   border: 'rgba(59,130,246,0.3)',   color: '#60a5fa', dot: '#3b82f6' },
  archived: { label: 'Archived', bg: 'rgba(100,116,139,0.1)',  border: 'rgba(100,116,139,0.3)',  color: '#94a3b8', dot: '#64748b' },
}
const ACCESS_MAP = {
  users:             { label: 'Users',            color: '#60a5fa', bg: 'rgba(59,130,246,0.1)',  border: 'rgba(59,130,246,0.3)'  },
  agents:            { label: 'Agents',           color: '#a78bfa', bg: 'rgba(124,92,252,0.1)', border: 'rgba(124,92,252,0.3)' },
  'agentic-networks':{ label: 'Agentic Networks', color: '#2dd4bf', bg: 'rgba(20,184,166,0.1)', border: 'rgba(20,184,166,0.3)' },
  mixed:             { label: 'Mixed Access',     color: '#fbbf24', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.3)' },
}
const FACT_STATUS = {
  verified: { label: 'Verified',  color: '#4ade80', bg: 'rgba(34,197,94,0.1)',  border: 'rgba(34,197,94,0.3)'  },
  pending:  { label: 'Pending',   color: '#fbbf24', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.3)' },
  conflict: { label: 'Conflict',  color: '#f87171', bg: 'rgba(239,68,68,0.1)',  border: 'rgba(239,68,68,0.3)'  },
}
const TABS = ['Overview', 'Facts', 'Users', 'Agents', 'Agentic Networks', 'Activity Log']

// ── Mock access detail rows (per-pack not defined per-user) ───────────────────
const MOCK_USERS = [
  { id: 'u1', name: 'Sarah Chen',     role: 'Compliance Lead',     initials: 'SC', gradient: 'linear-gradient(135deg,#3b82f6,#60a5fa)',  grantedAt: '2026-03-20', access: 'Read & Execute' },
  { id: 'u2', name: 'James Park',     role: 'Legal',               initials: 'JP', gradient: 'linear-gradient(135deg,#6366f1,#a78bfa)',  grantedAt: '2026-03-20', access: 'Read' },
  { id: 'u3', name: 'Emma Rodriguez', role: 'Truth Approver',      initials: 'ER', gradient: 'linear-gradient(135deg,#10b981,#059669)',  grantedAt: '2026-03-25', access: 'Read & Execute' },
  { id: 'u4', name: 'David Kim',      role: 'Platform Admin',      initials: 'DK', gradient: 'linear-gradient(135deg,#ec4899,#a855f7)',  grantedAt: '2026-04-01', access: 'Admin' },
  { id: 'u5', name: 'Lisa Anderson',  role: 'Procurement Manager', initials: 'LA', gradient: 'linear-gradient(135deg,#14b8a6,#06b6d4)',  grantedAt: '2026-04-05', access: 'Read' },
  { id: 'u6', name: 'Michael Torres', role: 'Finance Lead',        initials: 'MT', gradient: 'linear-gradient(135deg,#0ea5e9,#38bdf8)',  grantedAt: '2026-04-08', access: 'Read' },
  { id: 'u7', name: 'Alex Rivera',    role: 'Sales Director',      initials: 'AR', gradient: 'linear-gradient(135deg,#f59e0b,#ef4444)',  grantedAt: '2026-04-10', access: 'Read & Execute' },
]
const MOCK_AGENTS = [
  { id: 'a1', name: 'Deal Desk Agent',     type: 'Sales',      purpose: 'Validates deal terms against contract standards',          model: 'Claude 3.5', accessedAt: '2026-04-14' },
  { id: 'a2', name: 'Contract Reviewer',   type: 'Legal',      purpose: 'Flags deviations from approved contract language',         model: 'Claude 3.5', accessedAt: '2026-04-13' },
  { id: 'a3', name: 'Renewal Bot',         type: 'Customer',   purpose: 'Monitors auto-renewal windows and triggers alerts',        model: 'Claude 3',   accessedAt: '2026-04-12' },
  { id: 'a4', name: 'Pricing Validator',   type: 'Sales',      purpose: 'Cross-checks pricing proposals against approved tiers',    model: 'Claude 3.5', accessedAt: '2026-04-11' },
  { id: 'a5', name: 'Data Privacy Scanner',type: 'Compliance', purpose: 'Scans data flows against residency and consent rules',     model: 'Claude 3',   accessedAt: '2026-04-10' },
]
const MOCK_NETWORKS = [
  { id: 'n1', name: 'Sales Agentic Network',      scope: 'Company-wide', agents: 8,  purpose: 'End-to-end sales pipeline automation',         connectedAt: '2026-03-20' },
  { id: 'n2', name: 'Legal Review Network',        scope: 'Department',  agents: 4,  purpose: 'Contract review and compliance verification',   connectedAt: '2026-03-25' },
  { id: 'n3', name: 'EU Compliance Network',       scope: 'Regional',    agents: 6,  purpose: 'EU regulatory compliance enforcement',          connectedAt: '2026-04-01' },
  { id: 'n4', name: 'AI Safety Network',           scope: 'Company-wide',agents: 14, purpose: 'AI model output validation and safety checks',  connectedAt: '2026-04-05' },
  { id: 'n5', name: 'Audit Network',               scope: 'Company-wide',agents: 3,  purpose: 'Governance audit trail and reporting',          connectedAt: '2026-04-08' },
]

const ACCESS_LEVELS = ['Read', 'Read & Execute', 'Admin']

// ── Helpers ───────────────────────────────────────────────────────────────────

function SectionLabel({ children }) {
  return <p className="text-[9px] uppercase tracking-wider font-semibold text-text-muted mb-2">{children}</p>
}

function StatTile({ icon: Icon, value, label, color }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-xl"
      style={{ background: `${color}0d`, border: `1px solid ${color}28` }}>
      <div className="p-2 rounded-lg" style={{ background: `${color}18` }}>
        <Icon size={14} style={{ color }} />
      </div>
      <div>
        <p className="text-lg font-bold leading-none" style={{ color }}>{value}</p>
        <p className="text-[10px] text-text-muted mt-0.5">{label}</p>
      </div>
    </div>
  )
}

function KV({ label, children }) {
  return (
    <div className="space-y-1">
      <p className="text-[9px] uppercase tracking-wider font-semibold text-text-muted">{label}</p>
      <div className="text-xs text-text-secondary">{children}</div>
    </div>
  )
}

// ── Actions dropdown ──────────────────────────────────────────────────────────

function ActionsDropdown({ onEdit, onAddFacts, onAddAccess, onArchive, isArchived }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const items = [
    { label: 'Edit Truth Pack', icon: Edit,     onClick: onEdit },
    { label: 'Add Facts',       icon: FileText, onClick: onAddFacts },
    { label: 'Add Access',      icon: Users,    onClick: onAddAccess },
    { label: 'divider' },
    { label: 'Archive',         icon: Archive,  onClick: onArchive, danger: !isArchived },
  ]

  return (
    <div className="relative" ref={ref}>
      <button
        className="btn-secondary gap-1.5"
        onClick={() => setOpen(o => !o)}>
        Actions <ChevronDown size={13} className={clsx('transition-transform', open && 'rotate-180')} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-10 z-50 min-w-48 py-1 rounded-xl shadow-2xl"
            style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)' }}>
            {items.map((item, i) =>
              item.label === 'divider' ? (
                <div key={i} className="my-1" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }} />
              ) : (
                <button key={item.label}
                  className="flex items-center gap-2.5 w-full px-3 py-2 text-xs hover:bg-white/5 transition-colors text-left"
                  style={{ color: item.danger ? '#f87171' : '#94a3b8' }}
                  onClick={() => { item.onClick?.(); setOpen(false) }}>
                  {item.icon && <item.icon size={13} />}{item.label}
                </button>
              )
            )}
          </div>
        </>
      )}
    </div>
  )
}

// ── Shared fact slide-out data (mirrors TruthPlaneDetail) ────────────────────

const entityConfig = {
  ORGANIZATION: { icon: Building2, color: '#60a5fa', bg: 'rgba(59,130,246,0.1)'  },
  DATE:         { icon: Calendar,  color: '#a78bfa', bg: 'rgba(124,92,252,0.1)'  },
  AMOUNT:       { icon: DollarSign,color: '#4ade80', bg: 'rgba(34,197,94,0.1)'   },
  LOCATION:     { icon: MapPin,    color: '#f87171', bg: 'rgba(239,68,68,0.1)'   },
  PERSON:       { icon: User,      color: '#fbbf24', bg: 'rgba(245,158,11,0.1)'  },
  REFERENCE:    { icon: Hash,      color: '#2dd4bf', bg: 'rgba(20,184,166,0.1)'  },
}

const FACT_ENTITIES = [
  { type: 'ORGANIZATION', value: 'Acme Corporation'  },
  { type: 'DATE',         value: 'December 31, 2025' },
  { type: 'AMOUNT',       value: '$2,500,000'         },
  { type: 'LOCATION',     value: 'New York, NY'       },
  { type: 'PERSON',       value: 'John Smith'         },
  { type: 'REFERENCE',    value: 'Section 4.2.1'      },
]

const FACT_CONTEXT = {
  'TF-0001': 'Governs service availability commitments in cloud infrastructure contracts. Defines the measurement window, exclusions (maintenance, force majeure), and remedies for non-compliance such as service credits.',
  'TF-0002': 'Governs billing structure and payment schedule for enterprise contracts. Sets the invoice cadence, installment amounts, and due-date window to maintain financial predictability.',
  'TF-0003': 'Governs contract continuation and termination rights. Defines the notice period required to prevent automatic renewal and the consequences of missing that window.',
  'TF-0004': 'Governs payment timelines and late-payment penalties across enterprise and SMB contracts. Sets the standard terms and the interest rate applied to overdue invoices.',
  'TF-0005': 'Governs vendor response-time obligations for technical support. Specifies SLA tiers, availability windows, and priority escalation thresholds.',
  'TF-0006': 'Governs data residency to satisfy GDPR and regional sovereignty requirements. Restricts storage locations to EU-based data centers regardless of operational geography.',
  'TF-0007': 'Governs ownership of work product and innovations developed under the agreement. Prevents IP disputes by establishing clear title at the point of creation, protecting both parties from unintended assignments.',
  'TF-0008': 'Governs the data lifecycle from creation to deletion. Ensures regulatory compliance with retention mandates while defining a clear off-boarding procedure that protects Customer data rights post-termination.',
  'TF-0009': 'Governs the handling and protection of sensitive business information exchanged during the engagement. Establishes mutual obligations that survive contract termination to protect trade secrets and strategic data.',
  'TF-0010': 'Governs pricing entitlements for enterprise-tier customers. Defines the threshold and mechanics of volume discounts to ensure consistent application across renewal cycles and sales motions.',
  'TF-0011': 'Governs the permissible scope of software usage rights. Prevents unauthorized distribution or resale that could dilute licensing revenue and create competitive or compliance exposure.',
  'TF-0012': 'Governs financial exposure for both parties in the event of claims or damages. Sets a predictable ceiling based on contract value to enable appropriate risk allocation and insurance planning.',
  'TF-0013': 'Governs obligations during extraordinary disruptions outside a party\'s control. Establishes notification requirements and liability carve-outs to maintain equitable treatment during systemic events.',
  'TF-0014': 'Governs which legal system adjudicates disputes and where proceedings must occur. Establishes predictability for both parties in the event of a legal conflict, reducing jurisdictional uncertainty.',
  'TF-0015': 'Governs mandatory breach disclosure timelines to meet regulatory obligations. Ensures Customer can take timely protective action and that regulatory deadlines such as GDPR 72-hour notification are met.',
}

const EVIDENCE_BY_FACT = {
  'TF-0001': [
    { id: 'CL-0041', title: 'Uptime SLA – 99.9% Monthly Guarantee',   doc: 'Q1 Sales Contract - Acme Corp',        bundle: 'BDL-003', confidence: 97, risk: 'Low',    polarity: '+' },
    { id: 'CL-0042', title: 'Monthly Measurement Period Definition',    doc: 'Q1 Sales Contract - Acme Corp',        bundle: 'BDL-003', confidence: 95, risk: 'Low',    polarity: '+' },
    { id: 'CL-0043', title: 'Maintenance Window Exclusion Clause',      doc: 'Infrastructure Services Agreement v2', bundle: 'BDL-007', confidence: 91, risk: 'Medium', polarity: '−' },
  ],
  'TF-0002': [
    { id: 'CL-0011', title: 'Annual Contract Value $120,000',           doc: 'Q1 Sales Contract - Acme Corp',        bundle: 'BDL-001', confidence: 98, risk: 'Low',    polarity: '+' },
    { id: 'CL-0012', title: 'Quarterly Installment Schedule',           doc: 'Q1 Sales Contract - Acme Corp',        bundle: 'BDL-001', confidence: 96, risk: 'Low',    polarity: '+' },
  ],
  'TF-0003': [
    { id: 'CL-0021', title: 'Auto-Renewal Default Clause',              doc: 'Master Services Agreement 2024',       bundle: 'BDL-002', confidence: 94, risk: 'Medium', polarity: '−' },
    { id: 'CL-0022', title: '60-Day Non-Renewal Notice Requirement',    doc: 'Master Services Agreement 2024',       bundle: 'BDL-002', confidence: 92, risk: 'Medium', polarity: '+' },
    { id: 'CL-0023', title: 'Successive One-Year Term Definition',      doc: 'Enterprise Contract Template v3',      bundle: 'BDL-005', confidence: 89, risk: 'Medium', polarity: '+' },
    { id: 'CL-0024', title: 'Written Notice Delivery Method',           doc: 'Enterprise Contract Template v3',      bundle: 'BDL-005', confidence: 85, risk: 'Medium', polarity: '+' },
    { id: 'CL-0025', title: 'Expiration Date Anchor for Notice Window', doc: 'Legal Addendum B – Renewals',          bundle: 'BDL-009', confidence: 82, risk: 'High',   polarity: '−' },
  ],
  'TF-0004': [
    { id: 'CL-0031', title: 'Net-30 Payment Term – Enterprise',         doc: 'Payment Terms Policy 2024',            bundle: 'BDL-004', confidence: 90, risk: 'High',   polarity: '+' },
    { id: 'CL-0032', title: '1.5% Monthly Late Payment Penalty',        doc: 'Payment Terms Policy 2024',            bundle: 'BDL-004', confidence: 88, risk: 'High',   polarity: '−' },
    { id: 'CL-0033', title: 'Maximum Statutory Rate Override',          doc: 'Finance Compliance Addendum',          bundle: 'BDL-006', confidence: 86, risk: 'High',   polarity: '−' },
    { id: 'CL-0034', title: 'Net-15 Payment Term – SMB',                doc: 'SMB Contract Template v2',             bundle: 'BDL-008', confidence: 83, risk: 'Medium', polarity: '+' },
  ],
  'TF-0005': [
    { id: 'CL-0051', title: '24/7 Technical Support Availability',      doc: 'Support SLA Agreement 2023',           bundle: 'BDL-010', confidence: 87, risk: 'Medium', polarity: '+' },
  ],
  'TF-0006': [
    { id: 'CL-0061', title: 'EU-Only Data Center Residency',            doc: 'GDPR Data Processing Agreement',       bundle: 'BDL-011', confidence: 97, risk: 'Low',    polarity: '+' },
    { id: 'CL-0062', title: 'GDPR Compliance Data Sovereignty Clause',  doc: 'GDPR Data Processing Agreement',       bundle: 'BDL-011', confidence: 96, risk: 'Low',    polarity: '+' },
    { id: 'CL-0063', title: 'Cross-Border Transfer Restriction',        doc: 'EU Standard Contractual Clauses 2024', bundle: 'BDL-012', confidence: 95, risk: 'Low',    polarity: '+' },
    { id: 'CL-0064', title: 'Data Sovereignty Audit Rights',            doc: 'GDPR Data Processing Agreement',       bundle: 'BDL-011', confidence: 91, risk: 'Low',    polarity: '+' },
    { id: 'CL-0065', title: 'Controller-Processor Responsibility Scope',doc: 'EU Standard Contractual Clauses 2024', bundle: 'BDL-012', confidence: 88, risk: 'Low',    polarity: '+' },
    { id: 'CL-0066', title: 'Incident Notification Window for Breaches',doc: 'EU Standard Contractual Clauses 2024', bundle: 'BDL-012', confidence: 84, risk: 'Low',    polarity: '+' },
  ],
  'TF-0007': [
    { id: 'CL-0071', title: 'Work-For-Hire IP Assignment Clause',       doc: 'Master Services Agreement 2024',       bundle: 'BDL-002', confidence: 99, risk: 'Low',    polarity: '+' },
    { id: 'CL-0072', title: 'Pre-Existing IP Carve-Out Definition',     doc: 'IP Rights Addendum 2024',              bundle: 'BDL-013', confidence: 97, risk: 'Low',    polarity: '+' },
    { id: 'CL-0073', title: 'Joint Development Ownership Protocol',     doc: 'IP Rights Addendum 2024',              bundle: 'BDL-013', confidence: 94, risk: 'Low',    polarity: '+' },
  ],
  'TF-0008': [
    { id: 'CL-0081', title: '7-Year Minimum Retention Requirement',     doc: 'Data Governance Policy v3',            bundle: 'BDL-014', confidence: 97, risk: 'Low',    polarity: '+' },
    { id: 'CL-0082', title: '90-Day Post-Termination Deletion SLA',     doc: 'Data Governance Policy v3',            bundle: 'BDL-014', confidence: 96, risk: 'Low',    polarity: '+' },
    { id: 'CL-0083', title: 'Written Request Requirement for Deletion', doc: 'GDPR Data Processing Agreement',       bundle: 'BDL-011', confidence: 95, risk: 'Low',    polarity: '+' },
    { id: 'CL-0084', title: 'Audit-Ready Retention Log Obligation',     doc: 'Data Governance Policy v3',            bundle: 'BDL-014', confidence: 91, risk: 'Low',    polarity: '+' },
  ],
  'TF-0009': [
    { id: 'CL-0091', title: 'Mutual NDA Scope and Definition',          doc: 'Master Services Agreement 2024',       bundle: 'BDL-002', confidence: 98, risk: 'Low',    polarity: '+' },
    { id: 'CL-0092', title: '5-Year Post-Term Confidentiality Period',  doc: 'NDA Addendum 2024',                    bundle: 'BDL-015', confidence: 97, risk: 'Low',    polarity: '+' },
  ],
  'TF-0010': [
    { id: 'CL-0101', title: '$100K ACV Enterprise Tier Threshold',      doc: 'Pricing Policy 2024',                  bundle: 'BDL-016', confidence: 95, risk: 'Low',    polarity: '+' },
    { id: 'CL-0102', title: '20% Volume Discount at Renewal',           doc: 'Pricing Policy 2024',                  bundle: 'BDL-016', confidence: 95, risk: 'Low',    polarity: '+' },
    { id: 'CL-0103', title: 'Payment Compliance Prerequisite Clause',   doc: 'Enterprise Contract Template v3',      bundle: 'BDL-005', confidence: 93, risk: 'Low',    polarity: '+' },
  ],
  'TF-0011': [
    { id: 'CL-0111', title: 'Internal Use Only License Scope',          doc: 'Software License Agreement v2',        bundle: 'BDL-017', confidence: 94, risk: 'Low',    polarity: '+' },
    { id: 'CL-0112', title: 'Non-Transferability Prohibition',          doc: 'Software License Agreement v2',        bundle: 'BDL-017', confidence: 93, risk: 'Low',    polarity: '+' },
    { id: 'CL-0113', title: 'Written Consent Requirement for Resale',   doc: 'Software License Agreement v2',        bundle: 'BDL-017', confidence: 91, risk: 'Low',    polarity: '+' },
  ],
  'TF-0012': [
    { id: 'CL-0121', title: '12-Month Fee Cap on Total Liability',      doc: 'Master Services Agreement 2024',       bundle: 'BDL-002', confidence: 93, risk: 'Low',    polarity: '+' },
    { id: 'CL-0122', title: 'Mutual Indemnification Obligations',       doc: 'Master Services Agreement 2024',       bundle: 'BDL-002', confidence: 92, risk: 'Low',    polarity: '+' },
    { id: 'CL-0123', title: 'Third-Party IP Infringement Exclusion',    doc: 'Legal Addendum B – Renewals',          bundle: 'BDL-009', confidence: 90, risk: 'Low',    polarity: '+' },
    { id: 'CL-0124', title: 'Gross Negligence Carve-Out Clause',        doc: 'Master Services Agreement 2024',       bundle: 'BDL-002', confidence: 88, risk: 'Low',    polarity: '+' },
    { id: 'CL-0125', title: 'Consequential Damages Waiver',             doc: 'Master Services Agreement 2024',       bundle: 'BDL-002', confidence: 87, risk: 'Low',    polarity: '+' },
  ],
  'TF-0013': [
    { id: 'CL-0131', title: 'Force Majeure Event Definition',           doc: 'Master Services Agreement 2024',       bundle: 'BDL-002', confidence: 92, risk: 'Low',    polarity: '+' },
    { id: 'CL-0132', title: '48-Hour Notification Obligation',          doc: 'Master Services Agreement 2024',       bundle: 'BDL-002', confidence: 91, risk: 'Low',    polarity: '+' },
  ],
  'TF-0014': [
    { id: 'CL-0141', title: 'Delaware Governing Law Designation',       doc: 'Master Services Agreement 2024',       bundle: 'BDL-002', confidence: 91, risk: 'Low',    polarity: '+' },
    { id: 'CL-0142', title: 'Binding Arbitration Requirement',          doc: 'Dispute Resolution Addendum 2024',     bundle: 'BDL-018', confidence: 90, risk: 'Low',    polarity: '+' },
    { id: 'CL-0143', title: 'New York Arbitration Venue Clause',        doc: 'Dispute Resolution Addendum 2024',     bundle: 'BDL-018', confidence: 89, risk: 'Low',    polarity: '+' },
  ],
  'TF-0015': [
    { id: 'CL-0151', title: '72-Hour Breach Notification Requirement',  doc: 'Security Incident Response Policy',    bundle: 'BDL-019', confidence: 97, risk: 'Low',    polarity: '+' },
    { id: 'CL-0152', title: '14-Day Full Incident Report Obligation',   doc: 'Security Incident Response Policy',    bundle: 'BDL-019', confidence: 96, risk: 'Low',    polarity: '+' },
    { id: 'CL-0153', title: 'Scope of "Confirmed Breach" Definition',   doc: 'GDPR Data Processing Agreement',       bundle: 'BDL-011', confidence: 94, risk: 'Low',    polarity: '+' },
    { id: 'CL-0154', title: 'Regulatory Disclosure Coordination Right', doc: 'Security Incident Response Policy',    bundle: 'BDL-019', confidence: 92, risk: 'Low',    polarity: '+' },
  ],
}

function ConfidenceBar({ value, risk }) {
  const color = risk === 'Low' ? '#4ade80' : risk === 'Medium' ? '#fbbf24' : '#f87171'
  return (
    <div className="flex items-center gap-2 mt-1">
      <div className="flex-1 rounded-full overflow-hidden" style={{ height: 4, background: 'rgba(255,255,255,0.08)' }}>
        <div className="h-full rounded-full transition-all" style={{ width: `${value}%`, background: color }} />
      </div>
      <span className="text-[10px] font-semibold shrink-0" style={{ color }}>{value}%</span>
    </div>
  )
}

// ── Fact preview slide-out ─────────────────────────────────────────────────────

function FactPreviewSlideOut({ fact, onClose, onOpenInTruthPlane }) {
  const gov      = factGovernance[fact.id] || {}
  const fs       = FACT_STATUS[fact.status] || FACT_STATUS.pending
  const evidence = (EVIDENCE_BY_FACT[fact.id] || []).sort((a, b) => b.confidence - a.confidence)
  const context  = FACT_CONTEXT[fact.id] || 'Context not available for this fact.'

  const [tab, setTab] = useState('Overview')

  const sigColor = (c) => ({
    green:  ['rgba(34,197,94,0.08)',   'rgba(34,197,94,0.2)',   '#4ade80'],
    amber:  ['rgba(245,158,11,0.08)',  'rgba(245,158,11,0.2)',  '#fbbf24'],
    red:    ['rgba(239,68,68,0.08)',   'rgba(239,68,68,0.2)',   '#f87171'],
    purple: ['rgba(124,92,252,0.08)',  'rgba(124,92,252,0.2)',  '#a78bfa'],
  }[c] || ['rgba(71,85,105,0.15)', 'rgba(71,85,105,0.3)', '#94a3b8'])

  return (
    <SlideOut
      title={fact.title}
      subtitle={null}
      badges={[
        { label: fact.id,  variant: 'gray' },
        { label: fs.label, variant: fact.status === 'verified' ? 'verified' : fact.status === 'conflict' ? 'conflict' : 'pending' },
        { label: fact.tag, variant: 'gray' },
      ]}
      onClose={onClose}
      actions={
        <button className="btn-ghost p-1.5" title="Open in Truth Plane" onClick={onOpenInTruthPlane}>
          <ExternalLink size={13} />
        </button>
      }>

      <TabBar
        tabs={['Overview', `Evidence (${evidence.length})`, 'Details']}
        active={tab}
        onChange={setTab} />

      {/* ── OVERVIEW ── */}
      {tab === 'Overview' && (
        <div className="mt-4 space-y-4">

          {/* Verified truth statement */}
          <div className="rounded-xl p-4"
            style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.25)' }}>
            <div className="flex items-center gap-1.5 mb-2">
              <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 text-[8px] font-bold text-white"
                style={{ background: '#3b82f6' }}>V</div>
              <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#60a5fa' }}>
                Verified Truth Statement
              </p>
            </div>
            <p className="text-sm font-medium text-text-primary leading-relaxed">
              {fact.text?.replace(/"/g, '')}
            </p>
          </div>

          {/* What this governs */}
          <div className="glass-card p-3.5">
            <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-1.5">
              What this governs
            </p>
            <p className="text-xs text-text-muted leading-relaxed">{context}</p>
          </div>

          {/* Signals — 6-cell grid matching Truth Plane */}
          <div>
            <p className="section-label mb-2">Signals</p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Confidence', value: `${fact.confidence}%`,
                  color: fact.confidence >= 90 ? 'green' : fact.confidence >= 70 ? 'amber' : 'red' },
                { label: 'Risk',       value: fact.risk,
                  color: fact.risk === 'Low' ? 'green' : fact.risk === 'Medium' ? 'amber' : 'red' },
                { label: 'Polarity',   value: fact.polarity === '+' ? 'Positive' : 'Negative',
                  color: fact.polarity === '+' ? 'green' : 'red' },
                { label: 'Valid From', value: 'Jan 10, 2024',  color: 'purple' },
                { label: 'Valid To',   value: fact.expired ? 'Expired' : 'Dec 31, 2025',
                  color: fact.expired ? 'red' : 'purple' },
                { label: 'Last Review',value: fact.time,       color: 'purple' },
              ].map(({ label, value, color }) => {
                const [bg, border, c] = sigColor(color)
                return (
                  <div key={label} className="rounded-lg p-2.5"
                    style={{ background: bg, border: `1px solid ${border}` }}>
                    <p className="text-[9px] text-text-muted mb-1">{label}</p>
                    <p className="text-xs font-bold leading-tight" style={{ color: c }}>{value}</p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Attestation snapshot */}
          <GovernanceSnapshot gov={gov} />

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <button
              className="flex-1 btn-primary gap-1.5 text-xs justify-center"
              style={{ background: 'linear-gradient(135deg,#7c3aed,#6d28d9)', border: '1px solid rgba(124,58,237,0.5)' }}
              onClick={onOpenInTruthPlane}>
              <Sparkles size={12} /> Propose Change
            </button>
            <button
              className="flex-1 text-xs py-2 px-3 rounded-lg font-medium transition-all flex items-center justify-center gap-1.5"
              style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.22)', color: '#f87171' }}
              onClick={onOpenInTruthPlane}>
              ⊗ Break Glass
            </button>
          </div>
        </div>
      )}

      {/* ── EVIDENCE ── */}
      {tab.startsWith('Evidence') && (
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="section-label">Source Claims</p>
            <span className="text-[10px] text-text-muted">
              {evidence.length} claim{evidence.length !== 1 ? 's' : ''} · ranked by confidence
            </span>
          </div>

          {evidence.length === 0 ? (
            <p className="text-xs text-text-muted italic py-4 text-center">
              No evidence linked to this fact yet.
            </p>
          ) : evidence.map((c, i) => (
            <div key={c.id} className="glass-card p-3">
              <div className="flex items-start gap-2.5">
                {/* Rank badge */}
                <div className="w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 text-[9px] font-bold"
                  style={{
                    background: i === 0 ? 'rgba(167,139,250,0.2)' : 'rgba(255,255,255,0.06)',
                    color:      i === 0 ? '#a78bfa' : '#64748b',
                    border:    `1px solid ${i === 0 ? 'rgba(167,139,250,0.3)' : 'rgba(255,255,255,0.08)'}`,
                  }}>
                  #{i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[9px] font-mono text-text-muted">{c.id}</span>
                    <p className="text-xs font-medium text-text-primary leading-snug">{c.title}</p>
                  </div>
                  <ConfidenceBar value={c.confidence} risk={c.risk} />
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <span className="text-[10px] text-text-muted truncate max-w-[130px]" title={c.doc}>
                      {c.doc}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded"
                      style={{ background: 'rgba(124,92,252,0.1)', color: '#a78bfa', border: '1px solid rgba(124,92,252,0.2)' }}>
                      {c.bundle}
                    </span>
                    <span className="text-[10px] font-semibold ml-auto"
                      style={{ color: c.polarity === '+' ? '#4ade80' : '#f87171' }}>
                      {c.polarity === '+' ? '+ Positive' : '− Negative'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── DETAILS ── */}
      {tab === 'Details' && (
        <div className="mt-4 space-y-5">

          {/* Governance trail */}
          <div>
            <p className="section-label mb-3">Governance Trail</p>
            <GovernanceTimeline gov={gov} />
          </div>

          {/* Plane metadata */}
          <div>
            <p className="section-label mb-2">Plane Metadata</p>
            <div className="space-y-0">
              {[
                ['Owner',  'Sales'],
                ['Scope',  'Workspace'],
                ['State',  fact.status === 'verified' ? 'Verified' : fact.status === 'pending' ? 'Pending Review' : 'In Conflict'],
                ['Expiry', fact.expiry],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between items-center py-2.5"
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <span className="text-xs text-text-muted">{k}</span>
                  <span className="text-xs font-medium text-text-secondary">{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Extracted entities */}
          <div>
            <p className="section-label mb-2">Extracted Entities</p>
            <div className="grid grid-cols-2 gap-1.5">
              {FACT_ENTITIES.map(({ type, value }) => {
                const cfg  = entityConfig[type]
                const Icon = cfg.icon
                return (
                  <div key={type} className="rounded-lg px-3 py-2"
                    style={{ background: cfg.bg, border: `1px solid ${cfg.color}20` }}>
                    <div className="flex items-center gap-1 mb-0.5">
                      <Icon size={10} style={{ color: cfg.color }} />
                      <p className="text-[9px] font-semibold uppercase tracking-wider"
                        style={{ color: cfg.color, opacity: 0.7 }}>{type}</p>
                    </div>
                    <p className="text-xs font-medium" style={{ color: cfg.color }}>{value}</p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Open in Truth Plane CTA */}
          <button
            className="w-full btn-secondary gap-1.5 justify-center text-xs"
            onClick={onOpenInTruthPlane}>
            <ExternalLink size={12} /> Open in Truth Plane
          </button>
        </div>
      )}
    </SlideOut>
  )
}

// ── Add Facts Panel ───────────────────────────────────────────────────────────
// Right-side curation panel: browse Truth Plane facts and add to this pack

function AddFactsPanel({ currentFactIds, onClose, onAdd }) {
  const [search,       setSearch]       = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [expiryFilter, setExpiryFilter] = useState('All')
  const [sourceFilter, setSourceFilter] = useState('All')
  const [riskFilter,   setRiskFilter]   = useState('All')
  const [selected,     setSelected]     = useState(new Set())
  const [previewFact,  setPreviewFact]  = useState(null)
  const [showAllFilters, setShowAllFilters] = useState(false)

  // All source tags available
  const sources = useMemo(() => [...new Set(truthFacts.map(f => f.tag))], [])

  // Facts not already in the pack
  const available = useMemo(
    () => truthFacts.filter(f => !currentFactIds.includes(f.id)),
    [currentFactIds]
  )

  // Apply filters
  const filtered = useMemo(() => available.filter(f => {
    if (statusFilter !== 'All' && f.status !== statusFilter.toLowerCase()) return false
    if (expiryFilter === 'Expired'    && !f.expired) return false
    if (expiryFilter === 'Active only' &&  f.expired) return false
    if (sourceFilter !== 'All' && f.tag !== sourceFilter) return false
    if (riskFilter   !== 'All' && f.risk !== riskFilter)  return false
    if (search.trim()) {
      const q = search.toLowerCase()
      if (!f.title.toLowerCase().includes(q) &&
          !f.id.toLowerCase().includes(q) &&
          !(f.text?.toLowerCase().includes(q)))
        return false
    }
    return true
  }), [available, statusFilter, expiryFilter, sourceFilter, riskFilter, search])

  const allSelected = filtered.length > 0 && selected.size === filtered.length

  const toggleSelect  = (id) => setSelected(prev => {
    const s = new Set(prev)
    s.has(id) ? s.delete(id) : s.add(id)
    return s
  })

  const toggleAll = () =>
    setSelected(allSelected ? new Set() : new Set(filtered.map(f => f.id)))

  const clearFilters = () => {
    setStatusFilter('All')
    setExpiryFilter('All')
    setSourceFilter('All')
    setRiskFilter('All')
  }

  const activeFilterCount = [statusFilter, expiryFilter, sourceFilter, riskFilter].filter(v => v !== 'All').length

  const handleAdd = () => {
    onAdd([...selected])
    onClose()
  }

  // Pill helper for AllFilters
  const FilterPill = ({ val, active, onClick }) => (
    <button
      onClick={onClick}
      className="text-[11px] px-3 py-1.5 rounded-full font-medium transition-all"
      style={active
        ? { background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.4)', color: '#4ade80' }
        : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#64748b' }}>
      {val}
    </button>
  )

  return createPortal(
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-[9998] bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <aside className="fixed right-0 top-0 h-full z-[9999] flex flex-col"
        style={{ width: '70vw', background: 'var(--slideout-bg)', borderLeft: '1px solid var(--slideout-border)' }}>

        {/* ── Header ── */}
        <div className="px-5 py-4 flex items-start justify-between shrink-0"
          style={{ borderBottom: '1px solid var(--slideout-border)' }}>
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg mt-0.5" style={{ background: 'rgba(34,197,94,0.12)' }}>
              <Shield size={15} style={{ color: '#22c55e' }} />
            </div>
            <div>
              <p className="text-sm font-semibold text-text-primary leading-tight">Add Facts to Truth Pack</p>
              <p className="text-xs text-text-muted mt-0.5">Browse verified facts from your Truth Planes and curate them into this pack</p>
            </div>
          </div>
          <button onClick={onClose} className="btn-ghost p-1.5 shrink-0"><X size={14} /></button>
        </div>

        {/* ── Filter bar ── */}
        <div className="px-5 pt-3 pb-3 space-y-2.5 shrink-0"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>

          {/* Search */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg"
            style={{ background: 'var(--input-bg)', border: '1px solid var(--input-border)' }}>
            <Search size={13} className="text-text-muted shrink-0" />
            <input
              className="bg-transparent text-xs text-text-secondary outline-none flex-1 placeholder:text-text-muted"
              placeholder="Search by fact name, ID, or content…"
              value={search}
              onChange={e => setSearch(e.target.value)} />
            {search && (
              <button onClick={() => setSearch('')} className="text-text-muted hover:text-text-secondary">
                <X size={11} />
              </button>
            )}
          </div>

          {/* Quick filter row */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Status */}
            <select className="input-base text-xs px-3 py-1.5" style={{ width: 'auto' }}
              value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="All">All Status</option>
              <option value="verified">Verified</option>
              <option value="pending">Pending</option>
              <option value="conflict">Conflict</option>
            </select>

            {/* Expiration */}
            <select className="input-base text-xs px-3 py-1.5" style={{ width: 'auto' }}
              value={expiryFilter} onChange={e => setExpiryFilter(e.target.value)}>
              <option value="All">All Expiration</option>
              <option value="Active only">Active only</option>
              <option value="Expired">Expired</option>
            </select>

            {/* Source tag */}
            <select className="input-base text-xs px-3 py-1.5" style={{ width: 'auto' }}
              value={sourceFilter} onChange={e => setSourceFilter(e.target.value)}>
              <option value="All">All Sources</option>
              {sources.map(s => <option key={s} value={s}>{s}</option>)}
            </select>

            {/* All Filters */}
            <button
              className="btn-secondary gap-1.5 text-xs ml-auto shrink-0"
              onClick={() => setShowAllFilters(true)}
              style={activeFilterCount > 0 ? { borderColor: 'rgba(34,197,94,0.4)', color: '#4ade80' } : {}}>
              <Filter size={12} />
              All Filters
              {activeFilterCount > 0 && (
                <span className="ml-0.5 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center"
                  style={{ background: 'rgba(34,197,94,0.2)', color: '#4ade80' }}>
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          {/* Row count + select all */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              {/* Custom checkbox */}
              <div
                className="w-3.5 h-3.5 rounded flex items-center justify-center cursor-pointer transition-all"
                style={{
                  background:    allSelected ? '#22c55e' : 'rgba(255,255,255,0.06)',
                  border: `1.5px solid ${allSelected ? '#22c55e' : 'rgba(255,255,255,0.2)'}`,
                }}
                onClick={toggleAll}>
                {allSelected && (
                  <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                    <path d="M1 3L3 5L7 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
              <span className="text-[11px] text-text-muted">
                <span className="font-medium text-text-secondary">{filtered.length}</span> fact{filtered.length !== 1 ? 's' : ''} available
                {currentFactIds.length > 0 && (
                  <span className="opacity-50 ml-1">· {currentFactIds.length} already in pack</span>
                )}
              </span>
            </label>
            {selected.size > 0 && (
              <span className="flex items-center gap-1 text-[11px] font-semibold" style={{ color: '#4ade80' }}>
                <CheckCircle size={11} /> {selected.size} selected
              </span>
            )}
          </div>
        </div>

        {/* ── Fact list ── */}
        <div className="flex-1 overflow-y-auto px-5 py-3 space-y-2">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 gap-3">
              <Shield size={28} className="text-text-muted opacity-15" />
              <p className="text-sm text-text-muted">No facts match your filters</p>
              {activeFilterCount > 0 && (
                <button className="btn-secondary text-xs gap-1.5" onClick={clearFilters}>
                  <X size={11} /> Clear filters
                </button>
              )}
            </div>
          ) : filtered.map(fact => {
            const fs         = FACT_STATUS[fact.status] || FACT_STATUS.pending
            const isSelected = selected.has(fact.id)

            return (
              <div key={fact.id}
                className="relative rounded-xl px-4 py-3.5 cursor-pointer transition-all"
                style={{
                  background:  isSelected ? 'rgba(34,197,94,0.06)' : 'rgba(255,255,255,0.025)',
                  border:      `1px solid ${isSelected ? 'rgba(34,197,94,0.35)' : 'rgba(255,255,255,0.07)'}`,
                  borderLeft:  `3px solid ${isSelected ? '#22c55e' : fs.color}`,
                }}
                onClick={() => toggleSelect(fact.id)}>

                <div className="flex items-start gap-3">

                  {/* Custom checkbox */}
                  <div className="mt-0.5 shrink-0">
                    <div
                      className="w-4 h-4 rounded transition-all flex items-center justify-center"
                      style={{
                        background: isSelected ? '#22c55e' : 'rgba(255,255,255,0.06)',
                        border: `1.5px solid ${isSelected ? '#22c55e' : 'rgba(255,255,255,0.18)'}`,
                      }}>
                      {isSelected && (
                        <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                          <path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>
                  </div>

                  {/* Status icon */}
                  <div className="p-1.5 rounded-lg shrink-0 mt-0.5" style={{ background: `${fs.color}12` }}>
                    {fact.status === 'verified'
                      ? <CheckCircle  size={13} style={{ color: fs.color }} />
                      : fact.status === 'conflict'
                      ? <AlertTriangle size={13} style={{ color: fs.color }} />
                      : <Clock        size={13} style={{ color: fs.color }} />}
                  </div>

                  <div className="flex-1 min-w-0">

                    {/* Meta badges row */}
                    <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                      <span className="text-[10px] font-mono text-text-muted">{fact.id}</span>
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                        style={{ background: fs.bg, border: `1px solid ${fs.border}`, color: fs.color }}>
                        {fs.label}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded font-medium"
                        style={{ background: 'rgba(124,92,252,0.1)', color: '#a78bfa', border: '1px solid rgba(124,92,252,0.2)' }}>
                        {fact.tag}
                      </span>
                      {fact.expired && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded"
                          style={{ background: 'rgba(239,68,68,0.08)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' }}>
                          Expired
                        </span>
                      )}
                      <span className="text-[10px] text-text-muted ml-auto">{fact.time}</span>
                    </div>

                    {/* Title */}
                    <p className="text-sm font-semibold text-text-primary mb-1 leading-snug">{fact.title}</p>

                    {/* Description */}
                    <p className="text-xs text-text-muted italic line-clamp-2 mb-2.5 leading-relaxed">
                      {fact.text?.replace(/"/g, '')}
                    </p>

                    {/* Footer: signals + Preview */}
                    <div className="flex items-center gap-3 text-[11px]">
                      <span className="flex items-center gap-1 text-text-muted">
                        <FileText size={9} /> {fact.sources} source{fact.sources !== 1 ? 's' : ''}
                      </span>
                      <span style={{ color: fact.confidence >= 90 ? '#4ade80' : fact.confidence >= 70 ? '#fbbf24' : '#f87171' }}>
                        {fact.confidence}% confidence
                      </span>
                      <span style={{ color: fact.risk === 'Low' ? '#4ade80' : fact.risk === 'Medium' ? '#fbbf24' : '#f87171' }}>
                        {fact.risk} risk
                      </span>
                      <button
                        className="ml-auto flex items-center gap-1 text-[10px] px-2.5 py-1 rounded-lg font-medium hover:brightness-110 transition-all shrink-0"
                        style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)', color: '#60a5fa' }}
                        onClick={e => { e.stopPropagation(); setPreviewFact(fact) }}>
                        <Eye size={9} /> Preview
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* ── Footer ── */}
        <div className="px-5 py-4 flex items-center gap-3 shrink-0"
          style={{ borderTop: '1px solid var(--slideout-border)', background: 'var(--slideout-bg)' }}>
          {selected.size > 0 ? (
            <div className="flex items-center gap-1.5 mr-auto">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#22c55e' }} />
              <span className="text-[11px] text-text-secondary">
                <span className="font-semibold" style={{ color: '#4ade80' }}>{selected.size}</span> fact{selected.size !== 1 ? 's' : ''} ready to add
              </span>
            </div>
          ) : (
            <p className="text-[11px] text-text-muted mr-auto">Select facts to curate them into this pack</p>
          )}
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button
            className="btn-primary gap-1.5"
            disabled={selected.size === 0}
            style={selected.size === 0 ? { opacity: 0.38, cursor: 'not-allowed' } : {}}
            onClick={handleAdd}>
            <Plus size={13} />
            {selected.size > 0 ? `Add ${selected.size} Fact${selected.size !== 1 ? 's' : ''}` : 'Add Facts'}
          </button>
        </div>
      </aside>

      {/* ── All Filters slide-out (layers on top) ── */}
      {showAllFilters && (
        <AllFiltersPanel
          onClose={() => setShowAllFilters(false)}
          onClear={clearFilters}>
          <FilterSection label="Status">
            {['All', 'verified', 'pending', 'conflict'].map(v => (
              <FilterPill key={v} val={v === 'All' ? 'All' : v.charAt(0).toUpperCase() + v.slice(1)}
                active={statusFilter === v}
                onClick={() => setStatusFilter(v)} />
            ))}
          </FilterSection>
          <FilterSection label="Expiration">
            {['All', 'Active only', 'Expired'].map(v => (
              <FilterPill key={v} val={v} active={expiryFilter === v} onClick={() => setExpiryFilter(v)} />
            ))}
          </FilterSection>
          <FilterSection label="Risk Level">
            {['All', 'Low', 'Medium', 'High'].map(v => (
              <FilterPill key={v} val={v} active={riskFilter === v} onClick={() => setRiskFilter(v)} />
            ))}
          </FilterSection>
          <FilterSection label="Source / Tag">
            {['All', ...sources].map(v => (
              <FilterPill key={v} val={v} active={sourceFilter === v} onClick={() => setSourceFilter(v)} />
            ))}
          </FilterSection>
        </AllFiltersPanel>
      )}

      {/* ── Nested fact preview ── */}
      {previewFact && (
        <FactPreviewSlideOut
          fact={previewFact}
          onClose={() => setPreviewFact(null)}
          onOpenInTruthPlane={() => {}} />
      )}
    </>,
    document.body
  )
}

// ── Add Access Modal ──────────────────────────────────────────────────────────
// Reusable access-granting pattern configured per entity type

const USERS_POOL = [
  { id: 'up1', name: 'Kevin Zhang',   role: 'Data Engineer',       initials: 'KZ', gradient: 'linear-gradient(135deg,#0ea5e9,#38bdf8)' },
  { id: 'up2', name: 'Maria Santos',  role: 'Security Analyst',    initials: 'MS', gradient: 'linear-gradient(135deg,#f43f5e,#ec4899)' },
  { id: 'up3', name: 'Daniel Wright', role: 'Product Manager',     initials: 'DW', gradient: 'linear-gradient(135deg,#84cc16,#22c55e)' },
  { id: 'up4', name: 'Priya Nair',    role: 'Compliance Analyst',  initials: 'PN', gradient: 'linear-gradient(135deg,#f59e0b,#f97316)' },
  { id: 'up5', name: 'Tom Harding',   role: 'Solutions Architect', initials: 'TH', gradient: 'linear-gradient(135deg,#6366f1,#8b5cf6)' },
  { id: 'up6', name: 'Zoe Kim',       role: 'Legal Counsel',       initials: 'ZK', gradient: 'linear-gradient(135deg,#14b8a6,#2dd4bf)' },
  { id: 'up7', name: 'Carlos Mendez', role: 'Revenue Operations',  initials: 'CM', gradient: 'linear-gradient(135deg,#f87171,#fb923c)' },
]

const AGENTS_POOL = [
  { id: 'ap1', name: 'Compliance Monitor',  type: 'Compliance', model: 'Claude 3.5', purpose: 'Monitors all AI outputs for compliance rule violations in real-time' },
  { id: 'ap2', name: 'Contract Analyzer',   type: 'Legal',      model: 'Claude 3.5', purpose: 'Extracts and validates key contract terms against governed facts' },
  { id: 'ap3', name: 'Risk Scorer',         type: 'Risk',       model: 'Claude 3',   purpose: 'Assigns confidence-weighted risk scores to proposals and changes' },
  { id: 'ap4', name: 'Policy Summarizer',   type: 'Operations', model: 'Claude 3',   purpose: 'Generates plain-language summaries of governance policies for teams' },
  { id: 'ap5', name: 'Renewal Predictor',   type: 'Sales',      model: 'Claude 3.5', purpose: 'Forecasts renewal risk by analyzing contract and engagement signals' },
  { id: 'ap6', name: 'Audit Trail Agent',   type: 'Compliance', model: 'Claude 3',   purpose: 'Maintains tamper-proof audit logs of all fact access and changes' },
]

const NETWORKS_POOL = [
  { id: 'np1', name: 'Finance Automation Network', scope: 'Department',   agents: 5,  purpose: 'Automates financial policy checks, invoice review, and budget approvals' },
  { id: 'np2', name: 'Customer Success Network',   scope: 'Company-wide', agents: 9,  purpose: 'Orchestrates customer health monitoring, QBR prep, and renewal actions' },
  { id: 'np3', name: 'Procurement Intelligence',   scope: 'Department',   agents: 3,  purpose: 'Evaluates vendor proposals and sourcing decisions against policy standards' },
  { id: 'np4', name: 'Risk & Controls Network',    scope: 'Company-wide', agents: 7,  purpose: 'Runs continuous risk assessments and control checks across governed planes' },
  { id: 'np5', name: 'Engineering Governance',     scope: 'Department',   agents: 4,  purpose: 'Enforces technical standards and output quality for all engineering agents' },
]

const ACCESS_MODAL_CONFIG = {
  users: {
    title: 'Add User Access',
    subtitle: 'Grant users the ability to read or execute facts from this Truth Pack',
    searchPlaceholder: 'Search users by name or role…',
    Icon: Users,
    iconColor: '#60a5fa',
    iconBg: 'rgba(59,130,246,0.12)',
    levels: ['Read', 'Read & Execute', 'Admin'],
    defaultLevel: 'Read',
    levelDescriptions: {
      'Read':            'Can view fact metadata and statements in this pack.',
      'Read & Execute':  'Can read facts and use them in agent-driven queries.',
      'Admin':           'Full control — add/remove facts and manage access.',
    },
    noteLabel: 'Access note',
    notePlaceholder: 'Add context for this access grant (visible to admins)…',
    pool: USERS_POOL,
  },
  agents: {
    title: 'Add Agent Access',
    subtitle: 'Allow agents to query this Truth Pack within their reasoning pipelines',
    searchPlaceholder: 'Search agents by name or type…',
    Icon: Bot,
    iconColor: '#a78bfa',
    iconBg: 'rgba(124,92,252,0.12)',
    levels: ['Read', 'Execute', 'Full Access'],
    defaultLevel: 'Execute',
    levelDescriptions: {
      'Read':        'Agent can read fact data but cannot act on it.',
      'Execute':     'Agent can query facts as part of pipeline execution.',
      'Full Access': 'Unrestricted read, execute, and self-audit access.',
    },
    noteLabel: 'Scope note',
    notePlaceholder: 'Describe how this agent should use this pack…',
    pool: AGENTS_POOL,
  },
  networks: {
    title: 'Add Agentic Network',
    subtitle: 'Connect a network so all agents within it inherit access to this pack',
    searchPlaceholder: 'Search networks by name or scope…',
    Icon: Network,
    iconColor: '#2dd4bf',
    iconBg: 'rgba(20,184,166,0.12)',
    levels: ['Read', 'Execute', 'Full Access'],
    defaultLevel: 'Execute',
    levelDescriptions: {
      'Read':        'All agents in this network can read fact data.',
      'Execute':     'All agents can query facts in their execution context.',
      'Full Access': 'Unrestricted access for all agents in this network.',
    },
    noteLabel: 'Connection note',
    notePlaceholder: 'Describe the intended use of this network connection…',
    pool: NETWORKS_POOL,
  },
}

function AddAccessModal({ type, onClose, onGrant }) {
  const cfg = ACCESS_MODAL_CONFIG[type]
  const { title, subtitle, searchPlaceholder, Icon, iconColor, iconBg,
          levels, defaultLevel, levelDescriptions, noteLabel, notePlaceholder, pool } = cfg

  const [search,      setSearch]      = useState('')
  const [selected,    setSelected]    = useState(new Set())
  const [accessLevel, setAccessLevel] = useState(defaultLevel)
  const [note,        setNote]        = useState('')

  const filtered = useMemo(() => {
    if (!search.trim()) return pool
    const q = search.toLowerCase()
    return pool.filter(e =>
      e.name.toLowerCase().includes(q) ||
      e.role?.toLowerCase().includes(q) ||
      e.type?.toLowerCase().includes(q) ||
      e.scope?.toLowerCase().includes(q) ||
      e.purpose?.toLowerCase().includes(q)
    )
  }, [pool, search])

  const toggleSelect = (id) => setSelected(prev => {
    const s = new Set(prev)
    s.has(id) ? s.delete(id) : s.add(id)
    return s
  })

  const toggleAll = () =>
    setSelected(filtered.length > 0 && selected.size === filtered.length
      ? new Set()
      : new Set(filtered.map(e => e.id))
    )

  const handleGrant = () => {
    onGrant({ ids: [...selected], accessLevel, note, type })
    onClose()
  }

  const entityLabel = type === 'networks' ? 'network' : type === 'agents' ? 'agent' : 'user'
  const allSelected = filtered.length > 0 && selected.size === filtered.length

  return createPortal(
    <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-lg rounded-2xl shadow-2xl flex flex-col"
        style={{ background: 'var(--modal-bg)', border: '1px solid var(--modal-border)', maxHeight: '88vh' }}>

        {/* ── Header ── */}
        <div className="flex items-start gap-3 px-5 py-4 shrink-0"
          style={{ borderBottom: '1px solid var(--slideout-border)' }}>
          <div className="p-2 rounded-xl shrink-0" style={{ background: iconBg }}>
            <Icon size={15} style={{ color: iconColor }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-text-primary">{title}</p>
            <p className="text-[11px] text-text-muted mt-0.5 leading-snug">{subtitle}</p>
          </div>
          <button onClick={onClose} className="btn-ghost p-1.5 shrink-0 mt-0.5"><X size={14} /></button>
        </div>

        {/* ── Body ── */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 min-h-0">

          {/* Search */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg"
            style={{ background: 'var(--input-bg)', border: '1px solid var(--input-border)' }}>
            <Search size={13} className="text-text-muted shrink-0" />
            <input
              className="bg-transparent text-xs text-text-secondary outline-none flex-1 placeholder:text-text-muted"
              placeholder={searchPlaceholder}
              value={search}
              onChange={e => setSearch(e.target.value)}
              autoFocus />
            {search && (
              <button onClick={() => setSearch('')} className="text-text-muted hover:text-text-secondary">
                <X size={11} />
              </button>
            )}
          </div>

          {/* Select-all row */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <div
                className="w-3.5 h-3.5 rounded flex items-center justify-center cursor-pointer transition-all"
                style={{
                  background: allSelected ? iconColor : 'rgba(255,255,255,0.06)',
                  border: `1.5px solid ${allSelected ? iconColor : 'rgba(255,255,255,0.2)'}`,
                }}
                onClick={toggleAll}>
                {allSelected && (
                  <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                    <path d="M1 3L3 5L7 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
              <span className="text-[11px] text-text-muted">
                <span className="font-medium text-text-secondary">{filtered.length}</span> {entityLabel}{filtered.length !== 1 ? 's' : ''} available
              </span>
            </label>
            {selected.size > 0 && (
              <span className="text-[11px] font-semibold" style={{ color: iconColor }}>
                {selected.size} selected
              </span>
            )}
          </div>

          {/* Entity list */}
          <div className="space-y-1.5">
            {filtered.length === 0 ? (
              <div className="text-center py-8 text-xs text-text-muted">No results match your search</div>
            ) : filtered.map(entity => {
              const isSelected = selected.has(entity.id)
              return (
                <div key={entity.id}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all"
                  style={{
                    background: isSelected ? `${iconColor}0d` : 'rgba(255,255,255,0.02)',
                    border: `1px solid ${isSelected ? `${iconColor}40` : 'rgba(255,255,255,0.06)'}`,
                  }}
                  onClick={() => toggleSelect(entity.id)}>

                  {/* Checkbox */}
                  <div className="w-4 h-4 rounded flex items-center justify-center shrink-0 transition-all"
                    style={{
                      background: isSelected ? iconColor : 'rgba(255,255,255,0.06)',
                      border: `1.5px solid ${isSelected ? iconColor : 'rgba(255,255,255,0.18)'}`,
                    }}>
                    {isSelected && (
                      <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                        <path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>

                  {/* Avatar / icon */}
                  {type === 'users' && (
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                      style={{ background: entity.gradient }}>{entity.initials}</div>
                  )}
                  {type === 'agents' && (
                    <div className="p-1.5 rounded-lg shrink-0" style={{ background: 'rgba(124,92,252,0.12)' }}>
                      <Bot size={15} style={{ color: '#a78bfa' }} />
                    </div>
                  )}
                  {type === 'networks' && (
                    <div className="p-1.5 rounded-lg shrink-0" style={{ background: 'rgba(20,184,166,0.12)' }}>
                      <Network size={15} style={{ color: '#2dd4bf' }} />
                    </div>
                  )}

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary leading-tight">{entity.name}</p>
                    {type === 'users' && (
                      <p className="text-[11px] text-text-muted mt-0.5">{entity.role}</p>
                    )}
                    {type === 'agents' && (
                      <p className="text-[11px] text-text-muted mt-0.5">
                        <span style={{ color: '#a78bfa88' }}>{entity.type}</span> · {entity.model}
                        <span className="ml-1.5 text-text-muted opacity-60">· {entity.purpose}</span>
                      </p>
                    )}
                    {type === 'networks' && (
                      <p className="text-[11px] text-text-muted mt-0.5">
                        <span style={{ color: '#2dd4bf88' }}>{entity.scope}</span>
                        <span className="mx-1">·</span>
                        <span>{entity.agents} agents</span>
                        <span className="ml-1.5 opacity-60">· {entity.purpose}</span>
                      </p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Divider */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }} />

          {/* Access level */}
          <div>
            <p className="text-xs font-medium text-text-secondary mb-2">Access Level</p>
            <div className="flex gap-2 mb-2">
              {levels.map(level => (
                <button key={level}
                  className="flex-1 py-2 px-3 rounded-xl text-xs font-medium transition-all"
                  style={accessLevel === level
                    ? { background: `${iconColor}18`, border: `1px solid ${iconColor}55`, color: iconColor }
                    : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#64748b' }}
                  onClick={() => setAccessLevel(level)}>
                  {level}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-text-muted leading-snug">
              {levelDescriptions[accessLevel]}
            </p>
          </div>

          {/* Note */}
          <div>
            <p className="text-xs font-medium text-text-secondary mb-2">
              {noteLabel} <span className="text-text-muted font-normal opacity-60">(optional)</span>
            </p>
            <textarea
              className="input-base w-full text-xs resize-none"
              rows={2}
              placeholder={notePlaceholder}
              value={note}
              onChange={e => setNote(e.target.value)} />
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="flex items-center gap-3 px-5 py-4 shrink-0"
          style={{ borderTop: '1px solid var(--slideout-border)' }}>
          {selected.size > 0 ? (
            <div className="flex items-center gap-1.5 mr-auto">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: iconColor }} />
              <span className="text-[11px] text-text-secondary">
                <span className="font-semibold" style={{ color: iconColor }}>{selected.size}</span>
                {' '}{entityLabel}{selected.size !== 1 ? 's' : ''} · <span className="opacity-70">{accessLevel}</span>
              </span>
            </div>
          ) : (
            <p className="text-[11px] text-text-muted mr-auto">
              Select {entityLabel}s to grant access
            </p>
          )}
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button
            className="btn-primary gap-1.5"
            disabled={selected.size === 0}
            style={selected.size === 0 ? { opacity: 0.38, cursor: 'not-allowed' } : {}}
            onClick={handleGrant}>
            <CheckCircle size={13} />
            {selected.size > 0 ? `Grant Access (${selected.size})` : 'Grant Access'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}

// ── Overview sub-tab data helpers ────────────────────────────────────────────

function getWeeklyData(pack) {
  // Simulate growing access trend based on usage level
  const base = pack.usage === 'high' ? 40 : pack.usage === 'medium' ? 20 : 8
  return [
    { w: 'W1', queries: base,       users: Math.round(base * 0.6), agents: Math.round(base * 0.3) },
    { w: 'W2', queries: base + 8,   users: Math.round((base+8)*0.55), agents: Math.round((base+8)*0.35) },
    { w: 'W3', queries: base + 14,  users: Math.round((base+14)*0.5), agents: Math.round((base+14)*0.4) },
    { w: 'W4', queries: base + 22,  users: Math.round((base+22)*0.48), agents: Math.round((base+22)*0.42) },
  ]
}

function getFactHealth(pack, packFacts) {
  const verified = packFacts.filter(f => f.status === 'verified').length
  const pending  = packFacts.filter(f => f.status === 'pending').length
  const conflict = packFacts.filter(f => f.status === 'conflict').length
  const total    = packFacts.length || 1
  return {
    verified, pending, conflict, total,
    verifiedPct: Math.round((verified / total) * 100),
    avgConfidence: packFacts.length
      ? Math.round(packFacts.reduce((s, f) => s + f.confidence, 0) / packFacts.length)
      : 0,
  }
}

// ── Tab: Overview ─────────────────────────────────────────────────────────────

function OverviewTab({ pack }) {
  const [subTab, setSubTab] = useState('Analytics & Insights')

  const packFacts  = useMemo(() =>
    (pack.factIds || []).map(id => truthFacts.find(f => f.id === id)).filter(Boolean),
    [pack.factIds]
  )
  const weeklyData = useMemo(() => getWeeklyData(pack), [pack])
  const health     = useMemo(() => getFactHealth(pack, packFacts), [pack, packFacts])

  const totalConsumers = pack.usersCount + pack.agentsCount + pack.networksCount
  const usageScore     = pack.usage === 'high' ? 87 : pack.usage === 'medium' ? 54 : 21
  const usageColor     = pack.usage === 'high' ? '#4ade80' : pack.usage === 'medium' ? '#fbbf24' : '#64748b'
  const usageTrend     = pack.usage === 'high' ? '+12%' : pack.usage === 'medium' ? '+3%' : '-2%'
  const usageTrendColor= pack.usage === 'high' ? '#4ade80' : pack.usage === 'medium' ? '#4ade80' : '#f87171'

  const SUB_TABS = ['Analytics & Insights', 'Distribution Health', 'Governance & Config']

  return (
    <div className="space-y-4">

      {/* Sub-tab pills */}
      <div className="flex gap-1.5 text-xs">
        {SUB_TABS.map(t => (
          <button key={t}
            className="px-3 py-1.5 rounded-lg transition-all font-medium"
            style={subTab === t
              ? { background: 'rgba(255,255,255,0.1)', color: '#f1f5f9', border: '1px solid rgba(255,255,255,0.15)' }
              : { color: '#64748b', border: '1px solid transparent' }}
            onClick={() => setSubTab(t)}>
            {t}
          </button>
        ))}
      </div>

      {/* ── Analytics & Insights ── */}
      {subTab === 'Analytics & Insights' && (
        <>
          {/* 3 metric cards */}
          <div className="grid grid-cols-3 gap-3">

            {/* Fact Coverage */}
            <div className="glass-card p-4">
              <div className="flex items-center gap-1.5 mb-2">
                <CheckCircle size={13} style={{ color: '#22c55e' }} />
                <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">Fact Coverage</p>
                <span className="ml-auto text-[11px] font-medium" style={{ color: '#4ade80' }}>
                  {health.verifiedPct}% verified
                </span>
              </div>
              <p className="text-2xl font-bold mb-2" style={{ color: '#22c55e' }}>{pack.factsCount}</p>
              <div className="h-1 rounded-full" style={{ background: 'rgba(34,197,94,0.15)' }}>
                <div className="h-full rounded-full transition-all"
                  style={{ width: `${Math.min(health.verifiedPct, 100)}%`, background: '#22c55e' }} />
              </div>
              <p className="text-[11px] text-text-muted mt-1.5">
                {health.verified} verified · {health.pending} pending · {health.conflict} conflict
              </p>
            </div>

            {/* Consumer Breadth */}
            <div className="glass-card p-4">
              <div className="flex items-center gap-1.5 mb-2">
                <Users size={13} style={{ color: '#60a5fa' }} />
                <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">Consumer Breadth</p>
                <span className="ml-auto text-[11px] font-medium" style={{ color: usageTrendColor }}>
                  {usageTrend}
                </span>
              </div>
              <p className="text-2xl font-bold mb-2" style={{ color: '#60a5fa' }}>{totalConsumers}</p>
              <div className="flex items-center gap-2 mt-1">
                {[
                  { val: pack.usersCount,    icon: Users,   color: '#60a5fa', label: 'users'    },
                  { val: pack.agentsCount,   icon: Bot,     color: '#a78bfa', label: 'agents'   },
                  { val: pack.networksCount, icon: Network, color: '#2dd4bf', label: 'networks' },
                ].map(({ val, icon: Icon, color, label }) => (
                  <div key={label} className="flex items-center gap-1 text-[10px]" style={{ color }}>
                    <Icon size={9} /> {val} {label}
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-text-muted mt-1.5">Total entities with pack access</p>
            </div>

            {/* Usage Score */}
            <div className="glass-card p-4">
              <div className="flex items-center gap-1.5 mb-2">
                <TrendingUp size={13} style={{ color: usageColor }} />
                <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">Usage Score</p>
                {pack.isStale && (
                  <span className="ml-auto text-[10px] font-semibold px-1.5 py-0.5 rounded"
                    style={{ background: 'rgba(245,158,11,0.12)', color: '#fbbf24' }}>
                    ⚠ Stale
                  </span>
                )}
              </div>
              <p className="text-2xl font-bold mb-2" style={{ color: usageColor }}>{usageScore}%</p>
              <div className="h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
                <div className="h-full rounded-full transition-all"
                  style={{ width: `${usageScore}%`, background: usageColor }} />
              </div>
              <div className="mt-2 px-2 py-1.5 rounded text-[11px]"
                style={{
                  background: pack.usage === 'high'
                    ? 'rgba(34,197,94,0.1)' : pack.usage === 'medium'
                    ? 'rgba(245,158,11,0.1)' : 'rgba(100,116,139,0.1)',
                  color: usageColor,
                }}>
                {pack.usage === 'high'   ? '🟢 High distribution activity'
               : pack.usage === 'medium' ? '💡 Consider expanding access'
               :                           '⚪ Low engagement — review distribution'}
              </div>
            </div>
          </div>

          {/* Weekly access chart */}
          <div className="glass-card p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-text-secondary">Weekly Pack Queries</p>
              <div className="flex items-center gap-3 text-[10px] text-text-muted">
                <span className="flex items-center gap-1.5"><span className="w-2 h-0.5 rounded inline-block" style={{ background: '#22c55e' }} /> Total</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-0.5 rounded inline-block" style={{ background: '#60a5fa' }} /> Users</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-0.5 rounded inline-block" style={{ background: '#a78bfa' }} /> Agents</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={weeklyData}>
                <XAxis dataKey="w" tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#1f2333', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 11 }} />
                <Line type="monotone" dataKey="queries" stroke="#22c55e" strokeWidth={2} dot={{ fill: '#22c55e', r: 3 }} name="Total Queries" />
                <Line type="monotone" dataKey="users"   stroke="#60a5fa" strokeWidth={2} dot={{ fill: '#60a5fa', r: 3 }} name="User Queries" />
                <Line type="monotone" dataKey="agents"  stroke="#a78bfa" strokeWidth={2} dot={{ fill: '#a78bfa', r: 3 }} name="Agent Queries" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Recent activity feed */}
          <div className="glass-card p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-text-secondary">Recent Activity</p>
              <button className="text-[10px] text-text-muted hover:text-text-secondary">View all →</button>
            </div>
            <div className="space-y-0">
              {(pack.recentActivity || []).slice(0, 3).map((ev, i, arr) => (
                <div key={i} className="flex items-start gap-2.5 py-2.5"
                  style={{ borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                  <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: '#22c55e' }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-text-secondary">{ev.action}</p>
                    <p className="text-[10px] text-text-muted mt-0.5">by {ev.by} · {ev.at}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ── Distribution Health ── */}
      {subTab === 'Distribution Health' && (
        <>
          {pack.isStale && (
            <div className="flex items-center gap-3 px-4 py-3.5 rounded-xl"
              style={{ background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.3)' }}>
              <AlertTriangle size={16} style={{ color: '#fbbf24', flexShrink: 0 }} />
              <div className="flex-1">
                <p className="text-sm font-semibold" style={{ color: '#fbbf24' }}>Pack is stale</p>
                <p className="text-xs text-text-muted mt-0.5">No facts updated in over 14 days. Review before next distribution cycle.</p>
              </div>
              <button className="btn-secondary text-xs gap-1.5 shrink-0"><RefreshCw size={11} /> Sync Now</button>
            </div>
          )}

          {/* Fact health breakdown */}
          <div className="glass-card p-4 space-y-3">
            <p className="text-xs font-semibold text-text-secondary">Fact Health Breakdown</p>
            {[
              { label: 'Verified',  count: health.verified, total: health.total, color: '#4ade80' },
              { label: 'Pending',   count: health.pending,  total: health.total, color: '#fbbf24' },
              { label: 'Conflict',  count: health.conflict, total: health.total, color: '#f87171' },
            ].map(({ label, count, total, color }) => (
              <div key={label} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-text-muted">{label}</span>
                  <span className="font-medium" style={{ color }}>{count} <span className="text-text-muted font-normal">/ {total}</span></span>
                </div>
                <div className="h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <div className="h-full rounded-full" style={{ width: `${total > 0 ? Math.round((count / total) * 100) : 0}%`, background: color }} />
                </div>
              </div>
            ))}
            {packFacts.length > 0 && (
              <p className="text-[11px] text-text-muted pt-1">
                Avg. confidence: <span className="font-semibold text-text-secondary">{health.avgConfidence}%</span>
              </p>
            )}
          </div>

          {/* Access distribution */}
          <div className="glass-card p-4">
            <p className="text-xs font-semibold text-text-secondary mb-3">Access Distribution</p>
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: Users,   val: pack.usersCount,    label: 'Users',    color: '#60a5fa', pct: totalConsumers > 0 ? Math.round((pack.usersCount / totalConsumers) * 100) : 0 },
                { icon: Bot,     val: pack.agentsCount,   label: 'Agents',   color: '#a78bfa', pct: totalConsumers > 0 ? Math.round((pack.agentsCount / totalConsumers) * 100) : 0 },
                { icon: Network, val: pack.networksCount, label: 'Networks', color: '#2dd4bf', pct: totalConsumers > 0 ? Math.round((pack.networksCount / totalConsumers) * 100) : 0 },
              ].map(({ icon: Icon, val, label, color, pct }) => (
                <div key={label} className="rounded-xl p-3 text-center"
                  style={{ background: `${color}0a`, border: `1px solid ${color}20` }}>
                  <Icon size={18} className="mx-auto mb-1.5" style={{ color }} />
                  <p className="text-lg font-bold" style={{ color }}>{val}</p>
                  <p className="text-[10px] text-text-muted">{label}</p>
                  <p className="text-[10px] font-semibold mt-0.5" style={{ color }}>{pct}%</p>
                </div>
              ))}
            </div>
          </div>

          {/* Sync status */}
          <div className="glass-card p-4 flex items-center gap-4">
            <div className="p-2.5 rounded-xl" style={{ background: pack.linkedTruthPlane ? 'rgba(59,130,246,0.12)' : 'rgba(255,255,255,0.04)' }}>
              <Shield size={18} style={{ color: pack.linkedTruthPlane ? '#60a5fa' : '#475569' }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-text-secondary">Truth Plane Sync</p>
              <p className="text-xs text-text-muted mt-0.5">
                {pack.linkedTruthPlane
                  ? <>Linked to <span className="text-text-secondary font-medium">{pack.linkedTruthPlane}</span> · Last synced {pack.lastUpdated}</>
                  : 'No Truth Plane linked — facts are manually managed'}
              </p>
            </div>
            <button className="btn-secondary text-xs gap-1.5 shrink-0">
              <RefreshCw size={11} /> {pack.linkedTruthPlane ? 'Sync Now' : 'Link Plane'}
            </button>
          </div>
        </>
      )}

      {/* ── Governance & Config ── */}
      {subTab === 'Governance & Config' && (
        <>
          {/* Purpose */}
          <div className="glass-card p-4 space-y-1.5">
            <SectionLabel>Purpose</SectionLabel>
            <p className="text-sm text-text-secondary leading-relaxed">{pack.description}</p>
          </div>

          {/* Metadata grid */}
          <div className="glass-card p-4">
            <SectionLabel>Configuration</SectionLabel>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 mt-3">
              <KV label="Owner">
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded-full flex items-center justify-center text-[7px] font-bold text-white shrink-0"
                    style={{ background: pack.ownerGradient }}>{pack.ownerInitials}</div>
                  {pack.owner}
                </div>
              </KV>
              <KV label="Department">
                <div className="flex items-center gap-1"><Building2 size={10} className="text-text-muted" /> {pack.department}</div>
              </KV>
              <KV label="Scope">
                <div className="flex items-center gap-1"><Tag size={10} className="text-text-muted" /> {pack.scope}</div>
              </KV>
              <KV label="Last Updated">
                <div className="flex items-center gap-1"><Calendar size={10} className="text-text-muted" /> {pack.lastUpdated}</div>
              </KV>
            </div>
          </div>

          {/* Linked Truth Plane */}
          {pack.linkedTruthPlane ? (
            <div className="flex items-center gap-3 px-4 py-3.5 rounded-xl"
              style={{ background: 'rgba(59,130,246,0.07)', border: '1px solid rgba(59,130,246,0.2)' }}>
              <Shield size={16} style={{ color: '#60a5fa', flexShrink: 0 }} />
              <div className="flex-1 min-w-0">
                <p className="text-[9px] uppercase tracking-wider font-semibold mb-0.5" style={{ color: '#60a5fa88' }}>Linked Truth Plane</p>
                <p className="text-sm font-semibold text-text-secondary">{pack.linkedTruthPlane}</p>
              </div>
              <button className="flex items-center gap-1.5 text-[11px] font-medium px-3 py-1.5 rounded-lg shrink-0"
                style={{ background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.3)', color: '#60a5fa' }}>
                <ExternalLink size={11} /> Open Plane
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.1)' }}>
              <Shield size={16} className="text-text-muted shrink-0" />
              <p className="text-sm italic text-text-muted flex-1">No linked Truth Plane — facts must be added manually</p>
              <button className="ml-auto btn-secondary text-xs gap-1.5 shrink-0"><Plus size={11} /> Link Plane</button>
            </div>
          )}

          {/* Tags */}
          {pack.tags?.length > 0 && (
            <div className="glass-card p-4">
              <SectionLabel>Tags</SectionLabel>
              <div className="flex flex-wrap gap-2 mt-2">
                {pack.tags.map(tag => (
                  <span key={tag} className="text-[10px] px-2.5 py-1 rounded-full"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#64748b' }}>
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

// ── Tab: Facts ────────────────────────────────────────────────────────────────

function FactsTab({ pack, factIds, onSelectFact, onAddFacts }) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')

  const packFacts = useMemo(() =>
    (factIds ?? pack.factIds ?? []).map(id => truthFacts.find(f => f.id === id)).filter(Boolean),
    [factIds, pack.factIds]
  )

  const filtered = useMemo(() => packFacts.filter(f => {
    if (statusFilter !== 'All' && f.status !== statusFilter.toLowerCase()) return false
    if (search.trim()) {
      const q = search.toLowerCase()
      if (!f.title.toLowerCase().includes(q) && !f.id.toLowerCase().includes(q)) return false
    }
    return true
  }), [packFacts, search, statusFilter])

  if (packFacts.length === 0) {
    return (
      <div className="text-center py-24">
        <FileText size={36} className="mx-auto mb-4 text-text-muted opacity-20" />
        <p className="text-sm font-medium text-text-muted">No facts in this pack yet</p>
        <p className="text-xs text-text-muted mt-1 opacity-60 max-w-xs mx-auto">
          {pack.linkedTruthPlane
            ? `Link facts from "${pack.linkedTruthPlane}" or add them manually.`
            : 'Link a Truth Plane first, then sync facts into this pack.'}
        </p>
        <div className="flex justify-center gap-2 mt-5">
          {pack.linkedTruthPlane && (
            <button className="btn-primary gap-1.5" onClick={onAddFacts}><Plus size={13} /> Add Facts</button>
          )}
          <button className="btn-secondary gap-1.5"><Shield size={13} /> Link Truth Plane</button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {/* Filter bar */}
      <div className="flex items-center gap-2">
        <SearchBar placeholder="Search facts..." value={search} onChange={setSearch} />
        <select className="input-base text-xs px-3 py-2" style={{ width: 'auto' }}
          value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="All">All Status</option>
          <option value="Verified">Verified</option>
          <option value="Pending">Pending</option>
          <option value="Conflict">Conflict</option>
        </select>
        <button className="btn-primary gap-1.5 ml-auto text-xs" onClick={onAddFacts}>
          <Plus size={13} /> Add Facts
        </button>
      </div>

      <p className="text-xs text-text-muted">
        {filtered.length} of {pack.factsCount} facts
        {pack.factsCount > packFacts.length && (
          <span className="opacity-60 ml-1">· Showing {packFacts.length} loaded</span>
        )}
      </p>

      <div className="space-y-2">
        {filtered.map(fact => {
          const fs = FACT_STATUS[fact.status] || FACT_STATUS.pending
          return (
            <div key={fact.id}
              className="row-item cursor-pointer hover:border-white/12 transition-all"
              style={{ borderLeft: `3px solid ${fs.color}` }}
              onClick={() => onSelectFact(fact)}>
              <div className="flex items-start gap-3">
                {/* Status icon */}
                <div className="p-2 rounded-lg shrink-0 mt-0.5"
                  style={{ background: `${fs.color}12` }}>
                  {fact.status === 'verified'
                    ? <CheckCircle size={14} style={{ color: fs.color }} />
                    : fact.status === 'conflict'
                    ? <AlertTriangle size={14} style={{ color: fs.color }} />
                    : <Clock size={14} style={{ color: fs.color }} />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-[10px] font-mono text-text-muted">{fact.id}</span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full"
                      style={{ background: fs.bg, border: `1px solid ${fs.border}`, color: fs.color }}>
                      {fs.label}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded font-medium"
                      style={{ background: 'rgba(124,92,252,0.1)', color: '#a78bfa', border: '1px solid rgba(124,92,252,0.2)' }}>
                      {fact.tag}
                    </span>
                    {fact.expired && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded"
                        style={{ background: 'rgba(239,68,68,0.08)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' }}>
                        Expired
                      </span>
                    )}
                    <span className="text-[10px] text-text-muted ml-auto">{fact.time}</span>
                  </div>

                  <p className="text-sm font-semibold text-text-primary mb-1">{fact.title}</p>
                  <p className="text-xs text-text-muted line-clamp-1 italic mb-2">
                    {fact.text?.replace(/"/g, '')}
                  </p>

                  <div className="flex items-center gap-3 text-[11px] text-text-muted">
                    <span className="flex items-center gap-1">
                      <FileText size={9} /> {fact.sources} sources
                    </span>
                    <span style={{ color: fact.confidence >= 90 ? '#4ade80' : fact.confidence >= 70 ? '#fbbf24' : '#f87171' }}>
                      {fact.confidence}% confidence
                    </span>
                    <span style={{ color: fact.risk === 'Low' ? '#4ade80' : fact.risk === 'Medium' ? '#fbbf24' : '#f87171' }}>
                      {fact.risk} risk
                    </span>
                    <button
                      className="ml-auto text-[10px] px-2.5 py-1 rounded-lg font-medium flex items-center gap-1 hover:brightness-110"
                      style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', color: '#4ade80' }}
                      onClick={e => { e.stopPropagation(); onSelectFact(fact) }}>
                      <Eye size={9} /> Preview
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Tab: Users ────────────────────────────────────────────────────────────────

function UsersTab({ pack, onAddAccess }) {
  const [search, setSearch] = useState('')
  const users = MOCK_USERS.slice(0, pack.usersCount || 3)
  const filtered = users.filter(u =>
    !search.trim() || u.name.toLowerCase().includes(search.toLowerCase()) || u.role.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <SearchBar placeholder="Search users..." value={search} onChange={setSearch} />
        <button className="btn-primary gap-1.5 ml-auto text-xs shrink-0" onClick={onAddAccess}>
          <Plus size={13} /> Add User
        </button>
      </div>
      <p className="text-xs text-text-muted">{filtered.length} user{filtered.length !== 1 ? 's' : ''} with access</p>
      <div className="space-y-2">
        {filtered.map(u => (
          <div key={u.id} className="row-item flex items-center gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
              style={{ background: u.gradient }}>{u.initials}</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-text-primary">{u.name}</p>
              <p className="text-xs text-text-muted">{u.role} · granted {u.grantedAt}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                style={{ background: u.access === 'Admin' ? 'rgba(245,158,11,0.1)' : 'rgba(59,130,246,0.1)', border: `1px solid ${u.access === 'Admin' ? 'rgba(245,158,11,0.3)' : 'rgba(59,130,246,0.3)'}`, color: u.access === 'Admin' ? '#fbbf24' : '#60a5fa' }}>
                {u.access}
              </span>
              <ThreeDot items={[
                { label: 'Change Access', onClick: () => {} },
                { label: 'Remove Access', onClick: () => {}, danger: true },
              ]} />
            </div>
          </div>
        ))}
        {pack.usersCount > MOCK_USERS.length && (
          <p className="text-center text-xs text-text-muted py-2">
            +{pack.usersCount - MOCK_USERS.length} more users · <button className="underline">View all</button>
          </p>
        )}
      </div>
    </div>
  )
}

// ── Tab: Agents ───────────────────────────────────────────────────────────────

function AgentsTab({ pack, onAddAccess }) {
  const [search, setSearch] = useState('')
  const agents = MOCK_AGENTS.slice(0, Math.max(pack.agentsCount || 0, 0))
  const filtered = agents.filter(a =>
    !search.trim() || a.name.toLowerCase().includes(search.toLowerCase()) || a.type.toLowerCase().includes(search.toLowerCase())
  )

  if (pack.agentsCount === 0) {
    return (
      <div className="text-center py-24">
        <Bot size={36} className="mx-auto mb-4 text-text-muted opacity-20" />
        <p className="text-sm font-medium text-text-muted">No agents have access yet</p>
        <p className="text-xs text-text-muted mt-1 opacity-60">Add agents to allow them to query facts from this pack.</p>
        <button className="btn-primary mt-5 gap-1.5" onClick={onAddAccess}><Plus size={13} /> Add Agent</button>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <SearchBar placeholder="Search agents..." value={search} onChange={setSearch} />
        <button className="btn-primary gap-1.5 ml-auto text-xs shrink-0" onClick={onAddAccess}>
          <Plus size={13} /> Add Agent
        </button>
      </div>
      <p className="text-xs text-text-muted">{filtered.length} agent{filtered.length !== 1 ? 's' : ''} with access</p>
      <div className="space-y-2">
        {filtered.map(a => (
          <div key={a.id} className="row-item flex items-center gap-3">
            <div className="p-2 rounded-lg shrink-0"
              style={{ background: 'rgba(124,92,252,0.12)' }}>
              <Bot size={16} style={{ color: '#a78bfa' }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <p className="text-sm font-semibold text-text-primary">{a.name}</p>
                <span className="text-[10px] px-1.5 py-0.5 rounded font-medium"
                  style={{ background: 'rgba(124,92,252,0.1)', color: '#a78bfa', border: '1px solid rgba(124,92,252,0.2)' }}>
                  {a.type}
                </span>
              </div>
              <p className="text-xs text-text-muted">{a.purpose}</p>
              <p className="text-[10px] text-text-muted mt-0.5 opacity-60">Model: {a.model} · Last accessed {a.accessedAt}</p>
            </div>
            <ThreeDot items={[
              { label: 'View Agent',    onClick: () => {} },
              { label: 'Revoke Access', onClick: () => {}, danger: true },
            ]} />
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Tab: Agentic Networks ─────────────────────────────────────────────────────

function NetworksTab({ pack, onAddAccess }) {
  const [search, setSearch] = useState('')
  const networks = MOCK_NETWORKS.slice(0, Math.max(pack.networksCount || 0, 0))
  const filtered = networks.filter(n =>
    !search.trim() || n.name.toLowerCase().includes(search.toLowerCase())
  )

  if (pack.networksCount === 0) {
    return (
      <div className="text-center py-24">
        <Network size={36} className="mx-auto mb-4 text-text-muted opacity-20" />
        <p className="text-sm font-medium text-text-muted">No agentic networks connected</p>
        <p className="text-xs text-text-muted mt-1 opacity-60">Connect networks to enable multi-agent consumption of this Truth Pack.</p>
        <button className="btn-primary mt-5 gap-1.5" onClick={onAddAccess}><Plus size={13} /> Add Network</button>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <SearchBar placeholder="Search networks..." value={search} onChange={setSearch} />
        <button className="btn-primary gap-1.5 ml-auto text-xs shrink-0" onClick={onAddAccess}>
          <Plus size={13} /> Add Network
        </button>
      </div>
      <p className="text-xs text-text-muted">{filtered.length} network{filtered.length !== 1 ? 's' : ''} connected</p>
      <div className="space-y-2">
        {filtered.map(n => (
          <div key={n.id} className="row-item flex items-center gap-3">
            <div className="p-2 rounded-lg shrink-0"
              style={{ background: 'rgba(20,184,166,0.12)' }}>
              <Network size={16} style={{ color: '#2dd4bf' }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <p className="text-sm font-semibold text-text-primary">{n.name}</p>
                <span className="text-[10px] px-1.5 py-0.5 rounded font-medium"
                  style={{ background: 'rgba(20,184,166,0.1)', color: '#2dd4bf', border: '1px solid rgba(20,184,166,0.25)' }}>
                  {n.scope}
                </span>
                <span className="text-[10px] text-text-muted">{n.agents} agents</span>
              </div>
              <p className="text-xs text-text-muted">{n.purpose}</p>
              <p className="text-[10px] text-text-muted mt-0.5 opacity-60">Connected {n.connectedAt}</p>
            </div>
            <ThreeDot items={[
              { label: 'View Network',    onClick: () => {} },
              { label: 'Disconnect',      onClick: () => {}, danger: true },
            ]} />
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Tab: Activity Log ─────────────────────────────────────────────────────────

const FULL_ACTIVITY = [
  { type: 'fact',    action: 'Fact TF-0001 synced from Truth Plane',          by: 'System',        at: '2026-04-12 · 10:14 AM', color: '#22c55e' },
  { type: 'access',  action: 'Access granted to Deal Desk Agent',              by: 'Sarah Chen',    at: '2026-04-10 · 02:31 PM', color: '#60a5fa' },
  { type: 'access',  action: 'User David Kim added with Admin access',          by: 'Sarah Chen',    at: '2026-04-10 · 02:28 PM', color: '#60a5fa' },
  { type: 'fact',    action: 'Fact TF-0003 updated — confidence 89% → 92%',   by: 'System',        at: '2026-04-08 · 09:05 AM', color: '#22c55e' },
  { type: 'config',  action: 'Pack access type changed to Mixed Access',        by: 'Sarah Chen',    at: '2026-04-05 · 11:42 AM', color: '#fbbf24' },
  { type: 'network', action: 'Sales Agentic Network connected',                 by: 'James Park',    at: '2026-03-25 · 03:17 PM', color: '#2dd4bf' },
  { type: 'access',  action: '14 users bulk-added from Legal team',             by: 'Sarah Chen',    at: '2026-03-20 · 10:00 AM', color: '#60a5fa' },
  { type: 'publish', action: 'Pack published (status: Draft → Active)',         by: 'Sarah Chen',    at: '2026-03-20 · 09:55 AM', color: '#4ade80' },
  { type: 'create',  action: 'Truth Pack created',                             by: 'Sarah Chen',    at: '2026-03-15 · 02:00 PM', color: '#a78bfa' },
]

function ActivityTab({ pack }) {
  return (
    <div className="space-y-1">
      {FULL_ACTIVITY.map((ev, i) => (
        <div key={i} className="flex items-start gap-3 py-3"
          style={{ borderBottom: i < FULL_ACTIVITY.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
          <div className="mt-1 w-2 h-2 rounded-full shrink-0" style={{ background: ev.color }} />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-text-secondary">{ev.action}</p>
            <p className="text-[10px] text-text-muted mt-0.5">by {ev.by} · {ev.at}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function TruthPackDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [tab, setTab]                     = useState('Overview')
  const [selectedFact, setSelectedFact]   = useState(null)
  const [showAddFacts, setShowAddFacts]   = useState(false)
  const [addedFactIds, setAddedFactIds]   = useState([])
  const [addAccessType, setAddAccessType] = useState(null)   // 'users' | 'agents' | 'networks' | null
  const [toast, setToast]                 = useState(null)

  const pack = useMemo(() => SEED.find(p => p.id === id), [id])

  // Merge seed factIds with any newly added ones (stateful within session)
  const currentFactIds = useMemo(
    () => [...new Set([...(pack?.factIds ?? []), ...addedFactIds])],
    [pack, addedFactIds]
  )

  const handleAddFacts = (ids) =>
    setAddedFactIds(prev => [...new Set([...prev, ...ids])])

  const handleGrantAccess = ({ ids, accessLevel, type }) => {
    const label = type === 'networks' ? 'network' : type === 'agents' ? 'agent' : 'user'
    const color = type === 'users' ? '#60a5fa' : type === 'agents' ? '#a78bfa' : '#2dd4bf'
    setToast({
      message: `Access granted to ${ids.length} ${label}${ids.length !== 1 ? 's' : ''}`,
      sub: `${accessLevel} access · ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      color,
    })
    setTimeout(() => setToast(null), 3500)
  }

  if (!pack) {
    return (
      <div className="p-6 text-center py-24">
        <BookOpen size={36} className="mx-auto mb-4 text-text-muted opacity-20" />
        <p className="text-sm text-text-muted">Truth Pack not found</p>
        <button className="btn-secondary mt-4 gap-1.5" onClick={() => navigate('/intelligence-library/knowledge')}>
          <ArrowLeft size={13} /> Back to Knowledge
        </button>
      </div>
    )
  }

  const st = STATUS_MAP[pack.status]     || STATUS_MAP.draft
  const at = ACCESS_MAP[pack.accessType] || ACCESS_MAP.users

  const tabLabel = (t) => {
    if (t === 'Facts')            return `Facts (${pack.factsCount})`
    if (t === 'Users')            return `Users (${pack.usersCount})`
    if (t === 'Agents')           return `Agents (${pack.agentsCount})`
    if (t === 'Agentic Networks') return `Agentic Networks (${pack.networksCount})`
    return t
  }

  return (
    <div className="flex flex-col min-h-full">

      {/* ── Sticky page header ──────────────────────── */}
      <div className="sticky top-0 z-30 px-6 py-4 space-y-4"
        style={{ background: 'var(--bg-base)', borderBottom: '1px solid var(--border-default)' }}>

        {/* Back nav */}
        <button
          className="flex items-center gap-1.5 text-xs text-text-muted hover:text-text-secondary transition-colors"
          onClick={() => navigate('/intelligence-library/knowledge')}>
          <ArrowLeft size={13} /> Knowledge
        </button>

        {/* Title row */}
        <div className="flex items-start gap-4">
          <div className="p-2.5 rounded-xl shrink-0 mt-0.5"
            style={{ background: 'rgba(34,197,94,0.14)' }}>
            <BookOpen size={20} style={{ color: '#22c55e' }} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap mb-1">
              <h1 className="text-xl font-bold text-text-primary">{pack.name}</h1>
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
              <span className="text-[10px] text-text-muted ml-1 font-mono">{pack.id}</span>
            </div>
            <p className="text-sm text-text-muted leading-relaxed max-w-2xl">{pack.description}</p>
          </div>

          {/* CTA group */}
          <div className="flex items-center gap-2 shrink-0">
            <button className="btn-secondary gap-1.5 opacity-50 cursor-not-allowed text-xs" disabled>
              <Sparkles size={12} /> AI Assistant
            </button>
            <ActionsDropdown
              onEdit={() => {}}
              onAddFacts={() => setShowAddFacts(true)}
              onAddAccess={() => setAddAccessType('users')}
              onArchive={() => {}}
              isArchived={pack.status === 'archived'} />
          </div>
        </div>

        {/* Tab bar */}
        <div className="tab-bar -mb-px">
          {TABS.map(t => (
            <button key={t}
              className={clsx('tab-btn', tab === t && 'active')}
              onClick={() => setTab(t)}>
              {tabLabel(t)}
            </button>
          ))}
        </div>
      </div>

      {/* ── Page content ────────────────────────────── */}
      <div className="flex-1 p-6">
        {tab === 'Overview'          && <OverviewTab pack={pack} />}
        {tab === 'Facts'             && <FactsTab pack={pack} factIds={currentFactIds} onSelectFact={setSelectedFact} onAddFacts={() => setShowAddFacts(true)} />}
        {tab === 'Users'             && <UsersTab pack={pack} onAddAccess={() => setAddAccessType('users')} />}
        {tab === 'Agents'            && <AgentsTab pack={pack} onAddAccess={() => setAddAccessType('agents')} />}
        {tab === 'Agentic Networks'  && <NetworksTab pack={pack} onAddAccess={() => setAddAccessType('networks')} />}
        {tab === 'Activity Log'      && <ActivityTab pack={pack} />}
      </div>

      {/* ── Fact preview slide-out ───────────────────── */}
      {selectedFact && (
        <FactPreviewSlideOut
          fact={selectedFact}
          onClose={() => setSelectedFact(null)}
          onOpenInTruthPlane={() => navigate('/truth-plane')} />
      )}

      {/* ── Add Facts curation panel ──────────────────── */}
      {showAddFacts && (
        <AddFactsPanel
          currentFactIds={currentFactIds}
          onClose={() => setShowAddFacts(false)}
          onAdd={handleAddFacts} />
      )}

      {/* ── Add Access modal (reusable — configured by type) ── */}
      {addAccessType && (
        <AddAccessModal
          type={addAccessType}
          onClose={() => setAddAccessType(null)}
          onGrant={handleGrantAccess} />
      )}

      {/* ── Toast notification ── */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-[10000] flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl"
          style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.12)', minWidth: 260 }}>
          <CheckCircle size={14} style={{ color: toast.color || '#4ade80', flexShrink: 0 }} />
          <div>
            <p className="text-xs font-semibold text-text-primary">{toast.message}</p>
            {toast.sub && <p className="text-[10px] text-text-muted mt-0.5">{toast.sub}</p>}
          </div>
        </div>
      )}
    </div>
  )
}
