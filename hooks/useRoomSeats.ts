import type { Block, RoomLayout, RoomSeat, Seat } from '@/lib/api/types'
import { useBookingStore } from '@/store/bookingStore'
import { useMemo } from 'react'
import { useRoom } from './useRoom'
import { useShowtime } from './useShowtime'

export const useRoomSeats = () => {
  const { bookingData } = useBookingStore()

  const roomId = bookingData?.roomId || null
  const showtimeId = bookingData?.selectedShowtimeId || null

  // Get room with blocks and seats
  const {
    data: roomData,
    isLoading: isLoadingRoom,
    error: roomError,
  } = useRoom(roomId)

  // Get showtime to know which seats are booked
  const { data: showtimeData, isLoading: isLoadingShowtime } =
    useShowtime(showtimeId)

  // Get booked seat IDs from showtime data
  const bookedSeatIds = useMemo(() => {
    if (showtimeData?.booked_seats) {
      // Ensure booked_seats is an array
      return Array.isArray(showtimeData.booked_seats)
        ? showtimeData.booked_seats
        : []
    }
    return []
  }, [showtimeData])

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
