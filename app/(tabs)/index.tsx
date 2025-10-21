import { Ionicons } from '@expo/vector-icons'
import { Image } from 'expo-image'
import {
  FlatList,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'

import HeaderBar from '@/components/header-bar'
import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import { useAuthStore } from '@/store/authStore'

export default function HomeScreen() {
  const { user } = useAuthStore()

  // Mock data for movies
  const featuredMovie = {
    id: 1,
    title: 'EVIL DEAD RISE',
    subtitle: 'A NEW VISION FROM THE PRODUCERS OF THE ORIGINAL CLASSIC',
    image: require('@/assets/images/movies/e7163aa26068d47aca0e991ff7f1b30649ad42fb.jpg'),
    rating: 'A',
    language: 'ENGLISH',
    genre: 'HORROR',
    formats: '2D.3D.4DX',
    isTrending: true,
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
      <Image source={item.image} style={styles.moviePoster} />
      <View style={styles.playOverlay}>
        <Ionicons name='play' size={24} color='#FFFFFF' />
      </View>
      <ThemedText style={styles.movieTitle}>{item.title}</ThemedText>
    </View>
  )

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <HeaderBar
        userName={user?.firstName || 'User'}
        onSearchPress={() => console.log('Search pressed')}
        onProfilePress={() => console.log('Profile pressed')}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Featured Movie Section */}
        <View style={styles.featuredSection}>
          <View style={styles.featuredPoster}>
            <Image source={featuredMovie.image} style={styles.featuredImage} />

            {/* Title Overlay */}
            <View style={styles.titleOverlay}>
              <ThemedText style={styles.subtitleText}>
                {featuredMovie.subtitle}
              </ThemedText>
              <ThemedText style={styles.featuredTitle}>
                {featuredMovie.title}
              </ThemedText>
            </View>

            {/* Watch Trailer Button */}
            <TouchableOpacity style={styles.trailerButton}>
              <Ionicons name='play' size={16} color='#FFFFFF' />
              <ThemedText style={styles.trailerButtonText}>
                Watch Trailer
              </ThemedText>
            </TouchableOpacity>

            {/* Movie Details Overlay */}
            <View style={styles.detailsOverlay}>
              <View style={styles.detailsLeft}>
                <View style={styles.trendingBadge}>
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
                  <ThemedText style={styles.bookButtonText}>Book</ThemedText>
                </TouchableOpacity>
                <ThemedText style={styles.formatsText}>
                  {featuredMovie.formats}
                </ThemedText>
              </View>
            </View>
          </View>
        </View>

        {/* Recommended Movies Section */}
        <View style={styles.recommendedSection}>
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>
              Recommended Movies
            </ThemedText>
            <TouchableOpacity>
              <ThemedText style={styles.seeAllText}>See All &gt;</ThemedText>
            </TouchableOpacity>
          </View>

          <FlatList
            data={recommendedMovies}
            renderItem={renderMovieCard}
            keyExtractor={item => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.moviesList}
          />
        </View>
      </ScrollView>

      {/* Floating Filter Button */}
      <TouchableOpacity style={styles.filterButton}>
        <Ionicons name='filter' size={20} color='#FFFFFF' />
      </TouchableOpacity>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121011', // Dark background
  },
  content: {
    flex: 1,
  },
  featuredSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  featuredPoster: {
    height: 400,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  featuredImage: {
    width: '100%',
    height: '100%',
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
    top: 100,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
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
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  detailsLeft: {
    flex: 1,
  },
  trendingBadge: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
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
    backgroundColor: '#333333',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 8,
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
    paddingHorizontal: 24,
    marginBottom: 100, // Space for bottom navigation
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
    color: '#FFFFFF',
  },
  seeAllText: {
    fontSize: 14,
    color: '#FF3B30',
    fontWeight: '600',
  },
  moviesList: {
    paddingRight: 24,
  },
  movieCard: {
    marginRight: 16,
    width: 120,
  },
  moviePoster: {
    width: 120,
    height: 160,
    borderRadius: 8,
  },
  playOverlay: {
    position: 'absolute',
    top: 60,
    left: 48,
    width: 24,
    height: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  movieTitle: {
    fontSize: 12,
    color: '#FFFFFF',
    marginTop: 8,
    textAlign: 'center',
    fontWeight: '500',
  },
  filterButton: {
    position: 'absolute',
    bottom: 100,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
})
