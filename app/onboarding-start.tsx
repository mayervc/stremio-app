import { Colors } from '@/constants/colors'
import { movies, width } from '@/lib/data/onboarding-placeholder-images'
import { useOnboardingStore } from '@/store/onboardingStore'
import { router } from 'expo-router'
import React, { useEffect } from 'react'
import {
  FlatList,
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

export default function OnboardingStartScreen() {
  const { setHasSeenOnboarding, setCurrentStep, setCompleted } =
    useOnboardingStore()

  // Split movies into 2 rows
  const firstRow = movies.slice(0, 4)
  const secondRow = movies.slice(4, 8)

  const itemWidth = (width - 80) / 4 // 4 columns with padding

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
      <View style={[styles.movieContainer, { width: itemWidth }]}>
        <Image source={item.image} style={styles.movieImage} />
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={handleLoginPress}>
          <Text style={styles.loginLink}>Already have an account? Log in</Text>
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
        <Text style={styles.footerText}>
          Tell us about your favorite movie genres
        </Text>

        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>

        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          <View style={[styles.progressDot, styles.progressDotActive]} />
          <View style={styles.progressDot} />
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    alignItems: 'flex-end',
  },
  loginLink: {
    color: Colors.text.primary,
    fontSize: 16,
    fontFamily: 'Poppins_500Medium',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  moviesContainer: {
    flex: 1,
    paddingBottom: 20,
  },
  moviesRow: {
    paddingHorizontal: 10,
    paddingVertical: 0,
  },
  movieContainer: {
    marginHorizontal: 8,
    marginVertical: 2,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: Colors.background.secondary,
    height: 180,
  },
  movieImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 16,
    fontFamily: 'Poppins_500Medium',
    color: Colors.text.primary,
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
    color: Colors.text.primary,
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
