import { allTokenDefs, type TokenDef } from '@/docs/tokenCatalog'

export type ResolvedToken = TokenDef & {
  value: string
}

/** Read live computed token values from the document root. */
export function readResolvedTokens(
  root: HTMLElement = document.documentElement,
): ResolvedToken[] {
  const styles = getComputedStyle(root)
  return allTokenDefs.map((token) => ({
    ...token,
    value: styles.getPropertyValue(token.cssVar).trim() || '—',
  }))
}

export function tokensToRecord(tokens: ResolvedToken[]): Record<string, string> {
  return Object.fromEntries(tokens.map((t) => [t.name, t.value]))
}
