import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { db } from '@/lib/db'
import { put } from '@vercel/blob'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  const role = session?.user?.role
  if (!session?.user || (role !== 'agent' && role !== 'admin')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { id } = await params
  const property = await (db as any).property.findUnique({ where: { id }, select: { id: true } })
  if (!property) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const formData = await req.formData()
  const file = formData.get('file') as File | null
  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })

  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/avif']
  if (!allowed.includes(file.type)) {
    return NextResponse.json({ error: 'Only JPEG, PNG, WebP, AVIF allowed' }, { status: 400 })
  }
  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json({ error: 'Max file size 10 MB' }, { status: 400 })
  }

  const ext = file.name.split('.').pop() ?? 'jpg'
  const filename = `properties/${id}/${Date.now()}.${ext}`

  const blob = await put(filename, file, { access: 'public' })

  // Get current max order
  const maxOrder = await (db as any).propertyImage.aggregate({
    where: { propertyId: id },
    _max: { order: true },
  })
  const order = (maxOrder._max.order ?? -1) + 1

  const image = await (db as any).propertyImage.create({
    data: { propertyId: id, url: blob.url, order, alt: null },
    select: { id: true, url: true, order: true },
  })

  return NextResponse.json({ image })
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const images = await (db as any).propertyImage.findMany({
    where: { propertyId: id },
    orderBy: { order: 'asc' },
    select: { id: true, url: true, order: true, alt: true },
  })
  return NextResponse.json({ images })
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  const role = session?.user?.role
  if (!session?.user || (role !== 'agent' && role !== 'admin')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { id } = await params
  const { imageId } = await req.json()
  if (!imageId) return NextResponse.json({ error: 'imageId required' }, { status: 400 })

  await (db as any).propertyImage.deleteMany({ where: { id: imageId, propertyId: id } })
  return NextResponse.json({ ok: true })
}
