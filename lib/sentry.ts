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
    enableLogs: true,
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
 * Log a message to Sentry using the structured logger API
 * Falls back to captureMessage if logger is not available
 */
export function logMessage(
  message: string,
  level: Sentry.SeverityLevel = 'info',
  context?: Record<string, unknown>
) {
  // Use Sentry.logger if available (newer versions)
  if (Sentry.logger) {
    try {
      // Map severity levels to logger methods
      const levelMap: Record<string, string> = {
        fatal: 'fatal',
        error: 'error',
        warning: 'warn',
        warn: 'warn',
        info: 'info',
        log: 'info',
        debug: 'debug',
        trace: 'trace',
      }

      const loggerMethod = levelMap[level] || 'info'
      // Type assertion through 'unknown' to handle logger's fmt property
      const logger = Sentry.logger as unknown as Record<
        string,
        (message: string, context?: Record<string, unknown>) => void
      >

      if (logger[loggerMethod] && typeof logger[loggerMethod] === 'function') {
        // Use logger with context if provided
        if (context) {
          logger[loggerMethod](message, context)
        } else {
          logger[loggerMethod](message)
        }
        return
      }
    } catch (error) {
      // If logger fails, fall through to captureMessage
      console.warn('Sentry.logger failed, using captureMessage:', error)
    }
  }

  // Fallback to captureMessage for older versions or if logger method not available
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
