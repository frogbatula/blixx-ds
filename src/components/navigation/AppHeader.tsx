import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { usePreferences } from '@/app/PreferencesProvider'
import { useAuth } from '@/app/AuthProvider'
import { Button } from '@/components/ui/button'
import { BrandIcon } from '@/components/ui/brand-icon'
import { countryCurrency } from '@/mock/user'

function formatBalance(
  amount: number,
  locale: string,
  currency: string,
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount)
}

export function AppHeader() {
  const { t } = useTranslation()
  const { brandLabel, country, locale } = usePreferences()
  const { isLoggedIn, user, login } = useAuth()
  const currency = countryCurrency[country] ?? 'EUR'
  const balance = user
    ? formatBalance(user.balance, locale, currency)
    : null

  return (
    <header className="fixed inset-x-0 top-0 z-40 flex h-14 items-center gap-3 border-b border-border-muted bg-nav px-4 text-nav-foreground xl:h-16 xl:px-6">
      <Link
        to="/"
        className="flex min-w-0 items-center gap-2.5 no-underline"
        aria-label={brandLabel}
      >
        <span
          className="size-8 shrink-0 rounded-xl bg-primary xl:size-9"
          aria-hidden
        />
        <span className="truncate text-sm font-semibold tracking-wide xl:text-base">
          {brandLabel}
        </span>
      </Link>

      <div className="ml-auto flex items-center gap-2 xl:gap-3">
        {isLoggedIn && balance ? (
          <>
            <div
              className="flex flex-col items-end rounded-xl bg-background-subtle px-3 py-1.5"
              aria-label={t('header.balance')}
            >
              <span className="text-[10px] leading-none text-nav-foreground/60 xl:text-xs">
                {t('header.balance')}
              </span>
              <span className="text-sm font-semibold tabular-nums text-secondary xl:text-base">
                {balance}
              </span>
            </div>

            <Button
              type="button"
              size="sm"
              variant="primary"
              className="hidden sm:inline-flex"
            >
              <BrandIcon slot="header.deposit" className="size-4" />
              {t('header.deposit')}
            </Button>
            <Button
              type="button"
              size="icon"
              variant="primary"
              className="size-9 sm:hidden"
              aria-label={t('header.deposit')}
            >
              <BrandIcon slot="header.deposit" className="size-4" />
            </Button>

            <Button
              asChild
              size="icon"
              variant="outline"
              className="size-9 border-border-muted"
              aria-label={t('header.account')}
            >
              <Link to="/profile">
                <BrandIcon slot="header.account" className="size-4" />
              </Link>
            </Button>
          </>
        ) : (
          <>
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="border-border-muted"
              onClick={login}
            >
              <BrandIcon slot="header.login" className="size-4" />
              <span className="hidden sm:inline">{t('header.login')}</span>
            </Button>
            <Button asChild size="sm" variant="primary">
              <Link to="/profile">{t('header.register')}</Link>
            </Button>
          </>
        )}
      </div>
    </header>
  )
}
