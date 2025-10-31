import { Ionicons } from '@expo/vector-icons'
import { Image } from 'expo-image'
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native'

import FeaturedMovies from '@/components/featured-movies'
import HeaderBar from '@/components/header-bar'
import { ThemedSafeAreaView } from '@/components/themed-safe-area-view'
import { ThemedText } from '@/components/themed-text'
import { useRecommendedMovies } from '@/hooks/useMovies'
import { useAuthStore } from '@/store/authStore'

export default function HomeScreen() {
  const { user } = useAuthStore()
  const { data: recommendedData } = useRecommendedMovies()
  const recommendedMovies = (recommendedData?.movies || []).map((m: any) => ({
    id: m.id,
    title: m.title,
    image: { uri: m.image_url },
  }))

  const renderMovieCard = ({ item }: { item: any }) => (
    <View style={styles.movieCard}>
      <View style={styles.posterContainer}>
        <Image
          source={item.image}
          style={styles.moviePoster}
          contentFit='cover'
        />
        <View style={styles.playOverlay}>
          <Ionicons name='play-outline' size={24} color='#FFFFFF' />
        </View>
      </View>
      <ThemedText style={styles.movieTitle}>{item.title}</ThemedText>
    </View>
  )

  return (
    <ThemedSafeAreaView style={styles.container}>
      <HeaderBar />
      <View style={styles.content}>
        <FeaturedMovies />
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
