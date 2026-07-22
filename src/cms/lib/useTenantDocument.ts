import { useCallback, useEffect, useState } from 'react'
import type { TenantDocument } from '@/cms/lib/types'
import { loadTenantDocument } from '@/cms/lib/storage'

export const CMS_TENANT_UPDATED = 'blixx-cms-tenant-updated'
export const DEFAULT_TENANT_ID = 'blixx-gaming'

export function notifyTenantUpdated(): void {
  window.dispatchEvent(new Event(CMS_TENANT_UPDATED))
}

function normalize(doc: TenantDocument): TenantDocument {
  return {
    ...doc,
    assets: Array.isArray(doc.assets) ? doc.assets : [],
  }
}

/** Live tenant (draft or seed) for site shell + HubHQ consumers outside CmsProvider. */
export function useTenantDocument(tenantId = DEFAULT_TENANT_ID) {
  const [doc, setDoc] = useState<TenantDocument>(() =>
    normalize(loadTenantDocument(tenantId)),
  )

  const refresh = useCallback(() => {
    setDoc(normalize(loadTenantDocument(tenantId)))
  }, [tenantId])

  useEffect(() => {
    refresh()
    const onUpdate = () => refresh()
    window.addEventListener(CMS_TENANT_UPDATED, onUpdate)
    window.addEventListener('storage', onUpdate)
    return () => {
      window.removeEventListener(CMS_TENANT_UPDATED, onUpdate)
      window.removeEventListener('storage', onUpdate)
    }
  }, [refresh])

  return { doc, refresh }
}
