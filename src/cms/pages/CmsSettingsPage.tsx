import { useCmsStore } from '@/cms/CmsProvider'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export function CmsSettingsPage() {
  const { doc } = useCmsStore()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Tenants & brands
        </h1>
        <p className="mt-1 text-sm text-foreground/70">
          POC shows a single tenant. A production CMS would manage multiple
          umbrella companies here.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{doc.name}</CardTitle>
          <CardDescription>tenantId: {doc.tenantId}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <p className="text-sm text-foreground/70">Brands</p>
          <div className="flex flex-wrap gap-2">
            {doc.brands.map((b) => (
              <Badge key={b.id} variant="secondary">
                {b.label} <span className="opacity-60">({b.id})</span>
              </Badge>
            ))}
          </div>
          <p className="text-xs text-foreground/50">
            Message layers: {doc.messageLayers.length} · Token layers:{' '}
            {doc.tokenLayers.length}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
