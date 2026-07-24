// Player Database Service Layer
import { supabase, isSupabaseConfigured } from './supabase'
import type {
  Player,
  PlayerSession,
  PlayerAttribution,
  Wallet,
  Transaction,
  FreeBet,
  GameSession,
  Bet,
  KycStatus,
  ResponsibleGaming,
  PlayerNote,
  PlayerSummary,
  TransactionType,
  RgControlType,
  RgProduct,
  LimitPeriod,
  PlayerTier,
  PlayerBrand,
} from './player-types'
import { PLAYER_TIERS, TIER_THRESHOLDS } from './player-types'

export { isSupabaseConfigured }

// ===========================================
// OTP / Authentication
// ===========================================

export async function createOtpCode(
  phone: string,
  purpose: 'login' | 'register' = 'login',
): Promise<{ code: string; error: string | null }> {
  if (!isSupabaseConfigured) {
    return { code: '', error: 'Database not configured' }
  }

  // Generate 6-digit code
  const code = Math.floor(100000 + Math.random() * 900000).toString()
  const expires_at = new Date(Date.now() + 10 * 60 * 1000).toISOString() // 10 minutes

  const { error } = await supabase.from('otp_codes').insert({
    phone,
    code,
    purpose,
    expires_at,
  })

  if (error) {
    console.error('createOtpCode error:', error)
    return { code: '', error: error.message }
  }

  return { code, error: null }
}

export async function verifyOtpCode(
  phone: string,
  code: string,
): Promise<{ valid: boolean; error: string | null }> {
  if (!isSupabaseConfigured) {
    return { valid: false, error: 'Database not configured' }
  }

  const { data, error } = await supabase
    .from('otp_codes')
    .select('*')
    .eq('phone', phone)
    .eq('code', code)
    .is('used_at', null)
    .gt('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (error || !data) {
    return { valid: false, error: 'Invalid or expired code' }
  }

  // Mark as used
  await supabase
    .from('otp_codes')
    .update({ used_at: new Date().toISOString() })
    .eq('id', data.id)

  return { valid: true, error: null }
}

// ===========================================
// Players
// ===========================================

export async function createPlayer(
  phone: string,
  attribution?: Partial<PlayerAttribution>,
  brand: PlayerBrand = 'kanuuna',
): Promise<{ player: Player | null; error: string | null }> {
  if (!isSupabaseConfigured) {
    return { player: null, error: 'Database not configured' }
  }

  const { data, error } = await supabase
    .from('players')
    .insert({
      phone,
      phone_verified: true,
      brand,
      last_brand: brand,
    })
    .select()
    .single()

  if (error) {
    console.error('createPlayer error:', error)
    return { player: null, error: error.message }
  }

  // Create attribution record if provided
  if (attribution && data) {
    await supabase.from('player_attribution').insert({
      player_id: data.id,
      source: attribution.source ?? 'organic',
      source_code: attribution.source_code,
      campaign: attribution.campaign,
      landing_url: attribution.landing_url,
      utm_source: attribution.utm_source,
      utm_medium: attribution.utm_medium,
      utm_campaign: attribution.utm_campaign,
      utm_content: attribution.utm_content,
      utm_term: attribution.utm_term,
      referred_by_player_id: attribution.referred_by_player_id,
    })
  }

  return { player: data as Player, error: null }
}

export async function getPlayerByPhone(phone: string): Promise<Player | null> {
  if (!isSupabaseConfigured) return null

  const { data, error } = await supabase
    .from('players')
    .select('*')
    .eq('phone', phone)
    .single()

  if (error) {
    if (error.code !== 'PGRST116') console.error('getPlayerByPhone error:', error)
    return null
  }

  return data as Player
}

export async function getPlayerById(id: string): Promise<Player | null> {
  if (!isSupabaseConfigured) return null

  const { data, error } = await supabase
    .from('players')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('getPlayerById error:', error)
    return null
  }

  return data as Player
}

export async function updatePlayer(
  id: string,
  updates: Partial<Player>,
): Promise<boolean> {
  if (!isSupabaseConfigured) return false

  const { error } = await supabase
    .from('players')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) {
    console.error('updatePlayer error:', error)
    return false
  }

  return true
}

/** Update the brand the player is currently using (on login / brand switch) */
export async function updatePlayerLastBrand(
  playerId: string,
  brand: PlayerBrand,
): Promise<boolean> {
  if (!isSupabaseConfigured) return false

  const { error } = await supabase
    .from('players')
    .update({
      last_brand: brand,
      updated_at: new Date().toISOString(),
    })
    .eq('id', playerId)

  if (error) {
    console.error('updatePlayerLastBrand error:', error)
    return false
  }

  return true
}

// ===========================================
// Sessions
// ===========================================

