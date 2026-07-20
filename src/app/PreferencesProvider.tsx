import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  STORAGE_KEY,
  brandLabels,
  brands,
  colorModes,
  countries,
  countryLocaleDefaults,
  locales,
  themes,
  type Brand,
  type ColorMode,
  type Country,
  type Locale,
  type Theme,
} from '@/brands/types'

export type Preferences = {
  brand: Brand
  theme: Theme
  colorMode: ColorMode
  country: Country
  locale: Locale
}

type PreferencesContextValue = Preferences & {
  setBrand: (brand: Brand) => void
  setTheme: (theme: Theme) => void
  setColorMode: (mode: ColorMode) => void
  setCountry: (country: Country) => void
  setLocale: (locale: Locale) => void
  brandLabel: string
}

const defaults: Preferences = {
  brand: 'kanuuna',
  theme: 'default',
  colorMode: 'dark',
  country: 'FI',
  locale: 'fi-FI',
}

function isBrand(v: unknown): v is Brand {
  return typeof v === 'string' && (brands as readonly string[]).includes(v)
}
function isTheme(v: unknown): v is Theme {
  return typeof v === 'string' && (themes as readonly string[]).includes(v)
}
function isColorMode(v: unknown): v is ColorMode {
  return typeof v === 'string' && (colorModes as readonly string[]).includes(v)
}
function isCountry(v: unknown): v is Country {
  return typeof v === 'string' && (countries as readonly string[]).includes(v)
}
function isLocale(v: unknown): v is Locale {
  return typeof v === 'string' && (locales as readonly string[]).includes(v)
}

function loadPreferences(): Preferences {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaults
    const parsed = JSON.parse(raw) as Partial<Preferences>
    return {
      brand: isBrand(parsed.brand) ? parsed.brand : defaults.brand,
      theme: isTheme(parsed.theme) ? parsed.theme : defaults.theme,
      colorMode: isColorMode(parsed.colorMode)
        ? parsed.colorMode
        : defaults.colorMode,
      country: isCountry(parsed.country) ? parsed.country : defaults.country,
      locale: isLocale(parsed.locale) ? parsed.locale : defaults.locale,
    }
  } catch {
    return defaults
  }
}

const PreferencesContext = createContext<PreferencesContextValue | null>(null)

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [prefs, setPrefs] = useState<Preferences>(defaults)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setPrefs(loadPreferences())
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs))
  }, [prefs, hydrated])

  useEffect(() => {
    const root = document.documentElement
    root.dataset.brand = prefs.brand
    root.dataset.theme = prefs.theme
    root.classList.remove('light', 'dark')
    root.classList.add(prefs.colorMode)
  }, [prefs.brand, prefs.theme, prefs.colorMode])

  const setBrand = useCallback((brand: Brand) => {
    setPrefs((p) => ({ ...p, brand }))
  }, [])

  const setTheme = useCallback((theme: Theme) => {
    setPrefs((p) => ({ ...p, theme }))
  }, [])

  const setColorMode = useCallback((colorMode: ColorMode) => {
    setPrefs((p) => ({ ...p, colorMode }))
  }, [])

  const setCountry = useCallback((country: Country) => {
    setPrefs((p) => ({
      ...p,
      country,
      locale: countryLocaleDefaults[country],
    }))
  }, [])

  const setLocale = useCallback((locale: Locale) => {
    setPrefs((p) => ({ ...p, locale }))
  }, [])

  const value = useMemo<PreferencesContextValue>(
    () => ({
      ...prefs,
      setBrand,
      setTheme,
      setColorMode,
      setCountry,
      setLocale,
      brandLabel: brandLabels[prefs.brand],
    }),
    [prefs, setBrand, setTheme, setColorMode, setCountry, setLocale],
  )

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  )
}

export function usePreferences() {
  const ctx = useContext(PreferencesContext)
  if (!ctx) {
    throw new Error('usePreferences must be used within PreferencesProvider')
  }
  return ctx
}
