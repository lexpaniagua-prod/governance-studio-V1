// ── DRIVES ──────────────────────────────────────────────────────────────────
export const drives = [
  { id: 'd1', name: 'Sales Drive', desc: 'Sales-related documents, proposals, and contracts', owner: 'Sales', scope: 'Company-wide', status: 'active', docs: 24, sandbox: 10, lastActivity: '2 hours ago' },
  { id: 'd2', name: 'Marketing Drive', desc: 'Marketing materials, campaigns, and brand assets', owner: 'Marketing', scope: 'Private', status: 'active', docs: 24, sandbox: 5, lastActivity: '15 minutes ago' },
  { id: 'd3', name: 'Engineering Drive', desc: 'Technical documentation, specifications, and architecture', owner: 'Engineering', scope: 'Private', status: 'active', docs: 24, sandbox: 28, lastActivity: '4 hours ago' },
  { id: 'd4', name: 'Product Drive', desc: 'Product requirements, roadmaps, and feature specifications', owner: 'Product', scope: 'Private', status: 'active', docs: 24, sandbox: 15, lastActivity: '20 hours ago' },
  { id: 'd5', name: 'HR Drive', desc: 'Human resources policies, employee documents, and benefits', owner: 'HR', scope: 'Private', status: 'none', docs: 8, sandbox: 0, lastActivity: '3 days ago' },
]

export const driveDetail = {
  id: 'd1', name: 'Sales Drive', team: 'Sales Team', scope: 'Company-wide',
  files: 298, inDian: 45, inSandbox: 23, claims: 156,
  truthRate: 70, conflict: 6.3, bottleneck: 'Review',
  weeklyData: [
    { w: 'W1', docs: 28, claims: 32, truth: 25 },
    { w: 'W2', docs: 32, claims: 35, truth: 30 },
    { w: 'W3', docs: 45, claims: 48, truth: 38 },
    { w: 'W4', docs: 40, claims: 58, truth: 55 },
  ],
  folders: [
    { id: 'f1', name: 'Q1 2026 Contracts', desc: 'All contract documents for Q1 2026', owner: 'Sales', scope: 'Company-wide', sandbox: 3, claims: 12, truth: 8, watched: true },
    { id: 'f2', name: 'Service History', desc: 'Historical service records and maintenance reports', owner: 'Operations', scope: 'Company-wide', inDian: 2 },
  ],
  docs: [
    { id: 'doc1', name: 'Pricing Structure 2026', type: 'xlsx', status: 'sandbox', owner: 'David Park', comments: 3, id_ref: 'SD-19390', claims: 8, truth: 5, auto: true },
    { id: 'doc2', name: 'Software Licensing Agreement 2026', type: 'pdf', status: 'reading', owner: 'David Park', comments: 3, auto: false },
    { id: 'doc3', name: 'Vendor Master Agreement 2026', type: 'pdf', status: 'dian', owner: 'Sarah Johnson', comments: 3, auto: true },
  ]
}

// ── SANDBOXES ────────────────────────────────────────────────────────────────
export const sandboxes = [
  { id: 's1', name: 'Q1 Sales Playbook Validation', desc: 'Testing new sales methodology and pricing strategies across customer segments', owner: 'Sales', scope: 'Workspace', lastActivity: '2 hours ago', sources: 24, bundles: 3, claims: 156, promotions: 89 },
  { id: 's2', name: 'Product Messaging Iteration', desc: 'Refining our value proposition and competitive positioning for the new product launch', owner: 'Marketing', scope: 'Department', lastActivity: '5 hours ago', sources: 18, bundles: 2, claims: 92, promotions: 67 },
  { id: 's3', name: 'Customer Onboarding Optimization', desc: 'Completed analysis of onboarding flows and best practices from top performers', owner: 'Customer Success', scope: 'Managed', lastActivity: '3 days ago', sources: 342, bundles: 12, claims: 1204, promotions: 456 },
  { id: 's4', name: 'Competitive Intelligence Q4', desc: 'Ongoing monitoring of competitor features, pricing, and market positioning', owner: 'Product', scope: 'Workspace', lastActivity: '1 day ago', sources: 67, bundles: 5, claims: 234, promotions: 178 },
  { id: 's5', name: 'Compliance Policy Update', desc: 'Draft workspace for new data privacy regulations and internal policy updates', owner: 'Legal', scope: 'Department', lastActivity: '2 days ago', sources: 12, bundles: 1, claims: 45, promotions: 12 },
]

export const sandboxDetail = {
  id: 's1', name: 'Q1 Sales Playbook Validation',
  desc: 'Testing new sales methodology and pricing strategies across customer segments',
  status: 'Active', scope: 'Workspace',
  docs: 24, bundles: 3, claims: 156, promotions: 6, claimed: 89,
  truthReadiness: 70, conflictRate: 6.3, bottleneck: 'Review', bottleneckDays: 2.3,
  weeklyData: [
    { w: 'W1', docs: 30, claims: 45, truth: 35 },
    { w: 'W2', docs: 32, claims: 49, truth: 39 },
    { w: 'W3', docs: 51, claims: 58, truth: 52 },
    { w: 'W4', docs: 59, claims: 62, truth: 58 },
  ],
}

export const claims = [
  { id: 'RC-0001', title: 'Service Level Agreement - Uptime Guarantee', status: 'promotable', context: 'Establishes the minimum guaranteed uptime for cloud infrastructure services, including the methodology for calculating availability and the exclusions applicable to SLA measurements.', text: '"The cloud infrastructure services shall maintain an uptime of 99.9% as measured on a monthly basis, excluding scheduled maintenance windows."', doc: 'Q1 Sales Contract - Acme Co...', section: 'Terms of Service', subsection: 'Service Availability', time: '1 hour ago', confidence: 95, risk: 'Low', polarity: '+', bundles: 3 },
  { id: 'RC-0002', title: 'Annual Contract Value and Billing', status: 'promoted', context: 'Defines the total financial commitment for the annual engagement, including the installment schedule, invoice due dates, and billing structure for the contract period.', text: '"The total annual contract value shall be $120,000 USD, payable in four equal quarterly installments of $30,000 each, due within 30 days of invoice date."', doc: 'Q1 Sales Contract - Acme Co...', section: 'Financial Terms', subsection: 'Payment Schedule', time: '30 minutes ago', confidence: 98, risk: 'Low', polarity: '+', bundles: 2 },
  { id: 'RC-0003', title: 'Contract Auto-Renewal Terms', status: 'promotable', hasSuggestion: true, context: 'Governs the automatic continuation of the agreement beyond its initial term, specifying the conditions and notice requirements for preventing renewal.', text: '"This Agreement shall automatically renew for successive one-year terms unless either party provides written notice of non-renewal at least sixty (60) days prior to the current term expiration date."', doc: 'Enterprise Agreement - Glob...', section: 'Contract Duration', subsection: 'Renewal Clause', time: '2 hours ago', confidence: 92, risk: 'Medium', polarity: '−', bundles: 5, sources: [
    { doc: 'Enterprise Agreement - Glob...', section: 'Contract Duration', subsection: 'Renewal Clause', time: '2 hours ago' },
    { doc: 'Master Service Agreement...', section: 'Terms & Conditions', subsection: 'Duration & Termination', time: '1 day ago' },
    { doc: 'Q1 Sales Contract - Acme Co...', section: 'Contract Terms', subsection: 'Auto-Renewal Policy', time: '3 days ago' },
  ]},
  { id: 'RC-0004', title: 'Payment Terms and Conditions', status: 'conflict', hasSuggestion: true, context: 'Establishes the standard timeframe for invoice settlement under the master service agreement, including applicable penalties for late payments.', text: '"All invoices shall be paid within thirty (30) days of the invoice date."', doc: 'Master Service Agreement...', section: 'Payment Terms', subsection: 'Late Penalties', time: '5 hours ago', confidence: 88, risk: 'High', polarity: '−', bundles: 3, sources: [
    { doc: 'Master Service Agreement...', section: 'Payment Terms', subsection: 'Late Penalties', time: '5 hours ago' },
    { doc: 'Vendor Partnership Agreement...', section: 'Billing & Invoicing', subsection: 'Invoice Settlement', time: '2 days ago' },
  ]},
]

export const bundles = [
  { id: 'BU-001', name: 'Enterprise Contracts Bundle Q1 2024', status: 'promotable', desc: 'Collection of all enterprise-level contracts signed in Q1', claims: 94, conflicts: 3, promoted: 68, time: '2 days ago' },
  { id: 'BU-002', name: 'Cloud Services Agreements', status: 'promoted', desc: 'SaaS and cloud infrastructure service agreements', claims: 67, conflicts: 1, promoted: 52, time: '3 days ago' },
  { id: 'BU-003', name: 'Vendor Partnership Contracts', status: 'not-promotable', desc: 'Strategic vendor and partnership agreement terms', claims: 45, conflicts: 7, promoted: 12, time: '1 week ago' },
]