export async function createPlayerSession(
  playerId: string,
): Promise<{ session: PlayerSession | null; error: string | null }> {
  if (!isSupabaseConfigured) {
    return { session: null, error: 'Database not configured' }
  }

  const token = crypto.randomUUID() + '-' + crypto.randomUUID()
  const expires_at = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days

  const { data, error } = await supabase
    .from('player_sessions')
    .insert({
      player_id: playerId,
      token,
      expires_at,
    })
    .select()
    .single()

  if (error) {
    console.error('createPlayerSession error:', error)
    return { session: null, error: error.message }
  }

  return { session: data as PlayerSession, error: null }
}

export async function getSessionByToken(token: string): Promise<PlayerSession | null> {
  if (!isSupabaseConfigured) return null

  const { data, error } = await supabase
    .from('player_sessions')
    .select('*')
    .eq('token', token)
    .gt('expires_at', new Date().toISOString())
    .single()

  if (error) {
    return null
  }

  return data as PlayerSession
}

export async function deleteSession(token: string): Promise<boolean> {
  if (!isSupabaseConfigured) return false

  const { error } = await supabase
    .from('player_sessions')
    .delete()
    .eq('token', token)

  return !error
}

// ===========================================
// Wallets
// ===========================================

export async function getPlayerWallets(playerId: string): Promise<Wallet[]> {
  if (!isSupabaseConfigured) return []

  const { data, error } = await supabase
    .from('wallets')
    .select('*')
    .eq('player_id', playerId)

  if (error) {
    console.error('getPlayerWallets error:', error)
    return []
  }

  return data as Wallet[]
}

export async function updateWalletBalance(
  walletId: string,
  newBalance: number,
): Promise<boolean> {
  if (!isSupabaseConfigured) return false

  const { error } = await supabase
    .from('wallets')
    .update({ balance: newBalance, updated_at: new Date().toISOString() })
    .eq('id', walletId)

  return !error
}

// ===========================================
// Transactions
// ===========================================

export async function createTransaction(
  playerId: string,
  walletId: string,
  type: TransactionType,
  amount: number,
  balanceBefore: number,
  balanceAfter: number,
  options?: {
    referenceId?: string
    referenceType?: string
    description?: string
    metadata?: Record<string, unknown>
  },
): Promise<{ transaction: Transaction | null; error: string | null }> {
  if (!isSupabaseConfigured) {
    return { transaction: null, error: 'Database not configured' }
  }

  const { data, error } = await supabase
    .from('transactions')
    .insert({
      player_id: playerId,
      wallet_id: walletId,
      type,
      amount,
      balance_before: balanceBefore,
      balance_after: balanceAfter,
      reference_id: options?.referenceId,
      reference_type: options?.referenceType,
      description: options?.description,
      metadata: options?.metadata ?? {},
    })
    .select()
    .single()

  if (error) {
    console.error('createTransaction error:', error)
    return { transaction: null, error: error.message }
  }

  return { transaction: data as Transaction, error: null }
}

export async function getPlayerTransactions(
  playerId: string,
  limit = 50,
  offset = 0,
): Promise<Transaction[]> {
  if (!isSupabaseConfigured) return []

  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('player_id', playerId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) {
    console.error('getPlayerTransactions error:', error)
    return []
  }

  return data as Transaction[]
}

// ===========================================
// Free Bets
// ===========================================

export async function getPlayerFreeBets(
  playerId: string,
  activeOnly = true,
): Promise<FreeBet[]> {
  if (!isSupabaseConfigured) return []

  let query = supabase
    .from('free_bets')
    .select('*')
    .eq('player_id', playerId)
    .order('valid_until', { ascending: true })

  if (activeOnly) {
    query = query.eq('status', 'active')
  }

  const { data, error } = await query

  if (error) {
    console.error('getPlayerFreeBets error:', error)
    return []
  }

  return data as FreeBet[]
}

export async function createFreeBet(
  playerId: string,
  amount: number,
  validUntil: string,
  options?: {
    gameType?: 'casino' | 'sports'
    minOdds?: number
    source?: string
  },
): Promise<{ freeBet: FreeBet | null; error: string | null }> {
  if (!isSupabaseConfigured) {
    return { freeBet: null, error: 'Database not configured' }
  }

  const { data, error } = await supabase
    .from('free_bets')
    .insert({
      player_id: playerId,
      amount,
      valid_until: validUntil,
      game_type: options?.gameType,
      min_odds: options?.minOdds,
      source: options?.source,
    })
    .select()
    .single()

  if (error) {
    console.error('createFreeBet error:', error)
    return { freeBet: null, error: error.message }
  }

  return { freeBet: data as FreeBet, error: null }
}

// ===========================================
// Game Sessions & Bets
// ===========================================

