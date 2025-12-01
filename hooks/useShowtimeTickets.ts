import { ticketsApi } from '@/lib/api/tickets'
import { useQuery } from '@tanstack/react-query'

export const useShowtimeTickets = (showtimeId: number | null) => {
  return useQuery({
    queryKey: ['showtimeTickets', showtimeId],
    queryFn: async () => {
      return await ticketsApi.getUserTicketsForShowtime(showtimeId!)
    },
    enabled: !!showtimeId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}
