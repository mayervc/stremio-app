import { ticketsApi } from '@/lib/api/tickets'
import type { UserTicket } from '@/lib/api/types'
import { decodeJWT } from '@/lib/utils/decodeJWT'
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

      // Show loading toast
      Toast.show({
        type: 'info',
        text1: 'Generating Wallet Link',
        text2: 'Please wait...',
      })

      // Get Google Wallet token from backend
      const { token } = await ticketsApi.getGoogleWalletToken(ticket.id)

      // Debug: Decode and log JWT structure
      const decoded = decodeJWT(token)
      if (decoded) {
        console.log('=== JWT Header ===')
        console.log(JSON.stringify(decoded.header, null, 2))
        console.log('=== JWT Payload ===')
        console.log(JSON.stringify(decoded.payload, null, 2))

        // Check critical fields
        console.log('=== JWT Validation Checks ===')
        console.log(
          'Algorithm:',
          decoded.header.alg,
          decoded.header.alg === 'RS256' ? '✅' : '❌'
        )
        console.log(
          'Type:',
          decoded.payload.typ,
          decoded.payload.typ === 'savetowallet' ? '✅' : '❌'
        )
        console.log(
          'Audience:',
          decoded.payload.aud,
          decoded.payload.aud === 'google' ? '✅' : '❌'
        )
        console.log('Issuer:', decoded.payload.iss)

        // ⚠️ NUEVO: Verificar campo origins (crítico)
        console.log('=== Origins Check ===')
        if (decoded.payload.origins) {
          console.log('✅ Origins present:', decoded.payload.origins)
        } else {
          console.warn('⚠️ WARNING: Origins field is missing!')
        }

        if (decoded.payload.payload?.eventTicketObjects) {
          const ticketObj = decoded.payload.payload.eventTicketObjects[0]
          console.log('Ticket Object ID:', ticketObj?.id)
          console.log('Ticket Class ID:', ticketObj?.classId)
          console.log('Ticket State:', ticketObj?.state)
          console.log('Has Barcode:', !!ticketObj?.barcode)
          console.log('Barcode Value:', ticketObj?.barcode?.value)

          // Verify ValidTimeInterval (critical fix - formato ISO 8601)
          if (ticketObj?.validTimeInterval) {
            console.log('=== ValidTimeInterval (ISO 8601 Format) ===')
            const startDate = ticketObj.validTimeInterval.start?.date
            const endDate = ticketObj.validTimeInterval.end?.date

            console.log('Start date:', startDate)
            console.log('End date:', endDate)

            // Verificar formato ISO 8601 completo
            const iso8601Regex =
              /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[+-]\d{2}:\d{2}$/
            if (startDate) {
              const isStartValid = iso8601Regex.test(startDate)
              console.log(
                'Start format (ISO 8601):',
                isStartValid ? '✅' : '❌',
                isStartValid
                  ? 'Valid'
                  : 'Invalid - should be YYYY-MM-DDTHH:mm:ss±HH:mm'
              )
            }
            if (endDate) {
              const isEndValid = iso8601Regex.test(endDate)
              console.log(
                'End format (ISO 8601):',
                isEndValid ? '✅' : '❌',
                isEndValid
                  ? 'Valid'
                  : 'Invalid - should be YYYY-MM-DDTHH:mm:ss±HH:mm'
              )
            }

            if (!ticketObj.validTimeInterval.end) {
              console.warn('⚠️ WARNING: ValidTimeInterval.end is missing!')
            } else {
              console.log('✅ ValidTimeInterval.end is present')
            }

            // Verificar que NO tenga campo "time" separado (incorrecto)
            if (
              ticketObj.validTimeInterval.start?.time ||
              ticketObj.validTimeInterval.end?.time
            ) {
              console.warn(
                '⚠️ WARNING: ValidTimeInterval has separate "time" field (incorrect format)!'
              )
              console.warn(
                'Should use ISO 8601 format: YYYY-MM-DDTHH:mm:ss±HH:mm'
              )
            }
          } else {
            console.warn('⚠️ WARNING: ValidTimeInterval is missing!')
          }
        }
      } else {
        console.warn('Could not decode JWT token')
      }

      // Construct the Google Wallet URL using the token
      // ⚠️ IMPORTANTE: El JWT debe usarse directamente sin encoding/escaping
      // El token ya está en formato base64url y no debe manipularse
      const walletUrl = `https://pay.google.com/gp/v/save/${token}`

      // Verificar que el URL no rompa el JWT (no debe tener espacios, saltos de línea, etc.)
      if (walletUrl.includes(' ') || walletUrl.includes('\n')) {
        console.error(
          'ERROR: JWT token contains invalid characters (spaces or newlines)'
        )
        throw new Error('Invalid JWT token format')
      }

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
      // Fallback to downloading QR code if wallet fails
      throw error
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
