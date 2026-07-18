import { useQuery } from '@tanstack/react-query'
import { xboxApi } from '@/shared/api'
import { queryKeys } from '@/shared/api/query-keys'

export function useXboxLibrary(xuid: string | null) {
  return useQuery({
    queryKey: queryKeys.xbox.library(xuid ?? ''),
    queryFn: () => xboxApi.getLibrary(xuid!),
    enabled: !!xuid,
  })
}
