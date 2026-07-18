import { type HTMLAttributes } from 'react'
import { Outlet } from 'react-router-dom'
import { cn } from '@/shared/lib/cn'
import { TopBar } from '@/layouts/topbar'
import { Sidebar } from '@/layouts/sidebar'

export function Shell({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('h-screen w-screen overflow-hidden bg-[#09090B]', className)} {...props}>
      <TopBar />
      <Sidebar />
      <main className="fixed top-14 left-16 right-0 bottom-0 overflow-y-auto overflow-x-hidden">
        {/* Dashboard background */}
        <div className="absolute inset-0 bg-[url('/dashboard.png')] bg-cover bg-center opacity-15 pointer-events-none" />
        {/* Content */}
        <div className="relative z-10 p-6">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
