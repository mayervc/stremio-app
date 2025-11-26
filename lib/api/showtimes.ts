import { getApiError } from '@/lib/utils/getApiError'
import { apiClient } from './axios-config'
import type { ShowtimeSearchParams, ShowtimeSearchResponse } from './types'

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
}
