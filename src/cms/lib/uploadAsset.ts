import type { AssetKind } from '@/cms/lib/assetLimits'
import { CMS_PASSCODE } from '@/cms/lib/storage'

export type UploadResult = {
  ok: true
  url: string
  key: string
  contentType: string
  bytes: number
}

export type UploadError = {
  ok: false
  error: string
}

export async function uploadCmsAsset(input: {
  file: File
  kind: AssetKind
  tenantId?: string
  brand?: string
  slot?: string
  secret?: string
}): Promise<UploadResult | UploadError> {
  const form = new FormData()
  form.set('file', input.file)
  form.set('kind', input.kind)
  form.set('tenantId', input.tenantId ?? 'blixx-gaming')
  form.set('brand', input.brand ?? 'shared')
  form.set('slot', input.slot ?? 'asset')

  try {
    const res = await fetch('/api/cms/upload', {
      method: 'POST',
      headers: {
        'x-cms-upload-secret': input.secret ?? CMS_PASSCODE,
      },
      body: form,
    })
    const data = (await res.json()) as UploadResult | UploadError
    if (!res.ok || !data.ok) {
      return {
        ok: false,
        error:
          !data.ok && 'error' in data
            ? data.error
            : `Upload failed (HTTP ${res.status})`,
      }
    }
    return data
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'Upload failed',
    }
  }
}
