import React, { useState } from 'react'
import { Sparkles, ChevronRight, Building2, Calendar, DollarSign, MapPin, User, Hash } from 'lucide-react'
import { SlideOut, TabBar, Badge, Chip } from '../../ui/index'

const entityConfig = {
  ORGANIZATION: { icon: Building2, color: '#60a5fa', bg: 'rgba(59,130,246,0.1)' },
  DATE:         { icon: Calendar,  color: '#a78bfa', bg: 'rgba(124,92,252,0.1)' },
  AMOUNT:       { icon: DollarSign,color: '#4ade80', bg: 'rgba(34,197,94,0.1)' },
  LOCATION:     { icon: MapPin,    color: '#f87171', bg: 'rgba(239,68,68,0.1)' },
  PERSON:       { icon: User,      color: '#fbbf24', bg: 'rgba(245,158,11,0.1)' },
  REFERENCE:    { icon: Hash,      color: '#2dd4bf', bg: 'rgba(20,184,166,0.1)' },
}

const ENTITIES = [
  { type: 'ORGANIZATION', value: 'Acme Corporation' },
  { type: 'DATE',         value: 'December 31, 2025' },
  { type: 'AMOUNT',       value: '$2,500,000' },
  { type: 'LOCATION',     value: 'New York, NY' },
  { type: 'PERSON',       value: 'John Smith' },
  { type: 'REFERENCE',    value: 'Section 4.2.1' },
]

const BUNDLES = [
  { id: 'BU-001', name: 'Enterprise Contracts Bundle Q1 2024', status: 'Promotable', claims: 24, promoted: 12, conflicts: 2, time: '2 days ago' },
  { id: 'BU-003', name: 'Financial Terms & Payment Obligations', status: 'Promotable', claims: 18, promoted: 15, time: '5 days ago' },
  { id: 'BU-007', name: 'Service Level Agreements Collection', status: 'Promoted', claims: 31, promoted: 28, conflicts: 1, time: '1 week ago' },
]

const SOURCE_TREE = {
  doc: 'Q1 Sales Contract - Acme Corp',
  docId: 'DOC-2024-001',
  sections: [
    {
      name: 'Terms of Service', subsections: [
        { name: 'Service Availability', chunks: ['CHK-0042', 'CHK-0043'] },
        { name: 'Payment Terms', subsections: [
          { name: 'Payment Schedule', chunks: ['CHK-0051', 'CHK-0052'] },
          { name: 'Late Payment Penalties', chunks: ['CHK-0061'] },
        ]}
      ]
    }
  ]
}

