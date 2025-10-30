import { getApiError } from '@/lib/utils/getApiError'
import { apiClient } from './axios-config'
import type {
  Movie,
  RecommendedMoviesResponse,
  TrendingMoviesResponse,
} from './types'

// API functions for movie operations
export const moviesApi = {
  async getTrendingMovies(): Promise<TrendingMoviesResponse> {
    try {
      const requestBody = {
        trending: true,
        page: 1,
        limit: 10,
      }
      const response = await apiClient.post('/api/movies/search', requestBody)
      return response.data
    } catch (error: any) {
      const errorMessage = getApiError(error)
      throw new Error(errorMessage)
    }
  },

  async getRecommendedMovies(): Promise<RecommendedMoviesResponse> {
    try {
      const requestBody = {
        sortBy: 'rating',
        sortDirection: 'desc',
        page: 1,
        limit: 10,
      }
      const response = await apiClient.post('/api/movies/search', requestBody)
      return response.data
    } catch (error: any) {
      const errorMessage = getApiError(error)
      throw new Error(errorMessage)
    }
  },

  async getMovieById(id: number): Promise<Movie> {
    try {
      const response = await apiClient.get(`/api/movies/${id}`)
      return response.data
    } catch (error: any) {
      const errorMessage = getApiError(error)
      throw new Error(errorMessage)
    }
  },
}
