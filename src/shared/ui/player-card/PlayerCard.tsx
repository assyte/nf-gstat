import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '@/shared/lib/cn'
import { Wifi, WifiOff } from 'lucide-react'

type Platform = 'steam' | 'xbox' | 'playstation' | 'epic' | 'microsoft'

interface PlayerCardProps extends HTMLAttributes<HTMLDivElement> {
  platform: Platform
  username: string
  fullName?: string | null
  avatarUrl?: string | null
  isOnline?: boolean
  stats: {
    label: string
    value: string | number
    icon?: React.ElementType
  }[]
  children?: React.ReactNode
}

const platformConfig: Record<Platform, { gradient: string; glow: string; label: string; pattern: string }> = {
  steam: {
    gradient: 'from-[#1B2838] via-[#171A21] to-[#09090B]',
    glow: 'rgba(100, 180, 255, 0.25)',
    label: 'Steam',
    pattern: 'Steam',
  },
  xbox: {
    gradient: 'from-[#107C10] via-[#0E4A0E] to-[#09090B]',
    glow: 'rgba(16, 124, 16, 0.25)',
    label: 'Xbox',
    pattern: 'Xbox',
  },
  playstation: {
    gradient: 'from-[#003791] via-[#001F5B] to-[#09090B]',
    glow: 'rgba(0, 55, 145, 0.25)',
    label: 'PlayStation',
    pattern: 'PS',
  },
  epic: {
    gradient: 'from-[#0078F2] via-[#003D7A] to-[#09090B]',
    glow: 'rgba(0, 120, 242, 0.25)',
    label: 'Epic Games',
    pattern: 'Epic',
  },
  microsoft: {
    gradient: 'from-[#737373] via-[#3B3B3B] to-[#09090B]',
    glow: 'rgba(115, 115, 115, 0.2)',
    label: 'Microsoft',
    pattern: 'MS',
  },
}

const PlayerCard = forwardRef<HTMLDivElement, PlayerCardProps>(
  ({ className, platform, username, fullName, avatarUrl, isOnline, stats, children, ...props }, ref) => {
    const config = platformConfig[platform]

    return (
      <div
        ref={ref}
        className={cn('relative overflow-hidden rounded-2xl border border-white/5', className)}
        {...props}
      >
        {/* Gradient Background */}
        <div className={cn('absolute inset-0 bg-gradient-to-b', config.gradient)} />

        {/* Hexagonal Pattern Overlay */}
        <div className="player-card-pattern absolute inset-0 opacity-[0.04]" />

        {/* Red Accent Glow - Top Edge */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-red-500/60 to-transparent" />

        {/* Decorative Ink Stroke */}
        <div className="absolute top-0 right-0 w-32 h-32 opacity-[0.03]">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <path d="M80 10 C60 30, 40 20, 20 50 C10 70, 30 90, 50 80 C70 70, 90 40, 80 10Z" fill="white" />
          </svg>
        </div>

        {/* Content */}
        <div className="relative z-10 p-6 sm:p-8">
          {/* Profile Section */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Avatar with Hexagonal Glow */}
            <div className="player-card-avatar-ring relative shrink-0">
              {/* Glow Background */}
              <div
                className="absolute inset-[-4px] rounded-full opacity-60"
                style={{
                  background: `radial-gradient(circle, ${config.glow} 0%, transparent 70%)`,
                }}
              />
              {/* Avatar */}
              <div className="relative h-24 w-24 sm:h-28 sm:w-28 rounded-full overflow-hidden border-2 border-white/10 player-card-avatar">
                {avatarUrl ? (
                  <img src={avatarUrl} alt={username} className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full bg-white/5 flex items-center justify-center">
                    <span className="text-3xl font-bold text-white/30">
                      {username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              {/* Online Indicator */}
              <div className={cn(
                'absolute bottom-1 right-1 h-4 w-4 rounded-full border-2 border-[#16161A]',
                isOnline ? 'bg-green-500 animate-pulse-subtle' : 'bg-[#52525B]'
              )} />
            </div>

            {/* Name & Info */}
            <div className="flex-1 text-center sm:text-left">
              {/* Platform Badge */}
              <div className="inline-flex items-center gap-1.5 rounded-full bg-white/5 border border-white/10 px-3 py-1 mb-3">
                <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
                <span className="text-[10px] font-medium text-[#A1A1AA] uppercase tracking-wider">
                  {config.label}
                </span>
              </div>

              {/* Username */}
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {username}
              </h2>

              {/* Full Name */}
              {fullName && fullName !== username && (
                <p className="mt-1 text-sm text-[#A1A1AA]">{fullName}</p>
              )}

              {/* Online Status */}
              <div className="mt-2 flex items-center gap-2 justify-center sm:justify-start">
                {isOnline ? (
                  <Wifi className="h-3.5 w-3.5 text-green-500" />
                ) : (
                  <WifiOff className="h-3.5 w-3.5 text-[#52525B]" />
                )}
                <span className={cn(
                  'text-xs font-medium',
                  isOnline ? 'text-green-400' : 'text-[#52525B]'
                )}>
                  {isOnline ? 'Çevrimiçi' : 'Çevrimdışı'}
                </span>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          {stats.length > 0 && (
            <div className="mt-6 sm:mt-8 grid grid-cols-2 sm:grid-cols-3 gap-3">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="player-card-stat relative rounded-xl bg-white/[0.03] border border-white/5 p-4 text-center"
                >
                  {stat.icon && (
                    <stat.icon className="h-4 w-4 text-red-500/60 mx-auto mb-2" />
                  )}
                  <p className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-[10px] font-medium text-[#71717A] uppercase tracking-wider">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Platform-specific decorations */}
          {children && <div className="mt-6">{children}</div>}
        </div>

        {/* Bottom Red Accent */}
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-red-500/30 to-transparent" />
      </div>
    )
  }
)
PlayerCard.displayName = 'PlayerCard'

export { PlayerCard, type PlayerCardProps, type Platform }
