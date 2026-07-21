import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'

const meta = {
  title: 'UI/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => {
    const [checked, setChecked] = useState(true)

    return (
      <div className="flex flex-col gap-3">
        <label className="flex items-center gap-2">
          <Checkbox checked={checked} onCheckedChange={(v) => setChecked(Boolean(v))} />
          <Label>Accept terms</Label>
        </label>

        <label className="flex items-center gap-2">
          <Checkbox
            checked={false}
            onCheckedChange={(v) => setChecked(Boolean(v))}
          />
          <Label>Optional toggle</Label>
        </label>
      </div>
    )
  },
}

export const Disabled: Story = {
  render: () => {
    const [checked, setChecked] = useState(true)

    return (
      <div className="flex flex-col gap-3">
        <label className="flex items-center gap-2">
          <Checkbox
            checked={checked}
            onCheckedChange={(v) => setChecked(Boolean(v))}
            disabled
          />
          <Label>Disabled checkbox</Label>
        </label>
      </div>
    )
  },
}

