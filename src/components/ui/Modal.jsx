export default function Modal({ title, onClose, children, size = 'md' }) {
  const sizes = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl' }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 p-0" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className={`relative w-full ${sizes[size]} bg-white dark:bg-slate-800 sm:rounded-2xl rounded-t-2xl shadow-2xl flex flex-col max-h-[90dvh] sm:max-h-[calc(100vh-2rem)]`}
        onClick={e => e.stopPropagation()}
      >
        {/* Sticky header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700 shrink-0">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{title}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 dark:hover:text-slate-200 transition-colors"
          >
            ✕
          </button>
        </div>
        {/* Scrollable content */}
        <div className="p-6 overflow-y-auto">{children}</div>
      </div>
    </div>
  )
}
