import { useCallback, useEffect, useState, type ReactNode } from 'react'
import type { PlayerAttribution, PlayerBrand } from '@/lib/player-types'
import {
  PlayerAuthContext,
  type PlayerAuthState,
  requestOtp as requestOtpFn,
  verifyOtpAndLogin,
  validateSession,
  logout as logoutFn,
  getStoredSessionToken,
  storeSessionToken,
  clearSessionToken,
  parseAttributionFromUrl,
} from '@/lib/player-auth'
import { getPlayerById, updatePlayerLastBrand } from '@/lib/player-db'

export function PlayerAuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PlayerAuthState>({
    player: null,
    loading: true,
    isAuthenticated: false,
  })

  // Check for existing session on mount
  useEffect(() => {
    async function checkSession() {
      const token = getStoredSessionToken()

      if (!token) {
        setState({ player: null, loading: false, isAuthenticated: false })
        return
      }

      const result = await validateSession(token)

      if (result.valid && result.player) {
        setState({
          player: result.player,
          loading: false,
          isAuthenticated: true,
        })
      } else {
        clearSessionToken()
        setState({ player: null, loading: false, isAuthenticated: false })
      }
    }

    void checkSession()
  }, [])

  const requestOtp = useCallback(async (phone: string) => {
    return requestOtpFn(phone)
  }, [])

  const verifyOtp = useCallback(
    async (
      phone: string,
      code: string,
      options?: {
        attribution?: Partial<PlayerAttribution>
        brand?: PlayerBrand
      },
    ) => {
      const urlAttribution = parseAttributionFromUrl()
      const mergedAttribution = { ...urlAttribution, ...options?.attribution }
      const brand = options?.brand ?? 'kanuuna'

      const result = await verifyOtpAndLogin(phone, code, mergedAttribution, brand)

      if (result.error) {
        return { error: result.error }
      }

      if (result.player && result.token) {
        storeSessionToken(result.token)
        setState({
          player: result.player,
          loading: false,
          isAuthenticated: true,
        })
      }

      return { error: null }
    },
    [],
  )

  const logout = useCallback(async () => {
    const token = getStoredSessionToken()
    if (token) {
      await logoutFn(token)
    }
    clearSessionToken()
    setState({ player: null, loading: false, isAuthenticated: false })
  }, [])

  const refreshPlayer = useCallback(async () => {
    if (!state.player) return

    const player = await getPlayerById(state.player.id)
    if (player) {
      setState((prev) => ({ ...prev, player }))
    }
  }, [state.player])

  return (
    <PlayerAuthContext.Provider
      value={{ ...state, requestOtp, verifyOtp, logout, refreshPlayer }}
    >
      {children}
    </PlayerAuthContext.Provider>
  )
}

/** Call when a logged-in player switches brand in preferences */
export async function syncPlayerBrand(
  playerId: string | undefined,
  brand: PlayerBrand,
): Promise<void> {
  if (!playerId) return
  await updatePlayerLastBrand(playerId, brand)
}
