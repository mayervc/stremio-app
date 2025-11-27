import { ThemedText } from '@/components/themed-text'
import { Colors } from '@/constants/theme'
import { useThemeColor } from '@/hooks/use-theme-color'
import type { RoomLayout, Seat } from '@/lib/api/types'
import { useMemo } from 'react'
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'

interface SeatLayoutProps {
  room: RoomLayout | null
  selectedSeats: number[]
  onSeatSelect: (seatId: number) => void
  isLoading?: boolean
}

export default function SeatLayout({
  room,
  selectedSeats,
  onSeatSelect,
  isLoading = false,
}: SeatLayoutProps) {
  const textPrimaryColor = useThemeColor(
    {
      light: Colors.light.textPrimary,
      dark: Colors.dark.textPrimary,
    },
    'textPrimary'
  )
  const textSecondaryColor = useThemeColor(
    {
      light: Colors.light.textSecondary,
      dark: Colors.dark.textSecondary,
    },
    'textSecondary'
  )

  // Organize blocks into a grid structure based on blockRow and blockColumn
  const organizedBlockGrid = useMemo(() => {
    if (!room?.blocks || room.blocks.length === 0) {
      // Fallback: group by row if no blocks
      if (!room?.seats) return []

      const grouped: Record<string, Seat[]> = {}
      room.seats.forEach(seat => {
        if (!grouped[seat.row]) {
          grouped[seat.row] = []
        }
        grouped[seat.row].push(seat)
      })

      Object.keys(grouped).forEach(row => {
        grouped[row].sort((a, b) => a.number - b.number)
      })

      return [
        [
          {
            id: 0,
            blockRow: 0,
            blockColumn: 0,
            rows: Object.keys(grouped)
              .sort()
              .map(row => ({
                rowLabel: row,
                seats: grouped[row],
              })),
          },
        ],
      ]
    }

    // Group blocks by blockRow
    const blocksByRow: Record<
      number,
      Array<{
        id: number
        blockRow: number
        blockColumn: number
        rows: Array<{
          rowLabel: string
          seats: Seat[]
        }>
      }>
    > = {}

    room.blocks.forEach(block => {
      // Group seats in this block by row
      const seatsByRow: Record<string, Seat[]> = {}
      block.seats.forEach(seat => {
        if (!seatsByRow[seat.row]) {
          seatsByRow[seat.row] = []
        }
        seatsByRow[seat.row].push(seat)
      })

      // Sort seats in each row by number
      Object.keys(seatsByRow).forEach(row => {
        seatsByRow[row].sort((a, b) => a.number - b.number)
      })

      // Get sorted rows
      const sortedRowLabels = Object.keys(seatsByRow).sort()

      const organizedBlock = {
        id: block.id,
        blockRow: block.blockRow,
        blockColumn: block.blockColumn,
        rows: sortedRowLabels.map(rowLabel => ({
          rowLabel,
          seats: seatsByRow[rowLabel],
        })),
      }

      if (!blocksByRow[block.blockRow]) {
        blocksByRow[block.blockRow] = []
      }
      blocksByRow[block.blockRow].push(organizedBlock)
    })

    // Sort blocks in each row by blockColumn
    Object.keys(blocksByRow).forEach(row => {
      blocksByRow[Number(row)].sort((a, b) => a.blockColumn - b.blockColumn)
    })

    // Convert to array of rows, sorted by blockRow
    const sortedRows = Object.keys(blocksByRow)
      .map(Number)
      .sort((a, b) => a - b)
      .map(row => blocksByRow[row])

    return sortedRows
  }, [room?.blocks, room?.seats])

  const getSeatStyle = (seat: Seat) => {
    const isSelected = selectedSeats.includes(seat.id)

    if (seat.status === 'booked') {
      return [styles.seat, styles.seatBooked]
    }
    if (isSelected) {
      return [styles.seat, styles.seatSelected]
    }
    return [styles.seat, styles.seatAvailable]
  }

  const getSeatTextColor = (seat: Seat) => {
    const isSelected = selectedSeats.includes(seat.id)

    if (seat.status === 'booked') {
      return '#FFFFFF'
    }
    if (isSelected) {
      return '#FFFFFF'
    }
    return textPrimaryColor
  }

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ThemedText style={[styles.loadingText, { color: textSecondaryColor }]}>
          Loading seats...
        </ThemedText>
      </View>
    )
  }

  if (!room) {
    return (
      <View style={styles.container}>
        <ThemedText style={[styles.loadingText, { color: textSecondaryColor }]}>
          No room data available
        </ThemedText>
      </View>
    )
  }

  if (!room.seats || room.seats.length === 0) {
    return (
      <View style={styles.container}>
        <ThemedText style={[styles.loadingText, { color: textSecondaryColor }]}>
          No seats available
        </ThemedText>
        <ThemedText
          style={[
            styles.loadingText,
            { color: textSecondaryColor, fontSize: 12, marginTop: 8 },
          ]}
        >
          Room: {room.room_name} (ID: {room.room_id})
        </ThemedText>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {/* Screen */}
      <View style={styles.screenContainer}>
        <View style={styles.screenLineContainer}>
          <View style={styles.screenLine} />
        </View>
        <ThemedText style={[styles.screenText, { color: textSecondaryColor }]}>
          SCREEN
        </ThemedText>
      </View>

      {/* Seats Grid with Blocks - Scrollable */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalScrollContent}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.verticalScrollContent}
        >
          <View style={styles.seatsContainer}>
            {organizedBlockGrid.map((blockRow, rowIndex) => (
              <View key={`block-row-${rowIndex}`} style={styles.blockRow}>
                {blockRow.map((block, blockIndex) => (
                  <View
                    key={block.id}
                    style={[
                      styles.blockContainer,
                      blockIndex < blockRow.length - 1 &&
                        styles.blockSpacerRight,
                    ]}
                  >
                    {block.rows.map((rowData, seatRowIndex) => {
                      if (rowData.seats.length === 0) return null

                      return (
                        <View
                          key={`${block.id}-${rowData.rowLabel}`}
                          style={styles.row}
                        >
                          <ThemedText
                            style={[
                              styles.rowLabel,
                              { color: textSecondaryColor },
                            ]}
                          >
                            {rowData.rowLabel}
                          </ThemedText>
                          <View style={styles.seatsRow}>
                            {rowData.seats.map(seat => (
                              <TouchableOpacity
                                key={seat.id}
                                style={getSeatStyle(seat)}
                                onPress={() => {
                                  if (seat.status !== 'booked') {
                                    onSeatSelect(seat.id)
                                  }
                                }}
                                disabled={seat.status === 'booked'}
                                activeOpacity={0.7}
                              >
                                <ThemedText
                                  style={[
                                    styles.seatNumber,
                                    { color: getSeatTextColor(seat) },
                                  ]}
                                >
                                  {seat.number}
                                </ThemedText>
                              </TouchableOpacity>
                            ))}
                          </View>
                        </View>
                      )
                    })}
                  </View>
                ))}
              </View>
            ))}
          </View>
        </ScrollView>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 24,
    paddingBottom: 100,
  },
  screenContainer: {
    alignItems: 'center',
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  screenLineContainer: {
    width: '90%',
    height: 8,
    marginBottom: 12,
    overflow: 'hidden',
  },
  screenLine: {
    width: '100%',
    height: '100%',
    backgroundColor: '#47CFFF',
    borderRadius: 50,
  },
  screenText: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  horizontalScrollContent: {
    paddingHorizontal: 20,
  },
  verticalScrollContent: {
    paddingBottom: 20,
  },
  seatsContainer: {
    alignItems: 'flex-start',
    minWidth: '100%',
  },
  blockRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  blockContainer: {
    alignItems: 'flex-start',
    marginRight: 0,
  },
  blockSpacerRight: {
    marginRight: 24,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingRight: 20,
  },
  rowLabel: {
    fontSize: 13,
    fontWeight: '600',
    width: 24,
    marginRight: 8,
    textAlign: 'right',
  },
  seatsRow: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    gap: 4,
    alignItems: 'center',
  },
  seat: {
    width: 32,
    height: 32,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  seatAvailable: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#2B3543',
  },
  seatBooked: {
    backgroundColor: '#2B3543',
    borderWidth: 0,
  },
  seatSelected: {
    backgroundColor: '#47CFFF',
    borderWidth: 0,
  },
  seatNumber: {
    fontSize: 12,
    fontWeight: '600',
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
  },
})
