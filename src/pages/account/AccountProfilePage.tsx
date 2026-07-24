import { useEffect, useState } from 'react'
import { usePlayerAuth } from '@/lib/player-auth'
import { getPlayerKyc, updatePlayer, updatePlayerKyc } from '@/lib/player-db'
import type { KycStatus } from '@/lib/player-types'
import { KYC_LEVEL_LABELS } from '@/lib/player-types'
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
import { User, Shield, CheckCircle2, AlertCircle, Upload } from 'lucide-react'

export function AccountProfilePage() {
  const { player, refreshPlayer, logout } = usePlayerAuth()
  const [kyc, setKyc] = useState<KycStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState<string | null>(null)

  // Form state
  const [displayName, setDisplayName] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('')

  useEffect(() => {
    if (!player) return

    // Populate form
    setDisplayName(player.display_name ?? '')
    setFirstName(player.first_name ?? '')
    setLastName(player.last_name ?? '')
    setEmail(player.email ?? '')
    setDateOfBirth(player.date_of_birth ?? '')

    // Load KYC
    getPlayerKyc(player.id).then((k) => {
      setKyc(k)
      setLoading(false)
    })
  }, [player])

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault()
    if (!player) return

    setSaving(true)
    setStatus(null)

    const success = await updatePlayer(player.id, {
      display_name: displayName || null,
      first_name: firstName || null,
      last_name: lastName || null,
      email: email || null,
      date_of_birth: dateOfBirth || null,
    })

    if (success) {
      setStatus('Profile updated successfully')
      await refreshPlayer()
    } else {
      setStatus('Failed to update profile')
    }

    setSaving(false)
  }

  async function handleMockKycUpgrade() {
    if (!player) return
    setSaving(true)

    // Simulate KYC verification
    await updatePlayerKyc(player.id, {
      level: 'verified',
      verified_at: new Date().toISOString(),
    })

    const k = await getPlayerKyc(player.id)
    setKyc(k)
    setStatus('KYC status updated (mock)')
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="flex min-h-[30vh] items-center justify-center">
        <p className="text-sm text-foreground/60">Loading profile...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Profile Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <User className="size-5" />
            Profile Information
          </CardTitle>
          <CardDescription>Update your personal details</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveProfile} className="flex flex-col gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={player?.phone ?? ''}
                  disabled
                  className="bg-background-subtle"
                />
                <p className="text-xs text-foreground/50">
                  Phone number cannot be changed
                </p>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="email">Email (optional)</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="displayName">Display Name</Label>
                <Input
                  id="displayName"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Your nickname"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="dob">Date of Birth</Label>
                <Input
                  id="dob"
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="John"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Doe"
                />
              </div>
            </div>

            {status && (
              <p
                className={`rounded-lg px-3 py-2 text-sm ${
                  status.includes('Failed')
                    ? 'bg-destructive/10 text-destructive'
                    : 'bg-primary/10 text-primary'
                }`}
              >
                {status}
              </p>
            )}

            <Button type="submit" disabled={saving} className="w-fit">
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* KYC Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Shield className="size-5" />
            Identity Verification (KYC)
          </CardTitle>
          <CardDescription>
            Verify your identity to unlock higher limits
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              {kyc?.level === 'verified' || kyc?.level === 'enhanced' ? (
                <CheckCircle2 className="size-8 text-success" />
              ) : (
                <AlertCircle className="size-8 text-warning" />
              )}
              <div>
                <p className="font-medium">
                  Status: {KYC_LEVEL_LABELS[kyc?.level ?? 'none']}
                </p>
                {kyc?.verified_at && (
                  <p className="text-sm text-foreground/60">
                    Verified on {new Date(kyc.verified_at).toLocaleDateString()}
                  </p>
                )}
              </div>
              <Badge
                variant={
                  kyc?.level === 'verified' || kyc?.level === 'enhanced'
                    ? 'success'
                    : kyc?.level === 'basic'
                      ? 'warning'
                      : 'outline'
                }
                className="ml-auto"
              >
                {KYC_LEVEL_LABELS[kyc?.level ?? 'none']}
              </Badge>
            </div>

            {kyc?.level !== 'verified' && kyc?.level !== 'enhanced' && (
              <div className="rounded-lg border border-border-muted bg-background-subtle p-4">
                <p className="mb-3 text-sm">
                  Upload documents to verify your identity and unlock higher deposit
                  and withdrawal limits.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" disabled={saving}>
                    <Upload className="mr-1 size-4" />
                    Upload ID
                  </Button>
                  <Button variant="outline" disabled={saving}>
                    <Upload className="mr-1 size-4" />
                    Upload Proof of Address
                  </Button>
                </div>
                <div className="mt-3 border-t border-border-muted pt-3">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleMockKycUpgrade}
                    disabled={saving}
                  >
                    Mock: Verify Now (Demo)
                  </Button>
                </div>
              </div>
            )}

            {kyc?.documents_submitted && kyc.documents_submitted.length > 0 && (
              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium">Submitted Documents</p>
                {kyc.documents_submitted.map((doc, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-lg bg-background-subtle px-3 py-2 text-sm"
                  >
                    <span>{doc.type}</span>
                    <span className="text-foreground/60">
                      {new Date(doc.uploaded_at).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Account Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Account</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={logout}>
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
