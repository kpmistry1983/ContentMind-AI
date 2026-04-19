interface ChipProps {
  children: React.ReactNode
  className?: string
  active?: boolean
  onClick?: () => void
}

export default function Chip({ children, className = '', active = false, onClick }: ChipProps) {
  return (
    <span
      onClick={onClick}
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs ${onClick ? 'cursor-pointer' : ''} ${className}`}
      style={{
        fontFamily: 'var(--font-inter)',
        background: active ? 'var(--color-primary)' : 'var(--color-chip-bg)',
        color: active ? '#ffffff' : 'var(--color-chip-text)',
      }}
    >
      {children}
    </span>
  )
}
