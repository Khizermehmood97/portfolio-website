interface Props {
  title: string
  subtitle?: string
}

export default function SectionHeading({ title, subtitle }: Props) {
  return (
    <div className="mb-10">
      <h2 className="text-3xl font-bold text-slate-100 mb-2">{title}</h2>
      <div className="w-12 h-0.5 bg-blue-500 mb-3" />
      {subtitle && <p className="text-slate-400 text-base">{subtitle}</p>}
    </div>
  )
}
