import { getApiError } from '@/lib/utils/getApiError'
import { apiClient } from './axios-config'
import type {
  Showtime,
  ShowtimeSearchParams,
  ShowtimeSearchResponse,
} from './types'

export const showtimesApi = {
  async searchShowtimes(
    params?: ShowtimeSearchParams
  ): Promise<ShowtimeSearchResponse> {
    try {
      const response = await apiClient.post('/api/showtimes/search', params)
      return response.data
    } catch (error: any) {
      const errorMessage = getApiError(error)
      throw new Error(errorMessage)
    }
  },

  /**
   * Get a specific showtime by ID
   * Endpoint: GET /api/showtimes/:id
   */
  async getShowtimeById(showtimeId: number): Promise<Showtime> {
    try {
      const response = await apiClient.get(`/api/showtimes/${showtimeId}`)
      return response.data
    } catch (error: any) {
      const errorMessage = getApiError(error)
      throw new Error(errorMessage)
    }
  },
}
