import { useEffect, useState } from 'react'
import { usePlayerAuth } from '@/lib/player-auth'
import { getPlayerFreeBets, getPlayerWallets } from '@/lib/player-db'
import type { FreeBet, Wallet } from '@/lib/player-types'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Gift, Clock, CheckCircle2, XCircle } from 'lucide-react'

export function BonusesPage() {
  const { player } = usePlayerAuth()
  const [freeBets, setFreeBets] = useState<FreeBet[]>([])
  const [wallets, setWallets] = useState<Wallet[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!player) return

    async function loadData() {
      const [fb, w] = await Promise.all([
        getPlayerFreeBets(player!.id, false), // Get all, not just active
        getPlayerWallets(player!.id),
      ])
      setFreeBets(fb)
      setWallets(w)
      setLoading(false)
    }

    void loadData()
  }, [player])

  const bonusWallet = wallets.find((w) => w.type === 'bonus')
  const activeFreeBets = freeBets.filter((fb) => fb.status === 'active')
  const usedFreeBets = freeBets.filter((fb) => fb.status === 'used')
  const expiredFreeBets = freeBets.filter((fb) => fb.status === 'expired')

  if (loading) {
    return (
      <div className="flex min-h-[30vh] items-center justify-center">
        <p className="text-sm text-foreground/60">Loading bonuses...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Bonus Balance Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Gift className="size-5" />
            Bonus Balance
          </CardTitle>
          <CardDescription>
            Bonus funds must be wagered before withdrawal
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">
            €{bonusWallet?.balance.toFixed(2) ?? '0.00'}
          </p>
          {(bonusWallet?.locked_balance ?? 0) > 0 && (
            <div className="mt-4 rounded-lg bg-background-subtle p-3">
              <p className="text-sm font-medium">Wagering Requirement</p>
              <p className="mt-1 text-2xl font-bold text-primary">
                €{bonusWallet?.locked_balance.toFixed(2)}
              </p>
              <p className="mt-1 text-xs text-foreground/60">
                Remaining amount to wager before bonus can be converted
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Active Free Bets */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Active Free Bets</CardTitle>
          <CardDescription>
            {activeFreeBets.length} free bet{activeFreeBets.length !== 1 ? 's' : ''} available
          </CardDescription>
        </CardHeader>
        <CardContent>
          {activeFreeBets.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-8 text-center">
              <Gift className="size-8 text-foreground/30" />
              <p className="text-sm text-foreground/60">No active free bets</p>
              <p className="text-xs text-foreground/40">
                Free bets are awarded through promotions and bonuses
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {activeFreeBets.map((fb) => (
                <FreeBetCard key={fb.id} freeBet={fb} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Used Free Bets */}
      {usedFreeBets.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <CheckCircle2 className="size-4 text-success" />
              Used Free Bets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              {usedFreeBets.map((fb) => (
                <FreeBetCard key={fb.id} freeBet={fb} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Expired Free Bets */}
      {expiredFreeBets.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <XCircle className="size-4 text-foreground/40" />
              Expired Free Bets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              {expiredFreeBets.map((fb) => (
                <FreeBetCard key={fb.id} freeBet={fb} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function FreeBetCard({ freeBet }: { freeBet: FreeBet }) {
  const isActive = freeBet.status === 'active'
  const isUsed = freeBet.status === 'used'

  return (
    <div
      className={`flex flex-wrap items-center justify-between gap-3 rounded-lg border px-4 py-3 ${
        isActive
          ? 'border-primary/30 bg-primary/5'
          : 'border-border-muted bg-background-subtle opacity-60'
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`rounded-full p-2 ${
            isActive ? 'bg-primary/10' : 'bg-foreground/5'
          }`}
        >
          <Gift className={`size-5 ${isActive ? 'text-primary' : 'text-foreground/40'}`} />
        </div>
        <div className="flex flex-col gap-0.5">
          <p className="font-medium">€{freeBet.amount.toFixed(2)} Free Bet</p>
          <p className="text-xs text-foreground/60">
            {freeBet.game_type
              ? `${freeBet.game_type.charAt(0).toUpperCase() + freeBet.game_type.slice(1)} only`
              : 'Any game'}
            {freeBet.min_odds && ` • Min odds ${freeBet.min_odds}`}
          </p>
          {freeBet.source && (
            <p className="text-xs text-foreground/50">From: {freeBet.source}</p>
          )}
        </div>
      </div>
      <div className="flex flex-col items-end gap-1">
        <Badge
          variant={
            isActive ? 'success' : isUsed ? 'outline' : 'secondary'
          }
        >
          {freeBet.status.charAt(0).toUpperCase() + freeBet.status.slice(1)}
        </Badge>
        <p className="flex items-center gap-1 text-xs text-foreground/60">
          <Clock className="size-3" />
          {isActive
            ? `Expires ${new Date(freeBet.valid_until).toLocaleDateString()}`
            : isUsed
              ? `Used ${new Date(freeBet.used_at!).toLocaleDateString()}`
              : `Expired ${new Date(freeBet.valid_until).toLocaleDateString()}`}
        </p>
      </div>
    </div>
  )
}
