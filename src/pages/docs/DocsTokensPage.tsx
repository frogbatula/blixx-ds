import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { usePreferences } from '@/app/PreferencesProvider'
import { tokenGroups } from '@/docs/tokenCatalog'
import {
  readResolvedTokens,
  type ResolvedToken,
} from '@/docs/readTokens'
import { TokenSwatch } from '@/docs/components/TokenSwatch'
import { TokenExportPanel } from '@/docs/components/TokenExportPanel'
import { Badge } from '@/components/ui/badge'

export function DocsTokensPage() {
  const { t } = useTranslation()
  const { brand, theme, colorMode } = usePreferences()
  const [tokens, setTokens] = useState<ResolvedToken[]>([])

  useEffect(() => {
    setTokens(readResolvedTokens())
  }, [brand, theme, colorMode])

  const byName = useMemo(
    () => Object.fromEntries(tokens.map((tok) => [tok.name, tok])),
    [tokens],
  )

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center gap-2">
        <Badge>{brand}</Badge>
        <Badge variant="secondary">{theme}</Badge>
        <Badge variant="outline">{colorMode}</Badge>
        <span className="text-xs text-foreground/55">{t('docs.tokens.live')}</span>
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">{t('docs.exportTitle')}</h2>
        <p className="text-sm text-foreground/70">{t('docs.exportBody')}</p>
        <TokenExportPanel tokens={tokens} />
      </section>

      {tokenGroups.map((group) => (
        <section key={group.id} className="flex flex-col gap-3">
          <div>
            <h2 className="text-lg font-semibold">{group.label}</h2>
            <p className="text-sm text-foreground/65">{group.description}</p>
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {group.tokens.map((def) => {
              const resolved = byName[def.name]
              if (!resolved) return null
              return <TokenSwatch key={def.name} token={resolved} />
            })}
          </div>
        </section>
      ))}
    </div>
  )
}
