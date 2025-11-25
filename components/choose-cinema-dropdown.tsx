import { Ionicons } from '@expo/vector-icons'
import { useState } from 'react'
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'

import { ThemedText } from '@/components/themed-text'
import { Colors } from '@/constants/theme'
import { useThemeColor } from '@/hooks/use-theme-color'
import { Cinema } from '@/lib/api/types'

interface ChooseCinemaDropdownProps {
  selectedCinema: Cinema | null
  onCinemaSelect: (cinema: Cinema) => void
  cinemas: Cinema[]
  isLoading?: boolean
}

export default function ChooseCinemaDropdown({
  selectedCinema,
  onCinemaSelect,
  cinemas,
  isLoading = false,
}: ChooseCinemaDropdownProps) {
  const [isModalVisible, setIsModalVisible] = useState(false)

  const textPrimaryColor = useThemeColor(
    { light: Colors.light.textPrimary, dark: Colors.dark.textPrimary },
    'textPrimary'
  )
  const iconColor = textPrimaryColor
  const cardBackgroundColor = useThemeColor(
    {
      light: Colors.light.backgroundSecondary,
      dark: Colors.dark.backgroundSecondary,
    },
    'backgroundSecondary'
  )
  const backgroundColor = useThemeColor(
    {
      light: Colors.light.backgroundPrimary,
      dark: Colors.dark.backgroundPrimary,
    },
    'backgroundPrimary'
  )
  const borderPrimaryColor = useThemeColor(
    { light: Colors.light.borderPrimary, dark: Colors.dark.borderPrimary },
    'borderPrimary'
  )

  const handleSelectCinema = (cinema: Cinema) => {
    onCinemaSelect(cinema)
    setIsModalVisible(false)
  }

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <ThemedText style={[styles.sectionTitle, { color: textPrimaryColor }]}>
          Choose Cinema
        </ThemedText>
      </View>

      <Pressable
        style={[
          styles.dropdownButton,
          {
            backgroundColor: cardBackgroundColor,
            borderColor: borderPrimaryColor,
          },
        ]}
        onPress={() => setIsModalVisible(true)}
      >
        <ThemedText
          style={[styles.dropdownButtonText, { color: textPrimaryColor }]}
          numberOfLines={1}
        >
          {isLoading
            ? 'Loading...'
            : selectedCinema
              ? selectedCinema.name
              : 'Select a cinema'}
        </ThemedText>
        <Ionicons name='chevron-down' size={20} color={iconColor} />
      </Pressable>

      <Modal
        visible={isModalVisible}
        transparent
        animationType='slide'
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => setIsModalVisible(false)}
          />
          <View
            style={[
              styles.modalContent,
              { backgroundColor: cardBackgroundColor },
            ]}
          >
            <View style={styles.modalHeader}>
              <ThemedText
                style={[styles.modalTitle, { color: textPrimaryColor }]}
              >
                Select Cinema
              </ThemedText>
              <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                <Ionicons name='close' size={24} color={iconColor} />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.modalList}
              showsVerticalScrollIndicator={false}
            >
              {isLoading ? (
                <ThemedText
                  style={[styles.modalEmptyText, { color: textPrimaryColor }]}
                >
                  Loading cinemas...
                </ThemedText>
              ) : cinemas.length === 0 ? (
                <ThemedText
                  style={[styles.modalEmptyText, { color: textPrimaryColor }]}
                >
                  No cinemas available
                </ThemedText>
              ) : (
                cinemas.map(cinema => (
                  <TouchableOpacity
                    key={cinema.id}
                    style={[
                      styles.modalItem,
                      selectedCinema?.id === cinema.id && {
                        backgroundColor: backgroundColor,
                      },
                    ]}
                    onPress={() => handleSelectCinema(cinema)}
                  >
                    <ThemedText
                      style={[
                        styles.modalItemText,
                        { color: textPrimaryColor },
                      ]}
                    >
                      {cinema.name}
                    </ThemedText>
                    {selectedCinema?.id === cinema.id && (
                      <Ionicons name='checkmark' size={20} color={iconColor} />
                    )}
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
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
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  dropdownButtonText: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
    marginRight: 12,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  modalList: {
    flexGrow: 1,
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  modalItemText: {
    fontSize: 16,
    fontWeight: '400',
    flex: 1,
  },
  modalEmptyText: {
    fontSize: 16,
    textAlign: 'center',
    paddingVertical: 40,
  },
})
