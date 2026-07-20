import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { usePreferences } from '@/app/PreferencesProvider'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export function WelcomePage() {
  const { t } = useTranslation()
  const { brandLabel, theme, colorMode, country, locale } = usePreferences()

  return (
    <div className="flex flex-col gap-8">
      <section className="relative overflow-hidden rounded-xl bg-card px-6 py-10 xl:px-10 xl:py-14">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background:
              'radial-gradient(ellipse at 20% 0%, var(--primary) 0%, transparent 55%), radial-gradient(ellipse at 90% 80%, var(--secondary) 0%, transparent 45%)',
          }}
        />
        <div className="relative flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge>{brandLabel}</Badge>
            <Badge variant="secondary">{theme}</Badge>
            <Badge variant="outline">{colorMode}</Badge>
            <Badge variant="info">
              {country} · {locale}
            </Badge>
          </div>
          <h1 className="max-w-xl text-3xl font-semibold tracking-tight xl:text-4xl">
            {t('welcome.headline', { brand: brandLabel })}
          </h1>
          <p className="max-w-lg text-base text-foreground/75">
            {t('welcome.subtitle')}
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Button asChild size="lg">
              <Link to="/casino">{t('welcome.cta')}</Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link to="/promotions">{t('nav.promotions')}</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
