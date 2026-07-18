import { create } from 'zustand'
import type { Platform } from '@/shared/api/schemas'

interface DashboardState {
  selectedPlatform: Platform | 'all'
  setSelectedPlatform: (p: Platform | 'all') => void
}

export const useDashboardStore = create<DashboardState>((set) => ({
  selectedPlatform: 'all',
  setSelectedPlatform: (p) => set({ selectedPlatform: p }),
}))
