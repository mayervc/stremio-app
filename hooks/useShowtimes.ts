import { showtimesApi } from '@/lib/api/showtimes'
import type { ShowtimeSearchParams } from '@/lib/api/types'
import { useQuery } from '@tanstack/react-query'

export const showtimeQueryKeys = {
  all: ['showtimes'] as const,
  search: (params?: ShowtimeSearchParams) =>
    [
      ...showtimeQueryKeys.all,
      'search',
      params?.movie_id,
      params?.cinema_id,
      params?.date,
    ] as const,
}

export const useShowtimes = (params?: ShowtimeSearchParams) => {
  return useQuery({
    queryKey: showtimeQueryKeys.search(params),
    queryFn: () => showtimesApi.searchShowtimes(params),
    enabled: !!params?.movie_id || !!params?.cinema_id || !!params?.date,
    staleTime: 1000 * 60 * 5, // 5 minutes - showtimes change frequently
    gcTime: 1000 * 60 * 15, // 15 minutes
  })
}
