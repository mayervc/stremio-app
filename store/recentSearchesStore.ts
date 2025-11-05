import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export interface RecentSearch {
  id: number
  title: string
  image?: string
  subtitle?: string
}

type RecentSearchesState = {
  recentSearches: RecentSearch[]
  addRecentSearch: (movie: RecentSearch) => void
  removeRecentSearch: (id: number) => void
  clearRecentSearches: () => void
}

const MAX_RECENT_SEARCHES = 10

export const useRecentSearchesStore = create<RecentSearchesState>()(
  persist(
    set => ({
      recentSearches: [],
      addRecentSearch: movie =>
        set(state => {
          // Remove if already exists to bring to front
          const filteredSearches = state.recentSearches.filter(
            s => s.id !== movie.id
          )
          const newSearches = [movie, ...filteredSearches].slice(
            0,
            MAX_RECENT_SEARCHES
          )
          return { recentSearches: newSearches }
        }),
      removeRecentSearch: id =>
        set(state => ({
          recentSearches: state.recentSearches.filter(s => s.id !== id),
        })),
      clearRecentSearches: () => set({ recentSearches: [] }),
    }),
    {
      name: 'recent-searches-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
)
