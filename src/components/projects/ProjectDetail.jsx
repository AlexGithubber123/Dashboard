import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { StatusBadge, PriorityBadge } from '../ui/Badge'
import TaskItem from '../tasks/TaskItem'
import TaskModal from '../tasks/TaskModal'
import ProjectModal from './ProjectModal'
import { ArrowLeft, Plus, Pencil, Trash2, Calendar, Tag } from 'lucide-react'

export default function ProjectDetail() {
  const { state, dispatch } = useApp()
  const { selectedProjectId, tasks } = state
  const project = state.projects.find(p => p.id === selectedProjectId)

  const [showAddTask, setShowAddTask] = useState(false)
  const [showEditProject, setShowEditProject] = useState(false)
  const [taskFilter, setTaskFilter] = useState('all')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [notes, setNotes] = useState(project?.notes || '')
  const [notesEditing, setNotesEditing] = useState(false)

  if (!project) {
    return (
      <div className="p-6 text-center text-slate-400">
        Project not found.
        <button className="block mx-auto mt-4 text-blue-500" onClick={() => dispatch({ type: 'SET_VIEW', view: 'projects' })}>
          Back to Projects
        </button>
      </div>
    )
  }

  const projectTasks = tasks.filter(t => t.projectId === project.id)
  const completedTasks = projectTasks.filter(t => t.completed)
  const pct = projectTasks.length > 0 ? Math.round((completedTasks.length / projectTasks.length) * 100) : 0

  const filteredTasks = projectTasks.filter(t => {
    if (taskFilter === 'active') return !t.completed
    if (taskFilter === 'completed') return t.completed
    return true
  }).sort((a, b) => {
    if (a.completed && !b.completed) return 1
    if (!a.completed && b.completed) return -1
    const pa = { high: 0, medium: 1, low: 2 }
    return (pa[a.priority] ?? 1) - (pa[b.priority] ?? 1)
  })

  const now = new Date()
  const overdue = project.dueDate && new Date(project.dueDate) < now && project.status !== 'completed'

  function saveNotes() {
    dispatch({ type: 'UPDATE_PROJECT', payload: { id: project.id, notes } })
    setNotesEditing(false)
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Back */}
      <button
        onClick={() => dispatch({ type: 'SET_VIEW', view: 'projects' })}
        className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 mb-6 transition-colors"
      >
        <ArrowLeft size={16} />
        Back to Projects
      </button>

      {/* Project Header */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden mb-6">
        <div className="h-2" style={{ backgroundColor: project.color || '#3b82f6' }} />
        <div className="p-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-1">{project.name}</h1>
              {project.description && <p className="text-slate-500 dark:text-slate-400">{project.description}</p>}
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => setShowEditProject(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 text-sm transition-colors">
                <Pencil size={14} /> Edit
              </button>
              <button onClick={() => setShowDeleteConfirm(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-200 dark:border-red-700/50 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 text-sm transition-colors">
                <Trash2 size={14} />
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 mb-5">
            <StatusBadge status={project.status} />
            <PriorityBadge priority={project.priority} />
            {project.category && (
              <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                <Tag size={12} /> {project.category}
              </span>
            )}
            {project.dueDate && (
              <span className={`flex items-center gap-1 text-xs font-medium ${overdue ? 'text-red-500' : 'text-slate-500 dark:text-slate-400'}`}>
                <Calendar size={12} />
                {overdue ? 'Overdue · ' : 'Due '}
                {new Date(project.dueDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
            )}
          </div>

          {/* Progress */}
          {projectTasks.length > 0 && (
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-500 dark:text-slate-400">{completedTasks.length} of {projectTasks.length} tasks completed</span>
                <span className="font-semibold text-slate-700 dark:text-slate-200">{pct}%</span>
              </div>
              <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full">
                <div className="h-2 rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: project.color || '#3b82f6' }} />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tasks */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
              {['all', 'active', 'completed'].map(f => (
                <button
                  key={f}
                  onClick={() => setTaskFilter(f)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${taskFilter === f ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                  <span className="ml-1.5 text-slate-400">
                    {f === 'all' ? projectTasks.length : f === 'active' ? projectTasks.filter(t => !t.completed).length : completedTasks.length}
                  </span>
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowAddTask(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <Plus size={15} /> Add Task
            </button>
          </div>

          <div className="space-y-2">
            {filteredTasks.length === 0 && (
              <div className="py-10 text-center text-slate-400 dark:text-slate-500 text-sm">
                {taskFilter === 'all' ? 'No tasks yet. Add one to get started!' : `No ${taskFilter} tasks.`}
              </div>
            )}
            {filteredTasks.map(task => <TaskItem key={task.id} task={task} />)}
          </div>
        </div>

        {/* Notes sidebar */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-5 h-fit">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-slate-700 dark:text-slate-200 text-sm">Notes</h3>
            {!notesEditing && (
              <button onClick={() => { setNotes(project.notes || ''); setNotesEditing(true) }} className="text-xs text-blue-500 hover:text-blue-600">Edit</button>
            )}
          </div>
          {notesEditing ? (
            <div className="space-y-2">
              <textarea
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-32 resize-none"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Add notes about this project..."
                autoFocus
              />
              <div className="flex gap-2">
                <button onClick={() => setNotesEditing(false)} className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-600 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">Cancel</button>
                <button onClick={saveNotes} className="flex-1 px-3 py-1.5 text-xs rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors">Save</button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-500 dark:text-slate-400 whitespace-pre-wrap">
              {project.notes || <span className="italic text-slate-300 dark:text-slate-600">No notes yet. Click Edit to add some.</span>}
            </p>
          )}
        </div>
      </div>

      {/* Delete confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowDeleteConfirm(false)} />
          <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-6 max-w-sm w-full">
            <h3 className="font-semibold text-slate-800 dark:text-white mb-2">Delete Project?</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
              This will permanently delete <strong>{project.name}</strong> and all its tasks. This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">Cancel</button>
              <button onClick={() => dispatch({ type: 'DELETE_PROJECT', id: project.id })} className="flex-1 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}

      {showAddTask && <TaskModal projectId={project.id} onClose={() => setShowAddTask(false)} />}
      {showEditProject && <ProjectModal project={project} onClose={() => setShowEditProject(false)} />}
    </div>
  )
}
