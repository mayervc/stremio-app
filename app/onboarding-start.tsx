import { ThemedSafeAreaView } from '@/components/themed-safe-area-view'
import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import { Colors } from '@/constants/colors'
import { commonStyles } from '@/constants/common-styles'
import { movies } from '@/lib/data/onboarding-placeholder-images'
import { useOnboardingStore } from '@/store/onboardingStore'
import { router } from 'expo-router'
import React, { useEffect } from 'react'
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'

export default function OnboardingStartScreen() {
  const { setHasSeenOnboarding, setCurrentStep, setCompleted } =
    useOnboardingStore()

  // Split movies into 2 rows
  const firstRow = movies.slice(0, 4)
  const secondRow = movies.slice(4, 8)

  const itemWidth = 132 // Exact width as specified

  // Reset onboarding state and mark that user has seen onboarding
  useEffect(() => {
    setCompleted(false) // Reset completion status
    setHasSeenOnboarding(true)
    setCurrentStep(1)
  }, [setHasSeenOnboarding, setCurrentStep, setCompleted])

  const handleNext = () => {
    setCurrentStep(2)
    router.push('/onboarding-pick-genres')
  }

  const handleLoginPress = () => {
    // If user clicks login, mark onboarding as completed to skip it next time
    setHasSeenOnboarding(true)
    router.push('/login')
  }

  const renderMovie = ({ item }: { item: (typeof movies)[0] }) => {
    return (
      <ThemedView style={[styles.movieContainer, { width: itemWidth }]}>
        <Image source={item.image} style={styles.movieImage} />
      </ThemedView>
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
        {/* Movies Grid - 2 Rows with Horizontal Scroll */}
        <View style={styles.moviesContainer}>
          {/* First Row */}
          <FlatList
            data={firstRow}
            renderItem={renderMovie}
            keyExtractor={item => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.moviesRow}
          />

          {/* Second Row */}
          <FlatList
            data={secondRow}
            renderItem={renderMovie}
            keyExtractor={item => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.moviesRow}
          />
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <ThemedText style={styles.footerText}>
          Tell us about your favorite movie genres
        </ThemedText>

        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <ThemedText type='button' style={styles.nextButtonText}>
            Next
          </ThemedText>
        </TouchableOpacity>

        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          <View style={[styles.progressDot, styles.progressDotActive]} />
          <View style={styles.progressDot} />
        </View>
      </View>
    </ThemedSafeAreaView>
  )
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  loginLink: {
    fontSize: 16,
    fontFamily: 'Poppins_500Medium',
  },
  content: {
    flex: 1,
    paddingTop: 40,
  },
  moviesContainer: {
    flex: 1,
    paddingBottom: 20,
  },
  moviesRow: {
    paddingHorizontal: 10,
    paddingVertical: 0,
    marginBottom: 8, // Reduced space between rows
  },
  movieContainer: {
    marginHorizontal: 8,
    marginVertical: 2,
    borderRadius: 12,
    overflow: 'hidden',
    height: 180,
  },
  movieImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 16,
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
