const STATUS_STYLES = {
  planning:  'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
  active:    'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  'on-hold': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300',
  completed: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
}

const PRIORITY_STYLES = {
  low:    'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400',
  medium: 'bg-orange-100 text-orange-600 dark:bg-orange-900/40 dark:text-orange-300',
  high:   'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-300',
}

const STATUS_LABELS = {
  planning: 'Planning',
  active: 'Active',
  'on-hold': 'On Hold',
  completed: 'Completed',
}

export function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[status] ?? STATUS_STYLES.planning}`}>
      {STATUS_LABELS[status] ?? status}
    </span>
  )
}

export function PriorityBadge({ priority }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${PRIORITY_STYLES[priority] ?? PRIORITY_STYLES.medium}`}>
      {priority?.charAt(0).toUpperCase() + priority?.slice(1)}
    </span>
  )
}
