import { useAuthStore } from '@/store/authStore'
import { useOnboardingStore } from '@/store/onboardingStore'
import { router, useSegments } from 'expo-router'
import { useEffect } from 'react'

export function OnboardingGuard() {
  const { isAuthenticated } = useAuthStore()
  const { hasSeenOnboarding, isCompleted, currentStep, selectedGenres } =
    useOnboardingStore()
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
      isCompleted,
      'selectedGenres:',
      selectedGenres
    )

    const currentSegment = segments[0] as string | undefined

    // Don't interfere if we're on the splash screen or signup-success
    if (currentSegment === 'splash' || currentSegment === 'signup-success') {
      console.log(
        `OnboardingGuard - On ${currentSegment} screen, skipping guard logic`
      )
      return
    }

    // If user is authenticated, let the authenticated stack handle navigation
    if (isAuthenticated) {
      console.log('OnboardingGuard - User authenticated, skipping guard logic')
      return
    }

    // Add a small delay to prevent immediate navigation conflicts
    const timeoutId = setTimeout(() => {
      console.log('OnboardingGuard - Executing navigation logic')

      // If user is not authenticated, handle onboarding flow
      if (!hasSeenOnboarding) {
        if (currentSegment !== 'onboarding-start') {
          router.replace('/onboarding-start')
        }
        return
      }

      // If user has seen onboarding but hasn't completed it, resume from current step
      if (hasSeenOnboarding && !isCompleted) {
        if (currentStep === 1) {
          if (currentSegment !== 'onboarding-start') {
            router.replace('/onboarding-start')
          }
        } else if (currentStep === 2) {
          if (currentSegment !== 'onboarding-pick-genres') {
            router.replace('/onboarding-pick-genres')
          }
        }
        return
      }

      // If user has completed onboarding but is not authenticated, go to signup
      if (hasSeenOnboarding && isCompleted && !isAuthenticated) {
        // Only redirect to signup if we're not already on signup or login
        if (
          currentSegment !== 'signup' &&
          currentSegment !== 'login' &&
          currentSegment !== 'onboarding-start' &&
          currentSegment !== 'onboarding-pick-genres'
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
    selectedGenres,
    segments[0],
  ])

  return null
}
