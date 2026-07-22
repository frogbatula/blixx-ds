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

export type TenantDocument = {
  tenantId: string
  name: string
  brands: TenantBrand[]
  messageLayers: MessageLayer[]
  tokenLayers: TokenLayer[]
  assets: TenantAsset[]
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
