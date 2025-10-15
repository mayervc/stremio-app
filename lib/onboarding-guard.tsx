import { useAuthStore } from '@/store/authStore'
import { useOnboardingStore } from '@/store/onboardingStore'
import { router, useSegments } from 'expo-router'
import { useEffect } from 'react'

export function OnboardingGuard() {
  const { isAuthenticated } = useAuthStore()
  const { hasSeenOnboarding, isCompleted, currentStep } = useOnboardingStore()
  const segments = useSegments()

  useEffect(() => {
    // Don't interfere if we're on the splash screen
    if (segments[0] === 'splash') {
      return
    }

    // Add a small delay to prevent immediate navigation conflicts
    const timeoutId = setTimeout(() => {
      // If user is authenticated, handle based on onboarding completion
      if (isAuthenticated) {
        if (isCompleted) {
          router.replace('/(tabs)')
        } else {
          router.replace('/signup-success')
        }
        return
      }

      // If user is not authenticated, handle onboarding flow
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

      // If user has completed onboarding but is not authenticated, go to signup
      if (hasSeenOnboarding && isCompleted) {
        router.replace('/signup')
        return
      }
    }, 500) // Increased delay to prevent conflicts with splash screen

    return () => clearTimeout(timeoutId)
  }, [isAuthenticated, hasSeenOnboarding, isCompleted, currentStep, segments])

  return null
}
