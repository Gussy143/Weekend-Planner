import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { PublicView } from './routes/PublicView'
import { AdminLogin } from './routes/AdminLogin'
import { AdminDashboard } from './routes/AdminDashboard'
import { EventCreate } from './routes/EventCreate'
import { EventEdit } from './routes/EventEdit'
import { useThemeStore, COLOR_THEMES } from './store/useThemeStore'
import './styles/tokens.css'
import './styles/global.css'

// 컬러 테마별 CSS 변수 생성 헬퍼
function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return { r, g, b }
}

function lighten(hex: string, amount: number) {
  const { r, g, b } = hexToRgb(hex)
  return `rgb(${Math.min(255, r + amount)}, ${Math.min(255, g + amount)}, ${Math.min(255, b + amount)})`
}

function applyColorTheme(primary: string, accent: string) {
  const root = document.documentElement
  const { r, g, b } = hexToRgb(primary)
  root.style.setProperty('--brand-blue', primary)
  root.style.setProperty('--brand-blue-deep', accent)
  root.style.setProperty('--brand-blue-light', lighten(primary, 44))
  root.style.setProperty('--brand-blue-muted', `rgba(${r}, ${g}, ${b}, 0.18)`)
  root.style.setProperty('--ios-blue', accent)
  root.style.setProperty('--ios-blue-tint', `rgba(${r}, ${g}, ${b}, 0.15)`)
  root.style.setProperty('--ios-fill-primary', `rgba(${r}, ${g}, ${b}, 0.18)`)
}

const App: React.FC = () => {
  const theme = useThemeStore(state => state.theme)
  const initSystemTheme = useThemeStore(state => state.initSystemTheme)
  const colorTheme = useThemeStore(state => state.colorTheme)
  const customColors = useThemeStore(state => state.customColors)

  // Apply theme to document root
  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  // Apply color theme
  React.useEffect(() => {
    if (colorTheme === 'custom') {
      applyColorTheme(customColors.primary, customColors.accent)
    } else {
      const ct = COLOR_THEMES[colorTheme]
      applyColorTheme(ct.primary, ct.accent)
    }
  }, [colorTheme, customColors])

  // Listen for system theme changes
  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => initSystemTheme()
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [initSystemTheme])

  return (
    <BrowserRouter basename="/">
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
