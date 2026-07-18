import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '@/shared/lib/cn'
import { AlertTriangle, RefreshCw, Inbox } from 'lucide-react'
import { Button } from '@/shared/ui/button'

// === Error State ===

interface ErrorStateProps extends HTMLAttributes<HTMLDivElement> {
  title?: string
  message?: string
  onRetry?: () => void
}

export const ErrorState = forwardRef<HTMLDivElement, ErrorStateProps>(
  ({ className, title = 'Hata', message = 'Bir şeyler yanlış gitti.', onRetry, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex flex-col items-center justify-center py-16', className)}
      {...props}
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10">
        <AlertTriangle className="h-8 w-8 text-red-500" />
      </div>
      <p className="mt-4 text-lg font-medium text-white">{title}</p>
      <p className="mt-1 text-sm text-[#A1A1AA]">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" className="mt-4" onClick={onRetry}>
          <RefreshCw className="h-4 w-4" />
          Tekrar Dene
        </Button>
      )}
    </div>
  )
)
ErrorState.displayName = 'ErrorState'

// === Loading State ===

interface LoadingStateProps extends HTMLAttributes<HTMLDivElement> {
  message?: string
}

export const LoadingState = forwardRef<HTMLDivElement, LoadingStateProps>(
  ({ className, message = 'Yükleniyor...', ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex flex-col items-center justify-center py-16', className)}
      {...props}
    >
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-red-500" />
      <p className="mt-4 text-sm text-[#71717A]">{message}</p>
    </div>
  )
)
LoadingState.displayName = 'LoadingState'

// === Empty State ===

interface EmptyStateProps extends HTMLAttributes<HTMLDivElement> {
  icon?: React.ElementType
  title?: string
  description?: string
}

export const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ className, icon: Icon = Inbox, title = 'Veri yok', description, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex flex-col items-center justify-center py-16', className)}
      {...props}
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5">
        <Icon className="h-8 w-8 text-[#71717A]" />
      </div>
      <p className="mt-4 text-sm font-medium text-[#A1A1AA]">{title}</p>
      {description && (
        <p className="mt-1 text-xs text-[#71717A]">{description}</p>
      )}
    </div>
  )
)
EmptyState.displayName = 'EmptyState'
