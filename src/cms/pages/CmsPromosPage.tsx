import { useCallback, useState } from 'react'
import { Plus, Pencil, Trash2, GripVertical, Calendar } from 'lucide-react'
import { useCmsStore } from '@/cms/CmsProvider'
import { saveDraft } from '@/cms/lib/storage'
import type { PromoItem } from '@/cms/lib/types'
import { AssetPicker } from '@/cms/components/AssetPicker'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

type PromoFormData = {
  title: string
  subtitle: string
  body: string
  bannerAssetId?: string
  bannerUrl?: string
  active: boolean
  startDate: string
  endDate: string
}

const emptyForm: PromoFormData = {
  title: '',
  subtitle: '',
  body: '',
  bannerAssetId: undefined,
  bannerUrl: undefined,
  active: true,
  startDate: '',
  endDate: '',
}

function PromoForm({
  data,
  onChange,
}: {
  data: PromoFormData
  onChange: (data: PromoFormData) => void
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="promo-title">Title *</Label>
        <Input
          id="promo-title"
          value={data.title}
          onChange={(e) => onChange({ ...data, title: e.target.value })}
          placeholder="Welcome Bonus"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="promo-subtitle">Subtitle</Label>
        <Input
          id="promo-subtitle"
          value={data.subtitle}
          onChange={(e) => onChange({ ...data, subtitle: e.target.value })}
          placeholder="Get 100% up to €500"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="promo-body">Body text</Label>
        <Textarea
          id="promo-body"
          value={data.body}
          onChange={(e) => onChange({ ...data, body: e.target.value })}
          placeholder="Promotional details, terms summary, or placeholder text..."
          rows={4}
        />
        <p className="text-xs text-foreground/55">
          Placeholder for now — can be made editable via CMS later.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="promo-start">Start date</Label>
          <Input
            id="promo-start"
            type="date"
            value={data.startDate}
            onChange={(e) => onChange({ ...data, startDate: e.target.value })}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="promo-end">End date</Label>
          <Input
            id="promo-end"
            type="date"
            value={data.endDate}
            onChange={(e) => onChange({ ...data, endDate: e.target.value })}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Banner image</Label>
        <AssetPicker
          kind="banner"
          value={data.bannerAssetId}
          onChange={(assetId, url) =>
            onChange({ ...data, bannerAssetId: assetId, bannerUrl: url })
          }
        />
      </div>

      <div className="flex items-center gap-3">
        <Switch
          id="promo-active"
          checked={data.active}
          onCheckedChange={(checked) => onChange({ ...data, active: checked })}
        />
        <Label htmlFor="promo-active">Active (visible on site)</Label>
      </div>
    </div>
  )
}

