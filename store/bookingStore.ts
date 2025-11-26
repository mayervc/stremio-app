import { Cinema } from '@/lib/api/types'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export type BookingData = {
  movieId: number
  movieTitle?: string
  selectedDate: Date
  selectedCinema: Cinema
  selectedShowtimeId: number
  roomId: number
}

type BookingState = {
  bookingData: BookingData | null
  setBookingData: (data: BookingData) => void
  clearBookingData: () => void
}

export const useBookingStore = create<BookingState>()(
  persist(
    set => ({
      bookingData: null,
      setBookingData: data => set({ bookingData: data }),
      clearBookingData: () => set({ bookingData: null }),
    }),
    {
      name: 'booking-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: state => ({
        bookingData: state.bookingData
          ? {
              ...state.bookingData,
              selectedDate: state.bookingData.selectedDate.toISOString(),
            }
          : null,
      }),
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.warn('Error rehydrating booking store', error)
          return
        }
        // Convert date string back to Date object after rehydration
        if (state?.bookingData) {
          const bookingData = state.bookingData as any
          if (
            bookingData.selectedDate &&
            typeof bookingData.selectedDate === 'string'
          ) {
            state.bookingData = {
              ...bookingData,
              selectedDate: new Date(bookingData.selectedDate),
            }
          }
        }
      },
    }
  )
)
