import {
  authApi,
  type LoginCredentials,
  type LoginResponse,
} from '@/lib/api/auth'
import { getApiError } from '@/lib/utils/getApiError'
import { useAuthStore, type User } from '@/store/authStore'
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

      // Get user data after successful login
      const user = await authApi.getCurrentUser()

      return response
    },
    onSuccess: response => {
      // Get user data after successful login
      authApi.getCurrentUser().then(user => {
        // Store user and token in Zustand store
        login(user, response.token)

        // Navigate to protected routes
        router.replace('/(tabs)')
      })
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

export function useCurrentUser() {
  return useQuery<User, Error>({
    queryKey: ['currentUser'],
    queryFn: () => authApi.getCurrentUser(),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
