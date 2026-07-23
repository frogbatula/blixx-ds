import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Cloud, CloudOff } from 'lucide-react'
import { useCmsStore } from '@/cms/CmsProvider'
import {
  downloadLocaleBundle,
  downloadTextFile,
  publishLocales,
  publishTokenCss,
} from '@/cms/lib/publish'
import { publishToDisk } from '@/cms/lib/applyPublish'
import { isSupabaseConfigured, syncAllToSupabase } from '@/lib/db'
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
  const [previewName, setPreviewName] = useState<string | null>(null)
  const [status, setStatus] = useState<string | null>(null)
  const [publishing, setPublishing] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [syncStatus, setSyncStatus] = useState<string | null>(null)

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
    const result = await publishToDisk(doc)
    setPublishing(false)
    if (!result.ok) {
      setStatus(`Publish failed: ${result.error ?? 'unknown error'}`)
      return
    }
    if (result.mode === 'disk') {
      setStatus(
        'Published: draft saved, site copy updated in this browser, and flat files written to src/i18n/locales/ (local dev).',
      )
    } else {
      setStatus(
        'Published in-browser: draft saved and site copy updated for this session. File overwrite needs local `npm run dev` (or a future database + CI export). Use Export below for git.',
      )
    }
  }

  async function handleSyncToSupabase() {
    setSyncing(true)
    setSyncStatus(null)
    saveDraftNow()

    const games = doc.games ?? []
    const promos = doc.promos ?? []
    const assets = doc.assets ?? []

    const result = await syncAllToSupabase(games, promos, assets, doc.tenantId)
    setSyncing(false)

    if (result.ok) {
      setSyncStatus(
        `Synced to Supabase: ${games.length} games, ${promos.length} promos, ${assets.length} assets.`,
      )
    } else {
      setSyncStatus(`Sync errors: ${result.errors.join('; ')}`)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Publish</h1>
        <p className="mt-1 max-w-2xl text-sm text-foreground/70">
          Intended production flow: save content → store (DB later) → export
          flat locale files that override{' '}
          <code className="text-xs">src/i18n/locales/</code>. This POC has no
          database yet; Publish still saves a draft, applies copy to the live
          app, and on local Vite writes those flat files to disk.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">1. Publish</CardTitle>
          <CardDescription>
            Save draft → apply to running site → write flat locale files when
            the local publish API is available
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Button
            type="button"
            size="lg"
            disabled={publishing}
            onClick={() => void handlePublish()}
          >
            {publishing ? 'Publishing…' : 'Publish now'}
          </Button>
          {dirty ? (
            <Badge variant="warning" className="w-fit">
              Unsaved edits will be saved as draft first
            </Badge>
          ) : null}
          {status ? (
            <p className="rounded-xl bg-background-subtle px-3 py-2 text-sm text-foreground/80">
              {status}
            </p>
          ) : null}
          <p className="text-xs text-foreground/55">
            After publish, open the{' '}
            <Link to="/" className="text-primary underline">
              casino site
            </Link>{' '}
            to verify strings. Restart or refresh if a bundled build still
            shows old committed files.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            {isSupabaseConfigured ? (
              <Cloud className="size-4 text-primary" />
            ) : (
              <CloudOff className="size-4 text-foreground/40" />
            )}
            2. Sync to Supabase
          </CardTitle>
          <CardDescription>
            {isSupabaseConfigured
              ? 'Push games, promos, and assets to the database so all visitors see the same content.'
              : 'Supabase not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env'}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <Button
              type="button"
              size="lg"
              disabled={!isSupabaseConfigured || syncing}
              onClick={() => void handleSyncToSupabase()}
            >
              {syncing ? 'Syncing…' : 'Sync to database'}
            </Button>
            <div className="flex gap-2 text-sm text-foreground/60">
              <Badge variant="outline">{(doc.games ?? []).length} games</Badge>
              <Badge variant="outline">{(doc.promos ?? []).length} promos</Badge>
              <Badge variant="outline">{(doc.assets ?? []).length} assets</Badge>
            </div>
          </div>
          {syncStatus && (
            <p className="rounded-xl bg-background-subtle px-3 py-2 text-sm text-foreground/80">
              {syncStatus}
            </p>
          )}
          {!isSupabaseConfigured && (
            <p className="text-xs text-foreground/55">
              Create a <code className="text-xs">.env</code> file with your
              Supabase credentials. See <code className="text-xs">.env.example</code>.
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">3. Export (optional)</CardTitle>
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
