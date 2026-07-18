import { useQuery } from '@tanstack/react-query'
import { microsoftApi } from '@/shared/api'
import { queryKeys } from '@/shared/api/query-keys'

export function useMicrosoftLibrary() {
  return useQuery({
    queryKey: queryKeys.microsoft.library,
    queryFn: microsoftApi.getLibrary,
  })
}
