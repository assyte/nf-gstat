import { useQuery } from '@tanstack/react-query'
import { playstationApi } from '@/shared/api'
import { queryKeys } from '@/shared/api/query-keys'

export function usePlayStationLibrary(accountId: string | null) {
  return useQuery({
    queryKey: queryKeys.playstation.library(accountId ?? ''),
    queryFn: () => playstationApi.getLibrary(accountId!),
    enabled: !!accountId,
  })
}

export function usePlayStationStats(accountId: string | null) {
  return useQuery({
    queryKey: queryKeys.playstation.stats(accountId ?? ''),
    queryFn: () => playstationApi.getStats(accountId!),
    enabled: !!accountId,
  })
}
