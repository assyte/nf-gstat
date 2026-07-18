import { useTranslation } from 'react-i18next'
import { Gamepad2, Pickaxe, Gamepad } from 'lucide-react'
import { Card, CardContent } from '@/shared/ui/card'
import { ErrorState, LoadingState, EmptyState } from '@/shared/ui/states'
import { Badge } from '@/shared/ui/badge'
import { useGames } from '@/shared/hooks/useGames'
import { useMinecraftSessions } from '@/shared/hooks/useMinecraft'
import { useEpicLibrary } from '@/shared/hooks/useEpic'
import { useMicrosoftLibrary } from '@/shared/hooks/useMicrosoft'
import { formatPlaytime } from '@/shared/lib/format'
import { useLibraryStore } from './store/library.store'
import type { Platform } from '@/shared/api/schemas'

const platformFilters: { key: Platform | 'all'; label: string }[] = [
  { key: 'all', label: 'Tümü' },
  { key: 'minecraft', label: 'Minecraft' },
  { key: 'steam', label: 'Steam' },
  { key: 'epic', label: 'Epic' },
  { key: 'xbox', label: 'Xbox' },
  { key: 'playstation', label: 'PlayStation' },
  { key: 'microsoft', label: 'Microsoft' },
]

export function LibraryPage() {
  const { t } = useTranslation()
  const { filter, setFilter } = useLibraryStore()

  const { data: games, isLoading: gamesLoading, error: gamesError, refetch } = useGames()
  const { data: mcSessions } = useMinecraftSessions()
  const { data: epicGames } = useEpicLibrary()
  const { data: msGames } = useMicrosoftLibrary()

  if (gamesLoading) return <LoadingState />
  if (gamesError) return <ErrorState onRetry={refetch} />

  // Normalize all games into a unified list
  const allGames = [
    ...(games ?? []).map((g) => ({
      id: `db-${g.id}`,
      name: g.oyun_adi,
      platform: 'unknown' as Platform,
      playtime: g.toplam_sure,
      lastPlayed: g.son_oynama,
    })),
    ...(mcSessions ?? []).map((m, i) => ({
      id: `mc-${i}`,
      name: `Minecraft${m.mod_loader ? ` (${m.mod_loader})` : ''}`,
      platform: 'minecraft' as Platform,
      playtime: 0,
      lastPlayed: null,
    })),
    ...(epicGames ?? []).map((e) => ({
      id: `epic-${e.app_name}`,
      name: e.app_title,
      platform: 'epic' as Platform,
      playtime: e.total_time_played ?? 0,
      lastPlayed: e.last_played,
    })),
    ...(msGames ?? []).map((m) => ({
      id: `ms-${m.package_full_name}`,
      name: m.display_name,
      platform: 'microsoft' as Platform,
      playtime: m.total_time_played ?? 0,
      lastPlayed: null,
    })),
  ]

  const filteredGames = filter === 'all' ? allGames : allGames.filter((g) => g.platform === filter)

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">{t('library.title')}</h1>
        <div className="mt-1 h-0.5 w-8 bg-red-500" />
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {platformFilters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-150 ${
              filter === f.key
                ? 'bg-red-500 text-white'
                : 'bg-white/5 text-[#A1A1AA] hover:bg-white/10 hover:text-white'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Games Grid */}
      {filteredGames.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredGames.map((game) => (
            <Card
              key={game.id}
              className="group cursor-pointer hover:border-red-500/20 hover:shadow-glow-sm hover:-translate-y-0.5 transition-all duration-150"
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 group-hover:bg-red-500/10 transition-colors">
                    {game.platform === 'minecraft' ? (
                      <Pickaxe className="h-6 w-6 text-[#71717A] group-hover:text-red-500 transition-colors" />
                    ) : game.platform === 'playstation' ? (
                      <Gamepad className="h-6 w-6 text-[#71717A] group-hover:text-red-500 transition-colors" />
                    ) : (
                      <Gamepad2 className="h-6 w-6 text-[#71717A] group-hover:text-red-500 transition-colors" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{game.name}</p>
                    <Badge variant="secondary" className="mt-1">
                      {game.platform}
                    </Badge>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between text-xs text-[#71717A]">
                  <span>{game.playtime > 0 ? formatPlaytime(game.playtime) : '--'}</span>
                  <span>{game.lastPlayed ?? '--'}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Gamepad2}
          title={t('library.empty')}
          description={t('library.empty_desc')}
        />
      )}
    </div>
  )
}
