import stremioApiClient from '@/lib/api/axios-config'
import {
  ApiResponse,
  SearchParams,
  StreamParams,
  StremioEpisode,
  StremioError,
  StremioMovie,
  StremioSearchResult,
  StremioSeries,
  StremioStream,
} from './types'

class StremioService {
  /**
   * Search for movies and series
   */
  async searchContent(
    params: SearchParams
  ): Promise<ApiResponse<StremioSearchResult>> {
    try {
      const response = await stremioApiClient.get('/search', {
        params: {
          q: params.query,
          page: params.page || 1,
          limit: params.limit || 20,
          type: params.type || 'all',
        },
      })

      return {
        data: response.data,
        status: response.status,
      }
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Get popular movies
   */
  async getPopularMovies(
    page: number = 1,
    limit: number = 20
  ): Promise<ApiResponse<StremioMovie[]>> {
    try {
      const response = await stremioApiClient.get('/catalog/movies/popular', {
        params: { page, limit },
      })

      return {
        data: response.data,
        status: response.status,
      }
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Get popular series
   */
  async getPopularSeries(
    page: number = 1,
    limit: number = 20
  ): Promise<ApiResponse<StremioSeries[]>> {
    try {
      const response = await stremioApiClient.get('/catalog/series/popular', {
        params: { page, limit },
      })

      return {
        data: response.data,
        status: response.status,
      }
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Get movie details by IMDB ID
   */
  async getMovieDetails(imdbId: string): Promise<ApiResponse<StremioMovie>> {
    try {
      const response = await stremioApiClient.get(`/meta/movie/${imdbId}`)

      return {
        data: response.data,
        status: response.status,
      }
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Get series details by IMDB ID
   */
  async getSeriesDetails(imdbId: string): Promise<ApiResponse<StremioSeries>> {
    try {
      const response = await stremioApiClient.get(`/meta/series/${imdbId}`)

      return {
        data: response.data,
        status: response.status,
      }
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Get series episodes
   */
  async getSeriesEpisodes(
    imdbId: string,
    season: number
  ): Promise<ApiResponse<StremioEpisode[]>> {
    try {
      const response = await stremioApiClient.get(
        `/meta/series/${imdbId}/season/${season}`
      )

      return {
        data: response.data,
        status: response.status,
      }
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Get available streams for a movie or episode
   */
  async getStreams(
    params: StreamParams
  ): Promise<ApiResponse<StremioStream[]>> {
    try {
      const endpoint =
        params.type === 'movie'
          ? `/stream/movie/${params.imdbId}`
          : `/stream/series/${params.imdbId}/${params.season}/${params.episode}`

      const response = await stremioApiClient.get(endpoint)

      return {
        data: response.data,
        status: response.status,
      }
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Get trending content
   */
  async getTrending(
    type: 'movie' | 'series' = 'movie'
  ): Promise<ApiResponse<StremioMovie[] | StremioSeries[]>> {
    try {
      const response = await stremioApiClient.get(`/catalog/${type}/trending`)

      return {
        data: response.data,
        status: response.status,
      }
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Handle API errors consistently
   */
  private handleError(error: any): StremioError {
    if (error.response) {
      return {
        code: error.response.status.toString(),
        message: error.response.data?.message || 'Server error occurred',
        details: error.response.data,
      }
    } else if (error.request) {
      return {
        code: 'NETWORK_ERROR',
        message: 'Network connection failed',
      }
    } else {
      return {
        code: 'UNKNOWN_ERROR',
        message: error.message || 'An unexpected error occurred',
      }
    }
  }
}

// Export singleton instance
export const stremioService = new StremioService()
export default stremioService
