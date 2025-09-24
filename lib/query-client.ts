import { QueryClient } from '@tanstack/react-query'

// Create a client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Time in milliseconds that data remains fresh
      staleTime: 1000 * 60 * 5, // 5 minutes

      // Time in milliseconds that unused/inactive cache data remains in memory
      gcTime: 1000 * 60 * 30, // 30 minutes (formerly cacheTime)

      // Retry failed requests
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors (client errors)
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          return false
        }
        // Retry up to 3 times for other errors
        return failureCount < 3
      },

      // Retry delay
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),

      // Refetch on window focus
      refetchOnWindowFocus: false,

      // Refetch on reconnect
      refetchOnReconnect: true,
    },
    mutations: {
      // Retry failed mutations
      retry: 1,

      // Retry delay for mutations
      retryDelay: 1000,
    },
  },
})

export default queryClient
