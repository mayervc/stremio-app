import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  useFonts,
} from '@expo-google-fonts/poppins'
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native'
import { QueryClientProvider } from '@tanstack/react-query'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import 'react-native-reanimated'
import Toast from 'react-native-toast-message'

import { useColorScheme } from '@/hooks/use-color-scheme'
import { AuthInitializer } from '@/lib/auth-initializer'
import { queryClient } from '@/lib/query-client'
import { useAuthStore } from '@/store/authStore'

export const unstable_settings = {
  anchor: 'onboarding-1',
}

export default function RootLayout() {
  const colorScheme = useColorScheme()
  const { isAuthenticated } = useAuthStore()

  // Load Poppins fonts globally
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  })

  if (!fontsLoaded) {
    return null
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <AuthInitializer />
        <StatusBar style='auto' />
        <Stack>
          <Stack.Protected guard={isAuthenticated}>
            <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
            <Stack.Screen
              name='modal'
              options={{ presentation: 'modal', title: 'Modal' }}
            />
          </Stack.Protected>

          <Stack.Protected guard={!isAuthenticated}>
            <Stack.Screen name='login' options={{ headerShown: false }} />
            <Stack.Screen
              name='onboarding-1'
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name='onboarding-2'
              options={{ headerShown: false }}
            />
          </Stack.Protected>
        </Stack>
        <Toast />
      </ThemeProvider>
    </QueryClientProvider>
  )
}
