'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
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
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-[color:var(--accent)]/30 border-t-[color:var(--accent)] rounded-full animate-spin" />
      </div>
    )
  }

  if (status === 'unauthenticated') return null

  return (
    <div className="px-6 py-8">
      <div className="mb-6">
        <h1 className="text-lg font-semibold text-[color:var(--foreground)]">My Documents</h1>
        <p className="text-sm text-[color:var(--text-muted)] mt-0.5">Secure document vault — shared with your assigned realtor</p>
      </div>

      <div className="max-w-4xl space-y-6">
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {!(session as any)?.user?.documentsUnlocked && (
          <div className="bg-[color:var(--bg-surface)] border border-[color:var(--border)] rounded-2xl px-6 py-8 flex flex-col items-center text-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[color:var(--bg-surface-2)] flex items-center justify-center">
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none" className="text-[color:var(--text-muted)]">
                <rect x="3" y="10" width="16" height="11" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M7 10V7a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <circle cx="11" cy="15.5" r="1.5" fill="currentColor"/>
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-[color:var(--foreground)]">Document upload is locked</p>
              <p className="text-xs text-[color:var(--text-muted)] mt-1 max-w-xs">
                Your agent needs to enable document upload for your account. Contact your assigned realtor to get access.
              </p>
            </div>
          </div>
        )}

        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {(session as any)?.user?.documentsUnlocked && (
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
        )}

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

