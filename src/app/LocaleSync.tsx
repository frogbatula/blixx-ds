import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { usePreferences } from '@/app/PreferencesProvider'
import { localeToLng } from '@/i18n'

/** Keep i18next language in sync with preferences locale */
export function LocaleSync() {
  const { locale } = usePreferences()
  const { i18n } = useTranslation()

  useEffect(() => {
    const lng = localeToLng(locale)
    if (i18n.language !== lng) {
      void i18n.changeLanguage(lng)
    }
    document.documentElement.lang = lng
  }, [locale, i18n])

  return null
}
