import { NavLink, Outlet } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'

const links = [
  { to: '/docs', end: true, labelKey: 'docs.nav.overview' },
  { to: '/docs/tokens', end: false, labelKey: 'docs.nav.tokens' },
  { to: '/docs/components', end: false, labelKey: 'docs.nav.components' },
] as const

export function DocsLayout() {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-xs font-medium tracking-wide text-primary uppercase">
          Blixx DS
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight xl:text-3xl">
          {t('docs.title')}
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-foreground/70">
          {t('docs.subtitle')}
        </p>
      </div>

      <nav className="flex flex-wrap gap-2 border-b border-border-muted pb-3">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) =>
              cn(
                'rounded-xl px-3 py-1.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-background-subtle text-foreground/80 hover:bg-background-muted',
              )
            }
          >
            {t(link.labelKey)}
          </NavLink>
        ))}
      </nav>

      <Outlet />
    </div>
  )
}
