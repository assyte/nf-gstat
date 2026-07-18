import { forwardRef, type HTMLAttributes } from 'react'
import { Search, Globe } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/lib/cn'
import { useAppStore } from '@/app/store/app.store'

export const TopBar = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const { t, i18n } = useTranslation()
    const { setLanguage } = useAppStore()

    const toggleLanguage = () => {
      const newLang = i18n.language === 'tr' ? 'en' : 'tr'
      i18n.changeLanguage(newLang)
      setLanguage(newLang)
    }

    return (
      <div
        ref={ref}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 flex h-14 items-center px-5',
          'bg-[rgba(9,9,11,0.7)] backdrop-blur-xl border-b border-white/5',
          className
        )}
        {...props}
      >
        {/* Left: Logo */}
        <div className="flex items-center gap-2.5 mr-8">
          <img src="/gstat-logo.png" alt="gStat" className="h-8 w-8 rounded-lg object-contain" />
          <span className="text-lg font-bold text-red-500 tracking-tight">gStat</span>
          <span className="rounded bg-red-500/10 px-1.5 py-0.5 text-[10px] font-medium text-red-500">
            v0.1.0
          </span>
        </div>

        {/* Center: Search */}
        <div className="flex-1 flex justify-center">
          <div className="relative w-[280px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#71717A]" />
            <input
              type="text"
              placeholder={t('common.search')}
              className="h-9 w-full rounded-lg border border-white/5 bg-[#111114] pl-10 pr-3 text-sm text-white placeholder-[#71717A] transition-colors focus:border-red-500/40 focus:outline-none focus:ring-1 focus:ring-red-500/20"
            />
          </div>
        </div>

        {/* Right: Language + Status */}
        <div className="flex items-center gap-3 ml-8">
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-[#A1A1AA] transition-colors hover:bg-white/5 hover:text-white"
          >
            <Globe className="h-4 w-4" />
            {i18n.language.toUpperCase()}
          </button>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#71717A]" />
            <span className="text-xs text-[#71717A]">{t('common.offline')}</span>
          </div>
        </div>
      </div>
    )
  }
)
TopBar.displayName = 'TopBar'
