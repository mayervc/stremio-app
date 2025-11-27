import { showtimesApi } from '@/lib/api/showtimes'
import { useQuery } from '@tanstack/react-query'

export const useShowtime = (showtimeId: number | null) => {
  return useQuery({
    queryKey: ['showtime', showtimeId],
    queryFn: async () => {
      if (!showtimeId) return null
      return await showtimesApi.getShowtimeById(showtimeId)
    },
    enabled: !!showtimeId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}
