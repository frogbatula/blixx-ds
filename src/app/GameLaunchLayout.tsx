import { Outlet } from 'react-router-dom'
import { AppHeader } from '@/components/navigation/AppHeader'
import { SideNav } from '@/components/navigation/SideNav'
import { LocaleSync } from '@/app/LocaleSync'
import { DebugMenu } from '@/components/settings/DebugMenu'

/**
 * Game launch chrome: header + desktop side nav.
 * No footer, no mobile bottom nav — iframe gets the remaining viewport.
 */
export function GameLaunchLayout() {
  return (
    <div className="min-h-dvh bg-background">
      <LocaleSync />
      <AppHeader />
      <SideNav />
      <main className="flex h-dvh flex-col pt-14 xl:pt-16 xl:pl-64">
        <Outlet />
      </main>
      <DebugMenu />
    </div>
  )
}
