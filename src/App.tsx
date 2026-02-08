import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { PublicView } from './routes/PublicView'
import { AdminLogin } from './routes/AdminLogin'
import { AdminDashboard } from './routes/AdminDashboard'
import { EventCreate } from './routes/EventCreate'
import { EventEdit } from './routes/EventEdit'
import { useThemeStore } from './store/useThemeStore'
import './styles/tokens.css'
import './styles/global.css'

const App: React.FC = () => {
  const theme = useThemeStore(state => state.theme)
  const initSystemTheme = useThemeStore(state => state.initSystemTheme)

  // Apply theme to document root
  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  // Listen for system theme changes
  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => initSystemTheme()
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [initSystemTheme])

  return (
    <BrowserRouter basename="/Weekend-Planner/">
      <Routes>
        <Route path="/" element={<PublicView />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/event/create" element={<EventCreate />} />
        <Route path="/admin/event/edit/:id" element={<EventEdit />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
