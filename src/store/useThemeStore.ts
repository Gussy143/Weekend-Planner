import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type ThemeMode = 'light' | 'dark' | 'system'

interface ThemeStore {
  mode: ThemeMode
  theme: 'light' | 'dark' // resolved theme
  setMode: (mode: ThemeMode) => void
  toggleTheme: () => void
  initSystemTheme: () => void
}

const getSystemTheme = (): 'light' | 'dark' =>
  window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      mode: 'system',
      theme: getSystemTheme(),

      setMode: mode => {
        const theme = mode === 'system' ? getSystemTheme() : mode
        set({ mode, theme })
      },

      toggleTheme: () => {
        const { mode } = get()
        const next: ThemeMode =
          mode === 'system' ? 'dark' : mode === 'dark' ? 'light' : 'system'
        const theme = next === 'system' ? getSystemTheme() : next
        set({ mode: next, theme })
      },

      initSystemTheme: () => {
        const { mode } = get()
        if (mode === 'system') {
          set({ theme: getSystemTheme() })
        }
      },
    }),
    {
      name: 'theme-storage',
      partialize: state => ({
        mode: state.mode,
      }),
      onRehydrateStorage: () => state => {
        if (state) {
          state.theme = state.mode === 'system' ? getSystemTheme() : state.mode
        }
      },
    }
  )
)
