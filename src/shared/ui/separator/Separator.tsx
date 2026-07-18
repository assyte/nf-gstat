import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '@/shared/lib/cn'

interface SeparatorProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical'
}

export const Separator = forwardRef<HTMLDivElement, SeparatorProps>(
  ({ className, orientation = 'horizontal', ...props }, ref) => (
    <div
      ref={ref}
      role="separator"
      className={cn(
        'shrink-0 bg-white/5',
        orientation === 'horizontal' ? 'h-px w-full my-2' : 'w-px h-full mx-2',
        className
      )}
      {...props}
    />
  )
)
Separator.displayName = 'Separator'
