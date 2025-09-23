import axios, { AxiosInstance, AxiosResponse } from 'axios'

// Base configuration for Stremio API
const STREMIO_API_BASE_URL =
  process.env.STREMIO_API_BASE_URL || 'https://api.strem.io'
const TIMEOUT = 10000 // 10 seconds

// Create axios instance with default configuration
export const apiClient: AxiosInstance = axios.create({
  baseURL: STREMIO_API_BASE_URL,
  timeout: TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

// Response interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
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

export default apiClient
