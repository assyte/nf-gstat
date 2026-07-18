import { useTranslation } from 'react-i18next'
import { Activity, Clock, Gamepad2, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'
import { ErrorState, LoadingState, EmptyState } from '@/shared/ui/states'
import { useActiveGames, useActiveCount } from '@/shared/hooks/useActiveGames'
import { useGames } from '@/shared/hooks/useGames'
import { useMinecraftSessions } from '@/shared/hooks/useMinecraft'
import { useEpicLibrary } from '@/shared/hooks/useEpic'
import { useMicrosoftLibrary } from '@/shared/hooks/useMicrosoft'
import { formatPlaytime } from '@/shared/lib/format'

export function DashboardPage() {
  const { t } = useTranslation()

  const { data: games, isLoading: gamesLoading, error: gamesError, refetch: refetchGames } = useGames()
  const { data: activeGames, isLoading: activeLoading } = useActiveGames()
  const { data: activeCount = 0 } = useActiveCount()
  const { data: mcSessions } = useMinecraftSessions()
  const { data: epicGames } = useEpicLibrary()
  const { data: msGames } = useMicrosoftLibrary()

  const totalPlaytime = games?.reduce((sum, g) => sum + g.toplam_sure, 0) ?? 0
  const avgPlaytime = games && games.length > 0 ? Math.round(totalPlaytime / games.length) : 0

  const stats = [
    { label: t('dashboard.total_games'), value: String(games?.length ?? 0), icon: Gamepad2 },
    { label: t('dashboard.active'), value: String(activeCount), icon: Activity },
    { label: t('dashboard.total_time'), value: formatPlaytime(totalPlaytime), icon: Clock },
    { label: t('dashboard.average'), value: formatPlaytime(avgPlaytime), icon: TrendingUp },
  ]

  if (gamesLoading) return <LoadingState />
  if (gamesError) return <ErrorState onRetry={refetchGames} />

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome */}
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">
          {t('dashboard.welcome')}
        </h1>
        <div className="mt-1 h-0.5 w-8 bg-red-500" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="group hover:border-red-500/20 hover:shadow-glow-sm transition-all duration-150">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-[#71717A] uppercase tracking-wider">
                    {stat.label}
                  </p>
                  <p className="mt-1 text-2xl font-bold text-white">{stat.value}</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10">
                  <stat.icon className="h-5 w-5 text-red-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Active Games */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${activeCount > 0 ? 'bg-red-500 animate-pulse-subtle' : 'bg-[#71717A]'}`} />
            {t('dashboard.active_games')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activeLoading ? (
            <div className="py-4 text-center text-sm text-[#71717A]">{t('common.loading')}</div>
          ) : activeGames && activeGames.length > 0 ? (
            <div className="space-y-3">
              {activeGames.map((game, i) => (
                <div
                  key={`${game.pid}-${i}`}
                  className="flex items-center justify-between rounded-lg bg-white/[0.02] border border-white/5 p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                      <Gamepad2 className="h-5 w-5 text-red-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{game.oyun_adi}</p>
                      <p className="text-xs text-[#71717A]">{game.process_adi}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="default">AKTİF</Badge>
                    <p className="mt-1 text-sm font-mono text-white">{formatPlaytime(game.suresi)}</p>
                    <p className="text-[10px] text-[#71717A]">{t('dashboard.this_session')}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState title={t('dashboard.no_active')} className="py-8" />
          )}
        </CardContent>
      </Card>

      {/* Recent Games */}
      <Card>
        <CardHeader>
          <CardTitle>{t('dashboard.recent')}</CardTitle>
        </CardHeader>
        <CardContent>
          {games && games.length > 0 ? (
            <div className="space-y-2">
              {games.slice(0, 5).map((game, i) => (
                <div
                  key={game.id}
                  className="flex items-center justify-between rounded-lg p-3 hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-[#52525B] w-5">{i + 1}</span>
                    <p className="text-sm text-white">{game.oyun_adi}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-mono text-[#A1A1AA]">{formatPlaytime(game.toplam_sure)}</p>
                    <p className="text-[10px] text-[#71717A]">{game.son_oynama ?? '--'}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState title={t('library.empty')} description={t('library.empty_desc')} className="py-8" />
          )}
        </CardContent>
      </Card>

      {/* Platform Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Platform Durumu</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { name: 'Minecraft', count: mcSessions?.length ?? 0 },
              { name: 'Epic Games', count: epicGames?.length ?? 0 },
              { name: 'Microsoft Store', count: msGames?.length ?? 0 },
            ].map((p) => (
              <div key={p.name} className="rounded-lg bg-white/[0.02] border border-white/5 p-3">
                <p className="text-xs text-[#71717A]">{p.name}</p>
                <p className="mt-1 text-lg font-bold text-white">{p.count}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
