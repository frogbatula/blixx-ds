import { useCallback, useState } from 'react'
import { useDropzone, type FileRejection } from 'react-dropzone'
import { ImagePlus, X, Check } from 'lucide-react'
import { useCmsStore } from '@/cms/CmsProvider'
import { uploadCmsAsset } from '@/cms/lib/uploadAsset'
import type { TenantAsset, AssetKind } from '@/cms/lib/types'
import { MAX_BYTES, acceptForKind, formatBytes } from '@/cms/lib/assetLimits'
import { saveDraft } from '@/cms/lib/storage'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export type AssetPickerProps = {
  kind: AssetKind
  value?: string
  onChange: (assetId: string | undefined, url: string | undefined) => void
  className?: string
}

export function AssetPicker({
  kind,
  value,
  onChange,
  className,
}: AssetPickerProps) {
  const { doc, setDoc } = useCmsStore()
  const [mode, setMode] = useState<'library' | 'upload'>('library')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const assets = (doc.assets ?? []).filter((a) => a.kind === kind)
  const selectedAsset = assets.find((a) => a.id === value)

  const maxSize = MAX_BYTES[kind]
  const accept = acceptForKind(kind)

  const pushAsset = useCallback(
    (asset: TenantAsset) => {
      const list = doc.assets ?? []
      const next = { ...doc, assets: [asset, ...list] }
      setDoc(next)
      saveDraft(next)
    },
    [doc, setDoc],
  )

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
        const result = await uploadCmsAsset({ file, kind })
        if (!result.ok) {
          setError(result.error)
          return
        }
        const newAsset: TenantAsset = {
          id: crypto.randomUUID(),
          kind,
          url: result.url,
          key: result.key,
          alt: file.name,
          label: file.name,
          updatedAt: new Date().toISOString(),
        }
        pushAsset(newAsset)
        onChange(newAsset.id, newAsset.url)
        setMode('library')
      } finally {
        setBusy(false)
      }
    },
    [kind, onChange, pushAsset],
  )

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop,
      accept,
      maxSize,
      maxFiles: 1,
      multiple: false,
      disabled: busy,
    })

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <div className="flex gap-2">
        <Button
          type="button"
          size="sm"
          variant={mode === 'library' ? 'secondary' : 'ghost'}
          onClick={() => setMode('library')}
        >
          Library ({assets.length})
        </Button>
        <Button
          type="button"
          size="sm"
          variant={mode === 'upload' ? 'secondary' : 'ghost'}
          onClick={() => setMode('upload')}
        >
          Upload new
        </Button>
        {value && (
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => onChange(undefined, undefined)}
          >
            <X className="size-4" />
            Clear
          </Button>
        )}
      </div>

      {mode === 'library' ? (
        <div className="flex flex-col gap-2">
          {assets.length === 0 ? (
            <p className="text-sm text-foreground/60">
              No {kind === 'game-tile' ? 'game tiles' : 'banners'} in library.
              Upload one first.
            </p>
          ) : (
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
              {assets.map((asset) => (
                <button
                  key={asset.id}
                  type="button"
                  onClick={() => onChange(asset.id, asset.url)}
                  className={cn(
                    'relative aspect-[4/3] overflow-hidden rounded-lg border-2 transition-all hover:ring-2 hover:ring-primary/50',
                    value === asset.id
                      ? 'border-primary ring-2 ring-primary/30'
                      : 'border-border-muted',
                  )}
                >
                  <img
                    src={asset.url}
                    alt={asset.alt}
                    className="h-full w-full object-cover"
                  />
                  {value === asset.id && (
                    <div className="absolute inset-0 flex items-center justify-center bg-primary/20">
                      <Check className="size-6 text-primary" />
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-1.5">
                    <p className="truncate text-[10px] text-white">
                      {asset.label || asset.alt}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <div
            {...getRootProps()}
            className={cn(
              'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed px-4 py-8 text-center text-sm transition-colors',
              isDragReject
                ? 'border-destructive bg-destructive/10'
                : isDragActive
                  ? 'border-primary bg-primary/10'
                  : 'border-border-muted bg-background-subtle hover:bg-background-muted',
              busy && 'pointer-events-none opacity-60',
            )}
          >
            <input {...getInputProps()} />
            <ImagePlus className="size-6 text-foreground/50" />
            <p className="font-medium">
              {busy ? 'Uploading…' : 'Drop an image here, or click to browse'}
            </p>
            <p className="text-xs text-foreground/60">
              Max {formatBytes(maxSize)} ·{' '}
              {Object.values(accept).flat().join(', ')}
            </p>
          </div>
          {error && (
            <p className="text-xs text-destructive" role="alert">
              {error}
            </p>
          )}
        </div>
      )}

      {selectedAsset && (
        <div className="flex items-center gap-3 rounded-xl border border-border-muted bg-background-subtle p-2">
          <img
            src={selectedAsset.url}
            alt={selectedAsset.alt}
            className="size-12 rounded-lg object-cover"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">
              {selectedAsset.label || selectedAsset.alt}
            </p>
            <p className="text-xs text-foreground/55">Selected</p>
          </div>
        </div>
      )}
    </div>
  )
}
