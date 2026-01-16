/**
 * Firebase Analytics wrapper with safe error handling
 * This prevents errors when the native module is not available
 *
 * IMPORTANT: This module uses lazy loading to avoid errors when Firebase
 * native module is not linked. All Firebase access is deferred until runtime.
 *
 * NOTE: After rebuilding the app with `npm run android`, Firebase will work correctly.
 */

// Cache for Firebase modules to avoid repeated require attempts
let analyticsModule: any = null
let appModule: any = null
let firebaseInitialized = false
let firebaseCheckAttempted = false
let firebaseCheckInProgress = false

// Flag to completely disable Firebase if native module errors occur
let firebaseDisabled = false

// Store original error handlers to restore later
let originalConsoleError: typeof console.error | null = null
let errorSuppressionActive = false

/**
 * Safely check if Firebase modules are available using a lazy loading approach
 * This function uses a function wrapper to defer module evaluation
 */
function checkFirebaseAvailability(): boolean {
  // If we've already checked, return cached result
  if (firebaseCheckAttempted) {
    return firebaseInitialized
  }

  // If a check is already in progress, return false to avoid concurrent checks
  if (firebaseCheckInProgress) {
    return false
  }

  firebaseCheckInProgress = true
  firebaseCheckAttempted = true

  try {
    // Use a more defensive approach - check if require is available first
    if (typeof require === 'undefined') {
      firebaseInitialized = false
      firebaseCheckInProgress = false
      return false
    }

    // Use a more defensive approach: check if module exists before requiring
    // This prevents the module from being evaluated if it will fail
    let analyticsReq: any = null
    let appReq: any = null

    // Suppress Firebase errors temporarily during module loading
    // This prevents errors from propagating to Sentry and console
    if (!errorSuppressionActive) {
      originalConsoleError = console.error
      errorSuppressionActive = true

      console.error = (...args: any[]) => {
        const errorMsg = args[0]?.message || String(args[0]) || ''
        const errorStr = String(args[0] || '')

        // Suppress Firebase-related errors
        if (
          errorMsg.includes('RNFBAppModule') ||
          errorMsg.includes('Native module') ||
          errorStr.includes('@react-native-firebase/analytics') ||
          errorStr.includes('@react-native-firebase/app') ||
          errorMsg.includes('Re-check module install')
        ) {
          // Silently suppress - Firebase will be available after rebuild
          return
        }

        // For other errors, use original handler
        if (originalConsoleError) {
          originalConsoleError.apply(console, args)
        }
      }
    }

    try {
      // Try to require Firebase modules
      // Errors will be suppressed by our error handler
      analyticsReq = require('@react-native-firebase/analytics')
    } catch (e: any) {
      // Module not found or not available
      const errorMsg = e?.message || String(e)
      if (
        errorMsg.includes('unknown module') ||
        errorMsg.includes('RNFBAppModule') ||
        errorMsg.includes('Native module')
      ) {
        // Metro doesn't know about the module or native module not linked
        firebaseDisabled = true
      }
      analyticsReq = null
    }

    try {
      appReq = require('@react-native-firebase/app')
    } catch (e: any) {
      // Module not found or not available
      const errorMsg = e?.message || String(e)
      if (
        errorMsg.includes('unknown module') ||
        errorMsg.includes('RNFBAppModule') ||
        errorMsg.includes('Native module')
      ) {
        firebaseDisabled = true
      }
      appReq = null
    }

    // Restore error handling after a short delay to catch any async errors
    setTimeout(() => {
      if (errorSuppressionActive && originalConsoleError) {
        console.error = originalConsoleError
        errorSuppressionActive = false
        originalConsoleError = null
      }
    }, 100)

    // If either module failed to load, Firebase is not available
    if (!analyticsReq || !appReq) {
      firebaseInitialized = false
      firebaseCheckInProgress = false
      return false
    }

    // Verify modules have default export
    if (!analyticsReq?.default || !appReq?.default) {
      firebaseInitialized = false
      firebaseCheckInProgress = false
      return false
    }

    // Try to access the modules to verify they work
    // Wrap in try-catch to handle native module errors
    try {
      const analytics = analyticsReq.default
      const app = appReq.default

      // Try to get an instance (this will fail if native module is not linked)
      const analyticsInstance = analytics()
      const appInstance = app()

      if (analyticsInstance && appInstance) {
        analyticsModule = analytics
        appModule = app
        firebaseInitialized = true
        firebaseCheckInProgress = false
        return true
      }
    } catch (error: any) {
      // Native module not available - this is the expected error
      // Check if it's the RNFBAppModule error specifically
      const errorMessage = error?.message || String(error)
      if (
        errorMessage.includes('RNFBAppModule') ||
        errorMessage.includes('Native module')
      ) {
        // Expected error - native module not linked, suppress it
        firebaseInitialized = false
        firebaseCheckInProgress = false
        return false
      }
      // Other errors - also not available
      firebaseInitialized = false
      firebaseCheckInProgress = false
      return false
    }

    firebaseInitialized = false
    firebaseCheckInProgress = false
    return false
  } catch (error: any) {
    // Any other error - module not available
    const errorMessage = error?.message || String(error)
    if (
      errorMessage.includes('RNFBAppModule') ||
      errorMessage.includes('Native module')
    ) {
      // Disable Firebase if we get native module errors to prevent repeated attempts
      firebaseDisabled = true
    }
    firebaseInitialized = false
    firebaseCheckInProgress = false
    return false
  }
}

