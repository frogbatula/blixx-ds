import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { brands, themes, colorModes } from '@/brands/types'
import { brandLabels } from '@/brands/types'

export function DocsOverviewPage() {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col gap-6">
      <section className="prose-invert max-w-none space-y-3 text-sm leading-relaxed text-foreground/80">
        <p>{t('docs.overview.intro')}</p>
        <p>{t('docs.overview.architecture')}</p>
      </section>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t('docs.overview.brandsTitle')}</CardTitle>
            <CardDescription>{t('docs.overview.brandsBody')}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {brands.map((b) => (
              <Badge key={b} variant="secondary">
                {brandLabels[b]}
              </Badge>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t('docs.overview.themesTitle')}</CardTitle>
            <CardDescription>{t('docs.overview.themesBody')}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {themes.map((th) => (
              <Badge key={th} variant="outline">
                {th}
              </Badge>
            ))}
            {colorModes.map((m) => (
              <Badge key={m}>{m}</Badge>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t('docs.overview.breakpointTitle')}</CardTitle>
            <CardDescription>
              {t('docs.overview.breakpointBody')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <code className="rounded-lg bg-background-subtle px-2 py-1 font-mono text-xs">
              xl ≥ 1280px
            </code>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t('docs.overview.tokensTitle')}</CardTitle>
            <CardDescription>{t('docs.overview.tokensBody')}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild size="sm">
              <Link to="/docs/tokens">{t('docs.nav.tokens')}</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
