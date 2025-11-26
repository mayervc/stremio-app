import { Ionicons } from '@expo/vector-icons'
import { format } from 'date-fns'
import { useMemo } from 'react'
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'

import { ThemedText } from '@/components/themed-text'
import { Colors } from '@/constants/theme'
import { useThemeColor } from '@/hooks/use-theme-color'
import { useShowtimes } from '@/hooks/useShowtimes'
import { Cinema, ShowtimeRoom, ShowtimeSearchParams } from '@/lib/api/types'

interface ShowtimeListProps {
  movieId: number
  selectedCinema: Cinema | null
  selectedDate: Date
  selectedShowtimeId?: number | null
  onShowtimeSelect?: (showtimeId: number, roomId: number) => void
}

export default function ShowtimeList({
  movieId,
  selectedCinema,
  selectedDate,
  selectedShowtimeId = null,
  onShowtimeSelect,
}: ShowtimeListProps) {
  // Format date as YYYY-MM-DD for API
  const formattedDate = useMemo(() => {
    return format(selectedDate, 'yyyy-MM-dd')
  }, [selectedDate])

  // Build search params for showtimes
  const showtimeParams = useMemo<ShowtimeSearchParams>(() => {
    const params: ShowtimeSearchParams = {}

    if (movieId) {
      params.movie_id = movieId
    }
    if (selectedCinema?.id) {
      params.cinema_id = selectedCinema.id
    }
    if (formattedDate) {
      params.date = formattedDate
    }

    return params
  }, [movieId, selectedCinema?.id, formattedDate])

  const {
    data: showtimesResponse,
    isLoading: isLoadingShowtimes,
    isError: isShowtimesError,
    error: showtimesError,
  } = useShowtimes(showtimeParams)

  const rooms: ShowtimeRoom[] = showtimesResponse?.showtimes || []
  const hasCinemaSelected = !!selectedCinema
  const textPrimaryColor = useThemeColor(
    { light: Colors.light.textPrimary, dark: Colors.dark.textPrimary },
    'textPrimary'
  )
  const cardBackgroundColor = useThemeColor(
    {
      light: Colors.light.backgroundSecondary,
      dark: Colors.dark.backgroundSecondary,
    },
    'backgroundSecondary'
  )
  const borderPrimaryColor = useThemeColor(
    { light: Colors.light.borderPrimary, dark: Colors.dark.borderPrimary },
    'borderPrimary'
  )
  const accentColor = useThemeColor(
    { light: Colors.light.buttonPrimary, dark: Colors.dark.buttonPrimary },
    'buttonPrimary'
  )

  if (isLoadingShowtimes) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size='large' color={accentColor} />
        <ThemedText style={[styles.loadingText, { color: textPrimaryColor }]}>
          Loading showtimes...
        </ThemedText>
      </View>
    )
  }

  // Don't show showtimes if no cinema is selected
  if (!hasCinemaSelected) {
    return null
  }

  if (isShowtimesError) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons
          name='alert-circle-outline'
          size={48}
          color={textPrimaryColor}
        />
        <ThemedText style={[styles.emptyText, { color: textPrimaryColor }]}>
          Error loading showtimes
        </ThemedText>
        <ThemedText style={[styles.emptySubtext, { color: textPrimaryColor }]}>
          {showtimesError instanceof Error
            ? showtimesError.message
            : 'Unknown error occurred'}
        </ThemedText>
      </View>
    )
  }

  if (rooms.length === 0 && !isLoadingShowtimes) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name='time-outline' size={48} color={textPrimaryColor} />
        <ThemedText style={[styles.emptyText, { color: textPrimaryColor }]}>
          No showtimes available
        </ThemedText>
        <ThemedText style={[styles.emptySubtext, { color: textPrimaryColor }]}>
          There are no showtimes available for the selected date and cinema
        </ThemedText>
      </View>
    )
  }

  // Format time from "HH:mm" to "H:MM AM/PM" using date-fns
  const formatTime = (time: string): string => {
    const [hours, minutes] = time.split(':')
    const date = new Date()
    date.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0)
    return format(date, 'h:mm a')
  }

  return (
    <View style={styles.section}>
      {rooms.map(room => (
        <View key={room.id} style={styles.roomContainer}>
          <ThemedText style={[styles.roomName, { color: textPrimaryColor }]}>
            {room.room_name}
          </ThemedText>
          <View style={styles.showtimesContainer}>
            {room.showtimes.map(showtime => {
              const isSelected = selectedShowtimeId === showtime.id
              const isFull = showtime.room_seats - showtime.booked_seats === 0

              return (
                <TouchableOpacity
                  key={showtime.id}
                  style={[
                    styles.showtimeButton,
                    {
                      backgroundColor: isSelected ? '#47CFFF' : '#2B3543',
                    },
                  ]}
                  onPress={() =>
                    !isFull && onShowtimeSelect?.(showtime.id, showtime.room_id)
                  }
                  disabled={isFull}
                >
                  <ThemedText
                    style={[styles.showtimeText, { color: '#FFFFFF' }]}
                  >
                    {formatTime(showtime.start_time)}
                  </ThemedText>
                  {isSelected && <View style={styles.selectedIndicator} />}
                </TouchableOpacity>
              )
            })}
          </View>
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 32,
  },
  roomContainer: {
    marginBottom: 24,
  },
  roomName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
    opacity: 0.7,
  },
  showtimesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  showtimeButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  showtimeText: {
    fontSize: 14,
    fontWeight: '500',
  },
  selectedIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#FFFFFF',
  },
})
