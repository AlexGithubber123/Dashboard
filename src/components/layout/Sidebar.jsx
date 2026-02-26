import { useApp } from '../../context/AppContext'
import {
  LayoutDashboard, FolderKanban, Moon, Sun, Plus
} from 'lucide-react'

const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'projects',  label: 'Projects',  icon: FolderKanban },
]

export default function Sidebar() {
  const { state, dispatch } = useApp()
  const { activeView, darkMode, projects } = state

  const activeCount = projects.filter(p => p.status === 'active').length
  const completedCount = projects.filter(p => p.status === 'completed').length

  return (
    <aside className="flex flex-col w-64 min-h-screen bg-slate-900 dark:bg-slate-950 text-slate-300">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center text-white font-bold text-sm">D</div>
          <span className="font-semibold text-white text-lg">Dashboard</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV.map(({ id, label, icon: Icon }) => {
          const active = activeView === id || (id === 'projects' && activeView === 'project-detail')
          return (
            <button
              key={id}
              onClick={() => dispatch({ type: 'SET_VIEW', view: id })}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                active
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Icon size={18} />
              {label}
            </button>
          )
        })}
      </nav>

      {/* Stats summary */}
      <div className="px-4 py-4 mx-3 mb-2 rounded-xl bg-slate-800/60">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Overview</p>
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">Total Projects</span>
            <span className="text-white font-semibold">{projects.length}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">Active</span>
            <span className="text-blue-400 font-semibold">{activeCount}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">Completed</span>
            <span className="text-green-400 font-semibold">{completedCount}</span>
          </div>
        </div>
      </div>

      {/* Dark mode + New Project */}
      <div className="px-3 py-4 border-t border-slate-700/50 space-y-2">
        <button
          onClick={() => dispatch({ type: 'SET_VIEW', view: 'projects' })}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors"
        >
          <Plus size={16} />
          New Project
        </button>
        <button
          onClick={() => dispatch({ type: 'TOGGLE_DARK' })}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-sm transition-colors"
        >
          {darkMode ? <Sun size={16} /> : <Moon size={16} />}
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>
    </aside>
  )
}
