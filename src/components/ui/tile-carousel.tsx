import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ComponentProps,
  type ReactNode,
} from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export type TileCarouselProps = {
  title: string
  description?: string
  /** Optional header action (e.g. “See all” link). */
  action?: ReactNode
  children: ReactNode
  className?: string
  /** Accessible name for the scroll region; defaults to title. */
  'aria-label'?: string
}

export function TileCarousel({
  title,
  description,
  action,
  children,
  className,
  'aria-label': ariaLabel,
}: TileCarouselProps) {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(false)

  const updateScrollState = useCallback(() => {
    const el = scrollerRef.current
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    setCanPrev(el.scrollLeft > 4)
    setCanNext(el.scrollLeft < max - 4)
  }, [])

  useEffect(() => {
    const el = scrollerRef.current
    if (!el) return
    updateScrollState()
    el.addEventListener('scroll', updateScrollState, { passive: true })
    const ro = new ResizeObserver(updateScrollState)
    ro.observe(el)
    return () => {
      el.removeEventListener('scroll', updateScrollState)
      ro.disconnect()
    }
  }, [updateScrollState, children])

  const scrollByPage = (direction: -1 | 1) => {
    const el = scrollerRef.current
    if (!el) return
    const amount = Math.max(el.clientWidth * 0.75, 160)
    el.scrollBy({ left: amount * direction, behavior: 'smooth' })
  }

  return (
    <section
      data-slot="tile-carousel"
      className={cn('flex flex-col gap-3', className)}
      aria-label={ariaLabel ?? title}
    >
      <div className="flex items-end justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-base font-semibold tracking-tight xl:text-lg">
            {title}
          </h2>
          {description ? (
            <p className="mt-0.5 text-sm text-foreground/65">{description}</p>
          ) : null}
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          {action}
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-8"
            disabled={!canPrev}
            aria-label="Scroll previous"
            onClick={() => scrollByPage(-1)}
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-8"
            disabled={!canNext}
            aria-label="Scroll next"
            onClick={() => scrollByPage(1)}
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>

      <div
        ref={scrollerRef}
        className={cn(
          'flex gap-3 overflow-x-auto pb-1',
          'snap-x snap-mandatory scroll-smooth',
          '[scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
        )}
      >
        {children}
      </div>
    </section>
  )
}

/** Fixed-width snap item wrapper for carousel tiles. */
export function TileCarouselItem({
  className,
  children,
  ...props
}: ComponentProps<'div'>) {
  return (
    <div
      data-slot="tile-carousel-item"
      className={cn(
        'w-[9.5rem] shrink-0 snap-start sm:w-40 xl:w-44',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
