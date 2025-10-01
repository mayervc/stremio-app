import { authApi, type LoginCredentials } from '@/lib/api/auth'
import { useAuthStore } from '@/store/authStore'
import { useMutation, useQuery } from '@tanstack/react-query'
import { router } from 'expo-router'
import Toast from 'react-native-toast-message'

export function useLogin() {
  const { login, setLoading, setError } = useAuthStore()

  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      // Login API call
      const response = await authApi.login(credentials)

      // Get user data after successful login
      const user = await authApi.getCurrentUser()

      return { user, token: response.token }
    },
    onMutate: () => {
      setLoading(true)
      setError(null)
    },
    onSuccess: ({ user, token }) => {
      // Store user and token in Zustand store
      login(user, token)

      // Show success toast
      Toast.show({
        type: 'success',
        text1: 'Login Successful',
        text2: `Welcome back, ${user.firstName} ${user.lastName}!`,
      })

      // Navigate to protected routes
      router.replace('/(tabs)')
    },
    onError: (error: Error) => {
      const errorMessage = error.message || 'Login failed. Please try again.'
      setError(errorMessage)

      // Show error toast
      Toast.show({
        type: 'error',
        text1: 'Login Failed',
        text2: errorMessage,
      })
    },
    onSettled: () => {
      setLoading(false)
    },
  })
}

export function useCurrentUser() {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: () => authApi.getCurrentUser(),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
