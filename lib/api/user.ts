import { getApiError } from '@/lib/utils/getApiError'
import { User } from '@/store/authStore'
import { apiClient } from './axios-config'

export type UpdateUserProfileData = {
  firstName?: string
  lastName?: string
  phoneNumber?: string
  city?: string
  genres?: number[]
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
      const response = await apiClient.patch('/api/users/me', data)

      return response.data
    } catch (error: any) {
      const errorMessage = getApiError(error)
      throw new Error(errorMessage)
    }
  },
}
