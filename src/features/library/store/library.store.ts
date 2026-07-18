import { create } from 'zustand'
import type { Platform } from '@/shared/api/schemas'

interface LibraryState {
  filter: Platform | 'all'
  setFilter: (f: Platform | 'all') => void
  searchQuery: string
  setSearchQuery: (q: string) => void
}

export const useLibraryStore = create<LibraryState>((set) => ({
  filter: 'all',
  setFilter: (f) => set({ filter: f }),
  searchQuery: '',
  setSearchQuery: (q) => set({ searchQuery: q }),
}))
