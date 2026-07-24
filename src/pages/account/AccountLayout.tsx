import { NavLink, Outlet, Navigate, useLocation } from 'react-router-dom'
import { usePlayerAuth } from '@/lib/player-auth'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Wallet,
  History,
  Gift,
  Shield,
  User,
} from 'lucide-react'

const accountNav = [
  { to: '/account', end: true, label: 'Overview', icon: LayoutDashboard },
  { to: '/account/wallet', end: false, label: 'Wallet', icon: Wallet },
  { to: '/account/history', end: false, label: 'History', icon: History },
  { to: '/account/bonuses', end: false, label: 'Bonuses', icon: Gift },
  { to: '/account/responsible-gaming', end: false, label: 'Responsible Gaming', icon: Shield },
  { to: '/account/profile', end: false, label: 'Profile', icon: User },
]

export function AccountLayout() {
  const { isAuthenticated, loading, player } = usePlayerAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-sm text-foreground/60">Loading...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">My Account</h1>
        {player && (
          <p className="mt-1 text-sm text-foreground/70">
            {player.display_name || player.phone}
          </p>
        )}
      </div>

      <div className="flex gap-1 overflow-x-auto rounded-xl bg-background-subtle p-1">
        {accountNav.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  'flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-foreground/60 hover:text-foreground',
                )
              }
            >
              <Icon className="size-4" />
              <span className="hidden sm:inline">{item.label}</span>
            </NavLink>
          )
        })}
      </div>

      <Outlet />
    </div>
  )
}
