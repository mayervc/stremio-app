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
      console.log(
        '🟡 [HOOK] useUpdateProfile - Starting mutation with data:',
        JSON.stringify(data, null, 2)
      )

      // Update user profile API call
      const response = await userApi.updateProfile(data)

      console.log(
        '🟢 [HOOK] useUpdateProfile - Mutation successful, response:',
        JSON.stringify(response, null, 2)
      )
      return response
    },
    onSuccess: async response => {
      console.log(
        '🟢 [HOOK] useUpdateProfile - onSuccess called with response:',
        JSON.stringify(response, null, 2)
      )

      // Update user in store with new data
      setUser(response.user)
      console.log('🟢 [HOOK] useUpdateProfile - User updated in store')

      // Mark onboarding as completed
      setCompleted(true)
      console.log('🟢 [HOOK] useUpdateProfile - Onboarding marked as completed')
      console.log(
        '🟢 [HOOK] useUpdateProfile - OnboardingGuard will handle navigation automatically'
      )

      // Show success toast
      Toast.show({
        type: 'success',
        text1: 'Profile Updated',
        text2: 'Your profile has been updated successfully',
      })
    },
    onError: (error: Error) => {
      console.log(
        '🔴 [HOOK] useUpdateProfile - onError called with error:',
        error
      )
      console.log('🔴 [HOOK] useUpdateProfile - Error message:', error.message)
      console.log('🔴 [HOOK] useUpdateProfile - Error stack:', error.stack)

      const errorMessage = getApiError(error)
      console.log(
        '🔴 [HOOK] useUpdateProfile - Parsed error message:',
        errorMessage
      )

      // Show error toast
      Toast.show({
        type: 'error',
        text1: 'Update Failed',
        text2: errorMessage,
      })
    },
  })
}
