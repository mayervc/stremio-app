import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native'

import { ThemedSafeAreaView } from '@/components/themed-safe-area-view'
import { ThemedText } from '@/components/themed-text'
import TicketStack from '@/components/ticket-stack'
import { Colors } from '@/constants/theme'
import { useThemeColor } from '@/hooks/use-theme-color'
import { useShowtime } from '@/hooks/useShowtime'
import { useShowtimeTickets } from '@/hooks/useShowtimeTickets'
import { useBookingStore } from '@/store/bookingStore'

export default function TicketsScreen() {
  const { bookingData } = useBookingStore()
  const showtimeId = bookingData?.selectedShowtimeId || null

  const { data: ticketsData, isLoading, error } = useShowtimeTickets(showtimeId)
  const { data: showtimeData } = useShowtime(showtimeId)

  const ticketPrice = showtimeData?.ticket_price

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

  const handleBackPress = () => {
    router.back()
  }

  return (
    <ThemedSafeAreaView style={[styles.container, { backgroundColor }]}>
      {/* Header with back button and Tickets title */}
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
        <ThemedText
          style={[styles.title, { color: textPrimaryColor }]}
          numberOfLines={1}
        >
          Tickets
        </ThemedText>
        <View style={styles.placeholder} />
      </View>

      {/* Tickets Content */}
      <View style={styles.content}>
        {isLoading && (
          <View style={styles.centerContainer}>
            <ActivityIndicator size='large' color={textPrimaryColor} />
            <ThemedText
              style={[styles.loadingText, { color: textPrimaryColor }]}
            >
              Loading tickets...
            </ThemedText>
          </View>
        )}
        {error && (
          <View style={styles.centerContainer}>
            <Ionicons
              name='alert-circle-outline'
              size={48}
              color={textPrimaryColor}
            />
            <ThemedText style={[styles.errorText, { color: textPrimaryColor }]}>
              Error loading tickets
            </ThemedText>
            <ThemedText
              style={[styles.errorSubtext, { color: textPrimaryColor }]}
            >
              {error instanceof Error
                ? error.message
                : 'Unknown error occurred'}
            </ThemedText>
          </View>
        )}
        {!isLoading && !error && ticketsData && (
          <>
            {ticketsData.tickets.length === 0 ? (
              <View style={styles.centerContainer}>
                <Ionicons
                  name='ticket-outline'
                  size={48}
                  color={textPrimaryColor}
                />
                <ThemedText
                  style={[styles.emptyText, { color: textPrimaryColor }]}
                >
                  No tickets found
                </ThemedText>
                <ThemedText
                  style={[styles.emptySubtext, { color: textPrimaryColor }]}
                >
                  You don't have any tickets for this showtime
                </ThemedText>
              </View>
            ) : (
              <TicketStack
                tickets={ticketsData.tickets}
                ticketPrice={ticketPrice}
              />
            )}
          </>
        )}
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
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: '600',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '500',
  },
  errorText: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  errorSubtext: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '400',
    textAlign: 'center',
  },
  emptyText: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  emptySubtext: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '400',
    textAlign: 'center',
  },
})
