import type { Brand, ColorMode, Country, Locale, Theme } from '@/brands/types'

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

export type TenantDocument = {
  tenantId: string
  name: string
  brands: TenantBrand[]
  messageLayers: MessageLayer[]
  tokenLayers: TokenLayer[]
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
