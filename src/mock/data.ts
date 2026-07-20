import { Home, Dices, Gift, User } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export type NavItem = {
  id: string
  path: string
  labelKey: string
  icon: LucideIcon
}

export const navItems: NavItem[] = [
  { id: 'welcome', path: '/', labelKey: 'nav.welcome', icon: Home },
  { id: 'casino', path: '/casino', labelKey: 'nav.casino', icon: Dices },
  {
    id: 'promotions',
    path: '/promotions',
    labelKey: 'nav.promotions',
    icon: Gift,
  },
  { id: 'profile', path: '/profile', labelKey: 'nav.profile', icon: User },
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
