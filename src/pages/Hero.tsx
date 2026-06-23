import { useEffect, type ComponentType, type JSX } from 'react'
import { Link } from 'react-router-dom'
import { motion, useAnimation } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { SiDotnet, SiReact, SiAngular, SiTypescript, SiDocker } from 'react-icons/si'
import ExternalLink from '@/components/ui/ExternalLink'
import { smoothScrollToId } from '@/lib/smoothScroll'
import personal from '@/data/personal'
import { getAllPosts } from '@/lib/blog'
import type { BlogPost } from '@/types'

// Azure has no SI icon — use the official mark as an inline SVG
function AzureIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="az1" x1="0.702" y1="31.593" x2="38.331" y2="85.468" gradientUnits="userSpaceOnUse">
          <stop stopColor="#114A8B"/>
          <stop offset="1" stopColor="#0669BC"/>
        </linearGradient>
        <linearGradient id="az2" x1="53.426" y1="46.371" x2="44.907" y2="49.188" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0000002E"/>
          <stop offset="1" stopColor="#00000000"/>
        </linearGradient>
        <linearGradient id="az3" x1="33.944" y1="30.831" x2="74.18" y2="85.413" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3CCBF4"/>
          <stop offset="1" stopColor="#2892DF"/>
        </linearGradient>
      </defs>
      <path d="M33.338 6.544h26.038L31.41 89.456a4.155 4.155 0 01-3.934 2.8H8.166a4.154 4.154 0 01-3.93-5.51L29.404 9.344a4.155 4.155 0 013.934-2.8z" fill="url(#az1)"/>
      <path d="M71.175 60.261H29.396a1.913 1.913 0 00-1.307 3.309l27.065 25.249a4.177 4.177 0 002.857 1.137h23.822l-10.658-29.695z" fill="url(#az2)"/>
      <path d="M33.338 6.544a4.12 4.12 0 00-3.943 2.838L4.252 86.727a4.15 4.15 0 003.914 5.529h20.484a4.456 4.456 0 003.421-2.851l4.934-14.562 17.655 16.479a4.243 4.243 0 002.677.935h23.384l-10.258-29.395-29.832.007L57.4 6.544H33.338z" fill="url(#az3)"/>
    </svg>
  )
}

type TechEntry = {
  name: string
  icon: ComponentType<{ size?: number; className?: string }> | (() => JSX.Element)
  color: string
}

const techStack: TechEntry[] = [
  { name: '.NET Core',   icon: SiDotnet,     color: '#9B6BFF' },
  { name: 'React',       icon: SiReact,      color: '#61DAFB' },
  { name: 'Angular',     icon: SiAngular,    color: '#DD0031' },
  { name: 'Azure',       icon: AzureIcon,    color: '#2AA0DC' },
  { name: 'TypeScript',  icon: SiTypescript, color: '#3178C6' },
  { name: 'Docker',      icon: SiDocker,     color: '#2496ED' },
]

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

const blogPanel: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.35 } },
}

const blogCard: Variants = {
  hidden: { opacity: 0, x: 24 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.45 } },
}

/** Derive a Tailwind gradient class from the post's first tag */
function tagGradient(tags: string[]): string {
  const t = (tags[0] ?? '').toLowerCase()
  if (['ai', 'gpt-4', 'rag', 'ml', 'haystack', 'weaviate'].some((k) => t.includes(k)))
    return 'from-violet-700 via-purple-600 to-indigo-600'
  if (['azure', 'cloud', 'devops', 'ci/cd'].some((k) => t.includes(k)))
    return 'from-blue-700 via-blue-600 to-cyan-500'
  if (['.net', 'c#', 'asp'].some((k) => t.includes(k)))
    return 'from-indigo-700 via-purple-600 to-violet-600'
  if (['react', 'frontend', 'typescript'].some((k) => t.includes(k)))
    return 'from-cyan-600 via-sky-600 to-blue-600'
  if (['docker', 'linux', 'kubernetes'].some((k) => t.includes(k)))
    return 'from-slate-600 via-zinc-600 to-slate-500'
  return 'from-blue-700 via-indigo-600 to-purple-600'
}

