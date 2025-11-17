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
export interface Actor {
  id: number
  firstName: string
  lastName: string
  nickName?: string | null
  birthdate?: string | null
  popularity?: number | null
  profile_image?: string | null
  tmdb_id?: number | null
  createdAt?: string
  updatedAt?: string
}

export interface Cast {
  movie_id: number
  actor_id: number
  role?: string | null
  characters?: string[] | null
  actor?: Actor | null
}

export interface Movie {
  id: number
  title: string
  subtitle?: string
  image?: string
  image_url?: string
  rating?: string
  language?: string
  genre?: string
  formats?: string
  isTrending?: boolean
  description?: string
  releaseDate?: string
  duration?: number
  director?: string
  cast?: Cast[]
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
