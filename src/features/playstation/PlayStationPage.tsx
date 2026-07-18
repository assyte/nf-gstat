import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Gamepad, Search } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'
import { Input } from '@/shared/ui/input'
import { Button } from '@/shared/ui/button'
import { ErrorState, LoadingState, EmptyState } from '@/shared/ui/states'
import { usePlayStationLibrary, usePlayStationStats } from '@/shared/hooks/usePlayStation'

export function PlayStationPage() {
  const { t } = useTranslation()
  const [accountId, setAccountId] = useState(() => localStorage.getItem('gstat_ps_account_id') ?? '')
  const [inputValue, setInputValue] = useState(accountId)

  const handleSave = () => {
    localStorage.setItem('gstat_ps_account_id', inputValue)
    setAccountId(inputValue)
  }

  const { data: library, isLoading: libLoading, error: libError, refetch } = usePlayStationLibrary(accountId || null)
  const { data: stats } = usePlayStationStats(accountId || null)

  if (!accountId) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">{t('nav.playstation')}</h1>
          <div className="mt-1 h-0.5 w-8 bg-red-500" />
        </div>
        <EmptyState
          icon={Gamepad}
          title={t('playstation.no_games')}
          description={t('common.enter_credentials')}
          className="py-16"
        />
        <Card>
          <CardHeader>
            <CardTitle>{t('playstation.account_id')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input placeholder="1234567890123456789" value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
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
        <h1 className="text-3xl font-bold text-white tracking-tight">{t('nav.playstation')}</h1>
        <div className="mt-1 h-0.5 w-8 bg-red-500" />
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-[#71717A]" />
            <Input placeholder={t('playstation.account_id')} value={inputValue} onChange={(e) => setInputValue(e.target.value)} className="flex-1" />
            <Button variant="outline" size="sm" onClick={handleSave}>{t('common.save')}</Button>
          </div>
        </CardContent>
      </Card>

      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-5">
              <p className="text-xs text-[#71717A] uppercase tracking-wider">{t('playstation.trophy_level')}</p>
              <p className="mt-1 text-2xl font-bold text-white">{stats.trophy_level}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <p className="text-xs text-[#71717A] uppercase tracking-wider">{t('playstation.platinum')}</p>
              <p className="mt-1 text-2xl font-bold text-[#E5E4E2]">{stats.platinum_sayisi}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <p className="text-xs text-[#71717A] uppercase tracking-wider">{t('playstation.gold')}</p>
              <p className="mt-1 text-2xl font-bold text-yellow-500">{stats.gold_sayisi}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <p className="text-xs text-[#71717A] uppercase tracking-wider">{t('playstation.silver')}</p>
              <p className="mt-1 text-2xl font-bold text-gray-400">{stats.silver_sayisi}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <p className="text-xs text-[#71717A] uppercase tracking-wider">{t('playstation.bronze')}</p>
              <p className="mt-1 text-2xl font-bold text-amber-700">{stats.bronze_sayisi}</p>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>{t('playstation.library')}</CardTitle>
        </CardHeader>
        <CardContent>
          {library && library.length > 0 ? (
            <div className="space-y-2">
              {library.map((game) => (
                <div
                  key={game.np_title_id}
                  className="flex items-center justify-between rounded-lg p-3 hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5">
                      <Gamepad className="h-5 w-5 text-[#71717A]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{game.trophy_title_name}</p>
                      <div className="mt-1 flex items-center gap-2">
                        {game.trophy_title_platform && <Badge variant="secondary">{game.trophy_title_platform}</Badge>}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    {game.earned_trophies && (
                      <div className="flex items-center gap-1.5 text-xs">
                        <span className="text-[#E5E4E2]">P{game.earned_trophies.platinum}</span>
                        <span className="text-yellow-500">G{game.earned_trophies.gold}</span>
                        <span className="text-gray-400">S{game.earned_trophies.silver}</span>
                        <span className="text-amber-700">B{game.earned_trophies.bronze}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Gamepad}
              title={t('playstation.no_games')}
              description={t('common.setup_required')}
              className="py-8"
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
