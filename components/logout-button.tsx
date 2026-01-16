import { Colors } from '@/constants/colors'
import { AnalyticsEvents, logEvent, resetAnalytics } from '@/lib/analytics'
import { authApi } from '@/lib/api/auth'
import { addBreadcrumb, clearUserContext } from '@/lib/sentry'
import { useAuthStore } from '@/store/authStore'
import { router } from 'expo-router'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import Toast from 'react-native-toast-message'

export function LogoutButton() {
  const { logout, setLoading } = useAuthStore()

  const handleLogout = async () => {
    try {
      setLoading(true)

      // Call logout API
      await authApi.logout()

      // Clear auth state
      logout()

      // Track logout event
      await logEvent(AnalyticsEvents.LOGOUT)

      // Reset Analytics data
      await resetAnalytics()

      // Clear Sentry user context
      clearUserContext()
      addBreadcrumb({
        message: 'User logged out',
        category: 'auth',
        level: 'info',
      })

      // Show success toast
      Toast.show({
        type: 'success',
        text1: 'Logged Out',
        text2: 'You have been successfully logged out',
      })

      // Navigate to login
      router.replace('/login')
    } catch (error) {
      console.error('Logout error:', error)
      Toast.show({
        type: 'error',
        text1: 'Logout Failed',
        text2: 'An error occurred during logout. Please try again.',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <TouchableOpacity style={styles.button} onPress={handleLogout}>
      <Text style={styles.buttonText}>Logout</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.button.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: Colors.text.primary,
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
  },
})
