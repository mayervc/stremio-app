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
  booked_seats: number[] // Array of seat IDs that are booked
  room_seats: number
  ticket_price?: number // Price per ticket
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

// Seat Types
export type SeatStatus = 'available' | 'booked' | 'selected'

// Backend Seat Structure (from API)
export interface RoomSeat {
  id: number
  roomId: number
  roomBlockId: number
  seatRowLabel: string // e.g., "A", "B", "C"
  seatRow: number // Row index (starting from 0)
  seatColumnLabel: number // Seat number (visible label)
  seatColumn: number // Column index (starting from 0)
}

// Backend Block Structure (from API)
export interface RoomBlock {
  id: number
  roomId: number
  rowSeats: number
  columnsSeats: number
  blockRow: number // Block row position in room
  blockColumn: number // Block column position in room
  seats: RoomSeat[]
}

// Backend Room Structure (from API)
export interface Room {
  id: number
  name: string
  rowsBlocks: number
  columnsBlocks: number
  details: string | null
  blocks?: RoomBlock[] // Only when includeSeats=true
}

// Frontend Seat Structure (with calculated status)
export interface Seat {
  id: number
  row: string // From seatRowLabel
  number: number // From seatColumnLabel
  status: SeatStatus
  roomBlockId: number
}

// Frontend Block Structure (with seats that have status)
export interface Block {
  id: number
  roomId: number
  rowSeats: number
  columnsSeats: number
  blockRow: number
  blockColumn: number
  seats: Seat[]
}

// Frontend Room Layout Structure
export interface RoomLayout {
  room_id: number
  room_name: string
  seats: Seat[] // All seats flattened from all blocks
  rows: string[] // Array of unique row identifiers
  blocks: Block[] // Blocks with seats that have status
}

// Ticket Types
export interface TicketSeat {
  id: number
  row: string // e.g., "A", "B", "E"
  column: string // e.g., "1", "2", "4"
}

export interface Ticket {
  id: number
  seat: TicketSeat
}

export interface CreateTicketsRequest {
  showtime_id: number
  seats: number[] // Array of seat IDs
}

export interface CreateTicketsResponse {
  showtime_id: number
  room_id: number
  room_name: string
  cinema_id: number
  cinema_name: string
  movie_id: number
  movie_title: string
  start_time: string // Format: "HH:mm"
  end_time: string // Format: "HH:mm"
  tickets: Ticket[]
}

// User Ticket Types (from GET /api/showtimes/:id/tickets)
export interface UserTicket {
  movie_title: string
  cinema_name: string
  room_name: string
  showtime_date: string // Format: "YYYY-MM-DD"
  showtime_time: string // Format: "HH:mm"
  seat_label: string // e.g., "E4", "A1", "B12"
}

export interface UserTicketsResponse {
  tickets: UserTicket[]
}
