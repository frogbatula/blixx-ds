import type {
  MessageContext,
  MessageLayer,
  MessageScope,
  ResolvedMessageEntry,
  TokenContext,
  TokenLayer,
  TokenScope,
} from '@/cms/lib/types'

function scopeFieldMatches<T>(
  layerValue: T | null | undefined,
  queryValue: T | null,
): boolean {
  if (layerValue === undefined || layerValue === null) return true
  return layerValue === queryValue
}

export function messageLayerMatches(
  scope: MessageScope,
  ctx: MessageContext,
): boolean {
  return (
    scopeFieldMatches(scope.brand, ctx.brand) &&
    scopeFieldMatches(scope.country, ctx.country) &&
    scopeFieldMatches(scope.locale, ctx.locale)
  )
}

export function tokenLayerMatches(
  scope: TokenScope,
  ctx: TokenContext,
): boolean {
  return (
    scopeFieldMatches(scope.brand, ctx.brand) &&
    scopeFieldMatches(scope.theme, ctx.theme) &&
    scopeFieldMatches(scope.colorMode, ctx.colorMode)
  )
}

/** Higher = more specific (wins later in merge). */
export function messageSpecificity(scope: MessageScope): number {
  let score = 0
  if (scope.locale) score += 1
  if (scope.brand) score += 2
  if (scope.country) score += 4
  return score
}

export function tokenSpecificity(scope: TokenScope): number {
  let score = 0
  if (scope.colorMode) score += 1
  if (scope.theme) score += 2
  if (scope.brand) score += 4
  return score
}

export function resolveMessages(
  layers: MessageLayer[],
  ctx: MessageContext,
): Record<string, string> {
  const applicable = layers
    .filter((l) => messageLayerMatches(l.scope, ctx))
    .sort(
      (a, b) => messageSpecificity(a.scope) - messageSpecificity(b.scope),
    )

  const result: Record<string, string> = {}
  for (const layer of applicable) {
    Object.assign(result, layer.messages)
  }
  return result
}

export function resolveTokens(
  layers: TokenLayer[],
  ctx: TokenContext,
): Record<string, string> {
  const applicable = layers
    .filter((l) => tokenLayerMatches(l.scope, ctx))
    .sort((a, b) => tokenSpecificity(a.scope) - tokenSpecificity(b.scope))

  const result: Record<string, string> = {}
  for (const layer of applicable) {
    Object.assign(result, layer.tokens)
  }
  return result
}

/** Find the most specific matching layer for writing overrides. */
export function findExactMessageLayer(
  layers: MessageLayer[],
  scope: MessageScope,
): MessageLayer | undefined {
  return layers.find(
    (l) =>
      (l.scope.brand ?? null) === (scope.brand ?? null) &&
      (l.scope.country ?? null) === (scope.country ?? null) &&
      (l.scope.locale ?? null) === (scope.locale ?? null),
  )
}

export function findExactTokenLayer(
  layers: TokenLayer[],
  scope: TokenScope,
): TokenLayer | undefined {
  return layers.find(
    (l) =>
      (l.scope.brand ?? null) === (scope.brand ?? null) &&
      (l.scope.theme ?? null) === (scope.theme ?? null) &&
      (l.scope.colorMode ?? null) === (scope.colorMode ?? null),
  )
}

/**
 * Resolve a key showing whether the current scope has an override
 * vs an inherited value from a less-specific layer.
 */
export function resolveMessageEntry(
  layers: MessageLayer[],
  ctx: MessageContext,
  key: string,
): ResolvedMessageEntry {
  const exactScope: MessageScope = {
    brand: ctx.brand,
    country: ctx.country,
    locale: ctx.locale,
  }
  const exact = findExactMessageLayer(layers, exactScope)
  const overrideValue =
    exact && key in exact.messages ? exact.messages[key]! : null

  const applicable = layers
    .filter((l) => messageLayerMatches(l.scope, ctx))
    .sort(
      (a, b) => messageSpecificity(a.scope) - messageSpecificity(b.scope),
    )

  let value = ''
  let sourceLayerId: string | null = null
  for (const layer of applicable) {
    if (key in layer.messages) {
      value = layer.messages[key]!
      sourceLayerId = layer.id
    }
  }

  const inherited = overrideValue === null && sourceLayerId !== null

  return {
    key,
    value,
    sourceLayerId,
    inherited,
    overrideValue,
  }
}

