import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

i18n.use(initReactI18next).init({
  resources: {
    tr: {
      translation: {
        "uygulama_adi": "gStat",
        "hosgeldin": "Hoş Geldin",
        "oyunlar": "Oyunlar",
        "istatistikler": "İstatistikler",
        "ayarlar": "Ayarlar",
        "toplam_sure": "Toplam Süre",
        "son_oynama": "Son Oynama"
      }
    },
    en: {
      translation: {
        "uygulama_adi": "gStat",
        "hosgeldin": "Welcome",
        "oyunlar": "Games",
        "istatistikler": "Statistics",
        "ayarlar": "Settings",
        "toplam_sure": "Total Time",
        "son_oynama": "Last Played"
      }
    }
  },
  lng: "tr",
  fallbackLng: "tr",
  interpolation: {
    escapeValue: false
  }
})

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
