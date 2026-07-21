import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const meta = {
  title: 'UI/Select',
  tags: ['autodocs'],
  args: {},
} satisfies Meta

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState('a')

    return (
      <div className="flex max-w-sm flex-col gap-2">
        <Label>Game category</Label>
        <Select value={value} onValueChange={setValue}>
          <SelectTrigger>
            <SelectValue placeholder="Choose a category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="a">Slots</SelectItem>
            <SelectItem value="b">Live Tables</SelectItem>
            <SelectItem value="c">Jackpots</SelectItem>
          </SelectContent>
        </Select>
      </div>
    )
  },
}

export const Disabled: Story = {
  render: () => (
    <div className="flex max-w-sm flex-col gap-2">
      <Label>Disabled select</Label>
      <Select value="a" disabled>
        <SelectTrigger>
          <SelectValue placeholder="Choose a category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="a">Slots</SelectItem>
          <SelectItem value="b">Live Tables</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
}

