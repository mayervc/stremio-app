import { ticketsApi } from '@/lib/api/tickets'
import { useMutation } from '@tanstack/react-query'

export const googleWalletTokenQueryKeys = {
  all: ['google-wallet-token'] as const,
}

export const useGoogleWalletToken = () => {
  return useMutation({
    mutationFn: async (ticketId: number) => {
      return await ticketsApi.getGoogleWalletToken(ticketId)
    },
  })
}
