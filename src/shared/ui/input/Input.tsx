import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: ReactNode
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, icon, error, ...props }, ref) => {
    return (
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#71717A]">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          className={cn(
            'flex h-9 w-full rounded-lg border bg-[#111114] px-3 py-2 text-sm text-white placeholder-[#71717A] transition-colors',
            'border-white/5 focus:border-red-500/40 focus:outline-none focus:ring-1 focus:ring-red-500/20',
            'disabled:cursor-not-allowed disabled:opacity-50',
            icon && 'pl-10',
            error && 'border-red-500/50',
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1 text-xs text-red-400">{error}</p>
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'
