import * as React from 'react'
import * as SwitchPrimitive from '@radix-ui/react-switch'
import { cn } from '@/lib/utils'

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitive.Root
    ref={ref}
    data-slot="switch"
    className={cn(
      'group peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border border-input-border bg-input transition-colors',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
      'disabled:cursor-not-allowed disabled:opacity-50',
      'group-data-[state=checked]:bg-primary',
      className,
    )}
    {...props}
  >
    <SwitchPrimitive.Thumb
      data-slot="switch-thumb"
      className={cn(
        'pointer-events-none block h-5 w-5 translate-x-0 rounded-full bg-background shadow transition-transform',
        'group-data-[state=checked]:translate-x-5',
      )}
    />
  </SwitchPrimitive.Root>
))

Switch.displayName = 'Switch'

export { Switch }

