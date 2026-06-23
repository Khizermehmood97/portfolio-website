import { useParams, Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import PageWrapper from '@/components/layout/PageWrapper'
import Badge from '@/components/ui/Badge'
import { getPostBySlug } from '@/lib/blog'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function readingTime(content: string) {
  const words = content.trim().split(/\s+/).length
  return `${Math.max(1, Math.ceil(words / 200))} min read`
}

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>()
  const post = getPostBySlug(slug ?? '')

  if (!post) {
    return (
      <PageWrapper>
        <div className="max-w-3xl mx-auto px-6 py-16 text-center">
          <h1 className="font-display text-2xl font-bold text-text-hi mb-3">Post not found</h1>
          <p className="text-text mb-6">The post you're looking for doesn't exist.</p>
          <Link to="/blog" className="text-teal hover:text-teal-dim font-medium transition-colors">
            ← Back to Blog
          </Link>
        </div>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper>
      <article className="max-w-3xl mx-auto px-6 py-16">
        {/* Back link */}
        <Link
          to="/blog"
          className="inline-flex items-center gap-1.5 text-sm text-text-dim hover:text-teal transition-colors mb-8"
        >
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to Blog
        </Link>

        {/* Cover image */}
        {post.cover && (
          <div className="w-full h-56 sm:h-72 rounded-xl overflow-hidden mb-8">
            <img src={post.cover} alt={post.title} className="w-full h-full object-cover" />
          </div>
        )}

        {/* Post header */}
        <header className="mb-8">
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-text-hi leading-tight mb-4">
            {post.title}
          </h1>
          <div className="flex items-center gap-3 font-mono text-sm text-text-dim mb-4">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span>·</span>
            <span>{readingTime(post.content)}</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {post.tags.map((tag) => (
              <Badge key={tag} label={tag} variant="accent" />
            ))}
          </div>
        </header>

        <hr className="border-line mb-8" />

        {/* Post content */}
        <div className="prose max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.content}
          </ReactMarkdown>
        </div>
      </article>
    </PageWrapper>
  )
}