function PromoListItem({
  promo,
  bannerUrl,
  onEdit,
  onDelete,
}: {
  promo: PromoItem
  bannerUrl?: string
  onEdit: () => void
  onDelete: () => void
}) {
  const formatDate = (d?: string) => {
    if (!d) return null
    return new Date(d).toLocaleDateString()
  }

  return (
    <div className="flex items-center gap-3 rounded-xl border border-border-muted bg-card p-3">
      <GripVertical className="size-4 shrink-0 cursor-grab text-foreground/30" />
      {bannerUrl ? (
        <img
          src={bannerUrl}
          alt={promo.title}
          className="h-14 w-24 shrink-0 rounded-lg object-cover bg-background-subtle"
        />
      ) : (
        <div className="flex h-14 w-24 shrink-0 items-center justify-center rounded-lg bg-background-subtle text-xs text-foreground/40">
          No banner
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate font-medium">{promo.title}</p>
          {!promo.active && <Badge variant="outline">Inactive</Badge>}
        </div>
        {promo.subtitle && (
          <p className="truncate text-sm text-foreground/55">{promo.subtitle}</p>
        )}
        {(promo.startDate || promo.endDate) && (
          <div className="mt-1 flex items-center gap-1 text-xs text-foreground/50">
            <Calendar className="size-3" />
            {formatDate(promo.startDate)} – {formatDate(promo.endDate) || '∞'}
          </div>
        )}
      </div>
      <div className="flex shrink-0 gap-1">
        <Button
          type="button"
          size="icon"
          variant="ghost"
          aria-label="Edit promo"
          onClick={onEdit}
        >
          <Pencil className="size-4" />
        </Button>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          aria-label="Delete promo"
          onClick={onDelete}
        >
          <Trash2 className="size-4" />
        </Button>
      </div>
    </div>
  )
}

export function CmsPromosPage() {
  const { doc, setDoc } = useCmsStore()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<PromoFormData>(emptyForm)
  const [status, setStatus] = useState<string | null>(null)

  const promos = doc.promos ?? []

  const persist = useCallback(
    (next: typeof doc) => {
      setDoc(next)
      saveDraft(next)
    },
    [setDoc],
  )

  const resolveUrl = (promo: PromoItem): string | undefined => {
    if (promo.bannerUrl) return promo.bannerUrl
    if (promo.bannerAssetId) {
      const asset = doc.assets?.find((a) => a.id === promo.bannerAssetId)
      return asset?.url
    }
    return undefined
  }

  const openNew = () => {
    setEditingId(null)
    setFormData(emptyForm)
    setDialogOpen(true)
  }

  const openEdit = (promo: PromoItem) => {
    setEditingId(promo.id)
    setFormData({
      title: promo.title,
      subtitle: promo.subtitle ?? '',
      body: promo.body ?? '',
      bannerAssetId: promo.bannerAssetId,
      bannerUrl: promo.bannerUrl,
      active: promo.active,
      startDate: promo.startDate ?? '',
      endDate: promo.endDate ?? '',
    })
    setDialogOpen(true)
  }

  const handleSave = () => {
    if (!formData.title.trim()) return

    const now = new Date().toISOString()

    if (editingId) {
      const updated = promos.map((p) =>
        p.id === editingId
          ? {
              ...p,
              title: formData.title.trim(),
              slug: slugify(formData.title),
              subtitle: formData.subtitle.trim() || undefined,
              body: formData.body.trim() || undefined,
              bannerAssetId: formData.bannerAssetId,
              bannerUrl: formData.bannerUrl,
              active: formData.active,
              startDate: formData.startDate || undefined,
              endDate: formData.endDate || undefined,
              updatedAt: now,
            }
          : p,
      )
      persist({ ...doc, promos: updated })
      setStatus('Promo updated.')
    } else {
      const newPromo: PromoItem = {
        id: crypto.randomUUID(),
        slug: slugify(formData.title),
        title: formData.title.trim(),
        subtitle: formData.subtitle.trim() || undefined,
        body: formData.body.trim() || undefined,
        bannerAssetId: formData.bannerAssetId,
        bannerUrl: formData.bannerUrl,
        active: formData.active,
        startDate: formData.startDate || undefined,
        endDate: formData.endDate || undefined,
        order: promos.length,
        createdAt: now,
        updatedAt: now,
      }
      persist({ ...doc, promos: [...promos, newPromo] })
      setStatus('Promo added.')
    }

    setDialogOpen(false)
    setFormData(emptyForm)
    setEditingId(null)
  }

  const handleDelete = (id: string) => {
    persist({ ...doc, promos: promos.filter((p) => p.id !== id) })
    setStatus('Promo deleted.')
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Promotions</h1>
          <p className="mt-1 text-sm text-foreground/70">
            Manage promotional content. Add banners, titles, and placeholder
            text.
          </p>
        </div>
        <Button type="button" onClick={openNew}>
          <Plus className="size-4" />
          Add promo
        </Button>
      </div>

      {status && (
        <p className="rounded-xl border border-border-muted bg-background-subtle px-3 py-2 text-xs text-foreground/75">
          {status}
        </p>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Promotions ({promos.length})
          </CardTitle>
          <CardDescription>
            Active promos appear on the Promotions page with their banners.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {promos.length === 0 ? (
            <p className="text-sm text-foreground/60">
              No promotions yet. Click "Add promo" to create one.
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {promos.map((promo) => (
                <PromoListItem
                  key={promo.id}
                  promo={promo}
                  bannerUrl={resolveUrl(promo)}
                  onEdit={() => openEdit(promo)}
                  onDelete={() => handleDelete(promo.id)}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit promo' : 'Add promo'}</DialogTitle>
            <DialogDescription>
              {editingId
                ? 'Update promotion details and save.'
                : 'Create a new promotion with banner and details.'}
            </DialogDescription>
          </DialogHeader>
          <PromoForm data={formData} onChange={setFormData} />
          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              disabled={!formData.title.trim()}
            >
              {editingId ? 'Save changes' : 'Add promo'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
