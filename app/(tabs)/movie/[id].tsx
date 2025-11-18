import { Ionicons } from '@expo/vector-icons'
import { Image } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import { router, useLocalSearchParams } from 'expo-router'
import { useEffect, useMemo } from 'react'
import {
  ActivityIndicator,
  Linking,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'
import Toast from 'react-native-toast-message'

import { ThemedSafeAreaView } from '@/components/themed-safe-area-view'
import { ThemedText } from '@/components/themed-text'
import { Colors } from '@/constants/theme'
import { useThemeColor } from '@/hooks/use-theme-color'
import { useMovie } from '@/hooks/useMovies'

type NormalizedCastMember = {
  id: string
  name: string
  character?: string
  image?: string
}

const formatDuration = (minutes?: number) => {
  if (!minutes || Number.isNaN(minutes)) {
    return 'N/A'
  }
  const hrs = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (!hrs) {
    return `${mins}min`
  }
  return `${hrs}hr${hrs > 1 ? 's' : ''}:${mins.toString().padStart(2, '0')}min`
}

const formatReleaseDate = (date?: string) => {
  if (!date) {
    return 'N/A'
  }
  const parsedDate = new Date(date)
  if (Number.isNaN(parsedDate.getTime())) {
    return date
  }
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(parsedDate)
}

const formatLanguages = (languages?: string | string[]) => {
  if (!languages || (Array.isArray(languages) && languages.length === 0)) {
    return 'N/A'
  }
  if (Array.isArray(languages)) {
    return languages.join(', ')
  }
  return languages
}

const formatSubtitle = (genre?: string, formats?: string | string[]) => {
  const genreText = genre ? genre.toUpperCase() : null
  let formatsText: string | null = null

  if (Array.isArray(formats)) {
    formatsText = formats.join('.').toUpperCase()
  } else if (typeof formats === 'string' && formats.trim().length > 0) {
    formatsText = formats.toUpperCase()
  }

  return [genreText, formatsText].filter(Boolean).join(' ')
}

export default function MovieDetailsScreen() {
  const params = useLocalSearchParams<{ id?: string }>()
  const movieId = useMemo(() => {
    const parsed = Number(params.id)
    return Number.isFinite(parsed) ? parsed : undefined
  }, [params.id])

  const { data: movie, isLoading, isError, error } = useMovie(movieId ?? 0)

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

  useEffect(() => {
    if (isError && error) {
      Toast.show({
        type: 'error',
        text1: 'Unable to load movie',
        text2: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }, [isError, error])

  useEffect(() => {
    if (!movieId) {
      Toast.show({
        type: 'error',
        text1: 'Invalid movie',
        text2: 'Movie identifier is missing.',
      })
      router.back()
    }
  }, [movieId])

  const handleGoBack = () => {
    router.back()
  }

  const handleActorPress = (actorId: string) => {
    router.push(`/actor/${actorId}`)
  }

  const handleWatchTrailer = async () => {
    if (!movie?.trailerUrl) {
      return
    }

    try {
      const canOpen = await Linking.canOpenURL(movie.trailerUrl)
      if (canOpen) {
        await Linking.openURL(movie.trailerUrl)
      } else {
        Toast.show({
          type: 'error',
          text1: 'Unable to open trailer',
          text2: 'The trailer link is invalid.',
        })
      }
    } catch (err) {
      console.error('Failed to open trailer:', err)
      Toast.show({
        type: 'error',
        text1: 'Unable to open trailer',
        text2: 'Please try again later.',
      })
    }
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

  if (!movie) {
    return null
  }

  const subtitle = formatSubtitle(movie.genre, movie.formats)
  const heroImage = movie.image || movie.image_url

  const castMembers = useMemo<NormalizedCastMember[]>(() => {
    if (!Array.isArray(movie.actors) || movie.actors.length === 0) {
      return []
    }

    return movie.actors
      .map((actorWithCast: any) => {
        if (!actorWithCast) {
          return null
        }

        const name =
          [actorWithCast.firstName, actorWithCast.lastName]
            .filter(Boolean)
            .join(' ')
            .trim() ||
          actorWithCast.nickName ||
          ''

        if (!name) {
          return null
        }

        const id = actorWithCast.id ?? String(actorWithCast.tmdb_id ?? name)

        // Get character info from nested cast object
        const castInfo = actorWithCast.cast
        const character =
          (Array.isArray(castInfo?.characters) && castInfo.characters.length > 0
            ? castInfo.characters.join(', ')
            : null) ||
          castInfo?.role ||
          undefined

        const image =
          actorWithCast.profile_image &&
          actorWithCast.profile_image.trim().length > 0
            ? actorWithCast.profile_image
            : undefined

        const normalized: NormalizedCastMember = {
          id: String(id),
          name,
        }

        if (character) {
          normalized.character = character
        }

        if (image) {
          normalized.image = image
        }

        return normalized
      })
      .filter((member): member is NormalizedCastMember => member !== null)
  }, [movie.actors])

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
                name='image-outline'
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
                {movie.title}
              </ThemedText>
              {subtitle ? (
                <ThemedText
                  style={[styles.subtitle, { color: textSecondaryColor }]}
                >
                  {subtitle}
                </ThemedText>
              ) : null}
            </View>

            {movie.trailerUrl ? (
              <TouchableOpacity
                style={[styles.trailerButton, { backgroundColor: accentColor }]}
                onPress={handleWatchTrailer}
              >
                <Ionicons name='play' size={16} color={buttonTextColor} />
                <ThemedText
                  style={[styles.trailerButtonText, { color: buttonTextColor }]}
                >
                  Watch Trailer
                </ThemedText>
              </TouchableOpacity>
            ) : null}
          </View>

          <View style={[styles.divider, { backgroundColor: dividerColor }]} />

          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <ThemedText
                style={[styles.metaLabel, { color: textSecondaryColor }]}
              >
                Censor Rating
              </ThemedText>
              <ThemedText
                style={[styles.metaValue, { color: textPrimaryColor }]}
              >
                {movie.rating ?? 'N/A'}
              </ThemedText>
            </View>
            <View style={styles.metaItem}>
              <ThemedText
                style={[styles.metaLabel, { color: textSecondaryColor }]}
              >
                Duration
              </ThemedText>
              <ThemedText
                style={[styles.metaValue, { color: textPrimaryColor }]}
              >
                {formatDuration(movie.duration)}
              </ThemedText>
            </View>
            <View style={styles.metaItem}>
              <ThemedText
                style={[styles.metaLabel, { color: textSecondaryColor }]}
              >
                Release date
              </ThemedText>
              <ThemedText
                style={[styles.metaValue, { color: textPrimaryColor }]}
              >
                {formatReleaseDate(movie.releaseDate)}
              </ThemedText>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: dividerColor }]} />

          <View style={styles.section}>
            <ThemedText
              style={[styles.sectionTitle, { color: textPrimaryColor }]}
            >
              Available in languages
            </ThemedText>
            <ThemedText
              style={[styles.sectionText, { color: textSecondaryColor }]}
            >
              {formatLanguages(movie.language)}
            </ThemedText>
          </View>

          <View style={[styles.divider, { backgroundColor: dividerColor }]} />

          <View style={styles.section}>
            <ThemedText
              style={[styles.sectionTitle, { color: textPrimaryColor }]}
            >
              Story Plot
            </ThemedText>
            <ThemedText
              style={[styles.sectionText, { color: textSecondaryColor }]}
            >
              {movie.description ?? 'Description coming soon.'}
            </ThemedText>
          </View>

          {castMembers.length > 0 ? (
            <>
              <View
                style={[styles.divider, { backgroundColor: dividerColor }]}
              />
              <View style={styles.section}>
                <ThemedText
                  style={[styles.sectionTitle, { color: textPrimaryColor }]}
                >
                  Cast
                </ThemedText>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.castList}
                >
                  {castMembers.map(member => (
                    <View key={member.id} style={styles.castItem}>
                      <TouchableOpacity
                        onPress={() => handleActorPress(member.id)}
                        activeOpacity={0.7}
                      >
                        <View
                          style={[
                            styles.castAvatar,
                            { borderColor: accentColor },
                            !member.image && {
                              backgroundColor: placeholderColor,
                              borderColor: 'transparent',
                            },
                          ]}
                        >
                          {member.image ? (
                            <Image
                              source={{ uri: member.image }}
                              style={styles.castAvatarImage}
                              contentFit='cover'
                            />
                          ) : (
                            <ThemedText style={styles.castAvatarInitial}>
                              {member.name.charAt(0).toUpperCase()}
                            </ThemedText>
                          )}
                        </View>
                      </TouchableOpacity>
                      <ThemedText
                        style={[styles.castName, { color: textSecondaryColor }]}
                        numberOfLines={1}
                      >
                        {member.name}
                      </ThemedText>
                      {member.character ? (
                        <ThemedText
                          style={[
                            styles.castRole,
                            { color: textSecondaryColor },
                          ]}
                          numberOfLines={1}
                        >
                          {member.character}
                        </ThemedText>
                      ) : null}
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
  trailerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 6,
  },
  trailerButtonText: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.3,
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
  castList: {
    paddingTop: 8,
  },
  castItem: {
    marginRight: 16,
    alignItems: 'center',
    width: 72,
  },
  castAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    backgroundColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  castAvatarImage: {
    width: '100%',
    height: '100%',
  },
  castAvatarInitial: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  castName: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 2,
  },
  castRole: {
    fontSize: 11,
    textAlign: 'center',
    opacity: 0.7,
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
    zIndex: 1000,
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
