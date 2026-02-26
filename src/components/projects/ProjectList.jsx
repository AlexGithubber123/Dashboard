import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { Plus, Search, Grid, List } from 'lucide-react'
import { StatusBadge, PriorityBadge } from '../ui/Badge'
import ProjectModal from './ProjectModal'

export default function ProjectList() {
  const { state, dispatch } = useApp()
  const { projects, tasks } = state
  const [showModal, setShowModal] = useState(false)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterPriority, setFilterPriority] = useState('all')
  const [viewMode, setViewMode] = useState('grid')

  const filtered = projects.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                        p.description.toLowerCase().includes(search.toLowerCase()) ||
                        (p.category && p.category.toLowerCase().includes(search.toLowerCase()))
    const matchStatus = filterStatus === 'all' || p.status === filterStatus
    const matchPriority = filterPriority === 'all' || p.priority === filterPriority
    return matchSearch && matchStatus && matchPriority
  })

  function getProgress(projectId) {
    const pt = tasks.filter(t => t.projectId === projectId)
    if (pt.length === 0) return null
    return { done: pt.filter(t => t.completed).length, total: pt.length }
  }

  const selectClass = 'px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Projects</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">{projects.length} project{projects.length !== 1 ? 's' : ''} total</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors shadow-sm"
        >
          <Plus size={16} />
          New Project
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search projects..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select className={selectClass} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="all">All Statuses</option>
          <option value="planning">Planning</option>
          <option value="active">Active</option>
          <option value="on-hold">On Hold</option>
          <option value="completed">Completed</option>
        </select>
        <select className={selectClass} value={filterPriority} onChange={e => setFilterPriority(e.target.value)}>
          <option value="all">All Priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <div className="flex rounded-lg border border-slate-200 dark:border-slate-600 overflow-hidden">
          <button onClick={() => setViewMode('grid')} className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600' : 'bg-white dark:bg-slate-800 text-slate-400 hover:text-slate-600'}`}><Grid size={16} /></button>
          <button onClick={() => setViewMode('list')} className={`px-3 py-2 ${viewMode === 'list' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600' : 'bg-white dark:bg-slate-800 text-slate-400 hover:text-slate-600'}`}><List size={16} /></button>
        </div>
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-4">
            <span className="text-3xl">📁</span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-medium">No projects found</p>
          <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">Try adjusting your filters or create a new project.</p>
        </div>
      )}

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(project => (
            <ProjectCard key={project.id} project={project} progress={getProgress(project.id)} />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(project => (
            <ProjectRow key={project.id} project={project} progress={getProgress(project.id)} />
          ))}
        </div>
      )}

      {showModal && <ProjectModal onClose={() => setShowModal(false)} />}
    </div>
  )
}

function ProjectCard({ project, progress }) {
  const { dispatch } = useApp()
  const [showMenu, setShowMenu] = useState(false)
  const [showEdit, setShowEdit] = useState(false)

  const pct = progress ? Math.round((progress.done / progress.total) * 100) : 0
  const now = new Date()
  const overdue = project.dueDate && new Date(project.dueDate) < now && project.status !== 'completed'

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-shadow">
      <div className="h-1.5 rounded-t-2xl" style={{ backgroundColor: project.color || '#3b82f6' }} />
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0 pr-2">
            <h3 className="font-semibold text-slate-800 dark:text-slate-100 truncate">{project.name}</h3>
            {project.category && <p className="text-xs text-slate-400 mt-0.5">{project.category}</p>}
          </div>
          <div className="relative">
            <button onClick={() => setShowMenu(m => !m)} className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 text-lg leading-none">⋯</button>
            {showMenu && (
              <div className="absolute right-0 top-8 w-36 bg-white dark:bg-slate-700 rounded-xl shadow-lg border border-slate-100 dark:border-slate-600 z-20 overflow-hidden">
                <button onClick={() => { setShowEdit(true); setShowMenu(false) }} className="w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600">Edit</button>
                <button onClick={() => { dispatch({ type: 'SET_VIEW', view: 'project-detail', projectId: project.id }); setShowMenu(false) }} className="w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600">Open</button>
                <button onClick={() => { dispatch({ type: 'DELETE_PROJECT', id: project.id }); setShowMenu(false) }} className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">Delete</button>
              </div>
            )}
          </div>
        </div>

        {project.description && (
          <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-4">{project.description}</p>
        )}

        <div className="flex flex-wrap gap-2 mb-4">
          <StatusBadge status={project.status} />
          <PriorityBadge priority={project.priority} />
        </div>

        {progress !== null && (
          <div className="mb-4">
            <div className="flex justify-between text-xs text-slate-400 mb-1.5">
              <span>{progress.done}/{progress.total} tasks</span>
              <span>{pct}%</span>
            </div>
            <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full">
              <div className="h-1.5 rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: project.color || '#3b82f6' }} />
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          {project.dueDate ? (
            <span className={`text-xs font-medium ${overdue ? 'text-red-500' : 'text-slate-400 dark:text-slate-500'}`}>
              {overdue ? '⚠ ' : ''}Due {new Date(project.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          ) : <span />}
          <button
            onClick={() => dispatch({ type: 'SET_VIEW', view: 'project-detail', projectId: project.id })}
            className="text-xs font-medium text-blue-500 hover:text-blue-600"
          >
            Open →
          </button>
        </div>
      </div>
      {showEdit && <ProjectModal project={project} onClose={() => setShowEdit(false)} />}
    </div>
  )
}

function ProjectRow({ project, progress }) {
  const { dispatch } = useApp()
  const [showEdit, setShowEdit] = useState(false)
  const pct = progress ? Math.round((progress.done / progress.total) * 100) : 0
  const now = new Date()
  const overdue = project.dueDate && new Date(project.dueDate) < now && project.status !== 'completed'

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 px-5 py-4 flex items-center gap-4">
      <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: project.color || '#3b82f6' }} />
      <div className="flex-1 min-w-0">
        <p className="font-medium text-slate-800 dark:text-slate-100 truncate">{project.name}</p>
        {project.category && <p className="text-xs text-slate-400">{project.category}</p>}
      </div>
      <StatusBadge status={project.status} />
      <PriorityBadge priority={project.priority} />
      {progress !== null ? (
        <div className="w-24 hidden sm:block">
          <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full">
            <div className="h-1.5 rounded-full" style={{ width: `${pct}%`, backgroundColor: project.color || '#3b82f6' }} />
          </div>
          <p className="text-xs text-slate-400 text-right mt-0.5">{pct}%</p>
        </div>
      ) : <div className="w-24 hidden sm:block" />}
      {project.dueDate && (
        <span className={`text-xs hidden md:block flex-shrink-0 ${overdue ? 'text-red-500 font-semibold' : 'text-slate-400'}`}>
          {new Date(project.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
      )}
      <div className="flex gap-1">
        <button onClick={() => setShowEdit(true)} className="px-2.5 py-1.5 rounded-lg text-xs text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">Edit</button>
        <button onClick={() => dispatch({ type: 'SET_VIEW', view: 'project-detail', projectId: project.id })} className="px-2.5 py-1.5 rounded-lg text-xs text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">Open</button>
      </div>
      {showEdit && <ProjectModal project={project} onClose={() => setShowEdit(false)} />}
    </div>
  )
}
