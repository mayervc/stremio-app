import {
  type UpdateUserProfileData,
  type UpdateUserProfileResponse,
  userApi,
} from '@/lib/api/user'
import { getApiError } from '@/lib/utils/getApiError'
import { useAuthStore } from '@/store/authStore'
import { useOnboardingStore } from '@/store/onboardingStore'
import { useMutation } from '@tanstack/react-query'
import Toast from 'react-native-toast-message'

export function useUpdateProfile() {
  const { setUser } = useAuthStore()
  const { setCompleted } = useOnboardingStore()

  return useMutation({
    mutationFn: async (
      data: UpdateUserProfileData
    ): Promise<UpdateUserProfileResponse> => {
      // Update user profile API call
      const response = await userApi.updateProfile(data)
      return response
    },
    onSuccess: async response => {
      // Update user in store with new data
      setUser(response.user)

      // Mark onboarding as completed
      setCompleted(true)

      // Show success toast
      Toast.show({
        type: 'success',
        text1: 'Profile Updated',
        text2: 'Your profile has been updated successfully',
      })
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
