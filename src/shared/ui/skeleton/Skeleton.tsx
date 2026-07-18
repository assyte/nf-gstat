import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '@/shared/lib/cn'

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {}

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'rounded-lg bg-gradient-to-r from-[#111114] via-[#1C1C22] to-[#111114] bg-[length:200%_100%] animate-[shimmer_1.5s_infinite]',
        className
      )}
      {...props}
    />
  )
)
Skeleton.displayName = 'Skeleton'
