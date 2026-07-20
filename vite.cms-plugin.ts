import type { Plugin } from 'vite'
import fs from 'node:fs'
import path from 'node:path'

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

/**
 * Local-dev CMS endpoints:
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
        if (req.url === '/__cms/restore-factory' && req.method === 'POST') {
          try {
            const factoryDir = path.join(rootDir, 'src/cms/factory')
            const locales = ['en.json', 'fi.json', 'sv.json']
            for (const file of locales) {
              copyFile(
                path.join(factoryDir, 'locales', file),
                path.join(rootDir, 'src/i18n/locales', file),
              )
            }
            const tenant = path.join(factoryDir, 'happymoney.json')
            copyFile(tenant, path.join(rootDir, 'src/cms/seed/happymoney.json'))
            copyFile(tenant, path.join(rootDir, 'cms/data/happymoney.json'))
            copyFile(tenant, path.join(rootDir, 'public/cms/happymoney.json'))

            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ ok: true }))
          } catch (err) {
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json')
            res.end(
              JSON.stringify({
                ok: false,
                error: err instanceof Error ? err.message : 'Restore failed',
              }),
            )
          }
          return
        }

        if (req.method !== 'POST' || req.url !== '/__cms/publish') {
          next()
          return
        }

        const chunks: Buffer[] = []
        req.on('data', (chunk: Buffer) => chunks.push(chunk))
        req.on('end', () => {
          try {
            const body = JSON.parse(
              Buffer.concat(chunks).toString('utf8'),
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

              // Always start from factory, then existing live, then publish overlay
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
              // Update working seed copies only — never factory/
              writeJson(
                path.join(rootDir, 'cms/data/happymoney.json'),
                body.tenantDocument,
              )
              writeJson(
                path.join(rootDir, 'public/cms/happymoney.json'),
                body.tenantDocument,
              )
              writeJson(
                path.join(rootDir, 'src/cms/seed/happymoney.json'),
                body.tenantDocument,
              )
            }

            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ ok: true }))
          } catch (err) {
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json')
            res.end(
              JSON.stringify({
                ok: false,
                error: err instanceof Error ? err.message : 'Publish failed',
              }),
            )
          }
        })
      })
    },
  }
}
