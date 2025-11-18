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
  popularity?: string | null // String decimal from backend
  profile_image?: string | null
  tmdb_id?: number | null
  createdAt?: string
  updatedAt?: string
  birthPlace?: string | null
  height?: string | null
  occupations?: string[] | null
  partners?: Array<{
    name: string
    period: string
  }> | null
  biography?: string | null
  movies?: Array<{
    id: number
    title: string
    image?: string
    image_url?: string
  }>
}

export interface ActorWithCast extends Actor {
  cast?: {
    role?: string | null
    characters?: string[] | null
  }
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
  actors?: ActorWithCast[]
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
