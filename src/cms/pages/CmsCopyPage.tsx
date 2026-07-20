import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Upload } from 'lucide-react'
import { useCmsStore } from '@/cms/CmsProvider'
import {
  clearMessageOverride,
  resolveMessageEntry,
  upsertMessageOverride,
} from '@/cms/lib/resolve'
import { listMessageKeys, flattenMessages } from '@/cms/lib/flatten'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import en from '@/i18n/locales/en.json'

export function CmsCopyPage() {
  const { doc, setDoc, context, dirty, saveDraftNow } = useCmsStore()
  const [filter, setFilter] = useState('')
  const [selected, setSelected] = useState<string | null>('welcome.cta')

  const catalogKeys = useMemo(() => {
    const fromLayers = new Set<string>()
    for (const layer of doc.messageLayers) {
      for (const key of Object.keys(layer.messages)) fromLayers.add(key)
    }
    for (const key of Object.keys(flattenMessages(en))) fromLayers.add(key)
    return listMessageKeys(
      Object.fromEntries([...fromLayers].map((k) => [k, ''])),
    )
  }, [doc.messageLayers])

  const filtered = catalogKeys.filter((k) =>
    k.toLowerCase().includes(filter.toLowerCase()),
  )

  const entry = selected
    ? resolveMessageEntry(
        doc.messageLayers,
        {
          brand: context.brand,
          country: context.country,
          locale: context.locale,
        },
        selected,
      )
    : null

  const scope = {
    brand: context.brand,
    country: context.country,
    locale: context.locale,
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Copy</h1>
          <p className="mt-1 text-sm text-foreground/70">
            Edit message keys at the current scope. Save a draft, then publish
            to download flat locale files for the site.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={saveDraftNow}
            disabled={!dirty}
          >
            Save draft
          </Button>
          <Button asChild size="sm">
            <Link
              to="/cms/publish"
              onClick={() => {
                if (dirty) saveDraftNow()
              }}
            >
              <Upload className="size-4" />
              Publish locales
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,18rem)_1fr]">
        <div className="flex flex-col gap-2 rounded-xl border border-border-muted bg-card p-3">
          <Input
            placeholder="Filter keys…"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
          <ul className="max-h-[28rem] overflow-y-auto text-sm">
            {filtered.map((key) => (
              <li key={key}>
                <button
                  type="button"
                  onClick={() => setSelected(key)}
                  className={
                    selected === key
                      ? 'w-full rounded-lg bg-background-subtle px-2 py-1.5 text-left text-primary'
                      : 'w-full rounded-lg px-2 py-1.5 text-left text-foreground/80 hover:bg-background-muted'
                  }
                >
                  <span className="font-mono text-xs">{key}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-4 rounded-xl border border-border-muted bg-card p-4">
          {entry && selected ? (
            <>
              <div className="flex flex-wrap items-center gap-2">
                <code className="text-sm font-semibold">{selected}</code>
                {entry.overrideValue !== null ? (
                  <Badge variant="warning">Override at scope</Badge>
                ) : entry.inherited ? (
                  <Badge variant="info">Inherited</Badge>
                ) : (
                  <Badge variant="outline">Empty</Badge>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="copy-value">Resolved value</Label>
                <Input
                  id="copy-value"
                  value={entry.overrideValue ?? entry.value}
                  onChange={(e) => {
                    const value = e.target.value
                    setDoc((prev) => ({
                      ...prev,
                      messageLayers: upsertMessageOverride(
                        prev.messageLayers,
                        scope,
                        selected,
                        value,
                      ),
                    }))
                  }}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={entry.overrideValue === null}
                  onClick={() =>
                    setDoc((prev) => ({
                      ...prev,
                      messageLayers: clearMessageOverride(
                        prev.messageLayers,
                        scope,
                        selected,
                      ),
                    }))
                  }
                >
                  Clear override
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={saveDraftNow}
                  disabled={!dirty}
                >
                  Save draft
                </Button>
                <Button asChild size="sm">
                  <Link
                    to="/cms/publish"
                    onClick={() => {
                      if (dirty) saveDraftNow()
                    }}
                  >
                    <Upload className="size-4" />
                    Publish
                  </Link>
                </Button>
              </div>
              <p className="text-xs text-foreground/50">
                Scope: brand={String(scope.brand)} · country=
                {String(scope.country)} · locale={scope.locale}
                {entry.sourceLayerId
                  ? ` · source=${entry.sourceLayerId}`
                  : ''}
              </p>
            </>
          ) : (
            <p className="text-sm text-foreground/60">Select a key</p>
          )}
        </div>
      </div>
    </div>
  )
}
