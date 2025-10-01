import { useCurrentUser } from '@/hooks/useAuth'
import { useAuthStore } from '@/store/authStore'
import { useEffect } from 'react'

export function AuthInitializer() {
  const { setUser } = useAuthStore()
  const { data: user, isError } = useCurrentUser()

  useEffect(() => {
    if (user) {
      setUser(user)
    } else if (isError) {
      // User not authenticated or token expired
      setUser(null)
    }
  }, [user, isError, setUser])

  return null
}
