import { getApiError } from '@/lib/utils/getApiError'
import { apiClient } from './axios-config'
import type {
  CreateTicketsRequest,
  CreateTicketsResponse,
  GoogleWalletTokenResponse,
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

  /**
   * Get Google Wallet token for a specific ticket
   * Endpoint: POST /api/tickets/google-wallet-token
   * Request Body: { ticketId: number }
   * Returns a JWT token that should be used to construct the Google Wallet URL:
   * https://pay.google.com/gp/v/save/{token}
   */
  async getGoogleWalletToken(
    ticketId: number
  ): Promise<GoogleWalletTokenResponse> {
    try {
      const response = await apiClient.post(
        '/api/tickets/google-wallet-token',
        {
          ticketId,
        }
      )
      return response.data
    } catch (error: any) {
      const errorMessage = getApiError(error)
      throw new Error(errorMessage)
    }
  },
}
