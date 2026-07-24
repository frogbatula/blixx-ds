// Player Management System Types
import type { Brand } from '@/brands/types'

export type PlayerStatus = 'active' | 'suspended' | 'self_excluded' | 'closed'
export type PlayerBrand = Brand
export type AttributionSource = 'organic' | 'affiliate' | 'social' | 'referral' | 'paid_ad'
export type WalletType = 'real_money' | 'bonus'
export type TransactionType = 'deposit' | 'withdrawal' | 'bet' | 'win' | 'bonus_credit' | 'bonus_conversion' | 'adjustment'
export type TransactionStatus = 'pending' | 'completed' | 'failed' | 'cancelled'
export type BetOutcome = 'pending' | 'win' | 'loss' | 'void' | 'cashout'
export type GameType = 'casino' | 'sports'
export type FreeBetStatus = 'active' | 'used' | 'expired'
export type KycLevel = 'none' | 'basic' | 'verified' | 'enhanced'
export type RgControlType = 'deposit_limit' | 'loss_limit' | 'session_limit' | 'product_break' | 'full_break' | 'account_closure'
export type RgProduct = 'casino' | 'sports' | 'all'
export type LimitPeriod = 'daily' | 'weekly' | 'monthly'

// Player Tiers
export type PlayerTier = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond'

export const PLAYER_TIERS: PlayerTier[] = ['bronze', 'silver', 'gold', 'platinum', 'diamond']

export const PLAYER_TIER_LABELS: Record<PlayerTier, string> = {
  bronze: 'Bronze',
  silver: 'Silver',
  gold: 'Gold',
  platinum: 'Platinum',
  diamond: 'Diamond',
}

// Tier thresholds based on total deposits (EUR)
export const TIER_THRESHOLDS: Record<PlayerTier, { minDeposits: number; minBets: number }> = {
  bronze: { minDeposits: 0, minBets: 0 },
  silver: { minDeposits: 500, minBets: 50 },
  gold: { minDeposits: 2000, minBets: 200 },
  platinum: { minDeposits: 10000, minBets: 1000 },
  diamond: { minDeposits: 50000, minBets: 5000 },
}

// Tier colors for UI
export const TIER_COLORS: Record<PlayerTier, string> = {
  bronze: '#CD7F32',
  silver: '#C0C0C0',
  gold: '#FFD700',
  platinum: '#E5E4E2',
  diamond: '#B9F2FF',
}

export type Player = {
  id: string
  phone: string
  phone_verified: boolean
  email: string | null
  display_name: string | null
  first_name: string | null
  last_name: string | null
  date_of_birth: string | null
  country_code: string
  locale: string
  status: PlayerStatus
  tier: PlayerTier
  tier_override: boolean // true if manually set by admin
  /** Brand the player registered under */
  brand: PlayerBrand
  /** Brand last used on login / session */
  last_brand: PlayerBrand
  created_at: string
  updated_at: string
}

export type PlayerSession = {
  id: string
  player_id: string
  token: string
  expires_at: string
  created_at: string
}

export type OtpCode = {
  id: string
  phone: string
  code: string
  purpose: 'login' | 'register'
  expires_at: string
  used_at: string | null
  created_at: string
}

export type PlayerAttribution = {
  id: string
  player_id: string
  source: AttributionSource
  source_code: string | null
  campaign: string | null
  landing_url: string | null
  utm_source: string | null
  utm_medium: string | null
  utm_campaign: string | null
  utm_content: string | null
  utm_term: string | null
  referred_by_player_id: string | null
  created_at: string
}

export type Wallet = {
  id: string
  player_id: string
  type: WalletType
  currency: string
  balance: number
  locked_balance: number
  created_at: string
  updated_at: string
}

export type Transaction = {
  id: string
  player_id: string
  wallet_id: string
  type: TransactionType
  amount: number
  balance_before: number
  balance_after: number
  reference_id: string | null
  reference_type: string | null
  status: TransactionStatus
  description: string | null
  metadata: Record<string, unknown>
  created_at: string
}

