import { useTranslation } from 'react-i18next'
import { Store, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'
import { ErrorState, LoadingState, EmptyState } from '@/shared/ui/states'
import { useMicrosoftLibrary, useMicrosoftStats } from '@/shared/hooks/useMicrosoft'
import { formatPlaytimeHours } from '@/shared/lib/format'

export function MicrosoftPage() {
  const { t } = useTranslation()
  const { data: games, isLoading, error, refetch } = useMicrosoftLibrary()
  const { data: stats } = useMicrosoftStats()

  if (isLoading) return <LoadingState />
  if (error) return <ErrorState onRetry={refetch} />

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">{t('nav.microsoft')}</h1>
        <div className="mt-1 h-0.5 w-8 bg-red-500" />
      </div>

      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-5">
              <p className="text-xs text-[#71717A] uppercase tracking-wider">{t('common.games')}</p>
              <p className="mt-1 text-2xl font-bold text-white">{stats.toplam_oyun}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <p className="text-xs text-[#71717A] uppercase tracking-wider">{t('common.installed')}</p>
              <p className="mt-1 text-2xl font-bold text-white">{stats.yuklu_oyun}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <p className="text-xs text-[#71717A] uppercase tracking-wider">{t('microsoft.publisher')}</p>
              <p className="mt-1 text-2xl font-bold text-white">{stats.uretici_sayisi}</p>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>{t('microsoft.library')}</CardTitle>
        </CardHeader>
        <CardContent>
          {games && games.length > 0 ? (
            <div className="space-y-2">
              {games.map((game) => (
                <div
                  key={game.package_full_name}
                  className="flex items-center justify-between rounded-lg p-3 hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5">
                      <Store className="h-5 w-5 text-[#71717A]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{game.display_name}</p>
                      <div className="mt-1 flex items-center gap-2">
                        <Badge variant={game.is_installed ? 'default' : 'secondary'}>
                          {game.is_installed ? t('common.installed') : t('common.not_installed')}
                        </Badge>
                        {game.publisher && <span className="text-[10px] text-[#52525B]">{game.publisher}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    {game.total_time_played != null && game.total_time_played > 0 && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-[#71717A]" />
                        <span className="text-xs text-[#A1A1AA]">{formatPlaytimeHours(Math.round(game.total_time_played / 60))}</span>
                      </div>
                    )}
                    {game.version && (
                      <p className="text-[10px] text-[#52525B] mt-1">v{game.version}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Store}
              title={t('microsoft.no_games')}
              description={t('common.no_data')}
              className="py-8"
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
