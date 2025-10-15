import { ThemedSafeAreaView } from '@/components/themed-safe-area-view'
import { ThemedText } from '@/components/themed-text'
import { Colors } from '@/constants/colors'
import { commonStyles } from '@/constants/common-styles'
import { genres } from '@/lib/data/movie-genres'
import { useOnboardingStore } from '@/store/onboardingStore'
import { router } from 'expo-router'
import React, { useEffect } from 'react'
import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

// Constants
const MIN_GENRES_TO_SELECT = 3

export default function OnboardingPickGenresScreen() {
  const { selectedGenres, setSelectedGenres, setCompleted, setCurrentStep } =
    useOnboardingStore()

  // Computed values
  const disableNextButton = selectedGenres.length < MIN_GENRES_TO_SELECT

  // Set current step when component mounts
  useEffect(() => {
    setCurrentStep(2)
  }, [setCurrentStep])

  const toggleGenre = (genreId: number) => {
    const newSelection = selectedGenres.includes(genreId)
      ? selectedGenres.filter(id => id !== genreId)
      : [...selectedGenres, genreId]
    setSelectedGenres(newSelection)
  }

  const handleNext = () => {
    if (selectedGenres.length >= MIN_GENRES_TO_SELECT) {
      // Don't mark as completed yet - will be done after signup success
      // Navigate to signup after completing onboarding
      router.replace('/signup')
    }
  }

  const handleLoginPress = () => {
    router.push('/login')
  }

  const renderGenre = ({ item }: { item: (typeof genres)[0] }) => {
    const isSelected = selectedGenres.includes(item.id)

    return (
      <Pressable
        style={[styles.genreButton, isSelected && styles.genreButtonSelected]}
        onPress={() => toggleGenre(item.id)}
      >
        <Text
          style={[
            styles.genreText,
            isSelected && {
              color: Colors.button.primary,
              fontFamily: 'Poppins_600SemiBold',
            },
          ]}
        >
          {item.name}
        </Text>
      </Pressable>
    )
  }

  return (
    <ThemedSafeAreaView style={commonStyles.screenContainer}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={handleLoginPress}>
          <ThemedText style={styles.loginLink}>
            Already have an account? Log in
          </ThemedText>
        </Pressable>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <ThemedText style={styles.subtitle}>
          Select at least {MIN_GENRES_TO_SELECT} genres to continue
        </ThemedText>

        {/* Genres Grid */}
        <View style={styles.genresContainer}>
          {genres.map(genre => (
            <View key={genre.id}>{renderGenre({ item: genre })}</View>
          ))}
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <ThemedText style={styles.footerText}>
          Select the genres you like to watch
        </ThemedText>

        <TouchableOpacity
          style={[
            styles.nextButton,
            disableNextButton && styles.nextButtonDisabled,
          ]}
          onPress={handleNext}
          disabled={disableNextButton}
        >
          <ThemedText style={styles.nextButtonText}>Next</ThemedText>
        </TouchableOpacity>

        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          <View style={styles.progressDot} />
          <View style={[styles.progressDot, styles.progressDotActive]} />
        </View>
      </View>
    </ThemedSafeAreaView>
  )
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    alignItems: 'flex-end',
  },
  loginLink: {
    fontSize: 16,
    fontFamily: 'Poppins_500Medium',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    textAlign: 'center',
    marginBottom: 40,
  },
  genresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    paddingBottom: 20,
  },
  genreButton: {
    margin: 4,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: Colors.background.secondary,
    borderWidth: 1,
    borderColor: Colors.border.primary,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  genreButtonSelected: {
    borderColor: Colors.button.primary,
  },
  genreText: {
    fontSize: 16,
    fontFamily: 'Poppins_500Medium',
    color: Colors.text.primary,
    textAlign: 'center',
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 18,
    fontFamily: 'Poppins_500Medium',
    textAlign: 'center',
    marginBottom: 20,
  },
  nextButton: {
    backgroundColor: Colors.button.primary,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 60,
    marginBottom: 20,
  },
  nextButtonDisabled: {
    backgroundColor: Colors.button.primary,
    opacity: 0.6,
  },
  nextButtonText: {
    fontSize: 18,
    fontFamily: 'Poppins_700Bold',
    textAlign: 'center',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.placeholder,
    marginHorizontal: 4,
  },
  progressDotActive: {
    backgroundColor: Colors.button.primary,
  },
})
