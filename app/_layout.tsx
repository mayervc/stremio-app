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
import { OnboardingGuard } from '@/lib/onboarding-guard'
import { queryClient } from '@/lib/query-client'
import { initSentry } from '@/lib/sentry'
import { useAuthStore } from '@/store/authStore'
import * as Sentry from '@sentry/react-native'

// Initialize Sentry as early as possible
initSentry()

export const unstable_settings = {
  anchor: 'splash',
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
    <Sentry.TouchEventBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider
          value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
        >
          <AuthInitializer />
          <OnboardingGuard />
          <StatusBar style='auto' />
          <Stack>
            <Stack.Screen name='splash' options={{ headerShown: false }} />
            <Stack.Screen
              name='signup-success'
              options={{ headerShown: false }}
            />

            <Stack.Protected guard={isAuthenticated}>
              <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
              <Stack.Screen
                name='modal'
                options={{ presentation: 'modal', title: 'Modal' }}
              />
            </Stack.Protected>

            <Stack.Protected guard={!isAuthenticated}>
              <Stack.Screen name='login' options={{ headerShown: false }} />
              <Stack.Screen name='signup' options={{ headerShown: false }} />
              <Stack.Screen
                name='onboarding-start'
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name='onboarding-pick-genres'
                options={{ headerShown: false }}
              />
            </Stack.Protected>
          </Stack>
          <Toast />
        </ThemeProvider>
      </QueryClientProvider>
    </Sentry.TouchEventBoundary>
  )
}
