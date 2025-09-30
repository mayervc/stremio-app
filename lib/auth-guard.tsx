import { tokenStorage } from '@/lib/api/auth'
import { useAuthStore } from '@/store/authStore'
import { Redirect } from 'expo-router'
import { useEffect, useState } from 'react'

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, setUser, setToken, setLoading } =
    useAuthStore()
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true)

        // Check if we have a stored token
        const token = await tokenStorage.getToken()

        if (token) {
          // Verify token is still valid by fetching user data
          const response = await fetch(
            `${process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:3000'}/api/users/me`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )

          if (response.ok) {
            const user = await response.json()
            setUser(user)
            setToken(token)
          } else {
            // Token invalid or expired, clear it
            await tokenStorage.removeToken()
            setUser(null)
            setToken(null)
          }
        }
      } catch (error) {
        console.error('AuthGuard error:', error)
        await tokenStorage.removeToken()
        setUser(null)
        setToken(null)
      } finally {
        setLoading(false)
        setIsReady(true)
      }
    }

    checkAuth()
  }, [setUser, setToken, setLoading])

  if (!isReady || isLoading) {
    return null // Or a loading spinner
  }

  if (!isAuthenticated) {
    return <Redirect href='/login' />
  }

  return <>{children}</>
}
