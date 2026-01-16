import {
  AnalyticsEvents,
  logEvent,
  setUserId,
  setUserProperties,
} from '@/lib/analytics'
import {
  authApi,
  type LoginCredentials,
  type LoginResponse,
  type SignupCredentials,
  type SignupResponse,
} from '@/lib/api/auth'
import { addBreadcrumb, logError, setUserContext } from '@/lib/sentry'
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
      // Track login attempt
      await logEvent(AnalyticsEvents.LOGIN_ATTEMPT, {
        email: credentials.email,
      })

      // Login API call
      const response = await authApi.login(credentials)

      return response
    },
    onSuccess: async response => {
      try {
        // Get user data after successful login
        const user = await authApi.getCurrentUser()

        // Store user and token in Zustand store
        login(user, response.token)

        // Set user context in Sentry
        setUserContext({
          id: user.id.toString(),
          email: user.email,
          username: `${user.firstName} ${user.lastName}`,
        })

        // Set user ID and properties in Analytics
        await setUserId(user.id.toString())
        await setUserProperties({
          email: user.email,
          username: `${user.firstName} ${user.lastName}`,
        })

        // Track successful login
        await logEvent(AnalyticsEvents.LOGIN_SUCCESS, {
          user_id: user.id.toString(),
          email: user.email,
        })

        addBreadcrumb({
          message: 'User logged in successfully',
          category: 'auth',
          level: 'info',
          data: { userId: user.id },
        })

        // Navigate to protected routes
        router.replace('/(tabs)')
      } catch (error) {
        logError(error as Error, {
          context: 'useLogin',
          action: 'get-user-after-login',
        })
        throw error
      }
    },
    onError: async (error: Error) => {
      const errorMessage = getApiError(error)

      // Track failed login
      await logEvent(AnalyticsEvents.LOGIN_FAILED, {
        error_message: errorMessage,
      })

      // Log login error to Sentry
      logError(error, {
        context: 'useLogin',
        action: 'login-failed',
        errorMessage,
      })

      addBreadcrumb({
        message: 'Login failed',
        category: 'auth',
        level: 'error',
        data: { errorMessage },
      })

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
  const { setToken } = useAuthStore()

  return useMutation({
    mutationFn: async (
      credentials: SignupCredentials
    ): Promise<SignupResponse> => {
      // Track signup attempt
      await logEvent(AnalyticsEvents.SIGNUP_ATTEMPT, {
        email: credentials.email,
      })

      // Signup API call
      const response = await authApi.signup(credentials)

      return response
    },
    onSuccess: async response => {
      // Store auth token for subsequent requests but don't mark the user as fully authenticated yet
      setToken(response.token)

      // Track successful signup
      await logEvent(AnalyticsEvents.SIGNUP_SUCCESS, {
        email: response.user?.email || 'unknown',
      })

      addBreadcrumb({
        message: 'User signed up successfully',
        category: 'auth',
        level: 'info',
      })

      // Navigate to signup success screen
      router.replace('/signup-success')
    },
    onError: async (error: Error) => {
      const errorMessage = getApiError(error)

      // Track failed signup
      await logEvent(AnalyticsEvents.SIGNUP_FAILED, {
        error_message: errorMessage,
      })

      // Log signup error to Sentry
      logError(error, {
        context: 'useSignup',
        action: 'signup-failed',
        errorMessage,
      })

      addBreadcrumb({
        message: 'Signup failed',
        category: 'auth',
        level: 'error',
        data: { errorMessage },
      })

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
