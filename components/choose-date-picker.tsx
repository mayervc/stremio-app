import { Ionicons } from '@expo/vector-icons'
import { addDays, format, isToday } from 'date-fns'
import { useMemo } from 'react'
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'

import { ThemedText } from '@/components/themed-text'
import { Colors } from '@/constants/theme'
import { useThemeColor } from '@/hooks/use-theme-color'

type DateOption = {
  date: Date
  label: string
  isToday: boolean
}

interface ChooseDatePickerProps {
  selectedDate: Date
  onDateSelect: (date: Date) => void
}

const formatDateOption = (date: Date): DateOption => {
  const isDateToday = isToday(date)
  let label: string

  if (isDateToday) {
    const dayOfWeek = format(date, 'EEE').toUpperCase()
    label = `Today ${dayOfWeek}`
  } else {
    const day = format(date, 'd')
    const month = format(date, 'MMM')
    const dayOfWeek = format(date, 'EEE').toUpperCase()
    label = `${day} ${month} ${dayOfWeek}`
  }

  return {
    date,
    label,
    isToday: isDateToday,
  }
}

const generateDateOptions = (): DateOption[] => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const options: DateOption[] = []

  for (let i = 0; i < 8; i++) {
    const date = addDays(today, i)
    options.push(formatDateOption(date))
  }

  return options
}

export default function ChooseDatePicker({
  selectedDate,
  onDateSelect,
}: ChooseDatePickerProps) {
  const dateOptions = useMemo(() => generateDateOptions(), [])

  const iconColor = useThemeColor(
    { light: Colors.light.textPrimary, dark: Colors.dark.textPrimary },
    'textPrimary'
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

  const isDateSelected = (date: Date): boolean => {
    return date.getTime() === selectedDate.getTime()
  }

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <ThemedText style={[styles.sectionTitle, { color: textPrimaryColor }]}>
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
                  backgroundColor: isSelected ? accentColor : unselectedDateBg,
                },
              ]}
              onPress={() => onDateSelect(option.date)}
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
  )
}

const styles = StyleSheet.create({
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
