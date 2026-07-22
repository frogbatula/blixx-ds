import type { Meta, StoryObj } from '@storybook/react-vite'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider } from '@/app/AuthProvider'
import { GameTile, type GameTileAspect } from '@/components/ui/game-tile'

const meta = {
  title: 'UI/GameTile',
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <MemoryRouter>
        <AuthProvider>
          <Story />
        </AuthProvider>
      </MemoryRouter>
    ),
  ],
} satisfies Meta

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <GameTile gameId="story-slots" label="Slots" subtitle="Fast spins" />
      <GameTile
        gameId="story-live"
        label="Live Tables"
        subtitle="Live dealers"
        variant="selected"
      />
      <GameTile label="Mega Jackpot" subtitle="Coming soon" disabled />
      <GameTile
        gameId="story-image"
        label="With image"
        subtitle="HubHQ upload"
        imageSrc="https://api.dicebear.com/9.x/shapes/svg?seed=tile"
        imageAlt="Sample tile"
      />
    </div>
  ),
}

const aspects: { aspect: GameTileAspect; label: string }[] = [
  { aspect: '4/3', label: '4:3 landscape' },
  { aspect: '3/4', label: '3:4 portrait' },
  { aspect: '16/9', label: '16:9 landscape' },
  { aspect: '9/16', label: '9:16 portrait' },
  { aspect: '1/1', label: '1:1 square' },
]

export const AspectRatios: Story = {
  render: () => (
    <div className="flex flex-wrap items-end gap-4">
      {aspects.map(({ aspect, label }) => (
        <div key={aspect} className="w-36">
          <p className="mb-2 text-xs text-foreground/60">{label}</p>
          <GameTile
            gameId={`story-aspect-${aspect}`}
            aspect={aspect}
            label={aspect}
            subtitle={label}
            imageSrc={`https://api.dicebear.com/9.x/shapes/svg?seed=${aspect}`}
          />
        </div>
      ))}
    </div>
  ),
}
