import { NavLink, Outlet, Link } from 'react-router-dom'
import {
  LayoutDashboard,
  Type,
  Palette,
  Upload,
  Building2,
  ArrowLeft,
  Image,
  Dices,
  Gift,
  LogOut,
  User,
  Users,
  UserCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CmsProvider, useCmsStore } from '@/cms/CmsProvider'
import { CmsContextBar } from '@/cms/components/CmsContextBar'
import { setCmsAuthenticated } from '@/cms/lib/storage'
import { useAuth, ROLE_LABELS } from '@/lib/auth'
import { isSupabaseConfigured } from '@/lib/db'

const nav = [
  { to: '/cms', end: true, label: 'Dashboard', icon: LayoutDashboard, superAdminOnly: false },
  { to: '/cms/players', end: false, label: 'Players', icon: UserCircle, superAdminOnly: false },
  { to: '/cms/games', end: false, label: 'Games', icon: Dices, superAdminOnly: false },
  { to: '/cms/promos', end: false, label: 'Promotions', icon: Gift, superAdminOnly: false },
  { to: '/cms/copy', end: false, label: 'Copy', icon: Type, superAdminOnly: false },
  { to: '/cms/tokens', end: false, label: 'Design tokens', icon: Palette, superAdminOnly: false },
  { to: '/cms/assets', end: false, label: 'Assets', icon: Image, superAdminOnly: false },
  { to: '/cms/publish', end: false, label: 'Publish', icon: Upload, superAdminOnly: false },
  { to: '/cms/users', end: false, label: 'CMS Users', icon: Users, superAdminOnly: true },
  { to: '/cms/settings', end: false, label: 'Tenants', icon: Building2, superAdminOnly: true },
]

function CmsShellInner() {
  const {
    dirty,
    saveDraftNow,
    restoreFactoryDefaults,
    restoreStatus,
    doc,
  } = useCmsStore()
  const { user, role, signOut, canManageTenants } = useAuth()

  const filteredNav = nav.filter(
    (item) => !item.superAdminOnly || canManageTenants,
  )

  async function handleSignOut() {
    if (isSupabaseConfigured) {
      await signOut()
    } else {
      setCmsAuthenticated(false)
    }
    window.location.href = '/cms'
  }

  return (
    <div className="flex min-h-dvh bg-background text-foreground">
      <aside className="sticky top-0 hidden h-dvh w-56 shrink-0 flex-col border-r border-border-muted bg-nav text-nav-foreground md:flex">
        <div className="border-b border-border-muted px-4 py-4">
          <p className="text-[10px] tracking-wide text-nav-foreground/50 uppercase">
            HubHQ
          </p>
          <p className="font-semibold">{doc.name}</p>
        </div>
        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-2">
          {filteredNav.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-background-subtle text-nav-active'
                      : 'text-nav-foreground/75 hover:bg-background-muted',
                  )
                }
              >
                <Icon className="size-4" />
                {item.label}
              </NavLink>
            )
          })}
        </nav>
        <div className="border-t border-border-muted p-3">
          <Button asChild variant="ghost" size="sm" className="w-full justify-start">
            <Link to="/">
              <ArrowLeft className="size-4" />
              Back to site
            </Link>
          </Button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex flex-wrap items-center gap-2 border-b border-border-muted bg-nav px-4 py-3 text-nav-foreground">
          <div className="md:hidden">
            <p className="text-sm font-semibold">HubHQ</p>
          </div>
          <div className="ml-auto flex flex-wrap items-center gap-2">
            {dirty ? <Badge variant="warning">Unsaved draft</Badge> : null}
            <Button size="sm" variant="secondary" onClick={saveDraftNow}>
              Save draft
            </Button>
            <Button asChild size="sm" variant="primary">
              <Link to="/cms/publish">
                <Upload className="size-4" />
                Publish
              </Link>
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => void restoreFactoryDefaults()}
            >
              Restore factory defaults
            </Button>
            {user && (
              <span className="flex items-center gap-2 text-xs text-nav-foreground/60">
                <User className="size-3" />
                <span>{user.email}</span>
                {role && (
                  <Badge variant="outline" className="text-[10px]">
                    {ROLE_LABELS[role]}
                  </Badge>
                )}
              </span>
            )}
            <Button
              size="sm"
              variant="ghost"
              onClick={() => void handleSignOut()}
            >
              <LogOut className="size-4" />
              Sign out
            </Button>
          </div>
        </header>
        {restoreStatus ? (
          <p className="border-b border-border-muted bg-background-subtle px-4 py-2 text-xs text-foreground/75">
            {restoreStatus}
          </p>
        ) : null}

        <div className="flex gap-1 overflow-x-auto border-b border-border-muted p-2 md:hidden">
          {filteredNav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  'shrink-0 rounded-lg px-2.5 py-1 text-xs font-medium',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-background-subtle',
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        <div className="flex flex-col gap-4 p-4 xl:p-6">
          <CmsContextBar />
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export function CmsLayout() {
  return (
    <CmsProvider>
      <CmsShellInner />
    </CmsProvider>
  )
}
