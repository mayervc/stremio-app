import { tokenStorage } from '@/lib/secure-store'
import { getApiError } from '@/lib/utils/getApiError'
import { User } from '@/store/authStore'
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

// API functions
export const authApi = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await apiClient.post('/api/auth/login', credentials)

      // Store token securely
      await tokenStorage.setToken(response.data.token)

      return response.data
    } catch (error: any) {
      const errorMessage = getApiError(error)
      throw new Error(errorMessage)
    }
  },

  async getCurrentUser(): Promise<User> {
    try {
      const response = await apiClient.get('/api/users/me')
      return response.data
    } catch (error: any) {
      const errorMessage = getApiError(error)
      throw new Error(errorMessage)
    }
  },

  async logout(): Promise<void> {
    await tokenStorage.removeToken()
  },
}
