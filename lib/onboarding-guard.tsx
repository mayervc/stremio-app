import { useAuthStore } from '@/store/authStore'
import { useOnboardingStore } from '@/store/onboardingStore'
import { router } from 'expo-router'
import { useEffect } from 'react'

export function OnboardingGuard() {
  const { isAuthenticated } = useAuthStore()
  const { hasSeenOnboarding, isCompleted, currentStep } = useOnboardingStore()

  useEffect(() => {
    // Add a small delay to prevent immediate navigation conflicts
    const timeoutId = setTimeout(() => {
      // If user is authenticated, they shouldn't see onboarding
      if (isAuthenticated) {
        return
      }

      // If user has never seen onboarding, start the flow
      if (!hasSeenOnboarding) {
        router.replace('/onboarding-start')
        return
      }

      // If user has seen onboarding but hasn't completed it, resume from current step
      if (hasSeenOnboarding && !isCompleted) {
        if (currentStep === 1) {
          router.replace('/onboarding-start')
        } else if (currentStep === 2) {
          router.replace('/onboarding-pick-genres')
        }
        return
      }

      // If user has completed onboarding, go to signup (not login)
      if (hasSeenOnboarding && isCompleted) {
        router.replace('/signup')
        return
      }
    }, 100) // Small delay to prevent conflicts

    return () => clearTimeout(timeoutId)
  }, [isAuthenticated, hasSeenOnboarding, isCompleted, currentStep])

  return null
}
