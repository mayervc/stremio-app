import { getApiError } from '@/lib/utils/getApiError'
import { apiClient } from './axios-config'
import type { Room } from './types'

export const seatsApi = {
  /**
   * Get room with blocks and seats
   * Endpoint: GET /api/rooms/:roomId?includeSeats=true
   */
  async getRoomWithSeats(roomId: number): Promise<Room> {
    try {
      const response = await apiClient.get(
        `/api/rooms/${roomId}?includeSeats=true`
      )
      return response.data
    } catch (error: any) {
      const errorMessage = getApiError(error)
      throw new Error(errorMessage)
    }
  },
}
