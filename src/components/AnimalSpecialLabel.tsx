interface AnimalSpecialLabelProps {
  label: string
  className?: string
}

export function AnimalSpecialLabel({ label, className = '' }: AnimalSpecialLabelProps) {
  return (
    <p
      className={`text-sm font-semibold text-emerald-700 ${className}`}
      aria-label={label}
    >
      {label}
    </p>
  )
}
