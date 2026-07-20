import { Outlet } from 'react-router-dom'
import { AppHeader } from '@/components/navigation/AppHeader'
import { SideNav } from '@/components/navigation/SideNav'
import { BottomNav } from '@/components/navigation/BottomNav'
import { LocaleSync } from '@/app/LocaleSync'
import { DebugMenu } from '@/components/settings/DebugMenu'

export function AppLayout() {
  return (
    <div className="min-h-dvh bg-background">
      <LocaleSync />
      <AppHeader />
      <SideNav />
      <main className="min-h-dvh pt-14 pb-20 xl:pt-16 xl:pb-0 xl:pl-64">
        <div className="mx-auto max-w-5xl px-4 py-6 xl:px-8 xl:py-10">
          <Outlet />
        </div>
      </main>
      <BottomNav />
      <DebugMenu />
    </div>
  )
}
