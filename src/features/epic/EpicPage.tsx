import { useTranslation } from 'react-i18next'
import { Crosshair, HardDrive, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'
import { ErrorState, LoadingState, EmptyState } from '@/shared/ui/states'
import { useEpicLibrary } from '@/shared/hooks/useEpic'

function formatBytes(bytes: number | null): string {
  if (!bytes) return '--'
  if (bytes < 1024 ** 3) return `${(bytes / 1024 ** 2).toFixed(0)} MB`
  return `${(bytes / 1024 ** 3).toFixed(1)} GB`
}

export function EpicPage() {
  const { t } = useTranslation()
  const { data: games, isLoading, error, refetch } = useEpicLibrary()

  if (isLoading) return <LoadingState />
  if (error) return <ErrorState onRetry={refetch} />

  const installedGames = games?.filter((g) => g.is_installed) ?? []
  const notInstalledGames = games?.filter((g) => !g.is_installed) ?? []

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">{t('nav.epic')}</h1>
        <div className="mt-1 h-0.5 w-8 bg-red-500" />
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-5">
            <p className="text-xs text-[#71717A] uppercase tracking-wider">{t('common.games')}</p>
            <p className="mt-1 text-2xl font-bold text-white">{games?.length ?? 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-xs text-[#71717A] uppercase tracking-wider">{t('epic.installed')}</p>
            <p className="mt-1 text-2xl font-bold text-white">{installedGames.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-xs text-[#71717A] uppercase tracking-wider">{t('common.not_installed')}</p>
            <p className="mt-1 text-2xl font-bold text-white">{notInstalledGames.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Games */}
      <Card>
        <CardHeader>
          <CardTitle>{t('epic.library')}</CardTitle>
        </CardHeader>
        <CardContent>
          {games && games.length > 0 ? (
            <div className="space-y-2">
              {games.map((game) => (
                <div
                  key={game.app_name}
                  className="flex items-center justify-between rounded-lg p-3 hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5">
                      <Crosshair className="h-5 w-5 text-[#71717A]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{game.app_title}</p>
                      <div className="mt-1 flex items-center gap-2">
                        <Badge variant={game.is_installed ? 'default' : 'secondary'}>
                          {game.is_installed ? t('epic.installed') : t('epic.not_installed')}
                        </Badge>
                        {game.app_version && (
                          <span className="text-[10px] text-[#52525B]">v{game.app_version}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right text-xs text-[#71717A]">
                    {game.install_size && (
                      <div className="flex items-center gap-1">
                        <HardDrive className="h-3 w-3" />
                        <span>{formatBytes(game.install_size)}</span>
                      </div>
                    )}
                    {game.total_time_played != null && game.total_time_played > 0 && (
                      <div className="flex items-center gap-1 mt-1">
                        <Clock className="h-3 w-3" />
                        <span>{game.total_time_played} dk</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Crosshair}
              title={t('epic.no_games')}
              description={t('common.setup_required')}
              className="py-8"
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
