import { useState, type FormEvent } from 'react'
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
import { CMS_PASSCODE, setCmsAuthenticated } from '@/cms/lib/storage'

export function CmsLogin({ onSuccess }: { onSuccess: () => void }) {
  const [passcode, setPasscode] = useState('')
  const [error, setError] = useState(false)

  function submit(e: FormEvent) {
    e.preventDefault()
    if (passcode === CMS_PASSCODE) {
      setCmsAuthenticated(true)
      onSuccess()
      return
    }
    setError(true)
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-backdrop p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>HubHQ</CardTitle>
          <CardDescription>
            POC gate — passcode for Content team access.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-4" onSubmit={submit}>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="cms-pass">Passcode</Label>
              <Input
                id="cms-pass"
                type="password"
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value)
                  setError(false)
                }}
                autoComplete="current-password"
              />
              {error ? (
                <p className="text-xs text-destructive">Incorrect passcode</p>
              ) : (
                <p className="text-xs text-foreground/50">Hint: blixx</p>
              )}
            </div>
            <Button type="submit">Enter</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