/** Decorative dot-grid SVG overlay for thumbnails */
function DotGrid() {
  return (
    <svg
      className="absolute inset-0 w-full h-full opacity-20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern id="dots" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.2" fill="white" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#dots)" />
    </svg>
  )
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function BlogThumbnailCard({ post }: { post: BlogPost }) {
  return (
    <motion.div variants={blogCard}>
      <Link
        to={`/blog/${post.slug}`}
        className="group flex gap-4 p-3 rounded-lg border border-line bg-ink-raised hover:border-copper/50 hover:bg-ink-soft transition-all"
      >
        {/* Thumbnail */}
        <div className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gradient-to-br ${tagGradient(post.tags)}`}>
          {post.cover ? (
            <img
              src={post.cover}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <>
              <DotGrid />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[10px] font-bold text-white/90 bg-black/25 px-1.5 py-0.5 rounded-full backdrop-blur-sm leading-tight text-center">
                  {post.tags[0] ?? 'Blog'}
                </span>
              </div>
            </>
          )}
        </div>

        {/* Text */}
        <div className="flex flex-col justify-center min-w-0">
          <p className="font-mono text-[10px] text-text-dim mb-1">{formatDate(post.date)}</p>
          <h3 className="text-sm font-semibold text-text-hi group-hover:text-copper transition-colors leading-snug line-clamp-2 mb-1">
            {post.title}
          </h3>
          <p className="text-xs text-text-dim line-clamp-2 leading-relaxed">
            {post.excerpt}
          </p>
        </div>

        {/* Arrow */}
        <div className="flex-shrink-0 self-center text-text-dim group-hover:text-copper group-hover:translate-x-0.5 transition-all">
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
          </svg>
        </div>
      </Link>
    </motion.div>
  )
}

const recentPosts = getAllPosts().slice(0, 3)

export default function Hero() {
  const controls = useAnimation()

  useEffect(() => {
    void controls.start('visible')
  }, [controls])

  return (
    <section id="hero" className="relative min-h-[calc(100vh-4rem)] flex items-center px-6 py-16 scroll-mt-16 overflow-hidden">
      {/* ── Atmosphere: faint cool light-source, then blueprint grid ── */}
      <div className="absolute inset-0 bp-glow pointer-events-none" aria-hidden="true" />
      <div className="absolute inset-0 bp-grid bp-grid-mask pointer-events-none" aria-hidden="true" />

      <div className="relative max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-16 xl:gap-24 items-center">

        {/* ── Left: Hero content ── */}
        <motion.div variants={container} initial="hidden" animate={controls}>
          {/* Eyebrow: mono role marker + availability */}
          <motion.div variants={item} className="flex items-center gap-3 mb-6">
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-copper">
              {'// senior full-stack engineer'}
            </span>
          </motion.div>

          {/* Profile + name row */}
          <motion.div variants={item} className="flex items-center gap-4 mb-5">
            <img
              src="/profile.png"
              alt="Khizer Mehmood"
              className="w-16 h-16 rounded-md object-cover object-top border border-line"
            />
            <h1 className="font-display text-5xl sm:text-6xl font-bold text-text-hi tracking-tight">
              {personal.name}
            </h1>
          </motion.div>

          {/* Thesis: the dual identity, stated plainly */}
          <motion.p variants={item} className="text-xl sm:text-2xl text-text leading-snug mb-6 max-w-xl">
            I build resilient enterprise systems on{' '}
            <span className="text-text-hi font-medium">.NET, React &amp; Azure</span>
            {' '}— and research{' '}
            <span className="text-teal font-medium">multimodal AI for cancer diagnosis</span>.
          </motion.p>

          {/* Supporting line */}
          <motion.p variants={item} className="text-base text-text-dim leading-relaxed mb-8 max-w-lg">
            6 years shipping production software for energy, petrochemical, and
            government clients. Currently completing an MS thesis on vision–genomics fusion.
          </motion.p>

          {/* CTA buttons */}
          <motion.div variants={item} className="flex flex-wrap gap-3 mb-10">
            <a
              href="#projects"
              onClick={(e) => { e.preventDefault(); smoothScrollToId('projects') }}
              className="px-5 py-2.5 bg-copper text-ink text-sm font-semibold rounded-md hover:bg-copper-dim transition-colors"
            >
              View My Work
            </a>
            <a
              href="#contact"
              onClick={(e) => { e.preventDefault(); smoothScrollToId('contact') }}
              className="px-5 py-2.5 border border-line text-text text-sm font-medium rounded-md hover:border-teal hover:text-teal transition-colors"
            >
              Get In Touch
            </a>
          </motion.div>

          {/* Tech badges with logos */}
          <motion.div variants={item} className="flex flex-wrap gap-2 mb-10">
            {techStack.map(({ name, icon: Icon, color }) => (
              <span
                key={name}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-ink-raised border border-line rounded-md hover:border-copper/50 transition-colors"
              >
                <span style={{ color, display: 'flex' }}><Icon size={14} /></span>
                <span className="font-mono text-[11px] font-medium text-text">{name}</span>
              </span>
            ))}
          </motion.div>

          {/* Social links */}
          <motion.div variants={item} className="flex items-center gap-5">
            <ExternalLink
              href={personal.github}
              className="flex items-center gap-2 text-sm text-text-dim hover:text-text-hi transition-colors"
            >
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              GitHub
            </ExternalLink>
            <ExternalLink
              href={personal.linkedin}
              className="flex items-center gap-2 text-sm text-text-dim hover:text-text-hi transition-colors"
            >
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              LinkedIn
            </ExternalLink>
            <a
              href={`mailto:${personal.email}`}
              className="flex items-center gap-2 text-sm text-text-dim hover:text-text-hi transition-colors"
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
              Email
            </a>
          </motion.div>
        </motion.div>

        {/* ── Right: Recent Blog Posts ── */}
        {recentPosts.length > 0 && (
          <motion.div
            variants={blogPanel}
            initial="hidden"
            animate={controls}
            className="lg:border-l lg:border-line lg:pl-12"
          >
            {/* Panel header */}
            <motion.div variants={blogCard} className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-text-dim">Recent Writing</h2>
                <div className="w-8 h-0.5 bg-copper mt-2" />
              </div>
              <Link
                to="/blog"
                className="text-xs text-text-dim hover:text-teal transition-colors flex items-center gap-1"
              >
                All posts
                <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
                </svg>
              </Link>
            </motion.div>

            {/* Cards */}
            <div className="space-y-3">
              {recentPosts.map((post) => (
                <BlogThumbnailCard key={post.slug} post={post} />
              ))}
            </div>

            {/* Bottom CTA */}
            <motion.div variants={blogCard} className="mt-5">
              <Link
                to="/blog"
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-md border border-dashed border-line text-xs text-text-dim hover:border-teal hover:text-teal transition-colors"
              >
                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                View all writing
              </Link>
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  )
}
