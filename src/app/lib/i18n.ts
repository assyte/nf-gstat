import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const resources = {
  tr: {
    translation: {
      // App
      'app.name': 'gStat',
      'app.version': 'v0.1.0',

      // Navigation
      'nav.dashboard': 'Dashboard',
      'nav.library': 'Kütüphane',
      'nav.minecraft': 'Minecraft',
      'nav.steam': 'Steam',
      'nav.epic': 'Epic Games',
      'nav.xbox': 'Xbox',
      'nav.playstation': 'PlayStation',
      'nav.microsoft': 'Microsoft Store',
      'nav.settings': 'Ayarlar',

      // Dashboard
      'dashboard.welcome': 'Hoş Geldin',
      'dashboard.active_games': 'Aktif Oyunlar',
      'dashboard.no_active': 'Şu anda oyun çalışmıyor',
      'dashboard.recent': 'Son Oynananlar',
      'dashboard.stats': 'İstatistikler',
      'dashboard.total_games': 'Toplam Oyun',
      'dashboard.active': 'Aktif',
      'dashboard.total_time': 'Toplam Süre',
      'dashboard.average': 'Ortalama',
      'dashboard.this_session': 'Bu oturum',

      // Library
      'library.title': 'Oyun Kütüphanesi',
      'library.empty': 'Henüz oyun algılanmadı',
      'library.empty_desc': 'Bir oyun başladığında burada görünecek',
      'library.filter_all': 'Tümü',

      // Common
      'common.loading': 'Yükleniyor...',
      'common.error': 'Hata',
      'common.retry': 'Tekrar Dene',
      'common.save': 'Kaydet',
      'common.cancel': 'İptal',
      'common.delete': 'Sil',
      'common.edit': 'Düzenle',
      'common.search': 'Ara...',
      'common.version': 'Sürüm',
      'common.status': 'Durum',
      'common.installed': 'Yüklü',
      'common.not_installed': 'Yüklü Değil',
      'common.playtime': 'Oyun Süresi',
      'common.last_played': 'Son Oynama',
      'common.total_time': 'Toplam Süre',
      'common.achievements': 'Başarımlar',
      'common.online': 'Çevrimiçi',
      'common.offline': 'Çevrimdışı',

      // Settings
      'settings.title': 'Ayarlar',
      'settings.language': 'Dil',
      'settings.theme': 'Tema',
      'settings.about': 'Hakkında',
    },
  },
  en: {
    translation: {
      'app.name': 'gStat',
      'app.version': 'v0.1.0',
      'nav.dashboard': 'Dashboard',
      'nav.library': 'Library',
      'nav.minecraft': 'Minecraft',
      'nav.steam': 'Steam',
      'nav.epic': 'Epic Games',
      'nav.xbox': 'Xbox',
      'nav.playstation': 'PlayStation',
      'nav.microsoft': 'Microsoft Store',
      'nav.settings': 'Settings',
      'dashboard.welcome': 'Welcome',
      'dashboard.active_games': 'Active Games',
      'dashboard.no_active': 'No games running',
      'dashboard.recent': 'Recently Played',
      'dashboard.stats': 'Statistics',
      'dashboard.total_games': 'Total Games',
      'dashboard.active': 'Active',
      'dashboard.total_time': 'Total Time',
      'dashboard.average': 'Average',
      'dashboard.this_session': 'This session',
      'library.title': 'Game Library',
      'library.empty': 'No games detected yet',
      'library.empty_desc': 'It will appear here when a game starts',
      'library.filter_all': 'All',
      'common.loading': 'Loading...',
      'common.error': 'Error',
      'common.retry': 'Retry',
      'common.save': 'Save',
      'common.cancel': 'Cancel',
      'common.delete': 'Delete',
      'common.edit': 'Edit',
      'common.search': 'Search...',
      'common.version': 'Version',
      'common.status': 'Status',
      'common.installed': 'Installed',
      'common.not_installed': 'Not Installed',
      'common.playtime': 'Playtime',
      'common.last_played': 'Last Played',
      'common.total_time': 'Total Time',
      'common.achievements': 'Achievements',
      'common.online': 'Online',
      'common.offline': 'Offline',
      'settings.title': 'Settings',
      'settings.language': 'Language',
      'settings.theme': 'Theme',
      'settings.about': 'About',
    },
  },
}

i18n.use(initReactI18next).init({
  resources,
  lng: 'tr',
  fallbackLng: 'tr',
  interpolation: {
    escapeValue: false,
  },
})

export default i18n
