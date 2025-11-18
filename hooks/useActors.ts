import { actorsApi } from '@/lib/api/actors'
import { useQuery } from '@tanstack/react-query'

// Query keys for consistent caching
export const actorQueryKeys = {
  all: ['actors'] as const,
  detail: (id: number) => [...actorQueryKeys.all, 'detail', id] as const,
}

// Hook to fetch a specific actor by ID
export const useActor = (id: number | undefined) => {
  return useQuery({
    queryKey: actorQueryKeys.detail(id ?? 0),
    queryFn: () => actorsApi.getActorById(id!),
    enabled: !!id, // Only run query if id is provided
    staleTime: 1000 * 60 * 30, // 30 minutes - actor details rarely change
    gcTime: 1000 * 60 * 60, // 1 hour
  })
}
