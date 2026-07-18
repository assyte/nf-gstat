import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '@/shared/lib/cn'

interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  value?: number
  max?: number
}

export const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, max = 100, ...props }, ref) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

    return (
      <div
        ref={ref}
        className={cn('h-1 w-full overflow-hidden rounded-full bg-white/5', className)}
        {...props}
      >
        <div
          className="h-full rounded-full bg-red-500 transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    )
  }
)
Progress.displayName = 'Progress'
