import { authApi } from '@/lib/api/auth'
import {
  type UpdateUserProfileData,
  type UpdateUserProfileResponse,
  userApi,
} from '@/lib/api/user'
import { tokenStorage } from '@/lib/secure-store'
import { getApiError } from '@/lib/utils/getApiError'
import { useAuthStore } from '@/store/authStore'
import { useOnboardingStore } from '@/store/onboardingStore'
import { useMutation } from '@tanstack/react-query'
import { router } from 'expo-router'
import Toast from 'react-native-toast-message'

export function useUpdateProfile() {
  const { user, setUser, login } = useAuthStore()
  const { setCompleted, setSelectedGenres } = useOnboardingStore()

  return useMutation({
    mutationFn: async (
      data: UpdateUserProfileData
    ): Promise<UpdateUserProfileResponse> => {
      // Ensure we have a user context; fetch if necessary
      const currentUser = user ?? (await authApi.getCurrentUser())

      if (!currentUser?.id) {
        throw new Error('User not authenticated')
      }

      // Update user profile API call
      const response = await userApi.updateProfile(currentUser.id, data)
      return response
    },
    onSuccess: async response => {
      // Refresh user data to ensure store reflects latest profile
      const updatedUser = await authApi.getCurrentUser()
      const token = await tokenStorage.getToken()

      if (updatedUser && token) {
        login(updatedUser, token)
      } else if (updatedUser) {
        setUser(updatedUser)
      }

      // Mark onboarding as completed
      setCompleted(true)
      setSelectedGenres([])

      // Show success toast
      Toast.show({
        type: 'success',
        text1: 'Profile Updated',
        text2: 'Your profile has been updated successfully',
      })

      router.replace('/(tabs)')
    },
    onError: (error: Error) => {
      const errorMessage = getApiError(error)

      // Show error toast
      Toast.show({
        type: 'error',
        text1: 'Update Failed',
        text2: errorMessage,
      })
    },
  })
}
