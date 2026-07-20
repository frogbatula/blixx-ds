import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export function DocsComponentsPage() {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col gap-8">
      <p className="text-sm text-foreground/75">{t('docs.components.intro')}</p>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">Button</h2>
        <p className="text-sm text-foreground/65">{t('docs.components.button')}</p>
        <div className="flex flex-wrap gap-2">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="tertiary">Tertiary</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
        </div>
      </section>

      <Separator />

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">Badge</h2>
        <div className="flex flex-wrap gap-2">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="info">Info</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="outline">Outline</Badge>
        </div>
      </section>

      <Separator />

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">Input</h2>
        <div className="flex max-w-sm flex-col gap-1.5">
          <Label htmlFor="docs-input">Label</Label>
          <Input id="docs-input" placeholder="Placeholder" />
        </div>
      </section>

      <Separator />

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">Card</h2>
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Card title</CardTitle>
            <CardDescription>Card description</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-foreground/80">
            Card body using surface tokens.
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
