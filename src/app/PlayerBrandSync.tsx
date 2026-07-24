import { useEffect, useRef } from 'react'
import { usePreferences } from '@/app/PreferencesProvider'
import { usePlayerAuth } from '@/lib/player-auth'
import { updatePlayerLastBrand } from '@/lib/player-db'

/**
 * Keeps players.last_brand in sync when a logged-in player switches brand.
 * Must render under both PreferencesProvider and PlayerAuthProvider.
 */
export function PlayerBrandSync() {
  const { brand } = usePreferences()
  const { player, isAuthenticated } = usePlayerAuth()
  const lastSynced = useRef<string | null>(null)

  useEffect(() => {
    if (!isAuthenticated || !player) return
    const key = `${player.id}:${brand}`
    if (lastSynced.current === key) return
    if (player.last_brand === brand) {
      lastSynced.current = key
      return
    }

    lastSynced.current = key
    void updatePlayerLastBrand(player.id, brand)
  }, [brand, isAuthenticated, player])

  return null
}
