import { useEffect, useState } from 'react'
import { usePlayerAuth } from '@/lib/player-auth'
import { getPlayerBets, getPlayerGameSessions } from '@/lib/player-db'
import type { Bet, GameSession } from '@/lib/player-types'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { Dices, Clock } from 'lucide-react'

export function HistoryPage() {
  const { player } = usePlayerAuth()
  const [bets, setBets] = useState<Bet[]>([])
  const [sessions, setSessions] = useState<GameSession[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!player) return

    async function loadData() {
      const [b, s] = await Promise.all([
        getPlayerBets(player!.id, 100),
        getPlayerGameSessions(player!.id, 50),
      ])
      setBets(b)
      setSessions(s)
      setLoading(false)
    }

    void loadData()
  }, [player])

  if (loading) {
    return (
      <div className="flex min-h-[30vh] items-center justify-center">
        <p className="text-sm text-foreground/60">Loading history...</p>
      </div>
    )
  }

  return (
    <Tabs defaultValue="bets" className="flex flex-col gap-4">
      <TabsList className="w-fit">
        <TabsTrigger value="bets">Bet History</TabsTrigger>
        <TabsTrigger value="sessions">Game Sessions</TabsTrigger>
      </TabsList>

      <TabsContent value="bets">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Bet History</CardTitle>
            <CardDescription>All your bets and their outcomes</CardDescription>
          </CardHeader>
          <CardContent>
            {bets.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-8 text-center">
                <Dices className="size-8 text-foreground/30" />
                <p className="text-sm text-foreground/60">No bets yet</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {bets.map((bet) => (
                  <div
                    key={bet.id}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border-muted bg-background-subtle px-3 py-2"
                  >
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">
                          {bet.game_id ?? 'Unknown Game'}
                        </p>
                        {bet.is_first_bet && (
                          <Badge variant="info" className="text-xs">
                            First Bet
                          </Badge>
                        )}
                        {bet.free_bet_id && (
                          <Badge variant="success" className="text-xs">
                            Free Bet
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-foreground/60">
                        {new Date(bet.placed_at).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-sm font-medium">€{bet.stake.toFixed(2)}</p>
                        {bet.odds && (
                          <p className="text-xs text-foreground/60">@ {bet.odds}</p>
                        )}
                      </div>
                      <Badge
                        variant={
                          bet.outcome === 'win'
                            ? 'success'
                            : bet.outcome === 'loss'
                              ? 'destructive'
                              : bet.outcome === 'void'
                                ? 'outline'
                                : 'default'
                        }
                        className="min-w-[70px] justify-center"
                      >
                        {bet.outcome === 'win'
                          ? `+€${bet.payout?.toFixed(2)}`
                          : bet.outcome.charAt(0).toUpperCase() + bet.outcome.slice(1)}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="sessions">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Game Sessions</CardTitle>
            <CardDescription>Your casino play sessions</CardDescription>
          </CardHeader>
          <CardContent>
            {sessions.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-8 text-center">
                <Clock className="size-8 text-foreground/30" />
                <p className="text-sm text-foreground/60">No game sessions yet</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {sessions.map((session) => (
                  <div
                    key={session.id}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border-muted bg-background-subtle px-3 py-2"
                  >
                    <div className="flex flex-col gap-0.5">
                      <p className="text-sm font-medium">
                        {session.game_name ?? session.game_id}
                      </p>
                      <p className="text-xs text-foreground/60">
                        {session.game_provider ?? 'Unknown Provider'}
                      </p>
                      <p className="text-xs text-foreground/60">
                        {new Date(session.started_at).toLocaleString()}
                        {session.ended_at && (
                          <> — {new Date(session.ended_at).toLocaleTimeString()}</>
                        )}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <p className="text-sm">
                        {session.bet_count} bets
                      </p>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-foreground/60">
                          Wagered: €{session.total_bets.toFixed(2)}
                        </span>
                        <span
                          className={
                            session.total_wins >= session.total_bets
                              ? 'text-success'
                              : 'text-destructive'
                          }
                        >
                          Won: €{session.total_wins.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
