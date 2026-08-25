import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { db } from '@/lib/db'
import { ratelimit, getIP, rateLimitResponse } from '@/lib/ratelimit'
import { z } from 'zod'

const CreateSchema = z.object({
  title: z.string().min(5).max(200),
  summary: z.string().min(10).max(500),
  body: z.string().min(20),
  slug: z.string().regex(/^[a-z0-9-]+$/).min(3).max(120),
  published: z.boolean().default(false),
  coverImageUrl: z.string().url().nullable().optional(),
  citySlug: z.string().nullable().optional(),
})

export async function GET(req: NextRequest) {
  const rl = ratelimit(`blog:${getIP(req)}`, 60, 60_000)
  if (!rl.success) return rateLimitResponse(rl.resetAt)

  const onlyPublished = req.nextUrl.searchParams.get('published') !== 'false'
  const posts = await (db as any).blogPost.findMany({
    where: onlyPublished ? { published: true } : undefined,
    orderBy: { publishedAt: 'desc' },
    select: { id: true, slug: true, title: true, summary: true, published: true, publishedAt: true, createdAt: true, author: { select: { name: true } } },
  })
  return NextResponse.json({ posts })
}

export async function POST(req: NextRequest) {
  const session = await auth()
  const role = session?.user?.role
  if (!session?.user || (role !== 'agent' && role !== 'admin')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await req.json()
  const data = CreateSchema.parse(body)

  const existing = await (db as any).blogPost.findUnique({ where: { slug: data.slug } })
  if (existing) return NextResponse.json({ error: 'Slug already exists' }, { status: 409 })

  const post = await (db as any).blogPost.create({
    data: {
      ...data,
      authorId: session.user.id,
      publishedAt: data.published ? new Date() : null,
    },
  })
  return NextResponse.json({ post }, { status: 201 })
}
