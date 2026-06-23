const sizes = {
  sm: { container: 'w-9 h-9 text-sm', text: 'font-semibold' },
  md: { container: 'w-14 h-14 text-lg', text: 'font-bold' },
  lg: { container: 'w-20 h-20 text-2xl', text: 'font-bold' },
}

interface Props {
  size?: keyof typeof sizes
}

export default function InitialsAvatar({ size = 'md' }: Props) {
  const { container, text } = sizes[size]
  return (
    <div
      className={`${container} rounded-md bg-ink-raised border border-line text-text-hi font-display flex items-center justify-center select-none flex-shrink-0`}
    >
      <span className={text}>KM</span>
    </div>
  )
}
