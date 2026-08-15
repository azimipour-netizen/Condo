'use client'

import { useState, useEffect, useCallback } from 'react'
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

interface ClientUser {
  id: string
  name: string | null
  email: string
  documentsUnlocked: boolean
  createdAt: string
  _count: { uploadedDocuments: number }
}

function initials(name: string | null, email: string) {
  if (name) return name.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase()
  return email.slice(0, 2).toUpperCase()
}

export default function AgentDocumentsPage() {
  const [agentDocs, setAgentDocs] = useState<VaultDoc[]>([])
  const [buyerDocs, setBuyerDocs] = useState<VaultDoc[]>([])
  const [clients, setClients] = useState<ClientUser[]>([])
  const [toggling, setToggling] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'docs' | 'clients'>('docs')

  const loadData = useCallback(async () => {
    setLoading(true)
    const [docsRes, clientsRes] = await Promise.all([
      fetch('/api/documents').then(r => r.json()).catch(() => ({ documents: [] })),
      fetch('/api/admin/users').then(r => r.json()).catch(() => ({ users: [] })),
    ])
    const docs: VaultDoc[] = docsRes.documents ?? []
    setAgentDocs(docs.filter(d => d.side === 'agent'))
    setBuyerDocs(docs.filter(d => d.side === 'buyer'))
    setClients(clientsRes.users ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { loadData() }, [loadData])

  async function toggleAccess(userId: string, currentState: boolean) {
    setToggling(userId)
    try {
      const res = await fetch(`/api/admin/users/${userId}/documents-access`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ unlocked: !currentState }),
      })
      if (res.ok) {
        setClients(prev => prev.map(c => c.id === userId ? { ...c, documentsUnlocked: !currentState } : c))
      }
    } finally {
      setToggling(null)
    }
  }

  // Group buyer docs by uploader
  const docsByBuyer = buyerDocs.reduce<Record<string, { user: VaultDoc['uploader']; docs: VaultDoc[] }>>((acc, doc) => {
    const key = doc.uploader?.email ?? 'unknown'
    if (!acc[key]) acc[key] = { user: doc.uploader, docs: [] }
    acc[key].docs.push(doc)
    return acc
  }, {})

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[color:var(--accent)]/30 border-t-[color:var(--accent)] rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[color:var(--foreground)]">Documents</h1>
        <p className="text-sm text-[color:var(--text-muted)] mt-1">
          Manage client documents, upload agreements, and control who can upload files
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-[color:var(--bg-surface-2)] rounded-xl mb-6 w-fit">
        {(['docs', 'clients'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeTab === tab
                ? 'bg-[color:var(--bg-surface)] text-[color:var(--foreground)] shadow-sm'
                : 'text-[color:var(--text-muted)] hover:text-[color:var(--foreground)]'
            }`}
          >
            {tab === 'docs' ? 'Documents' : `Client Access${clients.length ? ` (${clients.length})` : ''}`}
          </button>
        ))}
      </div>

      {activeTab === 'docs' && (
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

          {/* Buyer docs grouped by uploader */}
          {Object.keys(docsByBuyer).length === 0 ? (
            <div className="bg-[color:var(--bg-surface)] border border-[color:var(--border)] rounded-2xl px-6 py-10 text-center">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="mx-auto mb-3 text-[color:var(--text-faint)]">
                <path d="M8 4H22L28 10V28H8V4Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                <path d="M22 4V10H28" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
              </svg>
              <p className="text-sm text-[color:var(--text-muted)]">No client documents yet</p>
              <p className="text-xs text-[color:var(--text-faint)] mt-1">Enable upload access for clients in the Client Access tab</p>
            </div>
          ) : (
            <div className="space-y-4">
              <h2 className="text-sm font-semibold text-[color:var(--foreground)]">Client Documents</h2>
              {Object.entries(docsByBuyer).map(([email, { user, docs }]) => (
                <div key={email} className="bg-[color:var(--bg-surface)] border border-[color:var(--border)] rounded-2xl overflow-hidden">
                  <div className="px-5 py-3 border-b border-[color:var(--border)] flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[color:var(--accent)]/10 flex items-center justify-center text-xs font-bold text-[color:var(--accent)]">
                      {initials(user?.name ?? null, email)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[color:var(--foreground)]">{user?.name ?? email.split('@')[0]}</p>
                      <p className="text-xs text-[color:var(--text-faint)]">{email} · {docs.length} document{docs.length !== 1 ? 's' : ''}</p>
                    </div>
                  </div>
                  <DocumentVault
                    side="buyer"
                    categories={BUYER_CATEGORIES}
                    title=""
                    description=""
                    documents={docs}
                    canUpload={false}
                    onUploaded={() => {}}
                    onDeleted={() => {}}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'clients' && (
        <div className="bg-[color:var(--bg-surface)] border border-[color:var(--border)] rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-[color:var(--border)]">
            <h3 className="text-sm font-semibold text-[color:var(--foreground)]">Client Upload Access</h3>
            <p className="text-xs text-[color:var(--text-muted)] mt-0.5">
              Toggle document upload permission per client. Locked by default to prevent spam.
            </p>
          </div>
          {clients.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <p className="text-sm text-[color:var(--text-muted)]">No registered clients yet</p>
            </div>
          ) : (
            <ul className="divide-y divide-[color:var(--border)]">
              {clients.map(client => (
                <li key={client.id} className="flex items-center gap-3 px-5 py-3">
                  <div className="w-8 h-8 rounded-full bg-[color:var(--bg-surface-2)] flex items-center justify-center text-xs font-bold text-[color:var(--text-muted)]">
                    {initials(client.name, client.email)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[color:var(--foreground)] truncate">
                      {client.name ?? client.email.split('@')[0]}
                    </p>
                    <p className="text-xs text-[color:var(--text-faint)] truncate">
                      {client.email} · {client._count.uploadedDocuments} file{client._count.uploadedDocuments !== 1 ? 's' : ''} uploaded
                    </p>
                  </div>
                  <button
                    onClick={() => toggleAccess(client.id, client.documentsUnlocked)}
                    disabled={toggling === client.id}
                    className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors disabled:opacity-50 ${
                      client.documentsUnlocked
                        ? 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20'
                        : 'bg-[color:var(--bg-surface-2)] text-[color:var(--text-muted)] hover:text-[color:var(--foreground)]'
                    }`}
                  >
                    {toggling === client.id ? (
                      <div className="w-3 h-3 border border-current/30 border-t-current rounded-full animate-spin" />
                    ) : client.documentsUnlocked ? (
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <rect x="1" y="5.5" width="10" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
                        <path d="M4 5.5V4a2 2 0 0 1 4 0" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                      </svg>
                    ) : (
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <rect x="1" y="5.5" width="10" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
                        <path d="M4 5.5V3.5a2 2 0 0 1 4 0v2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                      </svg>
                    )}
                    {client.documentsUnlocked ? 'Unlocked' : 'Locked'}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