export type FreeBet = {
  id: string
  player_id: string
  amount: number
  currency: string
  game_type: GameType | null
  min_odds: number | null
  valid_from: string
  valid_until: string
  used_at: string | null
  used_bet_id: string | null
  status: FreeBetStatus
  source: string | null
  created_at: string
}

export type GameSession = {
  id: string
  player_id: string
  game_id: string
  game_name: string | null
  game_provider: string | null
  started_at: string
  ended_at: string | null
  total_bets: number
  total_wins: number
  bet_count: number
  currency: string
}

export type Bet = {
  id: string
  player_id: string
  game_session_id: string | null
  game_id: string | null
  game_type: GameType
  stake: number
  currency: string
  free_bet_id: string | null
  outcome: BetOutcome
  payout: number | null
  odds: number | null
  is_first_bet: boolean
  bet_details: Record<string, unknown>
  placed_at: string
  settled_at: string | null
}

export type KycStatus = {
  id: string
  player_id: string
  level: KycLevel
  documents_submitted: Array<{
    type: string
    url: string
    uploaded_at: string
  }>
  rejection_reason: string | null
  verified_at: string | null
  verified_by: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export type ResponsibleGaming = {
  id: string
  player_id: string
  control_type: RgControlType
  product: RgProduct
  limit_value: number | null
  limit_period: LimitPeriod | null
  starts_at: string
  ends_at: string | null
  reason: string | null
  set_by_player: boolean
  set_by_admin_id: string | null
  is_active: boolean
  created_at: string
  cancelled_at: string | null
  cancelled_reason: string | null
}

export type PlayerNote = {
  id: string
  player_id: string
  author_id: string
  author_email: string | null
  content: string
  is_important: boolean
  created_at: string
}

// Aggregated view type
export type PlayerSummary = {
  id: string
  phone: string
  email: string | null
  display_name: string | null
  first_name: string | null
  last_name: string | null
  country_code: string
  status: PlayerStatus
  tier: PlayerTier
  tier_override: boolean
  brand: PlayerBrand
  last_brand: PlayerBrand
  created_at: string
  updated_at: string
  real_balance: number
  bonus_balance: number
  kyc_level: KycLevel
  attribution_source: AttributionSource | null
  attribution_code: string | null
  total_deposits: number
  total_withdrawals: number
  total_bets: number
  total_wins: number
  bet_count: number
  first_bet_at: string | null
  last_bet_at: string | null
  active_rg_controls: number
}

// Labels for display
export const PLAYER_STATUS_LABELS: Record<PlayerStatus, string> = {
  active: 'Active',
  suspended: 'Suspended',
  self_excluded: 'Self-Excluded',
  closed: 'Closed',
}

export const ATTRIBUTION_SOURCE_LABELS: Record<AttributionSource, string> = {
  organic: 'Organic',
  affiliate: 'Affiliate',
  social: 'Social Media',
  referral: 'Referral',
  paid_ad: 'Paid Ad',
}

export const WALLET_TYPE_LABELS: Record<WalletType, string> = {
  real_money: 'Real Money',
  bonus: 'Bonus',
}

export const TRANSACTION_TYPE_LABELS: Record<TransactionType, string> = {
  deposit: 'Deposit',
  withdrawal: 'Withdrawal',
  bet: 'Bet',
  win: 'Win',
  bonus_credit: 'Bonus Credit',
  bonus_conversion: 'Bonus Conversion',
  adjustment: 'Adjustment',
}

export const KYC_LEVEL_LABELS: Record<KycLevel, string> = {
  none: 'Not Started',
  basic: 'Basic',
  verified: 'Verified',
  enhanced: 'Enhanced',
}

export const RG_CONTROL_LABELS: Record<RgControlType, string> = {
  deposit_limit: 'Deposit Limit',
  loss_limit: 'Loss Limit',
  session_limit: 'Session Limit',
  product_break: 'Product Break',
  full_break: 'Full Break',
  account_closure: 'Account Closure',
}

export const RG_PRODUCT_LABELS: Record<RgProduct, string> = {
  casino: 'Casino',
  sports: 'Sports',
  all: 'All Products',
}

export const LIMIT_PERIOD_LABELS: Record<LimitPeriod, string> = {
  daily: 'Daily',
  weekly: 'Weekly',
  monthly: 'Monthly',
}
