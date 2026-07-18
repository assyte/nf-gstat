import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AppState {
  language: string
  setLanguage: (lang: string) => void
  sidebarCollapsed: boolean
  toggleSidebar: () => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      language: 'tr',
      setLanguage: (lang) => set({ language: lang }),
      sidebarCollapsed: false,
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
    }),
    {
      name: 'gstat-app',
    }
  )
)
