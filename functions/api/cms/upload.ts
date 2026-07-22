/**
 * Cloudflare Pages Function — POST /api/cms/upload
 * Bindings: ASSETS (R2). Secrets: CMS_UPLOAD_SECRET, R2_PUBLIC_BASE_URL
 */
import {
  extForMime,
  validateUploadMeta,
} from '../../src/cms/lib/assetLimits'

type R2BucketLike = {
  put: (
    key: string,
    value: ArrayBuffer,
    options?: { httpMetadata?: { contentType?: string } },
  ) => Promise<unknown>
}

type UploadEnv = {
  ASSETS?: R2BucketLike
  CMS_UPLOAD_SECRET?: string
  R2_PUBLIC_BASE_URL?: string
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

export async function onRequestPost(context: {
  request: Request
  env: UploadEnv
}): Promise<Response> {
  const secret = context.env.CMS_UPLOAD_SECRET || 'blixx'
  const auth = context.request.headers.get('x-cms-upload-secret')
  if (auth !== secret) {
    return json({ ok: false, error: 'Unauthorized' }, 401)
  }

  if (!context.env.ASSETS) {
    return json(
      {
        ok: false,
        error:
          'R2 binding ASSETS missing. Configure wrangler.toml and set R2_PUBLIC_BASE_URL.',
      },
      503,
    )
  }

  let form: FormData
  try {
    form = await context.request.formData()
  } catch {
    return json({ ok: false, error: 'Expected multipart form data' }, 400)
  }

  const file = form.get('file')
  const kindRaw = String(form.get('kind') ?? '')
  const tenantId = String(form.get('tenantId') ?? 'blixx-gaming')
  const brand = String(form.get('brand') ?? 'shared')
  const slot = String(form.get('slot') ?? 'asset')

  if (!(file instanceof File)) {
    return json({ ok: false, error: 'Missing file field' }, 400)
  }

  const mime = file.type || 'application/octet-stream'
  const bytes = file.size
  const checked = validateUploadMeta({ kind: kindRaw, mime, bytes })
  if (!checked.ok) {
    return json({ ok: false, error: checked.error }, 400)
  }

  const ext = extForMime(mime)
  const id = crypto.randomUUID()
  const key = `${tenantId}/${checked.kind}/${brand}/${slot}/${id}.${ext}`
  const body = await file.arrayBuffer()

  await context.env.ASSETS.put(key, body, {
    httpMetadata: { contentType: mime },
  })

  const base = (context.env.R2_PUBLIC_BASE_URL || '').replace(/\/$/, '')
  const url = base ? `${base}/${key}` : `/${key}`

  return json({
    ok: true,
    url,
    key,
    contentType: mime,
    bytes,
  })
}
