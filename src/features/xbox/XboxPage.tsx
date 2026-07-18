import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CircleDot, Trophy, Search } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'
import { Input } from '@/shared/ui/input'
import { Button } from '@/shared/ui/button'
import { ErrorState, LoadingState, EmptyState } from '@/shared/ui/states'
import { useXboxLibrary, useXboxStats } from '@/shared/hooks/useXbox'
import { formatNumber } from '@/shared/lib/format'

export function XboxPage() {
  const { t } = useTranslation()
  const [xuid, setXuid] = useState(() => localStorage.getItem('gstat_xbox_xuid') ?? '')
  const [inputValue, setInputValue] = useState(xuid)

  const handleSave = () => {
    localStorage.setItem('gstat_xbox_xuid', inputValue)
    setXuid(inputValue)
  }

  const { data: library, isLoading: libLoading, error: libError, refetch } = useXboxLibrary(xuid || null)
  const { data: stats } = useXboxStats(xuid || null)

  if (!xuid) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">{t('nav.xbox')}</h1>
          <div className="mt-1 h-0.5 w-8 bg-red-500" />
        </div>
        <EmptyState
          icon={CircleDot}
          title={t('xbox.enter_id_first')}
          description={t('common.enter_credentials')}
          className="py-16"
        />
        <Card>
          <CardHeader>
            <CardTitle>{t('xbox.xuid')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input placeholder="25849374829384" value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
              <Button onClick={handleSave}>{t('common.save')}</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (libLoading) return <LoadingState />
  if (libError) return <ErrorState onRetry={refetch} />

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">{t('nav.xbox')}</h1>
        <div className="mt-1 h-0.5 w-8 bg-red-500" />
      </div>

      {/* Change XUID */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-[#71717A]" />
            <Input placeholder={t('xbox.xuid')} value={inputValue} onChange={(e) => setInputValue(e.target.value)} className="flex-1" />
            <Button variant="outline" size="sm" onClick={handleSave}>{t('common.save')}</Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
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
              <p className="text-xs text-[#71717A] uppercase tracking-wider">{t('xbox.gamerscore')}</p>
              <p className="mt-1 text-2xl font-bold text-white">{formatNumber(stats.toplam_gamerscore)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <p className="text-xs text-[#71717A] uppercase tracking-wider">{t('xbox.achievements')}</p>
              <p className="mt-1 text-2xl font-bold text-white">{formatNumber(stats.toplam_basari)}</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Library */}
      <Card>
        <CardHeader>
          <CardTitle>{t('xbox.library')}</CardTitle>
        </CardHeader>
        <CardContent>
          {library && library.length > 0 ? (
            <div className="space-y-2">
              {library.map((game) => (
                <div
                  key={game.title_id ?? game.name}
                  className="flex items-center justify-between rounded-lg p-3 hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5">
                      <CircleDot className="h-5 w-5 text-[#71717A]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{game.name}</p>
                      {game.platform && <Badge variant="secondary">{game.platform}</Badge>}
                    </div>
                  </div>
                  <div className="text-right">
                    {game.achievement && (
                      <div className="flex items-center gap-1">
                        <Trophy className="h-3.5 w-3.5 text-yellow-500" />
                        <span className="text-sm font-mono text-white">
                          {game.achievement.current_gamescore}
                        </span>
                        <span className="text-xs text-[#71717A]">
                          / {game.achievement.total_gamescore}
                        </span>
                      </div>
                    )}
                    {game.last_unlock && (
                      <p className="text-[10px] text-[#52525B] mt-1">{game.last_unlock}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={CircleDot}
              title={t('xbox.no_games')}
              description={t('common.setup_required')}
              className="py-8"
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
