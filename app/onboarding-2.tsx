import { Colors } from '@/constants/colors'
import { useOnboardingStore } from '@/store/onboardingStore'
import { router } from 'expo-router'
import React from 'react'
import {
  Dimensions,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

const { width } = Dimensions.get('window')

// Datos de los géneros
const genres = [
  { id: 1, name: 'Action' },
  { id: 2, name: 'Adventure' },
  { id: 3, name: 'Comedy' },
  { id: 4, name: 'Drama' },
  { id: 5, name: 'Horror' },
  { id: 6, name: 'Sci-Fi' },
  { id: 7, name: 'Thriller' },
  { id: 8, name: 'Romance' },
  { id: 9, name: 'Animation' },
  { id: 10, name: 'Documentary' },
  { id: 11, name: 'Fantasy' },
  { id: 12, name: 'Mystery' },
]

export default function Onboarding2Screen() {
  const { selectedGenres, setSelectedGenres, setCompleted } =
    useOnboardingStore()

  // Layout flexible para géneros
  const containerPadding = 40 // 20px * 2 (izquierda y derecha)
  const availableWidth = width - containerPadding

  const toggleGenre = (genreId: number) => {
    const newSelection = selectedGenres.includes(genreId)
      ? selectedGenres.filter(id => id !== genreId)
      : [...selectedGenres, genreId]
    setSelectedGenres(newSelection)
  }

  const handleNext = () => {
    if (selectedGenres.length >= 3) {
      setCompleted(true)
      router.replace('/(tabs)')
    }
  }

  const renderGenre = ({ item }: { item: (typeof genres)[0] }) => {
    const isSelected = selectedGenres.includes(item.id)

    return (
      <Pressable
        style={[styles.genreButton, isSelected && styles.genreButtonSelected]}
        onPress={() => toggleGenre(item.id)}
      >
        <Text
          style={[styles.genreText, isSelected && styles.genreTextSelected]}
        >
          {item.name}
        </Text>
      </Pressable>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.loginLink}>Already have an account? Log in</Text>
        </Pressable>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.subtitle}>
          Select at least 3 genres to continue
        </Text>

        {/* Genres Grid */}
        <View style={styles.genresContainer}>
          {genres.map(genre => (
            <View key={genre.id}>{renderGenre({ item: genre })}</View>
          ))}
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Select the genres you like to watch
        </Text>

        <TouchableOpacity
          style={[
            styles.nextButton,
            selectedGenres.length < 3 && styles.nextButtonDisabled,
          ]}
          onPress={handleNext}
          disabled={selectedGenres.length < 3}
        >
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>

        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          <View style={styles.progressDot} />
          <View style={[styles.progressDot, styles.progressDotActive]} />
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
  title: {
    fontSize: 28,
    fontFamily: 'Poppins_700Bold',
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    color: Colors.text.secondary,
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
    backgroundColor: Colors.button.primary,
    borderColor: Colors.button.primary,
  },
  genreText: {
    fontSize: 16,
    fontFamily: 'Poppins_500Medium',
    color: Colors.text.primary,
    textAlign: 'center',
  },
  genreTextSelected: {
    color: Colors.text.primary,
    fontFamily: 'Poppins_600SemiBold',
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 18,
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
  nextButtonDisabled: {
    backgroundColor: Colors.button.primary,
    opacity: 0.6,
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
