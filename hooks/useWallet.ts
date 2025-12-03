import type { UserTicket } from '@/lib/api/types'
import * as MediaLibrary from 'expo-media-library'
import { type RefObject } from 'react'
import { Platform, View } from 'react-native'
import Toast from 'react-native-toast-message'
import { captureRef } from 'react-native-view-shot'

/**
 * Hook to handle wallet functionality
 * For iOS: Attempts to add to Apple Wallet (requires PassKit)
 * For Android: Attempts to add to Google Wallet or downloads QR code
 * Falls back to downloading QR code image if wallet is not available
 */
export function useWallet() {
  const downloadQRCode = async (
    ticket: UserTicket,
    qrCodeRef: RefObject<View | null>
  ): Promise<void> => {
    try {
      // Request media library permissions
      const { status } = await MediaLibrary.requestPermissionsAsync()
      if (status !== 'granted') {
        Toast.show({
          type: 'error',
          text1: 'Permission Denied',
          text2: 'Please grant photo library access to save the QR code',
        })
        return
      }

      // Capture the QR code view as image
      const uri = await captureRef(qrCodeRef, {
        format: 'png',
        quality: 1.0,
      })

      // Save to media library
      await MediaLibrary.createAssetAsync(uri)

      Toast.show({
        type: 'success',
        text1: 'QR Code Saved',
        text2: 'The QR code has been saved to your photo library',
      })
    } catch (error) {
      console.error('Error saving QR code:', error)
      Toast.show({
        type: 'error',
        text1: 'Save Failed',
        text2: 'Failed to save QR code. Please try again.',
      })
    }
  }

  const addToWallet = async (
    ticket: UserTicket,
    qrCodeRef: RefObject<View | null>
  ): Promise<void> => {
    if (Platform.OS === 'ios') {
      // For iOS, we would use PassKit to add to Apple Wallet
      // Since Expo doesn't have native PassKit support, we'll fall back to downloading QR code
      // In a production app, you would need to use a native module or eject from Expo
      await downloadQRCode(ticket, qrCodeRef)
    } else if (Platform.OS === 'android') {
      // For Android, we would use Google Wallet API
      // Since Expo doesn't have native Google Wallet support, we'll fall back to downloading QR code
      // In a production app, you would need to use a native module or eject from Expo
      await downloadQRCode(ticket, qrCodeRef)
    } else {
      // For web or other platforms, just download
      await downloadQRCode(ticket, qrCodeRef)
    }
  }

  return {
    addToWallet,
    downloadQRCode,
  }
}
