import type { ReactNode } from 'react'

interface Props {
  href: string
  children: ReactNode
  className?: string
}

export default function ExternalLink({ href, children, className = '' }: Props) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {children}
    </a>
  )
}
