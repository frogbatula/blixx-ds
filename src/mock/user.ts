export type MockUser = {
  displayName: string
  balance: number
}

export const mockUser: MockUser = {
  displayName: 'Player',
  balance: 1250.5,
}

export const countryCurrency: Record<string, string> = {
  FI: 'EUR',
  SE: 'SEK',
  GB: 'GBP',
}
