import { Ionicons } from '@expo/vector-icons'
import { router, useLocalSearchParams } from 'expo-router'
import { useMemo, useState } from 'react'
import {
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'

import ChooseCinemaDropdown from '@/components/choose-cinema-dropdown'
import ChooseDatePicker from '@/components/choose-date-picker'
import ShowtimeList from '@/components/showtime-list'
import { ThemedSafeAreaView } from '@/components/themed-safe-area-view'
import { ThemedText } from '@/components/themed-text'
import { Colors } from '@/constants/theme'
import { useThemeColor } from '@/hooks/use-theme-color'
import { useMovie } from '@/hooks/useMovies'
import { Cinema } from '@/lib/api/types'
import { useBookingStore } from '@/store/bookingStore'

export default function ShowtimesScreen() {
  const params = useLocalSearchParams<{ id?: string }>()
  const movieId = Number(params.id)

  const { data: movie } = useMovie(movieId)

  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return today
  })

  const [selectedCinema, setSelectedCinema] = useState<Cinema | null>(null)
  const [selectedShowtimeId, setSelectedShowtimeId] = useState<number | null>(
    null
  )
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null)

  const { setBookingData } = useBookingStore()

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

  const handleShowtimeSelect = (showtimeId: number, roomId: number) => {
    setSelectedShowtimeId(showtimeId)
    setSelectedRoomId(roomId)
  }

  // Validate if all required fields are selected
  const isBookingValid = useMemo(() => {
    return (
      !!selectedDate &&
      !!selectedCinema &&
      !!selectedShowtimeId &&
      !!selectedRoomId &&
      !!movieId
    )
  }, [
    selectedDate,
    selectedCinema,
    selectedShowtimeId,
    selectedRoomId,
    movieId,
  ])

  const buttonPrimaryColor = useThemeColor(
    { light: Colors.light.buttonPrimary, dark: Colors.dark.buttonPrimary },
    'buttonPrimary'
  )
  const borderColor = useThemeColor(
    { light: Colors.light.borderPrimary, dark: Colors.dark.borderPrimary },
    'borderPrimary'
  )

  const handleBookTickets = () => {
    if (!isBookingValid) {
      return
    }

    // isBookingValid already validates all required fields are non-null
    setBookingData({
      movieId,
      movieTitle: movie?.title,
      selectedDate,
      selectedCinema: selectedCinema!,
      selectedShowtimeId: selectedShowtimeId!,
      roomId: selectedRoomId!,
    })

    // TODO: Navigate to seat selection or booking screen
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
        />

        <ShowtimeList
          movieId={movieId}
          selectedCinema={selectedCinema}
          selectedDate={selectedDate}
          selectedShowtimeId={selectedShowtimeId}
          onShowtimeSelect={handleShowtimeSelect}
        />
      </ScrollView>

      {/* Book Tickets Button */}
      <View style={[styles.buttonContainer, { borderTopColor: borderColor }]}>
        <TouchableOpacity
          style={[
            styles.bookButton,
            {
              backgroundColor: isBookingValid ? buttonPrimaryColor : '#2B3543',
            },
          ]}
          onPress={handleBookTickets}
          disabled={!isBookingValid}
          activeOpacity={0.8}
        >
          <ThemedText style={styles.bookButtonText}>Book Tickets</ThemedText>
        </TouchableOpacity>
      </View>
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
  buttonContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
  },
  bookButton: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
})
