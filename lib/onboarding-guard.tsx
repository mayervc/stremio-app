import { useAuthStore } from '@/store/authStore'
import { useOnboardingStore } from '@/store/onboardingStore'
import { router, useSegments } from 'expo-router'
import { useEffect } from 'react'

export function OnboardingGuard() {
  const { isAuthenticated } = useAuthStore()
  const { hasSeenOnboarding, isCompleted, currentStep } = useOnboardingStore()
  const segments = useSegments()

  useEffect(() => {
    console.log(
      'OnboardingGuard - segments:',
      segments,
      'isAuthenticated:',
      isAuthenticated,
      'hasSeenOnboarding:',
      hasSeenOnboarding,
      'isCompleted:',
      isCompleted
    )

    // Don't interfere if we're on the splash screen
    if (segments[0] === 'splash') {
      console.log('OnboardingGuard - On splash screen, skipping')
      return
    }

    // Don't interfere if user has completed onboarding and is on auth screens
    if (
      hasSeenOnboarding &&
      isCompleted &&
      !isAuthenticated &&
      (segments[0] === 'signup' || segments[0] === 'login')
    ) {
      console.log(
        'OnboardingGuard - User completed onboarding, staying on auth screen'
      )
      return
    }

    // Add a small delay to prevent immediate navigation conflicts
    const timeoutId = setTimeout(() => {
      console.log('OnboardingGuard - Executing navigation logic')
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
      if (hasSeenOnboarding && isCompleted && !isAuthenticated) {
        // Only redirect to signup if we're not already on signup or login
        if (
          segments[0] !== 'signup' &&
          segments[0] !== 'login' &&
          segments[0] !== 'onboarding-start' &&
          segments[0] !== 'onboarding-pick-genres'
        ) {
          console.log('OnboardingGuard - Redirecting to signup')
          router.replace('/signup')
        }
        return
      }
    }, 100) // Reduced delay for faster navigation

    return () => clearTimeout(timeoutId)
  }, [
    isAuthenticated,
    hasSeenOnboarding,
    isCompleted,
    currentStep,
    segments[0],
  ])

  return null
}
