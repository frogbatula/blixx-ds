import { useTranslation } from 'react-i18next'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { HeroBanner } from '@/components/ui/hero-banner'
import { useTenantDocument } from '@/cms/lib/useTenantDocument'

const FALLBACK = ['Welcome bonus', 'Reload', 'Cashback']

export function PromotionsPage() {
  const { t } = useTranslation()
  const { doc } = useTenantDocument()
  const banners = (doc.assets ?? []).filter((a) => a.kind === 'banner')

  return (
    <div className="flex flex-col gap-6">
      {banners.length > 0 ? (
        <div className="flex flex-col gap-4">
          {banners.map((banner, index) => (
            <HeroBanner
              key={banner.id}
              size={index === 0 ? 'lg' : 'md'}
              headingLevel={index === 0 ? 'h1' : 'h2'}
              title={banner.label || banner.alt}
              imageSrc={banner.url}
              imageAlt={banner.alt}
              eyebrow={<Badge variant="success">Live</Badge>}
            />
          ))}
        </div>
      ) : (
        <HeroBanner
          size="lg"
          headingLevel="h1"
          title={t('pages.promotions')}
          description={t('pages.promotionsBody')}
          eyebrow={<Badge variant="outline">Mock</Badge>}
        />
      )}

      <Card>
        <CardHeader>
          <CardTitle>{t('pages.promotions')}</CardTitle>
          <CardDescription>{t('pages.promotionsBody')}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {(banners.length > 0
            ? banners.map((b) => b.label || b.alt)
            : FALLBACK
          ).map((title) => (
            <div
              key={title}
              className="flex items-center justify-between rounded-xl border border-border-muted bg-background-subtle px-4 py-3"
            >
              <span className="font-medium">{title}</span>
              <Badge variant="success">
                {banners.length > 0 ? 'Live' : 'Mock'}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
