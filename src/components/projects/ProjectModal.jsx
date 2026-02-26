import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import Modal from '../ui/Modal'

const COLORS = ['#3b82f6','#8b5cf6','#10b981','#f59e0b','#ef4444','#ec4899','#06b6d4','#84cc16']

const defaultForm = {
  name: '', description: '', status: 'planning', priority: 'medium',
  category: '', color: '#3b82f6', dueDate: '', notes: '',
}

export default function ProjectModal({ project, onClose }) {
  const { dispatch } = useApp()
  const [form, setForm] = useState(project ? {
    name: project.name, description: project.description, status: project.status,
    priority: project.priority, category: project.category, color: project.color,
    dueDate: project.dueDate, notes: project.notes,
  } : { ...defaultForm })

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.name.trim()) return
    if (project) {
      dispatch({ type: 'UPDATE_PROJECT', payload: { id: project.id, ...form } })
    } else {
      dispatch({ type: 'ADD_PROJECT', payload: form })
    }
    onClose()
  }

  const field = 'w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
  const label = 'block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5'

  return (
    <Modal title={project ? 'Edit Project' : 'New Project'} onClose={onClose} size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={label}>Project Name *</label>
          <input className={field} placeholder="e.g. Website Redesign" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
        </div>

        <div>
          <label className={label}>Description</label>
          <textarea className={field} rows={3} placeholder="What is this project about?" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={label}>Status</label>
            <select className={field} value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
              <option value="planning">Planning</option>
              <option value="active">Active</option>
              <option value="on-hold">On Hold</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div>
            <label className={label}>Priority</label>
            <select className={field} value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={label}>Category</label>
            <input className={field} placeholder="e.g. Development" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} />
          </div>
          <div>
            <label className={label}>Due Date</label>
            <input type="date" className={field} value={form.dueDate} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))} />
          </div>
        </div>

        <div>
          <label className={label}>Color</label>
          <div className="flex gap-2 flex-wrap">
            {COLORS.map(c => (
              <button
                key={c} type="button"
                onClick={() => setForm(f => ({ ...f, color: c }))}
                className="w-7 h-7 rounded-full transition-transform hover:scale-110 ring-offset-2 dark:ring-offset-slate-800"
                style={{ backgroundColor: c, outline: form.color === c ? `3px solid ${c}` : 'none', outlineOffset: '2px' }}
              />
            ))}
          </div>
        </div>

        <div>
          <label className={label}>Notes</label>
          <textarea className={field} rows={2} placeholder="Any notes or context..." value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
        </div>

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="flex-1 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
            Cancel
          </button>
          <button type="submit" className="flex-1 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors">
            {project ? 'Save Changes' : 'Create Project'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
