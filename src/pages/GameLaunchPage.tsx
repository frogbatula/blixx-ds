import { Link, useLocation, useParams, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowLeft } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getGameById, type PlayMode } from '@/mock/gameCatalog'

type LaunchState = {
  label?: string
  subtitle?: string
  imageSrc?: string
}

function resolveMode(raw: string | null): PlayMode {
  return raw === 'real' ? 'real' : 'demo'
}

export function GameLaunchPage() {
  const { t } = useTranslation()
  const { gameId: rawId = '' } = useParams()
  const gameId = decodeURIComponent(rawId)
  const [params] = useSearchParams()
  const location = useLocation()
  const state = (location.state as LaunchState | null) ?? null
  const mode = resolveMode(params.get('mode'))
  const catalog = getGameById(gameId)

  const title = state?.label ?? catalog?.label ?? t('game.launch.unknown')
  const subtitle = state?.subtitle ?? catalog?.subtitle
  const modeLabel =
    mode === 'real' ? t('game.launch.modeReal') : t('game.launch.modeDemo')

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex shrink-0 items-center gap-3 border-b border-border-muted bg-background-subtle px-3 py-2 xl:px-4">
        <Button asChild variant="ghost" size="sm" className="shrink-0 gap-1.5 px-2">
          <Link to="/casino" aria-label={t('game.launch.back')}>
            <ArrowLeft className="size-4" />
            <span className="hidden sm:inline">{t('game.launch.back')}</span>
          </Link>
        </Button>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{title}</p>
          {subtitle ? (
            <p className="truncate text-xs text-foreground/55">{subtitle}</p>
          ) : null}
        </div>
        <Badge variant={mode === 'real' ? 'success' : 'outline'}>{modeLabel}</Badge>
      </div>

      <div className="relative min-h-0 flex-1 bg-background-muted">
        <div
          role="img"
          aria-label={t('game.launch.iframeLabel', { game: title })}
          className="absolute inset-0 flex flex-col items-center justify-center gap-3 border border-dashed border-border-muted bg-background p-6 text-center"
        >
          <p className="text-sm font-medium text-foreground/80">
            {t('game.launch.iframeTitle')}
          </p>
          <p className="max-w-sm text-xs leading-relaxed text-foreground/55">
            {t('game.launch.iframeBody', { game: title, mode: modeLabel })}
          </p>
          <code className="rounded-lg bg-background-subtle px-3 py-1.5 text-[11px] text-foreground/70">
            /play/{gameId}?mode={mode}
          </code>
        </div>
      </div>
    </div>
  )
}
