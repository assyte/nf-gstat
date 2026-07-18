import { useQuery } from '@tanstack/react-query'
import { epicApi } from '@/shared/api'
import { queryKeys } from '@/shared/api/query-keys'

export function useEpicLibrary() {
  return useQuery({
    queryKey: queryKeys.epic.library,
    queryFn: epicApi.getLibrary,
  })
}
