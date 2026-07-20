import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { deepMerge } from '@/cms/lib/merge'
import factoryFi from '@/cms/factory/locales/fi.json'
import factoryEn from '@/cms/factory/locales/en.json'
import factorySv from '@/cms/factory/locales/sv.json'
import fi from './locales/fi.json'
import en from './locales/en.json'
import sv from './locales/sv.json'

/** Live locales overlay immutable factory defaults so missing keys never show raw. */
const enMerged = deepMerge(
  factoryEn as Record<string, unknown>,
  en as Record<string, unknown>,
)
const fiMerged = deepMerge(
  factoryFi as Record<string, unknown>,
  fi as Record<string, unknown>,
)
const svMerged = deepMerge(
  factorySv as Record<string, unknown>,
  sv as Record<string, unknown>,
)

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      fi: { translation: fiMerged },
      en: { translation: enMerged },
      sv: { translation: svMerged },
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
