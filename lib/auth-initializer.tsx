import { useCurrentUser } from '@/hooks/useAuth'
import {
  addBreadcrumb,
  clearUserContext,
  logError,
  setUserContext,
} from '@/lib/sentry'
import { useAuthStore } from '@/store/authStore'
import { useEffect } from 'react'

export function AuthInitializer() {
  const { setUser } = useAuthStore()
  const { data: user, isError, error } = useCurrentUser()

  useEffect(() => {
    if (user) {
      setUser(user)
      // Set user context in Sentry
      setUserContext({
        id: user.id.toString(),
        email: user.email,
        username: `${user.firstName} ${user.lastName}`,
      })
      addBreadcrumb({
        message: 'User authenticated',
        category: 'auth',
        level: 'info',
        data: { userId: user.id },
      })
    } else if (isError) {
      // User not authenticated or token expired
      setUser(null)
      clearUserContext()

      // Log auth error if it's not a 401 (expected when not logged in)
      if (error && (error as any)?.response?.status !== 401) {
        logError(error as Error, {
          context: 'AuthInitializer',
          action: 'get-current-user-failed',
        })
      }

      addBreadcrumb({
        message: 'User not authenticated',
        category: 'auth',
        level: 'info',
      })
    }
  }, [user, isError, error, setUser])

  return null
}
