import AsyncStorage from '@react-native-async-storage/async-storage'
import axios, { AxiosInstance } from 'axios'
import * as SecureStore from 'expo-secure-store'
import { Platform } from 'react-native'

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
      let token: string | null = null

      if (Platform.OS === 'web') {
        token = await AsyncStorage.getItem('auth_token')
      } else {
        token = await SecureStore.getItemAsync('auth_token')
      }

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
        if (Platform.OS === 'web') {
          await AsyncStorage.removeItem('auth_token')
        } else {
          await SecureStore.deleteItemAsync('auth_token')
        }
      } catch (clearError) {
        console.warn('Failed to clear auth token:', clearError)
      }
    }
    return Promise.reject(error)
  }
)

export default apiClient
