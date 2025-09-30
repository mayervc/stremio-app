import { authApi } from '@/lib/api/auth'
import { useAuthStore } from '@/store/authStore'
import { useEffect } from 'react'

export function AuthInitializer() {
  const { setUser, setToken, setLoading, setError } = useAuthStore()

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setLoading(true)

        // Try to get current user with stored token
        const user = await authApi.getCurrentUser()

        if (user) {
          setUser(user)
          setToken('stored') // Token is already stored and working
        }
      } catch (error) {
        // User not authenticated or token expired
        console.log('No valid authentication found')
        setUser(null)
        setToken(null)
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()
  }, [setUser, setToken, setLoading, setError])

  return null
}
