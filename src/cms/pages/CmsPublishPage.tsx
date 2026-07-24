import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Cloud, CloudOff, User } from 'lucide-react'
import { useCmsStore } from '@/cms/CmsProvider'
import { useAuth } from '@/lib/auth'
import {
  downloadLocaleBundle,
  downloadTextFile,
  publishLocales,
  publishTokenCss,
} from '@/cms/lib/publish'
import { publishToDisk } from '@/cms/lib/applyPublish'
import {
  isSupabaseConfigured,
  syncAllToSupabase,
  syncTextContent,
  logPublish,
  fetchPublishLogs,
  type PublishLogEntry,
} from '@/lib/db'
import { brands } from '@/brands/types'
import { brandLabels } from '@/brands/types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export function CmsPublishPage() {
  const { doc, context, saveDraftNow, dirty } = useCmsStore()
  const { user } = useAuth()
  const [previewName, setPreviewName] = useState<string | null>(null)
  const [status, setStatus] = useState<string | null>(null)
  const [publishing, setPublishing] = useState(false)
  const [logs, setLogs] = useState<PublishLogEntry[]>([])

  const loadLogs = useCallback(async () => {
    if (!isSupabaseConfigured) return
    const data = await fetchPublishLogs(doc.tenantId)
    setLogs(data)
  }, [doc.tenantId])

  useEffect(() => {
    void loadLogs()
  }, [loadLogs])

  const files = useMemo(
    () => publishLocales(doc, { brand: context.brand }),
    [doc, context.brand],
  )

  const preview = files.find((f) => f.filename === previewName) ?? files[0]

  const tokenCss =
    context.brand !== null
      ? publishTokenCss(
          doc,
          context.brand,
          context.theme,
          context.colorMode,
        )
      : null

  async function handlePublish() {
    setPublishing(true)
    setStatus(null)
    saveDraftNow()

    const results: string[] = []
    const errors: string[] = []

    // 1. Apply to running site (i18next)
    const diskResult = await publishToDisk(doc)
    if (diskResult.ok) {
      results.push('Applied to site')
    }

    // 2. Sync to Supabase if configured
    if (isSupabaseConfigured) {
      // Sync games, promos, assets
      const games = doc.games ?? []
      const promos = doc.promos ?? []
      const assets = doc.assets ?? []

      const dataResult = await syncAllToSupabase(games, promos, assets, doc.tenantId)
      if (dataResult.ok) {
        results.push(`${games.length} games, ${promos.length} promos, ${assets.length} assets`)
      } else {
        errors.push(...dataResult.errors)
      }

      // Sync text content
      const textResult = await syncTextContent(
        doc.messageLayers,
        doc.tokenLayers,
        doc.tenantId,
      )
      if (textResult.ok) {
        const msgCount = doc.messageLayers.reduce(
          (sum, layer) => sum + Object.keys(layer.messages).length,
          0,
        )
        results.push(`${msgCount} text strings`)
      } else if (textResult.error) {
        errors.push(textResult.error)
      }
    }

    // Log the publish
    if (isSupabaseConfigured && errors.length === 0) {
      const games = doc.games ?? []
      const promos = doc.promos ?? []
      const assets = doc.assets ?? []
      const msgCount = doc.messageLayers.reduce(
        (sum, layer) => sum + Object.keys(layer.messages).length,
        0,
      )
      const tokenCount = doc.tokenLayers.reduce(
        (sum, layer) => sum + Object.keys(layer.tokens).length,
        0,
      )

      await logPublish(
        doc.tenantId,
        {
          games: games.length,
          promos: promos.length,
          assets: assets.length,
          messages: msgCount,
          tokens: tokenCount,
        },
        user?.email,
      )

      // Refresh logs
      void loadLogs()
    }

    setPublishing(false)

    if (errors.length > 0) {
      setStatus(`Published with errors: ${errors.join('; ')}`)
    } else if (isSupabaseConfigured) {
      setStatus(`Published: ${results.join(', ')}. All visitors will see this content.`)
    } else {
      setStatus('Published locally. Configure Supabase for shared persistence.')
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Publish</h1>
        <p className="mt-1 max-w-2xl text-sm text-foreground/70">
          Push your changes live. All content will be saved to the database and
          visible to all visitors.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            {isSupabaseConfigured ? (
              <Cloud className="size-4 text-primary" />
            ) : (
              <CloudOff className="size-4 text-foreground/40" />
            )}
            Publish to live site
          </CardTitle>
          <CardDescription>
            {isSupabaseConfigured
              ? 'Save all content to the database. All visitors will see this content.'
              : 'Supabase not configured — changes will only apply locally. Add credentials to .env for shared persistence.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-2 text-sm">
            <Badge variant="outline">{(doc.games ?? []).length} games</Badge>
            <Badge variant="outline">{(doc.promos ?? []).length} promos</Badge>
            <Badge variant="outline">{(doc.assets ?? []).length} assets</Badge>
            <Badge variant="outline">{doc.messageLayers.length} message layers</Badge>
            <Badge variant="outline">{doc.tokenLayers.length} token layers</Badge>
          </div>

          <Button
            type="button"
            size="lg"
            disabled={publishing}
            onClick={() => void handlePublish()}
          >
            {publishing ? 'Publishing…' : 'Publish now'}
          </Button>

          {dirty && (
            <Badge variant="warning" className="w-fit">
              Unsaved edits will be saved first
            </Badge>
          )}

          {status && (
            <p className="rounded-xl bg-background-subtle px-3 py-2 text-sm text-foreground/80">
              {status}
            </p>
          )}

          <p className="text-xs text-foreground/55">
            After publish, open the{' '}
            <Link to="/" className="text-primary underline">
              casino site
            </Link>{' '}
            to verify changes.
            {!isSupabaseConfigured && (
              <> Create a <code className="text-xs">.env</code> file for database sync.</>
            )}
          </p>
        </CardContent>
      </Card>

      {isSupabaseConfigured && logs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Publish history</CardTitle>
            <CardDescription>
              Recent publishes to the live site
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              {logs.slice(0, 10).map((log) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between gap-4 rounded-lg border border-border-muted bg-background-subtle px-3 py-2 text-sm"
                >
                  <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="text-foreground/80">{log.summary}</span>
                    {log.published_by && (
                      <span className="flex items-center gap-1 text-xs text-foreground/50">
                        <User className="size-3" />
                        {log.published_by}
                      </span>
                    )}
                  </div>
                  <span className="shrink-0 text-xs text-foreground/50">
                    {new Date(log.published_at).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Export (optional)</CardTitle>
          <CardDescription>
            Download JSON for git commits, CI, or environments without the
            local write API (e.g. Cloudflare Pages preview)
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => downloadLocaleBundle(files)}
            >
              Download bundle JSON
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                for (const file of files.filter((f) => f.brand === 'shared')) {
                  downloadTextFile(file.filename, file.json)
                }
              }}
            >
              Download shared locales
            </Button>
            {context.brand ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  for (const file of files.filter(
                    (f) => f.brand === context.brand,
                  )) {
                    downloadTextFile(
                      file.filename.replace(`${context.brand}/`, ''),
                      file.json,
                    )
                  }
                }}
              >
                Download {brandLabels[context.brand]} locales
              </Button>
            ) : null}
          </div>

          <div className="flex flex-wrap gap-1.5">
            {files.slice(0, 12).map((f) => (
              <button
                key={f.filename}
                type="button"
                onClick={() => setPreviewName(f.filename)}
                className="rounded-lg"
              >
                <Badge
                  variant={
                    preview?.filename === f.filename ? 'default' : 'outline'
                  }
                >
                  {f.filename}
                </Badge>
              </button>
            ))}
            {files.length > 12 ? (
              <Badge variant="secondary">+{files.length - 12} more</Badge>
            ) : null}
          </div>

          {preview ? (
            <pre className="max-h-80 overflow-auto rounded-xl bg-background-subtle p-3 font-mono text-xs whitespace-pre-wrap">
              {preview.json}
            </pre>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Token CSS export</CardTitle>
          <CardDescription>
            {context.brand
              ? `${brandLabels[context.brand]} · ${context.theme} · ${context.colorMode}`
              : 'Select a brand in the context bar to export token CSS'}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {tokenCss ? (
            <>
              <Button
                type="button"
                size="sm"
                className="w-fit"
                variant="outline"
                onClick={() =>
                  downloadTextFile(
                    `${context.brand}-${context.theme}-${context.colorMode}.css`,
                    tokenCss,
                    'text/css',
                  )
                }
              >
                Download CSS
              </Button>
              <pre className="max-h-48 overflow-auto rounded-xl bg-background-subtle p-3 font-mono text-xs whitespace-pre-wrap">
                {tokenCss}
              </pre>
            </>
          ) : (
            <p className="text-sm text-foreground/60">
              Brands available: {brands.map((b) => brandLabels[b]).join(', ')}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
