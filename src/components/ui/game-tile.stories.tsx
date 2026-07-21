import type { Meta, StoryObj } from '@storybook/react-vite'
import { GameTile } from '@/components/ui/game-tile'

const meta = {
  title: 'UI/GameTile',
  tags: ['autodocs'],
  args: {},
} satisfies Meta

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <GameTile label="Slots" subtitle="Fast spins" />
      <GameTile label="Live Tables" subtitle="Live dealers" variant="selected" />
      <GameTile label="Jackpots" subtitle="Big wins" disabled />
    </div>
  ),
}

