import { useCallback, useState } from 'react'
import { useDropzone, type FileRejection } from 'react-dropzone'
import { ImagePlus, Trash2 } from 'lucide-react'
import { useCmsStore } from '@/cms/CmsProvider'
import { uploadCmsAsset } from '@/cms/lib/uploadAsset'
import type { TenantAsset } from '@/cms/lib/types'
import {
  MAX_BYTES,
  acceptForKind,
  formatBytes,
  type AssetKind,
} from '@/cms/lib/assetLimits'
import { brands, brandLabels, type Brand } from '@/brands/types'
import { iconSlots, iconSlotById, type IconSlotId } from '@/icons/iconRegistry'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { saveDraft } from '@/cms/lib/storage'

function AssetDropzone({
  kind,
  brand,
  slot,
  disabled,
  onUploaded,
}: {
  kind: AssetKind
  brand?: string
  slot?: string
  disabled?: boolean
  onUploaded: (result: {
    url: string
    key: string
    contentType: string
    bytes: number
    fileName: string
  }) => void
}) {
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const maxSize = MAX_BYTES[kind]
  const accept = acceptForKind(kind)

  const onDrop = useCallback(
    async (accepted: File[], rejected: FileRejection[]) => {
      setError(null)
      if (rejected[0]) {
        setError(rejected[0].errors.map((e) => e.message).join('; '))
        return
      }
      const file = accepted[0]
      if (!file) return
      setBusy(true)
      try {
        const result = await uploadCmsAsset({
          file,
          kind,
          brand,
          slot,
        })
        if (!result.ok) {
          setError(result.error)
          return
        }
        onUploaded({
          url: result.url,
          key: result.key,
          contentType: result.contentType,
          bytes: result.bytes,
          fileName: file.name,
        })
      } finally {
        setBusy(false)
      }
    },
    [brand, kind, onUploaded, slot],
  )

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop,
      accept,
      maxSize,
      maxFiles: 1,
      multiple: false,
      disabled: disabled || busy,
    })

  return (
    <div className="flex flex-col gap-2">
      <div
        {...getRootProps()}
        className={[
          'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed px-4 py-8 text-center text-sm transition-colors',
          isDragReject
            ? 'border-destructive bg-destructive/10'
            : isDragActive
              ? 'border-primary bg-primary/10'
              : 'border-border-muted bg-background-subtle hover:bg-background-muted',
          disabled || busy ? 'pointer-events-none opacity-60' : '',
        ].join(' ')}
      >
        <input {...getInputProps()} />
        <ImagePlus className="size-6 text-foreground/50" />
        <p className="font-medium">
          {busy ? 'Uploading…' : 'Drop an image here, or click to browse'}
        </p>
        <p className="text-xs text-foreground/60">
          Max {formatBytes(maxSize)} ·{' '}
          {Object.values(accept)
            .flat()
            .join(', ')}
        </p>
      </div>
      {error ? (
        <p className="text-xs text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}

function AssetList({
  items,
  onRemove,
}: {
  items: TenantAsset[]
  onRemove: (id: string) => void
}) {
  if (items.length === 0) {
    return (
      <p className="text-sm text-foreground/60">No assets in this category yet.</p>
    )
  }
  return (
    <ul className="flex flex-col gap-3">
      {items.map((asset) => (
        <li
          key={asset.id}
          className="flex items-center gap-3 rounded-xl border border-border-muted bg-card p-3"
        >
          <img
            src={asset.url}
            alt={asset.alt}
            className="size-14 rounded-lg object-cover bg-background-subtle"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">
              {asset.label || asset.alt || asset.key}
            </p>
            <p className="truncate text-xs text-foreground/55">{asset.url}</p>
            {asset.slot || asset.brand ? (
              <p className="text-xs text-foreground/55">
                {[asset.brand, asset.slot].filter(Boolean).join(' · ')}
              </p>
            ) : null}
          </div>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            aria-label="Remove asset"
            onClick={() => onRemove(asset.id)}
          >
            <Trash2 className="size-4" />
          </Button>
        </li>
      ))}
    </ul>
  )
}

export function CmsAssetsPage() {
  const { doc, setDoc } = useCmsStore()
  const [bannerLabel, setBannerLabel] = useState('')
  const [bannerAlt, setBannerAlt] = useState('')
  const [tileLabel, setTileLabel] = useState('')
  const [tileSubtitle, setTileSubtitle] = useState('')
  const [tileAlt, setTileAlt] = useState('')
  const [iconBrand, setIconBrand] = useState<Brand>('kanuuna')
  const [iconSlot, setIconSlot] = useState<IconSlotId>('nav.profile')
  const [status, setStatus] = useState<string | null>(null)

  const banners = (doc.assets ?? []).filter((a) => a.kind === 'banner')
  const tiles = (doc.assets ?? []).filter((a) => a.kind === 'game-tile')
  const icons = (doc.assets ?? []).filter((a) => a.kind === 'icon')

  const persist = useCallback(
    (next: typeof doc) => {
      setDoc(next)
      saveDraft(next)
      setStatus('Saved to draft. Publish when ready to write seed files.')
    },
    [setDoc],
  )

  const pushAsset = useCallback(
    (asset: TenantAsset) => {
      const list = doc.assets ?? []
      let nextList = list
      if (asset.kind === 'icon' && asset.slot && asset.brand) {
        nextList = list.filter(
          (a) =>
            !(
              a.kind === 'icon' &&
              a.slot === asset.slot &&
              a.brand === asset.brand
            ),
        )
      }
      persist({ ...doc, assets: [asset, ...nextList] })
    },
    [doc, persist],
  )

  const removeAsset = useCallback(
    (id: string) => {
      persist({
        ...doc,
        assets: (doc.assets ?? []).filter((a) => a.id !== id),
      })
      setStatus('Asset removed from draft.')
    },
    [doc, persist],
  )

  const LucidePreview = iconSlotById[iconSlot].lucide


  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Assets</h1>
        <p className="mt-1 text-sm text-foreground/70">
          Upload banners, game tiles, and per-brand icon overrides. Lucide is
          the default when no brand override exists. Local{' '}
          <code className="text-xs">npm run dev</code> stores files under{' '}
          <code className="text-xs">/cms/uploads</code>; production uses R2.
        </p>
      </div>

      {status ? (
        <p className="rounded-xl border border-border-muted bg-background-subtle px-3 py-2 text-xs text-foreground/75">
          {status}
        </p>
      ) : null}

      <Tabs defaultValue="banners">
        <TabsList>
          <TabsTrigger value="banners">
            Banners <Badge variant="outline">{banners.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="tiles">
            Game tiles <Badge variant="outline">{tiles.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="icons">
            Brand icons <Badge variant="outline">{icons.length}</Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="banners" className="flex flex-col gap-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Upload banner</CardTitle>
              <CardDescription>
                JPEG / PNG / WebP · max {formatBytes(MAX_BYTES.banner)}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="banner-label">Label</Label>
                  <Input
                    id="banner-label"
                    value={bannerLabel}
                    onChange={(e) => setBannerLabel(e.target.value)}
                    placeholder="Welcome offer"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="banner-alt">Alt text</Label>
                  <Input
                    id="banner-alt"
                    value={bannerAlt}
                    onChange={(e) => setBannerAlt(e.target.value)}
                    placeholder="Promotional banner"
                  />
                </div>
              </div>
              <AssetDropzone
                kind="banner"
                onUploaded={({ url, key, fileName }) => {
                  pushAsset({
                    id: crypto.randomUUID(),
                    kind: 'banner',
                    url,
                    key,
                    alt: bannerAlt || fileName,
                    label: bannerLabel || fileName,
                    updatedAt: new Date().toISOString(),
                  })
                  setBannerLabel('')
                  setBannerAlt('')
                }}
              />
            </CardContent>
          </Card>
          <AssetList items={banners} onRemove={removeAsset} />
        </TabsContent>

        <TabsContent value="tiles" className="flex flex-col gap-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Upload game tile</CardTitle>
              <CardDescription>
                JPEG / PNG / WebP · max {formatBytes(MAX_BYTES['game-tile'])}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="tile-label">Label</Label>
                  <Input
                    id="tile-label"
                    value={tileLabel}
                    onChange={(e) => setTileLabel(e.target.value)}
                    placeholder="Starburst"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="tile-sub">Subtitle</Label>
                  <Input
                    id="tile-sub"
                    value={tileSubtitle}
                    onChange={(e) => setTileSubtitle(e.target.value)}
                    placeholder="NetEnt"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="tile-alt">Alt text</Label>
                  <Input
                    id="tile-alt"
                    value={tileAlt}
                    onChange={(e) => setTileAlt(e.target.value)}
                    placeholder="Game artwork"
                  />
                </div>
              </div>
              <AssetDropzone
                kind="game-tile"
                onUploaded={({ url, key, fileName }) => {
                  pushAsset({
                    id: crypto.randomUUID(),
                    kind: 'game-tile',
                    url,
                    key,
                    alt: tileAlt || fileName,
                    label: tileLabel || fileName,
                    subtitle: tileSubtitle || undefined,
                    updatedAt: new Date().toISOString(),
                  })
                  setTileLabel('')
                  setTileSubtitle('')
                  setTileAlt('')
                }}
              />
            </CardContent>
          </Card>
          <AssetList items={tiles} onRemove={removeAsset} />
        </TabsContent>

        <TabsContent value="icons" className="flex flex-col gap-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Brand icon override</CardTitle>
              <CardDescription>
                Upload a custom icon for one brand + slot. Other brands keep the
                Lucide default. SVG / PNG / JPEG / WebP · max{' '}
                {formatBytes(MAX_BYTES.icon)}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <Label>Brand</Label>
                  <Select
                    value={iconBrand}
                    onValueChange={(v) => setIconBrand(v as Brand)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {brands.map((b) => (
                        <SelectItem key={b} value={b}>
                          {brandLabels[b]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label>Icon slot</Label>
                  <Select
                    value={iconSlot}
                    onValueChange={(v) => setIconSlot(v as IconSlotId)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {iconSlots.map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-xl border border-border-muted bg-background-subtle px-4 py-3">
                <div className="flex flex-col items-center gap-1">
                  <span className="text-[10px] uppercase text-foreground/50">
                    Lucide default
                  </span>
                  <LucidePreview className="size-8" aria-hidden />
                </div>
                <p className="text-xs text-foreground/60">
                  Switch the site brand to {brandLabels[iconBrand]} in POC
                  controls to preview an override after upload.
                </p>
              </div>

              <AssetDropzone
                kind="icon"
                brand={iconBrand}
                slot={iconSlot}
                onUploaded={({ url, key, fileName }) => {
                  pushAsset({
                    id: crypto.randomUUID(),
                    kind: 'icon',
                    url,
                    key,
                    alt: fileName,
                    slot: iconSlot,
                    brand: iconBrand,
                    updatedAt: new Date().toISOString(),
                  })
                }}
              />
            </CardContent>
          </Card>
          <AssetList items={icons} onRemove={removeAsset} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
