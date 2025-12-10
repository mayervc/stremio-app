import { useGoogleWalletToken } from '@/hooks/useGoogleWalletToken'
import type { UserTicket } from '@/lib/api/types'
import * as Linking from 'expo-linking'
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
  const { mutateAsync: getGoogleWalletToken } = useGoogleWalletToken()

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

  const addToGoogleWallet = async (ticket: UserTicket): Promise<void> => {
    try {
      // Check if ticket has an ID
      if (!ticket.id) {
        console.warn('Ticket ID is missing. Ticket data:', ticket)
        throw new Error('Ticket ID is required to add to Google Wallet')
      }

      Toast.show({
        type: 'info',
        text1: 'Generating Wallet Link',
        text2: 'Please wait...',
      })

      const { token } = await getGoogleWalletToken(ticket.id)

      const walletUrl = `https://pay.google.com/gp/v/save/${token}`

      // Open the Google Wallet link
      const canOpen = await Linking.canOpenURL(walletUrl)
      if (canOpen) {
        await Linking.openURL(walletUrl)
        Toast.show({
          type: 'success',
          text1: 'Opening Google Wallet',
          text2: 'Add the ticket to your wallet',
        })
      } else {
        throw new Error('Cannot open Google Wallet link')
      }
    } catch (error: any) {
      console.error('Error adding to Google Wallet:', error)
      Toast.show({
        type: 'error',
        text1: 'Failed to Add to Wallet',
        text2: error.message || 'Please try again later',
      })
    }
  }

  const addToWallet = async (
    ticket: UserTicket,
    qrCodeRef: RefObject<View | null>
  ): Promise<void> => {
    if (Platform.OS === 'android') {
      // Check if ticket has ID before attempting Google Wallet
      if (!ticket.id) {
        // If no ID, directly download QR code (backend not returning ticket ID)
        console.warn('Ticket ID missing, falling back to QR code download')
        Toast.show({
          type: 'info',
          text1: 'Downloading QR Code',
          text2: 'Ticket ID not available from server',
        })
        await downloadQRCode(ticket, qrCodeRef)
        return
      }

      try {
        // Try to add to Google Wallet first
        await addToGoogleWallet(ticket)
      } catch (error) {
        // Fallback to downloading QR code if Google Wallet fails
        Toast.show({
          type: 'info',
          text1: 'Wallet Unavailable',
          text2: 'Downloading QR code instead',
        })
        await downloadQRCode(ticket, qrCodeRef)
      }
    } else if (Platform.OS === 'ios') {
      // For iOS, we would use PassKit to add to Apple Wallet
      // Since Expo doesn't have native PassKit support, we'll fall back to downloading QR code
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
