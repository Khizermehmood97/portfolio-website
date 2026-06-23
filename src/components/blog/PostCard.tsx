import { Link } from 'react-router-dom'
import Badge from '@/components/ui/Badge'
import type { BlogPost } from '@/types'

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

export default function PostCard({ post }: { post: BlogPost }) {
  return (
    <article className="border border-line rounded-xl overflow-hidden bg-ink-raised hover:border-copper/40 hover:bg-ink-soft transition-all group">
      {/* Cover image */}
      {post.cover && (
        <Link to={`/blog/${post.slug}`}>
          <div className="w-full h-44 overflow-hidden">
            <img
              src={post.cover}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        </Link>
      )}

      <div className="p-6">
        <div className="flex items-center gap-3 font-mono text-xs text-text-dim mb-3">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span>·</span>
          <span>{readingTime(post.content)}</span>
        </div>

        <Link to={`/blog/${post.slug}`}>
          <h2 className="font-display text-lg font-semibold text-text-hi group-hover:text-copper transition-colors mb-2 leading-snug">
            {post.title}
          </h2>
        </Link>

        <p className="text-sm text-text leading-relaxed mb-4">{post.excerpt}</p>

        <div className="flex flex-wrap gap-1.5">
          {post.tags.map((tag) => (
            <Badge key={tag} label={tag} variant="accent" />
          ))}
        </div>
      </div>
    </article>
  )
}
