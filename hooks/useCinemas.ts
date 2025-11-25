import { cinemasApi } from '@/lib/api/cinemas'
import type { CinemaSearchParams } from '@/lib/api/types'
import { useQuery } from '@tanstack/react-query'

export const cinemaQueryKeys = {
  all: ['cinemas'] as const,
  list: (params?: CinemaSearchParams) =>
    [...cinemaQueryKeys.all, 'list', params] as const,
}

export const useCinemas = (params?: CinemaSearchParams) => {
  return useQuery({
    queryKey: cinemaQueryKeys.list(params),
    queryFn: () => cinemasApi.getCinemas(params),
    staleTime: 1000 * 60 * 30, // 30 minutes - cinemas don't change frequently
    gcTime: 1000 * 60 * 60, // 1 hour
  })
}
