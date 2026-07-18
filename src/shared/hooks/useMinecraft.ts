import { useQuery } from '@tanstack/react-query'
import { minecraftApi } from '@/shared/api'
import { queryKeys } from '@/shared/api/query-keys'

export function useMinecraftSessions() {
  return useQuery({
    queryKey: queryKeys.minecraft.sessions,
    queryFn: minecraftApi.getSessions,
    refetchInterval: 5000,
  })
}

export function useMinecraftModLoaders() {
  return useQuery({
    queryKey: queryKeys.minecraft.modLoaders,
    queryFn: minecraftApi.getModLoaders,
    staleTime: Infinity,
  })
}

export function useMinecraftStats() {
  return useQuery({
    queryKey: queryKeys.minecraft.stats,
    queryFn: minecraftApi.getStats,
  })
}
