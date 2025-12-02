import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { Pressable, StyleSheet, View } from 'react-native'

import { ThemedSafeAreaView } from '@/components/themed-safe-area-view'
import { ThemedText } from '@/components/themed-text'
import { Colors } from '@/constants/theme'
import { useThemeColor } from '@/hooks/use-theme-color'
import { useShowtimeTickets } from '@/hooks/useShowtimeTickets'
import { useBookingStore } from '@/store/bookingStore'

export default function TicketsScreen() {
  const { bookingData } = useBookingStore()
  const showtimeId = bookingData?.selectedShowtimeId || null

  const { data: ticketsData, isLoading, error } = useShowtimeTickets(showtimeId)

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

      {/* Content will be added in next subtasks */}
      <View style={styles.content}>
        {isLoading && (
          <ThemedText style={{ color: textPrimaryColor }}>
            Loading...
          </ThemedText>
        )}
        {error && (
          <ThemedText style={{ color: textPrimaryColor }}>
            Error loading tickets
          </ThemedText>
        )}
        {ticketsData && (
          <ThemedText style={{ color: textPrimaryColor }}>
            Tickets: {ticketsData.tickets.length}
          </ThemedText>
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
    paddingHorizontal: 20,
    paddingTop: 20,
  },
})
