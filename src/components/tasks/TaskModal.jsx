import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import Modal from '../ui/Modal'

const defaultForm = { title: '', priority: 'medium', dueDate: '' }

export default function TaskModal({ projectId, task, onClose }) {
  const { dispatch } = useApp()
  const [form, setForm] = useState(task ? {
    title: task.title, priority: task.priority, dueDate: task.dueDate || '',
  } : { ...defaultForm })

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.title.trim()) return
    if (task) {
      dispatch({ type: 'UPDATE_TASK', payload: { id: task.id, ...form } })
    } else {
      dispatch({ type: 'ADD_TASK', payload: { projectId, ...form, completed: false } })
    }
    onClose()
  }

  const field = 'w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
  const label = 'block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5'

  return (
    <Modal title={task ? 'Edit Task' : 'New Task'} onClose={onClose} size="sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={label}>Task Title *</label>
          <input className={field} placeholder="What needs to be done?" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required autoFocus />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={label}>Priority</label>
            <select className={field} value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div>
            <label className={label}>Due Date</label>
            <input type="date" className={field} value={form.dueDate} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))} />
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="flex-1 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
            Cancel
          </button>
          <button type="submit" className="flex-1 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors">
            {task ? 'Save Changes' : 'Add Task'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
