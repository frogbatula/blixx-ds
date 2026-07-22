import { cn } from '@/lib/utils'
import { usePreferences } from '@/app/PreferencesProvider'
import { useTenantDocument } from '@/cms/lib/useTenantDocument'
import {
  iconSlotById,
  type IconSlotId,
} from '@/icons/iconRegistry'

export type BrandIconProps = {
  slot: IconSlotId
  className?: string
  /** Accessible name when using an img override */
  title?: string
}

export function BrandIcon({ slot, className, title }: BrandIconProps) {
  const { brand } = usePreferences()
  const { doc } = useTenantDocument()
  const def = iconSlotById[slot]
  const Lucide = def.lucide

  const override = doc.assets?.find(
    (a) => a.kind === 'icon' && a.slot === slot && a.brand === brand,
  )

  if (override?.url) {
    return (
      <img
        src={override.url}
        alt={title ?? override.alt ?? def.label}
        className={cn('size-5 object-contain', className)}
        data-slot="brand-icon"
        data-icon-slot={slot}
      />
    )
  }

  return (
    <Lucide
      className={cn('size-5', className)}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      data-slot="brand-icon"
      data-icon-slot={slot}
    />
  )
}
