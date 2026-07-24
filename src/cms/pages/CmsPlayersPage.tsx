import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getPlayerSummaries, getTierStatistics } from '@/lib/player-db'
import type { PlayerSummary, PlayerStatus, KycLevel, PlayerTier } from '@/lib/player-types'
import {
  PLAYER_STATUS_LABELS,
  KYC_LEVEL_LABELS,
  PLAYER_TIER_LABELS,
  PLAYER_TIERS,
  TIER_COLORS,
} from '@/lib/player-types'
import { brands, brandLabels, type Brand } from '@/brands/types'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Users, Search, ChevronRight, Phone, Mail, Shield, Crown } from 'lucide-react'

export function CmsPlayersPage() {
  const [players, setPlayers] = useState<PlayerSummary[]>([])
  const [tierStats, setTierStats] = useState<Record<PlayerTier, number> | null>(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [kycFilter, setKycFilter] = useState<string>('all')
  const [tierFilter, setTierFilter] = useState<string>('all')
  const [brandFilter, setBrandFilter] = useState<string>('all')

  const loadPlayers = useCallback(async () => {
    setLoading(true)
    const [data, stats] = await Promise.all([
      getPlayerSummaries(100, 0, {
        status: statusFilter !== 'all' ? statusFilter : undefined,
        kycLevel: kycFilter !== 'all' ? kycFilter : undefined,
        tier: tierFilter !== 'all' ? tierFilter : undefined,
        brand: brandFilter !== 'all' ? brandFilter : undefined,
        search: search || undefined,
      }),
      getTierStatistics(),
    ])
    setPlayers(data)
    setTierStats(stats)
    setLoading(false)
  }, [search, statusFilter, kycFilter, tierFilter, brandFilter])

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadPlayers()
    }, 300)
    return () => clearTimeout(timer)
  }, [loadPlayers])

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Players</h1>
        <p className="mt-1 max-w-2xl text-sm text-foreground/70">
          View and manage registered players on the site.
        </p>
      </div>

      {/* Tier Stats */}
      {tierStats && (
        <div className="grid grid-cols-5 gap-3">
          {PLAYER_TIERS.map((tier) => (
            <button
              key={tier}
              onClick={() => setTierFilter(tierFilter === tier ? 'all' : tier)}
              className={`flex flex-col items-center gap-1 rounded-xl border p-3 transition-colors ${
                tierFilter === tier
                  ? 'border-primary bg-primary/10'
                  : 'border-border-muted bg-background-subtle hover:bg-background-muted'
              }`}
            >
              <Crown
                className="size-5"
                style={{ color: TIER_COLORS[tier] }}
              />
              <span className="text-xs font-medium">{PLAYER_TIER_LABELS[tier]}</span>
              <span className="text-lg font-bold">{tierStats[tier]}</span>
            </button>
          ))}
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="flex flex-wrap gap-3 pt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-foreground/40" />
            <Input
              placeholder="Search by phone, email, or name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={brandFilter} onValueChange={setBrandFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Brand" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Brands</SelectItem>
              {brands.map((b) => (
                <SelectItem key={b} value={b}>
                  {brandLabels[b]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={tierFilter} onValueChange={setTierFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Tier" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tiers</SelectItem>
              {PLAYER_TIERS.map((tier) => (
                <SelectItem key={tier} value={tier}>
                  {PLAYER_TIER_LABELS[tier]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
              <SelectItem value="self_excluded">Self-Excluded</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
          <Select value={kycFilter} onValueChange={setKycFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="KYC Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All KYC</SelectItem>
              <SelectItem value="none">Not Started</SelectItem>
              <SelectItem value="basic">Basic</SelectItem>
              <SelectItem value="verified">Verified</SelectItem>
              <SelectItem value="enhanced">Enhanced</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Players List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Users className="size-5" />
            Players ({players.length})
          </CardTitle>
          <CardDescription>
            Click on a player to view full details
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-8 text-center text-sm text-foreground/60">
              Loading players...
            </div>
          ) : players.length === 0 ? (
            <div className="py-8 text-center text-sm text-foreground/60">
              No players found
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {players.map((player) => (
                <Link
                  key={player.id}
                  to={`/cms/players/${player.id}`}
                  className="group flex items-center justify-between rounded-xl border border-border-muted bg-background-subtle px-4 py-3 transition-colors hover:border-primary/30 hover:bg-primary/5"
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <TierBadge tier={player.tier} override={player.tier_override} />
                      <p className="font-medium">
                        {player.display_name || player.first_name
                          ? `${player.first_name ?? ''} ${player.last_name ?? ''}`.trim() ||
                            player.display_name
                          : 'Unnamed Player'}
                      </p>
                      <StatusBadge status={player.status} />
                      <KycBadge level={player.kyc_level} />
                      <BrandBadge
                        brand={player.last_brand ?? player.brand}
                        registrationBrand={player.brand}
                      />
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-foreground/60">
                      <span className="flex items-center gap-1">
                        <Phone className="size-3" />
                        {player.phone}
                      </span>
                      {player.email && (
                        <span className="flex items-center gap-1">
                          <Mail className="size-3" />
                          {player.email}
                        </span>
                      )}
                      <span>
                        Registered {new Date(player.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="hidden text-right sm:block">
                      <p className="text-sm font-medium">
                        €{player.real_balance.toFixed(2)}
                      </p>
                      <p className="text-xs text-foreground/60">
                        {player.bet_count} bets
                      </p>
                    </div>
                    {player.active_rg_controls > 0 && (
                      <Badge variant="warning" className="flex items-center gap-1">
                        <Shield className="size-3" />
                        RG
                      </Badge>
                    )}
                    <ChevronRight className="size-5 text-foreground/30 transition-colors group-hover:text-primary" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function StatusBadge({ status }: { status: PlayerStatus }) {
  const variant =
    status === 'active'
      ? 'success'
      : status === 'suspended'
        ? 'warning'
        : status === 'self_excluded' || status === 'closed'
          ? 'destructive'
          : 'outline'

  return (
    <Badge variant={variant} className="text-xs">
      {PLAYER_STATUS_LABELS[status]}
    </Badge>
  )
}

function KycBadge({ level }: { level: KycLevel }) {
  if (level === 'none') return null

  const variant =
    level === 'verified' || level === 'enhanced'
      ? 'success'
      : level === 'basic'
        ? 'warning'
        : 'outline'

  return (
    <Badge variant={variant} className="text-xs">
      KYC: {KYC_LEVEL_LABELS[level]}
    </Badge>
  )
}

function TierBadge({ tier, override }: { tier: PlayerTier; override?: boolean }) {
  return (
    <span
      className="flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs font-medium"
      style={{ backgroundColor: `${TIER_COLORS[tier]}20`, color: TIER_COLORS[tier] }}
    >
      <Crown className="size-3" />
      {PLAYER_TIER_LABELS[tier]}
      {override && <span className="opacity-60">*</span>}
    </span>
  )
}

function BrandBadge({
  brand,
  registrationBrand,
}: {
  brand?: Brand | null
  registrationBrand?: Brand | null
}) {
  if (!brand) return null
  const label = brandLabels[brand] ?? brand
  const switched =
    registrationBrand && registrationBrand !== brand
      ? ` · reg. ${brandLabels[registrationBrand]}`
      : ''

  return (
    <Badge variant="outline" className="text-xs">
      {label}
      {switched}
    </Badge>
  )
}
