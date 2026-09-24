interface BackButtonProps {
  onClick: () => void
  label?: string
}

export function BackButton({ onClick, label = 'Back' }: BackButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-lg font-medium text-gray-600 shadow-sm transition hover:bg-white hover:shadow-md"
    >
      <span aria-hidden="true">←</span>
      {label}
    </button>
  )
}
