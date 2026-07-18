import { useQuery } from '@tanstack/react-query'
import { processApi } from '@/shared/api'
import { queryKeys } from '@/shared/api/query-keys'

export function useActiveGames() {
  return useQuery({
    queryKey: queryKeys.activeGames,
    queryFn: processApi.getActiveGames,
    refetchInterval: 5000,
  })
}

export function useActiveCount() {
  return useQuery({
    queryKey: queryKeys.activeCount,
    queryFn: processApi.getActiveCount,
    refetchInterval: 5000,
  })
}
