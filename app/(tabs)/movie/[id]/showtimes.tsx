import { Ionicons } from '@expo/vector-icons'
import { router, useLocalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'
import { Pressable, ScrollView, StyleSheet, View } from 'react-native'
import Toast from 'react-native-toast-message'

import ChooseCinemaDropdown from '@/components/choose-cinema-dropdown'
import ChooseDatePicker from '@/components/choose-date-picker'
import { ThemedSafeAreaView } from '@/components/themed-safe-area-view'
import { ThemedText } from '@/components/themed-text'
import { Colors } from '@/constants/theme'
import { useThemeColor } from '@/hooks/use-theme-color'
import { useCinemas } from '@/hooks/useCinemas'
import { useMovie } from '@/hooks/useMovies'
import { Cinema } from '@/lib/api/types'

export default function ShowtimesScreen() {
  const params = useLocalSearchParams<{ id?: string }>()
  const movieId = Number(params.id)

  const { data: movie } = useMovie(movieId)
  const {
    data: cinemasResponse,
    isLoading: isLoadingCinemas,
    isError: isCinemasError,
    error: cinemasError,
  } = useCinemas()
  const cinemas = cinemasResponse?.cinemas || []

  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return today
  })

  const [selectedCinema, setSelectedCinema] = useState<Cinema | null>(null)

  // Error handling
  useEffect(() => {
    if (isCinemasError && cinemasError) {
      Toast.show({
        type: 'error',
        text1: 'Unable to load cinemas',
        text2:
          cinemasError instanceof Error
            ? cinemasError.message
            : 'Unknown error',
      })
    }
  }, [isCinemasError, cinemasError])

  const backgroundColor = useThemeColor(
    {
      light: Colors.light.backgroundPrimary,
      dark: Colors.dark.backgroundPrimary,
    },
    'backgroundPrimary'
  )
  const iconColor = useThemeColor(
    { light: Colors.light.textPrimary, dark: Colors.dark.textPrimary },
    'textPrimary'
  )
  const buttonBackgroundColor = useThemeColor(
    { light: '#E5E5E5', dark: '#1E1E1E' },
    'background'
  )

  const handleBackPress = () => {
    router.back()
  }

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
  }

  const handleCinemaSelect = (cinema: Cinema) => {
    setSelectedCinema(cinema)
  }

  return (
    <ThemedSafeAreaView style={[styles.container, { backgroundColor }]}>
      {/* Header with back button and movie title */}
      <View style={styles.header}>
        <Pressable
          style={[
            styles.backButton,
            { backgroundColor: buttonBackgroundColor },
          ]}
          onPress={handleBackPress}
        >
          <Ionicons name='arrow-back' size={20} color={iconColor} />
        </Pressable>
        <ThemedText style={styles.movieTitle} numberOfLines={1}>
          {movie?.title || 'Movie'}
        </ThemedText>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ChooseDatePicker
          selectedDate={selectedDate}
          onDateSelect={handleDateSelect}
        />

        <ChooseCinemaDropdown
          selectedCinema={selectedCinema}
          onCinemaSelect={handleCinemaSelect}
          cinemas={cinemas}
          isLoading={isLoadingCinemas}
        />
      </ScrollView>
    </ThemedSafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  movieTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    marginHorizontal: 16,
    textAlign: 'center',
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 100,
  },
})
