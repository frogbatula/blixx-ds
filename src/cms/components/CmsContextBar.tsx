import { brands, countries, locales, themes, colorModes } from '@/brands/types'
import { brandLabels } from '@/brands/types'
import { Label } from '@/components/ui/label'
import { useCmsStore } from '@/cms/CmsProvider'
import type { Brand, ColorMode, Country, Locale, Theme } from '@/brands/types'

function SelectField({
  id,
  label,
  value,
  onChange,
  options,
}: {
  id: string
  label: string
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
}) {
  return (
    <div className="flex min-w-[7rem] flex-col gap-1">
      <Label htmlFor={id} className="text-[10px] text-foreground/60 uppercase">
        {label}
      </Label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 rounded-lg border border-input-border bg-input px-2 text-xs text-foreground"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export function CmsContextBar() {
  const { context, setContext, doc } = useCmsStore()

  return (
    <div className="flex flex-wrap items-end gap-3 rounded-xl border border-border-muted bg-card p-3">
      <div className="mr-2 flex flex-col">
        <span className="text-[10px] text-foreground/60 uppercase">Tenant</span>
        <span className="text-sm font-semibold">{doc.name}</span>
      </div>
      <SelectField
        id="cms-brand"
        label="Brand"
        value={context.brand ?? 'all'}
        onChange={(v) =>
          setContext({ brand: v === 'all' ? null : (v as Brand) })
        }
        options={[
          { value: 'all', label: 'All (tenant default)' },
          ...brands.map((b) => ({ value: b, label: brandLabels[b] })),
        ]}
      />
      <SelectField
        id="cms-country"
        label="Country"
        value={context.country ?? 'all'}
        onChange={(v) =>
          setContext({ country: v === 'all' ? null : (v as Country) })
        }
        options={[
          { value: 'all', label: 'All' },
          ...countries.map((c) => ({ value: c, label: c })),
        ]}
      />
      <SelectField
        id="cms-locale"
        label="Language"
        value={context.locale}
        onChange={(v) => setContext({ locale: v as Locale })}
        options={locales.map((l) => ({ value: l, label: l }))}
      />
      <SelectField
        id="cms-theme"
        label="Theme"
        value={context.theme}
        onChange={(v) => setContext({ theme: v as Theme })}
        options={themes.map((t) => ({ value: t, label: t }))}
      />
      <SelectField
        id="cms-mode"
        label="Mode"
        value={context.colorMode}
        onChange={(v) => setContext({ colorMode: v as ColorMode })}
        options={colorModes.map((m) => ({ value: m, label: m }))}
      />
    </div>
  )
}
