import { useCallback, useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '@/lib/auth'
import {
  getPlayerSummaryById,
  getPlayerAttribution,
  getPlayerWallets,
  getPlayerTransactions,
  getPlayerBets,
  getPlayerGameSessions,
  getPlayerKyc,
  getPlayerRgControls,
  getPlayerNotes,
  createPlayerNote,
  updatePlayerKyc,
  setPlayerTier,
  clearTierOverride,
  calculateTier,
} from '@/lib/player-db'
import type {
  PlayerSummary,
  PlayerAttribution,
  Wallet,
  Transaction,
  Bet,
  GameSession,
  KycStatus,
  ResponsibleGaming,
  PlayerNote,
  PlayerTier,
} from '@/lib/player-types'
import {
  PLAYER_STATUS_LABELS,
  ATTRIBUTION_SOURCE_LABELS,
  TRANSACTION_TYPE_LABELS,
  KYC_LEVEL_LABELS,
  RG_CONTROL_LABELS,
  RG_PRODUCT_LABELS,
  LIMIT_PERIOD_LABELS,
  PLAYER_TIER_LABELS,
  PLAYER_TIERS,
  TIER_COLORS,
  TIER_THRESHOLDS,
} from '@/lib/player-types'
import { brandLabels } from '@/brands/types'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  ArrowLeft,
  Phone,
  Mail,
  Wallet as WalletIcon,
  Gift,
  Shield,
  FileText,
  ArrowDownLeft,
  ArrowUpRight,
  AlertTriangle,
  Crown,
  RotateCcw,
} from 'lucide-react'

