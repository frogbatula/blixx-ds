import { useCallback, useEffect, useState } from 'react'
import { usePlayerAuth } from '@/lib/player-auth'
import {
  getPlayerWallets,
  getPlayerTransactions,
  createTransaction,
  updateWalletBalance,
  recalculatePlayerTier,
} from '@/lib/player-db'
import type { Wallet, Transaction } from '@/lib/player-types'
import { TRANSACTION_TYPE_LABELS } from '@/lib/player-types'
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { ArrowDownLeft, ArrowUpRight, Wallet as WalletIcon, Gift } from 'lucide-react'

export function WalletPage() {
  const { player } = usePlayerAuth()
  const [wallets, setWallets] = useState<Wallet[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  const loadData = useCallback(async () => {
    if (!player) return
    const [w, t] = await Promise.all([
      getPlayerWallets(player.id),
      getPlayerTransactions(player.id, 20),
    ])
    setWallets(w)
    setTransactions(t)
    setLoading(false)
  }, [player])

  useEffect(() => {
    void loadData()
  }, [loadData])

  const realWallet = wallets.find((w) => w.type === 'real_money')
  const bonusWallet = wallets.find((w) => w.type === 'bonus')

  if (loading) {
    return (
      <div className="flex min-h-[30vh] items-center justify-center">
        <p className="text-sm text-foreground/60">Loading wallet...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Wallet Cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <WalletIcon className="size-5" />
              Real Money
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              €{realWallet?.balance.toFixed(2) ?? '0.00'}
            </p>
            <div className="mt-4 flex gap-2">
              <MockDepositDialog
                wallet={realWallet}
                playerId={player?.id}
                onSuccess={loadData}
              />
              <MockWithdrawDialog
                wallet={realWallet}
                playerId={player?.id}
                onSuccess={loadData}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Gift className="size-5" />
              Bonus Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              €{bonusWallet?.balance.toFixed(2) ?? '0.00'}
            </p>
            {(bonusWallet?.locked_balance ?? 0) > 0 && (
              <p className="mt-2 text-sm text-foreground/60">
                €{bonusWallet?.locked_balance.toFixed(2)} wagering requirement remaining
              </p>
            )}
            <Badge variant="outline" className="mt-4">
              Bonus funds cannot be withdrawn
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Transaction History</CardTitle>
          <CardDescription>Your recent deposits, withdrawals, and bets</CardDescription>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <p className="py-8 text-center text-sm text-foreground/60">
              No transactions yet
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between rounded-lg border border-border-muted bg-background-subtle px-3 py-2"
                >
                  <div className="flex items-center gap-3">
                    {tx.type === 'deposit' || tx.type === 'win' || tx.type === 'bonus_credit' ? (
                      <ArrowDownLeft className="size-5 text-success" />
                    ) : (
                      <ArrowUpRight className="size-5 text-destructive" />
                    )}
                    <div className="flex flex-col gap-0.5">
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
                        tx.type === 'deposit' || tx.type === 'win' || tx.type === 'bonus_credit'
                          ? 'text-success'
                          : 'text-destructive'
                      }`}
                    >
                      {tx.type === 'deposit' || tx.type === 'win' || tx.type === 'bonus_credit'
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
    </div>
  )
}

// Mock Deposit Dialog
function MockDepositDialog({
  wallet,
  playerId,
  onSuccess,
}: {
  wallet?: Wallet
  playerId?: string
  onSuccess: () => void
}) {
  const [open, setOpen] = useState(false)
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleDeposit() {
    if (!wallet || !playerId || !amount) return
    const depositAmount = parseFloat(amount)
    if (isNaN(depositAmount) || depositAmount <= 0) return

    setLoading(true)
    const newBalance = wallet.balance + depositAmount

    await createTransaction(playerId, wallet.id, 'deposit', depositAmount, wallet.balance, newBalance, {
      description: 'Mock deposit',
    })
    await updateWalletBalance(wallet.id, newBalance)
    await recalculatePlayerTier(playerId)

    setLoading(false)
    setAmount('')
    setOpen(false)
    onSuccess()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <ArrowDownLeft className="mr-1 size-4" />
          Deposit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Deposit Funds</DialogTitle>
          <DialogDescription>
            This is a mock deposit for demo purposes. In production, this would connect
            to a payment provider.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="amount">Amount (€)</Label>
            <Input
              id="amount"
              type="number"
              min="1"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="100.00"
            />
          </div>
          <div className="flex gap-2">
            {[10, 25, 50, 100].map((preset) => (
              <Button
                key={preset}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setAmount(preset.toString())}
              >
                €{preset}
              </Button>
            ))}
          </div>
          <Button onClick={handleDeposit} disabled={loading || !amount}>
            {loading ? 'Processing...' : `Deposit €${amount || '0'}`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Mock Withdraw Dialog
function MockWithdrawDialog({
  wallet,
  playerId,
  onSuccess,
}: {
  wallet?: Wallet
  playerId?: string
  onSuccess: () => void
}) {
  const [open, setOpen] = useState(false)
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleWithdraw() {
    if (!wallet || !playerId || !amount) return
    const withdrawAmount = parseFloat(amount)
    if (isNaN(withdrawAmount) || withdrawAmount <= 0) return

    if (withdrawAmount > wallet.balance) {
      setError('Insufficient funds')
      return
    }

    setLoading(true)
    setError(null)
    const newBalance = wallet.balance - withdrawAmount

    await createTransaction(playerId, wallet.id, 'withdrawal', withdrawAmount, wallet.balance, newBalance, {
      description: 'Mock withdrawal',
    })
    await updateWalletBalance(wallet.id, newBalance)

    setLoading(false)
    setAmount('')
    setOpen(false)
    onSuccess()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <ArrowUpRight className="mr-1 size-4" />
          Withdraw
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Withdraw Funds</DialogTitle>
          <DialogDescription>
            Available balance: €{wallet?.balance.toFixed(2) ?? '0.00'}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="withdraw-amount">Amount (€)</Label>
            <Input
              id="withdraw-amount"
              type="number"
              min="1"
              step="0.01"
              max={wallet?.balance}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="50.00"
            />
          </div>
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
          <Button onClick={handleWithdraw} disabled={loading || !amount}>
            {loading ? 'Processing...' : `Withdraw €${amount || '0'}`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
