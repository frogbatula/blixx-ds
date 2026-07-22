import {
  Home,
  Dices,
  Video,
  Trophy,
  Gift,
  User,
  LogIn,
  Plus,
  type LucideIcon,
} from 'lucide-react'

export type IconSlotId =
  | 'nav.welcome'
  | 'nav.casino'
  | 'nav.live'
  | 'nav.sports'
  | 'nav.promotions'
  | 'nav.profile'
  | 'header.account'
  | 'header.login'
  | 'header.deposit'

export type IconSlotDef = {
  id: IconSlotId
  label: string
  lucide: LucideIcon
}

export const iconSlots: IconSlotDef[] = [
  { id: 'nav.welcome', label: 'Nav · Welcome', lucide: Home },
  { id: 'nav.casino', label: 'Nav · Games', lucide: Dices },
  { id: 'nav.live', label: 'Nav · Live Casino', lucide: Video },
  { id: 'nav.sports', label: 'Nav · Sports', lucide: Trophy },
  { id: 'nav.promotions', label: 'Nav · Promotions', lucide: Gift },
  { id: 'nav.profile', label: 'Nav · Profile', lucide: User },
  { id: 'header.account', label: 'Header · Account', lucide: User },
  { id: 'header.login', label: 'Header · Log in', lucide: LogIn },
  { id: 'header.deposit', label: 'Header · Deposit', lucide: Plus },
]

export const iconSlotById = Object.fromEntries(
  iconSlots.map((s) => [s.id, s]),
) as Record<IconSlotId, IconSlotDef>

export function isIconSlotId(value: string): value is IconSlotId {
  return value in iconSlotById
}
