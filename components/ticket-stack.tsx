import { useRef } from 'react'
import {
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native'
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated'

import TicketCard from '@/components/ticket-card'
import type { UserTicket } from '@/lib/api/types'

interface TicketStackProps {
  tickets: UserTicket[]
}

interface AnimatedTicketItemProps {
  ticket: UserTicket
  index: number
  totalTickets: number
  scrollY: SharedValue<number>
}

const { width: SCREEN_WIDTH } = Dimensions.get('window')
const TICKET_WIDTH = 320
// Ticket height: QR section (340) + details section (~180) + margins = ~540
const TICKET_HEIGHT = 540
const TICKET_SPACING = 20
const CARD_OFFSET = 25 // Offset for stacked effect (vertical) - increased for shadow effect
const SCALE_FACTOR = 0.96 // Scale for stacked cards

// Separate component to use hooks properly
function AnimatedTicketItem({
  ticket,
  index,
  totalTickets,
  scrollY,
}: AnimatedTicketItemProps) {
  const animatedStyle = useAnimatedStyle(() => {
    const translateY = scrollY.value
    const itemHeight = TICKET_HEIGHT + TICKET_SPACING * 2
    const currentIndex = Math.round(translateY / itemHeight)

    // Calculate how far this card is from the center
    const distance = Math.abs(index - currentIndex)

    // Calculate scale and offset based on distance
    // All tickets are positioned at the same location, stacked behind each other
    let scale = 1
    let offsetY = 0
    let opacity = 1
    let zIndex = totalTickets - index
    let shadowOpacity = 0
    let shadowRadius = 0
    let shadowOffsetY = 0
    let elevation = 0

    if (distance === 0) {
      // Current card - fully visible on top with shadow
      scale = 1
      offsetY = 0
      opacity = 1
      zIndex = totalTickets + 10 // Highest z-index for current card
      shadowOpacity = 0.3
      shadowRadius = 8
      shadowOffsetY = 4
      elevation = 8
    } else if (distance === 1) {
      // Adjacent cards - slightly scaled and offset behind, visible as shadows
      scale = SCALE_FACTOR
      const isAbove = index < currentIndex
      // Cards behind are offset down more to create shadow effect
      offsetY = isAbove ? -CARD_OFFSET * 0.3 : CARD_OFFSET * 1.2
      opacity = 0.4 // Lower opacity to create shadow/silhouette effect
      zIndex = totalTickets - index
      shadowOpacity = 0.2
      shadowRadius = 6
      shadowOffsetY = 3
      elevation = 4
    } else {
      // Far cards - more scaled and offset, more hidden
      scale = SCALE_FACTOR * 0.92
      const isAbove = index < currentIndex
      offsetY = isAbove ? -CARD_OFFSET * 0.5 : CARD_OFFSET * 1.8
      opacity = 0.25 // Very low opacity for deep shadow effect
      zIndex = totalTickets - index - distance
      shadowOpacity = 0.15
      shadowRadius = 4
      shadowOffsetY = 2
      elevation = 2
    }

    return {
      transform: [
        { scale: withSpring(scale, { damping: 15, stiffness: 150 }) },
        {
          translateY: withSpring(offsetY, { damping: 15, stiffness: 150 }),
        },
      ],
      opacity: withSpring(opacity, { damping: 15, stiffness: 150 }),
      zIndex,
      // Shadow properties for iOS
      ...(Platform.OS === 'ios' && {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: shadowOffsetY },
        shadowOpacity: withSpring(shadowOpacity, {
          damping: 15,
          stiffness: 150,
        }),
        shadowRadius: withSpring(shadowRadius, { damping: 15, stiffness: 150 }),
      }),
      // Elevation for Android
      ...(Platform.OS === 'android' && {
        elevation: withSpring(elevation, { damping: 15, stiffness: 150 }),
      }),
    }
  })

  return (
    <Animated.View
      style={[
        styles.ticketWrapper,
        {
          position: 'absolute',
          top: 40,
          alignSelf: 'center',
          width: TICKET_WIDTH + TICKET_SPACING * 2,
          height: TICKET_HEIGHT + TICKET_SPACING * 2,
          paddingHorizontal: TICKET_SPACING,
          paddingVertical: TICKET_SPACING,
        },
        animatedStyle,
      ]}
      pointerEvents='none'
    >
      <TicketCard ticket={ticket} index={index} totalTickets={totalTickets} />
    </Animated.View>
  )
}

export default function TicketStack({ tickets }: TicketStackProps) {
  const scrollY = useSharedValue(0)
  const scrollViewRef = useRef<ScrollView>(null)

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    scrollY.value = event.nativeEvent.contentOffset.y
  }

  if (tickets.length === 0) {
    return null
  }

  // Create invisible spacers for scroll tracking
  const totalHeight = (TICKET_HEIGHT + TICKET_SPACING * 2) * tickets.length

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        snapToInterval={TICKET_HEIGHT + TICKET_SPACING * 2}
        decelerationRate='fast'
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContentContainer,
          { minHeight: totalHeight },
        ]}
      >
        {/* Invisible spacers to enable scrolling */}
        {tickets.map((_, index) => (
          <View
            key={`spacer-${index}`}
            style={{
              height: TICKET_HEIGHT + TICKET_SPACING * 2,
              width: '100%',
            }}
          />
        ))}
      </ScrollView>
      {/* Stacked tickets positioned absolutely - don't block touch events */}
      <View style={styles.ticketsStack} pointerEvents='box-none'>
        {tickets.map((ticket, index) => (
          <AnimatedTicketItem
            key={`${ticket.seat_label}-${index}`}
            ticket={ticket}
            index={index}
            totalTickets={tickets.length}
            scrollY={scrollY}
          />
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContentContainer: {
    paddingHorizontal: (SCREEN_WIDTH - TICKET_WIDTH) / 2 - TICKET_SPACING,
    paddingTop: 40,
    paddingBottom: 100, // Extra space at bottom for last ticket
  },
  ticketsStack: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 40,
  },
  ticketWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
})
