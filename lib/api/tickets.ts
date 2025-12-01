import { getApiError } from '@/lib/utils/getApiError'
import { apiClient } from './axios-config'
import type {
  CreateTicketsRequest,
  CreateTicketsResponse,
  UserTicketsResponse,
} from './types'

export const ticketsApi = {
  /**
   * Create tickets for selected seats in a showtime
   * Endpoint: POST /api/tickets
   */
  async createTickets(
    request: CreateTicketsRequest
  ): Promise<CreateTicketsResponse> {
    try {
      const response = await apiClient.post('/api/tickets', request)
      return response.data
    } catch (error: any) {
      const errorMessage = getApiError(error)
      throw new Error(errorMessage)
    }
  },

  /**
   * Get user tickets for a specific showtime
   * Endpoint: GET /api/showtimes/:id/tickets
   */
  async getUserTicketsForShowtime(
    showtimeId: number
  ): Promise<UserTicketsResponse> {
    try {
      const response = await apiClient.get(
        `/api/showtimes/${showtimeId}/tickets`
      )
      return response.data
    } catch (error: any) {
      const errorMessage = getApiError(error)
      throw new Error(errorMessage)
    }
  },
}
