import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Gamepad2, Search, Clock, Trophy, Gamepad } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { Input } from '@/shared/ui/input'
import { Button } from '@/shared/ui/button'
import { PlayerCard } from '@/shared/ui/player-card'
import { ErrorState, LoadingState, EmptyState } from '@/shared/ui/states'
import { useSteamUser, useSteamLibrary, useSteamStats } from '@/shared/hooks/useSteam'
import { formatPlaytimeHours } from '@/shared/lib/format'

export function SteamPage() {
  const { t } = useTranslation()
  const [steamId, setSteamId] = useState(() => localStorage.getItem('gstat_steam_id') ?? '')
  const [inputValue, setInputValue] = useState(steamId)

  const handleSave = () => {
    localStorage.setItem('gstat_steam_id', inputValue)
    setSteamId(inputValue)
  }

  const { data: user, isLoading: userLoading } = useSteamUser(steamId || null)
  const { data: library, isLoading: libLoading, error: libError, refetch } = useSteamLibrary(steamId || null)
  const { data: stats } = useSteamStats(steamId || null)

  if (!steamId) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">{t('nav.steam')}</h1>
          <div className="mt-1 h-0.5 w-8 bg-red-500" />
        </div>
        <EmptyState
          icon={Gamepad2}
          title={t('steam.enter_id_first')}
          description={t('common.enter_credentials')}
          className="py-16"
        />
        <Card>
          <CardHeader>
            <CardTitle>{t('steam.steam_id')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                placeholder="76561198000000000"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <Button onClick={handleSave}>{t('common.save')}</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (userLoading || libLoading) return <LoadingState />
  if (libError) return <ErrorState onRetry={refetch} />

  const profileStats = [
    { label: t('profile.total_games'), value: stats?.toplam_oyun ?? 0, icon: Gamepad2 },
    { label: t('profile.total_playtime'), value: stats?.toplam_sure_dakika ? formatPlaytimeHours(Math.round(stats.toplam_sure_dakika)) : '--', icon: Clock },
    { label: t('profile.most_played'), value: stats?.en_cok_oynanan?.ad?.slice(0, 15) ?? '--', icon: Trophy },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">{t('nav.steam')}</h1>
        <div className="mt-1 h-0.5 w-8 bg-red-500" />
      </div>

      {/* Steam ID Input */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-[#71717A]" />
            <Input
              placeholder={t('steam.steam_id')}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-1"
            />
            <Button variant="outline" size="sm" onClick={handleSave}>{t('common.save')}</Button>
          </div>
        </CardContent>
      </Card>

      {/* Premium Player Card */}
      {user && (
        <PlayerCard
          platform="steam"
          username={user.kullanici_adi}
          fullName={user.tam_ad}
          avatarUrl={user.avatar_url}
          isOnline={user.online_state === 'online'}
          stats={profileStats}
        />
      )}

      {/* Library */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gamepad className="h-5 w-5 text-red-500" />
            {t('steam.library')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {library && library.length > 0 ? (
            <div className="space-y-2">
              {library.slice(0, 20).map((game) => (
                <div
                  key={game.app_id}
                  className="group flex items-center justify-between rounded-lg p-3 hover:bg-white/[0.02] transition-all duration-150 border border-transparent hover:border-white/5"
                >
                  <div className="flex items-center gap-3">
                    {game.resim_url ? (
                      <img src={game.resim_url} alt="" className="h-10 w-10 rounded-lg object-cover" />
                    ) : (
                      <div className="h-10 w-10 rounded-lg bg-white/5 flex items-center justify-center">
                        <Gamepad2 className="h-5 w-5 text-[#52525B] group-hover:text-red-500/60 transition-colors" />
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-white">{game.ad}</p>
                      <p className="text-xs text-[#52525B]">App ID: {game.app_id}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-mono text-[#A1A1AA]">
                      {game.oyun_suresi_dakika ? formatPlaytimeHours(Math.round(game.oyun_suresi_dakika)) : '--'}
                    </p>
                    {game.oyun_suresi_2hafta != null && game.oyun_suresi_2hafta > 0 && (
                      <p className="text-[10px] text-[#52525B]">
                        Son 2 hafta: {formatPlaytimeHours(Math.round(game.oyun_suresi_2hafta))}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState title={t('steam.no_library')} className="py-8" />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