export default function ClaimSlideOut({ claim, onClose, hidePromote = false }) {
  const [tab, setTab] = useState('Overview')
  const riskColor = { Low: 'green', Medium: 'amber', High: 'red' }

  return (
    <SlideOut
      title={claim.title}
      subtitle={null}
      badges={[
        { label: claim.id, variant: 'gray' },
        { label: claim.status === 'promotable' ? 'Promotable' : claim.status === 'promoted' ? 'Promoted' : claim.status, variant: claim.status },
      ]}
      onClose={onClose}
      actions={
        !hidePromote && claim.status === 'promotable' ? (
          <button className="btn-primary text-xs py-1.5 px-3 gap-1">
            <Sparkles size={12} /> Promote
          </button>
        ) : null
      }
    >
      <TabBar tabs={['Overview', `Bundles ${BUNDLES.length}`, 'Details']} active={tab} onChange={setTab} />

      {tab === 'Overview' && (
        <div className="mt-4 space-y-4">
          {/* Context */}
          <div className="glass-card p-4">
            <div className="flex items-center gap-1.5 mb-2">
              <Sparkles size={13} style={{ color: '#a78bfa' }} />
              <p className="text-xs font-semibold text-text-secondary">Context</p>
            </div>
            <p className="text-xs text-text-muted leading-relaxed">
              Establishes the service uptime guarantee (minimum availability percentage) and how it is calculated within a defined period (e.g., monthly). Includes exclusions such as scheduled maintenance, force majeure, or incidents beyond the provider's control, and defines the remedy in case of non-compliance (e.g., service credits).
            </p>
          </div>

          {/* Claim statement */}
          <div className="rounded-xl p-4" style={{ background: 'rgba(124,92,252,0.08)', border: '1px solid rgba(124,92,252,0.25)' }}>
            <div className="flex items-center gap-1.5 mb-2">
              <div className="w-4 h-4 rounded-full flex items-center justify-center" style={{ background: '#7c5cfc' }}>
                <span className="text-[8px] text-white font-bold">C</span>
              </div>
              <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#a78bfa' }}>CLAIM</p>
            </div>
            <p className="text-sm font-medium text-text-primary leading-relaxed">{claim.text?.replace(/"/g, '')}</p>
          </div>

          {/* Governance signals */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Confidence', value: `${claim.confidence}%`, color: 'green' },
              { label: 'Risk', value: claim.risk, color: riskColor[claim.risk] || 'gray' },
              { label: 'Polarity', value: claim.polarity === '+' ? 'Positive' : claim.polarity === '−' ? 'Negative' : 'Neutral', color: claim.polarity === '+' ? 'green' : claim.polarity === '−' ? 'red' : 'gray' },
            ].map(({ label, value, color }) => {
              const colorMap = { green: { bg: 'rgba(34,197,94,0.08)', border: 'rgba(34,197,94,0.2)', text: '#4ade80' }, amber: { bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)', text: '#fbbf24' }, red: { bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.2)', text: '#f87171' }, gray: { bg: 'rgba(71,85,105,0.15)', border: 'rgba(71,85,105,0.3)', text: '#94a3b8' } }
              const c = colorMap[color] || colorMap.gray
              return (
                <div key={label} className="rounded-lg p-3 text-center" style={{ background: c.bg, border: `1px solid ${c.border}` }}>
                  <p className="text-[10px] text-text-muted mb-1">{label}</p>
                  <p className="text-sm font-bold" style={{ color: c.text }}>{value}</p>
                </div>
              )
            })}
          </div>

          {/* Extracted entities */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="section-label">Extracted Entities</p>
              <span className="text-[11px] text-text-muted">{ENTITIES.length}</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {ENTITIES.map(({ type, value }) => {
                const cfg = entityConfig[type] || { color: '#94a3b8', bg: 'rgba(148,163,184,0.1)', icon: Hash }
                const Icon = cfg.icon
                return (
                  <div key={type} className="rounded-lg px-3 py-2" style={{ background: cfg.bg, border: `1px solid ${cfg.color}20` }}>
                    <div className="flex items-center gap-1 mb-0.5">
                      <Icon size={10} style={{ color: cfg.color }} />
                      <p className="text-[9px] font-semibold uppercase tracking-wider" style={{ color: cfg.color, opacity: 0.7 }}>{type}</p>
                    </div>
                    <p className="text-xs font-medium" style={{ color: cfg.color }}>{value}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {tab.startsWith('Bundles') && (
        <div className="mt-4 space-y-2">
          {BUNDLES.map(b => (
            <div key={b.id} className="row-item">
              <div className="flex items-start gap-2.5">
                <div className="p-1.5 rounded mt-0.5 shrink-0" style={{ background: 'rgba(245,158,11,0.1)' }}>
                  <span className="text-[11px]" style={{ color: '#fbbf24' }}>⬡</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono text-text-muted">{b.id}</span>
                    <p className="text-xs font-medium text-text-primary">{b.name}</p>
                    <Badge variant={b.status === 'Promotable' ? 'promotable' : 'promoted'}>{b.status}</Badge>
                  </div>
                  <div className="flex gap-3 mt-1 text-[11px] text-text-muted">
                    <span style={{ color: '#a78bfa' }}>✦ Claims {b.claims}</span>
                    {b.conflicts && <span style={{ color: '#f87171' }}>⚠ {b.conflicts}</span>}
                    <span style={{ color: '#4ade80' }}>✓ {b.promoted}</span>
                    <span className="ml-auto">🕐 {b.time}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'Details' && (
        <div className="mt-4 space-y-4">
          {/* Source location tree */}
          <div>
            <p className="section-label mb-2">Source Location</p>
            <div className="glass-card p-3 text-xs space-y-1.5">
              <div>
                <p className="text-[10px] text-text-muted">Document</p>
                <p className="font-medium text-text-secondary">{SOURCE_TREE.doc}</p>
                <p className="text-[10px] text-text-muted">{SOURCE_TREE.docId}</p>
              </div>
              <div className="pl-3 border-l" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                {SOURCE_TREE.sections.map(sec => (
                  <div key={sec.name}>
                    <p className="text-[10px] text-text-muted">Section</p>
                    <p className="font-medium text-text-secondary">{sec.name}</p>
                    {sec.subsections?.map(sub => (
                      <div key={sub.name} className="pl-3 mt-1 border-l" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                        <p className="text-[10px] text-text-muted">Subsection</p>
                        <p className="text-xs font-medium text-text-secondary">{sub.name}</p>
                        {sub.chunks && (
                          <div className="flex gap-1 mt-1 flex-wrap">
                            {sub.chunks.map(c => (
                              <span key={c} className="px-1.5 py-0.5 rounded text-[10px]"
                                style={{ background: 'rgba(124,92,252,0.1)', color: '#a78bfa' }}>{c}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Audit trail */}
          <div>
            <p className="section-label mb-2">Audit Trail</p>
            <div className="space-y-1.5">
              {[
                { label: 'Extracted', value: '2 hours ago' },
                { label: 'Extracted By', value: 'AI Agent' },
                { label: 'Last Activity', value: '1 hour ago' },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between py-1.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <span className="text-xs text-text-muted">{label}</span>
                  <span className="text-xs font-medium text-text-secondary">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </SlideOut>
  )
}
