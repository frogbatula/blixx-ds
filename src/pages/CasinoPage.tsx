import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { GameTile } from '@/components/ui/game-tile'
import { useTenantDocument } from '@/cms/lib/useTenantDocument'
import type { GameItem } from '@/cms/lib/types'

const FALLBACK_TILES = [
  { id: 'casino-slots', label: 'Slots', subtitle: 'Category' },
  { id: 'casino-live', label: 'Live', subtitle: 'Category' },
  { id: 'casino-table', label: 'Table', subtitle: 'Category' },
  { id: 'casino-jackpots', label: 'Jackpots', subtitle: 'Category' },
  { id: 'casino-new', label: 'New', subtitle: 'Category' },
  { id: 'casino-popular', label: 'Popular', subtitle: 'Category' },
]

export function CasinoPage() {
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

  const games = (doc.games ?? []).filter((g) => g.active)

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('pages.casino')}</CardTitle>
        <CardDescription>{t('pages.casinoBody')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {games.length > 0
            ? games.map((game) => (
                <GameTile
                  key={game.id}
                  gameId={game.id}
                  label={game.name}
                  subtitle={game.provider}
                  imageSrc={resolveUrl(game)}
                  imageAlt={game.name}
                />
              ))
            : FALLBACK_TILES.map((tile) => (
                <GameTile
                  key={tile.id}
                  gameId={tile.id}
                  label={tile.label}
                  subtitle={tile.subtitle}
                />
              ))}
        </div>
      </CardContent>
    </Card>
  )
}
