import { useState, type KeyboardEvent, type MouseEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/app/AuthProvider'
import { playPath } from '@/mock/gameCatalog'

const gameTileVariants = cva(
  'group relative block w-full overflow-hidden rounded-xl border bg-card text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
  {
    variants: {
      variant: {
        default: 'border-border-muted bg-card',
        selected:
          'border-primary bg-background-subtle shadow-[0_0_0_1px_rgb(255_31_179/0.35)]',
        disabled: 'border-border-muted bg-background-subtle opacity-60',
      },
    },
    defaultVariants: { variant: 'default' },
  },
)

const gameTileAspectVariants = cva('relative w-full overflow-hidden', {
  variants: {
    aspect: {
      /** Standard lobby thumbnail (current default). */
      '4/3': 'aspect-[4/3]',
      /** Portrait of the standard 4:3. */
      '3/4': 'aspect-[3/4]',
      /** Wide landscape. */
      '16/9': 'aspect-[16/9]',
      /** Tall / portrait 16:9. */
      '9/16': 'aspect-[9/16]',
      /** Square. */
      '1/1': 'aspect-square',
    },
  },
  defaultVariants: { aspect: '4/3' },
})

export type GameTileAspect = NonNullable<
  VariantProps<typeof gameTileAspectVariants>['aspect']
>

export type GameTileProps = VariantProps<typeof gameTileVariants> & {
  gameId?: string
  label: string
  subtitle?: string
  imageSrc?: string
  imageAlt?: string
  /** Thumbnail frame ratio. Defaults to `4/3`. */
  aspect?: GameTileAspect
  disabled?: boolean
  className?: string
}

function GameTile({
  className,
  variant,
  aspect = '4/3',
  gameId,
  label,
  subtitle,
  imageSrc,
  imageAlt,
  disabled,
}: GameTileProps) {
  const { t } = useTranslation()
  const { isLoggedIn, login } = useAuth()
  const navigate = useNavigate()
  const [pinned, setPinned] = useState(false)
  const resolvedVariant = disabled ? 'disabled' : variant
  const showActions = Boolean(gameId) && !disabled
  const frameClass = gameTileAspectVariants({ aspect })

  const launch = (mode: 'demo' | 'real') => {
    if (!gameId) return
    if (mode === 'real' && !isLoggedIn) {
      login()
    }
    navigate(playPath(gameId, mode), {
      state: { label, subtitle, imageSrc },
    })
  }

  const onTileActivate = (event: MouseEvent | KeyboardEvent) => {
    if (!showActions) return
    // Toggle overlay on touch / non-hover pointers so actions stay reachable.
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(hover: none)').matches
    ) {
      event.preventDefault()
      setPinned((v) => !v)
    }
  }

  return (
    <article
      data-slot="game-tile"
      data-aspect={aspect}
      data-active={pinned || undefined}
      className={cn(gameTileVariants({ variant: resolvedVariant }), className)}
      onClick={onTileActivate}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onTileActivate(e)
      }}
      tabIndex={showActions ? 0 : undefined}
      aria-label={label}
    >
      {imageSrc ? (
        <div className={cn(frameClass, 'bg-background-subtle')}>
          <img
            src={imageSrc}
            alt={imageAlt ?? label}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/90 to-transparent p-3">
            <span className="block text-sm font-semibold">{label}</span>
            {subtitle ? (
              <span className="block text-xs text-foreground/70">{subtitle}</span>
            ) : null}
          </div>
        </div>
      ) : (
        <div className={cn(frameClass, 'flex items-start justify-between gap-4 p-4')}>
          <div className="flex flex-col gap-1">
            <span className="text-sm font-semibold">{label}</span>
            {subtitle ? (
              <span className="text-xs text-foreground/70">{subtitle}</span>
            ) : null}
          </div>
          <div
            aria-hidden
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-background-subtle text-xs font-semibold text-foreground/70"
          >
            Tile
          </div>
        </div>
      )}

      {showActions ? (
        <div
          className={cn(
            'absolute inset-0 z-10 flex flex-col items-stretch justify-center gap-2 bg-background/80 p-3 backdrop-blur-[2px]',
            'transition-[opacity,visibility] duration-400 ease-in',
            'motion-reduce:transition-none',
            'opacity-0 invisible pointer-events-none',
            'group-hover:opacity-100 group-hover:visible group-hover:pointer-events-auto',
            'group-focus-within:opacity-100 group-focus-within:visible group-focus-within:pointer-events-auto',
            pinned && 'opacity-100 visible pointer-events-auto',
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <p className="mb-1 truncate text-center text-xs font-semibold text-foreground">
            {label}
          </p>
          <Button
            type="button"
            size="sm"
            variant="secondary"
            className="w-full"
            onClick={() => launch('demo')}
          >
            {t('game.tile.demo')}
          </Button>
          <Button
            type="button"
            size="sm"
            variant="primary"
            className="w-full"
            onClick={() => launch('real')}
          >
            {isLoggedIn ? t('game.tile.playReal') : t('game.tile.loginToPlay')}
          </Button>
        </div>
      ) : null}
    </article>
  )
}

export { GameTile, gameTileVariants, gameTileAspectVariants }
