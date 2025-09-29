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

import { useColorScheme } from '@/hooks/use-color-scheme'
import { queryClient } from '@/lib/query-client'

export const unstable_settings = {
  anchor: 'login',
}

export default function RootLayout() {
  const colorScheme = useColorScheme()

  // Cargar fuentes Poppins globalmente
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  })

  if (!fontsLoaded) {
    return null // O un componente de carga
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name='login' options={{ headerShown: false }} />
          <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
          <Stack.Screen
            name='modal'
            options={{ presentation: 'modal', title: 'Modal' }}
          />
        </Stack>
        <StatusBar style='auto' />
      </ThemeProvider>
    </QueryClientProvider>
  )
}
