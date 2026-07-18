import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '@/shared/lib/cn'

interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string | null
  alt?: string
  fallback?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  status?: 'online' | 'offline'
}

const sizeMap = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
}

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt, fallback, size = 'md', status, ...props }, ref) => {
    const initials = fallback || '?'

    return (
      <div ref={ref} className={cn('relative inline-flex shrink-0', className)} {...props}>
        <div
          className={cn(
            'flex items-center justify-center overflow-hidden rounded-full bg-[#1C1C22] border border-white/5',
            sizeMap[size]
          )}
        >
          {src ? (
            <img src={src} alt={alt} className="h-full w-full object-cover" />
          ) : (
            <span className="font-medium text-[#A1A1AA]">{initials}</span>
          )}
        </div>
        {status && (
          <span
            className={cn(
              'absolute bottom-0 right-0 block rounded-full ring-2 ring-[#09090B]',
              size === 'sm' ? 'h-2 w-2' : 'h-2.5 w-2.5',
              status === 'online' ? 'bg-emerald-500' : 'bg-[#71717A]'
            )}
          />
        )}
      </div>
    )
  }
)
Avatar.displayName = 'Avatar'
