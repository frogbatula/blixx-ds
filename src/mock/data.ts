export type NavItem = {
  id: string
  path: string
  labelKey: string
  iconSlot:
    | 'nav.welcome'
    | 'nav.casino'
    | 'nav.live'
    | 'nav.sports'
    | 'nav.promotions'
}

export const navItems: NavItem[] = [
  { id: 'welcome', path: '/', labelKey: 'nav.welcome', iconSlot: 'nav.welcome' },
  { id: 'casino', path: '/casino', labelKey: 'nav.casino', iconSlot: 'nav.casino' },
  { id: 'live', path: '/live', labelKey: 'nav.live', iconSlot: 'nav.live' },
  { id: 'sports', path: '/sports', labelKey: 'nav.sports', iconSlot: 'nav.sports' },
  {
    id: 'promotions',
    path: '/promotions',
    labelKey: 'nav.promotions',
    iconSlot: 'nav.promotions',
  },
]

export const countryLabels: Record<string, string> = {
  FI: 'Finland',
  SE: 'Sweden',
  GB: 'United Kingdom',
}

export const localeLabels: Record<string, string> = {
  'fi-FI': 'Suomi',
  'en-GB': 'English',
  'sv-SE': 'Svenska',
}
