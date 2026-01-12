import { clearUserContext } from '@/lib/sentry'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export type User = {
  id: number
  firstName: string
  lastName: string
  email: string
  roleId: number
  phoneNumber?: string | null
  birthday?: string | null
  createdAt: string
  updatedAt: string
  role?: {
    id: number
    name: string
  }
  cinemas?: Array<{
    id: number
    name: string
  }>
}

type AuthState = {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null

  // Actions
  setUser: (user: User | null) => void
  setToken: (token: string | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  login: (user: User, token: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      setUser: user => set({ user, isAuthenticated: !!user }),
      setToken: token => set({ token }),
      setLoading: isLoading => set({ isLoading }),
      setError: error => set({ error }),

      login: (user, token) =>
        set({
          user,
          token,
          isAuthenticated: true,
          error: null,
        }),

      logout: () => {
        // Clear Sentry user context when logging out
        clearUserContext()
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        })
      },
    }),
    {
      name: 'auth-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: state => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
