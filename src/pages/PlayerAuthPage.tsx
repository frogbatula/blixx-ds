import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { usePlayerAuth } from '@/lib/player-auth'
import { usePreferences } from '@/app/PreferencesProvider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Phone, KeyRound, ArrowLeft } from 'lucide-react'

type Step = 'phone' | 'otp'

export function PlayerAuthPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { requestOtp, verifyOtp } = usePlayerAuth()
  const { brand, brandLabel } = usePreferences()
  
  const [step, setStep] = useState<Step>('phone')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [mockCode, setMockCode] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const redirectTo = searchParams.get('redirect') || '/account'

  async function handlePhoneSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!phone.trim()) return

    setLoading(true)
    setError(null)

    const result = await requestOtp(phone)

    if (result.error) {
      setError(result.error)
      setLoading(false)
      return
    }

    // In mock mode, show the code
    setMockCode(result.code)
    setStep('otp')
    setLoading(false)
  }

  async function handleOtpSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!otp.trim()) return

    setLoading(true)
    setError(null)

    const result = await verifyOtp(phone, otp, { brand })

    if (result.error) {
      setError(result.error)
      setLoading(false)
      return
    }

    // Success - redirect
    navigate(redirectTo, { replace: true })
  }

  function handleBack() {
    setStep('phone')
    setOtp('')
    setMockCode(null)
    setError(null)
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">
            {step === 'phone' ? 'Sign In or Register' : 'Enter Code'}
          </CardTitle>
          <CardDescription>
            {step === 'phone'
              ? `Enter your phone number to continue on ${brandLabel}`
              : `We sent a code to ${phone}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 'phone' ? (
            <form onSubmit={handlePhoneSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="size-4" />
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+358 40 123 4567"
                  required
                  autoComplete="tel"
                  autoFocus
                />
                <p className="text-xs text-foreground/50">
                  Finnish numbers can omit country code
                </p>
              </div>

              {error && (
                <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {error}
                </p>
              )}

              <Button type="submit" disabled={loading} size="lg">
                {loading ? 'Sending code...' : 'Continue'}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleOtpSubmit} className="flex flex-col gap-4">
              <button
                type="button"
                onClick={handleBack}
                className="flex items-center gap-1 text-sm text-foreground/60 hover:text-foreground"
              >
                <ArrowLeft className="size-4" />
                Change number
              </button>

              {mockCode && (
                <div className="rounded-lg border border-primary/30 bg-primary/5 p-3 text-center">
                  <p className="text-xs text-foreground/60 uppercase tracking-wide">
                    Demo Mode - Your Code
                  </p>
                  <p className="mt-1 font-mono text-2xl font-bold tracking-widest text-primary">
                    {mockCode}
                  </p>
                  <Badge variant="outline" className="mt-2">
                    In production, this is sent via SMS
                  </Badge>
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="otp" className="flex items-center gap-2">
                  <KeyRound className="size-4" />
                  Verification Code
                </Label>
                <Input
                  id="otp"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="123456"
                  required
                  autoComplete="one-time-code"
                  autoFocus
                  className="text-center font-mono text-lg tracking-widest"
                />
              </div>

              {error && (
                <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {error}
                </p>
              )}

              <Button type="submit" disabled={loading || otp.length < 6} size="lg">
                {loading ? 'Verifying...' : 'Verify & Continue'}
              </Button>

              <button
                type="button"
                onClick={handlePhoneSubmit}
                disabled={loading}
                className="text-sm text-foreground/60 hover:text-foreground"
              >
                Resend code
              </button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
