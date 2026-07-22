import type { Brand, ColorMode, Country, Locale, Theme } from '@/brands/types'
import type { AssetKind } from '@/cms/lib/assetLimits'

export type { AssetKind }

/** Null/undefined fields act as wildcards (tenant-wide). */
export type MessageScope = {
  brand?: Brand | null
  country?: Country | null
  locale?: Locale | null
}

export type TokenScope = {
  brand?: Brand | null
  theme?: Theme | null
  colorMode?: ColorMode | null
}

export type MessageLayer = {
  id: string
  scope: MessageScope
  messages: Record<string, string>
}

export type TokenLayer = {
  id: string
  scope: TokenScope
  tokens: Record<string, string>
}

export type TenantBrand = {
  id: Brand
  label: string
}

export type TenantAsset = {
  id: string
  kind: AssetKind
  url: string
  key: string
  alt: string
  label?: string
  subtitle?: string
  /** Required for kind === 'icon' */
  slot?: string
  /** Required for kind === 'icon' */
  brand?: Brand
  updatedAt: string
}

export const GAME_CATEGORIES = [
  'popular',
  'slots',
  'live',
  'jackpots',
  'new',
  'table',
] as const
export type GameCategory = (typeof GAME_CATEGORIES)[number]

export const GAME_CATEGORY_LABELS: Record<GameCategory, string> = {
  popular: 'Popular',
  slots: 'Slots',
  live: 'Live Casino',
  jackpots: 'Jackpots',
  new: 'New Games',
  table: 'Table Games',
}

export type GameItem = {
  id: string
  slug: string
  name: string
  provider?: string
  categories: GameCategory[]
  /** Asset ID from TenantAsset (kind: game-tile) */
  tileAssetId?: string
  /** Direct URL if not using asset library */
  tileUrl?: string
  active: boolean
  order: number
  createdAt: string
  updatedAt: string
}

export type PromoItem = {
  id: string
  slug: string
  title: string
  subtitle?: string
  body?: string
  /** Asset ID from TenantAsset (kind: banner) */
  bannerAssetId?: string
  /** Direct URL if not using asset library */
  bannerUrl?: string
  active: boolean
  startDate?: string
  endDate?: string
  order: number
  createdAt: string
  updatedAt: string
}

export type TenantDocument = {
  tenantId: string
  name: string
  brands: TenantBrand[]
  messageLayers: MessageLayer[]
  tokenLayers: TokenLayer[]
  assets: TenantAsset[]
  games: GameItem[]
  promos: PromoItem[]
}

export type MessageContext = {
  brand: Brand | null
  country: Country | null
  locale: Locale
}

export type TokenContext = {
  brand: Brand | null
  theme: Theme
  colorMode: ColorMode
}

export type ResolvedMessageEntry = {
  key: string
  value: string
  sourceLayerId: string | null
  inherited: boolean
  overrideValue: string | null
}
