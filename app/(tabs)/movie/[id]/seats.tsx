import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { Pressable, StyleSheet, View } from 'react-native'

import { ThemedSafeAreaView } from '@/components/themed-safe-area-view'
import { ThemedText } from '@/components/themed-text'
import { Colors } from '@/constants/theme'
import { useThemeColor } from '@/hooks/use-theme-color'
import { useBookingStore } from '@/store/bookingStore'

export default function ChooseSeatScreen() {
  const { bookingData } = useBookingStore()

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
        <ThemedText
          style={[styles.movieTitle, { color: textPrimaryColor }]}
          numberOfLines={1}
        >
          {bookingData?.movieTitle || 'Movie'}
        </ThemedText>
        <View style={styles.placeholder} />
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
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
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
})
