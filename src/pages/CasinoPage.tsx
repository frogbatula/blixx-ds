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
  const tiles = (doc.assets ?? []).filter((a) => a.kind === 'game-tile')

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('pages.casino')}</CardTitle>
        <CardDescription>{t('pages.casinoBody')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {tiles.length > 0
            ? tiles.map((tile) => (
                <GameTile
                  key={tile.id}
                  gameId={tile.id}
                  label={tile.label || tile.alt}
                  subtitle={tile.subtitle}
                  imageSrc={tile.url}
                  imageAlt={tile.alt}
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
