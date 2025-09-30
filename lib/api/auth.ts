import { User } from '@/store/authStore'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as SecureStore from 'expo-secure-store'
import { Platform } from 'react-native'
import { apiClient } from './axios-config'

export type LoginCredentials = {
  email: string
  password: string
}

export type LoginResponse = {
  token: string
}

export type ApiError = {
  errors: Array<{
    message: string
    field?: string
  }>
}

// Cross-platform token storage
export const tokenStorage = {
  async setToken(token: string): Promise<void> {
    if (Platform.OS === 'web') {
      await AsyncStorage.setItem('auth_token', token)
    } else {
      await SecureStore.setItemAsync('auth_token', token)
    }
  },

  async getToken(): Promise<string | null> {
    if (Platform.OS === 'web') {
      return await AsyncStorage.getItem('auth_token')
    } else {
      return await SecureStore.getItemAsync('auth_token')
    }
  },

  async removeToken(): Promise<void> {
    if (Platform.OS === 'web') {
      await AsyncStorage.removeItem('auth_token')
    } else {
      await SecureStore.deleteItemAsync('auth_token')
    }
  },
}

// API functions
export const authApi = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await apiClient.post('/api/auth/login', credentials)

      // Store token securely
      await tokenStorage.setToken(response.data.token)

      return response.data
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.errors?.[0]?.message ||
        error.response?.data?.message ||
        error.message ||
        'Login failed'
      throw new Error(errorMessage)
    }
  },

  async getCurrentUser(): Promise<User> {
    try {
      const response = await apiClient.get('/api/users/me')
      return response.data
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.errors?.[0]?.message ||
        error.response?.data?.message ||
        error.message ||
        'Failed to fetch user data'
      throw new Error(errorMessage)
    }
  },

  async logout(): Promise<void> {
    await tokenStorage.removeToken()
  },
}