export const promotions = [
  { id: 'PKG-001', name: 'Q1 2024 Financial Performance', desc: 'Revenue growth claims from quarterly financial statements', owner: 'Sarah Chen', tags: ['Financial', 'Q1', 'Revenue'], target: 'Financial Truth Plane', claims: 24, status: 'promoted', time: '2 days ago', factsCreated: 18, factsChanged: 5, failed: 1 },
  { id: 'PKG-002', name: 'Cloud Services Migration', desc: 'Infrastructure and service transition claims', owner: 'Michael Torres', tags: ['Cloud', 'Infrastructure', 'Migration'], target: 'Technical Truth Plane', claims: 18, status: 'in-progress', time: '3 days ago', factsCreated: 10, factsChanged: 3, failed: 0 },
  { id: 'PKG-003', name: 'Vendor Partnership Terms', desc: 'Strategic partnership agreement claims', owner: 'Emma Wilson', tags: ['Legal', 'Partnerships'], target: 'Legal Truth Plane', claims: 12, status: 'queue', time: '4 days ago', factsCreated: 0, factsChanged: 0, failed: 0 },
]

export const pkgClaims = [
  { id: 'RC-1000', title: 'Payment Terms and Conditions', status: 'promoted', text: '"The payment of $2,500,000 shall be made by the client to the contractor no later than December 31, 2025, as specified in the agreement."', doc: 'Q1 Sales Contract - Acme Co...', section: 'Payment Terms', subsection: 'Billing Schedule', time: '2 hours ago', confidence: 80, risk: 'Low', polarity: '+', bundle: 'BDL-001', conflicts: 2 },
  { id: 'RC-1001', title: 'Service Level Agreement', status: 'promotable', text: '"The service provider guarantees 99.9% uptime for all critical systems, measured monthly, with penalties for non-compliance."', doc: 'Enterprise Agreement - Glob...', section: 'Compliance & Legal', subsection: 'Data Protection', time: '5 hours ago', confidence: 76, risk: 'Medium', polarity: '−', bundle: 'BDL-005', conflicts: 0 },
  { id: 'RC-1002', title: 'Data Protection Obligations', status: 'promotable', text: '"All personal data must be processed in accordance with GDPR requirements, with data breaches reported within 72 hours."', doc: 'Master Service Agreement...', section: 'Payment Terms', subsection: 'Billing Schedule', time: '1 day ago', confidence: 80, risk: 'High', polarity: '+', bundle: 'BDL-005', conflicts: 0 },
  { id: 'RC-1003', title: 'Contract Renewal Terms', status: 'promotable', text: '"The agreement shall auto-renew for successive one-year terms unless written notice of non-renewal is provided at least 60 days prior to expiration."', doc: 'Q1 Sales Contract - Acme Co...', section: 'Payment Terms', subsection: 'Billing Schedule', time: '1 day ago', confidence: 92, risk: 'Low', polarity: '+', bundle: 'BDL-001', conflicts: 1 },
  { id: 'RC-1004', title: 'Liability Cap and Indemnification', status: 'promotable', text: '"Each party\'s total liability under this agreement shall not exceed the total fees paid in the twelve months preceding the claim."', doc: 'Enterprise Agreement - Glob...', section: 'Legal Terms', subsection: 'Indemnification', time: '2 days ago', confidence: 88, risk: 'Medium', polarity: '−', bundle: 'BDL-003', conflicts: 0 },
]

export const claimSuggestions = {
  'RC-0003': {
    author: 'Sarah Chen', initials: 'SC', avatarGradient: 'linear-gradient(135deg,#a78bfa,#60a5fa)',
    time: '1 hour ago',
    suggestedText: '"This Agreement shall automatically renew for successive one-year terms unless either party provides written notice of non-renewal at least ninety (90) days prior to the current term expiration date."',
    suggestedContext: 'Governs the automatic continuation of the agreement with an extended notice window, acknowledging the operational complexity of transitions at quarter-end and year-end periods.',
    suggestedSource: null,
    rationale: 'Extending the notice window from 60 to 90 days gives both parties adequate time to plan for transitions and reduces last-minute contract reviews during quarter-end busy periods.',
    confidence: 95,
    risk: 'Low',
    polarity: '−',
    notes: 'Validated against renewal terms in the updated Global Partnership Framework v2.1.',
  },
  'RC-0004': {
    author: 'Alex Mercer', initials: 'AM', avatarGradient: 'linear-gradient(135deg,#f59e0b,#ef4444)',
    time: '3 hours ago',
    suggestedText: '"All invoices shall be paid within forty-five (45) days of the invoice date, with a 2% early-payment discount applicable if settled within fifteen (15) days of issuance."',
    suggestedContext: null,
    suggestedSource: null,
    rationale: 'Aligning with the industry-standard Net-45 window reduces late-payment disputes. The early-payment incentive benefits both parties and improves cash-flow predictability.',
    confidence: 91,
    risk: 'Medium',
    polarity: '−',
    notes: 'Aligns with the revised Accounts Payable policy approved in Q4 2024. Cross-referenced with MSA Addendum B, Section 3.2.',
  },
}

// ── TRUTH PLANE ──────────────────────────────────────────────────────────────
export const truthPlanes = [
  { id: 'tp1', name: 'Pricing Policy - Enterprise Discount', desc: 'Enterprise customers receive a 20% discount on annual subscriptions for 10+ seats', owner: 'Sales', scope: 'Workspace', facts: 12, expiring: 5, review: 8, proposals: 9, time: '2 hours ago', status: 'verified', tag: 'Finance', risk: 'Low', attestation: 'full', confidence: 95, daysAgo: 0 },
  { id: 'tp2', name: 'Product Feature - API Rate Limits', desc: 'Standard tier allows 1000 API requests per minute, Premium tier allows 5000 requests per minute', owner: 'Engineering', scope: 'Company-wide', facts: 24, expiring: 8, review: 15, proposals: 9, time: '5 hours ago', status: 'pending-review', tag: 'Operations', risk: 'Medium', attestation: 'missing-approver', confidence: 82, daysAgo: 0 },
  { id: 'tp3', name: 'Legal Compliance - GDPR Data Retention', desc: 'Customer data must be deleted within 30 days of account deletion request per GDPR requirements', owner: 'Legal', scope: 'Department', facts: 18, expiring: 3, review: 6, proposals: 9, time: '1 day ago', status: 'verified', tag: 'Compliance', risk: 'High', attestation: 'missing-resolver', confidence: 96, daysAgo: 1 },
  { id: 'tp4', name: 'Financial Policy - Payment Terms', desc: 'Standard payment terms are Net 30 for all enterprise customers, Net 15 for SMB customers', owner: 'Finance', scope: 'Workspace', facts: 6, expiring: 4, review: 9, proposals: 8, time: '1 hour ago', status: 'expiring-soon', tag: 'Contracts', risk: 'Medium', attestation: 'missing-promoter', confidence: 88, daysAgo: 0 },
  { id: 'tp5', name: 'Operational Policy - Support SLA', desc: 'Premium support tier guarantees first response within 4 hours during business hours', owner: 'Customer Success', scope: 'Company-wide', facts: 15, expiring: 6, review: 4, proposals: 9, time: '3 days ago', status: 'in-proposal', tag: 'Eligibility', risk: 'Low', attestation: 'full', confidence: 91, daysAgo: 3 },
]

