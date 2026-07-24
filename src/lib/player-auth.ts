// Player Authentication System (Phone + OTP)
import { createContext, useContext } from 'react'
import type { Player, PlayerAttribution, PlayerBrand } from './player-types'
import {
  createOtpCode,
  verifyOtpCode,
  getPlayerByPhone,
  createPlayer,
  createPlayerSession,
  getSessionByToken,
  deleteSession,
  getPlayerById,
  updatePlayerLastBrand,
} from './player-db'

const PLAYER_SESSION_KEY = 'blixx_player_session'

export type PlayerAuthState = {
  player: Player | null
  loading: boolean
  isAuthenticated: boolean
}

export type PlayerAuthContextValue = PlayerAuthState & {
  requestOtp: (phone: string) => Promise<{ code: string | null; error: string | null }>
  verifyOtp: (
    phone: string,
    code: string,
    options?: {
      attribution?: Partial<PlayerAttribution>
      brand?: PlayerBrand
    },
  ) => Promise<{ error: string | null }>
  logout: () => Promise<void>
  refreshPlayer: () => Promise<void>
}

export const PlayerAuthContext = createContext<PlayerAuthContextValue | null>(null)

export function usePlayerAuth(): PlayerAuthContextValue {
  const ctx = useContext(PlayerAuthContext)
  if (!ctx) {
    throw new Error('usePlayerAuth must be used within PlayerAuthProvider')
  }
  return ctx
}

// Get stored session token
export function getStoredSessionToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(PLAYER_SESSION_KEY)
}

// Store session token
export function storeSessionToken(token: string): void {
  localStorage.setItem(PLAYER_SESSION_KEY, token)
}

// Clear session token
export function clearSessionToken(): void {
  localStorage.removeItem(PLAYER_SESSION_KEY)
}

// Request OTP code (mock: returns the code for display)
export async function requestOtp(
  phone: string,
): Promise<{ code: string | null; error: string | null }> {
  // Normalize phone number
  const normalizedPhone = normalizePhone(phone)
  
  if (!normalizedPhone) {
    return { code: null, error: 'Invalid phone number' }
  }

  const result = await createOtpCode(normalizedPhone, 'login')
  
  if (result.error) {
    return { code: null, error: result.error }
  }

  // In mock mode, we return the code so it can be displayed to the user
  return { code: result.code, error: null }
}

// Verify OTP and create session
export async function verifyOtpAndLogin(
  phone: string,
  code: string,
  attribution?: Partial<PlayerAttribution>,
  brand: PlayerBrand = 'kanuuna',
): Promise<{ player: Player | null; token: string | null; error: string | null }> {
  const normalizedPhone = normalizePhone(phone)
  
  if (!normalizedPhone) {
    return { player: null, token: null, error: 'Invalid phone number' }
  }

  // Verify the OTP
  const otpResult = await verifyOtpCode(normalizedPhone, code)
  
  if (!otpResult.valid) {
    return { player: null, token: null, error: otpResult.error ?? 'Invalid code' }
  }

  // Check if player exists
  let player = await getPlayerByPhone(normalizedPhone)

  // If not, create new player with registration brand
  if (!player) {
    const createResult = await createPlayer(normalizedPhone, attribution, brand)
    if (createResult.error) {
      return { player: null, token: null, error: createResult.error }
    }
    player = createResult.player
  } else {
    // Existing player: record which brand they're using now
    await updatePlayerLastBrand(player.id, brand)
    player = { ...player, last_brand: brand }
  }

  if (!player) {
    return { player: null, token: null, error: 'Failed to create player' }
  }

  // Create session
  const sessionResult = await createPlayerSession(player.id)
  
  if (sessionResult.error) {
    return { player: null, token: null, error: sessionResult.error }
  }

  return {
    player,
    token: sessionResult.session?.token ?? null,
    error: null,
  }
}

// Validate session token and get player
export async function validateSession(
  token: string,
): Promise<{ player: Player | null; valid: boolean }> {
  const session = await getSessionByToken(token)
  
  if (!session) {
    return { player: null, valid: false }
  }

  const player = await getPlayerById(session.player_id)
  
  if (!player) {
    return { player: null, valid: false }
  }

  // Check if player account is active
  if (player.status !== 'active') {
    return { player: null, valid: false }
  }

  return { player, valid: true }
}

// Logout
export async function logout(token: string): Promise<void> {
  await deleteSession(token)
  clearSessionToken()
}

// Normalize phone number (basic implementation)
function normalizePhone(phone: string): string | null {
  // Remove all non-digit characters except leading +
  let normalized = phone.replace(/[^\d+]/g, '')
  
  // If it doesn't start with +, assume Finnish number
  if (!normalized.startsWith('+')) {
    if (normalized.startsWith('0')) {
      normalized = '+358' + normalized.slice(1)
    } else {
      normalized = '+' + normalized
    }
  }
  
  // Basic validation: at least 10 digits
  const digits = normalized.replace(/\D/g, '')
  if (digits.length < 10) {
    return null
  }
  
  return normalized
}

// Parse attribution from URL params
export function parseAttributionFromUrl(): Partial<PlayerAttribution> {
  if (typeof window === 'undefined') return {}
  
  const params = new URLSearchParams(window.location.search)
  const attribution: Partial<PlayerAttribution> = {}

  // Check for affiliate/referral code
  const ref = params.get('ref') || params.get('affiliate') || params.get('code')
  if (ref) {
    attribution.source_code = ref
    attribution.source = 'affiliate'
  }

  // Check for referral from another player
  const referrer = params.get('referrer') || params.get('invited_by')
  if (referrer) {
    attribution.referred_by_player_id = referrer
    attribution.source = 'referral'
  }

  // UTM parameters
  const utmSource = params.get('utm_source')
  const utmMedium = params.get('utm_medium')
  const utmCampaign = params.get('utm_campaign')
  const utmContent = params.get('utm_content')
  const utmTerm = params.get('utm_term')

  if (utmSource) attribution.utm_source = utmSource
  if (utmMedium) attribution.utm_medium = utmMedium
  if (utmCampaign) attribution.utm_campaign = utmCampaign
  if (utmContent) attribution.utm_content = utmContent
  if (utmTerm) attribution.utm_term = utmTerm

  // Determine source from UTM if not already set
  if (!attribution.source && utmSource) {
    if (utmSource.includes('facebook') || utmSource.includes('instagram') || utmSource.includes('twitter') || utmSource.includes('tiktok')) {
      attribution.source = 'social'
    } else if (utmMedium === 'cpc' || utmMedium === 'ppc' || utmMedium === 'paid') {
      attribution.source = 'paid_ad'
    }
  }

  // Landing URL
  attribution.landing_url = window.location.href

  return attribution
}
