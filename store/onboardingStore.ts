import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

type OnboardingState = {
  selectedMovies: number[]
  selectedGenres: number[]
  isCompleted: boolean
  currentStep: number
  hasSeenOnboarding: boolean

  // Actions
  setSelectedMovies: (movies: number[]) => void
  setSelectedGenres: (genres: number[]) => void
  setCompleted: (completed: boolean) => void
  setCurrentStep: (step: number) => void
  setHasSeenOnboarding: (hasSeen: boolean) => void
  reset: () => void
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    set => ({
      selectedMovies: [],
      selectedGenres: [],
      isCompleted: false,
      currentStep: 1,
      hasSeenOnboarding: false,

      setSelectedMovies: selectedMovies => set({ selectedMovies }),
      setSelectedGenres: selectedGenres => set({ selectedGenres }),
      setCompleted: isCompleted => set({ isCompleted }),
      setCurrentStep: currentStep => set({ currentStep }),
      setHasSeenOnboarding: hasSeenOnboarding => set({ hasSeenOnboarding }),
      reset: () =>
        set({
          selectedMovies: [],
          selectedGenres: [],
          isCompleted: false,
          currentStep: 1,
          hasSeenOnboarding: false,
        }),
    }),
    {
      name: 'onboarding-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: state => ({
        selectedMovies: state.selectedMovies,
        selectedGenres: state.selectedGenres,
        isCompleted: state.isCompleted,
        currentStep: state.currentStep,
        hasSeenOnboarding: state.hasSeenOnboarding,
      }),
    }
  )
)