export const truthFacts = [
  { id: 'TF-0001', title: 'Service Level Agreement - Uptime Guarantee', tag: 'Compliance', status: 'verified', text: '"The cloud infrastructure services shall maintain an uptime of 99.9% as measured on a monthly basis, excluding scheduled maintenance windows."', approvedBy: 'Sarah Chen', time: '2 hours ago', expiry: 'Expired 1 year ago', expired: true, sources: 3, proposals: 2, confidence: 95, risk: 'Low', polarity: '+' },
  { id: 'TF-0002', title: 'Annual Contract Value and Billing', tag: 'Finance', status: 'verified', text: '"The total annual contract value shall be $120,000 USD, payable in four equal quarterly installments of $30,000 each, due within 30 days of invoice date."', approvedBy: 'Michael Torres', time: '2 hours ago', expiry: 'Expired 3 months ago', expired: true, sources: 2, proposals: 1, confidence: 98, risk: 'Low', polarity: '+' },
  { id: 'TF-0003', title: 'Contract Auto-Renewal Terms', tag: 'Eligibility', status: 'pending', text: '"This Agreement shall automatically renew for successive one-year terms unless either party provides written notice of non-renewal at least sixty (60) days prior to the current term expiration date."', approvedBy: 'Emma Wilson', time: '3 hours ago', expiry: 'Expired 1 month ago', expired: true, sources: 5, proposals: 3, confidence: 92, risk: 'Medium', polarity: '−' },
  { id: 'TF-0004', title: 'Payment Terms and Conditions', tag: 'Finance', status: 'conflict', text: '"All invoices shall be paid within thirty (30) days of the invoice date. Late payments shall incur a penalty of 1.5% per month or the maximum allowed by law."', approvedBy: 'James Rodriguez', time: '5 hours ago', expiry: 'Expired 2 months ago', expired: true, sources: 4, proposals: 2, confidence: 88, risk: 'High', polarity: '−' },
  { id: 'TF-0005', title: 'Technical Support Response Time', tag: 'Compliance', status: 'pending', text: '"Vendor shall provide 24/7 technical support services with a guaranteed response time of two (2) hours or less for all priority issues."', approvedBy: 'Lisa Anderson', time: '1 day ago', expiry: 'Expired 2 years ago', expired: true, sources: 1, proposals: 1, confidence: 85, risk: 'Medium', polarity: '+' },
  { id: 'TF-0006', title: 'Data Sovereignty Requirements', tag: 'Legal', status: 'verified', text: '"All customer data shall be stored exclusively within data centers located in the European Union to comply with data sovereignty and GDPR requirements."', approvedBy: 'David Kim', time: '1 day ago', expiry: 'Dec 31 – Dec 30', expired: false, sources: 6, proposals: 4, confidence: 96, risk: 'Low', polarity: '+' },
  { id: 'TF-0007', title: 'Intellectual Property Ownership', tag: 'Legal', status: 'verified', text: '"All intellectual property created by either party during the term of this Agreement shall remain the sole property of the creating party unless expressly assigned in writing."', approvedBy: 'Sarah Chen', time: '3 days ago', expiry: 'Dec 31, 2026', expired: false, sources: 3, proposals: 0, confidence: 99, risk: 'Low', polarity: '+' },
  { id: 'TF-0008', title: 'Data Retention and Deletion Policy', tag: 'Compliance', status: 'verified', text: '"Customer data shall be retained for a minimum of seven (7) years from the date of creation and shall be permanently deleted within ninety (90) days following account termination upon written request."', approvedBy: 'James Park', time: '3 days ago', expiry: 'Jan 15, 2027', expired: false, sources: 4, proposals: 1, confidence: 97, risk: 'Low', polarity: '+' },
  { id: 'TF-0009', title: 'Confidentiality and Non-Disclosure', tag: 'Legal', status: 'verified', text: '"Each party agrees to maintain strict confidentiality over all proprietary information disclosed during the term of this Agreement and for a period of five (5) years following its termination."', approvedBy: 'Emma Rodriguez', time: '4 days ago', expiry: 'Feb 28, 2027', expired: false, sources: 2, proposals: 0, confidence: 98, risk: 'Low', polarity: '+' },
  { id: 'TF-0010', title: 'Enterprise Discount Eligibility', tag: 'Finance', status: 'verified', text: '"Enterprise customers with annual contract values exceeding $100,000 USD qualify for a standard 20% volume discount applied automatically at renewal, subject to continued compliance with payment terms."', approvedBy: 'Alex Rivera', time: '5 days ago', expiry: 'Mar 31, 2027', expired: false, sources: 2, proposals: 2, confidence: 95, risk: 'Low', polarity: '+' },
  { id: 'TF-0011', title: 'Software License Scope and Restrictions', tag: 'Compliance', status: 'verified', text: '"The software license granted herein is non-exclusive, non-transferable, and limited to internal business use only. Sub-licensing, resale, or distribution to third parties is strictly prohibited without prior written consent."', approvedBy: 'David Kim', time: '5 days ago', expiry: 'Dec 31, 2026', expired: false, sources: 3, proposals: 1, confidence: 94, risk: 'Low', polarity: '+' },
  { id: 'TF-0012', title: 'Liability Cap and Indemnification Limit', tag: 'Legal', status: 'verified', text: '"Each party\'s total cumulative liability under this Agreement shall not exceed the total fees paid or payable by Customer in the twelve (12) months immediately preceding the claim giving rise to liability."', approvedBy: 'Sarah Chen', time: '6 days ago', expiry: 'Jun 30, 2027', expired: false, sources: 5, proposals: 0, confidence: 93, risk: 'Low', polarity: '+' },
  { id: 'TF-0013', title: 'Force Majeure and Business Continuity', tag: 'Operations', status: 'verified', text: '"Neither party shall be liable for delays or failures in performance resulting from causes beyond its reasonable control, provided that the affected party notifies the other within forty-eight (48) hours of the event onset."', approvedBy: 'Michael Torres', time: '1 week ago', expiry: 'Dec 31, 2026', expired: false, sources: 2, proposals: 0, confidence: 92, risk: 'Low', polarity: '+' },
  { id: 'TF-0014', title: 'Governing Law and Dispute Jurisdiction', tag: 'Legal', status: 'verified', text: '"This Agreement shall be governed by and construed in accordance with the laws of the State of Delaware, USA. Any disputes shall be resolved exclusively through binding arbitration in New York, NY."', approvedBy: 'James Park', time: '1 week ago', expiry: 'Dec 31, 2026', expired: false, sources: 3, proposals: 1, confidence: 91, risk: 'Low', polarity: '+' },
  { id: 'TF-0015', title: 'Security Incident Notification Obligation', tag: 'Compliance', status: 'verified', text: '"In the event of a confirmed security breach affecting Customer data, Vendor shall notify Customer within seventy-two (72) hours of discovery and provide a full incident report within fourteen (14) business days."', approvedBy: 'Lisa Anderson', time: '1 week ago', expiry: 'Mar 15, 2027', expired: false, sources: 4, proposals: 0, confidence: 97, risk: 'Low', polarity: '+' },

  // ── Auto-verified facts (approved by AI governance engine) ──
  { id: 'TF-0016', title: 'Standard Seat Licensing Terms', tag: 'Finance', status: 'verified', autoVerified: true, text: '"Each software seat license is valid for one (1) named user and may not be shared, transferred, or reassigned without prior written approval. Volume seat adjustments take effect at the next billing cycle."', approvedBy: 'Auto', time: '1 hour ago', expiry: 'Dec 31, 2027', expired: false, sources: 5, proposals: 0, confidence: 99, risk: 'Low', polarity: '+' },
  { id: 'TF-0017', title: 'API Versioning and Deprecation Policy', tag: 'Operations', status: 'verified', autoVerified: true, text: '"Vendor shall maintain backward compatibility for all stable API versions for a minimum of twelve (12) months following a major version release. Deprecation notices shall be issued no less than ninety (90) days in advance."', approvedBy: 'Auto', time: '3 hours ago', expiry: 'Jun 30, 2027', expired: false, sources: 4, proposals: 0, confidence: 98, risk: 'Low', polarity: '+' },
  { id: 'TF-0018', title: 'Cloud Storage Allocation Per Tier', tag: 'Operations', status: 'verified', autoVerified: true, text: '"Standard tier subscribers receive 100 GB of cloud storage per seat. Enterprise tier subscribers receive 1 TB per seat. Storage overages are billed at $0.02 per GB per month beyond the allocated limit."', approvedBy: 'Auto', time: '5 hours ago', expiry: 'Sep 30, 2027', expired: false, sources: 3, proposals: 0, confidence: 97, risk: 'Low', polarity: '+' },
  { id: 'TF-0019', title: 'Multi-Factor Authentication Requirement', tag: 'Compliance', status: 'verified', autoVerified: true, text: '"All user accounts with access to customer data or administrative functions must have multi-factor authentication enabled. MFA enforcement is mandatory and cannot be waived at the individual account level."', approvedBy: 'Auto', time: '6 hours ago', expiry: 'Dec 31, 2027', expired: false, sources: 6, proposals: 0, confidence: 99, risk: 'Low', polarity: '+' },
  { id: 'TF-0020', title: 'Service Credit Calculation Method', tag: 'Finance', status: 'verified', autoVerified: true, text: '"Service credits are calculated as a percentage of the monthly recurring fee for the affected service. Downtime exceeding the SLA threshold by 0.1%–0.5% earns a 10% credit; exceeding by more than 0.5% earns a 25% credit."', approvedBy: 'Auto', time: '8 hours ago', expiry: 'Mar 31, 2028', expired: false, sources: 4, proposals: 0, confidence: 96, risk: 'Low', polarity: '+' },

  // ── Additional verified facts (human-approved) ──
  { id: 'TF-0021', title: 'Territory and Exclusivity Clause', tag: 'Contracts', status: 'verified', text: '"Customer is granted a non-exclusive license to use the services within the agreed territories. Vendor reserves the right to appoint additional resellers or distributors in any territory without restriction."', approvedBy: 'Emma Rodriguez', time: '2 days ago', expiry: 'Jan 31, 2027', expired: false, sources: 3, proposals: 1, confidence: 94, risk: 'Low', polarity: '+' },
  { id: 'TF-0022', title: 'Performance Benchmarks and Penalties', tag: 'Operations', status: 'verified', text: '"Platform API response time shall not exceed 200ms at the 95th percentile under standard load conditions. Sustained violations exceeding 72 hours trigger a service review and potential SLA credit eligibility."', approvedBy: 'David Kim', time: '2 days ago', expiry: 'Dec 31, 2026', expired: false, sources: 5, proposals: 0, confidence: 95, risk: 'Low', polarity: '+' },
  { id: 'TF-0023', title: 'Subprocessor Notification Requirements', tag: 'Compliance', status: 'verified', text: '"Vendor shall maintain an up-to-date list of subprocessors and provide Customer with at least thirty (30) days notice before engaging any new subprocessor with access to Customer personal data."', approvedBy: 'Sarah Chen', time: '3 days ago', expiry: 'Feb 28, 2027', expired: false, sources: 4, proposals: 0, confidence: 97, risk: 'Low', polarity: '+' },
  { id: 'TF-0024', title: 'Right to Audit Clause', tag: 'Legal', status: 'verified', text: '"Customer shall have the right to audit Vendor\'s data processing activities and security controls upon thirty (30) days written notice, no more than once per calendar year, at Customer\'s expense."', approvedBy: 'James Park', time: '4 days ago', expiry: 'Jun 30, 2027', expired: false, sources: 3, proposals: 0, confidence: 93, risk: 'Low', polarity: '+' },
  { id: 'TF-0025', title: 'Warranty and Fitness Disclaimer', tag: 'Legal', status: 'verified', text: '"The services are provided "as is" without warranty of any kind, express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, or non-infringement."', approvedBy: 'Lisa Anderson', time: '5 days ago', expiry: 'Dec 31, 2026', expired: false, sources: 2, proposals: 0, confidence: 92, risk: 'Low', polarity: '+' },
]

