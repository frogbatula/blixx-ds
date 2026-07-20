import type { ResolvedToken } from '@/docs/readTokens'
import { tokensToRecord } from '@/docs/readTokens'

export type ExportFormat =
  | 'css'
  | 'json'
  | 'tailwind'
  | 'scss'
  | 'ts'
  | 'style-dictionary'

export const exportFormats: {
  id: ExportFormat
  label: string
  extension: string
  mime: string
}[] = [
  { id: 'css', label: 'CSS variables', extension: 'css', mime: 'text/css' },
  { id: 'json', label: 'JSON', extension: 'json', mime: 'application/json' },
  {
    id: 'tailwind',
    label: 'Tailwind v4 @theme',
    extension: 'css',
    mime: 'text/css',
  },
  { id: 'scss', label: 'SCSS variables', extension: 'scss', mime: 'text/x-scss' },
  { id: 'ts', label: 'TypeScript', extension: 'ts', mime: 'text/typescript' },
  {
    id: 'style-dictionary',
    label: 'Style Dictionary',
    extension: 'json',
    mime: 'application/json',
  },
]

export type ExportMeta = {
  brand: string
  theme: string
  colorMode: string
}

function headerComment(meta: ExportMeta, format: string): string {
  return `/* Blixx DS tokens — ${meta.brand} / ${meta.theme} / ${meta.colorMode} (${format}) */\n`
}

export function formatTokens(
  tokens: ResolvedToken[],
  format: ExportFormat,
  meta: ExportMeta,
): string {
  const record = tokensToRecord(tokens)

  switch (format) {
    case 'css':
      return (
        headerComment(meta, 'CSS') +
        `:root {\n${tokens
          .map((t) => `  ${t.cssVar}: ${t.value};`)
          .join('\n')}\n}\n`
      )

    case 'json':
      return `${JSON.stringify(
        {
          meta,
          tokens: record,
        },
        null,
        2,
      )}\n`

    case 'tailwind': {
      const colorLines = tokens
        .filter((t) => t.kind === 'color')
        .map((t) => `  --color-${t.name}: ${t.value};`)
      const radiusLines = tokens
        .filter((t) => t.name.startsWith('radius-'))
        .map((t) => `  --${t.name}: ${t.value};`)
      const font = tokens.find((t) => t.name === 'font-sans')
      return (
        headerComment(meta, 'Tailwind v4') +
        `@theme {\n${[
          font ? `  --font-sans: ${font.value};` : null,
          ...colorLines,
          ...radiusLines,
        ]
          .filter(Boolean)
          .join('\n')}\n}\n`
      )
    }

    case 'scss':
      return (
        `// Blixx DS tokens — ${meta.brand} / ${meta.theme} / ${meta.colorMode}\n` +
        tokens.map((t) => `$${t.name}: ${t.value};`).join('\n') +
        '\n'
      )

    case 'ts':
      return (
        `/** Blixx DS tokens — ${meta.brand} / ${meta.theme} / ${meta.colorMode} */\n` +
        `export const tokens = ${JSON.stringify(record, null, 2)} as const\n\n` +
        `export type TokenName = keyof typeof tokens\n`
      )

    case 'style-dictionary': {
      const color: Record<string, { value: string; type: string }> = {}
      const sizing: Record<string, { value: string; type: string }> = {}
      const fontFamilies: Record<string, { value: string; type: string }> = {}
      for (const t of tokens) {
        if (t.kind === 'color') color[t.name] = { value: t.value, type: 'color' }
        else if (t.kind === 'dimension')
          sizing[t.name] = { value: t.value, type: 'dimension' }
        else fontFamilies[t.name] = { value: t.value, type: 'fontFamilies' }
      }
      return `${JSON.stringify(
        {
          meta,
          color,
          sizing,
          fontFamilies,
        },
        null,
        2,
      )}\n`
    }
  }
}

export function downloadTokensFile(
  content: string,
  format: ExportFormat,
  meta: ExportMeta,
): void {
  const spec = exportFormats.find((f) => f.id === format)!
  const filename = `blixx-ds-${meta.brand}-${meta.theme}-${meta.colorMode}.${spec.extension}`
  const blob = new Blob([content], { type: spec.mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export async function copyToClipboard(content: string): Promise<void> {
  await navigator.clipboard.writeText(content)
}
