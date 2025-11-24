import { getApiError } from '@/lib/utils/getApiError'
import { apiClient } from './axios-config'
import type { Actor } from './types'

// API functions for actor operations
export const actorsApi = {
  async getActorById(id: number): Promise<Actor> {
    try {
      const response = await apiClient.get(`/api/actors/${id}`)
      return response.data
    } catch (error: any) {
      const errorMessage = getApiError(error)
      throw new Error(errorMessage)
    }
  },
}
