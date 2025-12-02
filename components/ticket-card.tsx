import { format } from 'date-fns'
import { StyleSheet, View } from 'react-native'
import QRCode from 'react-native-qrcode-svg'

import { ThemedText } from '@/components/themed-text'
import type { UserTicket } from '@/lib/api/types'

interface TicketCardProps {
  ticket: UserTicket
  ticketPrice?: number
  index: number
  totalTickets: number
}

export default function TicketCard({
  ticket,
  ticketPrice,
  index,
  totalTickets,
}: TicketCardProps) {
  // Format date from "YYYY-MM-DD" to "d MMM, yyyy" (e.g., "24 May, 2025")
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString)
      return format(date, 'd MMM, yyyy')
    } catch {
      return dateString
    }
  }

  // Format time from "HH:mm" to "h:mm a" (e.g., "8:30 AM")
  const formatTime = (timeString: string): string => {
    try {
      const [hours, minutes] = timeString.split(':')
      const date = new Date()
      date.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0)
      return format(date, 'h:mm a')
    } catch {
      return timeString
    }
  }

  // Generate QR code data with all ticket information
  // Format: Human-readable text + JSON for systems
  const formatTimeForQR = (timeString: string): string => {
    try {
      const [hours, minutes] = timeString.split(':')
      const date = new Date()
      date.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0)
      return format(date, 'h:mm a')
    } catch {
      return timeString
    }
  }

  const formatDateForQR = (dateString: string): string => {
    try {
      const date = new Date(dateString)
      return format(date, 'MMM d, yyyy')
    } catch {
      return dateString
    }
  }

  // Create human-readable text
  const humanReadableText = `TICKET
Movie: ${ticket.movie_title}
Cinema: ${ticket.cinema_name}
Room: ${ticket.room_name}
Date: ${formatDateForQR(ticket.showtime_date)}
Time: ${formatTimeForQR(ticket.showtime_time)}
Seat: ${ticket.seat_label}${ticketPrice !== undefined ? `\nPrice: $${ticketPrice.toFixed(2)}` : ''}`

  // Create JSON data for systems
  const jsonData = JSON.stringify({
    movie_title: ticket.movie_title,
    cinema_name: ticket.cinema_name,
    room_name: ticket.room_name,
    showtime_date: ticket.showtime_date,
    showtime_time: ticket.showtime_time,
    seat_label: ticket.seat_label,
    ...(ticketPrice !== undefined && { ticket_price: ticketPrice }),
  })

  // Combine both formats - systems can parse JSON, humans can read text
  const qrData = `${humanReadableText}\n\n---DATA---\n${jsonData}`

  return (
    <View style={styles.ticketContainer}>
      {/* QR Code Section (White Background) */}
      <View style={styles.qrSection}>
        <QRCode
          value={qrData}
          size={300}
          backgroundColor='#FFFFFF'
          color='#000000'
          ecl='H' // High error correction level for better scan reliability
          quietZone={10} // Padding around QR code for better scanning
        />
      </View>

      {/* Ticket Details Section (Dark Blue Background) */}
      <View style={styles.detailsSection}>
        {/* Movie Title */}
        <ThemedText style={styles.movieTitle} numberOfLines={2}>
          {ticket.movie_title}
        </ThemedText>

        {/* Theatre */}
        <View style={styles.detailRow}>
          <ThemedText style={styles.label}>THEATRE</ThemedText>
          <ThemedText style={styles.value}>{ticket.cinema_name}</ThemedText>
        </View>

        {/* Date and Time */}
        <View style={styles.detailRow}>
          <View style={styles.detailColumn}>
            <ThemedText style={styles.label}>DATE</ThemedText>
            <ThemedText style={styles.value}>
              {formatDate(ticket.showtime_date)}
            </ThemedText>
          </View>
          <View style={styles.detailColumn}>
            <ThemedText style={styles.label}>TIME</ThemedText>
            <ThemedText style={styles.value}>
              {formatTime(ticket.showtime_time)}
            </ThemedText>
          </View>
        </View>

        {/* Room and Seat */}
        <View style={styles.detailRow}>
          <View style={styles.detailColumn}>
            <ThemedText style={styles.label}>ROOM</ThemedText>
            <ThemedText style={styles.value}>{ticket.room_name}</ThemedText>
          </View>
          <View style={styles.detailColumn}>
            <ThemedText style={styles.label}>SEAT</ThemedText>
            <ThemedText style={styles.value}>{ticket.seat_label}</ThemedText>
          </View>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  ticketContainer: {
    width: 320,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
  },
  qrSection: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 340, // Increased to accommodate larger QR code
  },
  detailsSection: {
    backgroundColor: '#2B3543', // Dark gray-blue color
    padding: 20,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  movieTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  detailColumn: {
    flex: 1,
  },
  label: {
    fontSize: 11,
    fontWeight: '500',
    color: '#B0BEC5', // Light grey
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
})
