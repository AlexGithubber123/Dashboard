import { useState } from 'react'
import { AppProvider, useApp } from './context/AppContext'
import Sidebar from './components/layout/Sidebar'
import Dashboard from './components/dashboard/Dashboard'
import ProjectList from './components/projects/ProjectList'
import ProjectDetail from './components/projects/ProjectDetail'
import { Menu } from 'lucide-react'

function AppContent() {
  const { state } = useApp()
  const { activeView } = state
  const [sidebarOpen, setSidebarOpen] = useState(false)

  function renderView() {
    switch (activeView) {
      case 'dashboard':      return <Dashboard />
      case 'projects':       return <ProjectList />
      case 'project-detail': return <ProjectDetail />
      default:               return <Dashboard />
    }
  }

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900">

      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar sidebarOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <header className="md:hidden flex items-center gap-3 px-4 py-3 bg-slate-900 border-b border-slate-700/50">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <Menu size={22} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-blue-500 flex items-center justify-center text-white font-bold text-xs">D</div>
            <span className="font-semibold text-white text-sm">Dashboard</span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          {renderView()}
        </main>
      </div>

    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  )
}
