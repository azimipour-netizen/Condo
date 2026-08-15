import { NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import { auth } from '@/auth'
import { db } from '@/lib/db'

const MAX_SIZE = 10 * 1024 * 1024 // 10 MB

const ALLOWED_TYPES = [
  'application/pdf',
  'image/jpeg', 'image/png', 'image/webp', 'image/heic',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const formData = await req.formData()
  const file = formData.get('file') as File | null
  const category = formData.get('category') as string | null
  const label = formData.get('label') as string | null
  const side = formData.get('side') as string | null
  const receiverId = formData.get('receiverId') as string | null

  if (!file || !category || !label || !side) {
    return NextResponse.json({ error: 'file, category, label, side required' }, { status: 400 })
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: 'File type not allowed' }, { status: 400 })
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: 'File exceeds 10 MB limit' }, { status: 400 })
  }

  const role = (session.user as any).role
  if (side === 'agent' && role !== 'agent' && role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // Buyers must be unlocked by an agent before they can upload
  if (side === 'buyer') {
    const dbUser = await (db as any).user.findUnique({
      where: { id: session.user.id },
      select: { documentsUnlocked: true },
    })
    if (!dbUser?.documentsUnlocked) {
      return NextResponse.json(
        { error: 'Document upload not enabled for your account. Contact your agent to enable it.' },
        { status: 403 }
      )
    }
  }

  try {
    const blob = await put(`documents/${session.user.id}/${Date.now()}-${file.name}`, file, {
      access: 'private',
    })

    const doc = await (db as any).document.create({
      data: {
        uploaderId: session.user.id,
        receiverId: receiverId || null,
        side,
        category,
        label,
        filename: file.name,
        fileUrl: blob.url,
        fileSize: file.size,
        mimeType: file.type,
      },
    })

    return NextResponse.json({ document: doc })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[upload] error:', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
