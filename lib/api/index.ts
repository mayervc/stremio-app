// Export all API components from a single entry point
export { default as stremioApiClient } from '@/lib/api/axios-config'
export { stremioService } from './stremio-service'
export * from './types'

// Re-export commonly used types for convenience
export type {
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
