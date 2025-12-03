import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { useEffect, useRef, useState } from 'react'
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'
import Toast from 'react-native-toast-message'

import { ThemedSafeAreaView } from '@/components/themed-safe-area-view'
import { ThemedText } from '@/components/themed-text'
import TicketStack from '@/components/ticket-stack'
import { Colors } from '@/constants/theme'
import { useThemeColor } from '@/hooks/use-theme-color'
import { useShowtimeTickets } from '@/hooks/useShowtimeTickets'
import { useWallet } from '@/hooks/useWallet'
import type { UserTicket } from '@/lib/api/types'
import { getApiError } from '@/lib/utils/getApiError'
import { useBookingStore } from '@/store/bookingStore'

export default function TicketsScreen() {
  const { bookingData } = useBookingStore()
  const showtimeId = bookingData?.selectedShowtimeId || null

  const { data: ticketsData, isLoading, error } = useShowtimeTickets(showtimeId)
  const { addToWallet } = useWallet()
  const [currentTicket, setCurrentTicket] = useState<UserTicket | null>(null)
  const ticketRef = useRef<View>(null)

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

  // Set first ticket as current when tickets are loaded
  useEffect(() => {
    if (ticketsData && ticketsData.tickets.length > 0 && !currentTicket) {
      setCurrentTicket(ticketsData.tickets[0])
    }
  }, [ticketsData, currentTicket])

  // Display backend error using toast
  useEffect(() => {
    if (error) {
      const errorMessage = getApiError(error)
      Toast.show({
        type: 'error',
        text1: 'Error loading tickets',
        text2: errorMessage,
      })
    }
  }, [error])

  const handleAddToWallet = async () => {
    if (!currentTicket || !ticketRef.current) {
      Toast.show({
        type: 'error',
        text1: 'No Ticket Selected',
        text2: 'Please select a ticket to add to wallet',
      })
      return
    }

    await addToWallet(currentTicket, ticketRef)
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
              Please try again later
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
              <>
                <View style={styles.ticketRefContainer}>
                  <TicketStack
                    tickets={ticketsData.tickets}
                    onCurrentTicketChange={setCurrentTicket}
                    ticketRef={ticketRef}
                  />
                </View>
                {/* Add to Wallet Button */}
                <View style={styles.footerContainer}>
                  <TouchableOpacity
                    style={styles.addToWalletButton}
                    onPress={handleAddToWallet}
                    activeOpacity={0.8}
                  >
                    <ThemedText style={styles.addToWalletText}>
                      Add to wallet
                    </ThemedText>
                  </TouchableOpacity>
                </View>
              </>
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
  ticketRefContainer: {
    flex: 1,
    paddingTop: 0, // No top padding to move tickets as high as possible
  },
  footerContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    paddingTop: 10,
  },
  addToWalletButton: {
    backgroundColor: '#E53935', // Red color as shown in the image
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addToWalletText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
})
