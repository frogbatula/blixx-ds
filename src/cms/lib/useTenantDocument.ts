import { useCallback, useEffect, useState } from 'react'
import type { TenantDocument } from '@/cms/lib/types'
import { loadTenantDocument } from '@/cms/lib/storage'
import {
  isSupabaseConfigured,
  fetchActiveGames,
  fetchActivePromos,
  fetchAssets,
  fetchTenantConfig,
} from '@/lib/db'

export const CMS_TENANT_UPDATED = 'blixx-cms-tenant-updated'
export const DEFAULT_TENANT_ID = 'blixx-gaming'

export function notifyTenantUpdated(): void {
  window.dispatchEvent(new Event(CMS_TENANT_UPDATED))
}

function normalize(doc: TenantDocument): TenantDocument {
  return {
    ...doc,
    assets: Array.isArray(doc.assets) ? doc.assets : [],
    games: Array.isArray(doc.games) ? doc.games : [],
    promos: Array.isArray(doc.promos) ? doc.promos : [],
  }
}

const remoteCache: {
  games: TenantDocument['games'] | null
  promos: TenantDocument['promos'] | null
  assets: TenantDocument['assets'] | null
  messageLayers: TenantDocument['messageLayers'] | null
  tokenLayers: TenantDocument['tokenLayers'] | null
  fetched: boolean
} = { games: null, promos: null, assets: null, messageLayers: null, tokenLayers: null, fetched: false }

/** Live tenant (draft or seed) for site shell + HubHQ consumers outside CmsProvider. */
export function useTenantDocument(tenantId = DEFAULT_TENANT_ID) {
  const [doc, setDoc] = useState<TenantDocument>(() =>
    normalize(loadTenantDocument(tenantId)),
  )
  const [remoteLoaded, setRemoteLoaded] = useState(remoteCache.fetched)

  const refresh = useCallback(() => {
    const local = normalize(loadTenantDocument(tenantId))
    if (remoteCache.fetched) {
      setDoc({
        ...local,
        games: remoteCache.games ?? local.games,
        promos: remoteCache.promos ?? local.promos,
        assets: remoteCache.assets ?? local.assets,
        messageLayers: remoteCache.messageLayers ?? local.messageLayers,
        tokenLayers: remoteCache.tokenLayers ?? local.tokenLayers,
      })
    } else {
      setDoc(local)
    }
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

  useEffect(() => {
    if (!isSupabaseConfigured || remoteCache.fetched) return

    let cancelled = false

    async function loadRemote() {
      try {
        const [games, promos, assets, config] = await Promise.all([
          fetchActiveGames(tenantId),
          fetchActivePromos(tenantId),
          fetchAssets(tenantId),
          fetchTenantConfig(tenantId),
        ])

        if (cancelled) return

        const hasContent =
          games.length > 0 ||
          promos.length > 0 ||
          assets.length > 0 ||
          config?.messageLayers?.length ||
          config?.tokenLayers?.length

        if (hasContent) {
          remoteCache.games = games
          remoteCache.promos = promos
          remoteCache.assets = assets
          remoteCache.messageLayers = config?.messageLayers ?? null
          remoteCache.tokenLayers = config?.tokenLayers ?? null
          remoteCache.fetched = true
          setRemoteLoaded(true)
        }
      } catch (err) {
        console.error('Failed to load remote data:', err)
      }
    }

    void loadRemote()
    return () => {
      cancelled = true
    }
  }, [tenantId])

  useEffect(() => {
    if (remoteLoaded) {
      refresh()
    }
  }, [remoteLoaded, refresh])

  return { doc, refresh, isRemote: remoteCache.fetched }
}

export function invalidateRemoteCache(): void {
  remoteCache.games = null
  remoteCache.promos = null
  remoteCache.assets = null
  remoteCache.messageLayers = null
  remoteCache.tokenLayers = null
  remoteCache.fetched = false
}
