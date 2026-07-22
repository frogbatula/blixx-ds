import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/badge'
import { HeroBanner } from '@/components/ui/hero-banner'
import { GameTile } from '@/components/ui/game-tile'
import {
  TileCarousel,
  TileCarouselItem,
} from '@/components/ui/tile-carousel'
import { liveCasinoCarousels } from '@/mock/liveCasino'

export function LiveCasinoPage() {
  const { t } = useTranslation()

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
            <Badge variant="outline">Mock</Badge>
          </>
        }
      />

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
    </div>
  )
}