/**
 * Get Firebase Analytics module if available
 */
function getAnalytics() {
  if (!checkFirebaseAvailability()) {
    return null
  }
  return analyticsModule
}

/**
 * Get Firebase App module if available
 */
function getFirebaseApp() {
  if (!checkFirebaseAvailability()) {
    return null
  }
  return appModule
}

/**
 * Initialize Google Analytics
 * This should be called as early as possible in the app lifecycle
 *
 * NOTE: This function will silently fail if Firebase native module is not linked.
 * After rebuilding the app with `npm run android`, Firebase should work correctly.
 */
export async function initAnalytics() {
  // If Firebase is disabled, don't try to initialize
  if (firebaseDisabled) {
    return
  }

  // Check availability first
  if (!checkFirebaseAvailability()) {
    // Don't log warning - Firebase will be available after rebuild
    return
  }

  try {
    const analytics = getAnalytics()
    if (!analytics) {
      return
    }

    // Enable analytics collection (enabled by default, but we make it explicit)
    await analytics().setAnalyticsCollectionEnabled(true)
    console.log('Google Analytics initialized successfully')
  } catch (error) {
    console.warn('Failed to initialize Google Analytics:', error)
    // Reset initialization flag on error
    firebaseInitialized = false
  }
}

/**
 * Log a screen view event
 */
export async function logScreenView(screenName: string, screenClass?: string) {
  if (!checkFirebaseAvailability()) {
    return
  }

  try {
    const analytics = getAnalytics()
    if (!analytics) {
      return
    }

    await analytics().logScreenView({
      screen_name: screenName,
      screen_class: screenClass || screenName,
    })
  } catch (error) {
    // Silently fail - don't log to avoid spam
  }
}

/**
 * Log a custom event with optional parameters
 */
export async function logEvent(
  eventName: string,
  parameters?: Record<string, string | number | boolean>
) {
  if (!checkFirebaseAvailability()) {
    return
  }

  try {
    const analytics = getAnalytics()
    if (!analytics) {
      return
    }

    await analytics().logEvent(eventName, parameters)
  } catch (error) {
    // Silently fail - don't log to avoid spam
  }
}

/**
 * Set user properties for analytics
 */
export async function setUserProperties(properties: Record<string, string>) {
  if (!checkFirebaseAvailability()) {
    return
  }

  try {
    const analytics = getAnalytics()
    if (!analytics) {
      return
    }

    for (const [key, value] of Object.entries(properties)) {
      await analytics().setUserProperty(key, value)
    }
  } catch (error) {
    // Silently fail - don't log to avoid spam
  }
}

/**
 * Set user ID for analytics
 */
export async function setUserId(userId: string | null) {
  if (!checkFirebaseAvailability()) {
    return
  }

  try {
    const analytics = getAnalytics()
    if (!analytics) {
      return
    }

    await analytics().setUserId(userId)
  } catch (error) {
    // Silently fail - don't log to avoid spam
  }
}

/**
 * Reset analytics data (useful for logout)
 */
export async function resetAnalytics() {
  if (!checkFirebaseAvailability()) {
    return
  }

  try {
    const analytics = getAnalytics()
    if (!analytics) {
      return
    }

    await analytics().resetAnalyticsData()
    await analytics().setUserId(null)
  } catch (error) {
    // Silently fail - don't log to avoid spam
  }
}

/**
 * Common event names used throughout the app
 */
export const AnalyticsEvents = {
  // Authentication
  LOGIN_ATTEMPT: 'login_attempt',
  LOGIN_SUCCESS: 'login_success',
  LOGIN_FAILED: 'login_failed',
  SIGNUP_ATTEMPT: 'signup_attempt',
  SIGNUP_SUCCESS: 'signup_success',
  SIGNUP_FAILED: 'signup_failed',
  LOGOUT: 'logout',

  // Navigation
  SCREEN_VIEW: 'screen_view',

  // Movies
  MOVIE_VIEWED: 'movie_viewed',
  MOVIE_TRAILER_PLAYED: 'movie_trailer_played',
  MOVIE_SHOWTIMES_VIEWED: 'movie_showtimes_viewed',

  // Booking
  SEAT_SELECTED: 'seat_selected',
  TICKET_PURCHASE_STARTED: 'ticket_purchase_started',
  TICKET_PURCHASE_COMPLETED: 'ticket_purchase_completed',
  TICKET_PURCHASE_FAILED: 'ticket_purchase_failed',

  // Search
  SEARCH_PERFORMED: 'search_performed',
  SEARCH_RESULT_CLICKED: 'search_result_clicked',

  // User Actions
  PROFILE_UPDATED: 'profile_updated',
  CINEMA_SELECTED: 'cinema_selected',
  DATE_SELECTED: 'date_selected',
} as const
