export function getApiError(error: any): string {
  return (
    error.response?.data?.errors?.[0]?.message ||
    error.response?.data?.message ||
    error.message ||
    'An unexpected error occurred'
  )
}
