import { Link } from 'react-router-dom'
import { useCmsStore } from '@/cms/CmsProvider'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export function CmsDashboardPage() {
  const { doc, context } = useCmsStore()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-sm text-foreground/70">
          Multi-tenant HubHQ for {doc.name}. Edits inherit from
          tenant defaults down to brand, country, and locale.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Editing context</CardTitle>
            <CardDescription>Active scope from the context bar</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Badge>{context.brand ?? 'tenant default'}</Badge>
            <Badge variant="secondary">{context.country ?? 'all countries'}</Badge>
            <Badge variant="outline">{context.locale}</Badge>
            <Badge variant="info">
              {context.theme} / {context.colorMode}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Brands</CardTitle>
            <CardDescription>{doc.brands.length} under this tenant</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {doc.brands.map((b) => (
              <Badge key={b.id} variant="secondary">
                {b.label}
              </Badge>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Layers</CardTitle>
            <CardDescription>Sparse overrides in the content store</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-foreground/80">
            <p>{doc.messageLayers.length} message layers</p>
            <p>{doc.tokenLayers.length} token layers</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button asChild>
          <Link to="/cms/copy">Edit copy</Link>
        </Button>
        <Button asChild variant="secondary">
          <Link to="/cms/tokens">Edit tokens</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/cms/publish">Publish locales</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Inheritance demo</CardTitle>
          <CardDescription>
            Tenant default sets <code className="text-xs">welcome.cta</code> to
            “Play Now”. Kanuuna + FI + fi-FI overrides to “Pelaa nyt”.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-foreground/75">
          Switch brand/country/language in the context bar, then open Copy to
          see inherited vs overridden values.
        </CardContent>
      </Card>
    </div>
  )
}
