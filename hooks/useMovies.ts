import { moviesApi } from '@/lib/api/movies'
import { useQuery } from '@tanstack/react-query'

// Query keys for consistent caching
export const movieQueryKeys = {
  all: ['movies'] as const,
  trending: () => [...movieQueryKeys.all, 'trending'] as const,
  recommended: () => [...movieQueryKeys.all, 'recommended'] as const,
  detail: (id: number) => [...movieQueryKeys.all, 'detail', id] as const,
  search: (query: string) => [...movieQueryKeys.all, 'search', query] as const,
}

// Hook to fetch trending movies
export const useTrendingMovies = () => {
  return useQuery({
    queryKey: movieQueryKeys.trending(),
    queryFn: moviesApi.getTrendingMovies,
    staleTime: 1000 * 60 * 10, // 10 minutes - trending movies change less frequently
    gcTime: 1000 * 60 * 30, // 30 minutes
  })
}

// Hook to fetch recommended movies
export const useRecommendedMovies = () => {
  return useQuery({
    queryKey: movieQueryKeys.recommended(),
    queryFn: moviesApi.getRecommendedMovies,
    staleTime: 1000 * 60 * 15, // 15 minutes - recommendations are more personalized
    gcTime: 1000 * 60 * 30, // 30 minutes
  })
}

// Hook to fetch a specific movie by ID
export const useMovie = (id: number) => {
  return useQuery({
    queryKey: movieQueryKeys.detail(id),
    queryFn: () => moviesApi.getMovieById(id),
    enabled: !!id, // Only run query if id is provided
    staleTime: 1000 * 60 * 30, // 30 minutes - movie details rarely change
    gcTime: 1000 * 60 * 60, // 1 hour
  })
}

// Hook to search movies
export const useSearchMovies = (query: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: movieQueryKeys.search(query),
    queryFn: () => moviesApi.searchMovies(query),
    enabled: enabled && query.length > 0, // Only search if query is provided
    staleTime: 1000 * 60 * 5, // 5 minutes - search results can change
    gcTime: 1000 * 60 * 10, // 10 minutes
  })
}
