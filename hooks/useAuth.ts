import { useOnboardingData } from '@/hooks/useOnboardingData'
import {
  authApi,
  type LoginCredentials,
  type LoginResponse,
  type SignupCredentials,
  type SignupResponse,
} from '@/lib/api/auth'
import { getApiError } from '@/lib/utils/getApiError'
import { useAuthStore, type User } from '@/store/authStore'
import { useOnboardingStore } from '@/store/onboardingStore'
import { useMutation, useQuery } from '@tanstack/react-query'
import { router } from 'expo-router'
import Toast from 'react-native-toast-message'

export function useLogin() {
  const { login } = useAuthStore()

  return useMutation({
    mutationFn: async (
      credentials: LoginCredentials
    ): Promise<LoginResponse> => {
      // Login API call
      const response = await authApi.login(credentials)

      return response
    },
    onSuccess: async response => {
      // Get user data after successful login
      const user = await authApi.getCurrentUser()

      // Store user and token in Zustand store
      login(user, response.token)

      // Navigate to protected routes
      router.replace('/(tabs)')
    },
    onError: (error: Error) => {
      const errorMessage = getApiError(error)

      // Show error toast
      Toast.show({
        type: 'error',
        text1: 'Login Failed',
        text2: errorMessage,
      })
    },
  })
}

export function useSignup() {
  const { login } = useAuthStore()
  const { clearOnboardingData } = useOnboardingData()
  const { setCompleted } = useOnboardingStore()

  return useMutation({
    mutationFn: async (
      credentials: SignupCredentials
    ): Promise<SignupResponse> => {
      // Signup API call
      const response = await authApi.signup(credentials)

      return response
    },
    onSuccess: async response => {
      // Store user and token in Zustand store
      login(response.user, response.token)

      // Clear onboarding data but don't mark as completed yet
      // We'll mark it as completed after user finishes signup success screen
      clearOnboardingData()

      // Navigate to signup success screen
      router.replace('/signup-success')
    },
    onError: (error: Error) => {
      const errorMessage = getApiError(error)

      // Show error toast
      Toast.show({
        type: 'error',
        text1: 'Sign up Failed',
        text2: errorMessage,
      })
    },
  })
}

export function useCurrentUser() {
  return useQuery<User, Error>({
    queryKey: ['currentUser'],
    queryFn: () => authApi.getCurrentUser(),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
