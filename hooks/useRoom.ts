import { seatsApi } from '@/lib/api/seats'
import { useQuery } from '@tanstack/react-query'

export const useRoom = (roomId: number | null) => {
  return useQuery({
    queryKey: ['room-with-seats', roomId],
    queryFn: () => seatsApi.getRoomWithSeats(roomId!),
    enabled: !!roomId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
