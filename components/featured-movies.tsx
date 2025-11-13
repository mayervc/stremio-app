import { Ionicons } from '@expo/vector-icons'
import { Image } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import { useEffect, useRef, useState } from 'react'
import {
  Animated,
  Dimensions,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'

import { ThemedText } from '@/components/themed-text'
import { useTrendingMovies } from '@/hooks/useMovies'

interface TrendingMovie {
  id: number
  title: string
  subtitle: string
  image: any
  rating: string
  language: string
  genre: string
  formats: string
  isTrending: boolean
}

interface FeaturedMoviesProps {
  onMoviePress?: (movieId: number) => void
}

const FeaturedMovies = ({ onMoviePress }: FeaturedMoviesProps) => {
  const [currentTrendingIndex, setCurrentTrendingIndex] = useState(0)
  const scrollViewRef = useRef<ScrollView>(null)
  const fadeAnim = useRef(new Animated.Value(1)).current

  const { data: trendingData } = useTrendingMovies()
  const trendingMovies: TrendingMovie[] = (trendingData?.movies || [])
    .map((m: any) => ({
      id: m.id,
      title: m.title,
      subtitle: m.subtitle || '',
      image: m.image_url ? { uri: m.image_url } : undefined,
      rating: m.rating || '',
      language: m.language || '',
      genre: m.genre || '',
      formats: m.formats || '',
      isTrending: !!m.isTrending,
    }))
    .filter(movie => movie.image) // Only show movies with valid images

  // Ensure currentTrendingIndex is within bounds
  const safeIndex =
    trendingMovies.length > 0
      ? Math.min(currentTrendingIndex, trendingMovies.length - 1)
      : 0
  const featuredMovie = trendingMovies[safeIndex]

  // Auto-scroll functionality
  useEffect(() => {
    if (trendingMovies.length === 0) return

    const interval = setInterval(() => {
      setCurrentTrendingIndex(prevIndex => {
        const nextIndex = (prevIndex + 1) % trendingMovies.length
        return nextIndex
      })
    }, 5000) // Change every 5 seconds

    return () => clearInterval(interval)
  }, [trendingMovies.length])

  // Keep ScrollView position in sync with currentTrendingIndex
  useEffect(() => {
    if (trendingMovies.length === 0) return

    const screenWidth = Dimensions.get('window').width
    const slideWidth = screenWidth - 40 // matches styles.trendingSlide width
    scrollViewRef.current?.scrollTo({
      x: safeIndex * slideWidth,
      y: 0,
      animated: true,
    })
  }, [currentTrendingIndex, trendingMovies.length, safeIndex])

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
    if (trendingMovies.length === 0) return

    const contentOffsetX = event.nativeEvent.contentOffset.x
    const screenWidth = Dimensions.get('window').width
    const slideWidth = screenWidth - 40 // debe coincidir con styles.trendingSlide width
    const index = Math.round(contentOffsetX / slideWidth)
    const safeIndex = Math.max(0, Math.min(index, trendingMovies.length - 1))
    setCurrentTrendingIndex(safeIndex)
  }

  return (
    <View style={styles.featuredSection}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleTrendingScroll}
        style={styles.trendingScrollView}
      >
        {trendingMovies.map(movie => (
          <View key={movie.id} style={styles.trendingSlide}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => onMoviePress?.(movie.id)}
            >
              <Animated.View
                style={[styles.featuredPoster, { opacity: fadeAnim }]}
              >
                <Image
                  source={movie.image}
                  style={styles.featuredImage}
                  contentFit='cover'
                />

                {/* Watch Trailer Button */}
                <TouchableOpacity style={styles.trailerButton}>
                  <ThemedText style={styles.trailerButtonText}>
                    Watch Trailer
                  </ThemedText>
                  <Ionicons name='play-outline' size={16} color='#FFFFFF' />
                </TouchableOpacity>
              </Animated.View>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* Movie Details Overlay */}
      {featuredMovie && (
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
      )}
    </View>
  )
}

const styles = StyleSheet.create({
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
})

export default FeaturedMovies