// ── FACT GOVERNANCE (attestation trail per fact) ──────────────────────────────
// Each role: [person, date, fulfilled]
export const factGovernance = {
  'TF-0001': {
    createdBy:  ['Sarah Chen',      '2024-01-10', true],
    promotedBy: ['James Park',      '2024-01-11', true],
    resolvedBy: [null,              null,         false],
    approvedBy: ['Emma Rodriguez',  '2024-01-12', true],
  },
  'TF-0002': {
    createdBy:  ['Michael Torres',  '2024-01-10', true],
    promotedBy: ['Alex Kim',        '2024-01-11', true],
    resolvedBy: [null,              null,         false],
    approvedBy: ['Michael Torres',  '2024-01-12', true],
  },
  'TF-0003': {
    createdBy:  ['Emma Wilson',     '2024-01-09', true],
    promotedBy: ['Lisa Anderson',   '2024-01-10', true],
    resolvedBy: [null,              null,         false],
    approvedBy: [null,              null,         false],
  },
  'TF-0004': {
    createdBy:  ['James Rodriguez', '2024-01-08', true],
    promotedBy: ['Sarah Chen',      '2024-01-09', true],
    resolvedBy: ['David Kim',       '2024-01-10', true],
    approvedBy: [null,              null,         false],
  },
  'TF-0005': {
    createdBy:  ['Lisa Anderson',   '2024-01-07', true],
    promotedBy: ['James Park',      '2024-01-08', true],
    resolvedBy: [null,              null,         false],
    approvedBy: [null,              null,         false],
  },
  'TF-0006': {
    createdBy:  ['David Kim',       '2024-01-06', true],
    promotedBy: ['Emma Rodriguez',  '2024-01-07', true],
    resolvedBy: [null,              null,         false],
    approvedBy: ['David Kim',       '2024-01-08', true],
  },
  'TF-0007': {
    createdBy:  ['Sarah Chen',      '2024-02-01', true],
    promotedBy: ['James Park',      '2024-02-03', true],
    resolvedBy: [null,              null,         false],
    approvedBy: ['Sarah Chen',      '2024-02-05', true],
  },
  'TF-0008': {
    createdBy:  ['James Park',      '2024-02-05', true],
    promotedBy: ['David Kim',       '2024-02-06', true],
    resolvedBy: [null,              null,         false],
    approvedBy: ['Emma Rodriguez',  '2024-02-08', true],
  },
  'TF-0009': {
    createdBy:  ['Emma Rodriguez',  '2024-02-10', true],
    promotedBy: ['Sarah Chen',      '2024-02-11', true],
    resolvedBy: [null,              null,         false],
    approvedBy: ['James Park',      '2024-02-12', true],
  },
  'TF-0010': {
    createdBy:  ['Alex Rivera',     '2024-02-14', true],
    promotedBy: ['Michael Torres',  '2024-02-15', true],
    resolvedBy: [null,              null,         false],
    approvedBy: ['Alex Rivera',     '2024-02-16', true],
  },
  'TF-0011': {
    createdBy:  ['David Kim',       '2024-02-18', true],
    promotedBy: ['Lisa Anderson',   '2024-02-19', true],
    resolvedBy: [null,              null,         false],
    approvedBy: ['David Kim',       '2024-02-20', true],
  },
  'TF-0012': {
    createdBy:  ['Sarah Chen',      '2024-02-22', true],
    promotedBy: ['James Park',      '2024-02-23', true],
    resolvedBy: [null,              null,         false],
    approvedBy: ['Emma Rodriguez',  '2024-02-24', true],
  },
  'TF-0013': {
    createdBy:  ['Michael Torres',  '2024-03-01', true],
    promotedBy: ['Alex Rivera',     '2024-03-02', true],
    resolvedBy: [null,              null,         false],
    approvedBy: ['Michael Torres',  '2024-03-03', true],
  },
  'TF-0014': {
    createdBy:  ['James Park',      '2024-03-05', true],
    promotedBy: ['Sarah Chen',      '2024-03-06', true],
    resolvedBy: [null,              null,         false],
    approvedBy: ['James Park',      '2024-03-07', true],
  },
  'TF-0015': {
    createdBy:  ['Lisa Anderson',   '2024-03-10', true],
    promotedBy: ['David Kim',       '2024-03-11', true],
    resolvedBy: [null,              null,         false],
    approvedBy: ['Lisa Anderson',   '2024-03-12', true],
  },

  // ── Auto-verified governance trails ──
  'TF-0016': {
    createdBy:  ['Alex Rivera',       '2026-04-20', true],
    promotedBy: ['Auto · AI Engine',  '2026-04-20', true],
    resolvedBy: [null,                null,         false],
    approvedBy: ['Auto · AI Engine',  '2026-04-20', true],
  },
  'TF-0017': {
    createdBy:  ['Sarah Chen',        '2026-04-20', true],
    promotedBy: ['Auto · AI Engine',  '2026-04-20', true],
    resolvedBy: [null,                null,         false],
    approvedBy: ['Auto · AI Engine',  '2026-04-20', true],
  },
  'TF-0018': {
    createdBy:  ['Michael Torres',    '2026-04-20', true],
    promotedBy: ['Auto · AI Engine',  '2026-04-20', true],
    resolvedBy: [null,                null,         false],
    approvedBy: ['Auto · AI Engine',  '2026-04-20', true],
  },
  'TF-0019': {
    createdBy:  ['David Kim',         '2026-04-20', true],
    promotedBy: ['Auto · AI Engine',  '2026-04-20', true],
    resolvedBy: [null,                null,         false],
    approvedBy: ['Auto · AI Engine',  '2026-04-20', true],
  },
  'TF-0020': {
    createdBy:  ['Emma Rodriguez',    '2026-04-20', true],
    promotedBy: ['Auto · AI Engine',  '2026-04-20', true],
    resolvedBy: [null,                null,         false],
    approvedBy: ['Auto · AI Engine',  '2026-04-20', true],
  },

  // ── Additional human-verified governance trails ──
  'TF-0021': {
    createdBy:  ['Emma Rodriguez',  '2026-04-18', true],
    promotedBy: ['James Park',      '2026-04-18', true],
    resolvedBy: [null,              null,         false],
    approvedBy: ['Emma Rodriguez',  '2026-04-19', true],
  },
  'TF-0022': {
    createdBy:  ['David Kim',       '2026-04-18', true],
    promotedBy: ['Sarah Chen',      '2026-04-18', true],
    resolvedBy: [null,              null,         false],
    approvedBy: ['David Kim',       '2026-04-19', true],
  },
  'TF-0023': {
    createdBy:  ['Sarah Chen',      '2026-04-17', true],
    promotedBy: ['Michael Torres',  '2026-04-17', true],
    resolvedBy: [null,              null,         false],
    approvedBy: ['Sarah Chen',      '2026-04-18', true],
  },
  'TF-0024': {
    createdBy:  ['James Park',      '2026-04-16', true],
    promotedBy: ['Alex Rivera',     '2026-04-16', true],
    resolvedBy: [null,              null,         false],
    approvedBy: ['James Park',      '2026-04-17', true],
  },
  'TF-0025': {
    createdBy:  ['Lisa Anderson',   '2026-04-15', true],
    promotedBy: ['David Kim',       '2026-04-15', true],
    resolvedBy: [null,              null,         false],
    approvedBy: ['Lisa Anderson',   '2026-04-16', true],
  },
}

