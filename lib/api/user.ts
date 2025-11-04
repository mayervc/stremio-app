import { getApiError } from '@/lib/utils/getApiError'
import { User } from '@/store/authStore'
import { apiClient } from './axios-config'

export type UpdateUserProfileData = {
  firstName?: string
  lastName?: string
  phoneNumber?: string
  birthday?: string
  city?: string
  genres?: string[]
}

export type UpdateUserProfileResponse = {
  user: User
}

// API functions for user operations
export const userApi = {
  async updateProfile(
    userId: number,
    data: UpdateUserProfileData
  ): Promise<UpdateUserProfileResponse> {
    try {
      const response = await apiClient.patch(`/api/users/${userId}`, data)
      return response.data
    } catch (error: any) {
      const errorMessage = getApiError(error)
      throw new Error(errorMessage)
    }
  },
}
