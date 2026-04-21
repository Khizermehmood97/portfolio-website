interface Props {
  label: string
  variant?: 'default' | 'accent' | 'outline'
}

export default function Badge({ label, variant = 'default' }: Props) {
  const styles = {
    default: 'bg-slate-800 text-slate-300 border border-slate-700',
    accent: 'bg-blue-900/40 text-blue-300 border border-blue-800',
    outline: 'border border-slate-700 text-slate-400 bg-transparent',
  }
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded text-xs font-medium ${styles[variant]}`}>
      {label}
    </span>
  )
}
