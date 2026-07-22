import i18n, { localeToLng } from '@/i18n'
import { nestMessages } from '@/cms/lib/flatten'
import { resolveMessages } from '@/cms/lib/resolve'
import type { TenantDocument } from '@/cms/lib/types'
import { locales, type Locale } from '@/brands/types'

/** Apply resolved shared (tenant) locales into the running i18next instance. */
export function applyPublishedLocalesToApp(doc: TenantDocument): void {
  for (const locale of locales) {
    const flat = resolveMessages(doc.messageLayers, {
      brand: null,
      country: null,
      locale,
    })
    const nested = nestMessages(flat)
    const lng = localeToLng(locale)
    // deep merge into existing bundle so missing CMS keys are not dropped at runtime
    i18n.addResourceBundle(lng, 'translation', nested, true, true)
  }
}

/** Shared locale files only (en.json / fi.json / sv.json) for flat-file overwrite. */
export function buildSharedLocalePayload(
  doc: TenantDocument,
): Record<string, Record<string, unknown>> {
  const out: Record<string, Record<string, unknown>> = {}
  for (const locale of locales) {
    const flat = resolveMessages(doc.messageLayers, {
      brand: null,
      country: null,
      locale,
    })
    const lang = locale.split('-')[0] ?? locale
    out[`${lang}.json`] = nestMessages(flat) as Record<string, unknown>
  }
  return out
}

export async function publishToDisk(
  doc: TenantDocument,
): Promise<{ ok: boolean; error?: string; mode: 'disk' | 'runtime-only' }> {
  applyPublishedLocalesToApp(doc)

  try {
    const res = await fetch('/__cms/publish', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        locales: buildSharedLocalePayload(doc),
        tenantDocument: doc,
      }),
    })
    // 404/405 means the Vite publish endpoint isn't available (production Pages)
    // — that's expected, fall back to runtime-only mode
    if (res.status === 404 || res.status === 405) {
      return { ok: true, mode: 'runtime-only' }
    }
    if (!res.ok) {
      const data = (await res.json().catch(() => ({}))) as { error?: string }
      return {
        ok: false,
        mode: 'runtime-only',
        error: data.error ?? `HTTP ${res.status}`,
      }
    }
    return { ok: true, mode: 'disk' }
  } catch {
    // Production Pages / no Vite middleware — runtime apply only
    return { ok: true, mode: 'runtime-only' }
  }
}

export function localeLabel(locale: Locale): string {
  return locale
}
