import * as Sentry from '@sentry/react-native'
import Constants from 'expo-constants'

/**
 * Initialize Sentry for error monitoring and crash reporting
 * This should be called as early as possible in the app lifecycle
 */
export function initSentry() {
  const dsn = process.env.EXPO_PUBLIC_SENTRY_DSN

  if (!dsn) {
    console.warn(
      'Sentry DSN not found. Set EXPO_PUBLIC_SENTRY_DSN in your .env file to enable error tracking.'
    )
    return
  }

  Sentry.init({
    dsn,
    debug: __DEV__, // Enable debug mode in development
    environment: __DEV__ ? 'development' : 'production',
    enableAutoSessionTracking: true,
    sessionTrackingIntervalMillis: 30000, // 30 seconds
    tracesSampleRate: __DEV__ ? 1.0 : 0.2, // 100% in dev, 20% in production
    beforeSend(event, hint) {
      // Add app version and build info
      if (Constants.expoConfig) {
        event.extra = {
          ...event.extra,
          appVersion: Constants.expoConfig.version,
          appName: Constants.expoConfig.name,
        }
      }
      return event
    },
  })

  console.log('Sentry initialized successfully')
}

/**
 * Log an error to Sentry with additional context
 */
export function logError(error: Error, context?: Record<string, unknown>) {
  Sentry.captureException(error, {
    extra: context,
  })
}

/**
 * Log a message to Sentry
 */
export function logMessage(
  message: string,
  level: Sentry.SeverityLevel = 'info'
) {
  Sentry.captureMessage(message, level)
}

/**
 * Set user context for Sentry
 */
export function setUserContext(user: {
  id: string
  email?: string
  username?: string
}) {
  Sentry.setUser({
    id: user.id,
    email: user.email,
    username: user.username,
  })
}

/**
 * Clear user context
 */
export function clearUserContext() {
  Sentry.setUser(null)
}

/**
 * Add breadcrumb for debugging
 */
export function addBreadcrumb(breadcrumb: {
  message: string
  category?: string
  level?: Sentry.SeverityLevel
  data?: Record<string, unknown>
}) {
  Sentry.addBreadcrumb({
    message: breadcrumb.message,
    category: breadcrumb.category || 'default',
    level: breadcrumb.level || 'info',
    data: breadcrumb.data,
  })
}
