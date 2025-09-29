import { Colors } from '@/constants/colors'
import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'

type SocialButtonProps = {
  iconName: keyof typeof Ionicons.glyphMap
  onPress?: () => void
  disabled?: boolean
}

export function SocialButton({
  iconName,
  onPress,
  disabled = true,
}: SocialButtonProps) {
  return (
    <TouchableOpacity
      style={styles.socialButton}
      onPress={onPress}
      disabled={disabled}
    >
      <Ionicons name={iconName} size={20} color={Colors.icon.social} />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  socialButton: {
    backgroundColor: Colors.button.social,
    borderRadius: 12,
    width: 105,
    height: 51,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border.primary,
  },
})
