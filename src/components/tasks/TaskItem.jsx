import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { PriorityBadge } from '../ui/Badge'
import TaskModal from '../tasks/TaskModal'
import { Check, Pencil, Trash2, Calendar } from 'lucide-react'

export default function TaskItem({ task }) {
  const { dispatch } = useApp()
  const [showEdit, setShowEdit] = useState(false)

  const now = new Date()
  const overdue = task.dueDate && !task.completed && new Date(task.dueDate) < now

  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${
      task.completed
        ? 'bg-slate-50 dark:bg-slate-800/30 border-slate-100 dark:border-slate-700/50 opacity-60'
        : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700'
    }`}>
      <button
        onClick={() => dispatch({ type: 'TOGGLE_TASK', id: task.id })}
        className={`w-5 h-5 flex-shrink-0 rounded-full border-2 flex items-center justify-center transition-all ${
          task.completed
            ? 'bg-emerald-500 border-emerald-500'
            : 'border-slate-300 dark:border-slate-600 hover:border-blue-400'
        }`}
      >
        {task.completed && <Check size={11} className="text-white" strokeWidth={3} />}
      </button>

      <span className={`flex-1 text-sm ${task.completed ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-700 dark:text-slate-200'}`}>
        {task.title}
      </span>

      <div className="flex items-center gap-2 flex-shrink-0">
        {task.dueDate && (
          <span className={`flex items-center gap-1 text-xs ${overdue ? 'text-red-500 font-semibold' : 'text-slate-400 dark:text-slate-500'}`}>
            <Calendar size={11} />
            {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
        )}
        <PriorityBadge priority={task.priority} />
        <button onClick={() => setShowEdit(true)} className="w-6 h-6 flex items-center justify-center rounded text-slate-300 hover:text-slate-500 dark:hover:text-slate-300 transition-colors">
          <Pencil size={13} />
        </button>
        <button onClick={() => dispatch({ type: 'DELETE_TASK', id: task.id })} className="w-6 h-6 flex items-center justify-center rounded text-slate-300 hover:text-red-500 transition-colors">
          <Trash2 size={13} />
        </button>
      </div>

      {showEdit && <TaskModal task={task} projectId={task.projectId} onClose={() => setShowEdit(false)} />}
    </div>
  )
}
