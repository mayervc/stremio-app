import { tokenStorage } from '@/lib/secure-store'
import { addBreadcrumb, logError } from '@/lib/sentry'
import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from 'axios'

// Base configuration for Stremio API
const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:3000'
const TIMEOUT = 30000 // 30 seconds

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
  async (config: InternalAxiosRequestConfig) => {
    try {
      const token = await tokenStorage.getToken()

      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }

      // Add breadcrumb for API requests
      addBreadcrumb({
        message: `API Request: ${config.method?.toUpperCase()} ${config.url}`,
        category: 'http',
        data: {
          method: config.method,
          url: config.url,
          baseURL: config.baseURL,
        },
      })
    } catch (error) {
      console.warn('Failed to get auth token:', error)
      logError(error as Error, {
        context: 'axios-request-interceptor',
        action: 'get-auth-token',
      })
    }

    return config
  },
  error => {
    logError(error, {
      context: 'axios-request-interceptor',
      action: 'request-error',
    })
    return Promise.reject(error)
  }
)

// Response interceptor to handle auth errors and log to Sentry
apiClient.interceptors.response.use(
  response => {
    // Add breadcrumb for successful responses
    addBreadcrumb({
      message: `API Response: ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`,
      category: 'http',
      level: 'info',
      data: {
        method: response.config.method,
        url: response.config.url,
        status: response.status,
      },
    })
    return response
  },
  async (error: AxiosError) => {
    const axiosError = error as AxiosError

    // Log error to Sentry with detailed context
    const errorContext = {
      context: 'axios-response-interceptor',
      url: axiosError.config?.url,
      method: axiosError.config?.method,
      baseURL: axiosError.config?.baseURL,
      status: axiosError.response?.status,
      statusText: axiosError.response?.statusText,
      responseData: axiosError.response?.data,
      requestData: axiosError.config?.data,
      headers: axiosError.config?.headers,
    }

    // Create a more descriptive error message
    const errorMessage = axiosError.response
      ? `API Error: ${axiosError.config?.method?.toUpperCase()} ${axiosError.config?.url} - ${axiosError.response.status} ${axiosError.response.statusText}`
      : axiosError.message || 'Unknown API error'

    const enhancedError = new Error(errorMessage)
    enhancedError.name = 'ApiError'

    logError(enhancedError, errorContext)

    // Add breadcrumb for failed responses
    addBreadcrumb({
      message: errorMessage,
      category: 'http',
      level: 'error',
      data: errorContext,
    })

    if (axiosError.response?.status === 401) {
      // Token expired or invalid, clear it
      try {
        await tokenStorage.removeToken()
        addBreadcrumb({
          message: 'Auth token cleared due to 401 error',
          category: 'auth',
          level: 'warning',
        })
      } catch (clearError) {
        console.warn('Failed to clear auth token:', clearError)
        logError(clearError as Error, {
          context: 'axios-response-interceptor',
          action: 'clear-auth-token',
        })
      }
    }

    return Promise.reject(axiosError)
  }
)

export default apiClient
