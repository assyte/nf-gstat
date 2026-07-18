import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Gamepad2, Search, Wifi, WifiOff } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { Input } from '@/shared/ui/input'
import { Button } from '@/shared/ui/button'
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

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">{t('nav.steam')}</h1>
        <div className="mt-1 h-0.5 w-8 bg-red-500" />
      </div>

      {/* Change Steam ID */}
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

      {/* Profile */}
      {user && (
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              {user.avatar_url && (
                <img src={user.avatar_url} alt="" className="h-16 w-16 rounded-xl" />
              )}
              <div className="flex-1">
                <p className="text-lg font-bold text-white">{user.kullanici_adi}</p>
                {user.tam_ad && <p className="text-sm text-[#A1A1AA]">{user.tam_ad}</p>}
                <div className="mt-1 flex items-center gap-2">
                  {user.online_state === 'online' ? (
                    <Wifi className="h-3.5 w-3.5 text-green-500" />
                  ) : (
                    <WifiOff className="h-3.5 w-3.5 text-[#71717A]" />
                  )}
                  <span className="text-xs text-[#71717A]">
                    {user.online_state === 'online' ? t('steam.online') : t('steam.offline')}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-5">
              <p className="text-xs text-[#71717A] uppercase tracking-wider">{t('steam.total_games')}</p>
              <p className="mt-1 text-2xl font-bold text-white">{stats.toplam_oyun}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <p className="text-xs text-[#71717A] uppercase tracking-wider">{t('steam.total_playtime')}</p>
              <p className="mt-1 text-2xl font-bold text-white">{formatPlaytimeHours(Math.round(stats.toplam_sure_dakika))}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <p className="text-xs text-[#71717A] uppercase tracking-wider">{t('steam.most_played')}</p>
              <p className="mt-1 text-lg font-bold text-white truncate">{stats.en_cok_oynanan?.ad ?? '---'}</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Library */}
      <Card>
        <CardHeader>
          <CardTitle>{t('steam.library')}</CardTitle>
        </CardHeader>
        <CardContent>
          {library && library.length > 0 ? (
            <div className="space-y-2">
              {library.slice(0, 20).map((game) => (
                <div
                  key={game.app_id}
                  className="flex items-center justify-between rounded-lg p-3 hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {game.resim_url && (
                      <img src={game.resim_url} alt="" className="h-10 w-10 rounded-lg" />
                    )}
                    <div>
                      <p className="text-sm font-medium text-white">{game.ad}</p>
                      <p className="text-xs text-[#71717A]">App ID: {game.app_id}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-mono text-[#A1A1AA]">
                      {game.oyun_suresi_dakika ? formatPlaytimeHours(Math.round(game.oyun_suresi_dakika)) : '--'}
                    </p>
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
