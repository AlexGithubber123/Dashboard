import { createContext, useContext, useReducer, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'

const AppContext = createContext(null)

const STORAGE_KEY = 'dashboard_data'

const initialState = {
  projects: [],
  tasks: [],
  darkMode: false,
  activeView: 'dashboard',
  selectedProjectId: null,
}

const sampleData = {
  projects: [
    {
      id: uuidv4(),
      name: 'Website Redesign',
      description: 'Full redesign of the company website with new branding and improved UX.',
      status: 'active',
      priority: 'high',
      category: 'Design',
      color: '#3b82f6',
      dueDate: '2026-03-15',
      notes: 'Focus on mobile-first approach. Check with marketing for brand guidelines.',
      createdAt: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      name: 'API Integration',
      description: 'Integrate third-party payment and shipping APIs into the platform.',
      status: 'planning',
      priority: 'medium',
      category: 'Development',
      color: '#8b5cf6',
      dueDate: '2026-04-01',
      notes: '',
      createdAt: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      name: 'Q1 Marketing Campaign',
      description: 'Social media and email campaign for Q1 product launch.',
      status: 'completed',
      priority: 'medium',
      category: 'Marketing',
      color: '#10b981',
      dueDate: '2026-02-01',
      notes: 'Completed ahead of schedule.',
      createdAt: new Date().toISOString(),
    },
  ],
  tasks: [],
}

// Add sample tasks after project ids are known
function buildSampleTasks(projects) {
  if (projects.length === 0) return []
  return [
    { id: uuidv4(), projectId: projects[0].id, title: 'Create wireframes', completed: true, priority: 'high', dueDate: '2026-02-20', createdAt: new Date().toISOString() },
    { id: uuidv4(), projectId: projects[0].id, title: 'Design mockups in Figma', completed: false, priority: 'high', dueDate: '2026-03-01', createdAt: new Date().toISOString() },
    { id: uuidv4(), projectId: projects[0].id, title: 'Review with stakeholders', completed: false, priority: 'medium', dueDate: '2026-03-08', createdAt: new Date().toISOString() },
    { id: uuidv4(), projectId: projects[1].id, title: 'Research payment providers', completed: false, priority: 'high', dueDate: '2026-03-10', createdAt: new Date().toISOString() },
    { id: uuidv4(), projectId: projects[1].id, title: 'Write API spec document', completed: false, priority: 'medium', dueDate: '2026-03-20', createdAt: new Date().toISOString() },
    { id: uuidv4(), projectId: projects[2].id, title: 'Draft email copy', completed: true, priority: 'medium', dueDate: '2026-01-15', createdAt: new Date().toISOString() },
    { id: uuidv4(), projectId: projects[2].id, title: 'Schedule social posts', completed: true, priority: 'low', dueDate: '2026-01-20', createdAt: new Date().toISOString() },
  ]
}

function reducer(state, action) {
  switch (action.type) {
    case 'LOAD':
      return { ...state, ...action.payload }

    case 'SET_VIEW':
      return { ...state, activeView: action.view, selectedProjectId: action.projectId ?? state.selectedProjectId }

    case 'TOGGLE_DARK':
      return { ...state, darkMode: !state.darkMode }

    case 'ADD_PROJECT': {
      const project = { id: uuidv4(), ...action.payload, createdAt: new Date().toISOString() }
      return { ...state, projects: [project, ...state.projects] }
    }
    case 'UPDATE_PROJECT':
      return { ...state, projects: state.projects.map(p => p.id === action.payload.id ? { ...p, ...action.payload } : p) }

    case 'DELETE_PROJECT':
      return {
        ...state,
        projects: state.projects.filter(p => p.id !== action.id),
        tasks: state.tasks.filter(t => t.projectId !== action.id),
        activeView: 'projects',
        selectedProjectId: null,
      }

    case 'ADD_TASK': {
      const task = { id: uuidv4(), ...action.payload, createdAt: new Date().toISOString() }
      return { ...state, tasks: [...state.tasks, task] }
    }
    case 'UPDATE_TASK':
      return { ...state, tasks: state.tasks.map(t => t.id === action.payload.id ? { ...t, ...action.payload } : t) }

    case 'DELETE_TASK':
      return { ...state, tasks: state.tasks.filter(t => t.id !== action.id) }

    case 'TOGGLE_TASK':
      return { ...state, tasks: state.tasks.map(t => t.id === action.id ? { ...t, completed: !t.completed } : t) }

    default:
      return state
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        dispatch({ type: 'LOAD', payload: parsed })
      } catch {}
    } else {
      // Load sample data on first run
      const tasks = buildSampleTasks(sampleData.projects)
      dispatch({ type: 'LOAD', payload: { ...sampleData, tasks } })
    }
  }, [])

  // Save to localStorage whenever state changes
  useEffect(() => {
    const { activeView, selectedProjectId, ...toSave } = state
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave))
  }, [state])

  // Apply dark mode class to <html>
  useEffect(() => {
    if (state.darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [state.darkMode])

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  return useContext(AppContext)
}
