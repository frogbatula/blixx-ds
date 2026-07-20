import { useTranslation } from 'react-i18next'
import { usePreferences } from '@/app/PreferencesProvider'
import { useAuth } from '@/app/AuthProvider'
import { brands, themes, colorModes, countries, locales } from '@/brands/types'
import { brandLabels } from '@/brands/types'
import { countryLabels, localeLabels } from '@/mock/data'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

type SelectProps = {
  id: string
  label: string
  value: string
  options: { value: string; label: string }[]
  onChange: (value: string) => void
  className?: string
}

function SelectField({
  id,
  label,
  value,
  options,
  onChange,
  className,
}: SelectProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <Label htmlFor={id} className="text-xs text-foreground/70">
        {label}
      </Label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 w-full rounded-xl border border-input-border bg-input px-2.5 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export function PocControls({ className }: { className?: string }) {
  const { t } = useTranslation()
  const {
    brand,
    theme,
    colorMode,
    country,
    locale,
    setBrand,
    setTheme,
    setColorMode,
    setCountry,
    setLocale,
  } = usePreferences()
  const { isLoggedIn, login, logout } = useAuth()

  return (
    <div className={cn('grid gap-4 sm:grid-cols-2 lg:grid-cols-3', className)}>
      <SelectField
        id="auth-mode"
        label={t('controls.auth')}
        value={isLoggedIn ? 'in' : 'out'}
        onChange={(v) => (v === 'in' ? login() : logout())}
        options={[
          { value: 'out', label: t('auth.loggedOut') },
          { value: 'in', label: t('auth.loggedIn') },
        ]}
      />
      <SelectField
        id="brand"
        label={t('controls.brand')}
        value={brand}
        onChange={(v) => setBrand(v as typeof brand)}
        options={brands.map((b) => ({ value: b, label: brandLabels[b] }))}
      />
      <SelectField
        id="theme"
        label={t('controls.theme')}
        value={theme}
        onChange={(v) => setTheme(v as typeof theme)}
        options={themes.map((th) => ({
          value: th,
          label: t(`controls.${th}`),
        }))}
      />
      <SelectField
        id="colorMode"
        label={t('controls.colorMode')}
        value={colorMode}
        onChange={(v) => setColorMode(v as typeof colorMode)}
        options={colorModes.map((m) => ({
          value: m,
          label: t(`controls.${m}`),
        }))}
      />
      <SelectField
        id="country"
        label={t('controls.country')}
        value={country}
        onChange={(v) => setCountry(v as typeof country)}
        options={countries.map((c) => ({
          value: c,
          label: countryLabels[c] ?? c,
        }))}
      />
      <SelectField
        id="locale"
        label={t('controls.language')}
        value={locale}
        onChange={(v) => setLocale(v as typeof locale)}
        options={locales.map((l) => ({
          value: l,
          label: localeLabels[l] ?? l,
        }))}
      />
    </div>
  )
}
