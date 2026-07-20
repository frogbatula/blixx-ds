/** Flatten nested locale JSON into dotted keys. */
export function flattenMessages(
  input: unknown,
  prefix = '',
): Record<string, string> {
  const out: Record<string, string> = {}
  if (input === null || input === undefined) return out
  if (typeof input !== 'object' || Array.isArray(input)) {
    if (prefix) out[prefix] = String(input)
    return out
  }
  for (const [key, value] of Object.entries(input as Record<string, unknown>)) {
    const path = prefix ? `${prefix}.${key}` : key
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      Object.assign(out, flattenMessages(value, path))
    } else {
      out[path] = String(value ?? '')
    }
  }
  return out
}

/** Nest dotted keys back into a plain object tree. */
export function nestMessages(
  flat: Record<string, string>,
): Record<string, unknown> {
  const root: Record<string, unknown> = {}
  for (const [path, value] of Object.entries(flat)) {
    const parts = path.split('.')
    let cursor: Record<string, unknown> = root
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i]!
      if (i === parts.length - 1) {
        cursor[part] = value
      } else {
        const next = cursor[part]
        if (
          next === undefined ||
          typeof next !== 'object' ||
          next === null ||
          Array.isArray(next)
        ) {
          cursor[part] = {}
        }
        cursor = cursor[part] as Record<string, unknown>
      }
    }
  }
  return root
}

export function listMessageKeys(flat: Record<string, string>): string[] {
  return Object.keys(flat).sort()
}
