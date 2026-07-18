import { useQuery } from '@tanstack/react-query'
import { steamApi } from '@/shared/api'
import { queryKeys } from '@/shared/api/query-keys'

export function useSteamLibrary(steamId: string | null) {
  return useQuery({
    queryKey: queryKeys.steam.library(steamId ?? ''),
    queryFn: () => steamApi.getLibrary(steamId!),
    enabled: !!steamId,
  })
}

export function useSteamUser(steamId: string | null) {
  return useQuery({
    queryKey: queryKeys.steam.user(steamId ?? ''),
    queryFn: () => steamApi.getUserSummary(steamId!),
    enabled: !!steamId,
  })
}

export function useSteamRecentlyPlayed(steamId: string | null, count: number = 5) {
  return useQuery({
    queryKey: queryKeys.steam.recentlyPlayed(steamId ?? ''),
    queryFn: () => steamApi.getRecentlyPlayed(steamId!, count),
    enabled: !!steamId,
  })
}

export function useSteamStats(steamId: string | null) {
  return useQuery({
    queryKey: queryKeys.steam.stats(steamId ?? ''),
    queryFn: () => steamApi.getStats(steamId!),
    enabled: !!steamId,
  })
}
