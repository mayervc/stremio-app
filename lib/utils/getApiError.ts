import { logError } from '@/lib/sentry'

export function getApiError(error: any): string {
  const errorMessage =
    error.response?.data?.errors?.[0]?.message ||
    error.response?.data?.message ||
    error.message ||
    'An unexpected error occurred'

  // Log non-401 errors to Sentry (401 is expected for unauthenticated requests)
  if (error?.response?.status !== 401) {
    logError(new Error(errorMessage), {
      context: 'getApiError',
      originalError: error,
      status: error?.response?.status,
      url: error?.config?.url,
    })
  }

  return errorMessage
}