export function resolveTokenEntry(
  layers: TokenLayer[],
  ctx: TokenContext,
  key: string,
): {
  key: string
  value: string
  sourceLayerId: string | null
  inherited: boolean
  overrideValue: string | null
} {
  const exactScope: TokenScope = {
    brand: ctx.brand,
    theme: ctx.theme,
    colorMode: ctx.colorMode,
  }
  const exact = findExactTokenLayer(layers, exactScope)
  const overrideValue =
    exact && key in exact.tokens ? exact.tokens[key]! : null

  const applicable = layers
    .filter((l) => tokenLayerMatches(l.scope, ctx))
    .sort((a, b) => tokenSpecificity(a.scope) - tokenSpecificity(b.scope))

  let value = ''
  let sourceLayerId: string | null = null
  for (const layer of applicable) {
    if (key in layer.tokens) {
      value = layer.tokens[key]!
      sourceLayerId = layer.id
    }
  }

  return {
    key,
    value,
    sourceLayerId,
    inherited: overrideValue === null && sourceLayerId !== null,
    overrideValue,
  }
}

export function upsertMessageOverride(
  layers: MessageLayer[],
  scope: MessageScope,
  key: string,
  value: string,
): MessageLayer[] {
  const existing = findExactMessageLayer(layers, scope)
  if (existing) {
    return layers.map((l) =>
      l.id === existing.id
        ? { ...l, messages: { ...l.messages, [key]: value } }
        : l,
    )
  }
  const id = `msg-${scope.brand ?? 'all'}-${scope.country ?? 'all'}-${scope.locale ?? 'all'}-${Date.now()}`
  return [
    ...layers,
    { id, scope: { ...scope }, messages: { [key]: value } },
  ]
}

export function clearMessageOverride(
  layers: MessageLayer[],
  scope: MessageScope,
  key: string,
): MessageLayer[] {
  const existing = findExactMessageLayer(layers, scope)
  if (!existing || !(key in existing.messages)) return layers
  const nextMessages = { ...existing.messages }
  delete nextMessages[key]
  if (Object.keys(nextMessages).length === 0) {
    return layers.filter((l) => l.id !== existing.id)
  }
  return layers.map((l) =>
    l.id === existing.id ? { ...l, messages: nextMessages } : l,
  )
}

export function upsertTokenOverride(
  layers: TokenLayer[],
  scope: TokenScope,
  key: string,
  value: string,
): TokenLayer[] {
  const existing = findExactTokenLayer(layers, scope)
  if (existing) {
    return layers.map((l) =>
      l.id === existing.id
        ? { ...l, tokens: { ...l.tokens, [key]: value } }
        : l,
    )
  }
  const id = `tok-${scope.brand ?? 'all'}-${scope.theme ?? 'all'}-${scope.colorMode ?? 'all'}-${Date.now()}`
  return [...layers, { id, scope: { ...scope }, tokens: { [key]: value } }]
}

export function clearTokenOverride(
  layers: TokenLayer[],
  scope: TokenScope,
  key: string,
): TokenLayer[] {
  const existing = findExactTokenLayer(layers, scope)
  if (!existing || !(key in existing.tokens)) return layers
  const nextTokens = { ...existing.tokens }
  delete nextTokens[key]
  if (Object.keys(nextTokens).length === 0) {
    return layers.filter((l) => l.id !== existing.id)
  }
  return layers.map((l) =>
    l.id === existing.id ? { ...l, tokens: nextTokens } : l,
  )
}
