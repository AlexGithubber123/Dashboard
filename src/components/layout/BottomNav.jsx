import { useApp } from '../../context/AppContext'
import { LayoutDashboard, FolderKanban, Sun, Moon } from 'lucide-react'

export default function BottomNav() {
  const { state, dispatch } = useApp()
  const { activeView, darkMode } = state

  const isActive = (id) =>
    activeView === id || (id === 'projects' && activeView === 'project-detail')

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-slate-900 dark:bg-slate-950 border-t border-slate-700/50 flex items-stretch">

      <button
        onClick={() => dispatch({ type: 'SET_VIEW', view: 'dashboard' })}
        className={`flex-1 flex flex-col items-center justify-center gap-1 py-3 text-xs font-medium transition-colors ${
          isActive('dashboard') ? 'text-blue-400' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <LayoutDashboard size={20} />
        <span>Dashboard</span>
      </button>

      <button
        onClick={() => dispatch({ type: 'SET_VIEW', view: 'projects' })}
        className={`flex-1 flex flex-col items-center justify-center gap-1 py-3 text-xs font-medium transition-colors ${
          isActive('projects') ? 'text-blue-400' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <FolderKanban size={20} />
        <span>Projects</span>
      </button>

      <button
        onClick={() => dispatch({ type: 'TOGGLE_DARK' })}
        className="flex-1 flex flex-col items-center justify-center gap-1 py-3 text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors"
      >
        {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        <span>{darkMode ? 'Light' : 'Dark'}</span>
      </button>

    </nav>
  )
}
