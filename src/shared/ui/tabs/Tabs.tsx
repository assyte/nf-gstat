import { createContext, useContext, useState, forwardRef, type HTMLAttributes } from 'react'
import { cn } from '@/shared/lib/cn'

interface TabsContextValue {
  value: string
  onValueChange: (value: string) => void
}

const TabsContext = createContext<TabsContextValue | null>(null)

function useTabs() {
  const ctx = useContext(TabsContext)
  if (!ctx) throw new Error('Tabs components must be used within <Tabs>')
  return ctx
}

interface TabsProps extends HTMLAttributes<HTMLDivElement> {
  defaultValue: string
  value?: string
  onValueChange?: (value: string) => void
}

const Tabs = forwardRef<HTMLDivElement, TabsProps>(
  ({ defaultValue, value: controlledValue, onValueChange, children, className, ...props }, ref) => {
    const [internalValue, setInternalValue] = useState(defaultValue)
    const value = controlledValue ?? internalValue
    const handleChange = onValueChange ?? setInternalValue

    return (
      <TabsContext.Provider value={{ value, onValueChange: handleChange }}>
        <div ref={ref} className={cn('flex flex-col', className)} {...props}>
          {children}
        </div>
      </TabsContext.Provider>
    )
  }
)
Tabs.displayName = 'Tabs'

const TabsList = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('inline-flex items-center gap-1 border-b border-white/5', className)}
      role="tablist"
      {...props}
    />
  )
)
TabsList.displayName = 'TabsList'

interface TabsTriggerProps extends HTMLAttributes<HTMLButtonElement> {
  value: string
}

const TabsTrigger = forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ className, value: triggerValue, ...props }, ref) => {
    const { value, onValueChange } = useTabs()
    const isActive = value === triggerValue

    return (
      <button
        ref={ref}
        role="tab"
        aria-selected={isActive}
        className={cn(
          'relative px-4 py-2.5 text-sm font-medium transition-colors',
          isActive ? 'text-white' : 'text-[#71717A] hover:text-[#A1A1AA]',
          className
        )}
        onClick={() => onValueChange(triggerValue)}
        {...props}
      >
        {props.children}
        {isActive && (
          <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500" />
        )}
      </button>
    )
  }
)
TabsTrigger.displayName = 'TabsTrigger'

interface TabsContentProps extends HTMLAttributes<HTMLDivElement> {
  value: string
}

const TabsContent = forwardRef<HTMLDivElement, TabsContentProps>(
  ({ className, value: contentValue, ...props }, ref) => {
    const { value } = useTabs()
    if (value !== contentValue) return null

    return (
      <div
        ref={ref}
        role="tabpanel"
        className={cn('mt-4 focus-visible:outline-none', className)}
        {...props}
      />
    )
  }
)
TabsContent.displayName = 'TabsContent'

export { Tabs, TabsList, TabsTrigger, TabsContent }
