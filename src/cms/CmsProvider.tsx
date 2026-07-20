import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Brand, ColorMode, Country, Locale, Theme } from '@/brands/types'
import type { TenantDocument } from '@/cms/lib/types'
import {
  loadTenantDocument,
  restoreFactoryTenant,
  restoreFactoryToDisk,
  saveDraft,
} from '@/cms/lib/storage'
import { applyPublishedLocalesToApp } from '@/cms/lib/applyPublish'
import factoryEn from '@/cms/factory/locales/en.json'
import factoryFi from '@/cms/factory/locales/fi.json'
import factorySv from '@/cms/factory/locales/sv.json'
import i18n from '@/i18n'

export type CmsContextState = {
  brand: Brand | null
  country: Country | null
  locale: Locale
  theme: Theme
  colorMode: ColorMode
}

type CmsStoreValue = {
  doc: TenantDocument
  setDoc: (
    doc: TenantDocument | ((prev: TenantDocument) => TenantDocument),
  ) => void
  context: CmsContextState
  setContext: (patch: Partial<CmsContextState>) => void
  saveDraftNow: () => void
  /** Wipe draft + restore immutable factory defaults (CMS + site copy). */
  restoreFactoryDefaults: () => Promise<void>
  dirty: boolean
  restoreStatus: string | null
}

const CmsStoreContext = createContext<CmsStoreValue | null>(null)

const defaultContext: CmsContextState = {
  brand: null,
  country: null,
  locale: 'en-GB',
  theme: 'default',
  colorMode: 'dark',
}

function applyFactoryLocalesToRuntime() {
  const bundles: Record<string, Record<string, unknown>> = {
    en: factoryEn as Record<string, unknown>,
    fi: factoryFi as Record<string, unknown>,
    sv: factorySv as Record<string, unknown>,
  }
  for (const [lng, data] of Object.entries(bundles)) {
    if (i18n.hasResourceBundle(lng, 'translation')) {
      i18n.removeResourceBundle(lng, 'translation')
    }
    i18n.addResourceBundle(lng, 'translation', structuredClone(data), true, true)
  }
}

export function CmsProvider({
  tenantId = 'happymoney',
  children,
}: {
  tenantId?: string
  children: ReactNode
}) {
  const [doc, setDocState] = useState<TenantDocument>(() =>
    loadTenantDocument(tenantId),
  )
  const [context, setContextState] =
    useState<CmsContextState>(defaultContext)
  const [dirty, setDirty] = useState(false)
  const [restoreStatus, setRestoreStatus] = useState<string | null>(null)

  const setDoc = useCallback(
    (next: TenantDocument | ((prev: TenantDocument) => TenantDocument)) => {
      setDocState((prev) =>
        typeof next === 'function' ? next(prev) : next,
      )
      setDirty(true)
    },
    [],
  )

  const setContext = useCallback((patch: Partial<CmsContextState>) => {
    setContextState((prev) => ({ ...prev, ...patch }))
  }, [])

  const saveDraftNow = useCallback(() => {
    saveDraft(doc)
    setDirty(false)
  }, [doc])

  const restoreFactoryDefaults = useCallback(async () => {
    const factoryDoc = restoreFactoryTenant(tenantId)
    setDocState(factoryDoc)
    setDirty(false)
    applyFactoryLocalesToRuntime()
    applyPublishedLocalesToApp(factoryDoc)
    const result = await restoreFactoryToDisk()
    if (result.mode === 'disk') {
      setRestoreStatus(
        'Factory defaults restored to Mission Control, site copy, and disk files.',
      )
    } else {
      setRestoreStatus(
        'Factory defaults restored in this browser. Restart local `npm run dev` and click again to rewrite disk files, or redeploy from git.',
      )
    }
  }, [tenantId])

  const value = useMemo(
    () => ({
      doc,
      setDoc,
      context,
      setContext,
      saveDraftNow,
      restoreFactoryDefaults,
      dirty,
      restoreStatus,
    }),
    [
      doc,
      setDoc,
      context,
      setContext,
      saveDraftNow,
      restoreFactoryDefaults,
      dirty,
      restoreStatus,
    ],
  )

  return (
    <CmsStoreContext.Provider value={value}>{children}</CmsStoreContext.Provider>
  )
}

export function useCmsStore() {
  const ctx = useContext(CmsStoreContext)
  if (!ctx) throw new Error('useCmsStore must be used within CmsProvider')
  return ctx
}
