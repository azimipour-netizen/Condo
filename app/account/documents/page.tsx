'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import DocumentVault, { type VaultDoc } from '@/components/documents/DocumentVault'

const BUYER_CATEGORIES = [
  { value: 'drivers_license',   label: "Driver's License",         accept: '.pdf,.jpg,.jpeg,.png' },
  { value: 'passport',          label: 'Passport',                 accept: '.pdf,.jpg,.jpeg,.png' },
  { value: 'identification',    label: 'Other Government ID',      accept: '.pdf,.jpg,.jpeg,.png' },
  { value: 'address_proof',     label: 'Proof of Address',         accept: '.pdf,.jpg,.jpeg,.png' },
  { value: 'bank_statement',    label: 'Bank Statement',           accept: '.pdf' },
  { value: 'credit_report',     label: 'Credit Report',            accept: '.pdf' },
  { value: 'employment_proof',  label: 'Employment / Income Proof',accept: '.pdf,.jpg,.jpeg,.png' },
  { value: 'residency_proof',   label: 'Proof of Canadian Residency', accept: '.pdf,.jpg,.jpeg,.png' },
  { value: 'pre_agreement',     label: 'Pre-Agreement Document',   accept: '.pdf,.doc,.docx' },
  { value: 'other_buyer',       label: 'Other Document',           accept: '.pdf,.jpg,.jpeg,.png,.doc,.docx' },
]

const AGENT_DOC_CATEGORIES = [
  { value: 'purchase_agreement', label: 'Purchase Agreement' },
  { value: 'mortgage_preapproval', label: 'Mortgage Pre-Approval' },
  { value: 'listing_agreement', label: 'Listing Agreement' },
  { value: 'reco_guide', label: 'RECO Consumer Guide' },
  { value: 'disclosure', label: 'Disclosure Document' },
  { value: 'amendment', label: 'Amendment / Schedule' },
  { value: 'waiver', label: 'Waiver / Release' },
  { value: 'other_agent', label: 'Other Document' },
]

export default function BuyerDocumentsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [buyerDocs, setBuyerDocs] = useState<VaultDoc[]>([])
  const [agentDocs, setAgentDocs] = useState<VaultDoc[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login?callbackUrl=/account/documents')
  }, [status, router])

  useEffect(() => {
    if (status !== 'authenticated') return
    fetch('/api/documents')
      .then(r => r.json())
      .then(d => {
        const docs: VaultDoc[] = d.documents ?? []
        setBuyerDocs(docs.filter(d => d.side === 'buyer'))
        setAgentDocs(docs.filter(d => d.side === 'agent'))
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [status])

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-[color:var(--background)] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[color:var(--accent)]/30 border-t-[color:var(--accent)] rounded-full animate-spin" />
      </div>
    )
  }

  if (status === 'unauthenticated') return null

  return (
    <div className="min-h-screen bg-[color:var(--background)]">
      <div className="border-b border-[color:var(--border)] bg-[color:var(--bg-surface)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 text-sm text-[color:var(--text-muted)] hover:text-[color:var(--foreground)] transition-colors">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back
          </Link>
          <span className="text-[color:var(--border)]">|</span>
          <div>
            <h1 className="text-sm font-semibold text-[color:var(--foreground)]">My Documents</h1>
            <p className="text-xs text-[color:var(--text-muted)]">Secure document vault — shared with your assigned realtor</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <DocumentVault
          side="buyer"
          categories={BUYER_CATEGORIES}
          title="Your Documents"
          description="Identity, financial, and pre-qualification documents you share with your agent"
          documents={buyerDocs}
          canUpload
          onUploaded={doc => setBuyerDocs(prev => [doc, ...prev])}
          onDeleted={id => setBuyerDocs(prev => prev.filter(d => d.id !== id))}
        />

        <DocumentVault
          side="agent"
          categories={AGENT_DOC_CATEGORIES}
          title="From Your Agent"
          description="Agreements, disclosures, and documents your realtor has shared with you"
          documents={agentDocs}
          canUpload={false}
          onUploaded={() => {}}
          onDeleted={() => {}}
        />
      </div>
    </div>
  )
}
