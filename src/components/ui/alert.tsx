import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const alertVariants = cva(
  'relative w-full rounded-xl border px-4 py-3 text-sm [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4',
  {
    variants: {
      variant: {
        default: 'border-border-muted bg-background-subtle text-foreground',
        info: 'border-info/50 bg-info/10 text-info-foreground',
        success:
          'border-success/50 bg-success/10 text-success-foreground',
        warning:
          'border-warning/50 bg-warning/10 text-warning-foreground',
        destructive:
          'border-destructive/50 bg-destructive/10 text-destructive-foreground',
      },
    },
    defaultVariants: { variant: 'default' },
  },
)

export function Alert({ className, variant, ...props }: React.ComponentProps<'div'> & VariantProps<typeof alertVariants>) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  )
}

export const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentProps<'h5'>
>(({ className, ...props }, ref) => (
  <h5
    data-slot="alert-title"
    ref={ref}
    className={cn('mb-1 font-medium leading-none tracking-tight', className)}
    {...props}
  />
))
AlertTitle.displayName = 'AlertTitle'

export const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentProps<'div'>
>(({ className, ...props }, ref) => (
  <div
    data-slot="alert-description"
    ref={ref}
    className={cn('text-foreground/70 [&_p]:leading-relaxed', className)}
    {...props}
  />
))
AlertDescription.displayName = 'AlertDescription'

