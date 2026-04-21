import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'

const navLinks = [
  { to: '/about', label: 'About' },
  { to: '/skills', label: 'Skills' },
  { to: '/experience', label: 'Experience' },
  { to: '/projects', label: 'Projects' },
  { to: '/blog', label: 'Blog' },
  { to: '/contact', label: 'Contact' },
]

function NavItem({ to, label, onClick }: { to: string; label: string; onClick?: () => void }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `text-sm font-medium transition-colors duration-150 ${
          isActive
            ? 'text-blue-400 border-b-2 border-blue-400 pb-0.5'
            : 'text-slate-400 hover:text-slate-100'
        }`
      }
    >
      {label}
    </NavLink>
  )
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800">
      <nav className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold select-none hover:bg-blue-500 transition-colors"
        >
          KM
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => (
            <NavItem key={link.to} to={link.to} label={link.label} />
          ))}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
          className="md:hidden flex flex-col gap-1.5 p-1.5 text-slate-400 hover:text-slate-100 transition-colors"
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
            className="md:hidden overflow-hidden border-t border-slate-800"
          >
            <div className="flex flex-col px-6 py-4 gap-4 bg-slate-900">
              {navLinks.map((link) => (
                <NavItem key={link.to} to={link.to} label={link.label} onClick={() => setMobileOpen(false)} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
