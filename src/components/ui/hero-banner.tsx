import type { ComponentProps, ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const heroBannerVariants = cva(
  'relative isolate overflow-hidden rounded-xl border border-border-muted',
  {
    variants: {
      size: {
        sm: 'min-h-40',
        md: 'min-h-52 xl:min-h-64',
        lg: 'min-h-64 xl:min-h-80',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
)

const heroBannerPadding = cva('relative z-10 flex h-full flex-col justify-end gap-3', {
  variants: {
    size: {
      sm: 'px-4 py-5 xl:px-5',
      md: 'px-5 py-6 xl:px-8 xl:py-8',
      lg: 'px-6 py-8 xl:px-10 xl:py-10',
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

export type HeroBannerProps = Omit<ComponentProps<'section'>, 'title'> &
  VariantProps<typeof heroBannerVariants> & {
    title: string
    description?: string
    eyebrow?: ReactNode
    imageSrc?: string
    imageAlt?: string
    actions?: ReactNode
    /** Defaults to h2; use h1 for page heroes. */
    headingLevel?: 'h1' | 'h2'
  }

function HeroBanner({
  className,
  size = 'md',
  title,
  description,
  eyebrow,
  imageSrc,
  imageAlt = '',
  actions,
  headingLevel = 'h2',
  children,
  ...props
}: HeroBannerProps) {
  const Heading = headingLevel

  return (
    <section
      data-slot="hero-banner"
      className={cn(heroBannerVariants({ size }), className)}
      {...props}
    >
      {imageSrc ? (
        <>
          <img
            src={imageSrc}
            alt={imageAlt}
            className="absolute inset-0 size-full object-cover"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/20"
          />
        </>
      ) : (
        <div
          aria-hidden
          className="absolute inset-0 bg-card"
          style={{
            backgroundImage:
              'radial-gradient(ellipse at 20% 0%, color-mix(in oklab, var(--primary) 55%, transparent) 0%, transparent 55%), radial-gradient(ellipse at 90% 80%, color-mix(in oklab, var(--secondary) 45%, transparent) 0%, transparent 45%)',
          }}
        />
      )}

      <div className={heroBannerPadding({ size })}>
        {eyebrow ? (
          <div className="flex flex-wrap items-center gap-2">{eyebrow}</div>
        ) : null}

        <Heading
          className={cn(
            'max-w-xl font-semibold tracking-tight',
            size === 'lg' && 'text-3xl xl:text-4xl',
            size === 'md' && 'text-2xl xl:text-3xl',
            size === 'sm' && 'text-xl xl:text-2xl',
          )}
        >
          {title}
        </Heading>

        {description ? (
          <p className="max-w-lg text-sm text-foreground/80 xl:text-base">
            {description}
          </p>
        ) : null}

        {actions ? (
          <div className="flex flex-wrap items-center gap-3 pt-1">{actions}</div>
        ) : null}

        {children}
      </div>
    </section>
  )
}

export { HeroBanner, heroBannerVariants }
