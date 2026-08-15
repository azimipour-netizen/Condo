'use client'

import { useState, useEffect } from 'react'
import DocumentVault, { type VaultDoc } from '@/components/documents/DocumentVault'

const AGENT_CATEGORIES = [
  { value: 'purchase_agreement',   label: 'Purchase Agreement',    accept: '.pdf,.doc,.docx' },
  { value: 'mortgage_preapproval', label: 'Mortgage Pre-Approval', accept: '.pdf' },
  { value: 'listing_agreement',    label: 'Listing Agreement',     accept: '.pdf,.doc,.docx' },
  { value: 'reco_guide',           label: 'RECO Consumer Guide',   accept: '.pdf' },
  { value: 'disclosure',           label: 'Disclosure Document',   accept: '.pdf,.doc,.docx' },
  { value: 'amendment',            label: 'Amendment / Schedule',  accept: '.pdf,.doc,.docx' },
  { value: 'waiver',               label: 'Waiver / Release',      accept: '.pdf,.doc,.docx' },
  { value: 'other_agent',          label: 'Other Document',        accept: '.pdf,.jpg,.jpeg,.png,.doc,.docx' },
]

const BUYER_CATEGORIES = [
  { value: 'drivers_license',  label: "Driver's License" },
  { value: 'passport',         label: 'Passport' },
  { value: 'identification',   label: 'Other Government ID' },
  { value: 'address_proof',    label: 'Proof of Address' },
  { value: 'bank_statement',   label: 'Bank Statement' },
  { value: 'credit_report',    label: 'Credit Report' },
  { value: 'employment_proof', label: 'Employment / Income Proof' },
  { value: 'residency_proof',  label: 'Proof of Canadian Residency' },
  { value: 'pre_agreement',    label: 'Pre-Agreement Document' },
  { value: 'other_buyer',      label: 'Other Document' },
]

export default function AgentDocumentsPage() {
  const [agentDocs, setAgentDocs] = useState<VaultDoc[]>([])
  const [buyerDocs, setBuyerDocs] = useState<VaultDoc[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/documents')
      .then(r => r.json())
      .then(d => {
        const docs: VaultDoc[] = d.documents ?? []
        setAgentDocs(docs.filter(d => d.side === 'agent'))
        setBuyerDocs(docs.filter(d => d.side === 'buyer'))
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[color:var(--accent)]/30 border-t-[color:var(--accent)] rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[color:var(--foreground)]">Documents</h1>
        <p className="text-sm text-[color:var(--text-muted)] mt-1">
          Upload agreements and disclosures for clients · review buyer-submitted documents
        </p>
      </div>

      <div className="space-y-6">
        <DocumentVault
          side="agent"
          categories={AGENT_CATEGORIES}
          title="Agent Documents"
          description="Agreements, signed docs, RECO guide, and disclosures you share with buyers"
          documents={agentDocs}
          canUpload
          onUploaded={doc => setAgentDocs(prev => [doc, ...prev])}
          onDeleted={id => setAgentDocs(prev => prev.filter(d => d.id !== id))}
        />

        <DocumentVault
          side="buyer"
          categories={BUYER_CATEGORIES}
          title="Client Documents"
          description="Documents uploaded by buyers — identity, financial, and pre-qualification proofs"
          documents={buyerDocs}
          canUpload={false}
          onUploaded={() => {}}
          onDeleted={() => {}}
        />
      </div>
    </div>
  )
}