export async function getPlayerGameSessions(
  playerId: string,
  limit = 50,
): Promise<GameSession[]> {
  if (!isSupabaseConfigured) return []

  const { data, error } = await supabase
    .from('game_sessions')
    .select('*')
    .eq('player_id', playerId)
    .order('started_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('getPlayerGameSessions error:', error)
    return []
  }

  return data as GameSession[]
}

export async function getPlayerBets(
  playerId: string,
  limit = 50,
  offset = 0,
): Promise<Bet[]> {
  if (!isSupabaseConfigured) return []

  const { data, error } = await supabase
    .from('bets')
    .select('*')
    .eq('player_id', playerId)
    .order('placed_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) {
    console.error('getPlayerBets error:', error)
    return []
  }

  return data as Bet[]
}

// ===========================================
// KYC
// ===========================================

export async function getPlayerKyc(playerId: string): Promise<KycStatus | null> {
  if (!isSupabaseConfigured) return null

  const { data, error } = await supabase
    .from('kyc_status')
    .select('*')
    .eq('player_id', playerId)
    .single()

  if (error) {
    console.error('getPlayerKyc error:', error)
    return null
  }

  return data as KycStatus
}

export async function updatePlayerKyc(
  playerId: string,
  updates: Partial<KycStatus>,
): Promise<boolean> {
  if (!isSupabaseConfigured) return false

  const { error } = await supabase
    .from('kyc_status')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('player_id', playerId)

  return !error
}

// ===========================================
// Responsible Gaming
// ===========================================

export async function getPlayerRgControls(
  playerId: string,
  activeOnly = true,
): Promise<ResponsibleGaming[]> {
  if (!isSupabaseConfigured) return []

  let query = supabase
    .from('responsible_gaming')
    .select('*')
    .eq('player_id', playerId)
    .order('created_at', { ascending: false })

  if (activeOnly) {
    query = query.eq('is_active', true)
  }

  const { data, error } = await query

  if (error) {
    console.error('getPlayerRgControls error:', error)
    return []
  }

  return data as ResponsibleGaming[]
}

export async function createRgControl(
  playerId: string,
  controlType: RgControlType,
  options?: {
    product?: RgProduct
    limitValue?: number
    limitPeriod?: LimitPeriod
    endsAt?: string
    reason?: string
    setByPlayer?: boolean
    setByAdminId?: string
  },
): Promise<{ control: ResponsibleGaming | null; error: string | null }> {
  if (!isSupabaseConfigured) {
    return { control: null, error: 'Database not configured' }
  }

  const { data, error } = await supabase
    .from('responsible_gaming')
    .insert({
      player_id: playerId,
      control_type: controlType,
      product: options?.product ?? 'all',
      limit_value: options?.limitValue,
      limit_period: options?.limitPeriod,
      ends_at: options?.endsAt,
      reason: options?.reason,
      set_by_player: options?.setByPlayer ?? true,
      set_by_admin_id: options?.setByAdminId,
    })
    .select()
    .single()

  if (error) {
    console.error('createRgControl error:', error)
    return { control: null, error: error.message }
  }

  // If it's an account closure or full break, update player status
  if (controlType === 'account_closure' || controlType === 'full_break') {
    await supabase
      .from('players')
      .update({ status: 'self_excluded' })
      .eq('id', playerId)
  }

  return { control: data as ResponsibleGaming, error: null }
}

export async function cancelRgControl(
  controlId: string,
  reason?: string,
): Promise<boolean> {
  if (!isSupabaseConfigured) return false

  const { error } = await supabase
    .from('responsible_gaming')
    .update({
      is_active: false,
      cancelled_at: new Date().toISOString(),
      cancelled_reason: reason,
    })
    .eq('id', controlId)

  return !error
}

// ===========================================
// Player Notes
// ===========================================

export async function getPlayerNotes(playerId: string): Promise<PlayerNote[]> {
  if (!isSupabaseConfigured) return []

  const { data, error } = await supabase
    .from('player_notes')
    .select('*')
    .eq('player_id', playerId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('getPlayerNotes error:', error)
    return []
  }

  return data as PlayerNote[]
}

export async function createPlayerNote(
  playerId: string,
  authorId: string,
  authorEmail: string,
  content: string,
  isImportant = false,
): Promise<{ note: PlayerNote | null; error: string | null }> {
  if (!isSupabaseConfigured) {
    return { note: null, error: 'Database not configured' }
  }

  const { data, error } = await supabase
    .from('player_notes')
    .insert({
      player_id: playerId,
      author_id: authorId,
      author_email: authorEmail,
      content,
      is_important: isImportant,
    })
    .select()
    .single()

  if (error) {
    console.error('createPlayerNote error:', error)
    return { note: null, error: error.message }
  }

  return { note: data as PlayerNote, error: null }
}

// ===========================================
// Player Summary (for CMS)
// ===========================================

