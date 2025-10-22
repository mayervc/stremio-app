import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { Pressable, StyleSheet, View } from 'react-native'

import { ThemedText } from '@/components/themed-text'
import { useThemeColor } from '@/hooks/use-theme-color'
import { useAuthStore } from '@/store/authStore'

interface HeaderBarProps {
  onSearchPress?: () => void
  onProfilePress?: () => void
}

const HeaderBar = ({
  onSearchPress = () => console.log('Search pressed'),
  onProfilePress = () => console.log('Profile pressed'),
}: HeaderBarProps) => {
  const { user } = useAuthStore()
  const iconColor = useThemeColor({ light: '#000000', dark: '#FFFFFF' }, 'text')
  const buttonBackgroundColor = useThemeColor(
    { light: '#E5E5E5', dark: '#1E1E1E' },
    'background'
  )

  return (
    <View style={styles.headerContainer}>
      <ThemedText style={styles.greetingText}>
        Hey, {user?.firstName || 'User'}
      </ThemedText>

      <View style={styles.iconsContainer}>
        <Pressable
          style={[
            styles.iconButton,
            { backgroundColor: buttonBackgroundColor },
          ]}
          onPress={onSearchPress}
        >
          <Ionicons name='search' size={20} color={iconColor} />
        </Pressable>

        <Pressable
          style={[
            styles.iconButton,
            { backgroundColor: buttonBackgroundColor },
          ]}
          onPress={onProfilePress}
        >
          <Ionicons name='person-outline' size={20} color={iconColor} />
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  greetingText: {
    fontSize: 24,
    fontWeight: '600',
  },
  iconsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default HeaderBar
