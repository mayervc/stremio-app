import axios, { AxiosInstance, AxiosResponse } from 'axios'

// Base configuration for Stremio API
const STREMIO_API_BASE_URL = 'https://api.strem.io'
const TIMEOUT = 10000 // 10 seconds

// Create axios instance with default configuration
export const stremioApiClient: AxiosInstance = axios.create({
  baseURL: STREMIO_API_BASE_URL,
  timeout: TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

// Request interceptor
stremioApiClient.interceptors.request.use(
  (config: any) => {
    // Add timestamp to prevent caching
    if (config.params) {
      config.params._t = Date.now()
    } else {
      config.params = { _t: Date.now() }
    }

    // Log request in development
    if (__DEV__) {
      console.log(
        `🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`
      )
    }

    return config
  },
  error => {
    console.error('❌ Request Error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor
stremioApiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log response in development
    if (__DEV__) {
      console.log(`✅ API Response: ${response.status} ${response.config.url}`)
    }
    return response
  },
  error => {
    // Handle common errors
    if (error.response) {
      // Server responded with error status
      console.error(
        `❌ API Error: ${error.response.status} - ${error.response.data?.message || 'Unknown error'}`
      )
    } else if (error.request) {
      // Request was made but no response received
      console.error('❌ Network Error: No response received')
    } else {
      // Something else happened
      console.error('❌ Request Setup Error:', error.message)
    }

    return Promise.reject(error)
  }
)

// Generic API response type
export interface ApiResponse<T = any> {
  data: T
  status: number
  message?: string
}

// Generic error response type
export interface ApiError {
  message: string
  status?: number
  code?: string
}

export default stremioApiClient
