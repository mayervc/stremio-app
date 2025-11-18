import { Ionicons } from '@expo/vector-icons'
import { Image } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import { router, useLocalSearchParams } from 'expo-router'
import { useMemo } from 'react'
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'

import { ThemedSafeAreaView } from '@/components/themed-safe-area-view'
import { ThemedText } from '@/components/themed-text'
import { Colors } from '@/constants/theme'
import { useThemeColor } from '@/hooks/use-theme-color'
import { Actor } from '@/lib/api/types'

const formatBirthDate = (date?: string | null) => {
  if (!date) {
    return 'N/A'
  }
  const parsedDate = new Date(date)
  if (Number.isNaN(parsedDate.getTime())) {
    return date
  }
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(parsedDate)
}

const formatOccupations = (occupations?: string[] | null) => {
  if (!occupations || occupations.length === 0) {
    return 'N/A'
  }
  return occupations.join(' - ')
}

const formatPartners = (
  partners?: Array<{ name: string; period: string }> | null
) => {
  if (!partners || partners.length === 0) {
    return null
  }
  return partners.map(p => `${p.name} (${p.period})`).join('\n')
}

export default function ActorDetailsScreen() {
  const params = useLocalSearchParams<{ id?: string }>()
  const actorId = useMemo(() => {
    const parsed = Number(params.id)
    return Number.isFinite(parsed) ? parsed : undefined
  }, [params.id])

  // TODO: Replace with real API call
  const isLoading = false
  const actor: Actor | null = useMemo(() => {
    // Mock data for view-only implementation
    if (!actorId) {
      return null
    }
    return {
      id: actorId,
      firstName: 'Keanu',
      lastName: 'Reeves',
      nickName: null,
      birthdate: '1964-09-02',
      birthPlace: 'Beirut, Lebanon',
      height: '1.86 m',
      occupations: ['Actor', 'Musician'],
      partners: [
        { name: 'Jennifer Syme', period: '1998-2000, 2001; her death' },
        { name: 'Alexandra Grant', period: 'c. 2018-present' },
      ],
      biography:
        'Keanu Charles Reeves is a Canadian actor and musician. The recipient of numerous accolades in a career on screen spanning four decades, he is known for his leading roles in action films, his amiable public image, and his philanthropic efforts.',
      profile_image: null,
      movies: [
        { id: 1, title: 'Movie 1' },
        { id: 2, title: 'Movie 2' },
        { id: 3, title: 'Movie 3' },
        { id: 4, title: 'Movie 4' },
        { id: 5, title: 'Movie 5' },
      ],
    }
  }, [actorId])

  const backgroundColor = useThemeColor(
    {
      light: Colors.light.backgroundPrimary,
      dark: Colors.dark.backgroundPrimary,
    },
    'backgroundPrimary'
  )
  const cardBackgroundColor = useThemeColor(
    {
      light: Colors.light.backgroundSecondary,
      dark: Colors.dark.backgroundSecondary,
    },
    'backgroundSecondary'
  )
  const textPrimaryColor = useThemeColor(
    { light: Colors.light.textPrimary, dark: Colors.dark.textPrimary },
    'textPrimary'
  )
  const textSecondaryColor = useThemeColor(
    { light: Colors.light.textSecondary, dark: Colors.dark.textSecondary },
    'textSecondary'
  )
  const accentColor = useThemeColor(
    { light: Colors.light.buttonPrimary, dark: Colors.dark.buttonPrimary },
    'buttonPrimary'
  )
  const dividerColor = useThemeColor(
    { light: Colors.light.borderSecondary, dark: Colors.dark.borderSecondary },
    'borderSecondary'
  )
  const buttonTextColor = useThemeColor(
    { light: Colors.light.textWhite, dark: Colors.dark.textWhite },
    'textWhite'
  )
  const placeholderColor = useThemeColor(
    {
      light: Colors.light.backgroundPlaceholder,
      dark: Colors.dark.backgroundPlaceholder,
    },
    'backgroundPlaceholder'
  )
  const placeholderIconColor = useThemeColor(
    { light: Colors.light.iconPrimary, dark: Colors.dark.iconPrimary },
    'iconPrimary'
  )

  const handleGoBack = () => {
    router.back()
  }

  if (isLoading) {
    return (
      <ThemedSafeAreaView
        style={[styles.loadingContainer, { backgroundColor }]}
      >
        <ActivityIndicator size='large' color={accentColor} />
      </ThemedSafeAreaView>
    )
  }

  if (!actor) {
    return null
  }

  const actorName =
    [actor.firstName, actor.lastName].filter(Boolean).join(' ').trim() ||
    actor.nickName ||
    'Unknown Actor'
  const heroImage = actor.profile_image

  return (
    <ThemedSafeAreaView style={[styles.container, { backgroundColor }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroContainer}>
          {heroImage ? (
            <Image
              source={{ uri: heroImage }}
              style={styles.heroImage}
              contentFit='cover'
            />
          ) : (
            <View
              style={[
                styles.heroPlaceholder,
                { backgroundColor: placeholderColor },
              ]}
            >
              <Ionicons
                name='person-outline'
                size={64}
                color={placeholderIconColor}
              />
            </View>
          )}
          <LinearGradient
            colors={['rgba(0,0,0,0.15)', 'rgba(0,0,0,0.6)', backgroundColor]}
            style={styles.heroGradient}
          />
          <View style={styles.heroHeader}>
            <TouchableOpacity
              onPress={handleGoBack}
              style={styles.heroIconButton}
            >
              <Ionicons name='arrow-back' size={24} color='#FFFFFF' />
            </TouchableOpacity>
            <TouchableOpacity style={styles.heroIconButton}>
              <Ionicons name='ellipsis-vertical' size={22} color='#FFFFFF' />
            </TouchableOpacity>
          </View>
        </View>

        <View
          style={[styles.detailsCard, { backgroundColor: cardBackgroundColor }]}
        >
          <View style={styles.titleRow}>
            <View style={styles.titleContainer}>
              <ThemedText style={[styles.title, { color: textPrimaryColor }]}>
                {actorName}
              </ThemedText>
              {actor.birthPlace ? (
                <ThemedText
                  style={[styles.subtitle, { color: textSecondaryColor }]}
                >
                  {actor.birthPlace.toUpperCase()}
                </ThemedText>
              ) : null}
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: dividerColor }]} />

          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <ThemedText
                style={[styles.metaLabel, { color: textSecondaryColor }]}
              >
                Born
              </ThemedText>
              <ThemedText
                style={[styles.metaValue, { color: textPrimaryColor }]}
              >
                {formatBirthDate(actor.birthdate)}
              </ThemedText>
            </View>
            <View style={styles.metaItem}>
              <ThemedText
                style={[styles.metaLabel, { color: textSecondaryColor }]}
              >
                Height
              </ThemedText>
              <ThemedText
                style={[styles.metaValue, { color: textPrimaryColor }]}
              >
                {actor.height ?? 'N/A'}
              </ThemedText>
            </View>
            <View style={styles.metaItem}>
              <ThemedText
                style={[styles.metaLabel, { color: textSecondaryColor }]}
              >
                Occupations
              </ThemedText>
              <ThemedText
                style={[styles.metaValue, { color: textPrimaryColor }]}
              >
                {formatOccupations(actor.occupations)}
              </ThemedText>
            </View>
          </View>

          {actor.partners && actor.partners.length > 0 ? (
            <>
              <View
                style={[styles.divider, { backgroundColor: dividerColor }]}
              />
              <View style={styles.section}>
                <ThemedText
                  style={[styles.sectionTitle, { color: textPrimaryColor }]}
                >
                  Partners
                </ThemedText>
                <ThemedText
                  style={[styles.sectionText, { color: textSecondaryColor }]}
                >
                  {formatPartners(actor.partners)}
                </ThemedText>
              </View>
            </>
          ) : null}

          {actor.biography ? (
            <>
              <View
                style={[styles.divider, { backgroundColor: dividerColor }]}
              />
              <View style={styles.section}>
                <ThemedText
                  style={[styles.sectionTitle, { color: textPrimaryColor }]}
                >
                  Biography
                </ThemedText>
                <ThemedText
                  style={[styles.sectionText, { color: textSecondaryColor }]}
                >
                  {actor.biography}
                </ThemedText>
              </View>
            </>
          ) : null}

          {actor.movies && actor.movies.length > 0 ? (
            <>
              <View
                style={[styles.divider, { backgroundColor: dividerColor }]}
              />
              <View style={styles.section}>
                <ThemedText
                  style={[styles.sectionTitle, { color: textPrimaryColor }]}
                >
                  Movies
                </ThemedText>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.moviesList}
                >
                  {actor.movies.map(movie => (
                    <View key={movie.id} style={styles.movieItem}>
                      {movie.image || movie.image_url ? (
                        <Image
                          source={{ uri: movie.image || movie.image_url }}
                          style={styles.moviePoster}
                          contentFit='cover'
                        />
                      ) : (
                        <View
                          style={[
                            styles.moviePosterPlaceholder,
                            { backgroundColor: placeholderColor },
                          ]}
                        >
                          <Ionicons
                            name='film-outline'
                            size={24}
                            color={placeholderIconColor}
                          />
                        </View>
                      )}
                    </View>
                  ))}
                </ScrollView>
              </View>
            </>
          ) : null}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.bookButton, { backgroundColor: accentColor }]}
          onPress={() => router.push('/(tabs)/tickets')}
        >
          <ThemedText
            style={[styles.bookButtonText, { color: buttonTextColor }]}
          >
            Book Tickets
          </ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedSafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  heroContainer: {
    width: '100%',
    aspectRatio: 0.75,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  heroHeader: {
    position: 'absolute',
    top: 40,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroIconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsCard: {
    marginHorizontal: 20,
    marginTop: -60,
    borderRadius: 32,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 4,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 16,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 1,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginVertical: 20,
    opacity: 0.6,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 16,
  },
  metaItem: {
    flex: 1,
  },
  metaLabel: {
    fontSize: 12,
    textTransform: 'uppercase',
    marginBottom: 6,
    letterSpacing: 0.8,
  },
  metaValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  sectionText: {
    fontSize: 14,
    lineHeight: 20,
  },
  moviesList: {
    paddingTop: 8,
  },
  movieItem: {
    marginRight: 12,
  },
  moviePoster: {
    width: 100,
    height: 150,
    borderRadius: 12,
  },
  moviePosterPlaceholder: {
    width: 100,
    height: 150,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 24,
    paddingBottom: 32,
    paddingTop: 16,
    backgroundColor: 'transparent',
  },
  bookButton: {
    borderRadius: 24,
    paddingVertical: 18,
    alignItems: 'center',
  },
  bookButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
