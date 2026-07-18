import { forwardRef, type HTMLAttributes } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutGrid,
  BookOpen,
  Pickaxe,
  Gamepad2,
  Crosshair,
  CircleDot,
  Gamepad,
  Store,
  Settings,
} from 'lucide-react'
import { cn } from '@/shared/lib/cn'
import { useTranslation } from 'react-i18next'

interface NavItem {
  icon: React.ElementType
  path: string
  labelKey: string
}

const topNav: NavItem[] = [
  { icon: LayoutGrid, path: '/dashboard', labelKey: 'nav.dashboard' },
  { icon: BookOpen, path: '/library', labelKey: 'nav.library' },
]

const platformNav: NavItem[] = [
  { icon: Pickaxe, path: '/minecraft', labelKey: 'nav.minecraft' },
  { icon: Gamepad2, path: '/steam', labelKey: 'nav.steam' },
  { icon: Crosshair, path: '/epic', labelKey: 'nav.epic' },
  { icon: CircleDot, path: '/xbox', labelKey: 'nav.xbox' },
  { icon: Gamepad, path: '/playstation', labelKey: 'nav.playstation' },
  { icon: Store, path: '/microsoft', labelKey: 'nav.microsoft' },
]

const bottomNav: NavItem[] = [
  { icon: Settings, path: '/settings', labelKey: 'nav.settings' },
]

function SidebarItem({ item, isActive }: { item: NavItem; isActive: boolean }) {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const Icon = item.icon

  return (
    <button
      title={t(item.labelKey)}
      onClick={() => navigate(item.path)}
      className={cn(
        'group relative flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-150',
        isActive
          ? 'bg-red-500/[0.08] text-red-500'
          : 'text-[#71717A] hover:bg-white/5 hover:text-[#A1A1AA]'
      )}
    >
      {isActive && (
        <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r bg-red-500" />
      )}
      <Icon className="h-5 w-5" />
    </button>
  )
}

export const Sidebar = forwardRef<HTMLElement, HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => {
    const location = useLocation()

    return (
      <nav
        ref={ref}
        className={cn(
          'fixed top-14 left-0 bottom-0 z-40 flex w-16 flex-col items-center py-3',
          'bg-[rgba(9,9,11,0.9)] backdrop-blur-xl border-r border-white/5',
          className
        )}
        {...props}
      >
        {/* Top navigation */}
        <div className="flex flex-col items-center gap-1">
          {topNav.map((item) => (
            <SidebarItem
              key={item.path}
              item={item}
              isActive={location.pathname === item.path}
            />
          ))}
        </div>

        {/* Separator */}
        <div className="my-2 h-px w-8 bg-white/5" />

        {/* Platform navigation */}
        <div className="flex flex-col items-center gap-1">
          {platformNav.map((item) => (
            <SidebarItem
              key={item.path}
              item={item}
              isActive={location.pathname === item.path}
            />
          ))}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Bottom separator + settings */}
        <div className="h-px w-8 bg-white/5 my-2" />
        {bottomNav.map((item) => (
          <SidebarItem
            key={item.path}
            item={item}
            isActive={location.pathname === item.path}
          />
        ))}
      </nav>
    )
  }
)
Sidebar.displayName = 'Sidebar'
