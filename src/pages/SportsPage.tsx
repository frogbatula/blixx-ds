import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { HeroBanner } from '@/components/ui/hero-banner'
import { sportsSections, type SportsEvent } from '@/mock/sports'

function OddsButton({ label, odds }: { label: string; odds: string }) {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className="min-w-[4.5rem] flex-col gap-0.5 py-2 h-auto"
    >
      <span className="text-[10px] font-medium text-foreground/55">{label}</span>
      <span className="text-sm font-semibold tabular-nums">{odds}</span>
    </Button>
  )
}

function EventRow({ event }: { event: SportsEvent }) {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border-muted bg-card px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="font-normal">
            {event.league}
          </Badge>
          <span className="text-xs text-foreground/55">{event.kickoff}</span>
        </div>
        <p className="mt-1.5 truncate text-sm font-semibold">
          {event.home}
          <span className="mx-1.5 font-normal text-foreground/45">vs</span>
          {event.away}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <OddsButton label={t('sports.odds.home')} odds={event.markets.home} />
        {event.markets.draw ? (
          <OddsButton label={t('sports.odds.draw')} odds={event.markets.draw} />
        ) : null}
        <OddsButton label={t('sports.odds.away')} odds={event.markets.away} />
      </div>
    </div>
  )
}

export function SportsPage() {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col gap-8">
      <HeroBanner
        size="lg"
        headingLevel="h1"
        title={t('pages.sports')}
        description={t('pages.sportsBody')}
        eyebrow={
          <>
            <Badge variant="secondary">Sportsbook</Badge>
            <Badge variant="outline">Coming soon</Badge>
          </>
        }
      />

      <div className="flex flex-col gap-8">
        {sportsSections.map((section) => (
          <section key={section.id} className="flex flex-col gap-3">
            <div>
              <h2 className="text-base font-semibold tracking-tight xl:text-lg">
                {t(section.titleKey)}
              </h2>
              {section.descriptionKey ? (
                <p className="mt-0.5 text-sm text-foreground/65">
                  {t(section.descriptionKey)}
                </p>
              ) : null}
            </div>
            <div className="flex flex-col gap-2">
              {section.events.map((event) => (
                <EventRow key={event.id} event={event} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
