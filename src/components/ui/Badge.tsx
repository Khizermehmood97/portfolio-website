interface Props {
  label: string
  variant?: 'default' | 'accent' | 'outline'
}

export default function Badge({ label, variant = 'default' }: Props) {
  const styles = {
    default: 'bg-ink-raised text-text border border-line',
    accent: 'bg-teal/10 text-teal border border-teal/30',
    outline: 'border border-line text-text-dim bg-transparent',
  }
  return (
    <span
      className={`inline-block px-2.5 py-0.5 rounded font-mono text-[11px] font-medium tracking-tight ${styles[variant]}`}
    >
      {label}
    </span>
  )
}
