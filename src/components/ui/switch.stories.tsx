import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

const meta = {
  title: 'UI/Switch',
  component: Switch,
  tags: ['autodocs'],
} satisfies Meta<typeof Switch>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => {
    const [checked, setChecked] = useState(true)

    return (
      <div className="flex items-center gap-3">
        <Switch checked={checked} onCheckedChange={setChecked} />
        <Label>Enable feature</Label>
      </div>
    )
  },
}

export const Disabled: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Switch checked disabled />
      <Label>Disabled</Label>
    </div>
  ),
}