// ── FACT PROPOSALS ───────────────────────────────────────────────────────────
// origin: 'manual' = Propose Change flow; 'sandbox-promotion' = came from a Sandbox package
export const factProposals = [
  {
    id: 'PROP-001',
    factId: 'TF-0001', factTitle: 'Service Level Agreement - Uptime Guarantee', tag: 'Compliance',
    origin: 'manual', originLabel: 'Propose Change',
    currentText: 'The cloud infrastructure services shall maintain an uptime of 99.9% as measured on a monthly basis, excluding scheduled maintenance windows.',
    proposedText: 'The cloud infrastructure services shall maintain an uptime of 99.95% as measured on a monthly basis, excluding scheduled maintenance windows and planned upgrade events.',
    reason: 'Customer demand has increased SLA expectations. Competitors now offer 99.95% and this change aligns us with market standard. Planned upgrades should also be formally excluded to avoid ambiguity in credit calculations.',
    scopeImpact: 'Company-wide', effectiveDate: '2024-04-01', urgency: 'high',
    evidence: [
      { id: 'E-001', label: 'Competitor SLA Benchmarks Q1 2024', type: 'report', confidence: 92 },
      { id: 'E-002', label: 'Customer Success Report Jan 2024 – Support Ticket Volume Analysis', type: 'report', confidence: 88 },
    ],
    submittedBy: 'James Park', initials: 'JP', avatarGradient: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
    submittedAt: '2024-01-15', status: 'under-review',
    comments: [
      { id: 'C-001', author: 'Emma Rodriguez', initials: 'ER', avatarGradient: 'linear-gradient(135deg,#10b981,#059669)', text: 'The 99.95% figure aligns with what we promised key accounts in the last QBR. I support this change, but Legal needs to confirm the "planned upgrade" exclusion language.', date: '2024-01-16' },
    ],
    approvers: [
      { name: 'Emma Rodriguez', role: 'Truth Approver', status: 'approved' },
      { name: 'Legal Review',   role: 'Legal Sign-off', status: 'pending'  },
    ],
    changes: [
      { field: 'title',    label: 'Title',          current: 'Service Level Agreement - Uptime Guarantee', proposed: 'Service Level Agreement - Uptime Guarantee (Enhanced)' },
      { field: 'factText', label: 'Fact Statement',  current: 'The cloud infrastructure services shall maintain an uptime of 99.9% as measured on a monthly basis, excluding scheduled maintenance windows.', proposed: 'The cloud infrastructure services shall maintain an uptime of 99.95% as measured on a monthly basis, excluding scheduled maintenance windows and planned upgrade events.' },
    ],
  },
  {
    id: 'PROP-002',
    factId: 'TF-0003', factTitle: 'Contract Auto-Renewal Terms', tag: 'Eligibility',
    origin: 'manual', originLabel: 'Propose Change',
    currentText: 'This Agreement shall automatically renew for successive one-year terms unless either party provides written notice of non-renewal at least sixty (60) days prior to the current term expiration date.',
    proposedText: 'This Agreement shall automatically renew for successive one-year terms unless either party provides written notice of non-renewal at least ninety (90) days prior to the current term expiration date.',
    reason: 'Legal team recommends extending the notice window to 90 days to allow sufficient time for procurement reviews and executive sign-off in enterprise accounts. Current 60-day window is routinely missed by enterprise clients.',
    scopeImpact: 'Department', effectiveDate: '2024-06-01', urgency: 'medium',
    evidence: [
      { id: 'E-003', label: 'Legal Memo LGL-2024-003 – Notice Period Review', type: 'legal', confidence: 95 },
      { id: 'E-004', label: 'Enterprise Account Renewal Friction Analysis', type: 'report', confidence: 82 },
    ],
    submittedBy: 'Emma Wilson', initials: 'EW', avatarGradient: 'linear-gradient(135deg,#f59e0b,#ef4444)',
    submittedAt: '2024-01-18', status: 'pending',
    comments: [],
    approvers: [
      { name: 'David Kim',    role: 'Truth Approver', status: 'pending' },
      { name: 'Legal Review', role: 'Legal Sign-off',  status: 'pending' },
    ],
    changes: [
      { field: 'factText', label: 'Fact Statement', current: 'This Agreement shall automatically renew for successive one-year terms unless either party provides written notice of non-renewal at least sixty (60) days prior to the current term expiration date.', proposed: 'This Agreement shall automatically renew for successive one-year terms unless either party provides written notice of non-renewal at least ninety (90) days prior to the current term expiration date.' },
    ],
  },
  {
    id: 'PROP-003',
    factId: 'TF-0004', factTitle: 'Payment Terms and Conditions', tag: 'Finance',
    origin: 'manual', originLabel: 'Propose Change',
    currentText: 'All invoices shall be paid within thirty (30) days of the invoice date. Late payments shall incur a penalty of 1.5% per month or the maximum allowed by law.',
    proposedText: 'All invoices shall be paid within forty-five (45) days of the invoice date. Late payments shall incur a penalty of 1.5% per month or the maximum allowed by law, with a 5-day grace period before the penalty is applied.',
    reason: 'Finance team analysis shows Net-30 is causing friction in large enterprise deals. Extending to Net-45 with a grace period matches industry standard and reduces payment disputes.',
    scopeImpact: 'Workspace', effectiveDate: '2024-05-01', urgency: 'high',
    evidence: [
      { id: 'E-005', label: 'Finance AR Dispute Report Q4 2023', type: 'report', confidence: 88 },
      { id: 'E-006', label: 'Industry Payment Terms Survey 2024', type: 'report', confidence: 80 },
    ],
    submittedBy: 'Michael Torres', initials: 'MT', avatarGradient: 'linear-gradient(135deg,#10b981,#3b82f6)',
    submittedAt: '2024-01-20', status: 'pending',
    comments: [],
    approvers: [
      { name: 'James Rodriguez', role: 'Truth Approver',   status: 'pending' },
      { name: 'Finance Lead',    role: 'Finance Sign-off', status: 'pending' },
    ],
    changes: [
      { field: 'factText', label: 'Fact Statement', current: 'All invoices shall be paid within thirty (30) days of the invoice date. Late payments shall incur a penalty of 1.5% per month or the maximum allowed by law.', proposed: 'All invoices shall be paid within forty-five (45) days of the invoice date. Late payments shall incur a penalty of 1.5% per month or the maximum allowed by law, with a 5-day grace period before the penalty is applied.' },
      { field: 'risk',     label: 'Risk Level',     current: 'Medium', proposed: 'Low' },
    ],
  },
  {
    id: 'PROP-006',
    factId: 'TF-0005', factTitle: 'Technical Support Response Time', tag: 'Compliance',
    origin: 'manual', originLabel: 'Propose Change',
    currentText: 'Vendor shall provide 24/7 technical support services with a guaranteed response time of two (2) hours or less for all priority issues.',
    proposedText: 'Vendor shall provide 24/7 technical support services with a guaranteed initial response time of one (1) hour for critical issues and four (4) hours for standard priority issues.',
    reason: 'Renegotiated SLA with the vendor in Q1 2024 introduces tiered response times. The flat 2-hour guarantee no longer reflects the actual contractual terms. Needs Legal verification before submission.',
    scopeImpact: 'Department', effectiveDate: '2024-07-01', urgency: 'medium',
    evidence: [],
    submittedBy: 'Lisa Anderson', initials: 'LA', avatarGradient: 'linear-gradient(135deg,#8b5cf6,#ec4899)',
    submittedAt: '2024-02-01', status: 'draft',
    comments: [],
    approvers: [
      { name: 'David Kim', role: 'Truth Approver', status: 'pending' },
    ],
    changes: [
      { field: 'factText',    label: 'Fact Statement',   current: 'Vendor shall provide 24/7 technical support services with a guaranteed response time of two (2) hours or less for all priority issues.', proposed: 'Vendor shall provide 24/7 technical support services with a guaranteed initial response time of one (1) hour for critical issues and four (4) hours for standard priority issues.' },
      { field: 'confidence',  label: 'Confidence Score', current: '88%', proposed: '84%' },
    ],
  },
  // ── Additional proposals for TF-0001 (multi-proposal group) ─────────────────
  {
    id: 'PROP-008',
    factId: 'TF-0001', factTitle: 'Service Level Agreement - Uptime Guarantee', tag: 'Compliance',
    origin: 'manual', originLabel: 'Propose Change',
    currentText: 'The cloud infrastructure services shall maintain an uptime of 99.9% as measured on a monthly basis, excluding scheduled maintenance windows.',
    proposedText: 'The cloud infrastructure services shall maintain an uptime of 99.99% ("four nines") as measured on a monthly basis, excluding scheduled maintenance windows and approved change requests logged at least 48 hours in advance.',
    reason: 'Enterprise flagship accounts are renegotiating SLAs to four-nines availability. Our current 99.9% commitment is below the threshold for renewal in 3 key accounts representing $1.4M ARR. The 48h change-request exclusion is essential to protect our ops team.',
    scopeImpact: 'Department', effectiveDate: '2024-05-01', urgency: 'medium',
    evidence: [
      { id: 'E-020', label: 'Enterprise Renewal Risk Report Q1 2024', type: 'report', confidence: 86 },
    ],
    submittedBy: 'Emma Wilson', initials: 'EW', avatarGradient: 'linear-gradient(135deg,#f59e0b,#ef4444)',
    submittedAt: '2024-02-10', status: 'pending',
    comments: [],
    approvers: [
      { name: 'James Rodriguez', role: 'Truth Approver', status: 'pending' },
    ],
    changes: [
      { field: 'title',    label: 'Title',          current: 'Service Level Agreement - Uptime Guarantee', proposed: 'Service Level Agreement - Uptime Guarantee (Four-Nines)' },
      { field: 'factText', label: 'Fact Statement',  current: 'The cloud infrastructure services shall maintain an uptime of 99.9% as measured on a monthly basis, excluding scheduled maintenance windows.', proposed: 'The cloud infrastructure services shall maintain an uptime of 99.99% ("four nines") as measured on a monthly basis, excluding scheduled maintenance windows and approved change requests logged at least 48 hours in advance.' },
      { field: 'validTo',  label: 'Validity Period', current: 'Dec 31, 2024', proposed: 'May 1, 2024 – May 1, 2026' },
    ],
  },
  {
    id: 'PROP-009',
    factId: 'TF-0001', factTitle: 'Service Level Agreement - Uptime Guarantee', tag: 'Compliance',
    origin: 'sandbox-promotion', originLabel: 'Sandbox Promotion',
    scenario: 'modify-fact',
    originMeta: { sandboxName: 'Enterprise SLA Renegotiation Pack', packageId: 'PKG-007', packageName: 'SLA Uplift Q2 2024', sandboxId: 's9' },
    sourceBundle: { id: 'BDL-022', name: 'Uptime SLA Claims Bundle' },
    incomingClaims: [
      { id: 'CL-0201', title: 'Monthly Uptime Target 99.95%', text: 'The vendor shall achieve a minimum monthly uptime of 99.95% for all production services.', doc: 'Enterprise SLA Addendum v2', bundle: 'BDL-022', bundleName: 'Uptime SLA Claims Bundle', confidence: 94, risk: 'Low', polarity: '+' },
      { id: 'CL-0202', title: 'Prorated Credit Schedule for Downtime', text: 'Downtime below the 99.95% threshold shall trigger a prorated service credit equivalent to 5% of the monthly fee per 0.1% of breach.', doc: 'Enterprise SLA Addendum v2', bundle: 'BDL-022', bundleName: 'Uptime SLA Claims Bundle', confidence: 91, risk: 'Medium', polarity: '+' },
    ],
    currentText: 'The cloud infrastructure services shall maintain an uptime of 99.9% as measured on a monthly basis, excluding scheduled maintenance windows.',
    proposedText: 'The cloud infrastructure services shall maintain an uptime of 99.95% as measured on a monthly basis, excluding scheduled maintenance windows. Downtime exceeding the threshold shall trigger prorated service credits at 5% of monthly fees per 0.1% of SLA breach.',
    reason: 'Sandbox analysis surfaced two high-confidence claims supporting an intermediate 99.95% commitment with a credit schedule. This approach balances SLA uplift with operational feasibility and embeds accountability via the credit mechanism.',
    scopeImpact: 'Company-wide', effectiveDate: '2024-06-01', urgency: 'low',
    evidence: [
      { id: 'E-021', label: 'Enterprise SLA Addendum v2 – Uptime Commitment Clauses', type: 'claim', confidence: 94 },
      { id: 'E-022', label: 'SLA Credit Schedule Analysis – Finance Review', type: 'report', confidence: 88 },
    ],
    submittedBy: 'Sarah Chen', initials: 'SC', avatarGradient: 'linear-gradient(135deg,#a78bfa,#60a5fa)',
    submittedAt: '2024-02-12', status: 'pending',
    comments: [],
    approvers: [
      { name: 'David Kim',    role: 'Truth Approver', status: 'pending' },
      { name: 'Legal Review', role: 'Legal Sign-off',  status: 'pending' },
    ],
    changes: [
      { field: 'factText', label: 'Fact Statement',   current: 'The cloud infrastructure services shall maintain an uptime of 99.9% as measured on a monthly basis, excluding scheduled maintenance windows.', proposed: 'The cloud infrastructure services shall maintain an uptime of 99.95% as measured on a monthly basis, excluding scheduled maintenance windows. Downtime exceeding the threshold shall trigger prorated service credits at 5% of monthly fees per 0.1% of SLA breach.' },
      { field: 'source',   label: 'Evidence Source',  current: 'None', proposed: 'Enterprise SLA Addendum v2 · BDL-022 (confidence 94%)' },
    ],
  },
  // ── Additional proposal for TF-0004 (multi-proposal group) ──────────────────
  {
    id: 'PROP-010',
    factId: 'TF-0004', factTitle: 'Payment Terms and Conditions', tag: 'Finance',
    origin: 'sandbox-promotion', originLabel: 'Sandbox Promotion',
    scenario: 'modify-fact',
    originMeta: { sandboxName: 'Enterprise Payment Flexibility Pack', packageId: 'PKG-008', packageName: 'Finance Terms Update Q2 2024', sandboxId: 's10' },
    sourceBundle: { id: 'BDL-023', name: 'Payment Terms Claims Bundle' },
    incomingClaims: [
      { id: 'CL-0211', title: 'Net-60 Payment Window for Enterprise Accounts', text: 'Enterprise accounts with ACV above $100,000 shall be eligible for Net-60 payment terms upon written request and credit approval.', doc: 'Enterprise Payment Policy 2024', bundle: 'BDL-023', bundleName: 'Payment Terms Claims Bundle', confidence: 88, risk: 'Medium', polarity: '+' },
    ],
    currentText: 'All invoices shall be paid within thirty (30) days of the invoice date. Late payments shall incur a penalty of 1.5% per month or the maximum allowed by law.',
    proposedText: 'All invoices shall be paid within thirty (30) days of invoice date for standard accounts, or sixty (60) days for enterprise accounts with ACV exceeding $100,000 and approved credit status. Late payments shall incur a penalty of 1.5% per month or the maximum allowed by law.',
    reason: 'Large enterprise deals (>$100K ACV) routinely request Net-60 terms during procurement. The current blanket Net-30 policy is causing deal delays and is inconsistent with what Sales is verbally agreeing in negotiations.',
    scopeImpact: 'Department', effectiveDate: '2024-05-15', urgency: 'high',
    evidence: [
      { id: 'E-023', label: 'Sales Deal Friction Report Q4 2023 – Net-30 Impact', type: 'report', confidence: 84 },
      { id: 'E-024', label: 'Enterprise Payment Policy 2024 – Net-60 Eligibility Clause', type: 'claim', confidence: 88 },
    ],
    submittedBy: 'Lisa Anderson', initials: 'LA', avatarGradient: 'linear-gradient(135deg,#8b5cf6,#ec4899)',
    submittedAt: '2024-02-14', status: 'pending',
    comments: [],
    approvers: [
      { name: 'Finance Lead',    role: 'Finance Sign-off', status: 'pending' },
      { name: 'Legal Review',    role: 'Legal Sign-off',   status: 'pending' },
    ],
    changes: [
      { field: 'factText', label: 'Fact Statement', current: 'All invoices shall be paid within thirty (30) days of the invoice date. Late payments shall incur a penalty of 1.5% per month or the maximum allowed by law.', proposed: 'All invoices shall be paid within thirty (30) days of invoice date for standard accounts, or sixty (60) days for enterprise accounts with ACV exceeding $100,000 and approved credit status. Late payments shall incur a penalty of 1.5% per month or the maximum allowed by law.' },
      { field: 'risk',     label: 'Risk Level',     current: 'Low', proposed: 'Medium' },
    ],
  },
  {
    id: 'PROP-007',
    factId: null,
    factTitle: 'Data Breach Notification Timeline',
    tag: 'Compliance',
    origin: 'sandbox-promotion', originLabel: 'Sandbox Promotion',
    scenario: 'new-fact',
    originMeta: { sandboxName: 'Compliance Policy Update', packageId: 'PKG-003', packageName: 'Vendor Partnership Terms', sandboxId: 's5' },
    sourceBundle: { id: 'BDL-013', name: 'GDPR Compliance Policy Bundle' },
    incomingClaims: [
      { id: 'CL-0099', title: 'GDPR 72-Hour Breach Notification Requirement', text: 'In the event of a confirmed personal data breach, the data controller must notify the relevant supervisory authority within seventy-two (72) hours of becoming aware of the breach, in accordance with Article 33 of GDPR.', doc: 'GDPR Compliance Policy Addendum 2024', bundle: 'BDL-013', bundleName: 'GDPR Compliance Policy Bundle', confidence: 96, risk: 'High', polarity: '+' },
      { id: 'CL-0100', title: 'Breach Notification Content Requirements', text: 'Data breach notifications must include: the nature of the breach, categories and approximate number of affected individuals, contact details for the DPO, likely consequences, and measures taken or proposed to address the breach.', doc: 'GDPR Compliance Policy Addendum 2024', bundle: 'BDL-013', bundleName: 'GDPR Compliance Policy Bundle', confidence: 92, risk: 'High', polarity: '+' },
    ],
    currentText: null,
    proposedText: 'In the event of a confirmed personal data breach, the data controller must notify the relevant supervisory authority within seventy-two (72) hours of becoming aware of the breach, in accordance with GDPR Article 33, and must document the nature, scope, and remediation measures taken.',
    reason: 'The GDPR 72-hour breach notification window is not currently captured as a verified truth fact anywhere in the workspace. This critical compliance obligation was surfaced via the Compliance Policy Update sandbox and promoted for formal truth adoption.',
    scopeImpact: 'Company-wide', effectiveDate: '2024-05-01', urgency: 'high',
    evidence: [
      { id: 'E-012', label: 'GDPR Article 33 – Supervisory Authority Notification Requirements', type: 'legal', confidence: 97 },
      { id: 'E-013', label: 'ICO Breach Notification Guidance 2023 – Practical Guide', type: 'report', confidence: 93 },
      { id: 'E-014', label: 'Internal Compliance Gap Assessment Q4 2023', type: 'report', confidence: 88 },
    ],
    submittedBy: 'Sarah Chen', initials: 'SC', avatarGradient: 'linear-gradient(135deg,#a78bfa,#60a5fa)',
    submittedAt: '2024-02-05', status: 'pending',
    comments: [],
    approvers: [
      { name: 'David Kim',    role: 'Truth Approver', status: 'pending' },
      { name: 'Legal Review', role: 'Legal Sign-off',  status: 'pending' },
    ],
  },
]

