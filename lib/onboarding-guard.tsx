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

    // Don't interfere if we're on the splash screen
    if (segments[0] === 'splash') {
      console.log('OnboardingGuard - On splash screen, skipping')
      return
    }

    // Don't interfere if user is authenticated and on allowed routes (search, modal, etc)
    if (
      isAuthenticated &&
      isCompleted &&
      (segments[0] === 'search' ||
        segments[0] === 'modal' ||
        segments[0] === 'signup-success' ||
        segments[0] === '(tabs)')
    ) {
      console.log(
        `OnboardingGuard - User authenticated and on allowed route: ${segments[0]}, skipping`
      )
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

      // Special case: If user is on signup-success but hasn't selected genres, redirect to genre selection
      if (
        isAuthenticated &&
        segments[0] === 'signup-success' &&
        selectedGenres.length === 0
      ) {
        console.log(
          'OnboardingGuard - User on signup-success but no genres selected, redirecting to genre selection'
        )
        router.replace('/onboarding-pick-genres')
        return
      }

      // If user is authenticated, handle based on onboarding completion
      if (isAuthenticated) {
        console.log(
          'OnboardingGuard - User is authenticated, checking completion status'
        )
        if (isCompleted) {
          console.log(
            'OnboardingGuard - User completed onboarding, navigating to /(tabs)'
          )
          // Allowed routes that should not redirect to tabs
          const allowedRoutes = ['(tabs)', 'search', 'signup-success', 'modal']
          const currentRoute = segments[0]

          // Only navigate if we're not already on an allowed route
          if (!allowedRoutes.includes(currentRoute)) {
            console.log(
              `OnboardingGuard - User authenticated, redirecting to home from ${currentRoute}`
            )
            router.replace('/(tabs)')
          } else {
            console.log(
              `OnboardingGuard - Already on allowed route: ${currentRoute}, skipping navigation`
            )
          }
        } else {
          console.log(
            'OnboardingGuard - User not completed onboarding, checking if needs genre selection'
          )
          // Check if user needs to select genres first
          if (selectedGenres.length === 0) {
            console.log(
              'OnboardingGuard - No genres selected, navigating to genre selection'
            )
            router.replace('/onboarding-pick-genres')
          } else {
            console.log(
              'OnboardingGuard - Genres selected, navigating to /signup-success'
            )
            // Only navigate if we're not already on signup-success
            if (segments[0] !== 'signup-success') {
              router.replace('/signup-success')
            } else {
              console.log(
                'OnboardingGuard - Already on signup-success, skipping navigation'
              )
            }
          }
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
    selectedGenres,
    segments[0],
  ])

  return null
}
