import BlogEditor from '../BlogEditor'

export default function NewBlogPostPage() {
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[color:var(--foreground)]">New Post</h1>
        <p className="text-sm text-[color:var(--text-muted)] mt-1">Write a market update or neighbourhood story.</p>
      </div>
      <BlogEditor />
    </div>
  )
}
