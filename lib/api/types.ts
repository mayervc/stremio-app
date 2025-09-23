// Stremio API Types
export interface StremioMovie {
  id: string
  title: string
  year: number
  description?: string
  poster?: string
  backdrop?: string
  genres?: string[]
  imdbRating?: number
  runtime?: number
  director?: string
  cast?: string[]
}

export interface StremioSeries {
  id: string
  title: string
  year: number
  description?: string
  poster?: string
  backdrop?: string
  genres?: string[]
  imdbRating?: number
  seasons?: number
  episodes?: number
  status?: 'ongoing' | 'ended'
}

export interface StremioEpisode {
  id: string
  title: string
  season: number
  episode: number
  description?: string
  poster?: string
  runtime?: number
  airDate?: string
}

export interface StremioSearchResult {
  movies: StremioMovie[]
  series: StremioSeries[]
  total: number
  page: number
  hasMore: boolean
}

export interface StremioStream {
  id: string
  title: string
  url: string
  quality: string
  size?: string
  seeds?: number
  peers?: number
  provider: string
}

// API Request/Response Types
export interface SearchParams {
  query: string
  page?: number
  limit?: number
  type?: 'movie' | 'series' | 'all'
}

export interface StreamParams {
  imdbId: string
  type: 'movie' | 'series'
  season?: number
  episode?: number
}

// API Response Types
export interface ApiResponse<T = any> {
  data: T
  status: number
  message?: string
}

// Error Types
export interface StremioError {
  code: string
  message: string
  details?: any
}
