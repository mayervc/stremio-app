import { Ionicons } from '@expo/vector-icons'
import { useQueryClient } from '@tanstack/react-query'
import { format } from 'date-fns'
import { router } from 'expo-router'
import { useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'

import SeatLayout from '@/components/seat-layout'
import { ThemedSafeAreaView } from '@/components/themed-safe-area-view'
import { ThemedText } from '@/components/themed-text'
import { Colors } from '@/constants/theme'
import { useThemeColor } from '@/hooks/use-theme-color'
import { useMovie } from '@/hooks/useMovies'
import { useRoomSeats } from '@/hooks/useRoomSeats'
import { ticketsApi } from '@/lib/api/tickets'
import { useBookingStore } from '@/store/bookingStore'

export default function ChooseSeatScreen() {
  const { bookingData } = useBookingStore()
  const [selectedSeats, setSelectedSeats] = useState<number[]>([])
  const [isCreatingTickets, setIsCreatingTickets] = useState(false)
  const queryClient = useQueryClient()

  // Get movie data for image
  const { data: movie } = useMovie(bookingData?.movieId || 0)

  const { data: roomLayout, showtimeData, isLoading, error } = useRoomSeats([])

  const handleSeatSelect = (seatId: number) => {
    setSelectedSeats(prev => {
      if (prev.includes(seatId)) {
        return prev.filter(id => id !== seatId)
      }
      return [...prev, seatId]
    })
  }

  const backgroundColor = useThemeColor(
    {
      light: Colors.light.backgroundPrimary,
      dark: Colors.dark.backgroundPrimary,
    },
    'backgroundPrimary'
  )
  const iconColor = useThemeColor(
    {
      light: Colors.light.textPrimary,
      dark: Colors.dark.textPrimary,
    },
    'textPrimary'
  )
  const buttonBackgroundColor = useThemeColor(
    { light: '#E5E5E5', dark: '#1E1E1E' },
    'background'
  )
  const textPrimaryColor = useThemeColor(
    {
      light: Colors.light.textPrimary,
      dark: Colors.dark.textPrimary,
    },
    'textPrimary'
  )
  const textSecondaryColor = useThemeColor(
    {
      light: Colors.light.textSecondary,
      dark: Colors.dark.textSecondary,
    },
    'textSecondary'
  )

  const handleBackPress = () => {
    router.back()
  }

  const handleContinue = async () => {
    if (selectedSeats.length === 0 || !bookingData?.selectedShowtimeId) {
      return
    }

    setIsCreatingTickets(true)

    try {
      // Create tickets via API
      await ticketsApi.createTickets({
        showtime_id: bookingData.selectedShowtimeId,
        seats: selectedSeats,
      })

      // Invalidate and refetch showtime to get updated booked_seats
      await queryClient.invalidateQueries({
        queryKey: ['showtime', bookingData.selectedShowtimeId],
      })

      // Invalidate tickets query to fetch new tickets
      await queryClient.invalidateQueries({
        queryKey: ['showtimeTickets', bookingData.selectedShowtimeId],
      })

      // Clear selected seats
      setSelectedSeats([])

      // Navigate to tickets screen
      router.push(`/movie/${bookingData.movieId}/tickets`)
    } catch (error: any) {
      // Show error alert
      Alert.alert(
        'Error',
        error.message || 'Failed to create tickets. Please try again.',
        [{ text: 'OK' }]
      )
    } finally {
      setIsCreatingTickets(false)
    }
  }

  // Format showtime time using date-fns
  const formatShowtime = () => {
    if (!showtimeData?.start_time || !showtimeData?.end_time) return ''

    const formatTime = (time: string) => {
      const [hours, minutes] = time.split(':')
      const date = new Date()
      date.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0)
      return format(date, 'h:mm a')
    }

    return `${formatTime(showtimeData.start_time)} - ${formatTime(showtimeData.end_time)}`
  }

  // Format date
  const formatDate = () => {
    if (!bookingData?.selectedDate) return ''
    return format(bookingData.selectedDate, 'd MMM, yyyy')
  }

  // Format selected seats labels (e.g., "E4, E5")
  const formatSelectedSeatsLabels = () => {
    if (!roomLayout || selectedSeats.length === 0) return ''

    const seatLabels = selectedSeats
      .map(seatId => {
        const seat = roomLayout.seats.find(s => s.id === seatId)
        return seat ? `${seat.row}${seat.number}` : null
      })
      .filter(Boolean)
      .join(',')

    return seatLabels
  }

  const movieImage = movie?.image || movie?.image_url
  const hasSelectedSeats = selectedSeats.length > 0

  // Calculate total price
  const calculateTotalPrice = () => {
    if (!showtimeData?.ticket_price || selectedSeats.length === 0) {
      return 0
    }
    return selectedSeats.length * showtimeData.ticket_price
  }

  const totalPrice = calculateTotalPrice()
  const formattedPrice = totalPrice > 0 ? `$${totalPrice.toFixed(2)}` : ''

  return (
    <ThemedSafeAreaView style={[styles.container, { backgroundColor }]}>
      {/* Header with back button and movie info */}
      <View style={styles.headerContainer}>
        <Pressable
          style={[
            styles.backButton,
            { backgroundColor: buttonBackgroundColor },
          ]}
          onPress={handleBackPress}
        >
          <Ionicons name='arrow-back' size={20} color={iconColor} />
        </Pressable>

        {/* Movie info section */}
        <View style={styles.movieInfoContainer}>
          {movieImage && (
            <Image
              source={{ uri: movieImage }}
              style={styles.movieThumbnail}
              resizeMode='cover'
            />
          )}
          <View style={styles.movieInfoText}>
            <ThemedText
              style={[styles.movieTitle, { color: textPrimaryColor }]}
              numberOfLines={2}
            >
              {bookingData?.movieTitle || movie?.title || 'Movie'}
            </ThemedText>
            {showtimeData && (
              <ThemedText
                style={[styles.showtimeInfo, { color: textSecondaryColor }]}
              >
                {formatShowtime()} in {formatDate()}
              </ThemedText>
            )}
          </View>
        </View>
      </View>

      {/* Seat Layout */}
      <SeatLayout
        room={roomLayout || null}
        selectedSeats={selectedSeats}
        onSeatSelect={handleSeatSelect}
        isLoading={isLoading}
      />

      {/* Legend */}
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendSeat, styles.legendSeatAvailable]} />
          <ThemedText
            style={[styles.legendText, { color: textSecondaryColor }]}
          >
            Available
          </ThemedText>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendSeat, styles.legendSeatBooked]} />
          <ThemedText
            style={[styles.legendText, { color: textSecondaryColor }]}
          >
            Booked
          </ThemedText>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendSeat, styles.legendSeatSelected]} />
          <ThemedText
            style={[styles.legendText, { color: textSecondaryColor }]}
          >
            Select
          </ThemedText>
        </View>
      </View>

      {/* Footer with Continue Button */}
      <View style={styles.footerContainer}>
        <View style={styles.footerContent}>
          {hasSelectedSeats && (
            <View style={styles.selectedSeatsInfo}>
              <ThemedText
                style={[styles.selectedSeatsText, { color: textPrimaryColor }]}
              >
                {formatSelectedSeatsLabels()} SELECTED
              </ThemedText>
              {formattedPrice && (
                <ThemedText
                  style={[styles.totalPriceText, { color: '#FFD700' }]}
                >
                  {formattedPrice}
                </ThemedText>
              )}
            </View>
          )}
          <TouchableOpacity
            style={[
              styles.continueButton,
              hasSelectedSeats && !isCreatingTickets
                ? styles.continueButtonEnabled
                : styles.continueButtonDisabled,
            ]}
            onPress={handleContinue}
            disabled={!hasSelectedSeats || isCreatingTickets}
            activeOpacity={0.7}
          >
            {isCreatingTickets ? (
              <ActivityIndicator color='#FFFFFF' size='small' />
            ) : (
              <ThemedText
                style={[
                  styles.continueButtonText,
                  {
                    color:
                      hasSelectedSeats && !isCreatingTickets
                        ? '#FFFFFF'
                        : textSecondaryColor,
                  },
                ]}
              >
                Continue
              </ThemedText>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </ThemedSafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    gap: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  movieInfoContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  movieThumbnail: {
    width: 60,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#2B3543',
  },
  movieInfoText: {
    flex: 1,
    justifyContent: 'center',
  },
  movieTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  showtimeInfo: {
    fontSize: 14,
    fontWeight: '400',
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24,
    paddingTop: 12,
    paddingBottom: 12,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#2B3543',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendSeat: {
    width: 24,
    height: 24,
    borderRadius: 4,
  },
  legendSeatAvailable: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#2B3543',
  },
  legendSeatBooked: {
    backgroundColor: '#2B3543',
    borderWidth: 0,
  },
  legendSeatSelected: {
    backgroundColor: '#47CFFF',
    borderWidth: 0,
  },
  legendText: {
    fontSize: 12,
    fontWeight: '400',
  },
  footerContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: '#2B3543',
  },
  footerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16,
  },
  selectedSeatsInfo: {
    flex: 1,
  },
  selectedSeatsText: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  totalPriceText: {
    fontSize: 24,
    fontWeight: '700',
  },
  continueButton: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueButtonEnabled: {
    backgroundColor: '#FF3B30',
  },
  continueButtonDisabled: {
    backgroundColor: '#2B3543',
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
})
