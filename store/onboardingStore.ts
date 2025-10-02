import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

type OnboardingState = {
  selectedMovies: number[]
  selectedGenres: number[]
  isCompleted: boolean

  // Actions
  setSelectedMovies: (movies: number[]) => void
  setSelectedGenres: (genres: number[]) => void
  setCompleted: (completed: boolean) => void
  reset: () => void
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    set => ({
      selectedMovies: [],
      selectedGenres: [],
      isCompleted: false,

      setSelectedMovies: selectedMovies => set({ selectedMovies }),
      setSelectedGenres: selectedGenres => set({ selectedGenres }),
      setCompleted: isCompleted => set({ isCompleted }),
      reset: () =>
        set({
          selectedMovies: [],
          selectedGenres: [],
          isCompleted: false,
        }),
    }),
    {
      name: 'onboarding-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: state => ({
        selectedMovies: state.selectedMovies,
        selectedGenres: state.selectedGenres,
        isCompleted: state.isCompleted,
      }),
    }
  )
)
