import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { navItems } from '@/mock/data'

export function SideNav() {
  const { t } = useTranslation()

  return (
    <aside className="fixed top-16 bottom-0 left-0 z-30 hidden w-64 flex-col border-r border-border-muted bg-nav text-nav-foreground xl:flex">
      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.id}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-background-subtle text-nav-active'
                    : 'text-nav-foreground/80 hover:bg-background-muted hover:text-nav-foreground',
                )
              }
            >
              <Icon className="size-5 shrink-0" />
              {t(item.labelKey)}
            </NavLink>
          )
        })}
      </nav>
    </aside>
  )
}
