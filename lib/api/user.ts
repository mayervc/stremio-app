import { getApiError } from '@/lib/utils/getApiError'
import { User } from '@/store/authStore'
import { apiClient } from './axios-config'

export type UpdateUserProfileData = {
  firstName?: string
  lastName?: string
  phoneNumber?: string
  city?: string
  genres?: string[]
}

export type UpdateUserProfileResponse = {
  user: User
}

// API functions for user operations
export const userApi = {
  async updateProfile(
    data: UpdateUserProfileData
  ): Promise<UpdateUserProfileResponse> {
    try {
      console.log(
        '🔵 [API] updateProfile - Request data:',
        JSON.stringify(data, null, 2)
      )
      console.log(
        '🔵 [API] updateProfile - Making PATCH request to /api/users/me'
      )

      const response = await apiClient.patch('/api/users/me', data)

      console.log('🟢 [API] updateProfile - Response status:', response.status)
      console.log(
        '🟢 [API] updateProfile - Response data:',
        JSON.stringify(response.data, null, 2)
      )

      return response.data
    } catch (error: any) {
      console.log('🔴 [API] updateProfile - Error occurred:', error)
      console.log(
        '🔴 [API] updateProfile - Error response:',
        error.response?.data
      )
      console.log(
        '🔴 [API] updateProfile - Error status:',
        error.response?.status
      )
      console.log(
        '🔴 [API] updateProfile - Error headers:',
        error.response?.headers
      )

      const errorMessage = getApiError(error)
      console.log(
        '🔴 [API] updateProfile - Parsed error message:',
        errorMessage
      )

      throw new Error(errorMessage)
    }
  },
}