// ── BREAK GLASS RECORDS ───────────────────────────────────────────────────────
// Keyed by factId for fast lookup
export const breakGlassRecords = {
  'TF-0004': {
    id: 'BG-001',
    factId: 'TF-0004',
    factTitle: 'Payment Terms and Conditions',
    reason: 'Critical ERP migration requires temporary payment window extension to prevent system-wide billing lock during cutover weekend.',
    businessImpact: 'Q1 revenue recognition for 14 enterprise accounts totaling $2.1M is blocked without immediate override. Billing engine will reject all invoices after Jan 20.',
    temporaryChange: 'Extend payment window to Net-45 for invoices issued between Jan 20–27, 2024. Late payment penalty clause suspended for the same period.',
    duration: '7d',
    expiryDate: '2024-01-27',
    requestedBy: 'James Rodriguez', initials: 'JR', avatarGradient: 'linear-gradient(135deg,#dc2626,#b91c1c)',
    requestedAt: '2024-01-20 14:32 UTC',
    status: 'active', // active | expired | revoked
    acknowledged: true,
  },
}

// ── REVIEW QUEUE ─────────────────────────────────────────────────────────────
// Facts requiring human validation, conflict follow-up, or revalidation
export const reviewQueue = [
  {
    id: 'RV-0001',
    factId: 'TF-0001',
    factTitle: 'Service Level Agreement - Uptime Guarantee',
    factText: 'The cloud infrastructure services shall maintain an uptime of 99.9% as measured on a monthly basis, excluding scheduled maintenance windows.',
    tag: 'Compliance',
    reason: 'expiring-soon',
    reasonLabel: 'Expiring Soon',
    reasonDetail: 'This fact\'s attestation window has exceeded its 12-month review cycle by over a year. SLA terms may have been renegotiated with Acme Corp in the interim. Revalidation is required before the Verified status can be maintained.',
    priority: 'high',
    risk: 'Low',
    confidence: 95,
    lastApprovedBy: 'Emma Rodriguez',
    lastApprovedAt: '2024-01-12',
    daysInQueue: 3,
    status: 'pending',
    required_approvals: 1,
    current_approvals: 0,
    comments: [],
    changes: [
      { field: 'validTo',     label: 'Validity Period',   current: 'Expires Jan 12, 2025', proposed: 'Renewed through Jan 12, 2026' },
      { field: 'confidence',  label: 'Confidence Score',  current: '95%', proposed: '97% (re-attested)' },
    ],
  },
  {
    id: 'RV-0002',
    factId: 'TF-0003',
    factTitle: 'Contract Auto-Renewal Terms',
    factText: 'This Agreement shall automatically renew for successive one-year terms unless either party provides written notice of non-renewal at least sixty (60) days prior to the current term expiration date.',
    tag: 'Eligibility',
    reason: 'evidence-changed',
    reasonLabel: 'Evidence Changed',
    reasonDetail: 'Two new contracts added to BDL-002 (Enterprise Agreement v4 and Global Framework MSA) reference a 90-day notice window instead of 60 days. The confidence score gap between documents has widened to 11 points. A reviewer must confirm which source is authoritative.',
    priority: 'medium',
    risk: 'Medium',
    confidence: 92,
    lastApprovedBy: null,
    lastApprovedAt: null,
    daysInQueue: 7,
    status: 'pending',
    required_approvals: 2,
    current_approvals: 0,
    comments: [],
    changes: [
      { field: 'factText',   label: 'Fact Statement',   current: 'This Agreement shall automatically renew for successive one-year terms unless either party provides written notice of non-renewal at least sixty (60) days prior to the current term expiration date.', proposed: 'This Agreement shall automatically renew for successive one-year terms unless either party provides written notice of non-renewal at least ninety (90) days prior to the current term expiration date. (aligned to new source evidence)' },
      { field: 'confidence', label: 'Confidence Score', current: '92%', proposed: '89% (adjusted for conflicting signal)' },
    ],
  },
  {
    id: 'RV-0003',
    factId: 'TF-0004',
    factTitle: 'Payment Terms and Conditions',
    factText: 'All invoices shall be paid within thirty (30) days of the invoice date. Late payments shall incur a penalty of 1.5% per month or the maximum allowed by law.',
    tag: 'Finance',
    reason: 'new-conflict',
    reasonLabel: 'New Conflicting Signal',
    reasonDetail: 'The SMB Contract Template v2 (uploaded March 10) specifies Net-15 payment terms, conflicting with the Net-30 stated in this fact. An active Break Glass override is also in effect. Human reconciliation is required before this fact can retain its Verified status.',
    priority: 'high',
    risk: 'High',
    confidence: 88,
    lastApprovedBy: null,
    lastApprovedAt: null,
    daysInQueue: 12,
    status: 'in-review',
    required_approvals: 2,
    current_approvals: 1,
    comments: [
      {
        id: 'C-001',
        author: 'David Kim',
        initials: 'DK',
        avatarGradient: 'linear-gradient(135deg,#f59e0b,#ef4444)',
        text: 'The SMB template was updated by Finance without coordinating with Legal. We need to determine which source is authoritative before we can approve or propose.',
        date: '2024-03-10',
      },
    ],
    changes: [
      { field: 'risk',       label: 'Risk Level',       current: 'High',   proposed: 'Medium' },
      { field: 'confidence', label: 'Confidence Score', current: '88%',    proposed: '82% (reconciled)' },
    ],
  },
  {
    id: 'RV-0004',
    factId: 'TF-0005',
    factTitle: 'Technical Support Response Time',
    factText: 'Vendor shall provide 24/7 technical support services with a guaranteed response time of two (2) hours or less for all priority issues.',
    tag: 'Compliance',
    reason: 'manual-review',
    reasonLabel: 'Manual Review Requested',
    reasonDetail: 'Lisa Anderson flagged this fact for manual review after the support SLA was renegotiated with the vendor in Q1 2024. The response time may have changed from 2 hours to 4 hours for standard tier. The existing fact may no longer reflect the agreed contract terms.',
    priority: 'low',
    risk: 'Medium',
    confidence: 85,
    lastApprovedBy: null,
    lastApprovedAt: null,
    daysInQueue: 1,
    status: 'pending',
    required_approvals: 1,
    current_approvals: 0,
    comments: [],
    changes: [
      { field: 'factText', label: 'Fact Statement', current: 'Vendor shall provide 24/7 technical support services with a guaranteed response time of two (2) hours or less for all priority issues.', proposed: 'Vendor shall provide 24/7 technical support services with a guaranteed initial response time of one (1) hour for critical issues and four (4) hours for standard priority issues.' },
    ],
  },
  {
    id: 'RV-0005',
    factId: 'TF-0006',
    factTitle: 'GDPR Data Residency – EU Storage Requirement',
    factText: 'All personal data of EU residents must be stored exclusively within EU-based data centers and must not be transferred to or processed in non-EU jurisdictions without explicit data subject consent.',
    tag: 'Compliance',
    reason: 'new-conflict',
    reasonLabel: 'New Conflicting Signal',
    reasonDetail: 'Two recent EU AI Act compliance documents introduce new cross-border data transfer restrictions that may conflict with the current fact scope. Requires Legal and Compliance joint review before any approval decision can be made.',
    priority: 'high',
    risk: 'High',
    confidence: 79,
    lastApprovedBy: 'Emma Rodriguez',
    lastApprovedAt: '2023-11-04',
    daysInQueue: 9,
    status: 'escalated',
    escalated: true,
    escalated_to: ['Sarah Chen', 'James Park'],
    escalated_to_details: [
      { id: 'u1', name: 'Sarah Chen',  role: 'Compliance Lead', initials: 'SC', gradient: 'linear-gradient(135deg,#3b82f6,#60a5fa)' },
      { id: 'u2', name: 'James Park',  role: 'Legal',           initials: 'JP', gradient: 'linear-gradient(135deg,#6366f1,#a78bfa)' },
    ],
    escalation_reason: 'High risk / sensitive',
    escalation_reason_id: 'high-risk',
    escalation_message: 'The new EU AI Act requirements may introduce additional data processing restrictions that conflict with the current fact scope. This decision requires joint Legal and Compliance authority — I cannot resolve this alone.',
    escalation_priority: 'High',
    escalated_by: 'Alex Rivera',
    escalated_at: '2026-04-10',
    required_approvals: 3,
    current_approvals: 0,
    comments: [],
  },
]

