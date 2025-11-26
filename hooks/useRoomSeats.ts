import { seatsApi } from '@/lib/api/seats'
import { showtimesApi } from '@/lib/api/showtimes'
import type { Block, RoomLayout, RoomSeat, Seat } from '@/lib/api/types'
import { useBookingStore } from '@/store/bookingStore'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

interface UseRoomSeatsParams {
  roomId: number | null
  showtimeId: number | null
  bookedSeats?: number[] // Optional: can pass booked seats directly if already available
}

export const useRoomSeats = ({
  roomId,
  showtimeId,
  bookedSeats,
}: UseRoomSeatsParams) => {
  const { bookingData } = useBookingStore()

  // Get room with blocks and seats
  const {
    data: roomData,
    isLoading: isLoadingRoom,
    error: roomError,
  } = useQuery({
    queryKey: ['room-with-seats', roomId],
    queryFn: () => seatsApi.getRoomWithSeats(roomId!),
    enabled: !!roomId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  // Get showtime to know which seats are booked (if bookedSeats not provided)
  const { data: showtimeData, isLoading: isLoadingShowtime } = useQuery({
    queryKey: ['showtime-for-seats', showtimeId],
    queryFn: async () => {
      if (!showtimeId || !bookingData) return null

      // Search showtimes to find the one with matching ID
      const response = await showtimesApi.searchShowtimes({
        movie_id: bookingData.movieId,
        cinema_id: bookingData.selectedCinema.id,
        date: bookingData.selectedDate.toISOString().split('T')[0],
      })

      // Find the showtime with matching ID
      for (const room of response.showtimes) {
        const showtime = room.showtimes.find(s => s.id === showtimeId)
        if (showtime) return showtime
      }
      return null
    },
    enabled: !!showtimeId && !!bookingData && !bookedSeats,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })

  // Use provided bookedSeats or from showtime data
  const bookedSeatIds = useMemo(() => {
    if (bookedSeats) return bookedSeats
    if (showtimeData?.booked_seats) {
      // Ensure booked_seats is an array
      return Array.isArray(showtimeData.booked_seats)
        ? showtimeData.booked_seats
        : []
    }
    return []
  }, [bookedSeats, showtimeData])

  // Transform backend room with blocks to frontend format with calculated status
  const roomLayout = useMemo((): RoomLayout | null => {
    if (!roomData) {
      return null
    }

    if (!roomData.blocks || roomData.blocks.length === 0) {
      return null
    }

    // Transform blocks and their seats
    const blocks: Block[] = roomData.blocks.map(block => ({
      id: block.id,
      roomId: block.roomId,
      rowSeats: block.rowSeats,
      columnsSeats: block.columnsSeats,
      blockRow: block.blockRow,
      blockColumn: block.blockColumn,
      seats: block.seats.map((seat: RoomSeat) => ({
        id: seat.id,
        row: seat.seatRowLabel,
        number: seat.seatColumnLabel,
        status: bookedSeatIds.includes(seat.id) ? 'booked' : 'available',
        roomBlockId: seat.roomBlockId,
      })),
    }))

    // Flatten all seats from all blocks
    const allSeats: Seat[] = blocks.flatMap(block => block.seats)

    // Get unique rows (sorted)
    const rows = Array.from(new Set(allSeats.map(s => s.row))).sort()

    return {
      room_id: roomData.id,
      room_name: roomData.name,
      seats: allSeats,
      rows,
      blocks,
    }
  }, [roomData, bookedSeatIds])

  return {
    data: roomLayout,
    showtimeData,
    isLoading: isLoadingRoom || isLoadingShowtime,
    error: roomError,
  }
}
