import { getApiError } from '@/lib/utils/getApiError'
import { apiClient } from './axios-config'
import type { CinemaSearchParams, CinemaSearchResponse } from './types'

export const cinemasApi = {
  async searchCinemas(
    params?: CinemaSearchParams
  ): Promise<CinemaSearchResponse> {
    try {
      // Build request body with defaults to get all cinemas
      const requestBody: CinemaSearchParams = {
        page: params?.page || 1,
        limit: params?.limit || 100,
        ...(params?.name && { name: params.name }),
        ...(params?.city && { city: params.city }),
      }

      const response = await apiClient.post('/api/cinemas/search', requestBody)
      return response.data
    } catch (error: any) {
      const errorMessage = getApiError(error)
      throw new Error(errorMessage)
    }
  },
}
