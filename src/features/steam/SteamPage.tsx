import { useTranslation } from 'react-i18next'
import { Gamepad2 } from 'lucide-react'
import { Card, CardContent } from '@/shared/ui/card'

export function SteamPage() {
  const { t } = useTranslation()

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">{t('nav.steam')}</h1>
        <div className="mt-1 h-0.5 w-8 bg-red-500" />
      </div>

      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5">
            <Gamepad2 className="h-8 w-8 text-[#71717A]" />
          </div>
          <p className="mt-4 text-sm text-[#A1A1AA]">{t('library.empty')}</p>
          <p className="mt-1 text-xs text-[#71717A]">{t('library.empty_desc')}</p>
        </CardContent>
      </Card>
    </div>
  )
}
