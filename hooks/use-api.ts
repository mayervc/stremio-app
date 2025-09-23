import { apiClient } from '@/lib/api'
import { ApiError } from '@/lib/api/types'
import {
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from '@tanstack/react-query'

// Generic hook for GET requests
export function useApiQuery<TData = any, TError = ApiError>(
  queryKey: string[],
  endpoint: string,
  options?: Omit<UseQueryOptions<TData, TError>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey,
    queryFn: async () => {
      const response = await apiClient.get<TData>(endpoint)
      return response.data
    },
    ...options,
  })
}

// Generic hook for POST requests
export function useApiMutation<
  TData = any,
  TVariables = any,
  TError = ApiError,
>(endpoint: string, options?: UseMutationOptions<TData, TError, TVariables>) {
  return useMutation({
    mutationFn: async (variables: TVariables) => {
      const response = await apiClient.post<TData>(endpoint, variables)
      return response.data
    },
    ...options,
  })
}

// Generic hook for PUT requests
export function useApiPutMutation<
  TData = any,
  TVariables = any,
  TError = ApiError,
>(endpoint: string, options?: UseMutationOptions<TData, TError, TVariables>) {
  return useMutation({
    mutationFn: async (variables: TVariables) => {
      const response = await apiClient.put<TData>(endpoint, variables)
      return response.data
    },
    ...options,
  })
}

// Generic hook for DELETE requests
export function useApiDeleteMutation<
  TData = any,
  TVariables = any,
  TError = ApiError,
>(endpoint: string, options?: UseMutationOptions<TData, TError, TVariables>) {
  return useMutation({
    mutationFn: async (variables: TVariables) => {
      const response = await apiClient.delete<TData>(endpoint, {
        data: variables,
      })
      return response.data
    },
    ...options,
  })
}
