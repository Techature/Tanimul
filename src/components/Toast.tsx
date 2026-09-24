interface ToastProps {
  message: string
  onClose: () => void
}

export function Toast({ message, onClose }: ToastProps) {
  return (
    <div className="fixed bottom-8 left-1/2 z-50 -translate-x-1/2">
      <div className="flex items-center gap-4 rounded-2xl bg-white px-6 py-4 shadow-xl">
        <span className="text-lg font-medium text-gray-800">{message}</span>
        <button
          onClick={onClose}
          className="rounded-full bg-pastel-purple px-3 py-1 text-sm font-semibold text-gray-700 transition hover:brightness-95"
        >
          OK
        </button>
      </div>
    </div>
  )
}
