import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type ThemeMode = 'light' | 'dark' | 'system'

export type ColorTheme = 'ocean' | 'sunset' | 'forest' | 'lavender' | 'custom'

export interface CustomColors {
  primary: string
  accent: string
  bg: string
}

interface ThemeStore {
  mode: ThemeMode
  theme: 'light' | 'dark' // resolved theme
  colorTheme: ColorTheme
  customColors: CustomColors
  setMode: (mode: ThemeMode) => void
  toggleTheme: () => void
  initSystemTheme: () => void
  setColorTheme: (colorTheme: ColorTheme) => void
  setCustomColors: (colors: CustomColors) => void
}

const getSystemTheme = (): 'light' | 'dark' =>
  window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'

export const COLOR_THEMES: Record<Exclude<ColorTheme, 'custom'>, { name: string; emoji: string; primary: string; accent: string }> = {
  ocean: { name: '오션 블루', emoji: '🌊', primary: '#97c2ec', accent: '#6fa8de' },
  sunset: { name: '선셋 코랄', emoji: '🌅', primary: '#f4a886', accent: '#e8856b' },
  forest: { name: '포레스트 그린', emoji: '🌿', primary: '#8bc6a5', accent: '#6aab8a' },
  lavender: { name: '라벤더 퍼플', emoji: '💜', primary: '#b8a9d4', accent: '#9b88bf' },
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      mode: 'system',
      theme: getSystemTheme(),
      colorTheme: 'ocean' as ColorTheme,
      customColors: { primary: '#97c2ec', accent: '#6fa8de', bg: '#f5f3ef' },

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

      setColorTheme: (colorTheme: ColorTheme) => {
        set({ colorTheme })
      },

      setCustomColors: (colors: CustomColors) => {
        set({ customColors: colors, colorTheme: 'custom' })
      },
    }),
    {
      name: 'theme-storage',
      partialize: state => ({
        mode: state.mode,
        colorTheme: state.colorTheme,
        customColors: state.customColors,
      }),
      onRehydrateStorage: () => state => {
        if (state) {
          state.theme = state.mode === 'system' ? getSystemTheme() : state.mode
        }
      },
    }
  )
)
