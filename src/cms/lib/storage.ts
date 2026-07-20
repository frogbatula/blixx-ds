import type { TenantDocument } from '@/cms/lib/types'
import factoryTenant from '@/cms/factory/happymoney.json'
import seed from '@/cms/seed/happymoney.json'

export const CMS_PASSCODE = 'blixx'
export const CMS_AUTH_KEY = 'blixx-cms-auth'
export const CMS_DRAFT_PREFIX = 'blixx-cms-draft:'

/** Immutable factory backup — never overwritten by publish. */
export function getFactoryTenant(): TenantDocument {
  return structuredClone(factoryTenant as unknown as TenantDocument)
}

/** Last published / working seed (may diverge from factory). */
export function getSeedTenant(): TenantDocument {
  return structuredClone(seed as unknown as TenantDocument)
}

export function loadDraft(tenantId: string): TenantDocument | null {
  try {
    const raw = localStorage.getItem(CMS_DRAFT_PREFIX + tenantId)
    if (!raw) return null
    return JSON.parse(raw) as TenantDocument
  } catch {
    return null
  }
}

export function saveDraft(doc: TenantDocument): void {
  localStorage.setItem(CMS_DRAFT_PREFIX + doc.tenantId, JSON.stringify(doc))
}

export function clearDraft(tenantId: string): void {
  localStorage.removeItem(CMS_DRAFT_PREFIX + tenantId)
}

export function loadTenantDocument(tenantId: string): TenantDocument {
  const draft = loadDraft(tenantId)
  if (draft) return draft
  const seedDoc = getSeedTenant()
  if (seedDoc.tenantId === tenantId) return seedDoc
  return getFactoryTenant()
}

/** Clear draft and return factory baseline in memory. */
export function restoreFactoryTenant(tenantId: string): TenantDocument {
  clearDraft(tenantId)
  return getFactoryTenant()
}

export async function restoreFactoryToDisk(): Promise<{
  ok: boolean
  error?: string
  mode: 'disk' | 'memory-only'
}> {
  try {
    const res = await fetch('/__cms/restore-factory', { method: 'POST' })
    if (!res.ok) {
      const data = (await res.json().catch(() => ({}))) as { error?: string }
      return {
        ok: false,
        mode: 'memory-only',
        error: data.error ?? `HTTP ${res.status}`,
      }
    }
    return { ok: true, mode: 'disk' }
  } catch {
    return { ok: true, mode: 'memory-only' }
  }
}

export function isCmsAuthenticated(): boolean {
  return localStorage.getItem(CMS_AUTH_KEY) === '1'
}

export function setCmsAuthenticated(value: boolean): void {
  if (value) localStorage.setItem(CMS_AUTH_KEY, '1')
  else localStorage.removeItem(CMS_AUTH_KEY)
}
