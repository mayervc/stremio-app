import { useCurrentUser } from '@/hooks/use-auth-mutations'
import { useAuthStore } from '@/store/authStore'
import { useEffect } from 'react'

export function AuthInitializer() {
  const { setUser, setLoading } = useAuthStore()
  const { data: user, isLoading, isError } = useCurrentUser()

  useEffect(() => {
    setLoading(isLoading)

    if (user) {
      setUser(user)
    } else if (isError) {
      // User not authenticated or token expired
      setUser(null)
    }
  }, [user, isLoading, isError, setUser, setLoading])

  return null
}
