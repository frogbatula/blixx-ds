import { useTranslation } from 'react-i18next'
import { useAuth } from '@/app/AuthProvider'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export function ProfilePage() {
  const { t } = useTranslation()
  const { isLoggedIn, user, login, logout } = useAuth()

  if (isLoggedIn && user) {
    return (
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center gap-2">
            <CardTitle>{t('pages.profileLoggedInTitle')}</CardTitle>
            <Badge variant="success">{t('auth.loggedIn')}</Badge>
          </div>
          <CardDescription>{t('pages.profileLoggedInBody')}</CardDescription>
        </CardHeader>
        <CardContent className="flex max-w-sm flex-col gap-4">
          <div className="rounded-xl bg-background-subtle px-4 py-3 text-sm">
            <p className="text-foreground/60">{t('header.account')}</p>
            <p className="font-semibold">{user.displayName}</p>
          </div>
          <Button type="button" variant="outline" onClick={logout}>
            {t('header.logout')}
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center gap-2">
          <CardTitle>{t('pages.profile')}</CardTitle>
          <Badge variant="outline">{t('auth.loggedOut')}</Badge>
        </div>
        <CardDescription>{t('pages.profileBody')}</CardDescription>
      </CardHeader>
      <CardContent className="flex max-w-sm flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="player@example.com" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" placeholder="••••••••" />
        </div>
        <Button type="button" onClick={login}>
          {t('header.login')}
        </Button>
        <p className="text-xs text-foreground/55">{t('auth.pocHint')}</p>
      </CardContent>
    </Card>
  )
}
