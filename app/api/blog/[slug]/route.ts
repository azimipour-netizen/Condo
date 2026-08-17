import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { db } from '@/lib/db'
import { z } from 'zod'

const UpdateSchema = z.object({
  title: z.string().min(5).max(200).optional(),
  summary: z.string().min(10).max(500).optional(),
  body: z.string().min(20).optional(),
  published: z.boolean().optional(),
})

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await (db as any).blogPost.findUnique({
    where: { slug },
    include: { author: { select: { name: true } } },
  })
  if (!post || (!post.published)) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ post })
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const session = await auth()
  const role = session?.user?.role
  if (!session?.user || (role !== 'agent' && role !== 'admin')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { slug } = await params
  const body = await req.json()
  const data = UpdateSchema.parse(body)

  const existing = await (db as any).blogPost.findUnique({ where: { slug } })
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const wasPublished = existing.published
  const post = await (db as any).blogPost.update({
    where: { slug },
    data: {
      ...data,
      publishedAt: data.published && !wasPublished ? new Date() : existing.publishedAt,
    },
  })
  return NextResponse.json({ post })
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const session = await auth()
  const role = session?.user?.role
  if (!session?.user || (role !== 'agent' && role !== 'admin')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { slug } = await params
  await (db as any).blogPost.delete({ where: { slug } })
  return NextResponse.json({ ok: true })
}
