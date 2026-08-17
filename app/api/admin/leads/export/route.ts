import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { db } from '@/lib/db'

function escapeCsv(val: unknown): string {
  const s = val == null ? '' : String(val)
  if (s.includes(',') || s.includes('"') || s.includes('\n')) {
    return `"${s.replace(/"/g, '""')}"`
  }
  return s
}

function row(fields: unknown[]): string {
  return fields.map(escapeCsv).join(',')
}

export async function GET() {
  const session = await auth()
  const role = session?.user?.role
  if (!session?.user || (role !== 'agent' && role !== 'admin')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const showings = await (db as any).showingRequest.findMany({
    orderBy: { createdAt: 'desc' },
    include: { property: { select: { title: true, listingId: true } } },
  })

  const lines: string[] = [
    row(['Type', 'Name', 'Email', 'Phone', 'Property', 'MLS#', 'Status', 'Preferred Date', 'Message', 'Created']),
    ...showings.map((s: {
      name: string; email: string; phone: string | null; status: string;
      preferredAt: Date; message: string | null; createdAt: Date;
      property: { title: string; listingId: string }
    }) =>
      row([
        'Showing', s.name, s.email, s.phone ?? '',
        s.property.title, s.property.listingId,
        s.status, new Date(s.preferredAt).toLocaleDateString('en-CA'),
        s.message ?? '', new Date(s.createdAt).toLocaleDateString('en-CA'),
      ])
    ),
  ]

  const csv = lines.join('\n')
  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="leads-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  })
}
