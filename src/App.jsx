import { AppProvider, useApp } from './context/AppContext'
import Sidebar from './components/layout/Sidebar'
import Dashboard from './components/dashboard/Dashboard'
import ProjectList from './components/projects/ProjectList'
import ProjectDetail from './components/projects/ProjectDetail'

function AppContent() {
  const { state } = useApp()
  const { activeView } = state

  function renderView() {
    switch (activeView) {
      case 'dashboard':     return <Dashboard />
      case 'projects':      return <ProjectList />
      case 'project-detail': return <ProjectDetail />
      default:              return <Dashboard />
    }
  }

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        {renderView()}
      </main>
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
