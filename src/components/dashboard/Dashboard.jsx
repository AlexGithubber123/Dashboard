import { useApp } from '../../context/AppContext'
import { CheckSquare, FolderKanban, TrendingUp, AlertCircle, Clock } from 'lucide-react'
import { StatusBadge, PriorityBadge } from '../ui/Badge'

function StatCard({ label, value, icon: Icon, color, sub }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
          <Icon size={20} className="text-white" />
        </div>
      </div>
      <p className="text-3xl font-bold text-slate-800 dark:text-white mb-1">{value}</p>
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
      {sub && <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{sub}</p>}
    </div>
  )
}

export default function Dashboard() {
  const { state, dispatch } = useApp()
  const { projects, tasks } = state

  const now = new Date()
  const activeProjects = projects.filter(p => p.status === 'active')
  const overdueProjects = projects.filter(p => p.dueDate && new Date(p.dueDate) < now && p.status !== 'completed')
  const totalTasks = tasks.length
  const completedTasks = tasks.filter(t => t.completed).length

  const upcoming = projects
    .filter(p => p.dueDate && p.status !== 'completed')
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5)

  const recentProjects = [...projects]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)

  function daysUntil(dateStr) {
    const diff = Math.ceil((new Date(dateStr) - now) / (1000 * 60 * 60 * 24))
    if (diff < 0) return `${Math.abs(diff)}d overdue`
    if (diff === 0) return 'Due today'
    return `${diff}d left`
  }

  function daysUntilColor(dateStr) {
    const diff = Math.ceil((new Date(dateStr) - now) / (1000 * 60 * 60 * 24))
    if (diff < 0) return 'text-red-500'
    if (diff <= 3) return 'text-orange-500'
    return 'text-slate-400 dark:text-slate-500'
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Dashboard</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Here's what's happening with your projects.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Projects" value={projects.length} icon={FolderKanban} color="bg-blue-500" />
        <StatCard label="Active Projects" value={activeProjects.length} icon={TrendingUp} color="bg-violet-500" />
        <StatCard
          label="Tasks Complete"
          value={`${completedTasks}/${totalTasks}`}
          icon={CheckSquare}
          color="bg-emerald-500"
          sub={totalTasks > 0 ? `${Math.round((completedTasks / totalTasks) * 100)}% done` : null}
        />
        <StatCard label="Overdue" value={overdueProjects.length} icon={AlertCircle} color={overdueProjects.length > 0 ? 'bg-red-500' : 'bg-slate-400'} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-700">
            <h2 className="font-semibold text-slate-800 dark:text-white">Recent Projects</h2>
            <button
              onClick={() => dispatch({ type: 'SET_VIEW', view: 'projects' })}
              className="text-sm text-blue-500 hover:text-blue-600 font-medium"
            >
              View all
            </button>
          </div>
          <div className="divide-y divide-slate-50 dark:divide-slate-700/50">
            {recentProjects.length === 0 && (
              <p className="px-5 py-6 text-slate-400 text-sm text-center">No projects yet.</p>
            )}
            {recentProjects.map(project => {
              const projectTasks = tasks.filter(t => t.projectId === project.id)
              const done = projectTasks.filter(t => t.completed).length
              const pct = projectTasks.length > 0 ? Math.round((done / projectTasks.length) * 100) : 0
              return (
                <button
                  key={project.id}
                  onClick={() => dispatch({ type: 'SET_VIEW', view: 'project-detail', projectId: project.id })}
                  className="w-full flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors text-left"
                >
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: project.color || '#3b82f6' }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-100 truncate">{project.name}</p>
                    {projectTasks.length > 0 && (
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 h-1 bg-slate-100 dark:bg-slate-700 rounded-full max-w-24">
                          <div className="h-1 rounded-full bg-blue-500" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-xs text-slate-400">{pct}%</span>
                      </div>
                    )}
                  </div>
                  <StatusBadge status={project.status} />
                </button>
              )
            })}
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-100 dark:border-slate-700">
            <Clock size={18} className="text-slate-400" />
            <h2 className="font-semibold text-slate-800 dark:text-white">Upcoming Deadlines</h2>
          </div>
          <div className="divide-y divide-slate-50 dark:divide-slate-700/50">
            {upcoming.length === 0 && (
              <p className="px-5 py-6 text-slate-400 text-sm text-center">No upcoming deadlines.</p>
            )}
            {upcoming.map(project => (
              <button
                key={project.id}
                onClick={() => dispatch({ type: 'SET_VIEW', view: 'project-detail', projectId: project.id })}
                className="w-full flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors text-left"
              >
                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: project.color || '#3b82f6' }} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-100 truncate">{project.name}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{project.category}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`text-xs font-semibold ${daysUntilColor(project.dueDate)}`}>
                    {daysUntil(project.dueDate)}
                  </span>
                  <PriorityBadge priority={project.priority} />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
