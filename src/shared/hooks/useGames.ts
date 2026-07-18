import { useQuery } from '@tanstack/react-query'
import { gameApi } from '@/shared/api'
import { queryKeys } from '@/shared/api/query-keys'

export function useGames() {
  return useQuery({
    queryKey: queryKeys.games,
    queryFn: gameApi.list,
  })
}
