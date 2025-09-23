import { ApiResponse, StremioError, stremioService } from '@/lib/api'
import { useCallback, useEffect, useState } from 'react'

// Generic hook for API calls
export function useApiCall<T>(
  apiCall: () => Promise<ApiResponse<T>>,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<StremioError | null>(null)

  const execute = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await apiCall()
      setData(response.data)
    } catch (err) {
      setError(err as StremioError)
    } finally {
      setLoading(false)
    }
  }, dependencies)

  useEffect(() => {
    execute()
  }, [execute])

  return { data, loading, error, refetch: execute }
}

// Specific hooks for Stremio API
export function useSearchContent(
  query: string,
  type: 'movie' | 'series' | 'all' = 'all'
) {
  return useApiCall(
    () => stremioService.searchContent({ query, type }),
    [query, type]
  )
}

export function usePopularMovies(page: number = 1, limit: number = 20) {
  return useApiCall(
    () => stremioService.getPopularMovies(page, limit),
    [page, limit]
  )
}

export function usePopularSeries(page: number = 1, limit: number = 20) {
  return useApiCall(
    () => stremioService.getPopularSeries(page, limit),
    [page, limit]
  )
}

export function useMovieDetails(imdbId: string | null) {
  return useApiCall(
    () =>
      imdbId
        ? stremioService.getMovieDetails(imdbId)
        : Promise.reject('No IMDB ID provided'),
    [imdbId]
  )
}

export function useSeriesDetails(imdbId: string | null) {
  return useApiCall(
    () =>
      imdbId
        ? stremioService.getSeriesDetails(imdbId)
        : Promise.reject('No IMDB ID provided'),
    [imdbId]
  )
}

export function useTrendingContent(type: 'movie' | 'series' = 'movie') {
  return useApiCall(() => stremioService.getTrending(type), [type])
}
