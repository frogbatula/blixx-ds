import { homeGameCarousels, type MockGameTile } from '@/mock/homeGames'
import { liveCasinoCarousels } from '@/mock/liveCasino'

export type CatalogGame = MockGameTile & {
  provider?: string
}

const fallbackGames: CatalogGame[] = [
  { id: 'casino-slots', label: 'Slots', subtitle: 'Category' },
  { id: 'casino-live', label: 'Live', subtitle: 'Category' },
  { id: 'casino-table', label: 'Table', subtitle: 'Category' },
  { id: 'casino-jackpots', label: 'Jackpots', subtitle: 'Category' },
  { id: 'casino-new', label: 'New', subtitle: 'Category' },
  { id: 'casino-popular', label: 'Popular', subtitle: 'Category' },
]

function collectGames(): CatalogGame[] {
  const map = new Map<string, CatalogGame>()
  for (const row of [...homeGameCarousels, ...liveCasinoCarousels]) {
    for (const tile of row.tiles) {
      map.set(tile.id, tile)
    }
  }
  for (const tile of fallbackGames) {
    if (!map.has(tile.id)) map.set(tile.id, tile)
  }
  return [...map.values()]
}

const games = collectGames()
const byId = new Map(games.map((g) => [g.id, g]))

export function getGameById(id: string): CatalogGame | undefined {
  return byId.get(id)
}

export function listCatalogGames(): CatalogGame[] {
  return games
}

export type PlayMode = 'demo' | 'real'

export function playPath(gameId: string, mode: PlayMode) {
  return `/play/${encodeURIComponent(gameId)}?mode=${mode}`
}
