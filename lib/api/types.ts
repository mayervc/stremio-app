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

// Cinema Types
export interface Cinema {
  id: number
  name: string
  address: string
  city: string
  country: string
  phoneNumber: number | string // Backend can return as string or number
  countryCode: number
  createdAt: string
  updatedAt: string
}

export interface CinemaSearchParams {
  page?: number
  limit?: number
  name?: string
  city?: string
}

export interface Pagination {
  currentPage: number
  pageSize: number
  totalItems: number
  totalPages: number
}

export interface CinemaSearchResponse {
  cinemas: Cinema[]
  pagination: Pagination
}

// Showtime Types
export interface Showtime {
  id: number
  room_id: number
  start_time: string // Format: "HH:mm" (e.g., "14:30")
  end_time: string // Format: "HH:mm" (e.g., "16:45")
  booked_seats: number
  room_seats: number
}

export interface ShowtimeRoom {
  id: number
  room_id: number
  room_name: string
  showtimes: Showtime[]
}

export interface ShowtimeSearchParams {
  movie_id?: number
  cinema_id?: number
  date?: string // Format: "YYYY-MM-DD" (e.g., "2025-11-20")
}

export interface ShowtimeSearchResponse {
  showtimes: ShowtimeRoom[]
}
