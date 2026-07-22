import { useMemo } from 'react'
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
import type { PromoItem } from '@/cms/lib/types'

const FALLBACK = [
  { id: 'f1', title: 'Welcome bonus', subtitle: 'Get started with a match bonus' },
  { id: 'f2', title: 'Reload', subtitle: 'Weekly deposit boost' },
  { id: 'f3', title: 'Cashback', subtitle: 'Get back a percentage of losses' },
]

export function PromotionsPage() {
  const { t } = useTranslation()
  const { doc } = useTenantDocument()

  const assetMap = useMemo(
    () => new Map((doc.assets ?? []).map((a) => [a.id, a.url])),
    [doc.assets],
  )

  const resolveUrl = (promo: PromoItem): string | undefined => {
    if (promo.bannerUrl) return promo.bannerUrl
    if (promo.bannerAssetId) return assetMap.get(promo.bannerAssetId)
    return undefined
  }

  const promos = (doc.promos ?? []).filter((p) => p.active)
  const useCms = promos.length > 0

  return (
    <div className="flex flex-col gap-6">
      {useCms ? (
        <div className="flex flex-col gap-4">
          {promos.map((promo, index) => (
            <HeroBanner
              key={promo.id}
              size={index === 0 ? 'lg' : 'md'}
              headingLevel={index === 0 ? 'h1' : 'h2'}
              title={promo.title}
              description={promo.subtitle}
              imageSrc={resolveUrl(promo)}
              imageAlt={promo.title}
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
          {(useCms ? promos : FALLBACK).map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-xl border border-border-muted bg-background-subtle px-4 py-3"
            >
              <div>
                <span className="font-medium">{item.title}</span>
                {item.subtitle && (
                  <p className="text-sm text-foreground/60">{item.subtitle}</p>
                )}
              </div>
              <Badge variant={useCms ? 'success' : 'outline'}>
                {useCms ? 'Live' : 'Mock'}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
