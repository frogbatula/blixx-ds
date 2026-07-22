import type { Plugin } from 'vite'
import fs from 'node:fs'
import path from 'node:path'
import { randomUUID } from 'node:crypto'
import {
  extForMime,
  validateUploadMeta,
} from './src/cms/lib/assetLimits.ts'

export type CmsPublishPayload = {
  locales: Record<string, unknown>
  /** Optional full tenant document to persist as seed */
  tenantDocument?: unknown
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/** Deep-merge so publish fills/overrides keys but never drops missing ones. */
function deepMerge(
  base: Record<string, unknown>,
  overlay: Record<string, unknown>,
): Record<string, unknown> {
  const out: Record<string, unknown> = { ...base }
  for (const [key, value] of Object.entries(overlay)) {
    if (isPlainObject(value) && isPlainObject(out[key])) {
      out[key] = deepMerge(out[key] as Record<string, unknown>, value)
    } else {
      out[key] = value
    }
  }
  return out
}

function writeJson(file: string, data: unknown) {
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`, 'utf8')
}

function copyFile(from: string, to: string) {
  fs.mkdirSync(path.dirname(to), { recursive: true })
  fs.copyFileSync(from, to)
}

function sendJson(
  res: import('node:http').ServerResponse,
  status: number,
  data: unknown,
) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(data))
}

function readBody(req: import('node:http').IncomingMessage): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    req.on('data', (chunk: Buffer) => chunks.push(chunk))
    req.on('end', () => resolve(Buffer.concat(chunks)))
    req.on('error', reject)
  })
}

/**
 * Local-dev CMS endpoints:
 * - POST /api/cms/upload — store file under public/cms/uploads (R2 stand-in)
 * - POST /__cms/publish — merge resolved locales into src/i18n/locales (+ update seed)
 * - POST /__cms/restore-factory — copy immutable factory defaults back onto disk
 *
 * Never writes into src/cms/factory/ (backup stays pristine).
 */
export function cmsPublishPlugin(rootDir: string): Plugin {
  return {
    name: 'blixx-cms-publish',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url?.split('?')[0] ?? ''

        if (url === '/__cms/restore-factory' && req.method === 'POST') {
          try {
            const factoryDir = path.join(rootDir, 'src/cms/factory')
            const locales = ['en.json', 'fi.json', 'sv.json']
            for (const file of locales) {
              copyFile(
                path.join(factoryDir, 'locales', file),
                path.join(rootDir, 'src/i18n/locales', file),
              )
            }
            const tenant = path.join(factoryDir, 'blixx-gaming.json')
            copyFile(tenant, path.join(rootDir, 'src/cms/seed/blixx-gaming.json'))
            copyFile(tenant, path.join(rootDir, 'cms/data/blixx-gaming.json'))
            copyFile(tenant, path.join(rootDir, 'public/cms/blixx-gaming.json'))

            sendJson(res, 200, { ok: true })
          } catch (err) {
            sendJson(res, 500, {
              ok: false,
              error: err instanceof Error ? err.message : 'Restore failed',
            })
          }
          return
        }

        if (url === '/api/cms/upload' && req.method === 'POST') {
          void (async () => {
            try {
              const secret =
                process.env.CMS_UPLOAD_SECRET || process.env.VITE_CMS_UPLOAD_SECRET || 'blixx'
              const auth = req.headers['x-cms-upload-secret']
              if (auth !== secret) {
                sendJson(res, 401, { ok: false, error: 'Unauthorized' })
                return
              }

              const raw = await readBody(req)
              const contentType = req.headers['content-type'] ?? ''
              const request = new Request('http://localhost/api/cms/upload', {
                method: 'POST',
                headers: { 'content-type': contentType },
                body: raw,
              })
              const form = await request.formData()
              const file = form.get('file')
              const kindRaw = String(form.get('kind') ?? '')
              const tenantId = String(form.get('tenantId') ?? 'blixx-gaming')
              const brand = String(form.get('brand') ?? 'shared')
              const slot = String(form.get('slot') ?? 'asset')

              if (!(file instanceof File)) {
                sendJson(res, 400, { ok: false, error: 'Missing file field' })
                return
              }

              const mime = file.type || 'application/octet-stream'
              const bytes = file.size
              const checked = validateUploadMeta({ kind: kindRaw, mime, bytes })
              if (!checked.ok) {
                sendJson(res, 400, { ok: false, error: checked.error })
                return
              }

              const ext = extForMime(mime)
              const id = randomUUID()
              const key = `${tenantId}/${checked.kind}/${brand}/${slot}/${id}.${ext}`
              const uploadsRoot = path.join(rootDir, 'public/cms/uploads')
              const target = path.join(uploadsRoot, key)
              fs.mkdirSync(path.dirname(target), { recursive: true })
              const buf = Buffer.from(await file.arrayBuffer())
              fs.writeFileSync(target, buf)

              sendJson(res, 200, {
                ok: true,
                url: `/cms/uploads/${key}`,
                key,
                contentType: mime,
                bytes,
              })
            } catch (err) {
              sendJson(res, 500, {
                ok: false,
                error: err instanceof Error ? err.message : 'Upload failed',
              })
            }
          })()
          return
        }

        if (req.method !== 'POST' || url !== '/__cms/publish') {
          next()
          return
        }

        void (async () => {
          try {
            const body = JSON.parse(
              (await readBody(req)).toString('utf8'),
            ) as CmsPublishPayload

            const localesDir = path.join(rootDir, 'src/i18n/locales')
            const factoryLocales = path.join(
              rootDir,
              'src/cms/factory/locales',
            )
            fs.mkdirSync(localesDir, { recursive: true })

            for (const [filename, data] of Object.entries(body.locales ?? {})) {
              if (!/^[a-z]{2}\.json$/.test(filename)) continue
              const target = path.join(localesDir, filename)
              const factoryFile = path.join(factoryLocales, filename)

              let base: Record<string, unknown> = {}
              if (fs.existsSync(factoryFile)) {
                base = JSON.parse(
                  fs.readFileSync(factoryFile, 'utf8'),
                ) as Record<string, unknown>
              }
              if (fs.existsSync(target)) {
                base = deepMerge(
                  base,
                  JSON.parse(fs.readFileSync(target, 'utf8')) as Record<
                    string,
                    unknown
                  >,
                )
              }
              const merged = deepMerge(
                base,
                (data ?? {}) as Record<string, unknown>,
              )
              writeJson(target, merged)
            }

            if (body.tenantDocument) {
              writeJson(
                path.join(rootDir, 'cms/data/blixx-gaming.json'),
                body.tenantDocument,
              )
              writeJson(
                path.join(rootDir, 'public/cms/blixx-gaming.json'),
                body.tenantDocument,
              )
              writeJson(
                path.join(rootDir, 'src/cms/seed/blixx-gaming.json'),
                body.tenantDocument,
              )
            }

            sendJson(res, 200, { ok: true })
          } catch (err) {
            sendJson(res, 500, {
              ok: false,
              error: err instanceof Error ? err.message : 'Publish failed',
            })
          }
        })()
      })
    },
  }
}
