// API Response Types
export interface ApiResponse<T = any> {
  data: T
  status: number
  message?: string
}

// Error Types
export interface ApiError {
  code: string
  message: string
  details?: any
}

// Movie Types
export interface Movie {
  id: number
  title: string
  subtitle?: string
  image: string
  rating?: string
  language?: string
  genre?: string
  formats?: string
  isTrending?: boolean
  description?: string
  releaseDate?: string
  duration?: number
  director?: string
  cast?: string[]
  trailerUrl?: string
}

export interface TrendingMoviesResponse {
  movies: Movie[]
  total: number
}

export interface RecommendedMoviesResponse {
  movies: Movie[]
  total: number
}
