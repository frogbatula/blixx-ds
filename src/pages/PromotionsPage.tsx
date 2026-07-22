import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ChevronRight } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
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
      {useCms && promos[0] ? (
        <Link to={`/promotions/${promos[0].slug || promos[0].id}`}>
          <HeroBanner
            size="lg"
            headingLevel="h1"
            title={promos[0].title}
            description={promos[0].subtitle}
            imageSrc={resolveUrl(promos[0])}
            imageAlt={promos[0].title}
            eyebrow={<Badge variant="success">Featured</Badge>}
            actions={
              <Button variant="secondary" size="sm" className="gap-1">
                View details
                <ChevronRight className="size-4" />
              </Button>
            }
          />
        </Link>
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
          <CardTitle>
            {useCms ? 'All Promotions' : t('pages.promotions')}
          </CardTitle>
          <CardDescription>
            {useCms
              ? `${promos.length} active ${promos.length === 1 ? 'promotion' : 'promotions'}`
              : t('pages.promotionsBody')}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {useCms
            ? promos.map((promo) => (
                <Link
                  key={promo.id}
                  to={`/promotions/${promo.slug || promo.id}`}
                  className="group flex items-center justify-between rounded-xl border border-border-muted bg-background-subtle px-4 py-3 transition-colors hover:border-primary/30 hover:bg-primary/5"
                >
                  <div className="flex items-center gap-3">
                    {resolveUrl(promo) && (
                      <img
                        src={resolveUrl(promo)}
                        alt=""
                        className="size-12 rounded-lg object-cover"
                      />
                    )}
                    <div>
                      <span className="font-medium group-hover:text-primary">
                        {promo.title}
                      </span>
                      {promo.subtitle && (
                        <p className="text-sm text-foreground/60">
                          {promo.subtitle}
                        </p>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="size-5 text-foreground/40 transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                </Link>
              ))
            : FALLBACK.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-xl border border-border-muted bg-background-subtle px-4 py-3"
                >
                  <div>
                    <span className="font-medium">{item.title}</span>
                    {item.subtitle && (
                      <p className="text-sm text-foreground/60">
                        {item.subtitle}
                      </p>
                    )}
                  </div>
                  <Badge variant="outline">Mock</Badge>
                </div>
              ))}
        </CardContent>
      </Card>
    </div>
  )
}
