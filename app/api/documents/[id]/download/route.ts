import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { db } from '@/lib/db'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) return new NextResponse('Unauthorized', { status: 401 })

  const { id } = await params
  const doc = await (db as any).document.findUnique({ where: { id } })
  if (!doc) return new NextResponse('Not found', { status: 404 })

  const role = (session.user as any).role
  const userId = session.user.id
  const isAgent = role === 'agent' || role === 'admin'

  // Buyers: can only access their own buyer docs + agent docs sent to them/broadcast
  if (!isAgent) {
    const allowed =
      (doc.side === 'buyer' && doc.uploaderId === userId) ||
      (doc.side === 'agent' && (doc.receiverId === userId || doc.receiverId === null))
    if (!allowed) return new NextResponse('Forbidden', { status: 403 })
  }

  // Fetch from Vercel Blob with read/write token (private blob)
  const res = await fetch(doc.fileUrl, {
    headers: {
      Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}`,
    },
  })

  if (!res.ok) return new NextResponse('Blob fetch failed', { status: 502 })

  return new NextResponse(res.body, {
    headers: {
      'Content-Type': doc.mimeType,
      'Content-Disposition': `inline; filename="${encodeURIComponent(doc.filename)}"`,
      'Cache-Control': 'private, max-age=300',
    },
  })
}