// ── PLANE GOVERNANCE (per-plane attestation trail) ───────────────────────────
export const planeGovernance = {
  'tp1': { createdBy: 'Sarah Chen',      createdOn: '2023-06-15', promotedBy: 'James Park',      promotionDate: '2023-06-20', approvedBy: 'Emma Rodriguez', approvalDate: '2023-06-22', lastReviewDate: '2024-01-12', lastValidatedDate: '2024-01-12' },
  'tp2': { createdBy: 'Alex Kim',        createdOn: '2023-07-01', promotedBy: 'Michael Torres',  promotionDate: '2023-07-10', approvedBy: null,             approvalDate: null,          lastReviewDate: '2024-01-08', lastValidatedDate: '2024-01-08' },
  'tp3': { createdBy: 'David Kim',       createdOn: '2023-05-20', promotedBy: 'Emma Wilson',     promotionDate: '2023-05-25', approvedBy: 'David Kim',      approvalDate: '2023-05-28', lastReviewDate: '2024-01-10', lastValidatedDate: '2024-01-10' },
  'tp4': { createdBy: 'Michael Torres',  createdOn: '2023-08-01', promotedBy: 'Lisa Anderson',   promotionDate: '2023-08-05', approvedBy: null,             approvalDate: null,          lastReviewDate: '2024-01-05', lastValidatedDate: '2024-01-05' },
  'tp5': { createdBy: 'Lisa Anderson',   createdOn: '2023-09-10', promotedBy: 'James Park',      promotionDate: '2023-09-15', approvedBy: 'Emma Rodriguez', approvalDate: '2023-09-18', lastReviewDate: '2023-12-20', lastValidatedDate: '2023-12-20' },
}

