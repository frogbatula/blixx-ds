import { supabase, isSupabaseConfigured } from './supabase'
import type { GameItem, PromoItem, TenantAsset } from '@/cms/lib/types'

export { isSupabaseConfigured }

const DEFAULT_TENANT = 'blixx-gaming'

export type DbGame = {
  id: string
  tenant_id: string
  name: string
  slug: string
  provider: string | null
  categories: string[]
  tile_url: string | null
  active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export type DbPromo = {
  id: string
  tenant_id: string
  title: string
  slug: string
  subtitle: string | null
  body: string | null
  banner_url: string | null
  active: boolean
  start_date: string | null
  end_date: string | null
  sort_order: number
  created_at: string
  updated_at: string
}

export type DbAsset = {
  id: string
  tenant_id: string
  kind: 'banner' | 'game-tile' | 'icon'
  url: string
  storage_key: string | null
  alt: string | null
  label: string | null
  subtitle: string | null
  slot: string | null
  brand: string | null
  created_at: string
  updated_at: string
}

function dbGameToApp(g: DbGame): GameItem {
  return {
    id: g.id,
    slug: g.slug,
    name: g.name,
    provider: g.provider ?? undefined,
    categories: g.categories as GameItem['categories'],
    tileUrl: g.tile_url ?? undefined,
    active: g.active,
    order: g.sort_order,
    createdAt: g.created_at,
    updatedAt: g.updated_at,
  }
}

function appGameToDb(
  g: GameItem,
  tenantId = DEFAULT_TENANT,
): Omit<DbGame, 'created_at'> {
  return {
    id: g.id,
    tenant_id: tenantId,
    name: g.name,
    slug: g.slug,
    provider: g.provider ?? null,
    categories: g.categories,
    tile_url: g.tileUrl ?? null,
    active: g.active,
    sort_order: g.order,
    updated_at: g.updatedAt,
  }
}

function dbPromoToApp(p: DbPromo): PromoItem {
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    subtitle: p.subtitle ?? undefined,
    body: p.body ?? undefined,
    bannerUrl: p.banner_url ?? undefined,
    active: p.active,
    startDate: p.start_date ?? undefined,
    endDate: p.end_date ?? undefined,
    order: p.sort_order,
    createdAt: p.created_at,
    updatedAt: p.updated_at,
  }
}

function appPromoToDb(
  p: PromoItem,
  tenantId = DEFAULT_TENANT,
): Omit<DbPromo, 'created_at'> {
  return {
    id: p.id,
    tenant_id: tenantId,
    title: p.title,
    slug: p.slug,
    subtitle: p.subtitle ?? null,
    body: p.body ?? null,
    banner_url: p.bannerUrl ?? null,
    active: p.active,
    start_date: p.startDate ?? null,
    end_date: p.endDate ?? null,
    sort_order: p.order,
    updated_at: p.updatedAt,
  }
}

function dbAssetToApp(a: DbAsset): TenantAsset {
  return {
    id: a.id,
    kind: a.kind,
    url: a.url,
    key: a.storage_key ?? '',
    alt: a.alt ?? '',
    label: a.label ?? undefined,
    subtitle: a.subtitle ?? undefined,
    slot: a.slot ?? undefined,
    brand: a.brand as TenantAsset['brand'],
    updatedAt: a.updated_at,
  }
}

function appAssetToDb(
  a: TenantAsset,
  tenantId = DEFAULT_TENANT,
): Omit<DbAsset, 'created_at'> {
  return {
    id: a.id,
    tenant_id: tenantId,
    kind: a.kind,
    url: a.url,
    storage_key: a.key || null,
    alt: a.alt || null,
    label: a.label ?? null,
    subtitle: a.subtitle ?? null,
    slot: a.slot ?? null,
    brand: a.brand ?? null,
    updated_at: a.updatedAt,
  }
}

export async function fetchGames(
  tenantId = DEFAULT_TENANT,
): Promise<GameItem[]> {
  if (!isSupabaseConfigured) return []
  const { data, error } = await supabase
    .from('games')
    .select('*')
    .eq('tenant_id', tenantId)
    .order('sort_order')
  if (error) {
    console.error('fetchGames error:', error)
    return []
  }
  return (data as DbGame[]).map(dbGameToApp)
}

export async function fetchActiveGames(
  tenantId = DEFAULT_TENANT,
): Promise<GameItem[]> {
  if (!isSupabaseConfigured) return []
  const { data, error } = await supabase
    .from('games')
    .select('*')
    .eq('tenant_id', tenantId)
    .eq('active', true)
    .order('sort_order')
  if (error) {
    console.error('fetchActiveGames error:', error)
    return []
  }
  return (data as DbGame[]).map(dbGameToApp)
}

