interface CardProps {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

export default function Card({ children, className = '', style }: CardProps) {
  return (
    <div
      className={`rounded-2xl p-6 ${className}`}
      style={{
        background: 'var(--color-surface-card)',
        boxShadow: 'var(--shadow-card)',
        ...style,
      }}
    >
      {children}
    </div>
  )
}
