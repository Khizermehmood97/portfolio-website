interface Props {
  title: string
  subtitle?: string
  /** Two-digit section index, e.g. "01" — rendered as a mono coordinate. */
  index?: string
}

export default function SectionHeading({ title, subtitle, index }: Props) {
  return (
    <div className="mb-10">
      {/* Mono coordinate eyebrow — encodes read-order, blueprint signature */}
      {index && (
        <div className="flex items-center gap-3 mb-3">
          <span className="font-mono text-xs text-copper tracking-widest">
            {index}
          </span>
          <span className="h-px w-8 bg-line" />
          <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-text-dim">
            {title}
          </span>
        </div>
      )}
      <h2 className="font-display text-3xl sm:text-4xl font-bold text-text-hi tracking-tight">
        {title}
      </h2>
      <div className="w-12 h-0.5 bg-copper mt-3 mb-3" />
      {subtitle && <p className="text-text text-base max-w-2xl leading-relaxed">{subtitle}</p>}
    </div>
  )
}
