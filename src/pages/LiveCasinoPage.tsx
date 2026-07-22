import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/badge'
import { HeroBanner } from '@/components/ui/hero-banner'
import { GameTile } from '@/components/ui/game-tile'
import {
  TileCarousel,
  TileCarouselItem,
} from '@/components/ui/tile-carousel'
import { useTenantDocument } from '@/cms/lib/useTenantDocument'
import type { GameItem } from '@/cms/lib/types'
import { liveCasinoCarousels } from '@/mock/liveCasino'

export function LiveCasinoPage() {
  const { t } = useTranslation()
  const { doc } = useTenantDocument()

  const assetMap = useMemo(
    () => new Map((doc.assets ?? []).map((a) => [a.id, a.url])),
    [doc.assets],
  )

  const resolveUrl = (game: GameItem): string | undefined => {
    if (game.tileUrl) return game.tileUrl
    if (game.tileAssetId) return assetMap.get(game.tileAssetId)
    return undefined
  }

  const liveGames = (doc.games ?? []).filter(
    (g) => g.active && g.categories.includes('live'),
  )

  const useCms = liveGames.length > 0

  return (
    <div className="flex flex-col gap-8">
      <HeroBanner
        size="lg"
        headingLevel="h1"
        title={t('pages.live')}
        description={t('pages.liveBody')}
        eyebrow={
          <>
            <Badge variant="info">Live</Badge>
            {!useCms && <Badge variant="outline">Mock</Badge>}
          </>
        }
      />

      {useCms ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {liveGames.map((game) => (
            <GameTile
              key={game.id}
              gameId={game.id}
              aspect="3/4"
              label={game.name}
              subtitle={game.provider}
              imageSrc={resolveUrl(game)}
              imageAlt={game.name}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {liveCasinoCarousels.map((row) => (
            <TileCarousel
              key={row.id}
              title={t(row.titleKey)}
              description={
                row.descriptionKey ? t(row.descriptionKey) : undefined
              }
            >
              {row.tiles.map((tile) => (
                <TileCarouselItem key={tile.id}>
                  <GameTile
                    className="w-full"
                    gameId={tile.id}
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
      )}
    </div>
  )
}
