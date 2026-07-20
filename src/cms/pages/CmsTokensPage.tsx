import { useMemo, useState } from 'react'
import { useCmsStore } from '@/cms/CmsProvider'
import { allTokenDefs, tokenGroups } from '@/docs/tokenCatalog'
import {
  clearTokenOverride,
  resolveTokenEntry,
  upsertTokenOverride,
} from '@/cms/lib/resolve'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'

export function CmsTokensPage() {
  const { doc, setDoc, context } = useCmsStore()
  const [selected, setSelected] = useState('primary')

  const tokenCtx = useMemo(
    () => ({
      brand: context.brand,
      theme: context.theme,
      colorMode: context.colorMode,
    }),
    [context.brand, context.theme, context.colorMode],
  )

  const entry = resolveTokenEntry(doc.tokenLayers, tokenCtx, selected)
  const def = allTokenDefs.find((t) => t.name === selected)

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Design tokens</h1>
        <p className="mt-1 text-sm text-foreground/70">
          Override semantic tokens for the current brand / theme / mode. Tenant
          defaults apply when no brand is selected.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,20rem)_1fr]">
        <div className="flex max-h-[32rem] flex-col gap-4 overflow-y-auto rounded-xl border border-border-muted bg-card p-3">
          {tokenGroups.map((group) => (
            <div key={group.id}>
              <p className="mb-1 text-xs font-medium text-foreground/50 uppercase">
                {group.label}
              </p>
              <ul className="flex flex-col gap-0.5">
                {group.tokens.map((t) => (
                  <li key={t.name}>
                    <button
                      type="button"
                      onClick={() => setSelected(t.name)}
                      className={
                        selected === t.name
                          ? 'flex w-full items-center gap-2 rounded-lg bg-background-subtle px-2 py-1.5 text-left'
                          : 'flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left hover:bg-background-muted'
                      }
                    >
                      {t.kind === 'color' ? (
                        <span
                          className="size-4 shrink-0 rounded border border-border-muted"
                          style={{
                            background:
                              resolveTokenEntry(doc.tokenLayers, tokenCtx, t.name)
                                .value || 'transparent',
                          }}
                        />
                      ) : null}
                      <span className="font-mono text-xs">{t.name}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4 rounded-xl border border-border-muted bg-card p-4">
          <div className="flex flex-wrap items-center gap-2">
            <code className="text-sm font-semibold">{selected}</code>
            {def ? <Badge variant="outline">{def.kind}</Badge> : null}
            {entry.overrideValue !== null ? (
              <Badge variant="warning">Override</Badge>
            ) : entry.inherited ? (
              <Badge variant="info">Inherited</Badge>
            ) : (
              <Badge variant="outline">Unset</Badge>
            )}
          </div>

          {def?.kind === 'color' ? (
            <div
              className="h-24 rounded-xl border border-border-muted"
              style={{ background: entry.value || 'transparent' }}
            />
          ) : null}

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="token-value">Value</Label>
            <div className="flex gap-2">
              {def?.kind === 'color' ? (
                <input
                  type="color"
                  aria-label="Colour picker"
                  className="size-10 shrink-0 cursor-pointer rounded-lg border border-input-border bg-input"
                  value={
                    entry.value?.startsWith('#') && entry.value.length >= 7
                      ? entry.value.slice(0, 7)
                      : '#000000'
                  }
                  onChange={(e) => {
                    const value = e.target.value
                    setDoc((prev) => ({
                      ...prev,
                      tokenLayers: upsertTokenOverride(
                        prev.tokenLayers,
                        tokenCtx,
                        selected,
                        value,
                      ),
                    }))
                  }}
                />
              ) : null}
              <Input
                id="token-value"
                value={entry.overrideValue ?? entry.value}
                onChange={(e) => {
                  const value = e.target.value
                  setDoc((prev) => ({
                    ...prev,
                    tokenLayers: upsertTokenOverride(
                      prev.tokenLayers,
                      tokenCtx,
                      selected,
                      value,
                    ),
                  }))
                }}
              />
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-fit"
            disabled={entry.overrideValue === null}
            onClick={() =>
              setDoc((prev) => ({
                ...prev,
                tokenLayers: clearTokenOverride(
                  prev.tokenLayers,
                  tokenCtx,
                  selected,
                ),
              }))
            }
          >
            Clear override
          </Button>

          <p className="text-xs text-foreground/50">
            Scope: brand={String(tokenCtx.brand)} · theme={tokenCtx.theme} ·
            mode={tokenCtx.colorMode}
            {entry.sourceLayerId ? ` · source=${entry.sourceLayerId}` : ''}
          </p>
        </div>
      </div>
    </div>
  )
}
