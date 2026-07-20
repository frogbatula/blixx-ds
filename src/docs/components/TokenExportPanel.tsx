import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Check, Copy, Download } from 'lucide-react'
import { usePreferences } from '@/app/PreferencesProvider'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  copyToClipboard,
  downloadTokensFile,
  exportFormats,
  formatTokens,
  type ExportFormat,
} from '@/docs/exportTokens'
import type { ResolvedToken } from '@/docs/readTokens'

export function TokenExportPanel({ tokens }: { tokens: ResolvedToken[] }) {
  const { t } = useTranslation()
  const { brand, theme, colorMode } = usePreferences()
  const [format, setFormat] = useState<ExportFormat>('css')
  const [copied, setCopied] = useState(false)

  const meta = useMemo(
    () => ({ brand, theme, colorMode }),
    [brand, theme, colorMode],
  )

  const content = useMemo(
    () => formatTokens(tokens, format, meta),
    [tokens, format, meta],
  )

  async function handleCopy() {
    await copyToClipboard(content)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border-muted bg-card p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="export-format">{t('docs.exportFormat')}</Label>
          <select
            id="export-format"
            value={format}
            onChange={(e) => setFormat(e.target.value as ExportFormat)}
            className="h-9 rounded-xl border border-input-border bg-input px-2.5 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {exportFormats.map((f) => (
              <option key={f.id} value={f.id}>
                {f.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="secondary" size="sm" onClick={handleCopy}>
            {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
            {copied ? t('docs.copied') : t('docs.copy')}
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={() => downloadTokensFile(content, format, meta)}
          >
            <Download className="size-4" />
            {t('docs.download')}
          </Button>
        </div>
      </div>
      <pre className="max-h-72 overflow-auto rounded-xl bg-background-subtle p-3 font-mono text-xs text-foreground/90 whitespace-pre-wrap">
        {content}
      </pre>
      <p className="text-xs text-foreground/55">
        {t('docs.exportHint', {
          brand,
          theme,
          colorMode,
        })}
      </p>
    </div>
  )
}
