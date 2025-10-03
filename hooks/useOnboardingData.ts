import { useAuthStore } from '@/store/authStore'
import { useOnboardingStore } from '@/store/onboardingStore'

/**
 * Hook to manage onboarding data persistence after user registration
 * This ensures that selected genres are preserved and can be sent to the backend
 * when the user completes registration
 */
export function useOnboardingData() {
  const { selectedGenres, isCompleted, reset } = useOnboardingStore()
  const { user } = useAuthStore()

  /**
   * Get the onboarding data that should be sent to the backend
   * This includes selected genres
   */
  const getOnboardingData = () => {
    return {
      selectedGenres,
      isCompleted,
    }
  }

  /**
   * Clear onboarding data after successful user registration
   * This should be called after the backend has successfully stored the preferences
   */
  const clearOnboardingData = () => {
    reset()
  }

  /**
   * Check if user has completed onboarding but hasn't registered yet
   */
  const hasPendingOnboardingData = () => {
    return isCompleted && !user && selectedGenres.length > 0
  }

  return {
    getOnboardingData,
    clearOnboardingData,
    hasPendingOnboardingData,
    selectedGenres,
    isCompleted,
  }
}
