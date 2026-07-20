import { useTranslation } from 'react-i18next'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export function PromotionsPage() {
  const { t } = useTranslation()
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('pages.promotions')}</CardTitle>
        <CardDescription>{t('pages.promotionsBody')}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {['Welcome bonus', 'Reload', 'Cashback'].map((title) => (
          <div
            key={title}
            className="flex items-center justify-between rounded-xl border border-border-muted bg-background-subtle px-4 py-3"
          >
            <span className="font-medium">{title}</span>
            <Badge variant="success">Mock</Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
