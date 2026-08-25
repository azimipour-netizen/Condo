import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import BlogEditor from '../../BlogEditor'

interface Props { params: Promise<{ slug: string }> }

export default async function EditBlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = await (db as any).blogPost.findUnique({
    where: { slug },
    select: { slug: true, title: true, summary: true, body: true, published: true, coverImageUrl: true, citySlug: true },
  })
  if (!post) notFound()

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[color:var(--foreground)]">Edit Post</h1>
        <p className="text-sm text-[color:var(--text-muted)] mt-1">/blog/{post.slug}</p>
      </div>
      <BlogEditor initial={post} />
    </div>
  )
}
