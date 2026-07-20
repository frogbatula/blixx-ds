export type TokenKind = 'color' | 'dimension' | 'font'

export type TokenDef = {
  name: string
  cssVar: string
  kind: TokenKind
  description?: string
}

export type TokenGroup = {
  id: string
  label: string
  description: string
  tokens: TokenDef[]
}

export const tokenGroups: TokenGroup[] = [
  {
    id: 'surfaces',
    label: 'Surfaces',
    description: 'App backdrop, page backgrounds, and elevated cards.',
    tokens: [
      { name: 'backdrop', cssVar: '--backdrop', kind: 'color' },
      { name: 'background', cssVar: '--background', kind: 'color' },
      {
        name: 'background-subtle',
        cssVar: '--background-subtle',
        kind: 'color',
      },
      {
        name: 'background-muted',
        cssVar: '--background-muted',
        kind: 'color',
      },
      {
        name: 'background-muted-strong',
        cssVar: '--background-muted-strong',
        kind: 'color',
      },
      { name: 'card', cssVar: '--card', kind: 'color' },
      { name: 'foreground', cssVar: '--foreground', kind: 'color' },
    ],
  },
  {
    id: 'brand',
    label: 'Brand',
    description: 'Primary, secondary, and tertiary interactive colours.',
    tokens: [
      { name: 'primary', cssVar: '--primary', kind: 'color' },
      { name: 'primary-hover', cssVar: '--primary-hover', kind: 'color' },
      { name: 'primary-pressed', cssVar: '--primary-pressed', kind: 'color' },
      {
        name: 'primary-foreground',
        cssVar: '--primary-foreground',
        kind: 'color',
      },
      { name: 'secondary', cssVar: '--secondary', kind: 'color' },
      { name: 'secondary-hover', cssVar: '--secondary-hover', kind: 'color' },
      {
        name: 'secondary-pressed',
        cssVar: '--secondary-pressed',
        kind: 'color',
      },
      {
        name: 'secondary-foreground',
        cssVar: '--secondary-foreground',
        kind: 'color',
      },
      { name: 'tertiary', cssVar: '--tertiary', kind: 'color' },
      { name: 'tertiary-hover', cssVar: '--tertiary-hover', kind: 'color' },
      { name: 'tertiary-pressed', cssVar: '--tertiary-pressed', kind: 'color' },
      {
        name: 'tertiary-foreground',
        cssVar: '--tertiary-foreground',
        kind: 'color',
      },
    ],
  },
  {
    id: 'semantic',
    label: 'Semantic',
    description: 'Success, info, warning, and destructive status colours.',
    tokens: [
      { name: 'success', cssVar: '--success', kind: 'color' },
      { name: 'success-hover', cssVar: '--success-hover', kind: 'color' },
      { name: 'success-pressed', cssVar: '--success-pressed', kind: 'color' },
      {
        name: 'success-foreground',
        cssVar: '--success-foreground',
        kind: 'color',
      },
      { name: 'info', cssVar: '--info', kind: 'color' },
      { name: 'info-hover', cssVar: '--info-hover', kind: 'color' },
      { name: 'info-pressed', cssVar: '--info-pressed', kind: 'color' },
      { name: 'info-foreground', cssVar: '--info-foreground', kind: 'color' },
      { name: 'warning', cssVar: '--warning', kind: 'color' },
      { name: 'warning-hover', cssVar: '--warning-hover', kind: 'color' },
      { name: 'warning-pressed', cssVar: '--warning-pressed', kind: 'color' },
      {
        name: 'warning-foreground',
        cssVar: '--warning-foreground',
        kind: 'color',
      },
      { name: 'destructive', cssVar: '--destructive', kind: 'color' },
      {
        name: 'destructive-hover',
        cssVar: '--destructive-hover',
        kind: 'color',
      },
      {
        name: 'destructive-pressed',
        cssVar: '--destructive-pressed',
        kind: 'color',
      },
      {
        name: 'destructive-foreground',
        cssVar: '--destructive-foreground',
        kind: 'color',
      },
    ],
  },
  {
    id: 'borders',
    label: 'Borders & dividers',
    description: 'Stroke colours for containers and separators.',
    tokens: [
      { name: 'divider', cssVar: '--divider', kind: 'color' },
      { name: 'border', cssVar: '--border', kind: 'color' },
      { name: 'border-muted', cssVar: '--border-muted', kind: 'color' },
      { name: 'ring', cssVar: '--ring', kind: 'color' },
    ],
  },
  {
    id: 'inputs',
    label: 'Inputs',
    description: 'Form field fill and outline tokens.',
    tokens: [
      { name: 'input', cssVar: '--input', kind: 'color' },
      { name: 'input-border', cssVar: '--input-border', kind: 'color' },
    ],
  },
  {
    id: 'nav',
    label: 'Navigation',
    description: 'Header, sidebar, and bottom-nav chrome.',
    tokens: [
      { name: 'nav', cssVar: '--nav', kind: 'color' },
      { name: 'nav-foreground', cssVar: '--nav-foreground', kind: 'color' },
      { name: 'nav-active', cssVar: '--nav-active', kind: 'color' },
    ],
  },
  {
    id: 'radius',
    label: 'Radius',
    description: 'Corner radii used across components (Figma radius/xl = 12px).',
    tokens: [
      { name: 'radius-sm', cssVar: '--radius-sm', kind: 'dimension' },
      { name: 'radius-md', cssVar: '--radius-md', kind: 'dimension' },
      { name: 'radius-lg', cssVar: '--radius-lg', kind: 'dimension' },
      { name: 'radius-xl', cssVar: '--radius-xl', kind: 'dimension' },
    ],
  },
  {
    id: 'typography',
    label: 'Typography',
    description: 'Font family stack (Inter from Figma font/family/sans).',
    tokens: [{ name: 'font-sans', cssVar: '--font-sans', kind: 'font' }],
  },
]

export const allTokenDefs: TokenDef[] = tokenGroups.flatMap((g) => g.tokens)
