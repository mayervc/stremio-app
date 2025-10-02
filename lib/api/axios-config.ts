import { tokenStorage } from '@/lib/secure-store'
import axios, { AxiosInstance } from 'axios'

// Base configuration for Stremio API
const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:3000'
const TIMEOUT = 10000 // 10 seconds

// Create axios instance with default configuration
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  async config => {
    try {
      const token = await tokenStorage.getToken()

      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    } catch (error) {
      console.warn('Failed to get auth token:', error)
    }

    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle auth errors
apiClient.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      // Token expired or invalid, clear it
      try {
        await tokenStorage.removeToken()
      } catch (clearError) {
        console.warn('Failed to clear auth token:', clearError)
      }
    }
    return Promise.reject(error)
  }
)

export default apiClient
