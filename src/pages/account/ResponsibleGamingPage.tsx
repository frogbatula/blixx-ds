import { useCallback, useEffect, useState } from 'react'
import { usePlayerAuth } from '@/lib/player-auth'
import { getPlayerRgControls, createRgControl, cancelRgControl } from '@/lib/player-db'
import type { ResponsibleGaming, RgProduct, LimitPeriod } from '@/lib/player-types'
import { RG_CONTROL_LABELS, RG_PRODUCT_LABELS, LIMIT_PERIOD_LABELS } from '@/lib/player-types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Shield, Clock, AlertTriangle, X } from 'lucide-react'

export function ResponsibleGamingPage() {
  const { player, logout } = usePlayerAuth()
  const [controls, setControls] = useState<ResponsibleGaming[]>([])
  const [allControls, setAllControls] = useState<ResponsibleGaming[]>([])
  const [loading, setLoading] = useState(true)

  const loadControls = useCallback(async () => {
    if (!player) return
    const [active, all] = await Promise.all([
      getPlayerRgControls(player.id, true),
      getPlayerRgControls(player.id, false),
    ])
    setControls(active)
    setAllControls(all)
    setLoading(false)
  }, [player])

  useEffect(() => {
    void loadControls()
  }, [loadControls])

  const hasActiveBreak = controls.some(
    (c) => c.control_type === 'full_break' || c.control_type === 'account_closure',
  )

  if (loading) {
    return (
      <div className="flex min-h-[30vh] items-center justify-center">
        <p className="text-sm text-foreground/60">Loading...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Info Card */}
      <Card className="border-primary/30 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Shield className="size-5 text-primary" />
            Responsible Gaming
          </CardTitle>
          <CardDescription>
            We're committed to responsible gaming. Use these tools to stay in control.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-foreground/70">
          <p>
            Gambling should be fun and entertaining. If you feel you're losing control,
            these tools can help you set limits or take a break.
          </p>
        </CardContent>
      </Card>

      {/* Active Controls */}
      {controls.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Active Controls</CardTitle>
            <CardDescription>Your current responsible gaming settings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              {controls.map((control) => (
                <ActiveControlCard
                  key={control.id}
                  control={control}
                  onCancel={loadControls}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Set Limits */}
      {!hasActiveBreak && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Set Limits</CardTitle>
            <CardDescription>
              Control how much you deposit or lose over time
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <SetLimitDialog
              type="deposit_limit"
              playerId={player?.id}
              onSuccess={loadControls}
            />
            <SetLimitDialog
              type="loss_limit"
              playerId={player?.id}
              onSuccess={loadControls}
            />
          </CardContent>
        </Card>
      )}

      {/* Take a Break */}
      {!hasActiveBreak && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Take a Break</CardTitle>
            <CardDescription>
              Temporarily block yourself from specific products or the entire site
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <TakeBreakDialog
              type="product_break"
              playerId={player?.id}
              onSuccess={loadControls}
            />
            <TakeBreakDialog
              type="full_break"
              playerId={player?.id}
              onSuccess={() => {
                loadControls()
                logout()
              }}
            />
          </CardContent>
        </Card>
      )}

      {/* Self-Exclusion */}
      {!hasActiveBreak && (
        <Card className="border-destructive/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base text-destructive">
              <AlertTriangle className="size-5" />
              Self-Exclusion
            </CardTitle>
            <CardDescription>
              Permanently close your account. This cannot be undone.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SelfExclusionDialog
              playerId={player?.id}
              onSuccess={() => {
                loadControls()
                logout()
              }}
            />
          </CardContent>
        </Card>
      )}

      {/* History */}
      {allControls.length > controls.length && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">History</CardTitle>
            <CardDescription>Previous responsible gaming controls</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              {allControls
                .filter((c) => !c.is_active)
                .map((control) => (
                  <div
                    key={control.id}
                    className="flex items-center justify-between rounded-lg border border-border-muted bg-background-subtle px-3 py-2 opacity-60"
                  >
                    <div className="flex flex-col gap-0.5">
                      <p className="text-sm font-medium">
                        {RG_CONTROL_LABELS[control.control_type]}
                      </p>
                      <p className="text-xs text-foreground/60">
                        {new Date(control.created_at).toLocaleDateString()} —{' '}
                        {control.cancelled_at
                          ? new Date(control.cancelled_at).toLocaleDateString()
                          : 'N/A'}
                      </p>
                    </div>
                    <Badge variant="outline">Ended</Badge>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function ActiveControlCard({
  control,
  onCancel,
}: {
  control: ResponsibleGaming
  onCancel: () => void
}) {
  const [cancelling, setCancelling] = useState(false)

  const canCancel =
    control.control_type === 'deposit_limit' ||
    control.control_type === 'loss_limit' ||
    control.control_type === 'session_limit'

  async function handleCancel() {
    setCancelling(true)
    await cancelRgControl(control.id, 'Cancelled by player')
    setCancelling(false)
    onCancel()
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-primary/30 bg-primary/5 px-4 py-3">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <Shield className="size-4 text-primary" />
          <p className="font-medium">{RG_CONTROL_LABELS[control.control_type]}</p>
        </div>
        {control.limit_value && (
          <p className="text-sm">
            €{control.limit_value.toFixed(2)} / {LIMIT_PERIOD_LABELS[control.limit_period!]}
          </p>
        )}
        {control.product !== 'all' && (
          <p className="text-sm text-foreground/70">
            Product: {RG_PRODUCT_LABELS[control.product]}
          </p>
        )}
        <p className="flex items-center gap-1 text-xs text-foreground/60">
          <Clock className="size-3" />
          {control.ends_at
            ? `Until ${new Date(control.ends_at).toLocaleDateString()}`
            : 'Indefinite'}
        </p>
      </div>
      {canCancel && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="sm" disabled={cancelling}>
              <X className="mr-1 size-4" />
              Remove
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Remove this limit?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to remove this {RG_CONTROL_LABELS[control.control_type].toLowerCase()}?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleCancel}>
                Yes, remove limit
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  )
}

function SetLimitDialog({
  type,
  playerId,
  onSuccess,
}: {
  type: 'deposit_limit' | 'loss_limit'
  playerId?: string
  onSuccess: () => void
}) {
  const [open, setOpen] = useState(false)
  const [amount, setAmount] = useState('')
  const [period, setPeriod] = useState<LimitPeriod>('weekly')
  const [loading, setLoading] = useState(false)

  async function handleSubmit() {
    if (!playerId || !amount) return
    const value = parseFloat(amount)
    if (isNaN(value) || value <= 0) return

    setLoading(true)
    await createRgControl(playerId, type, {
      limitValue: value,
      limitPeriod: period,
    })
    setLoading(false)
    setAmount('')
    setOpen(false)
    onSuccess()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          Set {type === 'deposit_limit' ? 'Deposit' : 'Loss'} Limit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Set {type === 'deposit_limit' ? 'Deposit' : 'Loss'} Limit
          </DialogTitle>
          <DialogDescription>
            {type === 'deposit_limit'
              ? 'Limit how much you can deposit in a given period.'
              : 'Limit how much you can lose in a given period.'}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label>Amount (€)</Label>
            <Input
              type="number"
              min="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="100"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Period</Label>
            <Select value={period} onValueChange={(v) => setPeriod(v as LimitPeriod)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleSubmit} disabled={loading || !amount}>
            {loading ? 'Setting...' : 'Set Limit'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function TakeBreakDialog({
  type,
  playerId,
  onSuccess,
}: {
  type: 'product_break' | 'full_break'
  playerId?: string
  onSuccess: () => void
}) {
  const [open, setOpen] = useState(false)
  const [product, setProduct] = useState<RgProduct>('casino')
  const [duration, setDuration] = useState<string>('7')
  const [loading, setLoading] = useState(false)

  async function handleSubmit() {
    if (!playerId) return

    setLoading(true)
    const days = parseInt(duration)
    const endsAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString()

    await createRgControl(playerId, type, {
      product: type === 'product_break' ? product : 'all',
      endsAt,
    })
    setLoading(false)
    setOpen(false)
    onSuccess()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={type === 'full_break' ? 'destructive' : 'outline'}>
          {type === 'product_break' ? 'Product Break' : 'Take Full Break'}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {type === 'product_break' ? 'Product Break' : 'Take a Full Break'}
          </DialogTitle>
          <DialogDescription>
            {type === 'product_break'
              ? 'Block yourself from a specific product for a period of time.'
              : 'Block yourself from the entire site for a period of time.'}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          {type === 'product_break' && (
            <div className="flex flex-col gap-1.5">
              <Label>Product</Label>
              <Select value={product} onValueChange={(v) => setProduct(v as RgProduct)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="casino">Casino</SelectItem>
                  <SelectItem value="sports">Sports</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          <div className="flex flex-col gap-1.5">
            <Label>Duration</Label>
            <Select value={duration} onValueChange={setDuration}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 day</SelectItem>
                <SelectItem value="7">1 week</SelectItem>
                <SelectItem value="30">1 month</SelectItem>
                <SelectItem value="90">3 months</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            variant={type === 'full_break' ? 'destructive' : 'primary'}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Confirm Break'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function SelfExclusionDialog({
  playerId,
  onSuccess,
}: {
  playerId?: string
  onSuccess: () => void
}) {
  const [loading, setLoading] = useState(false)

  async function handleSubmit() {
    if (!playerId) return

    setLoading(true)
    await createRgControl(playerId, 'account_closure', {
      reason: 'Self-exclusion requested by player',
    })
    setLoading(false)
    onSuccess()
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Close My Account</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently close your account. You will not be able to log in
            or play any games. This action cannot be undone. Any remaining balance
            will need to be withdrawn first.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleSubmit}
            disabled={loading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {loading ? 'Closing...' : 'Yes, close my account'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
