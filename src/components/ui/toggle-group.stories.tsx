import type { Meta, StoryObj } from '@storybook/react-vite'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

const meta = {
  title: 'UI/ToggleGroup',
  tags: ['autodocs'],
} satisfies Meta

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (
    <ToggleGroup type="single" defaultValue="slots" variant="outline">
      <ToggleGroupItem value="slots">Slots</ToggleGroupItem>
      <ToggleGroupItem value="live">Live</ToggleGroupItem>
      <ToggleGroupItem value="table">Table</ToggleGroupItem>
    </ToggleGroup>
  ),
}

export const Multiple: Story = {
  render: () => (
    <ToggleGroup type="multiple" variant="outline">
      <ToggleGroupItem value="new">New</ToggleGroupItem>
      <ToggleGroupItem value="popular">Popular</ToggleGroupItem>
      <ToggleGroupItem value="jackpot">Jackpot</ToggleGroupItem>
    </ToggleGroup>
  ),
}