export function CmsPlayerDetailPage() {
  const { playerId } = useParams<{ playerId: string }>()
  const { user } = useAuth()
  const [player, setPlayer] = useState<PlayerSummary | null>(null)
  const [attribution, setAttribution] = useState<PlayerAttribution | null>(null)
  const [wallets, setWallets] = useState<Wallet[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [bets, setBets] = useState<Bet[]>([])
  const [sessions, setSessions] = useState<GameSession[]>([])
  const [kyc, setKyc] = useState<KycStatus | null>(null)
  const [rgControls, setRgControls] = useState<ResponsibleGaming[]>([])
  const [notes, setNotes] = useState<PlayerNote[]>([])
  const [loading, setLoading] = useState(true)

  const loadData = useCallback(async () => {
    if (!playerId) return

    setLoading(true)
    const [p, a, w, t, b, s, k, rg, n] = await Promise.all([
      getPlayerSummaryById(playerId),
      getPlayerAttribution(playerId),
      getPlayerWallets(playerId),
      getPlayerTransactions(playerId, 50),
      getPlayerBets(playerId, 50),
      getPlayerGameSessions(playerId, 30),
      getPlayerKyc(playerId),
      getPlayerRgControls(playerId, false),
      getPlayerNotes(playerId),
    ])
    setPlayer(p)
    setAttribution(a)
    setWallets(w)
    setTransactions(t)
    setBets(b)
    setSessions(s)
    setKyc(k)
    setRgControls(rg)
    setNotes(n)
    setLoading(false)
  }, [playerId])

  useEffect(() => {
    void loadData()
  }, [loadData])

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-sm text-foreground/60">Loading player...</p>
      </div>
    )
  }

  if (!player) {
    return (
      <div className="flex flex-col items-center gap-4 py-12">
        <p className="text-foreground/60">Player not found</p>
        <Button asChild variant="outline">
          <Link to="/cms/players">
            <ArrowLeft className="mr-2 size-4" />
            Back to Players
          </Link>
        </Button>
      </div>
    )
  }

  const realWallet = wallets.find((w) => w.type === 'real_money')
  const bonusWallet = wallets.find((w) => w.type === 'bonus')
  const activeRg = rgControls.filter((r) => r.is_active)

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Button asChild variant="ghost" size="sm" className="mb-2">
            <Link to="/cms/players">
              <ArrowLeft className="mr-1 size-4" />
              Back to Players
            </Link>
          </Button>
          <h1 className="text-2xl font-semibold tracking-tight">
            {player.display_name ||
              `${player.first_name ?? ''} ${player.last_name ?? ''}`.trim() ||
              'Unnamed Player'}
          </h1>
          <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-foreground/70">
            <span className="flex items-center gap-1">
              <Phone className="size-4" />
              {player.phone}
            </span>
            {player.email && (
              <span className="flex items-center gap-1">
                <Mail className="size-4" />
                {player.email}
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <span
            className="flex items-center gap-1 rounded-md px-2 py-1 text-sm font-medium"
            style={{ backgroundColor: `${TIER_COLORS[player.tier]}20`, color: TIER_COLORS[player.tier] }}
          >
            <Crown className="size-4" />
            {PLAYER_TIER_LABELS[player.tier]}
            {player.tier_override && <span className="text-xs opacity-60">(manual)</span>}
          </span>
          <Badge
            variant={
              player.status === 'active'
                ? 'success'
                : player.status === 'suspended'
                  ? 'warning'
                  : 'destructive'
            }
          >
            {PLAYER_STATUS_LABELS[player.status]}
          </Badge>
          <Badge variant={player.kyc_level === 'verified' ? 'success' : 'outline'}>
            KYC: {KYC_LEVEL_LABELS[player.kyc_level]}
          </Badge>
          {(player.last_brand || player.brand) && (
            <Badge variant="outline">
              {brandLabels[player.last_brand ?? player.brand]}
            </Badge>
          )}
          {activeRg.length > 0 && (
            <Badge variant="warning">
              <Shield className="mr-1 size-3" />
              {activeRg.length} RG Control{activeRg.length !== 1 ? 's' : ''}
            </Badge>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <WalletIcon className="size-4" />
              Real Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              €{realWallet?.balance.toFixed(2) ?? '0.00'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <Gift className="size-4" />
              Bonus Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              €{bonusWallet?.balance.toFixed(2) ?? '0.00'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Deposits</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-success">
              €{player.total_deposits.toFixed(2)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Bets</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{player.bet_count}</p>
            <p className="text-xs text-foreground/60">
              First: {player.first_bet_at ? new Date(player.first_bet_at).toLocaleDateString() : 'N/A'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="flex flex-col gap-4">
        <TabsList className="w-fit">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="kyc">KYC</TabsTrigger>
          <TabsTrigger value="rg">Responsible Gaming</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <OverviewTab
            player={player}
            attribution={attribution}
            wallets={wallets}
            onUpdate={loadData}
          />
        </TabsContent>

        <TabsContent value="transactions">
          <TransactionsTab transactions={transactions} />
        </TabsContent>

        <TabsContent value="activity">
          <ActivityTab bets={bets} sessions={sessions} />
        </TabsContent>

        <TabsContent value="kyc">
          <KycTab kyc={kyc} playerId={playerId!} onUpdate={loadData} />
        </TabsContent>

        <TabsContent value="rg">
          <RgTab controls={rgControls} />
        </TabsContent>

        <TabsContent value="notes">
          <NotesTab
            notes={notes}
            playerId={playerId!}
            user={user}
            onAdd={loadData}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Overview Tab
function OverviewTab({
  player,
  attribution,
  onUpdate,
}: {
  player: PlayerSummary
  attribution: PlayerAttribution | null
  wallets: Wallet[]
  onUpdate: () => void
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Player Details</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 text-sm">
          <div className="flex justify-between">
            <span className="text-foreground/60">Phone</span>
            <span className="font-medium">{player.phone}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-foreground/60">Email</span>
            <span className="font-medium">{player.email ?? '—'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-foreground/60">Display Name</span>
            <span className="font-medium">{player.display_name ?? '—'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-foreground/60">Country</span>
            <span className="font-medium">{player.country_code}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-foreground/60">Registration Brand</span>
            <span className="font-medium">
              {player.brand ? brandLabels[player.brand] : '—'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-foreground/60">Last Used Brand</span>
            <span className="font-medium">
              {player.last_brand ? brandLabels[player.last_brand] : '—'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-foreground/60">Registered</span>
            <span className="font-medium">
              {new Date(player.created_at).toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-foreground/60">Last Active</span>
            <span className="font-medium">
              {player.last_bet_at
                ? new Date(player.last_bet_at).toLocaleString()
                : '—'}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Attribution</CardTitle>
          <CardDescription>How this player found us</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 text-sm">
          <div className="flex justify-between">
            <span className="text-foreground/60">Source</span>
            <span className="font-medium">
              {attribution?.source
                ? ATTRIBUTION_SOURCE_LABELS[attribution.source]
                : 'Organic'}
            </span>
          </div>
          {attribution?.source_code && (
            <div className="flex justify-between">
              <span className="text-foreground/60">Code</span>
              <Badge variant="outline">{attribution.source_code}</Badge>
            </div>
          )}
          {attribution?.utm_source && (
            <div className="flex justify-between">
              <span className="text-foreground/60">UTM Source</span>
              <span className="font-medium">{attribution.utm_source}</span>
            </div>
          )}
          {attribution?.utm_medium && (
            <div className="flex justify-between">
              <span className="text-foreground/60">UTM Medium</span>
              <span className="font-medium">{attribution.utm_medium}</span>
            </div>
          )}
          {attribution?.utm_campaign && (
            <div className="flex justify-between">
              <span className="text-foreground/60">UTM Campaign</span>
              <span className="font-medium">{attribution.utm_campaign}</span>
            </div>
          )}
        </CardContent>
      </Card>

      <TierManagementCard player={player} onUpdate={onUpdate} />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Financial Summary</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 text-sm">
          <div className="flex justify-between">
            <span className="text-foreground/60">Total Deposits</span>
            <span className="font-medium text-success">
              €{player.total_deposits.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-foreground/60">Total Withdrawals</span>
            <span className="font-medium text-destructive">
              €{player.total_withdrawals.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-foreground/60">Total Wagered</span>
            <span className="font-medium">€{player.total_bets.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-foreground/60">Total Wins</span>
            <span className="font-medium">€{player.total_wins.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-foreground/60">Net Result</span>
            <span
              className={`font-medium ${
                player.total_wins - player.total_bets >= 0
                  ? 'text-success'
                  : 'text-destructive'
              }`}
            >
              €{(player.total_wins - player.total_bets).toFixed(2)}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm">
            Add Bonus
          </Button>
          <Button variant="outline" size="sm">
            Add Free Bet
          </Button>
          <Button variant="outline" size="sm">
            Adjust Balance
          </Button>
          <Button variant="destructive" size="sm">
            Suspend Account
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

// Transactions Tab
function TransactionsTab({ transactions }: { transactions: Transaction[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Transaction History</CardTitle>
        <CardDescription>{transactions.length} transactions</CardDescription>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <p className="py-8 text-center text-sm text-foreground/60">
            No transactions
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between rounded-lg border border-border-muted bg-background-subtle px-3 py-2"
              >
                <div className="flex items-center gap-3">
                  {tx.type === 'deposit' ||
                  tx.type === 'win' ||
                  tx.type === 'bonus_credit' ? (
                    <ArrowDownLeft className="size-5 text-success" />
                  ) : (
                    <ArrowUpRight className="size-5 text-destructive" />
                  )}
                  <div>
                    <p className="text-sm font-medium">
                      {TRANSACTION_TYPE_LABELS[tx.type]}
                    </p>
                    <p className="text-xs text-foreground/60">
                      {new Date(tx.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`font-medium ${
                      tx.type === 'deposit' ||
                      tx.type === 'win' ||
                      tx.type === 'bonus_credit'
                        ? 'text-success'
                        : 'text-destructive'
                    }`}
                  >
                    {tx.type === 'deposit' ||
                    tx.type === 'win' ||
                    tx.type === 'bonus_credit'
                      ? '+'
                      : '-'}
                    €{Math.abs(tx.amount).toFixed(2)}
                  </p>
                  <p className="text-xs text-foreground/60">
                    Balance: €{tx.balance_after.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Activity Tab
function ActivityTab({
  bets,
  sessions,
}: {
  bets: Bet[]
  sessions: GameSession[]
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Bets</CardTitle>
          <CardDescription>{bets.length} bets</CardDescription>
        </CardHeader>
        <CardContent>
          {bets.length === 0 ? (
            <p className="py-8 text-center text-sm text-foreground/60">No bets</p>
          ) : (
            <div className="flex flex-col gap-2">
              {bets.slice(0, 20).map((bet) => (
                <div
                  key={bet.id}
                  className="flex items-center justify-between rounded-lg border border-border-muted bg-background-subtle px-3 py-2"
                >
                  <div>
                    <p className="text-sm font-medium">{bet.game_id ?? 'Unknown'}</p>
                    <p className="text-xs text-foreground/60">
                      {new Date(bet.placed_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">€{bet.stake.toFixed(2)}</span>
                    <Badge
                      variant={
                        bet.outcome === 'win'
                          ? 'success'
                          : bet.outcome === 'loss'
                            ? 'destructive'
                            : 'outline'
                      }
                    >
                      {bet.outcome}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Game Sessions</CardTitle>
          <CardDescription>{sessions.length} sessions</CardDescription>
        </CardHeader>
        <CardContent>
          {sessions.length === 0 ? (
            <p className="py-8 text-center text-sm text-foreground/60">
              No sessions
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {sessions.slice(0, 15).map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between rounded-lg border border-border-muted bg-background-subtle px-3 py-2"
                >
                  <div>
                    <p className="text-sm font-medium">
                      {session.game_name ?? session.game_id}
                    </p>
                    <p className="text-xs text-foreground/60">
                      {new Date(session.started_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right text-xs">
                    <p>{session.bet_count} bets</p>
                    <p className="text-foreground/60">
                      €{session.total_bets.toFixed(2)} wagered
                    </p>
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

// KYC Tab
function KycTab({
  kyc,
  playerId,
  onUpdate,
}: {
  kyc: KycStatus | null
  playerId: string
  onUpdate: () => void
}) {
  const [newLevel, setNewLevel] = useState(kyc?.level ?? 'none')
  const [saving, setSaving] = useState(false)

  async function handleUpdateKyc() {
    setSaving(true)
    await updatePlayerKyc(playerId, {
      level: newLevel,
      verified_at: newLevel !== 'none' ? new Date().toISOString() : undefined,
    })
    setSaving(false)
    onUpdate()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Identity Verification</CardTitle>
        <CardDescription>
          Current level: {KYC_LEVEL_LABELS[kyc?.level ?? 'none']}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex flex-col gap-1.5">
            <Label>Update KYC Level</Label>
            <Select
              value={newLevel}
              onValueChange={(v) => setNewLevel(v as typeof newLevel)}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Not Started</SelectItem>
                <SelectItem value="basic">Basic</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="enhanced">Enhanced</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleUpdateKyc} disabled={saving}>
            {saving ? 'Saving...' : 'Update'}
          </Button>
        </div>

        {kyc?.documents_submitted && kyc.documents_submitted.length > 0 && (
          <div>
            <p className="mb-2 text-sm font-medium">Submitted Documents</p>
            <div className="flex flex-col gap-2">
              {kyc.documents_submitted.map((doc, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg bg-background-subtle px-3 py-2"
                >
                  <span className="text-sm">{doc.type}</span>
                  <span className="text-xs text-foreground/60">
                    {new Date(doc.uploaded_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {kyc?.notes && (
          <div>
            <p className="mb-1 text-sm font-medium">Notes</p>
            <p className="text-sm text-foreground/70">{kyc.notes}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// RG Tab
function RgTab({ controls }: { controls: ResponsibleGaming[] }) {
  const active = controls.filter((c) => c.is_active)
  const history = controls.filter((c) => !c.is_active)

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Shield className="size-5" />
            Active Controls
          </CardTitle>
        </CardHeader>
        <CardContent>
          {active.length === 0 ? (
            <p className="py-4 text-sm text-foreground/60">
              No active responsible gaming controls
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {active.map((control) => (
                <div
                  key={control.id}
                  className="flex items-center justify-between rounded-lg border border-warning/30 bg-warning/5 px-4 py-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="size-4 text-warning" />
                      <p className="font-medium">
                        {RG_CONTROL_LABELS[control.control_type]}
                      </p>
                    </div>
                    {control.limit_value && (
                      <p className="mt-1 text-sm">
                        €{control.limit_value} / {LIMIT_PERIOD_LABELS[control.limit_period!]}
                      </p>
                    )}
                    {control.product !== 'all' && (
                      <p className="text-sm text-foreground/70">
                        Product: {RG_PRODUCT_LABELS[control.product]}
                      </p>
                    )}
                  </div>
                  <div className="text-right text-xs text-foreground/60">
                    <p>Set {new Date(control.created_at).toLocaleDateString()}</p>
                    {control.ends_at && (
                      <p>Until {new Date(control.ends_at).toLocaleDateString()}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {history.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              {history.map((control) => (
                <div
                  key={control.id}
                  className="flex items-center justify-between rounded-lg border border-border-muted bg-background-subtle px-3 py-2 opacity-60"
                >
                  <p className="text-sm">{RG_CONTROL_LABELS[control.control_type]}</p>
                  <p className="text-xs text-foreground/60">
                    {new Date(control.created_at).toLocaleDateString()} —{' '}
                    {control.cancelled_at
                      ? new Date(control.cancelled_at).toLocaleDateString()
                      : 'N/A'}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// Notes Tab
function NotesTab({
  notes,
  playerId,
  user,
  onAdd,
}: {
  notes: PlayerNote[]
  playerId: string
  user: { id: string; email?: string | null } | null
  onAdd: () => void
}) {
  const [content, setContent] = useState('')
  const [saving, setSaving] = useState(false)

  async function handleAddNote() {
    if (!content.trim() || !user) return
    setSaving(true)
    await createPlayerNote(playerId, user.id, user.email ?? '', content)
    setContent('')
    setSaving(false)
    onAdd()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <FileText className="size-5" />
          Internal Notes
        </CardTitle>
        <CardDescription>
          Notes are only visible to CMS users
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Add a note about this player..."
            rows={3}
          />
          <Button
            onClick={handleAddNote}
            disabled={saving || !content.trim()}
            className="w-fit"
          >
            {saving ? 'Adding...' : 'Add Note'}
          </Button>
        </div>

        {notes.length === 0 ? (
          <p className="py-4 text-sm text-foreground/60">No notes yet</p>
        ) : (
          <div className="flex flex-col gap-3">
            {notes.map((note) => (
              <div
                key={note.id}
                className={`rounded-lg border px-4 py-3 ${
                  note.is_important
                    ? 'border-warning/30 bg-warning/5'
                    : 'border-border-muted bg-background-subtle'
                }`}
              >
                <div className="flex items-center justify-between text-xs text-foreground/60">
                  <span>{note.author_email ?? 'Unknown'}</span>
                  <span>{new Date(note.created_at).toLocaleString()}</span>
                </div>
                <p className="mt-1 text-sm whitespace-pre-wrap">{note.content}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Tier Management Card
function TierManagementCard({
  player,
  onUpdate,
}: {
  player: PlayerSummary
  onUpdate: () => void
}) {
  const [selectedTier, setSelectedTier] = useState<PlayerTier>(player.tier)
  const [saving, setSaving] = useState(false)

  const calculatedTier = calculateTier(player.total_deposits, player.bet_count)
  const isAtCalculatedTier = player.tier === calculatedTier && !player.tier_override

  async function handleSetTier() {
    if (selectedTier === player.tier) return
    setSaving(true)
    await setPlayerTier(player.id, selectedTier, true)
    setSaving(false)
    onUpdate()
  }

  async function handleResetTier() {
    setSaving(true)
    await clearTierOverride(player.id)
    setSaving(false)
    onUpdate()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Crown className="size-5" />
          Player Tier
        </CardTitle>
        <CardDescription>
          Manage this player's loyalty tier
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <span
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-lg font-semibold"
            style={{ backgroundColor: `${TIER_COLORS[player.tier]}20`, color: TIER_COLORS[player.tier] }}
          >
            <Crown className="size-5" />
            {PLAYER_TIER_LABELS[player.tier]}
          </span>
          {player.tier_override && (
            <Badge variant="outline">Manual Override</Badge>
          )}
        </div>

        <div className="rounded-lg border border-border-muted bg-background-subtle p-3 text-sm">
          <p className="font-medium">Tier Progress</p>
          <div className="mt-2 grid gap-1.5 text-xs text-foreground/70">
            <div className="flex justify-between">
              <span>Total Deposits</span>
              <span className="font-medium">€{player.total_deposits.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Bets</span>
              <span className="font-medium">{player.bet_count}</span>
            </div>
            <div className="mt-1 flex justify-between border-t border-border-muted pt-1.5">
              <span>Calculated Tier</span>
              <span
                className="font-medium"
                style={{ color: TIER_COLORS[calculatedTier] }}
              >
                {PLAYER_TIER_LABELS[calculatedTier]}
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-border-muted p-3">
          <p className="mb-2 text-sm font-medium">Tier Thresholds</p>
          <div className="flex flex-col gap-1 text-xs">
            {PLAYER_TIERS.map((tier) => (
              <div
                key={tier}
                className={`flex items-center justify-between rounded px-2 py-1 ${
                  tier === player.tier ? 'bg-primary/10' : ''
                }`}
              >
                <span className="flex items-center gap-2">
                  <Crown className="size-3" style={{ color: TIER_COLORS[tier] }} />
                  {PLAYER_TIER_LABELS[tier]}
                </span>
                <span className="text-foreground/60">
                  €{TIER_THRESHOLDS[tier].minDeposits} / {TIER_THRESHOLDS[tier].minBets} bets
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-border-muted pt-4">
          <Label className="text-sm">Override Tier</Label>
          <div className="mt-2 flex gap-2">
            <Select
              value={selectedTier}
              onValueChange={(v) => setSelectedTier(v as PlayerTier)}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PLAYER_TIERS.map((tier) => (
                  <SelectItem key={tier} value={tier}>
                    <span className="flex items-center gap-2">
                      <Crown className="size-3" style={{ color: TIER_COLORS[tier] }} />
                      {PLAYER_TIER_LABELS[tier]}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              onClick={handleSetTier}
              disabled={saving || selectedTier === player.tier}
              size="sm"
            >
              {saving ? 'Saving...' : 'Set Tier'}
            </Button>
            {player.tier_override && (
              <Button
                onClick={handleResetTier}
                disabled={saving}
                variant="outline"
                size="sm"
              >
                <RotateCcw className="mr-1 size-4" />
                Auto-calculate
              </Button>
            )}
          </div>
          {!isAtCalculatedTier && !player.tier_override && (
            <p className="mt-2 text-xs text-foreground/60">
              Tier will auto-update when the player's activity changes.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
