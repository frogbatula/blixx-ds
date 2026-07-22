import { useMemo } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, Calendar } from 'lucide-react'
import { useTenantDocument } from '@/cms/lib/useTenantDocument'
import type { PromoItem } from '@/cms/lib/types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { HeroBanner } from '@/components/ui/hero-banner'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export function PromoDetailPage() {
  const { t } = useTranslation()
  const { promoId } = useParams<{ promoId: string }>()
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

  const promo = (doc.promos ?? []).find(
    (p) => p.id === promoId || p.slug === promoId,
  )

  if (!promo) {
    return <Navigate to="/promotions" replace />
  }

  const formatDate = (d?: string) => {
    if (!d) return null
    return new Date(d).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const bannerUrl = resolveUrl(promo)
  const hasDateRange = promo.startDate || promo.endDate

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Button asChild variant="ghost" size="sm" className="mb-4 gap-1.5">
          <Link to="/promotions">
            <ArrowLeft className="size-4" />
            {t('nav.promotions')}
          </Link>
        </Button>
      </div>

      <HeroBanner
        size="lg"
        headingLevel="h1"
        title={promo.title}
        description={promo.subtitle}
        imageSrc={bannerUrl}
        imageAlt={promo.title}
        eyebrow={
          <>
            {promo.active ? (
              <Badge variant="success">Active</Badge>
            ) : (
              <Badge variant="outline">Inactive</Badge>
            )}
            {hasDateRange && (
              <Badge variant="secondary" className="gap-1">
                <Calendar className="size-3" />
                {formatDate(promo.startDate)} – {formatDate(promo.endDate) || '∞'}
              </Badge>
            )}
          </>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Promotion Details</CardTitle>
          <CardDescription>
            Terms and conditions for this offer
          </CardDescription>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none text-foreground">
          {promo.body ? (
            <div className="whitespace-pre-wrap">{promo.body}</div>
          ) : (
            <p className="text-foreground/60 italic">
              No details provided yet. This content can be edited in the CMS
              under Promotions.
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>How to Claim</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2 text-sm text-foreground/80">
            <li>Log in to your account or register if you're new</li>
            <li>Navigate to the deposit page</li>
            <li>Enter the promotion code (if required)</li>
            <li>Complete your qualifying deposit</li>
            <li>Your bonus will be credited automatically</li>
          </ol>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/casino">Play Now</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/">Learn More</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
