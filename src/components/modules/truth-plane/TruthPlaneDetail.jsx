import React, { useState, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { Shield, Settings, ChevronRight, Filter, AlertTriangle, ExternalLink, Sparkles, Building2, Calendar, DollarSign, MapPin, User, Hash, Clock, Eye, CheckCircle, FileSearch, ArrowUpCircle, MessageSquare, Package, PenLine, XCircle, X, Layers, FileText, Award, SendHorizonal, Zap, TrendingUp, Activity, Database, RefreshCw, Lock, Users, Upload } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { truthPlanes, truthFacts, factGovernance, factProposals, breakGlassRecords, reviewQueue as seedReviewQueue } from '../../../data/mock'
import { Badge, Chip, ThreeDot, SearchBar, SlideOut, TabBar, AllFiltersPanel, FilterSection, MetricCard } from '../../ui/index'
import { GovernanceCompact, GovernanceSnapshot, GovernanceTimeline } from './GovernanceTrail'
import ProposeChangeModal from './ProposeChangeModal'
import ApproveConfirmModal, { WhatChangesView } from './ApproveConfirmModal'
import CreateFactModal from './CreateFactModal'
import BreakGlassModal from './BreakGlassModal'
import RequestEvidenceModal from './RequestEvidenceModal'
import EscalateModal from './EscalateModal'
import EvidenceResponseModal from './EvidenceResponseModal'
import clsx from 'clsx'

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

// ── Fact Slide-out helpers ────────────────────────────────────────────────────
const FACT_CONTEXT = {
  'TF-0001': 'Governs service availability commitments in cloud infrastructure contracts. Defines the measurement window, exclusions (maintenance, force majeure), and remedies for non-compliance such as service credits.',
  'TF-0002': 'Governs billing structure and payment schedule for enterprise contracts. Sets the invoice cadence, installment amounts, and due-date window to maintain financial predictability.',
  'TF-0003': 'Governs contract continuation and termination rights. Defines the notice period required to prevent automatic renewal and the consequences of missing that window.',
  'TF-0004': 'Governs payment timelines and late-payment penalties across enterprise and SMB contracts. Sets the standard terms and the interest rate applied to overdue invoices.',
  'TF-0005': 'Governs vendor response-time obligations for technical support. Specifies SLA tiers, availability windows, and priority escalation thresholds.',
  'TF-0006': 'Governs data residency to satisfy GDPR and regional sovereignty requirements. Restricts storage locations to EU-based data centers regardless of operational geography.',
  'TF-0007': 'Governs ownership of intellectual property created during the engagement. Prevents implicit IP transfers by requiring explicit written assignments for any work products changing ownership.',
  'TF-0008': 'Governs data retention obligations and post-termination deletion timelines. Balances regulatory minimum retention periods with the right of customers to request permanent deletion.',
  'TF-0009': 'Governs confidentiality obligations for proprietary information shared between parties. Establishes a survival period extending five years beyond contract termination.',
  'TF-0010': 'Governs discount eligibility criteria for enterprise volume customers. Ties the 20% automatic discount to ACV thresholds and continued payment compliance at renewal.',
  'TF-0011': 'Governs the scope and restrictions of software license grants. Prohibits sub-licensing, resale, or third-party distribution without prior written consent.',
  'TF-0012': 'Governs maximum financial exposure for both parties under the agreement. Caps cumulative liability at the prior 12-month fee value to contain downside risk.',
  'TF-0013': 'Governs relief from performance obligations caused by uncontrollable external events. Requires prompt notification within 48 hours of a qualifying force majeure event.',
  'TF-0014': 'Governs the legal jurisdiction and dispute resolution framework. Mandates binding arbitration in New York under Delaware law, excluding litigation.',
  'TF-0015': 'Governs vendor obligations upon discovery of a security breach affecting customer data. Sets a 72-hour initial notification window and a 14-business-day full incident report deadline.',
  'TF-0021': 'Governs territorial licensing boundaries and exclusivity rights. Clarifies that licenses are non-exclusive, preserving vendor flexibility to appoint additional channel partners.',
  'TF-0022': 'Governs platform performance expectations and penalty conditions. Ties sustained API response time violations to service review procedures and SLA credit eligibility.',
  'TF-0023': 'Governs subprocessor engagement transparency for GDPR compliance. Requires vendor to maintain a public subprocessor list and provide advance notice of new subprocessors.',
  'TF-0024': 'Governs customer audit rights over vendor data processing and security operations. Limits audit frequency to once per year with 30 days advance notice and at customer cost.',
  'TF-0025': 'Governs vendor warranty disclaimers and fitness-for-purpose limitations. Establishes an "as-is" service delivery baseline, limiting implied warranty claims.',
  'TF-0016': 'Governs seat-based software licensing to prevent unauthorized sharing or reassignment. Ensures each license is tied to a single named user and aligns volume adjustments to billing cycles.',
  'TF-0017': 'Governs API stability commitments and version lifecycle management. Protects integrations by requiring backward compatibility windows and advance deprecation notices.',
  'TF-0018': 'Governs cloud storage entitlements across subscription tiers. Defines per-seat allocations for Standard and Enterprise customers and establishes overage billing rates.',
  'TF-0019': 'Governs authentication security requirements for all accounts with access to customer data or admin functions. MFA enforcement is mandatory platform-wide with no individual waivers.',
  'TF-0020': 'Governs service credit entitlements when SLA thresholds are breached. Defines the credit percentage tiers based on the degree of downtime beyond the contractual guarantee.',
}

const EVIDENCE_BY_FACT = {
  'TF-0001': [
    { id: 'CL-0041', title: 'Uptime SLA – 99.9% Monthly Guarantee',    doc: 'Q1 Sales Contract - Acme Corp',        bundle: 'BDL-003', confidence: 97, risk: 'Low',    polarity: '+' },
    { id: 'CL-0042', title: 'Monthly Measurement Period Definition',     doc: 'Q1 Sales Contract - Acme Corp',        bundle: 'BDL-003', confidence: 95, risk: 'Low',    polarity: '+' },
    { id: 'CL-0043', title: 'Maintenance Window Exclusion Clause',       doc: 'Infrastructure Services Agreement v2', bundle: 'BDL-007', confidence: 91, risk: 'Medium', polarity: '−' },
  ],
  'TF-0002': [
    { id: 'CL-0011', title: 'Annual Contract Value $120,000',            doc: 'Q1 Sales Contract - Acme Corp',        bundle: 'BDL-001', confidence: 98, risk: 'Low',    polarity: '+' },
    { id: 'CL-0012', title: 'Quarterly Installment Schedule',            doc: 'Q1 Sales Contract - Acme Corp',        bundle: 'BDL-001', confidence: 96, risk: 'Low',    polarity: '+' },
  ],
  'TF-0003': [
    { id: 'CL-0021', title: 'Auto-Renewal Default Clause',               doc: 'Master Services Agreement 2024',       bundle: 'BDL-002', confidence: 94, risk: 'Medium', polarity: '−' },
    { id: 'CL-0022', title: '60-Day Non-Renewal Notice Requirement',     doc: 'Master Services Agreement 2024',       bundle: 'BDL-002', confidence: 92, risk: 'Medium', polarity: '+' },
    { id: 'CL-0023', title: 'Successive One-Year Term Definition',       doc: 'Enterprise Contract Template v3',      bundle: 'BDL-005', confidence: 89, risk: 'Medium', polarity: '+' },
    { id: 'CL-0024', title: 'Written Notice Delivery Method',            doc: 'Enterprise Contract Template v3',      bundle: 'BDL-005', confidence: 85, risk: 'Medium', polarity: '+' },
    { id: 'CL-0025', title: 'Expiration Date Anchor for Notice Window',  doc: 'Legal Addendum B – Renewals',          bundle: 'BDL-009', confidence: 82, risk: 'High',   polarity: '−' },
  ],
  'TF-0004': [
    { id: 'CL-0031', title: 'Net-30 Payment Term – Enterprise',          doc: 'Payment Terms Policy 2024',            bundle: 'BDL-004', confidence: 90, risk: 'High',   polarity: '+' },
    { id: 'CL-0032', title: '1.5% Monthly Late Payment Penalty',         doc: 'Payment Terms Policy 2024',            bundle: 'BDL-004', confidence: 88, risk: 'High',   polarity: '−' },
    { id: 'CL-0033', title: 'Maximum Statutory Rate Override',           doc: 'Finance Compliance Addendum',          bundle: 'BDL-006', confidence: 86, risk: 'High',   polarity: '−' },
    { id: 'CL-0034', title: 'Net-15 Payment Term – SMB',                 doc: 'SMB Contract Template v2',             bundle: 'BDL-008', confidence: 83, risk: 'Medium', polarity: '+' },
  ],
  'TF-0005': [
    { id: 'CL-0051', title: '24/7 Technical Support Availability',       doc: 'Support SLA Agreement 2023',           bundle: 'BDL-010', confidence: 87, risk: 'Medium', polarity: '+' },
  ],
  'TF-0006': [
    { id: 'CL-0061', title: 'EU-Only Data Center Residency',             doc: 'GDPR Data Processing Agreement',       bundle: 'BDL-011', confidence: 97, risk: 'Low',    polarity: '+' },
    { id: 'CL-0062', title: 'GDPR Compliance Data Sovereignty Clause',   doc: 'GDPR Data Processing Agreement',       bundle: 'BDL-011', confidence: 96, risk: 'Low',    polarity: '+' },
    { id: 'CL-0063', title: 'Cross-Border Transfer Restriction',         doc: 'EU Standard Contractual Clauses 2024', bundle: 'BDL-012', confidence: 95, risk: 'Low',    polarity: '+' },
    { id: 'CL-0064', title: 'Data Sovereignty Audit Rights',             doc: 'GDPR Data Processing Agreement',       bundle: 'BDL-011', confidence: 91, risk: 'Low',    polarity: '+' },
    { id: 'CL-0065', title: 'Controller-Processor Responsibility Scope', doc: 'EU Standard Contractual Clauses 2024', bundle: 'BDL-012', confidence: 88, risk: 'Medium', polarity: '+' },
    { id: 'CL-0066', title: 'Incident Notification Window for Breaches', doc: 'EU Standard Contractual Clauses 2024', bundle: 'BDL-012', confidence: 84, risk: 'Medium', polarity: '−' },
  ],
  'TF-0007': [
    { id: 'CL-0071', title: 'IP Ownership Retained by Creating Party',       doc: 'Master IP Agreement 2024',             bundle: 'BDL-013', confidence: 99, risk: 'Low',    polarity: '+' },
    { id: 'CL-0072', title: 'Written Assignment Requirement for IP Transfer', doc: 'Master IP Agreement 2024',             bundle: 'BDL-013', confidence: 98, risk: 'Low',    polarity: '+' },
    { id: 'CL-0073', title: 'Jointly Developed Works Exclusion Clause',       doc: 'IP Addendum – Joint Development',      bundle: 'BDL-014', confidence: 95, risk: 'Low',    polarity: '+' },
  ],
  'TF-0008': [
    { id: 'CL-0081', title: '7-Year Minimum Retention Period',                doc: 'Data Governance Policy 2024',          bundle: 'BDL-015', confidence: 98, risk: 'Low',    polarity: '+' },
    { id: 'CL-0082', title: '90-Day Post-Termination Deletion SLA',           doc: 'Data Governance Policy 2024',          bundle: 'BDL-015', confidence: 97, risk: 'Low',    polarity: '+' },
    { id: 'CL-0083', title: 'Written Deletion Request Requirement',           doc: 'GDPR Data Processing Agreement',       bundle: 'BDL-011', confidence: 96, risk: 'Low',    polarity: '+' },
    { id: 'CL-0084', title: 'Regulatory Retention Override Clause',           doc: 'Compliance Addendum – Retention',      bundle: 'BDL-016', confidence: 93, risk: 'Low',    polarity: '+' },
  ],
  'TF-0009': [
    { id: 'CL-0091', title: 'Strict Confidentiality Obligation – Both Parties', doc: 'NDA Master Agreement 2024',          bundle: 'BDL-017', confidence: 99, risk: 'Low',    polarity: '+' },
    { id: 'CL-0092', title: '5-Year Post-Termination Survival Period',          doc: 'NDA Master Agreement 2024',          bundle: 'BDL-017', confidence: 98, risk: 'Low',    polarity: '+' },
  ],
  'TF-0010': [
    { id: 'CL-0101', title: '$100K ACV Threshold for Discount Eligibility',  doc: 'Pricing & Discount Policy 2024',       bundle: 'BDL-018', confidence: 96, risk: 'Low',    polarity: '+' },
    { id: 'CL-0102', title: '20% Volume Discount on Renewal',                doc: 'Pricing & Discount Policy 2024',       bundle: 'BDL-018', confidence: 95, risk: 'Low',    polarity: '+' },
    { id: 'CL-0103', title: 'Payment Compliance as Discount Condition',      doc: 'Enterprise Contract Template v3',      bundle: 'BDL-005', confidence: 94, risk: 'Low',    polarity: '+' },
  ],
  'TF-0011': [
    { id: 'CL-0111', title: 'Non-Exclusive, Non-Transferable License Grant', doc: 'Software License Agreement v4',        bundle: 'BDL-020', confidence: 95, risk: 'Low',    polarity: '+' },
    { id: 'CL-0112', title: 'Internal Business Use Restriction',             doc: 'Software License Agreement v4',        bundle: 'BDL-020', confidence: 94, risk: 'Low',    polarity: '+' },
    { id: 'CL-0113', title: 'Sub-licensing and Resale Prohibition',          doc: 'IP & License Addendum 2024',           bundle: 'BDL-019', confidence: 93, risk: 'Low',    polarity: '+' },
  ],
  'TF-0012': [
    { id: 'CL-0121', title: '12-Month Fee Basis for Liability Cap',          doc: 'Master Services Agreement 2024',       bundle: 'BDL-002', confidence: 94, risk: 'Low',    polarity: '+' },
    { id: 'CL-0122', title: 'Cumulative Liability Cap Clause',               doc: 'Master Services Agreement 2024',       bundle: 'BDL-002', confidence: 93, risk: 'Low',    polarity: '+' },
    { id: 'CL-0123', title: 'Indemnification Limit – Both Parties',          doc: 'Legal Addendum C – Liability',         bundle: 'BDL-033', confidence: 92, risk: 'Low',    polarity: '+' },
    { id: 'CL-0124', title: 'Consequential Damages Exclusion',               doc: 'Legal Addendum C – Liability',         bundle: 'BDL-033', confidence: 90, risk: 'Low',    polarity: '+' },
    { id: 'CL-0125', title: 'Fees Paid in Prior 12 Months as Calculation Base', doc: 'Enterprise Contract Template v3',  bundle: 'BDL-005', confidence: 88, risk: 'Low',    polarity: '+' },
  ],
  'TF-0013': [
    { id: 'CL-0131', title: 'Force Majeure Event Definition',                doc: 'Operations Risk Addendum 2024',        bundle: 'BDL-034', confidence: 93, risk: 'Low',    polarity: '+' },
    { id: 'CL-0132', title: '48-Hour Notification Obligation',               doc: 'Operations Risk Addendum 2024',        bundle: 'BDL-034', confidence: 92, risk: 'Low',    polarity: '+' },
  ],
  'TF-0014': [
    { id: 'CL-0141', title: 'Delaware Law as Governing Jurisdiction',        doc: 'Master Services Agreement 2024',       bundle: 'BDL-002', confidence: 92, risk: 'Low',    polarity: '+' },
    { id: 'CL-0142', title: 'Binding Arbitration in New York Clause',        doc: 'Master Services Agreement 2024',       bundle: 'BDL-002', confidence: 91, risk: 'Low',    polarity: '+' },
    { id: 'CL-0143', title: 'Litigation Exclusion for Dispute Resolution',   doc: 'Legal Addendum D – Disputes',          bundle: 'BDL-035', confidence: 90, risk: 'Low',    polarity: '+' },
  ],
  'TF-0015': [
    { id: 'CL-0151', title: '72-Hour Initial Breach Notification Window',    doc: 'Security Incident Policy 2024',        bundle: 'BDL-036', confidence: 98, risk: 'Low',    polarity: '+' },
    { id: 'CL-0152', title: '14-Business-Day Full Incident Report Deadline', doc: 'Security Incident Policy 2024',        bundle: 'BDL-036', confidence: 97, risk: 'Low',    polarity: '+' },
    { id: 'CL-0153', title: 'Confirmed Breach Trigger for Notification',     doc: 'Data Security Standards 2026',         bundle: 'BDL-029', confidence: 96, risk: 'Low',    polarity: '+' },
    { id: 'CL-0154', title: 'Customer Data Scope for Notification',          doc: 'GDPR Data Processing Agreement',       bundle: 'BDL-011', confidence: 95, risk: 'Low',    polarity: '+' },
  ],
  'TF-0021': [
    { id: 'CL-0211', title: 'Non-Exclusive Territory License Grant',         doc: 'Distribution Agreement v2',            bundle: 'BDL-037', confidence: 95, risk: 'Low',    polarity: '+' },
    { id: 'CL-0212', title: 'Vendor Right to Add Channel Partners',          doc: 'Distribution Agreement v2',            bundle: 'BDL-037', confidence: 94, risk: 'Low',    polarity: '+' },
    { id: 'CL-0213', title: 'Agreed Territory Scope Definition',             doc: 'Enterprise Contract Template v3',      bundle: 'BDL-005', confidence: 93, risk: 'Low',    polarity: '+' },
  ],
  'TF-0022': [
    { id: 'CL-0221', title: 'API P95 Response Time 200ms Guarantee',         doc: 'Platform SLA 2026',                    bundle: 'BDL-038', confidence: 96, risk: 'Low',    polarity: '+' },
    { id: 'CL-0222', title: 'Standard Load Condition Definition',            doc: 'Platform SLA 2026',                    bundle: 'BDL-038', confidence: 95, risk: 'Low',    polarity: '+' },
    { id: 'CL-0223', title: '72-Hour Sustained Violation Threshold',         doc: 'SLA Credit Policy Addendum',           bundle: 'BDL-031', confidence: 94, risk: 'Low',    polarity: '+' },
    { id: 'CL-0224', title: 'Service Review Trigger on Violation',           doc: 'SLA Credit Policy Addendum',           bundle: 'BDL-031', confidence: 93, risk: 'Low',    polarity: '+' },
    { id: 'CL-0225', title: 'SLA Credit Eligibility on Performance Breach',  doc: 'Platform SLA 2026',                    bundle: 'BDL-038', confidence: 92, risk: 'Low',    polarity: '+' },
  ],
  'TF-0023': [
    { id: 'CL-0231', title: 'Subprocessor List Maintenance Obligation',      doc: 'GDPR Data Processing Agreement',       bundle: 'BDL-011', confidence: 98, risk: 'Low',    polarity: '+' },
    { id: 'CL-0232', title: '30-Day Advance Subprocessor Notice Clause',     doc: 'GDPR Data Processing Agreement',       bundle: 'BDL-011', confidence: 97, risk: 'Low',    polarity: '+' },
    { id: 'CL-0233', title: 'Subprocessor Personal Data Access Scope',       doc: 'Data Security Standards 2026',         bundle: 'BDL-029', confidence: 96, risk: 'Low',    polarity: '+' },
    { id: 'CL-0234', title: 'Up-to-Date Subprocessor List Requirement',      doc: 'EU Standard Contractual Clauses 2024', bundle: 'BDL-012', confidence: 95, risk: 'Low',    polarity: '+' },
  ],
  'TF-0024': [
    { id: 'CL-0241', title: 'Annual Audit Right – Once Per Calendar Year',   doc: 'Compliance Audit Addendum 2026',       bundle: 'BDL-039', confidence: 94, risk: 'Low',    polarity: '+' },
    { id: 'CL-0242', title: '30-Day Written Notice for Audit',               doc: 'Compliance Audit Addendum 2026',       bundle: 'BDL-039', confidence: 93, risk: 'Low',    polarity: '+' },
    { id: 'CL-0243', title: 'Customer Bears Audit Cost Clause',              doc: 'Master Services Agreement 2024',       bundle: 'BDL-002', confidence: 92, risk: 'Low',    polarity: '+' },
  ],
  'TF-0025': [
    { id: 'CL-0251', title: '"As-Is" Service Delivery Disclaimer',           doc: 'Master Services Agreement 2024',       bundle: 'BDL-002', confidence: 93, risk: 'Low',    polarity: '+' },
    { id: 'CL-0252', title: 'Merchantability Warranty Exclusion',            doc: 'Legal Addendum C – Liability',         bundle: 'BDL-033', confidence: 92, risk: 'Low',    polarity: '+' },
  ],
  'TF-0016': [
    { id: 'CL-0161', title: 'Named User Seat Restriction Clause',        doc: 'Software License Agreement v4',        bundle: 'BDL-020', confidence: 99, risk: 'Low',    polarity: '+' },
    { id: 'CL-0162', title: 'Seat Transfer Prohibition Policy',          doc: 'Software License Agreement v4',        bundle: 'BDL-020', confidence: 98, risk: 'Low',    polarity: '+' },
    { id: 'CL-0163', title: 'Volume Adjustment Billing Cycle Alignment', doc: 'Enterprise Licensing Terms 2026',      bundle: 'BDL-021', confidence: 97, risk: 'Low',    polarity: '+' },
    { id: 'CL-0164', title: 'Written Approval for Reassignment',         doc: 'Enterprise Licensing Terms 2026',      bundle: 'BDL-021', confidence: 96, risk: 'Low',    polarity: '+' },
    { id: 'CL-0165', title: 'Seat Audit and Compliance Verification',    doc: 'Vendor Compliance Addendum 2026',      bundle: 'BDL-022', confidence: 95, risk: 'Low',    polarity: '+' },
  ],
  'TF-0017': [
    { id: 'CL-0171', title: 'Stable API Backward Compatibility Window',  doc: 'API Governance Policy 2026',           bundle: 'BDL-023', confidence: 99, risk: 'Low',    polarity: '+' },
    { id: 'CL-0172', title: '12-Month Compatibility Support Commitment', doc: 'API Governance Policy 2026',           bundle: 'BDL-023', confidence: 98, risk: 'Low',    polarity: '+' },
    { id: 'CL-0173', title: '90-Day Advance Deprecation Notice Clause',  doc: 'Platform Service Terms v3',            bundle: 'BDL-024', confidence: 97, risk: 'Low',    polarity: '+' },
    { id: 'CL-0174', title: 'Major Version Release Definition',          doc: 'Platform Service Terms v3',            bundle: 'BDL-024', confidence: 96, risk: 'Low',    polarity: '+' },
  ],
  'TF-0018': [
    { id: 'CL-0181', title: 'Standard Tier 100 GB Per Seat Allocation',  doc: 'Cloud Subscription Agreement 2026',   bundle: 'BDL-025', confidence: 98, risk: 'Low',    polarity: '+' },
    { id: 'CL-0182', title: 'Enterprise Tier 1 TB Per Seat Allocation',  doc: 'Cloud Subscription Agreement 2026',   bundle: 'BDL-025', confidence: 98, risk: 'Low',    polarity: '+' },
    { id: 'CL-0183', title: 'Overage Rate $0.02 Per GB Per Month',       doc: 'Infrastructure Pricing Schedule',     bundle: 'BDL-026', confidence: 97, risk: 'Low',    polarity: '+' },
  ],
  'TF-0019': [
    { id: 'CL-0191', title: 'MFA Mandatory for All Data-Access Accounts',doc: 'Security Policy Framework 2026',      bundle: 'BDL-027', confidence: 99, risk: 'Low',    polarity: '+' },
    { id: 'CL-0192', title: 'Admin Account MFA Enforcement Clause',      doc: 'Security Policy Framework 2026',      bundle: 'BDL-027', confidence: 99, risk: 'Low',    polarity: '+' },
    { id: 'CL-0193', title: 'No Individual MFA Waiver Allowed',          doc: 'Platform Security Addendum',          bundle: 'BDL-028', confidence: 98, risk: 'Low',    polarity: '+' },
    { id: 'CL-0194', title: 'Customer Data Protection MFA Requirement',  doc: 'Data Security Standards 2026',        bundle: 'BDL-029', confidence: 97, risk: 'Low',    polarity: '+' },
    { id: 'CL-0195', title: 'MFA Compliance Audit Trail Requirement',    doc: 'Data Security Standards 2026',        bundle: 'BDL-029', confidence: 96, risk: 'Low',    polarity: '+' },
    { id: 'CL-0196', title: 'Platform-Wide MFA Policy Scope',            doc: 'Platform Security Addendum',          bundle: 'BDL-028', confidence: 95, risk: 'Low',    polarity: '+' },
  ],
  'TF-0020': [
    { id: 'CL-0201', title: 'Monthly Fee Basis for Credit Calculation',  doc: 'Service Level Agreement 2026',        bundle: 'BDL-030', confidence: 97, risk: 'Low',    polarity: '+' },
    { id: 'CL-0202', title: '10% Credit for 0.1%–0.5% SLA Breach',      doc: 'Service Level Agreement 2026',        bundle: 'BDL-030', confidence: 96, risk: 'Low',    polarity: '+' },
    { id: 'CL-0203', title: '25% Credit for SLA Breach Over 0.5%',      doc: 'Service Level Agreement 2026',        bundle: 'BDL-030', confidence: 95, risk: 'Low',    polarity: '+' },
    { id: 'CL-0204', title: 'Affected Service Scope for Credit Calc',    doc: 'SLA Credit Policy Addendum',          bundle: 'BDL-031', confidence: 94, risk: 'Low',    polarity: '+' },
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

// ── Fact Slide-out ────────────────────────────────────────────────────────────
function FactSlideOut({ fact, onClose, onExpand, onPropose, onBreakGlass, bgRecord }) {
  const [tab, setTab] = useState('Overview')

  const evidence = (EVIDENCE_BY_FACT[fact.id] || []).sort((a, b) => b.confidence - a.confidence)
  const gov = factGovernance[fact.id] || {}
  const context = FACT_CONTEXT[fact.id] || 'Context not available for this fact.'
  const hasActiveBG = bgRecord?.status === 'active'

  const sigColor = (c) => ({ green: ['rgba(34,197,94,0.08)','rgba(34,197,94,0.2)','#4ade80'], amber: ['rgba(245,158,11,0.08)','rgba(245,158,11,0.2)','#fbbf24'], red: ['rgba(239,68,68,0.08)','rgba(239,68,68,0.2)','#f87171'], purple: ['rgba(124,92,252,0.08)','rgba(124,92,252,0.2)','#a78bfa'] }[c] || ['rgba(71,85,105,0.15)','rgba(71,85,105,0.3)','#94a3b8'])

  return (
    <SlideOut
      title={fact.title}
      subtitle={null}
      badges={[
        { label: fact.id, variant: 'gray' },
        { label: fact.status === 'verified' ? 'Verified' : fact.status === 'pending' ? 'Pending' : 'Conflict', variant: fact.status },
        { label: fact.tag, variant: 'gray' },
      ]}
      onClose={onClose}
      actions={
        <div className="flex gap-1.5">
          {hasActiveBG && (
            <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg shrink-0"
              style={{ background: 'rgba(185,28,28,0.2)', border: '1px solid rgba(239,68,68,0.4)', color: '#fca5a5' }}>
              ⚡ Break Glass Active
            </span>
          )}
          <button onClick={onExpand} className="btn-ghost p-1.5" title="Open full fact page">
            <ExternalLink size={13} />
          </button>
        </div>
      }>
      <TabBar tabs={['Overview', `Evidence (${evidence.length})`, 'Details']} active={tab} onChange={setTab} />

      {/* ── OVERVIEW ── */}
      {tab === 'Overview' && (
        <div className="mt-4 space-y-4">

          {/* Break Glass active banner */}
          {hasActiveBG && (
            <div className="rounded-xl p-3.5 flex items-start gap-2.5"
              style={{ background: 'rgba(185,28,28,0.1)', border: '1px solid rgba(239,68,68,0.4)' }}>
              <span className="text-base shrink-0">⚡</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold mb-0.5" style={{ color: '#fca5a5' }}>Break Glass Active</p>
                <p className="text-[11px] leading-relaxed" style={{ color: '#f87171', opacity: 0.85 }}>
                  An emergency override is in effect until <strong>{bgRecord.expiryDate}</strong>.
                  Requested by <strong>{bgRecord.requestedBy}</strong> on {bgRecord.requestedAt}.
                  The original verified fact remains on record.
                </p>
              </div>
            </div>
          )}

          {/* Normalized truth statement */}
          <div className="rounded-xl p-4" style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.25)' }}>
            <div className="flex items-center gap-1.5 mb-2">
              <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0" style={{ background: '#3b82f6' }}>
                <span className="text-[8px] text-white font-bold">V</span>
              </div>
              <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#60a5fa' }}>Verified Truth Statement</p>
            </div>
            <p className="text-sm font-medium text-text-primary leading-relaxed">{fact.text?.replace(/"/g, '')}</p>
          </div>

          {/* Context */}
          <div className="glass-card p-3.5">
            <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-1.5">What this governs</p>
            <p className="text-xs text-text-muted leading-relaxed">{context}</p>
          </div>

          {/* Signals grid — 3 columns */}
          <div>
            <p className="section-label mb-2">Signals</p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Confidence', value: `${fact.confidence}%`, color: fact.confidence >= 90 ? 'green' : fact.confidence >= 70 ? 'amber' : 'red' },
                { label: 'Risk',       value: fact.risk,             color: fact.risk === 'Low' ? 'green' : fact.risk === 'Medium' ? 'amber' : 'red' },
                { label: 'Polarity',   value: fact.polarity === '+' ? 'Positive' : 'Negative', color: fact.polarity === '+' ? 'green' : 'red' },
                { label: 'Valid From', value: 'Jan 10, 2024',        color: 'purple' },
                { label: 'Valid To',   value: fact.expired ? 'Expired' : 'Dec 31, 2025', color: fact.expired ? 'red' : 'purple' },
                { label: 'Last Review',value: fact.time,             color: 'purple' },
              ].map(({ label, value, color }) => {
                const c = sigColor(color)
                return (
                  <div key={label} className="rounded-lg p-2.5" style={{ background: c[0], border: `1px solid ${c[1]}` }}>
                    <p className="text-[9px] text-text-muted mb-1">{label}</p>
                    <p className="text-xs font-bold leading-tight" style={{ color: c[2] }}>{value}</p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Attestation snapshot — shared component */}
          <GovernanceSnapshot gov={gov} />

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <button className="btn-primary flex-1 gap-1.5 text-xs justify-center" onClick={onPropose}
              style={{ background: 'linear-gradient(135deg,#7c3aed,#6d28d9)', border: '1px solid rgba(124,58,237,0.5)' }}>
              <Sparkles size={12} /> Propose Change
            </button>
            <button className="flex-1 text-xs py-2 px-3 rounded-lg font-medium transition-all flex items-center justify-center gap-1.5"
              style={{ background: hasActiveBG ? 'rgba(185,28,28,0.15)' : 'rgba(239,68,68,0.07)', border: `1px solid ${hasActiveBG ? 'rgba(239,68,68,0.5)' : 'rgba(239,68,68,0.22)'}`, color: '#f87171' }}
              onClick={hasActiveBG ? undefined : onBreakGlass}>
              {hasActiveBG ? '⚡ Override Active' : '⊗ Break Glass'}
            </button>
          </div>
        </div>
      )}

      {/* ── EVIDENCE ── */}
      {tab.startsWith('Evidence') && (
        <div className="mt-4 space-y-3">
          {/* Summary bar */}
          <div className="flex items-center justify-between">
            <p className="section-label">Sources</p>
            <span className="text-[10px] text-text-muted">{evidence.length} source{evidence.length !== 1 ? 's' : ''} · ranked by confidence</span>
          </div>

          {evidence.length === 0 ? (
            <p className="text-xs text-text-muted italic py-4 text-center">No evidence linked to this fact yet.</p>
          ) : evidence.map((c, i) => (
            <div key={c.id} className="glass-card p-3">
              <div className="flex items-start gap-2.5">
                {/* Rank badge */}
                <div className="w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 text-[9px] font-bold"
                  style={{ background: i === 0 ? 'rgba(167,139,250,0.2)' : 'rgba(255,255,255,0.06)', color: i === 0 ? '#a78bfa' : '#64748b', border: `1px solid ${i === 0 ? 'rgba(167,139,250,0.3)' : 'rgba(255,255,255,0.08)'}` }}>
                  #{i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  {/* Claim ID + title */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[9px] font-mono text-text-muted">{c.id}</span>
                    <p className="text-xs font-medium text-text-primary leading-snug">{c.title}</p>
                  </div>
                  {/* Confidence bar */}
                  <ConfidenceBar value={c.confidence} risk={c.risk} />
                  {/* Meta row */}
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <span className="text-[10px] text-text-muted truncate max-w-[130px]" title={c.doc}>{c.doc}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded"
                      style={{ background: 'rgba(124,92,252,0.1)', color: '#a78bfa', border: '1px solid rgba(124,92,252,0.2)' }}>
                      {c.bundle}
                    </span>
                    <span className="text-[10px] font-semibold ml-auto" style={{ color: c.polarity === '+' ? '#4ade80' : '#f87171' }}>
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

          {/* Governance trail — shared component */}
          <div>
            <p className="section-label mb-3">Governance Trail</p>
            <GovernanceTimeline gov={gov} />
          </div>

          {/* Break Glass record — shown if active */}
          {hasActiveBG && (
            <div>
              <p className="section-label mb-3" style={{ color: '#f87171' }}>⚡ Break Glass Record</p>
              <div className="rounded-xl p-4 space-y-2"
                style={{ background: 'rgba(185,28,28,0.08)', border: '1px solid rgba(239,68,68,0.3)' }}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-mono" style={{ color: '#f87171' }}>{bgRecord.id}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                    style={{ background: 'rgba(185,28,28,0.2)', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.35)' }}>
                    ⚡ Active Override
                  </span>
                </div>
                {[
                  ['Requested by',  bgRecord.requestedBy],
                  ['Logged at',     bgRecord.requestedAt],
                  ['Expires',       bgRecord.expiryDate],
                  ['Duration',      bgRecord.duration],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between py-1.5" style={{ borderBottom: '1px solid rgba(239,68,68,0.1)' }}>
                    <span className="text-[11px] text-text-muted">{k}</span>
                    <span className="text-[11px] font-medium" style={{ color: '#fca5a5' }}>{v}</span>
                  </div>
                ))}
                <div className="pt-1">
                  <p className="text-[10px] text-text-muted mb-0.5">Reason</p>
                  <p className="text-[11px] leading-relaxed" style={{ color: '#fca5a5', opacity: 0.85 }}>{bgRecord.reason}</p>
                </div>
              </div>
            </div>
          )}

          {/* Plane metadata */}
          <div>
            <p className="section-label mb-2">Plane Metadata</p>
            <div className="space-y-0">
              {[
                ['Owner',       'Sales'],
                ['Scope',       'Workspace'],
                ['State',       fact.status === 'verified' ? 'Verified' : fact.status === 'pending' ? 'Pending Review' : 'In Conflict'],
                ['Expiry',      fact.expiry],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between items-center py-2.5"
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <span className="text-xs text-text-muted">{k}</span>
                  <span className="text-xs font-medium text-text-secondary">{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Extracted entities — secondary metadata */}
          <div>
            <p className="section-label mb-2">Extracted Entities</p>
            <div className="grid grid-cols-2 gap-1.5">
              {ENTITIES.map(({ type, value }) => {
                const cfg = entityConfig[type]
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
    </SlideOut>
  )
}

// ── Review helpers ────────────────────────────────────────────────────────────
const REVIEW_REASON = {
  'expiring-soon':    { label: 'Expiring Soon',          color: '#fbbf24', bg: 'rgba(245,158,11,0.1)',   border: 'rgba(245,158,11,0.3)',  dot: '#fbbf24' },
  'evidence-changed': { label: 'Evidence Changed',       color: '#60a5fa', bg: 'rgba(59,130,246,0.1)',   border: 'rgba(59,130,246,0.3)',  dot: '#60a5fa' },
  'new-conflict':     { label: 'New Conflicting Signal', color: '#f87171', bg: 'rgba(239,68,68,0.1)',    border: 'rgba(239,68,68,0.3)',   dot: '#f87171' },
  'manual-review':    { label: 'Manual Review',          color: '#a78bfa', bg: 'rgba(124,92,252,0.1)',   border: 'rgba(124,92,252,0.3)', dot: '#a78bfa' },
}

const REVIEW_PRIORITY = {
  high:   { label: 'High',   color: '#f87171', bg: 'rgba(239,68,68,0.1)',    border: 'rgba(239,68,68,0.3)'   },
  medium: { label: 'Medium', color: '#fbbf24', bg: 'rgba(245,158,11,0.1)',   border: 'rgba(245,158,11,0.3)'  },
  low:    { label: 'Low',    color: '#4ade80', bg: 'rgba(34,197,94,0.1)',    border: 'rgba(34,197,94,0.3)'   },
}

const REVIEW_STATUS = {
  'pending':   { label: 'Pending',   color: '#94a3b8', bg: 'rgba(148,163,184,0.1)',  border: 'rgba(148,163,184,0.25)' },
  'in-review': { label: 'In Review', color: '#60a5fa', bg: 'rgba(59,130,246,0.1)',   border: 'rgba(59,130,246,0.3)'   },
  'escalated': { label: 'Escalated', color: '#fbbf24', bg: 'rgba(245,158,11,0.1)',   border: 'rgba(245,158,11,0.3)'   },
  'approved':  { label: 'Approved',  color: '#4ade80', bg: 'rgba(34,197,94,0.1)',    border: 'rgba(34,197,94,0.3)'    },
}

function ReviewSlideOut({ item, onClose, onApprove, onPropose, onRequestEvidence, onEscalate }) {
  const [tab, setTab] = useState('Overview')
  const [comment, setComment] = useState('')
  const [localComments, setLocalComments] = useState(item.comments || [])

  const gov     = factGovernance[item.factId] || {}
  const reason  = REVIEW_REASON[item.reason]  || REVIEW_REASON['manual-review']
  const priority= REVIEW_PRIORITY[item.priority] || REVIEW_PRIORITY['medium']

  const sigColor = c => ({ green: ['rgba(34,197,94,0.08)','rgba(34,197,94,0.2)','#4ade80'], amber: ['rgba(245,158,11,0.08)','rgba(245,158,11,0.2)','#fbbf24'], red: ['rgba(239,68,68,0.08)','rgba(239,68,68,0.2)','#f87171'] }[c] || ['rgba(71,85,105,0.12)','rgba(71,85,105,0.25)','#94a3b8'])

  const handleAddComment = () => {
    if (!comment.trim()) return
    setLocalComments(prev => [...prev, {
      id: `C-${Date.now()}`,
      author: 'Alex Rivera', initials: 'AR',
      avatarGradient: 'linear-gradient(135deg,#6366f1,#a78bfa)',
      text: comment.trim(),
      date: new Date().toISOString().slice(0, 10),
    }])
    setComment('')
  }

  const commentTab = `Comments (${localComments.length})`

  return (
    <SlideOut
      title={item.factTitle}
      subtitle={item.factId}
      badges={[{ label: item.tag, variant: 'gray' }]}
      onClose={onClose}
      actions={
        <div className="flex gap-1.5 flex-wrap">
          <span className="text-[10px] px-2 py-1 rounded-lg font-semibold"
            style={{ background: priority.bg, border: `1px solid ${priority.border}`, color: priority.color }}>
            {priority.label} Priority
          </span>
          <span className="text-[10px] px-2 py-1 rounded-lg font-semibold"
            style={{ background: reason.bg, border: `1px solid ${reason.border}`, color: reason.color }}>
            {reason.label}
          </span>
        </div>
      }>

      {/* Tabs */}
      <div className="tab-bar mb-4">
        {['Overview', 'What Changes', commentTab].map(t => (
          <button key={t} className={clsx('tab-btn', tab === t && 'active')} onClick={() => setTab(t)}>{t}</button>
        ))}
      </div>

      {tab === 'Overview' && (
        <div className="space-y-4 pb-4">
          {/* Fact statement */}
          <div>
            <p className="section-label mb-2">Verified Truth Statement</p>
            <div className="rounded-xl p-4" style={{ background: 'rgba(59,130,246,0.07)', border: '1px solid rgba(59,130,246,0.2)' }}>
              <div className="flex items-center gap-1.5 mb-2">
                <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0" style={{ background: '#3b82f6' }}>
                  <span className="text-[8px] text-white font-bold">V</span>
                </div>
                <span className="text-[10px] font-semibold" style={{ color: '#60a5fa' }}>Verified</span>
              </div>
              <p className="text-sm font-medium text-text-primary leading-relaxed">{item.factText}</p>
            </div>
          </div>

          {/* Review reason context */}
          <div>
            <p className="section-label mb-2">Why This Is In Review</p>
            <div className="rounded-xl p-4" style={{ background: reason.bg, border: `1px solid ${reason.border}` }}>
              <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: reason.color }}>
                {reason.label}
              </p>
              <p className="text-xs leading-relaxed text-text-secondary">{item.reasonDetail}</p>
            </div>
          </div>

          {/* Signals */}
          <div>
            <p className="section-label mb-2">Signals</p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Confidence', value: `${item.confidence}%`, color: item.confidence >= 90 ? 'green' : item.confidence >= 70 ? 'amber' : 'red' },
                { label: 'Risk',       value: item.risk,             color: item.risk === 'Low' ? 'green' : item.risk === 'Medium' ? 'amber' : 'red' },
                { label: 'Queue Age',  value: `${item.daysInQueue}d`, color: item.daysInQueue >= 10 ? 'red' : item.daysInQueue >= 5 ? 'amber' : 'green' },
              ].map(({ label, value, color }) => {
                const [bg, border, c] = sigColor(color)
                return (
                  <div key={label} className="rounded-lg p-3 text-center" style={{ background: bg, border: `1px solid ${border}` }}>
                    <p className="text-[10px] text-text-muted mb-1">{label}</p>
                    <p className="text-sm font-bold" style={{ color: c }}>{value}</p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Governance Thread snapshot */}
          <div>
            <GovernanceSnapshot gov={gov} />
          </div>

          {/* Last approved */}
          <div className="rounded-lg p-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <p className="text-[10px] text-text-muted mb-0.5">Last approved by</p>
            <p className="text-xs font-medium text-text-secondary">
              {item.lastApprovedBy
                ? <>{item.lastApprovedBy} <span className="text-text-muted font-normal">· {item.lastApprovedAt}</span></>
                : <span className="text-text-muted italic">Not yet approved</span>}
            </p>
          </div>

          {/* Actions */}
          <div className="pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
            <p className="section-label mb-2">Review Actions</p>
            <div className="space-y-1.5">
              <button className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium transition-colors hover:brightness-110"
                style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', color: '#4ade80' }}
                onClick={() => onApprove(item)}>
                <CheckCircle size={13} /> Approve as-is — Fact stays verified
              </button>
              <button className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium transition-colors hover:brightness-110"
                style={{ background: 'rgba(124,92,252,0.1)', border: '1px solid rgba(124,92,252,0.3)', color: '#a78bfa' }}
                onClick={() => onPropose(item)}>
                <Sparkles size={13} /> Send to Proposal — Suggest a change
              </button>
              <button className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium transition-colors hover:brightness-110"
                style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)', color: '#60a5fa' }}
                onClick={() => onRequestEvidence(item)}>
                <FileSearch size={13} /> Request More Evidence
              </button>
              <button className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium transition-colors hover:brightness-110"
                style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', color: '#fbbf24' }}
                onClick={() => onEscalate(item)}>
                <ArrowUpCircle size={13} /> Escalate — Flag for senior review
              </button>
            </div>
          </div>
        </div>
      )}

      {tab === 'What Changes' && (
        <WhatChangesView changes={item.changes} />
      )}

      {tab === commentTab && (
        <div className="space-y-4 pb-4">
          {localComments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 gap-2">
              <MessageSquare size={20} className="text-text-muted opacity-40" />
              <p className="text-xs text-text-muted">No comments yet. Start the discussion.</p>
            </div>
          ) : localComments.map(c => (
            <div key={c.id} className="flex gap-3">
              <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold text-white"
                style={{ background: c.avatarGradient }}>{c.initials}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium text-text-secondary">{c.author}</span>
                  <span className="text-[10px] text-text-muted">{c.date}</span>
                </div>
                <div className="rounded-xl p-3 text-xs text-text-secondary leading-relaxed"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  {c.text}
                </div>
              </div>
            </div>
          ))}

          {/* Add comment */}
          <div className="pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="flex gap-2">
              <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold text-white"
                style={{ background: 'linear-gradient(135deg,#6366f1,#a78bfa)' }}>AR</div>
              <div className="flex-1">
                <textarea
                  className="input-base w-full text-xs resize-none mb-2"
                  rows={3}
                  placeholder="Add a comment or note for reviewers…"
                  value={comment}
                  onChange={e => setComment(e.target.value)} />
                <button className="btn-secondary text-xs py-1.5 px-3" onClick={handleAddComment}>
                  Post Comment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </SlideOut>
  )
}

// ── Proposal helpers ──────────────────────────────────────────────────────────
const PROPOSAL_STATUS = {
  'draft':        { label: 'Draft',          bg: 'rgba(148,163,184,0.1)',  border: 'rgba(148,163,184,0.25)', color: '#94a3b8' },
  'pending':      { label: 'Pending Review', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.3)',   color: '#fbbf24' },
  'under-review': { label: 'Under Review',   bg: 'rgba(96,165,250,0.12)', border: 'rgba(96,165,250,0.3)',  color: '#60a5fa' },
  'approved':     { label: 'Approved',       bg: 'rgba(34,197,94,0.12)',  border: 'rgba(34,197,94,0.3)',   color: '#4ade80' },
  'rejected':     { label: 'Rejected',       bg: 'rgba(239,68,68,0.12)',  border: 'rgba(239,68,68,0.3)',   color: '#f87171' },
  'superseded':   { label: 'Superseded',     bg: 'rgba(124,92,252,0.08)', border: 'rgba(124,92,252,0.2)', color: '#7c5cbf' },
}

const PROPOSAL_URGENCY = {
  high:   { label: 'Urgent',   color: '#f87171', bg: 'rgba(239,68,68,0.1)',   border: 'rgba(239,68,68,0.3)'   },
  medium: { label: 'Normal',   color: '#fbbf24', bg: 'rgba(245,158,11,0.1)',  border: 'rgba(245,158,11,0.3)'  },
  low:    { label: 'Low',      color: '#60a5fa', bg: 'rgba(59,130,246,0.1)',  border: 'rgba(59,130,246,0.3)'  },
}

const EVIDENCE_TYPE_ICON = {
  report:  FileText,
  legal:   Award,
  cert:    CheckCircle,
  claim:   Shield,
  package: Package,
}

const APPROVER_STATUS = {
  approved: { label: 'Approved', color: '#4ade80', bg: 'rgba(34,197,94,0.12)',  icon: CheckCircle },
  rejected: { label: 'Rejected', color: '#f87171', bg: 'rgba(239,68,68,0.1)',   icon: XCircle    },
  pending:  { label: 'Pending',  color: '#94a3b8', bg: 'rgba(148,163,184,0.1)', icon: null       },
}

// ── Provenance chain — shows full audit trail for sandbox proposals ───────────
function ProvenanceChain({ proposal }) {
  const isNewFact = proposal.scenario === 'new-fact'
  const claims = proposal.incomingClaims || []
  const steps = [
    { Icon: Package,      label: 'Sandbox',  name: proposal.originMeta.sandboxName,  id: proposal.originMeta.sandboxId,  color: '#2dd4bf', bg: 'rgba(20,184,166,0.12)'  },
    { Icon: Layers,       label: 'Package',  name: proposal.originMeta.packageName,  id: proposal.originMeta.packageId,  color: '#a78bfa', bg: 'rgba(124,92,252,0.12)'  },
    ...(proposal.sourceBundle ? [{ Icon: FileText, label: 'Bundle', name: proposal.sourceBundle.name, id: proposal.sourceBundle.id, color: '#60a5fa', bg: 'rgba(59,130,246,0.12)' }] : []),
    ...(claims.length ? [{ Icon: MessageSquare, label: `${claims.length} Promoted Claim${claims.length > 1 ? 's' : ''}`, name: claims.map(c => c.id).join(', '), id: null, color: '#fbbf24', bg: 'rgba(245,158,11,0.12)' }] : []),
    { Icon: Sparkles,    label: 'Proposal', name: proposal.id, id: null, color: '#a78bfa', bg: 'rgba(124,92,252,0.15)'  },
    { Icon: Shield,      label: isNewFact ? 'New Fact (to be created)' : 'Existing Fact', name: proposal.factTitle, id: proposal.factId || null, color: isNewFact ? '#94a3b8' : '#4ade80', bg: isNewFact ? 'rgba(148,163,184,0.1)' : 'rgba(34,197,94,0.12)' },
  ]
  return (
    <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}>
      <p className="section-label mb-3">Provenance Chain</p>
      {steps.map((step, i) => (
        <div key={i} className="flex items-start gap-3">
          <div className="flex flex-col items-center shrink-0">
            <div className="w-7 h-7 rounded-full flex items-center justify-center"
              style={{ background: step.bg, border: `1px solid ${step.color}55` }}>
              <step.Icon size={12} style={{ color: step.color }} />
            </div>
            {i < steps.length - 1 && (
              <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.1)', marginTop: 2, marginBottom: 2 }} />
            )}
          </div>
          <div className="flex-1 min-w-0 pt-1" style={{ paddingBottom: i < steps.length - 1 ? 0 : 0 }}>
            <p className="text-[9px] font-bold uppercase tracking-widest mb-0.5" style={{ color: step.color }}>{step.label}</p>
            {step.name && <p className="text-[11px] text-text-secondary truncate leading-tight">{step.name}</p>}
            {step.id && <p className="text-[10px] font-mono text-text-muted">{step.id}</p>}
            {i < steps.length - 1 && <div style={{ height: 10 }} />}
          </div>
        </div>
      ))}
    </div>
  )
}

function ProposalSlideOut({ proposal, onClose, onApprove, onReject, onSupersede, onSubmitDraft }) {
  const [tab, setTab]       = useState('Overview')
  const [comment, setComment] = useState('')
  const [localComments, setLocalComments] = useState(proposal.comments || [])

  const sc        = PROPOSAL_STATUS[proposal.status]   || PROPOSAL_STATUS['pending']
  const urgency   = PROPOSAL_URGENCY[proposal.urgency] || PROPOSAL_URGENCY['medium']
  const isSandbox = proposal.origin === 'sandbox-promotion'
  const isNewFact = proposal.scenario === 'new-fact'
  const isTerminal = ['approved','rejected','superseded'].includes(proposal.status)
  const isDraft    = proposal.status === 'draft'
  const commentTab = `Discussion (${localComments.length})`
  const claimsCount = (proposal.incomingClaims || []).length
  const claimsTab  = isSandbox && claimsCount > 0 ? `Claims (${claimsCount})` : null

  const handleAddComment = () => {
    if (!comment.trim()) return
    setLocalComments(prev => [...prev, {
      id: `C-${Date.now()}`,
      author: 'Alex Rivera', initials: 'AR',
      avatarGradient: 'linear-gradient(135deg,#6366f1,#a78bfa)',
      text: comment.trim(),
      date: new Date().toISOString().slice(0, 10),
    }])
    setComment('')
  }

  return (
    <SlideOut
      title={proposal.factTitle}
      subtitle={proposal.id}
      badges={[
        { label: proposal.tag, variant: 'gray' },
        ...(isNewFact ? [{ label: '🆕 New Fact', variant: 'gray' }] : []),
      ]}
      onClose={onClose}
      actions={
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Origin badge — visually distinct for sandbox */}
          {isSandbox ? (
            <span className="flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-lg"
              style={{ background: 'rgba(20,184,166,0.12)', border: '1px solid rgba(20,184,166,0.35)', color: '#2dd4bf' }}>
              <Package size={10} /> Sandbox Promotion
            </span>
          ) : (
            <span className="flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-lg"
              style={{ background: 'rgba(124,92,252,0.1)', border: '1px solid rgba(124,92,252,0.3)', color: '#a78bfa' }}>
              <PenLine size={10} /> Propose Change
            </span>
          )}
          <span className="text-[10px] font-semibold px-2 py-1 rounded-lg"
            style={{ background: sc.bg, border: `1px solid ${sc.border}`, color: sc.color }}>
            {sc.label}
          </span>
        </div>
      }>

      {/* Tabs */}
      <div className="tab-bar mb-4" style={{ overflowX: 'auto', flexShrink: 0 }}>
        {[
          'Overview',
          ...(claimsTab ? [claimsTab] : []),
          `Evidence (${(proposal.evidence||[]).length})`,
          'What Changes',
          'Governance Thread',
        ].map(t => (
          <button key={t} className={clsx('tab-btn', tab === t && 'active')} style={{ flex: 'none' }} onClick={() => setTab(t)}>{t}</button>
        ))}
      </div>

      {/* ── OVERVIEW ── */}
      {tab === 'Overview' && (
        <div className="space-y-4 pb-4">
          {/* Sandbox: provenance chain (collapses the old simple banner into the chain) */}
          {isSandbox && proposal.originMeta && (
            <ProvenanceChain proposal={proposal} />
          )}

          {/* Meta row */}
          <div className="flex items-center gap-3 flex-wrap text-[11px] text-text-muted">
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold text-white shrink-0"
                style={{ background: proposal.avatarGradient }}>{proposal.initials}</div>
              <span className="font-medium text-text-secondary">{proposal.submittedBy}</span>
            </div>
            <span>·</span>
            <span>{proposal.submittedAt}</span>
            <span>·</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] font-semibold"
              style={{ background: urgency.bg, border: `1px solid ${urgency.border}`, color: urgency.color }}>
              {urgency.label} urgency
            </span>
          </div>

          {/* Truth state / diff */}
          <div>
            <p className="section-label mb-2">{isNewFact ? 'New Fact Creation' : 'Truth Change'}</p>
            <div className="space-y-2">
              {/* Current truth — only shown for modify-fact scenario */}
              {proposal.currentText ? (
                <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.09)' }}>
                  <div className="flex items-center gap-1.5 mb-2">
                    <div className="w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0" style={{ background: '#3b82f6' }}>
                      <span className="text-[7px] text-white font-bold">V</span>
                    </div>
                    <p className="text-[9px] font-bold uppercase tracking-wider text-text-muted">Current Verified Truth</p>
                  </div>
                  <p className="text-xs leading-relaxed text-text-muted">{proposal.currentText}</p>
                </div>
              ) : (
                /* New-fact: no existing truth */
                <div className="rounded-xl p-4 flex items-center gap-3"
                  style={{ background: 'rgba(20,184,166,0.06)', border: '1px dashed rgba(20,184,166,0.4)' }}>
                  <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: 'rgba(20,184,166,0.15)' }}>
                    <span className="text-sm">🆕</span>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold mb-0.5" style={{ color: '#2dd4bf' }}>No Existing Fact</p>
                    <p className="text-[11px] text-text-muted leading-snug">Approving this proposal will create a brand-new verified truth fact — nothing currently exists on this topic.</p>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-center text-text-muted opacity-40 text-[11px]">
                {isNewFact ? '↓ proposed new fact' : '↓ proposed change'}
              </div>

              {/* Proposed truth */}
              <div className="rounded-xl p-4" style={{ background: 'rgba(124,92,252,0.08)', border: '1px solid rgba(124,92,252,0.3)' }}>
                <div className="flex items-center gap-1.5 mb-2">
                  <Sparkles size={11} style={{ color: '#a78bfa' }} />
                  <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: '#a78bfa' }}>
                    {isNewFact ? 'Proposed New Fact' : 'Proposed Truth'}
                  </p>
                </div>
                <p className="text-xs leading-relaxed text-text-secondary font-medium">{proposal.proposedText}</p>
              </div>
            </div>
          </div>

          {/* Reason */}
          <div>
            <p className="section-label mb-2">Rationale</p>
            <div className="rounded-xl p-4" style={{ background: 'rgba(124,92,252,0.05)', border: '1px solid rgba(124,92,252,0.15)' }}>
              <p className="text-xs leading-relaxed text-text-secondary italic">"{proposal.reason}"</p>
            </div>
          </div>

          {/* Rejection reason */}
          {proposal.status === 'rejected' && proposal.rejectionReason && (
            <div className="rounded-xl p-4" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)' }}>
              <p className="text-[9px] font-bold uppercase tracking-wider mb-2" style={{ color: '#f87171' }}>Rejection Reason</p>
              <p className="text-xs leading-relaxed" style={{ color: '#fca5a5' }}>{proposal.rejectionReason}</p>
            </div>
          )}

          {/* Scope + effective date */}
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'Scope Impact',    value: proposal.scopeImpact   },
              { label: 'Effective Date',  value: proposal.effectiveDate  },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-lg p-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <p className="text-[10px] text-text-muted mb-0.5">{label}</p>
                <p className="text-xs font-medium text-text-secondary">{value || '—'}</p>
              </div>
            ))}
          </div>

          {/* Governance Signals — shown if set via Edit */}
          {(proposal.confidence != null || proposal.risk) && (() => {
            const conf = proposal.confidence
            const confColor = conf >= 90 ? '#4ade80' : conf >= 70 ? '#fbbf24' : '#f87171'
            const riskColor = proposal.risk === 'Low' ? '#4ade80' : proposal.risk === 'Medium' ? '#fbbf24' : '#f87171'
            const polarityColor = proposal.polarity === '+' ? '#4ade80' : proposal.polarity === '−' ? '#f87171' : '#94a3b8'
            return (
              <div>
                <p className="section-label mb-2">Governance Signals</p>
                <div className="rounded-xl p-3.5 space-y-2.5" style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  {/* Confidence bar */}
                  {conf != null && (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-text-muted">Confidence</span>
                        <span className="font-semibold" style={{ color: confColor }}>{conf}%</span>
                      </div>
                      <div className="rounded-full overflow-hidden" style={{ height: 4, background: 'rgba(255,255,255,0.06)' }}>
                        <div className="h-full rounded-full" style={{ width: `${conf}%`, background: confColor }} />
                      </div>
                    </div>
                  )}
                  {/* Risk + Polarity chips */}
                  <div className="flex items-center gap-2">
                    {proposal.risk && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                        style={{ background: `${riskColor}1a`, border: `1px solid ${riskColor}55`, color: riskColor }}>
                        {proposal.risk} Risk
                      </span>
                    )}
                    {proposal.polarity && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                        style={{ background: `${polarityColor}1a`, border: `1px solid ${polarityColor}55`, color: polarityColor }}>
                        {proposal.polarity === '+' ? '+ Positive' : proposal.polarity === '−' ? '− Negative' : '· Neutral'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )
          })()}

          {/* Validity dates — shown if set via Edit */}
          {(proposal.validFrom || proposal.expiresOn) && (
            <div>
              <p className="section-label mb-2">Validity Window</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Valid From',   value: proposal.validFrom },
                  { label: 'Expires On',   value: proposal.expiresOn },
                ].map(({ label, value }) => (
                  <div key={label} className="rounded-lg p-3" style={{ background: 'rgba(124,92,252,0.05)', border: '1px solid rgba(124,92,252,0.15)' }}>
                    <p className="text-[10px] text-text-muted mb-0.5">{label}</p>
                    <p className="text-xs font-medium" style={{ color: '#a78bfa' }}>{value || '—'}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action footer */}
          {!isTerminal && (
            <div className="pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
              <p className="section-label mb-2">Actions</p>
              <div className="space-y-1.5">
                {isDraft ? (
                  <button className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium hover:brightness-110"
                    style={{ background: 'rgba(124,92,252,0.15)', border: '1px solid rgba(124,92,252,0.4)', color: '#a78bfa' }}
                    onClick={() => onSubmitDraft(proposal)}>
                    <SendHorizonal size={13} /> Submit for Review
                  </button>
                ) : (
                  <>
                    <button className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium hover:brightness-110"
                      style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', color: '#4ade80' }}
                      onClick={() => onApprove(proposal)}>
                      <CheckCircle size={13} /> Approve Proposal
                    </button>
                    <button className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium hover:brightness-110"
                      style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171' }}
                      onClick={() => onReject(proposal)}>
                      <XCircle size={13} /> Reject Proposal
                    </button>
                    <button className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium hover:brightness-110"
                      style={{ background: 'rgba(148,163,184,0.08)', border: '1px solid rgba(148,163,184,0.2)', color: '#94a3b8' }}
                      onClick={() => onSupersede(proposal)}>
                      <Layers size={13} /> Mark as Superseded
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── CLAIMS (sandbox-origin proposals only) ── */}
      {claimsTab && tab === claimsTab && (
        <div className="space-y-3 pb-4">
          {/* Context banner */}
          <div className="rounded-xl p-3.5 flex items-start gap-3"
            style={{ background: 'rgba(20,184,166,0.07)', border: '1px solid rgba(20,184,166,0.25)' }}>
            <Package size={14} style={{ color: '#2dd4bf', flexShrink: 0, marginTop: 1 }} />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: '#2dd4bf' }}>Promoted from Sandbox</p>
              <p className="text-[11px] text-text-muted leading-relaxed">
                These claims were extracted in <span className="font-medium text-text-secondary">{proposal.originMeta?.sandboxName}</span> and promoted via package <span className="font-mono text-[10px]">{proposal.originMeta?.packageId}</span>. They form the primary evidence basis for this proposal.
              </p>
            </div>
          </div>

          {/* Claim cards */}
          {(proposal.incomingClaims || []).map((claim, i) => {
            const confColor = claim.confidence >= 90 ? '#4ade80' : claim.confidence >= 80 ? '#fbbf24' : '#f87171'
            const riskColor = claim.risk === 'Low' ? '#4ade80' : claim.risk === 'Medium' ? '#fbbf24' : '#f87171'
            return (
              <div key={claim.id} className="glass-card p-4">
                {/* Claim ID + type badge + polarity */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-mono text-text-muted">{claim.id}</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider"
                    style={{ background: 'rgba(20,184,166,0.1)', border: '1px solid rgba(20,184,166,0.25)', color: '#2dd4bf' }}>
                    sandbox claim
                  </span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded font-bold"
                    style={{ background: claim.polarity === '+' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', color: claim.polarity === '+' ? '#4ade80' : '#f87171' }}>
                    {claim.polarity === '+' ? '+ pos' : '− neg'}
                  </span>
                </div>
                {/* Title */}
                <p className="text-xs font-semibold text-text-primary mb-1.5">{claim.title}</p>
                {/* Claim text */}
                <p className="text-[11px] text-text-muted leading-relaxed italic mb-3">
                  "{claim.text}"
                </p>
                {/* Confidence bar */}
                <div className="flex items-center gap-2 mb-2.5">
                  <div className="flex-1 rounded-full overflow-hidden" style={{ height: 3, background: 'rgba(255,255,255,0.08)' }}>
                    <div className="h-full rounded-full transition-all" style={{ width: `${claim.confidence}%`, background: confColor }} />
                  </div>
                  <span className="text-[10px] font-semibold shrink-0" style={{ color: confColor }}>{claim.confidence}%</span>
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded shrink-0"
                    style={{ background: `${riskColor}18`, color: riskColor }}>{claim.risk}</span>
                </div>
                {/* Source + bundle */}
                <div className="flex items-center gap-2 text-[10px] text-text-muted flex-wrap">
                  <span className="flex items-center gap-1"><FileText size={9} /> {claim.doc}</span>
                  <span className="px-1.5 py-0.5 rounded font-mono"
                    style={{ background: 'rgba(59,130,246,0.1)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.2)' }}>
                    {claim.bundle}
                  </span>
                  {claim.bundleName && <span className="opacity-60">{claim.bundleName}</span>}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ── EVIDENCE ── */}
      {tab === `Evidence (${(proposal.evidence||[]).length})` && (
        <div className="space-y-2 pb-4">
          {(proposal.evidence || []).length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 gap-2">
              <FileSearch size={20} className="text-text-muted opacity-40" />
              <p className="text-xs text-text-muted">No supporting evidence attached.</p>
              {isDraft && <p className="text-[11px] text-text-muted opacity-70">Add evidence before submitting for review.</p>}
            </div>
          ) : (proposal.evidence || []).map((ev, i) => {
            const EIcon = EVIDENCE_TYPE_ICON[ev.type] || FileText
            const conf = ev.confidence
            const confColor = conf >= 90 ? '#4ade80' : conf >= 80 ? '#fbbf24' : '#f87171'
            return (
              <div key={ev.id} className="glass-card p-3.5">
                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-lg shrink-0" style={{ background: 'rgba(124,92,252,0.1)' }}>
                    <EIcon size={13} style={{ color: '#a78bfa' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[9px] font-mono text-text-muted">{ev.id}</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded uppercase font-bold tracking-wider"
                        style={{ background: 'rgba(124,92,252,0.1)', color: '#a78bfa' }}>{ev.type}</span>
                    </div>
                    <p className="text-xs font-medium text-text-primary mb-2">{ev.label}</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 rounded-full overflow-hidden" style={{ height: 3, background: 'rgba(255,255,255,0.08)' }}>
                        <div className="h-full rounded-full" style={{ width: `${conf}%`, background: confColor }} />
                      </div>
                      <span className="text-[10px] font-semibold shrink-0" style={{ color: confColor }}>{conf}%</span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ── DISCUSSION ── */}
      {tab === commentTab && (
        <div className="space-y-4 pb-4">
          {localComments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 gap-2">
              <MessageSquare size={20} className="text-text-muted opacity-40" />
              <p className="text-xs text-text-muted">No discussion yet.</p>
            </div>
          ) : localComments.map(c => (
            <div key={c.id} className="flex gap-3">
              <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold text-white"
                style={{ background: c.avatarGradient }}>{c.initials}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium text-text-secondary">{c.author}</span>
                  <span className="text-[10px] text-text-muted">{c.date}</span>
                </div>
                <div className="rounded-xl p-3 text-xs text-text-secondary leading-relaxed"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  {c.text}
                </div>
              </div>
            </div>
          ))}
          <div className="pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="flex gap-2">
              <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold text-white"
                style={{ background: 'linear-gradient(135deg,#6366f1,#a78bfa)' }}>AR</div>
              <div className="flex-1">
                <textarea className="input-base w-full text-xs resize-none mb-2" rows={3}
                  placeholder="Add to the discussion…"
                  value={comment} onChange={e => setComment(e.target.value)} />
                <button className="btn-secondary text-xs py-1.5 px-3" onClick={handleAddComment}>Post Comment</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── WHAT CHANGES ── */}
      {tab === 'What Changes' && (
        <WhatChangesView changes={proposal.changes} isNewFact={isNewFact} />
      )}

      {/* ── GOVERNANCE THREAD ── */}
      {tab === 'Governance Thread' && (
        <div className="space-y-4 pb-4">
          {/* Approval expectations */}
          {(proposal.approvers || []).length > 0 && (
            <div>
              <p className="section-label mb-3">Approval Expectations</p>
              <div className="space-y-2">
                {(proposal.approvers || []).map((ap, i) => {
                  const as = APPROVER_STATUS[ap.status] || APPROVER_STATUS['pending']
                  const AIcon = as.icon
                  return (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl"
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                      <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                        style={{ background: as.bg }}>
                        {AIcon ? <AIcon size={14} style={{ color: as.color }} /> : <span className="text-[11px] font-bold" style={{ color: as.color }}>{ap.name[0]}</span>}
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-medium text-text-primary">{ap.name}</p>
                        <p className="text-[10px] text-text-muted">{ap.role}</p>
                      </div>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                        style={{ background: as.bg, color: as.color }}>
                        {as.label}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Governance trail timeline */}
          <div>
            <p className="section-label mb-3">Governance Thread</p>
            <GovernanceTimeline gov={factGovernance[proposal.factId] || {}} />
          </div>

          <div className="rounded-xl p-4" style={{ background: 'rgba(124,92,252,0.05)', border: '1px solid rgba(124,92,252,0.15)' }}>
            <p className="text-[10px] font-semibold mb-1" style={{ color: '#a78bfa' }}>Governance Notice</p>
            <p className="text-[11px] text-text-muted leading-relaxed">
              All listed approvers must sign off before this proposal can be merged into the Truth Plane. Approval is recorded in the governance thread and is immutable once submitted.
            </p>
          </div>
        </div>
      )}
    </SlideOut>
  )
}

// ── Edit Proposal Modal — shared data ────────────────────────────────────────
const EDIT_PEOPLE = [
  { name: 'Sarah Chen',      email: 'sarah.chen@company.com',      initials: 'SC', gradient: 'linear-gradient(135deg,#a78bfa,#60a5fa)' },
  { name: 'Michael Torres',  email: 'michael.torres@company.com',  initials: 'MT', gradient: 'linear-gradient(135deg,#f59e0b,#ef4444)' },
  { name: 'Emily Rodriguez', email: 'emily.rodriguez@company.com', initials: 'ER', gradient: 'linear-gradient(135deg,#4ade80,#22d3ee)' },
  { name: 'David Kim',       email: 'david.kim@company.com',       initials: 'DK', gradient: 'linear-gradient(135deg,#f87171,#fb923c)' },
  { name: 'Lisa Anderson',   email: 'lisa.anderson@company.com',   initials: 'LA', gradient: 'linear-gradient(135deg,#2dd4bf,#60a5fa)' },
]
const EDIT_DOCS = [
  'Q1_Enterprise_Contracts.pdf',
  'Master_Service_Agreement.pdf',
  'Addendum_2024_Q1.pdf',
  'Payment_Terms_Schedule.pdf',
  'GDPR_Data_Processing_Agreement.pdf',
  'Security_Policy_Framework.pdf',
]
const EDIT_BUNDLES = [
  { id: 'BDL-001', name: 'Enterprise Contracts Q1' },
  { id: 'BDL-002', name: 'Master Services Pack' },
  { id: 'BDL-011', name: 'GDPR Compliance Bundle' },
  { id: 'BDL-020', name: 'Licensing & IP Terms' },
]
const EDIT_TAGS    = ['Finance', 'Compliance', 'Legal', 'Operations', 'Contracts', 'Eligibility']
const EDIT_SCOPES  = ['Company-wide', 'Department', 'Workspace']

function EditSectionHeader({ icon: Icon, label, color = '#a78bfa' }) {
  return (
    <div className="flex items-center gap-2 pb-1.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <Icon size={13} style={{ color }} />
      <p className="text-xs font-semibold text-text-secondary">{label}</p>
    </div>
  )
}

function EditReviewerPicker({ selected, onToggle, max }) {
  const [open, setOpen] = useState(false)
  const full = selected.length >= max
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <p className="text-[11px] text-text-muted">Assign specific reviewers <span className="opacity-60">(optional)</span></p>
        {selected.length > 0 && (
          <span className="text-[10px]" style={{ color: '#a78bfa' }}>{selected.length} selected</span>
        )}
      </div>
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selected.map(p => (
            <div key={p.email} className="flex items-center gap-1.5 px-2 py-1 rounded-lg"
              style={{ background: 'rgba(124,92,252,0.1)', border: '1px solid rgba(124,92,252,0.25)' }}>
              <span className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold text-white shrink-0"
                style={{ background: p.gradient }}>{p.initials}</span>
              <span className="text-[11px] text-text-secondary">{p.name}</span>
              <button onClick={() => onToggle(p)} className="ml-1 opacity-60 hover:opacity-100">
                <X size={9} style={{ color: '#a78bfa' }} />
              </button>
            </div>
          ))}
        </div>
      )}
      {!full && (
        <button
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-all"
          style={{ background: 'var(--input-bg)', border: `1px solid ${open ? 'rgba(124,92,252,0.5)' : 'var(--input-border)'}`, color: 'var(--text-muted)' }}
          onClick={() => setOpen(o => !o)}>
          <span>Add reviewer...</span>
          <ChevronRight size={12} className={`transition-transform shrink-0 ${open ? 'rotate-90' : ''}`} style={{ color: 'var(--text-muted)' }} />
        </button>
      )}
      {open && (
        <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(124,92,252,0.25)', background: '#131825' }}>
          {EDIT_PEOPLE.filter(p => !selected.find(s => s.email === p.email)).map((p, i) => (
            <button key={p.email}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 text-left transition-all hover:bg-white/[0.04]"
              style={{ borderTop: i > 0 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}
              onClick={() => { onToggle(p); setOpen(false) }}>
              <span className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white shrink-0"
                style={{ background: p.gradient }}>{p.initials}</span>
              <span className="text-xs font-semibold text-text-primary">{p.name}</span>
              <span className="text-xs text-text-muted">{p.email}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Edit Proposal Modal ───────────────────────────────────────────────────────
function EditProposalModal({ proposal, onClose, onSave }) {
  const isReview = !!proposal._isReviewItem

  // Left column
  const [title,        setTitle]        = useState(proposal.factTitle    || '')
  const [proposedText, setProposedText] = useState(proposal.proposedText || '')
  const [reason,       setReason]       = useState(proposal.reason       || '')
  const [sourceType,   setSourceType]   = useState('Document')
  const [selectedDocs, setSelectedDocs] = useState([])
  const [selectedBundles, setSelectedBundles] = useState([])
  const [sourcePerson, setSourcePerson] = useState(null)
  const [personOpen,   setPersonOpen]   = useState(false)
  const [evidenceNotes, setEvidenceNotes] = useState('')

  // Right column
  const [confidence,   setConfidence]   = useState(String(proposal.confidence ?? '95'))
  const [risk,         setRisk]         = useState(proposal.risk        ?? 'Low')
  const [polarity,     setPolarity]     = useState(proposal.polarity    ?? '+')
  const [validFrom,    setValidFrom]    = useState(proposal.validFrom   ?? '')
  const [expiresOn,    setExpiresOn]    = useState(proposal.expiresOn   ?? '')
  const [tag,          setTag]          = useState(proposal.tag         ?? 'Finance')
  const [scopeImpact,  setScopeImpact]  = useState(proposal.scopeImpact ?? 'Company-wide')
  const [effectiveDate, setEffectiveDate] = useState(proposal.effectiveDate ?? '')
  const [urgency,      setUrgency]      = useState(proposal.urgency     ?? 'medium')
  const [approvalMode, setApprovalMode] = useState('peer')
  const [peerCount,    setPeerCount]    = useState(1)
  const [reviewers,    setReviewers]    = useState([])

  const toggleDoc    = f  => setSelectedDocs(p    => p.includes(f)  ? p.filter(x => x !== f)  : [...p, f])
  const toggleBundle = id => setSelectedBundles(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id])
  const toggleReviewer = p => setReviewers(prev => {
    const exists = prev.find(r => r.email === p.email)
    if (exists) return prev.filter(r => r.email !== p.email)
    return [...prev, p]
  })

  const handleSave = () => {
    const updated = {
      ...proposal,
      factTitle:    title,
      proposedText,
      reason,
      confidence:   Number(confidence),
      risk,
      polarity,
      validFrom,
      expiresOn,
      tag,
      scopeImpact,
      effectiveDate,
      urgency,
    }
    onSave(updated)
  }

  const isUnderReview = proposal.status === 'under-review'

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}>
      <div className="w-full rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        style={{ maxWidth: 880, maxHeight: '92vh', background: 'var(--modal-bg)', border: '1px solid rgba(124,92,252,0.35)' }}
        onClick={e => e.stopPropagation()}>

        {/* ── Header ── */}
        <div className="flex items-center gap-3 px-6 py-4 shrink-0"
          style={{ borderBottom: '1px solid var(--slideout-border)' }}>
          <div className="p-2 rounded-xl shrink-0"
            style={{ background: 'rgba(124,92,252,0.12)', border: '1px solid rgba(124,92,252,0.28)' }}>
            <PenLine size={15} style={{ color: '#a78bfa' }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-mono text-text-muted mb-0.5">{proposal.id} · {isReview ? 'Review Item' : 'Proposal'}</p>
            <p className="text-sm font-semibold text-text-primary">Edit {isReview ? 'Review Item' : 'Proposal'}</p>
          </div>
          {isUnderReview && (
            <span className="flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-1 rounded-full shrink-0"
              style={{ background: 'rgba(96,165,250,0.12)', border: '1px solid rgba(96,165,250,0.3)', color: '#60a5fa' }}>
              <Eye size={9} /> Under Review — changes tracked
            </span>
          )}
          <button className="btn-ghost p-1.5 rounded-lg shrink-0" onClick={onClose}><X size={14} /></button>
        </div>

        {/* ── Body ── */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>

            {/* ════ LEFT ════ */}
            <div className="p-6 space-y-6" style={{ borderRight: '1px solid rgba(255,255,255,0.06)' }}>

              {/* Basic Information */}
              <div className="space-y-3">
                <EditSectionHeader icon={FileText} label="Basic Information" color="#60a5fa" />

                <div className="space-y-1">
                  <label className="text-xs font-medium text-text-secondary">Fact Title</label>
                  <input
                    className="input-base text-xs"
                    placeholder="e.g., Service Level Agreement – Uptime Guarantee"
                    value={title}
                    onChange={e => setTitle(e.target.value)} />
                </div>

                {/* Show current truth read-only for modify-fact */}
                {proposal.currentText && (
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-text-muted flex items-center gap-1.5">
                      Current Verified Truth
                      <span className="text-[10px] px-1.5 py-0.5 rounded font-normal"
                        style={{ background: 'rgba(96,165,250,0.08)', color: '#60a5fa', border: '1px solid rgba(96,165,250,0.2)' }}>read-only</span>
                    </label>
                    <div className="rounded-lg px-3 py-2.5 text-xs text-text-muted leading-relaxed"
                      style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}>
                      {proposal.currentText}
                    </div>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-xs font-medium text-text-secondary flex items-center gap-1">
                    Proposed Statement <span style={{ color: '#f87171' }}>*</span>
                  </label>
                  <textarea
                    className="input-base resize-none text-xs leading-relaxed"
                    rows={5}
                    placeholder="Enter the exact proposed truth statement..."
                    value={proposedText}
                    onChange={e => setProposedText(e.target.value)} />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-text-secondary">
                    Rationale <span className="text-text-muted font-normal">(why this change)</span>
                  </label>
                  <textarea
                    className="input-base resize-none text-xs leading-relaxed"
                    rows={3}
                    placeholder="Explain the business or legal reason for this proposal..."
                    value={reason}
                    onChange={e => setReason(e.target.value)} />
                </div>
              </div>

              {/* Evidence & Source */}
              <div className="space-y-3">
                <EditSectionHeader icon={FileSearch} label="Evidence & Source" color="#60a5fa" />

                <div className="flex gap-1 p-1 rounded-lg" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  {['Document', 'Bundle', 'Human', 'None'].map(opt => (
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
                      {EDIT_DOCS.map(f => {
                        const checked = selectedDocs.includes(f)
                        return (
                          <label key={f} className="flex items-center gap-2 p-2.5 rounded-lg cursor-pointer transition-all"
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
                    <button className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs text-text-muted transition-all hover:text-text-secondary hover:border-white/20"
                      style={{ border: '1px dashed rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.01)' }}>
                      <Upload size={11} /> Upload a document
                    </button>
                  </div>
                )}

                {sourceType === 'Bundle' && (
                  <div className="space-y-1.5">
                    <p className="text-[11px] text-text-muted">Select evidence bundles</p>
                    {EDIT_BUNDLES.map(b => {
                      const checked = selectedBundles.includes(b.id)
                      return (
                        <label key={b.id} className="flex items-center gap-2.5 p-2.5 rounded-lg cursor-pointer transition-all"
                          style={{ background: checked ? 'rgba(96,165,250,0.08)' : 'rgba(255,255,255,0.02)', border: `1px solid ${checked ? 'rgba(96,165,250,0.35)' : 'rgba(255,255,255,0.07)'}` }}>
                          <div className="w-3.5 h-3.5 rounded flex items-center justify-center shrink-0"
                            style={{ background: checked ? '#3b82f6' : 'transparent', border: checked ? '1px solid #3b82f6' : '1px solid rgba(255,255,255,0.2)' }}
                            onClick={() => toggleBundle(b.id)}>
                            {checked && <CheckCircle size={9} color="white" />}
                          </div>
                          <Package size={11} style={{ color: '#fbbf24' }} className="shrink-0" />
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded shrink-0"
                            style={{ background: 'rgba(124,92,252,0.12)', color: '#a78bfa', border: '1px solid rgba(124,92,252,0.2)' }}>{b.id}</span>
                          <span className="text-xs text-text-secondary truncate">{b.name}</span>
                        </label>
                      )
                    })}
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
                        {EDIT_PEOPLE.map((p, i) => (
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

                {sourceType === 'None' && (
                  <div className="flex items-start gap-2 rounded-lg px-3 py-2.5"
                    style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)' }}>
                    <AlertTriangle size={12} style={{ color: '#fbbf24', marginTop: 1, flexShrink: 0 }} />
                    <p className="text-[11px]" style={{ color: '#fbbf24' }}>Facts without linked evidence may have lower confidence and will be flagged for review.</p>
                  </div>
                )}

                {sourceType !== 'None' && (
                  <div className="space-y-1">
                    <label className="text-[11px] text-text-muted">Evidence notes <span className="opacity-60">(optional)</span></label>
                    <textarea
                      className="input-base resize-none text-xs"
                      rows={2}
                      placeholder="Reference specific sections, page numbers, or quotes..."
                      value={evidenceNotes}
                      onChange={e => setEvidenceNotes(e.target.value)} />
                  </div>
                )}

                {/* Existing evidence items (read view) */}
                {(proposal.evidence || []).length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">Existing Evidence ({proposal.evidence.length})</p>
                    {(proposal.evidence || []).map(ev => (
                      <div key={ev.id} className="flex items-center gap-2 px-2.5 py-2 rounded-lg"
                        style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}>
                        <FileText size={10} style={{ color: '#a78bfa', flexShrink: 0 }} />
                        <span className="text-[11px] text-text-secondary truncate flex-1">{ev.label}</span>
                        <span className="text-[9px] font-mono px-1 py-0.5 rounded shrink-0"
                          style={{ background: 'rgba(124,92,252,0.1)', color: '#a78bfa' }}>{ev.type}</span>
                        <span className="text-[10px] font-semibold shrink-0"
                          style={{ color: ev.confidence >= 90 ? '#4ade80' : ev.confidence >= 80 ? '#fbbf24' : '#f87171' }}>
                          {ev.confidence}%
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* ════ RIGHT ════ */}
            <div className="p-6 space-y-6">

              {/* Governance Signals */}
              <div className="space-y-3">
                <EditSectionHeader icon={TrendingUp} label="Governance Signals" color="#60a5fa" />
                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-1">
                    <label className="text-[10px] text-text-muted">Confidence (%)</label>
                    <input className="input-base text-xs py-1.5 px-2"
                      type="number" min="0" max="100"
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
                    <span className="font-semibold" style={{ color: Number(confidence) >= 90 ? '#4ade80' : Number(confidence) >= 70 ? '#fbbf24' : '#f87171' }}>
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

              {/* Validity & Scope */}
              <div className="space-y-3">
                <EditSectionHeader icon={Calendar} label="Validity & Scope" color="#a78bfa" />
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[10px] text-text-muted">Valid From <span className="opacity-60">(optional)</span></label>
                    <input type="date" className="input-base text-xs"
                      value={validFrom} onChange={e => setValidFrom(e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-text-muted">Expiration <span className="opacity-60">(optional)</span></label>
                    <input type="date" className="input-base text-xs"
                      value={expiresOn} onChange={e => setExpiresOn(e.target.value)} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[10px] text-text-muted">Knowledge Base</label>
                    <select className="input-base text-xs" value={tag} onChange={e => setTag(e.target.value)}>
                      {EDIT_TAGS.map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-text-muted">Effective Date <span className="opacity-60">(optional)</span></label>
                    <input type="date" className="input-base text-xs"
                      value={effectiveDate} onChange={e => setEffectiveDate(e.target.value)} />
                  </div>
                </div>
              </div>

              {/* Urgency & Approval Mode */}
              <div className="space-y-3">
                <EditSectionHeader icon={Lock} label="Urgency & Approval" color="#fbbf24" />

                {/* Urgency selector */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-text-muted">Urgency</label>
                  <div className="flex gap-1.5">
                    {[
                      { value: 'low',    label: 'Low',    color: '#60a5fa', border: 'rgba(59,130,246,0.4)',   bg: 'rgba(59,130,246,0.15)'  },
                      { value: 'medium', label: 'Normal', color: '#fbbf24', border: 'rgba(245,158,11,0.5)',   bg: 'rgba(245,158,11,0.15)'  },
                      { value: 'high',   label: 'Urgent', color: '#f87171', border: 'rgba(239,68,68,0.45)',   bg: 'rgba(239,68,68,0.15)'   },
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

                {/* Approval mode */}
                <div className="space-y-2">
                  {/* Automatic */}
                  <button
                    className="w-full flex items-start gap-3 p-3 rounded-xl text-left transition-all"
                    style={{
                      background: approvalMode === 'self' ? 'rgba(45,212,191,0.08)' : 'rgba(255,255,255,0.02)',
                      border: `1px solid ${approvalMode === 'self' ? 'rgba(45,212,191,0.35)' : 'rgba(255,255,255,0.08)'}`,
                    }}
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
                            style={{ background: 'rgba(45,212,191,0.15)', color: '#2dd4bf', border: '1px solid rgba(45,212,191,0.3)' }}>
                            ⚡ Auto-verified
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-text-muted leading-snug">
                        I am the sole author and approver. Fact becomes Verified immediately upon creation.
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
                    style={{
                      background: approvalMode === 'peer' ? 'rgba(167,139,250,0.08)' : 'rgba(255,255,255,0.02)',
                      border: `1px solid ${approvalMode === 'peer' ? 'rgba(167,139,250,0.35)' : 'rgba(255,255,255,0.08)'}`,
                    }}
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
                            style={{ background: 'rgba(167,139,250,0.15)', color: '#a78bfa', border: '1px solid rgba(167,139,250,0.3)' }}>
                            Review queue
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-text-muted leading-snug">
                        Requires sign-off from one or more peers before becoming Verified.
                      </p>
                    </div>
                    <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-1"
                      style={{ background: approvalMode === 'peer' ? '#a78bfa' : 'transparent', border: `2px solid ${approvalMode === 'peer' ? '#a78bfa' : 'rgba(255,255,255,0.2)'}` }}>
                      {approvalMode === 'peer' && <div className="w-1.5 h-1.5 rounded-full bg-[#131825]" />}
                    </div>
                  </button>
                </div>

                {/* Manual note card */}
                {approvalMode === 'peer' && (
                  <div className="rounded-xl p-3.5"
                    style={{ background: 'rgba(124,92,252,0.05)', border: '1px solid rgba(124,92,252,0.18)' }}>
                    <p className="text-[11px] text-text-muted leading-relaxed">
                      Fact will enter the review queue and require sign-off from a peer reviewer before becoming Verified.
                    </p>
                    <div className="flex items-center gap-1 pt-3">
                      {['Create', 'Approve', 'Verified'].map((step, i, arr) => (
                        <React.Fragment key={step}>
                          <div className="flex flex-col items-center gap-0.5">
                            <div className="w-5 h-5 rounded-full flex items-center justify-center"
                              style={{
                                background: i === arr.length - 1 ? 'rgba(34,197,94,0.15)' : 'rgba(167,139,250,0.12)',
                                border: `1px solid ${i === arr.length - 1 ? 'rgba(34,197,94,0.4)' : 'rgba(167,139,250,0.3)'}`,
                              }}>
                              {i === arr.length - 1
                                ? <CheckCircle size={9} style={{ color: '#4ade80' }} />
                                : <span className="text-[8px] font-bold" style={{ color: '#a78bfa' }}>{i + 1}</span>}
                            </div>
                            <p className="text-[8px] text-text-muted text-center leading-tight max-w-[44px]">{step}</p>
                          </div>
                          {i < arr.length - 1 && (
                            <ChevronRight size={9} className="text-text-muted opacity-25 shrink-0 mb-3" />
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="flex items-center justify-between px-6 py-4 shrink-0"
          style={{ borderTop: '1px solid var(--slideout-border)' }}>
          <p className="text-[11px] text-text-muted">
            {isUnderReview ? 'This proposal is under review — changes will be logged in the audit trail.' : 'All changes are saved to the proposal before submission.'}
          </p>
          <div className="flex items-center gap-2.5">
            <button className="btn-secondary text-xs py-1.5 px-4" onClick={onClose}>Cancel</button>
            <button
              className="flex items-center gap-1.5 text-xs font-semibold py-1.5 px-5 rounded-lg transition-all hover:brightness-110"
              style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)', color: '#fff', boxShadow: '0 2px 12px rgba(124,92,252,0.35)' }}
              onClick={handleSave}>
              <PenLine size={12} /> Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}

// ── Main Detail ───────────────────────────────────────────────────────────────

export default function TruthPlaneDetail() {
  const navigate = useNavigate()
  const plane = truthPlanes[0]
  const [tab, setTab]             = useState('Overview')
  const [overviewTab, setOverviewTab] = useState('At a Glance')

  // ── Overview dashboard derived data ──────────────────────────────────────
  const verifiedFacts = truthFacts.filter(f => f.status === 'verified').length
  const pendingFacts  = truthFacts.filter(f => f.status === 'pending').length
  const conflictFacts = truthFacts.filter(f => f.status === 'conflict').length

  const weeklyTrendData = [
    { w: 'W1', verified: verifiedFacts - 3, pending: pendingFacts + 2, conflict: conflictFacts + 1 },
    { w: 'W2', verified: verifiedFacts - 2, pending: pendingFacts + 1, conflict: conflictFacts + 1 },
    { w: 'W3', verified: verifiedFacts - 1, pending: pendingFacts + 1, conflict: conflictFacts     },
    { w: 'W4', verified: verifiedFacts,     pending: pendingFacts,     conflict: conflictFacts     },
  ]

  const PLANE_ACTIVITY = [
    { text: 'Fact updated — SLA Uptime Guarantee',    user: 'Sarah J.',  time: '5 min ago',  color: '#4ade80' },
    { text: 'New proposal created — Payment Terms',   user: 'Alex R.',   time: '1 hour ago', color: '#a78bfa' },
    { text: 'Review completed — GDPR Data Retention', user: 'Morgan B.', time: '3 hours ago', color: '#60a5fa' },
    { text: 'Fact expiry warning triggered',          user: 'System',    time: '1 day ago',  color: '#fbbf24' },
    { text: 'Proposal approved — Enterprise Discount',user: 'James P.',  time: '2 days ago', color: '#4ade80' },
  ]
  const [selectedFact, setSelectedFact]       = useState(null)
  const [showFilters, setShowFilters]         = useState(false)
  const [factFilterExpiry,    setFactFilterExpiry]    = useState('All')
  const [factFilterKB,        setFactFilterKB]        = useState('All')
  const [factFilterApproved,  setFactFilterApproved]  = useState('All')
  const [factFilterPromoted,  setFactFilterPromoted]  = useState('All')
  const [proposeFact, setProposeFact]         = useState(null)
  const [pendingApproval, setPendingApproval] = useState(null) // { item, onConfirm }
  const [breakGlassFact, setBreakGlassFact]  = useState(null)
  const [proposals, setProposals]             = useState(factProposals)
  const [bgRecords, setBgRecords]             = useState(breakGlassRecords)

  // Proposals tab state
  const [selectedProposal, setSelectedProposal] = useState(null)
  const [proposalFilter, setProposalFilter]     = useState('All')
  const [proposalSearch,  setProposalSearch]    = useState('')
  const [proposalOrigin,  setProposalOrigin]    = useState('All')
  const [proposalPackage, setProposalPackage]   = useState('All')

  // Derive unique packages from sandbox proposals for the dropdown
  const availablePackages = useMemo(() => {
    const seen = new Map()
    proposals.forEach(p => {
      const pkg = p.originMeta?.packageId
      if (pkg && !seen.has(pkg)) seen.set(pkg, p.originMeta.packageName || pkg)
    })
    return Array.from(seen.entries()).map(([id, name]) => ({ id, name }))
  }, [proposals])

  const filteredProposals = proposals.filter(p => {
    const statusMap = { 'Draft': 'draft', 'Pending Review': 'pending', 'Under Review': 'under-review', 'Approved': 'approved', 'Rejected': 'rejected', 'Superseded': 'superseded' }
    if (proposalFilter !== 'All' && p.status !== statusMap[proposalFilter]) return false
    if (proposalOrigin === 'Manual'  && p.origin !== 'manual')             return false
    if (proposalOrigin === 'Sandbox' && p.origin !== 'sandbox-promotion')  return false
    if (proposalPackage !== 'All'    && p.originMeta?.packageId !== proposalPackage) return false
    if (proposalSearch.trim()) {
      const q = proposalSearch.toLowerCase()
      if (!p.factTitle?.toLowerCase().includes(q) &&
          !p.id?.toLowerCase().includes(q) &&
          !p.originMeta?.packageId?.toLowerCase().includes(q)) return false
    }
    return true
  })

  const handleProposalApprove = (p) => {
    setPendingApproval({
      item: p,
      onConfirm: () => {
        setProposals(prev =>
          prev
            .map(x => x.id === p.id ? { ...x, status: 'approved', approvers: (x.approvers||[]).map(a => ({ ...a, status: 'approved' })) } : x)
            .filter(x => x.id === p.id || x.factId !== p.factId)
        )
        setSelectedProposal(null)
        setPendingApproval(null)
        setToast({ message: `Proposal approved — competing proposals removed`, color: '#4ade80' })
        setTimeout(() => setToast(null), 3500)
      }
    })
  }
  const handleProposalReject = (p) => {
    // Only this proposal is removed; others for the same fact remain
    setProposals(prev => prev.filter(x => x.id !== p.id))
    if (selectedProposal?.id === p.id) setSelectedProposal(null)
    setToast({ message: `Proposal rejected`, color: '#f87171' })
    setTimeout(() => setToast(null), 3000)
  }
  const handleProposalSupersede = (p) => {
    setProposals(prev => prev.map(x => x.id === p.id ? { ...x, status: 'superseded' } : x))
    setSelectedProposal(null)
  }
  const handleProposalSubmitDraft = (p) => {
    setProposals(prev => prev.map(x => x.id === p.id ? { ...x, status: 'pending' } : x))
    setSelectedProposal(prev => prev ? { ...prev, status: 'pending' } : null)
  }
  const handleProposalSendToReview = (p) => {
    // This proposal goes to review; all other proposals for the same fact disappear
    setProposals(prev =>
      prev
        .map(x => x.id === p.id ? { ...x, status: 'under-review' } : x)
        .filter(x => x.id === p.id || x.factId !== p.factId)
    )
    setSelectedProposal(prev => prev ? { ...prev, status: 'under-review' } : null)
    setToast({ message: `"${p.factTitle}" sent to Review — competing proposals removed`, color: '#60a5fa' })
    setTimeout(() => setToast(null), 3500)
  }
  const handleProposalEdit = (updated) => {
    if (updated._isReviewItem) {
      // Save back to review items with field remapping
      setReviewItems(prev => prev.map(x => x.id === updated._reviewId
        ? {
            ...x,
            factTitle:    updated.factTitle,
            factText:     updated.proposedText,
            reasonDetail: updated.reason,
            priority:     updated.urgency,
            risk:         updated.risk     ?? x.risk,
            confidence:   updated.confidence != null ? updated.confidence : x.confidence,
            tag:          updated.tag       ?? x.tag,
          }
        : x
      ))
      setToast({ message: `Review item updated`, color: '#a78bfa' })
    } else {
      setProposals(prev => prev.map(x => x.id === updated.id ? updated : x))
      if (selectedProposal?.id === updated.id) setSelectedProposal(updated)
      setToast({ message: `Proposal updated`, color: '#a78bfa' })
    }
    setEditingProposal(null)
    setTimeout(() => setToast(null), 3000)
  }

  // Review queue state
  const [reviewItems, setReviewItems]         = useState(seedReviewQueue)
  const [selectedReview, setSelectedReview]   = useState(null)
  const [reviewFilter, setReviewFilter]       = useState('All')
  const [reviewSearch,  setReviewSearch]      = useState('')
  const [reviewPriority,setReviewPriority]    = useState('All')
  const [evidenceRequestItem, setEvidenceRequestItem] = useState(null)
  const [escalateItem, setEscalateItem]               = useState(null)
  const [responseItem, setResponseItem]               = useState(null)
  const [toast, setToast]                             = useState(null)
  const [factPage, setFactPage]                       = useState(1)
  const [showCreateFact, setShowCreateFact]           = useState(false)
  const [expandedProposals, setExpandedProposals]     = useState({}) // keyed by proposal id
  const [editingProposal, setEditingProposal]         = useState(null)
  const FACTS_PER_PAGE = 10

  const filteredReview = reviewItems.filter(item => {
    const reasonMap = { 'Expiring Soon': 'expiring-soon', 'Evidence Changed': 'evidence-changed', 'New Conflict': 'new-conflict', 'Manual': 'manual-review' }
    if (reviewFilter !== 'All' && item.reason !== reasonMap[reviewFilter]) return false
    if (reviewPriority !== 'All' && item.priority !== reviewPriority.toLowerCase()) return false
    if (reviewSearch.trim()) {
      const q = reviewSearch.toLowerCase()
      if (!item.factTitle?.toLowerCase().includes(q) && !item.id?.toLowerCase().includes(q)) return false
    }
    return true
  })

  const handleReviewApprove = (item) => {
    setPendingApproval({
      item: { ...item, _isReviewItem: true },
      onConfirm: () => {
        const next     = (item.current_approvals || 0) + 1
        const required = item.required_approvals || 1
        setReviewItems(prev => prev.map(r =>
          r.id === item.id
            ? { ...r, current_approvals: next, status: next >= required ? 'approved' : r.status }
            : r
        ))
        setSelectedReview(null)
        setPendingApproval(null)
        setToast({ message: `Review item approved`, color: '#4ade80' })
        setTimeout(() => setToast(null), 3000)
      }
    })
  }

  const handleReviewEscalate = (item) => {
    setEscalateItem(item)
  }

  const handleEscalateSubmit = (escalation) => {
    setReviewItems(prev => prev.map(r =>
      r.id === escalateItem.id
        ? { ...r, status: 'escalated', ...escalation }
        : r
    ))
    if (selectedReview?.id === escalateItem.id) {
      setSelectedReview(prev => ({ ...prev, status: 'escalated', ...escalation }))
    }
    setEscalateItem(null)
    setToast({
      message: 'Escalated',
      sub: `Assigned to ${escalation.escalated_to.join(', ')}`,
      color: '#fbbf24',
    })
    setTimeout(() => setToast(null), 3500)
  }

  const handleReviewRequestEvidence = (item) => {
    setEvidenceRequestItem(item)
  }

  const handleEvidenceRequestSubmit = (request) => {
    // Mark card as waiting for evidence
    setReviewItems(prev => prev.map(r =>
      r.id === request.reviewItemId
        ? { ...r, status: 'waiting-evidence', evidenceRequest: request }
        : r
    ))
    if (selectedReview?.id === request.reviewItemId) {
      setSelectedReview(prev => ({ ...prev, status: 'waiting-evidence', evidenceRequest: request }))
    }
    setEvidenceRequestItem(null)
    // Toast
    setToast({ message: 'Evidence requested', sub: `Assigned to ${request.assignedTo}` })
    setTimeout(() => setToast(null), 3500)
  }

  // V1 assumption: current user (Alex Rivera) can always respond.
  // In production this would check request.assignedToId === currentUser.id
  const CURRENT_USER_NAME = 'Alex Rivera'

  const handleEvidenceResponseSubmit = (response) => {
    const { new_status } = response
    // Map response status to item status
    const itemStatusMap = {
      'Responded':        'evidence-responded',
      'Unable to Provide':'evidence-unable',
      'Reassigned':       'evidence-reassigned',
    }
    const newItemStatus = itemStatusMap[new_status] || 'waiting-evidence'

    setReviewItems(prev => prev.map(r => {
      if (r.id !== responseItem.id) return r
      // Append response to request thread, update request status
      const updatedRequest = {
        ...r.evidenceRequest,
        status: new_status,
        assignedTo: response.reassigned_to || r.evidenceRequest?.assignedTo,
        responses: [...(r.evidenceRequest?.responses || []), response],
      }
      return { ...r, status: newItemStatus, evidenceRequest: updatedRequest }
    }))
    if (selectedReview?.id === responseItem.id) {
      setSelectedReview(prev => {
        const updatedRequest = {
          ...prev.evidenceRequest,
          status: new_status,
          responses: [...(prev.evidenceRequest?.responses || []), response],
        }
        return { ...prev, status: newItemStatus, evidenceRequest: updatedRequest }
      })
    }
    setResponseItem(null)
    const toastMessages = {
      'Responded':        { message: 'Response sent', sub: 'Reviewer can now proceed' },
      'Unable to Provide':{ message: 'Marked as unable to provide', sub: 'Request updated' },
      'Reassigned':       { message: 'Request reassigned', sub: `Transferred to ${response.reassigned_to}` },
    }
    const t = toastMessages[new_status] || { message: 'Response sent' }
    setToast({ ...t, color: '#60a5fa' })
    setTimeout(() => setToast(null), 3500)
  }

  const handleProposalSubmit = (p) => {
    setProposals(prev => [p, ...prev])
  }

  const handleBreakGlassSubmit = (rec) => {
    setBgRecords(prev => ({ ...prev, [rec.factId]: rec }))
  }

  const metrics = [
    { label: 'Facts', value: plane.facts, color: 'green' },
    { label: 'About to Expire', value: plane.expiring, color: 'amber' },
    { label: 'Needs Review', value: plane.review, color: 'blue' },
    { label: 'Proposals', value: plane.proposals, color: 'purple' },
  ]

  return (
    <div className="flex h-full">
      <div className="flex-1 min-w-0 p-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-text-muted mb-4">
          <button onClick={() => navigate('/intelligence-library')} className="hover:text-text-secondary">Intelligence Library</button>
          <ChevronRight size={12} className="opacity-40" />
          <button onClick={() => navigate('/truth-plane')} className="hover:text-text-secondary">Truth Plane</button>
          <ChevronRight size={12} className="opacity-40" />
          <span className="text-text-secondary font-medium">{plane.name}</span>
        </nav>

        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl" style={{ background: 'rgba(59,130,246,0.15)' }}>
              <Shield size={20} style={{ color: '#60a5fa' }} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-xl font-bold text-text-primary">{plane.name}</h1>
                <Badge variant="verified">Verified</Badge>
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(59,130,246,0.15)', color: '#60a5fa' }}>Workspace</span>
              </div>
              <p className="text-sm text-text-muted">{plane.desc}</p>
            </div>
          </div>
          <button className="btn-secondary gap-1.5">
            <Settings size={14} /> Settings
          </button>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-4 gap-2 mb-5">
          {metrics.map(m => <MetricCard key={m.label} label={m.label} value={m.value} color={m.color} />)}
        </div>

        {/* Tab bar */}
        <div className="tab-bar mb-5">
          {['Overview', 'Facts', 'Review', 'Proposals'].map(t => (
            <button key={t} className={clsx('tab-btn', tab === t && 'active')} onClick={() => setTab(t)}>{t}</button>
          ))}
        </div>

        {/* Facts Tab */}
        {tab === 'Facts' && (() => {
          // Derive "Needs Review" reasons (array of strings, empty = no issue)
          const getReviewReasons = (fact) => {
            const gov = factGovernance[fact.id]
            // resolvedBy is only a required role when the fact has an active conflict
            const requiredRoles = fact.status === 'conflict'
              ? ['createdBy', 'promotedBy', 'resolvedBy', 'approvedBy']
              : ['createdBy', 'promotedBy', 'approvedBy']
            const incompleteAttestation = gov
              ? requiredRoles.some(k => Array.isArray(gov[k]) && gov[k][2] === false)
              : false
            const reasons = []
            if (fact.expired)               reasons.push('This fact is expired')
            if (fact.status === 'conflict')  reasons.push('This fact has a conflict')
            if (incompleteAttestation)      reasons.push('This fact has incomplete attestation')
            return reasons
          }

          return (
            <div className="space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                <SearchBar placeholder="Search facts..." value="" onChange={() => {}} />

                {/* Expiration */}
                <select
                  className="input-base text-xs px-3 py-2"
                  style={{ width: 'auto' }}
                  value={factFilterExpiry}
                  onChange={e => setFactFilterExpiry(e.target.value)}>
                  <option value="All">Expiration</option>
                  <option value="Expired">Expired</option>
                  <option value="Expiring Soon">Expiring Soon</option>
                  <option value="Valid">Valid</option>
                </select>

                {/* Knowledge Base */}
                <select
                  className="input-base text-xs px-3 py-2"
                  style={{ width: 'auto' }}
                  value={factFilterKB}
                  onChange={e => setFactFilterKB(e.target.value)}>
                  <option value="All">Knowledge</option>
                  <option value="Finance">Finance</option>
                  <option value="Compliance">Compliance</option>
                  <option value="Eligibility">Eligibility</option>
                  <option value="Legal">Legal</option>
                  <option value="Operations">Operations</option>
                  <option value="Contracts">Contracts</option>
                </select>

                {/* Approved By */}
                <select
                  className="input-base text-xs px-3 py-2"
                  style={{ width: 'auto' }}
                  value={factFilterApproved}
                  onChange={e => setFactFilterApproved(e.target.value)}>
                  <option value="All">Approved By</option>
                  <option>Sarah Chen</option>
                  <option>Michael Torres</option>
                  <option>Emma Wilson</option>
                  <option>James Rodriguez</option>
                  <option>Lisa Anderson</option>
                  <option>David Kim</option>
                  <option>James Park</option>
                  <option>Emma Rodriguez</option>
                </select>

                {/* Promoted By */}
                <select
                  className="input-base text-xs px-3 py-2"
                  style={{ width: 'auto' }}
                  value={factFilterPromoted}
                  onChange={e => setFactFilterPromoted(e.target.value)}>
                  <option value="All">Promoted By</option>
                  <option>James Park</option>
                  <option>Alex Kim</option>
                  <option>Lisa Anderson</option>
                  <option>Sarah Chen</option>
                  <option>Emma Rodriguez</option>
                  <option>David Kim</option>
                  <option>Michael Torres</option>
                  <option>Alex Rivera</option>
                </select>

                <button className="btn-secondary gap-1.5" onClick={() => setShowFilters(true)}>
                  <Filter size={13} /> Filters
                </button>
                <button
                  className="btn-primary gap-1.5 ml-auto"
                  style={{ background: 'linear-gradient(135deg, #0d9488, #0891b2)', border: 'none', color: '#fff', fontSize: 12, padding: '6px 14px', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', whiteSpace: 'nowrap' }}
                  onClick={() => setShowCreateFact(true)}
                >
                  <Zap size={13} /> Create Fact
                </button>
              </div>

              <div className="space-y-2">
                {truthFacts.slice((factPage - 1) * FACTS_PER_PAGE, factPage * FACTS_PER_PAGE).map(fact => {
                  const reviewReasons = getReviewReasons(fact)
                  const neeReview     = reviewReasons.length > 0
                  const riskColor     = fact.risk === 'Low' ? 'green' : fact.risk === 'Medium' ? 'amber' : 'red'
                  return (
                    <div key={fact.id}
                      className={clsx('row-item relative', fact.status === 'conflict' && 'conflict', selectedFact?.id === fact.id && 'selected')}
                      onClick={() => setSelectedFact(fact)}>

                      {/* Top-right corner: eye + 3-dot */}
                      <div className="absolute top-3 right-3 flex items-center gap-0.5" onClick={e => e.stopPropagation()}>
                        <button className="btn-ghost p-1.5" title="Open slide-out" onClick={() => setSelectedFact(fact)}>
                          <Eye size={14} className="text-text-muted" />
                        </button>
                        <ThreeDot items={[
                          { label: 'Propose Change', onClick: () => setProposeFact(fact) },
                          { label: 'View Evidence',  onClick: () => setSelectedFact(fact) },
                          { label: 'Break Glass',    onClick: () => setBreakGlassFact(fact), danger: true },
                        ]} />
                      </div>

                      <div className="flex items-start gap-3 pr-20">
                        <div className="p-1.5 rounded-lg mt-0.5 shrink-0" style={{ background: 'rgba(59,130,246,0.12)' }}>
                          <Shield size={14} style={{ color: '#60a5fa' }} />
                        </div>
                        <div className="flex-1 min-w-0">

                          {/* ── Title row ── */}
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[11px] font-mono text-text-muted">{fact.id}</span>
                            <p className="text-sm font-medium text-text-primary">{fact.title}</p>
                            <span className="px-2 py-0.5 rounded text-[11px] font-medium"
                              style={{ background: 'rgba(124,92,252,0.1)', color: '#a78bfa', border: '1px solid rgba(124,92,252,0.2)' }}>
                              {fact.tag}
                            </span>

                            {/* Auto-verified badge */}
                            {fact.autoVerified && !neeReview && (
                              <span className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full"
                                style={{ background: 'rgba(45,212,191,0.1)', border: '1px solid rgba(45,212,191,0.3)', color: '#2dd4bf' }}>
                                ⚡ Auto
                              </span>
                            )}

                            {/* Status badge — "Needs Review" with tooltip */}
                            {neeReview ? (
                              <span className="relative group/nr inline-flex items-center">
                                <span className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full cursor-default"
                                  style={{ background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.35)', color: '#fbbf24' }}>
                                  <AlertTriangle size={9} /> Needs Review
                                </span>
                                {/* Tooltip */}
                                <div className="pointer-events-none absolute bottom-full left-0 mb-2 z-50 opacity-0 group-hover/nr:opacity-100 transition-opacity duration-150">
                                  <div className="rounded-xl px-3 py-2.5 shadow-2xl min-w-[200px]"
                                    style={{ background: '#1e293b', border: '1px solid rgba(245,158,11,0.35)' }}>
                                    <p className="text-[10px] font-semibold uppercase tracking-wider mb-2"
                                      style={{ color: '#fbbf24' }}>Why Needs Review</p>
                                    <div className="space-y-1.5">
                                      {reviewReasons.map(reason => (
                                        <div key={reason} className="flex items-start gap-1.5">
                                          <AlertTriangle size={9} style={{ color: '#fbbf24', marginTop: 2, flexShrink: 0 }} />
                                          <p className="text-[11px] text-text-secondary leading-snug">{reason}</p>
                                        </div>
                                      ))}
                                    </div>
                                    {/* Arrow */}
                                    <div className="absolute top-full left-4 w-2 h-2 rotate-45 -mt-1"
                                      style={{ background: '#1e293b', borderRight: '1px solid rgba(245,158,11,0.35)', borderBottom: '1px solid rgba(245,158,11,0.35)' }} />
                                  </div>
                                </div>
                              </span>
                            ) : fact.status === 'verified' ? (
                              <Badge variant="verified">✓ Verified</Badge>
                            ) : null}

                            {/* Break Glass indicator */}
                            {bgRecords[fact.id]?.status === 'active' && (
                              <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full"
                                style={{ background: 'rgba(185,28,28,0.18)', border: '1px solid rgba(239,68,68,0.45)', color: '#fca5a5' }}>
                                ⚡ Break Glass
                              </span>
                            )}
                          </div>

                          {/* ── Excerpt ── */}
                          <p className="text-xs text-text-muted mt-1 line-clamp-1 italic">{fact.text?.replace(/"/g, '')}</p>

                          {/* ── Governance signals row ── */}
                          <div className="flex items-center gap-3 mt-2 flex-wrap text-[11px] text-text-muted">

                            {/* Attestation — unchanged, leftmost */}
                            <GovernanceCompact gov={factGovernance[fact.id]} />

                            {/* Expiry — prominent if expired */}
                            <span className={clsx('flex items-center gap-1', fact.expired ? 'text-red-400' : '')}>
                              {fact.expired
                                ? <AlertTriangle size={10} style={{ color: '#f87171' }} />
                                : <Calendar size={10} className="opacity-60" />}
                              {fact.expiry}
                            </span>

                            {/* Sources */}
                            <span className="flex items-center gap-1">
                              <FileText size={10} className="opacity-60" />
                              {fact.sources} sources
                            </span>

                            {/* Time */}
                            <span className="flex items-center gap-1">
                              <Clock size={10} className="opacity-60" />
                              {fact.time}
                            </span>

                            {/* Confidence + Risk + Polarity — right-aligned */}
                            <div className="ml-auto flex items-center gap-1.5">
                              <span className="text-[10px] text-text-muted">{fact.polarity === '+' ? '+' : '−'}</span>
                              <Chip color={riskColor} tooltip="AI Confidence Score">{fact.confidence}%</Chip>
                              <Chip color={riskColor} tooltip="Information Risk Level">{fact.risk}</Chip>
                            </div>
                          </div>

                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })()}

        {tab === 'Overview' && (
          <div className="space-y-4">

            {/* ── Sub-tab pills ── */}
            <div className="flex gap-1.5 p-1 rounded-xl w-fit" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              {['At a Glance', 'Pipeline & Health', 'Sources & Evidence'].map(st => (
                <button key={st} onClick={() => setOverviewTab(st)}
                  className="px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all"
                  style={overviewTab === st
                    ? { background: 'rgba(255,255,255,0.1)', color: '#f1f5f9', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }
                    : { color: '#64748b' }}>
                  {st}
                </button>
              ))}
            </div>

            {/* ══ At a Glance ══ */}
            {overviewTab === 'At a Glance' && (
              <div className="space-y-3">

                {/* KPI cards row */}
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { label: 'Total Facts',   value: plane.facts,         trend: '+12%', up: true,  color: '#4ade80', bg: 'rgba(34,197,94,0.08)',   border: 'rgba(34,197,94,0.2)',   Icon: Shield,   sub: 'Active facts in this plane' },
                    { label: 'Proposals',     value: proposals.length,    trend: '+5',   up: true,  color: '#a78bfa', bg: 'rgba(124,92,252,0.08)',  border: 'rgba(124,92,252,0.2)',  Icon: Sparkles, sub: 'Pending proposals' },
                    { label: 'Needs Review',  value: reviewItems.length,  trend: '-3',   up: false, color: '#60a5fa', bg: 'rgba(59,130,246,0.08)',  border: 'rgba(59,130,246,0.2)',  Icon: Eye,      sub: 'Awaiting review' },
                    { label: 'Expiring Soon', value: plane.expiring,      trend: '-8%',  up: false, color: '#fbbf24', bg: 'rgba(245,158,11,0.08)',  border: 'rgba(245,158,11,0.2)',  Icon: Clock,    sub: 'In next 30 days' },
                  ].map(({ label, value, trend, up, color, bg, border, Icon, sub }) => (
                    <div key={label} className="rounded-xl p-4" style={{ background: bg, border: `1px solid ${border}` }}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1.5">
                          <Icon size={12} style={{ color }} />
                          <p className="text-[11px] font-medium" style={{ color }}>{label}</p>
                        </div>
                        <span className="text-[10px] font-semibold" style={{ color: up ? '#4ade80' : '#f87171' }}>
                          {up ? '↑' : '↓'} {trend}
                        </span>
                      </div>
                      <p className="text-3xl font-bold mb-0.5" style={{ color }}>{value}</p>
                      <p className="text-[10px] text-text-muted">{sub}</p>
                    </div>
                  ))}
                </div>

                {/* Verification Rate + Recent Activity */}
                <div className="grid grid-cols-2 gap-3">

                  {/* Verification Rate */}
                  <div className="rounded-xl p-4 glass-card">
                    <div className="flex items-center gap-1.5 mb-4">
                      <CheckCircle size={13} style={{ color: '#4ade80' }} />
                      <p className="text-xs font-semibold text-text-secondary">Verification Rate</p>
                    </div>
                    {[
                      { label: 'Verified', count: verifiedFacts, color: '#4ade80' },
                      { label: 'Pending',  count: pendingFacts,  color: '#fbbf24' },
                      { label: 'Conflict', count: conflictFacts, color: '#f87171' },
                    ].map(({ label, count, color }) => {
                      const pct = truthFacts.length > 0 ? Math.round((count / truthFacts.length) * 100) : 0
                      return (
                        <div key={label} className="mb-3">
                          <div className="flex justify-between mb-1">
                            <span className="text-[11px]" style={{ color }}>{label}</span>
                            <span className="text-[11px] font-semibold" style={{ color }}>{pct}%</span>
                          </div>
                          <div className="rounded-full overflow-hidden" style={{ height: 5, background: 'rgba(255,255,255,0.07)' }}>
                            <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
                          </div>
                        </div>
                      )
                    })}
                    <div className="flex items-center justify-between pt-3 mt-1" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                      <span className="text-[10px] text-text-muted">Overall confidence</span>
                      <span className="text-base font-bold" style={{ color: '#4ade80' }}>{plane.confidence}%</span>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="rounded-xl p-4 glass-card">
                    <div className="flex items-center gap-1.5 mb-4">
                      <Activity size={13} style={{ color: '#60a5fa' }} />
                      <p className="text-xs font-semibold text-text-secondary">Recent Activity</p>
                    </div>
                    <div className="space-y-3">
                      {PLANE_ACTIVITY.map((act, i) => (
                        <div key={i} className="flex items-start gap-2.5">
                          <div className="w-1.5 h-1.5 rounded-full mt-[5px] shrink-0" style={{ background: act.color }} />
                          <div className="flex-1 min-w-0">
                            <p className="text-[11px] text-text-secondary leading-snug truncate">{act.text}</p>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="text-[10px] text-text-muted">{act.user}</span>
                              <span className="text-[10px] text-text-muted">·</span>
                              <span className="text-[10px] text-text-muted">{act.time}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ══ Pipeline & Health ══ */}
            {overviewTab === 'Pipeline & Health' && (
              <div className="space-y-4">

                {/* What Needs Attention */}
                <div>
                  <p className="section-label mb-2.5">What Needs Attention</p>
                  <div className="space-y-2">
                    {[
                      { dot: '#fbbf24', label: 'Facts expiring soon',   count: plane.expiring,                                                              cta: 'Review →',        tabTarget: 'Facts'    },
                      { dot: '#60a5fa', label: 'Pending human review',  count: reviewItems.filter(r => r.status !== 'approved').length,                     cta: 'Go to Review →',  tabTarget: 'Review'   },
                      { dot: '#a78bfa', label: 'Active proposals',      count: proposals.filter(p => !['rejected','superseded'].includes(p.status)).length, cta: 'View →',          tabTarget: 'Proposals'},
                    ].map(({ dot, label, count, cta, tabTarget }) => (
                      <div key={label} className="flex items-center gap-3 px-4 py-3.5 rounded-xl"
                        style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}>
                        <div className="w-2 h-2 rounded-full shrink-0" style={{ background: dot }} />
                        <p className="text-sm text-text-secondary flex-1">{label}</p>
                        <span className="text-sm font-bold" style={{ color: dot }}>{count}</span>
                        <button
                          className="text-[11px] font-semibold ml-2 hover:opacity-80 transition-opacity"
                          style={{ color: dot }}
                          onClick={() => setTab(tabTarget)}>
                          {cta}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pipeline Summary */}
                <div>
                  <p className="section-label mb-2.5">Pipeline Summary</p>
                  <div className="rounded-xl p-5 glass-card">
                    <div className="flex items-center justify-center gap-3">
                      {[
                        { label: 'Claims', value: 24,                 color: '#2dd4bf', bg: 'rgba(20,184,166,0.1)',  border: 'rgba(20,184,166,0.3)'  },
                        'arrow',
                        { label: 'Review', value: reviewItems.length, color: '#60a5fa', bg: 'rgba(59,130,246,0.1)',  border: 'rgba(59,130,246,0.3)'  },
                        'arrow',
                        { label: 'Truth',  value: plane.facts,        color: '#4ade80', bg: 'rgba(34,197,94,0.1)',   border: 'rgba(34,197,94,0.3)'   },
                      ].map((item, i) => item === 'arrow' ? (
                        <div key={i} className="flex items-center gap-1 shrink-0">
                          <div style={{ width: 24, height: 1, background: 'rgba(255,255,255,0.15)' }} />
                          <svg width="6" height="9" viewBox="0 0 6 9" fill="rgba(255,255,255,0.25)">
                            <path d="M0 0 L6 4.5 L0 9 Z" />
                          </svg>
                        </div>
                      ) : (
                        <div key={item.label} className="flex-1 text-center rounded-xl py-5 px-3"
                          style={{ background: item.bg, border: `1px solid ${item.border}` }}>
                          <p className="text-3xl font-bold mb-1" style={{ color: item.color }}>{item.value}</p>
                          <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: item.color, opacity: 0.65 }}>{item.label}</p>
                        </div>
                      ))}
                    </div>
                    <p className="text-[11px] text-text-muted text-center mt-3.5">Sandbox claims → review → verified truth</p>
                  </div>
                </div>

                {/* Fact Verification Trend */}
                <div>
                  <p className="section-label mb-2.5">Fact Verification Trend — Last 4 Weeks</p>
                  <div className="rounded-xl p-4 glass-card">
                    <ResponsiveContainer width="100%" height={150}>
                      <AreaChart data={weeklyTrendData} margin={{ top: 5, right: 8, bottom: 0, left: -22 }}>
                        <defs>
                          <linearGradient id="tpGradVerified" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%"  stopColor="#4ade80" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#4ade80" stopOpacity={0}   />
                          </linearGradient>
                          <linearGradient id="tpGradPending" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%"  stopColor="#fbbf24" stopOpacity={0.25} />
                            <stop offset="95%" stopColor="#fbbf24" stopOpacity={0}    />
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="w" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                        <Tooltip
                          contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 11 }}
                          labelStyle={{ color: '#94a3b8' }} />
                        <Area type="monotone" dataKey="verified" stroke="#4ade80" strokeWidth={2} fill="url(#tpGradVerified)" name="Verified" dot={false} />
                        <Area type="monotone" dataKey="pending"  stroke="#fbbf24" strokeWidth={1.5} fill="url(#tpGradPending)" name="Pending" dot={false} />
                      </AreaChart>
                    </ResponsiveContainer>
                    <div className="flex items-center gap-5 mt-2 justify-center">
                      <span className="flex items-center gap-1.5 text-[10px] text-text-muted">
                        <span className="w-3 h-0.5 rounded-full inline-block" style={{ background: '#4ade80' }} /> Verified
                      </span>
                      <span className="flex items-center gap-1.5 text-[10px] text-text-muted">
                        <span className="w-3 h-0.5 rounded-full inline-block" style={{ background: '#fbbf24' }} /> Pending
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ══ Sources & Evidence ══ */}
            {overviewTab === 'Sources & Evidence' && (
              <div className="space-y-4">

                {/* Stats row */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'SOURCE DOCS', value: 18, Icon: Database, color: '#a78bfa', bg: 'rgba(124,92,252,0.08)', border: 'rgba(124,92,252,0.2)' },
                    { label: 'BUNDLES',     value: 4,  Icon: Package,  color: '#60a5fa', bg: 'rgba(59,130,246,0.08)',  border: 'rgba(59,130,246,0.2)' },
                  ].map(({ label, value, Icon, color, bg, border }) => (
                    <div key={label} className="rounded-xl p-5 text-center" style={{ background: bg, border: `1px solid ${border}` }}>
                      <Icon size={20} className="mx-auto mb-2.5" style={{ color }} />
                      <p className="text-2xl font-bold mb-1" style={{ color }}>{value}</p>
                      <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color, opacity: 0.6 }}>{label}</p>
                    </div>
                  ))}
                </div>

                {/* Last sync pill */}
                <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-lg"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <RefreshCw size={11} className="text-text-muted" />
                  <span className="text-[11px] text-text-muted">Last source sync: <strong className="text-text-secondary font-medium">2 hours ago</strong></span>
                </div>

                {/* Confidence distribution */}
                <div className="rounded-xl p-4 glass-card">
                  <p className="text-xs font-semibold text-text-secondary mb-4">Confidence Distribution</p>
                  {[
                    { label: 'High (90–100%)', count: truthFacts.filter(f => f.confidence >= 90).length,                                          color: '#4ade80' },
                    { label: 'Medium (70–89%)', count: truthFacts.filter(f => f.confidence >= 70 && f.confidence < 90).length,                    color: '#fbbf24' },
                    { label: 'Low (< 70%)',    count: truthFacts.filter(f => f.confidence < 70).length,                                           color: '#f87171' },
                  ].map(({ label, count, color }) => {
                    const pct = truthFacts.length > 0 ? Math.round((count / truthFacts.length) * 100) : 0
                    return (
                      <div key={label} className="mb-3">
                        <div className="flex justify-between mb-1.5">
                          <span className="text-[11px] text-text-muted">{label}</span>
                          <span className="text-[11px] font-semibold" style={{ color }}>{count} fact{count !== 1 ? 's' : ''} · {pct}%</span>
                        </div>
                        <div className="rounded-full overflow-hidden" style={{ height: 5, background: 'rgba(255,255,255,0.07)' }}>
                          <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Top source documents */}
                <div className="rounded-xl p-4 glass-card">
                  <p className="text-xs font-semibold text-text-secondary mb-3">Top Source Documents</p>
                  <div className="space-y-0">
                    {[
                      { name: 'Q1 Sales Contract - Acme Corp',       bundle: 'BDL-001', claims: 5, confidence: 97 },
                      { name: 'Master Services Agreement 2024',       bundle: 'BDL-002', claims: 4, confidence: 92 },
                      { name: 'GDPR Data Processing Agreement',       bundle: 'BDL-011', claims: 4, confidence: 95 },
                      { name: 'Payment Terms Policy 2024',            bundle: 'BDL-004', claims: 3, confidence: 88 },
                    ].map((doc, i, arr) => (
                      <div key={doc.name} className="flex items-center gap-3 py-2.5"
                        style={{ borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                        <FileText size={12} style={{ color: '#64748b', flexShrink: 0 }} />
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] text-text-secondary truncate">{doc.name}</p>
                          <p className="text-[10px] text-text-muted mt-0.5">{doc.bundle} · {doc.claims} claims</p>
                        </div>
                        <span className="text-[11px] font-semibold shrink-0"
                          style={{ color: doc.confidence >= 95 ? '#4ade80' : doc.confidence >= 85 ? '#fbbf24' : '#f87171' }}>
                          {doc.confidence}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        {tab === 'Review' && (
          <div className="space-y-3">
            {/* Filter bar */}
            <div className="flex items-center gap-2">
              <SearchBar placeholder="Search review items..." value={reviewSearch} onChange={setReviewSearch} />
              <select
                className="input-base text-xs px-3 py-2"
                style={{ width: 'auto' }}
                value={reviewFilter}
                onChange={e => setReviewFilter(e.target.value)}>
                <option value="All">Reason</option>
                <option value="Expiring Soon">Expiring Soon</option>
                <option value="Evidence Changed">Evidence Changed</option>
                <option value="New Conflict">New Conflict</option>
                <option value="Manual">Manual</option>
              </select>
              <select
                className="input-base text-xs px-3 py-2"
                style={{ width: 'auto' }}
                value={reviewPriority}
                onChange={e => setReviewPriority(e.target.value)}>
                <option value="All">Priority</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
              <button className="btn-secondary gap-1.5" onClick={() => setShowFilters(true)}>
                <Filter size={13} /> Filters
              </button>
            </div>
            <p className="text-[11px] text-text-muted leading-relaxed -mt-1">
              Review is where proposed changes and signals are evaluated before becoming Truth.
            </p>

            {/* Review item cards */}
            <div className="space-y-2">
              {filteredReview.length === 0 ? (
                <div className="text-center py-12 text-text-muted text-sm">No items in this category.</div>
              ) : filteredReview.map(item => {
                const reason   = REVIEW_REASON[item.reason]   || REVIEW_REASON['manual-review']
                const priority = REVIEW_PRIORITY[item.priority] || REVIEW_PRIORITY['medium']
                const rstatus  = REVIEW_STATUS[item.status]    || REVIEW_STATUS['pending']
                const gov      = factGovernance[item.factId]   || {}
                const isApproved          = item.status === 'approved'
                const isWaitingEvidence   = item.status === 'waiting-evidence'
                const isEvidenceResponded = item.status === 'evidence-responded'
                const isEvidenceUnable    = item.status === 'evidence-unable'
                const isEvidenceReassigned= item.status === 'evidence-reassigned'
                const isEscalated         = item.status === 'escalated'
                // Actionable: reviewer can act after response arrives or evidence was marked unable
                const isActionable = !isApproved && !isWaitingEvidence && !isEvidenceReassigned && !isEscalated

                return (
                  <div key={item.id}
                    className={clsx('row-item relative', selectedReview?.id === item.id && 'selected',
                      (isApproved || isWaitingEvidence || isEvidenceReassigned) && 'opacity-60')}
                    style={{ borderLeft: `3px solid ${
                      isEscalated          ? '#d97706'
                      : isEvidenceResponded ? '#4ade80'
                      : isEvidenceUnable    ? '#f87171'
                      : isEvidenceReassigned? '#a78bfa'
                      : isWaitingEvidence   ? '#60a5fa'
                      : reason.dot
                    }` }}
                    onClick={() => isActionable && setSelectedReview(item)}>

                    {/* Top-right corner */}
                    <div className="absolute top-3 right-3 flex items-center gap-0.5" onClick={e => e.stopPropagation()}>
                      {isActionable && (
                        <button className="btn-ghost p-1.5" title="Open detail" onClick={() => setSelectedReview(item)}>
                          <Eye size={14} className="text-text-muted" />
                        </button>
                      )}
                    </div>

                    <div className="flex items-start gap-3 pr-12">
                      <div className="flex-1 min-w-0">
                        {/* Reason + priority + status + queue age */}
                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                            style={{ background: reason.bg, border: `1px solid ${reason.border}`, color: reason.color }}>
                            {reason.label}
                          </span>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                            style={{ background: priority.bg, border: `1px solid ${priority.border}`, color: priority.color }}>
                            {priority.label}
                          </span>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                            style={{ background: rstatus.bg, border: `1px solid ${rstatus.border}`, color: rstatus.color }}>
                            {rstatus.label}
                          </span>
                          {isWaitingEvidence && (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1"
                              style={{ background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.3)', color: '#60a5fa' }}>
                              <FileSearch size={9} /> Waiting for Evidence
                            </span>
                          )}
                          {(isEvidenceResponded || isEvidenceUnable) && (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1"
                              style={isEvidenceResponded
                                ? { background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', color: '#4ade80' }
                                : { background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171' }}>
                              <FileSearch size={9} /> {isEvidenceResponded ? 'Evidence Responded' : 'Unable to Provide'}
                            </span>
                          )}
                          {isEvidenceReassigned && (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1"
                              style={{ background: 'rgba(124,92,252,0.1)', border: '1px solid rgba(124,92,252,0.3)', color: '#a78bfa' }}>
                              <FileSearch size={9} /> Reassigned
                            </span>
                          )}
                          {isEscalated && (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1"
                              style={{ background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.3)', color: '#fbbf24' }}>
                              <ArrowUpCircle size={9} />
                              Escalated{item.escalated_to?.length ? ` → ${item.escalated_to.join(', ')}` : ''}
                            </span>
                          )}
                          <span className="text-[10px] text-text-muted ml-auto">{item.daysInQueue}d in queue</span>
                        </div>

                        {/* Fact ID + title + tag */}
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="text-[10px] font-mono text-text-muted">{item.factId}</span>
                          <p className="text-sm font-semibold text-text-primary">{item.factTitle}</p>
                          <span className="text-[10px] px-1.5 py-0.5 rounded font-medium"
                            style={{ background: 'rgba(124,92,252,0.1)', color: '#a78bfa', border: '1px solid rgba(124,92,252,0.2)' }}>
                            {item.tag}
                          </span>
                        </div>

                        {/* Source metadata */}
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <span className="text-[9px] uppercase tracking-wider font-semibold text-text-muted">Source</span>
                          {item.reason === 'manual' || item.reason === 'manual-review' ? (
                            <span className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded"
                              style={{ background: 'rgba(124,92,252,0.08)', border: '1px solid rgba(124,92,252,0.2)', color: '#a78bfa' }}>
                              <PenLine size={8} /> Manual Request
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded"
                              style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)', color: '#60a5fa' }}>
                              <Zap size={8} /> Signal · {reason.label}
                            </span>
                          )}
                          {item.proposalId && (
                            <span className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded"
                              style={{ background: 'rgba(20,184,166,0.08)', border: '1px solid rgba(20,184,166,0.2)', color: '#2dd4bf' }}>
                              <Package size={8} /> Promotion Package
                            </span>
                          )}
                        </div>

                        {/* Truncated fact text */}
                        <p className="text-xs text-text-muted italic line-clamp-1 mb-2">{item.factText}</p>

                        {/* Bottom metadata row */}
                        <div className="flex items-center gap-3 text-[11px] text-text-muted flex-wrap">
                          <GovernanceCompact gov={gov} />
                          <span>
                            Last approved: {item.lastApprovedBy
                              ? <span className="text-text-secondary">{item.lastApprovedBy} · {item.lastApprovedAt}</span>
                              : <span className="italic">Never</span>}
                          </span>
                          {item.comments.length > 0 && (
                            <span className="flex items-center gap-1">
                              <MessageSquare size={10} /> {item.comments.length}
                            </span>
                          )}
                          {/* Approval requirement indicator */}
                          {(() => {
                            const cur = item.current_approvals || 0
                            const req = item.required_approvals || 1
                            const done = cur >= req
                            return (
                              <span className="flex items-center gap-1" style={{ color: done ? '#4ade80' : '#64748b' }}>
                                <span className="font-medium text-[10px]">Approvals {cur}/{req}</span>
                                <span className="flex items-center gap-0.5">
                                  {Array.from({ length: req }).map((_, i) => (
                                    <span key={i}
                                      className="inline-flex items-center justify-center rounded-full"
                                      style={{
                                        width: 12, height: 12,
                                        background: i < cur ? 'rgba(74,222,128,0.18)' : 'rgba(255,255,255,0.06)',
                                        border: `1px solid ${i < cur ? 'rgba(74,222,128,0.45)' : 'rgba(255,255,255,0.12)'}`,
                                      }}>
                                      {i < cur && <CheckCircle size={7} style={{ color: '#4ade80' }} />}
                                    </span>
                                  ))}
                                </span>
                              </span>
                            )
                          })()}
                          <div className="ml-auto flex items-center gap-2">
                            <Chip color={item.risk === 'Low' ? 'green' : item.risk === 'Medium' ? 'amber' : 'red'} tooltip="AI Confidence Score">{item.confidence}%</Chip>
                            <Chip color={item.risk === 'Low' ? 'green' : item.risk === 'Medium' ? 'amber' : 'red'} tooltip="Information Risk Level">{item.risk}</Chip>
                          </div>
                        </div>

                        {/* Partial approval banner */}
                        {(item.current_approvals || 0) > 0 && (item.current_approvals || 0) < (item.required_approvals || 1) && (
                          <div className="flex items-center gap-1.5 mt-1.5 text-[10px] font-medium"
                            style={{ color: '#fbbf24' }}>
                            <Clock size={9} />
                            Waiting for final approval · {item.current_approvals}/{item.required_approvals} received
                          </div>
                        )}

                        {/* Quick action strip */}
                        {isActionable && (
                          <div className="flex gap-1.5 mt-2.5 flex-wrap justify-end" onClick={e => e.stopPropagation()}>
                            <button className="text-[10px] px-2.5 py-1 rounded-lg font-medium flex items-center gap-1 transition-colors hover:brightness-110"
                              style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)', color: '#4ade80' }}
                              onClick={() => handleReviewApprove(item)}>
                              <CheckCircle size={10} /> Approve
                            </button>
                            <button className="text-[10px] px-2.5 py-1 rounded-lg font-medium flex items-center gap-1 transition-colors hover:brightness-110"
                              style={{ background: 'rgba(124,92,252,0.1)', border: '1px solid rgba(124,92,252,0.25)', color: '#a78bfa' }}
                              onClick={() => { const f = truthFacts.find(f => f.id === item.factId); if (f) setProposeFact(f) }}>
                              <Sparkles size={10} /> Propose
                            </button>
                            <button className="text-[10px] px-2.5 py-1 rounded-lg font-medium flex items-center gap-1 transition-colors hover:brightness-110"
                              style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.25)', color: '#60a5fa' }}
                              onClick={() => handleReviewRequestEvidence(item)}>
                              <FileSearch size={10} /> Request Evidence
                            </button>
                            <button className="text-[10px] px-2.5 py-1 rounded-lg font-medium flex items-center gap-1 transition-colors hover:brightness-110"
                              style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)', color: '#fbbf24' }}
                              onClick={() => handleReviewEscalate(item)}>
                              <ArrowUpCircle size={10} /> Escalate
                            </button>
                            {/* Edit — opens same EditProposalModal mapped onto review item fields */}
                            <button className="text-[10px] px-2.5 py-1 rounded-lg font-medium flex items-center gap-1 transition-colors hover:brightness-110"
                              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: '#94a3b8' }}
                              onClick={() => setEditingProposal({
                                _isReviewItem: true,
                                _reviewId: item.id,
                                id: item.id,
                                factTitle: item.factTitle,
                                proposedText: item.factText,
                                reason: item.reasonDetail || '',
                                urgency: item.priority || 'medium',
                              })}>
                              <PenLine size={10} /> Edit
                            </button>
                          </div>
                        )}

                        {isApproved && (
                          <div className="flex items-center gap-1.5 mt-2.5 text-[10px] font-semibold"
                            style={{ color: '#4ade80' }}>
                            <CheckCircle size={11} /> Approved — Fact remains verified
                          </div>
                        )}

                        {isWaitingEvidence && item.evidenceRequest && (
                          <div className="flex items-center gap-2 mt-2.5" onClick={e => e.stopPropagation()}>
                            <FileSearch size={11} style={{ color: '#60a5fa', flexShrink: 0 }} />
                            <span className="text-[10px] flex-1" style={{ color: '#60a5fa' }}>
                              Waiting for evidence · Assigned to <span className="font-semibold">{item.evidenceRequest.assignedTo}</span>
                              {item.evidenceRequest.dueDate && (
                                <span className="text-text-muted ml-1">· Due {item.evidenceRequest.dueDate}</span>
                              )}
                            </span>
                            {/* V1: always show Respond. In production check assignedToId === currentUser.id */}
                            <button
                              className="text-[10px] px-2.5 py-1 rounded-lg font-medium flex items-center gap-1 transition-colors hover:brightness-110 shrink-0"
                              style={{ background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.35)', color: '#60a5fa' }}
                              onClick={() => setResponseItem(item)}>
                              <FileSearch size={9} /> Respond
                            </button>
                          </div>
                        )}

                        {(isEvidenceResponded || isEvidenceUnable) && item.evidenceRequest && (
                          <div className="flex items-center gap-2 mt-2.5" onClick={e => e.stopPropagation()}>
                            <FileSearch size={11} style={{ color: isEvidenceResponded ? '#4ade80' : '#f87171', flexShrink: 0 }} />
                            <span className="text-[10px] flex-1"
                              style={{ color: isEvidenceResponded ? '#4ade80' : '#f87171' }}>
                              {isEvidenceResponded ? 'Evidence provided' : 'Unable to provide evidence'}
                              {item.evidenceRequest.responses?.[0]?.responded_by && (
                                <span className="text-text-muted ml-1">
                                  · {item.evidenceRequest.responses[item.evidenceRequest.responses.length - 1].responded_by}
                                  {' · '}{item.evidenceRequest.responses[item.evidenceRequest.responses.length - 1].responded_at}
                                </span>
                              )}
                            </span>
                            <button
                              className="text-[10px] px-2 py-1 rounded-lg font-medium transition-colors hover:brightness-110 shrink-0"
                              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#64748b' }}
                              onClick={() => setResponseItem(item)}>
                              View
                            </button>
                          </div>
                        )}

                        {isEvidenceReassigned && item.evidenceRequest && (
                          <div className="flex items-center gap-1.5 mt-2.5 text-[10px]"
                            style={{ color: '#a78bfa' }}>
                            <FileSearch size={11} style={{ flexShrink: 0 }} />
                            <span>Reassigned to <span className="font-semibold">{item.evidenceRequest.assignedTo}</span></span>
                            <button
                              className="ml-auto text-[10px] px-2.5 py-1 rounded-lg font-medium flex items-center gap-1 transition-colors hover:brightness-110"
                              style={{ background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.3)', color: '#60a5fa' }}
                              onClick={e => { e.stopPropagation(); setResponseItem(item) }}>
                              <FileSearch size={9} /> Respond
                            </button>
                          </div>
                        )}

                        {isEscalated && (
                          <div className="mt-3 rounded-xl overflow-hidden"
                            style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.25)' }}
                            onClick={e => e.stopPropagation()}>

                            {/* Header row */}
                            <div className="flex items-center gap-2 px-3 py-2"
                              style={{ borderBottom: '1px solid rgba(245,158,11,0.15)' }}>
                              <ArrowUpCircle size={11} style={{ color: '#fbbf24' }} />
                              <span className="text-[10px] font-semibold" style={{ color: '#fbbf24' }}>Escalated</span>
                              {item.escalation_priority === 'High' && (
                                <span className="text-[9px] px-1.5 py-0.5 rounded-full font-semibold"
                                  style={{ background: 'rgba(245,158,11,0.18)', border: '1px solid rgba(245,158,11,0.35)', color: '#fbbf24' }}>
                                  High Priority
                                </span>
                              )}
                              <span className="text-[9px] text-text-muted ml-auto">
                                by {item.escalated_by} · {item.escalated_at}
                              </span>
                            </div>

                            {/* Reason + message */}
                            <div className="px-3 py-2.5 space-y-1.5"
                              style={{ borderBottom: '1px solid rgba(245,158,11,0.12)' }}>
                              <p className="text-[10px] text-text-muted">
                                Reason: <span className="font-semibold text-text-secondary">{item.escalation_reason}</span>
                              </p>
                              {item.escalation_message && (
                                <p className="text-[10px] leading-relaxed italic line-clamp-2"
                                  style={{ color: 'rgba(251,191,36,0.7)' }}>
                                  "{item.escalation_message}"
                                </p>
                              )}
                            </div>

                            {/* Decision Authority */}
                            <div className="px-3 py-2.5">
                              <p className="text-[9px] font-semibold uppercase tracking-wider mb-2"
                                style={{ color: 'rgba(245,158,11,0.6)' }}>
                                Decision Authority
                              </p>
                              <div className="space-y-1.5">
                                {(item.escalated_to_details || []).map(u => (
                                  <div key={u.id} className="flex items-center gap-2">
                                    <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[8px] font-bold text-white"
                                      style={{ background: u.gradient }}>
                                      {u.initials}
                                    </div>
                                    <span className="text-[11px] font-semibold text-text-secondary">{u.name}</span>
                                    <span className="text-[10px] text-text-muted">{u.role}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
        {tab === 'Proposals' && (
          <div className="space-y-3">
            {/* Filter bar */}
            <div className="flex items-center gap-2">
              <SearchBar placeholder="Search proposals..." value={proposalSearch} onChange={setProposalSearch} />
              <select
                className="input-base text-xs px-3 py-2"
                style={{ width: 'auto' }}
                value={proposalFilter}
                onChange={e => setProposalFilter(e.target.value)}>
                <option value="All">Status</option>
                <option value="Draft">Draft</option>
                <option value="Pending Review">Pending Review</option>
                <option value="Under Review">Under Review</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
                <option value="Superseded">Superseded</option>
              </select>
              <select
                className="input-base text-xs px-3 py-2"
                style={{ width: 'auto' }}
                value={proposalOrigin}
                onChange={e => { setProposalOrigin(e.target.value); if (e.target.value !== 'Sandbox') setProposalPackage('All') }}>
                <option value="All">Origin</option>
                <option value="Manual">Manual</option>
                <option value="Sandbox">Sandbox</option>
              </select>
              <select
                className="input-base text-xs px-3 py-2"
                style={{ width: 'auto' }}
                value={proposalPackage}
                onChange={e => setProposalPackage(e.target.value)}>
                <option value="All">Package</option>
                {availablePackages.map(pkg => (
                  <option key={pkg.id} value={pkg.id}>{pkg.id}</option>
                ))}
              </select>
              <button className="btn-secondary gap-1.5" onClick={() => setShowFilters(true)}>
                <Filter size={13} /> Filters
              </button>
            </div>
            <p className="text-[11px] text-text-muted leading-relaxed -mt-1">
              Proposals are pending changes to Truth — submit them for Review to advance through governance.
            </p>

            {/* Active package filter indicator */}
            {proposalPackage !== 'All' && (() => {
              const pkg = availablePackages.find(p => p.id === proposalPackage)
              return (
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-text-muted">Filtered by package:</span>
                  <button
                    className="flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-1 rounded-full transition-all hover:brightness-110"
                    style={{ background: 'rgba(20,184,166,0.15)', border: '1px solid rgba(20,184,166,0.4)', color: '#2dd4bf' }}
                    onClick={() => setProposalPackage('All')}>
                    <Package size={9} />
                    {proposalPackage}
                    {pkg?.name && <span className="font-normal opacity-70 ml-0.5">· {pkg.name}</span>}
                    <X size={10} className="ml-0.5 opacity-70" />
                  </button>
                  <span className="text-[10px] text-text-muted">{filteredProposals.length} result{filteredProposals.length !== 1 ? 's' : ''}</span>
                </div>
              )
            })()}

            {/* Proposal groups */}
            {(() => {
              if (filteredProposals.length === 0) {
                return <div className="text-center py-12 text-text-muted text-sm">No proposals in this category.</div>
              }
              // Group by factId
              const groups = Object.values(
                filteredProposals.reduce((acc, p) => {
                  const key = p.factId ?? `NEW::${p.id}`
                  if (!acc[key]) acc[key] = { factId: p.factId, factTitle: p.factTitle, tag: p.tag, proposals: [] }
                  acc[key].proposals.push(p)
                  return acc
                }, {})
              )

              return (
                <div className="space-y-3">
                  {groups.map(group => {
                    const multi = group.proposals.length > 1
                    return (
                      <div key={group.factId ?? group.proposals[0].id}
                        className="rounded-xl overflow-hidden"
                        style={{ border: `1px solid ${multi ? 'rgba(245,158,11,0.3)' : 'rgba(255,255,255,0.08)'}` }}>

                        {/* Fact grouper header */}
                        <div className="flex items-center gap-2 px-4 py-2.5 flex-wrap"
                          style={{ background: multi ? 'rgba(245,158,11,0.06)' : 'rgba(255,255,255,0.025)' }}>
                          {group.factId && (
                            <span className="text-[10px] font-mono text-text-muted">{group.factId}</span>
                          )}
                          <p className="text-xs font-semibold text-text-primary">{group.factTitle}</p>
                          <span className="text-[10px] px-1.5 py-0.5 rounded font-medium"
                            style={{ background: 'rgba(124,92,252,0.1)', color: '#a78bfa', border: '1px solid rgba(124,92,252,0.2)' }}>
                            {group.tag}
                          </span>
                          {multi && (
                            <span className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full"
                              style={{ background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.35)', color: '#fbbf24' }}>
                              ⚡ {group.proposals.length} competing proposals — only one can be approved
                            </span>
                          )}
                          {!multi && (
                            <span className="text-[10px] text-text-muted ml-auto">1 proposal</span>
                          )}
                        </div>

                        {/* Proposal rows */}
                        <div className="divide-y divide-white/[0.05]">
                          {group.proposals.map(p => {
                            const sc         = PROPOSAL_STATUS[p.status]   || PROPOSAL_STATUS['pending']
                            const urgencyObj = PROPOSAL_URGENCY[p.urgency] || PROPOSAL_URGENCY['medium']
                            const isSandbox  = p.origin === 'sandbox-promotion'
                            const isNewFact  = p.scenario === 'new-fact' || !p.currentText
                            const isTerminal = ['approved','rejected','superseded'].includes(p.status)
                            // If single proposal in group → auto-expanded; if multi → collapsed unless explicitly toggled
                            const isOpen = expandedProposals[p.id] !== undefined
                              ? expandedProposals[p.id]
                              : !multi
                            const toggleOpen = (e) => {
                              e.stopPropagation()
                              setExpandedProposals(prev => ({ ...prev, [p.id]: !isOpen }))
                            }

                            return (
                              <div key={p.id}
                                className={clsx('relative', selectedProposal?.id === p.id && 'selected')}
                                style={{ borderLeft: `3px solid ${isSandbox ? 'rgba(20,184,166,0.6)' : 'rgba(124,92,252,0.5)'}` }}>

                                {/* ── Collapsed summary row ── */}
                                <div
                                  className="flex items-center gap-2 px-4 py-2.5 cursor-pointer hover:bg-white/[0.02] transition-colors flex-wrap"
                                  onClick={toggleOpen}>
                                  <ChevronRight size={12} className="text-text-muted shrink-0 transition-transform"
                                    style={{ transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)' }} />
                                  <span className="text-[10px] font-mono text-text-muted">{p.id}</span>
                                  {isSandbox ? (
                                    <span className="flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                                      style={{ background: 'rgba(20,184,166,0.12)', border: '1px solid rgba(20,184,166,0.35)', color: '#2dd4bf' }}>
                                      <Package size={8} /> Sandbox
                                    </span>
                                  ) : (
                                    <span className="flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                                      style={{ background: 'rgba(124,92,252,0.1)', border: '1px solid rgba(124,92,252,0.25)', color: '#a78bfa' }}>
                                      <PenLine size={8} /> Manual
                                    </span>
                                  )}
                                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                                    style={{ background: sc.bg, border: `1px solid ${sc.border}`, color: sc.color }}>
                                    {sc.label}
                                  </span>
                                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                                    style={{ background: urgencyObj.bg, border: `1px solid ${urgencyObj.border}`, color: urgencyObj.color }}>
                                    {urgencyObj.label}
                                  </span>
                                  <div className="flex items-center gap-1 ml-1">
                                    <div className="w-3.5 h-3.5 rounded-full flex items-center justify-center text-[6px] font-bold text-white shrink-0"
                                      style={{ background: p.avatarGradient }}>{p.initials}</div>
                                    <span className="text-[10px] text-text-secondary">{p.submittedBy}</span>
                                  </div>
                                  <span className="text-[10px] text-text-muted ml-auto">{p.submittedAt}</span>
                                </div>

                                {/* ── Expanded content ── */}
                                {isOpen && (
                                  <div className="px-4 pb-4 pt-1">
                                    {/* Sandbox origin line */}
                                    {isSandbox && p.originMeta && (
                                      <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                                        <Package size={9} style={{ color: '#2dd4bf' }} />
                                        <span className="text-[10px]" style={{ color: '#2dd4bf' }}>{p.originMeta.sandboxName}</span>
                                        <span className="text-text-muted opacity-40 text-[10px]">·</span>
                                        <button
                                          className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded font-mono transition-all hover:brightness-110"
                                          style={{
                                            background: proposalPackage === p.originMeta.packageId ? 'rgba(20,184,166,0.2)' : 'rgba(20,184,166,0.08)',
                                            border: `1px solid ${proposalPackage === p.originMeta.packageId ? 'rgba(20,184,166,0.5)' : 'rgba(20,184,166,0.22)'}`,
                                            color: '#2dd4bf',
                                          }}
                                          title={p.originMeta.packageName}
                                          onClick={e => { e.stopPropagation(); setProposalPackage(prev => prev === p.originMeta.packageId ? 'All' : p.originMeta.packageId) }}>
                                          <Package size={8} />{p.originMeta.packageId}
                                        </button>
                                        {p.incomingClaims?.length > 0 && (
                                          <span className="flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded"
                                            style={{ background: 'rgba(245,158,11,0.1)', color: '#fbbf24' }}>
                                            {p.incomingClaims.length} claim{p.incomingClaims.length > 1 ? 's' : ''}
                                          </span>
                                        )}
                                      </div>
                                    )}

                                    {/* Mini diff */}
                                    <div className="grid grid-cols-2 gap-1.5 mb-2">
                                      {p.currentText ? (
                                        <div className="rounded-lg p-2.5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                                          <p className="text-[9px] text-text-muted uppercase tracking-wider mb-1">Current</p>
                                          <p className="text-[10px] text-text-muted leading-relaxed line-clamp-3">{p.currentText}</p>
                                        </div>
                                      ) : (
                                        <div className="rounded-lg p-2.5 flex flex-col items-center justify-center text-center"
                                          style={{ background: 'rgba(20,184,166,0.05)', border: '1px dashed rgba(20,184,166,0.35)' }}>
                                          <span className="text-sm mb-1">🆕</span>
                                          <p className="text-[9px] font-semibold leading-tight" style={{ color: '#2dd4bf' }}>New fact — no existing truth</p>
                                        </div>
                                      )}
                                      <div className="rounded-lg p-2.5" style={{ background: 'rgba(124,92,252,0.06)', border: '1px solid rgba(124,92,252,0.2)' }}>
                                        <p className="text-[9px] font-semibold uppercase tracking-wider mb-1" style={{ color: '#a78bfa' }}>
                                          {isNewFact ? 'New Fact' : 'Proposed'}
                                        </p>
                                        <p className="text-[10px] text-text-secondary leading-relaxed line-clamp-3">{p.proposedText}</p>
                                      </div>
                                    </div>

                                    {/* Rationale */}
                                    <p className="text-[10px] text-text-muted italic line-clamp-1 mb-2">"{p.reason}"</p>

                                    {/* Governance signals (shown after Edit) */}
                                    {(p.confidence != null || p.risk) && (
                                      <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                                        {p.confidence != null && (() => {
                                          const c = p.confidence
                                          const cc = c >= 90 ? '#4ade80' : c >= 70 ? '#fbbf24' : '#f87171'
                                          return (
                                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                                              style={{ background: `${cc}15`, border: `1px solid ${cc}44`, color: cc }}>
                                              {c}% confidence
                                            </span>
                                          )
                                        })()}
                                        {p.risk && (() => {
                                          const rc = p.risk === 'Low' ? '#4ade80' : p.risk === 'Medium' ? '#fbbf24' : '#f87171'
                                          return (
                                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                                              style={{ background: `${rc}15`, border: `1px solid ${rc}44`, color: rc }}>
                                              {p.risk} risk
                                            </span>
                                          )
                                        })()}
                                        {p.polarity && (
                                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                                            style={{ background: 'rgba(148,163,184,0.1)', border: '1px solid rgba(148,163,184,0.25)', color: '#94a3b8' }}>
                                            {p.polarity === '+' ? '+ Positive' : p.polarity === '−' ? '− Negative' : '· Neutral'}
                                          </span>
                                        )}
                                        {p.validFrom && (
                                          <span className="text-[10px] text-text-muted flex items-center gap-1">
                                            <Calendar size={8} /> from {p.validFrom}
                                          </span>
                                        )}
                                        {p.expiresOn && (
                                          <span className="text-[10px] text-text-muted flex items-center gap-1">
                                            <Clock size={8} /> expires {p.expiresOn}
                                          </span>
                                        )}
                                      </div>
                                    )}

                                    {/* Rejection notice */}
                                    {p.status === 'rejected' && p.rejectionReason && (
                                      <p className="text-[10px] mb-2 flex items-start gap-1" style={{ color: '#f87171' }}>
                                        <XCircle size={9} className="shrink-0 mt-0.5" />
                                        <span className="line-clamp-1">{p.rejectionReason}</span>
                                      </p>
                                    )}

                                    {/* Footer row */}
                                    <div className="flex items-center gap-3 text-[11px] text-text-muted flex-wrap">
                                      {p.scopeImpact && <span>{p.scopeImpact}</span>}
                                      {p.effectiveDate && <span>· eff. {p.effectiveDate}</span>}
                                      {(p.evidence||[]).length > 0 && <span className="flex items-center gap-1"><FileSearch size={9} /> {p.evidence.length} evidence</span>}
                                      {(p.comments||[]).length > 0 && <span className="flex items-center gap-1"><MessageSquare size={9} /> {p.comments.length}</span>}
                                      {(p.approvers?.length > 0) && (() => {
                                        const cur = (p.approvers||[]).filter(a => a.status === 'approved').length
                                        const req = (p.approvers||[]).length
                                        const done = cur >= req
                                        return (
                                          <span className="flex items-center gap-1" style={{ color: done ? '#4ade80' : '#64748b' }}>
                                            <CheckCircle size={9} style={{ color: done ? '#4ade80' : '#475569' }} />
                                            <span className="font-medium">Approvals {cur}/{req}</span>
                                            <span className="flex items-center gap-0.5">
                                              {(p.approvers||[]).map((a, i) => (
                                                <span key={i}
                                                  className="inline-flex items-center justify-center rounded-full"
                                                  style={{
                                                    width: 11, height: 11,
                                                    background: a.status === 'approved' ? 'rgba(74,222,128,0.18)' : 'rgba(255,255,255,0.06)',
                                                    border: `1px solid ${a.status === 'approved' ? 'rgba(74,222,128,0.45)' : 'rgba(255,255,255,0.12)'}`,
                                                  }}>
                                                  {a.status === 'approved' && <CheckCircle size={6} style={{ color: '#4ade80' }} />}
                                                </span>
                                              ))}
                                            </span>
                                          </span>
                                        )
                                      })()}

                                      {/* Action buttons — always Edit + Send to Review + Approve + Reject for all non-terminal */}
                                      {!isTerminal && (
                                        <div className="ml-auto flex gap-1.5 flex-wrap" onClick={e => e.stopPropagation()}>
                                          <button className="text-[10px] px-2.5 py-1 rounded-lg font-medium flex items-center gap-1 hover:brightness-110"
                                            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: '#94a3b8' }}
                                            onClick={() => setEditingProposal(p)}>
                                            <PenLine size={9} /> Edit
                                          </button>
                                          <button className="text-[10px] px-2.5 py-1 rounded-lg font-medium flex items-center gap-1 hover:brightness-110"
                                            style={{ background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.3)', color: '#60a5fa' }}
                                            onClick={() => handleProposalSendToReview(p)}>
                                            <ArrowUpCircle size={9} /> Send to Review
                                          </button>
                                          <button className="text-[10px] px-2.5 py-1 rounded-lg font-medium flex items-center gap-1 hover:brightness-110"
                                            style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)', color: '#4ade80' }}
                                            onClick={() => handleProposalApprove(p)}>
                                            <CheckCircle size={9} /> Approve
                                          </button>
                                          <button className="text-[10px] px-2.5 py-1 rounded-lg font-medium flex items-center gap-1 hover:brightness-110"
                                            style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}
                                            onClick={() => handleProposalReject(p)}>
                                            <XCircle size={9} /> Reject
                                          </button>
                                          <button className="btn-ghost p-1.5"
                                            title="View detail"
                                            onClick={() => setSelectedProposal(p)}>
                                            <Eye size={13} className="text-text-muted" />
                                          </button>
                                        </div>
                                      )}
                                      {isTerminal && (
                                        <div className="ml-auto flex items-center gap-1.5">
                                          <span className="text-[10px] font-semibold" style={{ color: sc.color }}>{sc.label}</span>
                                          <button className="btn-ghost p-1.5"
                                            title="View detail"
                                            onClick={e => { e.stopPropagation(); setSelectedProposal(p) }}>
                                            <Eye size={13} className="text-text-muted" />
                                          </button>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )
            })()}
          </div>
        )}

        {/* Pagination */}
        {(() => {
          const totalPages = Math.ceil(truthFacts.length / FACTS_PER_PAGE)
          const startIdx   = (factPage - 1) * FACTS_PER_PAGE + 1
          const endIdx     = Math.min(factPage * FACTS_PER_PAGE, truthFacts.length)
          return (
            <div className="flex items-center justify-between mt-4 text-xs text-text-muted">
              <span>{startIdx}–{endIdx} of {truthFacts.length} facts</span>
              <div className="flex gap-1">
                <button className="btn-ghost px-2 py-1"
                  disabled={factPage === 1}
                  style={{ opacity: factPage === 1 ? 0.3 : 1 }}
                  onClick={() => setFactPage(p => Math.max(1, p - 1))}>‹</button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button key={p}
                    className="px-2 py-1 rounded text-xs font-medium transition-colors"
                    style={p === factPage
                      ? { background: '#3b82f6', color: 'white' }
                      : { color: 'var(--text-muted)' }}
                    onClick={() => setFactPage(p)}>
                    {p}
                  </button>
                ))}
                <button className="btn-ghost px-2 py-1"
                  disabled={factPage === totalPages}
                  style={{ opacity: factPage === totalPages ? 0.3 : 1 }}
                  onClick={() => setFactPage(p => Math.min(totalPages, p + 1))}>›</button>
              </div>
            </div>
          )
        })()}
      </div>

      {/* Proposal slide-out */}
      {selectedProposal && !selectedFact && !selectedReview && (
        <ProposalSlideOut
          proposal={selectedProposal}
          onClose={() => setSelectedProposal(null)}
          onApprove={handleProposalApprove}
          onReject={handleProposalReject}
          onSupersede={handleProposalSupersede}
          onSubmitDraft={handleProposalSubmitDraft} />
      )}

      {/* Fact slide-out */}
      {selectedFact && !selectedReview && (
        <FactSlideOut
          fact={selectedFact}
          onClose={() => setSelectedFact(null)}
          onExpand={() => navigate(`/truth-plane/${plane.id}/fact/${selectedFact.id}`)}
          onPropose={() => setProposeFact(selectedFact)}
          onBreakGlass={() => setBreakGlassFact(selectedFact)}
          bgRecord={bgRecords[selectedFact.id]} />
      )}

      {/* Review slide-out */}
      {selectedReview && (
        <ReviewSlideOut
          item={selectedReview}
          onClose={() => setSelectedReview(null)}
          onApprove={handleReviewApprove}
          onPropose={(item) => { const f = truthFacts.find(f => f.id === item.factId); if (f) { setProposeFact(f); setSelectedReview(null) } }}
          onRequestEvidence={handleReviewRequestEvidence}
          onEscalate={handleReviewEscalate} />
      )}

      {/* Approve Confirmation modal */}
      {pendingApproval && (
        <ApproveConfirmModal
          item={pendingApproval.item}
          onConfirm={pendingApproval.onConfirm}
          onCancel={() => setPendingApproval(null)} />
      )}

      {/* Propose Change modal */}
      {proposeFact && (
        <ProposeChangeModal
          fact={proposeFact}
          onClose={() => setProposeFact(null)}
          onSubmit={(p) => { handleProposalSubmit(p); setTab('Proposals') }} />
      )}

      {/* Create Fact modal */}
      {showCreateFact && (
        <CreateFactModal
          onClose={() => setShowCreateFact(false)}
          onSubmit={() => setShowCreateFact(false)} />
      )}

      {/* Edit Proposal / Review item modal */}
      {editingProposal && (
        <EditProposalModal
          proposal={editingProposal}
          onClose={() => setEditingProposal(null)}
          onSave={handleProposalEdit} />
      )}

      {/* Break Glass modal */}
      {breakGlassFact && (
        <BreakGlassModal
          fact={breakGlassFact}
          onClose={() => setBreakGlassFact(null)}
          onSubmit={(rec) => { handleBreakGlassSubmit(rec); setBreakGlassFact(null) }} />
      )}

      {/* Request Evidence modal */}
      {evidenceRequestItem && (
        <RequestEvidenceModal
          item={evidenceRequestItem}
          onClose={() => setEvidenceRequestItem(null)}
          onSubmit={handleEvidenceRequestSubmit} />
      )}

      {/* Escalate modal */}
      {escalateItem && (
        <EscalateModal
          item={escalateItem}
          onClose={() => setEscalateItem(null)}
          onSubmit={handleEscalateSubmit} />
      )}

      {/* Evidence Response modal */}
      {responseItem && (
        <EvidenceResponseModal
          item={responseItem}
          onClose={() => setResponseItem(null)}
          onSubmit={handleEvidenceResponseSubmit} />
      )}

      {/* Toast */}
      {toast && (() => {
        const tc = toast.color || '#60a5fa'
        // Parse hex → rgba for bg/border
        const hexToRgba = (hex, a) => {
          const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16)
          return `rgba(${r},${g},${b},${a})`
        }
        const tbg    = hexToRgba(tc, 0.15)
        const tborder = hexToRgba(tc, 0.4)
        return (
          <div className="fixed bottom-6 right-6 z-[10000] flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl"
            style={{ background: 'rgba(15,23,42,0.97)', border: `1px solid ${tborder}`, minWidth: 240 }}>
            <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
              style={{ background: tbg }}>
              <CheckCircle size={13} style={{ color: tc }} />
            </div>
            <div>
              <p className="text-[12px] font-semibold text-text-primary">{toast.message}</p>
              {toast.sub && <p className="text-[10px] text-text-muted">{toast.sub}</p>}
            </div>
          </div>
        )
      })()}

      {showFilters && (
        <AllFiltersPanel onClose={() => setShowFilters(false)}>
          <FilterSection label="Lifecycle / Expiration">
            {['Expired', 'Expiring Soon (30 days)', 'Valid'].map(o => (
              <button key={o} className="filter-pill">{o}</button>
            ))}
          </FilterSection>
          <FilterSection label="Knowledge Base">
            {['Finance', 'Compliance', 'Eligibility', 'Legal', 'Operations', 'Contracts'].map(o => (
              <button key={o} className="filter-pill">{o}</button>
            ))}
          </FilterSection>
          <FilterSection label="Fact Status">
            {['Verified', 'Needs Review', 'Conflict', 'Break Glass', 'In Proposal'].map(o => (
              <button key={o} className="filter-pill">{o}</button>
            ))}
          </FilterSection>
          <FilterSection label="Risk Level">
            {['Low', 'Medium', 'High'].map(o => (
              <button key={o} className="filter-pill">{o}</button>
            ))}
          </FilterSection>
          <FilterSection label="Approved By">
            {['Sarah Chen', 'Michael Torres', 'Emma Wilson', 'James Rodriguez', 'Lisa Anderson', 'David Kim', 'James Park', 'Emma Rodriguez'].map(o => (
              <button key={o} className="filter-pill">{o}</button>
            ))}
          </FilterSection>
          <FilterSection label="Promoted By">
            {['James Park', 'Alex Kim', 'Lisa Anderson', 'Sarah Chen', 'Emma Rodriguez', 'David Kim', 'Michael Torres', 'Alex Rivera'].map(o => (
              <button key={o} className="filter-pill">{o}</button>
            ))}
          </FilterSection>
          <FilterSection label="Polarity">
            {['Positive', 'Negative', 'Neutral'].map(o => (
              <button key={o} className="filter-pill">{o}</button>
            ))}
          </FilterSection>
        </AllFiltersPanel>
      )}
    </div>
  )
}
