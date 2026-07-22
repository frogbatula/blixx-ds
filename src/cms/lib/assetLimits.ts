/** Shared upload limits — used by HubHQ UI, Vite middleware, and Pages Function. */

export const ASSET_KINDS = ['banner', 'game-tile', 'icon'] as const
export type AssetKind = (typeof ASSET_KINDS)[number]

export const RASTER_MIME = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/webp': ['.webp'],
} as const

export const ICON_MIME = {
  ...RASTER_MIME,
  'image/svg+xml': ['.svg'],
} as const

export const MAX_BYTES: Record<AssetKind, number> = {
  'game-tile': 2 * 1024 * 1024,
  banner: 4 * 1024 * 1024,
  icon: 256 * 1024,
}

export function isAssetKind(value: string): value is AssetKind {
  return (ASSET_KINDS as readonly string[]).includes(value)
}

export function acceptForKind(kind: AssetKind): Record<string, readonly string[]> {
  return kind === 'icon' ? ICON_MIME : RASTER_MIME
}

export function allowedMimeForKind(kind: AssetKind): Set<string> {
  return new Set(Object.keys(acceptForKind(kind)))
}

export function extForMime(mime: string): string {
  if (mime === 'image/jpeg') return 'jpg'
  if (mime === 'image/png') return 'png'
  if (mime === 'image/webp') return 'webp'
  if (mime === 'image/svg+xml') return 'svg'
  return 'bin'
}

export function validateUploadMeta(input: {
  kind: string
  mime: string
  bytes: number
}): { ok: true; kind: AssetKind } | { ok: false; error: string } {
  if (!isAssetKind(input.kind)) {
    return { ok: false, error: `Invalid kind. Use: ${ASSET_KINDS.join(', ')}` }
  }
  const kind = input.kind
  const allowed = allowedMimeForKind(kind)
  if (!allowed.has(input.mime)) {
    return {
      ok: false,
      error: `File type not allowed for ${kind}. Allowed: ${[...allowed].join(', ')}`,
    }
  }
  const max = MAX_BYTES[kind]
  if (input.bytes <= 0) {
    return { ok: false, error: 'Empty file' }
  }
  if (input.bytes > max) {
    const mb = (max / (1024 * 1024)).toFixed(max >= 1024 * 1024 ? 0 : 2)
    return {
      ok: false,
      error: `File too large for ${kind} (max ${mb} ${max >= 1024 * 1024 ? 'MB' : 'KB'})`,
    }
  }
  return { ok: true, kind }
}

export function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`
  return `${(n / (1024 * 1024)).toFixed(1)} MB`
}
