import PageWrapper from '@/components/layout/PageWrapper'
import SectionHeading from '@/components/ui/SectionHeading'
import PostCard from '@/components/blog/PostCard'
import { getAllPosts } from '@/lib/blog'

const posts = getAllPosts()

export default function Blog() {
  return (
    <PageWrapper>
      <section className="max-w-3xl mx-auto px-6 py-16">
        <SectionHeading
          title="Blog"
          subtitle="Technical writing on .NET, React, Azure, and AI engineering."
        />

        {posts.length === 0 ? (
          <p className="text-slate-500 text-sm">No posts published yet. Check back soon.</p>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        )}
      </section>
    </PageWrapper>
  )
}
