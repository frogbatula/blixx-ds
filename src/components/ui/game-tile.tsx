import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const gameTileVariants = cva(
  'relative overflow-hidden rounded-xl border bg-card p-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'border-border-muted bg-card hover:bg-background-subtle',
        selected:
          'border-primary bg-background-subtle shadow-[0_0_0_1px_rgb(255_31_179/0.35)]',
        disabled: 'border-border-muted bg-background-subtle opacity-60',
      },
    },
    defaultVariants: { variant: 'default' },
  },
)

export type GameTileProps = React.ComponentProps<'button'> &
  VariantProps<typeof gameTileVariants> & {
    label: string
    subtitle?: string
  }

function GameTile({
  className,
  variant,
  label,
  subtitle,
  disabled,
  ...props
}: GameTileProps) {
  const resolvedVariant = disabled ? 'disabled' : variant

  return (
    <button
      type="button"
      data-slot="game-tile"
      className={cn(gameTileVariants({ variant: resolvedVariant }), className)}
      disabled={disabled}
      {...props}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-sm font-semibold">{label}</span>
          {subtitle ? (
            <span className="text-xs text-foreground/70">{subtitle}</span>
          ) : null}
        </div>

        <div
          aria-hidden
          className="flex h-10 w-10 items-center justify-center rounded-lg bg-background-subtle text-xs font-semibold text-foreground/70"
        >
          Tile
        </div>
      </div>
    </button>
  )
}

export { GameTile }

