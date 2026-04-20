import React, { useState } from 'react'
import { Eye, Hand } from 'lucide-react'
import { Modal, FormField, SegmentedControl } from '../../ui/index'

export default function AddDriveModal({ onClose }) {
  const [mode, setMode] = useState('Select Existing')
  const [intakeMode, setIntakeMode] = useState('watched')

  const existing = [
    { name: 'Product Roadmap Drive', desc: 'Product requirements, roadmaps, and feature specifications', owner: 'Product', scope: 'Company-wide', docs: 156, sandbox: 12 },
    { name: 'Legal Contracts Drive', desc: 'Customer agreements, NDAs, and legal documents', owner: 'Legal', scope: 'Private', docs: 234, sandbox: 8 },
    { name: 'Customer Success Drive', desc: 'Case studies, support docs, and customer feedback', owner: 'Customer Success', scope: 'Company-wide', docs: 89, sandbox: 5 },
  ]

  return (
    <Modal title="Add a Drive" subtitle="Use an existing drive or create a new one to feed your Sandbox."
      onClose={onClose}
      footer={
        <>
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary">Add Drive</button>
        </>
      }>
      <SegmentedControl options={['Select Existing', 'Create New']} value={mode} onChange={setMode} />

      {mode === 'Select Existing' && (
        <div className="space-y-2">
          <p className="text-xs text-text-muted">Select from your organization</p>
          <input className="input-base" placeholder="Search drives..." />
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {existing.map(d => (
              <label key={d.name} className="row-item flex items-start gap-3 cursor-pointer">
                <input type="radio" name="drive" className="mt-1 shrink-0 accent-purple-500" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-primary">{d.name}</p>
                  <p className="text-xs text-text-muted">{d.desc}</p>
                  <div className="flex gap-2 mt-1 text-[11px] text-text-muted">
                    <span>{d.owner} · {d.scope}</span>
                    <span>· {d.docs} docs</span>
                    <span className="text-amber-400">· In Sandbox: {d.sandbox}</span>
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>
      )}

      {mode === 'Create New' && (
        <div className="space-y-3">
          <FormField label="Folder name" required><input className="input-base" placeholder="e.g., Policies, Corporate, Q4-2024" /></FormField>
          <FormField label="Description"><textarea className="input-base resize-none h-20" placeholder="What kind of documents live here?" /></FormField>
          <div>
            <p className="text-xs font-medium text-text-secondary mb-2">Intake mode <span className="text-red-400">*</span></p>
            <div className="space-y-2">
              <label className={`row-item flex items-start gap-3 cursor-pointer ${intakeMode === 'watched' ? 'selected' : ''}`}
                onClick={() => setIntakeMode('watched')}>
                <input type="radio" checked={intakeMode === 'watched'} onChange={() => setIntakeMode('watched')} className="mt-1 shrink-0 accent-purple-500" />
                <div>
                  <div className="flex items-center gap-1.5">
                    <Eye size={13} style={{ color: '#a78bfa' }} />
                    <p className="text-sm font-medium text-text-primary">Watched folder</p>
                    <span className="badge-active badge text-[10px]">Recommended</span>
                  </div>
                  <p className="text-xs text-text-muted mt-0.5">New files are automatically sent to DIAN and processed into the Sandbox Plane.</p>
                </div>
              </label>
              <label className={`row-item flex items-start gap-3 cursor-pointer ${intakeMode === 'manual' ? 'selected' : ''}`}
                onClick={() => setIntakeMode('manual')}>
                <input type="radio" checked={intakeMode === 'manual'} onChange={() => setIntakeMode('manual')} className="mt-1 shrink-0 accent-purple-500" />
                <div className="flex items-center gap-1.5">
                  <Hand size={13} className="text-text-muted" />
                  <p className="text-sm font-medium text-text-secondary">Manual folder</p>
                </div>
                <p className="text-xs text-text-muted">Files must be manually sent to DIAN.</p>
              </label>
            </div>
          </div>
        </div>
      )}
    </Modal>
  )
}
