import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { usePlayerAuth } from '@/lib/player-auth'
import {
  getPlayerWallets,
  getPlayerBets,
  getPlayerFreeBets,
  getPlayerSummaryById,
} from '@/lib/player-db'
import type { Wallet, Bet, FreeBet, PlayerTier, PlayerSummary } from '@/lib/player-types'
import { PLAYER_TIER_LABELS, TIER_COLORS, TIER_THRESHOLDS, PLAYER_TIERS } from '@/lib/player-types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Wallet as WalletIcon, History, Gift, ArrowRight, TrendingUp, Crown } from 'lucide-react'

export function AccountDashboard() {
  const { player } = usePlayerAuth()
  const [wallets, setWallets] = useState<Wallet[]>([])
  const [recentBets, setRecentBets] = useState<Bet[]>([])
  const [freeBets, setFreeBets] = useState<FreeBet[]>([])
  const [summary, setSummary] = useState<PlayerSummary | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!player) return

    async function loadData() {
      const [w, b, fb, s] = await Promise.all([
        getPlayerWallets(player!.id),
        getPlayerBets(player!.id, 5),
        getPlayerFreeBets(player!.id, true),
        getPlayerSummaryById(player!.id),
      ])
      setWallets(w)
      setRecentBets(b)
      setFreeBets(fb)
      setSummary(s)
      setLoading(false)
    }

    void loadData()
  }, [player])

  const realWallet = wallets.find((w) => w.type === 'real_money')
  const bonusWallet = wallets.find((w) => w.type === 'bonus')

  if (loading) {
    return (
      <div className="flex min-h-[30vh] items-center justify-center">
        <p className="text-sm text-foreground/60">Loading account data...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Balances */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Real Balance</CardTitle>
            <WalletIcon className="size-4 text-foreground/40" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              €{realWallet?.balance.toFixed(2) ?? '0.00'}
            </p>
            <Button asChild size="sm" className="mt-3">
              <Link to="/account/wallet">
                Deposit
                <ArrowRight className="ml-1 size-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Bonus Balance</CardTitle>
            <Gift className="size-4 text-foreground/40" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              €{bonusWallet?.balance.toFixed(2) ?? '0.00'}
            </p>
            {(bonusWallet?.locked_balance ?? 0) > 0 && (
              <p className="mt-1 text-xs text-foreground/60">
                €{bonusWallet?.locked_balance.toFixed(2)} wagering remaining
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Free Bets</CardTitle>
            <TrendingUp className="size-4 text-foreground/40" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{freeBets.length}</p>
            {freeBets.length > 0 && (
              <p className="mt-1 text-xs text-foreground/60">
                €{freeBets.reduce((sum, fb) => sum + fb.amount, 0).toFixed(2)} total value
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tier Status */}
      {player && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Crown
                className="size-5"
                style={{ color: TIER_COLORS[summary?.tier ?? player.tier ?? 'bronze'] }}
              />
              Your VIP Tier
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-center gap-4">
              <div
                className="flex items-center gap-2 rounded-lg px-4 py-2 text-xl font-bold"
                style={{
                  backgroundColor: `${TIER_COLORS[summary?.tier ?? player.tier ?? 'bronze']}20`,
                  color: TIER_COLORS[summary?.tier ?? player.tier ?? 'bronze'],
                }}
              >
                <Crown className="size-6" />
                {PLAYER_TIER_LABELS[summary?.tier ?? player.tier ?? 'bronze']}
              </div>
              <TierProgress
                currentTier={summary?.tier ?? player.tier ?? 'bronze'}
                totalDeposits={summary?.total_deposits ?? 0}
                betCount={summary?.bet_count ?? 0}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Free Bets */}
      {freeBets.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Active Free Bets</CardTitle>
            <CardDescription>Use these before they expire</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {freeBets.map((fb) => (
                <div
                  key={fb.id}
                  className="flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/5 px-3 py-2"
                >
                  <Gift className="size-4 text-primary" />
                  <span className="font-medium">€{fb.amount.toFixed(2)}</span>
                  <Badge variant="outline" className="text-xs">
                    {fb.game_type ?? 'Any'} • Expires{' '}
                    {new Date(fb.valid_until).toLocaleDateString()}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Activity */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base">Recent Activity</CardTitle>
            <CardDescription>Your latest bets</CardDescription>
          </div>
          <Button asChild variant="ghost" size="sm">
            <Link to="/account/history">
              View all
              <ArrowRight className="ml-1 size-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {recentBets.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-8 text-center">
              <History className="size-8 text-foreground/30" />
              <p className="text-sm text-foreground/60">No bets yet</p>
              <Button asChild size="sm">
                <Link to="/casino">Start playing</Link>
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {recentBets.map((bet) => (
                <div
                  key={bet.id}
                  className="flex items-center justify-between rounded-lg border border-border-muted bg-background-subtle px-3 py-2"
                >
                  <div className="flex flex-col gap-0.5">
                    <p className="text-sm font-medium">
                      {bet.game_id ?? 'Unknown Game'}
                    </p>
                    <p className="text-xs text-foreground/60">
                      {new Date(bet.placed_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      €{bet.stake.toFixed(2)}
                    </span>
                    <Badge
                      variant={
                        bet.outcome === 'win'
                          ? 'success'
                          : bet.outcome === 'loss'
                            ? 'destructive'
                            : 'outline'
                      }
                    >
                      {bet.outcome === 'pending'
                        ? 'Pending'
                        : bet.outcome === 'win'
                          ? `+€${bet.payout?.toFixed(2)}`
                          : bet.outcome}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function TierProgress({
  currentTier,
  totalDeposits,
  betCount,
}: {
  currentTier: PlayerTier
  totalDeposits: number
  betCount: number
}) {
  const currentIndex = PLAYER_TIERS.indexOf(currentTier)
  const nextTier = PLAYER_TIERS[currentIndex + 1]

  if (!nextTier) {
    return (
      <div className="text-sm text-foreground/60">
        You've reached the highest tier!
      </div>
    )
  }

  const nextThreshold = TIER_THRESHOLDS[nextTier]
  const depositProgress = Math.min(100, (totalDeposits / nextThreshold.minDeposits) * 100)
  const betProgress = Math.min(100, (betCount / nextThreshold.minBets) * 100)

  return (
    <div className="min-w-[200px] flex-1 text-sm">
      <p className="text-foreground/60">
        Next tier:{' '}
        <span style={{ color: TIER_COLORS[nextTier] }} className="font-medium">
          {PLAYER_TIER_LABELS[nextTier]}
        </span>
      </p>
      <div className="mt-2 flex flex-col gap-1.5">
        <div>
          <div className="mb-0.5 flex justify-between text-xs text-foreground/50">
            <span>Deposits</span>
            <span>
              €{totalDeposits.toFixed(0)} / €{nextThreshold.minDeposits}
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-background-muted">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${depositProgress}%`,
                backgroundColor: TIER_COLORS[nextTier],
              }}
            />
          </div>
        </div>
        <div>
          <div className="mb-0.5 flex justify-between text-xs text-foreground/50">
            <span>Bets</span>
            <span>
              {betCount} / {nextThreshold.minBets}
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-background-muted">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${betProgress}%`,
                backgroundColor: TIER_COLORS[nextTier],
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
