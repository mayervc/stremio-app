import { Colors } from '@/constants/colors'
import { useOnboardingStore } from '@/store/onboardingStore'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import React from 'react'
import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

const { width } = Dimensions.get('window')

// Datos de las películas (usando imágenes reales)
const movies = [
  {
    id: 1,
    title: 'Spider-Man',
    image: require('@/assets/images/movies/01839d17af1b80c392925771af1a50ea3cb7d140.jpg'),
  },
  {
    id: 2,
    title: 'Batman',
    image: require('@/assets/images/movies/15120971aa7848def590eaeeda16dddc64d4fe45.jpg'),
  },
  {
    id: 3,
    title: 'Suicide Squad',
    image: require('@/assets/images/movies/762390e133aef26ddd029fc8c7cad1e3bbfccd99.jpg'),
  },
  {
    id: 4,
    title: 'Chucky',
    image: require('@/assets/images/movies/900980cc012e8a892443f1ffc4b1045b1e124173.jpg'),
  },
  {
    id: 5,
    title: 'Mystery Figure',
    image: require('@/assets/images/movies/9821847f4438627284e334e75bfccdc9d6c79352.jpg'),
  },
  {
    id: 6,
    title: 'Warner Bros',
    image: require('@/assets/images/movies/af6ae30217b0bffc10a3e5052bd562e90bb1e006.jpg'),
  },
  {
    id: 7,
    title: 'Braniff Travel',
    image: require('@/assets/images/movies/e7163aa26068d47aca0e991ff7f1b30649ad42fb.jpg'),
  },
  {
    id: 8,
    title: 'Cinema Art',
    image: require('@/assets/images/movies/eab2a7c4c1c15429a9ffe69e7fc1ae6b96c906a1.jpg'),
  },
]

export default function Onboarding1Screen() {
  const { selectedMovies, setSelectedMovies } = useOnboardingStore()

  // Dividir películas en 2 filas
  const firstRow = movies.slice(0, 4)
  const secondRow = movies.slice(4, 8)

  const itemWidth = (width - 80) / 4 // 4 columnas con padding

  const toggleMovie = (movieId: number) => {
    const newSelection = selectedMovies.includes(movieId)
      ? selectedMovies.filter(id => id !== movieId)
      : [...selectedMovies, movieId]
    setSelectedMovies(newSelection)
  }

  const handleNext = () => {
    if (selectedMovies.length >= 3) {
      router.push('/onboarding-2')
    }
  }

  const renderMovie = ({ item }: { item: (typeof movies)[0] }) => {
    const isSelected = selectedMovies.includes(item.id)

    return (
      <Pressable
        style={[
          styles.movieContainer,
          { width: itemWidth },
          isSelected && styles.movieContainerSelected,
        ]}
        onPress={() => toggleMovie(item.id)}
      >
        <Image source={item.image} style={styles.movieImage} />
        {isSelected && (
          <View style={styles.checkContainer}>
            <Ionicons name='checkmark' size={20} color={Colors.text.primary} />
          </View>
        )}
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
          Select at least 3 movies to continue
        </Text>

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

        <TouchableOpacity
          style={[
            styles.nextButton,
            selectedMovies.length < 3 && styles.nextButtonDisabled,
          ]}
          onPress={handleNext}
          disabled={selectedMovies.length < 3}
        >
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
  subtitle: {
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: 40,
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
    borderWidth: 2,
    borderColor: 'transparent',
    height: 180,
  },
  movieContainerSelected: {
    borderColor: Colors.button.primary,
  },
  movieImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  checkContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: Colors.button.primary,
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
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
