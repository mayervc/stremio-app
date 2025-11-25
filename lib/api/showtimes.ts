import { getApiError } from '@/lib/utils/getApiError'
import { apiClient } from './axios-config'
import type { ShowtimeSearchParams, ShowtimeSearchResponse } from './types'

export const showtimesApi = {
  async searchShowtimes(
    params?: ShowtimeSearchParams
  ): Promise<ShowtimeSearchResponse> {
    try {
      // Build request body with only provided parameters
      const requestBody: ShowtimeSearchParams = {}
      if (params?.movie_id) {
        requestBody.movie_id = params.movie_id
      }
      if (params?.cinema_id) {
        requestBody.cinema_id = params.cinema_id
      }
      if (params?.date) {
        requestBody.date = params.date
      }

      const response = await apiClient.post(
        '/api/showtimes/search',
        requestBody
      )
      return response.data
    } catch (error: any) {
      const errorMessage = getApiError(error)
      throw new Error(errorMessage)
    }
  },
}
