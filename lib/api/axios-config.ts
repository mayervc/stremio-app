import axios, { AxiosInstance } from 'axios'

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

export default apiClient
