import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { usePreferences } from '@/app/PreferencesProvider'
import { useTenantDocument } from '@/cms/lib/useTenantDocument'
import {
  GAME_CATEGORIES,
  GAME_CATEGORY_LABELS,
  type GameItem,
} from '@/cms/lib/types'
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

type CarouselData = {
  id: string
  title: string
  description?: string
  tileAspect?: GameTileAspect
  linkTo: string
  tiles: {
    id: string
    label: string
    subtitle?: string
    imageSrc?: string
  }[]
}

function buildCmsCarousels(
  games: GameItem[],
  assets: { id: string; url: string }[],
): CarouselData[] {
  const activeGames = games.filter((g) => g.active)
  if (activeGames.length === 0) return []

  const assetMap = new Map(assets.map((a) => [a.id, a.url]))

  const resolveUrl = (game: GameItem): string | undefined => {
    if (game.tileUrl) return game.tileUrl
    if (game.tileAssetId) return assetMap.get(game.tileAssetId)
    return undefined
  }

  const carousels: CarouselData[] = []

  for (const category of GAME_CATEGORIES) {
    const categoryGames = activeGames.filter((g) =>
      g.categories.includes(category),
    )
    if (categoryGames.length === 0) continue

    carousels.push({
      id: category,
      title: GAME_CATEGORY_LABELS[category],
      tileAspect: category === 'live' ? '3/4' : '4/3',
      linkTo: category === 'live' ? '/live' : '/casino',
      tiles: categoryGames.map((game) => ({
        id: game.id,
        label: game.name,
        subtitle: game.provider,
        imageSrc: resolveUrl(game),
      })),
    })
  }

  return carousels
}

export function WelcomePage() {
  const { t } = useTranslation()
  const { brandLabel, theme, colorMode, country, locale } = usePreferences()
  const { doc } = useTenantDocument()

  const cmsCarousels = useMemo(
    () => buildCmsCarousels(doc.games ?? [], doc.assets ?? []),
    [doc.games, doc.assets],
  )

  const useCms = cmsCarousels.length > 0

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
        {useCms
          ? cmsCarousels.map((row) => (
              <TileCarousel
                key={row.id}
                title={row.title}
                description={row.description}
                action={
                  <Button asChild variant="ghost" size="sm">
                    <Link to={row.linkTo}>{t('home.seeAll')}</Link>
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
            ))
          : homeGameCarousels.map((row) => (
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
