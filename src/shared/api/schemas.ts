import { z } from 'zod'

// === Database Models ===

export const GameSchema = z.object({
  id: z.number(),
  oyun_adi: z.string(),
  toplam_sure: z.number(),
  son_oynama: z.string().nullable(),
})
export type Game = z.infer<typeof GameSchema>

export const AyarlarSchema = z.object({
  dil: z.string(),
  tema: z.string(),
})
export type Ayarlar = z.infer<typeof AyarlarSchema>

// === Process Watcher ===

export const AktifOyunSchema = z.object({
  oyun_adi: z.string(),
  process_adi: z.string(),
  pid: z.number(),
  suresi: z.number(),
})
export type AktifOyun = z.infer<typeof AktifOyunSchema>

// === Minecraft ===

export const MinecraftBilgiSchema = z.object({
  surum: z.string().nullable(),
  mod_loader: z.string().nullable(),
  fabric_surum: z.string().nullable(),
  forge_surum: z.string().nullable(),
  quilt_surum: z.string().nullable(),
  optifine_surum: z.string().nullable(),
  java_surum: z.string().nullable(),
})
export type MinecraftBilgi = z.infer<typeof MinecraftBilgiSchema>

// === Steam ===

export const SteamKullaniciSchema = z.object({
  steam_id: z.string(),
  kullanici_adi: z.string(),
  tam_ad: z.string().nullable(),
  avatar_url: z.string().nullable(),
  profil_url: z.string().nullable(),
  online_state: z.string().nullable(),
})
export type SteamKullanici = z.infer<typeof SteamKullaniciSchema>

export const SteamOyunSchema = z.object({
  app_id: z.number(),
  ad: z.string(),
  resim_url: z.string().nullable(),
  oyun_suresi_dakika: z.number().nullable(),
  oyun_suresi_2hafta: z.number().nullable(),
  son_oynama: z.number().nullable(),
})
export type SteamOyun = z.infer<typeof SteamOyunSchema>

export const SteamIstatistikleriSchema = z.object({
  toplam_oyun: z.number(),
  toplam_sure_dakika: z.number(),
  ortalama_sure_dakika: z.number(),
  son_2hafta_oynanan: z.number(),
  en_cok_oynanan: SteamOyunSchema.optional(),
})
export type SteamIstatistikleri = z.infer<typeof SteamIstatistikleriSchema>

// === Epic Games ===

export const EpicGamesOyunSchema = z.object({
  app_name: z.string(),
  app_title: z.string(),
  app_version: z.string().nullable(),
  install_size: z.number().nullable(),
  is_installed: z.boolean(),
  last_played: z.string().nullable(),
  total_time_played: z.number().nullable(),
})
export type EpicGamesOyun = z.infer<typeof EpicGamesOyunSchema>

// === Xbox ===

export const XboxBasariSchema = z.object({
  current_achievements: z.number(),
  total_achievements: z.number(),
  current_gamescore: z.number(),
  total_gamescore: z.number(),
})
export type XboxBasari = z.infer<typeof XboxBasariSchema>

export const XboxOyunSchema = z.object({
  name: z.string(),
  title_id: z.string().nullable(),
  last_unlock: z.string().nullable(),
  achievement: XboxBasariSchema.nullable(),
  platform: z.string().nullable(),
})
export type XboxOyun = z.infer<typeof XboxOyunSchema>

// === PlayStation ===

export const PlayStationTrophiesSchema = z.object({
  platinum: z.number(),
  gold: z.number(),
  silver: z.number(),
  bronze: z.number(),
})
export type PlayStationTrophies = z.infer<typeof PlayStationTrophiesSchema>

export const PlayStationOyunSchema = z.object({
  trophy_title_name: z.string(),
  np_title_id: z.string(),
  trophy_title_platform: z.string().nullable(),
  earned_trophies: PlayStationTrophiesSchema.nullable(),
})
export type PlayStationOyun = z.infer<typeof PlayStationOyunSchema>

// === Microsoft Store ===

export const MicrosoftStoreOyunSchema = z.object({
  display_name: z.string(),
  package_full_name: z.string(),
  publisher: z.string().nullable(),
  version: z.string().nullable(),
  is_installed: z.boolean(),
  total_time_played: z.number().nullable(),
})
export type MicrosoftStoreOyun = z.infer<typeof MicrosoftStoreOyunSchema>

// === Stats Types ===

export const MinecraftStatsSchema = z.object({
  toplam_oturum: z.number(),
  toplam_sure: z.number(),
  en_cok_kullanilan_mod_loader: z.string().nullable(),
  mod_loader_kullanimi: z.record(z.string(), z.number()),
  son_oturumlar: z.array(z.object({
    baslama_zamani: z.string(),
    sure: z.number(),
    mod_loader: z.string(),
    surum: z.string().nullable(),
  })),
})
export type MinecraftStats = z.infer<typeof MinecraftStatsSchema>

export const XboxStatsSchema = z.object({
  toplam_oyun: z.number(),
  toplam_gamerscore: z.number(),
  toplam_basari: z.number(),
  basari_orani: z.number(),
  son_oynananlar: z.array(XboxOyunSchema),
  kategoriler: z.record(z.string(), z.number()),
  nadir_basari_sayisi: z.number(),
})
export type XboxStats = z.infer<typeof XboxStatsSchema>

export const PlayStationStatsSchema = z.object({
  toplam_oyun: z.number(),
  toplam_trophy: z.number(),
  trophy_level: z.number(),
  trophy_points: z.number(),
  platinum_sayisi: z.number(),
  gold_sayisi: z.number(),
  silver_sayisi: z.number(),
  bronze_sayisi: z.number(),
  son_oynananlar: z.array(PlayStationOyunSchema),
  kategoriler: z.record(z.string(), z.number()),
  trophy_orani: z.number(),
})
export type PlayStationStats = z.infer<typeof PlayStationStatsSchema>

export const MicrosoftStoreStatsSchema = z.object({
  toplam_oyun: z.number(),
  yuklu_oyun: z.number(),
  toplam_sure: z.number(),
  son_oynananlar: z.array(MicrosoftStoreOyunSchema),
  kategoriler: z.record(z.string(), z.number()),
  uretici_sayisi: z.number(),
})
export type MicrosoftStoreStats = z.infer<typeof MicrosoftStoreStatsSchema>

// === Platform Summary ===

export const PlatformOzetSchema = z.record(z.string(), z.number())
export type PlatformOzet = z.infer<typeof PlatformOzetSchema>

// === Normalized Types (Frontend) ===

export interface NormalizedGame {
  id: string
  name: string
  platform: Platform
  playtime: number
  lastPlayed: string | null
  imageUrl?: string | null
}

export type Platform =
  | 'minecraft'
  | 'steam'
  | 'epic'
  | 'xbox'
  | 'playstation'
  | 'microsoft'
  | 'unknown'
