import { getApiError } from '@/lib/utils/getApiError'
import { apiClient } from './axios-config'
import type { CreateTicketsRequest, CreateTicketsResponse } from './types'

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
}
