interface ButtonProps {
  variant: 'primary' | 'ghost'
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  className?: string
  type?: 'button' | 'submit' | 'reset'
  style?: React.CSSProperties
}

export default function Button({
  variant,
  children,
  onClick,
  disabled,
  className = '',
  type = 'button',
  style: styleProp,
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-[12px] px-6 py-3 font-semibold transition-opacity duration-200 select-none'

  const variants = {
    primary: 'text-white border-0',
    ghost: 'bg-transparent border text-[var(--color-text-primary)]',
  }

  const disabledStyles = disabled ? 'opacity-60 cursor-not-allowed' : ''

  const primaryStyle =
    variant === 'primary'
      ? { background: 'var(--gradient-primary)', fontFamily: 'var(--font-manrope)' }
      : undefined

  const ghostStyle =
    variant === 'ghost'
      ? { borderColor: 'rgba(196, 196, 215, 0.2)' }
      : undefined

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${disabledStyles} ${variant === 'primary' ? 'hover:opacity-90' : ''} ${className}`}
      style={{ ...primaryStyle, ...ghostStyle, ...styleProp }}
    >
      {disabled && (
        <svg
          className="animate-spin h-4 w-4 shrink-0"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      )}
      {children}
    </button>
  )
}
