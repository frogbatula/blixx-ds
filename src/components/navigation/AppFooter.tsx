import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { usePreferences } from '@/app/PreferencesProvider'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  footerLinkGroups,
  footerPaymentMethods,
} from '@/components/navigation/footerContent'
import { cn } from '@/lib/utils'

function FooterNavLink({
  to,
  children,
}: {
  to?: string
  children: ReactNode
}) {
  const className =
    'text-sm text-foreground/70 transition-colors hover:text-foreground'

  if (to) {
    return (
      <Link to={to} className={cn(className, 'no-underline')}>
        {children}
      </Link>
    )
  }

  return (
    <span className={cn(className, 'cursor-default')} title="Coming soon">
      {children}
    </span>
  )
}

export function AppFooter() {
  const { t } = useTranslation()
  const { brandLabel } = usePreferences()
  const year = new Date().getFullYear()

  return (
    <footer className="mt-auto border-t border-border-muted bg-background-subtle">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 xl:px-8 xl:py-10">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {footerLinkGroups.map((group) => (
            <div key={group.titleKey} className="flex flex-col gap-3">
              <h2 className="text-xs font-semibold tracking-wide text-foreground/50 uppercase">
                {t(group.titleKey)}
              </h2>
              <ul className="flex flex-col gap-2">
                {group.links.map((link) => (
                  <li key={link.labelKey}>
                    <FooterNavLink to={link.to}>
                      {t(link.labelKey)}
                    </FooterNavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="text-xs font-semibold tracking-wide text-foreground/50 uppercase">
            {t('footer.paymentsTitle')}
          </h2>
          <ul className="flex flex-wrap gap-2" aria-label={t('footer.paymentsTitle')}>
            {footerPaymentMethods.map((method) => (
              <li key={method.id}>
                <Badge
                  variant="outline"
                  className="rounded-lg border-border-muted bg-background px-3 py-1.5 font-medium text-foreground/80"
                >
                  {method.label}
                </Badge>
              </li>
            ))}
          </ul>
        </div>

        <Separator />

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex max-w-2xl flex-col gap-2 text-xs leading-relaxed text-foreground/60">
            <p>{t('footer.legal.operator', { brand: brandLabel })}</p>
            <p>{t('footer.legal.licence')}</p>
            <p>{t('footer.legal.responsible')}</p>
            <p className="text-foreground/45">
              {t('footer.copyright', { brand: brandLabel, year })}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <Badge
              variant="outline"
              className="rounded-lg border-border-muted bg-background px-2.5 py-1 text-sm font-bold tabular-nums"
              aria-label={t('footer.ageRestriction')}
            >
              18+
            </Badge>
            <Badge
              variant="outline"
              className="rounded-lg border-border-muted bg-background px-2.5 py-1 text-[10px] font-semibold tracking-wide uppercase"
            >
              {t('footer.playResponsibly')}
            </Badge>
          </div>
        </div>
      </div>
    </footer>
  )
}
