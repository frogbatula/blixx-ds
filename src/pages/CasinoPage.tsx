import { useTranslation } from 'react-i18next'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export function CasinoPage() {
  const { t } = useTranslation()
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('pages.casino')}</CardTitle>
        <CardDescription>{t('pages.casinoBody')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {['Slots', 'Live', 'Table', 'Jackpots', 'New', 'Popular'].map(
            (name) => (
              <div
                key={name}
                className="flex h-28 items-end rounded-xl bg-background-subtle p-4 text-sm font-medium"
              >
                {name}
              </div>
            ),
          )}
        </div>
      </CardContent>
    </Card>
  )
}