export async function upsertGame(
  game: GameItem,
  tenantId = DEFAULT_TENANT,
): Promise<boolean> {
  if (!isSupabaseConfigured) return false
  const row = appGameToDb(game, tenantId)
  const { error } = await supabase.from('games').upsert(row)
  if (error) {
    console.error('upsertGame error:', error)
    return false
  }
  return true
}

export async function deleteGame(id: string): Promise<boolean> {
  if (!isSupabaseConfigured) return false
  const { error } = await supabase.from('games').delete().eq('id', id)
  if (error) {
    console.error('deleteGame error:', error)
    return false
  }
  return true
}

export async function fetchPromos(
  tenantId = DEFAULT_TENANT,
): Promise<PromoItem[]> {
  if (!isSupabaseConfigured) return []
  const { data, error } = await supabase
    .from('promos')
    .select('*')
    .eq('tenant_id', tenantId)
    .order('sort_order')
  if (error) {
    console.error('fetchPromos error:', error)
    return []
  }
  return (data as DbPromo[]).map(dbPromoToApp)
}

export async function fetchActivePromos(
  tenantId = DEFAULT_TENANT,
): Promise<PromoItem[]> {
  if (!isSupabaseConfigured) return []
  const { data, error } = await supabase
    .from('promos')
    .select('*')
    .eq('tenant_id', tenantId)
    .eq('active', true)
    .order('sort_order')
  if (error) {
    console.error('fetchActivePromos error:', error)
    return []
  }
  return (data as DbPromo[]).map(dbPromoToApp)
}

export async function upsertPromo(
  promo: PromoItem,
  tenantId = DEFAULT_TENANT,
): Promise<boolean> {
  if (!isSupabaseConfigured) return false
  const row = appPromoToDb(promo, tenantId)
  const { error } = await supabase.from('promos').upsert(row)
  if (error) {
    console.error('upsertPromo error:', error)
    return false
  }
  return true
}

export async function deletePromo(id: string): Promise<boolean> {
  if (!isSupabaseConfigured) return false
  const { error } = await supabase.from('promos').delete().eq('id', id)
  if (error) {
    console.error('deletePromo error:', error)
    return false
  }
  return true
}

export async function fetchAssets(
  tenantId = DEFAULT_TENANT,
): Promise<TenantAsset[]> {
  if (!isSupabaseConfigured) return []
  const { data, error } = await supabase
    .from('assets')
    .select('*')
    .eq('tenant_id', tenantId)
    .order('updated_at', { ascending: false })
  if (error) {
    console.error('fetchAssets error:', error)
    return []
  }
  return (data as DbAsset[]).map(dbAssetToApp)
}

export async function upsertAsset(
  asset: TenantAsset,
  tenantId = DEFAULT_TENANT,
): Promise<boolean> {
  if (!isSupabaseConfigured) return false
  const row = appAssetToDb(asset, tenantId)
  const { error } = await supabase.from('assets').upsert(row)
  if (error) {
    console.error('upsertAsset error:', error)
    return false
  }
  return true
}

export async function deleteAsset(id: string): Promise<boolean> {
  if (!isSupabaseConfigured) return false
  const { error } = await supabase.from('assets').delete().eq('id', id)
  if (error) {
    console.error('deleteAsset error:', error)
    return false
  }
  return true
}

export async function syncAllToSupabase(
  games: GameItem[],
  promos: PromoItem[],
  assets: TenantAsset[],
  tenantId = DEFAULT_TENANT,
): Promise<{ ok: boolean; errors: string[] }> {
  if (!isSupabaseConfigured) {
    return { ok: false, errors: ['Supabase not configured'] }
  }

  const errors: string[] = []

  // Sync games
  for (const game of games) {
    const ok = await upsertGame(game, tenantId)
    if (!ok) errors.push(`Failed to sync game: ${game.name}`)
  }

  // Sync promos
  for (const promo of promos) {
    const ok = await upsertPromo(promo, tenantId)
    if (!ok) errors.push(`Failed to sync promo: ${promo.title}`)
  }

  // Sync assets
  for (const asset of assets) {
    const ok = await upsertAsset(asset, tenantId)
    if (!ok) errors.push(`Failed to sync asset: ${asset.id}`)
  }

  return { ok: errors.length === 0, errors }
}
