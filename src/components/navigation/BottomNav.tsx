import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { navItems } from '@/mock/data'

export function BottomNav() {
  const { t } = useTranslation()

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-border-muted bg-nav text-nav-foreground xl:hidden">
      {navItems.map((item) => {
        const Icon = item.icon
        return (
          <NavLink
            key={item.id}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              cn(
                'flex flex-1 flex-col items-center gap-1 py-2.5 text-[10px] font-medium transition-colors',
                isActive
                  ? 'text-nav-active'
                  : 'text-nav-foreground/60 hover:text-nav-foreground',
              )
            }
          >
            <Icon className="size-5" />
            <span>{t(item.labelKey)}</span>
          </NavLink>
        )
      })}
    </nav>
  )
}
