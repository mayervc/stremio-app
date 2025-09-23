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
