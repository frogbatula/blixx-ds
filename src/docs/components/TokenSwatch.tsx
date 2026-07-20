import { cn } from '@/lib/utils'
import type { ResolvedToken } from '@/docs/readTokens'

export function TokenSwatch({
  token,
  className,
}: {
  token: ResolvedToken
  className?: string
}) {
  const isColor = token.kind === 'color'

  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-xl border border-border-muted bg-card px-3 py-2.5',
        className,
      )}
    >
      {isColor ? (
        <span
          className="size-10 shrink-0 rounded-lg border border-border-muted"
          style={{ background: token.value }}
          aria-hidden
        />
      ) : (
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-border-muted bg-background-subtle text-[10px] font-medium text-foreground/70">
          {token.kind === 'dimension' ? 'px' : 'Aa'}
        </span>
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{token.name}</p>
        <p className="truncate font-mono text-xs text-foreground/60">
          {token.cssVar}
        </p>
        <p className="truncate font-mono text-xs text-secondary">{token.value}</p>
      </div>
    </div>
  )
}
