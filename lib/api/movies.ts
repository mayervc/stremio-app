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
        limit: 3,
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

  async searchMovies(
    query: string,
    page: number = 1,
    limit: number = 20
  ): Promise<RecommendedMoviesResponse> {
    try {
      // Trim and validate query
      const trimmedQuery = query.trim()
      if (!trimmedQuery) {
        throw new Error('Search query cannot be empty')
      }

      const requestBody = {
        search: trimmedQuery,
        page,
        limit,
      }
      const response = await apiClient.post('/api/movies/search', requestBody)
      return response.data
    } catch (error: any) {
      const errorMessage = getApiError(error)
      throw new Error(errorMessage)
    }
  },
}
