/**
 * Shared footer catalogue. Brand/skin overrides can swap these later
 * without changing AppFooter layout.
 */

export type FooterLink = {
  labelKey: string
  /** In-app route when set; otherwise a placeholder hash until skin pages exist. */
  to?: string
}

export type FooterLinkGroup = {
  titleKey: string
  links: FooterLink[]
}

export type FooterPaymentMethod = {
  id: string
  label: string
}

export const footerLinkGroups: FooterLinkGroup[] = [
  {
    titleKey: 'footer.groups.explore',
    links: [
      { labelKey: 'footer.links.casino', to: '/casino' },
      { labelKey: 'footer.links.live', to: '/live' },
      { labelKey: 'footer.links.sports', to: '/sports' },
      { labelKey: 'footer.links.promotions', to: '/promotions' },
      { labelKey: 'footer.links.about' },
      { labelKey: 'footer.links.payments' },
    ],
  },
  {
    titleKey: 'footer.groups.help',
    links: [
      { labelKey: 'footer.links.faq' },
      { labelKey: 'footer.links.contact' },
      { labelKey: 'footer.links.responsible' },
      { labelKey: 'footer.links.selfExclusion' },
    ],
  },
  {
    titleKey: 'footer.groups.legal',
    links: [
      { labelKey: 'footer.links.terms' },
      { labelKey: 'footer.links.privacy' },
      { labelKey: 'footer.links.cookies' },
      { labelKey: 'footer.links.complaints' },
    ],
  },
]

/** Payment options shown as labelled placeholders (logos per skin later). */
export const footerPaymentMethods: FooterPaymentMethod[] = [
  { id: 'visa', label: 'Visa' },
  { id: 'mastercard', label: 'Mastercard' },
  { id: 'zimpler', label: 'Zimpler' },
  { id: 'trustly', label: 'Trustly' },
  { id: 'swedbank', label: 'Swedbank' },
  { id: 'seb', label: 'SEB' },
  { id: 'lhv', label: 'LHV' },
  { id: 'bank', label: 'Bank transfer' },
]
