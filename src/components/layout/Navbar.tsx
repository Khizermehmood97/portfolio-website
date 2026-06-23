import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { smoothScrollToId, smoothScrollToY } from '@/lib/smoothScroll'

// Section links scroll within the single-page Home. `id` matches the
// `id` on each page's <section>. Blog is a real route.
const sectionLinks = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
]

const sectionIds = ['hero', ...sectionLinks.map((l) => l.id)]

/** KM monogram rendered as a hairline blueprint tile, not a flat disc. */
function Monogram() {
  return (
    <span className="relative w-9 h-9 grid place-items-center rounded-md border border-line bg-ink-raised overflow-hidden transition-colors group-hover:border-copper/60">
      {/* faint internal grid lines */}
      <span className="absolute inset-x-0 top-1/2 h-px bg-line/70" />
      <span className="absolute inset-y-0 left-1/2 w-px bg-line/70" />
      <span className="relative font-display text-sm font-bold text-text-hi tracking-tight">
        KM
      </span>
    </span>
  )
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [active, setActive] = useState('')
  const location = useLocation()
  const navigate = useNavigate()

  const onHome = location.pathname === '/'

  // Scroll-spy: highlight the section currently in view (only on Home).
  useEffect(() => {
    if (!onHome) {
      setActive('')
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActive(visible.target.id)
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: [0, 0.25, 0.5, 1] }
    )
    sectionIds.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [onHome])

  function goToSection(id: string) {
    setMobileOpen(false)
    if (onHome) {
      smoothScrollToId(id)
      // Keep the URL hash in sync without triggering a jump.
      window.history.replaceState(null, '', `/#${id}`)
    } else {
      navigate(`/#${id}`)
    }
  }

  function goHome() {
    setMobileOpen(false)
    if (onHome) {
      smoothScrollToY(0)
      window.history.replaceState(null, '', '/')
    } else {
      navigate('/')
    }
  }

  const linkClass = (isActive: boolean) =>
    `text-sm font-medium transition-colors duration-150 ${
      isActive
        ? 'text-copper'
        : 'text-text hover:text-text-hi'
    }`

  return (
    <header className="sticky top-0 z-50 bg-ink/80 backdrop-blur-md border-b border-line">
      <nav className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <button onClick={goHome} className="group" aria-label="Back to top">
          <Monogram />
        </button>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-7">
          {sectionLinks.map((link, i) => {
            const isActive = onHome && active === link.id
            return (
              <button
                key={link.id}
                onClick={() => goToSection(link.id)}
                className={`group flex items-baseline gap-1.5 ${linkClass(isActive)}`}
              >
                <span className="font-mono text-[10px] text-text-dim group-hover:text-copper transition-colors">
                  {String(i + 1).padStart(2, '0')}
                </span>
                {link.label}
              </button>
            )
          })}
          <Link
            to="/blog"
            className={`flex items-baseline gap-1.5 ${linkClass(location.pathname.startsWith('/blog'))}`}
          >
            <span className="font-mono text-[10px] text-text-dim">06</span>
            Blog
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
          className="md:hidden flex flex-col gap-1.5 p-1.5 text-text hover:text-text-hi transition-colors"
        >
          <span className={`block w-5 h-0.5 bg-current transition-transform duration-200 ${mobileOpen ? 'translate-y-2 rotate-45' : ''}`} />
          <span className={`block w-5 h-0.5 bg-current transition-opacity duration-200 ${mobileOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-5 h-0.5 bg-current transition-transform duration-200 ${mobileOpen ? '-translate-y-2 -rotate-45' : ''}`} />
        </button>
      </nav>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="md:hidden overflow-hidden border-t border-line"
          >
            <div className="flex flex-col px-6 py-4 gap-4 bg-ink">
              {sectionLinks.map((link, i) => (
                <button
                  key={link.id}
                  onClick={() => goToSection(link.id)}
                  className={`flex items-baseline gap-2 text-left ${linkClass(onHome && active === link.id)}`}
                >
                  <span className="font-mono text-[10px] text-text-dim">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {link.label}
                </button>
              ))}
              <Link
                to="/blog"
                onClick={() => setMobileOpen(false)}
                className={`flex items-baseline gap-2 ${linkClass(location.pathname.startsWith('/blog'))}`}
              >
                <span className="font-mono text-[10px] text-text-dim">06</span>
                Blog
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
