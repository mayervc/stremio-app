import { Ionicons } from '@expo/vector-icons'
import { Image } from 'expo-image'
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native'

import FeaturedMovies from '@/components/featured-movies'
import HeaderBar from '@/components/header-bar'
import { ThemedSafeAreaView } from '@/components/themed-safe-area-view'
import { ThemedText } from '@/components/themed-text'
import { useAuthStore } from '@/store/authStore'

export default function HomeScreen() {
  const { user } = useAuthStore()

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
        <FeaturedMovies />

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
