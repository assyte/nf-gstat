import { invoke } from '@/shared/api/tauri'
import type {
  Game,
  Ayarlar,
  AktifOyun,
  MinecraftBilgi,
  SteamKullanici,
  SteamOyun,
  SteamIstatistikleri,
  EpicGamesOyun,
  XboxOyun,
  PlayStationOyun,
  MicrosoftStoreOyun,
  PlatformOzet,
} from './schemas'

// === Database API ===

export const gameApi = {
  list: () => invoke<Game[]>('oyunlari_listele'),
  add: (name: string) => invoke<number>('oyun_ekle', { oyun_adi: name }),
  updatePlaytime: (name: string, seconds: number) =>
    invoke<void>('sure_guncelle', { oyun_adi: name, sure: seconds }),
}

export const settingsApi = {
  get: () => invoke<Ayarlar>('ayarlari_oku'),
  update: (lang: string, theme: string) =>
    invoke<void>('ayarlari_guncelle', { dil: lang, tema: theme }),
}

// === Process Watcher API ===

export const processApi = {
  getActiveGames: () => invoke<AktifOyun[]>('aktif_oyunlari_al'),
  getActiveCount: () => invoke<number>('aktif_oyun_sayisi'),
}

// === Minecraft API ===

export const minecraftApi = {
  getSessions: () => invoke<MinecraftBilgi[]>('minecraft_bilgisi_oku'),
  getStats: () => invoke<unknown>('minecraft_istatistikleri'),
  getModLoaders: () => invoke<string[]>('mod_loader_adlari'),
}

// === Steam API ===

export const steamApi = {
  setApiKey: (key: string) => invoke<void>('steam_api_key_ayarla', { api_key: key }),
  getUserSummary: (steamId: string) =>
    invoke<SteamKullanici>('steam_kullanici_ozeti', { steam_id: steamId }),
  getLibrary: (steamId: string) =>
    invoke<SteamOyun[]>('steam_oyun_kutuphanesi', { steam_id: steamId }),
  getRecentlyPlayed: (steamId: string, count: number) =>
    invoke<SteamOyun[]>('steam_son_oynananlar', { steam_id: steamId, sayi: count }),
  getStats: (steamId: string) =>
    invoke<SteamIstatistikleri>('steam_istatistikler', { steam_id: steamId }),
  isValidId: (steamId: string) =>
    invoke<boolean>('steam_id_gecerli_mi', { steam_id: steamId }),
}

// === Epic Games API ===

export const epicApi = {
  setToken: (token: string) => invoke<void>('epic_token_ayarla', { token }),
  getLibrary: () => invoke<EpicGamesOyun[]>('epic_kutuphane'),
}

// === Xbox API ===

export const xboxApi = {
  setTokens: (accessToken: string, userToken: string, xstsToken: string) =>
    invoke<void>('xbox_token_ayarla', {
      access_token: accessToken,
      user_token: userToken,
      xsts_token: xstsToken,
    }),
  getUserInfo: (xuid: string) => invoke<unknown>('xbox_kullanici_bilgileri', { xuid }),
  getLibrary: (xuid: string) => invoke<XboxOyun[]>('xbox_kutuphane', { xuid }),
  getStats: (xuid: string) => invoke<unknown>('xbox_istatistikler', { xuid }),
}

// === PlayStation API ===

export const playstationApi = {
  setTokens: (accessToken: string, npsso: string) =>
    invoke<void>('ps_token_ayarla', { access_token: accessToken, npsso }),
  getUserInfo: (onlineId: string) =>
    invoke<unknown>('ps_kullanici_bilgileri', { online_id: onlineId }),
  getLibrary: (accountId: string) =>
    invoke<PlayStationOyun[]>('ps_kutuphane', { account_id: accountId }),
  getStats: (accountId: string) =>
    invoke<unknown>('ps_istatistikler', { account_id: accountId }),
}

// === Microsoft Store API ===

export const microsoftApi = {
  getLibrary: () => invoke<MicrosoftStoreOyun[]>('ms_store_kutuphane'),
  getStats: () => invoke<unknown>('ms_store_istatistikler'),
}

// === Platform API ===

export const platformApi = {
  getSummary: () => invoke<PlatformOzet>('platform_ozeti'),
  getAll: () => invoke<string[]>('tum_platformlar'),
}
