import { useEffect, type ReactNode } from 'react'
import type { Preview, Decorator } from '@storybook/react-vite'
import '@/styles/globals.css'

function ThemeShell({
  brand,
  theme,
  colorMode,
  children,
}: {
  brand: string
  theme: string
  colorMode: string
  children: ReactNode
}) {
  useEffect(() => {
    const root = document.documentElement
    root.dataset.brand = brand
    root.dataset.theme = theme
    root.classList.remove('light', 'dark')
    root.classList.add(colorMode)
  }, [brand, theme, colorMode])

  return (
    <div className="min-h-[200px] bg-background p-6 text-foreground">
      {children}
    </div>
  )
}

const withTheme: Decorator = (Story, context) => {
  const brand = (context.globals.brand as string) ?? 'kanuuna'
  const theme = (context.globals.theme as string) ?? 'default'
  const colorMode = (context.globals.colorMode as string) ?? 'dark'

  return (
    <ThemeShell brand={brand} theme={theme} colorMode={colorMode}>
      <Story />
    </ThemeShell>
  )
}

const preview: Preview = {
  globalTypes: {
    brand: {
      description: 'Brand',
      toolbar: {
        title: 'Brand',
        icon: 'circlehollow',
        items: [
          { value: 'kanuuna', title: 'Kanuuna' },
          { value: 'lonkero', title: 'Lonkero' },
          { value: 'fyffe', title: 'Fyffe' },
        ],
        dynamicTitle: true,
      },
    },
    theme: {
      description: 'Theme scheme',
      toolbar: {
        title: 'Theme',
        icon: 'paintbrush',
        items: [
          { value: 'default', title: 'Default' },
          { value: 'alt', title: 'Alt' },
        ],
        dynamicTitle: true,
      },
    },
    colorMode: {
      description: 'Color mode',
      toolbar: {
        title: 'Mode',
        icon: 'mirror',
        items: [
          { value: 'dark', title: 'Dark' },
          { value: 'light', title: 'Light' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    brand: 'kanuuna',
    theme: 'default',
    colorMode: 'dark',
  },
  decorators: [withTheme],
  parameters: {
    layout: 'fullscreen',
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: 'todo',
    },
  },
}

export default preview
