import { useTranslation } from 'react-i18next'
import { Globe } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { useAppStore } from '@/app/store/app.store'

export function SettingsPage() {
  const { t, i18n } = useTranslation()
  const { language, setLanguage } = useAppStore()

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang)
    setLanguage(lang)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">{t('settings.title')}</h1>
        <div className="mt-1 h-0.5 w-8 bg-red-500" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-red-500" />
            {t('settings.language')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <button
              onClick={() => handleLanguageChange('tr')}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                language === 'tr'
                  ? 'bg-red-500 text-white'
                  : 'bg-white/5 text-[#A1A1AA] hover:bg-white/10'
              }`}
            >
              Türkçe
            </button>
            <button
              onClick={() => handleLanguageChange('en')}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                language === 'en'
                  ? 'bg-red-500 text-white'
                  : 'bg-white/5 text-[#A1A1AA] hover:bg-white/10'
              }`}
            >
              English
            </button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('settings.about')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-[#A1A1AA]">gStat v0.1.0</p>
          <p className="mt-1 text-xs text-[#71717A]">Game Statistics Tracker</p>
        </CardContent>
      </Card>
    </div>
  )
}
