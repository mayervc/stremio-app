import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'

interface HeaderBarProps {
  userName?: string
  onSearchPress?: () => void
  onProfilePress?: () => void
}

const HeaderBar = ({
  userName = 'Sarthak',
  onSearchPress,
  onProfilePress,
}: HeaderBarProps) => {
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.greetingText}>Hey, {userName}</Text>

      <View style={styles.iconsContainer}>
        <Pressable style={styles.iconButton} onPress={onSearchPress}>
          <Ionicons name='search' size={20} color='#FFFFFF' />
        </Pressable>

        <Pressable style={styles.iconButton} onPress={onProfilePress}>
          <Ionicons name='person-outline' size={20} color='#FFFFFF' />
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
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#121011',
  },
  greetingText: {
    color: '#FFFFFF',
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
    backgroundColor: '#1E1E1E',
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default HeaderBar
