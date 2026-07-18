export const queryKeys = {
  // Database
  games: ['games'] as const,
  settings: ['settings'] as const,

  // Process
  activeGames: ['activeGames'] as const,
  activeCount: ['activeCount'] as const,

  // Minecraft
  minecraft: {
    all: ['minecraft'] as const,
    sessions: ['minecraft', 'sessions'] as const,
    stats: ['minecraft', 'stats'] as const,
    modLoaders: ['minecraft', 'modLoaders'] as const,
  },

  // Steam
  steam: {
    all: ['steam'] as const,
    user: (id: string) => ['steam', 'user', id] as const,
    library: (id: string) => ['steam', 'library', id] as const,
    recentlyPlayed: (id: string) => ['steam', 'recentlyPlayed', id] as const,
    stats: (id: string) => ['steam', 'stats', id] as const,
  },

  // Epic
  epic: {
    all: ['epic'] as const,
    library: ['epic', 'library'] as const,
  },

  // Xbox
  xbox: {
    all: ['xbox'] as const,
    library: (xuid: string) => ['xbox', 'library', xuid] as const,
    stats: (xuid: string) => ['xbox', 'stats', xuid] as const,
  },

  // PlayStation
  playstation: {
    all: ['playstation'] as const,
    library: (accountId: string) => ['playstation', 'library', accountId] as const,
    stats: (accountId: string) => ['playstation', 'stats', accountId] as const,
  },

  // Microsoft Store
  microsoft: {
    all: ['microsoft'] as const,
    library: ['microsoft', 'library'] as const,
    stats: ['microsoft', 'stats'] as const,
  },

  // Platform
  platform: {
    summary: ['platform', 'summary'] as const,
    all: ['platform', 'all'] as const,
  },
} as const
