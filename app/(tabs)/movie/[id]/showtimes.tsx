import { Ionicons } from '@expo/vector-icons'
import { router, useLocalSearchParams } from 'expo-router'
import { useMemo, useState } from 'react'
import {
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'

import { ThemedSafeAreaView } from '@/components/themed-safe-area-view'
import { ThemedText } from '@/components/themed-text'
import { Colors } from '@/constants/theme'
import { useThemeColor } from '@/hooks/use-theme-color'
import { useMovie } from '@/hooks/useMovies'

type DateOption = {
  date: Date
  label: string
  isToday: boolean
}

const formatDateOption = (date: Date, isToday: boolean): DateOption => {
  const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ]

  const dayOfWeek = dayNames[date.getDay()]
  const day = date.getDate()
  const month = monthNames[date.getMonth()]

  let label: string
  if (isToday) {
    label = `Today ${dayOfWeek}`
  } else {
    label = `${day} ${month} ${dayOfWeek}`
  }

  return {
    date,
    label,
    isToday,
  }
}

const generateDateOptions = (): DateOption[] => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const options: DateOption[] = []

  for (let i = 0; i < 8; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)
    options.push(formatDateOption(date, i === 0))
  }

  return options
}

export default function ShowtimesScreen() {
  const params = useLocalSearchParams<{ id?: string }>()
  const movieId = Number(params.id)

  const { data: movie } = useMovie(movieId)

  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return today
  })

  const dateOptions = useMemo(() => generateDateOptions(), [])

  const backgroundColor = useThemeColor(
    {
      light: Colors.light.backgroundPrimary,
      dark: Colors.dark.backgroundPrimary,
    },
    'backgroundPrimary'
  )
  const iconColor = useThemeColor(
    { light: Colors.light.textPrimary, dark: Colors.dark.textPrimary },
    'textPrimary'
  )
  const buttonBackgroundColor = useThemeColor(
    { light: '#E5E5E5', dark: '#1E1E1E' },
    'background'
  )
  const textPrimaryColor = useThemeColor(
    { light: Colors.light.textPrimary, dark: Colors.dark.textPrimary },
    'textPrimary'
  )
  const accentColor = useThemeColor(
    { light: Colors.light.buttonPrimary, dark: Colors.dark.buttonPrimary },
    'buttonPrimary'
  )
  const unselectedDateBg = useThemeColor(
    { light: '#E5E5E5', dark: '#1E1E1E' },
    'background'
  )

  const handleBackPress = () => {
    router.back()
  }

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
  }

  const isDateSelected = (date: Date): boolean => {
    return date.getTime() === selectedDate.getTime()
  }

  return (
    <ThemedSafeAreaView style={[styles.container, { backgroundColor }]}>
      {/* Header with back button and movie title */}
      <View style={styles.header}>
        <Pressable
          style={[
            styles.backButton,
            { backgroundColor: buttonBackgroundColor },
          ]}
          onPress={handleBackPress}
        >
          <Ionicons name='arrow-back' size={20} color={iconColor} />
        </Pressable>
        <ThemedText style={styles.movieTitle} numberOfLines={1}>
          {movie?.title || 'Movie'}
        </ThemedText>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Choose Date Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText
              style={[styles.sectionTitle, { color: textPrimaryColor }]}
            >
              Choose Date
            </ThemedText>
            <Ionicons name='calendar-outline' size={20} color={iconColor} />
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.dateButtonsContainer}
          >
            {dateOptions.map((option, index) => {
              const isSelected = isDateSelected(option.date)
              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dateButton,
                    {
                      backgroundColor: isSelected
                        ? accentColor
                        : unselectedDateBg,
                    },
                  ]}
                  onPress={() => handleDateSelect(option.date)}
                  activeOpacity={0.7}
                >
                  <ThemedText
                    style={[
                      styles.dateButtonText,
                      { color: isSelected ? '#FFFFFF' : textPrimaryColor },
                    ]}
                  >
                    {option.label}
                  </ThemedText>
                </TouchableOpacity>
              )
            })}
          </ScrollView>
        </View>
      </ScrollView>
    </ThemedSafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  movieTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    marginHorizontal: 16,
    textAlign: 'center',
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  dateButtonsContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingRight: 20,
  },
  dateButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    minWidth: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
})
