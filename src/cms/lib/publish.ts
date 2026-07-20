import { nestMessages } from '@/cms/lib/flatten'
import { resolveMessages, resolveTokens } from '@/cms/lib/resolve'
import type { TenantDocument } from '@/cms/lib/types'
import type { Brand, ColorMode, Locale, Theme } from '@/brands/types'
import { brands, locales } from '@/brands/types'

export type PublishedLocaleFile = {
  filename: string
  brand: Brand | 'shared'
  locale: Locale
  json: string
}

export function publishLocales(
  doc: TenantDocument,
  options?: { brand?: Brand | null },
): PublishedLocaleFile[] {
  const brandList = options?.brand
    ? ([null, options.brand] as (Brand | null)[])
    : ([null, ...brands] as (Brand | null)[])

  const files: PublishedLocaleFile[] = []

  for (const brand of brandList) {
    for (const locale of locales) {
      const flat = resolveMessages(doc.messageLayers, {
        brand,
        country: null,
        locale,
      })
      const nested = nestMessages(flat)
      const brandSlug = brand ?? 'shared'
      const lang = locale.split('-')[0] ?? locale
      files.push({
        filename:
          brand === null
            ? `${lang}.json`
            : `${brand}/${lang}.json`,
        brand: brandSlug,
        locale,
        json: `${JSON.stringify(nested, null, 2)}\n`,
      })
    }
  }

  return files
}

export function publishTokenCss(
  doc: TenantDocument,
  brand: Brand,
  theme: Theme,
  colorMode: ColorMode,
): string {
  const tokens = resolveTokens(doc.tokenLayers, { brand, theme, colorMode })
  const lines = Object.entries(tokens).map(
    ([name, value]) => `  --${name}: ${value};`,
  )
  return (
    `/* ${doc.tenantId} · ${brand} · ${theme} · ${colorMode} */\n` +
    `html[data-brand='${brand}'][data-theme='${theme}'].${colorMode} {\n` +
    `${lines.join('\n')}\n` +
    `}\n`
  )
}

export function downloadTextFile(
  filename: string,
  content: string,
  mime = 'application/json',
): void {
  const blob = new Blob([content], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function downloadLocaleBundle(files: PublishedLocaleFile[]): void {
  const bundle = Object.fromEntries(
    files.map((f) => [f.filename, JSON.parse(f.json) as unknown]),
  )
  downloadTextFile(
    'blixx-locales-bundle.json',
    `${JSON.stringify(bundle, null, 2)}\n`,
  )
}
