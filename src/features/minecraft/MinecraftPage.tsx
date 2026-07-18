import { useTranslation } from 'react-i18next'
import { Pickaxe, Activity, Layers } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'
import { ErrorState, LoadingState, EmptyState } from '@/shared/ui/states'
import { useMinecraftSessions, useMinecraftStats } from '@/shared/hooks/useMinecraft'

export function MinecraftPage() {
  const { t } = useTranslation()
  const { data: sessions, isLoading: sessionsLoading, error: sessionsError, refetch } = useMinecraftSessions()
  const { data: stats } = useMinecraftStats()

  if (sessionsLoading) return <LoadingState />
  if (sessionsError) return <ErrorState onRetry={refetch} />

  const statsCards = [
    { label: t('minecraft.total_sessions'), value: String(stats?.toplam_oturum ?? 0), icon: Layers },
    { label: t('minecraft.most_used_loader'), value: stats?.en_cok_kullanilan_mod_loader ?? '---', icon: Pickaxe },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">{t('nav.minecraft')}</h1>
        <div className="mt-1 h-0.5 w-8 bg-red-500" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {statsCards.map((s) => (
          <Card key={s.label}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-[#71717A] uppercase tracking-wider">{s.label}</p>
                  <p className="mt-1 text-2xl font-bold text-white">{s.value}</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10">
                  <s.icon className="h-5 w-5 text-red-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Active Sessions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-red-500" />
            {t('minecraft.sessions')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {sessions && sessions.length > 0 ? (
            <div className="space-y-3">
              {sessions.map((session, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg bg-white/[0.02] border border-white/5 p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10">
                      <Pickaxe className="h-5 w-5 text-red-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">
                        Minecraft {session.surum ? ` ${session.surum}` : ''}
                      </p>
                      <div className="mt-1 flex items-center gap-2">
                        {session.mod_loader && (
                          <Badge variant="default">{session.mod_loader}</Badge>
                        )}
                        {session.java_surum && (
                          <Badge variant="secondary">Java {session.java_surum}</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="default">{t('minecraft.active')}</Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Pickaxe}
              title={t('minecraft.no_sessions')}
              description={t('dashboard.no_active')}
              className="py-8"
            />
          )}
        </CardContent>
      </Card>

      {/* Mod Loader Usage */}
      {stats && Object.keys(stats.mod_loader_kullanimi).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{t('minecraft.mod_loader')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(stats.mod_loader_kullanimi)
                .sort(([, a], [, b]) => b - a)
                .map(([loader, count]) => (
                  <div key={loader} className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02]">
                    <span className="text-sm text-white">{loader}</span>
                    <span className="text-sm font-mono text-[#A1A1AA]">{count} kez</span>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
