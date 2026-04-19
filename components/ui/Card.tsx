interface CardProps {
  children: React.ReactNode
  className?: string
}

export default function Card({ children, className = '' }: CardProps) {
  return (
    <div
      className={`rounded-2xl p-6 ${className}`}
      style={{
        background: 'var(--color-surface-card)',
        boxShadow: 'var(--shadow-card)',
      }}
    >
      {children}
    </div>
  )
}
