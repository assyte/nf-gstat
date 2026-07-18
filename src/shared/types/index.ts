export interface Game {
  id: number
  name: string
  totalPlaytime: number
  lastPlayed: string | null
  platform: Platform
}

export type Platform =
  | 'minecraft'
  | 'steam'
  | 'epic'
  | 'xbox'
  | 'playstation'
  | 'microsoft'
  | 'riot'
  | 'discord'
  | 'unknown'

export interface ActiveGame {
  name: string
  processName: string
  pid: number
  playtime: number
  platform: Platform
}

export interface MinecraftInfo {
  version: string | null
  modLoader: string | null
  fabricVersion: string | null
  forgeVersion: string | null
  quiltVersion: string | null
  optifineVersion: string | null
  javaVersion: string | null
}

export interface SteamGame {
  appId: number
  name: string
  imageUrl: string | null
  playtimeMinutes: number | null
  playtime2Weeks: number | null
  lastPlayed: number | null
}

export interface SteamUser {
  steamId: string
  username: string
  fullName: string | null
  avatarUrl: string | null
  profileUrl: string | null
  onlineState: string | null
}

export interface EpicGame {
  appName: string
  title: string
  version: string | null
  installSize: number | null
  isInstalled: boolean
  lastPlayed: string | null
  totalTimePlayed: number | null
}

export interface XboxGame {
  name: string
  titleId: string | null
  lastUnlock: string | null
  achievement: {
    current: number
    total: number
    currentScore: number
    totalScore: number
  } | null
}

export interface PlayStationGame {
  titleName: string
  npTitleId: string
  platform: string | null
  trophies: {
    platinum: number
    gold: number
    silver: number
    bronze: number
  } | null
}

export interface MicrosoftGame {
  displayName: string
  packageName: string
  publisher: string | null
  version: string | null
  isInstalled: boolean
  totalTimePlayed: number | null
}

export type ViewType =
  | 'dashboard'
  | 'library'
  | 'minecraft'
  | 'steam'
  | 'epic'
  | 'xbox'
  | 'playstation'
  | 'microsoft'
  | 'settings'
