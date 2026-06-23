import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { smoothScrollToId } from '@/lib/smoothScroll'
import Hero from '@/pages/Hero'
import About from '@/pages/About'
import Skills from '@/pages/Skills'
import Experience from '@/pages/Experience'
import Projects from '@/pages/Projects'
import Contact from '@/pages/Contact'

/**
 * Single-page layout. All sections are stacked and the navbar links
 * smooth-scroll between them. When the user arrives with a hash
 * (e.g. /#projects), scroll that section into view once mounted.
 */
export default function Home() {
  const { hash } = useLocation()

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0 })
      return
    }
    const id = hash.slice(1)
    // Defer until sections (including their entry animations) are laid out.
    const t = window.setTimeout(() => {
      smoothScrollToId(id)
    }, 80)
    return () => window.clearTimeout(t)
  }, [hash])

  return (
    <>
      <Hero />
      <About />
      <Skills />
      <Experience />
      <Projects />
      <Contact />
    </>
  )
}
