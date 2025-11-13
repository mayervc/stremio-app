import { Ionicons } from '@expo/vector-icons'
import { Image } from 'expo-image'
import { router, type Href } from 'expo-router'
import { useEffect, useState } from 'react'
import {
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import Toast from 'react-native-toast-message'
import { useDebounce } from 'use-debounce'

import { ThemedSafeAreaView } from '@/components/themed-safe-area-view'
import { ThemedText } from '@/components/themed-text'
import { Colors } from '@/constants/theme'
import { useThemeColor } from '@/hooks/use-theme-color'
import { useSearchMovies } from '@/hooks/useMovies'
import { Movie } from '@/lib/api/types'
import {
  RecentSearch,
  useRecentSearchesStore,
} from '@/store/recentSearchesStore'

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedQuery] = useDebounce(searchQuery, 500) // 500ms delay
  const {
    recentSearches,
    addRecentSearch,
    removeRecentSearch,
    clearRecentSearches,
  } = useRecentSearchesStore()

  const {
    data: searchData,
    isLoading,
    error,
  } = useSearchMovies(debouncedQuery, debouncedQuery.length > 0)

  // Map search results to include image_url and filter properly
  const searchResults = (searchData?.movies || [])
    .map((m: any) => {
      const imageUrl = m.image_url || m.image
      return {
        id: m.id,
        title: m.title,
        subtitle: m.subtitle,
        image: imageUrl && imageUrl.trim() ? imageUrl : undefined,
        rating: m.rating,
        language: m.language,
        genres: m.genres,
        formats: m.formats,
      }
    })
    .filter((movie: any) => movie.image) // Only show movies with valid images

  const iconColor = useThemeColor(
    { light: Colors.light.iconPrimary, dark: Colors.dark.iconPrimary },
    'icon'
  )
  const textColor = useThemeColor(
    { light: Colors.light.textPrimary, dark: Colors.dark.textPrimary },
    'text'
  )
  const backgroundColor = useThemeColor(
    {
      light: Colors.light.backgroundSecondary,
      dark: Colors.dark.backgroundSecondary,
    },
    'background'
  )
  const borderColor = useThemeColor(
    { light: Colors.light.borderPrimary, dark: Colors.dark.borderPrimary },
    'borderPrimary'
  )
  const placeholderColor = useThemeColor(
    { light: Colors.light.placeholder, dark: Colors.dark.placeholder },
    'placeholder'
  )
  const borderListColor = useThemeColor(
    { light: Colors.light.borderList, dark: Colors.dark.borderList },
    'borderList'
  )
  const backgroundOverlayColor = useThemeColor(
    {
      light: Colors.light.backgroundOverlay,
      dark: Colors.dark.backgroundOverlay,
    },
    'backgroundOverlay'
  )
  const backgroundPlaceholderColor = useThemeColor(
    {
      light: Colors.light.backgroundPlaceholder,
      dark: Colors.dark.backgroundPlaceholder,
    },
    'backgroundPlaceholder'
  )
  const textWhiteColor = useThemeColor(
    { light: Colors.light.textWhite, dark: Colors.dark.textWhite },
    'textWhite'
  )
  const movieTitleColor = useThemeColor(
    { light: Colors.light.textPrimary, dark: Colors.dark.textWhite },
    'text'
  )

  const handleBackPress = () => {
    router.back()
  }

  const handleFilterPress = () => {
    // TODO: Implement filter functionality
    console.log('Filter pressed')
  }

  const navigateToMovieDetails = (movieId: number) => {
    const href = {
      pathname: '/movie/[id]',
      params: { id: String(movieId) },
    } as const

    router.push(href as unknown as Href)
  }

  const handleMoviePress = (movie: Movie) => {
    // Add to recent searches
    addRecentSearch({
      id: movie.id,
      title: movie.title,
      image: movie.image,
      subtitle: movie.subtitle,
    })

    navigateToMovieDetails(movie.id)
  }

  const handleRecentSearchPress = (search: RecentSearch) => {
    // Set search query to recent search
    setSearchQuery(search.title)
    navigateToMovieDetails(search.id)
  }

  const handleRemoveRecentSearch = (id: number) => {
    removeRecentSearch(id)
  }

  const shouldShowRecentSearches =
    searchQuery.length === 0 && recentSearches.length > 0
  const showSearchResults = debouncedQuery.length > 0 && !isLoading && !error
  const showEmptyState = showSearchResults && searchResults.length === 0

  // Show error toast when there's an error
  useEffect(() => {
    if (error) {
      Toast.show({
        type: 'error',
        text1: 'Search Error',
        text2: error instanceof Error ? error.message : 'Error desconocido',
      })
    }
  }, [error])

  const renderRecentSearchItem = ({ item }: { item: RecentSearch }) => (
    <TouchableOpacity
      style={styles.recentSearchCard}
      onPress={() => handleRecentSearchPress(item)}
    >
      <View style={styles.recentSearchPosterContainer}>
        {item.image ? (
          <Image
            source={{ uri: item.image }}
            style={styles.recentSearchPoster}
            contentFit='cover'
          />
        ) : (
          <View
            style={[
              styles.recentSearchPoster,
              styles.placeholderImage,
              { backgroundColor: backgroundPlaceholderColor },
            ]}
          >
            <Ionicons name='image-outline' size={48} color='#666666' />
          </View>
        )}
        <View
          style={[
            styles.recentSearchPlayOverlay,
            { backgroundColor: backgroundOverlayColor },
          ]}
        >
          <Ionicons name='play' size={16} color={textWhiteColor} />
        </View>
      </View>
      <ThemedText
        style={[styles.recentSearchCardTitle, { color: movieTitleColor }]}
        numberOfLines={2}
      >
        {item.title}
      </ThemedText>
    </TouchableOpacity>
  )

  const renderSearchResultItem = ({ item }: { item: Movie }) => (
    <TouchableOpacity
      style={styles.searchResultCard}
      onPress={() => handleMoviePress(item)}
    >
      <View style={styles.searchResultPosterContainer}>
        {item.image ? (
          <Image
            source={{ uri: item.image }}
            style={styles.searchResultPoster}
            contentFit='cover'
          />
        ) : (
          <View
            style={[
              styles.searchResultPoster,
              styles.placeholderImage,
              { backgroundColor: backgroundPlaceholderColor },
            ]}
          >
            <Ionicons name='image-outline' size={48} color='#666666' />
          </View>
        )}
        <View
          style={[
            styles.searchResultPlayOverlay,
            { backgroundColor: backgroundOverlayColor },
          ]}
        >
          <Ionicons name='play' size={16} color={textWhiteColor} />
        </View>
      </View>
      <ThemedText
        style={[styles.searchResultCardTitle, { color: movieTitleColor }]}
        numberOfLines={2}
      >
        {item.title}
      </ThemedText>
    </TouchableOpacity>
  )

  return (
    <ThemedSafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Ionicons name='arrow-back' size={24} color={textColor} />
        </TouchableOpacity>

        <View
          style={[
            styles.searchInputContainer,
            { backgroundColor, borderColor },
          ]}
        >
          <Ionicons
            name='search'
            size={20}
            color={iconColor}
            style={styles.searchIcon}
          />
          <TextInput
            style={[styles.searchInput, { color: textColor }]}
            placeholder='Search any movies name here'
            placeholderTextColor={placeholderColor}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
          />
          <TouchableOpacity
            onPress={handleFilterPress}
            style={styles.filterButtonInside}
          >
            <Ionicons name='options-outline' size={20} color={iconColor} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {shouldShowRecentSearches && (
          <View style={styles.recentSearchesSection}>
            <View style={styles.sectionHeader}>
              <ThemedText style={styles.sectionTitle}>Recent Search</ThemedText>
              {recentSearches.length > 0 && (
                <TouchableOpacity onPress={clearRecentSearches}>
                  <ThemedText style={styles.clearAllText}>Clear All</ThemedText>
                </TouchableOpacity>
              )}
            </View>
            <FlatList
              data={recentSearches}
              renderItem={renderRecentSearchItem}
              keyExtractor={item => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.recentSearchesList}
              contentContainerStyle={styles.recentSearchesListContent}
            />
          </View>
        )}

        {isLoading && debouncedQuery.length > 0 && (
          <View style={styles.loadingContainer}>
            <ThemedText>Searching...</ThemedText>
          </View>
        )}

        {showSearchResults && (
          <View style={styles.searchResultsSection}>
            <View style={styles.sectionHeader}>
              <ThemedText style={styles.sectionTitle}>
                Search Results
              </ThemedText>
            </View>
            <FlatList
              data={searchResults}
              renderItem={renderSearchResultItem}
              keyExtractor={item => item.id.toString()}
              numColumns={2}
              columnWrapperStyle={styles.searchResultsRow}
              showsVerticalScrollIndicator={false}
              style={styles.searchResultsList}
              contentContainerStyle={styles.searchResultsContent}
            />
          </View>
        )}

        {showEmptyState && (
          <View style={styles.emptyContainer}>
            <ThemedText style={styles.emptyText}>
              No movies found for "{debouncedQuery}"
            </ThemedText>
          </View>
        )}
      </View>
    </ThemedSafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 12,
  },
  backButton: {
    padding: 4,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    padding: 0,
  },
  filterButtonInside: {
    padding: 4,
    marginLeft: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  recentSearchesSection: {
    flex: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  clearAllText: {
    fontSize: 14,
    color: '#FF3B30',
    fontWeight: '500',
  },
  recentSearchesList: {
    flex: 1,
  },
  recentSearchesListContent: {
    paddingRight: 20,
  },
  recentSearchCard: {
    marginRight: 16,
    width: 200,
  },
  recentSearchPosterContainer: {
    position: 'relative',
    width: 200,
    height: 250,
    borderRadius: 32,
    overflow: 'hidden',
    marginBottom: 8,
  },
  recentSearchPoster: {
    width: '100%',
    height: '100%',
    borderRadius: 32,
  },
  placeholderImage: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  recentSearchPlayOverlay: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.9,
  },
  recentSearchCardTitle: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
    paddingHorizontal: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
  },
  searchResultsSection: {
    flex: 1,
  },
  searchResultsList: {
    flex: 1,
  },
  searchResultsContent: {
    paddingTop: 8,
  },
  searchResultsRow: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  searchResultCard: {
    width: '48%',
  },
  searchResultPosterContainer: {
    position: 'relative',
    width: '100%',
    aspectRatio: 0.8, // 200/250 ratio
    borderRadius: 32,
    overflow: 'hidden',
    marginBottom: 8,
  },
  searchResultPoster: {
    width: '100%',
    height: '100%',
    borderRadius: 32,
  },
  searchResultPlayOverlay: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.9,
  },
  searchResultCardTitle: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
    paddingHorizontal: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
  },
  emptyText: {
    fontSize: 16,
    opacity: 0.7,
    textAlign: 'center',
  },
})
