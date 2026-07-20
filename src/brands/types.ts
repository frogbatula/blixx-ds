export const brands = ['lonkero', 'kanuuna', 'fyffe'] as const
export type Brand = (typeof brands)[number]

export const themes = ['default', 'alt'] as const
export type Theme = (typeof themes)[number]

export const colorModes = ['dark', 'light'] as const
export type ColorMode = (typeof colorModes)[number]

export const locales = ['fi-FI', 'en-GB', 'sv-SE'] as const
export type Locale = (typeof locales)[number]

export const countries = ['FI', 'SE', 'GB'] as const
export type Country = (typeof countries)[number]

export const brandLabels: Record<Brand, string> = {
  lonkero: 'Lonkero',
  kanuuna: 'Kanuuna',
  fyffe: 'Fyffe',
}

export const countryLocaleDefaults: Record<Country, Locale> = {
  FI: 'fi-FI',
  SE: 'sv-SE',
  GB: 'en-GB',
}

export const STORAGE_KEY = 'blixx-ds-preferences'
