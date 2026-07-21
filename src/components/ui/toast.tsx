import { Toaster as SonnerToaster, toast } from 'sonner'

import type { ComponentProps } from 'react'

function Toaster(props: ComponentProps<typeof SonnerToaster>) {
  return (
    <SonnerToaster
      richColors
      position="top-right"
      closeButton
      {...props}
    />
  )
}

export { Toaster, toast }

