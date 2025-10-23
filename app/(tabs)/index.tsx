import { Ionicons } from '@expo/vector-icons'
import { Image } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import { useEffect, useRef, useState } from 'react'
import {
  Animated,
  Dimensions,
  FlatList,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'

import HeaderBar from '@/components/header-bar'
import { ThemedSafeAreaView } from '@/components/themed-safe-area-view'
import { ThemedText } from '@/components/themed-text'
import { useAuthStore } from '@/store/authStore'

export default function HomeScreen() {
  const { user } = useAuthStore()
  const screenHeight = Dimensions.get('window').height
  const [currentTrendingIndex, setCurrentTrendingIndex] = useState(0)
  const scrollViewRef = useRef<ScrollView>(null)
  const fadeAnim = useRef(new Animated.Value(1)).current

  // Mock data for trending movies
  const trendingMovies = [
    {
      id: 1,
      title: 'EVIL DEAD RISE',
      subtitle: 'A NEW VISION FROM THE PRODUCERS OF THE ORIGINAL CLASSIC',
      image: require('@/assets/images/movies/e7163aa26068d47aca0e991ff7f1b30649ad42fb.jpg'),
      rating: 'A',
      language: 'ENGLISH',
      genre: 'HORROR',
      formats: '2D.3D.4DX',
      isTrending: true,
    },
    {
      id: 2,
      title: 'SPIDER-MAN: ACROSS THE SPIDER-VERSE',
      subtitle: 'MILES MORALES RETURNS FOR AN EPIC ADVENTURE',
      image: require('@/assets/images/movies/01839d17af1b80c392925771af1a50ea3cb7d140.jpg'),
      rating: 'PG-13',
      language: 'ENGLISH',
      genre: 'ACTION',
      formats: '2D.3D.IMAX',
      isTrending: true,
    },
    {
      id: 3,
      title: 'GUARDIANS OF THE GALAXY VOL. 3',
      subtitle: 'THE FINAL CHAPTER OF THE GUARDIANS',
      image: require('@/assets/images/movies/900980cc012e8a892443f1ffc4b1045b1e124173.jpg'),
      rating: 'PG-13',
      language: 'ENGLISH',
      genre: 'ACTION',
      formats: '2D.3D.4DX',
      isTrending: true,
    },
    {
      id: 4,
      title: 'THE FLASH',
      subtitle: 'SPEED FORCE ADVENTURE BEGINS',
      image: require('@/assets/images/movies/15120971aa7848def590eaeeda16dddc64d4fe45.jpg'),
      rating: 'PG-13',
      language: 'ENGLISH',
      genre: 'ACTION',
      formats: '2D.3D',
      isTrending: true,
    },
  ]

  const featuredMovie = trendingMovies[currentTrendingIndex]

  // Auto-scroll functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTrendingIndex(prevIndex => {
        const nextIndex = (prevIndex + 1) % trendingMovies.length
        return nextIndex
      })
    }, 5000) // Change every 5 seconds

    return () => clearInterval(interval)
  }, [trendingMovies.length])

  // Animate when trending movie changes
  useEffect(() => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0.3,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start()
  }, [currentTrendingIndex, fadeAnim])

  const handleTrendingScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x
    const screenWidth = Dimensions.get('window').width
    const index = Math.round(contentOffsetX / screenWidth)
    setCurrentTrendingIndex(index)
  }

  const recommendedMovies = [
    {
      id: 2,
      title: 'SALAAR (PART 1)',
      image: require('@/assets/images/movies/01839d17af1b80c392925771af1a50ea3cb7d140.jpg'),
    },
    {
      id: 3,
      title: 'FLASH (2023)',
      image: require('@/assets/images/movies/15120971aa7848def590eaeeda16dddc64d4fe45.jpg'),
    },
    {
      id: 4,
      title: 'AQUAMAN',
      image: require('@/assets/images/movies/762390e133aef26ddd029fc8c7cad1e3bbfccd99.jpg'),
    },
    {
      id: 5,
      title: 'GUARDIANS',
      image: require('@/assets/images/movies/900980cc012e8a892443f1ffc4b1045b1e124173.jpg'),
    },
  ]

  const renderMovieCard = ({ item }: { item: any }) => (
    <View style={styles.movieCard}>
      <View style={styles.posterContainer}>
        <Image source={item.image} style={styles.moviePoster} />
        <View style={styles.playOverlay}>
          <Ionicons name='play-outline' size={24} color='#FFFFFF' />
        </View>
      </View>
      <ThemedText style={styles.movieTitle}>{item.title}</ThemedText>
    </View>
  )

  return (
    <ThemedSafeAreaView style={styles.container}>
      {/* Header */}
      <HeaderBar />

      <View style={styles.content}>
        {/* Featured Movie Section */}
        <View style={styles.featuredSection}>
          <ScrollView
            ref={scrollViewRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={handleTrendingScroll}
            style={styles.trendingScrollView}
          >
            {trendingMovies.map((movie, index) => (
              <View key={movie.id} style={styles.trendingSlide}>
                <Animated.View
                  style={[styles.featuredPoster, { opacity: fadeAnim }]}
                >
                  <Image source={movie.image} style={styles.featuredImage} />

                  {/* Watch Trailer Button */}
                  <TouchableOpacity style={styles.trailerButton}>
                    <ThemedText style={styles.trailerButtonText}>
                      Watch Trailer
                    </ThemedText>
                    <Ionicons name='play-outline' size={16} color='#FFFFFF' />
                  </TouchableOpacity>
                </Animated.View>
              </View>
            ))}
          </ScrollView>

          {/* Movie Details Overlay */}
          <View style={styles.detailsOverlay}>
            <View style={styles.detailsLeft}>
              <View style={styles.trendingBadgeContainer}>
                <ThemedText style={styles.trendingText}>TRENDING</ThemedText>
              </View>
              <ThemedText style={styles.detailsTitle}>
                {featuredMovie.title}
              </ThemedText>
              <ThemedText style={styles.detailsInfo}>
                <ThemedText style={styles.rating}>
                  {featuredMovie.rating}
                </ThemedText>
                <ThemedText> . {featuredMovie.language}</ThemedText>
              </ThemedText>
              <ThemedText style={styles.genreText}>
                {featuredMovie.genre}
              </ThemedText>
            </View>
            <View style={styles.detailsRight}>
              <TouchableOpacity style={styles.bookButton}>
                <LinearGradient
                  colors={['#323232', '#767676', '#363535']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.bookButtonGradient}
                >
                  <ThemedText style={styles.bookButtonText}>Book</ThemedText>
                </LinearGradient>
              </TouchableOpacity>
              <ThemedText style={styles.formatsText}>
                {featuredMovie.formats}
              </ThemedText>
            </View>
          </View>
        </View>

        {/* Recommended Movies Section */}
        <View style={styles.recommendedSection}>
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>
              Recommended Movies
            </ThemedText>
            <TouchableOpacity style={styles.seeAllButton}>
              <ThemedText style={styles.seeAllText}>See All</ThemedText>
              <Ionicons name='chevron-forward' size={16} color='#FF3B30' />
            </TouchableOpacity>
          </View>

          <FlatList
            data={recommendedMovies}
            renderItem={renderMovieCard}
            keyExtractor={item => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.moviesList}
            contentContainerStyle={styles.moviesListContent}
          />
        </View>
      </View>
    </ThemedSafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  featuredSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    marginBottom: 80,
  },
  trendingScrollView: {
    height: 280,
  },
  trendingSlide: {
    width: Dimensions.get('window').width - 40, // Full width minus padding
  },
  featuredPoster: {
    width: '100%',
    height: 280,
    borderRadius: 32,
    overflow: 'hidden',
    position: 'relative',
  },
  featuredImage: {
    width: '100%',
    height: '100%',
    borderRadius: 32,
  },
  titleOverlay: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
  },
  subtitleText: {
    fontSize: 12,
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  featuredTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
  trailerButton: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    backgroundColor: 'rgba(51, 51, 51, 0.9)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  trailerButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  detailsOverlay: {
    position: 'absolute',
    bottom: -55,
    left: 35,
    right: 35,
    height: 125,
    backgroundColor: '#1E1E1E',
    padding: 20,
    borderRadius: 55,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  detailsLeft: {
    flex: 1,
  },
  trendingBadgeContainer: {
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  trendingText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  detailsInfo: {
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  rating: {
    color: '#FF3B30',
    fontWeight: 'bold',
  },
  genreText: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  detailsRight: {
    alignItems: 'flex-end',
  },
  bookButton: {
    marginBottom: 8,
    borderRadius: 25,
    overflow: 'hidden',
  },
  bookButtonGradient: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  formatsText: {
    fontSize: 12,
    color: '#FFFFFF',
  },
  recommendedSection: {
    paddingHorizontal: 20,
    paddingBottom: 100, // Add bottom padding to prevent overlap with tab bar
    flex: 1,
    height: '100%',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  seeAllText: {
    fontSize: 14,
    color: '#FF3B30',
    fontWeight: '600',
  },
  moviesList: {
    flex: 1,
    maxHeight: '100%',
  },
  moviesListContent: {
    paddingRight: 20,
  },
  movieCard: {
    marginRight: 16,
    width: 200,
    marginBottom: 16, // Add bottom margin to ensure title visibility
  },
  posterContainer: {
    position: 'relative',
    width: 200,
    height: 250,
    borderRadius: 32,
    overflow: 'hidden',
  },
  moviePoster: {
    width: '100%',
    height: '100%',
    borderRadius: 32,
    resizeMode: 'cover',
  },
  playOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -20 }, { translateY: -20 }],
    width: 40,
    height: 40,
    backgroundColor: '#1E1E1E',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  movieTitle: {
    fontSize: 16,
    color: '#FFFFFF',
    marginTop: 8,
    textAlign: 'center',
    fontWeight: '500',
  },
})
