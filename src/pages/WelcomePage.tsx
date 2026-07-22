import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { usePreferences } from '@/app/PreferencesProvider'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { HeroBanner } from '@/components/ui/hero-banner'
import { GameTile, type GameTileAspect } from '@/components/ui/game-tile'
import {
  TileCarousel,
  TileCarouselItem,
} from '@/components/ui/tile-carousel'
import { homeGameCarousels } from '@/mock/homeGames'

const portraitTileAspects: GameTileAspect[] = ['3/4', '9/16']

function carouselItemWidth(aspect?: GameTileAspect) {
  return portraitTileAspects.includes(aspect ?? '4/3')
    ? 'w-28 sm:w-32 xl:w-36'
    : undefined
}

export function WelcomePage() {
  const { t } = useTranslation()
  const { brandLabel, theme, colorMode, country, locale } = usePreferences()

  return (
    <div className="flex flex-col gap-8">
      <HeroBanner
        size="lg"
        headingLevel="h1"
        title={t('welcome.headline', { brand: brandLabel })}
        description={t('welcome.subtitle')}
        eyebrow={
          <>
            <Badge>{brandLabel}</Badge>
            <Badge variant="secondary">{theme}</Badge>
            <Badge variant="outline">{colorMode}</Badge>
            <Badge variant="info">
              {country} · {locale}
            </Badge>
          </>
        }
        actions={
          <>
            <Button asChild size="lg">
              <Link to="/casino">{t('welcome.cta')}</Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link to="/promotions">{t('nav.promotions')}</Link>
            </Button>
          </>
        }
      />

      <div className="flex flex-col gap-8">
        {homeGameCarousels.map((row) => (
          <TileCarousel
            key={row.id}
            title={t(row.titleKey)}
            description={
              row.descriptionKey ? t(row.descriptionKey) : undefined
            }
            action={
              <Button asChild variant="ghost" size="sm">
                <Link to={row.id === 'live' ? '/live' : '/casino'}>
                  {t('home.seeAll')}
                </Link>
              </Button>
            }
          >
            {row.tiles.map((tile) => (
              <TileCarouselItem
                key={tile.id}
                className={carouselItemWidth(row.tileAspect)}
              >
                <GameTile
                  className="w-full"
                  gameId={tile.id}
                  aspect={row.tileAspect}
                  label={tile.label}
                  subtitle={tile.subtitle}
                  imageSrc={tile.imageSrc}
                  imageAlt={tile.label}
                />
              </TileCarouselItem>
            ))}
          </TileCarousel>
        ))}
      </div>
    </div>
  )
}
