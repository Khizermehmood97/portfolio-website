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
    <article className="border border-slate-800 rounded-xl overflow-hidden bg-slate-900 hover:border-slate-700 hover:bg-slate-800/50 transition-all group">
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
        <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span>·</span>
          <span>{readingTime(post.content)}</span>
        </div>

        <Link to={`/blog/${post.slug}`}>
          <h2 className="text-lg font-semibold text-slate-100 group-hover:text-blue-400 transition-colors mb-2 leading-snug">
            {post.title}
          </h2>
        </Link>

        <p className="text-sm text-slate-400 leading-relaxed mb-4">{post.excerpt}</p>

        <div className="flex flex-wrap gap-1.5">
          {post.tags.map((tag) => (
            <Badge key={tag} label={tag} variant="accent" />
          ))}
        </div>
      </div>
    </article>
  )
}
