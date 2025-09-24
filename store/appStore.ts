import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export type ThemeOption = 'light' | 'dark' | 'system'

type AppState = {
  theme: ThemeOption
  setTheme: (theme: ThemeOption) => void
  toggleTheme: () => void
  // útil para saber cuándo terminó de hidratar el store desde el storage
  hydrated: boolean
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      theme: 'system',
      setTheme: theme => set({ theme }),
      toggleTheme: () => {
        const current = get().theme
        // si está en "system", alterna a "dark"; si no, alterna light/dark
        const next =
          current === 'system' ? 'dark' : current === 'dark' ? 'light' : 'dark'
        set({ theme: next })
      },
      hydrated: false,
    }),
    {
      name: 'stremio-app-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: state => ({ theme: state.theme }),
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.warn('Error rehydrating Zustand store', error)
        }
        // marca como hidratado
        if (state) {
          state.hydrated = true
        }
      },
    }
  )
)