export async function getPlayerSummaries(
  limit = 50,
  offset = 0,
  filters?: {
    status?: string
    kycLevel?: string
    tier?: string
    brand?: string
    search?: string
  },
): Promise<PlayerSummary[]> {
  if (!isSupabaseConfigured) return []

  let query = supabase
    .from('player_summary')
    .select('*')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (filters?.status) {
    query = query.eq('status', filters.status)
  }
  if (filters?.kycLevel) {
    query = query.eq('kyc_level', filters.kycLevel)
  }
  if (filters?.tier) {
    query = query.eq('tier', filters.tier)
  }
  if (filters?.brand) {
    // Match players currently using this brand, or who registered on it
    query = query.or(`last_brand.eq.${filters.brand},brand.eq.${filters.brand}`)
  }
  if (filters?.search) {
    query = query.or(`phone.ilike.%${filters.search}%,email.ilike.%${filters.search}%,display_name.ilike.%${filters.search}%`)
  }

  const { data, error } = await query

  if (error) {
    console.error('getPlayerSummaries error:', error)
    return []
  }

  return data as PlayerSummary[]
}

export async function getPlayerSummaryById(id: string): Promise<PlayerSummary | null> {
  if (!isSupabaseConfigured) return null

  const { data, error } = await supabase
    .from('player_summary')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('getPlayerSummaryById error:', error)
    return null
  }

  return data as PlayerSummary
}

export async function getPlayerAttribution(playerId: string): Promise<PlayerAttribution | null> {
  if (!isSupabaseConfigured) return null

  const { data, error } = await supabase
    .from('player_attribution')
    .select('*')
    .eq('player_id', playerId)
    .single()

  if (error) {
    if (error.code !== 'PGRST116') console.error('getPlayerAttribution error:', error)
    return null
  }

  return data as PlayerAttribution
}

// ===========================================
// Player Tiers
// ===========================================

/**
 * Calculate the appropriate tier based on player activity
 */
export function calculateTier(totalDeposits: number, betCount: number): PlayerTier {
  // Check tiers from highest to lowest
  for (let i = PLAYER_TIERS.length - 1; i >= 0; i--) {
    const tier = PLAYER_TIERS[i]
    const threshold = TIER_THRESHOLDS[tier]
    if (totalDeposits >= threshold.minDeposits && betCount >= threshold.minBets) {
      return tier
    }
  }
  return 'bronze'
}

/**
 * Update a player's tier (manual override by admin)
 */
export async function setPlayerTier(
  playerId: string,
  tier: PlayerTier,
  isOverride = true,
): Promise<boolean> {
  if (!isSupabaseConfigured) return false

  const { error } = await supabase
    .from('players')
    .update({
      tier,
      tier_override: isOverride,
      updated_at: new Date().toISOString(),
    })
    .eq('id', playerId)

  if (error) {
    console.error('setPlayerTier error:', error)
    return false
  }

  return true
}

/**
 * Recalculate and update a player's tier based on their activity
 * Only updates if tier_override is false
 */
export async function recalculatePlayerTier(playerId: string): Promise<PlayerTier | null> {
  if (!isSupabaseConfigured) return null

  // Get player summary
  const summary = await getPlayerSummaryById(playerId)
  if (!summary) return null

  // Don't recalculate if tier was manually set
  if (summary.tier_override) {
    return summary.tier
  }

  // Calculate new tier
  const newTier = calculateTier(summary.total_deposits, summary.bet_count)

  // Update if changed
  if (newTier !== summary.tier) {
    await setPlayerTier(playerId, newTier, false)
  }

  return newTier
}

/**
 * Remove tier override and recalculate based on activity
 */
export async function clearTierOverride(playerId: string): Promise<PlayerTier | null> {
  if (!isSupabaseConfigured) return null

  // First, clear the override flag
  const { error } = await supabase
    .from('players')
    .update({
      tier_override: false,
      updated_at: new Date().toISOString(),
    })
    .eq('id', playerId)

  if (error) {
    console.error('clearTierOverride error:', error)
    return null
  }

  // Then recalculate
  return recalculatePlayerTier(playerId)
}

/**
 * Get tier statistics for all players
 */
export async function getTierStatistics(): Promise<Record<PlayerTier, number>> {
  const stats: Record<PlayerTier, number> = {
    bronze: 0,
    silver: 0,
    gold: 0,
    platinum: 0,
    diamond: 0,
  }

  if (!isSupabaseConfigured) return stats

  const { data, error } = await supabase
    .from('players')
    .select('tier')

  if (error) {
    console.error('getTierStatistics error:', error)
    return stats
  }

  for (const player of data ?? []) {
    const tier = (player.tier as PlayerTier) || 'bronze'
    stats[tier]++
  }

  return stats
}
