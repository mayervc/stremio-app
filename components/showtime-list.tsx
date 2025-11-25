import { Ionicons } from '@expo/vector-icons'
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'

import { ThemedText } from '@/components/themed-text'
import { Colors } from '@/constants/theme'
import { useThemeColor } from '@/hooks/use-theme-color'
import { ShowtimeRoom } from '@/lib/api/types'

interface ShowtimeListProps {
  rooms: ShowtimeRoom[]
  isLoading?: boolean
  isError?: boolean
  error?: Error | null
  hasCinemaSelected?: boolean
  selectedShowtimeId?: number | null
  onShowtimeSelect?: (showtimeId: number, roomId: number) => void
}

export default function ShowtimeList({
  rooms,
  isLoading = false,
  isError = false,
  error = null,
  hasCinemaSelected = false,
  selectedShowtimeId = null,
  onShowtimeSelect,
}: ShowtimeListProps) {
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

  if (isLoading) {
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

  if (isError) {
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
          {error instanceof Error ? error.message : 'Unknown error occurred'}
        </ThemedText>
      </View>
    )
  }

  if (rooms.length === 0 && !isLoading) {
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

  // Format time from "HH:mm" to "H:MM AM/PM"
  const formatTime = (time: string): string => {
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours, 10)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
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