// ── PLANE SOURCE HEALTH (docs / bundles / sync freshness per plane) ───────────
export const planeSourceHealth = {
  'tp1': { sourceDocs: 18, bundles: 4, claims: 24, lastSync: '2 hours ago' },
  'tp2': { sourceDocs: 31, bundles: 6, claims: 48, lastSync: '5 hours ago' },
  'tp3': { sourceDocs: 22, bundles: 5, claims: 36, lastSync: '1 day ago'   },
  'tp4': { sourceDocs: 14, bundles: 3, claims: 22, lastSync: '1 hour ago'  },
  'tp5': { sourceDocs: 27, bundles: 7, claims: 43, lastSync: '3 days ago'  },
}

// ── SOURCE DOCUMENTS ─────────────────────────────────────────────────────────
export const sourceDocs = [
  {
    id: 'src-001', name: 'Marketing Services Contract - Creative Agency', type: 'pdf', status: 'failed',
    promotedBy: { initials: 'JD', name: 'John Doe' }, time: '30 minutes ago',
    aiSummary: 'This document is a Marketing Services Contract with Creative Agency outlining a 12-month engagement for digital marketing services. The contract includes content creation, social media management, and campaign analytics with a total value of $180,000.',
    aiPoints: ['Contains critical financial information including contract terms and payment schedules', 'Identified confidential information requiring security policy compliance', 'Key contractual obligations and renewal dates extracted for tracking'],
    bundles: 5, claims: 8, promoted: 2, sensitive: 4, conflicts: 0,
    nextAction: { label: 'Review 8 Claims', risk: 'High', desc: 'Review and validate 8 unverified claims from this document to improve knowledge accuracy and ensure compliance with data quality standards.' },
    alerts: [{ type: 'PII Detected', risk: 'High' }, { type: 'Confidential Data', risk: 'Medium' }],
  },
  {
    id: 'src-002', name: 'Q1 Sales Contract - Acme Corp', type: 'pdf', status: 'processed',
    promotedBy: { initials: 'JD', name: 'John Doe' }, time: '2 hours ago',
    aiSummary: 'Enterprise sales agreement governing Q1 2024 services for Acme Corporation. Establishes a 12-month engagement with performance milestones and SLA requirements totaling $120,000 annually.',
    aiPoints: ['Annual contract value of $120,000 with quarterly billing structure', 'Service level agreements with 99.9% uptime guarantees', 'Auto-renewal clause with 60-day written notice requirement'],
    bundles: 2, claims: 12, promoted: 8, sensitive: 2, conflicts: 1,
    nextAction: { label: 'Resolve 1 Conflict', risk: 'Medium', desc: 'One claim conflict detected that requires manual review before promotion to the Truth Plane.' },
    alerts: [{ type: 'Conflict Detected', risk: 'Medium' }],
  },
  {
    id: 'src-003', name: 'Q1 Sales Contract - TechCo', type: 'pdf', status: 'processed',
    promotedBy: { initials: 'JD', name: 'John Doe' }, time: '3 hours ago',
    aiSummary: 'Technology services contract with TechCo covering 50-seat enterprise software licensing, support SLAs, and phased implementation milestones across Q1 2024.',
    aiPoints: ['Enterprise license for 50 seats with volume pricing applied', 'Technical support SLAs: P1 critical response within 2 hours', 'Implementation phased across Q1 with defined acceptance criteria'],
    bundles: 3, claims: 15, promoted: 10, sensitive: 1, conflicts: 0,
    nextAction: { label: 'Review 5 Claims', risk: 'Low', desc: 'Five remaining unvalidated claims are pending review to complete document processing.' },
    alerts: [],
  },
  {
    id: 'src-004', name: 'Enterprise Agreement - Global Solutions', type: 'pdf', status: 'processed',
    promotedBy: { initials: 'SC', name: 'Sarah Chen' }, time: '5 hours ago',
    aiSummary: 'Multi-year master enterprise agreement for Global Solutions covering strategic licensing, professional services, and partnership governance with GDPR compliance mandates.',
    aiPoints: ['Multi-year pricing structure with 8% annual escalation clause', 'Data sovereignty requirements mandate EU-based data center storage', 'Exclusivity clause for regional market coverage spanning 24 months'],
    bundles: 4, claims: 22, promoted: 14, sensitive: 6, conflicts: 2,
    nextAction: { label: 'Resolve 2 Conflicts', risk: 'High', desc: 'Two conflicting claims require resolution before the document can be fully validated and promoted.' },
    alerts: [{ type: 'PII Detected', risk: 'High' }, { type: 'Conflict Detected', risk: 'High' }],
  },
]

export const govTimeline = [
  { id: 1, icon: 'file',   title: 'Document Ingested',     desc: 'File uploaded to sandbox and queued for processing pipeline.',                                            actor: 'System',     time: 'Apr 12, 2026 · 09:14 AM', color: '#60a5fa', status: 'completed' },
  { id: 2, icon: 'spark',  title: 'AI Processing Started', desc: 'Natural language processing and claim extraction pipeline initiated.',                                   actor: 'System',     time: 'Apr 12, 2026 · 09:15 AM', color: '#a78bfa', status: 'completed' },
  { id: 3, icon: 'alert',  title: 'PII Detected',          desc: 'Sensitive personal information identified in sections 3.2 and 4.1. Document flagged for compliance.',    actor: 'System',     time: 'Apr 12, 2026 · 09:16 AM', color: '#f87171', status: 'completed' },
  { id: 4, icon: 'spark',  title: '8 Claims Extracted',    desc: 'AI identified and structured 8 factual claims from document content for governance review.',             actor: 'System',     time: 'Apr 12, 2026 · 09:17 AM', color: '#a78bfa', status: 'completed' },
  { id: 5, icon: 'eye',    title: 'Review Assigned',       desc: 'Document flagged for human review due to PII detection and confidential data classification.',           actor: 'John Doe',   time: 'Apr 12, 2026 · 09:30 AM', color: '#fbbf24', status: 'completed' },
  { id: 6, icon: 'check',  title: '2 Claims Promoted',     desc: '2 of 8 claims approved and promoted to the Financial Truth Plane following governance review.',          actor: 'Sarah Chen', time: 'Apr 12, 2026 · 10:05 AM', color: '#4ade80', status: 'completed' },
  { id: 7, icon: 'shield', title: 'Attestation Requested', desc: 'Manager sign-off requested for remaining 6 claims prior to further promotion to the Truth Plane.',       actor: 'System',     time: 'Apr 12, 2026 · 10:10 AM', color: '#fbbf24', status: 'active'    },
]
