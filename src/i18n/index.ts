import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import fi from './locales/fi.json'
import en from './locales/en.json'
import sv from './locales/sv.json'

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      fi: { translation: fi },
      en: { translation: en },
      sv: { translation: sv },
    },
    lng: 'en',
    fallbackLng: 'en',
    supportedLngs: ['fi', 'en', 'sv'],
    interpolation: { escapeValue: false },
    detection: {
      order: [],
      caches: [],
    },
  })

export default i18n

/** Map BCP-47 locale to i18n language code */
export function localeToLng(locale: string): string {
  return locale.split('-')[0] ?? 'en'
}
