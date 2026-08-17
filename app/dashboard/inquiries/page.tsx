import { db } from '@/lib/db'
import InquiryItem from './InquiryItem'

export default async function InquiriesPage() {
  const inquiries = await (db as any).contactInquiry.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100,
  })

  const unread = inquiries.filter((i: { read: boolean }) => !i.read).length

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[color:var(--foreground)]">Contact Inquiries</h1>
        <p className="text-sm text-[color:var(--text-muted)] mt-1">
          {inquiries.length} total · {unread} unread
        </p>
      </div>

      {inquiries.length === 0 ? (
        <div className="bg-[color:var(--bg-surface)] border border-[color:var(--border)] rounded-2xl p-12 text-center">
          <p className="text-sm text-[color:var(--text-muted)]">No inquiries yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {inquiries.map((inq: {
            id: string
            name: string
            email: string
            phone: string | null
            subject: string
            message: string
            read: boolean
            createdAt: string
          }) => (
            <InquiryItem key={inq.id} inq={inq} />
          ))}
        </div>
      )}
    </div>
  )
}
